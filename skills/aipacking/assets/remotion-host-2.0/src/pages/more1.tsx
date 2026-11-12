// 语境模板 · 第一组：钩子 / 金句 / 数据 / 情绪 / 反转 / 误区
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage, useT, PageProps } from './full';
import { Glass, Kinetic, Tag, Pill, Stamp, CountUp, Shine } from '../ui';
import { theme, accent, accentText, onColor } from '../lib/theme';
import { pop, prog, glide, clamp, lerp, rnd } from '../lib/anim';
import { fitSize } from '../lib/fit';
const F = theme.font, M = theme.mono;

// HookQuestion — 悬念提问：打字机问题 + 巨大问号脉冲
export const HookQuestion: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps } = useT(start); const col = p.color || 'violet';
  const q: string = p.question || ''; const n = Math.floor(q.length * prog(f, 4, 4 + q.length * 1.6, t => t));
  const pulse = 1 + 0.06 * Math.sin(f / 5);
  return (
    <Stage bg={bg || { variant: 'nebula', a: col, b: 'cyan' }} chapter={chapter} color={col}>
      <div data-probe-skip style={{ position: 'absolute', right: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 620, lineHeight: 1, color: 'transparent', WebkitTextStroke: `4px ${accent(col)}`, opacity: 0.35 * glide(f, fps, 0), transform: `scale(${pulse}) rotate(8deg)` }}>?</div>
      <div style={{ position: 'absolute', left: 130, top: 330, width: 1300 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 24, marginBottom: 24 }}>{p.kicker}</Tag>}
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: p.size || 104, lineHeight: 1.25, color: 'var(--ink)' }}>{q.slice(0, n)}<span style={{ color: accent(col), opacity: f % 16 < 8 ? 1 : 0 }}>▌</span></div>
        {p.sub && <div style={{ marginTop: 36, fontFamily: F, fontSize: 40, color: 'var(--ink-dim)', opacity: prog(f, 4 + q.length * 1.6, 14 + q.length * 1.6) }}>{p.sub}</div>}
      </div>
    </Stage>
  );
};

// HookGlitch — 故障风开场大字
export const HookGlitch: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f } = useT(start); const col = p.color || 'cyan';
  const g = f < 14 ? 1 - f / 14 : (f % 37 < 3 ? 0.6 : 0);
  const r = rnd(Math.floor(f / 2) + 7);
  const slices = Array.from({ length: 8 }).map(() => ({ y: r() * 100, h: 2 + r() * 10, dx: (r() - 0.5) * 120 * g }));
  const T = (c: string, dx: number, op: number) => <div {...(dx !== 0 ? { 'data-probe-skip': true } : {})} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${dx}px)`, color: c, opacity: op, mixBlendMode: 'screen', fontFamily: F, fontWeight: 900, fontSize: fitSize(p.title || '', p.size || 180, 1680, 72), whiteSpace: 'nowrap' }}>{p.title}</div>;
  return (
    <Stage bg={bg || { variant: 'tunnel', a: col, b: 'pink', intensity: .6 }} chapter={chapter} color={col}>
      <AbsoluteFill>
        {T('#ff2d6f', -14 * g - 3, 0.9)}{T('#2de2ff', 14 * g + 3, 0.9)}{T(theme.ink, 0, 1)}
        {slices.map((s, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${s.y}%`, height: `${s.h}%`, background: 'var(--chip-bg)', transform: `translateX(${s.dx}px)`, backdropFilter: g > 0 ? 'hue-rotate(90deg)' : undefined }} />)}
        {p.sub && <div style={{ position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: M, fontSize: 30, letterSpacing: '0.4em', color: accent(col), opacity: prog(f, 12, 22) }}>{p.sub}</div>}
      </AbsoluteFill>
    </Stage>
  );
};

// BigWords — 2~4 个词逐个砸下（配合语音节奏）
export const BigWords: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'gold';
  const words: any[] = p.words || [];
  return (
    <Stage bg={bg || { variant: 'rays', a: col, b: 'pink' }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 6 }}>
        {words.map((w, i) => { const t = at(w.at, 4 + i * 12); const k = pop(f, fps, t, { damping: 11, stiffness: 220 });
          const hi = w.highlight ?? i === words.length - 1;
          return <div key={i} style={{ fontFamily: F, fontWeight: 900, fontSize: w.size || (hi ? 190 : 130), lineHeight: 1.08, opacity: clamp(k * 2), transform: `scale(${lerp(2.2, 1, clamp(k, 0, 1.2))})`, filter: `blur(${(1 - clamp(k)) * 10}px)`,
            color: hi ? 'transparent' : 'var(--ink)', backgroundImage: hi ? `linear-gradient(90deg, ${theme.ink}, ${accent(col)})` : undefined, WebkitBackgroundClip: hi ? 'text' : undefined, textShadow: hi ? undefined : 'var(--title-shadow)' }}>{w.text ?? w}</div>; })}
      </AbsoluteFill>
    </Stage>
  );
};

// HighlightSentence — 一句话，关键词马克笔高亮
export const HighlightSentence: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, at } = useT(start); const col = p.color || 'gold';
  const parts: string[] = String(p.text || '').split(/(\[[^\]]+\])/);
  let hiIdx = 0;
  return (
    <Stage bg={bg || { variant: 'silk', a: 'violet', b: col, intensity: .75 }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 160px' }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 24, marginBottom: 30 }}>{p.kicker}</Tag>}
        <div style={{ maxWidth: 1600, fontFamily: F, fontWeight: 900, fontSize: p.size || 88, lineHeight: 1.45, color: 'var(--ink)', opacity: prog(f, 0, 10) }}>
          {parts.map((s, i) => { if (!s.startsWith('[')) return <span key={i}>{s}</span>; const t0 = at(p.highlightAt?.[hiIdx], 12 + hiIdx * 10); hiIdx++;
            const k = prog(f, t0, t0 + 10);
            return <span key={i} style={{ position: 'relative', whiteSpace: 'nowrap' }}><span style={{ position: 'absolute', left: -8, right: -8, bottom: -2, height: '104%', background: accent(col), opacity: 0.95, transformOrigin: 'left', transform: `scaleX(${k}) skewX(-8deg)`, borderRadius: 6 }} /><span style={{ position: 'relative', color: k > 0.5 ? '#0b0b14' : 'var(--ink)' }}>{s.slice(1, -1)}</span></span>; })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// BigNumber — 巨大数字 + 单位 + 注释
export const BigNumber: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan';
  const t0 = at(p.at, 6);
  return (
    <Stage bg={bg || { variant: 'aurora', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {p.label && <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: 'var(--ink-dim)', opacity: prog(f, 0, 10), marginBottom: 10 }}>{p.label}</div>}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, transform: `scale(${lerp(0.85, 1, glide(f, fps, t0))})` }}>
          <Shine at={t0 + 26}><CountUp from={p.from ?? 0} to={p.value} start={t0} dur={p.countFrames || 30} decimals={p.decimals || 0} prefix={p.prefix || ''}
            style={{ fontFamily: M, fontWeight: 900, fontSize: p.size || 240, color: 'var(--ink)', textShadow: `0 0 60px ${accent(col)}88`, letterSpacing: '-0.03em' }} /></Shine>
          {p.unit && <span style={{ fontFamily: F, fontWeight: 900, fontSize: 110, color: accent(col) }}>{p.unit}</span>}
        </div>
        {p.caption && <div style={{ marginTop: 20, opacity: prog(f, t0 + 20, t0 + 30) }}><Pill color={col} size={34}>{p.caption}</Pill></div>}
      </AbsoluteFill>
    </Stage>
  );
};

// StatGrid — 3~4 个指标卡同时滚动
export const StatGrid: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const stats: any[] = p.stats || []; const n = stats.length;
  const w = (1700 - (n - 1) * 40) / n;
  return (
    <Stage bg={bg || { variant: 'grid' }} chapter={chapter} color={p.color || 'cyan'}>
      <div style={{ position: 'absolute', left: 110, top: 170 }}><Kinetic text={p.title || ''} size={84} delay={2} /></div>
      {stats.map((s, i) => { const col = s.color || ['cyan', 'violet', 'pink', 'gold'][i % 4]; const t0 = at(s.at, 8 + i * 6); const k = glide(f, fps, t0);
        return <div key={i} style={{ position: 'absolute', left: 110 + i * (w + 40), top: 380, width: w, height: 420, opacity: clamp(k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
          <Glass color={col} style={{ inset: 0 }}>
            <div style={{ padding: 44 }}>
              <Tag color={col} style={{ fontSize: 20 }}>{s.en || `METRIC 0${i + 1}`}</Tag>
              <div style={{ marginTop: 30, fontFamily: M, fontWeight: 900, fontSize: n > 3 ? 110 : 140, color: 'var(--ink)', whiteSpace: 'nowrap' }}><CountUp to={s.value} start={t0} dur={28} decimals={s.decimals || 0} />{s.unit && <span style={{ fontSize: 56, color: accent(col) }}>{s.unit}</span>}</div>
              <div style={{ marginTop: 24, fontFamily: F, fontWeight: 800, fontSize: 40, color: 'var(--ink-dim)' }}>{s.label}</div>
            </div>
          </Glass></div>; })}
    </Stage>
  );
};

// EmotionHit — 情绪爆点（震惊/绝望/狂喜）：大字震屏 + 色彩闪
export const EmotionHit: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps } = useT(start); const col = p.color || 'red';
  const shake = f < 16 ? (1 - f / 16) * 26 : 0; const r = rnd(f + 3);
  const k = pop(f, fps, 0, { damping: 9, stiffness: 260 });
  return (
    <Stage bg={bg || { variant: 'prism', intensity: .7 }} chapter={chapter} color={col} drift={false}>
      <AbsoluteFill style={{ background: accent(col), opacity: f < 6 ? 0.55 * (1 - f / 6) : 0, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translate(${(r() - .5) * shake}px, ${(r() - .5) * shake}px)` }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: fitSize(p.word || '', p.size || 240, 1680, 96), whiteSpace: 'nowrap', color: 'var(--ink)', transform: `scale(${lerp(3, 1, clamp(k, 0, 1.3))})`, textShadow: `0 0 80px ${accent(col)}, 0 0 20px ${accent(col)}` }}>{p.word}</div>
        {p.sub && <div style={{ marginTop: 20, fontFamily: M, fontSize: 32, letterSpacing: '0.4em', color: accent(col), opacity: prog(f, 10, 20) }}>{p.sub}</div>}
      </AbsoluteFill>
    </Stage>
  );
};

// Reversal — 反转/打脸：先出现旧观点，划掉，新观点砸下
export const Reversal: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const t1 = at(p.at, Math.round(dur * 0.45));
  const strike = prog(f, t1 - 8, t1); const k = pop(f, fps, t1 + 2, { damping: 10, stiffness: 200 });
  return (
    <Stage bg={bg || { variant: 'rays', a: 'red', b: 'gold' }} chapter={chapter} color="gold">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', fontFamily: F, fontWeight: 800, fontSize: 90, color: 'var(--ink)', opacity: 1 - strike * 0.6, transform: `translateY(${-strike * 110}px) scale(${1 - strike * 0.3})` }}>
          {p.from}<div style={{ position: 'absolute', left: -20, top: '52%', height: 12, width: `${strike * 108}%`, background: accent('red'), borderRadius: 6, transform: 'rotate(-3deg)' }} />
        </div>
        <div style={{ position: 'absolute', top: 520, fontFamily: F, fontWeight: 900, fontSize: p.size || 150, color: 'var(--ink)', opacity: clamp(k * 2), transform: `scale(${lerp(1.8, 1, clamp(k, 0, 1.2))})`, textShadow: `0 0 60px ${accent('gold')}` }}>{p.to}</div>
      </AbsoluteFill>
    </Stage>
  );
};

// MythFact — 误区 ✗ vs 真相 ✓
export const MythFact: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const t1 = at(p.factAt, Math.round(dur * 0.45));
  const a = glide(f, fps, 2), b = glide(f, fps, t1); const dim = prog(f, t1, t1 + 10);
  const card = (k: number, x: number, col: string, mark: string, label: string, text: string, op: number) => (
    <div style={{ position: 'absolute', left: x, top: 300, width: 800, height: 520, opacity: clamp(k * 2) * op, transform: `translateY(${(1 - k) * 60}px) rotate(${x < 900 ? -2 : 2}deg)` }}>
      <Glass color={col} style={{ inset: 0 }}>
        <div style={{ padding: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}><div style={{ width: 90, height: 90, borderRadius: 45, background: accent(col), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, color: onColor(accent(col)) }}>{mark}</div>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 56, color: accent(col) }}>{label}</div></div>
          <div style={{ marginTop: 50, fontFamily: F, fontWeight: 900, fontSize: 64, lineHeight: 1.3, color: 'var(--ink)' }}>{text}</div>
        </div>
      </Glass></div>);
  return (
    <Stage bg={bg || { variant: 'silk', a: 'red', b: 'green', intensity: .7 }} chapter={chapter} color="green">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center' }}><Kinetic text={p.title || '误区 vs 真相'} size={80} delay={2} style={{ display: 'inline-block' }} /></div>
      {card(a, 110, 'red', '✕', p.mythLabel || '误区', p.myth, 1 - dim * 0.55)}
      {card(b, 1010, 'green', '✓', p.factLabel || '真相', p.fact, 1)}
    </Stage>
  );
};

// Equation — 公式：A + B = C / A × B
export const Equation: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const terms: any[] = p.terms || []; const col = p.color || 'cyan';
  return (
    <Stage bg={bg || { variant: 'nebula', a: col, b: 'violet' }} chapter={chapter} color={col}>
      {p.title && <div style={{ position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center' }}><Kinetic text={p.title} size={72} delay={2} style={{ display: 'inline-block' }} /></div>}
      <AbsoluteFill style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
        {terms.map((t, i) => { const k = pop(f, fps, at(t.at, 6 + i * 8)); const isOp = typeof t === 'string' && /^[+×=÷\-→>]$/.test(t);
          const last = i === terms.length - 1;
          if (isOp || t.op) return <div key={i} style={{ fontFamily: M, fontWeight: 900, fontSize: 130, color: 'var(--ink-dim)', opacity: clamp(k), transform: `scale(${k})` }}>{t.op || t}</div>;
          const c = t.color || (last ? 'gold' : col);
          return <div key={i} style={{ padding: '40px 50px', borderRadius: 32, background: accent(c) + (last ? '33' : '1c'), border: `3px solid ${accent(c)}`, boxShadow: last ? `0 0 70px ${accent(c)}88` : 'none', opacity: clamp(k), transform: `scale(${k}) translateY(${(1 - k) * 30}px)`, textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: t.size || 96, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{t.text}</div>
            {t.en && <div style={{ fontFamily: M, fontSize: 22, letterSpacing: '0.25em', color: accentText(c), marginTop: 6 }}>{t.en}</div>}</div>; })}
      </AbsoluteFill>
    </Stage>
  );
};

// Mystery — 悬念揭晓：模糊→倒计时→清晰
export const Mystery: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const t1 = at(p.revealAt, Math.round(dur * 0.55)); const col = p.color || 'gold';
  const rev = prog(f, t1, t1 + 10); const count = Math.max(1, 3 - Math.floor((f / Math.max(1, t1)) * 3));
  return (
    <Stage bg={bg || { variant: 'tunnel', a: col, b: 'violet', intensity: .6 }} chapter={chapter} color={col}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 56, color: 'var(--ink-dim)', marginBottom: 40 }}>{p.lead || '答案是……'}</div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: p.size || 180, color: 'var(--ink)', filter: `blur(${(1 - rev) * 40}px)`, opacity: 0.3 + 0.7 * rev, transform: `scale(${lerp(0.9, 1, rev)})`, textShadow: `0 0 70px ${accent(col)}` }}>{p.answer}</div>
          {rev < 1 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M, fontWeight: 900, fontSize: 200, color: accent(col), opacity: 1 - rev }}>{count}</div>}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

export const MORE1: Record<string, React.FC<PageProps>> = { HookQuestion, HookGlitch, BigWords, HighlightSentence, BigNumber, StatGrid, EmotionHit, Reversal, MythFact, Equation, Mystery };
