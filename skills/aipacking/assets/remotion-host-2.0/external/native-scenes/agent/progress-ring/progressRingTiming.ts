export type ProgressRingTimingOptions = {
  value?: number;
  progressPerFrame?: number;
  holdDurationInFrames?: number;
};

export const calculateProgressRingDuration = ({
  value = 78,
  progressPerFrame = 1,
  holdDurationInFrames = 30,
}: ProgressRingTimingOptions = {}) => {
  const target = Math.max(0, Math.min(100, value));
  const speed = Math.max(0.001, progressPerFrame);
  const animationEndFrame = Math.ceil(target / speed);
  return Math.max(1, animationEndFrame + Math.max(0, Math.ceil(holdDurationInFrames)) + 1);
};
