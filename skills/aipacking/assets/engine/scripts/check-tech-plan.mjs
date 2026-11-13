import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2];if(!root||!path.isAbsolute(root))throw new Error('Provide the absolute workbench path');
const plan=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8'));
const presets=['violet-tech','cyan-data','warm-tech','gallery-light'];
let checked=0;const errors=[];
for(const s of plan.scenes || []){
  if(!['TechHero','TechBento','TechFlow','TechPresenter','TechImpact','TechCollage','TechMontage'].includes(s.type))continue;
  checked++;const p=s.props || {};
  if(!presets.includes(p.preset))errors.push(`${s.id}: unknown/missing preset`);
  if(s.layout!=='full')errors.push(`${s.id}: enhanced template requires full layout`);
  if(!(s.end-s.start>=(s.type==='TechPresenter'?1.8:['TechHero','TechImpact'].includes(s.type)?3:4)))errors.push(`${s.id}: duration too short`);
  const titles=Array.isArray(p.title)?p.title:[p.title];
  if(titles.some(x=>typeof x!=='string'||!x.trim()))errors.push(`${s.id}: empty/non-string title`);
  if(titles.length>2 || !['TechHero','TechPresenter','TechImpact'].includes(s.type)&&titles.length!==1)errors.push(`${s.id}: unsupported title line count`);
  if(['TechImpact','TechCollage','TechMontage'].includes(s.type)){
    const media=p.media||[],max=s.type==='TechImpact'?2:s.type==='TechCollage'?3:4,min=s.type==='TechImpact'?0:s.type==='TechCollage'?1:2;
    if(!Array.isArray(media)||media.length<min||media.length>max)errors.push(`${s.id}: invalid media count`);
    else for(const m of media){if(!m.src||!['image','video'].includes(m.kind))errors.push(`${s.id}: invalid media kind/source`);else{const base=path.resolve(root,'public'),file=path.resolve(base,m.src);if(!file.startsWith(base+path.sep)||!fs.existsSync(file))errors.push(`${s.id}: media outside public or missing`);}if(m.offset!==undefined&&(!Number.isFinite(m.offset)||m.offset<0))errors.push(`${s.id}: invalid media offset`);}
    if(s.type==='TechMontage'&&((p.cutEvery!==undefined&&!(p.cutEvery>0))||(p.holdDuration!==undefined&&!(p.holdDuration>0))))errors.push(`${s.id}: invalid rhythm duration`);
    if(s.type==='TechCollage'&&(p.mode==='diagonal'&&media.length!==3||p.mode&&!['stack','diagonal'].includes(p.mode)))errors.push(`${s.id}: diagonal requires 3 media, or mode must be stack`);
    continue;
  }
  if(s.type==='TechPresenter'){
    if(!['push','focus','float','process','final'].includes(p.mode))errors.push(`${s.id}: unsupported presenter mode`);
    if(!Array.isArray(p.words||[])||(p.words||[]).length>3)errors.push(`${s.id}: invalid words`);
    else for(const x of p.words||[])if(typeof x.text!=='string'||!x.text.trim())errors.push(`${s.id}: empty word`);
    continue;
  }
  const items=p.items || [];const max=s.type==='TechPresenter'?1.8:s.type==='TechHero'?3:4;
  if(!Array.isArray(items)||items.length>max||s.type!=='TechHero'&&items.length<2)errors.push(`${s.id}: invalid item count; content would be omitted`);
  else for(const x of items){const title=typeof x==='string'?x:x?.title;if(typeof title!=='string'||!title.trim())errors.push(`${s.id}: invalid item title`);}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${checked} enhanced scenes; presets, layout, duration and item counts valid`);
