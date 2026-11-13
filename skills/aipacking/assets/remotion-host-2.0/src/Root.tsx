import React from 'react';
import { Composition } from 'remotion';
import { Main, Plan } from './Main';
import plan from '../plan/plan.json';
import subs from '../plan/subs.json';
import { preloadFonts } from './lib/fonts';
import { resolvePlan } from './lib/anchors';
import { MotionGallery, motionIds, pageFrames, perPage } from './motion/MotionGallery';

preloadFonts(plan, subs);

const P = resolvePlan(plan as unknown as Plan, subs as any); // 关键词锚点 → 秒数
const dur = Math.round(P.meta.duration * P.meta.fps);
// 所有模板按 1920×1080 设计；4K/720p 的横屏素材会自动缩放铺满

export const Root: React.FC = () => (
  <>
    {/* 成片：口播视频 + 动效包装 + 必要时重绘字幕 */}
    <Composition id="Final" component={Main as any} durationInFrames={dur} fps={P.meta.fps} width={1920} height={1080}
      defaultProps={{ plan: P, subs: subs as any, transparent: false }} />
    {/* 透明包装层：导出 ProRes 4444 MOV，叠在原视频上继续剪 */}
    <Composition id="Overlay" component={Main as any} durationInFrames={dur} fps={P.meta.fps} width={1920} height={1080}
      defaultProps={{ plan: P, subs: subs as any, transparent: true }} />
    <Composition id="MotionGallery" component={MotionGallery} durationInFrames={Math.ceil(motionIds.length/perPage)*pageFrames}
      fps={30} width={1920} height={1080} />
  </>
);
