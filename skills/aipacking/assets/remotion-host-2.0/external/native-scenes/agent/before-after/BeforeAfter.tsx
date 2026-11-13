import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export type BeforeAfterProps = {
  images?: string[];
  labels?: string[];
  accent?: string;
  paceInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
const DEFAULT_IMAGES = ["", ""];
export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  images = DEFAULT_IMAGES,
  labels = ["Before", "After"],
  accent = "#c7ff4a",
  paceInFrames = 120,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame(),
    { width: cw, height: ch } = useVideoConfig(),
    w = width ?? cw * 0.8,
    h = height ?? ch * 0.8,
    left = x ?? (cw - w) / 2,
    top = y ?? (ch - h) / 2,
    unit = Math.max(0.45, Math.min(w / 1536, h / 864)),
    safe = images.length ? images : DEFAULT_IMAGES,
    placeholder = (index: number) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(circle at ${30 + index * 30}% 40%,${accent}55,transparent 36%),#151922`,
          color: "#fff",
          fontSize: 30 * unit,
          fontWeight: 800,
        }}
      >
        {labels[index] ?? `Image ${index + 1}`}
      </div>
    ),
    media = (src: string, index: number) =>
      src ? (
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        placeholder(index)
      );
  const split = interpolate(frame, [0, paceInFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: 28 * unit,
          fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {media(safe[0] ?? "", 0)}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${100 - split}% 0 0)`,
          }}
        >
          {media(safe[1] ?? "", 1)}
        </div>
        <div
          style={{
            position: "absolute",
            left: split + "%",
            top: 0,
            bottom: 0,
            width: 4 * unit,
            translate: "-50% 0",
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18 * unit,
            top: 18 * unit,
            padding: `${8 * unit}px ${12 * unit}px`,
            borderRadius: 9 * unit,
            backgroundColor: "rgba(0,0,0,.65)",
            color: "#fff",
          }}
        >
          {labels[0]}
        </div>
        <div
          style={{
            position: "absolute",
            right: 18 * unit,
            top: 18 * unit,
            padding: `${8 * unit}px ${12 * unit}px`,
            borderRadius: 9 * unit,
            backgroundColor: "rgba(0,0,0,.65)",
            color: "#fff",
          }}
        >
          {labels[1]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
