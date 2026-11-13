export const BLUR_FOCUS_LIST_DEFAULT_PACE = 30;

export type BlurFocusListTimingInput = {
  items?: string[];
  paceInFrames?: number;
};

export const calculateBlurFocusListDuration = ({
  items = ["speed", "focus", "momentum", "innovation", "execution"],
  paceInFrames = BLUR_FOCUS_LIST_DEFAULT_PACE,
}: BlurFocusListTimingInput = {}) =>
  Math.max(1, items.length) * Math.max(1, Math.round(paceInFrames));
