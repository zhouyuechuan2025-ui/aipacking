// 抽帧自检：每个场景在「动画基本完成」的时间点渲染一张静帧，拼成 qa/contact.jpg 给 Agent 看
// 用法：node scripts/qa.mjs            （全部场景）
//       node scripts/qa.mjs s05 s12     （只看指定场景）
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { resolvePlan } from '../src/lib/anchors.ts';
const subs = JSON.parse(fs.readFileSync('plan/subs.json', 'utf8'));
const plan = resolvePlan(JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')), subs);
const only = process.argv.slice(2);
fs.rmSync('qa', { recursive: true, force: true }); fs.mkdirSync('qa', { recursive: true });
console.log('打包中…');
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const inputProps = { plan, subs, transparent: false };
const composition = await selectComposition({ serveUrl, id: 'Final', inputProps });
const fps = plan.meta.fps;
const list = plan.scenes.filter(s => !only.length || only.includes(s.id)).sort((a, b) => a.start - b.start);
for (const s of list) {
  // 取本页最后一个 at 之后 0.6 秒（所有元素都已出现），且不晚于结束前 0.5 秒（避开退场动画/转场）
  const ats = []; const walk = o => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if ((k === 'at' || k.endsWith('At')) && typeof v === 'number') ats.push(v); walk(v); } }; walk(s.props);
  const t = Math.max(s.start + (s.end - s.start) * 0.5, Math.min(s.end - 0.5, Math.max(s.start + Math.min(1.6, (s.end - s.start) * 0.7), ...ats.map(a => a + 0.6))));
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * fps));
  const out = path.resolve('qa', `${s.id}_${s.type}.jpg`);
  await renderStill({ composition, serveUrl, output: out, frame, inputProps, imageFormat: 'jpeg', jpegQuality: 85, chromiumOptions: { gl: 'angle' } });
  console.log(`✓ ${s.id} ${s.type} @${t.toFixed(2)}s`);
}
// 总览图：先复制成连续编号（Windows 版 ffmpeg 不支持 glob），再拼成网格
const shots = fs.readdirSync('qa').filter(f => f.endsWith('.jpg')).sort();
if (shots.length) try {
  fs.mkdirSync('qa/_tile', { recursive: true });
  shots.forEach((f, i) => fs.copyFileSync(path.join('qa', f), path.join('qa/_tile', `${String(i).padStart(3, '0')}.jpg`)));
  const rows = Math.ceil(shots.length / 4);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'qa/_tile/%03d.jpg', '-vf', `scale=480:-1,tile=4x${rows}:padding=6`, '-frames:v', '1', 'qa/contact.jpg']);
  fs.rmSync('qa/_tile', { recursive: true, force: true });
  console.log('\n→ 总览图 qa/contact.jpg（单张大图在 qa/ 里），请逐张检查 docs/qa.md 的清单');
} catch (e) { console.log('（总览图生成失败：' + String(e.message).split('\n')[0] + '）'); }
