import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, exitK, prog, rel } from '../lib/anim';
import { fitSize } from '../lib/fit';
import { accent, onColor } from '../lib/theme';
import { NanaSideDetail } from './NanaSideDetail';
import type { OverlayProps } from './overlay';

const FONT = '"Inter Tight","Noto Sans SC",sans-serif';
const PANEL = '#171524';
const LIGHT = '#F9F6FF';

const BasicSideBeats: React.FC<OverlayProps> = ({ p, start, dur, side = 'right' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = p.width ?? 400;
  const reverse = side === 'right';
  const color = accent(p.color || 'cyan');
  const tag = p.variant === 'tags';
  const steps = p.variant === 'steps';
  const signal = p.variant === 'signal';
  const out = exitK(frame, dur, Math.round(fps * 0.2));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: out }}>
      <div style={{
        position: 'absolute', top: p.y ?? 224, left: reverse ? undefined : 90,
        right: reverse ? 90 : undefined, width, display: 'flex',
        flexDirection: tag ? 'row' : 'column', flexWrap: tag ? 'wrap' : 'nowrap',
        justifyContent: tag && reverse ? 'flex-end' : undefined,
        alignItems: tag ? 'center' : 'stretch', gap: tag ? 10 : 9, fontFamily: FONT,
      }}>
        {p.items.map((item: {text: string; at: number; label?: string; highlight?: boolean}, i: number) => {
          const d = rel(item.at, start, fps);
          const k = prog(frame, d, d + Math.max(3, Math.round(fps * (tag ? 0.23 : 0.33))));
          const line = prog(frame, d + 2, d + Math.max(4, Math.round(fps * 0.42)));
          const bg = item.highlight ? color : PANEL;
          const ink = item.highlight ? onColor(bg) : LIGHT;
          const shade = item.highlight ? ink : '#D8CDEF';
          const available = width - (steps ? 90 : 40);
          return (
            <div key={i} style={{
              position: 'relative', boxSizing: 'border-box', opacity: clamp(k * 1.3),
              transform: tag ? `scale(${0.9 + 0.1 * k}) translateY(${(1 - k) * 14}px)`
                : `translateX(${(reverse ? 1 : -1) * (1 - k) * 44}px)`,
              clipPath: tag ? undefined : `inset(0 ${reverse ? 0 : (1 - k) * 100}% 0 ${reverse ? (1 - k) * 100 : 0}%)`,
              borderRadius: tag ? 999 : 12, background: bg, color: ink,
              border: '1px solid #DCCAFF45', padding: tag ? '10px 17px' : '11px 18px 12px',
              minHeight: tag ? 48 : 60, display: 'flex', alignItems: 'center', gap: 13, overflow: 'hidden',
            }}>
              {steps && <span style={{ display: 'grid', placeItems: 'center', flex: '0 0 38px', height: 38,
                borderRadius: '50%', background: '#FFFFFF26', fontSize: 19, fontWeight: 800 }}>{i + 1}</span>}
              <div>
                {item.label && <div style={{fontSize: 19, color: shade, marginBottom: 2}}>{item.label}</div>}
                <div style={{fontSize: fitSize(item.text, signal && i === 0 ? 52 : tag ? 36 : 39, available, 24),
                  fontWeight: 800, whiteSpace: 'nowrap'}}>{item.text}</div>
              </div>
              {(signal || steps) && <div style={{position:'absolute', bottom:0, left:0, height:3,
                width:`${line * 100}%`, background: item.highlight ? ink : '#C5B4FF'}} />}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const minItems: Record<string, number> = {headline:1,source:2,sources:1,checkin:3,summary:3};

export const SideBeats: React.FC<OverlayProps> = (props) => {
  const min = minItems[props.p._motionDetail];
  return min && props.p.items.length >= min
    ? <NanaSideDetail {...props} /> : <BasicSideBeats {...props} />;
};
