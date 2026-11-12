// 素材分析：读 public/input 下的视频和 SRT，输出 plan/meta.json、plan/subs.json、plan/frames/*.jpg
// 用法：node scripts/prepare.mjs [视频文件名] [字幕文件名]
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inDir = path.join(root, 'public', 'input');
const planDir = path.join(root, 'plan');
fs.mkdirSync(path.join(planDir, 'frames'), { recursive: true });

const files = fs.readdirSync(inDir);
const video = process.argv[2] || files.find(f => /\.(mp4|mov|m4v|webm)$/i.test(f));
const srt = process.argv[3] || files.find(f => /\.srt$/i.test(f));
if (!video || !srt) { console.error('✗ 请把口播视频（mp4/mov）和字幕（srt）放到 public/input/ 里'); process.exit(1); }

// ---- video info
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', path.join(inDir, video)]).toString());
const vs = probe.streams.find(s => s.codec_type === 'video');
const [num, den] = vs.r_frame_rate.split('/').map(Number);
const fps = Math.round(num / den) || 30;
const duration = +(+probe.format.duration).toFixed(3);
let width = vs.width, height = vs.height;
const rot = +(vs.tags?.rotate || vs.side_data_list?.find(d => d.rotation != null)?.rotation || 0);
if (Math.abs(rot) === 90) [width, height] = [height, width];

// ---- subtitles
const toSec = s => { const [h, m, rest] = s.trim().replace(',', '.').split(':'); return +h * 3600 + +m * 60 + +rest; };
const raw = fs.readFileSync(path.join(inDir, srt), 'utf8').replace(/^﻿/, '').replace(/\r/g, '');
const subs = raw.split(/\n\s*\n/).map(b => b.trim().split('\n')).filter(l => l.length >= 2 && l.some(x => x.includes('-->')))
  .map(l => { const i = l.findIndex(x => x.includes('-->')); const [a, b] = l[i].split('-->'); return [+toSec(a).toFixed(3), +toSec(b).toFixed(3), l.slice(i + 1).join(' ').trim()]; });
fs.writeFileSync(path.join(planDir, 'subs.json'), JSON.stringify(subs, null, 0));

// ---- reference frames for the agent to look at (layout / face / burned subtitles)
const shots = [0.15, 0.35, 0.55, 0.75].map(r => +(duration * r).toFixed(2));
shots.forEach((t, i) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', path.join(inDir, video), '-frames:v', '1', '-vf', 'scale=960:-1', path.join(planDir, 'frames', `ref_${i}.jpg`)]));

const meta = { video: `input/${video}`, srt: `input/${srt}`, fps, width, height, duration, subtitleCount: subs.length, words: subs.reduce((n, s) => n + s[2].length, 0) };
fs.writeFileSync(path.join(planDir, 'meta.json'), JSON.stringify(meta, null, 2));

// ---- transcript for the director (with timings)
const lines = subs.map(([a, b, t], i) => `${String(i + 1).padStart(3, '0')}  ${a.toFixed(2)}–${b.toFixed(2)}  ${t}`).join('\n');
fs.writeFileSync(path.join(planDir, 'transcript.txt'), lines + '\n');

console.log(`✓ 视频 ${video}  ${width}x${height} @${fps}fps  ${duration}s`);
console.log(`✓ 字幕 ${subs.length} 句 → plan/subs.json、plan/transcript.txt`);
console.log(`✓ 参考帧 → plan/frames/ref_0..3.jpg（请查看人物位置、是否已烧录字幕、名牌位置）`);
