// 风格包（Style Packs）。模板只引用语义色名（cyan/violet/pink/gold/red/green）和 CSS 变量，
// 换风格包 = 换一套配色/字体/背景/面板质感，50 个模板自动跟随。
// 各风格的配色与字体参考 LemoLab「lemo-opuscar」对应 STYLE.md（CC BY 4.0，署名 LemoLab）。

export type PanelKind = 'glass' | 'paper' | 'hand' | 'block' | 'sticker';
export type StageKind = 'lightfield' | 'keynote' | 'board' | 'paper' | 'swiss' | 'show';
export type Theme = {
  id: string; name: string; dark: boolean; stage: StageKind;
  bg: string; ink: string; inkDim: string; inkFaint: string;
  chipBg: string; chipBorder: string; chipSolid: string; titleShadow: string;
  accents: Record<string, string>;
  font: string; display: string; mono: string; hand?: string;
  panel: { kind: PanelKind; bg: string; border: string; radius: number; shadow: string; ink?: string; inkDim?: string; beam: boolean };
  glass: { background: string; border: string; blur: string; radius: number };
  lowerCaseEn?: boolean;
};

const SANS = '"PingFang SC","Noto Sans SC","Noto Sans CJK SC","Microsoft YaHei","Source Han Sans SC",system-ui,sans-serif';
const MONO = '"JetBrains Mono","SF Mono","Cascadia Code",Menlo,Consolas,"Noto Sans Mono CJK SC",monospace';
const SERIF = '"Songti SC","Noto Serif SC","Noto Serif CJK SC","Source Han Serif SC",STSong,SimSun,serif';
const KAI = '"Kaiti SC",STKaiti,KaiTi,"楷体","LXGW WenKai","Noto Serif CJK SC",serif';

const base = {
  glass: { background: 'rgba(14,16,30,0.55)', border: '1px solid rgba(200,210,255,0.16)', blur: 'blur(28px) saturate(150%)', radius: 28 },
};

// inkFaint（淡色文字）按「对背景至少 4.6:1」算出来，保证小字也看得清；改背景色时要重新算
export const THEMES: Record<string, Theme> = {
  // 科技暗黑 + 体积光（默认）
  'tech-dark': { ...base, id: 'tech-dark', name: '科技暗黑·体积光', dark: true, stage: 'lightfield', bg: '#05060b',
    ink: '#ffffff', inkDim: 'rgba(255,255,255,.72)', inkFaint: '#78797B', chipBg: 'rgba(255,255,255,.07)', chipBorder: 'rgba(255,255,255,.14)', chipSolid: 'rgba(12,14,28,.65)', titleShadow: '0 10px 60px rgba(0,0,0,.5)',
    accents: { cyan: '#5ee7ff', violet: '#8b7bff', pink: '#ff6fd8', gold: '#ffc94d', red: '#ff4d5e', green: '#3be3b0' },
    font: SANS, display: SANS, mono: MONO,
    panel: { kind: 'glass', bg: 'rgba(12,14,28,0.72)', border: '1px solid rgba(200,210,255,0.16)', radius: 28, shadow: '0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.16)', beam: true } },
  // 暗色科技发布（dark-keynote）：近黑舞台、发丝网格、唯一品牌色
  keynote: { ...base, id: 'keynote', name: '暗色科技发布', dark: true, stage: 'keynote', bg: '#0A0B0F',
    ink: '#E8EAF0', inkDim: '#8A90A0', inkFaint: '#7B7D82', chipBg: '#1A1E28', chipBorder: 'rgba(255,255,255,.08)', chipSolid: '#12151C', titleShadow: 'none',
    accents: { cyan: '#B7F34A', violet: '#7E95FF', pink: '#F2A65A', gold: '#B7F34A', red: '#FF5A5F', green: '#B7F34A' },
    font: '"Inter","SF Pro Display",' + SANS, display: '"Inter Tight","Inter","SF Pro Display",' + SANS, mono: MONO,
    panel: { kind: 'glass', bg: '#12151C', border: '1px solid rgba(255,255,255,.08)', radius: 18, shadow: '0 24px 60px rgba(0,0,0,.5)', beam: false } },
  // 白板讲解（whiteboard）：暖白板、马克笔黑蓝橙、手写字
  whiteboard: { ...base, id: 'whiteboard', name: '白板讲解', dark: false, stage: 'board', bg: '#f6f6f3',
    ink: '#23262c', inkDim: 'rgba(35,38,44,.72)', inkFaint: '#6D6F72', chipBg: 'rgba(35,38,44,.04)', chipBorder: 'rgba(35,38,44,.5)', chipSolid: 'rgba(255,255,255,.7)', titleShadow: 'none',
    accents: { cyan: '#2a5cb3', violet: '#2a5cb3', pink: '#d97757', gold: '#d97757', red: '#c8372d', green: '#2f7d4f' },
    font: KAI, display: KAI, mono: '"Architects Daughter",' + MONO, hand: KAI,
    panel: { kind: 'hand', bg: 'rgba(255,255,255,.55)', border: '3px solid #23262c', radius: 14, shadow: 'none', beam: false } },
  // 数据叙事（dataviz）：纸张、墨色、红蓝铅笔
  dataviz: { ...base, id: 'dataviz', name: '数据叙事', dark: false, stage: 'paper', bg: '#F6F3EC',
    ink: '#2B2723', inkDim: '#6E665C', inkFaint: '#706C67', chipBg: 'rgba(43,39,35,.04)', chipBorder: '#DDD6C9', chipSolid: '#FFFFFF', titleShadow: 'none',
    accents: { cyan: '#2166AC', violet: '#4393C3', pink: '#D6604D', gold: '#D97757', red: '#B2182B', green: '#1B7837' },
    font: SERIF, display: SERIF, mono: '"IBM Plex Mono",' + MONO, hand: '"Caveat",' + KAI,
    panel: { kind: 'paper', bg: '#FFFFFF', border: '1px solid #DDD6C9', radius: 4, shadow: '0 1px 0 #DDD6C9, 0 18px 40px rgba(43,39,35,.08)', beam: false } },
  // 瑞士动态排版（swiss-motion）：灰白纸、纯黑、信号红、网格
  swiss: { ...base, id: 'swiss', name: '瑞士动态排版', dark: false, stage: 'swiss', bg: '#EAE9E5',
    ink: '#111111', inkDim: 'rgba(17,17,17,.7)', inkFaint: '#686766', chipBg: '#FFFFFF', chipBorder: '#111111', chipSolid: '#FFFFFF', titleShadow: 'none',
    accents: { cyan: '#111111', violet: '#111111', pink: '#E30613', gold: '#E30613', red: '#E30613', green: '#111111' },
    font: '"Helvetica Neue","Archivo",Arial,' + SANS, display: '"Helvetica Neue","Archivo",Arial,' + SANS, mono: '"Helvetica Neue",Arial,' + SANS,
    panel: { kind: 'block', bg: '#FFFFFF', border: 'none', radius: 0, shadow: 'none', beam: false }, lowerCaseEn: true },
  // 综艺节奏扁平（game-show）：紫色舞台、糖果色、粗描边硬投影
  gameshow: { ...base, id: 'gameshow', name: '综艺节奏扁平', dark: true, stage: 'show', bg: '#6B4FBB',
    ink: '#FFFFFF', inkDim: 'rgba(255,255,255,.85)', inkFaint: '#E3DEF2', chipBg: 'rgba(255,255,255,.16)', chipBorder: 'rgba(27,27,27,.6)', chipSolid: '#3E2C86', titleShadow: '6px 6px 0 #1B1B1B',
    accents: { cyan: '#8ED1FC', violet: '#4D7CFE', pink: '#FF8FB1', gold: '#FFD23F', red: '#FF5A5F', green: '#5BD68A' },
    font: '"Noto Sans SC","PingFang SC","Noto Sans CJK SC",' + SANS, display: '"Fredoka","Noto Sans SC","Noto Sans CJK SC",' + SANS, mono: '"Fredoka",' + SANS,
    panel: { kind: 'sticker', bg: '#FFF6E5', border: '7px solid #1B1B1B', radius: 30, shadow: '12px 12px 0 #1B1B1B', ink: '#1B1B1B', inkDim: 'rgba(27,27,27,.72)', beam: false } },
  // 专业报告·苹果风（report）：石墨灰、iOS 系统色、SF 字体气质
  report: { ...base, id: 'report', name: '专业报告·苹果风', dark: true, stage: 'keynote', bg: '#151517',
    ink: '#F5F5F7', inkDim: '#A1A1A6', inkFaint: '#818183', chipBg: 'rgba(255,255,255,.06)', chipBorder: 'rgba(255,255,255,.1)', chipSolid: '#252528', titleShadow: 'none',
    accents: { cyan: '#64D2FF', blue: '#0A84FF', violet: '#BF5AF2', pink: '#FF375F', gold: '#FFD60A', orange: '#FF9F0A', red: '#FF453A', green: '#30D158' },
    font: '"SF Pro Text","Inter",' + SANS, display: '"SF Pro Display","Inter",' + SANS, mono: MONO,
    panel: { kind: 'glass', bg: '#252528', border: '1px solid rgba(255,255,255,.08)', radius: 28, shadow: '0 40px 90px rgba(0,0,0,.5)', beam: false } },
  'report-light': { ...base, id: 'report-light', name: '专业报告·苹果浅色', dark: false, stage: 'keynote', bg: '#F5F5F7',
    ink: '#1D1D1F', inkDim: '#6E6E73', inkFaint: '#6F6F71', chipBg: 'rgba(0,0,0,.04)', chipBorder: 'rgba(0,0,0,.08)', chipSolid: '#FFFFFF', titleShadow: 'none',
    accents: { cyan: '#0A84FF', blue: '#007AFF', violet: '#AF52DE', pink: '#FF2D55', gold: '#F5A300', orange: '#FF9500', red: '#FF3B30', green: '#28B04F' },
    font: '"SF Pro Text","Inter",' + SANS, display: '"SF Pro Display","Inter",' + SANS, mono: MONO,
    panel: { kind: 'paper', bg: '#FFFFFF', border: '1px solid rgba(0,0,0,.04)', radius: 28, shadow: '0 24px 60px rgba(30,30,60,.10)', beam: false } },
  'report-glass': { ...base, id: 'report-glass', name: '专业报告·弥散玻璃', dark: false, stage: 'keynote', bg: '#F3F0F8',
    ink: '#1D1D1F', inkDim: '#55555C', inkFaint: '#6C6B6F', chipBg: 'rgba(255,255,255,.5)', chipBorder: 'rgba(255,255,255,.85)', chipSolid: 'rgba(255,255,255,.7)', titleShadow: 'none',
    accents: { cyan: '#0A84FF', blue: '#007AFF', violet: '#AF52DE', pink: '#FF2D55', gold: '#F09A00', orange: '#FF9500', red: '#FF3B30', green: '#28B04F' },
    font: '"SF Pro Text","Inter",' + SANS, display: '"SF Pro Display","Inter",' + SANS, mono: MONO,
    panel: { kind: 'glass', bg: 'rgba(255,255,255,.86)', border: '1.5px solid rgba(255,255,255,.85)', radius: 28, shadow: '0 30px 70px rgba(60,40,90,.14)', beam: false } },
  'report-blur': { ...base, id: 'report-blur', name: '专业报告·人物虚化', dark: false, stage: 'keynote', bg: '#E9DDD2',
    ink: '#1D1D1F', inkDim: '#55555C', inkFaint: '#64605E', chipBg: 'rgba(255,255,255,.5)', chipBorder: 'rgba(255,255,255,.85)', chipSolid: 'rgba(255,255,255,.7)', titleShadow: 'none',
    accents: { cyan: '#0A84FF', blue: '#007AFF', violet: '#AF52DE', pink: '#FF2D55', gold: '#E08A00', orange: '#FF9500', red: '#FF3B30', green: '#28B04F' },
    font: '"SF Pro Text","Inter",' + SANS, display: '"SF Pro Display","Inter",' + SANS, mono: MONO,
    panel: { kind: 'glass', bg: 'rgba(255,255,255,.86)', border: '1.5px solid rgba(255,255,255,.85)', radius: 28, shadow: '0 30px 70px rgba(60,40,90,.14)', beam: false } },
  editorial: { ...base, id: 'editorial', name: '编辑设计·发布会排版', dark: false, stage: 'swiss', bg: '#F2F1ED',
    ink: '#0A0A0B', inkDim: '#55555A', inkFaint: '#6B6B6A', chipBg: 'rgba(10,10,11,.04)', chipBorder: 'rgba(10,10,11,.14)', chipSolid: '#FFFFFF', titleShadow: 'none',
    accents: { cyan: '#2F5BFF', blue: '#2F5BFF', violet: '#2F5BFF', pink: '#FF3B1F', gold: '#FF3B1F', orange: '#FF3B1F', red: '#FF3B1F', green: '#0A0A0B' },
    // 只用随包字体（src/lib/fonts.ts）
    font: '"Inter Tight","Noto Sans SC",sans-serif', display: '"Inter Tight","Noto Sans SC",sans-serif', mono: '"JetBrains Mono","Noto Sans SC",monospace',
    panel: { kind: 'block', bg: '#FFFFFF', border: 'none', radius: 0, shadow: 'none', beam: false } },
};

/** 把颜色往黑（或白）调，直到对 against 的对比度达到 min，色相不变 */
const ensureContrast = (c: string, against: string, min: number) => {
  const hex = /^#([0-9a-f]{6})$/i.exec(c); if (!hex) return c;
  const rgb = [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16)); const La = luminance(against); const target = La > 0.4 ? 0 : 255;
  for (let t = 0; t <= 1.001; t += 0.04) {
    const out = '#' + rgb.map(v => Math.round(v + (target - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
    const L = luminance(out); if ((Math.max(L, La) + 0.05) / (Math.min(L, La) + 0.05) >= min) return out;
  }
  return c;
};
// 强调色要能直接当大字、图标、数字用：浅色主题对纯白至少 3.2:1，深色主题对背景至少 3.2:1（不够就自动加深/提亮）
// 淡色文字：浅色主题背景中间常有接近纯白的高光，所以按纯白再保证一次 4.6:1
for (const t of Object.values(THEMES)) {
  // 浅色主题按主题自己的背景色算（它比纯白暗，更严格；达标了对纯白也一定达标）
  const against = t.bg;
  t.accents = Object.fromEntries(Object.entries(t.accents).map(([k, v]) => [k, ensureContrast(v, against, t.dark ? 3.2 : 3.8)])) as any; // 浅色主题的实际背景常带灰，多留余量
  if (!t.dark) { t.inkFaint = ensureContrast(t.inkFaint, t.bg, 5); t.inkDim = ensureContrast(t.inkDim, t.bg, 6); }
}

let CUR: Theme = THEMES['tech-dark'];
// 每条视频按主题换强调色（plan.palette）：main 换掉风格包的主强调色，alert 换掉警示色（否定/划线），其余不动
export type Palette = { main?: string; alert?: string };
let PAL: Palette | undefined;
const derived = new Map<string, Theme>();
export const setPalette = (p?: Palette) => { PAL = p && (p.main || p.alert) ? p : undefined; };
const withPalette = (t: Theme): Theme => {
  if (!PAL) return t;
  const key = `${t.id}|${PAL.main}|${PAL.alert}`; const hit = derived.get(key); if (hit) return hit;
  const main0 = t.accents.cyan, alert0 = t.accents.red, min = t.dark ? 3.2 : 3.8;
  const accents = Object.fromEntries(Object.entries(t.accents).map(([k, v]) => [k,
    PAL!.main && v === main0 ? ensureContrast(PAL!.main, t.bg, min) : PAL!.alert && v === alert0 ? ensureContrast(PAL!.alert, t.bg, min) : v]));
  const out = { ...t, accents }; derived.set(key, out); return out;
};
export const setTheme = (id?: string) => { CUR = withPalette(THEMES[id || 'tech-dark'] || THEMES['tech-dark']); return CUR; };
export const currentTheme = () => CUR;
/** `theme.xxx` always reads the style pack that is currently rendering */
export const theme: Theme = new Proxy({} as Theme, { get: (_t, k: string) => (CUR as any)[k] });
export type AccentName = string;
/** 把 #hex / rgb() 颜色换算成相对亮度（WCAG） */
export function luminance(c: string) {
  let r = 0, g = 0, b = 0; const s = String(c).trim();
  const hex = /^#([0-9a-f]{6}|[0-9a-f]{3})\b/i.exec(s); // 先匹配 6 位，否则 #E8EAF0 会被当成 #E8E
  if (hex) { const h = hex[1].length === 3 ? hex[1].split('').map(x => x + x).join('') : hex[1]; [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  else { const m = /rgba?\(([^)]+)\)/.exec(s); if (m) [r, g, b] = m[1].split(',').map(Number); else return 0.5; }
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
/** 放在某个底色上的文字该用什么颜色：底深用白字，底浅用黑字（按钮、标签、头像、色块上的字都用它，不要写死 var(--ink)） */
export const onColor = (bg: string | string[], dark = '#111114', light = '#FFFFFF') => {
  // 渐变底传多个颜色：选在每一段上都尽量看得清的那个（取最差处的对比度比较）
  const Ls = (Array.isArray(bg) ? bg : [bg]).map(luminance); const Ld = luminance(dark);
  const onLight = Math.min(...Ls.map(L => 1.05 / (L + 0.05))), onDark = Math.min(...Ls.map(L => (L + 0.05) / (Ld + 0.05)));
  return onLight >= onDark ? light : dark;
};

export const accent = (a?: AccentName) => (a && CUR.accents[a]) || (a && a.startsWith('#') ? a : CUR.accents.cyan);

/** 小字用的强调色：在当前主题背景上加深（浅色主题）或提亮（深色主题），直到对比度 ≥ 5:1，色相不变 */
export const accentText = (a?: AccentName, bg?: string) => {
  const base = accent(a); const B = bg || CUR.bg; const Lb = luminance(B);
  const hex = /^#([0-9a-f]{6})/i.exec(base); if (!hex) return base;
  const rgb = [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16));
  const target = Lb > 0.4 ? 0 : 255; // 浅色背景往黑调，深色背景往白调
  for (let t = 0; t <= 1.001; t += 0.05) {
    const c = '#' + rgb.map(v => Math.round(v + (target - v) * t).toString(16).padStart(2, '0')).join('');
    const L = luminance(c); if ((Math.max(L, Lb) + 0.05) / (Math.min(L, Lb) + 0.05) >= 5) return c; // 目标 5:1，比 4.5 多留余量（实际背景常有网格线、纹理）
  }
  return target ? '#FFFFFF' : '#111114';
};
/** CSS variables that templates use for text/chips, so light and dark packs both read correctly */
export const themeVars = (t: Theme = CUR): Record<string, string> => ({
  '--ink': t.ink, '--ink-dim': t.inkDim, '--ink-faint': t.inkFaint, '--chip-bg': t.chipBg, '--chip-border': t.chipBorder, '--chip-solid': t.chipSolid, '--title-shadow': t.titleShadow,
});
