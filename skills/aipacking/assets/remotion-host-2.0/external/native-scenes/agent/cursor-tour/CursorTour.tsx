import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  buildCursorTourTiming,
  DEFAULT_CURSOR_CLICK_FRAMES,
  DEFAULT_CURSOR_X_POSITIONS,
  DEFAULT_CURSOR_Y_POSITIONS,
} from './cursorTiming';
export {calculateCursorTourDuration} from './cursorTiming';

export type CursorTourProps = {
  xPositions?: number[];
  yPositions?: number[];
  startFrame?: number;
  pixelsPerFrame?: number;
  holdDurationInFrames?: number;
  clickFrames?: number[];
  clickDurationInFrames?: number;
  cursorColor?: string;
  cursorSize?: number;
  pulseColor?: string;
  spotlight?: boolean;
  spotlightColor?: string;
  spotlightOpacity?: number;
  spotlightRadius?: number;
};

const CursorArrow: React.FC<{color: string}> = ({color}) => (
  <svg width="100%" height="100%" viewBox="0 0 40 48" fill="none">
    <path
      d="M5 3.5v34.1l8.8-8.6 6.2 14.2 7.4-3.3-6.1-13.7h12.2L5 3.5Z"
      fill={color}
      stroke="#ffffff"
      strokeLinejoin="round"
      strokeWidth="2.4"
    />
  </svg>
);

const withOpacity = (color: string, opacity: number) => {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return color;

  const red = Number.parseInt(match[1].slice(0, 2), 16);
  const green = Number.parseInt(match[1].slice(2, 4), 16);
  const blue = Number.parseInt(match[1].slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export const CursorTour: React.FC<CursorTourProps> = ({
  xPositions = DEFAULT_CURSOR_X_POSITIONS,
  yPositions = DEFAULT_CURSOR_Y_POSITIONS,
  startFrame = 0,
  pixelsPerFrame = 24,
  holdDurationInFrames = 28,
  clickFrames = DEFAULT_CURSOR_CLICK_FRAMES,
  clickDurationInFrames = 16,
  cursorColor = '#111827',
  cursorSize = 48,
  pulseColor = '#6d5dfc',
  spotlight = true,
  spotlightColor = '#07111f',
  spotlightOpacity = 0.52,
  spotlightRadius = 150,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const pointCount = Math.min(xPositions.length, yPositions.length);
  const safeXPositions = pointCount > 0 ? xPositions.slice(0, pointCount) : [compositionWidth / 2];
  const safeYPositions = pointCount > 0 ? yPositions.slice(0, pointCount) : [compositionHeight / 2];
  const {waypointFrames} = buildCursorTourTiming({
    xPositions: safeXPositions,
    yPositions: safeYPositions,
    startFrame,
    pixelsPerFrame,
    holdDurationInFrames,
    clickFrames,
    clickDurationInFrames,
  });
  const cursorX = safeXPositions.length === 1
    ? safeXPositions[0]
    : interpolate(frame, waypointFrames, safeXPositions, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.linear,
      });
  const cursorY = safeYPositions.length === 1
    ? safeYPositions[0]
    : interpolate(frame, waypointFrames, safeYPositions, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.linear,
      });
  const clickProgress = clickFrames.reduce((strongestPulse, clickFrame) => Math.max(
    strongestPulse,
    interpolate(
      frame,
      [clickFrame, clickFrame + clickDurationInFrames / 2, clickFrame + clickDurationInFrames],
      [0, 1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    ),
  ), 0);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', backgroundColor: 'transparent'}}>
      {spotlight ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: withOpacity(spotlightColor, spotlightOpacity),
            WebkitMaskImage: `radial-gradient(circle ${spotlightRadius}px at ${cursorX}px ${cursorY}px, transparent 0%, transparent 58%, black 100%)`,
            maskImage: `radial-gradient(circle ${spotlightRadius}px at ${cursorX}px ${cursorY}px, transparent 0%, transparent 58%, black 100%)`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          width: spotlightRadius * 2,
          height: spotlightRadius * 2,
          borderRadius: '50%',
          border: `4px solid ${withOpacity(pulseColor, 0.9 * clickProgress)}`,
          boxShadow: `0 0 ${32 * clickProgress}px ${withOpacity(pulseColor, 0.55 * clickProgress)}`,
          opacity: clickProgress,
          scale: 0.16 + clickProgress * 0.84,
          translate: '-50% -50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          width: cursorSize,
          height: cursorSize * 1.2,
          filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.28))',
          scale: 1 - clickProgress * 0.12,
          translate: '-5px -4px',
        }}
      >
        <CursorArrow color={cursorColor} />
      </div>
    </AbsoluteFill>
  );
};
