import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export type ImageCarouselProps = {
  images?: string[];
  labels?: string[];
  preset?: "gallery" | "stack" | "filmstrip";
  accent?: string;
  paceInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
const DEFAULT_IMAGES = ["", "", ""];
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = DEFAULT_IMAGES,
  labels = ["Overview", "Details", "Results"],
  preset = "gallery",
  accent = "#67e8f9",
  paceInFrames = 40,
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
  const active =
    Math.floor(frame / Math.max(1, paceInFrames)) % Math.max(1, safe.length);
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
          border: "1px solid #343944",
          backgroundColor: "#111318",
          boxShadow: "0 34px 90px rgba(0,0,0,.25)",
          fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {media(safe[active] ?? "", active)}
        </div>
        <div
          style={{
            position: "absolute",
            left: 24 * unit,
            right: 24 * unit,
            bottom: 22 * unit,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16 * unit,
            borderRadius: 14 * unit,
            backgroundColor: "rgba(0,0,0,.68)",
            color: "#fff",
          }}
        >
          <strong style={{ fontSize: 19 * unit }}>
            {labels[active] ?? `Image ${active + 1}`}
          </strong>
          <div style={{ display: "flex", gap: 8 * unit }}>
            {safe.map((_, index) => (
              <span
                key={index}
                style={{
                  width: index === active ? 24 * unit : 8 * unit,
                  height: 8 * unit,
                  borderRadius: 999,
                  backgroundColor: index === active ? accent : "#fff7",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
