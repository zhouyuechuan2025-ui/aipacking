// 标准占位素材包（孵化轮 PLAYBOOK ③）——灰阶卡片组 + 假 dashboard 面板 +
// 标题字块。首轮孵化建一次，之后终身复用。demo 只求把运动演清楚，
// 不求页面质感，全部灰阶。
import React from 'react';

export const G = {
  bg: '#ececea',
  panel: '#f7f7f6',
  line: '#dcdcda',
  bar: '#c2c2c0',
  ink: '#2f2f2f',
  mid: '#8f8f8d',
  card: '#ffffff',
  border: '#d8d8d6',
  side: '#3a3a3a',
  sideBar: '#5a5a58',
};

export type FixturePalette = {
  canvas?: string;
  panel?: string;
  card?: string;
  accent?: string;
  line?: string;
};

export const MAX_PILL_LABEL_GRAPHEMES = 10;

export function fitPillLabel(value: string) {
  const graphemes = Array.from(value.trim());
  return graphemes.length <= MAX_PILL_LABEL_GRAPHEMES
    ? graphemes.join('')
    : `${graphemes.slice(0, MAX_PILL_LABEL_GRAPHEMES - 1).join('')}…`;
}

function rgbFromHex(background: string) {
  const match = background.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3
    ? match[1].split('').map((part) => `${part}${part}`).join('')
    : match[1];
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

export function relativeLuminance(color: string) {
  const rgb = rgbFromHex(color);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastTextFor(background: string) {
  if (!rgbFromHex(background)) return '#171717';
  const dark = '#171717';
  const light = '#ffffff';
  return contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light;
}

export const Card: React.FC<{
  w: number; h: number; seed?: number; style?: React.CSSProperties; palette?: FixturePalette;
}> = ({ w, h, seed = 0, style, palette = {} }) => {
  const titleW = 45 + ((seed * 37) % 40); // 45–85%
  const lines = 2 + (seed % 3);
  return (
    <div style={{
      width: w, height: h, background: palette.card || G.card, border: `2px solid ${palette.line || G.border}`,
      borderRadius: 14, padding: 18, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', ...style,
    }}>
      <div style={{ height: 16, width: `${titleW}%`, background: palette.accent || G.bar, borderRadius: 8 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 10, width: `${88 - i * 14 - (seed % 5) * 3}%`, background: palette.line || G.line, borderRadius: 5 }} />
      ))}
      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: palette.accent || G.mid }} />
        <div style={{ height: 10, width: 64, background: palette.line || G.line, borderRadius: 5 }} />
      </div>
    </div>
  );
};

// 假 dashboard 面板：A = 3×2 卡片网格，B = 列表行。1920×1080。
export const FakeDashboard: React.FC<{ variant?: 'A' | 'B'; palette?: FixturePalette }> = ({ variant = 'A', palette = {} }) => (
  <div style={{ width: 1920, height: 1080, background: palette.canvas || G.bg, display: 'flex' }}>
    <div style={{ width: 220, background: palette.panel || G.side, padding: '28px 22px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: palette.accent || '#777775' }} />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ height: 12, width: `${60 + ((i * 29) % 35)}%`, background: palette.line || G.sideBar, borderRadius: 6 }} />
      ))}
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 72, background: palette.card || G.panel, borderBottom: `2px solid ${palette.line || G.line}`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20, boxSizing: 'border-box' }}>
        <div style={{ height: 18, width: 180, background: palette.accent || G.bar, borderRadius: 9 }} />
        <div style={{ marginLeft: 'auto', height: 36, width: 320, background: palette.canvas || '#fff', border: `2px solid ${palette.line || G.line}`, borderRadius: 18, boxSizing: 'border-box' }} />
        <div style={{ width: 36, height: 36, borderRadius: 18, background: palette.accent || G.mid }} />
      </div>
      {variant === 'A' ? (
        <div style={{ flex: 1, padding: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: 28, boxSizing: 'border-box' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} w={0} h={0} seed={i + 1} palette={palette} style={{ width: '100%', height: '100%' }} />
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, padding: 36, display: 'flex', flexDirection: 'column', gap: 20, boxSizing: 'border-box' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: palette.card || G.card, border: `2px solid ${palette.line || G.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', boxSizing: 'border-box' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: palette.accent || G.mid }} />
              <div style={{ height: 14, width: `${30 + ((i * 23) % 25)}%`, background: palette.accent || G.bar, borderRadius: 7 }} />
              <div style={{ marginLeft: 'auto', height: 12, width: 120, background: palette.line || G.line, borderRadius: 6 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const TitleBlock: React.FC<{ text: string; size?: number; color?: string }> = ({ text, size = 88, color }) => (
  <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: size, color: color || G.ink, letterSpacing: -1 }}>
    {text}
  </div>
);
