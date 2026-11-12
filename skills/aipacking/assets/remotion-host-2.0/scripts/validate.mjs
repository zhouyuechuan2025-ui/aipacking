// 分镜体检：检查 plan/plan.json 的结构、时间、节奏和露脸比例
import fs from 'fs';
import { resolvePlan } from '../src/lib/anchors.ts';
const anchorIssues = [];
const plan = resolvePlan(JSON.parse(fs.readFileSync('plan/plan.json', 'utf8')), JSON.parse(fs.readFileSync('plan/subs.json', 'utf8')), anchorIssues);
const catalog = JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8'));
const custom = [...fs.readFileSync('src/custom/index.ts', 'utf8').matchAll(/CUSTOM[^=]*=\s*\{([^}]*)\}/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(':')[0]).filter(Boolean));
const STYLES = [...fs.readFileSync('src/lib/theme.ts', 'utf8').matchAll(/^  '?([a-z-]+)'?: \{ \.\.\.base, id:/gm)].map(m => m[1]);
const known = new Map(catalog.map(c => [c.type, c]));
const D = plan.meta?.duration; const err = [], warn = [];
if (!D) err.push('meta.duration 缺失（运行 npm run prepare-input 后从 plan/meta.json 抄过来）');
anchorIssues.forEach(a => err.push(`${a.scene}: ${a.path}="${a.word}" ${a.reason}（换一个原句里的词，或直接写秒数）`));
const chkStyle =(v, where) => { if (v && !STYLES.includes(v)) err.push(`${where}: 未知风格 ${v}（可选：${STYLES.join(' / ')}）`); };
chkStyle(plan.style, 'plan.style');
for (const k of ['main', 'alert']) { const v = plan.palette?.[k]; if (v !== undefined && !/^#[0-9a-fA-F]{6}$/.test(v)) err.push(`palette.${k}="${v}" 要写成 6 位十六进制颜色，例如 #E8590C`); }
if (!plan.palette?.main) warn.push('没有设置 palette.main：按 docs/director.md 4.1 节，根据视频主题选一个强调色'); (plan.chapters || []).forEach((c, i) => chkStyle(c.style, `chapters[${i}].style`));
const scenes = [...(plan.scenes || [])].sort((a, b) => a.start - b.start);
const ids = new Set();
const isFull = s => (s.layout || known.get(s.type)?.layout || 'full').startsWith('full');
for (const s of scenes) {
  if (ids.has(s.id)) err.push(`${s.id}: id 重复`); ids.add(s.id);
  if (!known.has(s.type) && !custom.includes(s.type)) err.push(`${s.id}: 未知页面类型 ${s.type}（不在 docs/catalog.json，也没注册到 src/custom/index.ts）`);
  chkStyle(s.style, s.id);
  if (['rays', 'prism', 'tunnel'].includes(s.bg?.variant)) err.push(`${s.id}: 背景 ${s.bg.variant} 已禁用（射线/镭射类，用户不要），可选 aurora / silk / nebula / grid`);
  if (!(s.end > s.start)) err.push(`${s.id}: end 必须大于 start`);
  if (s.start < 0 || s.end > D + 0.05) err.push(`${s.id}: 时间超出视频范围 0–${D}`);
  const len = s.end - s.start;
  // 字数上限（规格卡 limits）：中文按 1 个单位、英文数字按 0.5 个单位算
  const lim = known.get(s.type)?.limits;
  if (lim) {
    const units = t => [...String(t ?? '')].reduce((n, ch) => n + (/[⺀-鿿＀-￯]/.test(ch) ? 1 : 0.5), 0);
    const P = s.props || {};
    if (lim.title && units(P.title) > lim.title) err.push(`${s.id}: 标题「${P.title}」超过 ${lim.title} 个字，精简一下`);
    if (lim.subtitle && units(P.subtitle) > lim.subtitle) err.push(`${s.id}: 副标题「${P.subtitle}」超过 ${lim.subtitle} 个字`);
    if (lim.maxItems && (P.items || []).length > lim.maxItems) err.push(`${s.id}: 要点最多 ${lim.maxItems} 条（现在 ${(P.items || []).length} 条）`);
    for (const it of P.items || []) if (lim.item && units(it) > lim.item) err.push(`${s.id}: 要点「${it}」超过 ${lim.item} 个字`);
  }
  const minDur = known.get(s.type)?.minDur;
  if (minDur && len < minDur - 0.01) err.push(`${s.id}: ${s.type} 至少要 ${minDur}s（现在 ${len.toFixed(1)}s），太短动画播不完；换一个简单点的模板，或把这页延长到下一句`);
  else if (isFull(s) && len < 1.2 && s.type !== 'ChapterBreak') warn.push(`${s.id}: 全屏页只有 ${len.toFixed(1)}s，观众可能看不清（建议 ≥1.5s）`);
  if (isFull(s) && len > 8) warn.push(`${s.id}: 全屏页 ${len.toFixed(1)}s 偏长，考虑拆成两页或中间换镜头`);
  const walk = (o, path) => { if (!o || typeof o !== 'object') return; for (const [k, v] of Object.entries(o)) {
    if ((k === 'at' || k.endsWith('At')) && typeof v === 'number' && (v < s.start - 0.01 || v > s.end + 0.01)) warn.push(`${s.id}: ${path}${k}=${v} 不在本页时间 ${s.start}–${s.end} 内（at 用的是整条视频的绝对秒）`);
    walk(v, `${path}${k}.`); } };
  walk(s.props, '');
}
const full = scenes.filter(isFull);
for (let i = 1; i < full.length; i++) {
  if (full[i].start < full[i - 1].end - 0.01) err.push(`${full[i - 1].id} 与 ${full[i].id}: 全屏页时间重叠`);
  if (full[i].type === full[i - 1].type && Math.abs(full[i].start - full[i - 1].end) < 0.2 && !['Versus'].includes(full[i].type)) warn.push(`${full[i - 1].id}→${full[i].id}: 连续两页都是 ${full[i].type}，建议换一种模板`);
}
// 全程都要有包装（docs/director.md 2 节）：任何超过 0.5 秒没有页面或叠加元素的空档都算错
{
  let cur = 0; const gaps = [];
  for (const s of [...scenes].sort((a, b) => a.start - b.start)) { if (s.start - cur > 0.5) gaps.push([cur, s.start]); cur = Math.max(cur, s.end); }
  if (D && D - cur > 0.5) gaps.push([cur, D]);
  const fmt = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  gaps.forEach(([a, b]) => err.push(`${fmt(a)}–${fmt(b)} 这 ${(b - a).toFixed(1)} 秒没有任何包装：给这句加一个叠加元素（强度 1），或把相邻页面延长过来`));
}
// 编导规则（docs/director.md 第 4、6 节）：同一模板最多 2 次、模板种类够多、主风格家族占 70% 以上
const visualType = s => s.type === 'SideBeats' ? s.type + '/' + s.props?.variant : s.type;
const useCount = {}; scenes.forEach(s => { const key = visualType(s); useCount[key] = (useCount[key] || 0) + 1; });
for (const [t, n] of Object.entries(useCount)) if (n > 2) warn.push(`${t} 用了 ${n} 次（建议最多 2 次），换几个同语境的模板`);
const famCount = {}; scenes.forEach(s => { const f = known.get(s.type)?.family; if (f && f !== 'generic') famCount[f] = (famCount[f] || 0) + 1; });
const fams = Object.entries(famCount).sort((a, b) => b[1] - a[1]); const nonGeneric = fams.reduce((n, [, c]) => n + c, 0);
if (fams.length > 1 && fams[0][1] / nonGeneric < 0.7) warn.push(`风格家族混得太多（${fams.map(([f, c]) => f + ' ' + c + ' 页').join('、')}），主家族应占 70% 以上`);
const needTypes = D >= 90 ? 14 : D >= 60 ? 10 : Math.ceil(D / 6);
if (new Set(scenes.map(visualType)).size < needTypes) warn.push(`只用了 ${new Set(scenes.map(visualType)).size} 种模板，${Math.round(D)} 秒的视频建议至少 ${needTypes} 种`);
// 露脸：人物画面 + 版面里排进了真人画面的全屏模板（catalog 里 showsPerson）
const cover = full.filter(s => !known.get(s.type)?.showsPerson).reduce((a, s) => a + (s.end - s.start), 0);
if (D && 1 - cover / D < 0.4) warn.push(`露脸只有 ${Math.round((1 - cover / D) * 100)}%，建议 40% 以上：把一些不是高光的全屏页换成叠在人物旁的模板，或者让过渡句只用轻包装`);
// 开场不能和上一条视频一样（docs/director.md 3.1 节）：取 out/ 里其他视频最近出过的那一版的第一页
const me = String(plan.meta?.video || '').split('/').pop().replace(/\.[^.]+$/, '');
const prevOpen = fs.existsSync('out') ? fs.readdirSync('out', { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== me).flatMap(d => {
  const dir = `out/${d.name}/versions`; if (!fs.existsSync(dir)) return [];
  const v = fs.readdirSync(dir).map(f => /^v(\d+)\.plan\.json$/.exec(f)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b).at(-1);
  if (!v) return [];
  const p = JSON.parse(fs.readFileSync(`${dir}/v${v}.plan.json`, 'utf8')); const first = [...(p.scenes || [])].sort((a, b) => a.start - b.start)[0];
  return first ? [{ name: d.name, type: visualType(first), t: fs.statSync(`${dir}/v${v}.plan.json`).mtimeMs }] : [];
}).sort((a, b) => b.t - a.t)[0] : null;
if (prevOpen && scenes[0] && visualType(scenes[0]) === prevOpen.type) err.push(`${scenes[0].id}: 开场又用了 ${prevOpen.type}，和上一条视频「${prevOpen.name}」一样。按 docs/director.md 3.1 节，根据这条视频开头在说什么重新选`);
const types = new Set(scenes.map(visualType));
const report = [
  `场景 ${scenes.length} 个（全屏 ${full.length}，叠加 ${scenes.length - full.length}），用到 ${types.size} 种模板`,
  `全屏盖住人物 ${(cover / D * 100).toFixed(0)}%，人物露脸 ${((1 - cover / D) * 100).toFixed(0)}%（含版面里排进真人画面的页）`,
];
console.log('— 分镜体检 —\n' + report.join('\n'));
if (warn.length) console.log('\n⚠ 建议：\n' + warn.map(w => '  · ' + w).join('\n'));
if (err.length) { console.log('\n✗ 错误：\n' + err.map(w => '  · ' + w).join('\n')); process.exit(1); }
console.log('\n✓ 结构检查通过');
