export const DEFAULT_CURSOR_X_POSITIONS = [320, 960, 1500];
export const DEFAULT_CURSOR_Y_POSITIONS = [280, 540, 760];
export const DEFAULT_CURSOR_CLICK_FRAMES = [32, 57];

export type CursorTourTimingOptions = {
  xPositions?: number[];
  yPositions?: number[];
  startFrame?: number;
  pixelsPerFrame?: number;
  holdDurationInFrames?: number;
  clickFrames?: number[];
  clickDurationInFrames?: number;
};

export type CursorTourTiming = {
  waypointFrames: number[];
  routeEndFrame: number;
  durationInFrames: number;
};

export const buildCursorTourTiming = ({
  xPositions = DEFAULT_CURSOR_X_POSITIONS,
  yPositions = DEFAULT_CURSOR_Y_POSITIONS,
  startFrame = 0,
  pixelsPerFrame = 24,
  holdDurationInFrames = 28,
  clickFrames = DEFAULT_CURSOR_CLICK_FRAMES,
  clickDurationInFrames = 16,
}: CursorTourTimingOptions = {}): CursorTourTiming => {
  const pointCount = Math.min(xPositions.length, yPositions.length);
  const speed = Math.max(0.001, pixelsPerFrame);
  const waypointFrames: number[] = [];
  let routeEndFrame = Math.max(0, startFrame);

  if (pointCount > 0) {
    waypointFrames.push(routeEndFrame);
    for (let index = 1; index < pointCount; index += 1) {
      const distance = Math.hypot(
        xPositions[index] - xPositions[index - 1],
        yPositions[index] - yPositions[index - 1],
      );
      routeEndFrame += Math.max(1, Math.ceil(distance / speed));
      waypointFrames.push(routeEndFrame);
    }
  }

  const routeDuration = routeEndFrame + Math.max(0, holdDurationInFrames);
  const clickDuration = clickFrames.reduce(
    (latestFrame, clickFrame) => Math.max(latestFrame, clickFrame + Math.max(0, clickDurationInFrames)),
    0,
  );

  return {
    waypointFrames,
    routeEndFrame,
    durationInFrames: Math.max(1, routeDuration, clickDuration),
  };
};

export const calculateCursorTourDuration = (options: CursorTourTimingOptions = {}) =>
  buildCursorTourTiming(options).durationInFrames;
