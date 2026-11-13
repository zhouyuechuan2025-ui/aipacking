import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function checkOpening(plan){
  const errors=[],o=plan.opening;
  if(!o||typeof o!=='object')return ['Missing plan.opening: new jobs require a designed 0–3s opening'];
  const finite=Number.isFinite,nonempty=s=>typeof s==='string'&&s.trim().length>0;
  if(!Array.isArray(o.range)||o.range.length!==2||o.range[0]!==0||o.range[1]!==3)errors.push('opening.range must be [0,3]');
  if(o.firstFrameDesigned!==true)errors.push('opening first frame must already be designed');
  if(!nonempty(o.semanticAnchor))errors.push('opening needs the actual script semantic anchor');
  const mechanisms=['foreground-occlusion','presenter-window-transform','object-morph','result-takeover','kinetic-type','case-montage','depth-parallax'];
  if(!Array.isArray(o.primaryTechniques)||!o.primaryTechniques.length||o.primaryTechniques.some(x=>!mechanisms.includes(x)))errors.push('opening needs supported main visual mechanisms; fade/drift alone does not qualify');
  if(!finite(o.peakAt)||o.peakAt<=0||o.peakAt>=3)errors.push('opening.peakAt must be inside the first 3 seconds');
  if(!finite(o.holdUntil)||!finite(o.peakAt)||o.holdUntil-o.peakAt<0.8||o.holdUntil>3)errors.push('opening needs at least 0.8s stable result hold after its peak, within 3s');
  if(!Array.isArray(o.beats)||!o.beats.length)errors.push('opening.beats must cover 0–3s');
  else{
    let cursor=0;
    for(const [i,b] of o.beats.entries()){
      if(!b||!finite(b.start)||!finite(b.end)||b.end<=b.start||b.start<0||b.end>3){errors.push(`opening beat ${i+1}: invalid time range`);continue;}
      if(Math.abs(b.start-cursor)>0.001)errors.push(`opening beat ${i+1}: gap, overlap or out-of-order time`);
      cursor=b.end;
      if(!nonempty(b.action))errors.push(`opening beat ${i+1}: missing concrete action`);
    }
    if(Math.abs(cursor-3)>0.001)errors.push('opening beats must end at 3s');
  }
  if(!nonempty(o.continuity))errors.push('opening needs its handoff into the body');
  if(!o.audio||!['original-only','configured'].includes(o.audio.status))errors.push('opening.audio.status must be original-only or configured');
  else if(o.audio.status==='original-only'&&!nonempty(o.audio.reason))errors.push('original-only audio needs an explicit reason');
  else if(o.audio.status==='configured'){
    if(!plan.audio||!Array.isArray(plan.audio.cues)||!plan.audio.cues.some(c=>nonempty(c.src)&&finite(c.at)&&c.at>=0&&c.at<3))errors.push('configured opening audio needs an actual cue in plan.audio.cues within 0–3s; verify files using mix-audio --check');
  }
  return errors;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=process.argv[2];
  if(!root||!path.isAbsolute(root))throw new Error('Provide the absolute workbench path');
  const plan=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8'));
  const errors=checkOpening(plan);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log('PASS: 0–3s opening plan declared; timeline, hold, continuity and audio status valid. Visual strength and human review remain unverified.');
}
