import { interpolate, spring, Easing } from 'remotion';

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const C = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

/** 0→1 progress between two frames with easing */
export const prog = (f: number, from: number, to: number, ease = Easing.bezier(0.22, 1, 0.36, 1)) =>
  interpolate(f, [from, to], [0, 1], { ...C, easing: ease });

/** springy entrance, starting at `delay` frames */
export const pop = (f: number, fps: number, delay = 0, config: any = { damping: 14, stiffness: 140, mass: 0.8 }) =>
  spring({ frame: f - delay, fps, config });

/** soft spring with no overshoot */
export const glide = (f: number, fps: number, delay = 0) =>
  spring({ frame: f - delay, fps, config: { damping: 200, stiffness: 90 } });

/** fade-out envelope for the last `len` frames of a scene */
export const exitK = (f: number, dur: number, len = 9) => interpolate(f, [dur - len, dur], [1, 0], C);

/** convert an absolute time (seconds, from plan.json) to a frame relative to the scene start */
export const rel = (absSec: any, sceneStart: number, fps: number, fallback = 0) =>
  typeof absSec !== 'number' || !isFinite(absSec) ? fallback : Math.round((absSec - sceneStart) * fps);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** deterministic pseudo random */
export const rnd = (seed: number) => {
  let a = seed | 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
