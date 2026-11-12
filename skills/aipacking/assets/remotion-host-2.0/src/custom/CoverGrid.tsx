// CoverGrid — 「覆盖 A、B、C……」一口气报很多领域：3×3 网格，说到哪格哪格砸下并高亮，之前的变回黑字
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { PageProps } from '../pages/full';
import { EStage, Reveal, Meta, DISP, MONO } from '../pages/editorial';
import { accent } from '../lib/theme';
import { clamp, rel } from '../lib/anim';
import { fitSize } from '../lib/fit';

const INK = '#0A0A0B', PAPER = '#F2F1ED', GRAY = '#5A5A5F';

export const CoverGrid: React.FC<PageProps> = ({ p, start, dur, chapter }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const col = accent(p.color || 'blue');
  const items: any[] = (p.items || []).slice(0, 9);
  const ts = items.map((it, i) => rel(it.at, start, fps, 10 + i * 12));
  const cols = 3, X0 = 120, Y0 = 330, W = 540, H = 170, GX = 30, GY = 26;
  const cur = ts.reduce((c, t, i) => (f >= t ? i : c), -1);
  const size = Math.min(...items.map(it => fitSize(it.t, 84, W - 120, 48)));
  return <EStage chapter={chapter} dur={dur}>
    <div style={{ position: 'absolute', left: 120, top: 150 }}>
      <Meta d={2} color={col}>{p.meta || 'COVERAGE'}</Meta>
      <Reveal d={4}><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 80, color: INK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{p.title}</div></Reveal>
    </div>
    <div data-probe-decor style={{ position: 'absolute', right: 120, top: 176, fontFamily: MONO, fontSize: 26, color: GRAY, letterSpacing: '.1em' }}>
      {String(Math.max(0, cur + 1)).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
    {items.map((it, i) => {
      const s = spring({ frame: f - ts[i], fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
      const x = X0 + (i % cols) * (W + GX), y = Y0 + Math.floor(i / cols) * (H + GY); const on = i === cur;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, width: W, height: H, borderTop: `3px solid ${INK}`, background: on ? col : 'transparent',
        opacity: f >= ts[i] ? clamp(s * 3) : 0.12, transform: `translateY(${(1 - clamp(s)) * -40}px)` }}>
        <div style={{ position: 'absolute', left: 20, top: 16, fontFamily: MONO, fontSize: 18, letterSpacing: '.12em', color: on ? 'rgba(255,255,255,.75)' : GRAY }}>{String(i + 1).padStart(2, '0')}</div>
        <div style={{ position: 'absolute', left: 20, bottom: 18, fontFamily: DISP, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: '-0.02em', color: on ? '#fff' : f >= ts[i] ? INK : PAPER, whiteSpace: 'nowrap' }}>{it.t}</div>
      </div>;
    })}
  </EStage>;
};
