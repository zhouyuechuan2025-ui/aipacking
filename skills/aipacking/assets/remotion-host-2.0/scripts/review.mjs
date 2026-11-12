// 模板审阅页：把体检结果（qa/lab/report.json + 体检图）做成一个 HTML 页面，给人逐个确认保留/要修/淘汰
// 用法：node scripts/review.mjs   →  qa/review/templates-review.html
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const rows = JSON.parse(fs.readFileSync('qa/lab/report.json', 'utf8'));
const cat = new Map(JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8')).map(c => [c.type, c]));
const notes = fs.existsSync('qa/review/notes.json') ? JSON.parse(fs.readFileSync('qa/review/notes.json', 'utf8')) : {};
fs.mkdirSync('qa/review/_img', { recursive: true });

const img = type => {
  const src = `qa/lab/${type}.jpg`; if (!fs.existsSync(src)) return '';
  const out = `qa/review/_img/${type}.jpg`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', 'scale=1600:-1', '-q:v', '6', out]);
  return 'data:image/jpeg;base64,' + fs.readFileSync(out).toString('base64');
};
// 通用模板：同一模板在各风格包下的中段截图（来自 node scripts/lab.mjs --quick --style=xxx）
const STYLES = { 'tech-dark': '科技暗黑', keynote: '暗色发布会', report: '报告·深色', 'report-light': '报告·浅色', 'report-glass': '报告·玻璃', 'report-blur': '报告·虚化', swiss: '瑞士排版', dataviz: '数据叙事', whiteboard: '白板', editorial: '编辑排版' };
const styleRep = Object.fromEntries(Object.keys(STYLES).map(st => [st, fs.existsSync(`qa/lab-${st}/report.json`) ? new Map(JSON.parse(fs.readFileSync(`qa/lab-${st}/report.json`, 'utf8')).map(r => [r.type, r])) : null]));
const font = ['C:/Windows/Fonts/msyh.ttc', '/System/Library/Fonts/PingFang.ttc'].find(f => fs.existsSync(f));
const styleStrip = type => {
  const tiles = Object.entries(STYLES).filter(([st]) => styleRep[st]?.get(type) && fs.existsSync(`qa/lab-${st}/${type}.jpg`));
  if (!tiles.length) return { img: '', grades: [] };
  const ins = tiles.flatMap(([st]) => ['-i', `qa/lab-${st}/${type}.jpg`]);
  const lab = tiles.map(([st, name], i) => { const g = styleRep[st].get(type).grade; const c = g === 'A' ? '0x1f8a4c' : g === 'B' ? '0xb7791f' : '0xc8372d';
    return `[${i}:v]crop=384:216:0:0,scale=300:-2,pad=300:196:0:0:0x111111,drawbox=x=0:y=169:w=300:h=27:color=${c}:t=fill${font ? `,drawtext=fontfile='${font.replace(':', '\\:')}':text='${name} ${g}':x=8:y=173:fontsize=16:fontcolor=white` : ''}[v${i}]`; }).join(';');
  const out = `qa/review/_img/${type}_styles.jpg`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', `${lab};${tiles.map((_, i) => `[v${i}]`).join('')}hstack=inputs=${tiles.length}[o]`, '-map', '[o]', '-q:v', '7', out]);
  return { img: 'data:image/jpeg;base64,' + fs.readFileSync(out).toString('base64'), grades: tiles.map(([st, name]) => ({ name, grade: styleRep[st].get(type).grade, issues: styleRep[st].get(type).hard.concat(styleRep[st].get(type).soft).slice(0, 3) })) };
};
const family = r => r.ctx.startsWith('模板包54') ? 'm5' : r.ctx.startsWith('编辑') ? 'editorial' : r.style.startsWith('report') ? 'report' : 'tech';
const FAM = { m5: '上一版模板包（54）', editorial: '编辑排版', report: '报告风', tech: '通用（可换风格）' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const items = rows.sort((a, b) => a.grade.localeCompare(b.grade) || a.type.localeCompare(b.type)).map(r => ({
  type: r.type, ctx: r.ctx, style: r.style, fam: family(r), grade: r.grade, hard: r.hard, soft: r.soft,
  use: cat.get(r.type)?.use || '', layout: cat.get(r.type)?.layout || '', note: notes[r.type] || '', img: img(r.type),
  styles: family(r) === 'tech' ? styleStrip(r.type) : { img: '', grades: [] },
}));
const count = g => items.filter(i => i.grade === g).length;

const html = `<title>模板审阅台</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
/* 审阅台：左侧筛选，右侧一张张体检条带；每条 = 模板信息 + 5 帧体检图 + 你的判断 */
:root {
  --bg: #f4f5f7; --panel: #ffffff; --ink: #16181d; --dim: #5d6370; --line: #dfe2e8;
  --accent: #2f5bff; --ok: #1f8a4c; --warn: #b7791f; --bad: #c8372d;
  --ok-bg: #e6f4ec; --warn-bg: #fbf1de; --bad-bg: #fbe7e5;
  --sans: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #111317; --panel: #1a1d23; --ink: #eceef2; --dim: #9aa1ad; --line: #2c313a;
  --accent: #7d9bff; --ok: #4cc27f; --warn: #e3a94a; --bad: #ff6b5f;
  --ok-bg: #173324; --warn-bg: #3a2c12; --bad-bg: #3d1a17; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #111317; --panel: #1a1d23; --ink: #eceef2; --dim: #9aa1ad; --line: #2c313a;
  --accent: #7d9bff; --ok: #4cc27f; --warn: #e3a94a; --bad: #ff6b5f;
  --ok-bg: #173324; --warn-bg: #3a2c12; --bad-bg: #3d1a17; color-scheme: dark }
* { box-sizing: border-box }
body { background: var(--bg); color: var(--ink); font-family: var(--sans); font-size: 14px; line-height: 1.6; margin: 0 }
.wrap { max-width: 1680px; margin: 0 auto; padding-inline: 20px; padding-block: 28px 80px }
header { display: flex; flex-wrap: wrap; gap: 16px 32px; align-items: end; justify-content: space-between; margin-bottom: 20px }
h1 { font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -.01em }
.sub { color: var(--dim); margin: 4px 0 0; max-width: 70ch }
.tally { display: flex; gap: 10px; flex-wrap: wrap }
.tally span { font-family: var(--mono); font-size: 13px; padding: 6px 12px; border-radius: 6px; font-variant-numeric: tabular-nums }
.gA { background: var(--ok-bg); color: var(--ok) } .gB { background: var(--warn-bg); color: var(--warn) } .gC { background: var(--bad-bg); color: var(--bad) }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 10px; border-bottom: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; margin-bottom: 18px }
.seg { display: flex; flex-wrap: wrap; gap: 4px }
.seg button, .actions button { font: inherit; font-size: 13px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); padding: 5px 12px; border-radius: 6px; cursor: pointer }
.seg button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); font-weight: 700 }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }
.progress { margin-left: auto; font-family: var(--mono); font-size: 13px; color: var(--dim) }
.copy { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; font-weight: 700 }
.list { display: grid; gap: 14px }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 16px }
.card[data-grade="C"] { border-left: 4px solid var(--bad) } .card[data-grade="B"] { border-left: 4px solid var(--warn) }
.meta { min-width: 0; display: grid; gap: 8px; align-content: start }
.name { display: flex; align-items: center; gap: 10px; flex-wrap: wrap }
.name b { font-family: var(--mono); font-size: 16px; font-weight: 600 }
.chip { font-family: var(--mono); font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px }
.tags { color: var(--dim); font-size: 12.5px }
.use { font-size: 13px }
.iss { margin: 0; padding-left: 18px; font-size: 12.5px; max-height: 7.5em; overflow: auto }
.iss.hard li { color: var(--bad) } .iss.soft li { color: var(--warn) }
.note { font-size: 12.5px; background: var(--bg); border-radius: 6px; padding: 6px 10px; border: 1px dashed var(--line) }
.note::before { content: "人工判断　"; color: var(--accent); font-weight: 700 }
.actions { display: flex; gap: 6px; flex-wrap: wrap }
.actions button[aria-pressed="true"][data-v="keep"] { background: var(--ok); border-color: var(--ok); color: #fff }
.actions button[aria-pressed="true"][data-v="fix"] { background: var(--warn); border-color: var(--warn); color: #fff }
.actions button[aria-pressed="true"][data-v="drop"] { background: var(--bad); border-color: var(--bad); color: #fff }
.shot { min-width: 0 }
.shot img { width: 100%; border-radius: 6px; display: block; background: #000 }
.stylerow { margin-top: 10px; display: grid; gap: 4px }
.strip { overflow-x: auto; border-radius: 6px } .strip img { width: auto; max-width: none; height: 150px }
textarea { width: 100%; font: inherit; font-size: 12.5px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); border-radius: 6px; padding: 6px 8px; resize: vertical; min-height: 34px }
.legend { color: var(--dim); font-size: 12.5px; margin-top: 2px }
.empty { color: var(--dim); padding: 40px 0; text-align: center }
@media (max-width: 900px) { .card { grid-template-columns: 1fr } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important } }
</style>
<div class="wrap">
  <header>
    <div>
      <h1>模板审阅台</h1>
      <p class="sub">${items.length} 个模板的自动体检结果（原生风格：A ${count('A')} · B ${count('B')} · C ${count('C')}）。每条是同一个模板的 5 帧：入场、中段、退场前、加压（文字加长 50%、列表多一项）、赶时间（压到 1.8 秒）。人像是占位画面。看完给每个模板点一个判断，最后点「复制我的决定」贴回对话。</p>
    </div>
    <div class="tally"><span class="gA">A 直接可用 ${count('A')}</span><span class="gB">B 修完可用 ${count('B')}</span><span class="gC">C 有硬伤 ${count('C')}</span></div>
  </header>
  <div class="bar">
    <div class="seg" id="fg" role="group" aria-label="按等级筛选"><button aria-pressed="true" data-g="">全部</button><button aria-pressed="false" data-g="A">A</button><button aria-pressed="false" data-g="B">B</button><button aria-pressed="false" data-g="C">C</button></div>
    <div class="seg" id="ff" role="group" aria-label="按风格筛选"><button aria-pressed="true" data-f="">全部风格</button>${Object.entries(FAM).map(([k, v]) => `<button aria-pressed="false" data-f="${k}">${v}</button>`).join('')}</div>
    <span class="progress" id="prog"></span>
    <div class="actions"><button class="copy" id="copy">复制我的决定</button></div>
  </div>
  <div class="list" id="list"></div>
  <p class="empty" id="empty" hidden>这个筛选下没有模板。</p>
</div>
<script>
const ITEMS = ${JSON.stringify(items)};
const FAM = ${JSON.stringify(FAM)};
const KEY = 'tpl-review-v1';
let st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) {} };
let fg = '', ff = '';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const V = { keep: '保留', fix: '要修', drop: '淘汰' };
function render() {
  const list = document.getElementById('list'); const shown = ITEMS.filter(i => (!fg || i.grade === fg) && (!ff || i.fam === ff));
  list.innerHTML = shown.map(i => {
    const s = st[i.type] || {};
    return '<article class="card" data-grade="' + i.grade + '"><div class="meta">' +
      '<div class="name"><b>' + esc(i.type) + '</b><span class="chip g' + i.grade + '">' + i.grade + '</span></div>' +
      '<div class="tags">' + esc(i.ctx) + ' · ' + esc(FAM[i.fam]) + ' · ' + esc(i.layout) + '</div>' +
      '<div class="use">' + esc(i.use) + '</div>' +
      (i.hard.length ? '<ul class="iss hard">' + i.hard.slice(0, 6).map(x => '<li>' + esc(x) + '</li>').join('') + (i.hard.length > 6 ? '<li>…共 ' + i.hard.length + ' 条</li>' : '') + '</ul>' : '') +
      (i.soft.length ? '<ul class="iss soft">' + i.soft.slice(0, 5).map(x => '<li>' + esc(x) + '</li>').join('') + (i.soft.length > 5 ? '<li>…共 ' + i.soft.length + ' 条</li>' : '') + '</ul>' : '') +
      (i.note ? '<div class="note">' + esc(i.note) + '</div>' : '') +
      '<div class="actions" role="group" aria-label="我的判断">' + Object.entries(V).map(([k, v]) => '<button data-t="' + esc(i.type) + '" data-v="' + k + '" aria-pressed="' + (s.v === k) + '">' + v + '</button>').join('') + '</div>' +
      '<label class="legend" for="n-' + esc(i.type) + '">备注（可选，比如哪里丑、想怎么改）</label><textarea id="n-' + esc(i.type) + '" data-t="' + esc(i.type) + '" rows="1">' + esc(s.n || '') + '</textarea>' +
      '</div><div class="shot">' + (i.img ? '<img loading="lazy" alt="' + esc(i.type) + ' 的 5 帧体检图" src="' + i.img + '">' : '') +
      (i.styles.img ? '<div class="stylerow"><div class="legend">换风格的效果（中段一帧，底色：绿 A / 黄 B / 红 C）</div><div class="strip"><img loading="lazy" alt="' + esc(i.type) + ' 在各风格下的截图" src="' + i.styles.img + '"></div>' + (i.styles.grades.some(g => g.grade !== 'A') ? '<ul class="iss soft">' + i.styles.grades.filter(g => g.grade !== 'A').map(g => '<li>' + esc(g.name) + '：' + esc(g.issues.join('；')) + '</li>').join('') + '</ul>' : '') + '</div>' : '') + '</div></article>';
  }).join('');
  document.getElementById('empty').hidden = shown.length > 0;
  const done = ITEMS.filter(i => st[i.type]?.v).length;
  document.getElementById('prog').textContent = '已判断 ' + done + ' / ' + ITEMS.length;
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.g !== undefined) { fg = b.dataset.g; document.querySelectorAll('#fg button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); }
  else if (b.dataset.f !== undefined) { ff = b.dataset.f; document.querySelectorAll('#ff button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); }
  else if (b.dataset.v) { const t = b.dataset.t; st[t] = st[t] || {}; st[t].v = st[t].v === b.dataset.v ? undefined : b.dataset.v; save(); render(); }
  else if (b.id === 'copy') {
    const lines = Object.entries(V).map(([k, v]) => { const xs = ITEMS.filter(i => st[i.type]?.v === k); return xs.length ? v + '（' + xs.length + '）：' + xs.map(i => i.type + (st[i.type].n ? '【' + st[i.type].n + '】' : '')).join('、') : ''; }).filter(Boolean);
    const extra = ITEMS.filter(i => !st[i.type]?.v && st[i.type]?.n).map(i => i.type + '【' + st[i.type].n + '】');
    if (extra.length) lines.push('只写了备注：' + extra.join('、'));
    const text = lines.length ? '模板审阅结果：\\n' + lines.join('\\n') : '还没有判断任何模板';
    const done = () => { b.textContent = '已复制'; setTimeout(() => b.textContent = '复制我的决定', 1600) };
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(done).catch(() => {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done() } catch (e) {} ta.remove();
    });
  }
});
document.addEventListener('input', e => { const t = e.target.dataset?.t; if (t && e.target.tagName === 'TEXTAREA') { st[t] = st[t] || {}; st[t].n = e.target.value; save(); } });
render();
</script>
`;
fs.writeFileSync('qa/review/templates-review.html', html);
fs.rmSync('qa/review/_img', { recursive: true, force: true });
console.log(`✓ qa/review/templates-review.html（${(html.length / 1024 / 1024).toFixed(1)} MB）`);
