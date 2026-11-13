import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FULL_PAGES as BASE } from './pages/full';
import { MORE1 } from './pages/more1';
import { MORE2 } from './pages/more2';
import { MORE3 } from './pages/more3';
import { MORE4 } from './pages/more4';
import { M5_PAGES } from './m5';
import { CUSTOM } from './custom';
import { MOTION_LIBRARY_PAGES, MOTION_LIBRARY_OVERLAYS } from './custom/MotionLibrary';
import { MotionElements, type MotionElement } from './pages/MotionElements';
import { SEMANTIC_LANES, SEMANTIC_PAGES } from './motion/semantic-scene';
import { REPORT_PAGES, REPORT_OVERLAYS } from './pages/report';
import { REPORT2_PAGES } from './pages/report2';
import { REPORT3_PAGES } from './pages/report3';
import { EDITORIAL_PAGES } from './pages/editorial';
import { EDITORIAL2_PAGES } from './pages/editorial2';
import { EDITORIAL3_PAGES, EDITORIAL3_OVERLAYS } from './pages/editorial3';
import { EDITORIAL4_OVERLAYS } from './pages/editorial4';
export const FULL_PAGES: Record<string, any> = { ...BASE, ...MORE1, ...MORE2, ...MORE3, ...MORE4, ...M5_PAGES, ...REPORT_PAGES, ...REPORT2_PAGES, ...REPORT3_PAGES, ...EDITORIAL_PAGES, ...EDITORIAL2_PAGES, ...EDITORIAL3_PAGES, ...CUSTOM, ...MOTION_LIBRARY_PAGES, ...SEMANTIC_PAGES };
import { OVERLAYS as OV0, ProgressNav } from './pages/overlay';
import { SideBeats } from './pages/SideBeats';
import { cameraValue, type Camera } from './lib/camera';
import { theme, setTheme, setPalette, themeVars, type Palette } from './lib/theme';

/** Sets the style pack for everything rendered inside it (React renders depth-first, so siblings can use different packs). */
const ThemeScope: React.FC<{ id?: string; children: React.ReactNode }> = ({ id, children }) => { const t = setTheme(id); return <AbsoluteFill style={{ ...(themeVars(t) as any), isolation: 'isolate' }}>{children}</AbsoluteFill>; };
// isolation: 页面内部的 zIndex 不会跑到重绘字幕上面
import { clamp } from './lib/anim';
import { textEm, fitLines } from './lib/fit';
import { Probe } from './lib/probe';

export type Scene = { id: string; type: string; start: number; end: number; layout?: 'full' | 'left' | 'right' | 'top' | 'overlay'; bg?: any; props?: any; transition?: string; camera?: Camera; motionDetail?: string; motionNote?: string; elements?: MotionElement[]; personFx?: 'mono' | 'zoom' | 'blur'; style?: string };
export type Plan = {
  meta: { fps: number; width: number; height: number; duration: number; video: string; burnedSubtitles?: boolean };
  style?: string;
  palette?: Palette;
  chapterTimeline?: { start: number; title: string }[];
  chapters?: { start: number; title: string; style?: string; en?: string; color?: string }[];
  subtitles?: { mode?: 'covered' | 'always' | 'off' };
  scenes: Scene[];
};
type Sub = [number, number, string];
const OVERLAYS: Record<string, any> = { ...OV0, ...REPORT_OVERLAYS, ...EDITORIAL3_OVERLAYS, ...EDITORIAL4_OVERLAYS, SideBeats, ...MOTION_LIBRARY_OVERLAYS, ...SEMANTIC_LANES };
const TR = 9; // transition frames
const CYCLE = ['zoom', 'push', 'flip', 'wipe'];

const isFull = (s: Scene) => (s.layout ?? (FULL_PAGES[s.type] ? 'full' : 'overlay')) === 'full';

const Enter: React.FC<{ kind: string; children: React.ReactNode }> = ({ kind, children }) => {
  const f = useCurrentFrame();
  const k = clamp(f / TR); const e = 1 - Math.pow(1 - k, 3);
  let style: React.CSSProperties = {};
  if (k < 1) {
    if (kind === 'circle') style = { clipPath: `circle(${e * 75}% at 50% 50%)` };
    else if (kind === 'zoom') style = { transform: `scale(${1.18 - 0.18 * e})`, opacity: e, filter: `blur(${(1 - e) * 16}px)` };
    else if (kind === 'push') style = { transform: `translateX(${(1 - e) * 100}%)`, boxShadow: '-30px 0 60px rgba(0,0,0,.6)' };
    else if (kind === 'flip') style = { transform: `perspective(1600px) rotateY(${(1 - e) * -80}deg)`, transformOrigin: 'left center', opacity: clamp(e * 2) };
    else if (kind === 'soft') style = { opacity: e, transform: `scale(${1.04 - 0.04 * e})`, filter: `blur(${(1 - e) * 14}px)` };
    else if (kind === 'wipe') style = { clipPath: `inset(0 0 0 ${(1 - e) * 100}%)` };
  }
  return <AbsoluteFill style={style}>{children}{k < 1 && kind === 'circle' && <AbsoluteFill style={{ boxShadow: `inset 0 0 0 ${6 * (1 - k)}px rgba(255,255,255,.8)` }} />}</AbsoluteFill>;
};
const Exit: React.FC<{ dur: number; toPerson: boolean; soft?: boolean; children: React.ReactNode }> = ({ dur, toPerson, soft, children }) => {
  const f = useCurrentFrame();
  if (!toPerson) return <>{children}</>;
  const k = clamp((f - (dur - TR)) / TR); const e = k * k;
  if (soft) return <AbsoluteFill style={k > 0 ? { opacity: 1 - e, transform: `scale(${1 + 0.03 * e})`, filter: `blur(${e * 12}px)` } : {}}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={k > 0 ? { clipPath: `inset(0 0 0 ${e * 100}%)` } : {}}>{children}{k > 0 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${e * 100}%`, width: 6, marginLeft: -3, background: '#fff' }} />}</AbsoluteFill>;
};

// 一行放不下（长句）就在最靠近中间的标点处断成两行，仍放不下再整体缩字
const SUB_W = 1600;
const subLines = (text: string): string[] => {
  if (textEm(text) * 46 <= SUB_W) return [text];
  const chars = Array.from(text); const mid = chars.length / 2;
  const cuts = chars.map((c, i) => (/[，、,。！？；：\s]/.test(c) ? i + 1 : -1)).filter(i => i > 0 && i < chars.length);
  const cut = cuts.length ? cuts.reduce((b, i) => (Math.abs(i - mid) < Math.abs(b - mid) ? i : b)) : Math.ceil(mid);
  return [chars.slice(0, cut).join('').replace(/[，、,]$/, ''), chars.slice(cut).join('')];
};
const Subtitle: React.FC<{ text: string }> = ({ text }) => {
  const lines = subLines(text);
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center' }}>
    <div style={{ background: 'rgba(0,0,0,.86)', borderRadius: 18, padding: '20px 36px', fontFamily: theme.font, fontWeight: 700, fontSize: fitLines(lines, 46, SUB_W, 32), lineHeight: 1.3, color: '#fff', whiteSpace: 'nowrap', textAlign: 'center' }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}</div>
  </div>;
};

export const Main: React.FC<{ plan: Plan; subs: Sub[]; transparent?: boolean; probe?: string }> = ({ plan, subs, transparent, probe }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  setPalette(plan.palette);
  const t = frame / fps;
  const scenes = [...plan.scenes].sort((a, b) => a.start - b.start);
  const full = scenes.filter(isFull);
  const chapters = plan.chapters || [];
  const chapterAt = (s: number) => { let i = 0; chapters.forEach((c, j) => { if (s >= c.start - 0.01) i = j; }); return chapters.length ? { index: i + 1, total: chapters.length, title: chapters[i].title, en: chapters[i].en, cn: chapters[i].title, color: chapters[i].color, brand: (plan as any).brand } : undefined; };
  const styleAt = (sc: Scene) => { let st = plan.style; chapters.forEach(c => { if (sc.start >= c.start - 0.01 && c.style) st = c.style; }); return sc.style || st; };
  const activeFull = full.find(s => t >= s.start && t < s.end);
  const fx = scenes.filter(s => s.personFx && t >= s.start && t < s.end).map(s => s.personFx);
  const fxK = (() => { const s = scenes.find(s => s.personFx && t >= s.start && t < s.end); if (!s) return 0; return Math.min(clamp((t - s.start) / 0.25), clamp((s.end - t) / 0.3)); })();
  const camera = scenes.find(s => s.camera && frame >= Math.round(s.start * fps) && frame < Math.round(s.end * fps))?.camera;
  const scale = cameraValue(camera?.keys, frame, fps, 1);
  const windowK = cameraValue(camera?.windowKeys, frame, fps, 0);
  const windowStyle: React.CSSProperties = windowK ? {
    transformOrigin: '0 0', transform: `translate(${96*windowK}px, ${174*windowK}px) scale(${1-0.34*windowK})`,
    borderRadius: 22*windowK, overflow: 'hidden',
  } : {};
  const personStyle: React.CSSProperties = {
    filter: fx.includes('mono') ? `saturate(${1 - 0.8 * fxK}) brightness(${1 - 0.15 * fxK})` : fx.includes('blur') ? `blur(${12 * fxK}px)` : undefined,
    transform: camera ? `scale(${scale})` : fx.includes('zoom') || fx.includes('mono') ? `scale(${1 + 0.06 * fxK})` : undefined,
    transformOrigin: `50% ${camera?.focusY ?? 92}%`,
  };
  const sub = subs.find(s => t >= s[0] && t < s[1])
    ?? subs.find(s => t >= s[0] - 0.05 && t < s[1] + 0.06);
  const mode = plan.subtitles?.mode ?? (plan.meta.burnedSubtitles === false ? 'always' : 'covered');
  const showSub = sub && (mode === 'always' || (mode === 'covered' && !!activeFull));
  const motionProps = (s:Scene) => ({_elements:s.elements ?? [],_accent:plan.palette?.main});

  return (
    <AbsoluteFill style={{ backgroundColor: transparent ? 'transparent' : windowK ? '#171424' : '#000', ...(probe ? { width: 1920, height: 1080, right: 'auto', bottom: 'auto' } : {}) }}>
      {/* 体检时把画面固定成 1920×1080：Remotion 外层容器的尺寸在测量那一刻可能还没设好 */}
      {!transparent && plan.meta.video && <AbsoluteFill style={windowStyle}><AbsoluteFill style={personStyle}><OffthreadVideo src={staticFile(plan.meta.video)} /></AbsoluteFill></AbsoluteFill>}
      {/* overlays next to the presenter */}
      {scenes.filter(s => !isFull(s)).map(s => {
        const C = OVERLAYS[s.type]; if (!C) return null;
        const from = Math.round(s.start * fps), d = Math.max(1, Math.round(s.end * fps) - from);
        return <Sequence key={s.id} from={from} durationInFrames={d} layout="none"><ThemeScope id={styleAt(s)}><C p={{ ...(s.props || {}), ...motionProps(s), _chapters: chapters, _duration: plan.meta.duration, _motionDetail: s.motionDetail, _motionNote: s.motionNote }} start={s.start} dur={d} side={(s.layout === 'right' ? 'right' : s.layout === 'left' ? 'left' : s.props?.side) as any} /></ThemeScope></Sequence>;
      })}
      {/* full-screen pages, chained with transitions */}
      {full.map((s, i) => {
        const C = FULL_PAGES[s.type]; if (!C) return null;
        const prev = full[i - 1], next = full[i + 1];
        const fromPage = !!prev && Math.abs(prev.start + (prev.end - prev.start) - s.start) < 0.15;
        const toPage = !!next && Math.abs(next.start - s.end) < 0.15;
        const from = Math.round(s.start * fps), d = Math.max(1, Math.round(s.end * fps) - from);
        const self = !!(C as any).selfTrans;
        const edges = { fromPerson: !fromPage && s.start >= 0.05, toPerson: !toPage };
        const kind = self ? 'none' : s.transition || (String(styleAt(s)).startsWith('report') && s.start >= 0.05 ? 'soft' : null) || (s.start < 0.05 ? 'none' : fromPage ? CYCLE[i % CYCLE.length] : 'circle');
        return (
          <Sequence key={s.id} from={from} durationInFrames={d + (toPage ? TR : 0)}>
            <ThemeScope id={styleAt(s)}><Exit dur={d} toPerson={!toPage && !self && s.transition !== 'none'} soft={kind === 'soft' || kind === 'none' && String(styleAt(s)).startsWith('report')}>
              <Enter kind={kind}><C p={{ ...(s.props || {}), ...motionProps(s), _motionDetail: s.motionDetail, _motionNote: s.motionNote }} start={s.start} dur={d} chapter={chapterAt(s.start)} bg={s.bg} video={plan.meta.video} {...({ edges } as any)} /></Enter>
            </Exit></ThemeScope>
          </Sequence>
        );
      })}
      {scenes.map(s => s.elements?.length && !SEMANTIC_LANES[s.type] && !SEMANTIC_PAGES[s.type] ? <Sequence key={s.id+'-elements'} from={Math.round(s.start*fps)} durationInFrames={Math.round(s.end*fps)-Math.round(s.start*fps)} layout="none"><MotionElements elements={s.elements} start={s.start} accent={plan.palette?.main}/></Sequence> : null)}
      {plan.chapterTimeline?.length ? <ProgressNav start={0} dur={Math.round(plan.meta.duration * fps)}
        p={{ compact: true, _chapters: plan.chapterTimeline, _duration: plan.meta.duration, color: plan.palette?.main }} /> : null}
      {setTheme(plan.style) && null}{showSub && <Subtitle text={sub![2]} />}
      {probe && <Probe tag={probe} />}
    </AbsoluteFill>
  );
};
