// 「专业报告」风格模板（style: report）
// 设计语言：深灰平底 + iOS 式圆角卡片 + 章节胶囊 + 大号数字 + 来源脚注；元素跟着口播逐个长出来；克制、留白、弹簧动画。
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, OffthreadVideo, staticFile } from 'remotion';
import { accent, currentTheme, onColor, accentText } from '../lib/theme';
import { fitSize, textEm } from '../lib/fit';
import { clamp, rel, exitK } from '../lib/anim';
import type { PageProps } from './full';
import type { OverlayProps } from './overlay';
import { DotGrid, Grain } from '../fx';
import { MergeTokens, MergeReceipt } from './MotionFlowDetails';
import { VideoAt } from '../fx/visual';

export const SF = '"SF Pro Display","SF Pro Text","Inter","PingFang SC","Noto Sans SC","Noto Sans CJK SC",system-ui,sans-serif';
export const NUM = '"SF Pro Display","Inter","DIN Alternate","Helvetica Neue","Noto Sans CJK SC",sans-serif';
export const RC = { bg: '#151517', card: '#252528', card2: '#2E2E32', line: 'rgba(255,255,255,.08)', ink: '#F5F5F7', dim: '#A1A1A6', faint: '#6E6E73' };

// --r-dim / --r-faint 按「对浅色卡片和背景至少 4.6:1」取值，别再调淡
const MODES: Record<string, Record<string, string>> = {
  dark: { '--r-ink': '#F5F5F7', '--r-dim': '#A1A1A6', '--r-faint': '#8A8A8F', '--r-line': 'rgba(255,255,255,.08)', '--r-card': '#252528', '--r-card2': 'rgba(255,255,255,.05)', '--r-cardbg': 'linear-gradient(180deg,#2B2B2F,#232326)', '--r-cardborder': '1px solid rgba(255,255,255,.08)', '--r-shadow': '0 40px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07)', '--r-track': 'rgba(255,255,255,.1)', '--r-capsule': 'rgba(30,30,33,.78)', '--r-blur': 'none' },
  light: { '--r-ink': '#1D1D1F', '--r-dim': '#5E5E63', '--r-faint': '#6F6F73', '--r-line': 'rgba(0,0,0,.06)', '--r-card': '#FFFFFF', '--r-card2': '#F5F5F7', '--r-cardbg': '#FFFFFF', '--r-cardborder': '1px solid rgba(0,0,0,.04)', '--r-shadow': '0 24px 60px rgba(30,30,60,.10), 0 2px 8px rgba(30,30,60,.05)', '--r-track': 'rgba(0,0,0,.07)', '--r-capsule': 'rgba(255,255,255,.85)', '--r-blur': 'none' },
  glass: { '--r-ink': '#1D1D1F', '--r-dim': '#4A4A50', '--r-faint': '#626267', '--r-line': 'rgba(0,0,0,.06)', '--r-card': 'rgba(255,255,255,.6)', '--r-card2': 'rgba(255,255,255,.55)', '--r-cardbg': 'rgba(255,255,255,.86)', '--r-cardborder': '1.5px solid rgba(255,255,255,.85)', '--r-shadow': '0 30px 70px rgba(60,40,90,.14), inset 0 1px 0 rgba(255,255,255,.9)', '--r-track': 'rgba(0,0,0,.08)', '--r-capsule': 'rgba(255,255,255,.7)', '--r-blur': 'blur(30px) saturate(160%)' },
};
export const modeOf = (id: string) => id === 'report' ? 'dark' : id === 'report-light' ? 'light' : 'glass';
export const MODE_VARS = MODES;

// ───────── motion primitives ─────────
const sp = (f: number, fps: number, d: number, stiff = 110) => spring({ frame: f - d, fps, config: { damping: 24, stiffness: stiff, mass: 0.8 } });
/** Apple-style entrance: rise + blur-in */
export const rise = (f: number, fps: number, d: number, dist = 26): React.CSSProperties => {
  const k = sp(f, fps, d); const b = (1 - clamp(k * 1.15)) * 10;
  return { opacity: clamp(k * 1.5), transform: `translateY(${(1 - k) * dist}px)`, filter: b > 0.2 ? `blur(${b}px)` : undefined };
};
export const scaleIn = (f: number, fps: number, d: number): React.CSSProperties => {
  const k = spring({ frame: f - d, fps, config: { damping: 18, stiffness: 150, mass: 0.8 } });
  return { opacity: clamp(k * 1.6), transform: `scale(${0.86 + 0.14 * k})` };
};
const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };
const fmt = (v: number, dec: number) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ───────── building blocks ─────────
/** chapter capsule: tracked English caps + Chinese subtitle */
export const Capsule: React.FC<{ en?: string; cn?: string; color?: string; f: number; fps: number; d?: number; style?: React.CSSProperties }> = ({ en, cn, color = 'gold', f, fps, d = 0, style }) => {
  const k = sp(f, fps, d, 140); const c = accent(color);
  return (
    <div style={{ position: 'absolute', left: 56, top: 44, display: 'inline-flex', flexDirection: 'column', padding: '11px 26px 12px 34px', borderRadius: 20, background: 'var(--r-capsule)', border: 'var(--r-cardborder)', backdropFilter: 'blur(24px)', boxShadow: '0 10px 30px rgba(0,0,0,.18)', opacity: clamp(k * 1.5), transform: `translateX(${(1 - k) * -24}px)`, clipPath: `inset(0 ${(1 - clamp(k * 1.2)) * 100}% 0 0 round 20px)`, ...style }}>
      <div style={{ position: 'absolute', left: 15, top: 20, width: 8, height: 8, borderRadius: 4, background: c, boxShadow: `0 0 12px ${c}` }} />
      {en && <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 19, letterSpacing: '.3em', color: accentText(color), whiteSpace: 'nowrap' }}>{en}</div>}
      {cn && <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 22, color: 'var(--r-ink)', marginTop: 3, whiteSpace: 'nowrap' }}>{cn}</div>}
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; outline?: string; r?: number }> = ({ style, children, outline, r = 28 }) => (
  <div style={{ position: 'absolute', borderRadius: r, background: 'var(--r-cardbg)', backdropFilter: 'var(--r-blur)', WebkitBackdropFilter: 'var(--r-blur)', border: outline ? `3px solid ${outline}` : 'var(--r-cardborder)', boxShadow: `var(--r-shadow)${outline ? `, 0 0 40px ${outline}33` : ''}`, ...style }}>{children}</div>
);

const ICONS: Record<string, string> = {
  spark: 'M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z',
  user: 'M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm-8 9c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z',
  image: 'M4 5h16v14H4zM7 15l3.5-4 3 3 2-2L19 16M8.5 9a1.5 1.5 0 100-.01',
  doc: 'M6 3h9l4 4v14H6zM9 11h7M9 15h7M9 7h4',
  text: 'M5 6h14M5 11h14M5 16h9',
  code: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  eye: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  flow: 'M3 12h5l3-6 3 12 3-6h4',
  money: 'M3 7h18v10H3zM12 15a3 3 0 100-6 3 3 0 000 6z',
  brain: 'M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V4zm6 0a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 0',
  play: 'M8 5v14l11-7z',
  palette: 'M12 3a9 9 0 100 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 004-4c0-4.4-4-8-9-8zM7.5 12a1 1 0 100-.01M9.5 8a1 1 0 100-.01M14.5 8a1 1 0 100-.01',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10zm0-4a1 1 0 100-2 1 1 0 000 2z',
  tool: 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  check: 'M5 12.5l4.5 4.5L19 7',
  x: 'M6 6l12 12M18 6L6 18',
};
export const Icon: React.FC<{ name?: string; color?: string; size?: number; box?: boolean }> = ({ name = 'spark', color = 'cyan', size = 30, box = true }) => {
  const c = accent(color);
  const svg = <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={box ? '#fff' : c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[name] || ICONS.spark} /></svg>;
  if (!box) return svg;
  return <div style={{ width: size * 1.75, height: size * 1.75, borderRadius: size * 0.5, background: `linear-gradient(160deg, ${c}, ${c}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 18px ${c}44, inset 0 1px 0 rgba(255,255,255,.35)`, flexShrink: 0 }}>{svg}</div>;
};

const Source: React.FC<{ text?: string; style?: React.CSSProperties }> = ({ text, style }) => text ? <div style={{ fontFamily: NUM, fontSize: 17, letterSpacing: '.16em', color: 'var(--r-faint)', textTransform: 'uppercase', ...style }}>{text}</div> : null;

/** report stage: flat graphite with a soft top light */
export const RStage: React.FC<{ chapter?: any; tag?: any; color?: string; dur: number; video?: string; start?: number; orbs?: boolean; children: React.ReactNode }> = ({ chapter, tag, color = 'gold', dur, video, start = 0, orbs = true, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const T = currentTheme(); const mode = modeOf(T.id);
  const t = tag || (chapter && (chapter.en || chapter.cn) ? chapter : null);
  const out = exitK(f, dur, 6); const drift = f / fps;
  let bg: React.ReactNode;
  if (T.id === 'report') bg = <><AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 38%, #26262A 0%, #1A1A1C 55%, #121213 100%)' }} /><AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 30% at 50% 108%, ${accent(color)}14, transparent 70%)` }} /></>;
  else if (T.id === 'report-light') bg = <><AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #FFFFFF 0%, #F5F5F7 55%, #ECECF0 100%)' }} /><AbsoluteFill style={{ opacity: 0.8, WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 30%, #000 85%)' }}><DotGrid color="rgba(29,29,31,.13)" ripple={color} /></AbsoluteFill><AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 35% at 85% 105%, ${accent(color)}22, transparent 70%), radial-gradient(ellipse 40% 30% at 10% -5%, ${accent('blue')}14, transparent 70%)` }} /></>;
  else if (T.id === 'report-blur' && video) bg = <><AbsoluteFill style={{ transform: 'scale(1.25)', filter: 'blur(60px) saturate(1.3) brightness(1.08)' }}><VideoAt video={video} start={start} /></AbsoluteFill><AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,250,245,.74), rgba(255,248,240,.66))' }} /><Grain opacity={0.05} /></>;
  else { const b = (i: number, a: number) => `${50 + 28 * Math.sin(drift * 0.35 + i * 2.1) * a}% ${50 + 26 * Math.cos(drift * 0.3 + i * 1.7) * a}%`;
    bg = <><AbsoluteFill style={{ background: '#F3F0F8' }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${b(0, 1)}, #FFC9B5 0%, transparent 42%), radial-gradient(circle at ${b(1, 1)}, #BFD3FF 0%, transparent 45%), radial-gradient(circle at ${b(2, 1)}, #E5C8FF 0%, transparent 42%), radial-gradient(circle at ${b(3, 1)}, #C4F0E4 0%, transparent 40%)`, filter: 'blur(40px)' }} /><Grain opacity={0.06} /></>; }
  return (
    <AbsoluteFill style={{ background: '#151517', overflow: 'hidden', ...(MODES[mode] as any) }}>
      {bg}
      <AbsoluteFill style={{ opacity: out }}>{children}</AbsoluteFill>
      {t && <Capsule en={t.en} cn={t.cn ?? t.title} color={t.color || color} f={f} fps={fps} style={t.y == null ? undefined : { top:t.y }} />}
    </AbsoluteFill>
  );
};

// ═════════ FULL PAGES ═════════

/** PromptToFilm — 一句话 → 成片：窗口里打字、生成进度、结果卡弹出 */
export const PromptToFilm: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const typeS = at(p.typeAt, 4), genS = at(p.genAt, Math.round(dur * 0.45)), doneS = at(p.doneAt, Math.round(dur * 0.72));
  const txt = Array.from(p.prompt || '');
  const n = Math.floor(clamp((f - typeS) / Math.max(1, genS - typeS - 4)) * txt.length);
  const g = clamp((f - genS) / Math.max(1, doneS - genS));
  const done = f >= doneS;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Card style={{ left: 170, top: 250, width: 860, height: 520, ...scaleIn(f, fps, 0) }}>
        <div style={{ height: 64, borderBottom: `1px solid var(--r-line)`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 10 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
          <div style={{ marginLeft: 18, fontFamily: SF, fontWeight: 600, fontSize: 22, color: 'var(--r-dim)' }}>{p.window || 'Prompt'}</div>
        </div>
        <div style={{ padding: '40px 44px' }}>
          <div style={{ fontFamily: NUM, fontSize: 17, letterSpacing: '.24em', color: 'var(--r-faint)' }}>PROMPT · 一句话</div>
          <div style={{ marginTop: 18, fontFamily: SF, fontWeight: 600, fontSize: 44, lineHeight: 1.45, color: 'var(--r-ink)', minHeight: 130 }}>
            {txt.slice(0, n).join('')}<span style={{ display: 'inline-block', width: 3, height: 46, marginLeft: 4, verticalAlign: -8, background: accent(col), opacity: f < genS && Math.floor(f / 8) % 2 === 0 ? 1 : 0 }} />
          </div>
          <div style={{ marginTop: 38, height: 10, borderRadius: 5, background: 'var(--r-track)', overflow: 'hidden', opacity: clamp((f - genS + 4) / 6) }}>
            <div style={{ width: `${g * 100}%`, height: '100%', borderRadius: 5, background: `linear-gradient(90deg, ${accent(col)}, ${accent('pink')})` }} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontFamily: NUM, fontSize: 20, color: 'var(--r-dim)', opacity: clamp((f - genS + 4) / 6) }}>
            <span>{done ? '生成完成' : '生成中…'}</span><span>{Math.round(g * 100)}%</span>
          </div>
        </div>
      </Card>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M1040 510 C1100 510 1120 510 1180 510" stroke={accent(col)} strokeWidth={4} strokeDasharray="6 12" strokeDashoffset={-f * 2} fill="none" opacity={clamp((f - doneS + 6) / 6)} />
      </svg>
      <Card style={{ left: 1190, top: 300, width: 560, height: 420, overflow: 'hidden', ...scaleIn(f, fps, doneS) }}>
        <div style={{ position: 'absolute', inset: 14, borderRadius: 18, background: `radial-gradient(ellipse at 30% 30%, ${accent('violet')}aa, transparent 60%), radial-gradient(ellipse at 75% 70%, ${accent(col)}aa, transparent 60%), #111` }} />
        <div style={{ position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', width: 96, height: 96, borderRadius: 48, background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" box={false} color="#ffffff" size={46} /></div>
        <div style={{ position: 'absolute', left: 34, bottom: 30, right: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><div style={{ fontFamily: SF, fontWeight: 700, fontSize: 34, color: '#fff' }}>{p.result || '成片'}</div><div style={{ fontFamily: NUM, fontSize: 18, color: 'rgba(255,255,255,.7)', letterSpacing: '.14em', marginTop: 4 }}>{p.resultSub || '1080P · READY'}</div></div>
          <div style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(0,0,0,.45)', fontFamily: NUM, fontSize: 20, color: '#fff' }}>{p.duration || '00:44'}</div>
        </div>
      </Card>
    </RStage>
  );
};

/** ShiftBars — 指标行：图标 + 名称 + 横条从 from 变到 to + 数值 */
export const ShiftBars: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const rows = p.rows || []; const H = 200, top = 540 - (rows.length * H) / 2 + 60;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {p.title && <div style={{ position: 'absolute', left: 260, top: top - 140, fontFamily: SF, fontWeight: 800, fontSize: 64, color: 'var(--r-ink)', ...rise(f, fps, 2) }}>{p.title}</div>}
      {rows.map((r: any, i: number) => {
        const d = at(r.at, 6 + i * 10); const m = at(r.moveAt, d + 16); const c = accent(r.color || (i ? 'red' : 'cyan'));
        const k = interpolate(f, [m, m + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t: number) => 1 - Math.pow(1 - t, 3) });
        const v = r.from + (r.to - r.from) * k; const dim = r.dimAt != null && f >= at(r.dimAt, 0);
        return (
          <Card key={i} r={24} style={{ left: 260, top: top + i * H, width: 1400, height: H - 24, ...rise(f, fps, d), opacity: (rise(f, fps, d).opacity as number) * (dim ? 0.45 : 1) }}>
            <div style={{ position: 'absolute', left: 34, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 22 }}>
              <Icon name={r.icon} color={r.color || (i ? 'red' : 'cyan')} size={32} />
              <div><div style={{ fontFamily: SF, fontWeight: 800, fontSize: 44, color: 'var(--r-ink)' }}>{r.label}</div>{r.sub && <div style={{ fontFamily: SF, fontSize: 24, color: 'var(--r-dim)', marginTop: 4 }}>{r.sub}</div>}</div>
            </div>
            <div style={{ position: 'absolute', left: 520, right: 260, top: '50%', height: 16, marginTop: -8, borderRadius: 8, background: 'var(--r-track)' }}>
              <div style={{ width: `${v}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${c}88, ${c})`, boxShadow: `0 0 16px ${c}66` }} />
            </div>
            <div style={{ position: 'absolute', right: 36, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ fontFamily: NUM, fontWeight: 800, fontSize: 48, color: c }}>{r.valueText ?? `${Math.round(v)}`}<span style={{ fontSize: 22, color: 'var(--r-dim)', marginLeft: 4 }}>{r.unit || ''}</span></div>
              {r.note && <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 30, color: c, marginTop: 2, opacity: k }}>{r.note}</div>}
            </div>
            {dim && <div style={{ position: 'absolute', left: 24, right: 24, top: '50%', height: 3, background: accent('red'), transformOrigin: 'left', transform: `scaleX(${clamp((f - at(r.dimAt, 0)) / 10)})` }} />}
          </Card>
        );
      })}
      <Source text={p.source} style={{ position: 'absolute', left: 262, top: top + rows.length * H + 6, ...rise(f, fps, 20) }} />
    </RStage>
  );
};

/** CrossChart — 两条趋势线交叉（示意） */
export const CrossChart: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const X = 330, Y = 300, W = 1260, H = 520;
  const lines = p.lines || [{ label: 'A', pts: [20, 35, 55, 80, 95], color: 'cyan' }, { label: 'B', pts: [90, 75, 55, 35, 20], color: 'red' }];
  const k = interpolate(f, [at(p.drawAt, 8), at(p.drawAt, 8) + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 标题和右侧图例同一行：标题可用宽度 = 卡片宽 - 两侧留白 - 图例宽
  const legendW = lines.reduce((w: number, l: any) => w + 32 + textEm(l.label) * 22 + 28, 0);
  const titleSize = fitSize(p.title || '', 38, W - 100 - legendW - 40, 22);
  const path = (pts: number[]) => pts.map((v, i) => `${i ? 'L' : 'M'}${X + 60 + (i / (pts.length - 1)) * (W - 120)} ${Y + 90 + (1 - v / 100) * (H - 160)}`).join(' ');
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Card style={{ left: X, top: Y - 60, width: W, height: H + 60, ...scaleIn(f, fps, 0) }}>
        <div style={{ position: 'absolute', left: 50, top: 36, fontFamily: SF, fontWeight: 700, fontSize: titleSize, whiteSpace: 'nowrap', color: 'var(--r-ink)' }}>{p.title}</div>
        <div style={{ position: 'absolute', right: 50, top: 44, display: 'flex', gap: 28 }}>{lines.map((l: any, i: number) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: SF, fontSize: 22, color: 'var(--r-dim)' }}><div style={{ width: 22, height: 6, borderRadius: 3, background: accent(l.color) }} />{l.label}</div>)}</div>
      </Card>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[0, 1, 2, 3].map(i => <line key={i} x1={X + 60} x2={X + W - 60} y1={Y + 90 + i * (H - 160) / 3} y2={Y + 90 + i * (H - 160) / 3} stroke="var(--r-ink)" strokeOpacity={0.08} />)}
        {lines.map((l: any, i: number) => <path key={i} d={path(l.pts)} stroke={accent(l.color)} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} style={{ filter: `drop-shadow(0 0 10px ${accent(l.color)}88)` }} />)}
        {p.crossAt != null && (() => { const kk = clamp((f - at(p.crossAt, 40)) / 10); return <g opacity={kk}><circle cx={X + W / 2} cy={Y + 90 + (H - 160) / 2 + (p.crossDy || 0)} r={14 + 30 * (1 - kk)} fill="none" stroke="#fff" strokeWidth={3} /><circle cx={X + W / 2} cy={Y + 90 + (H - 160) / 2 + (p.crossDy || 0)} r={8} fill="#fff" /></g>; })()}
      </svg>
      {p.crossLabel && <div style={{ position: 'absolute', left: X + W / 2 - 90, top: Y + (H - 160) / 2 - 30, padding: '10px 20px', borderRadius: 14, background: 'var(--r-card2)', border: `1px solid var(--r-line)`, fontFamily: SF, fontWeight: 700, fontSize: 26, color: 'var(--r-ink)', ...rise(f, fps, at(p.crossAt, 40) + 4) }}>{p.crossLabel}</div>}
      <Source text={p.source || '示意 · ILLUSTRATIVE'} style={{ position: 'absolute', left: X + 4, top: Y + H + 20, opacity: clamp((f - 20) / 10) }} />
    </RStage>
  );
};

/** ABCards — 两张描边卡片并列，中间问号，最后给出结论胶囊 */
export const ABCards: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const cards = p.cards || [{ label: 'A', sub: '' }, { label: 'B', sub: '' }];
  const rev = at(p.revealAt, Math.round(dur * 0.6));
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {cards.map((c: any, i: number) => { const d = at(c.at, 4 + i * 10); const x = 960 + (i ? 60 : -60 - 600);
        return <Card key={i} outline={accent(c.color || (i ? 'pink' : 'cyan'))} style={{ left: x, top: 230, width: 600, height: 560, ...scaleIn(f, fps, d) }}>
          <div style={{ position: 'absolute', left: 32, top: 30, display: 'flex', alignItems: 'center', gap: 14 }}><Icon name={c.icon || (i ? 'user' : 'spark')} color={c.color || (i ? 'pink' : 'cyan')} size={22} /><div style={{ fontFamily: SF, fontWeight: 700, fontSize: 32, color: 'var(--r-ink)' }}>{c.label}</div></div>
          <div style={{ position: 'absolute', left: 32, right: 32, top: 110, height: 300, borderRadius: 18, overflow: 'hidden', background: `radial-gradient(ellipse at ${30 + i * 40}% 35%, ${accent('violet')}99, transparent 60%), radial-gradient(ellipse at ${70 - i * 40}% 75%, ${accent(col)}88, transparent 55%), #0f0f10` }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 80, height: 80, borderRadius: 40, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" box={false} color="#ffffff" size={38} /></div>
            <div style={{ position: 'absolute', left: 0, bottom: 0, height: 6, width: `${clamp((f - d) / 80) * 100}%`, background: 'rgba(255,255,255,.8)' }} />
          </div>
          <div style={{ position: 'absolute', left: 32, bottom: 36, fontFamily: SF, fontSize: 24, color: 'var(--r-dim)' }}>{c.sub}</div>
        </Card>; })}
      <div style={{ position: 'absolute', left: 960, top: 510, transform: 'translate(-50%,-50%)', width: 88, height: 88, borderRadius: 44, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NUM, fontWeight: 800, fontSize: 44, boxShadow: '0 10px 40px rgba(0,0,0,.6)', ...scaleIn(f, fps, 16) }}>?</div>
      {p.verdict && <div style={{ position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', ...rise(f, fps, rev) }}>
        <div style={{ padding: '16px 40px', borderRadius: 999, background: accent(col), color: onColor(accent(col)), fontFamily: SF, fontWeight: 800, fontSize: 38, boxShadow: `0 10px 40px ${accent(col)}55` }}>{p.verdict}</div></div>}
    </RStage>
  );
};

/** Statement — 苹果发布会式大字：逐行模糊浮现，关键词渐变 */
export const Statement: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const lines: any[] = p.lines || [];
  const z = interpolate(f, [0, dur], [1.04, 1]);
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${z})` }}>
        {p.eyebrow && <div style={{ fontFamily: NUM, fontWeight: 600, fontSize: 24, letterSpacing: '.34em', color: accent(col), marginBottom: 34, ...rise(f, fps, 0) }}>{p.eyebrow}</div>}
        {lines.map((l: any, i: number) => { const t = typeof l === 'string' ? { text: l } : l; const d = at(t.at, 4 + i * 12);
          const parts = String(t.text).split(/(\[[^\]]+\])/);
          return <div key={i} style={{ fontFamily: SF, fontWeight: 800, fontSize: t.size || p.size || 96, letterSpacing: '-0.01em', lineHeight: 1.22, color: 'var(--r-ink)', textAlign: 'center', whiteSpace: 'nowrap', ...rise(f, fps, d, 40) }}>
            {parts.map((s, j) => s.startsWith('[') ? <span key={j} style={{ backgroundImage: `linear-gradient(90deg, ${accent(p.from || 'gold')}, ${accent(p.to || 'pink')})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.slice(1, -1)}</span> : <span key={j}>{s}</span>)}
          </div>; })}
        {p.foot && <div style={{ marginTop: 40, fontFamily: SF, fontSize: 30, color: 'var(--r-dim)', ...rise(f, fps, at(p.footAt, 30)) }}>{p.foot}</div>}
      </AbsoluteFill>
    </RStage>
  );
};

/** PhoneChat — 手机对话 + 右侧说明卡 */
export const PhoneChat: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'cyan';
  const msgs = p.messages || []; const side = p.side || [];
  const PX = 330, PY = 150, PW = 430, PH = 800;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <div style={{ position: 'absolute', left: PX, top: PY, width: PW, height: PH, borderRadius: 64, background: '#0B0B0C', border: '10px solid #3A3A3E', boxShadow: '0 50px 120px rgba(0,0,0,.6), inset 0 0 0 2px #000', ...rise(f, fps, 0, 60), ...(MODES.dark as any) }}>
        <div style={{ position: 'absolute', left: '50%', top: 18, width: 120, height: 34, marginLeft: -60, borderRadius: 17, background: '#000' }} />
        <div style={{ position: 'absolute', left: 28, top: 76, display: 'flex', alignItems: 'center', gap: 12 }}><Icon name="spark" color={col} size={18} /><div style={{ fontFamily: SF, fontWeight: 700, fontSize: 26, color: 'var(--r-ink)' }}>{p.app || 'AI 助手'}</div></div>
        <div style={{ position: 'absolute', left: 22, right: 22, top: 150, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {msgs.map((m: any, i: number) => { const d = at(m.at, 10 + i * 18); const me = m.from !== 'ai';
            return <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '86%', ...scaleIn(f, fps, d), transformOrigin: me ? 'right' : 'left' }}>
              {m.card ? <div style={{ width: 300, borderRadius: 20, overflow: 'hidden', background: 'var(--r-card2)' }}>
                <div style={{ height: 170, background: `radial-gradient(ellipse at 30% 30%, ${accent('violet')}aa, transparent 60%), radial-gradient(ellipse at 75% 70%, ${accent('gold')}aa, transparent 60%), #111`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" box={false} color="#ffffff" size={40} /></div>
                <div style={{ padding: '12px 16px', fontFamily: SF, fontWeight: 600, fontSize: 21, color: 'var(--r-ink)' }}>{m.text}</div></div>
                : <div style={{ padding: '14px 20px', borderRadius: 22, background: me ? accent(col) : 'var(--r-card2)', color: me ? '#08131a' : 'var(--r-ink)', fontFamily: SF, fontWeight: 600, fontSize: 24, lineHeight: 1.4 }}>{m.text}</div>}
            </div>; })}
        </div>
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 30, height: 60, borderRadius: 30, background: 'var(--r-card2)', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: SF, fontSize: 22, color: 'var(--r-faint)' }}>发消息…</div>
      </div>
      {side.map((s: any, i: number) => { const d = at(s.at, 20 + i * 12);
        return <Card key={i} r={24} style={{ left: 900, top: 250 + i * 190, width: 700, height: 160, ...rise(f, fps, d) }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 24 }}><Icon name={s.icon} color={s.color || col} size={28} />
            <div><div style={{ fontFamily: SF, fontWeight: 700, fontSize: 36, color: 'var(--r-ink)' }}>{s.title}</div>{s.sub && <div style={{ fontFamily: SF, fontSize: 23, color: 'var(--r-dim)', marginTop: 6 }}>{s.sub}</div>}</div></div>
          {s.value && <div style={{ position: 'absolute', right: 34, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: NUM, fontWeight: 800, fontSize: 46, color: accent(s.color || 'gold') }}>{s.value}</div>}
        </Card>; })}
    </RStage>
  );
};

/** InputCards — 一张被划掉的旧观点卡 + 多张关键要素卡依次点亮打勾 */
export const InputCards: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const items = p.items || []; const n = items.length; const W = 360, G = 36, x0 = 960 - (n * W + (n - 1) * G) / 2;
  const strikeAt = at(p.strikeAt, 12);
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {p.title && <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: SF, fontWeight: 800, fontSize: 60, color: 'var(--r-ink)', ...rise(f, fps, 2) }}>{p.title}</div>}
      {p.old && <div style={{ position: 'absolute', left: 0, right: 0, top: 285, display: 'flex', justifyContent: 'center', ...rise(f, fps, 6) }}>
        <div style={{ position: 'relative', padding: '14px 34px', borderRadius: 16, background: 'var(--r-card)', border: `1px solid var(--r-line)`, display: 'flex', alignItems: 'center', gap: 14, opacity: f > strikeAt ? 0.55 : 1 }}>
          <Icon name={p.oldIcon || 'tool'} color="red" size={18} /><span style={{ fontFamily: SF, fontWeight: 600, fontSize: 30, color: 'var(--r-dim)' }}>{p.old}</span>
          <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 3, background: accent('red'), transformOrigin: 'left', transform: `scaleX(${clamp((f - strikeAt) / 8)})` }} />
        </div></div>}
      {items.map((it: any, i: number) => { const d = at(it.at, 16 + i * 10); const on = f >= d + 8; const c = accent(it.color || col);
        return <Card key={i} outline={on ? c : undefined} style={{ left: x0 + i * (W + G), top: 420, width: W, height: 380, ...rise(f, fps, d, 40) }}>
          <div style={{ position: 'absolute', left: 36, top: 40 }}><Icon name={it.icon} color={it.color || col} size={34} /></div>
          <div style={{ position: 'absolute', right: 30, top: 36, width: 44, height: 44, borderRadius: 22, background: on ? accent('green') : 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1 : 0.8})` }}>{on && <Icon name="check" box={false} color="#ffffff" size={26} />}</div>
          <div style={{ position: 'absolute', left: 36, bottom: 110, fontFamily: SF, fontWeight: 800, fontSize: 54, color: 'var(--r-ink)' }}>{it.title}</div>
          <div style={{ position: 'absolute', left: 36, right: 30, bottom: 50, fontFamily: SF, fontSize: 25, color: 'var(--r-dim)' }}>{it.sub}</div>
        </Card>; })}
      {p.result && <div style={{ position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', ...rise(f, fps, at(p.resultAt, 60)) }}>
        <div style={{ padding: '14px 38px', borderRadius: 999, background: accent(col), color: onColor(accent(col)), fontFamily: SF, fontWeight: 800, fontSize: 34 }}>{p.result}</div></div>}
    </RStage>
  );
};

/** HubFlow — 左侧输入 → 中心节点 → 右侧产出，连线有流动的光点 */
export const HubFlow: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'cyan';
  const ins = p.inputs || []; const n = ins.length; const cx = 960, cy = 560;
  const hubD = at(p.hubAt, 6), outD = at(p.outputAt, Math.round(dur * 0.65));
  const detail = p._motionDetail === 'merge';
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {p.title && <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: SF, fontWeight: 800, fontSize: 54, color: 'var(--r-ink)', ...rise(f, fps, 0) }}>{p.title}</div>}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {ins.map((it: any, i: number) => { const y = cy + (i - (n - 1) / 2) * 170; const d = at(it.at, 10 + i * 8); const k = clamp((f - d - 6) / 14);
          const path = `M 640 ${y} C 760 ${y}, 760 ${cy}, ${cx - 110} ${cy}`;
          return <g key={i} opacity={k}><path d={path} stroke={accent(it.color || col)} strokeOpacity={0.5} strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            <path d={path} stroke="#fff" strokeWidth={5} fill="none" pathLength={100} strokeDasharray="4 96" strokeDashoffset={-((f * 1.6 + i * 30) % 100)} strokeLinecap="round" /></g>; })}
        {(() => { const k = clamp((f - outD) / 12); const path = `M ${cx + 110} ${cy} L 1290 ${cy}`;
          return <g opacity={k}><path d={path} stroke={accent(p.outColor || 'gold')} strokeWidth={4} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            <path d={path} stroke="#fff" strokeWidth={6} fill="none" pathLength={100} strokeDasharray="5 95" strokeDashoffset={-((f * 2) % 100)} strokeLinecap="round" /></g>; })()}
      </svg>
      {detail && <MergeTokens frame={f} fps={fps} inputs={ins.map((it:any,i:number)=>({y:cy+(i-(n-1)/2)*170,at:at(it.at,10+i*8)}))} out={outD}/>}
      {ins.map((it: any, i: number) => { const y = cy + (i - (n - 1) / 2) * 170; const d = at(it.at, 10 + i * 8);
        return <Card key={i} r={22} style={{ left: 260, top: y - 62, width: 380, height: 124, ...rise(f, fps, d) }}>
          <div style={{ position: 'absolute', left: 26, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 20 }}><Icon name={it.icon} color={it.color || col} size={24} />
            <div><div style={{ fontFamily: SF, fontWeight: 700, fontSize: 34, color: 'var(--r-ink)' }}>{it.title}</div>{it.sub && <div style={{ fontFamily: SF, fontSize: 20, color: 'var(--r-dim)', marginTop: 3 }}>{it.sub}</div>}</div></div>
        </Card>; })}
      <div style={{ position: 'absolute', left: cx - 110, top: cy - 110, width: 220, height: 220, borderRadius: 56, background: 'var(--r-cardbg)', backdropFilter: 'var(--r-blur)', border: `3px solid ${accent(col)}`, boxShadow: `0 0 ${50 + 20 * Math.sin(f / 8)}px ${accent(col)}66, 0 30px 80px rgba(0,0,0,.5)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...scaleIn(f, fps, hubD) }}>
        <Icon name={p.hubIcon || 'spark'} box={false} color={col} size={70} /><div style={{ fontFamily: NUM, fontWeight: 800, fontSize: 40, color: 'var(--r-ink)', marginTop: 6 }}>{p.hub || 'AI'}</div>
      </div>
      <Card outline={accent(p.outColor || 'gold')} r={30} style={{ left: 1290, top: cy - 130, width: 400, height: 260, ...scaleIn(f, fps, outD + 8) }}>
        <div style={{ position: 'absolute', left: 36, top: 36 }}><Icon name={p.outIcon || 'target'} color={p.outColor || 'gold'} size={28} /></div>
        <div style={{ position: 'absolute', left: 36, bottom: 76, fontFamily: SF, fontWeight: 800, fontSize: 50, color: 'var(--r-ink)' }}>{p.output}</div>
        {detail && <MergeReceipt frame={f} fps={fps} out={outD}/>}
        {p.outputSub && <div style={{ position: 'absolute', left: 36, bottom: 36, fontFamily: SF, fontSize: 24, color: 'var(--r-dim)' }}>{p.outputSub}</div>}
      </Card>
    </RStage>
  );
};

/** ProfileCheck — 候选人档案卡：条件逐条核对（✓ / ✕），右侧给结论 */
export const ProfileCheck: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'cyan';
  const rows = p.rows || [];
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Card style={{ left: 330, top: 230, width: 700, height: 150 + rows.length * 110, ...scaleIn(f, fps, 0) }}>
        <div style={{ position: 'absolute', left: 40, top: 36, display: 'flex', alignItems: 'center', gap: 20 }}><Icon name="user" color={col} size={30} />
          <div><div style={{ fontFamily: SF, fontWeight: 800, fontSize: 38, color: 'var(--r-ink)' }}>{p.name}</div>{p.nameSub && <div style={{ fontFamily: SF, fontSize: 22, color: 'var(--r-dim)', marginTop: 2 }}>{p.nameSub}</div>}</div></div>
        {rows.map((r: any, i: number) => { const d = at(r.at, 10 + i * 10); const ok = r.state !== 'no'; const c = accent(ok ? 'green' : 'red');
          return <div key={i} style={{ position: 'absolute', left: 30, right: 30, top: 150 + i * 110, height: 90, borderRadius: 18, background: ok ? 'var(--r-card2)' : 'rgba(255,69,58,.10)', border: `1px solid ${ok ? 'var(--r-line)' : accent('red') + '66'}`, display: 'flex', alignItems: 'center', padding: '0 26px', justifyContent: 'space-between', ...rise(f, fps, d) }}>
            <span style={{ fontFamily: SF, fontWeight: 700, fontSize: 32, color: 'var(--r-ink)' }}>{r.text}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{r.tag && <span style={{ fontFamily: SF, fontSize: 22, fontWeight: 700, color: accentText(ok ? 'green' : 'red') }}>{r.tag}</span>}
              <div style={{ width: 44, height: 44, borderRadius: 22, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', ...scaleIn(f, fps, d + 8) }}><Icon name={ok ? 'check' : 'x'} box={false} color={onColor(c)} size={24} /></div></div>
          </div>; })}
      </Card>
      {p.verdict && <Card outline={accent(p.verdictColor || 'red')} style={{ left: 1110, top: 330, width: 480, height: 300, ...scaleIn(f, fps, at(p.verdictAt, 60)) }}>
        <div style={{ position: 'absolute', left: 40, top: 40, fontFamily: NUM, fontSize: 18, letterSpacing: '.3em', color: accentText(p.verdictColor || 'red') }}>{p.verdictEn || 'RESULT'}</div>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 90, fontFamily: SF, fontWeight: 800, fontSize: 50, lineHeight: 1.3, color: 'var(--r-ink)', whiteSpace: 'pre-line' }}>{p.verdict}</div>
      </Card>}
    </RStage>
  );
};

/** FlowSteps — 横向路线：节点依次点亮，可带一个警示标签 */
export const FlowSteps: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'gold';
  const steps = p.steps || []; const n = steps.length; const L = 300, R = 1620, y = 560;
  const last = at(steps[n - 1]?.at, 10 + (n - 1) * 12);
  const lineK = clamp((f - at(steps[0]?.at, 10)) / Math.max(1, last - at(steps[0]?.at, 10)));
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {p.title && <div style={{ position: 'absolute', left: L, top: 220, fontFamily: SF, fontWeight: 800, fontSize: 58, color: 'var(--r-ink)', ...rise(f, fps, 0) }}>{p.title}</div>}
      <div style={{ position: 'absolute', left: L, width: R - L, top: y - 2, height: 4, borderRadius: 2, background: 'var(--r-track)' }} />
      <div style={{ position: 'absolute', left: L, width: (R - L) * lineK, top: y - 2, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${accent(col)}66, ${accent(col)})`, boxShadow: `0 0 14px ${accent(col)}` }} />
      {steps.map((s: any, i: number) => { const x = L + (n === 1 ? 0 : (i / (n - 1)) * (R - L)); const d = at(s.at, 10 + i * 12); const on = f >= d; const hi = i === n - 1 || s.hi;
        return <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: 13, background: on ? accent(col) : 'var(--r-track)', boxShadow: on ? `0 0 0 8px ${accent(col)}33` : 'none' }} />
          <Card r={22} outline={hi && on ? accent(col) : undefined} style={{ left: x - 170, top: i % 2 ? y + 60 : y - 250, width: 340, height: 190, ...rise(f, fps, d, i % 2 ? -26 : 26) }}>
            <div style={{ position: 'absolute', left: 28, top: 26, fontFamily: NUM, fontWeight: 800, fontSize: 24, color: accent(col) }}>{s.k || String(i + 1).padStart(2, '0')}</div>
            <div style={{ position: 'absolute', left: 28, top: 64, fontFamily: SF, fontWeight: 800, fontSize: 46, color: 'var(--r-ink)' }}>{s.title}</div>
            {s.sub && <div style={{ position: 'absolute', left: 28, bottom: 26, fontFamily: SF, fontSize: 22, color: 'var(--r-dim)' }}>{s.sub}</div>}
          </Card></React.Fragment>; })}
      {p.warn && <div style={{ position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', ...rise(f, fps, at(p.warnAt, 50)) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 32px', borderRadius: 18, background: 'rgba(255,69,58,.14)', border: `2px solid ${accent('red')}` }}>
          <Icon name="x" color="red" size={18} /><span style={{ fontFamily: SF, fontWeight: 800, fontSize: 34, color: 'var(--r-ink)' }}>{p.warn}</span></div></div>}
    </RStage>
  );
};

export const REPORT_PAGES = { PromptToFilm, ShiftBars, CrossChart, ABCards, Statement, PhoneChat, InputCards, HubFlow, ProfileCheck, FlowSteps };

// ═════════ OVERLAYS（叠在人物画面上）═════════

/** FactPanel — 人物一侧：章节胶囊 + 大数字 + 事实条目 + 来源脚注（参考视频最常用的那种） */
export const FactPanel: React.FC<OverlayProps> = ({ p, start, dur, side = 'left' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const col = p.color || 'gold'; const at = (s: any, fb: number) => rel(s, start, fps, fb);
  const out = exitK(f, dur, 8); const x = side === 'left' ? 64 : 1920 - 64 - (p.width || 640);
  const num = p.number; const nk = num ? interpolate(f, [at(num.at, 8), at(num.at, 8) + (num.frames || 26)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t: number) => 1 - Math.pow(1 - t, 3) }) : 0;
  return (
    <AbsoluteFill style={{ opacity: out, ...(MODES.dark as any) }}>
      <AbsoluteFill style={{ background: side === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.2) 38%, transparent 55%)' : 'linear-gradient(270deg, rgba(0,0,0,.55), rgba(0,0,0,.2) 38%, transparent 55%)', opacity: clamp(f / 8) }} />
      {p.tag && <Capsule en={p.tag.en} cn={p.tag.cn} color={p.tag.color || col} f={f} fps={fps} style={side === 'right' ? { left: 'auto', right: 56 } : {}} />}
      <div style={{ position: 'absolute', left: x, top: p.y ?? 170, width: p.width || 640, textAlign: side === 'right' ? 'right' : 'left' }}>
        {num && <div style={{ ...rise(f, fps, at(num.at, 8)), whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: NUM, fontWeight: 800, fontSize: num.size || 120, letterSpacing: '-0.02em', color: accentText(num.color || col, '#16161A'), textShadow: '0 6px 30px rgba(0,0,0,.4)' }}>{num.text ?? fmt((num.from ?? 0) + (num.to - (num.from ?? 0)) * nk, num.decimals || 0)}</span>
          <span style={{ fontFamily: SF, fontWeight: 700, fontSize: 40, color: 'var(--r-ink)', marginLeft: 10 }}>{num.unit}</span></div>}
        {p.title && <div style={{ fontFamily: SF, fontWeight: 800, fontSize: p.titleSize || 64, color: 'var(--r-ink)', lineHeight: 1.2, whiteSpace: 'pre-line', textShadow: '0 2px 4px rgba(0,0,0,.5), 0 6px 30px rgba(0,0,0,.6)', ...rise(f, fps, at(p.titleAt, 6)) }}>{p.title}</div>}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12, alignItems: side === 'right' ? 'flex-end' : 'flex-start' }}>
          {(p.lines || []).map((l: any, i: number) => { const d = at(l.at, 16 + i * 10);
            return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: SF, fontWeight: 600, fontSize: l.size || 30, color: 'var(--r-dim)', whiteSpace: 'nowrap', ...rise(f, fps, d, 14) }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: accent(l.color || col) }} />
              {String(l.text).split(/(\[[^\]]+\])/).map((s, j) => s.startsWith('[') ? <b key={j} style={{ color: accentText(l.color || col, '#16161A') }}>{s.slice(1, -1)}</b> : <span key={j}>{s}</span>)}
            </div>; })}
        </div>
        {p.bar && (() => { const d = at(p.bar.at, 20); const k = clamp((f - d) / 24); return <div style={{ marginTop: 26, width: p.width || 640, ...rise(f, fps, d) }}>
          <div style={{ height: 10, borderRadius: 5, background: 'var(--r-track)' }}><div style={{ width: `${k * (p.bar.value || 100)}%`, height: '100%', borderRadius: 5, background: accent(p.bar.color || col), boxShadow: `0 0 14px ${accent(p.bar.color || col)}` }} /></div></div>; })()}
        <Source text={p.source} style={{ marginTop: 20, ...rise(f, fps, at(p.sourceAt, 30)) }} />
      </div>
    </AbsoluteFill>
  );
};

/** QuoteCard — 人物一侧的「引用 / 新闻卡」：白色纸面卡片，带出处 */
export const QuoteCard: React.FC<OverlayProps> = ({ p, start, dur, side = 'right' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = exitK(f, dur, 8);
  const W = p.width || 620; const x = side === 'left' ? 64 : 1920 - 64 - W;
  const k = spring({ frame: f - 2, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ opacity: out, ...(MODES.dark as any) }}>
      <div style={{ position: 'absolute', left: x, top: p.y ?? 60, width: W, borderRadius: 26, padding: 12, background: 'rgba(40,40,44,.7)', border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(24px)', boxShadow: '0 40px 90px rgba(0,0,0,.5)', opacity: clamp(k * 1.5), transform: `perspective(1400px) translateY(${(1 - k) * 40}px) rotateX(${(1 - k) * 12}deg)` }}>
        <div style={{ padding: '12px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: accent(p.color || 'gold') }} /><span style={{ fontFamily: SF, fontWeight: 700, fontSize: 28, color: 'var(--r-ink)' }}>{p.source}</span></div>
          {p.sub && <div style={{ fontFamily: SF, fontSize: 22, color: 'var(--r-dim)', marginTop: 4, marginLeft: 18 }}>{p.sub}</div>}
          {p.en && <div style={{ fontFamily: NUM, fontSize: 15, letterSpacing: '.24em', color: 'var(--r-faint)', marginTop: 6, marginLeft: 18 }}>{p.en}</div>}
        </div>
        <div style={{ borderRadius: 16, background: '#FBFBFD', padding: '34px 36px', color: '#1D1D1F' }}>
          <div style={{ fontFamily: SF, fontWeight: 800, fontSize: p.size || 52, lineHeight: 1.3, whiteSpace: 'pre-line', ...rise(f, fps, 10) }}>{p.quote}</div>
          {(p.lines || []).map((l: string, i: number) => <div key={i} style={{ marginTop: 14, height: 12, borderRadius: 6, background: '#E5E5EA', width: `${[92, 80, 64][i % 3]}%`, ...rise(f, fps, 16 + i * 3) }} />)}
          {p.foot && <div style={{ marginTop: 22, fontFamily: SF, fontSize: 20, color: '#86868B', ...rise(f, fps, 22) }}>{p.foot}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** GapBars — 人物一侧的对比横条（两条差距拉开），适合「差距」「此消彼长」 */
export const GapBars: React.FC<OverlayProps> = ({ p, start, dur, side = 'right' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = exitK(f, dur, 8); const at = (s: any, fb: number) => rel(s, start, fps, fb);
  const W = p.width || 620; const x = side === 'left' ? 64 : 1920 - 64 - W;
  return (
    <AbsoluteFill style={{ opacity: out, ...(MODES.dark as any) }}>
      <AbsoluteFill style={{ background: `linear-gradient(${side === 'left' ? 90 : 270}deg, rgba(0,0,0,.74), rgba(0,0,0,.5) 36%, transparent 62%)`, opacity: clamp(f / 8) }} />
      {/* 叠在真人画面上：视频亮度不可预知，暗色蒙层要足够深，文字才稳定看得清 */}
      {p.tag && <Capsule en={p.tag.en} cn={p.tag.cn} color={p.tag.color || 'gold'} f={f} fps={fps} />}
      <div style={{ position: 'absolute', left: x, top: p.y ?? 300, width: W }}>
        {p.title && <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 50, color: 'var(--r-ink)', marginBottom: 30, textShadow: '0 4px 24px rgba(0,0,0,.5)', ...rise(f, fps, 2) }}>{p.title}</div>}
        {(p.rows || []).map((r: any, i: number) => { const d = at(r.at, 8 + i * 8); const m = at(r.moveAt, d + 10);
          const k = interpolate(f, [m, m + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t: number) => 1 - Math.pow(1 - t, 3) });
          const v = (r.from ?? 50) + ((r.to ?? 50) - (r.from ?? 50)) * k; const c = accent(r.color || (i ? 'gold' : 'cyan'));
          return <div key={i} style={{ marginBottom: 28, ...rise(f, fps, d) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF, fontWeight: 700, fontSize: 28, color: 'var(--r-ink)', marginBottom: 10 }}><span>{r.label}</span><span style={{ fontFamily: NUM, color: accentText(r.color || (i ? 'gold' : 'cyan'), '#16161A') }}>{r.valueText || ''}</span></div>
            <div style={{ height: 14, borderRadius: 7, background: 'var(--r-track)' }}><div style={{ width: `${v}%`, height: '100%', borderRadius: 7, background: c, boxShadow: `0 0 16px ${c}88` }} /></div>
          </div>; })}
        {p.note && <div style={{ marginTop: 8, display: 'inline-block', padding: '10px 22px', borderRadius: 999, background: accent(p.noteColor || 'red'), color: onColor(accent(p.noteColor || 'red')), fontFamily: SF, fontWeight: 800, fontSize: 30, ...rise(f, fps, at(p.noteAt, 40)) }}>{p.note}</div>}
        <Source text={p.source} style={{ marginTop: 18, color: 'var(--r-dim)', textShadow: '0 1px 8px rgba(0,0,0,.8)', opacity: clamp((f - 20) / 10) }} />
      </div>
    </AbsoluteFill>
  );
};

/** FollowPill — 苹果式关注卡（右下角） */
export const FollowPill: React.FC<OverlayProps> = ({ p, start, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = exitK(f, dur, 8); const at = (s: any, fb: number) => rel(s, start, fps, fb);
  const tap = at(p.tapAt, 50); const done = f >= tap;
  return (
    <AbsoluteFill style={{ opacity: out, ...(MODES.dark as any) }}>
      <div style={{ position: 'absolute', right: 70, top: 90, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 22px 20px 26px', borderRadius: 30, background: 'rgba(36,36,40,.72)', border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(28px)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', ...scaleIn(f, fps, 4) }}>
        <Icon name="user" color={p.color || 'cyan'} size={28} />
        <div><div style={{ fontFamily: SF, fontWeight: 800, fontSize: 32, color: 'var(--r-ink)' }}>{p.name}</div><div style={{ fontFamily: SF, fontSize: 21, color: 'var(--r-dim)', marginTop: 2 }}>{p.sub}</div></div>
        <div style={{ marginLeft: 12, padding: '14px 30px', borderRadius: 999, background: done ? 'var(--r-track)' : accent(p.color || 'cyan'), color: done ? 'var(--r-ink)' : '#08131a', fontFamily: SF, fontWeight: 800, fontSize: 26, transform: `scale(${f >= tap - 3 && f < tap + 3 ? 0.92 : 1})` }}>{done ? '✓ 已关注' : '关注'}</div>
      </div>
    </AbsoluteFill>
  );
};

export const REPORT_OVERLAYS = { FactPanel, QuoteCard, GapBars, FollowPill };
