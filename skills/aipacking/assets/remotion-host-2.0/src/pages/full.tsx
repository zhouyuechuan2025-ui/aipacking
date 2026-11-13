import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, OffthreadVideo, Img, staticFile } from 'remotion';
import { LightField } from '../bg/LightField';
import { Glass, Kinetic, Tag, Pill, Stamp, CountUp, Chrome, GridFloor, Vignette, Shine } from '../ui';
import { theme, accent, currentTheme, themeVars, accentText } from '../lib/theme';
import { pop, prog, glide, clamp, rel, lerp } from '../lib/anim';
import { fitSize } from '../lib/fit';

export type PageProps = { p: any; start: number; dur: number; chapter?: { index: number; total: number; title: string; en?: string; cn?: string; color?: string }; bg?: any; video?: string };
const F = theme.font, M = theme.mono;
export const useT = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s?: number, fb = 0) => rel(s, start, fps, fb) }; };

/** 禁用的背景 → 替代背景 */
export const BANNED_BG: Record<string, string> = { rays: 'silk', prism: 'aurora', tunnel: 'grid' };

/** Background + chrome shared by all full pages */
export const Stage: React.FC<{ bg?: any; chapter?: PageProps['chapter']; color?: string; children: React.ReactNode; drift?: boolean }> = ({ bg, chapter, color = 'cyan', children, drift = true }) => {
  const f = useCurrentFrame(); const T = currentTheme();
  const b = { variant: 'silk', a: accent(color), b: accent('violet'), intensity: 0.9, ...(bg || {}) };
  // 射线/光谱放射/光速隧道这类背景用户明确不要：模板代码或分镜里写了也统一换成安静的背景
  b.variant = BANNED_BG[b.variant] || b.variant;
  b.intensity = (b.intensity ?? 0.9) * 0.65; // 光效背景整体调暗：太亮会压过上面的文字，也显得花哨
  const z = drift ? 1.06 - Math.min(f, 120) / 120 * 0.06 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, overflow: 'hidden', ...(themeVars(T) as any) }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}><Backdrop T={T} b={b} color={color} /></AbsoluteFill>
      <Vignette strength={0.55} />
      {children}
      {chapter && <Chrome chapter={chapter.title} index={chapter.index} total={chapter.total} color={color} brand={(chapter as any).brand} />}
    </AbsoluteFill>
  );
};

/** stage background for each style pack */
const Backdrop: React.FC<{ T: any; b: any; color: string }> = ({ T, b, color }) => {
  const f = useCurrentFrame();
  if (T.stage === 'lightfield') return b.variant === 'grid'
    ? <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1f4a 0%, #05060b 70%)' }}><GridFloor color={color} /></AbsoluteFill>
    : <LightField variant={b.variant} a={accent(b.a)} b={accent(b.b)} intensity={b.intensity} />;
  if (T.stage === 'keynote' && !T.dark) return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 0%, #FFFFFF 0%, ${T.bg} 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)', backgroundSize: '96px 96px' }} />
    </AbsoluteFill>);
  if (T.stage === 'keynote') return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, #151822 0%, #0A0B0F 70%)' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 85% 12%, rgba(59,76,202,.22) 0%, transparent 38%)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.032) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.032) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '48px 48px, 48px 48px, 192px 192px, 192px 192px' }} />
      <AbsoluteFill style={{ background: `linear-gradient(100deg, transparent ${((f * 0.6) % 160) - 40}%, rgba(255,255,255,.035) ${((f * 0.6) % 160) - 25}%, transparent ${((f * 0.6) % 160) - 10}%)` }} />
    </AbsoluteFill>);
  if (T.stage === 'board') {
    const marks = Array.from({ length: 26 }).map((_, i) => { const x = (i * 397) % 1880, y = (i * 263) % 1040, r = 30 + (i * 37) % 90; return i % 3 === 0
      ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={i % 2 ? '#9aa0a8' : '#8aa0c8'} strokeWidth={5} opacity={0.08} />
      : <path key={i} d={`M${x},${y} q${r},${-r / 3} ${r * 2},0 t${r * 2},0`} fill="none" stroke="#9aa0a8" strokeWidth={6} opacity={0.07} strokeLinecap="round" />; });
    return <AbsoluteFill style={{ background: 'linear-gradient(160deg, #fbfbf9 0%, #eeede9 100%)' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>{marks}</svg>
      <AbsoluteFill style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.55) 42%, transparent 55%)' }} />
      <AbsoluteFill style={{ boxShadow: 'inset 0 0 0 26px #d9dadc, inset 0 0 0 30px #c3c5c9' }} />
    </AbsoluteFill>;
  }
  if (T.stage === 'paper') return (
    <AbsoluteFill style={{ background: '#F6F3EC' }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#E4DDCF 1.6px, transparent 1.6px)', backgroundSize: '24px 24px', backgroundPosition: `${-f * 0.3}px 0` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(120,100,70,.10) 100%)' }} />
    </AbsoluteFill>);
  if (T.stage === 'swiss') return (
    <AbsoluteFill style={{ background: '#EAE9E5' }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(90deg, #CFCEC9 1px, transparent 1px)', backgroundSize: '160px 100%', opacity: 0.8 }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(#CFCEC9 1px, transparent 1px)', backgroundSize: '100% 90px', opacity: 0.5 }} />
    </AbsoluteFill>);
  // show
  const scallops = Array.from({ length: 17 }).map((_, i) => <div key={i} style={{ position: 'absolute', top: 30, left: i * 120 - 20, width: 140, height: 90, borderRadius: '0 0 70px 70px', background: '#FF5A5F', border: '7px solid #1B1B1B', borderTop: 'none' }} />);
  return <AbsoluteFill style={{ background: '#6B4FBB' }}>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 30% 70% at 25% 0%, rgba(255,246,229,.18), transparent 70%), radial-gradient(ellipse 30% 70% at 75% 0%, rgba(255,246,229,.18), transparent 70%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 40, background: '#FF5A5F', borderBottom: '7px solid #1B1B1B' }} />{scallops}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: '#46318F', borderTop: '7px solid #1B1B1B' }} />
  </AbsoluteFill>;
};

// 1. HookTitle — giant kinetic headline
export const HookTitle: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const color = p.color || 'cyan';
  const z = interpolate(f, [0, dur], [1.12, 1], { extrapolateRight: 'clamp' });
  const streak = prog(f, 4, 22);
  return (
    <Stage bg={bg || { variant: 'prism' }} chapter={chapter} color={color}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})` }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accent(color)}, #fff, ${accent(color)}, transparent)`, opacity: 0.8 * (1 - streak) + 0.1, transform: `scaleX(${streak})` }} />
        {p.kicker && <Tag color={color} style={{ marginBottom: 28, opacity: prog(f, 2, 12), fontSize: 24 }}>{p.kicker}</Tag>}
        <Shine at={at(p.shineAt, 18)}>
          <Kinetic text={p.title} size={p.size || 210} mode="pop" delay={3} stagger={2.2} gradient={p.gradient ? [theme.ink, accent(color)] : undefined} style={{ textShadow: 'var(--title-shadow)' }} />
        </Shine>
        {p.sub && <div style={{ marginTop: 34, fontFamily: F, fontSize: 44, fontWeight: 700, color: 'var(--ink-dim)', opacity: prog(f, 14, 26), transform: `translateY(${(1 - prog(f, 14, 26)) * 20}px)` }}>{p.sub}</div>}
        {p.en && <div style={{ marginTop: 20, fontFamily: M, fontSize: 26, letterSpacing: '0.4em', color: accent(p.enColor || color), opacity: prog(f, 18, 30) }}>{p.en}</div>}
      </AbsoluteFill>
      {p.stamp && <Stamp text={p.stamp.text} at={at(p.stamp.at, 20)} color={p.stamp.color || 'red'} size={p.stamp.size || 70} style={{ left: p.stamp.x ?? 1480, top: p.stamp.y ?? 330 }} />}
    </Stage>
  );
};

// 2. StatImpact — counter + energy ring, keyframes at absolute times
export const StatImpact: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const color = p.color || 'violet';
  const kfs: { at?: number; value: number }[] = p.keyframes || [{ value: p.from ?? 0 }, { value: p.to ?? 100, at: start + 0.4 }];
  let v = kfs[0].value;
  for (let i = 1; i < kfs.length; i++) { const t0 = at(kfs[i].at, i * 20); v = lerp(v, kfs[i].value, clamp(prog(f, t0 - 8, t0 + 6))); }
  const max = p.max ?? 100; const R = 290, C = 2 * Math.PI * R;
  const done = Math.abs(v - kfs[kfs.length - 1].value) < 0.5;
  const popK = done ? pop(f, fps, at(kfs[kfs.length - 1].at, 20) + 4) : 1;
  return (
    <Stage bg={bg || { variant: 'aurora', a: 'violet', b: 'cyan' }} chapter={chapter} color={color}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {p.kicker && <Tag color={color} style={{ position: 'absolute', top: 150, fontSize: 24 }}>{p.kicker}</Tag>}
        <svg width={760} height={760} style={{ position: 'absolute' }} viewBox="0 0 760 760">
          <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor={accent('cyan')} /><stop offset=".5" stopColor={accent('violet')} /><stop offset="1" stopColor={accent('pink')} /></linearGradient></defs>
          <circle cx={380} cy={380} r={R} stroke={theme.ink} strokeOpacity={.08} strokeWidth={28} fill="none" />
          <circle cx={380} cy={380} r={R} stroke="url(#rg)" strokeWidth={28} fill="none" strokeLinecap="round" strokeDasharray={`${C * clamp(v / max)} ${C}`} transform="rotate(-90 380 380)" style={{ filter: `drop-shadow(0 0 18px ${accent(color)})` }} />
          {Array.from({ length: 60 }).map((_, i) => { const a = -Math.PI / 2 + (i / 60) * Math.PI * 2; const on = i / 60 <= v / max;
            return <line key={i} x1={380 + Math.cos(a) * 330} y1={380 + Math.sin(a) * 330} x2={380 + Math.cos(a) * 350} y2={380 + Math.sin(a) * 350} stroke={theme.ink} strokeOpacity={on ? 1 : .15} strokeWidth={3} />; })}
        </svg>
        <div style={{ fontFamily: M, fontWeight: 900, fontSize: 200, color: 'var(--ink)', transform: `scale(${popK})`, textShadow: `0 0 40px ${accent(color)}88` }}>{Math.round(v)}{p.suffix ?? '%'}</div>
        <div style={{ position: 'absolute', top: 700, fontFamily: F, fontSize: 52, fontWeight: 900, color: done && p.finalWord ? accent('gold') : 'var(--ink-dim)', letterSpacing: '0.2em' }}>{done && p.finalWord ? p.finalWord : p.label}</div>
      </AbsoluteFill>
    </Stage>
  );
};

// 3. Versus — A vs B columns
export const Versus: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const sides = [p.left, p.right].map((s, i) => ({ ...s, key: i ? 'right' : 'left', color: s.color || (i ? 'green' : 'pink') }));
  return (
    <Stage bg={bg || { variant: 'silk', a: 'violet', b: 'cyan', intensity: .7 }} chapter={chapter} color={sides[p.focus === 'right' ? 1 : 0].color}>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {sides.map((s, i) => {
          const on = !p.focus || p.focus === 'both' || p.focus === s.key;
          const k = glide(f, fps, i * 4);
          const x = i ? 1010 : 110;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: 160, width: 800, height: 760, opacity: (on ? 1 : 0.35) * k,
              transform: `rotateY(${(i ? -1 : 1) * (1 - k) * 25 + (i ? -4 : 4)}deg) scale(${on ? 1 : 0.94})`, transformOrigin: i ? 'left center' : 'right center' }}>
              <Glass color={s.color} beam={on} style={{ inset: 0 }}>
                <div style={{ padding: '56px 56px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
                    <div style={{ fontFamily: M, fontWeight: 900, fontSize: 130, color: accent(s.color), lineHeight: 1 }}>{s.letter || (i ? 'B' : 'A')}</div>
                    <div><Tag color={s.color}>{s.tag}</Tag><div style={{ fontFamily: F, fontWeight: 900, fontSize: 68, color: 'var(--ink)' }}>{s.title}</div></div>
                  </div>
                  <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {(s.items || []).map((it: any, j: number) => { const kk = on ? pop(f, fps, at(it.at, 10 + j * 6)) : 1;
                      return <div key={j} style={{ opacity: clamp(kk), transform: `translateX(${(1 - kk) * 40}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 28px', borderRadius: 18, background: accent(s.color) + '1a', border: `1.5px solid ${accent(s.color)}88` }}>
                        <span style={{ color: accent(s.color), fontSize: 34, fontWeight: 900 }}>✓</span>
                        <span style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: 'var(--ink)' }}>{it.text ?? it}</span></div>; })}
                  </div>
                </div>
              </Glass>
            </div>);
        })}
        <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${pop(f, fps, 8)})`, width: 120, height: 120, borderRadius: 60, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 48, color: theme.bg, boxShadow: `0 0 60px ${theme.ink}88` }}>VS</div>
        {p.verdict && <Stamp text={p.verdict.text} at={at(p.verdict.at, 40)} color={p.verdict.color || 'red'} size={p.verdict.size || 64} style={{ left: p.verdict.x ?? (p.focus === 'right' ? 1410 : 510), top: p.verdict.y ?? 820 }} />}
      </AbsoluteFill>
    </Stage>
  );
};

// 4. TripleCards — 3D flipping concept cards, optional merge into a core
export const TripleCards: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const cards = p.cards || [];
  const mergeAt = p.merge ? at(p.merge.at, dur - 25) : 1e9;
  const m = prog(f, mergeAt, mergeAt + 14);
  const core = pop(f, fps, mergeAt + 6);
  return (
    <Stage bg={bg || { variant: 'nebula', a: 'violet', b: 'pink' }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}>
        {p.kicker && <Tag color={p.color || 'violet'} style={{ fontSize: 22, opacity: prog(f, 0, 10) }}>{p.kicker}</Tag>}
        <Kinetic text={p.title || ''} size={fitSize(p.title || '', 84, 1680, 48, 0.02)} delay={2} style={{ display: 'inline-block', marginTop: 12 }} />
      </div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {cards.map((c: any, i: number) => {
          const n = cards.length; const k = glide(f, fps, at(c.at, 8 + i * 8));
          // 卡片按数量均分 1680px（2~4 张都放得下），最宽 460px
          const cw = Math.min(460, (1680 - (n - 1) * 40) / n), ch = cw * 560 / 460;
          const x0 = 960 + (i - (n - 1) / 2) * (cw + 40);
          const x = lerp(x0, 960, m), s = lerp(1, 0.2, m);
          const col = c.color || ['pink', 'cyan', 'violet', 'gold'][i % 4];
          return (
            <div key={i} style={{ position: 'absolute', left: x - cw / 2, top: 330, width: cw, height: ch, opacity: clamp(k * 2) * (1 - m * 0.9),
              transform: `rotateY(${(1 - k) * 90}deg) scale(${s}) translateZ(${Math.sin(f / 20 + i) * 10}px)` }}>
              <Glass color={col} style={{ inset: 0 }} tint="rgba(16,14,34,.72)">
                <div style={{ position: 'absolute', left: 44, top: 44, width: 60, height: 6, background: accent(col), borderRadius: 3 }} />
                <div style={{ position: 'absolute', right: 44, top: 34, fontFamily: M, fontSize: 30, fontWeight: 700, color: accent(col) }}>{String(i + 1).padStart(2, '0')}</div>
                {c.icon && <div style={{ position: 'absolute', left: 0, right: 0, top: ch * 0.2, textAlign: 'center', fontSize: cw * 0.2, color: accent(col) }}>{c.icon}</div>}
                <div style={{ position: 'absolute', left: 0, right: 0, top: ch * 0.48, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: fitSize(c.title, 104, cw - 60, 36), color: 'var(--ink)', whiteSpace: 'nowrap' }}>{c.title}</div>
                {c.en && <div style={{ position: 'absolute', left: 0, right: 0, top: ch * 0.77, textAlign: 'center', fontFamily: M, fontSize: fitSize(c.en, 26, cw - 60, 14, 0.25), letterSpacing: '0.25em', color: accent(col), whiteSpace: 'nowrap' }}>{c.en}</div>}
              </Glass>
            </div>);
        })}
        {p.merge && core > 0.01 && (
          <div style={{ position: 'absolute', left: 960, top: 610, transform: `translate(-50%,-50%) scale(${core})`, width: 420, height: 420, borderRadius: 210,
            background: 'radial-gradient(circle, #fff 0%, rgba(170,200,255,.8) 25%, rgba(120,90,255,.25) 60%, transparent 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 90, color: '#0a0a18' }}>{p.merge.label}</div>
          </div>)}
      </AbsoluteFill>
    </Stage>
  );
};

// 5. Steps — horizontal numbered steps with arrows, optional stamp
export const Steps: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const steps = p.steps || []; const n = steps.length; const w = Math.min(520, (1700 - (n - 1) * 60) / n);
  const col = p.color || 'gold';
  return (
    <Stage bg={bg || { variant: 'rays', a: col, b: 'pink' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 170 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 22 }}>{p.kicker}</Tag>}
        <Kinetic text={p.title || ''} size={fitSize(p.title || '', 88, 1700, 48, 0.02)} delay={2} style={{ marginTop: 10 }} />
      </div>
      {steps.map((s: any, i: number) => {
        const k = pop(f, fps, at(s.at, 10 + i * 10)); const x = 110 + i * (w + 60);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x, top: 400, width: w, height: 420, opacity: clamp(k), transform: `translateY(${(1 - k) * 80}px) scale(${0.85 + 0.15 * k})` }}>
              <Glass color={col} style={{ inset: 0 }}>
                <div style={{ position: 'absolute', left: 48, top: 40, fontFamily: M, fontWeight: 900, fontSize: 96, color: accent(col) + '55' }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ position: 'absolute', left: 48, top: 200, fontFamily: F, fontWeight: 900, fontSize: fitSize(s.title, 100, w - 96, 36), color: 'var(--ink)', whiteSpace: 'nowrap' }}>{s.title}</div>
                {s.en && <div style={{ position: 'absolute', left: 52, top: 340, fontFamily: M, fontSize: fitSize(s.en, 24, w - 100, 14, 0.25), letterSpacing: '0.25em', color: accent(col), whiteSpace: 'nowrap' }}>{s.en}</div>}
              </Glass>
            </div>
            {i < n - 1 && <div style={{ position: 'absolute', left: x + w + 8, top: 590, width: 44, height: 4, background: 'var(--ink-faint)', opacity: clamp(k) }} />}
          </React.Fragment>);
      })}
      {p.stamp && <Stamp text={p.stamp.text} at={at(p.stamp.at, dur - 30)} color={p.stamp.color || 'red'} size={p.stamp.size || 120} rotate={-6} style={{ left: 960, top: 610 }} />}
    </Stage>
  );
};

// 6. Timeline — ordered nodes on a glowing rail
export const Timeline: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const nodes = p.nodes || []; const n = nodes.length; const col = p.color || 'cyan';
  const rail = prog(f, 4, Math.max(20, at(nodes[n - 1]?.at, dur - 10)));
  return (
    <Stage bg={bg || { variant: 'tunnel', a: col, b: 'violet', intensity: .55 }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 170 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 22 }}>{p.kicker}</Tag>}
        <Kinetic text={p.title || ''} size={88} delay={2} style={{ marginTop: 10 }} />
      </div>
      <div style={{ position: 'absolute', left: 200, right: 200, top: 640, height: 4, background: 'var(--chip-bg)' }} />
      <div style={{ position: 'absolute', left: 200, top: 640, height: 4, width: 1520 * rail, background: `linear-gradient(90deg, ${accent(col)}, #fff)`, boxShadow: `0 0 20px ${accent(col)}` }} />
      {nodes.map((nd: any, i: number) => {
        const k = pop(f, fps, at(nd.at, 12 + i * 12)); const x = 200 + (n === 1 ? 760 : (i / (n - 1)) * 1520);
        const c = nd.color || (i === n - 1 ? 'gold' : col);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 642, transform: `translate(-50%,-50%)`, opacity: clamp(k) }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: accent(c), transform: `scale(${k})`, boxShadow: `0 0 40px ${accent(c)}`, border: '10px solid #05060b', outline: `2px solid ${accent(c)}` }} />
            <div style={{ position: 'absolute', left: '50%', bottom: 90, transform: `translateX(-50%) translateY(${(1 - k) * 30}px)`, textAlign: 'center', whiteSpace: 'nowrap' }}>
              <div style={{ fontFamily: M, fontSize: 28, color: accent(c), fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily: F, fontWeight: 900, fontSize: nd.title.length > 4 ? 64 : 110, color: 'var(--ink)' }}>{nd.title}</div>
            </div>
            {nd.en && <div style={{ position: 'absolute', left: '50%', top: 70, transform: 'translateX(-50%)', fontFamily: M, fontSize: 24, letterSpacing: '0.25em', color: accent(c), whiteSpace: 'nowrap' }}>{nd.en}</div>}
          </div>);
      })}
    </Stage>
  );
};

// 7. Chart — lines (crossing trends) or 3D bars (spatial)
export const Chart: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const col = p.color || 'cyan';
  const series = p.series || [];
  if (p.kind === 'bars3d') {
    const cam = prog(f, 0, dur, (t: number) => t);
    const maxV = Math.max(...series.map((s: any) => s.value));
    return (
      <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={col} drift={false}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}><Kinetic text={p.title || ''} size={84} delay={2} style={{ display: 'inline-block' }} /></div>
        <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: '50% 30%' }}>
          <div style={{ position: 'absolute', left: 960, top: 900, transformStyle: 'preserve-3d', transform: `rotateX(-14deg) rotateY(${lerp(-28, 18, cam)}deg)` }}>
            {series.map((s: any, i: number) => {
              const n = series.length; const x = (i - (n - 1) / 2) * 300;
              const hk = pop(f, fps, at(s.at, 6 + i * 6), { damping: 11, stiffness: 90 });
              const h = (s.value / maxV) * 560 * hk; const c = accent(s.color || ['cyan', 'gold', 'pink', 'violet'][i % 4]); const W3 = 170;
              const face = (tr: string, w: number, hh: number, bgc: string) => <div style={{ position: 'absolute', left: -w / 2, bottom: 0, width: w, height: hh, background: bgc, transform: tr, transformOrigin: 'bottom center', backfaceVisibility: 'hidden' }} />;
              return (
                <div key={i} style={{ position: 'absolute', left: x, top: 0, transformStyle: 'preserve-3d' }}>
                  {face(`translateZ(${W3 / 2}px)`, W3, h, `linear-gradient(to top, ${c}66, ${c})`)}
                  {face(`rotateY(90deg) translateZ(${W3 / 2}px)`, W3, h, `linear-gradient(to top, ${c}33, ${c}aa)`)}
                  {face(`rotateY(-90deg) translateZ(${W3 / 2}px)`, W3, h, `linear-gradient(to top, ${c}33, ${c}aa)`)}
                  <div style={{ position: 'absolute', left: -W3 / 2, top: -h - W3 / 2, width: W3, height: W3, background: '#fff', opacity: .9, transform: `rotateX(90deg)`, transformOrigin: 'center', boxShadow: `0 0 50px ${c}` }} />
                  <div style={{ position: 'absolute', left: 0, top: -h - 110, transform: 'translateX(-50%)', fontFamily: M, fontWeight: 900, fontSize: 54, color: 'var(--ink)', whiteSpace: 'nowrap', opacity: clamp(hk) }}>{s.display ?? Math.round(s.value * hk)}</div>
                  <div style={{ position: 'absolute', left: 0, top: 40, transform: 'translateX(-50%)', fontFamily: F, fontWeight: 800, fontSize: 36, color: c, whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>);
            })}
          </div>
        </AbsoluteFill>
        {p.callout && <Stamp text={p.callout.text} at={at(p.callout.at, 30)} color={p.callout.color || 'gold'} size={p.callout.size || 70} rotate={-4} style={{ left: p.callout.x ?? 1500, top: p.callout.y ?? 330 }} />}
      </Stage>
    );
  }
  // line chart
  const gx = 180, gy = 330, gw = 1560, gh = 520;
  const pr = prog(f, 8, Math.max(30, dur * 0.6), (t: number) => 1 - Math.pow(1 - t, 3));
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 170 }}><Kinetic text={p.title || ''} size={88} delay={2} /></div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1={gx} x2={gx + gw} y1={gy + (i * gh) / 4} y2={gy + (i * gh) / 4} stroke={theme.ink} strokeOpacity={.08} />)}
        {(p.xLabels || []).map((l: string, i: number, a: string[]) => <text key={i} x={gx + (i / (a.length - 1)) * gw} y={gy + gh + 44} fill={theme.ink} fillOpacity={.45} fontFamily={M} fontSize={22} textAnchor="middle">{l}</text>)}
        {series.map((s: any, si: number) => {
          const c = accent(s.color || ['cyan', 'pink', 'gold'][si]); const vals: number[] = s.values; const N = 60;
          const pts: [number, number][] = [];
          for (let i = 0; i <= N * pr; i++) { const u = i / N; const x = u * (vals.length - 1); const i0 = Math.floor(x), i1 = Math.min(vals.length - 1, i0 + 1);
            const v = lerp(vals[i0], vals[i1], (1 - Math.cos((x - i0) * Math.PI)) / 2); pts.push([gx + u * gw, gy + gh - v * gh]); }
          if (pts.length < 2) return null; const d = 'M' + pts.map(q => q.join(',')).join('L'); const e = pts[pts.length - 1];
          return <g key={si}>
            <path d={`${d}L${e[0]},${gy + gh}L${gx},${gy + gh}Z`} fill={c} opacity={0.12} />
            <path d={d} stroke={c} strokeWidth={8} fill="none" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${c})` }} />
            <circle cx={e[0]} cy={e[1]} r={14} fill="#fff" />
            {pr > 0.95 && <text x={e[0] - 30} y={e[1] + (s.labelDy ?? -30)} fill={c} fontFamily={F} fontWeight={900} fontSize={46} textAnchor="end">{s.label}</text>}
          </g>;
        })}
      </svg>
      {p.callout && <div style={{ position: 'absolute', right: 110, top: 190, opacity: prog(f, at(p.callout.at, 40), at(p.callout.at, 40) + 8) }}><Pill color={p.callout.color || 'pink'} size={32}>{p.callout.text}</Pill></div>}
    </Stage>
  );
};

// 8. Balance — scale tipping toward the winner
export const Balance: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const k = pop(f, fps, at(p.at, 30), { damping: 9, stiffness: 70 });
  const win = p.winner === 'left' ? -1 : 1;
  const tilt = lerp(-win * 10, win * 15, k);
  const L = 560, rad = (tilt * Math.PI) / 180;
  const pan = (side: number, d: any) => { const x = 960 + side * Math.cos(rad) * L, y = 470 + side * Math.sin(rad) * L; const c = d.color || (side === win ? 'cyan' : 'pink');
    return <div key={side} style={{ position: 'absolute', left: x - 200, top: y + 140, width: 400, height: 150 }}>
      <svg style={{ position: 'absolute', left: 0, top: -140, overflow: 'visible' }} width={400} height={140}><path d="M200,0 L60,140 M200,0 L340,140" stroke="rgba(210,220,255,.6)" strokeWidth={3} /></svg>
      <Glass color={c} style={{ inset: 0 }} tint="rgba(14,16,30,.8)"><div style={{ textAlign: 'center', paddingTop: 26, fontFamily: F, fontWeight: 900, fontSize: 52, color: 'var(--ink)' }}>{d.label}</div>
        <div style={{ textAlign: 'center', fontFamily: M, fontSize: 22, letterSpacing: '0.25em', color: accentText(c) }}>{d.en}</div></Glass></div>; };
  return (
    <Stage bg={bg || { variant: 'rays', a: 'cyan', b: 'violet', intensity: .8 }} chapter={chapter} color="cyan">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: 0.3 + 0.7 * clamp(k) }}>
        <Kinetic text={p.title || ''} size={110} delay={2} gradient={[theme.ink, accent('cyan')]} style={{ display: 'inline-block' }} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1={960} y1={470} x2={960} y2={830} stroke="#cfd6ff" strokeWidth={8} />
        <path d="M860,850 L1060,850 L960,790 Z" fill="#cfd6ff" />
        <g transform={`rotate(${tilt} 960 470)`}><rect x={960 - L} y={464} width={2 * L} height={12} rx={6} fill="#cfd6ff" /></g>
        <circle cx={960} cy={470} r={18} fill="#fff" />
      </svg>
      {pan(-1, p.left)}{pan(1, p.right)}
    </Stage>
  );
};

// 9. Quote — cinematic statement
export const Quote: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f } = useT(start); const col = p.color || 'gold';
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet', intensity: .8 }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 180px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 240, color: accent(col), lineHeight: 0.6, opacity: prog(f, 0, 10) }}>“</div>
        {(p.lines || [p.quote]).map((l: string, i: number) => <Kinetic key={i} text={l} size={p.size || 92} delay={4 + i * 10} mode="blur" style={{ marginTop: 18 }} gradient={i === (p.highlightLine ?? -1) ? [theme.ink, accent(col)] : undefined} />)}
        {p.author && <div style={{ marginTop: 50, fontFamily: M, fontSize: 26, letterSpacing: '0.3em', color: accent(col), opacity: prog(f, 24, 36) }}>— {p.author}</div>}
      </AbsoluteFill>
    </Stage>
  );
};

// 10. Showcase — browser / phone mockup with media, prompt bar
export const Showcase: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan';
  const k = glide(f, fps, 0);
  const media = p.media === 'self' && !video ? <LightField variant="prism" /> : p.media === 'self' ? <OffthreadVideo src={staticFile(video!)} muted startFrom={Math.round(start * fps)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : p.media && /\.(mp4|mov|webm)$/i.test(p.media) ? <OffthreadVideo src={staticFile(p.media)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : p.media ? <Img src={staticFile(p.media)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <LightField variant="prism" />;
  const pr = p.prompt || ''; const n = pr ? Math.floor(pr.length * prog(f, 10, 10 + pr.length * 1.4, (t: number) => t)) : 0;
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div style={{ position: 'absolute', left: 110, top: 200, width: 1100, height: 680, transform: `rotateY(${(1 - k) * 30 + 8}deg) rotateX(${(1 - k) * -10 + 2}deg)`, transformOrigin: 'left center', opacity: clamp(k * 2) }}>
          <Glass color={col} style={{ inset: -18 }} radius={26} tint="rgba(10,12,24,.8)" />
          <div style={{ position: 'absolute', left: 0, top: -2, right: 0, height: 48, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
            <div style={{ marginLeft: 20, fontFamily: M, fontSize: 18, color: 'var(--ink-dim)' }}>{p.url || 'preview · 1080p · 30fps'}</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 54, right: 0, bottom: 0, borderRadius: 14, overflow: 'hidden', boxShadow: `0 0 80px ${accent(col)}33` }}>{media}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 1290, top: 250, width: 540 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 22, opacity: prog(f, 4, 14) }}>{p.kicker}</Tag>}
        {pr && <Glass color="violet" style={{ position: 'relative', height: 150, marginTop: 20 }}><div style={{ padding: '28px 30px', fontFamily: F, fontSize: 32, fontWeight: 700, color: 'var(--ink)' }}>
          <div style={{ fontFamily: M, fontSize: 18, color: 'var(--ink-dim)', marginBottom: 10 }}>PROMPT</div>{pr.slice(0, n)}{n < pr.length ? '▌' : ''}</div></Glass>}
        <div style={{ marginTop: 60 }}>{(p.titleLines || [p.title]).map((t: string, i: number) => <Kinetic key={i} text={t} size={100} delay={at(p.titleAt, 30) + i * 6} color={i === 1 ? accent(col) : theme.ink} />)}</div>
      </div>
    </Stage>
  );
};

// 11. ChapterBreak — big number + title
export const ChapterBreak: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps } = useT(start); const col = p.color || 'cyan';
  const k = glide(f, fps, 0);
  return (
    <Stage bg={bg || { variant: 'tunnel', a: col, b: 'violet', intensity: .8 }} color={col}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div data-probe-skip style={{ fontFamily: M, fontWeight: 900, fontSize: 320, color: 'transparent', WebkitTextStroke: `3px ${accent(col)}`, opacity: 0.6 * k, transform: `scale(${lerp(1.6, 1, k)})`, position: 'absolute' }}>{String(p.index ?? 1).padStart(2, '0')}</div>
        <Kinetic text={p.title || ''} size={130} delay={4} mode="pop" />
        {p.en && <div style={{ marginTop: 24, fontFamily: M, fontSize: 28, letterSpacing: '0.45em', color: accent(col), opacity: prog(f, 12, 24) }}>{p.en}</div>}
      </AbsoluteFill>
    </Stage>
  );
};

export const FULL_PAGES: Record<string, React.FC<PageProps>> = { HookTitle, StatImpact, Versus, TripleCards, Steps, Timeline, Chart, Balance, Quote, Showcase, ChapterBreak };
