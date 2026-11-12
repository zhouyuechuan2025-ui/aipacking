// 模板体检探针：只在体检脚本（scripts/lab.mjs）里启用。
// 渲染完一帧后测量页面上每一段文字的实际位置，把问题通过 console 回传给脚本。
import React, { useLayoutEffect, useState } from 'react';
import { continueRender, delayRender, useCurrentFrame } from 'remotion';

const W = 1920, H = 1080;
const SUB_ZONE = 930; // 底部字幕区（重绘字幕约在 y > 950）

type Box = { text: string; x: number; y: number; w: number; h: number; size: number; color: number[] | null; op: number; decor: boolean };

/** 文字的实际颜色；渐变字/描边字（填充透明）返回 null，不参与对比度检查 */
const textColor = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  // SVG 文字的颜色是 fill，不是 color
  const fill = el instanceof SVGElement ? cs.fill : (cs as any).webkitTextFillColor || cs.color;
  const m = /rgba?\(([^)]+)\)/.exec(fill); if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(',').map(Number);
  return a < 0.5 ? null : [r, g, b];
};

const effOpacity = (el: Element | null) => {
  let o = 1;
  for (let e = el as HTMLElement | null; e && e !== document.body; e = e.parentElement) {
    const cs = getComputedStyle(e);
    o *= +cs.opacity;
    if (cs.visibility === 'hidden' || cs.display === 'none') return 0;
  }
  return o;
};

/** 找出文字被祖先 overflow:hidden 裁掉的部分 */
const clipped = (el: HTMLElement, r: { left: number; top: number; right: number; bottom: number }, stop: Element) => {
  // 只检查画面内部的容器，画面外层是 Remotion 自己的包装
  for (let e = el.parentElement; e && e !== stop && e !== document.body; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden') {
      const p = e.getBoundingClientRect();
      const cut = Math.max(0, p.left - r.left) + Math.max(0, r.right - p.right) + Math.max(0, p.top - r.top) + Math.max(0, r.bottom - p.bottom);
      if (cut > 6) return true;
    }
  }
  return false;
};

export const Probe: React.FC<{ tag: string }> = ({ tag }) => {
  const frame = useCurrentFrame();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender('体检测量'));
  useLayoutEffect(() => {
    // 等字体和布局稳定再测
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      const issues: string[] = []; const boxes: Box[] = [];
      // 画面根节点：Remotion 渲染时画面在一个偏移/缩放过的容器里，坐标要换算回 1920×1080
      const R0 = rootRef.current!.getBoundingClientRect(); const sx = R0.width / W || 1;
      const toLocal = (r: DOMRect) => ({ left: (r.left - R0.left) / sx, top: (r.top - R0.top) / sx, right: (r.right - R0.left) / sx, bottom: (r.bottom - R0.top) / sx, width: r.width / sx, height: r.height / sx });
      // 逐字动画里每个字是单独元素：按最近的块级祖先把同一行的字合并成一段
      const groups = new Map<Element, { el: HTMLElement; text: string; l: number; t: number; r: number; b: number; v: { left: number; top: number; right: number; bottom: number } }>();
      // 只在本实例的画面里找文字（Remotion 可能在屏幕外另放一份画面）
      const walker = document.createTreeWalker(rootRef.current!.parentElement!, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = (n.textContent || '').trim();
        const el = n.parentElement as HTMLElement;
        if (!text || !el || el.closest('[data-probe-skip]')) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        const vr = range.getBoundingClientRect(); const r = toLocal(vr);
        if (r.width < 1 || r.height < 1 || effOpacity(el) < 0.3) continue;
        // 只合并 HTML 行内 span（逐字动画），SVG 文字各自独立
        let blk: HTMLElement = el; while (blk.tagName === 'SPAN' && blk.parentElement && /^inline/.test(getComputedStyle(blk).display)) blk = blk.parentElement;
        const g = groups.get(blk);
        if (g) { g.text += text; g.l = Math.min(g.l, r.left); g.t = Math.min(g.t, r.top); g.r = Math.max(g.r, r.right); g.b = Math.max(g.b, r.bottom); g.v = { left: Math.min(g.v.left, vr.left), top: Math.min(g.v.top, vr.top), right: Math.max(g.v.right, vr.right), bottom: Math.max(g.v.bottom, vr.bottom) }; }
        else groups.set(blk, { el, text, l: r.left, t: r.top, r: r.right, b: r.bottom, v: { left: vr.left, top: vr.top, right: vr.right, bottom: vr.bottom } });
      }
      for (const [blk, g] of groups) {
        const el = g.el; const text = g.text;
        const size = parseFloat(getComputedStyle(el).fontSize);
        // 行框比字形高（行高留白），上下各收一点，按字形的实际占位判断重叠和裁切
        const ins = Math.max(0, (Math.min(g.b - g.t, size * 1.6) - size * 0.9) / 2);
        const r = { left: g.l, top: g.t + ins, right: g.r, bottom: g.b - ins, width: g.r - g.l, height: g.b - g.t - 2 * ins };
        g.v = { ...g.v, top: g.v.top + ins * sx, bottom: g.v.bottom - ins * sx };
        const b = { text: text.slice(0, 16), x: r.left, y: r.top, w: r.width, h: r.height, size, color: textColor(el), op: effOpacity(el), decor: !!el.closest('[data-probe-decor]') };
        boxes.push(b);
        const out = Math.max(0, -r.left) + Math.max(0, r.right - W) + Math.max(0, -r.top) + Math.max(0, r.bottom - H);
        // 完全在画面外的文字属于动画设计（滚动墙、横移镜头），不算问题；只抓一半在画面里被切掉的
        if (r.right <= 0 || r.left >= W || r.bottom <= 0 || r.top >= H) { boxes.pop(); continue; }
        // 装饰元素（data-probe-decor：印章、翻页牌、滚动墙、横移镜头的箭头）允许出画面、被裁切、盖字，但对比度照查
        if (b.decor) { /* 只查对比度 */ }
        else if (out > 6) issues.push(`出画面：「${b.text}」超出 ${Math.round(out)}px`);
        else if (clipped(blk as HTMLElement, g.v, rootRef.current!.parentElement!)) issues.push(`被裁切：「${b.text}」`);
        if (parseFloat(getComputedStyle(el).fontSize) < 15 && /[一-龥]/.test(text)) issues.push(`中文太小：「${b.text}」${parseFloat(getComputedStyle(el).fontSize)}px`);
      }
      // 文字互相重叠（面积交叠超过较小者的 25%）
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], c = boxes[j];
        const ix = Math.max(0, Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x));
        const iy = Math.max(0, Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y));
        // 印章这类故意盖在字上的元素（data-probe-decor）只免重叠检查，对比度照查
        if (!a.decor && !c.decor && a.text !== c.text && ix * iy > 0.25 * Math.min(a.w * a.h, c.w * c.h)) issues.push(`文字重叠：「${a.text}」和「${c.text}」`);
      }
      const inSub = boxes.filter(b => b.y + b.h > SUB_ZONE && b.y < H).map(b => b.text);
      const area = boxes.reduce((s, b) => s + b.w * b.h, 0) / (W * H);
      const maxSize = Math.max(0, ...boxes.map(b => b.h));
      console.log('__PROBE__' + JSON.stringify({ tag, frame, texts: boxes.length, boxes: boxes.map(b => [b.text, Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h), b.color, +b.op.toFixed(2), Math.round(b.size)]), R0: [R0.left, R0.top, R0.width], area: +area.toFixed(3), maxH: Math.round(maxSize), inSub, issues: [...new Set(issues)] }));
      continueRender(handle);
    }));
  }, [frame]);
  return <div ref={rootRef} data-probe-skip style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, pointerEvents: 'none' }} />;
};
