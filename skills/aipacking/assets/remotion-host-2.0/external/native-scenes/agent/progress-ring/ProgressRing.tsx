import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
export {calculateProgressRingDuration} from './progressRingTiming';

export type ProgressRingProps = {
  value?: number;
  label?: string;
  detail?: string;
  accent?: string;
  textColor?: string;
  progressPerFrame?: number;
  holdDurationInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const withOpacity = (color: string, opacity: number) => {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return color;

  const red = Number.parseInt(match[1].slice(0, 2), 16);
  const green = Number.parseInt(match[1].slice(2, 4), 16);
  const blue = Number.parseInt(match[1].slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value = 78,
  label = 'Launch readiness',
  detail = 'All critical checks passed',
  accent = '#ffcc33',
  textColor = '#ffffff',
  progressPerFrame = 1,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const target = Math.max(0, Math.min(100, value));
  const progress = Math.min(target, Math.max(0, frame) * Math.max(0.001, progressPerFrame));
  const ringSize = Math.min(componentWidth, componentHeight) * 0.78;
  const strokeWidth = ringSize * 0.047;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const scaleUnit = ringSize / 674;

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          left: componentX,
          top: componentY,
          width: componentWidth,
          height: componentHeight,
          display: 'grid',
          placeItems: 'center',
          color: textColor,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{rotate: '-90deg', overflow: 'visible'}}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke={withOpacity(textColor, 0.14)}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            width: ringSize * 0.72,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: textColor,
              fontSize: 132 * scaleUnit,
              fontWeight: 760,
              letterSpacing: `${-7 * scaleUnit}px`,
              lineHeight: 1,
            }}
          >
            {Math.round(progress)}
            <span
              style={{
                color: withOpacity(textColor, 0.58),
                fontSize: 48 * scaleUnit,
                letterSpacing: 0,
              }}
            >
              %
            </span>
          </div>
          <div
            style={{
              color: textColor,
              fontSize: 34 * scaleUnit,
              fontWeight: 680,
              marginTop: 14 * scaleUnit,
            }}
          >
            {label}
          </div>
          {detail ? (
            <div
              style={{
                color: withOpacity(textColor, 0.58),
                fontSize: 21 * scaleUnit,
                lineHeight: 1.35,
                marginTop: 16 * scaleUnit,
              }}
            >
              {detail}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
