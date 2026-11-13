import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type BarChartPreset =
  | "editorial"
  | "gradient"
  | "dark"
  | "minimal"
  | "inside";
export type BarChartValuePosition = "above" | "inside";

export type BarChartProps = {
  values?: number[];
  labels?: string[];
  preset?: BarChartPreset;
  accent?: string;
  barColor?: string;
  secondaryAccent?: string;
  secondaryAccentEnabled?: boolean;
  highlightLeading?: boolean;
  gridVisible?: boolean;
  gridDashed?: boolean;
  gridColor?: string;
  labelColor?: string;
  valueColor?: string;
  labelsVisible?: boolean;
  valuesVisible?: boolean;
  valuePosition?: BarChartValuePosition;
  glowVisible?: boolean;
  labelFontSize?: number;
  valueFontSize?: number;
  labelSizePercent?: number;
  valueSizePercent?: number;
  barRadius?: number;
  barGapPercent?: number;
  growthInFrames?: number;
  staggerInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const DEFAULT_VALUES = [42, 68, 51, 86, 73];
const DEFAULT_LABELS = ["Direct", "Social", "Search", "Partner", "Email"];

type BarChartPresetProps = Required<
  Pick<
    BarChartProps,
    | "accent"
    | "barColor"
    | "secondaryAccent"
    | "secondaryAccentEnabled"
    | "highlightLeading"
    | "gridVisible"
    | "gridDashed"
    | "gridColor"
    | "labelColor"
    | "valueColor"
    | "labelsVisible"
    | "valuesVisible"
    | "valuePosition"
    | "glowVisible"
    | "labelSizePercent"
    | "valueSizePercent"
    | "barRadius"
    | "barGapPercent"
    | "growthInFrames"
    | "staggerInFrames"
  >
> &
  Pick<BarChartProps, "labelFontSize" | "valueFontSize">;

export const BAR_CHART_PRESETS: Record<BarChartPreset, BarChartPresetProps> = {
  editorial: {
    accent: "#ff5a36",
    barColor: "#7a3428",
    secondaryAccent: "#ffbf3f",
    secondaryAccentEnabled: false,
    highlightLeading: true,
    gridVisible: true,
    gridDashed: false,
    gridColor: "rgba(255, 178, 148, 0.18)",
    labelColor: "#ffd1c2",
    valueColor: "#fff8f5",
    labelsVisible: true,
    valuesVisible: true,
    valuePosition: "above",
    glowVisible: false,
    labelSizePercent: 2.3,
    valueSizePercent: 3.2,
    barRadius: 14,
    barGapPercent: 4,
    growthInFrames: 50,
    staggerInFrames: 7,
  },
  gradient: {
    accent: "#8b5cf6",
    barColor: "#4338ca",
    secondaryAccent: "#22d3ee",
    secondaryAccentEnabled: true,
    highlightLeading: true,
    gridVisible: true,
    gridDashed: true,
    gridColor: "rgba(196, 181, 253, 0.14)",
    labelColor: "#b8b3d2",
    valueColor: "#ffffff",
    labelsVisible: true,
    valuesVisible: true,
    valuePosition: "above",
    glowVisible: true,
    labelSizePercent: 2.3,
    valueSizePercent: 3.2,
    barRadius: 16,
    barGapPercent: 5,
    growthInFrames: 50,
    staggerInFrames: 7,
  },
  dark: {
    accent: "#b7ff45",
    barColor: "#294235",
    secondaryAccent: "#32d5ff",
    secondaryAccentEnabled: false,
    highlightLeading: true,
    gridVisible: true,
    gridDashed: true,
    gridColor: "rgba(203, 255, 117, 0.12)",
    labelColor: "#9baaa3",
    valueColor: "#f4fff8",
    labelsVisible: true,
    valuesVisible: true,
    valuePosition: "above",
    glowVisible: true,
    labelSizePercent: 2.3,
    valueSizePercent: 3.2,
    barRadius: 10,
    barGapPercent: 4,
    growthInFrames: 50,
    staggerInFrames: 7,
  },
  minimal: {
    accent: "#f8fafc",
    barColor: "rgba(248, 250, 252, 0.38)",
    secondaryAccent: "#f8fafc",
    secondaryAccentEnabled: false,
    highlightLeading: false,
    gridVisible: false,
    gridDashed: false,
    gridColor: "rgba(248, 250, 252, 0.12)",
    labelColor: "#f8fafc",
    valueColor: "#f8fafc",
    labelsVisible: false,
    valuesVisible: false,
    valuePosition: "above",
    glowVisible: false,
    labelSizePercent: 2.3,
    valueSizePercent: 3.2,
    barRadius: 0,
    barGapPercent: 5,
    growthInFrames: 50,
    staggerInFrames: 7,
  },
  inside: {
    accent: "#d07171",
    barColor: "#a97e7e",
    secondaryAccent: "#ffffff",
    secondaryAccentEnabled: false,
    highlightLeading: true,
    gridVisible: false,
    gridDashed: false,
    gridColor: "rgba(255, 255, 255, 0.12)",
    labelColor: "#ffffff",
    valueColor: "#ffffff",
    labelsVisible: false,
    valuesVisible: true,
    valuePosition: "inside",
    glowVisible: true,
    labelFontSize: 31,
    valueFontSize: 120,
    labelSizePercent: 2.3,
    valueSizePercent: 10,
    barRadius: 40,
    barGapPercent: 2,
    growthInFrames: 50,
    staggerInFrames: 23,
  },
};

export const BarChart: React.FC<BarChartProps> = (props) => {
  const {
    values = DEFAULT_VALUES,
    labels = DEFAULT_LABELS,
    preset = "inside",
    x,
    y,
    width,
    height,
  } = props;
  const frame = useCurrentFrame();
  const { width: compositionWidth, height: compositionHeight } =
    useVideoConfig();
  const chartWidth = width ?? compositionWidth * 0.8;
  const chartHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - chartWidth) / 2;
  const top = y ?? (compositionHeight - chartHeight) / 2;
  const presetProps = BAR_CHART_PRESETS[preset];
  const accent = props.accent ?? presetProps.accent;
  const barColor = props.barColor ?? presetProps.barColor;
  const secondaryAccent =
    props.secondaryAccent ?? presetProps.secondaryAccent;
  const secondaryAccentEnabled =
    props.secondaryAccentEnabled ?? presetProps.secondaryAccentEnabled;
  const highlightLeading =
    props.highlightLeading ?? presetProps.highlightLeading;
  const gridVisible = props.gridVisible ?? presetProps.gridVisible;
  const gridDashed = props.gridDashed ?? presetProps.gridDashed;
  const gridColor = props.gridColor ?? presetProps.gridColor;
  const labelColor = props.labelColor ?? presetProps.labelColor;
  const valueColor = props.valueColor ?? presetProps.valueColor;
  const labelsVisible = props.labelsVisible ?? presetProps.labelsVisible;
  const valuesVisible = props.valuesVisible ?? presetProps.valuesVisible;
  const valuePosition = props.valuePosition ?? presetProps.valuePosition;
  const glowVisible = props.glowVisible ?? presetProps.glowVisible;
  const labelSizePercent =
    props.labelSizePercent ?? presetProps.labelSizePercent;
  const valueSizePercent =
    props.valueSizePercent ?? presetProps.valueSizePercent;
  const containerSize = Math.min(chartWidth, chartHeight);
  const labelFontSize =
    props.labelFontSize ??
    presetProps.labelFontSize ??
    (containerSize * labelSizePercent) / 100;
  const valueFontSize =
    props.valueFontSize ??
    presetProps.valueFontSize ??
    (containerSize * valueSizePercent) / 100;
  const barRadius = props.barRadius ?? presetProps.barRadius;
  const barGapPercent = props.barGapPercent ?? presetProps.barGapPercent;
  const growthInFrames =
    props.growthInFrames ?? presetProps.growthInFrames;
  const staggerInFrames =
    props.staggerInFrames ?? presetProps.staggerInFrames;
  const safeValues = values.length ? values : DEFAULT_VALUES;
  const maximum = Math.max(1, ...safeValues);
  const leadingIndex = safeValues.indexOf(maximum);
  const labelSpace = labelsVisible ? Math.max(24, labelFontSize * 1.7) : 0;
  const valueSpace =
    valuesVisible && valuePosition === "above"
      ? Math.max(24, valueFontSize * 1.7)
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: chartWidth,
          height: chartHeight,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: `${valueSpace}px 0 ${labelSpace}px`,
          }}
        >
          {gridVisible && (
            <div style={{ position: "absolute", inset: 0 }}>
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`horizontal-${index}`}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${(index / 3) * 100}%`,
                    borderTop: `1px ${gridDashed ? "dashed" : "solid"} ${gridColor}`,
                  }}
                />
              ))}
              {Array.from({ length: safeValues.length + 1 }, (_, index) => (
                <div
                  key={`vertical-${index}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${(index / safeValues.length) * 100}%`,
                    borderLeft: `1px ${gridDashed ? "dashed" : "solid"} ${gridColor}`,
                  }}
                />
              ))}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "stretch",
              gap: `${barGapPercent}%`,
            }}
          >
            {safeValues.map((value, index) => {
              const barProgress = interpolate(
                frame,
                [
                  index * staggerInFrames,
                  index * staggerInFrames + growthInFrames,
                ],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                },
              );
              const barHeight = (Math.max(0, value) / maximum) * 100 * barProgress;
              const isLeading = highlightLeading && index === leadingIndex;
              const primaryBarColor = isLeading ? accent : barColor;
              const background = secondaryAccentEnabled
                ? `linear-gradient(180deg, ${secondaryAccent} 0%, ${primaryBarColor} 100%)`
                : primaryBarColor;
              const valueOpacity = interpolate(
                frame,
                [
                  index * staggerInFrames + 10,
                  index * staggerInFrames + 22,
                ],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );

              return (
                <div
                  key={`${labels[index] ?? "item"}-${index}`}
                  style={{ position: "relative", flex: 1, minWidth: 0 }}
                >
                  {valuesVisible && valuePosition === "above" && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: `calc(${barHeight}% + ${Math.max(6, valueFontSize * 0.3)}px)`,
                        color: valueColor,
                        fontSize: valueFontSize,
                        fontWeight: 760,
                        letterSpacing: "-0.065em",
                        lineHeight: 0.9,
                        textAlign: "center",
                        opacity: valueOpacity,
                      }}
                    >
                      {value}
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: `${barHeight}%`,
                      minHeight: barProgress > 0 ? 1 : 0,
                      background,
                      borderRadius: `${barRadius}px ${barRadius}px 0 0`,
                      overflow: "hidden",
                      boxShadow:
                        glowVisible && isLeading
                          ? `0 0 ${Math.max(24, containerSize * 0.06)}px ${accent}66`
                          : "none",
                    }}
                  >
                    {valuesVisible && valuePosition === "inside" && (
                      <div
                        style={{
                          width: "100%",
                          paddingTop: Math.max(6, valueFontSize * 0.45),
                          color: valueColor,
                          fontSize: valueFontSize,
                          fontWeight: 760,
                          letterSpacing: "-0.065em",
                          lineHeight: 0.9,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          opacity: valueOpacity,
                        }}
                      >
                        {value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {labelsVisible && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: labelSpace,
              display: "flex",
              alignItems: "flex-end",
              gap: `${barGapPercent}%`,
            }}
          >
            {safeValues.map((_, index) => (
              <div
                key={`${labels[index] ?? "item"}-label-${index}`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  color: labelColor,
                  fontSize: labelFontSize,
                  fontWeight: 400,
                  lineHeight: 1.15,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {labels[index] ?? `Item ${index + 1}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
