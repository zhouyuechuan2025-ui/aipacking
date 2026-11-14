import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
export function applyRhythmGate(root){
 if(!path.isAbsolute(root)||!fs.existsSync(path.join(root,'package.json')))throw Error('Existing absolute workbench root required');
 const scripts=path.join(root,'scripts');fs.mkdirSync(scripts,{recursive:true});const backup=path.join(root,'.skill-backups','rhythm-3.0.4-'+Date.now());fs.mkdirSync(backup,{recursive:true});
 const copy=(target,body)=>{if(fs.existsSync(target)){if(fs.readFileSync(target,'utf8')===body)return;fs.copyFileSync(target,path.join(backup,path.basename(target)))}fs.writeFileSync(target,body)};
 copy(path.join(scripts,'skill-check-motion-rhythm.mjs'),fs.readFileSync(path.join(here,'check-motion-rhythm.mjs'),'utf8'));
 const docs=path.join(root,'docs');fs.mkdirSync(docs,{recursive:true});copy(path.join(docs,'density-diversity.md'),fs.readFileSync(path.join(here,'../references/density-diversity.md'),'utf8'));
 const agents=path.join(root,'AGENTS.md'),agentText=fs.existsSync(agents)?fs.readFileSync(agents,'utf8'):'';if(!agentText.includes('私用密度与去重复 3.0.4'))copy(agents,agentText+'\n\n## 私用密度与去重复 3.0.4\n新稿先读 docs/density-diversity.md。每3–5秒有有效视觉变化；实际模板不相邻、全片最多2次，按源ID合并换肤与别名。不要忽略重复建议；不能用同一个人物窗+文字卡反复换字。scripts/skill-render-preflight.mjs 已接入导出入口，失败必须改分镜。自定义渲染入口也须先执行该检查。统计通过后仍要逐段实渲检查构图、文字和视觉相似。\n');
 copy(path.join(scripts,'skill-render-preflight.mjs'),`import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {checkMotionRhythm} from './skill-check-motion-rhythm.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),plan=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8')),r=checkMotionRhythm(plan);fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/rhythm-audit.json'),JSON.stringify(r,null,2));if(r.errors.length)throw Error('RENDER BLOCKED: density/diversity\\n'+r.errors.join('\\n'));console.log('Render gate PASS: '+r.actualTemplates+' actual templates; max gap '+r.maxVisualGap+'s');
`);
 const render=path.join(scripts,'render.mjs');if(fs.existsSync(render)){const src=fs.readFileSync(render,'utf8');if(!src.includes("import './skill-render-preflight.mjs'")){let body="import './skill-render-preflight.mjs';\n"+src;if(src.startsWith('#!')){const at=src.indexOf('\n');body=src.slice(0,at+1)+"import './skill-render-preflight.mjs';\n"+src.slice(at+1)}copy(render,body)}}
 const pkg=path.join(root,'package.json'),p=JSON.parse(fs.readFileSync(pkg,'utf8'));let changed=false;for(const [k,v]of Object.entries(p.scripts||{})){if(/^render(?::|$)/.test(k)&&!v.includes('skill-render-preflight')){p.scripts[k]='node scripts/skill-render-preflight.mjs && '+v;changed=true}}if(changed)copy(pkg,JSON.stringify(p,null,2)+'\n');
 console.log('Installed render-time density/diversity gate; originals backed up at',backup);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))applyRhythmGate(process.argv[2]);
