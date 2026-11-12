// 动效词汇表（frame-driven）。效果灵感来自 React Bits 等开源库，代码为本项目从零实现：
// 视频按帧渲染，所以一切动画只依赖 useCurrentFrame()，不用 rAF / 鼠标 / 滚动。
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rnd } from '../lib/anim';

const SF = '"SF Pro Display","Inter","PingFang SC","Noto Sans SC","Noto Sans CJK SC",system-ui,sans-serif';
const EOUT = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const EIO = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const sp = (f: number, fps: number, d: number, cfg: any = { damping: 16, stiffness: 140, mass: 0.8 }) => spring({ frame: f - d, fps, config: cfg });

/** approximate text width (CJK = 1em) so we can lay out without DOM measurement */
export const textW = (s: string, size: number) => Array.from(s).reduce((w, c) => {
  const code = c.charCodeAt(0);
  if (code > 0x2e80) return w + 1; if (c === ' ') return w + 0.28; if (/[A-Z0-9%$]/.test(c)) return w + 0.64; if (/[a-z]/.test(c)) return w + 0.54; return w + 0.36;
}, 0) * size;

// ───────── TEXT ─────────

/** SplitText：逐字从下方翻起（带 3D 旋转和弹性） */
export const SplitText: React.FC<{ text: string; d?: number; size?: number; weight?: number; color?: string; stagger?: number; style?: React.CSSProperties; gradient?: [string, string] }> = ({ text, d = 0, size = 96, weight = 800, color = 'var(--r-ink)', stagger = 1.4, style, gradient }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const chars = Array.from(text);
  return <div style={{ fontFamily: SF, fontSize: size, fontWeight: weight, lineHeight: 1.18, whiteSpace: 'pre', perspective: 800, ...style }}>
    {chars.map((c, i) => { const k = sp(f, fps, d + i * stagger, { damping: 14, stiffness: 160, mass: 0.7 });
      return <span key={i} style={{ display: 'inline-block', opacity: clamp(k * 2), transform: `translateY(${(1 - k) * size * 0.7}px) rotateX(${(1 - k) * -80}deg)`, transformOrigin: '50% 100%', color: gradient ? 'transparent' : color,
        backgroundImage: gradient ? `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` : undefined, backgroundSize: gradient ? `${chars.length * 100}% 100%` : undefined, backgroundPosition: gradient ? `${(i / Math.max(1, chars.length - 1)) * 100}% 0` : undefined, WebkitBackgroundClip: gradient ? 'text' : undefined, backgroundClip: gradient ? 'text' : undefined }}>{c}</span>; })}
  </div>;
};

/** ShinyText：文字上扫过一道高光 */
export const ShinyText: React.FC<{ text: string; color?: string; shine?: string; size?: number; weight?: number; period?: number; style?: React.CSSProperties }> = ({ text, color = 'var(--r-ink)', shine = '#ffffff', size = 60, weight = 800, period = 70, style }) => {
  const f = useCurrentFrame(); const p = ((f % period) / period) * 260 - 80;
  return <span style={{ fontFamily: SF, fontSize: size, fontWeight: weight, backgroundImage: `linear-gradient(110deg, ${color} ${p - 18}%, ${shine} ${p}%, ${color} ${p + 18}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', whiteSpace: 'nowrap', ...style }}>{text}</span>;
};

/** Scramble：乱码解密，从左到右逐个定格 */
export const Scramble: React.FC<{ text: string; d?: number; dur?: number; style?: React.CSSProperties; charset?: string }> = ({ text, d = 0, dur = 24, style, charset = '0123456789' }) => {
  const f = useCurrentFrame(); const chars = Array.from(text); const k = clamp((f - d) / dur);
  const r = rnd(Math.floor(f / 2) + 7);
  return <span style={{ whiteSpace: 'pre', fontVariantNumeric: 'tabular-nums', ...style }}>{chars.map((c, i) => {
    const done = k * chars.length > i + 0.5 || c === ' ' || c === '.' || c === ',';
    return <span key={i} style={{ opacity: f < d ? 0 : done ? 1 : 0.7 }}>{done ? c : charset[Math.floor(r() * charset.length)]}</span>; })}</span>;
};

/** SplitFlap：机场翻页牌数字 */
export const SplitFlap: React.FC<{ text: string; d?: number; size?: number; color?: string; tile?: string; ink?: string; stagger?: number }> = ({ text, d = 0, size = 120, color, tile = 'var(--r-cardbg)', ink = 'var(--r-ink)', stagger = 5 }) => {
  const f = useCurrentFrame(); const chars = Array.from(text);
  return <div data-probe-decor style={{ display: 'flex', gap: size * 0.08 }}>{chars.map((c, i) => {
    const isD = /[0-9]/.test(c); const start = d + i * stagger; const flips = isD ? 6 + i * 2 : 0; const per = 2.2;
    const t = (f - start) / per; const n = Math.max(0, Math.min(flips, Math.floor(t))); const ph = t >= flips ? 1 : t - Math.floor(t);
    const target = isD ? +c : 0; const shown = isD ? (t >= flips ? target : (target + 10 - flips + n) % 10) : c;
    const next = isD ? (t >= flips ? target : (target + 10 - flips + n + 1) % 10) : c;
    const flipping = isD && t >= 0 && t < flips; const ang = flipping ? ph * 180 : 0;
    const W = size * (isD ? 0.72 : 0.5), H = size * 1.18;
    if (!isD) return <div key={i} style={{ width: W, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF, fontWeight: 800, fontSize: size * 0.8, color: color || ink, opacity: f >= start ? 1 : 0 }}>{c}</div>;
    const face = (v: any, half: 'top' | 'bot', st: React.CSSProperties = {}) => <div style={{ position: 'absolute', left: 0, right: 0, height: H / 2, top: half === 'top' ? 0 : H / 2, overflow: 'hidden', background: tile, borderRadius: half === 'top' ? `${size * 0.12}px ${size * 0.12}px 0 0` : `0 0 ${size * 0.12}px ${size * 0.12}px`, boxShadow: 'var(--r-shadow)', backfaceVisibility: 'hidden', ...st }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: half === 'top' ? 0 : -H / 2, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF, fontWeight: 800, fontSize: size, color: color || ink, fontVariantNumeric: 'tabular-nums' }}>{v}</div></div>;
    return <div key={i} style={{ position: 'relative', width: W, height: H, perspective: 600, opacity: f >= start - 2 ? 1 : 0 }}>
      {face(next, 'top')}{face(shown, 'bot')}
      {flipping && ang < 90 && face(shown, 'top', { transformOrigin: '50% 100%', transform: `rotateX(${-ang}deg)`, filter: `brightness(${1 - ang / 300})` })}
      {flipping && ang >= 90 && face(next, 'bot', { transformOrigin: '50% 0%', transform: `rotateX(${180 - ang}deg)` })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: H / 2 - 1, height: 2, background: 'rgba(0,0,0,.12)' }} />
    </div>; })}</div>;
};

/** RotatingWord：胶囊里的词按时间点向上轮换 */
export const RotatingWord: React.FC<{ words: string[]; times: number[]; size?: number; bg?: string; color?: string; pad?: number }> = ({ words, times, size = 80, bg = '#1D1D1F', color = '#fff', pad = 0.35 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  let idx = 0; times.forEach((t, i) => { if (f >= t) idx = i; });
  const k = sp(f, fps, times[idx], { damping: 18, stiffness: 170, mass: 0.7 });
  const w = textW(words[idx], size), wp = idx ? textW(words[idx - 1], size) : w; const W = wp + (w - wp) * clamp(k);
  return <span style={{ display: 'inline-flex', position: 'relative', verticalAlign: 'middle', height: size * 1.4, width: W + size * pad * 2, borderRadius: size * 0.32, background: bg, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,.18)' }}>
    {[idx - 1, idx].filter(i => i >= 0).map(i => { const cur = i === idx; const y = cur ? (1 - k) * size * 1.4 : -k * size * 1.4;
      return <span key={i} style={{ position: 'absolute', left: size * pad, top: 0, height: size * 1.4, display: 'flex', alignItems: 'center', fontFamily: SF, fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', transform: `translateY(${y}px)`, opacity: cur ? clamp(k * 2) : 1 - clamp(k) }}>{words[i]}</span>; })}
  </span>;
};

/** TrueFocus：角标焦点框在词之间移动，其余词虚化 */
export const TrueFocus: React.FC<{ words: string[]; times: number[]; size?: number; color?: string; blur?: number; gap?: number; ink?: string }> = ({ words, times, size = 110, color = 'blue', blur = 6, gap = 0.4, ink = 'var(--r-ink)' }) => {
  const f = useCurrentFrame();
  const ws = words.map(w => textW(w, size)); const G = size * gap; const total = ws.reduce((a, b) => a + b, 0) + G * (words.length - 1);
  const xs = ws.map((_, i) => ws.slice(0, i).reduce((a, b) => a + b, 0) + G * i);
  let idx = -1; times.forEach((t, i) => { if (f >= t) idx = i; });
  const k = idx < 0 ? 0 : EIO((f - times[idx]) / 10);
  const from = idx > 0 ? idx - 1 : idx; const x = idx < 0 ? 0 : xs[from] + (xs[idx] - xs[from]) * k; const w = idx < 0 ? 0 : ws[from] + (ws[idx] - ws[from]) * k;
  const c = accent(color); const P = size * 0.18, L = size * 0.26, T = 5;
  const corner = (s: React.CSSProperties) => <div style={{ position: 'absolute', width: L, height: L, borderColor: c, borderStyle: 'solid', borderWidth: 0, filter: `drop-shadow(0 0 8px ${c})`, ...s }} />;
  return <div style={{ position: 'relative', width: total, height: size * 1.3 }}>
    {words.map((wd, i) => { const act = i === idx; const bl = idx < 0 ? 0 : act ? blur * (1 - k) * (from !== idx ? 1 : 0) : blur;
      return <div key={i} style={{ position: 'absolute', left: xs[i], top: 0, fontFamily: SF, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: ink, whiteSpace: 'nowrap', filter: bl > 0.2 ? `blur(${bl}px)` : undefined, opacity: idx < 0 || act ? 1 : 0.55 }}>{wd}</div>; })}
    {idx >= 0 && <div style={{ position: 'absolute', left: x - P, top: -P * 0.4, width: w + P * 2, height: size * 1.3 + P * 0.8, opacity: clamp((f - times[0]) / 6) }}>
      {corner({ left: 0, top: 0, borderTopWidth: T, borderLeftWidth: T, borderTopLeftRadius: 6 })}{corner({ right: 0, top: 0, borderTopWidth: T, borderRightWidth: T, borderTopRightRadius: 6 })}
      {corner({ left: 0, bottom: 0, borderBottomWidth: T, borderLeftWidth: T, borderBottomLeftRadius: 6 })}{corner({ right: 0, bottom: 0, borderBottomWidth: T, borderRightWidth: T, borderBottomRightRadius: 6 })}
    </div>}
  </div>;
};

/** TypeText：打字机 + 光标 */
export const TypeText: React.FC<{ text: string; d?: number; cps?: number; cursor?: string; style?: React.CSSProperties }> = ({ text, d = 0, cps = 14, cursor = 'blue', style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const chars = Array.from(text);
  const n = Math.floor(clamp((f - d) * cps / fps / chars.length) * chars.length); const typing = n < chars.length;
  return <span style={{ whiteSpace: 'pre-wrap', ...style }}>{chars.slice(0, n).join('')}<span style={{ display: 'inline-block', width: '0.08em', height: '1em', marginLeft: '0.06em', verticalAlign: '-0.12em', background: accent(cursor), opacity: typing || Math.floor(f / 15) % 2 ? 1 : 0 }} /></span>;
};

// ───────── SURFACES ─────────

/** BeamBorder：卡片边框上环绕的一段光（StarBorder / BorderBeam 的做法） */
export const BeamBorder: React.FC<{ color?: string; r?: number; width?: number; speed?: number; opacity?: number }> = ({ color = 'blue', r = 28, width = 2.5, speed = 2.4, opacity = 1 }) => {
  const f = useCurrentFrame(); const c = accent(color);
  return <div style={{ position: 'absolute', inset: 0, borderRadius: r, padding: width, opacity, pointerEvents: 'none',
    background: `conic-gradient(from ${(f * speed) % 360}deg, transparent 0deg, transparent 240deg, ${c}00 250deg, ${c} 320deg, #ffffff 345deg, transparent 360deg)`,
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' as any }} />;
};

/** Glare：一道斜向高光扫过（GlareHover 的做法，按时间触发） */
export const Glare: React.FC<{ at: number; dur?: number; r?: number; strength?: number }> = ({ at, dur = 22, r = 28, strength = 0.55 }) => {
  const f = useCurrentFrame(); const k = (f - at) / dur; if (k < 0 || k > 1) return null; const p = -30 + EIO(k) * 160;
  return <div style={{ position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden', pointerEvents: 'none' }}><div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${p - 14}%, rgba(255,255,255,${strength}) ${p}%, transparent ${p + 14}%)`, mixBlendMode: 'screen' }} /></div>;
};

/** Spotlight：卡片内部一团缓慢移动的彩色光（SpotlightCard / MagicBento） */
export const Spotlight: React.FC<{ color?: string; r?: number; seed?: number; size?: number; opacity?: number }> = ({ color = 'blue', r = 28, seed = 0, size = 420, opacity = 0.22 }) => {
  const f = useCurrentFrame(); const x = 50 + 40 * Math.sin(f / 50 + seed * 1.7), y = 50 + 40 * Math.cos(f / 63 + seed);
  return <div style={{ position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden', pointerEvents: 'none' }}><div style={{ position: 'absolute', inset: 0, background: `radial-gradient(${size}px circle at ${x}% ${y}%, ${accent(color)}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)` }} /></div>;
};

/** Tilt：3D 倾斜漂浮包裹器（TiltedCard） */
export const Tilt: React.FC<{ seed?: number; amp?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ seed = 0, amp = 6, children, style }) => {
  const f = useCurrentFrame();
  return <div style={{ position: 'absolute', perspective: 1400, ...style }}><div style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateX(${Math.sin(f / 40 + seed) * amp}deg) rotateY(${Math.cos(f / 52 + seed * 2) * amp}deg)` }}>{children}</div></div>;
};

// ───────── BACKGROUNDS（浅色） ─────────

/** DotGrid：点阵 + 一圈圈扩散的波纹 */
export const DotGrid: React.FC<{ color?: string; gap?: number; ripple?: string; cx?: number; cy?: number; period?: number }> = ({ color = 'rgba(29,29,31,.16)', gap = 36, ripple = 'blue', cx = 0.5, cy = 0.55, period = 90 }) => {
  const f = useCurrentFrame(); const cols = Math.ceil(1920 / gap) + 1, rows = Math.ceil(1080 / gap) + 1; const R = ((f % period) / period) * 1500; const c = accent(ripple);
  const dots: React.ReactNode[] = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = i * gap + (gap / 2) * 0, y = j * gap; const dd = Math.hypot(x - cx * 1920, y - cy * 1080); const w = Math.exp(-Math.pow((dd - R) / 70, 2)) * (1 - R / 1500);
    dots.push(<circle key={j * cols + i} cx={x} cy={y} r={2 + 3.2 * w} fill={w > 0.15 ? c : color} fillOpacity={w > 0.15 ? 0.35 + 0.6 * w : 1} />);
  }
  return <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>{dots}</svg>;
};

/** Threads：几条缓慢流动的细线（Threads / FloatingLines 的气质） */
export const Threads: React.FC<{ colors?: string[]; n?: number; y?: number; amp?: number; opacity?: number }> = ({ colors = ['blue', 'violet', 'pink'], n = 14, y = 700, amp = 120, opacity = 0.5 }) => {
  const f = useCurrentFrame();
  return <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity }}>
    <defs>{colors.map((c, i) => <linearGradient key={i} id={`thr${i}`} x1="0" x2="1"><stop offset="0" stopColor={accent(c)} stopOpacity={0} /><stop offset=".5" stopColor={accent(c)} /><stop offset="1" stopColor={accent(c)} stopOpacity={0} /></linearGradient>)}</defs>
    {Array.from({ length: n }).map((_, i) => { const pts: string[] = []; const ph = f / 45 + i * 0.35; const a = amp * (0.4 + 0.6 * Math.sin(i * 0.7 + 1));
      for (let x = -20; x <= 1940; x += 40) pts.push(`${x},${y + i * 6 + Math.sin(x / 260 + ph) * a * Math.sin(x / 900 + i * 0.2 + f / 120)}`);
      return <polyline key={i} points={pts.join(' ')} fill="none" stroke={`url(#thr${i % colors.length})`} strokeWidth={1.6} strokeOpacity={0.35 + 0.5 * (i / n)} />; })}
  </svg>;
};

/** Grain：胶片颗粒，让渐变背景更有质感 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  return <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity, mixBlendMode: 'multiply', pointerEvents: 'none' }}>
    <filter id="grainf"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter="url(#grainf)" /></svg>;
};

export const easeOut = EOUT; export const easeIO = EIO;
