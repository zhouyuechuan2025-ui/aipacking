import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUR_FOCUS_LIST_DEFAULT_PACE } from "./blurFocusListTiming";
export { calculateBlurFocusListDuration } from "./blurFocusListTiming";

export type BlurFocusListPreset = "minimal" | "editorial" | "neon";

export type BlurFocusListProps = {
  label?: string;
  items?: string[];
  preset?: BlurFocusListPreset;
  accent?: string;
  textColor?: string;
  mutedColor?: string;
  dividerColor?: string;
  paceInFrames?: number;
  transitionInFrames?: number;
  blurAmount?: number;
  loop?: boolean;
  showDivider?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type PresetConfig = {
  textColor: string;
  mutedColor: string;
  dividerColor: string;
  accent: string;
};

const DEFAULT_ITEMS = ["speed", "focus", "momentum", "innovation", "execution"];

const PRESETS: Record<BlurFocusListPreset, PresetConfig> = {
  minimal: {
    textColor: "#ffffff",
    mutedColor: "#a3a3a3",
    dividerColor: "#343434",
    accent: "#ffffff",
  },
  editorial: {
    textColor: "#171713",
    mutedColor: "#777269",
    dividerColor: "#c9c2b6",
    accent: "#ef5b3f",
  },
  neon: {
    textColor: "#f4f7f1",
    mutedColor: "#778190",
    dividerColor: "#6f8c33",
    accent: "#c7ff4a",
  },
};

export const BlurFocusList: React.FC<BlurFocusListProps> = ({
  label = "Built for",
  items = DEFAULT_ITEMS,
  preset = "minimal",
  accent,
  textColor,
  mutedColor,
  dividerColor,
  paceInFrames = BLUR_FOCUS_LIST_DEFAULT_PACE,
  transitionInFrames = 12,
  blurAmount = 10,
  loop = false,
  showDivider = true,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { width: compositionWidth, height: compositionHeight } =
    useVideoConfig();
  const resolvedWidth = width ?? compositionWidth * 0.8;
  const resolvedHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - resolvedWidth) / 2;
  const top = y ?? (compositionHeight - resolvedHeight) / 2;
  const unit = Math.max(
    0.42,
    Math.min(resolvedWidth / 1536, resolvedHeight / 864),
  );
  const config = PRESETS[preset] ?? PRESETS.minimal;
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const safePace = Math.max(1, Math.round(paceInFrames));
  const safeTransition = Math.max(
    1,
    Math.min(safePace, Math.round(transitionInFrames)),
  );
  const cycleDuration = safeItems.length * safePace;
  const timelineFrame = loop ? frame % cycleDuration : frame;
  const segment = Math.min(
    safeItems.length - 1,
    Math.floor(timelineFrame / safePace),
  );
  const frameWithinSegment = timelineFrame % safePace;
  const canAdvance = loop || segment < safeItems.length - 1;
  const transitionStart = Math.max(0, safePace - safeTransition);
  const transitionProgress = canAdvance
    ? interpolate(
        frameWithinSegment,
        [transitionStart, Math.max(transitionStart + 1, safePace - 1)],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        },
      )
    : 0;
  const focusPosition = segment + transitionProgress;
  const stacked = resolvedWidth / resolvedHeight < 0.92;
  const horizontalPadding = 74 * unit;
  const verticalPadding = 60 * unit;
  const availableListHeight = stacked
    ? resolvedHeight * 0.62 - verticalPadding
    : resolvedHeight - verticalPadding * 2;
  const itemFontSize = Math.max(
    24 * unit,
    Math.min(
      60 * unit,
      (availableListHeight / Math.max(5, safeItems.length)) * 0.72,
    ),
  );
  const itemHeight = Math.min(
    82 * unit,
    availableListHeight / Math.max(1, safeItems.length),
  );
  const resolvedAccent = accent ?? config.accent;
  const resolvedText = textColor ?? config.textColor;
  const resolvedMuted = mutedColor ?? config.mutedColor;
  const resolvedDivider = dividerColor ?? config.dividerColor;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: resolvedWidth,
          height: resolvedHeight,
          display: "grid",
          gridTemplateColumns: stacked ? "1fr" : "0.82fr 1.18fr",
          gridTemplateRows: stacked ? "0.38fr 0.62fr" : "1fr",
          overflow: "hidden",
          backgroundColor: "transparent",
          color: resolvedText,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          padding: `${verticalPadding}px ${horizontalPadding}px`,
          boxSizing: "border-box",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: stacked ? "flex-end" : "center",
            justifyContent: stacked ? "flex-start" : "flex-end",
            paddingRight: stacked ? 0 : 62 * unit,
            paddingBottom: stacked ? 30 * unit : 0,
            fontSize: 54 * unit,
            fontWeight: preset === "editorial" ? 650 : 520,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
            paddingLeft: stacked ? 0 : 62 * unit,
            paddingTop: stacked ? 28 * unit : 0,
            borderLeft:
              !stacked && showDivider
                ? `${Math.max(1, unit)}px solid ${resolvedDivider}`
                : undefined,
            borderTop:
              stacked && showDivider
                ? `${Math.max(1, unit)}px solid ${resolvedDivider}`
                : undefined,
            zIndex: 1,
          }}
        >
          {safeItems.map((item, index) => {
            const directDistance = Math.abs(index - focusPosition);
            const distance = loop
              ? Math.min(
                  directDistance,
                  Math.abs(index + safeItems.length - focusPosition),
                  Math.abs(index - safeItems.length - focusPosition),
                )
              : directDistance;
            const opacity = interpolate(distance, [0, 1, 2.6], [1, 0.3, 0.06], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const blur = interpolate(
              distance,
              [0, 1, 3],
              [0, blurAmount, blurAmount * 1.5],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            const isNearFocus = distance < 0.72;

            return (
              <div
                key={`${item}-${index}`}
                style={{
                  height: itemHeight,
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  color: isNearFocus ? resolvedAccent : resolvedMuted,
                  opacity,
                  filter: `blur(${blur}px)`,
                  fontSize: itemFontSize,
                  fontWeight: isNearFocus ? 720 : 520,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  textShadow:
                    preset === "neon" && isNearFocus
                      ? `0 0 ${24 * unit}px ${resolvedAccent}`
                      : "none",
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
