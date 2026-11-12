import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2),targetArg=args.find(x=>!x.startsWith('--'));
if(!targetArg){console.error('Usage: node apply-tech-pack.mjs <workbench absolute path> [--check]');process.exit(1);}
if(!path.isAbsolute(targetArg))throw new Error('Use an absolute workbench path');
const target=fs.realpathSync(targetArg),skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(target,p),'utf8');
const registry=read('src/custom/index.ts'),catalog=JSON.parse(read('docs/catalog.json'));
if(!Array.isArray(catalog)||!registry.includes('export const CUSTOM')||!registry.includes('CoverGrid'))throw new Error('Unsupported custom registry; do not patch automatically');
if(args.includes('--check')){console.log('Compatible aipacking workbench: '+target);process.exit(0);}
const techNames=['TechHero','TechBento','TechFlow'];
const imports="import { TechHero, TechBento, TechFlow } from './TechVisuals';";
let next=registry;
if(!next.includes(imports))next=imports+'\n'+next;
const declaration=/^export const CUSTOM[^=]*=\s*\{([^}]+)\}/m;
if(!declaration.test(next))throw new Error('Custom registry changed; inspect before patching');
next=next.replace(declaration,(match,body)=>{
  const current=body.split(',').map(x=>x.trim()).filter(Boolean);
  for(const name of techNames)if(!current.includes(name))current.push(name);
  return match.replace('{'+body+'}','{ '+current.join(', ')+' }');
});
const entries=techNames.map((type,i)=>({type,layout:'full',minDur:i===0?3:4,family:'generic',showsPerson:false,context:'科技艺术增强',description:'Frame-based multi-color tech art',limits:{title:18,maxItems:i===0?3:4}}));
const nextCatalog=[...catalog.filter(x=>!techNames.includes(x.type)),...entries];
const docs=fs.readFileSync(path.join(skill,'references/design-system.md'),'utf8');
const note='\n\n## 使用者科技艺术增强 v2\n本工作台已安装 TechHero、TechBento、TechFlow。新任务要求科技/艺术/丰富配色时，读取 docs/tech-art-v2.md；该用户授权范围内可使用主色+辅助色+点睛色及低对比弥散渐变，替代旧 director 中仅单强调色、禁止全部渐变的默认限制。其他安全区、原稿事实、可读性、人物原色与交付规则继续适用。旧模板不会自动换肤，新增模板以 props.preset 选配色。\n';
const agent=read('AGENTS.md');
const writes=[['src/custom/index.ts',next],['docs/catalog.json',JSON.stringify(nextCatalog,null,2)+'\n'],['src/custom/TechVisuals.tsx',fs.readFileSync(path.join(skill,'assets/TechVisuals.tsx'),'utf8')],['src/custom/tech-presets.ts',fs.readFileSync(path.join(skill,'assets/tech-presets.ts'),'utf8')],['docs/tech-art-v2.md',docs],['AGENTS.md',agent.includes('## 使用者科技艺术增强 v2')?agent:agent+note]];
const stamp=new Date().toISOString().replace(/[:.]/g,'-'),backup=path.join(target,'.skill-backups','tech-art-v2-'+stamp);
const changed=writes.filter(([p,t])=>!fs.existsSync(path.join(target,p))||read(p)!==t);
if(!changed.length){console.log('Already applied; no changes');process.exit(0);}
fs.mkdirSync(backup,{recursive:true});
const manifest=[];
for(const [p,t]of changed){const dest=path.join(target,p),existed=fs.existsSync(dest);if(existed){const old=path.join(backup,p);fs.mkdirSync(path.dirname(old),{recursive:true});fs.copyFileSync(dest,old);}manifest.push({path:p,existed,sha256:createHash('sha256').update(t).digest('hex')});}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify({version:'2.0.0',target,files:manifest},null,2));
for(const [p,t]of changed){fs.mkdirSync(path.dirname(path.join(target,p)),{recursive:true});fs.writeFileSync(path.join(target,p),t);}
console.log(`Applied v2: ${changed.length} files. Backup: ${backup}`);
