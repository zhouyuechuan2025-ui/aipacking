import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {CHAIN_RANGES} from '../src/custom/reference-motion/ContinuityState.mjs';
export function checkPlan(plan,root,{checkFiles=true}={}){
 const errors=[],fps=plan.meta?.fps||30;
 const safeFile=(file)=>{if(typeof file!=='string'||!file||path.isAbsolute(file)||file.split(/[\\/]/).includes('..')||/^https?:/i.test(file))return false;return !checkFiles||fs.existsSync(path.join(root,'public',file))};
 let count=0;
 for(const s of plan.scenes||[]){if(!['ContinuityPage','ContinuityOverlay'].includes(s.type))continue;count++;const p={...(s.props||{}),...(s.type==='ContinuityOverlay'?{personMode:'hidden'}:{})},c=p.content||{},prefix=s.id+': ',add=x=>errors.push(prefix+x),range=CHAIN_RANGES[p.chain];
  if(fps!==30)add('Continuity pack currently requires 30 fps');
  if(!range){add('Unknown chain');continue}if(p.study!==false)add('Production requires study:false');
  if(!p.sourceCueIds?.length||p.sourceCueIds.some(n=>!Number.isInteger(n)||n<1))add('Bind actual current SRT cue IDs');
  if(!Array.isArray(p.stageMap)||!p.stageMap.length){add('Missing explicit stageMap');continue}
  let total=0,previous;for(const a of p.stageMap){if(!Number.isInteger(a.frames)||a.frames<1)add('Stage duration must be positive integer frames');if(!Number.isFinite(a.referenceStart)||!Number.isFinite(a.referenceEnd)||!(a.referenceStart<a.referenceEnd)||a.referenceStart<range[0]-.001||a.referenceEnd>range[1]+.001)add('Stage outside chain or backwards');if(previous!==undefined&&Math.abs(previous-a.referenceStart)>.035)add('Reference stage discontinuity: keep shared-object chain intact');previous=a.referenceEnd;total+=a.frames}
  if(total!==Math.round(s.end*fps)-Math.round(s.start*fps))add('stageMap frame sum must equal actual scene frames');
  if(!safeFile(p.video||plan.meta?.video))add('Current presenter file missing or unsafe path');
  if(!Number.isInteger(p.sourceStart)||p.sourceStart<0||!Number.isInteger(p.sourceFrames)||p.sourceStart+total>p.sourceFrames)add('Source clock outside verified current media frames');
  const intersects=(a,b)=>p.stageMap.some(q=>q.referenceStart<b&&q.referenceEnd>a);
  const requireFields=(fields)=>fields.forEach(k=>{const v=c[k];if(v===undefined||v===null||v===''||(Array.isArray(v)&&!v.length))add('Missing current content.'+k)});
  if(intersects(0,1.35))requireFields(['hero']);
  if(intersects(1.35,7.75))requireFields(['tasks','metric','metricLabel']);
  if(intersects(7.75,17.15)||intersects(41.25,47.4)||intersects(119.2,124.3)){if(!c.article?.author||!c.article?.paragraphs?.length)add('Current evidence article required; never leak study Karpathy text')}
  if(intersects(8.7,10.9))requireFields(['author','role']);if(intersects(10.9,13.25))requireFields(['views','viewsLabel']);if(intersects(17.15,19.25))requireFields(['emphasis']);
  if(intersects(43.5,49.4))requireFields(['methods']);if(intersects(53.95,57.2))requireFields(['wall']);if(intersects(60.17,72.47))requireFields(['chapters','prompt']);if(intersects(91.7,96.77)||intersects(117.53,124.3))requireFields(['chapters']);
  if(intersects(87.4,91.7))requireFields(['comparisonSteps']);if(intersects(94.8,96.77))requireFields(['data']);if(intersects(102.5,106.03))requireFields(['dashboardTitle']);
  if(intersects(109.4,117.53)||intersects(173.8,176.1)){if(!c.report?.title||!c.report?.results?.length||!c.report?.decisions?.length)add('Current report title/results/decisions required')}
  if(intersects(135.57,140.5))requireFields(['frameCount']);if(intersects(140.5,152.5)){requireFields(['galleryTitles','videos','videoFrames']);if(c.videos?.length!==4||c.videos.some(v=>!safeFile(v)))add('Four actual local example clips required');if(c.videoFrames?.length!==4||c.videoFrames.some(n=>!Number.isInteger(n)||n<1))add('Verified example clip frame counts required')}
  if(intersects(135.57,140.5)){if(c.videos?.length!==4||c.videos.some(v=>!safeFile(v))||c.videoFrames?.length!==4)add('Current frame comparison clips and verified frame counts required')}if(intersects(162.5,170.2)){requireFields(['comments']);if(!safeFile(c.commentVideo)||!Number.isInteger(c.commentVideoFrames)||c.commentVideoFrames<1)add('Current comment example video required')}if(intersects(170.2,173.8))requireFields(['sources']);if(intersects(176.1,179.5)&&!safeFile(c.repoImage))add('Real current GitHub screenshot required');if(intersects(179.5,185.6))requireFields(['steps','stepNotes','parts']);if(intersects(187.5,195))requireFields(['next']);
  if(intersects(57.2,60.17)||intersects(170.2,173.8)||intersects(185.1,187.5))requireFields(['productTitle','productNote']);
  if(p.personMode!=='hidden'&&(intersects(0,7.75)||intersects(17.15,19.25)||intersects(53.95,57.2))){if(!p.matte||p.matteFrames<p.sourceStart+total||p.matteQa?.alphaChecked!==true||p.matteQa?.faceChecked!==true)add('Current source matte files and alpha/face QA required');if(checkFiles&&p.matte){for(let f=p.sourceStart;f<p.sourceStart+total;f++){if(!safeFile(`${p.matte}/f_${String(f+1).padStart(4,'0')}.png`)){add('Missing current source foreground frame '+(f+1));break}}}}
 }
 return {count,errors};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url))){const root=process.argv[2];if(!root||!path.isAbsolute(root))throw Error('Pass absolute current workbench root');const result=checkPlan(JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8')),root);if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1}else console.log(`PASS: ${result.count} continuous scenes; current text/media clocks bound. Visual acceptance remains separate.`)}
