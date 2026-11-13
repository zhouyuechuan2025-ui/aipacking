import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {resolvePlan} from '../src/lib/anchors.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'plan', name), 'utf8'));
const subs = read('subs.json');
const plan = resolvePlan(read('plan.json'), subs);
const {fps, duration} = plan.meta;
const args = process.argv.slice(2);
const ranges = [];
while (args.includes('--clip')) ranges.push(args.splice(args.indexOf('--clip'), 3).slice(1).map(Number));
const seconds = args.map(Number);
if (seconds.length < 3 || seconds.length > 5 || seconds.some(t => !Number.isFinite(t) || t < 0 || t >= duration)
  || new Set(seconds.map(t => Math.round(t * fps))).size !== seconds.length) throw new Error('Provide 3–5 distinct preview seconds.');
for (const range of ranges) {
  const [from, to] = range;
  if (!range.every(Number.isFinite) || from < 0 || to > duration || to - from < 1 || to - from > 8) {
    throw new Error('Each clip must be between 1 and 8 seconds and fit inside the source.');
  }
}
for (const check of ['validate.mjs', 'skill-render-preflight.mjs']) {
  execFileSync(process.execPath, [path.join(root, 'scripts', check)], {cwd: root, stdio: 'inherit'});
}
const out = path.join(root, 'review', 'previews', new Date().toISOString().replace(/[:.]/g, '-'));
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root,'src/index.ts'), publicDir: path.join(root,'public')});
const chromiumOptions = {gl:'swangle'};
const browserExecutable = process.env.NANA_BROWSER_EXECUTABLE;
const browser = await openBrowser('chrome', {chromiumOptions, ...(browserExecutable ? {browserExecutable, chromeMode:'chrome-for-testing'} : {})});
try {
  const common = {serveUrl, inputProps: {plan,subs,transparent:false}, chromiumOptions, puppeteerInstance:browser, timeoutInMilliseconds:60000};
  const composition = await selectComposition({...common,id:'Final'});
  for (const t of seconds) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(t * fps));
    await renderStill({...common,composition,frame,output:path.join(out,'frame-'+frame+'.png')});
  }
  for (const [i,[from,to]] of ranges.entries()) {
    const frameRange = [Math.round(from*fps),Math.round(to*fps)-1];
    await renderMedia({...common,composition,frameRange,codec:'h264',concurrency:2,outputLocation:path.join(out,'motion-'+(i+1)+'.mp4')});
  }
  console.log(out);
} finally {
  await browser.close({silent:true});
}
