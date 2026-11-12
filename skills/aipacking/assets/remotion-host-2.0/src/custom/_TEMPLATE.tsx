// 复制这个文件来写一个新页面（现场定制）。规则：
// 1) 必须用 <Stage> 包裹，保证背景/章节条/暗角统一；2) 所有动画只依赖 useCurrentFrame()；
// 3) 用 useT(start).at(绝对秒) 把 plan.json 里的时间点转成本页帧；4) 颜色只用 accent('cyan'|'violet'|'pink'|'gold'|'red'|'green')。
import React from 'react';
import { Stage, useT, PageProps } from '../pages/full';
import { Glass, Kinetic, Tag, Pill, Stamp, CountUp, Shine } from '../ui';
import { theme, accent } from '../lib/theme';
import { pop, prog, glide, clamp, lerp } from '../lib/anim';

export const MyScene: React.FC<PageProps> = ({ p, start, dur, chapter, bg }) => {
  const { f, fps, at } = useT(start);
  const col = p.color || 'cyan';
  return (
    <Stage bg={bg || { variant: 'silk', a: col, b: 'violet' }} chapter={chapter} color={col}>
      <div style={{ position: 'absolute', left: 110, top: 170 }}>
        <Tag color={col}>{p.kicker}</Tag>
        <Kinetic text={p.title || ''} size={88} delay={2} />
      </div>
      {/* 在这里自由设计 */}
    </Stage>
  );
};
