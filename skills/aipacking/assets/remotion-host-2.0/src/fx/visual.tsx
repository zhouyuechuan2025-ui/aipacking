// 主视觉元件：3D 表情 / 立体图标 / 漂浮玻璃球 / 光点 / 设备外壳 / 视频画面
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, OffthreadVideo, Freeze, staticFile } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rnd } from '../lib/anim';
import { sp } from './index';

const SF = '"SF Pro Display","Inter","PingFang SC","Noto Sans SC","Noto Sans CJK SC",system-ui,sans-serif';
export const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

/** 口播视频画面：live=跟随当前时间播放；at=定格在某一秒（做缩略图） */
export const VideoAt: React.FC<{ video?: string; start?: number; at?: number; style?: React.CSSProperties }> = ({ video, start = 0, at, style }) => {
  const { fps } = useVideoConfig(); if (!video) return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#c9b8ff,#ffc9b5)', ...style }} />;
  const v = <OffthreadVideo src={staticFile(video)} muted startFrom={Math.round((at ?? start) * fps)} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
  return at != null ? <Freeze frame={0}>{v}</Freeze> : v;
};

/** 3D 彩色表情：弹出 + 漂浮 + 投影 */
export const Emoji: React.FC<{ ch: string; size?: number; d?: number; seed?: number; x?: number; y?: number; rot?: number; style?: React.CSSProperties }> = ({ ch, size = 160, d = 0, seed = 0, x, y, rot = 0, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const k = sp(f, fps, d, { damping: 11, stiffness: 150, mass: 0.8 });
  const bob = Math.sin(f / 26 + seed * 2) * size * 0.06, r = rot + Math.sin(f / 40 + seed) * 6;
  return <div style={{ position: x != null ? 'absolute' : 'relative', left: x, top: y, width: size, height: size, fontFamily: EMOJI_FONT, fontSize: size * 0.86, lineHeight: `${size}px`, textAlign: 'center',
    transform: `translate(${x != null ? '-50%,-50%' : '0,0'}) translateY(${bob + (1 - k) * 80}px) rotate(${r}deg) scale(${clamp(k, 0, 1.2)})`, opacity: clamp(k * 2),
    filter: `drop-shadow(0 ${size * 0.12}px ${size * 0.14}px rgba(40,30,80,.22))`, ...style }}>{ch}</div>;
};

/** macOS 风立体 App 图标（渐变底 + 高光 + 投影），里面放表情或字 */
export const AppTile: React.FC<{ ch?: string; label?: string; color?: string; size?: number; d?: number; seed?: number; x?: number; y?: number; tilt?: number; style?: React.CSSProperties }> = ({ ch = '✨', label, color = 'blue', size = 150, d = 0, seed = 0, x, y, tilt = 0, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const k = sp(f, fps, d, { damping: 12, stiffness: 140, mass: 0.8 }); const c = accent(color);
  const bob = Math.sin(f / 30 + seed * 1.9) * 10, rx = Math.sin(f / 45 + seed) * 8, ry = Math.cos(f / 50 + seed) * 10;
  return <div style={{ position: x != null ? 'absolute' : 'relative', left: x, top: y, width: size, perspective: 800, transform: `translate(${x != null ? '-50%,-50%' : '0,0'}) translateY(${bob + (1 - k) * 90}px) scale(${clamp(k, 0, 1.15)})`, opacity: clamp(k * 2), ...style }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.24, transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${tilt}deg)`, background: `linear-gradient(145deg, ${c}ee 0%, ${c} 45%, ${c}cc 100%)`, position: 'relative',
      boxShadow: `0 ${size * 0.16}px ${size * 0.3}px ${c}55, 0 ${size * 0.04}px ${size * 0.06}px rgba(0,0,0,.12), inset 0 ${size * 0.02}px 0 rgba(255,255,255,.55), inset 0 -${size * 0.04}px ${size * 0.08}px rgba(0,0,0,.12)` }}>
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '4%', height: '46%', borderRadius: `${size * 0.2}px ${size * 0.2}px ${size * 0.5}px ${size * 0.5}px`, background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI_FONT, fontSize: size * 0.52, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.18))' }}>{ch}</div>
    </div>
    {label && <div style={{ marginTop: size * 0.12, textAlign: 'center', fontFamily: SF, fontWeight: 700, fontSize: Math.max(22, size * 0.17), color: 'var(--r-ink)', whiteSpace: 'nowrap' }}>{label}</div>}
  </div>;
};

/** 漂浮的玻璃球（背景景深层） */
export const Orbs: React.FC<{ colors?: string[]; n?: number; seed?: number; opacity?: number }> = ({ colors = ['blue', 'violet', 'pink', 'orange'], n = 7, seed = 3, opacity = 1 }) => {
  const f = useCurrentFrame(); const r = rnd(seed);
  const orbs = Array.from({ length: n }).map((_, i) => ({ x: r() * 1920, y: r() * 1080, s: 40 + r() * 130, c: accent(colors[i % colors.length]), ph: r() * 6, depth: 0.3 + r() * 0.7 }));
  return <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>{orbs.map((o, i) => {
    const x = o.x + Math.sin(f / 90 + o.ph) * 40 * o.depth, y = o.y + Math.cos(f / 110 + o.ph) * 30 * o.depth;
    return <div key={i} style={{ position: 'absolute', left: x - o.s / 2, top: y - o.s / 2, width: o.s, height: o.s, borderRadius: '50%',
      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.95) 0%, ${o.c}66 32%, ${o.c}aa 70%, ${o.c}44 100%)`,
      boxShadow: `inset -${o.s * 0.08}px -${o.s * 0.1}px ${o.s * 0.2}px ${o.c}88, 0 ${o.s * 0.2}px ${o.s * 0.4}px ${o.c}33`, filter: `blur(${(1 - o.depth) * 10}px)`, opacity: 0.35 + 0.5 * o.depth }} />; })}</AbsoluteFill>;
};

/** 闪烁的四角星光点 */
export const Sparkles: React.FC<{ n?: number; seed?: number; color?: string; area?: [number, number, number, number] }> = ({ n = 14, seed = 9, color = '#ffffff', area = [0, 0, 1920, 1080] }) => {
  const f = useCurrentFrame(); const r = rnd(seed);
  return <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>{Array.from({ length: n }).map((_, i) => {
    const x = area[0] + r() * (area[2] - area[0]), y = area[1] + r() * (area[3] - area[1]), s = 8 + r() * 18, ph = r() * 100, per = 50 + r() * 40;
    const t = ((f + ph) % per) / per; const a = Math.sin(t * Math.PI); const S = s * (0.3 + 0.7 * a);
    return <path key={i} d={`M${x} ${y - S} Q${x} ${y} ${x + S} ${y} Q${x} ${y} ${x} ${y + S} Q${x} ${y} ${x - S} ${y} Q${x} ${y} ${x} ${y - S}Z`} fill={color} opacity={a * 0.9} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />; })}</svg>;
};

/** iPhone 外壳 */
export const Phone: React.FC<{ w?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w = 380, children, style }) => {
  const h = w * 2.05;
  return <div style={{ position: 'absolute', width: w, height: h, borderRadius: w * 0.16, background: '#1c1c1e', padding: w * 0.035, boxShadow: '0 50px 100px rgba(30,20,60,.3), inset 0 0 0 2px #3a3a3c, 0 0 0 1px rgba(0,0,0,.2)', ...style }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.13, overflow: 'hidden', background: '#000' }}>{children}
      <div style={{ position: 'absolute', left: '50%', top: w * 0.03, width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: 99, background: '#000' }} /></div>
  </div>;
};

/** MacBook 外壳 */
export const Laptop: React.FC<{ w?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w = 1000, children, style }) => {
  const h = w * 0.625;
  return <div style={{ position: 'absolute', width: w * 1.16, ...style }}>
    <div style={{ marginLeft: w * 0.08, width: w, height: h, borderRadius: w * 0.03, background: '#1c1c1e', padding: w * 0.018, boxShadow: '0 40px 90px rgba(30,20,60,.25), inset 0 0 0 2px #3a3a3c' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.012, overflow: 'hidden', background: '#fff' }}>{children}</div></div>
    <div style={{ width: w * 1.16, height: w * 0.035, borderRadius: `0 0 ${w * 0.03}px ${w * 0.03}px`, background: 'linear-gradient(180deg,#e3e3e8,#b9b9c0)', boxShadow: '0 20px 40px rgba(30,20,60,.2)' }}>
      <div style={{ width: w * 0.16, height: w * 0.012, margin: '0 auto', borderRadius: `0 0 ${w * 0.01}px ${w * 0.01}px`, background: '#a9a9b0' }} /></div>
  </div>;
};

/** 窗口外壳（macOS 红黄绿） */
export const Window: React.FC<{ title?: string; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties; r?: number }> = ({ title, dark, children, style, r = 22 }) => (
  <div style={{ position: 'absolute', borderRadius: r, overflow: 'hidden', background: dark ? '#1e1e20' : 'rgba(255,255,255,.92)', boxShadow: '0 40px 100px rgba(30,20,60,.22), 0 0 0 1px rgba(0,0,0,.06)', backdropFilter: 'blur(30px)', ...style }}>
    <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px', background: dark ? '#2a2a2d' : 'rgba(246,246,248,.9)', borderBottom: `1px solid ${dark ? '#000' : 'rgba(0,0,0,.06)'}` }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
      {title && <div style={{ flex: 1, textAlign: 'center', marginRight: 60, fontFamily: SF, fontWeight: 600, fontSize: 18, color: dark ? '#aaa' : '#6e6e73' }}>{title}</div>}
    </div>
    <div style={{ position: 'relative', height: 'calc(100% - 46px)' }}>{children}</div>
  </div>
);
