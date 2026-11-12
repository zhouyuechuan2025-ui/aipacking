// 编辑设计 · 连续镜头版 第二批（29s 之后的镜头）
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rel } from '../lib/anim';
import { fitSize, fitLines, textEm } from '../lib/fit';
import type { PageProps } from './full';
import type { OverlayProps } from './overlay';
import { VideoAt } from '../fx/visual';
import { EStage, Reveal, Meta, DISP, MONO } from './editorial';
import { personK, PersonLayer } from './editorial2';

const INK = '#0A0A0B', PAPER = '#F2F1ED', GRAY = '#5A5A5F', LINE = 'rgba(10,10,11,.14)';
const E = (t: number) => 1 - Math.pow(1 - clamp(t), 4);
const EIO = (t: number) => { t = clamp(t); return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2; };
type Rect = { x: number; y: number; w: number; h: number; r?: number; rot?: number };
const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080, r: 0, rot: 0 };
const mix = (a: Rect, b: Rect, k: number): Rect => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k, r: (a.r || 0) + ((b.r || 0) - (a.r || 0)) * k, rot: (a.rot || 0) + ((b.rot || 0) - (a.rot || 0)) * k });
const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };
const selfT = (C: any) => { C.selfTrans = true; return C; };
const outK = (f: number, dur: number, edges: any) => edges?.toPerson ? EIO((dur - f) / 14) : 1;
const slam = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 120, color = INK, style }) =>
  <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: '-0.02em', color, whiteSpace: 'nowrap', ...style }}>{children}</div>;

/** PromptResult — 顶部一条大输入框打字 → 回车 → 真人画面落进下方「结果」位 */
export const PromptResult = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const k = personK(f, dur, edges, 18, 14); const card: Rect = { x: 960, y: 380, w: 840, h: 473, r: 16 };
  const enter = at(p.enterAt, 40); const typed = Array.from(p.prompt || ''); const n = Math.floor(clamp((f - 6) / Math.max(1, enter - 12)) * typed.length);
  const land = E((f - enter) / 16);
  const rect = f < enter ? mix(FULL, { ...card, y: card.y + 700 }, k) : mix({ ...card, y: card.y + 700 }, card, land);
  return <EStage chapter={chapter} dur={dur + 999}>
    <div style={{ position: 'absolute', left: 120, top: 180, width: 1680, height: 120, borderBottom: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: clamp((k - 0.4) * 3) }}>
      <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 64, color: INK, whiteSpace: 'nowrap' }}>{typed.slice(0, n).join('')}<span style={{ display: 'inline-block', width: 5, height: 64, marginLeft: 6, verticalAlign: -8, background: col, opacity: Math.floor(f / 10) % 2 || f < enter ? 1 : 0 }} /></div>
      <div style={{ fontFamily: MONO, fontSize: 22, color: f >= enter ? '#fff' : INK, background: f >= enter ? col : 'transparent', border: `2px solid ${f >= enter ? col : INK}`, padding: '8px 18px' }}>↵ ENTER</div>
    </div>
    <Meta d={4} style={{ position: 'absolute', left: 120, top: 150 }}>{p.meta || 'PROMPT'}</Meta>
    <div style={{ position: 'absolute', left: 120, top: 420, opacity: clamp((f - enter) / 6) }}>
      <Meta d={enter} color={col}>{p.resultMeta || 'OUTPUT'}</Meta>
      <Reveal d={enter + 4}><Big size={110}>{p.result || '基础成片'}</Big></Reveal>
      <Reveal d={enter + 10}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 40, color: GRAY, marginTop: 10 }}>{p.resultSub || '人人都能做到'}</div></Reveal>
    </div>
    <PersonLayer video={video} start={start} rect={f < enter ? rect : mix(FULL, rect, outK(f, dur, edges))} k={f < enter ? k : outK(f, dur, edges)} />
  </EStage>;
}) as React.FC<PageProps>));

/** InputTriptych — 先划掉旧观点，再三栏落下：参考（真人画面）/ 素材（拼图）/ 指令（打字） */
export const InputTriptych = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const cols = p.cols || [{ t: '参考' }, { t: '素材' }, { t: '指令' }]; const X = [120, 700, 1280], W = 520, Y = 330, H = 560;
  const sAt = at(p.strikeAt, 20); const ts = cols.map((c: any, i: number) => at(c.at, 40 + i * 12));
  const colK = (i: number) => E((f - ts[i]) / 14);
  const refRect: Rect = { x: X[0], y: Y + 90, w: W, h: H - 90, r: 0 };
  return <EStage chapter={chapter} dur={dur + 999}>
    <div style={{ position: 'absolute', left: 120, top: 160, opacity: clamp((k - 0.5) * 3) }}>
      <div style={{ position: 'relative', display: 'inline-block' }}><Big size={fitSize(p.old || '会不会操作软件', 72, 1680, 40)} color={f > sAt ? GRAY : INK}>{p.old || '会不会操作软件'}</Big>
        <div style={{ position: 'absolute', left: -8, right: -8, top: '55%', height: 8, background: accent('red'), transformOrigin: 'left', transform: `scaleX(${E((f - sAt) / 10)})` }} /></div>
    </div>
    {cols.map((c: any, i: number) => <div key={i} style={{ position: 'absolute', left: X[i], top: Y, width: W, height: H, clipPath: `inset(0 0 ${(1 - colK(i)) * 100}% 0)`, borderTop: `3px solid ${INK}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 90 }}><Big size={fitSize(c.t, 64, W - 90, 32)}>{c.t}</Big><Meta d={ts[i] + 4}>{`0${i + 1}`}</Meta></div>
      {i === 1 && <div style={{ position: 'absolute', left: 0, right: 0, top: 90, bottom: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
        {(c.ats || [5, 33, 50, 62]).map((t: number, j: number) => <div key={j} style={{ overflow: 'hidden', position: 'relative' }}><div style={{ position: 'absolute', inset: 0, transform: 'scale(1.22)', transformOrigin: '50% 12%' }}><VideoAt video={video} at={t} /></div></div>)}</div>}
      {i === 2 && <div style={{ position: 'absolute', left: 0, right: 0, top: 90, bottom: 0, background: INK, padding: '30px 30px', fontFamily: MONO, fontSize: 26, lineHeight: 1.7, color: '#EDEDED' }}>
        {(c.lines || []).map((l: string, j: number) => { const d = ts[i] + 10 + j * 8; const n = Math.floor(clamp((f - d) / 10) * l.length);
          return <div key={j} style={{ whiteSpace: 'nowrap' }}><span style={{ color: col }}>› </span>{l.slice(0, n)}</div>; })}</div>}
      <Meta d={ts[i] + 8} style={{ position: 'absolute', left: 0, bottom: -40 }}>{c.sub || ''}</Meta>
    </div>)}
    <PersonLayer video={video} start={start} rect={f < ts[0] ? mix(FULL, { ...refRect, y: refRect.y + 800 }, k) : mix(FULL, mix({ ...refRect, y: refRect.y + 800 }, refRect, E((f - ts[0]) / 14)), outK(f, dur, edges))} k={f < ts[0] ? k : outK(f, dur, edges)} shadow={false} />
  </EStage>;
}) as React.FC<PageProps>));

/** IntoBox — 几个巨型词沿线条送进一个黑盒子「AI」，盒子吐出结果 */
export const IntoBox = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const ins: any[] = p.inputs || []; const ts = ins.map((x, i) => at(x.at, 8 + i * 12)); const outAt = at(p.outAt, dur * 0.7);
  const BX = 940, BY = 380, BS = 320;
  return <EStage chapter={chapter} dur={dur + 999}>
    <Meta d={4} style={{ position: 'absolute', left: 120, top: 160 }} color={col}>{p.meta || 'INPUT → AI → OUTPUT'}</Meta>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      {ins.map((x, i) => { const y = 330 + i * 190 + 60; const kk = E((f - ts[i] - 6) / 14); return <g key={i}>
        <line x1={640} y1={y} x2={640 + (BX - 640) * kk} y2={y + (BY + BS / 2 - y) * kk} stroke={INK} strokeWidth={2} />
        {kk >= 1 && <circle r={8} fill={col} cx={640 + (BX - 640) * ((f * 0.04 + i * 0.3) % 1)} cy={y + (BY + BS / 2 - y) * ((f * 0.04 + i * 0.3) % 1)} />}</g>; })}
      <line x1={BX + BS} y1={BY + BS / 2} x2={BX + BS + 180 * E((f - outAt) / 10)} y2={BY + BS / 2} stroke={col} strokeWidth={4} />
    </svg>
    {ins.map((x, i) => { const s = slam(f, fps, ts[i]); return <div key={i} style={{ position: 'absolute', left: 120, top: 330 + i * 190, opacity: clamp(s * 3), transform: `translateX(${(1 - clamp(s)) * -80}px)` }}>
      <Meta d={ts[i]}>{`INPUT 0${i + 1}`}</Meta><Big size={fitSize(x.t, 96, 480, 40)}>{x.t}</Big></div>; })}
    <div style={{ position: 'absolute', left: BX, top: BY, width: BS, height: BS, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.9 + 0.1 * E(f / 12) + (f > ts[ts.length - 1] ? 0.03 * Math.sin(f / 3) : 0)})` }}>
      <Big size={fitSize(p.box || 'AI', 130, BS - 60, 48)} color="#fff">{p.box || 'AI'}</Big></div>
    <div style={{ position: 'absolute', left: BX + BS + 200, top: BY + BS / 2 - 70, opacity: clamp((f - outAt - 6) / 6) }}>
      <Meta d={outAt + 6} color={col}>OUTPUT</Meta><Big size={fitSize(p.out || '好作品', 96, 1920 - (BX + BS + 200) - 120, 40)} color={col}>{p.out || '好作品'}</Big></div>
    {/* 结果文字在黑盒右侧，可用宽度只有约 340px：放不下就缩字 */}
    {k < 1 && <PersonLayer video={video} start={start} rect={mix(FULL, { x: -1920, y: 0, w: 1920, h: 1080 }, k)} k={0} shadow={false} />}
  </EStage>;
}) as React.FC<PageProps>));

/** TickRows — 一张大号核对表：条目逐行出现，右侧 ✓ / ✕ 盖章，最后结论 */
export const TickRows: React.FC<PageProps> = ({ p, start, dur, chapter }) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const red = accent('red');
  const rows: any[] = p.rows || [];
  return <EStage chapter={chapter} dur={dur}>
    <div style={{ position: 'absolute', left: 120, top: 150 }}><Meta d={2} color={col}>{p.meta || 'PROFILE CHECK'}</Meta><Reveal d={4}><Big size={80}>{p.title}</Big></Reveal></div>
    {rows.map((r, i) => { const d = at(r.at, 12 + i * 12); const y = 380 + i * 170; const s = slam(f, fps, d + 10); const no = r.state === 'no';
      return <div key={i} style={{ position: 'absolute', left: 120, top: y, width: 1680, height: 150, borderTop: `2px solid ${INK}`, opacity: clamp((f - d) / 5) }}>
        <Meta d={d} style={{ position: 'absolute', left: 0, top: 18 }}>{`0${i + 1}`}</Meta>
        <div style={{ position: 'absolute', left: 120, top: 24 }}><Reveal d={d}><Big size={88} color={no ? red : INK}>{r.text}</Big></Reveal></div>
        <div style={{ position: 'absolute', right: 0, top: 22, fontFamily: DISP, fontWeight: 900, fontSize: 96, color: no ? red : INK, opacity: clamp(s * 3), transform: `scale(${1.8 - 0.8 * clamp(s)}) rotate(${no ? -6 : 0}deg)` }}>{r.mark || (no ? '未必' : '✓')}</div>
      </div>; })}
  </EStage>;
};

/** Amplify — 左边四个能力词逐个出现；右边真人卡片在关键词时被「放大」 */
export const Amplify = selfT(((({ p, start, dur, chapter, video, edges }: any) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue'); const k = personK(f, dur, edges);
  const words: any[] = p.words || []; const amp = at(p.ampAt, dur * 0.6); const ak = spring({ frame: f - amp, fps, config: { damping: 16, stiffness: 120 } });
  const small: Rect = { x: 1240, y: 520, w: 480, h: 270, r: 12 }, large: Rect = { x: 900, y: 170, w: 900, h: 506, r: 16 };
  const rect = f < amp ? mix(FULL, small, k) : mix(small, large, clamp(ak));
  return <EStage chapter={chapter} dur={dur + 999}>
    <div style={{ position: 'absolute', left: 120, top: 170 }}><Meta d={2} color={col}>{p.meta || 'CREATOR'}</Meta></div>
    {words.map((w, i) => { const d = at(w.at, 8 + i * 10); const s = slam(f, fps, d); const x = 120, y = 230 + i * 150;
      return <div key={i} style={{ position: 'absolute', left: x, top: y, opacity: clamp(s * 3) * (f > amp ? 0.35 + 0.65 * (1 - clamp(ak)) : 1), transform: `translateY(${(1 - clamp(s)) * 40}px)`, display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Meta d={d}>{`0${i + 1}`}</Meta><Big size={110}>{w.t}</Big></div>; })}
    <div style={{ position: 'absolute', left: large.x, top: large.y + large.h + 30, opacity: clamp((f - amp - 8) / 6) }}>
      <Meta d={amp + 6} color={col}>{p.ampMeta || 'VALUE ×'}</Meta><Big size={96} color={INK}>{p.ampText || 'AI 的价值，彻底放大'}</Big></div>
    <div style={{ position: 'absolute', left: rect.x - 46, top: rect.y - 46, fontFamily: DISP, fontWeight: 900, fontSize: 90, color: col, lineHeight: 1, opacity: clamp((f - amp) / 6), zIndex: 9 }}>×</div>
    <PersonLayer video={video} start={start} rect={f < amp ? rect : mix(FULL, rect, outK(f, dur, edges))} k={f < amp ? k : outK(f, dur, edges)} />
  </EStage>;
}) as React.FC<PageProps>));

/** ScaleSwap — 两个词比大小：前者缩小变灰，后者放大变色（此消彼长的排版版本） */
export const ScaleSwap: React.FC<PageProps> = ({ p, start, dur, chapter }) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const a = at(p.aAt, 6), b = at(p.bAt, dur * 0.5); const sw = spring({ frame: f - b, fps, config: { damping: 18, stiffness: 110 } });
  // 放不下就自动缩字（可用宽度 1680px）；A 从大缩到一半，B 从一半放大到满
  const A0 = fitSize(p.a, 180, 1680), B1 = fitSize(p.b, 200, 1680);
  const sa = A0 * (1 - 0.5 * clamp(sw)), sb = B1 * (0.45 + 0.55 * clamp(sw));
  return <EStage chapter={chapter} dur={dur}>
    <div style={{ position: 'absolute', left: 120, top: 150 }}><Meta d={2} color={col}>{p.meta || 'WHAT MATTERS'}</Meta><Reveal d={4}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 44, color: GRAY }}>{p.q}</div></Reveal></div>
    <div style={{ position: 'absolute', left: 120, top: 330, opacity: clamp((f - a) / 6) }}>
      <div style={{ position: 'relative', display: 'inline-block' }}><Big size={sa} color={f > b ? GRAY : INK}>{p.a}</Big>
        <div style={{ position: 'absolute', left: -6, right: -6, top: '55%', height: 8 + 6 * clamp(sw), background: accent('red'), transformOrigin: 'left', transform: `scaleX(${E((f - b) / 12)})` }} /></div>
      <Meta d={a + 6}>{p.aMeta || '不在'}</Meta></div>
    <div style={{ position: 'absolute', left: 120, top: 330 + sa * 1.25 + 40, opacity: clamp((f - b) / 4) }}>
      <Meta d={b} color={col}>{p.bMeta || '而在'}</Meta><Big size={sb} color={col}>{p.b}</Big></div>
  </EStage>;
};

/** PanSteps — 横向镜头平移：巨型步骤词一个接一个从右边滑进来，箭头连接 */
export const PanSteps: React.FC<PageProps> = ({ p, start, dur, chapter }) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const steps: any[] = p.steps || []; const ts = steps.map((s, i) => at(s.at, 10 + i * 14));
  // 每步按实际字宽排位：字 + 箭头 + 留白，长词不会压到下一步
  const SZ = steps.map(s => fitSize(s.t, 200, 1500, 100)); const W = steps.map((s, i) => textEm(s.t) * SZ[i]);
  const X: number[] = []; steps.forEach((_, i) => X.push(i === 0 ? 120 : X[i - 1] + Math.max(760, W[i - 1] + 300)));
  let cam = 0; ts.forEach((t, i) => { if (i > 0) cam += (X[i] - X[i - 1]) * EIO((f - t) / 16); });
  return <EStage chapter={chapter} dur={dur}>
    <div style={{ position: 'absolute', left: 120, top: 160 }}><Meta d={2} color={col}>{p.meta || 'ROADMAP'}</Meta><Reveal d={4}><Big size={72}>{p.title}</Big></Reveal></div>
    <div style={{ position: 'absolute', left: 0, top: 500, transform: `translateX(${-cam}px)` }}>
      {steps.map((s, i) => { const on = f >= ts[i]; return <div key={i} style={{ position: 'absolute', left: X[i], top: 0, opacity: on ? 1 : 0.15 }}>
        <Meta d={ts[i]}>{`STEP 0${i + 1}`}</Meta><Big size={SZ[i]} color={i === steps.length - 1 && on ? col : INK}>{s.t}</Big>
        {i < steps.length - 1 && <div data-probe-decor style={{ position: 'absolute', left: (X[i + 1] - X[i]) - 220, top: 150, fontFamily: DISP, fontWeight: 300, fontSize: 140, color: GRAY }}>→</div>}</div>; })}
    </div>
  </EStage>;
};

/** Equation — 流量 + 商业 → AI = 价值：一条算式按节拍出现 */
export const Equation: React.FC<PageProps> = ({ p, start, dur, chapter }) => {
  const { f, fps, at } = useR(start); const col = accent(p.color || 'blue');
  const terms: any[] = p.terms || []; const ts = terms.map((t, i) => at(t.at, 6 + i * 8));
  // 整条算式固定一行：总宽超过 1680px 就所有项等比缩小
  const isOp = (t: any) => /^[+→=×]$/.test(t.t); const base = (t: any) => isOp(t) ? 96 : t.size || 130;
  const total = terms.reduce((w, t) => w + textEm(t.t) * base(t) + (t.box ? 48 : 0), 0) + 36 * Math.max(0, terms.length - 1);
  const k = Math.min(1, 1680 / Math.max(1, total));
  return <EStage chapter={chapter} dur={dur}>
    <div style={{ position: 'absolute', left: 120, top: 170 }}><Meta d={2} color={col}>{p.meta || 'FORMULA'}</Meta></div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 380, display: 'flex', alignItems: 'flex-end', gap: 36 * k, flexWrap: 'nowrap' }}>
      {terms.map((t, i) => { const s = slam(f, fps, ts[i]); const op = /^[+→=×]$/.test(t.t);
        return <div key={i} style={{ opacity: clamp(s * 3), transform: `translateY(${(1 - clamp(s)) * 50}px)` }}>
          {!op && <Meta d={ts[i]}>{t.m || ''}</Meta>}
          <Big size={Math.round(base(t) * k)} color={op ? GRAY : t.hi ? col : INK} style={{ fontWeight: op ? 300 : 900, ...(t.box ? { background: INK, color: '#fff', padding: '0 24px' } : {}) }}>{t.t}</Big></div>; })}
    </div>
    {p.foot && <Reveal d={at(p.footAt, 40)} style={{ position: 'absolute', left: 120, top: 700 }}><div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 44, color: GRAY }}>{p.foot}</div></Reveal>}
  </EStage>;
};

/** FollowBar — 结尾关注条（叠在真人画面上）：纸白条从左推出，按钮被点一下 */
export const FollowBar: React.FC<OverlayProps> = ({ p, start, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const col = accent(p.color || 'blue');
  const k = E(f / 14) * interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); const tap = rel(p.tapAt, start, fps, 50); const done = f >= tap;
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, top: 120, height: 150, width: 820 * k, background: PAPER, overflow: 'hidden', borderRight: `6px solid ${col}` }}>
      <div style={{ position: 'absolute', left: 120, top: 26, width: 660 }}>
        <Meta d={6}>{p.meta || 'FOLLOW'}</Meta>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Big size={60}>{p.name}</Big>
          <div style={{ fontFamily: MONO, fontSize: 24, padding: '10px 22px', background: done ? INK : col, color: '#fff', transform: `scale(${f >= tap - 3 && f < tap + 3 ? 0.9 : 1})` }}>{done ? '✓ 已关注' : '+ 关注'}</div>
        </div>
        <Meta d={14} style={{ marginTop: 6 }}>{p.sub || ''}</Meta>
      </div>
    </div>
  </AbsoluteFill>;
};

export const EDITORIAL3_PAGES = { PromptResult, InputTriptych, IntoBox, TickRows, Amplify, ScaleSwap, PanSteps, Equation };
export const EDITORIAL3_OVERLAYS = { FollowBar };
