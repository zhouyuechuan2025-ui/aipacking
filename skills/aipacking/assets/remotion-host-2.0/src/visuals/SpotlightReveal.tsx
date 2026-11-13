// Modified from video-shotcraft CornerSpotlightReveal (Apache-2.0),
// 3ac67b75dd0b3bc2fd807c17f6b7ce35373eef3d.
// Replaces demo UI with plan layers and makes the original moving radial mask fit the local box.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export function SpotlightReveal({width, height, duration, frame, children}: React.PropsWithChildren<{
  width: number; height: number; duration: number; frame:number;
}>) {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const diagonal = Math.hypot(width, height);
  const r = diagonal * (0.075 + 1.15 * progress);
  const cx = width * (0.08 + 0.15 * progress);
  const cy = height * (0.09 + 0.15 * progress);
  const feather = r * 0.85;
  const mask = `radial-gradient(circle ${r + feather}px at ${cx}px ${cy}px, white ${((r - feather * 0.25) / (r + feather)) * 100}%, transparent 100%)`;
  const glow = interpolate(progress, [0, 0.10, 0.60, 0.90], [0, 0.55, 0.2, 0], {
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{overflow:'hidden'}}>
    <AbsoluteFill style={{maskImage: progress === 1 ? undefined : mask, WebkitMaskImage: progress === 1 ? undefined : mask}}>
      {children}
    </AbsoluteFill>
    <div style={{position:'absolute',left:cx-r*0.7,top:cy-r*0.7,width:r*1.4,height:r*1.4,borderRadius:'50%',
      background:'radial-gradient(closest-side, #fff6d8d9, #fff6d840 45%, transparent 75%)',
      filter:'blur(26px)',opacity:glow,pointerEvents:'none'}}/>
  </AbsoluteFill>;
}
