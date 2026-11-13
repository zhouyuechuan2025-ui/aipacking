import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type AreaChartDatum = {
  label: string;
  value: number;
  secondary?: number;
};

export type AreaChartPreset =
  | "editorial"
  | "gradient"
  | "dark"
  | "minimal"
  | "bold";

export type AreaChartProps = {
  items?: AreaChartDatum[];
  preset?: AreaChartPreset;
  accent?: string;
  secondaryAccent?: string;
  secondaryAccentEnabled?: boolean;
  gridVisible?: boolean;
  gridDashed?: boolean;
  gridColor?: string;
  labelColor?: string;
  valueColor?: string;
  pointStrokeColor?: string;
  glowVisible?: boolean;
  labelsVisible?: boolean;
  valuesVisible?: boolean;
  labelFontSize?: number;
  valueFontSize?: number;
  valueSizePercent?: number;
  lineWidth?: number;
  paceInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const DEFAULT_ITEMS: AreaChartDatum[] = [
  { label: "Jan", value: 18 },
  { label: "Feb", value: 26 },
  { label: "Mar", value: 23 },
  { label: "Apr", value: 39 },
  { label: "May", value: 48 },
  { label: "Jun", value: 61 },
];

type AreaChartPresetProps = Required<
  Pick<
    AreaChartProps,
    | "accent"
    | "secondaryAccent"
    | "secondaryAccentEnabled"
    | "gridVisible"
    | "gridDashed"
    | "gridColor"
    | "labelColor"
    | "valueColor"
    | "pointStrokeColor"
    | "glowVisible"
    | "labelsVisible"
    | "valuesVisible"
    | "labelFontSize"
    | "valueSizePercent"
    | "lineWidth"
    | "paceInFrames"
  >
> &
  Pick<AreaChartProps, "valueFontSize">;

export const AREA_CHART_PRESETS: Record<
  AreaChartPreset,
  AreaChartPresetProps
> = {
  editorial: {
    accent: "#ff5a36",
    secondaryAccent: "#ffbf3f",
    secondaryAccentEnabled: true,
    gridVisible: true,
    gridDashed: false,
    gridColor: "rgba(255, 178, 148, 0.2)",
    labelColor: "#ffd1c2",
    valueColor: "#fff8f5",
    pointStrokeColor: "#fff3ed",
    glowVisible: false,
    labelsVisible: true,
    valuesVisible: true,
    labelFontSize: 18,
    valueSizePercent: 3.2,
    lineWidth: 7,
    paceInFrames: 12,
  },
  gradient: {
    accent: "#8b5cf6",
    secondaryAccent: "#22d3ee",
    secondaryAccentEnabled: true,
    gridVisible: true,
    gridDashed: true,
    gridColor: "rgba(196, 181, 253, 0.14)",
    labelColor: "#b8b3d2",
    valueColor: "#ffffff",
    pointStrokeColor: "#171129",
    glowVisible: true,
    labelsVisible: true,
    valuesVisible: true,
    labelFontSize: 18,
    valueSizePercent: 3.2,
    lineWidth: 8,
    paceInFrames: 12,
  },
  dark: {
    accent: "#b7ff45",
    secondaryAccent: "#32d5ff",
    secondaryAccentEnabled: true,
    gridVisible: true,
    gridDashed: true,
    gridColor: "rgba(203, 255, 117, 0.12)",
    labelColor: "#9baaa3",
    valueColor: "#f4fff8",
    pointStrokeColor: "#0c1110",
    glowVisible: true,
    labelsVisible: true,
    valuesVisible: true,
    labelFontSize: 18,
    valueSizePercent: 3.2,
    lineWidth: 9,
    paceInFrames: 12,
  },
  minimal: {
    accent: "#f8fafc",
    secondaryAccent: "#f8fafc",
    secondaryAccentEnabled: false,
    gridVisible: false,
    gridDashed: false,
    gridColor: "rgba(248, 250, 252, 0.12)",
    labelColor: "#f8fafc",
    valueColor: "#f8fafc",
    pointStrokeColor: "#f8fafc",
    glowVisible: false,
    labelsVisible: false,
    valuesVisible: false,
    labelFontSize: 18,
    valueSizePercent: 3.2,
    lineWidth: 7,
    paceInFrames: 12,
  },
  bold: {
    accent: "#b7ff45",
    secondaryAccent: "#32d5ff",
    secondaryAccentEnabled: false,
    gridVisible: false,
    gridDashed: false,
    gridColor: "rgba(203, 255, 117, 0.12)",
    labelColor: "#9baaa3",
    valueColor: "#f4fff8",
    pointStrokeColor: "#0c1110",
    glowVisible: true,
    labelsVisible: true,
    valuesVisible: true,
    labelFontSize: 63,
    valueFontSize: 93,
    valueSizePercent: 3.2,
    lineWidth: 30,
    paceInFrames: 12,
  },
};

const makeSmoothPath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return "";
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C ${midpoint},${previous.y} ${midpoint},${point.y} ${point.x},${point.y}`;
  }, `M ${points[0].x},${points[0].y}`);
};

export const AreaChart: React.FC<AreaChartProps> = (props) => {
  const {
    items = DEFAULT_ITEMS,
    preset = "bold",
    x,
    y,
    width,
    height,
  } = props;
  const frame = useCurrentFrame();
  const { width: compositionWidth, height: compositionHeight } =
    useVideoConfig();
  const gradientId = React.useId().replace(/:/g, "");
  const revealId = React.useId().replace(/:/g, "");
  const glowId = React.useId().replace(/:/g, "");
  const chartWidth = width ?? compositionWidth * 0.8;
  const chartHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - chartWidth) / 2;
  const top = y ?? (compositionHeight - chartHeight) / 2;
  const presetProps = AREA_CHART_PRESETS[preset];
  const lineColor = props.accent ?? presetProps.accent;
  const fillColor = props.secondaryAccent ?? presetProps.secondaryAccent;
  const secondaryAccentEnabled =
    props.secondaryAccentEnabled ?? presetProps.secondaryAccentEnabled;
  const gridVisible = props.gridVisible ?? presetProps.gridVisible;
  const gridDashed = props.gridDashed ?? presetProps.gridDashed;
  const gridColor = props.gridColor ?? presetProps.gridColor;
  const resolvedLabelColor = props.labelColor ?? presetProps.labelColor;
  const resolvedValueColor = props.valueColor ?? presetProps.valueColor;
  const pointStrokeColor =
    props.pointStrokeColor ?? presetProps.pointStrokeColor;
  const glowVisible = props.glowVisible ?? presetProps.glowVisible;
  const labelsVisible = props.labelsVisible ?? presetProps.labelsVisible;
  const valuesVisible = props.valuesVisible ?? presetProps.valuesVisible;
  const labelFontSize = props.labelFontSize ?? presetProps.labelFontSize;
  const valueSizePercent =
    props.valueSizePercent ?? presetProps.valueSizePercent;
  const valueFontSize =
    props.valueFontSize ??
    presetProps.valueFontSize ??
    (Math.min(chartWidth, chartHeight) * valueSizePercent) / 100;
  const lineWidth = props.lineWidth ?? presetProps.lineWidth;
  const paceInFrames = props.paceInFrames ?? presetProps.paceInFrames;
  const horizontalInset = Math.max(
    lineWidth,
    Math.min(50, chartWidth * 0.08),
  );
  const topInset = Math.min(
    chartHeight / 3,
    Math.max(lineWidth, valuesVisible ? valueFontSize * 1.8 : lineWidth),
  );
  const bottomInset = labelsVisible
    ? Math.max(24, labelFontSize * 1.6)
    : Math.max(lineWidth, 4);
  const plotLeft = horizontalInset;
  const plotRight = Math.max(plotLeft + 1, chartWidth - horizontalInset);
  const plotTop = topInset;
  const plotBottom = Math.max(plotTop + 1, chartHeight - bottomInset);
  const safeItems = items.length ? items : DEFAULT_ITEMS;
  const maximum = Math.max(1, ...safeItems.map((item) => item.value));
  const minimum = Math.min(...safeItems.map((item) => item.value));
  const range = Math.max(1, maximum - minimum);
  const activeIndex = Math.min(
    safeItems.length - 1,
    Math.max(0, Math.floor(frame / Math.max(1, paceInFrames))),
  );
  const plotPoints = safeItems.map((item, index) => ({
    x:
      plotLeft +
      (index / Math.max(1, safeItems.length - 1)) * (plotRight - plotLeft),
    y:
      plotBottom -
      ((item.value - minimum) / range) * (plotBottom - plotTop),
  }));
  const linePath = makeSmoothPath(plotPoints);
  const areaPath = `${linePath} L ${plotRight},${plotBottom} L ${plotLeft},${plotBottom} Z`;
  const activePoint = plotPoints[activeIndex];
  const activeItem = safeItems[activeIndex];

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
          boxSizing: "border-box",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={lineColor} stopOpacity="0.54" />
              <stop offset="0.72" stopColor={fillColor} stopOpacity="0.2" />
              <stop offset="1" stopColor={fillColor} stopOpacity="0.02" />
            </linearGradient>
            <clipPath id={revealId}>
              <rect
                width={interpolate(frame, [0, 55], [0, chartWidth], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
                height={chartHeight}
              />
            </clipPath>
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {gridVisible && (
            <g>
              {Array.from({ length: 4 }, (_, index) =>
                plotTop +
                (index / 3) * (plotBottom - plotTop),
              ).map((gridY) => (
                <line
                  key={`horizontal-${gridY}`}
                  x1={plotLeft}
                  x2={plotRight}
                  y1={gridY}
                  y2={gridY}
                  stroke={gridColor}
                  strokeWidth="2"
                  strokeDasharray={gridDashed ? "6 12" : undefined}
                />
              ))}
              {plotPoints.map((point, index) => (
                <line
                  key={`vertical-${index}`}
                  x1={point.x}
                  x2={point.x}
                  y1={plotTop}
                  y2={plotBottom}
                  stroke={gridColor}
                  strokeWidth="2"
                  strokeDasharray={gridDashed ? "6 12" : undefined}
                />
              ))}
            </g>
          )}

          <g clipPath={`url(#${revealId})`}>
            {secondaryAccentEnabled && (
              <path d={areaPath} fill={`url(#${gradientId})`} />
            )}
            <path
              d={linePath}
              fill="none"
              stroke={lineColor}
              strokeWidth={lineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={
                secondaryAccentEnabled && glowVisible
                  ? `url(#${glowId})`
                  : undefined
              }
            />
          </g>

          {valuesVisible &&
            plotPoints.map((point, index) => {
              const pointProgress = interpolate(
                frame,
                [index * 7 + 8, index * 7 + 20],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              );
              return (
                <circle
                  key={safeItems[index].label}
                  cx={point.x}
                  cy={point.y}
                  r={index === activeIndex ? 10 : 6}
                  fill={
                    index === activeIndex && secondaryAccentEnabled
                      ? fillColor
                      : lineColor
                  }
                  stroke={
                    secondaryAccentEnabled ? pointStrokeColor : lineColor
                  }
                  strokeWidth="5"
                  opacity={pointProgress}
                />
              );
            })}

          {valuesVisible && (
            <g
              opacity={interpolate(frame, [6, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            >
              <text
                x={activePoint.x}
                y={Math.max(valueFontSize, activePoint.y - valueFontSize * 0.65)}
                textAnchor="middle"
                fill={resolvedValueColor}
                fontSize={valueFontSize}
                fontWeight="760"
                letterSpacing="-0.065em"
              >
                {activeItem.value}
              </text>
            </g>
          )}

          {labelsVisible &&
            safeItems.map((item, index) => (
              <text
                key={item.label}
                x={plotPoints[index].x}
                y={chartHeight - Math.max(3, labelFontSize * 0.2)}
                textAnchor="middle"
                fill={resolvedLabelColor}
                fontSize={labelFontSize}
                fontWeight="400"
              >
                {item.label}
              </text>
            ))}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
