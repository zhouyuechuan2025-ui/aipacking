// 上一版模板包（M5 使用者视频工作台）的 54 个模板，接成本工作台的全屏页面
// 组件本身由 scripts/build-m5.mjs 从原项目打包而来（templates.generated.js），这里只做两件事：
//   1. 时间换算：原模板按 150 帧（5 秒）设计，用 <Freeze> 把「本页进度」换算成它们认识的第 0~149 帧，页面长短都能完整播完
//   2. 参数整理：分镜里写 title / subtitle / items / metric（和原模板包的字段一致），缺的按原规则补默认值
import React from 'react';
import { AbsoluteFill, Freeze, useCurrentFrame } from 'remotion';
import type { PageProps } from '../pages/full';
import { onColor } from '../lib/theme';
// 样式只在这批模板的页面里插入（见 build-m5.mjs 说明），不全局引入
import M5_CSS from './templates.css.generated';
// @ts-ignore 生成的 JS 模块，类型见 templates.generated.d.ts
import { external, M5SelectedOriginalRenderer } from './templates.generated.js';
import registry from './registry.json';

export type M5Entry = { id: string; order: number; key: string; name: string; source: string; category: string; role: string; signals: string[]; contract: Record<string, any> };
export const M5_REGISTRY = registry as M5Entry[];

/** 模板类型名：renderer_key 首字母大写（如 impactQuestionGlitch → ImpactQuestionGlitch） */
export const m5Type = (key: string) => key[0].toUpperCase() + key.slice(1);

// 两套默认配色，分镜里可以用 palette 覆盖：
// - 原工作台的组件：深蓝底 + 金色强调（原模板包的配色）
// - video-shotcraft 开源组件：它们本来按浅色画布设计（文字固定深灰 #2f2f2f），配深色底会看不清，所以回到浅色画布，强调色用浅底上看得清的深橙
const PALETTE = { canvas: '#07101b', panel: '#13213a', card: '#1c2e4d', accent: '#f2c66c', line: '#8ca2bd' };
const SHOTCRAFT = { canvas: '#ececea', panel: '#f7f7f6', card: '#ffffff', accent: '#C2410C', line: '#c2c2c0' };
// video-shotcraft 的组件并不统一：有的按浅色画布设计，有的按深色，还有「深底浅卡」「浅底深卡」的混合设计。
// 按两轮体检（全深色 / 全浅色）的对比度结果逐个指定；没列出的保持原模板包的深色配色。
const MIX_LIGHT_CANVAS = { canvas: '#ececea', panel: '#13213a', card: '#1c2e4d', accent: '#C2410C', line: '#8ca2bd' };
const MIX_DARK_CANVAS = { canvas: '#07101b', panel: '#f7f7f6', card: '#ffffff', accent: '#f2c66c', line: '#8ca2bd' };
const PALETTE_OF: Record<string, typeof PALETTE> = {
  cubeRotate: SHOTCRAFT, maskingTapeSlap: SHOTCRAFT, pillSlotCycle: SHOTCRAFT, sakugaTimingShift: SHOTCRAFT, timelineTravel: SHOTCRAFT, panelToCanvas: SHOTCRAFT,
  drawSvgTrace: SHOTCRAFT, lineCarryTransition: SHOTCRAFT, skeletonReveal: MIX_LIGHT_CANVAS,
  wordRelayFilmstrip: MIX_DARK_CANVAS, pageWaterfallWall: SHOTCRAFT, deckDealFlyIn: SHOTCRAFT,
};
// 出画面 / 被裁切本身就是动画效果的模板（跑马灯、里程表滚动、翻牌、瀑布墙、时间轴旅行、发牌入场）：体检只查对比度
const DECOR = new Set(['neonTripleMarquee', 'odometerDigitRoll', 'splitFlapFlip', 'pageWaterfallWall', 'timelineTravel', 'deckDealFlyIn']);
const FRAMES = 150;

const makePage = (t: M5Entry): React.FC<PageProps> => ({ p, dur }) => {
  const f = useCurrentFrame();
  const progress = Math.max(0, Math.min(1, f / Math.max(1, dur - 1)));
  const c = t.contract || {};
  const items: string[] = (p.items || []).slice(0, Number(c.max_items || 4));
  const fallback = Number(c.item_max_units || 8) <= 3 ? ['目标', '执行', '复核'] : ['先分析', '再匹配', '逐条验收'];
  while (items.length < Math.min(3, Number(c.max_items || 3))) items.push(fallback[items.length]);
  const Source = (external as any)[t.key];
  const palette = { ...(PALETTE_OF[t.key] || PALETTE), ...(p.palette || {}) };
  const content = { title: p.title || '', subtitle: p.subtitle || '', items, metric: String(p.metric ?? ''), palette, imageUrl: p.imageUrl };
  const settings = {
    ...content, quote: p.quote || content.subtitle,
    panelCanvasColor: palette.canvas, panelSurfaceColor: palette.panel, panelCardColor: palette.card, panelAccentColor: palette.accent, panelLineColor: palette.line,
    leftTitle: p.leftTitle || items[0] || '', rightTitle: p.rightTitle || items[1] || '', author: p.author || '',
  };
  return (
    // 没写字色的文字继承这里的颜色：按画布深浅自动选（以前固定浅色，浅色画布上就看不见）
    <AbsoluteFill className="m5-scope" style={{ background: palette.canvas, color: onColor(palette.canvas, '#2f2f2f', '#f3f3f3') }} {...(DECOR.has(t.key) ? { 'data-probe-decor': true } : {})}>
      <style>{M5_CSS}</style>
      <Freeze frame={Math.round(progress * (FRAMES - 1))}>
        <div className="m5-source-scale" style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }}>
          {Source ? <Source {...content} /> : <M5SelectedOriginalRenderer rendererKey={t.key} settings={settings} progress={progress} />}
        </div>
      </Freeze>
    </AbsoluteFill>
  );
};

export const M5_PAGES: Record<string, React.FC<PageProps>> = Object.fromEntries(M5_REGISTRY.map(t => [m5Type(t.key), makePage(t)]));
