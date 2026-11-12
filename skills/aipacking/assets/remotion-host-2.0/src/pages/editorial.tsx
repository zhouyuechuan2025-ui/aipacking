// 编辑设计风格（style: editorial）：黑白灰 + 单一强调色；超大字 + 等宽小标注；网格；真人画面做设计素材；每页一个创意概念
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rel } from '../lib/anim';
import type { PageProps } from './full';
import { VideoAt } from '../fx/visual';
import { fitLines } from '../lib/fit';

// 只用随包字体（src/lib/fonts.ts），保证每台电脑渲染结果一致
export const DISP = '"Inter Tight","Noto Sans SC",sans-serif';
export const MONO = '"JetBrains Mono","Noto Sans SC",monospace';
const P = { paper: '#F2F1ED', ink: '#0A0A0B', gray: '#5A5A5F', line: 'rgba(10,10,11,.14)', lineD: 'rgba(255,255,255,.16)' };
const E = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
const EIO = (t: number) => { t = clamp(t); return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; };
const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };

/** 遮罩上移出现（整行文字从一条线下面升起） */
export const Reveal: React.FC<{ d: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ d, dur = 16, children, style }) => {
  const f = useCurrentFrame(); const k = E((f - d) / dur);
  return <div style={{ overflow: 'hidden', ...style }}><div style={{ transform: `translateY(${(1 - k) * 105}%)` }}>{children}</div></div>;
};
/** 等宽小标注 */
export const Meta: React.FC<{ children: React.ReactNode; d?: number; color?: string; style?: React.CSSProperties }> = ({ children, d = 0, color, style }) => {
  const f = useCurrentFrame(); const t = String(children); const n = Math.floor(clamp((f - d) / 14) * t.length);
  return <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: '.12em', textTransform: 'uppercase', color: color || P.gray, whiteSpace: 'pre', ...style }}>{t.slice(0, n)}</div>;
};

/** 页面框架：纸白 / 纯黑底 + 12 栏网格线 + 顶部信息条 */
export const EStage: React.FC<{ dark?: boolean; chapter?: any; dur: number; grid?: boolean; children: React.ReactNode; index?: string; leftOnVideo?: boolean }> = ({ dark, chapter, dur, grid = true, children, leftOnVideo }) => {
  const f = useCurrentFrame(); const out = interpolate(f, [dur - 5, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ink = dark ? '#fff' : P.ink; const line = dark ? P.lineD : P.line;
  return (
    <AbsoluteFill style={{ background: dark ? P.ink : P.paper, overflow: 'hidden', ['--e-ink' as any]: ink, ['--e-line' as any]: line }}>
      {grid && <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {Array.from({ length: 13 }).map((_, i) => { const x = 120 + i * 140; const k = E((f - i) / 20); return <line key={i} x1={x} x2={x} y1={0} y2={1080 * k} stroke={line} strokeWidth={1} />; })}
        <line x1={0} x2={1920 * E(f / 20)} y1={110} y2={110} stroke={line} /><line x1={1920 - 1920 * E(f / 20)} x2={1920} y1={970} y2={970} stroke={line} />
      </svg>}
      <AbsoluteFill style={{ opacity: out }}>{children}</AbsoluteFill>
      {chapter && <>
        <Meta d={2} color={dark || leftOnVideo ? 'rgba(255,255,255,.85)' : P.gray} style={{ position: 'absolute', left: 120, top: 62, zIndex: 8, ...(leftOnVideo ? { textShadow: '0 1px 8px rgba(0,0,0,.85)' } : {}) }}>{`${String(chapter.index).padStart(2, '0')} / ${String(chapter.total).padStart(2, '0')}   ${chapter.en || ''}`}</Meta>
        <Meta d={4} color={dark ? 'rgba(255,255,255,.55)' : P.gray} style={{ position: 'absolute', right: 120, top: 62 }}>{chapter.cn || chapter.title || ''}</Meta>
      </>}
    </AbsoluteFill>
  );
};

/** SplitHero — 左：黑白口播画面（遮罩擦出）；右：巨型标题 + 等宽元信息 */
export const SplitHero: React.FC<PageProps> = ({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const wipe = EIO(f / 14); const ko = edges?.toPerson ? EIO((dur - f) / 14) : 1; const zoom = 1 + 0.28 * ko; const LW = 820 + 1100 * (1 - ko);
  return (
    <EStage chapter={chapter} dur={dur + 999} leftOnVideo>
      <div style={{ position: 'absolute', left: 0, top: 0, width: LW, height: 1080, overflow: 'hidden', zIndex: 5, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom * 1.28})`, transformOrigin: '50% 8%', }}><VideoAt video={video} start={start} /></div>
        <Meta d={10} color="rgba(255,255,255,.8)" style={{ position: 'absolute', left: 40, bottom: 40 }}>{p.caption || 'REC ● 00:00:00'}</Meta>
      </div>
      <div style={{ position: 'absolute', left: LW, top: 0, width: 6, height: 1080 * wipe, background: col, zIndex: 6 }} />
      <div style={{ position: 'absolute', left: 960, top: 250 }}>
        <Meta d={at(p.metaAt, 4)} style={{ marginBottom: 26 }}>{p.meta || 'PROMPT → FILM'}</Meta>
        {/* 右半边可用宽度 840px：几行共用一个字号，放不下就一起缩 */}
        {(() => { const fs = fitLines(p.lines || [], p.size || 180, 840, 72, -0.03); return (p.lines || []).map((l: string, i: number) => <Reveal key={i} d={at(null, 6 + i * 6)} style={{ marginTop: i ? -10 : 0 }}>
          <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: fs, lineHeight: 1.05, letterSpacing: '-0.03em', color: i === (p.hi ?? -1) ? col : P.ink, whiteSpace: 'nowrap' }}>{l}</div></Reveal>); })()}
        <div style={{ marginTop: 40, width: 760 * E((f - 18) / 20), height: 2, background: P.ink }} />
        <div style={{ marginTop: 22, display: 'flex', gap: 60 }}>{(p.facts || []).map((x: any, i: number) => <div key={i}>
          <Meta d={at(x.at, 22 + i * 5)}>{x.k}</Meta>
          <Reveal d={at(x.at, 22 + i * 5) + 2}><div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 44, color: P.ink, marginTop: 6 }}>{x.v}</div></Reveal></div>)}</div>
      </div>
    </EStage>
  );
};

/** TickerDrop — 「贬值」做成行情走势：一路走高 → 说到关键词时断崖下跌（示意） */
export const TickerDrop: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const red = accent(p.color || 'red');
  const drop = at(p.dropAt, Math.round(dur * 0.55));
  const X0 = 120, X1 = 1800, Y0 = 380, Y1 = 900; const N = 60; const rise = (i: number) => 0.2 + 0.55 * (i / N) + 0.05 * Math.sin(i * 0.9) + 0.03 * Math.sin(i * 2.3);
  const drawK = clamp(f / (drop - 2)); const dk = EIO((f - drop) / 18);
  const pts: [number, number][] = [];
  const nUp = Math.floor(N * 0.72);
  for (let i = 0; i <= nUp; i++) if (i / nUp <= drawK) pts.push([X0 + (i / N) * (X1 - X0), Y1 - rise(i) * (Y1 - Y0)]);
  const peak = [X0 + (nUp / N) * (X1 - X0), Y1 - rise(nUp) * (Y1 - Y0)];
  if (dk > 0) { const end = [X0 + ((nUp + 3) / N) * (X1 - X0), Y1 - 0.06 * (Y1 - Y0)]; pts.push([peak[0] + (end[0] - peak[0]) * dk, peak[1] + (end[1] - peak[1]) * dk]);
    if (dk >= 1) { const t = clamp((f - drop - 18) / 30); pts.push([end[0] + t * (X1 - end[0]), end[1] + 4 * Math.sin(f / 5) * t]); } }
  const path = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  const last = pts[pts.length - 1] || [X0, Y1];
  const shake = dk > 0 && dk < 1 ? Math.sin(f * 3) * 6 * (1 - dk) : 0;
  return (
    <EStage chapter={chapter} dur={dur}>
      <div style={{ position: 'absolute', left: 120, top: 150 }}>
        <Meta d={4}>{p.meta || 'SKILL INDEX · 示意'}</Meta>
        <Reveal d={6}><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 150, letterSpacing: '-0.02em', color: P.ink, lineHeight: 1.1, position: 'relative', display: 'inline-block' }}>{p.title}
          <div style={{ position: 'absolute', left: -10, right: -10, top: '54%', height: 14, background: red, transformOrigin: 'left', transform: `scaleX(${E((f - drop - 4) / 12)})` }} /></div></Reveal>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${shake}px)` }}>
        {[0, 1, 2, 3].map(i => <line key={i} x1={X0} x2={X1} y1={Y0 + i * (Y1 - Y0) / 3} y2={Y0 + i * (Y1 - Y0) / 3} stroke={P.line} strokeDasharray={i === 3 ? undefined : '4 8'} />)}
        <path d={path} stroke={dk > 0 ? red : P.ink} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {dk > 0 && <path d={`${path} L ${last[0]} ${Y1} L ${peak[0]} ${Y1} Z`} fill={red} opacity={0.08} />}
        <circle cx={last[0]} cy={last[1]} r={12} fill={dk > 0 ? red : P.ink} />
        <circle cx={last[0]} cy={last[1]} r={12 + ((f % 30) / 30) * 30} fill="none" stroke={dk > 0 ? red : P.ink} opacity={1 - (f % 30) / 30} />
      </svg>
      <div style={{ position: 'absolute', left: peak[0] + 60, top: peak[1] - 30, opacity: clamp((f - drop - 10) / 6) }}>
        <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 120, color: red, lineHeight: 1, whiteSpace: 'nowrap' }}>{p.dropWord || '↓ 贬值'}</div>
        <Meta d={drop + 14} color={red}>{p.dropMeta || '在强模型面前'}</Meta>
      </div>
      {(p.marks || []).map((m: any, i: number) => { const x = X0 + m.x * (X1 - X0); const d = at(m.at, 10 + i * 10);
        return <div key={i} style={{ position: 'absolute', left: x, top: Y1 + 18, opacity: clamp((f - d) / 6) }}><div style={{ position: 'absolute', left: 0, top: -18 - (Y1 - Y0) * 0.9, width: 1, height: (Y1 - Y0) * 0.9, background: P.line }} /><Meta d={d}>{m.label}</Meta></div>; })}
    </EStage>
  );
};

/** MaskWord — 黑底；左侧逐行升起的句子，右侧一个巨型字，口播画面只出现在这个字的笔画里 */
export const MaskWord: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const big = p.word || '人'; const bd = at(p.wordAt, 20); const k = spring({ frame: f - bd, fps, config: { damping: 26, stiffness: 120 } });
  return (
    <EStage dark chapter={chapter} dur={dur} grid={false}>
      <div style={{ position: 'absolute', right: 40, top: -60, width: 1000, height: 1200, opacity: clamp(k * 1.6), transform: `scale(${1.25 - 0.25 * k})` }}>
        <div style={{ position: 'absolute', inset: 0, filter: 'contrast(1.1) brightness(1.15)' }}><VideoAt video={video} start={start} style={{ objectPosition: '50% 30%' }} /></div>
        <div style={{ position: 'absolute', inset: 0, background: '#0A0A0B', mixBlendMode: 'multiply' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontWeight: 900, fontSize: p.wordSize || 820, lineHeight: 1, color: '#fff' }}>{big}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 330 }}>
        <Meta d={0} color={col}>{p.meta || 'THE CEILING'}</Meta>
        {(p.lines || []).map((l: any, i: number) => { const t = typeof l === 'string' ? { text: l } : l;
          return <Reveal key={i} d={at(t.at, 4 + i * 10)} style={{ marginTop: i ? 0 : 24 }}><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: p.size || 120, lineHeight: 1.12, letterSpacing: '-0.02em', color: t.hi ? col : '#fff', whiteSpace: 'nowrap' }}>{t.text}</div></Reveal>; })}
        <div style={{ marginTop: 40, width: 500 * E((f - bd) / 20), height: 3, background: col }} />
      </div>
    </EStage>
  );
};

(SplitHero as any).selfTrans = true;
export const EDITORIAL_PAGES = { SplitHero, TickerDrop, MaskWord };
