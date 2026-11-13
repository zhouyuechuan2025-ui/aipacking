export const DEFAULT_TERMINAL_COMMANDS = [
  'npx @agent-motion/cli search "product demo"',
  'npx @agent-motion/cli add cursor-tour',
  'npm run render',
];

export const DEFAULT_TERMINAL_OUTPUTS = [
  'Found 2 matches: Cursor Tour, Browser Spotlight',
  '✓ Added Cursor Tour v0.1.0',
  '✓ Render complete',
];

export type TerminalTimingOptions = {
  commands?: string[];
  outputs?: string[];
  startFrame?: number;
  charactersPerFrame?: number;
  outputCharactersPerFrame?: number;
  outputDelayInFrames?: number;
  stepGapInFrames?: number;
};

export type TerminalStepTiming = {
  startFrame: number;
  typingEndFrame: number;
  outputFrame: number;
  outputEndFrame: number;
  nextFrame: number;
};

export const buildTerminalTimings = ({
  commands = DEFAULT_TERMINAL_COMMANDS,
  outputs = DEFAULT_TERMINAL_OUTPUTS,
  startFrame = 0,
  charactersPerFrame = 2.2,
  outputCharactersPerFrame = 3,
  outputDelayInFrames = 6,
  stepGapInFrames = 12,
}: TerminalTimingOptions): TerminalStepTiming[] => {
  const pairCount = Math.min(commands.length, outputs.length);
  const commandSpeed = Math.max(0.001, charactersPerFrame);
  const outputSpeed = Math.max(0.001, outputCharactersPerFrame);
  let cursor = startFrame;

  return commands.slice(0, pairCount).map((command, index) => {
    const typingDuration = Math.max(1, Math.ceil(command.length / commandSpeed));
    const outputDuration = outputs[index].length === 0 ? 0 : Math.max(1, Math.ceil(outputs[index].length / outputSpeed));
    const outputFrame = cursor + typingDuration + outputDelayInFrames;
    const timing = {
      startFrame: cursor,
      typingEndFrame: cursor + typingDuration,
      outputFrame,
      outputEndFrame: outputFrame + outputDuration,
      nextFrame: outputFrame + outputDuration + stepGapInFrames,
    };
    cursor = timing.nextFrame;
    return timing;
  });
};

export const calculateTerminalSessionDuration = (options: TerminalTimingOptions = {}) => {
  const timings = buildTerminalTimings(options);
  return Math.max(1, timings[timings.length - 1]?.nextFrame ?? options.startFrame ?? 0);
};
