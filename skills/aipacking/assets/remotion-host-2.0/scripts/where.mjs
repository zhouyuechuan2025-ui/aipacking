// 使用者说「第几秒怎么改」时，查那一刻是哪一页、在说哪句话
// 用法：node scripts/where.mjs 23  1:05  01:12.5  "1分12秒"
import fs from 'fs';
import { resolvePlan } from '../src/lib/anchors.ts';

const subs = JSON.parse(fs.readFileSync('plan/subs.json', 'utf8'));
const plan = resolvePlan(JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')), subs);
const catalog = new Map(JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).map(c => [c.type, c]));
const isFull = s => (s.layout || catalog.get(s.type)?.layout || 'full').startsWith('full');

const parse = str => {
  const m = String(str).replace(/分/, ':').replace(/秒/, '').trim().split(':').map(Number);
  return m.length === 2 ? m[0] * 60 + m[1] : m[0];
};
const fmt = t => { const d = Math.round(t * 10); return `${String(Math.floor(d / 600)).padStart(2, '0')}:${((d % 600) / 10).toFixed(1).padStart(4, '0')}`; };
const scenes = [...plan.scenes].sort((a, b) => a.start - b.start);
const label = s => `${s.id}（第 ${scenes.indexOf(s) + 1} 页，${s.type}，${isFull(s) ? '全屏' : '叠在人物上'}，${fmt(s.start)}–${fmt(s.end)}）`;

const args = process.argv.slice(2);
if (!args.length) { console.error('用法：node scripts/where.mjs 23 1:05'); process.exit(1); }
for (const a of args) {
  const t = parse(a);
  if (!(t >= 0)) { console.log(`✗ 看不懂的时间：${a}`); continue; }
  const sub = subs.find(s => t >= s[0] && t < s[1]) || subs.reduce((b, s) => Math.abs(s[0] - t) < Math.abs(b[0] - t) ? s : b);
  const on = scenes.filter(s => t >= s.start && t < s.end);
  console.log(`\n■ ${fmt(t)}  说的是：「${sub[2]}」（${fmt(sub[0])}–${fmt(sub[1])}）`);
  if (on.length) on.forEach(s => console.log(`  正在显示 → ${label(s)}`));
  else {
    const prev = [...scenes].reverse().find(s => s.end <= t), next = scenes.find(s => s.start > t);
    console.log('  这一刻没有包装（只有人物画面）→ 漏了，在这里补一页');
    if (prev) console.log(`  前一页 ${label(prev)}，${(t - prev.end).toFixed(1)} 秒前结束`);
    if (next) console.log(`  后一页 ${label(next)}，${(next.start - t).toFixed(1)} 秒后开始`);
  }
}
