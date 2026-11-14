import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const idOf=s=>{
 const p=s.props||{};if(p.templateKey)return p.templateKey.split('--').at(-1);
 if(s.type==='MonetizeScene')return 'MonetizeScene/'+(p.mode||'cards');
 if(p.effect)return p.effect;
 if(p.design)return 'design/'+p.design;
 return s.type+(p.mode?'/'+p.mode:'');
};
const REFERENCE_STAGES=[{"id":"ref01","referenceStart":0,"referenceEnd":1.35,"family":"backstage","variant":"hero","chain":"opening"},{"id":"ref02","referenceStart":1.35,"referenceEnd":4.8,"family":"backstage","variant":"tasks","chain":"opening"},{"id":"ref03","referenceStart":4.8,"referenceEnd":7.75,"family":"backstage","variant":"results","chain":"opening"},{"id":"ref04","referenceStart":7.75,"referenceEnd":8.7,"family":"window","variant":"shrink","chain":"opening"},{"id":"ref05","referenceStart":8.7,"referenceEnd":10.9,"family":"evidence","variant":"profile","chain":"opening"},{"id":"ref06","referenceStart":10.9,"referenceEnd":13.25,"family":"evidence","variant":"metrics","chain":"opening"},{"id":"ref07","referenceStart":13.25,"referenceEnd":14.5,"family":"evidence","variant":"highlight","chain":"opening"},{"id":"ref08","referenceStart":14.5,"referenceEnd":17.15,"family":"evidence","variant":"highlight","chain":"opening"},{"id":"ref09","referenceStart":17.15,"referenceEnd":19.25,"family":"window","variant":"return","chain":"opening"},{"id":"ref18","referenceStart":41.25,"referenceEnd":43.5,"family":"evidence","variant":"article","chain":"methods"},{"id":"ref19","referenceStart":43.5,"referenceEnd":47.4,"family":"methods","variant":"four","chain":"methods"},{"id":"ref20","referenceStart":47.4,"referenceEnd":49.4,"family":"methods","variant":"merge","chain":"methods"},{"id":"ref21","referenceStart":49.4,"referenceEnd":53.95,"family":"cta","variant":"like","chain":"methods"},{"id":"ref22","referenceStart":53.95,"referenceEnd":57.2,"family":"backstage","variant":"wall","chain":"methods"},{"id":"ref23","referenceStart":57.2,"referenceEnd":60.17,"family":"cta","variant":"skill","chain":"methods"},{"id":"ref24","referenceStart":60.17,"referenceEnd":62.5,"family":"chapter","variant":"first","chain":"methods"},{"id":"ref25","referenceStart":62.5,"referenceEnd":69.5,"family":"input","variant":"typing","chain":"methods"},{"id":"ref26","referenceStart":69.5,"referenceEnd":72.47,"family":"evidence","variant":"article","chain":"methods"},{"id":"ref33","referenceStart":87.4,"referenceEnd":91.7,"family":"compare","variant":"steps","chain":"structure"},{"id":"ref34","referenceStart":91.7,"referenceEnd":94.8,"family":"chapter","variant":"second","chain":"structure"},{"id":"ref35","referenceStart":94.8,"referenceEnd":96.77,"family":"chart","variant":"interactive","chain":"structure"},{"id":"ref38","referenceStart":102.5,"referenceEnd":106.03,"family":"evidence","variant":"dashboard","chain":"report"},{"id":"ref39","referenceStart":106.03,"referenceEnd":109.4,"family":"compare","variant":"bars","chain":"report"},{"id":"ref40","referenceStart":109.4,"referenceEnd":114.5,"family":"evidence","variant":"report-full","chain":"report"},{"id":"ref41","referenceStart":114.5,"referenceEnd":117.53,"family":"evidence","variant":"split-report","chain":"report"},{"id":"ref42","referenceStart":117.53,"referenceEnd":124.3,"family":"chapter","variant":"third","chain":"report"},{"id":"ref45","referenceStart":135.57,"referenceEnd":140.5,"family":"compare","variant":"frames","chain":"examples"},{"id":"ref46","referenceStart":140.5,"referenceEnd":143.4,"family":"evidence","variant":"gallery","chain":"examples"},{"id":"ref47","referenceStart":143.4,"referenceEnd":148.4,"family":"evidence","variant":"formula","chain":"examples"},{"id":"ref48","referenceStart":148.4,"referenceEnd":152.5,"family":"evidence","variant":"gallery-full","chain":"examples"},{"id":"ref49","referenceStart":152.5,"referenceEnd":155.6,"family":"compare","variant":"books","chain":"examples"},{"id":"ref50","referenceStart":155.6,"referenceEnd":160.2,"family":"compare","variant":"depth","chain":"examples"},{"id":"ref51","referenceStart":160.2,"referenceEnd":162.5,"family":"cta","variant":"conclusion","chain":"examples"},{"id":"ref52","referenceStart":162.5,"referenceEnd":170.2,"family":"evidence","variant":"comments","chain":"delivery"},{"id":"ref53","referenceStart":170.2,"referenceEnd":173.8,"family":"gather","variant":"converge","chain":"delivery"},{"id":"ref54","referenceStart":173.8,"referenceEnd":176.1,"family":"evidence","variant":"report","chain":"delivery"},{"id":"ref55","referenceStart":176.1,"referenceEnd":179.5,"family":"evidence","variant":"code-full","chain":"delivery"},{"id":"ref56","referenceStart":179.5,"referenceEnd":185.1,"family":"pipeline","variant":"steps","chain":"delivery"},{"id":"ref57","referenceStart":185.1,"referenceEnd":187.5,"family":"cta","variant":"skill","chain":"delivery"},{"id":"ref58","referenceStart":187.5,"referenceEnd":195,"family":"cta","variant":"next","chain":"delivery"},{"id":"ref59","referenceStart":195,"referenceEnd":198.201,"family":"cta","variant":"follow","chain":"delivery"}];

// Unfold only real source-mapped reference stages. An arbitrary scene alias is
// never a new template; clipped pieces of one stage retain the same identity.
export function expandReferenceStages(input,fps=30){
 const scenes=[],errors=[];
 for(const s of input){
  const p=s.props||{};
  if(s.type!=='RefContinuity'){scenes.push(s);continue}
  if(p.study||!p.sourceCueIds?.length||!p.content||!p.stageMap?.length){errors.push(`${s.id}: production continuity needs current content, source cues and stageMap`);continue}
  let clock=s.start;
  for(const map of p.stageMap){
   const a=map.referenceStart,b=map.referenceEnd,len=map.frames/fps;
   if(!(b>a&&len>0)){errors.push(`${s.id}: invalid reference stage interval`);continue}
   const refs=REFERENCE_STAGES.filter(r=>r.chain===p.chain&&r.referenceEnd>a+.0001&&r.referenceStart<b-.0001);
   let covered=0;
   for(const ref of refs){
    const left=Math.max(a,ref.referenceStart),right=Math.min(b,ref.referenceEnd),start=clock+(left-a)/(b-a)*len,end=clock+(right-a)/(b-a)*len;
    covered+=right-left;const mode=ref.family+'/'+ref.variant,id='RefContinuity/'+mode;
    scenes.push({...s,id:s.id+'/'+ref.id,start,end,continuityGroup:s.id,props:{...p,mode},visual:{templateId:id,family:ref.family,layout:ref.family+'/'+ref.variant,contentClass:['article','report','dashboard','workflow'].includes(ref.family)?'interface':'spatial',inspirationId:ref.id},motionBeats:[{time:start,kind:'structural',action:ref.id+' source stage'},...(s.motionBeats||[]).filter(x=>x.time>start&&x.time<end)]});
   }
   if(Math.abs(covered-(b-a))>.04)errors.push(`${s.id}: stage range is not covered by the active source reference chain`);
   clock+=len;
  }
  if(Math.abs(clock-s.end)>1/fps+.002)errors.push(`${s.id}: stage frames do not equal actual scene duration`);
 }
 return{scenes:scenes.sort((a,b)=>a.start-b.start),errors};
}

export function checkMotionRhythm(plan){
 const expanded=expandReferenceStages(plan.scenes||[],plan.meta?.fps||30);
 const errors=[...expanded.errors],warnings=[],scenes=expanded.scenes,duration=plan.meta?.duration||0,counts={},families={},layouts={},classes={},times=[0];
 for(let i=0;i<scenes.length;i++){
  const s=scenes[i],v=s.visual||{},id=idOf(s),len=s.end-s.start;
  counts[id]=(counts[id]||0)+1;families[v.family||'UNDECLARED']=(families[v.family||'UNDECLARED']||0)+len;layouts[v.layout||'UNDECLARED']=(layouts[v.layout||'UNDECLARED']||0)+len;classes[v.contentClass||'UNDECLARED']=(classes[v.contentClass||'UNDECLARED']||0)+len;
  if(!v.templateId||!v.family||!v.layout||!v.contentClass||!v.inspirationId)errors.push(`${s.id}: missing actual visual identity/grammar/layout/content class`);
  if(v.templateId&&v.templateId.split('--').at(-1)!==id)errors.push(`${s.id}: declared identity differs from dispatched component (${id})`);
  if(i&&idOf(scenes[i-1])===id)errors.push(`${s.id}: adjacent actual template repeats ${id}`);
  if(i&&!(s.continuityGroup&&s.continuityGroup===scenes[i-1].continuityGroup)&&v.family&&scenes[i-1].visual?.family===v.family)errors.push(`${s.id}: adjacent visual grammar repeats ${v.family}`);
  if(i&&!(s.continuityGroup&&s.continuityGroup===scenes[i-1].continuityGroup)&&v.layout&&scenes[i-1].visual?.layout===v.layout)errors.push(`${s.id}: adjacent spatial structure repeats ${v.layout}`);
  const beats=s.motionBeats?.length?s.motionBeats:[{time:s.start,kind:'structural',action:'scene switch'}];
  for(const b of beats){if(b.time<s.start-.034||b.time>=s.end+.034)errors.push(`${s.id}: motion beat outside scene`);if(!['structural','object-reorder','presenter-takeover','operation-result','materialize'].includes(b.kind))errors.push(`${s.id}: decorative action cannot count as a new visual state`);else times.push(b.time)}
 }
 for(const [id,n]of Object.entries(counts))if(n>2)errors.push(`actual template ${id} repeats ${n} times (max 2)`);
 const distinct=Object.keys(counts).length,min=duration>=90?14:Math.ceil(duration/6);if(distinct<min)errors.push(`only ${distinct} actual templates; require at least ${min}`);
 times.push(duration);const sorted=[...new Set(times.map(x=>Math.round(x*1000)/1000))].sort((a,b)=>a-b),gaps=sorted.slice(1).map((t,i)=>({start:sorted[i],end:t,duration:+(t-sorted[i]).toFixed(3)}));
 for(const g of gaps)if(g.duration>5.035)errors.push(`no effective visual change for ${g.duration}s at ${g.start}–${g.end}`);
 if(duration>=90){if(Object.keys(families).filter(x=>x!=='UNDECLARED').length<8)errors.push('fewer than 8 actual visual grammars');for(const k of ['text','card'])if((classes[k]||0)/duration>.25)errors.push(`${k} occupies >25%`);if(['diagram','interface','spatial'].reduce((n,k)=>n+(classes[k]||0),0)/duration<.35)errors.push('diagram/interface/spatial material expression occupies <35%');for(const [k,t]of Object.entries(layouts))if(t/duration>.30)errors.push(`spatial structure ${k} dominates ${(100*t/duration).toFixed(1)}%`)}
 return{status:errors.length?'FAIL':'PASS',errors,warnings,duration,scenes:scenes.length,actualTemplates:distinct,counts,families,layouts,classes,visualChangeGaps:gaps,maxVisualGap:Math.max(0,...gaps.map(x=>x.duration)),validationScope:'Plan coverage and dispatched identity; rendered similarity, source fidelity and aesthetic acceptance require visual review'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url))){const root=process.argv[2];if(!root||!path.isAbsolute(root))throw Error('Absolute project directory required');const p=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8')),r=checkMotionRhythm(p);fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/rhythm-audit.json'),JSON.stringify(r,null,2));console.log(r.status,`${r.scenes} scenes; ${r.actualTemplates} actual templates; maximum gap ${r.maxVisualGap}s`);if(r.errors.length){console.error(r.errors.join('\n'));process.exitCode=1}}
