import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type DataTableColumn = {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  variant?: "text" | "badge";
};

export type DataTableCell = string | number | boolean | null | undefined;
export type DataTableRow = Record<string, DataTableCell>;
export type DataTablePreset = "dark" | "light";

export type DataTableProps = {
  columns?: DataTableColumn[];
  tableData?: DataTableRow[];
  preset?: DataTablePreset;
  accent?: string;
  textColor?: string;
  mutedColor?: string;
  surfaceColor?: string;
  borderColor?: string;
  rowAltColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  backgroundOpacity?: number;
  headerFontSize?: number;
  cellFontSize?: number;
  animationEnabled?: boolean;
  entranceInFrames?: number;
  staggerInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type DataTablePresetProps = Required<
  Pick<
    DataTableProps,
    | "accent"
    | "textColor"
    | "mutedColor"
    | "surfaceColor"
    | "borderColor"
    | "rowAltColor"
    | "borderWidth"
    | "borderRadius"
    | "backgroundOpacity"
    | "headerFontSize"
    | "cellFontSize"
  >
>;

export const DATA_TABLE_PRESETS: Record<
  DataTablePreset,
  DataTablePresetProps
> = {
  dark: {
    accent: "#c7ff4a",
    textColor: "#f7f9f5",
    mutedColor: "#a5aba2",
    surfaceColor: "#141612",
    borderColor: "#30352d",
    rowAltColor: "#171a15",
    borderWidth: 1,
    borderRadius: 28,
    backgroundOpacity: 1,
    headerFontSize: 23,
    cellFontSize: 27,
  },
  light: {
    accent: "#2563eb",
    textColor: "#111827",
    mutedColor: "#4b5563",
    surfaceColor: "#ffffff",
    borderColor: "#d1d5db",
    rowAltColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 28,
    backgroundOpacity: 1,
    headerFontSize: 23,
    cellFontSize: 27,
  },
};

const DEFAULT_COLUMNS: DataTableColumn[] = [
  {key: "project", label: "Project", width: 1.5},
  {key: "status", label: "Status", width: 0.9, variant: "badge"},
  {key: "owner", label: "Owner", width: 1},
  {key: "progress", label: "Progress", width: 0.7, align: "right"},
];

const DEFAULT_TABLE_DATA: DataTableRow[] = [
  {
    project: "Website redesign",
    status: "In progress",
    owner: "Maya Chen",
    progress: "72%",
  },
  {
    project: "Mobile onboarding",
    status: "Ready",
    owner: "Alex Morgan",
    progress: "100%",
  },
  {
    project: "Analytics dashboard",
    status: "Review",
    owner: "Sam Rivera",
    progress: "48%",
  },
  {
    project: "Billing migration",
    status: "Planned",
    owner: "Noah Williams",
    progress: "15%",
  },
];

const alignment = (align: DataTableColumn["align"]) =>
  align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";

const colorWithOpacity = (color: string, opacity: number) => {
  const safeOpacity = Math.max(0, Math.min(1, opacity));
  const shortHex = color.match(/^#([\da-f])([\da-f])([\da-f])$/i);
  const longHex = color.match(/^#([\da-f]{6})$/i);
  const alpha = Math.round(safeOpacity * 255)
    .toString(16)
    .padStart(2, "0");

  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}${alpha}`;
  }

  if (longHex) {
    return `${color}${alpha}`;
  }

  return `color-mix(in srgb, ${color} ${safeOpacity * 100}%, transparent)`;
};

export const DataTable: React.FC<DataTableProps> = ({
  columns = DEFAULT_COLUMNS,
  tableData = DEFAULT_TABLE_DATA,
  preset = "dark",
  accent,
  textColor,
  mutedColor,
  surfaceColor,
  borderColor,
  rowAltColor,
  borderWidth,
  borderRadius,
  backgroundOpacity,
  headerFontSize,
  cellFontSize,
  animationEnabled = true,
  entranceInFrames = 20,
  staggerInFrames = 7,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: compositionWidth, height: compositionHeight} = useVideoConfig();
  const unit = Math.max(0.55, Math.min(compositionWidth / 1920, compositionHeight / 1080));
  const safeColumns = columns.length ? columns.slice(0, 6) : DEFAULT_COLUMNS;
  const safeRows = tableData.length ? tableData.slice(0, 8) : DEFAULT_TABLE_DATA;
  const tableWidth = width ?? compositionWidth * 0.86;
  const tableHeight = height ?? (86 + safeRows.length * 96) * unit;
  const left = x ?? (compositionWidth - tableWidth) / 2;
  const top = y ?? (compositionHeight - tableHeight) / 2;
  const safeEntrance = Math.max(1, entranceInFrames);
  const safeStagger = Math.max(0, staggerInFrames);
  const config = DATA_TABLE_PRESETS[preset] ?? DATA_TABLE_PRESETS.dark;
  const resolvedAccent = accent ?? config.accent;
  const resolvedTextColor = textColor ?? config.textColor;
  const resolvedMutedColor = mutedColor ?? config.mutedColor;
  const resolvedSurfaceColor = surfaceColor ?? config.surfaceColor;
  const resolvedBorderColor = borderColor ?? config.borderColor;
  const resolvedRowAltColor = rowAltColor ?? config.rowAltColor;
  const resolvedBorderWidth = Math.max(0, borderWidth ?? config.borderWidth);
  const resolvedBorderRadius = Math.max(
    0,
    borderRadius ?? config.borderRadius,
  );
  const resolvedBackgroundOpacity = Math.max(
    0,
    Math.min(1, backgroundOpacity ?? config.backgroundOpacity),
  );
  const resolvedHeaderFontSize = headerFontSize ?? config.headerFontSize;
  const resolvedCellFontSize = cellFontSize ?? config.cellFontSize;
  const gridTemplateColumns = safeColumns
    .map((column) => `${Math.max(0.25, column.width ?? 1)}fr`)
    .join(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        color: resolvedTextColor,
        fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: tableWidth,
          height: tableHeight,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
          border: `${resolvedBorderWidth}px solid ${resolvedBorderColor}`,
          borderRadius: resolvedBorderRadius * unit,
          backgroundColor: "transparent",
          boxShadow: "0 32px 90px rgba(0,0,0,0.16)",
          opacity: animationEnabled
            ? interpolate(frame, [0, safeEntrance], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })
            : 1,
          scale: animationEnabled
            ? interpolate(frame, [0, safeEntrance], [0.98, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: "perceptual-scale",
              })
            : 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns,
            alignItems: "center",
            flex: `0 0 ${86 * unit}px`,
            padding: `0 ${36 * unit}px`,
            borderBottom: `${resolvedBorderWidth}px solid ${resolvedBorderColor}`,
            backgroundColor: colorWithOpacity(
              resolvedSurfaceColor,
              resolvedBackgroundOpacity,
            ),
          }}
        >
          {safeColumns.map((column) => (
            <span
              key={column.key}
              style={{
                display: "flex",
                justifyContent: alignment(column.align),
                color: resolvedMutedColor,
                fontSize: resolvedHeaderFontSize * unit,
                fontWeight: 680,
                letterSpacing: "-.02em",
              }}
            >
              {column.label}
            </span>
          ))}
        </div>

        {safeRows.map((row, rowIndex) => {
          const rowEntrance = spring({
            frame: animationEnabled
              ? frame - safeEntrance * 0.35 - rowIndex * safeStagger
              : 1000,
            fps,
            config: {damping: 24, stiffness: 170, mass: 0.75},
          });

          return (
            <div
              key={rowIndex}
              style={{
                display: "grid",
                gridTemplateColumns,
                alignItems: "center",
                flex: "1 1 0",
                minHeight: 0,
                padding: `0 ${36 * unit}px`,
                borderTop:
                  rowIndex === 0
                    ? "none"
                    : `${resolvedBorderWidth}px solid ${resolvedBorderColor}`,
                backgroundColor:
                  rowIndex % 2 === 0
                    ? colorWithOpacity(
                        resolvedSurfaceColor,
                        resolvedBackgroundOpacity,
                      )
                    : colorWithOpacity(
                        resolvedRowAltColor,
                        resolvedBackgroundOpacity,
                      ),
                opacity: interpolate(rowEntrance, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: `${interpolate(rowEntrance, [0, 1], [30, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px 0px`,
              }}
            >
              {safeColumns.map((column, columnIndex) => {
                const value = row[column.key];
                const label =
                  value === null || value === undefined
                    ? "—"
                    : typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : String(value);

                return (
                  <span
                    key={column.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: alignment(column.align),
                      minWidth: 0,
                      color:
                        value === null || value === undefined
                          ? resolvedMutedColor
                          : resolvedTextColor,
                      fontSize: resolvedCellFontSize * unit,
                      fontWeight: columnIndex === 0 ? 680 : 580,
                      letterSpacing: "-.022em",
                    }}
                  >
                    {column.variant === "badge" ? (
                      <i
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 9 * unit,
                          padding: `${8 * unit}px ${13 * unit}px`,
                          border: `${Math.max(1, unit)}px solid ${resolvedAccent}42`,
                          borderRadius: 999,
                          backgroundColor: `${resolvedAccent}14`,
                          color: resolvedAccent,
                          fontStyle: "normal",
                          fontSize: resolvedCellFontSize * 0.68 * unit,
                          fontWeight: 760,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <b
                          style={{
                            width: 8 * unit,
                            height: 8 * unit,
                            borderRadius: "50%",
                            backgroundColor: resolvedAccent,
                          }}
                        />
                        {label}
                      </i>
                    ) : (
                      label
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
