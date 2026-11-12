// 背景/风格对比图：同几个模板分别套上每种候选背景，给人挑
// 用法：node scripts/styles.mjs [模板名...]   默认 BigWords Checklist Balance EndCard
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const types = process.argv.slice(2).length ? process.argv.slice(2) : ['BigWords', 'Checklist', 'Balance', 'EndCard'];
// 候选：科技暗黑里非射线的几种背景 + 其他风格包
const OPTIONS = [
  ['① 暗色·极光', 'tech-dark', { variant: 'aurora' }],
  ['② 暗色·丝绸', 'tech-dark', { variant: 'silk' }],
  ['③ 暗色·星云', 'tech-dark', { variant: 'nebula' }],
  ['④ 暗色·透视网格', 'tech-dark', { variant: 'grid' }],
  ['⑤ 暗色发布会', 'keynote', null],
  ['⑥ 报告·深色', 'report', null],
  ['⑦ 报告·浅色', 'report-light', null],
  ['⑧ 报告·弥散玻璃', 'report-glass', null],
  ['⑨ 瑞士排版', 'swiss', null],
  ['⑩ 数据叙事·纸张', 'dataviz', null],
  ['⑪ 白板', 'whiteboard', null],
  ['⑫ 编辑排版', 'editorial', null],
];
const cat = new Map(JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).map(c => [c.type, c]));
const meta = JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')).meta;
const SLOT = 4; const scenes = []; const labels = [];
for (const [label, style, bg] of OPTIONS) for (const t of types) {
  const c = cat.get(t); const i = scenes.length;
  scenes.push({ id: `s${i}`, type: t, style, start: i * SLOT, end: i * SLOT + SLOT - 0.2, layout: 'full', ...(bg ? { bg: { ...(c.bg || {}), ...bg } } : c.bg ? { bg: c.bg } : {}), props: c.props });
  labels.push(`${label} · ${t}`);
}
const plan = { meta: { ...meta, duration: scenes.length * SLOT }, chapters: [{ start: 0, title: '背景对比', en: 'BACKGROUNDS' }], subtitles: { mode: 'off' }, scenes };
const dir = 'qa/styles'; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
console.log(`打包中…（${scenes.length} 张）`);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const inputProps = { plan, subs: [], transparent: false };
const comp = await selectComposition({ serveUrl, id: 'Final', inputProps });
const composition = { ...comp, durationInFrames: Math.round(plan.meta.duration * meta.fps) };
const font = ['C:/Windows/Fonts/msyh.ttc', '/System/Library/Fonts/PingFang.ttc'].find(f => fs.existsSync(f));
const esc = t => t.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, '\u2019');
for (const [i, s] of scenes.entries()) {
  const f = path.resolve(dir, `${String(i).padStart(3, '0')}.jpg`);
  await renderStill({ composition, serveUrl, output: f, frame: Math.round((s.start + SLOT * 0.7) * meta.fps), inputProps, imageFormat: 'jpeg', jpegQuality: 85, chromiumOptions: { gl: 'angle' } });
  const vf = `scale=560:-1,pad=560:350:0:0:0x111111` + (font ? `,drawtext=fontfile='${font.replace(':', '\\:')}':text='${esc(labels[i])}':x=12:y=322:fontsize=20:fontcolor=white` : '');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-vf', vf, f + '.l.jpg']); fs.renameSync(f + '.l.jpg', f);
  console.log(`✓ ${labels[i]}`);
}
// 每 3 个候选拼一张图（每行一个候选，4 个模板）
for (let k = 0; k < OPTIONS.length; k += 3) {
  const n = Math.min(3, OPTIONS.length - k) * types.length;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-start_number', String(k * types.length), '-i', `${dir}/%03d.jpg`, '-frames:v', '1', '-vf', `tile=${types.length}x${n / types.length}:padding=6:color=0x111111`, '-q:v', '3', `qa/styles_${k / 3 + 1}.jpg`]);
}
console.log('→ qa/styles_1..4.jpg');
