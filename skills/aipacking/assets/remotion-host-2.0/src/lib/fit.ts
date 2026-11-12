// 自动缩字：文字放不下时缩小字号，而不是冲出画面或被裁切
// 用字符宽度估算（中文按 1 个字宽，英文数字按 0.5~0.65 个字宽），渲染前就能算出来，结果稳定

/** 估算一行文字的宽度，单位是「字号的倍数」 */
export const textEm = (text: string, letterSpacing = 0) => {
  let w = 0;
  for (const ch of String(text ?? '')) {
    if (/[⺀-鿿豈-﫿＀-￯　-〿]/.test(ch)) w += 1;       // 中日韩文字、全角标点
    else if (/[A-Z]/.test(ch)) w += 0.66;
    else if (/[a-z]/.test(ch)) w += 0.55;
    else if (/[0-9]/.test(ch)) w += 0.6;
    else if (ch === ' ') w += 0.3;
    else if (/[→←↑↓×✓✕]/.test(ch)) w += 0.9;
    else w += 0.5;
    w += letterSpacing;
  }
  return w;
};

/** 在 maxWidth 像素内放下这行字的字号：不超过 base，不小于 min */
export const fitSize = (text: string, base: number, maxWidth: number, min = Math.round(base * 0.45), letterSpacing = 0) =>
  Math.max(min, Math.min(base, Math.floor(maxWidth / Math.max(0.01, textEm(text, letterSpacing)))));

/** 多行共用一个字号（取最长那行能放下的字号），保证几行字大小一致 */
export const fitLines = (lines: string[], base: number, maxWidth: number, min?: number, letterSpacing = 0) =>
  Math.min(...lines.map(l => fitSize(l, base, maxWidth, min, letterSpacing)), base);
