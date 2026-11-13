import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {resolvePlan} from '../src/lib/anchors.ts';
import {productionCheck, styleHash} from './nana-review.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const abs = (...p) => path.join(root,...p);
const read = (p) => JSON.parse(fs.readFileSync(abs(p), 'utf8').replace(/^\uFEFF/, ''));
const fail = (msg) => { throw new Error(msg); };
let browser;
try {
  productionCheck();
  const production = styleHash();
  const subs = read('plan/subs.json');
  const plan = resolvePlan(read('plan/plan.json'), subs);
  const args = process.argv.slice(2);
  const ranges = [];
  while (args.includes('--clip')) ranges.push(args.splice(args.indexOf('--clip'),3).slice(1).map(Number));
  const secs = args.map(Number);
  const frames = secs.map((n) => Math.min(Math.round(plan.meta.duration*plan.meta.fps)-1, Math.round(n*plan.meta.fps)));
  if (frames.length < 3 || frames.length > 5 || new Set(frames).size !== frames.length || secs.some((n) => !Number.isFinite(n) || n < 0 || n >= plan.meta.duration)) fail('指定 3–5 个不同的有效时间点（秒）。');
  const fps = plan.meta.fps;
  if (ranges.some(clipTimes => clipTimes.length !== 2 || !clipTimes.every(Number.isFinite) || clipTimes[0] < 0
    || clipTimes[1] > plan.meta.duration || clipTimes[1]-clipTimes[0] < 1 || clipTimes[1]-clipTimes[0] > 8
    || clipTimes[1]-clipTimes[0] >= plan.meta.duration - 1/fps)) fail('动态预览区间须为片内 1–8 秒。');
  const board = read('plan/storyboard.json');
  const hasCamera = s => s.camera?.keys || s.camera?.windowKeys;
  if (board.motionVersion >= 2 && board.shots.filter(hasCamera).some(
    s => !ranges.some(([from,to]) => from <= s.start+.25 && to >= s.end-.25))) {
    fail('请用 --clip 开始秒 结束秒 覆盖每处完整运镜。');
  }
  if (board.motionVersion === 3 && !board.shots.some(s => s.elements?.some(e =>
    (e.kind === 'motion' || e.kind === 'semantic' || e.animation) &&
    ranges.some(([from,to]) => from <= e.at + 1e-6 && to >= e.at + e.duration - 1e-6)))) {
    fail('请用动态短样覆盖至少一个完整新增动效。');
  }
  const dir = 'review/previews/' + production.slice(0,12) + '-' + randomUUID().slice(0,8);
  fs.mkdirSync(abs(dir), {recursive:true});
  const inputProps = {plan,subs,transparent:false};
  const serveUrl = await bundle({entryPoint:abs('src/index.ts'), publicDir:abs('public')});
  const chromiumOptions = {gl:'swangle'};
  const browserExecutable = process.env.NANA_BROWSER_EXECUTABLE;
  browser = await openBrowser('chrome', {chromiumOptions,
    ...(browserExecutable ? {browserExecutable,chromeMode:'chrome-for-testing'} : {})});
  const common = {serveUrl,inputProps,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:60000};
  const composition = await selectComposition({...common,id:'Final'});
  const images = [];
  for (const frame of frames) {
    const rel = dir + '/frame-' + frame + '.png';
    await renderStill({...common,composition,frame,imageFormat:'png',output:abs(rel)});
    images.push(rel);
  }
  const clips = [];
  for (const [i,[from,to]] of ranges.entries()) {
    const rel = dir + '/motion-' + (i+1) + '.mp4';
    const frameRange = [Math.round(from*fps),Math.round(to*fps)-1];
    await renderMedia({...common,composition,frameRange,codec:'h264',concurrency:2,scale:1,outputLocation:abs(rel)});
    clips.push(rel);
  }
  if (production !== styleHash()) fail('预览过程中项目发生变化，先重新生成风格图。');
  fs.writeFileSync(abs('review/preview-ready.json'),JSON.stringify({production,images,clips,ranges,seconds:frames.map((f) => f / plan.meta.fps)},null,2)+'\n');
  console.log('检查以下原组件实帧后发用户确认：\n' + [...images,...clips].map((p) => abs(p)).join('\n'));
} catch(e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close({silent:true});
}
