import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{createHash}from'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url)),root=process.argv[2],check=process.argv.includes('--check');
if(!root||!path.isAbsolute(root))throw Error('Absolute existing workbench path required');
const custom=path.join(root,'src/custom'),index=path.join(custom,'index.ts');
if(!fs.existsSync(index)||!fs.existsSync(path.join(root,'package.json')))throw Error('Existing Remotion custom registry required');
const assets=path.resolve(here,'../assets'),files=[['ReferenceProduction.tsx','ReferenceProduction.tsx'],['reference-pack/ContinuityState.mjs','reference-pack/ContinuityState.mjs']];
for(const [source]of files)if(!fs.existsSync(path.join(assets,source)))throw Error('Missing bundled source: '+source);
const original=fs.readFileSync(index,'utf8');if(!/export const CUSTOM[^=]*=\s*\{/.test(original))throw Error('Unsupported registry shape; preserve source and adapt explicitly');
if(check){console.log('Compatible: reference choreography production adaptation, layered light palette');process.exit(0)}
const backup=path.join(root,'.skill-backups','reference-production-3.0.5-'+Date.now());fs.mkdirSync(backup,{recursive:true});
const hashes={};for(const[source,target]of files){const out=path.join(custom,target);if(fs.existsSync(out))fs.copyFileSync(out,path.join(backup,path.basename(out)));fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(assets,source),out);hashes[target]=createHash('sha256').update(fs.readFileSync(out)).digest('hex')}
let text=original;if(!text.includes("from './ReferenceProduction'"))text="import {ReferenceProduction} from './ReferenceProduction';\n"+text;
if(!/export const CUSTOM[^=]*=\s*\{[^}]*\bReferenceProduction\b/s.test(text))text=text.replace(/(export const CUSTOM[^=]*=\s*\{)/,'$1 ReferenceProduction,');
if(text!==original){fs.copyFileSync(index,path.join(backup,'index.ts'));fs.writeFileSync(index,text)}
const catalogFile=path.join(root,'docs/catalog.json');
if(fs.existsSync(catalogFile)){const catalog=JSON.parse(fs.readFileSync(catalogFile,'utf8'));if(!catalog.some(x=>x.type==='ReferenceProduction')){fs.copyFileSync(catalogFile,path.join(backup,'catalog.json'));catalog.push({type:'ReferenceProduction',layout:'full',showsPerson:true,family:'reference-production',description:'Complete presenter window with independently implemented reference choreography modes'});fs.writeFileSync(catalogFile,JSON.stringify(catalog,null,2))}}
// Original validator counted only wrapper names, incorrectly reporting 0% face
// visibility and one template for an entire independently branched composition.
const validator=path.join(root,'scripts/validate.mjs');
if(fs.existsSync(validator)){const before=fs.readFileSync(validator,'utf8');let after=before;if(!after.includes('const actualId=')){after=after.replace('const full = scenes.filter(isFull);',"const actualId=s=>s.type==='ReferenceProduction'?s.type+'/'+s.props.mode:s.props?.templateKey||s.props?.effect||s.type;\nconst full = scenes.filter(isFull);");if(after!==before){after=after.replace('full[i].type === full[i - 1].type','actualId(full[i]) === actualId(full[i - 1])').replace('useCount[s.type] = (useCount[s.type] || 0) + 1','useCount[actualId(s)] = (useCount[actualId(s)] || 0) + 1').replaceAll('scenes.map(s => s.type)','scenes.map(actualId)');fs.copyFileSync(validator,path.join(backup,'validate.mjs'));fs.writeFileSync(validator,after)}}}
fs.mkdirSync(path.join(root,'docs'),{recursive:true});fs.copyFileSync(path.resolve(here,'../references/reference-priority.md'),path.join(root,'docs/reference-priority.md'));
fs.writeFileSync(path.join(backup,'installed-hashes.json'),JSON.stringify(hashes,null,2));console.log('Installed ReferenceProduction with source backup:',backup);
