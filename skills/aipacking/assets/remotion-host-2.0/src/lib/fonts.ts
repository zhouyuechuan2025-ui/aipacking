// 随包字体（均为 OFL 开源许可，本地打包，不依赖系统字体和外网）
// 思源黑体 Noto Sans SC / Inter Tight / JetBrains Mono
import { continueRender, delayRender } from 'remotion';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-sans-sc/900.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/700.css';
import '@fontsource/inter-tight/900.css';
import '@fontsource/jetbrains-mono/400.css';

const FACES = [
  // 不打包 800：代码里写 800 的地方浏览器会自动用 900 显示，少加载一套字形能明显加快渲染
  ['Noto Sans SC', [400, 700, 900]],
  ['Inter Tight', [400, 700, 900]],
  ['JetBrains Mono', [400]],
] as const;

/** 收集会上屏的全部文字，按字形预加载（中文字体按 unicode 分片，只下载用到的字），加载完才开始渲染 */
export const preloadFonts = (plan: unknown, subs: unknown) => {
  const chars = new Set<string>('0123456789%+-=→↓↑✓✕×·/:.,，。？！ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  const walk = (o: unknown) => {
    if (typeof o === 'string') for (const c of o) chars.add(c);
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };
  walk(plan); walk(subs);
  const text = [...chars].join('');
  const handle = delayRender('加载字体');
  Promise.all(FACES.flatMap(([family, weights]) => weights.map(w => document.fonts.load(`${w} 40px "${family}"`, text))))
    .catch(e => console.warn('字体加载失败，将使用系统字体', e))
    .finally(() => continueRender(handle));
};
