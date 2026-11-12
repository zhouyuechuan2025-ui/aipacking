// 模板一览图：用 docs/catalog.json 里的示例参数，把模板逐个渲染成静帧并拼成 docs/templates_gallery.jpg
// 用法：node scripts/gallery.mjs            （默认只渲染 editorial 模板）
//       node scripts/gallery.mjs --all      （全部模板）
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const all = process.argv.includes('--all');
const catalog = JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).filter(c => all ? !c.ctx.startsWith('编辑') : c.ctx.startsWith('编辑'));
const meta = JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')).meta;
const SLOT = 4; // 每个模板占 4 秒
const scenes = catalog.map((c, i) => ({ id: `g${String(i + 1).padStart(2, '0')}`, type: c.type, start: i * SLOT, end: i * SLOT + SLOT - 0.2, layout: c.layout.split('|')[0], ...(c.bg ? { bg: c.bg } : {}), props: c.props }));
const plan = { meta: { ...meta, duration: scenes.length * SLOT }, style: 'editorial', chapters: [{ start: 0, title: '模板一览', en: 'TEMPLATES' }], subtitles: { mode: 'off' }, scenes };

const dir = 'qa/gallery'; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
console.log(`打包中…（${scenes.length} 个模板）`);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const inputProps = { plan, subs: [], transparent: false };
const composition = await selectComposition({ serveUrl, id: 'Final', inputProps });
const composed = { ...composition, durationInFrames: Math.round(plan.meta.duration * meta.fps) };
for (const [i, s] of scenes.entries()) {
  const frame = Math.round((s.start + SLOT * 0.75) * meta.fps);
  await renderStill({ composition: composed, serveUrl, output: path.resolve(dir, `${String(i).padStart(3, '0')}.jpg`), frame, inputProps, imageFormat: 'jpeg', jpegQuality: 85, chromiumOptions: { gl: 'angle' } });
  console.log(`✓ ${s.type}`);
}
// 每张图下方标上模板名和用途（用 Windows/Mac 自带中文字体，找不到就不标）
const font = ['C:/Windows/Fonts/msyh.ttc', '/System/Library/Fonts/PingFang.ttc', '/System/Library/Fonts/STHeiti Light.ttc'].find(f => fs.existsSync(f));
const esc = t => t.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\u2019").replace(/%/g, '\\%');
scenes.forEach((s, i) => {
  const f = path.join(dir, `${String(i).padStart(3, '0')}.jpg`);
  const c = catalog[i];
  const label = `${i + 1}. ${s.type}  ${c.ctx.split('/').pop()}  [${c.layout}]`;
  const vf = `scale=640:-1,pad=640:410:0:0:0x111111` + (font ? `,drawtext=fontfile='${font.replace(':', '\\:')}':text='${esc(label)}':x=14:y=372:fontsize=22:fontcolor=white` : '');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-vf', vf, f + '.l.jpg']);
  fs.renameSync(f + '.l.jpg', f);
});
const rows = Math.ceil(scenes.length / 3);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${dir}/%03d.jpg`, '-vf', `tile=3x${rows}:padding=8:color=0x111111`, '-frames:v', '1', '-q:v', '3', all ? 'qa/gallery_old.jpg' : 'docs/templates_gallery.jpg']);
console.log('\n→ docs/templates_gallery.jpg');
