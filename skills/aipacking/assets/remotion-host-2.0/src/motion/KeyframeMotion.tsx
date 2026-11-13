import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import registry from './keyframes.json';
import './keyframes.css';

export function KeyframeMotion({id,frames,children}: React.PropsWithChildren<{id?: string; frames: number}>) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const effect = registry[id as keyof typeof registry];
  if (!effect) return <>{children}</>;
  const time = Math.min(frame, Math.max(0,frames-1)) / fps;
  return <div style={{
    position:'absolute',inset:0,
    animationName:'ap-'+id,
    animationDuration:Math.max(1,frames-1)/fps+'s',
    animationDelay:'-'+time+'s',
    animationTimingFunction:effect.easing,
    animationFillMode:'both',
    animationPlayState:'paused',
  }}>{children}</div>;
}
