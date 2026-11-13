import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export type DonutChartDatum = {
  label: string;
  value: number;
  secondary?: number;
};
export type DonutChartProps = {
  items?: DonutChartDatum[];
  preset?: "clean" | "soft" | "dark";
  accent?: string;
  legendVisible?: boolean;
  legendSizePercent?: number;
  paceInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
const DEFAULT_ITEMS: DonutChartDatum[] = [
  { label: "Organic", value: 44 },
  { label: "Paid", value: 28 },
  { label: "Partners", value: 18 },
  { label: "Other", value: 10 },
];
const colors = [
  "#8b5cf6",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];
export const DonutChart: React.FC<DonutChartProps> = ({
  items = DEFAULT_ITEMS,
  preset = "dark",
  accent = "#8b5cf6",
  legendVisible = true,
  legendSizePercent = 2.2,
  paceInFrames = 12,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { width: cw, height: ch } = useVideoConfig();
  const w = width ?? cw * 0.8,
    h = height ?? ch * 0.8,
    left = x ?? (cw - w) / 2,
    top = y ?? (ch - h) / 2;
  const variant = ["clean", "soft", "dark"].indexOf(preset),
    dark = variant === 2,
    text = dark ? "#f7f8f5" : "#16191f",
    muted = dark ? "#9ca3af" : "#697180";
  const safeItems = items.length ? items : DEFAULT_ITEMS,
    total = Math.max(
      1,
      safeItems.reduce((sum, item) => sum + Math.max(0, item.value), 0),
    ),
    progress = interpolate(
      frame,
      [0, Math.max(1, paceInFrames * safeItems.length)],
      [0.08, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  const legendBelow = legendVisible && w < h * 0.9;
  const donutSize = Math.max(
    120,
    Math.min(
      legendVisible && !legendBelow ? w * 0.64 : w * 0.96,
      legendBelow ? h * 0.7 : h * 0.96,
    ),
  );
  const chartUnit = donutSize / 420;
  const legendSize =
    (w * Math.max(0.5, Math.min(10, legendSizePercent))) / 100;
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          display: "flex",
          flexDirection: legendBelow ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: legendVisible ? legendSize * 1.7 : 0,
          overflow: "visible",
          color: text,
          fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            width: donutSize,
            height: donutSize,
            flex: "0 0 auto",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width={donutSize}
            height={donutSize}
            viewBox="0 0 240 240"
            style={{ rotate: "-90deg", overflow: "visible" }}
          >
            {safeItems.map((item, index) => {
              const share = Math.max(0, item.value) / total;
              const before =
                safeItems
                  .slice(0, index)
                  .reduce(
                    (sum, current) => sum + Math.max(0, current.value),
                    0,
                  ) / total;
              return (
                <circle
                  key={`${item.label}-${index}`}
                  cx="120"
                  cy="120"
                  r="86"
                  fill="none"
                  stroke={index === 0 ? accent : colors[index % colors.length]}
                  strokeWidth="34"
                  pathLength="1"
                  strokeDasharray={`${share * progress} ${1 - share * progress}`}
                  strokeDashoffset={-before * progress}
                />
              );
            })}
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ fontSize: 52 * chartUnit, fontWeight: 850 }}>
              {Math.round(total)}
            </div>
            <div style={{ color: muted, fontSize: 15 * chartUnit }}>total</div>
          </div>
        </div>
        {legendVisible ? (
          <div style={{ display: "grid", gap: legendSize * 0.85 }}>
            {safeItems.map((item, index) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: legendSize * 0.7,
                }}
              >
                <span
                  style={{
                    width: legendSize * 0.72,
                    height: legendSize * 0.72,
                    borderRadius: legendSize * 0.22,
                    flex: "0 0 auto",
                    backgroundColor:
                      index === 0 ? accent : colors[index % colors.length],
                  }}
                />
                <span style={{ flex: 1, fontSize: legendSize }}>
                  {item.label}
                </span>
                <strong style={{ fontSize: legendSize * 1.06 }}>
                  {Math.round((Math.max(0, item.value) / total) * 100)}%
                </strong>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
