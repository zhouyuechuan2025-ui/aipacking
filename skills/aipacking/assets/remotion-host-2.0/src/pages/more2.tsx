// 语境模板 · 第二组：对比 / 趋势 / 列表 / 流程 / 演变 / 排行 / 总结
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage, useT, PageProps, Chart } from './full';
import { Glass, Kinetic, Tag, Pill, Stamp, CountUp } from '../ui';
import { theme, accent, onColor, accentText, currentTheme } from '../lib/theme';
import { pop, prog, glide, clamp, lerp } from '../lib/anim';
import { fitSize } from '../lib/fit';
const F = theme.font, M = theme.mono;
const COLS = ['cyan', 'violet', 'pink', 'gold', 'green'];

// BeforeAfter — 以前 / 现在 分屏擦除
export const BeforeAfter: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const t1 = at(p.afterAt, Math.round(dur * 0.4));
  const wipe = prog(f, t1, t1 + 16); const x = lerp(1920, 960, wipe);
  const side = (d: any, col: string, isAfter: boolean) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: isAfter ? 1060 : 140, paddingRight: isAfter ? 120 : 1060 }}>
      <Tag color={col} style={{ fontSize: 26 }}>{d.tag || (isAfter ? 'AFTER' : 'BEFORE')}</Tag>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 110, color: isAfter ? 'var(--ink)' : 'var(--ink-dim)', marginTop: 10 }}>{d.title}</div>
      {(d.lines || []).map((l: string, i: number) => <div key={i} style={{ marginTop: 22, fontFamily: F, fontWeight: 700, fontSize: 40, color: isAfter ? accent(col) : 'var(--ink-dim)' }}>{isAfter ? '✓ ' : '· '}{l}</div>)}
    </div>);
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color="cyan">
      <AbsoluteFill style={{ filter: `saturate(${1 - wipe * 0.8}) brightness(${1 - wipe * 0.3})` }}>{side(p.before, 'pink', false)}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${x}px)`, background: currentTheme().dark ? 'linear-gradient(90deg, rgba(20,40,80,.55), rgba(5,6,11,.2))' : `linear-gradient(90deg, ${accent('cyan')}1f, ${accent('cyan')}08)` }}>{side(p.after, 'cyan', true)}</AbsoluteFill>
      {wipe > 0 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: x - 3, width: 6, background: '#fff', boxShadow: `0 0 40px ${accent('cyan')}` }} />}
      {wipe > 0.9 && <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, fps, t1 + 14)})`, width: 110, height: 110, borderRadius: 55, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: theme.bg, fontWeight: 900 }}>→</div>}
    </Stage>
  );
};

// BarRace — 横向排行条（数据新闻风，带透视倾斜）
export const BarRace: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const items: any[] = [...(p.items || [])];
  const maxV = Math.max(...items.map(i => i.value));
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const tilt = lerp(-14, -6, prog(f, 0, dur));
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={p.color || 'cyan'}>
      <div style={{ position: 'absolute', left: 110, top: 150 }}>{p.kicker && <Tag style={{ fontSize: 22 }}>{p.kicker}</Tag>}<Kinetic text={p.title || ''} size={fitSize(p.title || '', 80, 1660, 48, 0.02)} delay={2} /></div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: 'absolute', left: 150, top: 330, width: 1620, transform: `rotateY(${tilt}deg) rotateX(4deg)`, transformOrigin: 'left center' }}>
          {sorted.map((it, i) => { const t0 = at(it.at, 6 + i * 5); const k = prog(f, t0, t0 + 26); const col = it.color || (i === 0 ? 'gold' : COLS[i % 5]); const w = (it.value / maxV) * 1180 * k;
            return <div key={i} style={{ display: 'flex', alignItems: 'center', height: 104, marginBottom: 16 }}>
              <div style={{ width: 90, fontFamily: M, fontWeight: 900, fontSize: 44, color: i === 0 ? accent('gold') : 'var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ width: 250, fontFamily: F, fontWeight: 800, fontSize: 44, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{it.label}</div>
              <div style={{ height: 70, width: w, borderRadius: 14, background: `linear-gradient(90deg, ${accent(col)}44, ${accent(col)})`, boxShadow: `0 0 30px ${accent(col)}55` }} />
              <div style={{ marginLeft: 20, fontFamily: M, fontWeight: 900, fontSize: 46, color: accent(col) }}><CountUp to={it.value} start={t0} dur={26} decimals={it.decimals || 0} />{it.unit || ''}</div>
            </div>; })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// Donut — 占比环形图
export const Donut: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps } = useT(start); const segs: any[] = p.segments || []; const tot = segs.reduce((a, s) => a + s.value, 0);
  const sweep = prog(f, 6, 40); const R = 260, C = 2 * Math.PI * R; let acc = 0;
  return (
    <Stage bg={bg || { variant: 'aurora', a: 'violet', b: 'cyan' }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}><Kinetic text={p.title || ''} size={80} delay={2} /></div>
      <svg width={760} height={760} viewBox="0 0 760 760" style={{ position: 'absolute', left: 150, top: 250 }}>
        <circle cx={380} cy={380} r={R} stroke={theme.ink} strokeOpacity={.07} strokeWidth={70} fill="none" />
        {segs.map((s, i) => { const frac = s.value / tot; const a0 = acc; acc += frac; const vis = clamp((sweep - a0) / frac);
          return <circle key={i} cx={380} cy={380} r={R} stroke={accent(s.color || COLS[i % 5])} strokeWidth={70} fill="none" strokeDasharray={`${C * frac * vis - 6} ${C}`} strokeDashoffset={-C * a0} transform="rotate(-90 380 380)" />; })}
        <text x={380} y={390} textAnchor="middle" fill={theme.ink} fontFamily={M} fontWeight={900} fontSize={110}>{p.center ?? `${Math.round(sweep * 100)}%`}</text>
        {p.centerLabel && <text x={380} y={450} textAnchor="middle" fill={theme.ink} fillOpacity={.7} fontFamily={F} fontSize={34}>{p.centerLabel}</text>}
      </svg>
      <div style={{ position: 'absolute', left: 1050, top: 330, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {segs.map((s, i) => { const k = glide(f, fps, 10 + i * 6); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: accent(s.color || COLS[i % 5]) }} />
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 46, color: 'var(--ink)', width: 360 }}>{s.label}</div>
          <div style={{ fontFamily: M, fontWeight: 900, fontSize: 50, color: accent(s.color || COLS[i % 5]) }}>{Math.round((s.value / tot) * 100)}%</div></div>; })}
      </div>
    </Stage>
  );
};

export const Bars3D: React.FC<PageProps> = (props) => <Chart {...props} p={{ ...props.p, kind: 'bars3d' }} />;
export const LineChart: React.FC<PageProps> = (props) => <Chart {...props} p={{ ...props.p, kind: 'lines' }} />;

// Checklist — 清单逐条打勾
export const Checklist: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const items: any[] = p.items || []; const col = p.color || 'green';
  return (
    <Stage bg={bg || { variant: 'rays', a: col, b: 'cyan', intensity: .75 }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 130, top: 170 }}>{p.kicker && <Tag color={col} style={{ fontSize: 22 }}>{p.kicker}</Tag>}<Kinetic text={p.title || ''} size={84} delay={2} /></div>
      <div style={{ position: 'absolute', left: 130, top: 350, width: 1100, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, i) => { const t0 = at(it.at, 8 + i * 10); const k = glide(f, fps, t0); const ck = pop(f, fps, t0 + 6);
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: clamp(k * 1.5), transform: `translateX(${(1 - k) * 60}px)`, padding: '22px 34px', borderRadius: 22, background: 'var(--chip-solid)', border: '1.5px solid var(--chip-border)', backdropFilter: 'blur(20px)' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, border: `3px solid ${accent(col)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ck > 0.5 ? accent(col) : 'transparent', fontSize: 40, fontWeight: 900, color: onColor(accent(col)), transform: `scale(${0.7 + 0.3 * clamp(ck, 0, 1.2)})` }}>{ck > 0.5 ? '✓' : ''}</div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: 'var(--ink)' }}>{it.text ?? it}</div></div>; })}
      </div>
    </Stage>
  );
};

// BentoGrid — 便当格关键词墙
export const BentoGrid: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const cells: any[] = p.cells || [];
  const layout = [[110, 300, 820, 330], [950, 300, 420, 330], [1390, 300, 420, 330], [110, 650, 420, 330], [550, 650, 420, 330], [990, 650, 820, 330]];
  return (
    <Stage bg={bg || { variant: 'nebula', a: 'violet', b: 'cyan' }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}><Kinetic text={p.title || ''} size={80} delay={2} /></div>
      {cells.slice(0, 6).map((c, i) => { const [x, y, w, h] = layout[i]; const col = c.color || COLS[i % 5]; const k = pop(f, fps, at(c.at, 6 + i * 5));
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: clamp(k), transform: `scale(${0.85 + 0.15 * clamp(k)})` }}>
          <Glass color={col} style={{ inset: 0 }} beam={i === 0}>
            <div style={{ padding: 36, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 56, color: accent(col) }}>{c.icon || '◆'}</div>
              <div><div style={{ fontFamily: F, fontWeight: 900, fontSize: w > 600 ? 80 : 58, color: 'var(--ink)' }}>{c.title}</div>{c.sub && <div style={{ fontFamily: F, fontSize: 28, color: 'var(--ink-dim)', marginTop: 6 }}>{c.sub}</div>}</div>
            </div></Glass></div>; })}
    </Stage>
  );
};

// NumberedList — 超大编号要点（逐条高亮）
export const NumberedList: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const items: any[] = p.items || []; const col = p.color || 'gold';
  const active = items.reduce((k, it, i) => (f >= at(it.at, 8 + i * 20) ? i : k), 0);
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet', intensity: .7 }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 130, top: 160 }}><Kinetic text={p.title || ''} size={80} delay={2} /></div>
      <div style={{ position: 'absolute', left: 130, top: 330, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {items.map((it, i) => { const on = i === active; const seen = i <= active; const k = glide(f, fps, at(it.at, 8 + i * 20));
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, opacity: seen ? (on ? 1 : 0.4) * clamp(k * 1.5) : 0, transform: `translateX(${on ? 30 : 0}px)` }}>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 130, width: 220, color: on ? accent(col) : 'transparent', WebkitTextStroke: on ? undefined : '2px var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</div>
            <div><div style={{ fontFamily: F, fontWeight: 900, fontSize: fitSize(String(it.title ?? it), 72, 1400, 40), color: 'var(--ink)', whiteSpace: 'nowrap' }}>{it.title ?? it}</div>{it.sub && <div style={{ fontFamily: F, fontSize: 34, color: 'var(--ink-dim)' }}>{it.sub}</div>}</div></div>; })}
      </div>
    </Stage>
  );
};

// FlowChart — 节点 + 流动光脉冲（因果链 / 工作流）
export const FlowChart: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const nodes: any[] = p.nodes || []; const n = nodes.length; const col = p.color || 'cyan';
  const pos = nodes.map((_, i) => [260 + (n === 1 ? 700 : (i / (n - 1)) * 1400), 600 + (i % 2 ? 120 : -60) * (p.zigzag === false ? 0 : 1)]);
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}>{p.kicker && <Tag color={col} style={{ fontSize: 22 }}>{p.kicker}</Tag>}<Kinetic text={p.title || ''} size={80} delay={2} /></div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {pos.slice(1).map((q, i) => { const a = pos[i]; const t0 = at(nodes[i + 1].at, 12 + (i + 1) * 12); const k = prog(f, t0 - 10, t0);
          const x = lerp(a[0], q[0], k), y = lerp(a[1], q[1], k); const ph = ((f + i * 9) % 30) / 30;
          return <g key={i}><line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={theme.ink} strokeOpacity={.35} strokeWidth={4} strokeDasharray="12 10" />
            {k >= 1 && <circle cx={lerp(a[0], q[0], ph)} cy={lerp(a[1], q[1], ph)} r={9} fill={accent(col)} style={{ filter: `drop-shadow(0 0 10px ${accent(col)})` }} />}</g>; })}
      </svg>
      {nodes.map((nd, i) => { const k = pop(f, fps, at(nd.at, 12 + i * 12)); const c = nd.color || (i === n - 1 ? 'gold' : col); const [x, y] = pos[i];
        return <div key={i} style={{ position: 'absolute', left: x - 170, top: y - 80, width: 340, height: 160, opacity: clamp(k), transform: `scale(${k})` }}>
          <Glass color={c} style={{ inset: 0 }} beam={i === n - 1}><div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: nd.title.length > 4 ? 44 : 58, color: 'var(--ink)' }}>{nd.title}</div>
            {nd.en && <div style={{ fontFamily: M, fontSize: 18, letterSpacing: '0.2em', color: accentText(c), marginTop: 6 }}>{nd.en}</div>}</div></Glass></div>; })}
    </Stage>
  );
};

// Funnel — 漏斗（转化 / 筛选）
export const Funnel: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const st: any[] = p.stages || [];
  return (
    <Stage bg={bg || { variant: 'rays', a: 'violet', b: 'gold' }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}><Kinetic text={p.title || ''} size={80} delay={2} /></div>
      {st.map((s, i) => { const k = glide(f, fps, at(s.at, 8 + i * 10)); const w = 1100 - i * (700 / Math.max(1, st.length - 1)); const col = s.color || COLS[i % 5];
        return <div key={i} style={{ position: 'absolute', left: 960 - w / 2 + 200, top: 320 + i * 150, width: w, height: 120, opacity: clamp(k * 1.5), transform: `translateY(${(1 - k) * -40}px)`,
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)', background: `linear-gradient(90deg, ${accent(col)}d9, ${accent(col)})`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', boxSizing: 'border-box' }}>
          <span style={{ fontFamily: F, fontWeight: 900, fontSize: fitSize(s.label, 48, w - 360, 28), color: onColor(accent(col)), whiteSpace: 'nowrap' }}>{s.label}</span><span style={{ fontFamily: M, fontWeight: 900, fontSize: 48, color: onColor(accent(col)) }}>{s.value ?? ''}</span></div>; })}
    </Stage>
  );
};

// Cycle — 闭环 / 飞轮
export const Cycle: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const nodes: any[] = p.nodes || []; const n = nodes.length; const R = 300, cx = 1180, cy = 600;
  const rot = f * 0.6;
  return (
    <Stage bg={bg || { variant: 'nebula', a: 'cyan', b: 'violet' }} chapter={chapter} color={p.color || 'cyan'}>
      <div style={{ position: 'absolute', left: 110, top: 300, width: 600 }}>{p.kicker && <Tag style={{ fontSize: 22 }}>{p.kicker}</Tag>}<Kinetic text={p.title || ''} size={84} delay={2} />{p.center && <div style={{ marginTop: 30, fontFamily: F, fontSize: 40, color: 'var(--ink-dim)' }}>{p.sub}</div>}</div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} stroke={theme.ink} strokeOpacity={.15} strokeWidth={4} fill="none" strokeDasharray="14 12" transform={`rotate(${rot} ${cx} ${cy})`} />
        <circle cx={cx + Math.cos((f / 30) * 1.4) * R} cy={cy + Math.sin((f / 30) * 1.4) * R} r={12} fill={accent('cyan')} style={{ filter: `drop-shadow(0 0 12px ${accent('cyan')})` }} />
      </svg>
      {p.center && <div style={{ position: 'absolute', left: cx - 110, top: cy - 110, width: 220, height: 220, borderRadius: 110, background: 'radial-gradient(circle, #fff, rgba(140,160,255,.4) 60%, transparent 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 48, color: '#0a0a18' }}>{p.center}</div>}
      {nodes.map((nd, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; const k = pop(f, fps, at(nd.at, 8 + i * 8)); const col = nd.color || COLS[i % 5];
        return <div key={i} style={{ position: 'absolute', left: cx + Math.cos(a) * R - 130, top: cy + Math.sin(a) * R - 55, width: 260, height: 110, opacity: clamp(k), transform: `scale(${k})` }}>
          <Glass color={col} style={{ inset: 0 }} beam={false}><div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 46, color: 'var(--ink)' }}>{nd.title}</div></Glass></div>; })}
    </Stage>
  );
};

// Evolution — 时代演变：卡片横向推进（从过去到现在）
export const Evolution: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const eras: any[] = p.eras || []; const n = eras.length;
  const active = eras.reduce((k, e, i) => (f >= at(e.at, 6 + i * 16) ? i : k), 0);
  return (
    <Stage bg={bg || { variant: 'tunnel', a: 'cyan', b: 'gold', intensity: .5 }} chapter={chapter} color={p.color || 'gold'}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}><Kinetic text={p.title || ''} size={fitSize(p.title || '', 80, 1700, 44, 0.02)} delay={2} /></div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {eras.map((e, i) => { const d = i - active; const k = glide(f, fps, at(e.at, 6 + i * 16)); const col = e.color || (i === n - 1 ? 'gold' : COLS[i % 5]);
          return <div key={i} style={{ position: 'absolute', left: 960 - 260 + d * 580, top: 340, width: 520, height: 560, opacity: clamp(k * 1.5) * (d === 0 ? 1 : Math.abs(d) === 1 ? 0.45 : 0), transform: `translateZ(${d === 0 ? 0 : -200}px) rotateY(${d * -18}deg)` }}>
            {/* 只显示当前和左右相邻的卡，更远的会被推到画面边缘切成半张，直接隐藏 */}
            <Glass color={col} style={{ inset: 0 }} beam={d === 0}><div style={{ padding: 50 }}>
              <div style={{ fontFamily: M, fontWeight: 900, fontSize: 64, color: accent(col) }}>{e.year}</div>
              <div style={{ marginTop: 60, fontFamily: F, fontWeight: 900, fontSize: fitSize(e.title || '', 84, 420, 36), whiteSpace: 'nowrap', color: 'var(--ink)' }}>{e.title}</div>
              {e.sub && <div style={{ marginTop: 20, fontFamily: F, fontSize: fitSize(e.sub, 34, 420, 20), whiteSpace: 'nowrap', color: 'var(--ink-dim)' }}>{e.sub}</div>}</div></Glass></div>; })}
      </AbsoluteFill>
    </Stage>
  );
};

// Podium — 前三名领奖台
export const Podium: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const it: any[] = p.items || []; const order = [1, 0, 2]; const H = [520, 380, 290];
  return (
    <Stage bg={bg || { variant: 'rays', a: 'gold', b: 'violet' }} chapter={chapter} color="gold">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}><Kinetic text={p.title || ''} size={80} delay={2} style={{ display: 'inline-block' }} /></div>
      {order.map((rank, slot) => { const d = it[rank]; if (!d) return null; const k = pop(f, fps, at(d.at, 10 + (2 - rank) * 10), { damping: 12, stiffness: 120 }); const h = H[rank] * clamp(k, 0, 1.1);
        const col = ['gold', 'cyan', 'pink'][rank]; const x = 460 + slot * 500;
        return <div key={slot} style={{ position: 'absolute', left: x - 200, bottom: 80, width: 400 }}>
          <div style={{ textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 56, color: 'var(--ink)', marginBottom: 16, opacity: clamp(k) }}>{d.label}</div>
          <div style={{ height: h, borderRadius: '24px 24px 0 0', background: `linear-gradient(to bottom, ${accent(col)}, ${accent(col)}33)`, boxShadow: `0 0 60px ${accent(col)}66`, display: 'flex', justifyContent: 'center', paddingTop: 30, boxSizing: 'border-box' }}>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 120, color: onColor(accent(col)) }}>{rank + 1}</div></div></div>; })}
    </Stage>
  );
};

// Recap — 总结卡墙（逐个点亮）
export const Recap: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const pts: any[] = p.points || []; const n = pts.length; const cols = n > 4 ? 3 : 2;
  const w = (1700 - (cols - 1) * 40) / cols;
  return (
    <Stage bg={bg || { variant: 'aurora', a: 'cyan', b: 'green' }} chapter={chapter} color={p.color || 'green'}>
      <div style={{ position: 'absolute', left: 110, top: 150 }}><Tag color="green" style={{ fontSize: 22 }}>{p.kicker || 'RECAP'}</Tag><Kinetic text={p.title || '划重点'} size={84} delay={2} /></div>
      {pts.map((pt, i) => { const k = pop(f, fps, at(pt.at, 8 + i * 8)); const col = pt.color || COLS[i % 5];
        return <div key={i} style={{ position: 'absolute', left: 110 + (i % cols) * (w + 40), top: 340 + Math.floor(i / cols) * 200, width: w, height: 170, opacity: clamp(k), transform: `scale(${0.9 + 0.1 * clamp(k)})` }}>
          <Glass color={col} style={{ inset: 0 }} beam={false}><div style={{ display: 'flex', alignItems: 'center', gap: 28, height: '100%', padding: '0 40px' }}>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 64, color: accent(col) }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 48, color: 'var(--ink)' }}>{pt.text ?? pt}</div></div></Glass></div>; })}
    </Stage>
  );
};

export const MORE2: Record<string, React.FC<PageProps>> = { BeforeAfter, BarRace, Donut, Bars3D, LineChart, Checklist, BentoGrid, NumberedList, FlowChart, Funnel, Cycle, Evolution, Podium, Recap };
