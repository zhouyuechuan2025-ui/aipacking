import React from 'react';
import {fitText, measureText} from '@remotion/layout-utils';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';

type MotionDirection = 'left' | 'right' | 'top' | 'bottom';

export type WordTypewriterProps = {
  text?: string;
  accent?: string;
  accentTo?: string;
  colorTransitionInFrames?: number;
  x?: number;
  y?: number;
  fontFamily?: string;
  fontWeight?: number;
  maxFontSize?: number;
  maxWidthRatio?: number;
  startFrame?: number;
  wordStaggerInFrames?: number;
  enterDurationInFrames?: number;
  holdDurationInFrames?: number;
  exitDurationInFrames?: number;
  moveDistance?: number;
  enterDirection?: MotionDirection;
  exitDirection?: MotionDirection;
  glow?: boolean;
  glowColor?: string;
  glowRadius?: number;
  glowIntensity?: number;
};

const getDirectionOffset = (direction: MotionDirection, distance: number) => {
  if (direction === 'left') return {x: -distance, y: 0};
  if (direction === 'right') return {x: distance, y: 0};
  if (direction === 'top') return {x: 0, y: -distance};
  return {x: 0, y: distance};
};

const withOpacity = (color: string, opacity: number) => {
  const hexMatch = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(color);
  if (hexMatch) {
    const rgb = hexMatch[1];
    const sourceAlpha = hexMatch[2] ? Number.parseInt(hexMatch[2], 16) / 255 : 1;
    const red = Number.parseInt(rgb.slice(0, 2), 16);
    const green = Number.parseInt(rgb.slice(2, 4), 16);
    const blue = Number.parseInt(rgb.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${sourceAlpha * opacity})`;
  }

  const rgbaMatch = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(color);
  if (!rgbaMatch) return color;
  const sourceAlpha = rgbaMatch[4] ? Number.parseFloat(rgbaMatch[4]) : 1;
  return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${sourceAlpha * opacity})`;
};

export const WordTypewriter: React.FC<WordTypewriterProps> = ({
  text = 'Managing electric car charging',
  accent = '#4b5cff',
  accentTo = '#31e6df',
  colorTransitionInFrames = 8,
  x,
  y,
  fontFamily = 'Arial, sans-serif',
  fontWeight = 500,
  maxFontSize = 88,
  maxWidthRatio = 0.8,
  startFrame = 10,
  wordStaggerInFrames = 7,
  enterDurationInFrames = 10,
  holdDurationInFrames = 42,
  exitDurationInFrames = 16,
  moveDistance = 28,
  enterDirection = 'bottom',
  exitDirection = 'top',
  glow = false,
  glowColor,
  glowRadius = 10,
  glowIntensity = 0.25,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const words = text.trim().split(/\s+/);
  const fitted = fitText({
    text,
    withinWidth: width * maxWidthRatio,
    fontFamily,
    fontWeight,
  });
  const fontSize = Math.min(maxFontSize, fitted.fontSize);
  const finalWordFrame = startFrame + (words.length - 1) * wordStaggerInFrames + enterDurationInFrames;
  const exitStartFrame = finalWordFrame + holdDurationInFrames;
  const enterOffset = getDirectionOffset(enterDirection, moveDistance);
  const exitOffset = getDirectionOffset(exitDirection, moveDistance);

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          left: x ?? width / 2,
          top: y ?? height / 2,
          translate: `calc(-50% + ${interpolate(
            frame,
            [exitStartFrame, exitStartFrame + exitDurationInFrames],
            [0, exitOffset.x],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.in(Easing.cubic),
            },
          )}px) calc(-50% + ${interpolate(
            frame,
            [exitStartFrame, exitStartFrame + exitDurationInFrames],
            [0, exitOffset.y],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.in(Easing.cubic),
            },
          )}px)`,
          width: 'max-content',
          maxWidth: width * maxWidthRatio,
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          opacity: interpolate(
            frame,
            [exitStartFrame, exitStartFrame + exitDurationInFrames],
            [1, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.in(Easing.cubic),
            },
          ),
        }}
      >
        {words.map((word, index) => {
          const wordStartFrame = startFrame + index * wordStaggerInFrames;
          const wordProgress = interpolate(
            frame,
            [wordStartFrame, wordStartFrame + enterDurationInFrames],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            },
          );
          const wordEndFrame = wordStartFrame + enterDurationInFrames;
          const wordColor = interpolateColors(
            interpolate(frame, [wordEndFrame - colorTransitionInFrames, wordEndFrame], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            [0, 1],
            [accent, accentTo],
          );
          const token = index < words.length - 1 ? `${word}\u00a0` : word;
          const tokenWidth = measureText({text: token, fontFamily, fontSize, fontWeight}).width;
          const wordGlowColor = glowColor ?? wordColor;

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: 'inline-block',
                width: tokenWidth * wordProgress,
                whiteSpace: 'pre',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  opacity: wordProgress,
                  color: wordColor,
                  textShadow: glow
                    ? `0 0 ${glowRadius * 0.35}px ${withOpacity(wordGlowColor, glowIntensity)}, 0 0 ${glowRadius}px ${withOpacity(wordGlowColor, glowIntensity * 0.65)}, 0 0 ${glowRadius * 2}px ${withOpacity(wordGlowColor, glowIntensity * 0.35)}`
                    : 'none',
                  translate: `${enterOffset.x * (1 - wordProgress)}px ${enterOffset.y * (1 - wordProgress)}px`,
                }}
              >
                {token}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
