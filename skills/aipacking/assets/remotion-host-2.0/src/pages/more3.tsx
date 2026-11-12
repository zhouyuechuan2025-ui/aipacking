// 语境模板 · 第三组：身份 / 产品工具 / 案例素材 / 画中画 / 结尾
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Stage, useT, PageProps } from './full';
import { Glass, Kinetic, Tag, Pill, CountUp, Shine } from '../ui';
import { LightField } from '../bg/LightField';
import { theme, accent, onColor, accentText } from '../lib/theme';
import { pop, prog, glide, clamp, lerp } from '../lib/anim';
import { fitSize } from '../lib/fit';
const F = theme.font, M = theme.mono;
const COLS = ['cyan', 'violet', 'pink', 'gold', 'green'];

const Media: React.FC<{ src?: string; video?: string; start?: number; fit?: 'cover' | 'contain' }> = ({ src, video, start = 0, fit = 'cover' }) => {
  const { fps } = useVideoConfig();
  if (src === 'self' && !video) return <LightField variant="prism" />;
  if (src === 'self' && video) return <OffthreadVideo src={staticFile(video)} muted startFrom={Math.round(start * fps)} style={{ width: '100%', height: '100%', objectFit: fit }} />;
  if (src && /\.(mp4|mov|webm|m4v)$/i.test(src)) return <OffthreadVideo src={staticFile(src)} muted style={{ width: '100%', height: '100%', objectFit: fit }} />;
  if (src) return <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: fit }} />;
  return <LightField variant="prism" />;
};

// ProfileCard — 身份/资历卡（我是谁、为什么值得听）
export const ProfileCard: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const k = glide(f, fps, 0);
  return (
    <Stage bg={bg || { variant: 'rays', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 150, top: 230, width: 560, height: 620, borderRadius: 40, overflow: 'hidden', transform: `perspective(1400px) rotateY(${(1 - k) * 30 + 8}deg)`, opacity: clamp(k * 2), boxShadow: `0 0 90px ${accent(col)}44`, border: `2px solid ${accent(col)}88` }}>
        <Media src={p.photo || 'self'} video={video} start={start} />
      </div>
      <div style={{ position: 'absolute', left: 820, top: 250 }}>
        <Tag color={col} style={{ fontSize: 24 }}>{p.kicker || 'WHO AM I'}</Tag>
        <Kinetic text={p.name || ''} size={130} delay={4} style={{ marginTop: 10 }} />
        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(p.creds || []).map((c: any, i: number) => { const kk = pop(f, fps, at(c.at, 12 + i * 8));
            return <div key={i} style={{ opacity: clamp(kk), transform: `translateX(${(1 - kk) * 40}px)` }}><Pill color={c.color || COLS[i % 5]} size={36}>{c.icon ? c.icon + ' ' : ''}{c.text ?? c}</Pill></div>; })}
        </div>
      </div>
    </Stage>
  );
};

// PhoneMockup — 手机样机（短视频 / App / 截图）
export const PhoneMockup: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'pink'; const k = glide(f, fps, 0);
  const float = Math.sin(f / 22) * 10;
  return (
    <Stage bg={bg || { variant: 'aurora', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: p.side === 'left' ? 1080 : 200, top: 300, width: 660 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 24 }}>{p.kicker}</Tag>}
        {(p.titleLines || [p.title]).map((t: string, i: number) => <Kinetic key={i} text={t || ''} size={100} delay={6 + i * 6} color={i === 1 ? accent(col) : theme.ink} style={{ marginTop: 8 }} />)}
        {(p.bullets || []).map((b: any, i: number) => { const kk = pop(f, fps, at(b.at, 20 + i * 8)); return <div key={i} style={{ marginTop: 22, opacity: clamp(kk), fontFamily: F, fontWeight: 700, fontSize: 38, color: 'var(--ink-dim)' }}>— {b.text ?? b}</div>; })}
      </div>
      <div style={{ position: 'absolute', left: p.side === 'left' ? 330 : 1150, top: 110 + float, width: 440, height: 880, transform: `perspective(1600px) rotateY(${(1 - k) * 40 + (p.side === 'left' ? 10 : -10)}deg)`, opacity: clamp(k * 2) }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 64, background: '#0b0c12', border: '3px solid var(--chip-border)', boxShadow: `0 40px 120px rgba(0,0,0,.6), 0 0 80px ${accent(col)}44` }} />
        <div style={{ position: 'absolute', inset: 16, borderRadius: 50, overflow: 'hidden', background: '#000' }}><Media src={p.media} video={video} start={start} /></div>
        <div style={{ position: 'absolute', left: '50%', top: 30, width: 130, height: 34, marginLeft: -65, borderRadius: 20, background: '#000' }} />
      </div>
    </Stage>
  );
};

// ChatThread — AI 对话气泡
export const ChatThread: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const msgs: any[] = p.messages || [];
  return (
    <Stage bg={bg || { variant: 'silk', a: 'violet', b: 'cyan', intensity: .7 }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 110, top: 160 }}>{p.kicker && <Tag style={{ fontSize: 22 }}>{p.kicker}</Tag>}<Kinetic text={p.title || ''} size={76} delay={2} /></div>
      <div style={{ position: 'absolute', left: 360, right: 360, top: 330, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {msgs.map((m, i) => { const t0 = at(m.at, 8 + i * 22); const k = pop(f, fps, t0); if (f < t0) return null; const me = m.from !== 'ai';
          const txt: string = m.text; const n = me ? txt.length : Math.floor(txt.length * prog(f, t0 + 6, t0 + 6 + txt.length * 0.9, t => t));
          return <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 1000, opacity: clamp(k), transform: `translateY(${(1 - k) * 30}px) scale(${0.9 + 0.1 * clamp(k)})`, display: 'flex', gap: 20, flexDirection: me ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, flexShrink: 0, background: me ? accent('pink') : `linear-gradient(135deg, ${accent('cyan')}, ${accent('violet')})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 28, color: me ? onColor(accent('pink')) : onColor([accent('cyan'), accent('violet')]) }}>{me ? (p.meLabel || '我') : 'AI'}</div>
            <div style={{ padding: '24px 34px', borderRadius: 30, borderBottomRightRadius: me ? 6 : 30, borderBottomLeftRadius: me ? 30 : 6, background: me ? accent('pink') : 'var(--chip-solid)', border: me ? 'none' : '1.5px solid var(--chip-border)', fontFamily: F, fontWeight: 700, fontSize: 40, lineHeight: 1.4, color: me ? onColor(accent('pink')) : 'var(--ink)', backdropFilter: 'blur(20px)' }}>
              {txt.slice(0, n)}{!me && n < txt.length ? '▌' : ''}</div></div>; })}
      </div>
    </Stage>
  );
};

// Terminal — 代码/命令行打字
export const Terminal: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const lines: any[] = p.lines || []; const k = glide(f, fps, 0);
  let t = 6;
  return (
    <Stage bg={bg || { variant: 'tunnel', a: 'green', b: 'cyan', intensity: .5 }} chapter={chapter} color="green">
      <div style={{ position: 'absolute', left: 260, top: 200, width: 1400, height: 700, transform: `perspective(1800px) rotateX(${(1 - k) * 20 + 4}deg) scale(${0.9 + 0.1 * k})`, opacity: clamp(k * 2) }}>
        <Glass color="green" style={{ inset: 0 }} solid="#0B120F" radius={22}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 24, borderBottom: '1px solid var(--chip-border)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
            <div style={{ marginLeft: 16, fontFamily: M, fontSize: 18, color: 'var(--ink-dim)' }}>{p.titleBar || 'terminal — zsh'}</div></div>
          <div style={{ padding: '30px 40px', fontFamily: M, fontSize: 42, lineHeight: 1.6 }}>
            {lines.map((l, i) => { const txt: string = l.text ?? l; const isCmd = l.type !== 'out'; const t0 = at(l.at, t); t = t0 + (isCmd ? txt.length * 0.9 + 8 : 6);
              if (f < t0) return null; const n = isCmd ? Math.floor(txt.length * prog(f, t0, t0 + txt.length * 0.9, x => x)) : txt.length;
              return <div key={i} style={{ color: isCmd ? '#e8ffe8' : (l.color ? accentText(l.color, '#0B120F') : '#7dffb0'), whiteSpace: 'pre-wrap' }}>{isCmd ? <span style={{ color: '#28c840' }}>$ </span> : null}{txt.slice(0, n)}{isCmd && n < txt.length && <span style={{ background: '#e8ffe8' }}> </span>}</div>; })}
          </div>
        </Glass></div>
    </Stage>
  );
};

// PromptBox — 巨型输入框：打字→发送→结果
export const PromptBox: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'violet'; const txt: string = p.prompt || '';
  const n = Math.floor(txt.length * prog(f, 6, 6 + txt.length * 1.3, x => x)); const send = at(p.sendAt, 10 + txt.length * 1.3);
  const sent = f >= send; const rk = pop(f, fps, send + 6);
  return (
    <Stage bg={bg || { variant: 'prism', intensity: .55 }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center' }}>{p.kicker && <Tag color={col} style={{ fontSize: 24 }}>{p.kicker}</Tag>}</div>
      <div style={{ position: 'absolute', left: 210, right: 210, top: 300, height: 170, transform: `translateY(${sent ? -30 * clamp(rk) : 0}px)` }}>
        <Glass color={col} style={{ inset: 0 }} radius={85}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 50px 0 70px', gap: 30 }}>
            <div style={{ flex: 1, fontFamily: F, fontWeight: 800, fontSize: 56, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden' }}>{txt.slice(0, n) || <span style={{ color: 'var(--ink-faint)' }}>{p.placeholder || '输入一句话……'}</span>}{!sent && <span style={{ color: accent(col), opacity: f % 16 < 8 ? 1 : 0 }}>▌</span>}</div>
            <div style={{ width: 100, height: 100, borderRadius: 50, background: sent ? 'var(--ink)' : accent(col), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, color: sent ? theme.bg : onColor(accent(col)), transform: `scale(${sent && f < send + 5 ? 0.85 : 1})` }}>↑</div>
          </div>
        </Glass></div>
      {sent && p.result && <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', opacity: clamp(rk), transform: `scale(${0.8 + 0.2 * clamp(rk)})` }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 120, color: 'var(--ink)', textShadow: `0 0 60px ${accent(col)}` }}>{p.result}</div>
        {p.resultSub && <div style={{ marginTop: 16, fontFamily: M, fontSize: 30, letterSpacing: '0.3em', color: accent(col) }}>{p.resultSub}</div>}</div>}
    </Stage>
  );
};

// MediaGallery — 3D 封面流（案例 / 作品 / 截图）
export const MediaGallery: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const items: any[] = p.items || [];
  const pos = lerp(0, items.length - 1, prog(f, 10, Math.max(20, dur - 10)));
  return (
    <Stage bg={bg || { variant: 'nebula', a: 'violet', b: 'cyan' }} chapter={chapter} color={p.color || 'violet'}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center' }}><Kinetic text={p.title || ''} size={fitSize(p.title || '', 76, 1680, 44, 0.02)} delay={2} style={{ display: 'inline-block' }} /></div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {items.map((it, i) => { const d = i - pos; const k = glide(f, fps, 4 + i * 3);
          return <div key={i} style={{ position: 'absolute', left: 960 - 380 + d * 520, top: 300, width: 760, height: 460, opacity: clamp(k) * (1 - Math.min(0.6, Math.abs(d) * 0.35)), zIndex: 100 - Math.round(Math.abs(d) * 10),
            transform: `translateZ(${-Math.abs(d) * 260}px) rotateY(${-d * 32}deg)`, borderRadius: 24, overflow: 'hidden', border: '2px solid var(--chip-border)', boxShadow: '0 40px 100px rgba(0,0,0,.6)' }}>
            <Media src={it.src} video={video} start={start} />
            {it.caption && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 28px', background: 'linear-gradient(transparent, rgba(0,0,0,.8))', fontFamily: F, fontWeight: 800, fontSize: fitSize(it.caption, 34, 700, 22), color: '#fff', whiteSpace: 'nowrap' }}>{it.caption}</div>}
          </div>; })}
      </AbsoluteFill>
    </Stage>
  );
};

// SplitPresenter — 画中画：人物在左侧窗口，右侧讲要点（人物少露脸时的折中）
export const SplitPresenter: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'cyan'; const k = glide(f, fps, 0);
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet', intensity: .7 }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 190, width: 760, height: 760, borderRadius: 36, overflow: 'hidden', border: `2px solid ${accent(col)}88`, boxShadow: `0 0 80px ${accent(col)}33`, transform: `perspective(1600px) rotateY(${(1 - k) * 25 + 6}deg)`, opacity: clamp(k * 2) }}>
        <div style={{ position: 'absolute', left: '-40%', top: '-2%', width: '180%', height: '104%' }}><Media src="self" video={video} start={start} /></div>
      </div>
      <div style={{ position: 'absolute', left: 960, top: 230, width: 850 }}>
        {p.kicker && <Tag color={col} style={{ fontSize: 22 }}>{p.kicker}</Tag>}
        <Kinetic text={p.title || ''} size={fitSize(p.title || '', 84, 850, 48, 0.02)} delay={4} style={{ marginTop: 10 }} />
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(p.points || []).map((pt: any, i: number) => { const kk = pop(f, fps, at(pt.at, 12 + i * 10));
            return <div key={i} style={{ opacity: clamp(kk), transform: `translateX(${(1 - kk) * 40}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '22px 30px', borderRadius: 20, background: 'var(--chip-solid)', border: `1.5px solid ${accent(pt.color || col)}66` }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: accent(pt.color || col) }} />
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: fitSize(String(pt.text ?? pt), 44, 740, 28), color: 'var(--ink)', whiteSpace: 'nowrap' }}>{pt.text ?? pt}</div></div>; })}
        </div>
      </div>
    </Stage>
  );
};

// EndCard — 结尾关注页（整屏）
export const EndCard: React.FC<PageProps> = ({ p, start, dur, chapter, bg, video }) => {
  const { f, fps, at } = useT(start); const col = p.color || 'pink'; const k = pop(f, fps, 4);
  const click = at(p.clickAt, Math.round(dur * 0.6)); const clicked = f >= click;
  return (
    <Stage bg={bg || { variant: 'prism', intensity: .7 }} color={col}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 260, height: 260, borderRadius: 130, overflow: 'hidden', border: `6px solid ${accent(col)}`, boxShadow: `0 0 80px ${accent(col)}`, transform: `scale(${k})` }}>
          {p.avatar ? <Media src={p.avatar} video={video} start={start} /> : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${accent('pink')}, ${accent('violet')})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 900, fontSize: 70, color: onColor([accent('pink'), accent('violet')]) }}>{p.name}</div>}
        </div>
        <Kinetic text={p.name || ''} size={110} delay={8} style={{ marginTop: 30 }} />
        {p.desc && <div style={{ marginTop: 10, fontFamily: F, fontSize: 40, color: 'var(--ink-dim)', opacity: prog(f, 14, 24) }}>{p.desc}</div>}
        <div style={{ marginTop: 44, padding: '26px 80px', borderRadius: 999, fontFamily: F, fontWeight: 900, fontSize: 52, color: clicked ? onColor('#3a3f55') : onColor([accent('pink'), accent('violet')]), transform: `scale(${clicked ? pop(f, fps, click, { damping: 8, stiffness: 200 }) : 1})`,
          background: clicked ? '#3a3f55' : `linear-gradient(90deg, ${accent('pink')}, ${accent('violet')})`, boxShadow: clicked ? 'none' : `0 0 50px ${accent(col)}` }}>{clicked ? `✓ ${p.doneText || '已关注'}` : `+ ${p.button || '关注'}`}</div>
        {p.next && <div style={{ marginTop: 40, fontFamily: M, fontSize: 28, letterSpacing: '0.2em', color: 'var(--ink-dim)', opacity: prog(f, 30, 40) }}>NEXT · {p.next}</div>}
      </AbsoluteFill>
    </Stage>
  );
};

export const MORE3: Record<string, React.FC<PageProps>> = { ProfileCard, PhoneMockup, ChatThread, Terminal, PromptBox, MediaGallery, SplitPresenter, EndCard };
