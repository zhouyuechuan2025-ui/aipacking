// 语境模板 · 第四组：目录 / 名词解释 / 金字塔 / 四象限 / 对照表 / 交集 / 优缺点 / 时间对比 / 互动提问 / 问答揭晓
// 规范（docs/visual-rules.md）：跟随风格包；所有上屏文字用 fitSize 自动缩字；色块上的字用 onColor；小号彩色字用 accentText
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Stage, useT, PageProps } from './full';
import { Kinetic, Tag } from '../ui';
import { theme, accent, onColor, accentText } from '../lib/theme';
import { pop, prog, glide, clamp, lerp } from '../lib/anim';
import { fitSize, textEm } from '../lib/fit';
const F = theme.font, M = theme.mono;
const COLS = ['cyan', 'violet', 'pink', 'gold', 'green'];

/** 页头：小标签 + 标题（左对齐或居中），标题固定一行自动缩字 */
const Head: React.FC<{ p: any; col: string; center?: boolean; top?: number }> = ({ p, col, center, top = 150 }) => (
  <div style={{ position: 'absolute', left: center ? 0 : 130, right: center ? 0 : undefined, top, textAlign: center ? 'center' : 'left' }}>
    {p.kicker && <Tag color={col} style={{ fontSize: 20 }}>{p.kicker}</Tag>}
    {p.title && <Kinetic text={p.title} size={fitSize(p.title, 76, 1660, 44, 0.02)} delay={2} style={{ marginTop: 10, display: center ? 'inline-block' : 'block' }} />}
  </div>
);
const Line: React.FC<{ text: string; size: number; max: number; min?: number; color?: string; weight?: number; mono?: boolean; style?: React.CSSProperties }> = ({ text, size, max, min, color = 'var(--ink)', weight = 800, mono, style }) =>
  <div style={{ fontFamily: mono ? M : F, fontWeight: weight, fontSize: fitSize(text, size, max, min), color, whiteSpace: 'nowrap', lineHeight: 1.2, ...style }}>{text}</div>;

// 1. Agenda — 目录：「今天讲三件事」，逐条出现，当前条高亮
export const Agenda: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const items: any[] = p.items || [];
  const ts = items.map((it, i) => at(it.at, 10 + i * 12)); const cur = ts.reduce((k, t, i) => (f >= t ? i : k), -1);
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <Head p={p} col={col} />
      <div style={{ position: 'absolute', left: 130, top: 350, width: 1400, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {items.map((it, i) => { const k = glide(f, fps, ts[i]); const on = i === cur;
          return <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 40, opacity: clamp(k * 1.5) * (on || cur < i ? 1 : 0.55), transform: `translateX(${(1 - k) * 50}px)` }}>
            <div style={{ fontFamily: M, fontWeight: 700, fontSize: 44, width: 90, color: on ? accentText(col) : 'var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ minWidth: 0 }}><Line text={it.text ?? it} size={60} max={1260} min={34} weight={on ? 900 : 700} />
              {it.sub && <Line text={it.sub} size={28} max={1260} min={18} weight={400} color="var(--ink-dim)" style={{ marginTop: 6 }} />}</div>
          </div>; })}
      </div>
    </Stage>
  );
};

// 2. Definition — 名词解释：大号词条 + 分隔线 + 释义（释义最多两行）
export const Definition: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'violet';
  const d = at(p.defAt, 22); const lk = prog(f, 12, 30); const def = p.def || '';
  const defSize = Math.max(30, Math.min(48, Math.floor((1400 * 2) / Math.max(1, textEm(def))))); // 两行放得下的字号
  return (
    <Stage bg={bg || { variant: 'grid', a: col, b: 'cyan' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 260, right: 260, top: 250 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 20 }}>{p.kicker}</Tag>}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 36, marginTop: 14, opacity: prog(f, 2, 12), transform: `translateY(${(1 - prog(f, 2, 14)) * 30}px)` }}>
          <Line text={p.term || ''} size={150} max={1000} min={72} weight={900} />
          {p.en && <Line text={p.en} size={30} max={380} min={18} weight={600} mono color={accentText(col)} />}
        </div>
        <div style={{ height: 3, width: `${lk * 100}%`, background: accent(col), margin: '34px 0 30px' }} />
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: defSize, lineHeight: 1.5, color: 'var(--ink)', maxWidth: 1400, opacity: prog(f, d, d + 12), transform: `translateY(${(1 - prog(f, d, d + 14)) * 20}px)` }}>{def}</div>
        {p.example && <div style={{ marginTop: 26, fontFamily: F, fontSize: fitSize(p.example, 30, 1400, 20), color: 'var(--ink-dim)', whiteSpace: 'nowrap', opacity: prog(f, d + 14, d + 26) }}>例：{p.example}</div>}
      </div>
    </Stage>
  );
};

// 3. Pyramid — 金字塔：从底层往上逐层出现（layers 按从上到下写）
export const Pyramid: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'gold'; const layers: any[] = p.layers || []; const n = Math.max(1, layers.length);
  const H = Math.min(140, 600 / n), top = 330, cx = 700, W0 = 300, W1 = 1100;
  return (
    <Stage bg={bg || { variant: 'grid', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <Head p={p} col={col} />
      {layers.map((l, i) => { const order = n - 1 - i; const k = pop(f, fps, at(l.at, 8 + order * 10)); const c = accent(l.color || [col, 'cyan', 'violet', 'pink', 'green'][i % 5]);
        const wt = lerp(W0, W1, i / n), wb = lerp(W0, W1, (i + 1) / n); const y = top + i * (H + 8);
        return <div key={i} style={{ position: 'absolute', left: cx - wb / 2, top: y, width: wb, height: H, opacity: clamp(k * 1.4), transform: `translateY(${(1 - clamp(k)) * 40}px)` }}>
          <div style={{ position: 'absolute', inset: 0, background: c, clipPath: `polygon(${(wb - wt) / 2}px 0, ${(wb + wt) / 2}px 0, 100% 100%, 0 100%)` }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Line text={l.text} size={Math.min(48, H * 0.42)} max={Math.max(120, wt * 0.8)} min={20} weight={900} color={onColor(c)} /></div>
          {l.sub && <div style={{ position: 'absolute', left: wb + 40, top: 0, height: H, display: 'flex', alignItems: 'center' }}><Line text={l.sub} size={32} max={1600 - cx - wb / 2 - 40} min={18} weight={600} color="var(--ink-dim)" /></div>}
        </div>; })}
    </Stage>
  );
};

// 4. Quadrant — 四象限：两条轴分出四类，最后高亮其中一格
export const Quadrant: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const cells: any[] = p.cells || [];
  const X = 560, Y = 300, S = 640, ax = prog(f, 6, 22); const hiAt = at(p.hiAt, 40);
  const pos = [[0, 0], [1, 0], [0, 1], [1, 1]]; // 左上、右上、左下、右下
  return (
    <Stage bg={bg || { variant: 'grid', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <Head p={p} col={col} center top={120} />
      <div style={{ position: 'absolute', left: X, top: Y + S / 2 - 1.5, width: S * ax, height: 3, background: 'var(--ink-dim)' }} />
      <div style={{ position: 'absolute', left: X + S / 2 - 1.5, top: Y, width: 3, height: S * ax, background: 'var(--ink-dim)' }} />
      {(p.x || []).map((t: string, i: number) => <div key={i} style={{ position: 'absolute', top: Y + S / 2 + 14, ...(i ? { left: X + S + 18 } : { right: 1920 - X + 18 }), opacity: ax }}><Line text={t} size={26} max={400} min={16} weight={600} color="var(--ink-dim)" /></div>)}
      {(p.y || []).map((t: string, i: number) => <div key={i} style={{ position: 'absolute', left: X + S / 2 + 16, top: i ? Y - 44 : Y + S + 10, opacity: ax }}><Line text={t} size={26} max={600} min={16} weight={600} color="var(--ink-dim)" /></div>)}
      {cells.slice(0, 4).map((c, i) => { const [cx, cy] = pos[i]; const k = pop(f, fps, at(c?.at, 14 + i * 6)); const hi = p.hi === i && f >= hiAt; const fill = accent(c?.color || col);
        return <div key={i} style={{ position: 'absolute', left: X + cx * (S / 2) + 14, top: Y + cy * (S / 2) + 14, width: S / 2 - 28, height: S / 2 - 28, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
          background: hi ? fill : 'var(--chip-bg)', border: hi ? 'none' : '1.5px solid var(--chip-border)', opacity: clamp(k * 1.4), transform: `scale(${0.85 + 0.15 * clamp(k)})` }}>
          <Line text={c?.text ?? c ?? ''} size={44} max={S / 2 - 70} min={22} weight={900} color={hi ? onColor(fill) : 'var(--ink)'} />
          {c?.sub && <Line text={c.sub} size={24} max={S / 2 - 70} min={16} weight={500} color={hi ? onColor(fill) : 'var(--ink-dim)'} />}
        </div>; })}
    </Stage>
  );
};

// 5. CompareTable — 对照表：多个维度逐行对比 A / B，win 列高亮
export const CompareTable: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const rows: any[] = p.rows || []; const cols: string[] = p.cols || ['A', 'B'];
  const L = 180, KW = 520, CW = 520, top = 330, RH = Math.min(110, 520 / Math.max(1, rows.length)); const win = p.win ?? 1;
  const cell = (v: any, strong: boolean) => { const s = String(v ?? ''); const mark = s === '✓' || s === '✕';
    return <Line text={s} size={mark ? 52 : 40} max={CW - 60} min={20} weight={strong ? 900 : 600} color={mark ? (s === '✓' ? accentText('green') : accentText('red')) : strong ? 'var(--ink)' : 'var(--ink-dim)'} />; };
  return (
    <Stage bg={bg || { variant: 'grid', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <Head p={p} col={col} top={130} />
      <div style={{ position: 'absolute', left: L + KW + win * CW, top: top - 90, width: CW, height: 90 + rows.length * RH + 20, borderRadius: 20, background: accent(col) + '1c', border: `2px solid ${accent(col)}66`, opacity: prog(f, 4, 14) }} />
      {cols.slice(0, 2).map((c, j) => <div key={j} style={{ position: 'absolute', left: L + KW + j * CW, width: CW, top: top - 70, display: 'flex', justifyContent: 'center', opacity: prog(f, 4, 12) }}>
        <Line text={c} size={40} max={CW - 60} min={22} weight={900} color={j === win ? accentText(col) : 'var(--ink-dim)'} /></div>)}
      {rows.map((r, i) => { const k = glide(f, fps, at(r.at, 10 + i * 8)); const y = top + i * RH;
        return <div key={i} style={{ position: 'absolute', left: L, top: y, width: KW + 2 * CW, height: RH, borderTop: '1.5px solid var(--chip-border)', display: 'flex', alignItems: 'center', opacity: clamp(k * 1.5), transform: `translateY(${(1 - k) * 20}px)` }}>
          <div style={{ width: KW, paddingLeft: 10 }}><Line text={r.k} size={38} max={KW - 30} min={20} weight={700} color="var(--ink-dim)" /></div>
          <div style={{ width: CW, display: 'flex', justifyContent: 'center' }}>{cell(r.a, win === 0)}</div>
          <div style={{ width: CW, display: 'flex', justifyContent: 'center' }}>{cell(r.b, win === 1)}</div>
        </div>; })}
    </Stage>
  );
};

// 6. Venn — 交集：两个圆从两侧靠拢，重叠处出现结论
export const Venn: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const ca = accent(p.colorA || 'cyan'), cb = accent(p.colorB || 'pink');
  const k = prog(f, 6, 30); const mid = at(p.midAt, 34); const mk = pop(f, fps, mid); const R = 290, gap = lerp(560, 360, k);
  const circle = (x: number, c: string, label: string, sub?: string, left?: boolean) => <div style={{ position: 'absolute', left: x - R, top: 560 - R, width: R * 2, height: R * 2, borderRadius: '50%', background: c + '26', border: `3px solid ${c}`, opacity: clamp(k * 2) }}>
    <div style={{ position: 'absolute', top: R - 40, ...(left ? { left: 50 } : { right: 50 }), width: R - 60, textAlign: left ? 'left' : 'right' }}>
      <Line text={label} size={48} max={R - 70} min={22} weight={900} style={{ display: 'inline-block' }} />
      {sub && <Line text={sub} size={24} max={R - 70} min={16} weight={500} color="var(--ink-dim)" style={{ marginTop: 6 }} />}</div></div>;
  return (
    <Stage bg={bg || { variant: 'aurora', a: 'cyan', b: 'pink' }} chapter={chapter} color={p.color || 'cyan'}>
      <Head p={p} col={p.color || 'cyan'} center top={110} />
      {circle(960 - gap / 2, ca, p.a || '', p.aSub, true)}{circle(960 + gap / 2, cb, p.b || '', p.bSub, false)}
      {p.mid && <div style={{ position: 'absolute', left: 960, top: 560, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * clamp(mk)})`, opacity: clamp(mk * 2), padding: '14px 26px', borderRadius: 16, background: 'var(--chip-solid)', border: '1.5px solid var(--chip-border)' }}>
        <Line text={p.mid} size={44} max={Math.max(160, 2 * R - gap - 20)} min={22} weight={900} /></div>}
    </Stage>
  );
};

// 7. ProsCons — 优缺点两栏
export const ProsCons: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const pros: any[] = p.pros || [], cons: any[] = p.cons || [];
  const colOf = (items: any[], x: number, good: boolean, base: number) => { const c = accent(good ? 'green' : 'red');
    return <div style={{ position: 'absolute', left: x, top: 330, width: 780 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: prog(f, base, base + 10) }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 40, color: onColor(c) }}>{good ? '+' : '−'}</div>
        <Line text={good ? p.prosTitle || '优点' : p.consTitle || '代价'} size={44} max={640} min={24} weight={900} />
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {items.map((it, i) => { const k = glide(f, fps, at(it.at, base + 8 + i * 8));
          return <div key={i} style={{ padding: '18px 26px', borderRadius: 16, background: 'var(--chip-bg)', borderLeft: `5px solid ${c}`, opacity: clamp(k * 1.5), transform: `translateX(${(1 - k) * (good ? -30 : 30)}px)` }}>
            <Line text={it.text ?? it} size={38} max={700} min={20} weight={700} /></div>; })}
      </div></div>; };
  return (
    <Stage bg={bg || { variant: 'silk', a: 'green', b: 'pink' }} chapter={chapter} color={p.color || 'green'}>
      <Head p={p} col={p.color || 'green'} />
      {colOf(pros, 130, true, 6)}{colOf(cons, 1010, false, 18)}
    </Stage>
  );
};

// 8. TimeCompare — 时间对比：两条时长条，长度按时间比例（对数压缩，差距再大也看得见短的那条）
export const TimeCompare: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const a = p.before || {}, b = p.after || {};
  const sa = Math.max(1, +a.sec || 1), sb = Math.max(1, +b.sec || 1); const mx = Math.max(sa, sb);
  const len = (s: number) => 0.08 + 0.92 * Math.log(1 + s) / Math.log(1 + mx);
  const bar = (d: any, s: number, y: number, c: string, t0: number) => { const k = prog(f, t0, t0 + 22);
    return <div style={{ position: 'absolute', left: 130, top: y, width: 1660 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', opacity: prog(f, t0, t0 + 8) }}>
        <Line text={d.label || ''} size={36} max={900} min={20} weight={700} color="var(--ink-dim)" />
        <Line text={`${d.value ?? ''}${d.unit ?? ''}`} size={64} max={700} min={30} weight={900} mono color={accentText(d.color || (c === 'b' ? col : 'red'))} />
      </div>
      <div style={{ marginTop: 14, height: 34, borderRadius: 17, background: 'var(--chip-bg)' }}><div style={{ width: `${len(s) * k * 100}%`, height: '100%', borderRadius: 17, background: accent(d.color || (c === 'b' ? col : 'red')) }} /></div>
    </div>; };
  const nk = pop(f, fps, at(p.noteAt, 44));
  return (
    <Stage bg={bg || { variant: 'grid', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <Head p={p} col={col} />
      {bar(a, sa, 360, 'a', at(a.at, 8))}{bar(b, sb, 560, 'b', at(b.at, 24))}
      {p.note && <div style={{ position: 'absolute', left: 130, top: 780, opacity: clamp(nk * 2), transform: `scale(${0.8 + 0.2 * clamp(nk)})`, transformOrigin: 'left center', padding: '14px 30px', borderRadius: 999, background: accent(col) }}>
        <Line text={p.note} size={40} max={1400} min={22} weight={900} color={onColor(accent(col))} /></div>}
    </Stage>
  );
};

// 9. Poll — 互动提问：问题 + 2~3 个选项卡，最后引导评论
export const Poll: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'violet'; const opts: any[] = (p.options || []).slice(0, 3); const n = Math.max(1, opts.length);
  const W = Math.min(520, (1660 - (n - 1) * 40) / n); const ck = pop(f, fps, at(p.ctaAt, 40));
  return (
    <Stage bg={bg || { variant: 'nebula', a: col, b: 'cyan' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center' }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 20 }}>{p.kicker}</Tag>}
        <Kinetic text={p.question || ''} size={fitSize(p.question || '', 72, 1660, 40, 0.02)} delay={2} style={{ marginTop: 10, display: 'inline-block' }} />
      </div>
      {opts.map((o, i) => { const k = pop(f, fps, at(o?.at, 12 + i * 8)); const c = accent(o?.color || COLS[i % 5]); const x = 960 + (i - (n - 1) / 2) * (W + 40);
        return <div key={i} style={{ position: 'absolute', left: x - W / 2, top: 400, width: W, height: 300, borderRadius: 24, background: 'var(--chip-solid)', border: `2px solid ${c}`, opacity: clamp(k * 1.5), transform: `translateY(${(1 - clamp(k)) * 40}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 40, color: onColor(c) }}>{'ABC'[i]}</div>
          <Line text={o?.text ?? o ?? ''} size={44} max={W - 60} min={22} weight={900} />
        </div>; })}
      {p.cta !== false && <div style={{ position: 'absolute', left: 0, right: 0, top: 780, display: 'flex', justifyContent: 'center', opacity: clamp(ck * 2) }}>
        <div style={{ padding: '14px 34px', borderRadius: 999, background: accent(col), transform: `scale(${0.8 + 0.2 * clamp(ck)})` }}><Line text={p.cta || '评论区告诉我你的选择'} size={34} max={1200} min={20} weight={800} color={onColor(accent(col))} /></div></div>}
    </Stage>
  );
};

// 10. QAReveal — 问答揭晓：先抛问题（Q），停顿后揭晓答案（A），答案里 [ ] 包住的词高亮
export const QAReveal: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'gold'; const aAt = at(p.aAt, Math.round(dur * 0.45)); const ak = pop(f, fps, aAt);
  const plain = String(p.a || '').replace(/[[\]]/g, ''); const aSize = fitSize(plain, 84, 1500, 40);
  const parts = String(p.a || '').split(/(\[[^\]]+\])/).filter(Boolean);
  const badge = (t: string, c: string) => <div style={{ width: 70, height: 70, borderRadius: 16, background: c, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 40, color: onColor(c) }}>{t}</div>;
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 160, top: 300, display: 'flex', alignItems: 'center', gap: 34, opacity: prog(f, 2, 12) * (f >= aAt ? 0.55 : 1) }}>
        <div style={{ width: 70, height: 70, borderRadius: 16, border: '3px solid var(--ink-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 40, color: 'var(--ink)' }}>Q</div><Line text={p.q || ''} size={52} max={1500} min={26} weight={700} />
      </div>
      <div style={{ position: 'absolute', left: 160, top: 470, display: 'flex', alignItems: 'center', gap: 34, opacity: clamp(ak * 2), transform: `translateY(${(1 - clamp(ak)) * 40}px)` }}>
        {badge('A', accent(col))}
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: aSize, color: 'var(--ink)', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
          {parts.map((t, i) => t.startsWith('[') ? <span key={i} style={{ color: accent(col) }}>{t.slice(1, -1)}</span> : <span key={i}>{t}</span>)}</div>
      </div>
    </Stage>
  );
};

export const MORE4: Record<string, React.FC<PageProps>> = { Agenda, Definition, Pyramid, Quadrant, CompareTable, Venn, ProsCons, TimeCompare, Poll, QAReveal };
