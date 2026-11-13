import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const [job, output, ...ids] = process.argv.slice(2);
if (!job || !output || !ids.length) throw new Error('render-native-showcase <job> <output> <native ID> [...]');
const work = path.resolve(job);
const out = path.resolve(output);
const req = createRequire(path.join(work,'package.json'));
const overrideFile = process.env.AIPACKING_SHOWCASE_OVERRIDES;
const overrides = overrideFile ? req(path.resolve(overrideFile)) : {};
const {bundle} = req('@remotion/bundler');
const {openBrowser,renderStill,renderMedia,selectComposition} = req('@remotion/renderer');
const rows = req(path.join(work,'src/motion/native-scenes.json'));
const externalRows = req(path.join(work,'src/motion/external-native-scenes.json'));
const externalFile = path.join(work,'plan/native-showcase-media.json');
const externalMedia = fs.existsSync(externalFile) ? req(externalFile) : {};
const selected = ids.map(id => {
  const row = rows.find(entry => entry.id === id);
  if (row) return {...row,...overrides.scenes?.[id]};
  const external = externalRows.find(entry => entry.id === id);
  if (!external || !externalMedia[id]) throw new Error('Unknown native template or missing original render: '+id);
  return {...external,...externalMedia[id],...overrides.scenes?.[id]};
});
const fps = 30;
const stillsOnly = process.env.AIPACKING_STILLS_ONLY === '1';
const scale = Number(process.env.AIPACKING_SHOWCASE_SCALE ?? 2/3);
const sampleRatio = Number(process.env.AIPACKING_STILL_AT ?? .57);
const concurrency = Number(process.env.AIPACKING_SHOWCASE_CONCURRENCY ?? 4);
if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('Expected a positive showcase render concurrency');
const duration = selected.reduce((total,row)=>total+row.frames,0)/fps;
let frame = 0;
const scenes = selected.map(row => {
  const start = frame/fps;
  frame += row.frames;
  const props = row.media ? {sourceProject:row.source,sourceRevision:row.revision,templateId:row.templateId,
    media:row.media,input:row.demo} : {native:row.demo};
  return {id:row.id,type:row.id,layout:row.layout ?? 'full',start,end:frame/fps,transition:'none',props};
});
const plan = {meta:{fps,width:1920,height:1080,duration,video:overrides.video ?? ''},scenes,
  ...(overrides.chapters ? {chapterTimeline:overrides.chapters} : {}),subtitles:{mode:'off'}};
const inputProps = {plan,subs:[],transparent:false};
fs.mkdirSync(out,{recursive:true});
const serveUrl = await bundle({entryPoint:path.join(work,'src/index.ts'),publicDir:path.join(work,'public')});
const chromiumOptions={gl:'swangle'};
const browserExecutable=process.env.NANA_BROWSER_EXECUTABLE;
const browser = await openBrowser('chrome',{chromiumOptions,...(browserExecutable?{browserExecutable,chromeMode:'chrome-for-testing'}:{})});
try {
  const common = {serveUrl,inputProps,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:60000};
  const composition = await selectComposition({...common,id:'Final'});
  const failed = [];
  for (const [i,row] of selected.entries()) {
    const scene=scenes[i];
    try {
      for (const [part,ratio] of stillsOnly ? [['middle',sampleRatio]] : [['early',.16],['middle',.57],['late',.84]]) {
        const frame=Math.round(scene.start*fps)+Math.floor((row.frames-1)*ratio);
        await renderStill({...common,composition,frame,scale,output:path.join(out,row.id+'-'+part+'.png')});
      }
      console.log('Checked frame renders:',row.id);
    } catch (error) {
      if (!stillsOnly) throw error;
      failed.push({id:row.id,error:error.message});
      console.error(row.id,error.message);
    }
  }
  if (stillsOnly) fs.writeFileSync(path.join(out,'failures.json'),JSON.stringify(failed,null,2)+'\n');
  if (!stillsOnly) await renderMedia({...common,composition,frameRange:[0,Math.round(duration*fps)-1],codec:'h264',muted:true,
    scale,concurrency,crf:20,outputLocation:path.join(out,'native-showcase.mp4')});
  fs.writeFileSync(path.join(out,'chapters.json'),JSON.stringify(scenes.map(({id,start,end})=>({id,start,end})),null,2)+'\n');
} finally {
  await browser.close({silent:true});
}
