import { Easing, interpolate } from 'remotion';

export type Camera = { keys?: [number, number][]; focusY?: number; windowKeys?: [number, number][] };

export function cameraValue(keys: Camera['keys'], frame: number, fps: number, fallback: number) {
  if (!keys) return fallback;
  const frames = keys.map(([second]) => Math.round(second * fps));
  return interpolate(frame, frames, keys.map(([, value]) => value), {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
}
