import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
export type TestimonialCardItem = {
  title: string;
  detail?: string;
  meta?: string;
};
export type TestimonialCardProps = {
  title?: string;
  items?: TestimonialCardItem[];
  preset?: "editorial" | "glass" | "bold";
  accent?: string;
  paceInFrames?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
const DEFAULT_ITEMS: TestimonialCardItem[] = [
  {
    title: "“We shipped the launch video in one afternoon.”",
    detail: "Maya Chen · Product Designer",
    meta: "Northstar Labs",
  },
];
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  title = "Testimonial Card",
  items = DEFAULT_ITEMS,
  preset = "editorial",
  accent = "#8b5cf6",
  paceInFrames = 14,
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
    variant = ["editorial", "glass", "bold"].indexOf(preset),
    dark = variant === 2,
    surface = dark ? "#111318" : "#fff",
    card = dark ? "#1c2027" : variant === 1 ? "#f0f2f7" : "#f7f8fa",
    text = dark ? "#f7f8f5" : "#171a20",
    muted = dark ? "#9ca3af" : "#697180",
    border = dark ? "#343944" : "#dfe3ea",
    safeItems = items.length ? items : DEFAULT_ITEMS,
    active = Math.min(
      safeItems.length - 1,
      Math.floor(frame / Math.max(1, paceInFrames)),
    ),
    layout: string = "single";
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          padding: 42 * unit,
          overflow: "hidden",
          borderRadius: 30 * unit,
          border: `1px solid ${border}`,
          background:
            variant === 1
              ? `linear-gradient(135deg,${accent}16,${surface})`
              : surface,
          boxShadow: "0 34px 90px rgba(0,0,0,.2)",
          color: text,
          fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 26 * unit,
          }}
        >
          <strong style={{ fontSize: 36 * unit, letterSpacing: "-.04em" }}>
            {title}
          </strong>
          <span
            style={{
              fontSize: 13 * unit,
              color: accent,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {preset}
          </span>
        </div>
        <div
          style={{
            height: "76%",
            display: "grid",
            placeItems: "center",
            textAlign: layout === "quote" ? "left" : "center",
          }}
        >
          <div
            style={{
              maxWidth: "86%",
              padding: 30 * unit,
              borderLeft: layout === "quote" ? `8px solid ${accent}` : "none",
            }}
          >
            <div
              style={{
                fontSize: (layout === "quote" ? 56 : 48) * unit,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: "-.045em",
              }}
            >
              {safeItems[0].title}
            </div>
            <div
              style={{
                marginTop: 22 * unit,
                color: muted,
                fontSize: 18 * unit,
              }}
            >
              {safeItems[0].detail}
            </div>
            <div
              style={{
                marginTop: 8 * unit,
                color: accent,
                fontSize: 14 * unit,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              {safeItems[0].meta}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
