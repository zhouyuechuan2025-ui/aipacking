import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type CtaCardItem = {
  title: string;
  detail?: string;
  meta?: string;
};

export type CtaCardPreset = "launch" | "gradient" | "minimal";

export type CtaCardProps = {
  items?: CtaCardItem[];
  preset?: CtaCardPreset;
  accent?: string;
  headlineColor?: string;
  detailColor?: string;
  actionTextColor?: string;
  headlineFontSize?: number;
  detailFontSize?: number;
  actionFontSize?: number;
  actionLabel?: string;
  entranceInFrames?: number;
  staggerInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const DEFAULT_ITEMS: CtaCardItem[] = [
  {
    title: "Build your next product video",
    detail: "Install editable Remotion components built for coding agents.",
    meta: "agent-motion.com",
  },
];

type CtaCardPresetProps = Required<
  Pick<
    CtaCardProps,
    | "accent"
    | "headlineColor"
    | "detailColor"
    | "actionTextColor"
    | "headlineFontSize"
    | "detailFontSize"
    | "actionFontSize"
  >
>;

export const CTA_CARD_PRESETS: Record<CtaCardPreset, CtaCardPresetProps> = {
  launch: {
    accent: "#c7ff4a",
    headlineColor: "#ffffff",
    detailColor: "#e4eaf2",
    actionTextColor: "#10150a",
    headlineFontSize: 96,
    detailFontSize: 32,
    actionFontSize: 24,
  },
  gradient: {
    accent: "#9b7cff",
    headlineColor: "#fdfbff",
    detailColor: "#e7e0ff",
    actionTextColor: "#100b1f",
    headlineFontSize: 104,
    detailFontSize: 34,
    actionFontSize: 24,
  },
  minimal: {
    accent: "#ffffff",
    headlineColor: "#ffffff",
    detailColor: "#d5d9df",
    actionTextColor: "#111317",
    headlineFontSize: 88,
    detailFontSize: 30,
    actionFontSize: 22,
  },
};

export const CtaCard: React.FC<CtaCardProps> = ({
  items = DEFAULT_ITEMS,
  preset = "launch",
  accent,
  headlineColor,
  detailColor,
  actionTextColor,
  headlineFontSize,
  detailFontSize,
  actionFontSize,
  actionLabel = "Get started",
  entranceInFrames = 18,
  staggerInFrames = 8,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const cardWidth = width ?? compositionWidth * 0.8;
  const cardHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - cardWidth) / 2;
  const top = y ?? (compositionHeight - cardHeight) / 2;
  const unit = Math.max(
    0.45,
    Math.min(cardWidth / 1536, cardHeight / 864),
  );
  const config = CTA_CARD_PRESETS[preset] ?? CTA_CARD_PRESETS.launch;
  const item = items[0] ?? DEFAULT_ITEMS[0];
  const resolvedAccent = accent ?? config.accent;
  const entrance = Math.max(1, entranceInFrames);
  const stagger = Math.max(0, staggerInFrames);

  return (
    <AbsoluteFill style={{backgroundColor: "transparent"}}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: cardWidth,
          height: cardHeight,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          textAlign: "center",
          fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
        }}
      >
        <div style={{width: "100%", maxWidth: "92%"}}>
          <div
            style={{
              color: headlineColor ?? config.headlineColor,
              fontSize: (headlineFontSize ?? config.headlineFontSize) * unit,
              fontWeight: 880,
              letterSpacing: "-.055em",
              lineHeight: 0.98,
              opacity: interpolate(frame, [0, entrance], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [0, entrance],
                [`0px ${34 * unit}px`, "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {item.title}
          </div>

          {item.detail ? (
            <div
              style={{
                color: detailColor ?? config.detailColor,
                fontSize: (detailFontSize ?? config.detailFontSize) * unit,
                fontWeight: 560,
                lineHeight: 1.35,
                margin: `${28 * unit}px auto 0`,
                maxWidth: "78%",
                opacity: interpolate(
                  frame,
                  [stagger, stagger + entrance],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                translate: interpolate(
                  frame,
                  [stagger, stagger + entrance],
                  [`0px ${28 * unit}px`, "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {item.detail}
            </div>
          ) : null}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 34 * unit,
              padding: `${18 * unit}px ${30 * unit}px`,
              borderRadius: 16 * unit,
              backgroundColor: resolvedAccent,
              color: actionTextColor ?? config.actionTextColor,
              fontSize: (actionFontSize ?? config.actionFontSize) * unit,
              fontWeight: 850,
              lineHeight: 1,
              opacity: interpolate(
                frame,
                [stagger * 2, stagger * 2 + entrance],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              translate: interpolate(
                frame,
                [stagger * 2, stagger * 2 + entrance],
                [`0px ${24 * unit}px`, "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {actionLabel}
            {item.meta ? ` · ${item.meta}` : ""}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
