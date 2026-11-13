import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {buildTerminalTimings, DEFAULT_TERMINAL_COMMANDS, DEFAULT_TERMINAL_OUTPUTS} from './terminalTiming';
export {calculateTerminalSessionDuration} from './terminalTiming';

export type TerminalTheme = 'dark' | 'light';

export type TerminalSessionProps = {
  title?: string;
  prompt?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  commands?: string[];
  outputs?: string[];
  theme?: TerminalTheme;
  accent?: string;
  startFrame?: number;
  charactersPerFrame?: number;
  outputCharactersPerFrame?: number;
  outputDelayInFrames?: number;
  stepGapInFrames?: number;
  cursorBlinkInFrames?: number;
  fontSize?: number;
  autoScroll?: boolean;
};

export const TerminalSession: React.FC<TerminalSessionProps> = ({
  title = 'agent-motion — zsh',
  prompt = 'studio %',
  x,
  y,
  width,
  height,
  commands = DEFAULT_TERMINAL_COMMANDS,
  outputs = DEFAULT_TERMINAL_OUTPUTS,
  theme = 'dark',
  accent = '#67e8f9',
  startFrame = 0,
  charactersPerFrame = 2.2,
  outputCharactersPerFrame = 3,
  outputDelayInFrames = 6,
  stepGapInFrames = 12,
  cursorBlinkInFrames = 8,
  fontSize = 30,
  autoScroll = true,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const isDark = theme === 'dark';
  const pairCount = Math.min(commands.length, outputs.length);
  const safeCommands = commands.slice(0, pairCount);
  const safeOutputs = outputs.slice(0, pairCount);
  const timings = buildTerminalTimings({
    commands: safeCommands,
    outputs: safeOutputs,
    startFrame,
    charactersPerFrame,
    outputCharactersPerFrame,
    outputDelayInFrames,
    stepGapInFrames,
  });
  const terminalWidth = width ?? compositionWidth * 0.8;
  const terminalHeight = height ?? compositionHeight * 0.8;
  const terminalX = x ?? (compositionWidth - terminalWidth) / 2;
  const terminalY = y ?? (compositionHeight - terminalHeight) / 2;
  const scaleUnit = Math.min(terminalWidth / 1536, terminalHeight / 864);
  const titleBarHeight = Math.max(44, 68 * scaleUnit);
  const horizontalPadding = Math.max(24, 46 * scaleUnit);
  const verticalPadding = Math.max(22, 38 * scaleUnit);
  const effectiveFontSize = Math.max(15, fontSize * scaleUnit);
  const lineHeight = effectiveFontSize * 1.48;
  const charactersPerLine = Math.max(12, Math.floor((terminalWidth - horizontalPadding * 2) / (effectiveFontSize * 0.62)));
  const bottomMargin = Math.max(12, 20 * scaleUnit);
  const outputMargin = Math.max(3, 6 * scaleUnit);
  const viewportHeight = terminalHeight - titleBarHeight - verticalPadding * 2;
  const countLines = (text: string) => text.split('\n').reduce((total, line) => total + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0);
  const stepMetrics = safeCommands.map((command, index) => {
    const commandHeight = countLines(`${prompt} ${command}`) * lineHeight;
    const outputHeight = safeOutputs[index].length > 0 ? outputMargin + countLines(safeOutputs[index]) * lineHeight : 0;
    return {commandHeight, outputHeight, totalHeight: commandHeight + outputHeight + bottomMargin};
  });
  const activeStepIndex = timings.reduce((activeIndex, timing, index) => frame >= timing.startFrame ? index : activeIndex, -1);
  const activeTiming = activeStepIndex >= 0 ? timings[activeStepIndex] : null;
  const contentBeforeActive = activeStepIndex > 0
    ? stepMetrics.slice(0, activeStepIndex).reduce((total, metric) => total + metric.totalHeight, 0)
    : 0;
  const activeMetric = activeStepIndex >= 0 ? stepMetrics[activeStepIndex] : null;
  const scrollBefore = Math.max(0, contentBeforeActive - viewportHeight);
  const scrollAfterCommand = activeMetric ? Math.max(0, contentBeforeActive + activeMetric.commandHeight + bottomMargin - viewportHeight) : 0;
  const scrollAfterOutput = activeMetric ? Math.max(0, contentBeforeActive + activeMetric.totalHeight - viewportHeight) : 0;
  const commandScroll = activeTiming ? interpolate(frame, [activeTiming.startFrame, activeTiming.typingEndFrame], [scrollBefore, scrollAfterCommand], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  }) : 0;
  const scrollOffset = autoScroll && activeTiming && activeTiming.outputEndFrame > activeTiming.outputFrame ? interpolate(frame, [activeTiming.outputFrame, activeTiming.outputEndFrame], [commandScroll, scrollAfterOutput], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  }) : 0;
  const lastTiming = timings[timings.length - 1];
  const sessionComplete = lastTiming ? frame >= lastTiming.outputEndFrame : false;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: terminalX,
          top: terminalY,
          width: terminalWidth,
          height: terminalHeight,
          borderRadius: Math.max(16, 24 * scaleUnit),
          overflow: 'hidden',
          backgroundColor: isDark ? '#0c1220' : '#fbfcfe',
          border: `1px solid ${isDark ? '#28344d' : '#cbd3df'}`,
          boxShadow: isDark
            ? '0 42px 120px rgba(0, 0, 0, 0.52), 0 0 80px rgba(103, 232, 249, 0.06)'
            : '0 42px 120px rgba(40, 55, 82, 0.22)',
        }}
      >
        <div
          style={{
            height: titleBarHeight,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${Math.max(18, 24 * scaleUnit)}px`,
            color: isDark ? '#aab5ca' : '#526079',
            backgroundColor: isDark ? '#151d2d' : '#edf1f6',
            borderBottom: `1px solid ${isDark ? '#273249' : '#d5dce7'}`,
          }}
        >
          <div style={{display: 'flex', gap: Math.max(7, 10 * scaleUnit)}}>
            {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
              <div
                key={color}
                style={{
                  width: Math.max(11, 15 * scaleUnit),
                  height: Math.max(11, 15 * scaleUnit),
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              translate: '-50% 0',
              fontSize: Math.max(12, 17 * scaleUnit),
              fontWeight: 600,
              letterSpacing: -0.2,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: Math.max(6, 8 * scaleUnit),
              fontSize: Math.max(10, 13 * scaleUnit),
              color: sessionComplete ? (isDark ? '#86efac' : '#15803d') : (isDark ? '#7e8ba4' : '#77839a'),
            }}
          >
            <div
              style={{
                width: Math.max(6, 8 * scaleUnit),
                height: Math.max(6, 8 * scaleUnit),
                borderRadius: '50%',
                backgroundColor: sessionComplete ? '#22c55e' : accent,
                boxShadow: sessionComplete ? '0 0 12px rgba(34, 197, 94, 0.7)' : `0 0 12px ${accent}`,
              }}
            />
            {sessionComplete ? 'complete' : 'running'}
          </div>
        </div>

        <div
          style={{
            height: terminalHeight - titleBarHeight,
            overflow: 'hidden',
            padding: `${verticalPadding}px ${horizontalPadding}px`,
            color: isDark ? '#e7edf7' : '#172033',
            fontSize: effectiveFontSize,
            lineHeight: 1.48,
          }}
        >
          <div style={{translate: `0 -${scrollOffset}px`}}>
          {safeCommands.map((command, index) => {
            const timing = timings[index];
            if (frame < timing.startFrame) return null;

            const visibleCharacters = Math.min(
              command.length,
              Math.max(0, Math.floor((frame - timing.startFrame) * charactersPerFrame)),
            );
            const isActiveStep = index === safeCommands.length - 1
              ? frame < timing.outputFrame
              : frame < timing.nextFrame;
            const cursorVisible = isActiveStep && Math.floor(frame / cursorBlinkInFrames) % 2 === 0;
            const outputVisible = frame >= timing.outputFrame && safeOutputs[index].length > 0;
            const visibleOutputCharacters = Math.min(
              safeOutputs[index].length,
              Math.max(0, Math.floor((frame - timing.outputFrame) * outputCharactersPerFrame)),
            );

            return (
              <div key={`${command}-${index}`} style={{marginBottom: Math.max(12, 20 * scaleUnit)}}>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                  <span style={{color: accent, flexShrink: 0, fontWeight: 700}}>{prompt}&nbsp;</span>
                  <span style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>
                    {command.slice(0, visibleCharacters)}
                    {cursorVisible ? (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '0.62em',
                          height: '1.05em',
                          marginLeft: 2,
                          verticalAlign: '-0.14em',
                          backgroundColor: accent,
                          boxShadow: `0 0 14px ${accent}`,
                        }}
                      />
                    ) : null}
                  </span>
                </div>
                {outputVisible ? (
                  <div
                    style={{
                      marginTop: Math.max(3, 6 * scaleUnit),
                      color: isDark ? '#8fa0ba' : '#64718a',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {safeOutputs[index].slice(0, visibleOutputCharacters)}
                  </div>
                ) : null}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
