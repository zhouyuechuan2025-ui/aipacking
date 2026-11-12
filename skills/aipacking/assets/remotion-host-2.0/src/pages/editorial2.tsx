// 编辑设计 · 连续镜头版：真人画面缩进版面 / 被推开 / 变成卡片，结束时再放大回全屏；文字跟着口播打出来。
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { accent, onColor, accentText } from '../lib/theme';
import { clamp, rel } from '../lib/anim';
import type { PageProps } from './full';
import { VideoAt } from '../fx/visual';
import { EStage, Reveal, Meta, DISP, MONO } from './editorial';

const INK = '#0A0A0B', PAPER = '#F2F1ED', GRAY = '#5A5A5F', LINE = 'rgba(10,10,11,.14)';
const EIO = (t: number) => { t = clamp(t); return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2; };
const E = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
type Rect = { x: number; y: number; w: number; h: number; r?: number; rot?: number };
const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080, r: 0, rot: 0 };
const mix = (a: Rect, b: Rect, k: number): Rect => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k, r: (a.r || 0) + ((b.r || 0) - (a.r || 0)) * k, rot: (a.rot || 0) + ((b.rot || 0) - (a.rot || 0)) * k });
const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };

/** 真人画面在全屏 ↔ 版面位置之间连续变化；k=0 全屏，k=1 在版面里 */
export const personK = (f: number, dur: number, edges: any, inF = 16, outF = 14) => {
  const kin = edges?.fromPerson ? EIO(f / inF) : 1; const kout = edges?.toPerson ? EIO((dur - f) / outF) : 1; return Math.min(kin, kout);
};
/** 画面层：mode=crop 裁切（放大 1.22 把视频自带字幕推出去）；mode=scale 整体缩小成卡片 */
export const PersonLayer: React.FC<{ video?: string; start: number; rect: Rect; k: number; mode?: 'crop' | 'scale'; shadow?: boolean }> = ({ video, start, rect, k, mode = 'crop', shadow = true }) => {
  const z = mode === 'crop' ? 1 + 0.22 * k : 1;
  return <div style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r, overflow: 'hidden', transform: `rotate(${rect.rot || 0}deg)`, boxShadow: shadow && k > 0.05 ? `0 ${40 * k}px ${100 * k}px rgba(10,10,11,${0.28 * k})` : undefined, zIndex: 5 }}>
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 12%' }}><VideoAt video={video} start={start} /></div>
  </div>;
};
const selfT = (C: any) => { C.selfTrans = true; return C; };

/** PushSplit — 左侧纸面把真人推到右边；大字逐行升起，可带一个大数字 */
export const PushSplit = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const W = p.panel || 860; const panelW = W * k;
  const num = p.number; const nk = num ? E((f - at(num.at, 10)) / (num.frames || 30)) : 0;
  return <AbsoluteFill style={{ background: INK }}>
    <PersonLayer video={video} start={start} rect={{ x: panelW, y: 0, w: 1920 - panelW, h: 1080 }} k={k} shadow={false} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: panelW, height: 1080, overflow: 'hidden', background: PAPER, zIndex: 6 }}>
      <div style={{ position: 'absolute', left: 110, top: 0, width: W - 180, height: 1080 }}>
        <Meta d={4} style={{ position: 'absolute', top: 62 }}>{chapter ? `${String(chapter.index).padStart(2, '0')} / ${String(chapter.total).padStart(2, '0')}   ${chapter.en || ''}` : ''}</Meta>
        <div style={{ position: 'absolute', top: p.y ?? 300 }}>
          {p.meta && <Meta d={at(p.metaAt, 8)} color={col}>{p.meta}</Meta>}
          {num && <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: num.size || 230, lineHeight: 1, letterSpacing: '-0.04em', color: INK, marginTop: 16, fontVariantNumeric: 'tabular-nums', opacity: clamp((f - at(num.at, 10)) / 4) }}>{Math.round((num.from ?? 0) + (num.to - (num.from ?? 0)) * nk)}<span style={{ fontSize: (num.size || 230) * 0.4, color: col }}>{num.unit}</span></div>}
          {(p.lines || []).map((l: any, i: number) => { const t = typeof l === 'string' ? { text: l } : l;
            return <Reveal key={i} d={at(t.at, 12 + i * 8)} style={{ marginTop: i || num ? 4 : 18 }}><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: t.size || p.size || 120, lineHeight: 1.12, letterSpacing: '-0.02em', color: t.hi ? col : INK, whiteSpace: 'nowrap', position: 'relative' }}>{t.text}
              {t.strike && <div style={{ position: 'absolute', left: -6, right: -6, top: '55%', height: 10, background: accent('red'), transformOrigin: 'left', transform: `scaleX(${E((f - at(t.strikeAt, 0)) / 10)})` }} />}</div></Reveal>; })}
          <div style={{ marginTop: 34, width: (W - 220) * E((f - 16) / 24), height: 2, background: INK }} />
          {(p.notes || []).map((n: any, i: number) => <Meta key={i} d={at(n.at, 26 + i * 8)} style={{ marginTop: 16 }}>{n.text}</Meta>)}
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: panelW - 3, top: 0, width: 6, height: 1080, background: col, zIndex: 7, opacity: k > 0.02 ? 1 : 0 }} />
  </AbsoluteFill>;
}) as React.FC<PageProps>));

/** PersonQuote — 真人缩成一张倾斜的「帖子」卡片，左侧引用语按口播逐词砸入 */
export const PersonQuote = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges, 18, 14);
  const card: Rect = { x: 1080, y: 250, w: 720, h: 405, r: 22, rot: -3 };
  const words: any[] = p.words || [];
  return <EStage chapter={chapter} dur={dur + 999}>
    <PersonLayer video={video} start={start} rect={mix(FULL, card, k)} k={k} mode="crop" />
    <div style={{ position: 'absolute', left: card.x + 10, top: card.y + card.h + 34, opacity: clamp((k - 0.8) * 5), transform: 'rotate(-3deg)', zIndex: 6 }}>
      <Meta d={at(p.captionAt, 12)}>{p.caption || '@ 网络热议 · 2026'}</Meta></div>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 900, opacity: clamp((k - 0.5) * 3) }}>
      <Meta d={6} color={col}>{p.meta || 'PUBLIC OPINION'}</Meta>
      <div style={{ marginTop: 20, fontFamily: DISP, fontWeight: 900, fontSize: 60, color: col, lineHeight: 1 }}>“</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 18, rowGap: 0, marginTop: -6 }}>
        {words.map((w, i) => { const d = at(w.at, 10 + i * 6); const s = spring({ frame: f - d, fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
          return <div key={i} style={{ fontFamily: DISP, fontWeight: 900, fontSize: w.size || 128, lineHeight: 1.15, letterSpacing: '-0.02em', color: w.hi ? col : INK, whiteSpace: 'nowrap', opacity: clamp(s * 3), transform: `translateY(${(1 - s) * 60}px) scale(${1.5 - 0.5 * clamp(s)})`, transformOrigin: '0% 100%' }}>{w.text}</div>; })}
      </div>
    </div>
  </EStage>;
}) as React.FC<PageProps>));

/** Crossover — 两个巨型词沿两条相反的线运动并交叉（此消彼长） */
export const Crossover = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const red = accent('red');
  const k = personK(f, dur, edges); const t = E((f - at(p.moveAt, 4)) / (dur - 14));
  const X0 = 120, X1 = 1800, up = (x: number) => 860 - (x - X0) / (X1 - X0) * 560, dn = (x: number) => 300 + (x - X0) / (X1 - X0) * 560;
  const xh = X0 + (X1 - X0) * t;
  return <EStage chapter={chapter} dur={dur + 999}>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={X0} y1={up(X0)} x2={xh} y2={up(xh)} stroke={col} strokeWidth={5} />
      <line x1={X0} y1={dn(X0)} x2={xh} y2={dn(xh)} stroke={red} strokeWidth={5} />
      {t > 0.5 && <g opacity={clamp((t - 0.5) * 8)}><circle cx={(X0 + X1) / 2} cy={580} r={16} fill={INK} /><circle cx={(X0 + X1) / 2} cy={580} r={16 + ((f % 24) / 24) * 40} fill="none" stroke={INK} opacity={1 - (f % 24) / 24} /></g>}
    </svg>
    <div style={{ position: 'absolute', left: xh, top: up(xh), transform: 'translate(-100%, -120%)', whiteSpace: 'nowrap', textAlign: 'right' }}>
      <Meta d={4} color={col}>{p.upMeta || 'MODEL ↑'}</Meta><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 110, color: col, lineHeight: 1.05 }}>{p.up || '模型能力'}</div></div>
    <div style={{ position: 'absolute', left: xh, top: dn(xh), transform: 'translate(-100%, 20%)', whiteSpace: 'nowrap', textAlign: 'right' }}>
      <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 110, color: red, lineHeight: 1.05 }}>{p.down || '工具操作'}</div><Meta d={4} color={accentText('red')}>{p.downMeta || 'SKILL ↓'}</Meta></div>
    {p.cross && <div style={{ position: 'absolute', left: 1000, top: 610, opacity: clamp((t - 0.55) * 6) }}><Meta d={at(p.crossAt, 40)}>{p.cross}</Meta></div>}
    <Meta d={10} style={{ position: 'absolute', left: 120, bottom: 70 }}>示意 · ILLUSTRATIVE</Meta>
    {k < 1 && <PersonLayer video={video} start={start} rect={mix(FULL, { x: 1920, y: 0, w: 1920, h: 1080 }, k)} k={0} shadow={false} />}
  </EStage>;
}) as React.FC<PageProps>));

/** BlindTest — 两个画面并排，扫描线比对，最后大字横着砸过两个画面 */
export const BlindTest = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const A: Rect = { x: 120, y: 300, w: 820, h: 461, r: 18 }, B: Rect = { x: 980, y: 300, w: 820, h: 461, r: 18 };
  const bk = E((f - 8) / 16); const rev = at(p.revealAt, Math.round(dur * 0.6)); const s = spring({ frame: f - rev, fps, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  const scan = ((f * 14) % 1680);
  return <EStage chapter={chapter} dur={dur + 999}>
    <div style={{ position: 'absolute', left: B.x, top: B.y, width: B.w, height: B.h, borderRadius: 18, overflow: 'hidden', transform: `translateX(${(1 - bk) * 1000}px)`, boxShadow: '0 40px 100px rgba(10,10,11,.28)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.22)', transformOrigin: '50% 12%' }}><VideoAt video={video} start={start + 6} /></div></div>
    <PersonLayer video={video} start={start} rect={mix(FULL, A, k)} k={k} mode="crop" />
    {[['A', p.a || 'AI 生成', A], ['B', p.b || '专业动效师', B]].map(([l, t, R]: any, i) => <div key={i} style={{ position: 'absolute', left: R.x, top: R.y - 54, display: 'flex', gap: 18, alignItems: 'baseline', opacity: clamp((k - 0.7) * 4) }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: '#fff', background: INK, padding: '4px 12px' }}>{l}</div><Meta d={14 + i * 4}>{t}</Meta></div>)}
    <div style={{ position: 'absolute', left: 120 + scan, top: 290, width: 3, height: 480, background: col, boxShadow: `0 0 24px ${col}`, opacity: f < rev ? clamp((k - 0.8) * 5) : 0, zIndex: 8 }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', zIndex: 9, opacity: clamp(s * 3), transform: `scale(${1.6 - 0.6 * clamp(s)})` }}>
      <div style={{ background: col, color: onColor(col), fontFamily: DISP, fontWeight: 900, fontSize: 150, lineHeight: 1, padding: '18px 44px', letterSpacing: '-0.02em', transform: 'rotate(-2deg)' }}>{p.verdict || '分不清'}</div></div>
    <Meta d={at(p.metaAt, 20)} style={{ position: 'absolute', left: 120, top: 820 }}>{p.meta || 'BLIND TEST · 盲测'}</Meta>
  </EStage>;
}) as React.FC<PageProps>));

/** Diverge — 两条线从同一点出发、越拉越开；真人缩成右上角的小窗保持在场 */
export const Diverge = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const pip: Rect = { x: 120, y: 700, w: 400, h: 225, r: 14 };
  const t = E((f - at(p.drawAt, 10)) / Math.max(10, at(p.spreadAt, dur * 0.7) - at(p.drawAt, 10))); const spread = E((f - at(p.spreadAt, dur * 0.7)) / 20);
  const X0 = 640, X1 = 1700, Y = 700; const xh = X0 + (X1 - X0) * t;
  const yu = (x: number) => Y - Math.pow((x - X0) / (X1 - X0), 1.8) * (220 + 200 * spread); const yd = (x: number) => Y + ((x - X0) / (X1 - X0)) * (60 + 40 * spread);
  const pts = (fn: (x: number) => number) => Array.from({ length: 40 }).map((_, i) => { const x = X0 + (xh - X0) * (i / 39); return `${x},${fn(x)}`; }).join(' ');
  const note = spring({ frame: f - at(p.noteAt, dur * 0.75), fps, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  return <EStage chapter={chapter} dur={dur + 999}>
    <div style={{ position: 'absolute', left: 120, top: 170, opacity: clamp((k - 0.5) * 3) }}><Meta d={6} color={col}>{p.meta || 'GAP'}</Meta>
      <Reveal d={at(p.titleAt, 8)}><div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 96, color: INK, lineHeight: 1.15 }}>{p.title}</div></Reveal></div>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <polyline points={pts(yu)} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" />
      <polyline points={pts(yd)} fill="none" stroke={GRAY} strokeWidth={7} strokeLinecap="round" />
      <circle cx={X0} cy={Y} r={12} fill={INK} />
      {spread > 0 && <g opacity={spread}><line x1={xh + 30} x2={xh + 30} y1={yu(xh)} y2={yd(xh)} stroke={INK} strokeWidth={2} /><line x1={xh + 20} x2={xh + 40} y1={yu(xh)} y2={yu(xh)} stroke={INK} strokeWidth={2} /><line x1={xh + 20} x2={xh + 40} y1={yd(xh)} y2={yd(xh)} stroke={INK} strokeWidth={2} /></g>}
    </svg>
    <div style={{ position: 'absolute', left: xh - 20, top: yu(xh) - 70, transform: 'translateX(-100%)', whiteSpace: 'nowrap', fontFamily: DISP, fontWeight: 800, fontSize: 40, color: col, opacity: clamp(t * 3) }}>{p.upLabel || '会用 AI 的人'}</div>
    <div style={{ position: 'absolute', left: xh - 20, top: yd(xh) + 20, transform: 'translateX(-100%)', whiteSpace: 'nowrap', fontFamily: DISP, fontWeight: 800, fontSize: 40, color: GRAY, opacity: clamp(t * 3) }}>{p.downLabel || '普通使用者'}</div>
    {p.note && <div style={{ position: 'absolute', left: 1090, top: 520, zIndex: 9, opacity: clamp(note * 3), transform: `scale(${1.5 - 0.5 * clamp(note)}) rotate(-2deg)`, transformOrigin: '0 50%' }}>
      <div style={{ background: INK, color: '#fff', fontFamily: DISP, fontWeight: 900, fontSize: 72, padding: '10px 28px', whiteSpace: 'nowrap' }}>{p.note}</div></div>}
    <Meta d={10} style={{ position: 'absolute', left: 120, bottom: 70 }}>示意 · ILLUSTRATIVE</Meta>
    <PersonLayer video={video} start={start} rect={mix(FULL, pip, k)} k={k} mode="crop" />
  </EStage>;
}) as React.FC<PageProps>));

export const EDITORIAL2_PAGES = { PushSplit, PersonQuote, Crossover, BlindTest, Diverge };
