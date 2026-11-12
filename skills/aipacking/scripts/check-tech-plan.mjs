import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2];if(!root||!path.isAbsolute(root))throw new Error('Provide the absolute workbench path');
const plan=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8'));
const presets=['violet-tech','cyan-data','warm-tech','gallery-light'];
let checked=0;const errors=[];
for(const s of plan.scenes || []){
  if(!['TechHero','TechBento','TechFlow'].includes(s.type))continue;
  checked++;const p=s.props || {};
  if(!presets.includes(p.preset))errors.push(`${s.id}: unknown/missing preset`);
  if(s.layout!=='full')errors.push(`${s.id}: enhanced template requires full layout`);
  if(!(s.end-s.start>=(s.type==='TechHero'?3:4)))errors.push(`${s.id}: duration too short`);
  const titles=Array.isArray(p.title)?p.title:[p.title];
  if(titles.some(x=>typeof x!=='string'||!x.trim()))errors.push(`${s.id}: empty/non-string title`);
  if(titles.length>2 || s.type!=='TechHero'&&titles.length!==1)errors.push(`${s.id}: unsupported title line count`);
  const items=p.items || [];const max=s.type==='TechHero'?3:4;
  if(!Array.isArray(items)||items.length>max||s.type!=='TechHero'&&items.length<2)errors.push(`${s.id}: invalid item count; content would be omitted`);
  else for(const x of items){const title=typeof x==='string'?x:x?.title;if(typeof title!=='string'||!title.trim())errors.push(`${s.id}: invalid item title`);}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${checked} enhanced scenes; presets, layout, duration and item counts valid`);
