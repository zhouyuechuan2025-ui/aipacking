// 「专业报告」第三批：有主视觉的页面（设备 / 软件界面 / 立体图标 / 真实画面）
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { accent } from '../lib/theme';
import { clamp, rel, rnd } from '../lib/anim';
import type { PageProps } from './full';
import { RStage, rise, scaleIn, SF, NUM } from './report';
import { RotatingWord, TypeText, sp, easeIO, easeOut, Glare } from '../fx';
import { Emoji, AppTile, VideoAt, Sparkles, Phone, Laptop, Window } from '../fx/visual';

const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };

/** HeroPrompt — MacBook 里输入一句话 → iPhone 里弹出成片（真实画面），周围漂浮立体图标 */
export const HeroPrompt: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'violet';
  const typeS = at(p.typeAt, 2), genS = at(p.genAt, Math.round(dur * 0.45)), doneS = at(p.doneAt, Math.round(dur * 0.65));
  const g = clamp((f - genS) / Math.max(1, doneS - genS)); const ph = sp(f, fps, doneS, { damping: 14, stiffness: 120 });
  const cam = interpolate(f, [0, dur], [1.05, 1]);
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Laptop w={900} style={{ left: 120, top: 250, ...rise(f, fps, 0, 60) }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#FBFBFD,#F1EEF8)' }} />
          <div style={{ position: 'absolute', left: 60, top: 50, fontFamily: SF, fontWeight: 800, fontSize: 30, color: '#1D1D1F' }}>{p.app || 'AI 视频生成'}</div>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 120, height: 200, borderRadius: 24, background: '#fff', boxShadow: '0 10px 40px rgba(80,60,160,.12)', border: `2px solid ${accent(col)}55`, padding: '26px 30px' }}>
            <div style={{ fontFamily: NUM, fontSize: 16, letterSpacing: '.22em', color: '#8E8E93' }}>PROMPT</div>
            <div style={{ marginTop: 12, fontFamily: SF, fontWeight: 700, fontSize: 38, color: '#1D1D1F', lineHeight: 1.35 }}><TypeText text={p.prompt || ''} d={typeS} cps={p.cps || 22} cursor={col} /></div>
          </div>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 350, height: 12, borderRadius: 6, background: 'rgba(0,0,0,.06)', overflow: 'hidden', opacity: clamp((f - genS + 3) / 5) }}>
            <div style={{ width: `${g * 100}%`, height: '100%', background: `linear-gradient(90deg, ${accent('blue')}, ${accent(col)}, ${accent('pink')})` }} /></div>
          <div style={{ position: 'absolute', right: 60, top: 380, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 30px', borderRadius: 999, background: '#1D1D1F', color: '#fff', fontFamily: SF, fontWeight: 700, fontSize: 24, transform: `scale(${f >= genS - 2 && f < genS + 3 ? 0.92 : 1})` }}>✦ {g >= 1 ? '已生成' : f >= genS ? `生成中 ${Math.round(g * 100)}%` : '生成'}</div>
        </Laptop>
        <div style={{ position: 'absolute', left: 1260, top: 130, transform: `translateX(${(1 - ph) * 500}px) rotate(${(1 - ph) * 12 + 4}deg)`, opacity: clamp(ph * 2) }}>
          <Phone w={360} style={{ position: 'relative' }}><VideoAt video={video} start={start} />
            <div style={{ position: 'absolute', left: 16, top: 56, padding: '8px 16px', borderRadius: 12, background: 'rgba(0,0,0,.5)', color: '#fff', fontFamily: SF, fontWeight: 700, fontSize: 22 }}>{p.result || '成片 · 00:44'}</div>
            <Glare at={doneS + 6} r={40} />
          </Phone>
        </div>
        <AppTile ch="✨" color={col} size={130} d={4} seed={1} x={1010} y={250} />
        <AppTile ch="🎬" color="pink" size={120} d={doneS + 4} seed={2} x={1760} y={880} />
        <Emoji ch="⚡" size={120} d={genS} seed={3} x={1130} y={760} />
      </AbsoluteFill>
      <Sparkles n={18} seed={5} color={accent(col)} />
    </RStage>
  );
};

/** EditorCollapse — 专业剪辑软件界面（真实画面缩略图 / 轨道 / 关键帧）+ 周围立体工具图标；说到「小儿科」时整体褪色后倒 */
export const EditorCollapse: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const ts = (p.times || []).map((t: number, i: number) => at(t, 20 + i * 20)); const sk = at(p.strikeAt, Math.round(dur * 0.6));
  const c = easeIO((f - sk) / 24); const r = rnd(4);
  const tools = p.tools || [{ ch: '✂️', label: '剪辑', color: 'blue' }, { ch: '🎨', label: '调色', color: 'pink' }, { ch: '🎞️', label: '转场', color: 'violet' }, { ch: '🎚️', label: '调音', color: 'orange' }, { ch: '🔤', label: '字幕', color: 'green' }, { ch: '✨', label: '特效', color: 'gold' }];
  const tpos = [[190, 250], [150, 620], [300, 900], [1730, 240], [1780, 600], [1620, 900]];
  const clipT = p.clips || [3, 9, 16, 24, 31, 40, 52, 60];
  const playX = 170 + ((f * 7) % 1000);
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <div style={{ position: 'absolute', left: 360, top: 150, width: 1200, height: 740, perspective: 2000 }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 100%', transform: `rotateX(${c * 28}deg) scale(${1 - c * 0.14}) translateY(${c * 60}px)`, filter: `saturate(${1 - c * 0.9}) brightness(${1 + c * 0.05})`, opacity: 1 - c * 0.45, ...scaleIn(f, fps, 0) }}>
          <Window title={p.window || '剪辑工程 · 未命名项目'} style={{ inset: 0 }}>
            <div style={{ position: 'absolute', left: 20, top: 20, width: 700, height: 394, borderRadius: 12, overflow: 'hidden', background: '#000' }}><VideoAt video={video} start={start} />
              <div style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: NUM, fontSize: 16, color: '#fff', background: 'rgba(0,0,0,.5)', padding: '3px 10px', borderRadius: 6 }}>00:00:{String(10 + Math.floor(f / 30)).padStart(2, '0')}:{String(f % 30).padStart(2, '0')}</div></div>
            <div data-probe-skip style={{ position: 'absolute', left: 740, right: 20, top: 20, height: 394, borderRadius: 12, background: '#F5F5F7', padding: 22 }}>
              {['曝光', '对比度', '饱和度', '色温', '锐化', '暗角'].map((n, i) => { const v = 0.3 + 0.5 * ((Math.sin(f / 18 + i * 1.3) + 1) / 2);
                return <div key={i} style={{ marginBottom: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF, fontSize: 18, color: '#6E6E73' }}><span>{n}</span><span style={{ fontFamily: NUM }}>{Math.round(v * 100)}</span></div>
                  <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: 'rgba(0,0,0,.08)', position: 'relative' }}><div style={{ width: `${v * 100}%`, height: '100%', borderRadius: 3, background: accent(['blue', 'violet', 'pink', 'orange', 'green', 'gold'][i]) }} />
                    <div style={{ position: 'absolute', left: `${v * 100}%`, top: -6, width: 18, height: 18, marginLeft: -9, borderRadius: 9, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.25)' }} /></div></div>; })}
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, top: 432, bottom: 20, borderRadius: 12, background: '#1E1E20', overflow: 'hidden' }}>
              {['V2', 'V1', 'A1', 'A2'].map((n, j) => <div key={j} style={{ position: 'absolute', left: 0, width: 60, top: 14 + j * 58, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NUM, fontSize: 16, color: '#8E8E93' }}>{n}</div>)}
              {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ position: 'absolute', left: 80 + i * 200 + (i % 2) * 40, top: 14, width: 150 + (i % 3) * 30, height: 44, borderRadius: 8, background: `linear-gradient(90deg, ${accent(['violet', 'pink', 'blue', 'gold', 'green'][i])}cc, ${accent(['violet', 'pink', 'blue', 'gold', 'green'][i])}88)`, opacity: clamp((f - 4 - i * 2) / 6) }}>
                <div style={{ position: 'absolute', left: 10, top: 10, fontFamily: SF, fontSize: 16, fontWeight: 700, color: '#fff' }}>{['光效', '转场', '字幕', '调色', '粒子'][i]}</div>
                {[0.2, 0.6, 0.9].map((k, q) => <div key={q} style={{ position: 'absolute', left: `${k * 100}%`, top: 34, width: 10, height: 10, transform: 'rotate(45deg)', background: '#fff' }} />)}</div>)}
              {clipT.map((t: number, i: number) => <div key={i} style={{ position: 'absolute', left: 80 + i * 128, top: 72, width: 124, height: 48, borderRadius: 6, overflow: 'hidden', border: '2px solid #4A90FF', opacity: clamp((f - 2 - i) / 6) }}><VideoAt video={video} at={t} /></div>)}
              <svg width={1100} height={120} style={{ position: 'absolute', left: 80, top: 130 }}>{Array.from({ length: 180 }).map((_, i) => { const hh = 6 + Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.13 + f / 10)) * 40; return <rect key={i} x={i * 6} y={24 - hh / 2 + 5} width={3} height={hh} rx={1.5} fill="#34C759" opacity={0.85} />; })}
                {Array.from({ length: 180 }).map((_, i) => { const hh = 4 + Math.abs(Math.sin(i * 0.31 + 2) * Math.cos(i * 0.05)) * 30; return <rect key={'b' + i} x={i * 6} y={82 - hh / 2} width={3} height={hh} rx={1.5} fill="#FF9F0A" opacity={0.75} />; })}</svg>
              <div style={{ position: 'absolute', left: playX, top: 0, bottom: 0, width: 2, background: '#FF3B30' }}><div style={{ position: 'absolute', left: -8, top: 0, width: 18, height: 14, background: '#FF3B30', borderRadius: 3 }} /></div>
            </div>
          </Window>
        </div>
      </div>
      {tools.map((t: any, i: number) => { const [x, y] = tpos[i % tpos.length]; const fall = c * (200 + i * 30);
        return <div key={i} style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${fall}px) rotate(${c * (i % 2 ? 25 : -25)}deg)`, opacity: 1 - c * 0.8, filter: `grayscale(${c})` }}><AppTile ch={t.ch} label={t.label} color={t.color} size={120} d={4 + i * 3} seed={i} x={x} y={y} /></div>; })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', opacity: clamp((f - ts[0] + 4) / 6), transform: `scale(${0.9 + 0.1 * clamp((f - ts[0] + 4) / 6)})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '26px 48px', borderRadius: 44, background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(30px)', boxShadow: '0 30px 80px rgba(30,20,60,.25)', border: '1.5px solid rgba(255,255,255,.9)' }}>
          <span style={{ fontFamily: SF, fontWeight: 800, fontSize: 84, color: '#1D1D1F' }}>{p.lead || '苦练的'}</span>
          <RotatingWord words={p.words || ['剪辑技巧']} times={ts.length ? ts : [0]} size={84} bg={f >= (ts[ts.length - 1] ?? 1e9) ? accent('red') : accent(col)} />
        </div>
      </div>
    </RStage>
  );
};

export const REPORT3_PAGES = { HeroPrompt, EditorCollapse };
