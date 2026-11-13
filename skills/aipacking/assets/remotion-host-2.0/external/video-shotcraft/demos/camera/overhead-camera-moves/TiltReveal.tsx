// tilt-reveal｜俯仰揭示
// 开场俯视 dashboard 顶部（rotateX 平躺、只露顶栏），~43f 机位抬头回正，
// 内容一排排涌入视野。out-cubic + 末端轻微过冲回正，落定真静止 ≥35f。
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from 'remotion';
import { FakeDashboard, G, type FixturePalette } from '../../_fixtures/Fixtures';

const HOLD = 25; // 俯角定格
const MOVE = 43; // 主抬升
// 过冲：-55° → +2.6° → -0.9° → 0°，全部动画在 f=76 结束（145-76=69f 真静止）

export const TiltReveal: React.FC<{ title?: string; subtitle?: string; items?: string[]; imageUrl?: string; palette?: FixturePalette }> = ({ title = '', subtitle = '', items = [], imageUrl, palette = {} }) => {
  const f = useCurrentFrame();

  const rotX = interpolate(
    f,
    [HOLD, HOLD + MOVE, HOLD + MOVE + 4, HOLD + MOVE + 8],
    [-80, 2.6, -0.9, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const p = interpolate(f, [HOLD, HOLD + MOVE], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(p, [0, 1], [3.2, 1]);
  const ty = interpolate(p, [0, 1], [200, 0]);
  const persp = interpolate(p, [0, 1], [600, 1200]);
  const perspY = interpolate(p, [0, 1], [5, 40]);

  return (
    <AbsoluteFill style={{ background: palette.canvas || G.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: persp,
          perspectiveOrigin: `50% ${perspY}%`,
        }}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            transformOrigin: '50% 0%', // 画面上缘
            transform: `translateY(${ty}px) scale(${scale}) rotateX(${rotX}deg)`,
          }}
        >
          {imageUrl ? <Img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <FakeDashboard variant="A" palette={palette} />}
          {(title || subtitle || items[0]) && <div style={{ position: 'absolute', left: 120, right: 120, bottom: 100, padding: '34px 42px', color: '#fff', background: palette.panel || 'rgba(10,15,25,.84)', borderLeft: `8px solid ${palette.accent || '#53e0ff'}` }}>
            <div style={{ fontSize: 54, fontWeight: 850 }}>{title}</div>
            <div style={{ marginTop: 14, fontSize: 30 }}>{subtitle || items[0]}</div>
          </div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
