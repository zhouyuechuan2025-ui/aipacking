// 「专业报告」风格 · 第二批：更丰富的动效与表达形式（灵感来自 React Bits / snapcn 的组件类型，代码从零实现）
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { accent, onColor, accentText } from '../lib/theme';
import { fitSize } from '../lib/fit';
import { clamp, rel } from '../lib/anim';
import type { PageProps } from './full';
import { RStage, Card, Icon, rise, scaleIn, SF, NUM } from './report';
import { Emoji, AppTile, VideoAt, Sparkles, Phone, Laptop, Window, EMOJI_FONT } from '../fx/visual';
import { SplitText, Scramble, SplitFlap, RotatingWord, TrueFocus, BeamBorder, Glare, Spotlight, Tilt, sp, easeIO, easeOut, textW, TypeText } from '../fx';

const useR = (start: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, at: (s: any, fb: number) => rel(s, start, fps, fb) }; };
const activeIdx = (f: number, ts: number[]) => { let a = -1; ts.forEach((t, i) => { if (f >= t) a = i; }); return a; };
const Title: React.FC<{ p: any; f: number; fps: number; x?: number; y?: number; align?: 'left' | 'center'; w?: number }> = ({ p, f, fps, x = 150, y = 190, align = 'left', w }) => (
  <div style={{ position: 'absolute', left: align === 'center' ? 0 : x, right: align === 'center' ? 0 : undefined, top: y, width: w, textAlign: align }}>
    {p.eyebrow && <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 22, letterSpacing: '.3em', color: accentText(p.color || 'blue'), marginBottom: 16, ...rise(f, fps, 0) }}>{p.eyebrow}</div>}
    {/* 标题、副标题都固定一行，放不下就缩字（居中时可用 1620px） */}
    {p.title && <SplitText text={p.title} size={fitSize(p.title, p.titleSize || 68, w ?? 1620, 36)} d={2} stagger={1.1} />}
    {p.sub && <div style={{ marginTop: 16, fontFamily: SF, fontSize: fitSize(p.sub, 30, w ?? 1620, 20), whiteSpace: 'nowrap', color: 'var(--r-dim)', lineHeight: 1.5, ...rise(f, fps, 10) }}>{p.sub}</div>}
  </div>
);

/** CardDeck — 3D 卡片堆，每到一个时间点，最前面的卡落下、下一张顶上来（CardSwap） */
export const CardDeck: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const cards: any[] = p.cards || []; const n = cards.length; const ts = cards.map((c, i) => at(c.at, 8 + i * 24));
  const a = Math.max(0, activeIdx(f, ts)); const k = easeIO((f - ts[a]) / 22);
  const pos = (r: number) => ({ x: r * 64, y: -r * 58, z: -r * 110, o: 1 - r * 0.18 });
  const CW = 640, CH = 420, BX = 1080, BY = 400;
  const order = cards.map((_, i) => i).sort((i, j) => ((j - a + n) % n) - ((i - a + n) % n));
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Title p={p} f={f} fps={fps} x={150} y={250} w={760} />
      <div style={{ position: 'absolute', left: 150, top: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {cards.map((c, i) => { const on = i === a && f >= ts[0]; const seen = f >= ts[i];
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: SF, fontWeight: 700, fontSize: 30, color: on ? 'var(--r-ink)' : 'var(--r-faint)', opacity: seen ? 1 : 0.35, transform: `translateX(${on ? 12 : 0}px)` }}>
            <div style={{ width: on ? 34 : 14, height: 6, borderRadius: 3, background: on ? accent(c.color || col) : 'var(--r-track)' }} />{c.title}</div>; })}
      </div>
      <div style={{ position: 'absolute', left: BX, top: BY, width: CW, height: CH, perspective: 1600 }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'rotateY(-14deg) rotateX(6deg)' }}>
          {order.map(i => { const c = cards[i]; const cur = (i - a + n) % n; const prev = (i - (a - 1) + n) % n;
            let P = pos(cur); let drop = 0;
            if (a > 0 && f >= ts[a]) { const A = pos(prev), B = pos(cur);
              if (prev === 0 && cur === n - 1) { drop = k; const y = k < 0.5 ? A.y + easeIO(k * 2) * 520 : B.y + (1 - easeIO((k - 0.5) * 2)) * 180; P = { x: k < 0.5 ? A.x : B.x, y, z: k < 0.5 ? A.z + 60 : B.z, o: k < 0.5 ? 1 - k * 1.2 : B.o * easeIO((k - 0.5) * 2) }; }
              else P = { x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k, z: A.z + (B.z - A.z) * k, o: A.o + (B.o - A.o) * k }; }
            const enter = sp(f, fps, i === 0 ? 0 : 4 + i * 3, { damping: 18, stiffness: 120 });
            return <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, transform: `translate3d(${P.x}px, ${P.y + (1 - enter) * 300}px, ${P.z}px) rotateZ(${drop > 0 && drop < 0.5 ? drop * 10 : 0}deg)`, opacity: clamp(P.o) * clamp(enter * 2) }}>
              <Card r={30} style={{ inset: 0, overflow: 'hidden' }}>
                <Spotlight color={c.color || col} seed={i} r={30} opacity={0.18} />
                <div style={{ position: 'absolute', left: 44, top: 42 }}><Icon name={c.icon} color={c.color || col} size={34} /></div>
                <div style={{ position: 'absolute', right: 44, top: 50, fontFamily: NUM, fontWeight: 800, fontSize: 30, color: 'var(--r-faint)' }}>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</div>
                <div style={{ position: 'absolute', left: 44, bottom: 110, fontFamily: SF, fontWeight: 800, fontSize: 76, color: 'var(--r-ink)' }}>{c.title}</div>
                <div style={{ position: 'absolute', left: 44, right: 44, bottom: 50, fontFamily: SF, fontSize: 30, color: 'var(--r-dim)' }}>{c.sub}</div>
                {i === a && <Glare at={ts[a] + 10} r={30} strength={0.6} />}
              </Card>
              {i === a && <BeamBorder color={c.color || col} r={30} />}
            </div>; })}
        </div>
      </div>
    </RStage>
  );
};

/** BentoBoard — Bento 格子：大小不一的卡片依次亮起，内部有聚光、数字、迷你图（MagicBento） */
export const BentoBoard: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const X = 190, Y = p.title ? 260 : 180, W = 1540, H = p.title ? 700 : 760, G = 22, C = p.cols || 4, R = p.rows || 2;
  const cw = (W - G * (C - 1)) / C, rh = (H - G * (R - 1)) / R;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      {p.title && <div style={{ position: 'absolute', left: X, top: 150 }}><SplitText text={p.title} size={60} d={0} stagger={1} /></div>}
      {(p.cells || []).map((c: any, i: number) => { const d = at(c.at, 6 + i * 6); const x = X + c.col * (cw + G), y = Y + c.row * (rh + G), w = (c.w || 1) * cw + ((c.w || 1) - 1) * G, h = (c.h || 1) * rh + ((c.h || 1) - 1) * G; const cc = c.color || col; const big = (c.w || 1) * (c.h || 1) > 1;
        const kk = sp(f, fps, d, { damping: 17, stiffness: 130 });
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: clamp(kk * 1.6), transform: `translateY(${(1 - kk) * 40}px) scale(${0.94 + 0.06 * kk})` }}>
          <Card r={30} style={{ inset: 0, overflow: 'hidden' }}>
            <Spotlight color={cc} seed={i * 1.3} r={30} opacity={big ? 0.22 : 0.14} size={big ? 520 : 320} />
            {c.emoji && <Emoji ch={c.emoji} size={big ? 200 : 150} d={d + 4} seed={i} x={c.phone ? w - 330 : w - (big ? 150 : 100)} y={big ? h / 2 - 10 : 105} />}
            {c.phone && <div style={{ position: 'absolute', right: 40, top: 24, transform: 'rotate(6deg)' }}><Phone w={150} style={{ position: 'relative' }}><VideoAt video={video} start={start} /></Phone></div>}
            <div style={{ position: 'absolute', left: 34, top: 32 }}><Icon name={c.icon || 'spark'} color={cc} size={big ? 30 : 24} /></div>
            {c.kicker && <div style={{ position: 'absolute', right: 32, top: 38, fontFamily: NUM, fontSize: 18, letterSpacing: '.24em', color: 'var(--r-faint)' }}>{c.kicker}</div>}
            {c.value && <div style={{ position: 'absolute', left: 34, bottom: c.sub ? 92 : 50, fontFamily: NUM, fontWeight: 800, fontSize: big ? 120 : 78, color: accent(cc), letterSpacing: '-0.02em' }}><Scramble text={c.value} d={d + 6} dur={20} /><span style={{ fontSize: big ? 40 : 28, color: 'var(--r-dim)', marginLeft: 6 }}>{c.unit}</span></div>}
            {c.spark && (() => { const pts: number[] = c.spark; const k = easeOut((f - d - 8) / 30); const pw = w - 68, ph = 90;
              const path = pts.map((v, j) => `${j ? 'L' : 'M'}${34 + (j / (pts.length - 1)) * pw} ${h - 150 - (v / 100) * ph}`).join(' ');
              return <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}><path d={path} stroke={accent(cc)} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} /></svg>; })()}
            <div style={{ position: 'absolute', left: 34, right: 30, bottom: 44 }}>
              {!c.value && <div style={{ fontFamily: SF, fontWeight: 800, fontSize: big ? 60 : 42, color: 'var(--r-ink)', lineHeight: 1.2 }}>{c.title}</div>}
              {c.value && <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 28, color: 'var(--r-ink)' }}>{c.title}</div>}
              {c.sub && <div style={{ marginTop: 6, fontFamily: SF, fontSize: big ? 28 : 23, color: 'var(--r-dim)' }}>{c.sub}</div>}
            </div>
            <Glare at={d + 12} r={30} strength={0.45} />
          </Card>
          {c.hi && f >= at(c.hiAt, d + 20) && <BeamBorder color={cc} r={30} width={3} />}
        </div>; })}
    </RStage>
  );
};

/** FolderDrop — 文件夹打开，文件一张张飞出来排开（Folder） */
export const FolderDrop: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const files: any[] = p.files || []; const n = files.length; const open = at(p.openAt, 10); const ok = easeOut((f - open) / 14);
  const FX = 960, FY = 700;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Title p={p} f={f} fps={fps} align="center" y={62} />
      <div style={{ position: 'absolute', left: FX - 230, top: FY - 60, width: 460, height: 300, ...scaleIn(f, fps, 2) }}>
        <div style={{ position: 'absolute', left: 0, top: -34, width: 190, height: 60, borderRadius: '22px 22px 0 0', background: `linear-gradient(180deg, ${accent(col)}, ${accent(col)}dd)` }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '0 26px 26px 26px', background: `linear-gradient(180deg, ${accent(col)}ee, ${accent(col)}bb)`, boxShadow: `0 30px 70px ${accent(col)}44` }} />
      </div>
      {files.map((fl, i) => { const d = at(fl.at, open + 6 + i * 8); const k = sp(f, fps, d, { damping: 15, stiffness: 110, mass: 0.9 });
        const tx = (i - (n - 1) / 2) * 400, ty = -250, rot = (i - (n - 1) / 2) * 5;
        return <div key={i} style={{ position: 'absolute', left: FX - 170, top: FY - 200, width: 340, height: 280, transform: `translate(${tx * k}px, ${ty * k + (1 - clamp(k)) * 60}px) rotate(${rot * k}deg) scale(${0.7 + 0.3 * clamp(k)})`, opacity: f >= d ? 1 : 0, zIndex: 2 }}>
          <Card r={22} style={{ inset: 0, overflow: 'hidden' }}>
            {!fl.thumb && <div style={{ position: 'absolute', left: 28, top: 26 }}><Icon name={fl.icon || 'doc'} color={fl.color || col} size={26} /></div>}
            {fl.thumb?.kind === 'video' ? <div style={{ position: 'absolute', left: 16, right: 16, top: 16, height: 150, borderRadius: 14, overflow: 'hidden' }}><VideoAt video={video} at={fl.thumb.at} /></div>
              : fl.thumb?.kind === 'collage' ? <div style={{ position: 'absolute', left: 16, right: 16, top: 16, height: 150, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6 }}>
                  {(fl.thumb.ats || [5, 20, 40]).slice(0, 3).map((t: number, j: number) => <div key={j} style={{ borderRadius: 10, overflow: 'hidden', gridRow: j === 0 ? '1 / 3' : undefined }}><VideoAt video={video} at={t} /></div>)}</div>
              : fl.thumb?.kind === 'text' ? <div style={{ position: 'absolute', left: 16, right: 16, top: 16, height: 150, borderRadius: 14, background: '#1D1D1F', padding: '16px 18px', fontFamily: '"JetBrains Mono",monospace', fontSize: 17, lineHeight: 1.55, color: '#E5E5EA', overflow: 'hidden' }}>
                  {(fl.thumb.lines || []).map((l: string, j: number) => <div key={j} style={{ opacity: clamp((f - d - 10 - j * 5) / 6), whiteSpace: 'nowrap' }}><span style={{ color: accent('green') }}>› </span>{l}</div>)}</div>
              : [0, 1, 2].map(j => <div key={j} style={{ position: 'absolute', left: 28, right: j === 2 ? 120 : 28, top: 110 + j * 20, height: 9, borderRadius: 5, background: 'var(--r-track)' }} />)}
            {fl.emoji && <div style={{ position: 'absolute', right: -26, top: -30 }}><Emoji ch={fl.emoji} size={90} d={d + 6} seed={i} /></div>}
            <div style={{ position: 'absolute', left: 28, bottom: 26, fontFamily: SF, fontWeight: 800, fontSize: 40, color: 'var(--r-ink)' }}>{fl.title}</div>
            {fl.sub && <div style={{ position: 'absolute', right: 26, bottom: 32, fontFamily: SF, fontSize: 22, color: 'var(--r-dim)' }}>{fl.sub}</div>}
            <Glare at={d + 8} r={22} />
          </Card>
        </div>; })}
      <div style={{ position: 'absolute', left: FX - 240, top: FY - 10, width: 480, height: 260, zIndex: 3, perspective: 900, ...scaleIn(f, fps, 2) }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: `linear-gradient(180deg, ${accent(col)}, ${accent(col)}e6)`, transformOrigin: '50% 100%', transform: `rotateX(${ok * 38}deg)`, boxShadow: '0 -2px 0 rgba(255,255,255,.35) inset, 0 20px 50px rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 40, color: '#fff' }}>{p.folder || '素材库'}</div>
        </div>
      </div>
      <Sparkles n={16} seed={4} color={accent(col)} area={[300, 120, 1620, 760]} />
    </RStage>
  );
};

/** OrbitHub — 中心节点 + 倾斜轨道上环绕的图标（OrbitImages / Orbit Flow） */
export const OrbitHub: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const items: any[] = p.items || []; const cx = 960, cy = 600; const rings = [380, 600];
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Title p={p} f={f} fps={fps} align="center" y={120} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {rings.map((r, i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.34} fill="none" stroke="var(--r-ink)" strokeOpacity={0.12} strokeWidth={2} strokeDasharray="4 10" pathLength={1} style={{ strokeDasharray: `${easeOut((f - 4 - i * 5) / 30)} 1` }} />)}
      </svg>
      {(() => { const list = items.map((it, i) => { const ring = rings[it.ring ?? i % 2]; const ang = (i / items.length) * Math.PI * 2 + f / (it.ring ? 150 : 110) * (it.ring ? -1 : 1);
        const x = cx + Math.cos(ang) * ring, y = cy + Math.sin(ang) * ring * 0.34; const depth = (Math.sin(ang) + 1) / 2; return { it, i, x, y, depth }; });
        return list.sort((a, b) => a.depth - b.depth).map(({ it, i, x, y, depth }) => { const d = at(it.at, 10 + i * 6); const k = sp(f, fps, d); const s = (0.92 + 0.3 * depth) * (0.5 + 0.5 * clamp(k));
          const node = <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: clamp(k * 1.5) * (0.55 + 0.45 * depth), zIndex: depth > 0.5 ? 5 : 1, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px 14px 14px', borderRadius: 999, background: 'var(--r-cardbg)', backdropFilter: 'var(--r-blur)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)' }}>
            {it.emoji ? <span style={{ fontFamily: EMOJI_FONT, fontSize: 44, lineHeight: 1 }}>{it.emoji}</span> : <Icon name={it.icon} color={it.color || col} size={26} />}<span style={{ fontFamily: SF, fontWeight: 800, fontSize: 38, color: 'var(--r-ink)', whiteSpace: 'nowrap' }}>{it.title}</span></div>;
          return node; }); })()}
      <div style={{ position: 'absolute', left: cx - 130, top: cy - 130, width: 260, height: 260, borderRadius: 130, zIndex: 3, background: `radial-gradient(circle at 35% 30%, #ffffff, ${accent(col)}33 60%, ${accent(col)}66)`, boxShadow: `0 0 ${80 + 20 * Math.sin(f / 10)}px ${accent(col)}66, 0 30px 70px rgba(0,0,0,.15)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...scaleIn(f, fps, 0) }}>
        <Icon name={p.centerIcon || 'spark'} box={false} color={col} size={64} /><div style={{ fontFamily: SF, fontWeight: 800, fontSize: 40, color: '#1D1D1F', marginTop: 6 }}>{p.center || 'AI'}</div>
      </div>
      {p.result && <div style={{ position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', zIndex: 6, ...rise(f, fps, at(p.resultAt, 60)) }}>
        <div style={{ padding: '14px 38px', borderRadius: 999, background: '#1D1D1F', color: '#fff', fontFamily: SF, fontWeight: 800, fontSize: 34 }}>{p.result}</div></div>}
    </RStage>
  );
};

/** KeywordWall — 关键词跑马灯墙 + 中间的轮换词句子（LogoLoop + RotatingText） */
export const KeywordWall: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const rows: string[][] = p.rows || [['剪辑', '调色', '转场', '字幕', '特效', '配乐']];
  const ts = (p.times || []).map((t: number, i: number) => at(t, 20 + i * 20));
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)', opacity: 0.9 }}>
        {rows.map((r, j) => { const y = [120, 262, 830, 690][j] ?? 120 + j * 140; const dir = j % 2 ? 1 : -1; const off = (f * (2.2 + j * 0.5) * dir) % 1200;
          const struck = p.strikeAt != null && f >= at(p.strikeAt, 0);
          return <div key={j} style={{ position: 'absolute', top: y, left: -1200 + off, display: 'flex', gap: 22, whiteSpace: 'nowrap', ...rise(f, fps, j * 3) }}>
            {[...r, ...r, ...r, ...r].map((w, i) => <div key={i} data-probe-decor style={{ position: 'relative', padding: '16px 34px', borderRadius: 999, background: 'var(--r-cardbg)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)', fontFamily: SF, fontWeight: 700, fontSize: 34, color: struck ? 'var(--r-faint)' : 'var(--r-ink)' }}>{w}
              {struck && <div style={{ position: 'absolute', left: 20, right: 20, top: '50%', height: 3, background: accent('red'), transformOrigin: 'left', transform: `scaleX(${clamp((f - at(p.strikeAt, 0) - (i % 6) * 2) / 8)})` }} />}</div>)}
          </div>; })}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, ...rise(f, fps, 6, 30) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 44px', borderRadius: 40, background: 'var(--r-capsule)', backdropFilter: 'blur(30px)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)' }}>
          <span style={{ fontFamily: SF, fontWeight: 800, fontSize: 80, color: 'var(--r-ink)' }}>{p.lead}</span>
          {p.words && <RotatingWord words={p.words} times={ts.length ? ts : [0]} size={80} bg={accent(col)} />}
          {p.tail && <span style={{ fontFamily: SF, fontWeight: 800, fontSize: 80, color: 'var(--r-ink)' }}>{p.tail}</span>}
        </div>
      </div>
    </RStage>
  );
};

/** FlapStat — 翻页牌大数字（SplitFlap），配说明和来源 */
export const FlapStat: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {p.eyebrow && <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 24, letterSpacing: '.32em', color: accent(col), marginBottom: 36, ...rise(f, fps, 0) }}>{p.eyebrow}</div>}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22 }}>
          <SplitFlap text={p.value || '100'} d={at(p.at, 6)} size={p.size || 190} color={accent(col)} />
          {p.unit && <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 80, color: 'var(--r-ink)', marginBottom: 20, ...rise(f, fps, at(p.at, 6) + 20) }}>{p.unit}</div>}
        </div>
        {p.label && <div style={{ marginTop: 44, fontFamily: SF, fontWeight: 700, fontSize: 48, color: 'var(--r-ink)', ...rise(f, fps, at(p.labelAt, 24)) }}>{p.label}</div>}
        {p.source && <div style={{ marginTop: 18, fontFamily: NUM, fontSize: 18, letterSpacing: '.18em', color: 'var(--r-faint)', ...rise(f, fps, 30) }}>{p.source}</div>}
      </AbsoluteFill>
    </RStage>
  );
};

/** FocusLine — 金句：焦点框在关键词之间移动，其余词虚化（TrueFocus） */
export const FocusLine: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const words: string[] = p.words || []; const ts = (p.times || words.map((_: any, i: number) => null)).map((t: any, i: number) => at(t, 10 + i * 18));
  // 整句放不下 1680px 就等比缩小
  const base = p.size || 104; const W0 = words.reduce((a, w) => a + textW(w, base), 0) + base * 0.4 * (words.length - 1);
  const size = W0 > 1680 ? Math.floor(base * 1680 / W0) : base; const W = W0 * size / base;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {p.eyebrow && <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 24, letterSpacing: '.32em', color: accent(col), marginBottom: 50, ...rise(f, fps, 0) }}>{p.eyebrow}</div>}
        <div style={{ width: W, ...rise(f, fps, 2, 30) }}><TrueFocus words={words} times={ts} size={size} color={col} /></div>
        {p.foot && <div style={{ marginTop: 56, fontFamily: SF, fontSize: 34, color: 'var(--r-dim)', ...rise(f, fps, at(p.footAt, 40)) }}>{p.foot}</div>}
      </AbsoluteFill>
    </RStage>
  );
};

/** NotifyStack — iOS 通知逐条弹入、旧的往下推（AnimatedList），适合「很多人说」「评论区」 */
export const NotifyStack: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const items: any[] = p.items || []; const ts = items.map((it, i) => at(it.at, 6 + i * 12)); const H = 150, GAP = 18;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Title p={p} f={f} fps={fps} x={150} y={330} w={620} />
      <div style={{ position: 'absolute', left: 900, top: 190, width: 820, height: 760 }}>
        {items.map((it, i) => { const k = sp(f, fps, ts[i], { damping: 16, stiffness: 170, mass: 0.7 }); if (f < ts[i] - 1) return null;
          const above = ts.filter((t, j) => j > i && f >= t).length; const pushK = ts.filter((t, j) => j > i).reduce((s, t) => s + clamp(sp(f, fps, t, { damping: 18, stiffness: 150 })), 0);
          const y = pushK * (H + GAP); const sc = 1 - Math.max(0, above - 2) * 0.04;
          return <div key={i} style={{ position: 'absolute', left: 0, top: y, width: 820, height: H, transform: `translateY(${(1 - k) * -70}px) scale(${(0.85 + 0.15 * k) * sc})`, opacity: clamp(k * 2) * (above > 3 ? 0 : 1 - Math.max(0, above - 2) * 0.35) }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: 'var(--r-capsule)', backdropFilter: 'blur(30px) saturate(180%)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)' }} />
            <div style={{ position: 'absolute', left: 26, top: 26 }}><Icon name={it.icon || 'user'} color={it.color || col} size={26} /></div>
            <div style={{ position: 'absolute', left: 116, right: 30, top: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF, fontSize: 22, color: 'var(--r-dim)', fontWeight: 600 }}><span>{it.app || '评论'}</span><span>{it.time || '现在'}</span></div>
              <div style={{ marginTop: 6, fontFamily: SF, fontWeight: 800, fontSize: 32, color: 'var(--r-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
              {it.body && <div style={{ marginTop: 4, fontFamily: SF, fontSize: 24, color: 'var(--r-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.body}</div>}
            </div>
          </div>; })}
      </div>
    </RStage>
  );
};

/** DockTools — macOS Dock：一排工具图标，放大波浪扫过，最后给结论（Dock） */
export const DockTools: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  const tools: any[] = p.tools || []; const n = tools.length; const base = 110, gap = 22;
  const wave = at(p.waveAt, 16); const wx = interpolate(f, [wave, wave + 50], [-1, n], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scales = tools.map((_, i) => 1 + 0.55 * Math.exp(-Math.pow(i - wx, 2) / 1.2));
  const widths = scales.map(s => base * s); const total = widths.reduce((a, b) => a + b, 0) + gap * (n - 1);
  const strike = p.strikeAt != null ? at(p.strikeAt, 0) : -1;
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <Title p={p} f={f} fps={fps} align="center" y={210} />
      <div style={{ position: 'absolute', left: 960 - total / 2 - 30, top: 600 - 20, width: total + 60, height: base + 40, borderRadius: 40, background: 'var(--r-capsule)', backdropFilter: 'blur(30px)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)', ...rise(f, fps, 4, 60) }} />
      {tools.map((t, i) => { const x = 960 - total / 2 + widths.slice(0, i).reduce((a, b) => a + b, 0) + gap * i; const s = scales[i]; const d = 6 + i * 2; const k = sp(f, fps, d);
        const off = strike >= 0 && f >= strike ? clamp((f - strike - i * 2) / 10) : 0;
        return <div key={i} style={{ position: 'absolute', left: x, top: 600 + base - base * s, width: base * s, opacity: clamp(k * 2) * (1 - off * 0.6), filter: off ? `grayscale(${off})` : undefined, transform: `translateY(${(1 - k) * 60}px)` }}>
          <div style={{ width: base * s, height: base * s, borderRadius: base * s * 0.26, background: `linear-gradient(160deg, ${accent(t.color || col)}, ${accent(t.color || col)}bb)`, boxShadow: `0 ${10 * s}px ${24 * s}px ${accent(t.color || col)}44, inset 0 1px 0 rgba(255,255,255,.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={t.icon} box={false} color="#ffffff" size={base * s * 0.46} /></div>
          <div style={{ position: 'absolute', left: '50%', top: -58 * s, transform: 'translateX(-50%)', padding: '6px 16px', borderRadius: 10, background: '#1D1D1F', color: '#fff', fontFamily: SF, fontWeight: 700, fontSize: 22, whiteSpace: 'nowrap', opacity: clamp((s - 1.25) * 4) }}>{t.name}</div>
        </div>; })}
      {p.verdict && <div style={{ position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', ...rise(f, fps, at(p.verdictAt, 60)) }}>
        <div style={{ padding: '14px 40px', borderRadius: 999, background: accent(p.verdictColor || 'red'), color: onColor(accent(p.verdictColor || 'red')), fontFamily: SF, fontWeight: 800, fontSize: 36 }}>{p.verdict}</div></div>}
    </RStage>
  );
};

/** TypeHero — 大字打字机标题 + 下方胶囊标签依次弹出（TextType + Punch Lines） */
export const TypeHero: React.FC<PageProps> = ({ p, start, dur, chapter, video }) => {
  const { f, fps, at } = useR(start); const col = p.color || 'blue';
  return (
    <RStage start={start} video={video} chapter={chapter} tag={p.tag} color={col} dur={dur}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {p.eyebrow && <div style={{ fontFamily: NUM, fontWeight: 700, fontSize: 24, letterSpacing: '.32em', color: accent(col), marginBottom: 30, ...rise(f, fps, 0) }}>{p.eyebrow}</div>}
        <div style={{ fontFamily: SF, fontWeight: 800, fontSize: p.size || 110, color: 'var(--r-ink)', letterSpacing: '-0.01em' }}><TypeText text={p.text || ''} d={at(p.typeAt, 4)} cps={p.cps || 12} cursor={col} /></div>
        <div style={{ marginTop: 50, display: 'flex', gap: 20 }}>
          {(p.chips || []).map((c: any, i: number) => { const d = at(c.at, 30 + i * 8); const k = sp(f, fps, d, { damping: 12, stiffness: 200, mass: 0.6 });
            return <div key={i} style={{ padding: '14px 30px', borderRadius: 999, background: i === (p.hi ?? -1) ? accent(c.color || col) : 'var(--r-cardbg)', color: i === (p.hi ?? -1) ? '#fff' : 'var(--r-ink)', border: 'var(--r-cardborder)', boxShadow: 'var(--r-shadow)', fontFamily: SF, fontWeight: 700, fontSize: 32, opacity: clamp(k * 2), transform: `scale(${0.6 + 0.4 * k})` }}>{c.text}</div>; })}
        </div>
      </AbsoluteFill>
    </RStage>
  );
};

export const REPORT2_PAGES = { CardDeck, BentoBoard, FolderDrop, OrbitHub, KeywordWall, FlapStat, FocusLine, NotifyStack, DockTools, TypeHero };
