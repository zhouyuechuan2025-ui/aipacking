import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Glass, Kinetic, Tag, Stamp } from '../ui';
import { theme, accent, onColor } from '../lib/theme';
import { fitSize } from '../lib/fit';
import { pop, prog, glide, clamp, rel, exitK } from '../lib/anim';

export type OverlayProps = { p: any; start: number; dur: number; side?: 'left' | 'right'; safe?: any };
const F = theme.font, M = theme.mono;

// Side card next to the presenter: tag + title + timed lines
export const SideCard: React.FC<OverlayProps> = ({ p, start, dur, side = 'left' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = glide(f, fps, 0) * exitK(f, dur, 8); const col = p.color || 'cyan';
  const w = p.width || 560, x = side === 'left' ? 70 : 1920 - 70 - w, y = p.y ?? 240;
  const lines = p.lines || [];
  const h = p.height || 170 + lines.length * 78 + (p.title ? 70 : 0);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: side === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,.45), transparent 40%)' : 'linear-gradient(270deg, rgba(0,0,0,.45), transparent 40%)', opacity: k }} />
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: clamp(k), transform: `perspective(1200px) translateX(${(1 - k) * (side === 'left' ? -80 : 80)}px) rotateY(${(1 - k) * (side === 'left' ? 25 : -25)}deg)` }}>
        <Glass color={col} style={{ inset: 0 }}>
          <div style={{ padding: '38px 40px' }}>
            <div style={{ width: 48, height: 5, background: accent(col), borderRadius: 3, marginBottom: 18 }} />
            {p.tag && <Tag color={col} style={{ fontSize: 20 }}>{p.tag}</Tag>}
            {p.title && <Kinetic text={p.title} size={p.titleSize || 58} delay={4} style={{ marginTop: 14 }} />}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {lines.map((l: any, i: number) => { const t = rel(l.at, start, fps, 10 + i * 8); const kk = pop(f, fps, t);
                const c = l.color ? accent(l.color) : theme.ink;
                return <div key={i} style={{ opacity: clamp(kk), transform: `translateY(${(1 - kk) * 18}px)`, fontFamily: F, fontWeight: l.weight || 800, fontSize: l.size || 40, color: c, position: 'relative', whiteSpace: 'nowrap' }}>
                  {l.text}
                  {l.strike && <div style={{ position: 'absolute', left: -6, top: '52%', height: 6, background: accent('red'), width: `${prog(f, t + 10, t + 20) * 105}%` }} />}
                </div>; })}
            </div>
          </div>
        </Glass>
      </div>
      {p.stamp && <Stamp text={p.stamp.text} at={rel(p.stamp.at, start, fps, 30)} color={p.stamp.color || 'red'} size={p.stamp.size || 56} style={{ left: x + w / 2, top: y + h - 40 }} />}
    </AbsoluteFill>
  );
};

// Hazard banner across the top
export const Banner: React.FC<OverlayProps> = ({ p, dur }) => {
  const f = useCurrentFrame(); const k = prog(f, 0, 10) * exitK(f, dur, 8); const col = accent(p.color || 'gold');
  const stripes = `repeating-linear-gradient(-45deg, ${col} 0 22px, transparent 22px 44px)`;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: p.y ?? 120, height: 130, width: `${k * 100}%`, overflow: 'hidden', background: 'rgba(10,8,4,.8)', backdropFilter: 'blur(16px)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: stripes, backgroundPosition: `${f * 3}px 0` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: stripes, backgroundPosition: `${-f * 3}px 0` }} />
        <div style={{ position: 'absolute', left: 110, top: 30, display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 56, color: col }}>⚠</span>
          {/* 横幅底色固定是深色，字色按底色定 */}
          <span style={{ fontFamily: F, fontWeight: 900, fontSize: fitSize(p.text || '', 56, 1500, 32), color: onColor('#0A0804') }}>{p.text}</span>
        </div>
        {p.tag && <div style={{ position: 'absolute', right: 110, top: 52 }}><Tag color={p.color || 'gold'} on="#141008">{p.tag}</Tag></div>}
      </div>
    </AbsoluteFill>
  );
};

// Floating keyword chips near the presenter
export const KeywordPop: React.FC<OverlayProps> = ({ p, start, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const ex = exitK(f, dur, 8);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {(p.words || []).map((w: any, i: number) => { const k = pop(f, fps, rel(w.at, start, fps, i * 8)); const c = accent(w.color || ['cyan', 'pink', 'gold', 'violet'][i % 4]);
        const bob = Math.sin((f + i * 20) / 18) * 6;
        return <div key={i} style={{ position: 'absolute', left: w.x ?? (i % 2 ? 1450 : 150), top: (w.y ?? 260 + i * 110) + bob, transform: `scale(${k}) rotate(${w.rotate ?? (i % 2 ? 3 : -3)}deg)`, opacity: clamp(k) * ex,
          padding: '16px 34px', borderRadius: 999, background: 'rgba(12,14,26,.65)', backdropFilter: 'blur(18px)', border: `2px solid ${c}`, boxShadow: `0 0 30px ${c}66`,
          fontFamily: F, fontWeight: 900, fontSize: w.size || 48, color: onColor('#0C0C12'), whiteSpace: 'nowrap' }}>{w.text}</div>; })}
    </AbsoluteFill>
  );
};

// Follow / CTA card with a cursor click
export const FollowCTA: React.FC<OverlayProps> = ({ p, start, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = glide(f, fps, 0); const click = rel(p.clickAt, start, fps, Math.round(dur * 0.65));
  const clicked = f >= click; const bk = clicked ? pop(f, fps, click, { damping: 8, stiffness: 180 }) : 1;
  const cur = prog(f, click - 22, click - 2);
  const x = p.side === 'right' ? 1920 - 70 - 560 : 70, y = p.y ?? 700;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x, top: y + (1 - k) * 60, width: 560, height: 200, opacity: clamp(k) }}>
        <Glass color="pink" style={{ inset: 0 }}>
          <div style={{ position: 'absolute', left: 36, top: 40, width: 120, height: 120, borderRadius: 60, background: `linear-gradient(135deg, ${accent('pink')}, ${accent('violet')})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 30, color: onColor([accent('pink'), accent('violet')]) }}>{p.avatarText || p.name}</div>
          <div style={{ position: 'absolute', left: 184, top: 44, fontFamily: F, fontWeight: 900, fontSize: 40, color: 'var(--ink)' }}>{p.name}</div>
          <div style={{ position: 'absolute', left: 184, top: 100, fontFamily: F, fontSize: 22, color: 'var(--ink-dim)', whiteSpace: 'nowrap' }}>{p.desc}</div>
          <div style={{ position: 'absolute', left: 184, top: 138, transform: `scale(${bk})`, transformOrigin: 'left center', padding: '8px 28px', borderRadius: 999, fontFamily: F, fontWeight: 900, fontSize: 24, color: clicked ? onColor('#3a3f55') : onColor([accent('pink'), accent('violet')]),
            background: clicked ? '#3a3f55' : `linear-gradient(90deg, ${accent('pink')}, ${accent('violet')})` }}>{clicked ? `✓ ${p.doneText || '已关注'}` : `+ ${p.button || '关注'}`}</div>
        </Glass>
        {f > click - 26 && <svg width={40} height={40} style={{ position: 'absolute', left: 300 + (1 - cur) * 260, top: 170 + (1 - cur) * 120, transform: `scale(${f > click && f < click + 5 ? 1.2 : 1.5})` }} viewBox="0 0 20 28"><path d="M0 0 L0 22 L6 17 L10 26 L14 24 L10 15 L17 15 Z" fill="#fff" stroke="#000" strokeWidth="1.2" /></svg>}
        {clicked && Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2, u = (f - click) / fps; const d = 60 + u * 260;
          return <div key={i} style={{ position: 'absolute', left: 270 + Math.cos(a) * d, top: 160 + Math.sin(a) * d - u * 80, opacity: clamp(1 - u * 1.2), color: accent(['pink', 'gold', 'cyan'][i % 3]), fontSize: 26 + (i % 3) * 8 }}>♥</div>; })}
      </div>
    </AbsoluteFill>
  );
};

// Lower third — 人名/身份条
export const LowerThird: React.FC<OverlayProps> = ({ p, dur }) => {
  const f = useCurrentFrame(); const k = prog(f, 0, 12) * exitK(f, dur, 8); const col = accent(p.color || 'cyan');
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: p.x ?? 90, top: p.y ?? 760, display: 'flex', alignItems: 'stretch', clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
        <div style={{ width: 10, background: col, borderRadius: 4 }} />
        <div style={{ padding: '18px 34px', background: 'rgba(10,12,24,.78)', backdropFilter: 'blur(18px)' }}>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: onColor('#0C0C12') }}>{p.name}</div>
          {p.title && <div style={{ fontFamily: F, fontSize: 28, color: 'rgba(255,255,255,.78)', marginTop: 4 }}>{p.title}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Callout — 箭头标注（指向画面某处）
export const Callout: React.FC<OverlayProps> = ({ p, start, dur }) => {
  const f = useCurrentFrame(); const k = prog(f, 0, 12) * exitK(f, dur, 8); const col = accent(p.color || 'gold');
  const [tx, ty] = p.target || [960, 400]; const [lx, ly] = p.label || [1450, 250];
  const len = Math.hypot(lx - tx, ly - ty);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={tx} cy={ty} r={18 + 10 * Math.sin(f / 5)} fill="none" stroke={col} strokeWidth={4} opacity={k} />
        <line x1={lx} y1={ly} x2={tx} y2={ty} stroke={col} strokeWidth={4} strokeDasharray={`${len * k} ${len}`} />
      </svg>
      <div style={{ position: 'absolute', left: lx, top: ly, transform: `translate(-50%, -110%) scale(${k})`, padding: '14px 30px', borderRadius: 16, background: col, color: '#0b0b14', fontFamily: F, fontWeight: 900, fontSize: 40, whiteSpace: 'nowrap' }}>{p.text}</div>
    </AbsoluteFill>
  );
};

// ProgressNav — 顶部章节导航（整条视频常驻，被全屏页覆盖）
export const ProgressNav: React.FC<OverlayProps> = ({ p, start }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = start + f / fps;
  const ch: { start: number; title: string }[] = p._chapters || []; if (!ch.length) return null;
  const ci = ch.reduce((k, c, i) => (t >= c.start ? i : k), 0);
  const end = ch[ci + 1]?.start ?? p._duration ?? t + 1; const pr = clamp((t - ch[ci].start) / (end - ch[ci].start));
  if (p.compact) {
    const fill = p.color || '#B7A1FF';
    return <AbsoluteFill style={{ pointerEvents:'none' }}>
      <div style={{ position:'absolute', left:96, right:96, top:12, display:'flex', gap:4,
        background:'#10101BEF', padding:'5px 8px', borderRadius:6 }}>
        {ch.map((c, i) => <div key={c.start} style={{
          position:'relative', flex:(ch[i + 1]?.start ?? p._duration) - c.start, minWidth:94,
          padding:'3px 5px 8px', textAlign:'center', fontFamily:'"Inter Tight","Noto Sans SC",sans-serif',
          fontSize:21, lineHeight:'24px', fontWeight:i === ci ? 800 : 500, color:i === ci ? '#FFF' : '#D0CADA',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>
          {c.title}
          <div style={{position:'absolute',bottom:2,left:2,right:2,height:3,background:'#FFFFFF35'}}>
            <div style={{width:`${(i < ci ? 1 : i === ci ? pr : 0) * 100}%`,height:'100%',background:fill}} />
          </div>
        </div>)}
      </div>
    </AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, padding: 6, borderRadius: 999, background: 'rgba(10,12,24,.55)', backdropFilter: 'blur(18px)', border: '1px solid var(--chip-border)' }}>
        {ch.map((c, i) => <div key={i} style={{ position: 'relative', padding: '10px 26px', borderRadius: 999, fontFamily: F, fontSize: 22, fontWeight: i === ci ? 800 : 500, color: i === ci ? 'var(--ink)' : i < ci ? 'var(--ink-dim)' : 'var(--ink-faint)',
          background: i === ci ? 'linear-gradient(90deg, rgba(94,231,255,.28), rgba(139,123,255,.28))' : 'transparent', border: i === ci ? '1px solid rgba(160,220,255,.55)' : '1px solid transparent', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: M, fontSize: 16, marginRight: 10, opacity: .8 }}>{String(i + 1).padStart(2, '0')}</span>{c.title}
          {i === ci && <div style={{ position: 'absolute', left: 22, right: 22, bottom: 4, height: 2 }}><div style={{ width: `${pr * 100}%`, height: '100%', background: accent('cyan') }} /></div>}
        </div>)}
      </div>
    </AbsoluteFill>
  );
};

export const OVERLAYS: Record<string, React.FC<OverlayProps>> = { SideCard, Banner, KeywordPop, FollowCTA, LowerThird, Callout, ProgressNav };
