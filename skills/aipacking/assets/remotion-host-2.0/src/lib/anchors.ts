// 时间锚点：分镜里的 at / xxxAt 可以写秒数，也可以写原句里的关键词（推荐）。
// 写关键词时，在本页时间附近的字幕里找到这个词，按它在句子中的位置换算成秒数。
//   "at": "绝望"      → 这个词开始说出口的时刻
//   "at": "绝望#2"    → 本页范围内第 2 次出现
// Node 脚本（validate/qa）和 Remotion 渲染共用这一份逻辑。

export type Sub = [number, number, string];
export type AnchorIssue = { scene: string; path: string; word: string; reason: string };

const isAtKey = (k: string) => k === 'at' || k.endsWith('At');
/** 入场动画要 0.2~0.3 秒，提前一点，元素正好在说到这个词时落定 */
const LEAD = 0.2;

/** 在 [from, to] 时间范围内的字幕里找关键词，返回它开始说出口的秒数 */
export const findWord = (subs: Sub[], word: string, from: number, to: number): number | null => {
  const m = /^(.*?)(?:#(\d+))?$/.exec(word.trim())!;
  const w = m[1]; let nth = m[2] ? +m[2] : 1;
  if (!w) return null;
  for (const [a, b, text] of subs) {
    if (b < from || a > to) continue;
    let i = text.indexOf(w);
    while (i >= 0) {
      if (--nth === 0) return +Math.max(from, a + (b - a) * (i / Math.max(1, text.length)) - LEAD).toFixed(2);
      i = text.indexOf(w, i + 1);
    }
  }
  return null;
};

/** 把整份分镜里的关键词锚点换算成秒数；找不到的词记进 issues，并退回到本页开始时间 */
export const resolvePlan = <P extends { scenes: any[] }>(plan: P, subs: Sub[], issues: AnchorIssue[] = []): P => {
  const scenes = plan.scenes.map(s => {
    // 先在本页时间内找（避免匹配到前一句里同样的词），找不到再放宽到前后 0.8 秒；结果不早于本页开始
    const findIn = (w: string) => { const t = findWord(subs, w, s.start, s.end) ?? findWord(subs, w, s.start - 0.8, s.end + 0.8); return t == null ? null : Math.min(s.end, Math.max(s.start, t)); };
    const walk = (o: any, path: string): any => {
      if (Array.isArray(o)) return o.map((v, i) => walk(v, `${path}${i}.`));
      if (!o || typeof o !== 'object') return o;
      const out: any = {};
      for (const [k, v] of Object.entries(o)) {
        if (isAtKey(k) && typeof v === 'string') {
          const t = findIn(v);
          if (t == null) issues.push({ scene: s.id, path: path + k, word: v, reason: '在本页时间附近的字幕里找不到这个词' });
          out[k] = t ?? s.start;
        } else out[k] = walk(v, `${path}${k}.`);
      }
      return out;
    };
    return { ...s, props: walk(s.props || {}, '') };
  });
  return { ...plan, scenes };
};
