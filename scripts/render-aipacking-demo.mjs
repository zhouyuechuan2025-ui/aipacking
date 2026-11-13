import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const work = path.resolve(process.argv[2]);
const target = path.resolve(process.argv[3]);
const load = createRequire(path.join(work,'package.json'));
const {bundle} = load('@remotion/bundler');
const {openBrowser,renderStill,renderMedia,selectComposition} = load('@remotion/renderer');
const registry = load(path.join(work,'src/motion/keyframes.json'));
const semantic = load(path.join(work,'src/motion/semantic.json'));
const fps=30;
const demoSubs=[
  [0,3,'先把原片和字幕放进项目。'],
  [3,6,'做清单，按顺序核对原声、字幕和人脸。'],
  [6,9,'分镜完成后，预览和整片分开审。'],
  [9,12,'原声和字幕汇到同一条时间轴。'],
  [12,15,'检查章节时间轴和原声。'],
  [15,18,'把两个输出放在一起对照。'],
  [18,21,'最后看实际预览。'],
];
const base={x:1400,y:240,width:434,height:156};
const style='editorial';
const accent='#F4A482';
const demoElement = (start,preset,labels,position=base) => ({...position,kind:'semantic',preset,at:start+.12,duration:2.6,
  itemsData:labels.map((text,i)=>({text,at:start+.12+i*.49}))});
const words=(start,text,animation,position=base) => ({...position,kind:'motion',animation,text,at:start+.16,duration:2.45,animationDuration:.62});
const low={x:95,y:240,width:438,height:152};
const sample=[
  [words(0,'原片与字幕','animate-backInRight'), demoElement(.57,'type-line',['确认同版字幕'],{...low,y:285})],
  [demoElement(3,'checklist',['原声','字幕','人脸'],{...low,y:180,height:300}), words(4.12,'逐项核对','magic-puffIn')],
  [demoElement(6,'branch',['分镜','预览','整片'],{x:440,y:255,width:1040,height:345})],
  [demoElement(9,'merge',['原声','字幕','时间轴'],{...low,height:240}), words(10,'一条时间轴','animate-flipInY')],
  [demoElement(12,'timeline',['章节','进度','原声'],{...base,width:460,x:1380}),words(12.85,'检查原声','magic-perspectiveLeftReturn',{...low,y:310})],
  [demoElement(15,'compare',['预览','整片'],{x:440,y:255,width:1040,height:345})],
  [demoElement(18,'swap',['准备预览','预览就绪'],{...base,y:300}),words(18.63,'看实际效果','animate-zoomIn',{...low,y:320})],
];
const plan={
  meta:{fps,width:1920,height:1080,duration:21,video:'input/demo-source.mp4',burnedSubtitles:false},
  style,palette:{main:accent,alert:'#BE543F'},subtitles:{mode:'always'},
  chapterTimeline:[{start:0,title:'准备'},{start:6,title:'编排'},{start:15,title:'检查'}],
  scenes:sample.map((elements,i)=>({id:'demo'+i,start:i*3,end:i*3+3,
    type:i===2?'MotionPage_branch':i===5?'MotionPage_compare':i===1?'MotionLane_checklist':i===3?'MotionLane_merge':'SideBlocks',
    layout:i===2||i===5?'full':'right',
    props:i===2||i===5 ? {background:'radial-gradient(ellipse at 50% 45%,#382939,#1B1724 75%)'} : {lines:[]},
    transition:'none',
    ...(i===0?{camera:{keys:[[0,1],[.52,1],[1.05,1.07],[1.66,1.07],[2.55,1],[3,1]],focusY:85}}:{}),
    elements:elements.map(e=>({...e,duration:Math.min(e.duration,i*3+3-e.at)})),
  })),
};
fs.mkdirSync(target,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(work,'src/index.ts'),publicDir:path.join(work,'public')});
const chromiumOptions={gl:'swangle'};
const browserExecutable=process.env.NANA_BROWSER_EXECUTABLE;
const browser=await openBrowser('chrome',{chromiumOptions,...(browserExecutable?{browserExecutable,chromeMode:'chrome-for-testing'}:{})});
try {
  const common={serveUrl,puppeteerInstance:browser,chromiumOptions,timeoutInMilliseconds:60000};
  const gallery=await selectComposition({...common,id:'MotionGallery'});
  const sceneProps={plan,subs:demoSubs,transparent:false};
  const composition=await selectComposition({...common,id:'Final',inputProps:sceneProps});
  const capture=(comp,frame,name,inputProps)=>renderStill({...common,composition:comp,inputProps,frame,
    imageFormat:'png',output:path.join(target,name+'.png')});
  for (const [name,sec] of [['opening',1.35],['side-checklist',4.85],['branch',7.8],['merge',10.65],['compare',16.7]]) {
    await capture(composition,Math.round(sec*fps),name,sceneProps);
    console.log(name);
  }
  const frames=[0,8,15,23,30,38,45,53,59];
  for (let p=0;p<Math.ceil((Object.keys(registry).length+Object.keys(semantic).length)/12);p++) {
    for (const f of frames) await capture(gallery,p*60+f,'verify-'+p+'-'+f);
    console.log('gallery page',p+1);
  }
  await renderMedia({...common,composition,codec:'h264',inputProps:sceneProps,frameRange:[0,Math.round(plan.meta.duration*fps)-1],concurrency:2,scale:2/3,crf:21,
    outputLocation:path.join(target,'case-demo.mp4')});
  console.log('case demo encoded');
  await renderMedia({...common,composition:gallery,codec:'h264',concurrency:2,scale:2/3,crf:22,
    outputLocation:path.join(target,'motion-gallery.mp4')});
  console.log('gallery encoded');
} finally {
  await browser.close({silent:true});
}
