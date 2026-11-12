// 模板体检：逐个模板跑「标准 / 加压 / 赶时间」三种情况，自动测量排版问题，输出分级报告
// 用法：node scripts/lab.mjs              全部模板
//       node scripts/lab.mjs BarRace Donut 只测指定模板
// 产出：qa/lab/report.md（分级报告）、qa/lab/<模板>.jpg（每个模板的体检图：入场/中段/退场/加压/赶时间）
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const argv = process.argv.slice(2);
const forceStyle = argv.find(a => a.startsWith('--style='))?.slice(8); // 指定风格包体检（通用模板换风格后的适配问题）
const only = argv.filter(a => !a.startsWith('--'));
const quick = argv.includes('--quick'); // 快速模式：每个模板只看标准情况的中段一帧（换风格批量体检用）
let catalog = JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).filter(c => !only.length || only.includes(c.type));
const meta = JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')).meta;
const reportPlan = JSON.parse(fs.readFileSync('examples/opus55.report.plan.json', 'utf8'));
const reportStyle = Object.fromEntries(reportPlan.scenes.map(s => [s.type, s.style || reportPlan.style]));
const src = f => fs.readFileSync(f, 'utf8');
const reportTypes = new Set(['report.tsx', 'report2.tsx', 'report3.tsx'].flatMap(f => [...src(`src/pages/${f}`).matchAll(/export const REPORT\d*_(?:PAGES|OVERLAYS) = \{([^}]*)\}/g)].flatMap(m => m[1].split(',').map(x => x.trim()))));
/** 每个模板用它原生的风格包体检 */
const nativeStyle = c => forceStyle && !reportTypes.has(c.type) && !c.ctx.startsWith('编辑') ? forceStyle : c.ctx.startsWith('编辑') ? 'editorial' : reportTypes.has(c.type) ? (reportStyle[c.type] || 'report-light') : 'tech-dark';

// ---- 加压：文字加长 50%，列表多一项
const longer = s => { if (s.length < 2 || /^[\d.+\-%→=×✓✕↓↑#]+$/.test(s)) return s; const n = Math.ceil(s.length * 0.5); return s + [...s].slice(0, n).join(''); };
const stress = o => {
  if (typeof o === 'string') return longer(o);
  if (Array.isArray(o)) { const a = o.map(stress); if (a.length >= 2 && a.length < 6 && typeof o[0] === 'object') a.push(stress(o[o.length - 1])); return a; }
  // 素材路径、颜色、枚举类字段不能加长，只加长会上屏的文字
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, /^(color|variant|side|media|src|img|image|photo|avatar|video|icon|mode|kind|style|layout|state)$/.test(k) ? v : stress(v)]));
  return o;
};

// ---- 为每个模板排 3 个场景：标准(4s) / 加压(4s) / 赶时间(1.8s)
const cases = []; let t = 0;
for (const c of catalog) {
  const layout = c.layout.split('|')[0]; const style = nativeStyle(c);
  for (const [kind, dur, props] of quick ? [['base', 4, c.props]] : [['base', 4, c.props], ['long', 4, stress(c.props)], ['short', Math.max(1.8, c.minDur || 0), c.props]]) {
    cases.push({ c, kind, scene: { id: `${c.type}_${kind}`, type: c.type, style, layout, start: t, end: t + dur, ...(c.bg ? { bg: c.bg } : {}), props } });
    t += dur + 1; // 中间留 1 秒空白，避免相邻页的转场互相影响
  }
}
const plan = { meta: { ...meta, duration: t }, chapters: [{ start: 0, title: '模板体检', en: 'TEMPLATE LAB' }], subtitles: { mode: 'off' }, scenes: cases.map(x => x.scene) };

const dir = forceStyle ? `qa/lab-${forceStyle}` : 'qa/lab';
if (!only.length) fs.rmSync(dir, { recursive: true, force: true }); // 只重测几个时，保留其他模板的体检结果
fs.rmSync(`${dir}/_f${process.pid}`, { recursive: true, force: true }); fs.mkdirSync(`${dir}/_f${process.pid}`, { recursive: true });
console.log(`打包中…（${catalog.length} 个模板）`);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const fps = meta.fps;
const base = await selectComposition({ serveUrl, id: 'Final', inputProps: { plan, subs: [], transparent: false } });
const composition = { ...base, durationInFrames: Math.round(t * fps) + 1 };

// ---- 对比度：读出截图像素，取文字框里「不是文字颜色」的像素当背景，算 WCAG 对比度
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const W = 1920, H = 1080;
function contrastIssues(file, boxes) {
  let px; try { px = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: W * H * 3 + 1024 }); } catch { return []; }
  const at = (x, y) => { const i = (y * W + x) * 3; return [px[i], px[i + 1], px[i + 2]]; };
  const out = [];
  for (const [text, x, y, w, h, color, op, size] of boxes) {
    if (!color || op < 0.9 || w < 4 || h < 4) continue;
    const x0 = Math.max(0, Math.round(x)), x1 = Math.min(W - 1, Math.round(x + w)), y0 = Math.max(0, Math.round(y)), y1 = Math.min(H - 1, Math.round(y + h));
    if (x1 <= x0 || y1 <= y0) continue;
    const step = Math.max(1, Math.round(Math.min(w, h) / 24)); const bg = []; let n = 0;
    for (let yy = y0; yy <= y1; yy += step) for (let xx = x0; xx <= x1; xx += step) {
      const c = at(xx, yy); n++;
      if (Math.abs(c[0] - color[0]) + Math.abs(c[1] - color[1]) + Math.abs(c[2] - color[2]) > 60) bg.push(c);
    }
    let sample = bg;
    if (bg.length < n * 0.15) { // 框里几乎全是和文字同色的像素 → 文字和背景本身就分不开，取框外一圈再确认
      sample = [];
      for (let d = 4; d <= 10; d += 3) for (let xx = x0; xx <= x1; xx += step) for (const yy of [y0 - d, y1 + d]) if (yy >= 0 && yy < H) sample.push(at(xx, yy));
    }
    if (!sample.length) continue;
    // 取和文字亮度差得最远的那部分像素当背景（避开笔画边缘的抗锯齿过渡色），用第 85 百分位而不是最大值，避开噪点
    const Lt = lum(color); sample.sort((a, b) => Math.abs(lum(a) - Lt) - Math.abs(lum(b) - Lt)); const bgc = sample[Math.floor((sample.length - 1) * 0.85)];
    const cr = ratio(color, bgc);
    const need = size >= 24 ? 3 : 4.5; // 大字 3:1，小字 4.5:1（WCAG）
    if (cr < need * 0.66) out.push(`看不清：「${text}」对比度 ${cr.toFixed(1)}:1（字 rgb(${color.join(',')})，底 rgb(${bgc.join(',')})）`);
    else if (cr < need) out.push(`对比度偏低：「${text}」${cr.toFixed(1)}:1`);
  }
  return out;
}

const results = new Map(catalog.map(c => [c.type, { c, style: nativeStyle(c), shots: [], probes: [], errors: [] }]));
for (const { c, kind, scene } of cases) {
  const R = results.get(c.type); const d = scene.end - scene.start;
  const at = quick ? [['中段', 0.6]] : kind === 'base' ? [['入场', 0.2], ['中段', 0.6], ['退场前', 0.9]] : kind === 'long' ? [['加压', 0.6]] : [['赶时间', 0.85]];
  for (const [label, k] of at) {
    const frame = Math.round((scene.start + d * k) * fps);
    const out = path.resolve(dir, `_f${process.pid}`, `${c.type}_${R.shots.length}.jpg`);
    const tag = `${c.type}|${label}`; const logs = [];
    try {
      await renderStill({ composition: { ...composition, props: { ...composition.props, probe: tag } }, serveUrl, output: out, frame, imageFormat: 'jpeg', jpegQuality: 80, chromiumOptions: { gl: 'angle' },
        inputProps: { plan, subs: [], transparent: false, probe: tag }, onBrowserLog: l => { const i = l.text.indexOf('__PROBE__'); if (i >= 0) logs.push(JSON.parse(l.text.slice(i + 9))); else if (process.env.LAB_DEBUG) console.log('LOG', l.text.slice(0, 200)); } });
      R.shots.push({ label, file: out });
      const p = logs.find(x => x.tag === tag); if (p) { p.issues.push(...contrastIssues(out, p.boxes)); R.probes.push({ label, ...p }); }
    } catch (e) { R.errors.push(`${label}：渲染报错 ${String(e.message).split('\n')[0]}`); }
  }
  process.stdout.write(kind === 'short' || quick ? `✓ ${c.type}\n` : '');
}

// ---- 分级
const font = ['C:/Windows/Fonts/msyh.ttc', '/System/Library/Fonts/PingFang.ttc'].find(f => fs.existsSync(f));
const fontArg = font ? `fontfile=${font.replace(/\\/g, '/').replace(':', '\\\\:')}:` : '';
const rows = [];
for (const R of results.values()) {
  const hard = [...R.errors]; const soft = [];
  const P = l => R.probes.find(p => p.label === l);
  const mid = P('中段');
  if (mid && mid.texts === 0) hard.push('中段是空页：没有任何可见文字');
  for (const p of R.probes) {
    const bad = p.issues.filter(i => !/^(中文太小|对比度偏低)/.test(i));
    if (['中段', '退场前'].includes(p.label)) hard.push(...bad.map(i => `${p.label}·${i}`));
    else if (p.label === '加压') soft.push(...bad.map(i => `加压·${i}`));
    else if (p.label === '赶时间' && bad.length) soft.push(...bad.map(i => `赶时间·${i}`));
    soft.push(...p.issues.filter(i => /^(中文太小|对比度偏低)/.test(i)).map(i => `${p.label}·${i}`));
  }
  const sh = P('赶时间'); if (mid && sh && sh.texts < mid.texts * 0.6) soft.push(`赶时间：最短时长（${Math.max(1.8, R.c.minDur || 0)} 秒）内只出现了 ${sh.texts}/${mid.texts} 段文字，动画太慢`);
  if (mid && mid.area > 0.3) soft.push(`文字占画面 ${Math.round(mid.area * 100)}%，偏满`);
  if (mid && mid.maxH > 260) soft.push(`最大字高 ${mid.maxH}px，偏大`);
  const grade = hard.length ? 'C' : soft.length ? 'B' : 'A';
  rows.push({ ...R, hard: [...new Set(hard)], soft: [...new Set(soft)], grade });
  // 体检图：一行 5 帧，下面标注
  if (R.shots.length) {
    const ins = R.shots.flatMap(s => ['-i', s.file]);
    const lab = R.shots.map((s, i) => `[${i}:v]scale=384:-1,pad=384:246:0:0:0x111111${font ? `,drawtext=${fontArg}text='${s.label}':x=8:y=222:fontsize=16:fontcolor=white` : ''}[v${i}]`).join(';');
    // 只有一帧（快速模式）时 hstack 会报错，直接输出这一帧
    const f = R.shots.length === 1 ? lab.replace('[v0]', '[o]') : `${lab};${R.shots.map((_, i) => `[v${i}]`).join('')}hstack=inputs=${R.shots.length}[o]`;
    try { execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', f, '-map', '[o]', '-q:v', '4', path.join(dir, `${R.c.type}.jpg`)]); } catch (e) { console.log('拼图失败', R.c.type, String(e.message).split('\n')[0]); }
  }
}
fs.rmSync(`${dir}/_f${process.pid}`, { recursive: true, force: true });

// ---- 代码里有、目录里没登记的模板
const registered = new Set(JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).map(c => c.type));
const exported = [...new Set(fs.readdirSync('src/pages').flatMap(f => [...src(`src/pages/${f}`).matchAll(/export const [A-Z0-9]+_(?:PAGES|OVERLAYS) = \{([^}]*)\}/g)].flatMap(m => m[1].split(',').map(x => x.trim()).filter(Boolean))))];
const unlisted = exported.filter(x => !registered.has(x));

// 只重测几个时，合并进上一次的完整报告
if (only.length && fs.existsSync(`${dir}/report.json`)) {
  const fresh = new Set(rows.map(r => r.c.type)); const cat = new Map(JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).map(c => [c.type, c]));
  for (const o of JSON.parse(fs.readFileSync(`${dir}/report.json`, 'utf8'))) if (!fresh.has(o.type) && cat.has(o.type)) rows.push({ ...o, c: cat.get(o.type) });
}
const count = g => rows.filter(r => r.grade === g).length;
let md = `# 模板体检报告\n\n共 ${rows.length} 个：A 直接可用 ${count('A')} · B 修完可用 ${count('B')} · C 有硬伤 ${count('C')}\n\n`;
if (unlisted.length) md += `代码里有但没登记进目录：${unlisted.join('、')}\n\n`;
md += `| 等级 | 模板 | 风格 | 硬伤 | 建议修 |\n|---|---|---|---|---|\n`;
for (const r of rows.sort((a, b) => a.grade.localeCompare(b.grade) || a.c.type.localeCompare(b.c.type)))
  md += `| ${r.grade} | ${r.c.type}（${r.c.ctx}） | ${r.style} | ${r.hard.join('<br>') || ''} | ${r.soft.join('<br>') || ''} |\n`;
fs.writeFileSync(`${dir}/report.md`, md);
fs.writeFileSync(`${dir}/report.json`, JSON.stringify(rows.map(({ c, style, grade, hard, soft, probes }) => ({ type: c.type, ctx: c.ctx, style, grade, hard, soft, probes })), null, 1));
console.log(`\nA ${count('A')} · B ${count('B')} · C ${count('C')}  →  ${dir}/report.md`);
