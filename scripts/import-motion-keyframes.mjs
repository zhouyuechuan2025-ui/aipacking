import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const [animate, magic] = process.argv.slice(2);
const host = path.resolve('skills/aipacking/assets/remotion-host-2.0');
const output = path.join(host, 'src/motion');
const magicNames = new Set([
  'puffIn','puffOut','vanishIn','vanishOut','boingInUp','boingOutDown',
  'swap','twisterInDown','twisterInUp','foolishIn','swashIn','swashOut',
  'spaceInDown','spaceInLeft','spaceInRight','spaceInUp',
  'perspectiveDownReturn','perspectiveLeftReturn','perspectiveRightReturn','perspectiveUpReturn',
  'openDownLeftReturn','openUpRightReturn','tinDownIn','tinRightIn',
]);
const sources = [
  {dir:animate, file:'animate.css', prefix:'animate', revision:'4aa415199dd4ed7d877d10343e745e8bbb4b7a0c'},
  {dir:magic, file:'dist/magic.css', prefix:'magic', revision:'f26d3c3beaf3017c90fb27ac6f67168fac26de06', names:magicNames},
];

function extract(css) {
  const all = [];
  for (const m of css.matchAll(/^@keyframes (\w+) \{\n([\s\S]*?)^\}/gm)) {
    all.push([m[1], m[0]]);
  }
  return all;
}

const motion = {};
const css = [];
fs.mkdirSync(output,{recursive:true});
for (const source of sources) {
  const sha = execFileSync('git',['-C',source.dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
  if (sha !== source.revision) throw new Error('Unexpected source revision: ' + sha);
  const input = fs.readFileSync(path.join(source.dir,source.file),'utf8').replace(/\r\n/g,'\n');
  const entries = extract(input).filter(([name]) => !source.names || source.names.has(name));
  if (entries.length !== (source.names?.size ?? 97)) throw new Error('Unexpected source keyframe count: '+source.prefix);
  for (const [name, block] of entries) {
    const id = source.prefix + '-' + name;
    const category = /Out/.test(name) || name === 'hinge' ? 'exit' : /In|Return|^slide|^back/.test(name) ? 'entry' : 'emphasis';
    const family = name.match(/^[a-z]+/)?.[0] ?? name;
    const restricted = /^(flash|bounce|shake|wobble|hinge|jello|tada|rubberBand|heartBeat|lightSpeed|boing|twister|foolish|tin)|Big/.test(name);
    const easing = name === 'flip' || /^flipIn|^flipOut|^lightSpeedIn/.test(name) ? 'ease-in' : /^lightSpeedOut/.test(name) ? 'ease-out' : name === 'pulse' || name === 'heartBeat' ? 'ease-in-out' : 'ease';
    motion[id] = {source:source.prefix,name,category,family,restricted,easing};
    css.push(block.replace('@keyframes ' + name, '@keyframes ap-' + id));
  }
  const license = fs.readFileSync(path.join(source.dir,'LICENSE'),'utf8').replace(/\r\n/g,'\n');
  fs.writeFileSync(path.join(host,'licenses',source.prefix+'-keyframes.txt'),license);
}
fs.writeFileSync(path.join(output,'keyframes.css'),'/* MIT keyframes from Animate.css and Magic CSS. See licenses. */\n'+css.join('\n\n')+'\n');
fs.writeFileSync(path.join(output,'keyframes.json'),JSON.stringify(motion,null,2)+'\n');
