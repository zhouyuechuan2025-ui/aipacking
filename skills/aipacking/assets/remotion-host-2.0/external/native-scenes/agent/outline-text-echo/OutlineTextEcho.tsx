import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type OutlineTextEchoPreset = "blue" | "mono" | "editorial";

export type OutlineTextEchoProps = {
  text?: string;
  preset?: OutlineTextEchoPreset;
  fillColor?: string;
  outlineColor?: string;
  fontSizePercent?: number;
  fontWeight?: number;
  strokeWidth?: number;
  copiesPerSide?: number;
  spacingPercent?: number;
  horizontalCopiesPerSide?: number;
  horizontalSpacingPercent?: number;
  echoOpacity?: number;
  centerMaskEnabled?: boolean;
  centerMaskHeightPercent?: number;
  layerMasksEnabled?: boolean;
  layerMaskHeightPercent?: number;
  layerMaskWidthPercent?: number;
  startFrame?: number;
  separationInFrames?: number;
  staggerInFrames?: number;
  animationEnabled?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type OutlineTextEchoPresetProps = Required<
  Pick<
    OutlineTextEchoProps,
    | "fillColor"
    | "outlineColor"
    | "fontSizePercent"
    | "fontWeight"
    | "strokeWidth"
    | "copiesPerSide"
    | "spacingPercent"
    | "horizontalSpacingPercent"
    | "echoOpacity"
    | "centerMaskEnabled"
    | "centerMaskHeightPercent"
    | "layerMasksEnabled"
    | "layerMaskHeightPercent"
    | "layerMaskWidthPercent"
  >
>;

export const OUTLINE_TEXT_ECHO_PRESETS: Record<
  OutlineTextEchoPreset,
  OutlineTextEchoPresetProps
> = {
  blue: {
    fillColor: "#ffffff",
    outlineColor: "#ffffff",
    fontSizePercent: 34,
    fontWeight: 850,
    strokeWidth: 3,
    copiesPerSide: 3,
    spacingPercent: 18,
    horizontalSpacingPercent: 34,
    echoOpacity: 0.92,
    centerMaskEnabled: true,
    centerMaskHeightPercent: 25,
    layerMasksEnabled: true,
    layerMaskHeightPercent: 13,
    layerMaskWidthPercent: 18,
  },
  mono: {
    fillColor: "#ffffff",
    outlineColor: "#ffffff",
    fontSizePercent: 34,
    fontWeight: 820,
    strokeWidth: 2,
    copiesPerSide: 4,
    spacingPercent: 15,
    horizontalSpacingPercent: 30,
    echoOpacity: 0.72,
    centerMaskEnabled: true,
    centerMaskHeightPercent: 25,
    layerMasksEnabled: true,
    layerMaskHeightPercent: 12,
    layerMaskWidthPercent: 16,
  },
  editorial: {
    fillColor: "#171713",
    outlineColor: "#171713",
    fontSizePercent: 31,
    fontWeight: 760,
    strokeWidth: 2,
    copiesPerSide: 2,
    spacingPercent: 23,
    horizontalSpacingPercent: 32,
    echoOpacity: 0.68,
    centerMaskEnabled: true,
    centerMaskHeightPercent: 23,
    layerMasksEnabled: true,
    layerMaskHeightPercent: 16,
    layerMaskWidthPercent: 20,
  },
};

export const OutlineTextEcho: React.FC<OutlineTextEchoProps> = ({
  text = "5X",
  preset = "blue",
  fillColor,
  outlineColor,
  fontSizePercent,
  fontWeight,
  strokeWidth,
  copiesPerSide,
  spacingPercent,
  horizontalCopiesPerSide = 0,
  horizontalSpacingPercent,
  echoOpacity,
  centerMaskEnabled,
  centerMaskHeightPercent,
  layerMasksEnabled,
  layerMaskHeightPercent,
  layerMaskWidthPercent,
  startFrame = 8,
  separationInFrames = 34,
  staggerInFrames = 3,
  animationEnabled = true,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: compositionWidth, height: compositionHeight} =
    useVideoConfig();
  const resolvedWidth = width ?? compositionWidth * 0.8;
  const resolvedHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - resolvedWidth) / 2;
  const top = y ?? (compositionHeight - resolvedHeight) / 2;
  const unit = Math.max(
    0.35,
    Math.min(resolvedWidth / 1536, resolvedHeight / 864),
  );
  const config = OUTLINE_TEXT_ECHO_PRESETS[preset] ?? OUTLINE_TEXT_ECHO_PRESETS.blue;
  const resolvedFillColor = fillColor ?? config.fillColor;
  const resolvedOutlineColor = outlineColor ?? config.outlineColor;
  const resolvedFontWeight = fontWeight ?? config.fontWeight;
  const resolvedStrokeWidth = Math.max(
    0.5,
    (strokeWidth ?? config.strokeWidth) * unit,
  );
  const resolvedCopies = Math.max(
    1,
    Math.min(8, Math.round(copiesPerSide ?? config.copiesPerSide)),
  );
  const requestedSpacingPercent = Math.max(
    1,
    spacingPercent ?? config.spacingPercent,
  );
  const resolvedHorizontalCopies = Math.max(
    0,
    Math.min(8, Math.round(horizontalCopiesPerSide)),
  );
  const requestedHorizontalSpacingPercent = Math.max(
    1,
    horizontalSpacingPercent ?? config.horizontalSpacingPercent,
  );
  const resolvedEchoOpacity = Math.max(
    0,
    Math.min(1, echoOpacity ?? config.echoOpacity),
  );
  const resolvedCenterMaskEnabled =
    centerMaskEnabled ?? config.centerMaskEnabled;
  const resolvedCenterMaskHeight = Math.max(
    0,
    Math.min(
      90,
      centerMaskHeightPercent ?? config.centerMaskHeightPercent,
    ),
  );
  const maskTop = 50 - resolvedCenterMaskHeight / 2;
  const maskBottom = 50 + resolvedCenterMaskHeight / 2;
  const resolvedLayerMasksEnabled =
    layerMasksEnabled ?? config.layerMasksEnabled;
  const resolvedLayerMaskHeight = Math.max(
    1,
    Math.min(90, layerMaskHeightPercent ?? config.layerMaskHeightPercent),
  );
  const resolvedLayerMaskWidth = Math.max(
    1,
    Math.min(100, layerMaskWidthPercent ?? config.layerMaskWidthPercent),
  );
  const responsiveFontSize =
    (Math.min(resolvedWidth, resolvedHeight) *
      (fontSizePercent ?? config.fontSizePercent)) /
    100;
  const fittedFontSize = Math.min(
    responsiveFontSize,
    resolvedWidth / Math.max(1, text.length * 0.58),
  );
  const resolvedLayerTextHeightPercent =
    ((fittedFontSize * 0.82 + resolvedStrokeWidth * 2) / resolvedHeight) *
    100;
  const resolvedLayerTextWidthPercent =
    ((fittedFontSize * Math.max(1, text.length * 0.58) +
      resolvedStrokeWidth * 2) /
      resolvedWidth) *
    100;
  const maxFittingSpacingPercent = Math.max(
    1,
    (50 - resolvedLayerTextHeightPercent / 2) / resolvedCopies,
  );
  const resolvedSpacingPercent = Math.min(
    requestedSpacingPercent,
    maxFittingSpacingPercent,
  );
  const resolvedSpacing =
    (resolvedHeight * resolvedSpacingPercent) / 100;
  const maxFittingHorizontalSpacingPercent =
    resolvedHorizontalCopies > 0
      ? Math.max(
          1,
          (50 - resolvedLayerTextWidthPercent / 2) /
            resolvedHorizontalCopies,
        )
      : requestedHorizontalSpacingPercent;
  const resolvedHorizontalSpacingPercent = Math.min(
    requestedHorizontalSpacingPercent,
    maxFittingHorizontalSpacingPercent,
  );
  const resolvedHorizontalSpacing =
    (resolvedWidth * resolvedHorizontalSpacingPercent) / 100;
  const horizontalColumns = Array.from(
    {length: resolvedHorizontalCopies * 2 + 1},
    (_, index) => index - resolvedHorizontalCopies,
  );
  const safeSeparation = Math.max(1, Math.round(separationInFrames));
  const safeStagger = Math.max(0, Math.round(staggerInFrames));
  const baseProgress = animationEnabled
    ? spring({
        frame: frame - startFrame,
        fps,
        durationInFrames: safeSeparation,
        config: {damping: 17, stiffness: 120, mass: 0.78},
      })
    : 1;

  return (
    <AbsoluteFill style={{backgroundColor: "transparent"}}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: resolvedWidth,
          height: resolvedHeight,
          overflow: "hidden",
          backgroundColor: "transparent",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: resolvedCenterMaskEnabled
              ? `linear-gradient(to bottom, #000 0%, #000 ${maskTop}%, transparent ${maskTop}%, transparent ${maskBottom}%, #000 ${maskBottom}%, #000 100%)`
              : undefined,
            maskImage: resolvedCenterMaskEnabled
              ? `linear-gradient(to bottom, #000 0%, #000 ${maskTop}%, transparent ${maskTop}%, transparent ${maskBottom}%, #000 ${maskBottom}%, #000 100%)`
              : undefined,
          }}
        >
          {Array.from(
            {length: resolvedCopies},
            (_, index) => index + 1,
          ).flatMap((layer) => {
            const layerProgress = animationEnabled
              ? spring({
                  frame: frame - startFrame - (layer - 1) * safeStagger,
                  fps,
                  durationInFrames: safeSeparation,
                  config: {damping: 17, stiffness: 120, mass: 0.78},
                })
              : 1;
            return [-1, 1].map((direction) => {
              const layerCenter =
                50 +
                direction *
                  resolvedSpacingPercent *
                  layer *
                  layerProgress;
              const layerTextTop =
                layerCenter - resolvedLayerTextHeightPercent / 2;
              const layerTextBottom =
                layerCenter + resolvedLayerTextHeightPercent / 2;
              const layerTop =
                direction < 0
                  ? Math.max(0, Math.min(100, layerTextTop))
                  : Math.max(
                      0,
                      Math.min(
                        100,
                        layerTextBottom - resolvedLayerMaskHeight,
                      ),
                    );
              const layerBottom =
                direction < 0
                  ? Math.max(
                      layerTop,
                      Math.min(100, layerTop + resolvedLayerMaskHeight),
                    )
                  : Math.max(
                      layerTop,
                      Math.min(100, layerTextBottom),
                    );

              return (
                <div
                  key={`${direction}-${layer}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: resolvedLayerMasksEnabled
                      ? `inset(${layerTop}% 0 ${100 - layerBottom}% 0)`
                      : undefined,
                  }}
                >
                  {horizontalColumns.map((column) => {
                    const cellOpacity = Math.max(
                      0,
                      resolvedEchoOpacity *
                        (1 -
                          (Math.max(layer, Math.abs(column)) - 1) *
                            0.09),
                    );
                    const cellCenter =
                      50 +
                      column *
                        resolvedHorizontalSpacingPercent *
                        layerProgress;
                    const cellTextLeft =
                      cellCenter - resolvedLayerTextWidthPercent / 2;
                    const cellTextRight =
                      cellCenter + resolvedLayerTextWidthPercent / 2;
                    const cellLeft =
                      column < 0
                        ? Math.max(0, Math.min(100, cellTextLeft))
                        : column > 0
                          ? Math.max(
                              0,
                              Math.min(
                                100,
                                cellTextRight - resolvedLayerMaskWidth,
                              ),
                            )
                          : 0;
                    const cellRight =
                      column < 0
                        ? Math.max(
                            cellLeft,
                            Math.min(
                              100,
                              cellLeft + resolvedLayerMaskWidth,
                            ),
                          )
                        : column > 0
                          ? Math.max(
                              cellLeft,
                              Math.min(100, cellTextRight),
                            )
                          : 100;

                    return (
                      <div
                        key={`${direction}-${layer}-${column}`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          clipPath:
                            resolvedLayerMasksEnabled && column !== 0
                              ? `inset(0 ${100 - cellRight}% 0 ${cellLeft}%)`
                              : undefined,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            zIndex:
                              resolvedCopies + resolvedHorizontalCopies -
                              layer -
                              Math.abs(column),
                            color: "transparent",
                            WebkitTextStroke: `${resolvedStrokeWidth}px ${resolvedOutlineColor}`,
                            paintOrder: "stroke fill",
                            fontSize: fittedFontSize,
                            fontWeight: resolvedFontWeight,
                            lineHeight: 0.82,
                            letterSpacing: "-0.075em",
                            textIndent: "-0.075em",
                            whiteSpace: "nowrap",
                            opacity: interpolate(
                              layerProgress,
                              [0, 0.2, 1],
                              [0.18, 0.72, cellOpacity],
                              {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                              },
                            ),
                            filter: `blur(${interpolate(
                              layerProgress,
                              [0, 1],
                              [3, 0],
                              {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                              },
                            )}px)`,
                            translate: `calc(-50% + ${
                              column *
                              resolvedHorizontalSpacing *
                              layerProgress
                            }px) calc(-50% + ${
                              direction *
                              resolvedSpacing *
                              layer *
                              layerProgress
                            }px)`,
                          }}
                        >
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            zIndex: resolvedCopies + 2,
            color: resolvedFillColor,
            fontSize: fittedFontSize,
            fontWeight: resolvedFontWeight,
            lineHeight: 0.82,
            letterSpacing: "-0.075em",
            textIndent: "-0.075em",
            whiteSpace: "nowrap",
            translate: "-50% -50%",
            scale: interpolate(baseProgress, [0, 0.48, 1], [1, 1.045, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
