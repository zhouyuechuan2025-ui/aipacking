import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme, accent, currentTheme, accentText } from '../lib/theme';
import { pop, prog, clamp } from '../lib/anim';

/** Frosted glass panel with a travelling border beam (Magic-UI style, written from scratch). */
export const Glass: React.FC<{ style?: React.CSSProperties; color?: string; beam?: boolean; radius?: number; children?: React.ReactNode; tint?: string; solid?: string }> = ({
  style, color = 'cyan', beam = true, radius, children, tint, solid,
}) => {
  // solid：不管什么风格都用这个底色（终端、手机屏幕这类本身就是深色的设备），里面的字也跟着用深色主题的文字色
  const f = useCurrentFrame(); const T = currentTheme(); const P = T.panel;
  const ang = (f * 2.2) % 360; const c = accent(color); const r = radius ?? P.radius;
  const inner: React.CSSProperties = P.ink ? ({ ['--ink' as any]: P.ink, ['--ink-dim' as any]: P.inkDim, ['--chip-bg' as any]: 'rgba(27,27,27,.06)', ['--chip-solid' as any]: 'rgba(27,27,27,.06)', ['--title-shadow' as any]: 'none' } as any) : {};
  let face: React.ReactNode;
  if (solid) return <div style={{ position: 'absolute', borderRadius: r, ...style, ['--ink' as any]: '#F2F3F5', ['--ink-dim' as any]: 'rgba(242,243,245,.72)', ['--chip-bg' as any]: 'rgba(255,255,255,.06)' }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: solid, border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }} />
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div></div>;
  if (P.kind === 'glass') face = <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: T.id === 'tech-dark' ? (tint ?? P.bg) : P.bg, backdropFilter: T.glass.blur, WebkitBackdropFilter: T.glass.blur, border: P.border, boxShadow: P.shadow }} />;
  else if (P.kind === 'hand') face = <>
    <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: P.bg, border: P.border, transform: 'rotate(-0.4deg)' }} />
    <div style={{ position: 'absolute', inset: 3, borderRadius: r + 4, border: `2px solid ${T.ink}55`, transform: 'rotate(0.6deg)' }} />
    <div style={{ position: 'absolute', left: 18, top: -3, width: 60, height: 6, borderRadius: 3, background: c, opacity: .9 }} /></>;
  else if (P.kind === 'paper') face = <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: P.bg, border: P.border, boxShadow: P.shadow }} />;
  else if (P.kind === 'block') face = <><div style={{ position: 'absolute', inset: 0, background: P.bg }} /><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: c === '#111111' ? T.ink : c }} /></>;
  else face = <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: P.bg, border: P.border, boxShadow: P.shadow }} />;
  return (
    <div style={{ position: 'absolute', borderRadius: r, ...inner, ...style }}>
      {face}
      {beam && P.beam && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: r, padding: 2,
          background: `conic-gradient(from ${ang}deg, transparent 0deg, transparent 250deg, ${c} 320deg, #fff 350deg, transparent 360deg)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' as any,
        }} />
      )}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
    </div>
  );
};

/** Per-character kinetic text: rise + blur-in with stagger. */
export const Kinetic: React.FC<{ text: string; delay?: number; size?: number; weight?: number; color?: string; gradient?: string[]; stagger?: number; style?: React.CSSProperties; spacing?: number; mode?: 'rise' | 'pop' | 'blur' }> = ({
  text, delay = 0, size = 96, weight = 900, color = 'var(--ink)', gradient, stagger = 1.6, style, spacing = 0.02, mode = 'rise',
}) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const chars = Array.from(text);
  return (
    <div style={{ fontFamily: theme.display, fontSize: size, fontWeight: weight, textShadow: 'var(--title-shadow)', lineHeight: 1.1, letterSpacing: `${spacing}em`, whiteSpace: 'nowrap', ...style }}>
      {chars.map((ch, i) => {
        const k = mode === 'pop' ? pop(f, fps, delay + i * stagger) : prog(f, delay + i * stagger, delay + i * stagger + 14);
        const y = (1 - clamp(k, 0, 1.2)) * size * 0.55;
        const blur = mode === 'blur' || mode === 'rise' ? (1 - clamp(k)) * 14 : 0;
        const sc = mode === 'pop' ? 0.4 + 0.6 * k : 1;
        return (
          <span key={i} style={{
            display: 'inline-block', opacity: clamp(k * 1.4), transform: `translateY(${y}px) scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
            color: gradient ? 'transparent' : color,
            backgroundImage: gradient ? `linear-gradient(90deg, ${gradient.join(',')})` : undefined,
            backgroundSize: gradient ? `${chars.length * 100}% 100%` : undefined, backgroundPosition: gradient ? `${(i / Math.max(1, chars.length - 1)) * 100}% 0` : undefined,
            WebkitBackgroundClip: gradient ? 'text' : undefined, backgroundClip: gradient ? 'text' : undefined,
            whiteSpace: 'pre',
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

/** Light sweep across its children (shine) */
export const Shine: React.FC<{ at?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at = 12, dur = 24, children, style }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [at, at + dur], [-30, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'relative', ...style }}>
      {children}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay',
        background: `linear-gradient(105deg, transparent ${p - 12}%, rgba(255,255,255,.85) ${p}%, transparent ${p + 12}%)` }} />
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties; on?: string }> = ({ children, color = 'cyan', style, on }) => (
  <div style={{ fontFamily: theme.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.28em', color: accentText(color, on), textTransform: 'uppercase', ...style }}>{children}</div>
);

export const Pill: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = 'cyan', size = 26, style }) => {
  const c = accent(color);
  return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, background: c + '22', border: `1.5px solid ${c}aa`, color: accentText(color), fontFamily: theme.font, fontWeight: 700, fontSize: size, ...style }}>{children}</div>;
};

/** Rubber-stamp slam */
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rotate?: number; style?: React.CSSProperties }> = ({ text, at, color = 'red', size = 120, rotate = -8, style }) => {
  const f = useCurrentFrame(); const u = f - at; if (u < 0) return null;
  const s = u < 5 ? interpolate(u, [0, 5], [2.4, 0.92]) : u < 9 ? interpolate(u, [5, 9], [0.92, 1]) : 1;
  const c = accent(color);
  // 印章底色跟主题深浅走（以前固定半透明黑，浅色主题下变成中灰，上面的字看不清），字色按印章底色调
  const dark = currentTheme().dark; const sb = dark ? '#140C10' : '#FFFFFF';
  return (
    <div data-probe-decor style={{ position: 'absolute', transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${s})`, opacity: clamp(u / 3), ...style }}>
      <div style={{ border: `${size * 0.07}px solid ${c}`, borderRadius: size * 0.16, padding: `${size * 0.08}px ${size * 0.3}px`, color: accentText(color, sb), fontFamily: theme.font, fontWeight: 900, fontSize: size, whiteSpace: 'nowrap',
        boxShadow: `0 0 40px ${c}55`, background: dark ? 'rgba(20,12,16,.82)' : 'rgba(255,255,255,.92)' }}>{text}</div>
    </div>
  );
};

/** Number ticker */
export const CountUp: React.FC<{ from?: number; to: number; start: number; dur?: number; decimals?: number; style?: React.CSSProperties; suffix?: string; prefix?: string }> = ({ from = 0, to, start, dur = 24, decimals = 0, style, suffix = '', prefix = '' }) => {
  const f = useCurrentFrame(); const k = prog(f, start, start + dur);
  const v = from + (to - from) * k;
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
};

/** Page chrome for full-screen pages: chapter label + brand + progress */
export const Chrome: React.FC<{ chapter?: string; index?: number; total?: number; brand?: string; color?: string }> = ({ chapter, index = 1, total = 6, brand, color = 'cyan' }) => {
  // 右上角品牌字样：默认不显示（以前写死成原作者的 AI CREATION），要加自己的品牌在分镜顶层写 "brand"
  const c = accent(color);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 80, top: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 36, height: 5, background: c, borderRadius: 3 }} />
        <div style={{ fontFamily: theme.mono, fontSize: 18, color: 'var(--ink-dim)', letterSpacing: '0.18em' }}>{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}{chapter ? `   ${chapter}` : ''}</div>
      </div>
      {brand && <div style={{ position: 'absolute', right: 80, top: 56, fontFamily: theme.mono, fontSize: 18, color: 'var(--ink-dim)', letterSpacing: '0.25em' }}>{brand}</div>}
      <div style={{ position: 'absolute', left: '50%', top: 64, transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: 44, height: 3, borderRadius: 2, background: i < index ? c : 'var(--chip-border)' }} />)}
      </div>
    </AbsoluteFill>
  );
};

/** Subtle perspective grid floor */
export const GridFloor: React.FC<{ color?: string; opacity?: number }> = ({ color = 'violet', opacity = 0.35 }) => {
  const f = useCurrentFrame(); const c = accent(color);
  return (
    <AbsoluteFill style={{ perspective: 900, overflow: 'hidden', opacity }}>
      <div style={{ position: 'absolute', left: '-50%', width: '200%', height: '120%', top: '55%', transformOrigin: 'top', transform: 'rotateX(72deg)',
        backgroundImage: `linear-gradient(${c}55 1.5px, transparent 1.5px), linear-gradient(90deg, ${c}55 1.5px, transparent 1.5px)`, backgroundSize: '90px 90px',
        backgroundPosition: `0 ${(f * 1.4) % 90}px`, WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 60%, transparent)' }} />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => { const T = currentTheme(); const s = T.dark ? strength : strength * 0.18;
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${s}) 100%)`, pointerEvents: 'none' }} />; };
