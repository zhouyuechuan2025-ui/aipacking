// 编辑设计 · 人物两侧包装（真人保持全屏，元素贴在人物左右两侧）
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rel } from '../lib/anim';
import type { OverlayProps } from './overlay';
import { DISP, MONO } from './editorial';

const INK = '#0A0A0B', PAPER = '#F2F1ED';
const E = (t: number) => 1 - Math.pow(1 - clamp(t), 4);

/** SideBlocks — 纸白文字块像胶带一样从侧边拉出；可带大数字、划线、打勾标记；结束时反向收回 */
export const SideBlocks: React.FC<OverlayProps> = ({ p, start, dur, side = 'left' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const col = accent(p.color || 'blue'); const red = accent('red');
  const at = (s: any, fb: number) => rel(s, start, fps, fb); const L = side !== 'right';
  const out = E((f - (dur - 10)) / 10); const X = L ? 90 : undefined, R = L ? undefined : 90;
  const lines: any[] = p.lines || []; const num = p.number;
  const clip = (k: number) => L ? `inset(0 ${(1 - k) * 100}% 0 0)` : `inset(0 0 0 ${(1 - k) * 100}%)`;
  const nk = num ? E((f - at(num.at, 6)) / (num.frames || 30)) : 0;
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: X, right: R, top: p.y ?? 250, display: 'flex', flexDirection: 'column', alignItems: L ? 'flex-start' : 'flex-end', gap: 10 }}>
      {p.meta && <div style={{ clipPath: clip(E((f - 2) / 10) * (1 - out)), background: INK, color: '#fff', fontFamily: MONO, fontSize: 20, letterSpacing: '.14em', padding: '8px 14px', marginBottom: 6 }}>{p.meta}</div>}
      {num && <div style={{ clipPath: clip(E((f - at(num.at, 6)) / 10) * (1 - out)), background: PAPER, padding: '6px 26px 0', fontFamily: DISP, fontWeight: 900, fontSize: num.size || 170, lineHeight: 1.05, letterSpacing: '-0.04em', color: INK, fontVariantNumeric: 'tabular-nums' }}>
        {Math.round((num.from ?? 0) + (num.to - (num.from ?? 0)) * nk)}<span style={{ fontSize: (num.size || 170) * 0.42, color: col }}>{num.unit}</span></div>}
      {lines.map((l, i) => { const d = at(l.at, 6 + i * 8); const k = E((f - d) / 10) * (1 - out); const hi = !!l.hi; const s = l.slam ? spring({ frame: f - d, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } }) : 1;
        return <div key={i} style={{ position: 'relative', clipPath: clip(k), background: hi ? col : PAPER, padding: '4px 22px 8px', display: 'flex', alignItems: 'center', gap: 22, transform: l.slam ? `scale(${1.4 - 0.4 * clamp(s)})` : undefined, transformOrigin: L ? '0 50%' : '100% 50%' }}>
          {l.idx && <span style={{ fontFamily: MONO, fontSize: 18, color: hi ? 'rgba(255,255,255,.7)' : '#5A5A5F' }}>{l.idx}</span>}
          <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: l.size || p.size || 84, lineHeight: 1.15, letterSpacing: '-0.02em', color: hi ? '#fff' : l.no ? red : INK, whiteSpace: 'nowrap', position: 'relative' }}>{l.text}
            {l.strike && <span style={{ position: 'absolute', left: -6, right: -6, top: '55%', height: 8, background: red, transformOrigin: 'left', transform: `scaleX(${E((f - at(l.strikeAt, d + 20)) / 10)})` }} />}</span>
          {l.mark && (() => { const md = at(l.markAt, d + 12); const ms = spring({ frame: f - md, fps, config: { damping: 12, stiffness: 240, mass: 0.6 } });
            return <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: (l.size || p.size || 84) * 0.8, color: l.no ? red : col, opacity: clamp(ms * 3), transform: `scale(${1.8 - 0.8 * clamp(ms)}) rotate(${l.no ? -6 : 0}deg)`, display: 'inline-block' }}>{l.mark}</span>; })()}
        </div>; })}
      {p.note && <div style={{ clipPath: clip(E((f - at(p.noteAt, 30)) / 10) * (1 - out)), fontFamily: MONO, fontSize: 20, letterSpacing: '.1em', color: '#fff', background: 'rgba(10,10,11,.75)', padding: '8px 14px', marginTop: 6 }}>{p.note}</div>}
    </div>
  </AbsoluteFill>;
};

export const EDITORIAL4_OVERLAYS = { SideBlocks };
