import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {resolvePlan} from '../src/lib/anchors.ts';
import {productionCheck, styleHash} from './nana-review.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const abs = (...p) => path.join(root,...p);
const read = (p) => JSON.parse(fs.readFileSync(abs(p), 'utf8').replace(/^\uFEFF/, ''));
const fail = (msg) => { throw new Error(msg); };
try {
  productionCheck();
  const production = styleHash();
  const subs = read('plan/subs.json');
  const plan = resolvePlan(read('plan/plan.json'), subs);
  const secs = process.argv.slice(2).map(Number);
  const frames = secs.map((n) => Math.min(Math.round(plan.meta.duration*plan.meta.fps)-1, Math.round(n*plan.meta.fps)));
  if (frames.length < 3 || frames.length > 5 || new Set(frames).size !== frames.length || secs.some((n) => !Number.isFinite(n) || n < 0 || n >= plan.meta.duration)) fail('指定 3–5 个不同的有效时间点（秒）。');
  const dir = 'review/previews/' + production.slice(0,12) + '-' + randomUUID().slice(0,8);
  fs.mkdirSync(abs(dir), {recursive:true});
  const inputProps = {plan,subs,transparent:false};
  const serveUrl = await bundle({entryPoint:abs('src/index.ts'), publicDir:abs('public')});
  const chromiumOptions = {gl:'angle'};
  const composition = await selectComposition({serveUrl,id:'Final',inputProps,chromiumOptions});
  const images = [];
  for (const frame of frames) {
    const rel = dir + '/frame-' + frame + '.png';
    await renderStill({serveUrl,composition,frame,inputProps,chromiumOptions,imageFormat:'png',output:abs(rel)});
    images.push(rel);
  }
  if (production !== styleHash()) fail('预览过程中项目发生变化，先重新生成风格图。');
  fs.writeFileSync(abs('review/preview-ready.json'),JSON.stringify({production,images,seconds:frames.map((f) => f / plan.meta.fps)},null,2)+'\n');
  console.log('检查以下原组件实帧后发用户确认：\n' + images.map((p) => abs(p)).join('\n'));
} catch(e) {
  console.error(e.message);
  process.exitCode = 1;
}
