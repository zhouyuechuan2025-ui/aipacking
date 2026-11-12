// Adapted from Magic UI ShineBorder and the shine keyframes (MIT),
// 1ac985adca3cdfab9b1739253fd14209687c4e9c. Uses the Remotion frame for a single pass.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export function ShineBorder({duration, radius, colors, borderWidth}:{
  duration:number; radius:number; colors:string[]; borderWidth:number;
}) {
  const frame = useCurrentFrame();
  const offset = interpolate(frame, [0, duration/2, duration], [0, 100, 0], {
    extrapolateLeft:'clamp', extrapolateRight:'clamp',
  });
  return <div style={{
    position:'absolute',inset:0,pointerEvents:'none',borderRadius:radius,padding:borderWidth,
    backgroundImage:`radial-gradient(transparent, transparent, ${colors.join(',')}, transparent, transparent)`,
    backgroundSize:'300% 300%',backgroundPosition:`${offset}% ${offset}%`,
    mask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite:'xor',maskComposite:'exclude',
  }}/>;
}
