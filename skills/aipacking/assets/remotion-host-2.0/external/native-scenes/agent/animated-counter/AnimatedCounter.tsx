import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type AnimatedCounterProps = {
  value?: number;
  label?: string;
  suffix?: string;
  accent?: string;
  valueColor?: string;
  labelColor?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  valueSizePercent?: number;
  labelSizePercent?: number;
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value = 8420,
  label = 'Active creators',
  suffix = '+',
  accent = '#c7ff4a',
  valueColor = '#f7f7f2',
  labelColor = '#c8cac3',
  x,
  y,
  width,
  height,
  valueSizePercent = 21,
  labelSizePercent = 5.5,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const useCenteredDefault = x === undefined && y === undefined && width === undefined && height === undefined;
  const containerSize = Math.min(componentWidth, componentHeight);
  const valueFontSize = containerSize * valueSizePercent / 100;
  const labelFontSize = containerSize * labelSizePercent / 100;
  const currentValue = Math.round(interpolate(frame, [0, 66], [0, value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', fontFamily: 'Inter, Arial, sans-serif'}}>
      <div
        style={{
          position: 'absolute',
          left: componentX,
          top: componentY,
          width: componentWidth,
          height: componentHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: useCenteredDefault ? 'center' : 'flex-start',
          alignItems: useCenteredDefault ? 'center' : 'flex-start',
          textAlign: useCenteredDefault ? 'center' : 'left',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            color: valueColor,
            fontSize: valueFontSize,
            fontWeight: 760,
            letterSpacing: '-0.065em',
            lineHeight: 0.9,
            whiteSpace: 'nowrap',
          }}
        >
          {currentValue.toLocaleString('en-US')}
          <span style={{color: accent}}>{suffix}</span>
        </div>
        <div
          style={{
            color: labelColor,
            fontSize: labelFontSize,
            lineHeight: 1.15,
            marginTop: containerSize * 0.035,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
