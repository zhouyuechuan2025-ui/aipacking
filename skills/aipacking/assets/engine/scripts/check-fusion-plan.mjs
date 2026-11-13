import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const home=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),registry=JSON.parse(fs.readFileSync(path.join(home,'assets/fusion-source-registry.json'),'utf8'));
export function checkFusionPlan(plan,{registry:reg=registry,root=null,showcase=false}={}){
 const errors=[],groups={base2:0,reference:0,shotcraftExpanded:0,snapcn:0,other:0},dispatch=[];
 const ids=reg.batches.map(b=>new Set(b.ids)),source=root&&fs.existsSync(path.join(root,'src/custom/index.ts'))?fs.readFileSync(path.join(root,'src/custom/index.ts'),'utf8'):'';
 for(const s of plan.scenes||[]){const p=s.props||{};let group='other';if((reg.rejectedTemplates||[]).includes(p.templateKey?.split('--').at(-1))||(reg.rejectedTemplates||[]).includes(s.type))errors.push(s.id+': User removed template '+(p.templateKey||s.type));
  if(reg.rejectedRoutes.includes(s.type)||new RegExp('\\b'+String(s.type).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*:\\s*(DenseStage|ReferenceProduction|MonetizeScene)\\b').test(source))errors.push(s.id+': rejected approximation route '+s.type);
  if(reg.baseComponents.includes(s.type))group='base2';
  if(reg.referenceComponents.includes(s.type)){group='reference';if(s.type==='RefContinuity'&&p.theme!=='light')errors.push(s.id+': scoped non-black reference theme required');if(!showcase&&(p.study!==false||!p.sourceCueIds?.length))errors.push(s.id+': actual source binding required; study content is not a production scene')}
  if(s.type==='WorkbenchNative'){const id=p.templateKey?.split('--').at(-1);if(ids[0].has(id))group='shotcraftExpanded';if(ids[1].has(id))group='snapcn';if(!showcase&&(p.study!==false||!p.contentVerified||!p.sourceCueIds?.length))errors.push(s.id+': actual native template content and media review required')}
  groups[group]++;dispatch.push({scene:s.id,type:s.type,templateKey:p.templateKey||null,chain:p.chain||null,group,personMode:p.personMode||'component-owned'});
 }
 if(plan.claimsFusion===true){for(const k of(reg.requiredFusionGroups||['base2','reference','shotcraftExpanded','snapcn']))if(!groups[k])errors.push('Claimed fusion is missing actual dispatched source group: '+k)}
 if(!dispatch.length)errors.push('No actual scenes');
 return{status:errors.length?'FAIL':'PASS',errors,groups,dispatch,scope:showcase?'source capability showcase, not a completed talking-head package':'source dispatch and binding only; rendered content, palette, rhythm and aesthetics require review',personPresenceQuota:null};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const root=process.argv[2];if(!root||!path.isAbsolute(root))throw Error('Absolute project root required');const p=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8')),r=checkFusionPlan(p,{root,showcase:process.argv.includes('--showcase')});fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/fusion-source-audit.json'),JSON.stringify(r,null,2));console.log(r.status,JSON.stringify(r.groups));if(r.errors.length){console.error(r.errors.join('\n'));process.exitCode=1}}
