import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const [target] = process.argv.slice(2);
if (!target || !path.isAbsolute(target)) throw new Error('用法：node new-workbench.mjs <新作业的绝对路径>');
if (fs.existsSync(target)) throw new Error('只允许新目录，现有工程不会被覆盖。');
const here = path.dirname(fileURLToPath(import.meta.url));
const seed = path.resolve(here, '../assets/remotion-host-2.0');
fs.mkdirSync(target);
for (const entry of fs.readdirSync(seed)) fs.cpSync(path.join(seed,entry),path.join(target,entry),{recursive:true,errorOnExist:true,force:false});
fs.mkdirSync(path.join(target,'public/input'),{recursive:true});
execFileSync(process.execPath,[path.join(here,'install-review.mjs'),target,'--apply'],{stdio:'inherit'});
console.log('已创建独立的原版 2.0 工作台副本。安装 npm 依赖后，把 MP4 和 SRT 放入 public/input。');
