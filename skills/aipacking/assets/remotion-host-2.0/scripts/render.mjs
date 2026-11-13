// 出片：每次生成一个新版本 out/<视频名>/final_vN.mp4，旧版本全部保留
//   node scripts/render.mjs            自动判断：第一次/全局改动/src 代码改动 → 整条渲染；只改了几页 → 只重渲染这几页再拼回上一版
//   node scripts/render.mjs --full     强制整条重新渲染
//   node scripts/render.mjs --mov      另外导出透明包装层 out/overlay_vN.mov（很大，要了才出）
//   node scripts/render.mjs --back     回到上一版：把上一版的分镜恢复到 plan/plan.json（不重新渲染）
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { resolvePlan } from '../src/lib/anchors.ts';

const args = process.argv.slice(2);
// 每条视频一个文件夹：out/<视频文件名>/final_vN.mp4，换视频不会和上一条的版本混在一起
const videoName = path.basename(JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')).meta.video || 'video').replace(/.[^.]+$/, '');
const OUT = `out/${videoName}`;
const VER = `${OUT}/versions`;
fs.mkdirSync(VER, { recursive: true });
const versions = fs.readdirSync(VER).map(f => /^v(\d+)\.plan\.json$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);
const last = versions.at(-1);

if (args.includes('--back')) {
  if (versions.length < 2) { console.log('✗ 没有更早的版本可以回退'); process.exit(1); }
  const prev = versions.at(-2);
  fs.copyFileSync(`${VER}/v${prev}.plan.json`, 'plan/plan.json');
  console.log(`✓ 分镜已恢复到 v${prev}（对应 ${OUT}/final_v${prev}.mp4，这个文件本来就在，不用重出）`);
  process.exit(0);
}

const rawPlan = JSON.parse(fs.readFileSync('plan/plan.json', 'utf8'));
const subs = JSON.parse(fs.readFileSync('plan/subs.json', 'utf8'));
const plan = resolvePlan(rawPlan, subs);
const fps = plan.meta.fps;
const N = (last || 0) + 1;
const out = `${OUT}/final_v${N}.mp4`;
const t0 = Date.now();

// 模板/定制页面的代码指纹：代码改了，分镜一样也得重出
const codeHash = (() => {
  const h = createHash('sha1');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else { h.update(p); h.update(fs.readFileSync(p)); }
  });
  walk('src');
  return h.digest('hex');
})();
const oldCode = last && fs.existsSync(`${VER}/v${last}.code.txt`) ? fs.readFileSync(`${VER}/v${last}.code.txt`, 'utf8').trim() : null;

// ---- 找出和上一版相比改了哪些页
const TR = 9; // 与 src/Main.tsx 的转场帧数一致
let ranges = null; // null = 整条渲染
const base = last && `${OUT}/final_v${last}.mp4`;
if (!args.includes('--full') && base && fs.existsSync(base) && oldCode !== codeHash) {
  console.log('模板或定制页面的代码有改动，整条重新渲染');
} else if (!args.includes('--full') && base && fs.existsSync(base)) {
  const old = resolvePlan(JSON.parse(fs.readFileSync(`${VER}/v${last}.plan.json`, 'utf8')), subs);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const global = !same(old.meta, plan.meta) || !same(old.style, plan.style) || !same(old.palette, plan.palette) || !same(old.chapters, plan.chapters) || !same(old.subtitles, plan.subtitles);
  if (!global) {
    const byId = s => new Map(s.map(x => [x.id, x]));
    const A = byId(old.scenes), B = byId(plan.scenes);
    const changed = [...new Set([...A.keys(), ...B.keys()])].filter(id => !same(A.get(id), B.get(id)));
    if (!changed.length) { console.log(`分镜和 v${last} 完全一样，不用重出。最新成片：${base}`); process.exit(0); }
    // 改动页的新旧时间段都要重渲染；前后各多留 0.5 秒 + 转场，保证和相邻页的衔接也是新的
    const touched = changed.flatMap(id => [A.get(id), B.get(id)].filter(Boolean));
    // 相邻页的转场依赖彼此（首尾相接），挨着改动页的页面也一起重渲染
    const all = [...old.scenes, ...plan.scenes];
    const near = touched.flatMap(s => all.filter(x => Math.abs(x.end - s.start) < 0.2 || Math.abs(x.start - s.end) < 0.2));
    const spans = [...touched, ...near].map(s => [s.start - 0.5, s.end + 0.5 + TR / fps]);
    const total = Math.round(plan.meta.duration * fps);
    ranges = spans.map(([a, b]) => [Math.max(0, Math.floor(a * fps)), Math.min(total - 1, Math.ceil(b * fps))]).sort((x, y) => x[0] - y[0])
      .reduce((m, r) => { const p = m.at(-1); if (p && r[0] <= p[1] + fps) p[1] = Math.max(p[1], r[1]); else m.push([...r]); return m; }, []);
    const covered = ranges.reduce((n, [a, b]) => n + b - a + 1, 0);
    if (covered > total * 0.6) ranges = null; // 改动太多，不如整条重出
    else console.log(`只改了 ${changed.join('、')}，局部重渲染 ${ranges.map(([a, b]) => `${(a / fps).toFixed(1)}–${(b / fps).toFixed(1)}s`).join('、')}，拼回 v${last}`);
  } else console.log('改动了全局设置（风格/配色/章节/字幕/视频），整条重新渲染');
}

console.log('打包中…');
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const common = { serveUrl, chromiumOptions: { gl: 'angle' }, crf: 18, pixelFormat: 'yuv420p', imageFormat: 'jpeg', jpegQuality: 90 };
let lastPct = -1;
const onProgress = label => ({ progress }) => { const p = Math.floor(progress * 20) * 5; if (p !== lastPct) { lastPct = p; console.log(`${label} ${p}%`); } };

if (!ranges) {
  const composition = await selectComposition({ serveUrl, id: 'Final', inputProps: { plan, subs, transparent: false } });
  await renderMedia({ ...common, composition, codec: 'h264', outputLocation: out, inputProps: { plan, subs, transparent: false }, onProgress: onProgress('渲染') });
} else {
  const composition = await selectComposition({ serveUrl, id: 'Final', inputProps: { plan, subs, transparent: false } });
  fs.rmSync(`${OUT}/.parts`, { recursive: true, force: true }); fs.mkdirSync(`${OUT}/.parts`, { recursive: true });
  for (const [i, r] of ranges.entries()) {
    lastPct = -1;
    await renderMedia({ ...common, composition, codec: 'h264', muted: true, frameRange: r, outputLocation: `${OUT}/.parts/seg${i}.mp4`, inputProps: { plan, subs, transparent: false }, onProgress: onProgress(`片段 ${i + 1}/${ranges.length}`) });
  }
  // 拼接：上一版的未改动部分 + 新片段，声音直接沿用上一版
  const inputs = ['-i', base, ...ranges.flatMap((_, i) => ['-i', `${OUT}/.parts/seg${i}.mp4`])];
  const parts = []; let cur = 0; let f = '';
  ranges.forEach(([a, b], i) => {
    if (a > cur) { f += `[0:v]trim=start_frame=${cur}:end_frame=${a},setpts=PTS-STARTPTS[k${i}];`; parts.push(`[k${i}]`); }
    f += `[${i + 1}:v]setpts=PTS-STARTPTS[s${i}];`; parts.push(`[s${i}]`); cur = b + 1;
  });
  f += `[0:v]trim=start_frame=${cur},setpts=PTS-STARTPTS[tail];`; parts.push('[tail]');
  f += `${parts.join('')}concat=n=${parts.length}:v=1:a=0[v]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', f, '-map', '[v]', '-map', '0:a?', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', out]);
  fs.rmSync(`${OUT}/.parts`, { recursive: true, force: true });
}
fs.writeFileSync(`${VER}/v${N}.plan.json`, JSON.stringify(rawPlan, null, 1));
fs.writeFileSync(`${VER}/v${N}.code.txt`, codeHash);

if (args.includes('--mov')) {
  const composition = await selectComposition({ serveUrl, id: 'Overlay', inputProps: { plan, subs, transparent: true } });
  lastPct = -1;
  await renderMedia({ serveUrl, composition, chromiumOptions: { gl: 'angle' }, codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le', imageFormat: 'png', outputLocation: `${OUT}/overlay_v${N}.mov`, inputProps: { plan, subs, transparent: true }, onProgress: onProgress('透明层') });
  console.log(`✓ 透明包装层：${OUT}/overlay_v${N}.mov`);
}
console.log(`\n✓ 第 ${N} 版成片：${out}（用时 ${((Date.now() - t0) / 1000).toFixed(0)} 秒）`);
