import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type ArchitectureNode = {
  id: string;
  label?: string;
  content?: React.ReactNode;
  kind?: "client" | "service" | "api" | "database" | "queue";
  x: number;
  y: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
};
export type ArchitectureConnection = {
  from: string;
  to: string;
  label?: string;
  labelFontSize?: number;
  color?: string;
};
export type ArchitectureDiagramPreset =
  | "cloud"
  | "blueprint"
  | "neon"
  | "clean";
export type ArchitectureDiagramProps = {
  nodes?: ArchitectureNode[];
  connections?: ArchitectureConnection[];
  preset?: ArchitectureDiagramPreset;
  accent?: string;
  nodeBackgroundColor?: string;
  nodeTextColor?: string;
  nodeBorderColor?: string;
  nodeShadow?: string;
  nodeFontSize?: number;
  lineColor?: string;
  lineLabelFontSize?: number;
  gridVisible?: boolean;
  gridColor?: string;
  gridSize?: number;
  dashed?: boolean;
  pulseSpeed?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type ArchitectureDiagramPresetProps = Required<
  Pick<
    ArchitectureDiagramProps,
    | "accent"
    | "nodeBackgroundColor"
    | "nodeTextColor"
    | "nodeBorderColor"
    | "nodeShadow"
    | "lineColor"
    | "gridVisible"
    | "gridColor"
    | "gridSize"
    | "nodeFontSize"
    | "lineLabelFontSize"
    | "dashed"
    | "pulseSpeed"
  >
>;

export const ARCHITECTURE_DIAGRAM_PRESETS: Record<
  ArchitectureDiagramPreset,
  ArchitectureDiagramPresetProps
> = {
  cloud: {
    accent: "#67e8f9",
    nodeBackgroundColor: "#0d1720",
    nodeTextColor: "#f4f7fb",
    nodeBorderColor: "#3b5263",
    nodeShadow:
      "0 14px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.035)",
    lineColor: "#67e8f9",
    gridVisible: false,
    gridColor: "rgba(103,232,249,.08)",
    gridSize: 36,
    nodeFontSize: 19,
    lineLabelFontSize: 14,
    dashed: true,
    pulseSpeed: 1.5,
  },
  blueprint: {
    accent: "#67e8f9",
    nodeBackgroundColor: "#0b263b",
    nodeTextColor: "#f4f7fb",
    nodeBorderColor: "#376681",
    nodeShadow:
      "0 14px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.035)",
    lineColor: "#67e8f9",
    gridVisible: true,
    gridColor: "rgba(103,232,249,.08)",
    gridSize: 36,
    nodeFontSize: 19,
    lineLabelFontSize: 14,
    dashed: true,
    pulseSpeed: 1.5,
  },
  neon: {
    accent: "#67e8f9",
    nodeBackgroundColor: "#15101f",
    nodeTextColor: "#f4f7fb",
    nodeBorderColor: "#5e4770",
    nodeShadow:
      "0 14px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.035)",
    lineColor: "#67e8f9",
    gridVisible: false,
    gridColor: "rgba(103,232,249,.08)",
    gridSize: 36,
    nodeFontSize: 19,
    lineLabelFontSize: 14,
    dashed: true,
    pulseSpeed: 1.5,
  },
  clean: {
    accent: "#67e8f9",
    nodeBackgroundColor: "#0b263b",
    nodeTextColor: "#f4f7fb",
    nodeBorderColor: "#376681",
    nodeShadow: "none",
    lineColor: "#67e8f9",
    gridVisible: false,
    gridColor: "rgba(103,232,249,.08)",
    gridSize: 36,
    nodeFontSize: 54,
    lineLabelFontSize: 14,
    dashed: false,
    pulseSpeed: 1.5,
  },
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = (
  props,
) => {
  const {
    nodes = [
      { id: "client", label: "Web client", kind: "client", x: 10, y: 50 },
      { id: "api", label: "Edge API", kind: "api", x: 38, y: 50 },
      {
        id: "worker",
        label: "Render worker",
        kind: "service",
        x: 67,
        y: 27,
      },
      { id: "queue", label: "Job queue", kind: "queue", x: 67, y: 73 },
      { id: "db", label: "Database", kind: "database", x: 90, y: 50 },
    ],
    connections = [
      { from: "client", to: "api" },
      { from: "api", to: "worker" },
      { from: "api", to: "queue" },
      { from: "worker", to: "db" },
      { from: "queue", to: "db" },
    ],
    preset = "clean",
    x,
    y,
    width,
    height,
  } = props;
  const frame = useCurrentFrame();
  const maskPrefix = React.useId().replace(/:/g, "");
  const {
    width: compositionWidth,
    height: compositionHeight,
    fps,
  } = useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const presetProps = ARCHITECTURE_DIAGRAM_PRESETS[preset];
  const accent = props.accent ?? presetProps.accent;
  const nodeBackgroundColor =
    props.nodeBackgroundColor ?? presetProps.nodeBackgroundColor;
  const nodeTextColor = props.nodeTextColor ?? presetProps.nodeTextColor;
  const nodeBorderColor =
    props.nodeBorderColor ?? presetProps.nodeBorderColor;
  const nodeShadow = props.nodeShadow ?? presetProps.nodeShadow;
  const lineColor = props.lineColor ?? presetProps.lineColor;
  const gridVisible = props.gridVisible ?? presetProps.gridVisible;
  const gridColor = props.gridColor ?? presetProps.gridColor;
  const gridSize = props.gridSize ?? presetProps.gridSize;
  const nodeFontSize = props.nodeFontSize ?? presetProps.nodeFontSize;
  const lineLabelFontSize =
    props.lineLabelFontSize ?? presetProps.lineLabelFontSize;
  const dashed = props.dashed ?? presetProps.dashed;
  const pulseSpeed = props.pulseSpeed ?? presetProps.pulseSpeed;
  const fontFamily = "Inter, ui-sans-serif, system-ui, sans-serif";
  const unit = Math.max(
    0.42,
    Math.min(componentWidth / 1536, componentHeight / 864),
  );
  const plotHeight = componentHeight;
  const horizontalPadding = Math.max(18, 28 * unit);
  const safeNodes = nodes.length ? nodes : [];
  const byId = new Map(safeNodes.map((node) => [node.id, node]));
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left: componentX,
          top: componentY,
          width: componentWidth,
          height: componentHeight,
          overflow: "hidden",
          borderRadius: Math.max(16, 30 * unit),
          color: nodeTextColor,
          fontFamily,
        }}
      >
        <div
          style={{
            position: "relative",
            height: plotHeight,
            backgroundImage: gridVisible
              ? `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`
              : undefined,
            backgroundSize: `${gridSize * unit}px ${gridSize * unit}px`,
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {connections.map((connection, index) => {
              const from = byId.get(connection.from);
              const to = byId.get(connection.to);
              if (!from || !to) return null;
              const x1 = (from.x / 100) * componentWidth;
              const y1 = (from.y / 100) * plotHeight;
              const x2 = (to.x / 100) * componentWidth;
              const y2 = (to.y / 100) * plotHeight;
              const dx = x2 - x1;
              const dy = y2 - y1;
              const horizontal = Math.abs(dx) >= Math.abs(dy);
              const direction = horizontal
                ? Math.sign(dx) || 1
                : Math.sign(dy) || 1;
              const startX = x1;
              const startY = y1;
              const endX = x2;
              const endY = y2;
              const distance = horizontal
                ? Math.abs(endX - startX)
                : Math.abs(endY - startY);
              const bend = Math.max(34 * unit, distance * 0.48);
              const path = horizontal
                ? `M ${startX} ${startY} C ${startX + direction * bend} ${startY}, ${endX - direction * bend} ${endY}, ${endX} ${endY}`
                : `M ${startX} ${startY} C ${startX} ${startY + direction * bend}, ${endX} ${endY - direction * bend}, ${endX} ${endY}`;
              const leftmostX = Math.min(from.x, to.x);
              const rightmostX = Math.max(from.x, to.x);
              const revealStart = (0.15 + (leftmostX / 100) * 1.65 + 0.3) * fps;
              const revealEnd = Math.max(
                revealStart + 0.22 * fps,
                (0.15 + (rightmostX / 100) * 1.65 + 0.22) * fps,
              );
              const connectionColor = connection.color ?? lineColor ?? accent;
              const maskId = `${maskPrefix}-connection-${index}`;
              const labelX = (startX + endX) / 2;
              const labelY = (startY + endY) / 2 - Math.max(9, 13 * unit);
              return (
                <g key={`${connection.from}-${connection.to}-${index}`}>
                  <defs>
                    <mask
                      id={maskId}
                      maskUnits="userSpaceOnUse"
                      x={0}
                      y={0}
                      width={componentWidth}
                      height={plotHeight}
                    >
                      <path
                        d={path}
                        pathLength={1}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={Math.max(12, 18 * unit)}
                        strokeLinecap="butt"
                        strokeDasharray={`${interpolate(frame, [revealStart, revealEnd], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.bezier(0.16, 1, 0.3, 1),
                        })} 1`}
                      />
                    </mask>
                  </defs>
                  <g mask={`url(#${maskId})`}>
                    <path
                      d={path}
                      fill="none"
                      stroke={connectionColor}
                      strokeOpacity={0.19}
                      strokeWidth={Math.max(5, 8 * unit)}
                      strokeLinecap="round"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={connectionColor}
                      strokeWidth={Math.max(2, 3.2 * unit)}
                      strokeLinecap="round"
                      strokeDasharray={
                        dashed
                          ? `${Math.max(12, 24 * unit)} ${Math.max(18, 36 * unit)}`
                          : undefined
                      }
                      strokeDashoffset={-frame * pulseSpeed}
                      style={{
                        filter: `drop-shadow(0 0 ${8 * unit}px ${connectionColor})`,
                      }}
                    />
                  </g>
                  {connection.label ? (
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      fill={connectionColor}
                      stroke={nodeBackgroundColor}
                      strokeWidth={Math.max(4, 7 * unit)}
                      paintOrder="stroke"
                      fontSize={
                        connection.labelFontSize ??
                        lineLabelFontSize ??
                        Math.max(10, 14 * unit)
                      }
                      fontWeight={650}
                      opacity={interpolate(
                        frame,
                        [revealEnd - 0.05 * fps, revealEnd + 0.15 * fps],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        },
                      )}
                    >
                      {connection.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
          {safeNodes.map((node) => {
            const revealStart = (0.15 + (node.x / 100) * 1.65) * fps;
            const revealEnd = revealStart + 0.4 * fps;
            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  translate: `${interpolate(frame, [revealStart, revealEnd], [-70, -50], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  })}% -50%`,
                  scale: interpolate(frame, [revealStart, revealEnd], [0.96, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                  opacity: interpolate(frame, [revealStart, revealEnd], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                  padding: `${Math.max(11, 16 * unit)}px ${horizontalPadding}px`,
                  margin: 0,
                  borderRadius: Math.max(9, 13 * unit),
                  border: `1px solid ${nodeBorderColor}`,
                  backgroundColor:
                    node.backgroundColor ?? nodeBackgroundColor,
                  color: node.textColor ?? nodeTextColor,
                  fontSize:
                    node.fontSize ??
                    nodeFontSize ??
                    Math.max(13, 19 * unit),
                  boxShadow: nodeShadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.max(8, 11 * unit),
                  boxSizing: "border-box",
                }}
              >
                {node.content !== undefined ? (
                  node.content
                ) : (
                  <>
                    {node.kind === "api" ? (
                      <span
                        style={{
                          width: Math.max(8, 11 * unit),
                          height: Math.max(8, 11 * unit),
                          flex: "0 0 auto",
                          borderRadius: "50%",
                          border: `${Math.max(1, 2 * unit)}px solid ${accent}`,
                          boxShadow: `0 0 ${8 * unit}px ${accent}88`,
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {node.label}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
