// external/video-shotcraft/demos/data/timeline-travel/TimelineTravel.tsx
import { useCurrentFrame, interpolate, Easing, spring } from "remotion";

// external/video-shotcraft/demos/_fixtures/Fixtures.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var G = {
  bg: "#ececea",
  panel: "#f7f7f6",
  line: "#dcdcda",
  bar: "#c2c2c0",
  ink: "#2f2f2f",
  mid: "#8f8f8d",
  card: "#ffffff",
  border: "#d8d8d6",
  side: "#3a3a3a",
  sideBar: "#5a5a58"
};
var MAX_PILL_LABEL_GRAPHEMES = 10;
function fitPillLabel(value) {
  const graphemes = Array.from(value.trim());
  return graphemes.length <= MAX_PILL_LABEL_GRAPHEMES ? graphemes.join("") : `${graphemes.slice(0, MAX_PILL_LABEL_GRAPHEMES - 1).join("")}\u2026`;
}
function rgbFromHex(background) {
  const match = background.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].split("").map((part) => `${part}${part}`).join("") : match[1];
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}
function relativeLuminance(color) {
  const rgb = rgbFromHex(color);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}
function contrastTextFor(background) {
  if (!rgbFromHex(background)) return "#171717";
  const dark = "#171717";
  const light = "#ffffff";
  return contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light;
}
var Card = ({ w, h: h2, seed = 0, style, palette = {} }) => {
  const titleW = 45 + seed * 37 % 40;
  const lines = 2 + seed % 3;
  return /* @__PURE__ */ jsxs("div", { style: {
    width: w,
    height: h2,
    background: palette.card || G.card,
    border: `2px solid ${palette.line || G.border}`,
    borderRadius: 14,
    padding: 18,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    ...style
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { height: 16, width: `${titleW}%`, background: palette.accent || G.bar, borderRadius: 8 } }),
    Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx("div", { style: { height: 10, width: `${88 - i * 14 - seed % 5 * 3}%`, background: palette.line || G.line, borderRadius: 5 } }, i)),
    /* @__PURE__ */ jsxs("div", { style: { marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: 26, height: 26, borderRadius: 13, background: palette.accent || G.mid } }),
      /* @__PURE__ */ jsx("div", { style: { height: 10, width: 64, background: palette.line || G.line, borderRadius: 5 } })
    ] })
  ] });
};
var FakeDashboard = ({ variant = "A", palette = {} }) => /* @__PURE__ */ jsxs("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, display: "flex" }, children: [
  /* @__PURE__ */ jsxs("div", { style: { width: 220, background: palette.panel || G.side, padding: "28px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }, children: [
    /* @__PURE__ */ jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: palette.accent || "#777775" } }),
    Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsx("div", { style: { height: 12, width: `${60 + i * 29 % 35}%`, background: palette.line || G.sideBar, borderRadius: 6 } }, i))
  ] }),
  /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { height: 72, background: palette.card || G.panel, borderBottom: `2px solid ${palette.line || G.line}`, display: "flex", alignItems: "center", padding: "0 32px", gap: 20, boxSizing: "border-box" }, children: [
      /* @__PURE__ */ jsx("div", { style: { height: 18, width: 180, background: palette.accent || G.bar, borderRadius: 9 } }),
      /* @__PURE__ */ jsx("div", { style: { marginLeft: "auto", height: 36, width: 320, background: palette.canvas || "#fff", border: `2px solid ${palette.line || G.line}`, borderRadius: 18, boxSizing: "border-box" } }),
      /* @__PURE__ */ jsx("div", { style: { width: 36, height: 36, borderRadius: 18, background: palette.accent || G.mid } })
    ] }),
    variant === "A" ? /* @__PURE__ */ jsx("div", { style: { flex: 1, padding: 36, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "1fr", gap: 28, boxSizing: "border-box" }, children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Card, { w: 0, h: 0, seed: i + 1, palette, style: { width: "100%", height: "100%" } }, i)) }) : /* @__PURE__ */ jsx("div", { style: { flex: 1, padding: 36, display: "flex", flexDirection: "column", gap: 20, boxSizing: "border-box" }, children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: palette.card || G.card, border: `2px solid ${palette.line || G.border}`, borderRadius: 14, display: "flex", alignItems: "center", gap: 24, padding: "0 28px", boxSizing: "border-box" }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: 44, height: 44, borderRadius: 10, background: palette.accent || G.mid } }),
      /* @__PURE__ */ jsx("div", { style: { height: 14, width: `${30 + i * 23 % 25}%`, background: palette.accent || G.bar, borderRadius: 7 } }),
      /* @__PURE__ */ jsx("div", { style: { marginLeft: "auto", height: 12, width: 120, background: palette.line || G.line, borderRadius: 6 } })
    ] }, i)) })
  ] })
] });
var TitleBlock = ({ text, size = 88, color }) => /* @__PURE__ */ jsx("div", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: size, color: color || G.ink, letterSpacing: -1 }, children: text });

// external/video-shotcraft/demos/data/timeline-travel/TimelineTravel.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var W = 1920;
var AXIS_Y = 700;
var TICK_GAP = 1400;
var TICKS = [
  { label: "v1.0", x: 960 },
  { label: "v2.0", x: 960 + TICK_GAP },
  { label: "v3.0", x: 960 + TICK_GAP * 2 },
  { label: "Today", x: 960 + TICK_GAP * 3 }
];
var WORLD_W = 960 + TICK_GAP * 3 + 960;
var TRAVEL_START = 12;
var TRAVEL_END = 104;
var ZOOM_END = 114;
var camXAt = (f) => {
  const total = TICKS[3].x - 960;
  const t = interpolate(f, [TRAVEL_START, TRAVEL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const eased = interpolate(t, [0, 0.15, 0.88, 1], [0, 0.055, 0.9, 1], {
    easing: Easing.inOut(Easing.quad)
  });
  return eased * total;
};
var popFrameOf = (tickX) => {
  for (let f = TRAVEL_START; f <= TRAVEL_END; f++) {
    if (camXAt(f) >= tickX - 960) return f;
  }
  return TRAVEL_END;
};
var CARD_W = 360;
var CARD_H = 240;
var TickStop = ({ i, frame, label, body, accent }) => {
  const tick = TICKS[i];
  const pop = popFrameOf(tick.x) - 6;
  const s = spring({
    frame: frame - pop,
    fps: 30,
    config: { damping: 11, stiffness: 160, mass: 0.9 },
    // 明显过冲
    durationInFrames: 26
  });
  const appeared = frame >= pop;
  return /* @__PURE__ */ jsxs2("div", { style: { position: "absolute", left: tick.x, top: 0 }, children: [
    /* @__PURE__ */ jsx2("div", { style: { position: "absolute", left: -3, top: AXIS_Y - 28, width: 6, height: 56, background: accent, borderRadius: 3 } }),
    /* @__PURE__ */ jsx2("div", { style: { position: "absolute", left: -80, top: AXIS_Y + 44, width: 160, textAlign: "center", fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 40, color: G.ink }, children: label }),
    appeared && /* @__PURE__ */ jsx2(
      "div",
      {
        style: {
          position: "absolute",
          left: -CARD_W / 2,
          top: AXIS_Y - 36 - CARD_H,
          transform: `scaleY(${s}) scaleX(${0.6 + 0.4 * s})`,
          transformOrigin: "50% 100%",
          opacity: Math.min(1, s * 2)
        },
        children: /* @__PURE__ */ jsxs2("div", { style: {
          width: CARD_W,
          height: CARD_H,
          boxSizing: "border-box",
          padding: "30px 28px",
          borderRadius: 22,
          background: "rgba(17,22,31,.96)",
          border: `3px solid ${accent}`,
          boxShadow: "0 18px 42px rgba(0,0,0,.26)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }, children: [
          /* @__PURE__ */ jsx2("div", { style: { fontSize: 25, color: accent, fontWeight: 850 }, children: label }),
          /* @__PURE__ */ jsx2("div", { style: { fontSize: 31, lineHeight: 1.28, fontWeight: 760, marginTop: 16 }, children: body })
        ] })
      }
    )
  ] });
};
var TimelineTravel = ({
  title = "\u5173\u952E\u9636\u6BB5\u6F14\u8FDB",
  subtitle = "\u4ECE\u8D77\u70B9\u5230\u73B0\u5728",
  items = [],
  palette = {}
}) => {
  const frame = useCurrentFrame();
  const camX = camXAt(frame);
  const accent = palette.accent ?? "#7ee7d5";
  const labels = ["01", "02", "03", "\u73B0\u5728"];
  const bodies = Array.from({ length: 4 }, (_, i) => items[i] || subtitle);
  const zoom = interpolate(frame, [TRAVEL_END, ZOOM_END], [1, 1.28], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxs2("div", { style: { width: W, height: 1080, background: palette.canvas ?? "transparent", overflow: "hidden", position: "relative" }, children: [
    /* @__PURE__ */ jsx2("div", { style: { width: W, height: 1080, transform: `scale(${zoom})`, transformOrigin: "50% 62%" }, children: /* @__PURE__ */ jsxs2("div", { style: { position: "absolute", left: 0, top: 0, width: WORLD_W, height: 1080, transform: `translateX(${-camX}px)` }, children: [
      /* @__PURE__ */ jsx2("div", { style: { position: "absolute", left: 200, top: AXIS_Y - 3, width: WORLD_W - 400, height: 6, background: palette.line ?? accent, borderRadius: 3 } }),
      Array.from({ length: 22 }).map((_, i) => /* @__PURE__ */ jsx2("div", { style: { position: "absolute", left: 960 + i * (TICK_GAP / 5) - 2, top: AXIS_Y - 12, width: 4, height: 24, background: palette.line ?? accent, borderRadius: 2 } }, i)),
      TICKS.map((_, i) => /* @__PURE__ */ jsx2(TickStop, { i, frame, label: labels[i], body: bodies[i], accent }, i))
    ] }) }),
    /* @__PURE__ */ jsxs2("div", { style: { position: "absolute", top: 90, width: "100%", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx2("div", { style: { fontSize: 64, fontWeight: 900, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.7)" }, children: title }),
      /* @__PURE__ */ jsx2("div", { style: { fontSize: 28, fontWeight: 650, color: accent, marginTop: 14 }, children: subtitle })
    ] })
  ] });
};

// external/video-shotcraft/demos/typography/word-relay-filmstrip/WordRelayFilmstrip.tsx
import { AbsoluteFill, interpolate as interpolate2, useCurrentFrame as useCurrentFrame2 } from "remotion";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var mulberry32 = (a) => () => {
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
var CARD_W2 = 940;
var CARD_H2 = 530;
var GAP = 105;
var STEP = CARD_H2 + GAP;
var DarkArticle = ({ seed }) => {
  const rand2 = mulberry32(seed);
  return /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#101318", padding: "38px 46px" }, children: [
    /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 26, alignItems: "center", marginBottom: 34 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 90, height: 13, background: "#d8b25a", borderRadius: 3, opacity: 0.9 } }),
      /* @__PURE__ */ jsx3("div", { style: { marginLeft: "auto", display: "flex", gap: 18 }, children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx3("div", { style: { width: 54, height: 9, background: "#3a3f48", borderRadius: 3 } }, i)) })
    ] }),
    /* @__PURE__ */ jsx3("div", { style: { width: 150, height: 9, background: "#a8452e", borderRadius: 3, marginBottom: 20 } }),
    /* @__PURE__ */ jsx3("div", { style: { width: "62%", height: 30, background: "#e8e6df", borderRadius: 5, marginBottom: 14 } }),
    /* @__PURE__ */ jsx3("div", { style: { width: "44%", height: 30, background: "#e8e6df", borderRadius: 5, marginBottom: 30 } }),
    /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 30 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { flex: 1.3 }, children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx3("div", { style: { height: 9, width: `${62 + rand2() * 34}%`, background: "#41454e", borderRadius: 3, marginBottom: 13 } }, i)) }),
      /* @__PURE__ */ jsx3("div", { style: { flex: 1, border: "1px solid #2c313a", borderRadius: 8, background: "#151a22", padding: 20 }, children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 15 }, children: [
        /* @__PURE__ */ jsx3("div", { style: { width: 58, height: 12, background: "#6d5423", borderRadius: 3 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: `${34 + rand2() * 30}%`, height: 9, background: "#4a4f58", borderRadius: 3 } })
      ] }, i)) })
    ] })
  ] });
};
var LightMedal = ({ seed }) => {
  const rand2 = mulberry32(seed);
  return /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#ffffff", padding: "36px 44px" }, children: [
    /* @__PURE__ */ jsx3("div", { style: { width: 120, height: 9, background: "#b9bcc2", borderRadius: 3, marginBottom: 14 } }),
    /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 14, marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 150, height: 32, background: "#17181a", borderRadius: 5 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: 170, height: 32, background: "#2f6fd6", borderRadius: 5, opacity: 0.85 } })
    ] }),
    /* @__PURE__ */ jsx3("div", { style: { display: "flex", gap: 10, marginBottom: 22 }, children: [64, 96, 78, 110, 70, 88, 92].map((w, i) => /* @__PURE__ */ jsx3("div", { style: { width: w, height: 24, borderRadius: 12, background: i === 0 ? "#2f6fd6" : "#f2f3f5", border: i === 0 ? "none" : "1px solid #dfe1e5" } }, i)) }),
    /* @__PURE__ */ jsx3("div", { style: { height: 34, borderRadius: 6, border: "1px solid #dfe1e5", marginBottom: 26 } }),
    /* @__PURE__ */ jsx3("div", { style: { display: "flex", gap: 16 }, children: [0, 1, 2].map((c) => /* @__PURE__ */ jsxs3("div", { style: { flex: 1, border: "1px solid #e4e6ea", borderRadius: 8, padding: 18 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 74, height: 8, background: "#9aa0aa", borderRadius: 3, marginBottom: 12 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: `${52 + rand2() * 30}%`, height: 13, background: "#1c1d20", borderRadius: 4, marginBottom: 10 } }),
      /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ jsx3("div", { style: { width: 20, height: 13, background: c === 0 ? "#c8342f" : c === 1 ? "#2c8a4b" : "#c8342f", borderRadius: 2 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: 60, height: 8, background: "#c3c7cd", borderRadius: 3 } })
      ] })
    ] }, c)) })
  ] });
};
var DarkStats = ({ seed }) => {
  const rand2 = mulberry32(seed);
  return /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#0e0d12", padding: "44px 52px" }, children: [
    /* @__PURE__ */ jsx3("div", { style: { borderLeft: "3px solid #6a2430", paddingLeft: 34 }, children: [
      { n: 92, accent: false },
      { n: 74, accent: false },
      { n: 58, accent: false },
      { n: 118, accent: true }
    ].map((row, i) => /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 20, alignItems: "center", marginBottom: 26 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: row.n, height: row.accent ? 30 : 20, background: row.accent ? "#c33b2e" : "#d6d3cc", borderRadius: 4, opacity: row.accent ? 0.95 : 0.85 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: 130, height: 11, background: row.accent ? "#7a3328" : "#4c4a52", borderRadius: 3 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: `${20 + rand2() * 26}%`, height: 8, background: "#33323a", borderRadius: 3 } })
    ] }, i)) }),
    /* @__PURE__ */ jsx3("div", { style: { marginTop: 30, background: "#1c1216", borderRadius: 8, padding: "22px 30px", display: "flex", gap: 60 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 96, height: 16, background: "#c3564a", borderRadius: 3, marginBottom: 10, opacity: 0.9 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: 76, height: 8, background: "#5a4448", borderRadius: 3 } })
    ] }, i)) })
  ] });
};
var LightTable = ({ seed }) => {
  const rand2 = mulberry32(seed);
  return /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#ffffff", padding: "34px 44px" }, children: [
    /* @__PURE__ */ jsxs3("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 26 }, children: [
      /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 12, alignItems: "center" }, children: [
        /* @__PURE__ */ jsx3("div", { style: { width: 34, height: 22, background: "#1d4f9e", borderRadius: 4 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: 130, height: 11, background: "#2a2b2e", borderRadius: 3 } })
      ] }),
      /* @__PURE__ */ jsxs3("div", { style: { display: "flex", gap: 16 }, children: [
        /* @__PURE__ */ jsx3("div", { style: { width: 84, height: 10, background: "#c6c9cf", borderRadius: 3 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: 70, height: 10, background: "#c6c9cf", borderRadius: 3 } })
      ] })
    ] }),
    Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsxs3("div", { style: { display: "flex", alignItems: "center", gap: 20, padding: "13px 0", borderBottom: "1px solid #eceef1" }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 22, height: 10, background: "#9aa0aa", borderRadius: 3 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: 26, height: 16, background: ["#b23a3a", "#2c62b8", "#caa53c", "#3a8a52"][i % 4], borderRadius: 2, opacity: 0.85 } }),
      /* @__PURE__ */ jsx3("div", { style: { width: 90 + rand2() * 60, height: 10, background: "#3a3c40", borderRadius: 3 } }),
      /* @__PURE__ */ jsxs3("div", { style: { marginLeft: "auto", display: "flex", gap: 46 }, children: [
        /* @__PURE__ */ jsx3("div", { style: { width: 16, height: 16, background: i % 3 === 1 ? "#8d8f94" : "#eceef1", borderRadius: 3 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: 16, height: 16, background: i % 3 === 2 ? "#a5772e" : "#eceef1", borderRadius: 3 } }),
        /* @__PURE__ */ jsx3("div", { style: { width: 14, height: 10, background: "#5a5c60", borderRadius: 3 } })
      ] })
    ] }, i))
  ] });
};
var DarkMri = () => /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#08090b", padding: 0 }, children: [
  /* @__PURE__ */ jsxs3("div", { style: { height: 44, borderBottom: "1px solid #1c1e22", display: "flex", alignItems: "center", gap: 16, padding: "0 26px" }, children: [
    /* @__PURE__ */ jsx3("div", { style: { width: 100, height: 10, background: "#cfd2d6", borderRadius: 3, opacity: 0.8 } }),
    /* @__PURE__ */ jsx3("div", { style: { marginLeft: "auto", width: 60, height: 8, background: "#2c2f34", borderRadius: 3 } })
  ] }),
  /* @__PURE__ */ jsxs3("div", { style: { display: "flex", height: CARD_H2 - 44 }, children: [
    /* @__PURE__ */ jsxs3("div", { style: { width: 190, borderRight: "1px solid #17191d", padding: 20 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { width: 110, height: 10, background: "#b8a24e", borderRadius: 3, marginBottom: 14 } }),
      Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx3("div", { style: { height: 7, width: `${58 + i * 13 % 36}%`, background: "#2e3138", borderRadius: 3, marginBottom: 10 } }, i)),
      /* @__PURE__ */ jsx3("div", { style: { marginTop: 24, width: 44, height: 130, margin: "24px auto 0", border: "1px solid #4a4330", borderRadius: 6 } })
    ] }),
    /* @__PURE__ */ jsx3("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx3("div", { style: {
      width: 300,
      height: 360,
      borderRadius: 16,
      background: "radial-gradient(ellipse 46% 40% at 50% 42%, #b9bcc0 0%, #6c7076 34%, #33363c 62%, #101216 100%)",
      position: "relative"
    }, children: [[120, 100], [200, 150], [96, 210]].map(([x, y], i) => /* @__PURE__ */ jsx3("div", { style: { position: "absolute", left: x, top: y, width: 12, height: 12, borderRadius: 6, border: "2px solid #d8b25a" } }, i)) }) }),
    /* @__PURE__ */ jsx3("div", { style: { width: 170, borderLeft: "1px solid #17191d", padding: 18 }, children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx3("div", { style: { height: 7, width: `${50 + i * 17 % 44}%`, background: "#26292f", borderRadius: 3, marginBottom: 11 } }, i)) })
  ] })
] });
var LightPortfolio = () => /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", inset: 0, background: "#f7f7f8", padding: "40px 60px", textAlign: "center" }, children: [
  /* @__PURE__ */ jsx3("div", { style: { width: 340, height: 26, background: "#242528", borderRadius: 5, margin: "10px auto 18px" } }),
  [420, 470, 300].map((w, i) => /* @__PURE__ */ jsx3("div", { style: { width: w, height: 9, background: "#b6b9bf", borderRadius: 3, margin: "0 auto 11px" } }, i)),
  /* @__PURE__ */ jsx3("div", { style: { display: "flex", gap: 18, marginTop: 36 }, children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxs3("div", { style: { flex: 1, height: 150, background: "#ffffff", border: "1px solid #e2e4e8", borderRadius: 10, padding: 16, textAlign: "left" }, children: [
    /* @__PURE__ */ jsx3("div", { style: { width: "54%", height: 12, background: "#2c2d30", borderRadius: 3, marginBottom: 12 } }),
    /* @__PURE__ */ jsx3("div", { style: { width: "80%", height: 8, background: "#d3d6db", borderRadius: 3, marginBottom: 8 } }),
    /* @__PURE__ */ jsx3("div", { style: { width: "66%", height: 8, background: "#d3d6db", borderRadius: 3 } })
  ] }, i)) })
] });
var CARDS = [
  ({ seed }) => /* @__PURE__ */ jsx3(DarkArticle, { seed }),
  ({ seed }) => /* @__PURE__ */ jsx3(LightMedal, { seed }),
  () => /* @__PURE__ */ jsx3(DarkMri, {}),
  ({ seed }) => /* @__PURE__ */ jsx3(LightTable, { seed }),
  ({ seed }) => /* @__PURE__ */ jsx3(DarkStats, { seed }),
  () => /* @__PURE__ */ jsx3(LightPortfolio, {})
];
var SWITCHES = [14, 62, 108];
var SW_DUR = 16;
var SERIF = '"Didot", "Bodoni 72", "Playfair Display", Georgia, serif';
var WordRelayFilmstrip = ({
  title = "",
  subtitle = "",
  items = [],
  imageUrl,
  palette = {}
}) => {
  const frame = useCurrentFrame2();
  const words = (items.length ? items : [subtitle || title]).filter(Boolean).slice(0, 3);
  while (words.length < 3) words.push(words[words.length - 1] || "\u6838\u5FC3\u80FD\u529B");
  let stepF = 0;
  SWITCHES.forEach((s) => {
    const p = interpolate2(frame, [s, s + SW_DUR], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
    stepF += p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  });
  const scroll = stepF * STEP;
  const total = CARDS.length * STEP;
  const cards2 = [];
  for (let rep = -1; rep < 2; rep++) {
    CARDS.forEach((C2, i) => {
      const y = 275 + i * STEP + rep * total - scroll;
      if (y > 1200 || y < -CARD_H2 - 120) return;
      cards2.push(
        /* @__PURE__ */ jsxs3("div", { style: {
          position: "absolute",
          top: y,
          left: 106,
          width: CARD_W2,
          height: CARD_H2,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(30,26,20,0.14)",
          border: "1px solid rgba(0,0,0,0.06)",
          background: "#fff"
        }, children: [
          /* @__PURE__ */ jsx3(C2, { seed: (i + 1) * 733 }),
          imageUrl && /* @__PURE__ */ jsx3("img", { src: imageUrl, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 } }),
          /* @__PURE__ */ jsx3("div", { style: { position: "absolute", left: 36, right: 36, bottom: 28, padding: "18px 24px", borderRadius: 10, color: "#fff", background: "rgba(8,12,20,.82)", fontSize: 31, fontWeight: 750, lineHeight: 1.25 }, children: items[i % Math.max(1, items.length)] || title })
        ] }, `${rep}-${i}`)
      );
    });
  }
  const wordStyle = {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: 92,
    lineHeight: 1.18,
    letterSpacing: "0.002em",
    textAlign: "right",
    whiteSpace: "nowrap"
  };
  const smooth = (x) => x * x * (3 - 2 * x);
  const wordNodes = words.map((w, i) => {
    const sIn = SWITCHES[i];
    const sOut = i + 1 < SWITCHES.length ? SWITCHES[i + 1] : null;
    const pIn = interpolate2(frame, [sIn + 7, sIn + SW_DUR], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
    if (i === 0 ? frame < sIn : pIn <= 0) return null;
    const pInEff = i === 0 ? interpolate2(frame, [sIn, sIn + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    }) : pIn;
    const grey = sOut ? interpolate2(frame, [sOut - 14, sOut - 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    }) : 0;
    const pOut = sOut ? interpolate2(frame, [sOut, sOut + 8], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    }) : 1;
    const op = smooth(pInEff) * smooth(pOut);
    if (op <= 0) return null;
    const mix = smooth(grey);
    const ch = Math.round(25 + (157 - 25) * mix);
    return /* @__PURE__ */ jsx3("div", { style: {
      ...wordStyle,
      position: "absolute",
      right: 0,
      top: 0,
      color: grey > 0.75 ? "#767676" : palette.accent || `rgb(${ch},${Math.round(25 + (152 - 25) * mix)},${Math.round(25 + (142 - 25) * mix)})`,
      opacity: op
    }, children: w }, w);
  });
  return /* @__PURE__ */ jsxs3(AbsoluteFill, { style: { background: palette.canvas || "#faf8f3" }, children: [
    /* @__PURE__ */ jsx3("div", { style: { position: "absolute", inset: 0 }, children: cards2 }),
    /* @__PURE__ */ jsxs3("div", { style: { position: "absolute", right: 210, top: 402 }, children: [
      /* @__PURE__ */ jsx3("div", { style: { ...wordStyle, color: palette.panel || "#191919" }, children: title || "\u6838\u5FC3\u80FD\u529B" }),
      /* @__PURE__ */ jsx3("div", { style: { position: "relative", height: 140 }, children: wordNodes })
    ] })
  ] });
};

// external/video-shotcraft/demos/outro/neon-triple-marquee/NeonTripleMarquee.tsx
import { AbsoluteFill as AbsoluteFill2, useCurrentFrame as useCurrentFrame3, interpolate as interpolate3 } from "remotion";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var FONT = '"Arial Black", "Helvetica Neue", Arial, sans-serif';
var MarqueeRow = ({ word, color, dir, speed, frame, y, fontSize, brightness }) => {
  const est = word.length * fontSize * 0.92;
  const unitW = est + fontSize * 1.3;
  const copies = Math.ceil(1920 / unitW) + 3;
  const offsetRaw = frame * speed % unitW;
  const offset = dir === 1 ? -unitW * 1.5 + offsetRaw : -unitW * 0.5 - offsetRaw;
  const strokeW = 5 + brightness * 3;
  return /* @__PURE__ */ jsx4(
    "div",
    {
      style: {
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        height: fontSize * 1.1,
        overflow: "visible",
        transform: `translateX(${offset}px)`,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize,
        letterSpacing: 4,
        lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `${strokeW}px ${color}`,
        opacity: 0.35 + brightness * 0.65,
        filter: `drop-shadow(0 0 ${8 + brightness * 22}px ${color}) drop-shadow(0 0 ${20 + brightness * 50}px ${color})`
      },
      children: Array.from({ length: copies }).map((_, i) => /* @__PURE__ */ jsxs4(
        "span",
        {
          style: { position: "absolute", left: i * unitW, top: 0, whiteSpace: "nowrap" },
          children: [
            word,
            /* @__PURE__ */ jsx4("span", { style: { display: "inline-block", transform: `translateX(${fontSize * 0.4}px)` }, children: "\u2022" })
          ]
        },
        i
      ))
    }
  );
};
var NeonTripleMarquee = ({ title = "", items = [], palette = {} }) => {
  const f = useCurrentFrame3();
  const pulse = (idx) => {
    const period = 45;
    const phase2 = ((f - idx * (period / 3)) % period + period) % period;
    const t = phase2 / period;
    if (t < 1 / 3) return 0.5 - 0.5 * Math.cos(t * 3 * Math.PI * 2);
    return 0;
  };
  const groupOpacity = interpolate3(f, [0, 10, 128, 148], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const rows = [
    { word: items[0] || title || "\u6838\u5FC3\u89C2\u70B9", color: palette.accent || "#4d9fff", dir: 1, speed: 14 },
    { word: items[1] || title || "\u5173\u952E\u80FD\u529B", color: palette.line || "#ff4dd2", dir: -1, speed: 17 },
    { word: items[2] || title || "\u6700\u7EC8\u7ED3\u679C", color: palette.card || "#ffb347", dir: 1, speed: 14 }
  ];
  return /* @__PURE__ */ jsx4(AbsoluteFill2, { style: { background: palette.canvas || "#050308", overflow: "hidden" }, children: /* @__PURE__ */ jsx4("div", { style: { opacity: groupOpacity, position: "absolute", inset: 0 }, children: rows.map((r, i) => /* @__PURE__ */ jsx4(
    MarqueeRow,
    {
      word: r.word,
      color: r.color,
      dir: r.dir,
      speed: r.speed,
      frame: f,
      y: 40 + i * 350,
      fontSize: 300,
      brightness: pulse(i)
    },
    r.word
  )) }) });
};

// external/video-shotcraft/demos/data/odometer-digit-roll/OdometerDigitRoll.tsx
import { useCurrentFrame as useCurrentFrame4, interpolate as interpolate4, interpolateColors, Easing as Easing2 } from "remotion";
import { Fragment, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var ROW = 210;
var DW = 126;
var FS = 190;
var SPIN = 0.85;
var posAt = (f, i, digits) => {
  const d = digits[i] ?? 0;
  const s = 20 + i * 7;
  const p0 = SPIN * s;
  const T = Math.ceil((p0 + 6 - d) / 10) * 10 + d;
  if (f < s) return SPIN * Math.max(f, 0);
  if (f < s + 16)
    return interpolate4(f, [s, s + 16], [p0, T + 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing2.out(Easing2.cubic)
    });
  if (f < s + 22)
    return interpolate4(f, [s + 16, s + 22], [T + 0.5, T], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing2.out(Easing2.cubic)
    });
  return T;
};
var Strip = ({
  pos,
  color,
  opacity = 1,
  dy = 0
}) => /* @__PURE__ */ jsx5(
  "div",
  {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: DW,
      transform: `translateY(${-(pos % 10) * ROW + dy}px)`,
      opacity
    },
    children: Array.from({ length: 20 }).map((_, k) => /* @__PURE__ */ jsx5(
      "div",
      {
        style: {
          width: DW,
          height: ROW,
          lineHeight: `${ROW}px`,
          textAlign: "center",
          fontSize: FS,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color
        },
        children: k % 10
      },
      k
    ))
  }
);
var DigitReel = ({ frame, i, color, digits }) => {
  const pos = posAt(frame, i, digits);
  const speed = Math.abs(pos - posAt(frame - 1, i, digits));
  const gate = interpolate4(speed, [0.06, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxs5("div", { style: { position: "relative", width: DW, height: ROW, overflow: "hidden" }, children: [
    gate > 1e-3 && /* @__PURE__ */ jsxs5(Fragment, { children: [
      /* @__PURE__ */ jsx5(Strip, { pos, color, opacity: 0.25 * gate, dy: ROW * 0.5 }),
      /* @__PURE__ */ jsx5(Strip, { pos, color, opacity: 0.12 * gate, dy: -ROW * 0.5 })
    ] }),
    /* @__PURE__ */ jsx5(Strip, { pos, color })
  ] });
};
var StaticGlyph = ({ ch, color, w }) => /* @__PURE__ */ jsx5(
  "div",
  {
    style: {
      width: w,
      height: ROW,
      lineHeight: `${ROW}px`,
      textAlign: "center",
      fontSize: FS,
      fontWeight: 800,
      fontVariantNumeric: "tabular-nums",
      color
    },
    children: ch
  }
);
var OdometerDigitRoll = ({ title = "", subtitle = "", items = [], metric = "", palette = {} }) => {
  const frame = useCurrentFrame4();
  const metricSource = metric.trim() || [items[0], title, subtitle].find((value) => /\d/.test(value || "")) || "0";
  const metricChars = Array.from(metricSource).slice(0, 8);
  const digits = metricChars.filter((ch) => /^\d$/.test(ch)).map(Number);
  const hasRollingDigits = digits.length > 0;
  const accent = palette.accent || G.ink;
  const pulseColor = palette.line || accent;
  const inkNow = interpolateColors(frame, [63, 67, 71], [accent, pulseColor, accent]);
  const pulseScale = interpolate4(frame, [63, 67, 71], [1, 1.035, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing2.inOut(Easing2.quad)
  });
  const labelOp = interpolate4(frame, [66, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing2.out(Easing2.quad)
  });
  const metricOpacity = hasRollingDigits ? 1 : interpolate4(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing2.out(Easing2.quad)
  });
  return /* @__PURE__ */ jsxs5("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx5("div", { style: { position: "absolute", left: 120, top: 96 }, children: /* @__PURE__ */ jsx5(TitleBlock, { text: title || "\u6838\u5FC3\u6570\u636E", size: 54, color: accent }) }),
    /* @__PURE__ */ jsx5(
      "div",
      {
        "data-odometer-value": metricSource,
        style: {
          position: "absolute",
          left: 0,
          top: 400,
          width: 1920,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Helvetica, Arial, sans-serif",
          transform: `scale(${pulseScale})`,
          transformOrigin: "960px 105px",
          opacity: metricOpacity
        },
        children: metricChars.map((ch, index) => {
          if (!/^\d$/.test(ch)) {
            const width = /[\u3400-\u9fff]/.test(ch) ? 190 : ch === "." ? 70 : 126;
            return /* @__PURE__ */ jsx5(StaticGlyph, { ch, color: inkNow, w: width }, `${ch}-${index}`);
          }
          const digitIndex = metricChars.slice(0, index).filter((candidate) => /^\d$/.test(candidate)).length;
          return /* @__PURE__ */ jsx5(DigitReel, { frame, i: digitIndex, color: inkNow, digits }, `${ch}-${index}`);
        })
      }
    ),
    /* @__PURE__ */ jsxs5(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          top: 680,
          width: 1920,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: labelOp
        },
        children: [
          /* @__PURE__ */ jsx5("div", { style: { fontSize: 38, fontWeight: 800, color: accent }, children: subtitle || title }),
          items[1] && /* @__PURE__ */ jsx5("div", { style: { fontSize: 26, color: pulseColor }, children: items[1] })
        ]
      }
    )
  ] });
};

// external/video-shotcraft/demos/camera/overhead-camera-moves/TiltReveal.tsx
import { AbsoluteFill as AbsoluteFill3, interpolate as interpolate5, useCurrentFrame as useCurrentFrame5, Easing as Easing3 } from "remotion";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var HOLD = 25;
var MOVE = 43;
var TiltReveal = ({ title = "", subtitle = "", items = [], imageUrl, palette = {} }) => {
  const f = useCurrentFrame5();
  const rotX = interpolate5(
    f,
    [HOLD, HOLD + MOVE, HOLD + MOVE + 4, HOLD + MOVE + 8],
    [-80, 2.6, -0.9, 0],
    { easing: Easing3.out(Easing3.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const p = interpolate5(f, [HOLD, HOLD + MOVE], [0, 1], {
    easing: Easing3.out(Easing3.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const scale = interpolate5(p, [0, 1], [3.2, 1]);
  const ty = interpolate5(p, [0, 1], [200, 0]);
  const persp = interpolate5(p, [0, 1], [600, 1200]);
  const perspY = interpolate5(p, [0, 1], [5, 40]);
  return /* @__PURE__ */ jsx6(AbsoluteFill3, { style: { background: palette.canvas || G.bg, overflow: "hidden" }, children: /* @__PURE__ */ jsx6(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        perspective: persp,
        perspectiveOrigin: `50% ${perspY}%`
      },
      children: /* @__PURE__ */ jsxs6(
        "div",
        {
          style: {
            width: 1920,
            height: 1080,
            transformOrigin: "50% 0%",
            // 画面上缘
            transform: `translateY(${ty}px) scale(${scale}) rotateX(${rotX}deg)`
          },
          children: [
            imageUrl ? /* @__PURE__ */ jsx6("img", { src: imageUrl, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx6(FakeDashboard, { variant: "A", palette }),
            /* @__PURE__ */ jsxs6("div", { style: { position: "absolute", left: 120, right: 120, bottom: 100, padding: "34px 42px", color: "#fff", background: palette.panel || "rgba(10,15,25,.84)", borderLeft: `8px solid ${palette.accent || "#53e0ff"}` }, children: [
              /* @__PURE__ */ jsx6("div", { style: { fontSize: 54, fontWeight: 850 }, children: title }),
              /* @__PURE__ */ jsx6("div", { style: { marginTop: 14, fontSize: 30 }, children: subtitle || items[0] })
            ] })
          ]
        }
      )
    }
  ) });
};

// external/video-shotcraft/demos/transition/page-turn-transitions/CubeRotate.tsx
import { useCurrentFrame as useCurrentFrame6, interpolate as interpolate6, Easing as Easing4 } from "remotion";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var S = 0.82;
var W2 = 1920 * S;
var H = 1080 * S;
var Face = ({ variant, rot, brightness, seam, seamSide, palette }) => /* @__PURE__ */ jsxs7(
  "div",
  {
    style: {
      position: "absolute",
      width: W2,
      height: H,
      overflow: "hidden",
      backfaceVisibility: "hidden",
      transform: `rotateY(${rot}deg) translateZ(${W2 / 2}px)`,
      filter: `brightness(${brightness})`,
      background: palette.canvas || G.bg
    },
    children: [
      /* @__PURE__ */ jsx7("div", { style: { transform: `scale(${S})`, transformOrigin: "0 0" }, children: /* @__PURE__ */ jsx7(FakeDashboard, { variant, palette }) }),
      seam > 0.01 && /* @__PURE__ */ jsx7(
        "div",
        {
          style: {
            position: "absolute",
            top: 0,
            [seamSide]: 0,
            width: 150,
            height: H,
            opacity: seam,
            background: seamSide === "right" ? "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.55))" : "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.55))"
          }
        }
      )
    ]
  }
);
var CubeRotate = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame6();
  const p = interpolate6(frame, [30, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing4.inOut(Easing4.cubic)
  });
  const theta = -90 * p;
  const brightA = 1 - 0.45 * p;
  const brightB = 0.55 + 0.45 * p;
  const mid = Math.sin(p * Math.PI);
  const seam = mid * 0.9;
  const blur = mid * 1.5;
  return /* @__PURE__ */ jsxs7("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx7(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          filter: blur > 0.02 ? `blur(${blur}px)` : void 0
        },
        children: /* @__PURE__ */ jsx7(
          "div",
          {
            style: {
              position: "absolute",
              left: (1920 - W2) / 2,
              top: (1080 - H) / 2,
              width: W2,
              height: H,
              perspective: 1400
            },
            children: /* @__PURE__ */ jsxs7(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${-W2 / 2}px) rotateY(${theta}deg)`
                },
                children: [
                  /* @__PURE__ */ jsx7(Face, { variant: "A", rot: 0, brightness: brightA, seam, seamSide: "right", palette }),
                  /* @__PURE__ */ jsx7(Face, { variant: "B", rot: 90, brightness: brightB, seam, seamSide: "left", palette })
                ]
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsx7("div", { style: { position: "absolute", left: 120, top: 60 }, children: /* @__PURE__ */ jsx7(TitleBlock, { text: title || "\u524D\u540E\u53D8\u5316", size: 54 }) }),
    /* @__PURE__ */ jsxs7("div", { style: { position: "absolute", left: 120, right: 120, bottom: 60, display: "flex", justifyContent: "space-between", color: "#fff", textShadow: "0 3px 12px #000", fontSize: 34, fontWeight: 800 }, children: [
      /* @__PURE__ */ jsx7("span", { children: items[0] || subtitle }),
      /* @__PURE__ */ jsx7("span", { style: { color: palette.accent || "#67e8f9" }, children: items[1] || title })
    ] })
  ] });
};

// external/video-shotcraft/demos/ui-entrance/page-waterfall-wall/PageWaterfallWall.tsx
import {
  AbsoluteFill as AbsoluteFill5,
  interpolate as interpolate7,
  useCurrentFrame as useCurrentFrame8,
  useVideoConfig as useVideoConfig2
} from "remotion";

// external/video-shotcraft/demos/ui-entrance/page-waterfall-wall/VerticalTicker.tsx
import { AbsoluteFill as AbsoluteFill4, useCurrentFrame as useCurrentFrame7, useVideoConfig } from "remotion";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var VerticalTicker = ({
  columns,
  backgroundColor = "#000",
  maskHeight = 200,
  tiltDeg = 20,
  perspective = 1e3,
  scale = 1.2,
  columnWidth = 400,
  gap = 30
}) => {
  return /* @__PURE__ */ jsxs8(AbsoluteFill4, { style: { backgroundColor, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx8(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          gap,
          transform: `perspective(${perspective}px) rotateX(${tiltDeg}deg) scale(${scale})`,
          transformOrigin: "center center"
        },
        children: columns.map((col, idx) => /* @__PURE__ */ jsx8(Column, { ...col, width: columnWidth, gap }, idx))
      }
    ),
    /* @__PURE__ */ jsx8(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: maskHeight,
          background: `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)`,
          zIndex: 10
        }
      }
    ),
    /* @__PURE__ */ jsx8(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: maskHeight,
          background: `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)`,
          zIndex: 10
        }
      }
    )
  ] });
};
var Column = ({
  items,
  durationInSeconds,
  direction,
  width,
  gap
}) => {
  const frame = useCurrentFrame7();
  const { fps } = useVideoConfig();
  const loopFrames = durationInSeconds * fps;
  const progress = frame % loopFrames / loopFrames;
  const translateY = direction === -1 ? progress * -50 : -50 + progress * 50;
  return /* @__PURE__ */ jsx8("div", { style: { width, height: "100%", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsx8(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${translateY}%)`,
        willChange: "transform"
      },
      children: [...items, ...items].map((node, i) => /* @__PURE__ */ jsx8("div", { style: { marginBottom: gap }, children: node }, i))
    }
  ) });
};

// external/video-shotcraft/demos/ui-entrance/page-waterfall-wall/PageWaterfallWall.tsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var BG = "#101014";
var shot = ({ title, description, index, palette = {} }) => /* @__PURE__ */ jsxs9(
  "div",
  {
    style: {
      minHeight: 430,
      padding: "42px 38px 34px",
      boxSizing: "border-box",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
      background: palette.card ?? (index % 4 === 3 ? "#1b1b20" : "#fffdfa"),
      border: `2px solid ${palette.line ?? (index % 4 === 3 ? "#3b3b43" : "#dedbd5")}`,
      color: index % 4 === 3 ? "#f7f5ef" : "#171717",
      fontFamily: '"PingFang SC", "Helvetica Neue", Arial, sans-serif'
    },
    children: [
      /* @__PURE__ */ jsxs9("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 34 }, children: [
        /* @__PURE__ */ jsxs9("span", { style: { fontSize: 19, color: index % 4 === 3 ? "#9f9fa8" : "#837f78", letterSpacing: 1.5 }, children: [
          "PAGE ",
          String(index + 1).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsx9("span", { style: { padding: "8px 14px", borderRadius: 999, background: index % 4 === 3 ? "#34343d" : "#eeeae2", fontSize: 18 }, children: "\u5185\u5BB9\u5361\u7247" })
      ] }),
      /* @__PURE__ */ jsx9("div", { style: { fontSize: 39, lineHeight: 1.18, fontWeight: 800, letterSpacing: -0.8, marginBottom: 22 }, children: title }),
      /* @__PURE__ */ jsx9("div", { style: { fontSize: 25, lineHeight: 1.55, color: index % 4 === 3 ? "#cac8cf" : "#69655f", minHeight: 116 }, children: description }),
      /* @__PURE__ */ jsx9("div", { style: { height: 2, background: index % 4 === 3 ? "#404048" : "#e4e0d8", margin: "26px 0 22px" } }),
      /* @__PURE__ */ jsx9("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" }, children: ["\u91CD\u70B9", "\u9875\u9762", "\u53EF\u7F16\u8F91"].map((tag, tagIndex) => /* @__PURE__ */ jsx9(
        "span",
        {
          style: {
            padding: "9px 15px",
            borderRadius: 999,
            background: tagIndex === 0 ? palette.accent ?? "#d7ff43" : index % 4 === 3 ? "#2d2d34" : "#f0ede7",
            color: tagIndex === 0 ? "#171717" : "inherit",
            fontSize: 18,
            fontWeight: 650
          },
          children: tag
        },
        tag
      )) })
    ]
  }
);
var buildColumns = (loops, cards2) => [
  {
    items: [cards2[0], cards2[1], cards2[2], cards2[3]].map(shot),
    durationInSeconds: loops[0],
    direction: -1
  },
  {
    items: [cards2[4], cards2[5], cards2[6], cards2[7]].map(shot),
    durationInSeconds: loops[1],
    direction: 1
  },
  {
    items: [cards2[8], cards2[9], cards2[10], cards2[11]].map(shot),
    durationInSeconds: loops[2],
    direction: -1
  }
];
var PageWaterfallWall = ({
  title = "\u5185\u5BB9\u9875\u9762",
  subtitle = "\u6839\u636E\u5F53\u524D\u5B57\u5E55\u63D0\u70BC\u51FA\u7684\u5173\u952E\u4FE1\u606F",
  items = [],
  palette = {}
}) => {
  const frame = useCurrentFrame8();
  const { durationInFrames } = useVideoConfig2();
  const usableItems = items.filter(Boolean);
  const cards2 = Array.from({ length: 12 }, (_, index) => ({
    title: usableItems[index % Math.max(1, usableItems.length)] || title,
    description: subtitle,
    index,
    palette
  }));
  const push = interpolate7(frame, [0, durationInFrames], [1, 1.06]);
  return /* @__PURE__ */ jsx9(AbsoluteFill5, { style: { backgroundColor: palette.canvas ?? BG }, children: /* @__PURE__ */ jsx9(AbsoluteFill5, { style: { transform: `scale(${push})` }, children: /* @__PURE__ */ jsx9(
    VerticalTicker,
    {
      columns: buildColumns([12, 9, 14], cards2),
      backgroundColor: palette.canvas ?? BG,
      columnWidth: 560,
      gap: 30
    }
  ) }) });
};

// external/video-shotcraft/demos/rhythm/panel-grid-moves/GridFlashMosaic.tsx
import { useCurrentFrame as useCurrentFrame9, interpolate as interpolate8, Easing as Easing5 } from "remotion";
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var h = (n) => {
  const s = Math.sin(n * 127.3) * 43758.5453;
  return s - Math.floor(s);
};
var CELL_W = 600;
var CELL_H = 340;
var GAP2 = 12;
var GRID_X = (1920 - (CELL_W * 3 + GAP2 * 2)) / 2;
var GRID_Y = (1080 - (CELL_H * 3 + GAP2 * 2)) / 2;
var FILL_START = 25;
var STEP2 = 2;
var ORDER = Array.from({ length: 9 }, (_, i) => i).sort(
  (a, b) => h(a + 1) - h(b + 1)
);
var RANK = [];
ORDER.forEach((cell, k) => RANK[cell] = k);
var LAST_IN = FILL_START + 8 * STEP2 + 3;
var HOLD_END = LAST_IN + 14;
var ZOOM_DUR = 14;
var ZOOM_END2 = HOLD_END + ZOOM_DUR;
var MINI_SCALE = CELL_W / 1920;
var ZOOM_SCALE = 3.28;
var CROPS = [
  { x: -120, y: -60, v: "A" },
  null,
  // 灰卡
  { x: -1260, y: -120, v: "B" },
  { x: -60, y: -520, v: "B" },
  null,
  // 中心格(单独处理，占位)
  { x: -1300, y: -640, v: "A" },
  { x: -420, y: -300, v: "B" },
  null,
  // 灰卡
  { x: -900, y: -680, v: "A" }
];
var CellContent = ({ i, palette }) => {
  if (i === 4) {
    return /* @__PURE__ */ jsx10(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          top: (CELL_H - 1080 * MINI_SCALE) / 2,
          transform: `scale(${MINI_SCALE})`,
          transformOrigin: "top left"
        },
        children: /* @__PURE__ */ jsx10(FakeDashboard, { variant: "A", palette })
      }
    );
  }
  const crop = CROPS[i];
  if (crop === null) {
    return /* @__PURE__ */ jsx10(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          background: palette.panel || G.panel,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: /* @__PURE__ */ jsx10(Card, { w: 430, h: 240, seed: i * 3 + 2, palette })
      }
    );
  }
  return /* @__PURE__ */ jsx10("div", { style: { position: "absolute", left: crop.x, top: crop.y }, children: /* @__PURE__ */ jsx10(FakeDashboard, { variant: crop.v, palette }) });
};
var GridFlashMosaic = ({ title = "", items = [], imageUrl, palette = {} }) => {
  const f = useCurrentFrame9();
  const breath = f >= LAST_IN && f < HOLD_END ? 1 + 8e-3 * Math.sin(Math.PI * (f - LAST_IN) / 14) : 1;
  const zoom = interpolate8(f, [HOLD_END, ZOOM_END2], [1, ZOOM_SCALE], {
    easing: Easing5.in(Easing5.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsx10(
    "div",
    {
      style: {
        width: 1920,
        height: 1080,
        background: palette.canvas || G.bg,
        position: "relative",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsx10(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: `scale(${breath})`,
            transformOrigin: "960px 540px"
          },
          children: Array.from({ length: 9 }).map((_, i) => {
            const start = FILL_START + RANK[i] * STEP2;
            if (f < start) return null;
            const row = Math.floor(i / 3);
            const col = i % 3;
            const popScale = interpolate8(f, [start, start + 3], [1.18, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            });
            const darken = interpolate8(f, [start, start + 2], [0.45, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            });
            const isCenter = i === 4;
            const cellScale = isCenter ? popScale * zoom : popScale;
            return /* @__PURE__ */ jsxs10(
              "div",
              {
                style: {
                  position: "absolute",
                  left: GRID_X + col * (CELL_W + GAP2),
                  top: GRID_Y + row * (CELL_H + GAP2),
                  width: CELL_W,
                  height: CELL_H,
                  overflow: "hidden",
                  background: palette.card || G.card,
                  border: `3px solid ${palette.line || G.ink}`,
                  boxSizing: "border-box",
                  transform: `scale(${cellScale})`,
                  transformOrigin: "center",
                  zIndex: isCenter ? 10 : 1
                },
                children: [
                  /* @__PURE__ */ jsx10(CellContent, { i, palette }),
                  imageUrl && /* @__PURE__ */ jsx10("img", { src: imageUrl, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: isCenter ? 0.88 : 0.42 } }),
                  /* @__PURE__ */ jsx10("div", { style: { position: "absolute", left: 22, right: 22, bottom: 18, color: "#fff", textShadow: "0 2px 10px #000", fontSize: 27, fontWeight: 850 }, children: items[i] || (isCenter ? title : "") }),
                  darken > 1e-3 && /* @__PURE__ */ jsx10(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        inset: 0,
                        background: "#000",
                        opacity: darken
                      }
                    }
                  )
                ]
              },
              i
            );
          })
        }
      )
    }
  );
};

// external/video-shotcraft/demos/ui-entrance/paper-craft-moves/MaskingTapeSlap.tsx
import { useCurrentFrame as useCurrentFrame10, interpolate as interpolate9, Easing as Easing6 } from "remotion";
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var CARD_W3 = 560;
var CARD_H3 = 350;
var CX = (1920 - CARD_W3) / 2;
var CY = (1080 - CARD_H3) / 2 + 40;
var FLOAT_START = 12;
var FLOAT_END = 38;
var SLAP1 = 58;
var SLAP2 = 82;
var APPROACH = 6;
var FREEZE = 2;
var amp = (f) => {
  const rise = interpolate9(f, [FLOAT_END, FLOAT_END + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const damp = interpolate9(f, [SLAP1, SLAP1 + 4], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return rise * damp;
};
var rawRot = (f) => amp(f) * 1.5 * Math.sin((f - FLOAT_END) * 0.16);
var rawBob = (f) => amp(f) * 5 * Math.sin((f - FLOAT_END) * 0.11);
var frozen = (f, raw) => f <= SLAP2 ? raw(f) : interpolate9(f, [SLAP2, SLAP2 + FREEZE], [raw(SLAP2), 0], {
  extrapolateRight: "clamp"
});
var Tape = ({ frame, land, cx, cy, rot, fromX, fromY }) => {
  if (frame < land - APPROACH) return null;
  const t = interpolate9(frame, [land - APPROACH, land], [0, 1], {
    easing: Easing6.out(Easing6.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const scale = interpolate9(t, [0, 1], [1.45, 1]);
  const dx = fromX * (1 - t);
  const dy = fromY * (1 - t);
  const opacity = interpolate9(frame, [land - APPROACH, land - APPROACH + 2], [0, 0.85], {
    extrapolateRight: "clamp"
  });
  const r = interpolate9(frame, [land - APPROACH, land, land + 4], [rot - 16, rot + 7, rot], {
    easing: Easing6.out(Easing6.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const sy = frame === land ? 0.72 : frame === land + 1 ? 0.9 : 1;
  return /* @__PURE__ */ jsx11(
    "div",
    {
      style: {
        position: "absolute",
        left: cx - 160,
        top: cy - 34,
        width: 320,
        height: 68,
        transform: `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(${scale}) scaleY(${sy})`,
        transformOrigin: "50% 50%",
        opacity,
        background: "linear-gradient(90deg, rgba(214,212,206,0.95) 0%, rgba(226,224,218,0.95) 30%, rgba(212,210,204,0.95) 60%, rgba(222,220,214,0.95) 100%)",
        // 撕边：两端锯齿
        clipPath: "polygon(0% 8%, 2.5% 0%, 97% 3%, 100% 12%, 98.2% 30%, 100% 52%, 98% 74%, 100% 90%, 96.5% 100%, 3% 97%, 0% 88%, 1.8% 64%, 0% 42%, 2% 22%)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
      }
    }
  );
};
var MaskingTapeSlap = ({ title = "", subtitle = "", items = [], imageUrl, palette = {} }) => {
  const frame = useCurrentFrame10();
  const floatY = interpolate9(frame, [FLOAT_START, FLOAT_END], [-120, 0], {
    easing: Easing6.out(Easing6.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const floatOp = interpolate9(frame, [FLOAT_START, FLOAT_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const rot = frozen(frame, rawRot);
  const bob = frozen(frame, rawBob);
  const sink = interpolate9(frame, [SLAP2, SLAP2 + FREEZE], [0, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const shOff = interpolate9(frame, [SLAP2, SLAP2 + FREEZE], [16, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const shBlur = interpolate9(frame, [SLAP2, SLAP2 + FREEZE], [34, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const shAlpha = interpolate9(frame, [SLAP2, SLAP2 + FREEZE], [0.22, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxs11("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx11("div", { style: { position: "absolute", top: 110, width: "100%", textAlign: "center" }, children: /* @__PURE__ */ jsx11(TitleBlock, { text: title || "\u91CD\u70B9\u7D20\u6750", size: 72 }) }),
    /* @__PURE__ */ jsxs11(
      "div",
      {
        style: {
          position: "absolute",
          left: CX,
          top: CY,
          transform: `translateY(${floatY + bob + sink}px) rotate(${rot}deg)`,
          transformOrigin: "50% 50%",
          opacity: floatOp
        },
        children: [
          /* @__PURE__ */ jsx11(
            Card,
            {
              w: CARD_W3,
              h: CARD_H3,
              seed: 3,
              style: { boxShadow: `0 ${shOff}px ${shBlur}px rgba(0,0,0,${shAlpha})` }
            }
          ),
          imageUrl && /* @__PURE__ */ jsx11("img", { src: imageUrl, style: { position: "absolute", inset: 22, width: CARD_W3 - 44, height: CARD_H3 - 44, objectFit: "cover", borderRadius: 10 } }),
          /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 30, right: 30, bottom: 28, padding: "18px 24px", borderRadius: 8, color: "#fff", background: "rgba(8,12,20,.78)", fontSize: 30, fontWeight: 800 }, children: subtitle || items[0] || title })
        ]
      }
    ),
    /* @__PURE__ */ jsx11(Tape, { frame, land: SLAP1, cx: CX + 55, cy: CY + 40, rot: -45, fromX: -170, fromY: -130 }),
    /* @__PURE__ */ jsx11(Tape, { frame, land: SLAP2, cx: CX + CARD_W3 - 55, cy: CY + CARD_H3 - 40, rot: -45, fromX: 170, fromY: 130 })
  ] });
};

// external/video-shotcraft/demos/transition/paper-plane-messenger/PaperPlaneMessenger.tsx
import { AbsoluteFill as AbsoluteFill6, useCurrentFrame as useCurrentFrame11, interpolate as interpolate10, Easing as Easing7 } from "remotion";
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
var mulberry322 = (a) => () => {
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
var AX = 520;
var AY = 560;
var BX = 3200;
var BY = 600;
var WIN_W = 760;
var WIN_H = 500;
var P0 = { x: AX + 300, y: AY + 150 };
var P1 = { x: 1250, y: -80 };
var P2 = { x: 2500, y: 300 };
var P3 = { x: BX - 470, y: BY + 20 };
var bez = (t) => {
  const u = 1 - t;
  return {
    x: u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x,
    y: u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y
  };
};
var CLICK = 12;
var ZOOM_OUT = [16, 42];
var FLY = [34, 104];
var TAKEOVER = [112, 146];
var PROPS = (() => {
  const rng = mulberry322(42);
  const out = [];
  const depths = [0.45, 0.75, 1.3];
  for (let i = 0; i < 16; i++) {
    const depth = depths[i % 3];
    out.push({
      x: 500 + rng() * 2800,
      y: -150 + rng() * 1350,
      size: depth < 0.6 ? 60 + rng() * 70 : depth < 1 ? 110 + rng() * 100 : 220 + rng() * 160,
      ring: rng() > 0.45,
      depth,
      drift: rng() * Math.PI * 2
    });
  }
  return out;
})();
var Window = ({ cx, cy, seed, label, imageUrl, sendBtn, btnPulse = 0, accent, line, card }) => /* @__PURE__ */ jsxs12("div", { style: { position: "absolute", left: cx - WIN_W / 2, top: cy - WIN_H / 2, width: WIN_W, height: WIN_H, borderRadius: 18, background: card, border: `3px solid ${line}`, boxShadow: `0 0 46px ${line}55, 0 40px 100px rgba(0,0,0,0.30)`, boxSizing: "border-box", overflow: "hidden" }, children: [
  /* @__PURE__ */ jsxs12("div", { style: { height: 54, background: `linear-gradient(90deg, ${accent}, ${line})`, borderBottom: `2px solid ${line}`, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", boxSizing: "border-box" }, children: [
    [0, 1, 2].map((i) => /* @__PURE__ */ jsx12("div", { style: { width: 15, height: 15, borderRadius: 8, background: i === 1 ? card : "rgba(23,17,15,.72)" } }, i)),
    /* @__PURE__ */ jsx12("div", { style: { marginLeft: 14, height: 13, width: 200, background: card, opacity: 0.86, borderRadius: 7 } })
  ] }),
  /* @__PURE__ */ jsxs12("div", { style: { padding: 26, display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxs12("div", { style: { width: WIN_W - 56, height: 250, background: card, border: `2px solid ${line}`, borderRadius: 14, padding: 18, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsx12("div", { style: { height: 18, width: `${48 + seed % 3 * 12}%`, background: accent, borderRadius: 9 } }),
      [0, 1, 2].map((i) => /* @__PURE__ */ jsx12("div", { style: { height: 12, width: `${86 - i * 14}%`, background: i === 1 ? accent : line, opacity: 0.56 + i * 0.12, borderRadius: 6 } }, i)),
      /* @__PURE__ */ jsxs12("div", { style: { marginTop: "auto", display: "flex", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ jsx12("div", { style: { width: 28, height: 28, borderRadius: 14, background: accent } }),
        /* @__PURE__ */ jsx12("div", { style: { height: 12, width: 96, background: line, borderRadius: 6 } })
      ] })
    ] }),
    imageUrl && /* @__PURE__ */ jsx12("img", { src: imageUrl, style: { position: "absolute", left: 28, right: 28, top: 80, width: WIN_W - 56, height: 250, objectFit: "cover", borderRadius: 10 } }),
    /* @__PURE__ */ jsx12("div", { style: { position: "absolute", left: 46, top: 96, color: "#fff", textShadow: "0 2px 10px #000", fontSize: 30, fontWeight: 850 }, children: label }),
    sendBtn && /* @__PURE__ */ jsx12("div", { style: { alignSelf: "flex-end", transform: `scale(${1 + btnPulse * 0.22})`, padding: "16px 46px", borderRadius: 12, background: accent, color: card, fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 30, boxShadow: btnPulse > 0 ? `0 0 0 ${btnPulse * 22}px ${line}44` : `0 0 26px ${accent}66` }, children: "\u53D1\u9001 \u27A4" })
  ] })
] });
var Plane = ({ x, y, angle, scale, opacity, planeAccent, planeLine, card }) => /* @__PURE__ */ jsxs12("svg", { width: 180, height: 110, viewBox: "0 0 180 110", style: { position: "absolute", left: x - 90, top: y - 55, transform: `rotate(${angle}deg) scale(${scale})`, overflow: "visible", opacity }, children: [
  /* @__PURE__ */ jsx12("polygon", { points: "176,30 6,4 62,66", fill: card, stroke: planeAccent, strokeWidth: 4 }),
  /* @__PURE__ */ jsx12("polygon", { points: "176,30 62,66 78,102", fill: planeAccent, stroke: planeLine, strokeWidth: 3 }),
  /* @__PURE__ */ jsx12("polygon", { points: "176,30 6,4 50,44", fill: planeLine, stroke: card, strokeWidth: 2 })
] });
var PaperPlaneMessenger = ({ title = "", subtitle = "", items = [], imageUrl, palette = {} }) => {
  const frame = useCurrentFrame11();
  const accent = palette.accent ?? "#ff6b57";
  const line = palette.line ?? "#55d6be";
  const card = palette.card ?? "#fff3e8";
  const tFly = interpolate10(frame, [FLY[0], FLY[1]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing7.bezier(0.45, 0.05, 0.25, 1)
  });
  const pos = bez(tFly);
  const posNext = bez(Math.min(tFly + 0.012, 1));
  const angle = Math.atan2(posNext.y - pos.y, posNext.x - pos.x) * (180 / Math.PI);
  const zoomOutP = interpolate10(frame, [ZOOM_OUT[0], ZOOM_OUT[1]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing7.inOut(Easing7.cubic)
  });
  const takeP = interpolate10(frame, [TAKEOVER[0], TAKEOVER[1]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing7.inOut(Easing7.cubic)
  });
  const followW = interpolate10(frame, [ZOOM_OUT[0], ZOOM_OUT[1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let cx = AX + (pos.x - AX) * followW;
  let cy = (AY + (pos.y - AY) * followW) * (1 - takeP) + 0;
  cy = AY + (Math.max(pos.y, 150) - AY) * followW;
  cx = cx * (1 - takeP) + BX * takeP;
  cy = cy * (1 - takeP) + BY * takeP;
  const zBase = 1.55 + (0.62 - 1.55) * zoomOutP;
  const zTake = 0.62 + (3.1 - 0.62) * takeP;
  const z = frame < TAKEOVER[0] ? zBase : zTake;
  const camX = (wx, d) => 960 + (wx - cx) * z * d;
  const camY = (wy, d) => 540 + (wy - cy) * z * d;
  const btnPulse = interpolate10(frame, [CLICK, CLICK + 3, CLICK + 12], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing7.out(Easing7.quad)
  });
  const planeVisible = frame >= FLY[0] - 2;
  const flightBoost = interpolate10(tFly, [0, 0.25, 0.75, 1], [1, 1.7, 1.7, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const planeScale = interpolate10(frame, [FLY[0] - 2, FLY[0] + 8], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing7.out(Easing7.back(1.6))
  }) * flightBoost;
  const planeOpacity = interpolate10(takeP, [0, 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxs12(AbsoluteFill6, { style: { background: palette.canvas || "linear-gradient(160deg, #e9e9e7 0%, #dcdcda 100%)", overflow: "hidden" }, children: [
    PROPS.filter((p) => p.depth < 1).map((p, i) => {
      const wob = Math.sin(frame * 0.035 + p.drift) * 14;
      const x = camX(p.x, p.depth) + wob;
      const y = camY(p.y, p.depth) + Math.cos(frame * 0.03 + p.drift) * 10;
      const s = p.size * z * p.depth;
      const fade = interpolate10(takeP, [0.3, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const propColor = i % 2 === 0 ? accent : line;
      return /* @__PURE__ */ jsx12("div", { style: {
        position: "absolute",
        left: x - s / 2,
        top: y - s / 2,
        width: s,
        height: s,
        opacity: (p.depth < 0.6 ? 0.5 : 0.75) * fade,
        borderRadius: p.ring ? "50%" : 14,
        background: p.ring ? "transparent" : propColor,
        border: p.ring ? `${Math.max(s * 0.13, 4)}px solid ${propColor}` : "none",
        filter: p.depth < 0.6 ? "blur(3px)" : "none",
        boxSizing: "border-box"
      } }, i);
    }),
    /* @__PURE__ */ jsxs12("div", { style: { position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }, children: [
      /* @__PURE__ */ jsx12(Window, { cx: AX, cy: AY, seed: 3, label: items[0] || title || "\u53D1\u9001\u5185\u5BB9", imageUrl, sendBtn: true, btnPulse, accent, line, card }),
      /* @__PURE__ */ jsx12(Window, { cx: BX, cy: BY, seed: 6, label: items[1] || subtitle || "\u63A5\u6536\u7ED3\u679C", imageUrl, accent, line, card }),
      planeVisible && planeOpacity > 0.01 && /* @__PURE__ */ jsx12(Plane, { x: pos.x, y: pos.y, angle, scale: planeScale, opacity: planeOpacity, planeAccent: accent, planeLine: line, card })
    ] }),
    PROPS.filter((p) => p.depth >= 1).map((p, i) => {
      const wob = Math.sin(frame * 0.04 + p.drift) * 20;
      const x = camX(p.x, p.depth) + wob;
      const y = camY(p.y, p.depth) + Math.cos(frame * 0.033 + p.drift) * 16;
      const s = p.size * z * p.depth;
      const fade = interpolate10(takeP, [0.2, 0.7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const propColor = i % 2 === 0 ? line : accent;
      return /* @__PURE__ */ jsx12("div", { style: {
        position: "absolute",
        left: x - s / 2,
        top: y - s / 2,
        width: s,
        height: s,
        opacity: 0.55 * fade,
        borderRadius: p.ring ? "50%" : 22,
        background: p.ring ? "transparent" : propColor,
        border: p.ring ? `${Math.max(s * 0.12, 6)}px solid ${propColor}` : "none",
        filter: "blur(8px)",
        boxSizing: "border-box"
      } }, i);
    })
  ] });
};

// external/video-shotcraft/demos/typography/pill-slot-cycle/PillSlotCycle.tsx
import { AbsoluteFill as AbsoluteFill7, useCurrentFrame as useCurrentFrame12, interpolate as interpolate11, Easing as Easing8 } from "remotion";
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var FONT2 = "Helvetica, Arial, sans-serif";
var BEAT = 21;
var INTRO = 12;
var Pill = ({
  label,
  icon,
  palette,
  style
}) => {
  const pillBackground = palette.card || "#fff";
  const pillText = contrastTextFor(pillBackground);
  return /* @__PURE__ */ jsxs13(
    "div",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 36px 14px 24px",
        borderRadius: 999,
        background: pillBackground,
        border: `3px solid ${palette.line || G.border}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
        fontFamily: FONT2,
        fontWeight: 700,
        fontSize: 64,
        color: pillText,
        whiteSpace: "nowrap",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx13(
          "span",
          {
            style: {
              width: 58,
              height: 58,
              borderRadius: 14,
              background: palette.canvas || G.bg,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              color: palette.accent || G.mid,
              flexShrink: 0
            },
            children: icon
          }
        ),
        fitPillLabel(label)
      ]
    }
  );
};
var PillSlotCycle = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame12();
  const pills = (items.length ? items : [subtitle || title]).filter(Boolean).slice(0, 6).map((label, index) => ({ label, icon: ["\u2022", "\u2192", "\u2713", "+", "\u25CE", "\u2605"][index] }));
  while (pills.length < 2) pills.push({ label: title || "\u6838\u5FC3\u80FD\u529B", icon: "\u2713" });
  const cycles = pills.length;
  const stemT = interpolate11(frame, [0, INTRO], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing8.out(Easing8.cubic)
  });
  const cycleStart = INTRO;
  const cycleEnd = cycleStart + cycles * BEAT;
  const rel = frame - cycleStart;
  const idx = Math.min(Math.floor(rel / BEAT), cycles - 1);
  const beatFrame = rel - idx * BEAT;
  const SWAP = 8;
  const isFinale = frame >= cycleEnd;
  const finT = interpolate11(frame, [cycleEnd, cycleEnd + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing8.out(Easing8.back(1.4))
  });
  let slot = null;
  if (!isFinale && rel >= 0) {
    const incoming = pills[idx];
    const outgoing = idx > 0 ? pills[idx - 1] : null;
    const inT = interpolate11(beatFrame, [0, SWAP], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing8.out(Easing8.cubic)
    });
    const inY = interpolate11(inT, [0, 1], [120, 0]);
    const inBlur = interpolate11(inT, [0, 0.7, 1], [14, 4, 0]);
    const outT = interpolate11(beatFrame, [0, SWAP - 1], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing8.in(Easing8.cubic)
    });
    const outY = interpolate11(outT, [0, 1], [0, -130]);
    slot = /* @__PURE__ */ jsxs13("div", { style: { position: "relative", display: "inline-block" }, children: [
      /* @__PURE__ */ jsx13(Pill, { label: incoming.label, icon: incoming.icon, palette, style: { visibility: "hidden" } }),
      outgoing && outT < 1 && /* @__PURE__ */ jsx13(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translateY(${outY}px)`,
            opacity: 1 - outT,
            filter: `blur(${outT * 10}px)`
          },
          children: /* @__PURE__ */ jsx13(Pill, { label: outgoing.label, icon: outgoing.icon, palette })
        }
      ),
      /* @__PURE__ */ jsx13(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translateY(${inY}px)`,
            opacity: idx === 0 ? inT : Math.min(1, inT * 1.6),
            filter: `blur(${inBlur}px)`
          },
          children: /* @__PURE__ */ jsx13(Pill, { label: incoming.label, icon: incoming.icon, palette })
        }
      )
    ] });
  } else if (isFinale) {
    const lastOutT = interpolate11(frame, [cycleEnd, cycleEnd + 7], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing8.in(Easing8.cubic)
    });
    slot = /* @__PURE__ */ jsxs13("div", { style: { position: "relative", display: "inline-block" }, children: [
      /* @__PURE__ */ jsx13(
        "span",
        {
          style: {
            fontFamily: FONT2,
            fontWeight: 800,
            fontSize: 96,
            color: G.ink,
            letterSpacing: -1,
            display: "inline-block",
            opacity: finT,
            transform: `translateY(${(1 - finT) * 90}px)`,
            filter: `blur(${(1 - finT) * 8}px)`,
            whiteSpace: "nowrap"
          },
          children: subtitle || items[items.length - 1] || "\u5168\u90E8\u5B8C\u6210"
        }
      ),
      lastOutT < 1 && /* @__PURE__ */ jsx13(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: -8,
            transform: `translateY(${-130 * lastOutT}px)`,
            opacity: 1 - lastOutT,
            filter: `blur(${lastOutT * 10}px)`
          },
          children: /* @__PURE__ */ jsx13(Pill, { label: pills[cycles - 1].label, icon: pills[cycles - 1].icon, palette })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx13(AbsoluteFill7, { style: { background: palette.canvas || G.bg }, children: /* @__PURE__ */ jsxs13(
    "div",
    {
      style: {
        position: "absolute",
        left: 300,
        top: 540,
        transform: `translateY(calc(-50% + ${(1 - stemT) * 50}px))`,
        display: "flex",
        alignItems: "center",
        gap: 36,
        opacity: stemT
      },
      children: [
        /* @__PURE__ */ jsx13(
          "span",
          {
            style: {
              fontFamily: FONT2,
              fontWeight: 800,
              fontSize: 96,
              color: G.ink,
              letterSpacing: -1,
              whiteSpace: "nowrap"
            },
            children: title || "\u4E00\u4E2A\u5DE5\u5177\u5B8C\u6210"
          }
        ),
        slot
      ]
    }
  ) });
};

// external/video-shotcraft/demos/rhythm/sakuga-timing-shift/SakugaTimingShift.tsx
import { useCurrentFrame as useCurrentFrame13, interpolate as interpolate12, Easing as Easing9 } from "remotion";
import { jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
var W3 = 1920;
var CARD_W4 = 420;
var CARD_H4 = 260;
var CARD_Y = (1080 - CARD_H4) / 2;
var X_LEFT = 120;
var X_RIGHT = 1380;
var X_CENTER = (W3 - CARD_W4) / 2;
var OVERSHOOT = 36;
var SWITCH = 48;
var ARRIVE = 70;
var SETTLE = 75;
var pos1 = (t) => interpolate12(t, [0, SWITCH], [X_LEFT, X_RIGHT], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
var pos2 = (t) => interpolate12(t, [SWITCH, ARRIVE, SETTLE], [X_RIGHT, X_CENTER - OVERSHOOT, X_CENTER], {
  easing: Easing9.out(Easing9.poly(4)),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
var SakugaTimingShift = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const f = useCurrentFrame13();
  const onThrees = f < SWITCH;
  const q = Math.floor(f / 3) * 3;
  const x = onThrees ? pos1(q) : pos2(f);
  const rot = onThrees ? Math.sin(q * 0.7) * 5 : interpolate12(f, [SWITCH, SWITCH + 8], [Math.sin(SWITCH * 0.7) * 5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const v = onThrees ? 0 : Math.abs(pos2(f) - pos2(f - 1));
  const sFac = Math.min(v / 55, 1);
  const stretchX = 1 + 0.35 * sFac;
  const stretchY = 1 - 0.12 * sFac;
  const sqX = interpolate12(f, [SETTLE - 3, SETTLE, SETTLE + 3], [1, 0.9, 1], {
    easing: Easing9.out(Easing9.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const sqY = interpolate12(f, [SETTLE - 3, SETTLE, SETTLE + 3], [1, 1.07, 1], {
    easing: Easing9.out(Easing9.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const ghosts = !onThrees && f > SWITCH + 1 && f < ARRIVE + 2 && sFac > 0.15 ? [
    { xg: pos2(f - 2), op: 0.28 * sFac },
    { xg: pos2(f - 4), op: 0.13 * sFac }
  ] : [];
  const h2 = (n) => {
    const s = Math.sin(n * 127.3) * 43758.5453;
    return s - Math.floor(s);
  };
  const qb = Math.min(Math.floor(f / 4) * 4, 108);
  const bx = (h2(qb + 1) - 0.5) * 7;
  const by = (h2(qb + 2) - 0.5) * 7;
  const brot = (h2(qb + 3) - 0.5) * 3;
  const pop = interpolate12(f, [SWITCH, SWITCH + 3, SWITCH + 9], [1, 1.35, 1], {
    easing: Easing9.out(Easing9.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const titleOp = interpolate12(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxs14("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx14("div", { style: { position: "absolute", top: 90, width: "100%", textAlign: "center", opacity: titleOp }, children: /* @__PURE__ */ jsx14(TitleBlock, { text: title || "\u91CD\u70B9\u5207\u6362", size: 64 }) }),
    /* @__PURE__ */ jsx14(
      "div",
      {
        style: {
          position: "absolute",
          left: 100,
          right: 100,
          top: CARD_Y + CARD_H4 + 24,
          height: 3,
          background: G.line,
          borderRadius: 2
        }
      }
    ),
    /* @__PURE__ */ jsx14(
      "div",
      {
        style: {
          position: "absolute",
          left: X_CENTER,
          top: CARD_Y,
          width: CARD_W4,
          height: CARD_H4,
          border: `3px dashed ${G.bar}`,
          borderRadius: 14,
          boxSizing: "border-box"
        }
      }
    ),
    ghosts.map((g, i) => /* @__PURE__ */ jsxs14(
      "div",
      {
        style: { position: "absolute", left: 0, top: CARD_Y, opacity: g.op, transform: `translateX(${g.xg}px)` },
        children: [
          /* @__PURE__ */ jsx14(Card, { w: CARD_W4, h: CARD_H4, seed: 4 }),
          /* @__PURE__ */ jsx14("div", { style: { position: "absolute", inset: 28, fontSize: 30, fontWeight: 850, color: palette.accent || G.ink }, children: items[0] || subtitle || title })
        ]
      },
      `ghost-${i}`
    )),
    /* @__PURE__ */ jsxs14(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          top: CARD_Y,
          transform: `translateX(${x}px) rotate(${rot}deg) scaleX(${stretchX * sqX}) scaleY(${stretchY * sqY})`,
          transformOrigin: "50% 50%"
        },
        children: [
          /* @__PURE__ */ jsx14(Card, { w: CARD_W4, h: CARD_H4, seed: 4 }),
          /* @__PURE__ */ jsx14("div", { style: { position: "absolute", inset: 28, fontSize: 30, fontWeight: 850, color: palette.accent || G.ink }, children: items[1] || subtitle || title })
        ]
      }
    ),
    /* @__PURE__ */ jsx14(
      "div",
      {
        style: {
          position: "absolute",
          left: 120,
          top: 160,
          transform: `translate(${bx}px, ${by}px) rotate(${brot}deg) scale(${pop})`,
          transformOrigin: "0% 50%",
          fontFamily: "Courier New, monospace",
          fontWeight: 700,
          fontSize: 84,
          color: G.ink,
          borderBottom: `6px solid ${G.ink}`,
          paddingBottom: 6
        },
        children: onThrees ? "on 3s" : "on 1s"
      }
    )
  ] });
};

// external/video-shotcraft/demos/ui-entrance/skeleton-reveal/SkeletonReveal.tsx
import {
  AbsoluteFill as AbsoluteFill8,
  useCurrentFrame as useCurrentFrame14,
  useVideoConfig as useVideoConfig3,
  interpolate as interpolate13,
  spring as spring2,
  Easing as Easing10
} from "remotion";
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
var mulberry323 = (a) => () => {
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
var PAPER = "#f2f0ea";
var wobbleLine = (x1, y1, x2, y2, seed, amp2 = 7, segs = 8) => {
  const rnd2 = mulberry323(seed);
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const jx = (rnd2() - 0.5) * amp2 * 2;
    const jy = (rnd2() - 0.5) * amp2 * 2;
    pts.push(`${i === 0 ? "M" : "L"} ${x1 + (x2 - x1) * t + jx} ${y1 + (y2 - y1) * t + jy}`);
  }
  return pts.join(" ");
};
var wobbleBlobRect = (x, y, w, h2, seed, amp2 = 10, r = 70) => {
  const rnd2 = mulberry323(seed);
  const j = () => (rnd2() - 0.5) * amp2 * 2;
  return [
    `M ${x + r + j()} ${y + j()}`,
    `L ${x + w / 2 + j()} ${y + j()}`,
    `L ${x + w - r + j()} ${y + j()}`,
    `Q ${x + w + j()} ${y + j()} ${x + w + j()} ${y + r + j()}`,
    `L ${x + w + j()} ${y + h2 / 2 + j()}`,
    `L ${x + w + j()} ${y + h2 - r + j()}`,
    `Q ${x + w + j()} ${y + h2 + j()} ${x + w - r + j()} ${y + h2 + j()}`,
    `L ${x + w / 2 + j()} ${y + h2 + j()}`,
    `L ${x + r + j()} ${y + h2 + j()}`,
    `Q ${x + j()} ${y + h2 + j()} ${x + j()} ${y + h2 - r + j()}`,
    `L ${x + j()} ${y + h2 / 2 + j()}`,
    `L ${x + j()} ${y + r + j()}`,
    `Q ${x + j()} ${y + j()} ${x + r + j()} ${y + j()}`
  ].join(" ");
};
var wobbleCircle = (cx, cy, r, seed, amp2 = 6) => {
  const rnd2 = mulberry323(seed);
  const n = 14;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2;
    const rr = r + (rnd2() - 0.5) * amp2 * 2;
    pts.push(`${i === 0 ? "M" : "L"} ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}`);
  }
  return pts.join(" ") + " Z";
};
var Doodle = ({ boil, strokeColor }) => {
  const S2 = boil * 977;
  const stroke = {
    fill: "none",
    stroke: strokeColor,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  return /* @__PURE__ */ jsxs15("svg", { width: 1920, height: 1080, style: { position: "absolute", inset: 0 }, children: [
    /* @__PURE__ */ jsx15("path", { d: wobbleBlobRect(250, 140, 1420, 800, S2 + 1), ...stroke, strokeWidth: 14 }),
    /* @__PURE__ */ jsx15("path", { d: wobbleLine(600, 160, 600, 920, S2 + 2), ...stroke, strokeWidth: 12 }),
    /* @__PURE__ */ jsx15("path", { d: wobbleCircle(420, 260, 52, S2 + 3), ...stroke, strokeWidth: 12 }),
    Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx15(
      "path",
      {
        d: wobbleLine(330, 400 + i * 82, 470 + i * 53 % 70, 400 + i * 82, S2 + 10 + i),
        ...stroke,
        strokeWidth: 11
      },
      `sb${i}`
    )),
    Array.from({ length: 4 }).map((_, i) => {
      const y = 320 + i * 160;
      return /* @__PURE__ */ jsxs15("g", { children: [
        /* @__PURE__ */ jsx15("path", { d: wobbleCircle(720, y, 44, S2 + 30 + i), ...stroke, strokeWidth: 12 }),
        /* @__PURE__ */ jsx15("path", { d: wobbleLine(810, y - 28, 1180 + i * 97 % 220, y - 28, S2 + 40 + i), ...stroke, strokeWidth: 11 }),
        /* @__PURE__ */ jsx15("path", { d: wobbleLine(810, y + 24, 1420 - i * 71 % 260, y + 24, S2 + 50 + i), ...stroke, strokeWidth: 11 })
      ] }, `row${i}`);
    })
  ] });
};
var Row = ({
  i,
  dev,
  wordAt,
  message,
  name,
  accent,
  revealColors,
  highText,
  mutedText,
  skeletonBase,
  skeletonSoft
}) => {
  const words = message.split(/\s+/);
  return /* @__PURE__ */ jsxs15("div", { style: { position: "relative", height: 96 }, children: [
    /* @__PURE__ */ jsxs15("div", { style: { position: "absolute", inset: 0, display: "flex", gap: 22, opacity: 1 - dev }, children: [
      /* @__PURE__ */ jsx15("div", { style: { width: 72, height: 72, borderRadius: 16, background: revealColors[i % revealColors.length], opacity: 0.42 } }),
      /* @__PURE__ */ jsxs15("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 14, paddingTop: 6 }, children: [
        /* @__PURE__ */ jsx15("div", { style: { height: 18, width: 180 + i * 67 % 90, background: skeletonBase, borderRadius: 9 } }),
        /* @__PURE__ */ jsx15("div", { style: { height: 16, width: `${58 + i * 31 % 30}%`, background: skeletonSoft, borderRadius: 8 } })
      ] })
    ] }),
    /* @__PURE__ */ jsxs15("div", { style: { position: "absolute", inset: 0, display: "flex", gap: 22, opacity: dev > 0.02 ? 1 : 0 }, children: [
      /* @__PURE__ */ jsx15(
        "div",
        {
          style: {
            width: 72,
            height: 72,
            borderRadius: 16,
            background: i === 0 ? accent : revealColors[i % revealColors.length],
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            opacity: dev,
            transform: `scale(${0.7 + 0.3 * dev})`
          },
          children: name[0]
        }
      ),
      /* @__PURE__ */ jsxs15("div", { style: { flex: 1, paddingTop: 2 }, children: [
        /* @__PURE__ */ jsxs15("div", { style: { fontSize: 26, fontWeight: 800, color: highText, opacity: dev }, children: [
          name,
          /* @__PURE__ */ jsxs15("span", { style: { fontWeight: 500, fontSize: 19, color: mutedText, marginLeft: 12 }, children: [
            "9:0",
            i + 1,
            " AM"
          ] })
        ] }),
        /* @__PURE__ */ jsx15("div", { style: { fontSize: 27, color: highText, marginTop: 8 }, children: words.map((w, wi) => {
          const p = wordAt(wi, words.length);
          return /* @__PURE__ */ jsx15(
            "span",
            {
              style: {
                display: "inline-block",
                marginRight: 9,
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px)`
              },
              children: w
            },
            wi
          );
        }) })
      ] })
    ] })
  ] });
};
var SkeletonReveal = ({
  title = "\u5185\u5BB9\u663E\u5F71",
  subtitle = "\u4ECE\u8349\u7A3F\u9010\u6B65\u751F\u6210\u5B8C\u6574\u5185\u5BB9",
  items = [],
  palette = {}
}) => {
  const f = useCurrentFrame14();
  const { fps } = useVideoConfig3();
  const highText = "#f8fbff";
  const mutedText = "#9ec6d8";
  const revealColors = [palette.accent ?? "#52f2ff", palette.line ?? "#8b5cf6", "#c8ff4d", "#ff4fd8"];
  const skeletonBase = "rgba(82,242,255,0.34)";
  const skeletonSoft = "rgba(139,92,246,0.30)";
  const SWAP = 32;
  const boil = Math.floor(f / 5);
  const doodleOut = interpolate13(f, [SWAP, SWAP + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing10.in(Easing10.cubic)
  });
  const doodleVisible = f < SWAP + 9;
  const winIn = spring2({ frame: f - SWAP, fps, config: { damping: 16, stiffness: 160, mass: 0.7 } });
  const rowSlide = (i) => interpolate13(f, [SWAP + 12 + i * 6, SWAP + 34 + i * 6], [520, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing10.out(Easing10.cubic)
  });
  const zoom = interpolate13(f, [66, 142], [1, 1.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing10.inOut(Easing10.cubic)
  });
  const devAt = (i) => interpolate13(f, [80 + i * 13, 92 + i * 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing10.out(Easing10.quad)
  });
  const wordAt = (row) => (w, n) => {
    const isLastWordOfLastRow = row === 3 && w === n - 1;
    const start = 82 + row * 13 + w * 2.5 + (isLastWordOfLastRow ? 14 : 0);
    return interpolate13(f, [start, start + 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing10.out(Easing10.cubic)
    });
  };
  return /* @__PURE__ */ jsxs15(AbsoluteFill8, { style: { background: palette.canvas ?? PAPER, fontFamily: "Helvetica, Arial, sans-serif", overflow: "hidden" }, children: [
    f >= SWAP && /* @__PURE__ */ jsx15(
      AbsoluteFill8,
      {
        style: {
          transform: `scale(${zoom})`,
          transformOrigin: "58% 46%"
        },
        children: /* @__PURE__ */ jsxs15(
          "div",
          {
            style: {
              position: "absolute",
              left: 250,
              top: 140,
              width: 1420,
              height: 800,
              background: palette.panel ?? "#ffffff",
              border: `2px solid ${palette.line ?? "#d8d8d6"}`,
              borderRadius: 22,
              overflow: "hidden",
              display: "flex",
              boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
              opacity: Math.min(1, winIn * 2),
              transform: `scale(${interpolate13(winIn, [0, 1], [1.08, 1])})`
            },
            children: [
              /* @__PURE__ */ jsxs15("div", { style: { width: 300, background: palette.card ?? "#3a3a3a", padding: "30px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22 }, children: [
                /* @__PURE__ */ jsx15("div", { style: { width: 46, height: 46, borderRadius: 12, background: palette.accent ?? "#777775" } }),
                Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsx15("div", { style: { height: 13, width: `${55 + i * 37 % 40}%`, background: revealColors[i % revealColors.length], opacity: 0.72, borderRadius: 7 } }, i))
              ] }),
              /* @__PURE__ */ jsxs15("div", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: [
                /* @__PURE__ */ jsx15("div", { style: { height: 72, borderBottom: `2px solid ${palette.line ?? "#8b5cf6"}`, display: "flex", alignItems: "center", padding: "0 34px" }, children: /* @__PURE__ */ jsx15("div", { style: { height: 18, width: 230, background: `linear-gradient(90deg, ${revealColors[0]}, ${revealColors[1]})`, borderRadius: 9 } }) }),
                /* @__PURE__ */ jsx15("div", { style: { flex: 1, padding: "30px 40px", display: "flex", flexDirection: "column", gap: 32, overflow: "hidden" }, children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx15("div", { style: { transform: `translateY(${rowSlide(i)}px)`, opacity: rowSlide(i) > 500 ? 0 : 1 }, children: /* @__PURE__ */ jsx15(
                  Row,
                  {
                    i,
                    dev: devAt(i),
                    wordAt: wordAt(i),
                    message: items[i] || (i === 0 ? subtitle : ""),
                    name: i === 0 ? title : `\u5185\u5BB9 ${i + 1}`,
                    accent: palette.accent ?? "#52f2ff",
                    revealColors,
                    highText,
                    mutedText,
                    skeletonBase,
                    skeletonSoft
                  }
                ) }, i)) })
              ] })
            ]
          }
        )
      }
    ),
    doodleVisible && /* @__PURE__ */ jsx15(
      AbsoluteFill8,
      {
        style: {
          background: palette.canvas ?? PAPER,
          opacity: 1 - doodleOut,
          transform: `scale(${1 - doodleOut * 0.14})`,
          transformOrigin: "50% 50%"
        },
        children: /* @__PURE__ */ jsx15(Doodle, { boil, strokeColor: palette.accent ?? "#52f2ff" })
      }
    )
  ] });
};

// external/video-shotcraft/demos/typography/split-flap-title/SplitFlapFlip.tsx
import { AbsoluteFill as AbsoluteFill9, Easing as Easing11, interpolate as interpolate14, useCurrentFrame as useCurrentFrame15 } from "remotion";
import { jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
var TEXT = "\u91CD\u70B9\u7ED3\u8BBA";
var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&";
var START = 22;
var STAGGER = 4;
var FLIP = 5;
var NFLIP = 3;
var CELL_W2 = 118;
var CELL_H2 = 156;
var rnd = (a) => {
  const x = Math.sin(a * 127.3) * 43758.5453;
  return x - Math.floor(x);
};
var garble = (i, k) => CHARSET[Math.floor(rnd(i * 7.13 + k * 3.71 + 1) * CHARSET.length)];
var FLAP_BG = "#262624";
var FLAP_INK = "#f4f4f2";
var Half = ({ ch, part }) => /* @__PURE__ */ jsx16(
  "div",
  {
    style: {
      position: "absolute",
      left: 0,
      top: part === "top" ? 0 : CELL_H2 / 2,
      width: CELL_W2,
      height: CELL_H2 / 2,
      overflow: "hidden",
      background: FLAP_BG,
      borderRadius: part === "top" ? "10px 10px 0 0" : "0 0 10px 10px"
    },
    children: /* @__PURE__ */ jsx16(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          top: part === "top" ? 0 : -CELL_H2 / 2,
          width: CELL_W2,
          height: CELL_H2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 100,
          color: FLAP_INK
        },
        children: ch
      }
    )
  }
);
var FlapCell = ({
  target,
  i,
  frame
}) => {
  const seq = [garble(i, 0), garble(i, 1), garble(i, 2), target];
  const local = frame - (START + i * STAGGER);
  const done = local >= NFLIP * FLIP;
  const clickY = done ? interpolate14(local, [15, 17, 19, 22], [0, 6, -1.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing11.out(Easing11.quad)
  }) : 0;
  let topCh = seq[0];
  let bottomCh = seq[0];
  let flap = null;
  if (done) {
    topCh = target;
    bottomCh = target;
  } else if (local > 0) {
    const k = Math.min(NFLIP - 1, Math.floor(local / FLIP));
    const from = seq[k];
    const to = seq[k + 1];
    const p = Easing11.in(Easing11.quad)((local - k * FLIP) / FLIP);
    topCh = to;
    bottomCh = from;
    if (p < 0.5) {
      const deg = p * 2 * 90;
      flap = /* @__PURE__ */ jsx16(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: `rotateX(${-deg}deg)`,
            transformOrigin: `center ${CELL_H2 / 2}px`,
            backfaceVisibility: "hidden",
            filter: `brightness(${1 - p * 2 * 0.45})`,
            zIndex: 2
          },
          children: /* @__PURE__ */ jsx16(Half, { ch: from, part: "top" })
        }
      );
    } else {
      const deg = 90 - (p - 0.5) * 2 * 90;
      flap = /* @__PURE__ */ jsx16(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: `rotateX(${deg}deg)`,
            transformOrigin: `center ${CELL_H2 / 2}px`,
            backfaceVisibility: "hidden",
            filter: `brightness(${0.55 + (p - 0.5) * 2 * 0.45})`,
            zIndex: 2
          },
          children: /* @__PURE__ */ jsx16(Half, { ch: to, part: "bottom" })
        }
      );
    }
  }
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      style: {
        position: "relative",
        width: CELL_W2,
        height: CELL_H2,
        transform: `translateY(${clickY}px)`,
        perspective: 420,
        borderRadius: 10,
        boxShadow: "0 6px 18px rgba(0,0,0,0.3)"
      },
      children: [
        /* @__PURE__ */ jsx16(Half, { ch: topCh, part: "top" }),
        /* @__PURE__ */ jsx16(Half, { ch: bottomCh, part: "bottom" }),
        flap,
        /* @__PURE__ */ jsx16(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: CELL_H2 / 2 - 2,
              width: CELL_W2,
              height: 4,
              background: "#141412",
              zIndex: 3
            }
          }
        )
      ]
    }
  );
};
var SplitFlapFlip = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame15();
  const text = (title || items[0] || subtitle || TEXT).toUpperCase().slice(0, 12);
  let letterIdx = 0;
  return /* @__PURE__ */ jsxs16(AbsoluteFill9, { style: { background: palette.canvas || G.bg, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx16("div", { style: { position: "absolute", inset: 0, opacity: 0.3, filter: "saturate(0.8)" }, children: /* @__PURE__ */ jsx16(FakeDashboard, { variant: "A" }) }),
    /* @__PURE__ */ jsx16(AbsoluteFill9, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx16("div", { style: { display: "flex", gap: 12, alignItems: "center" }, children: text.split("").map((ch, idx) => {
      if (ch === " ") {
        return /* @__PURE__ */ jsx16("div", { style: { width: 52 } }, idx);
      }
      const i = letterIdx++;
      return /* @__PURE__ */ jsx16(FlapCell, { target: ch, i, frame }, idx);
    }) }) })
  ] });
};

// external/video-shotcraft/demos/interaction/hashtag-to-pill-materialize/HashtagToPillMaterialize.tsx
import { AbsoluteFill as AbsoluteFill10, interpolate as interpolate15, useCurrentFrame as useCurrentFrame16, Easing as Easing12 } from "remotion";
import { Fragment as Fragment2, jsx as jsx17, jsxs as jsxs17 } from "react/jsx-runtime";
var FONT3 = "Futura, 'Century Gothic', 'Avenir Next', 'Trebuchet MS', sans-serif";
var C = {
  bgWhite: "#fcfcfb",
  bgCream: "#f4f1e5",
  ink: "#454543",
  cursor: "#e0453f",
  pillGray: "#e9e9e7",
  pillTextGray: "#4b4b49",
  iconGray: "#7e7e7c",
  pillSage: "#d5e0cf",
  iconSage: "#5c7a63",
  titleGreen: "#2d5c47",
  pillSageText: "#3f5e4c",
  body: "#4c4b43"
};
function mulberry324(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var FALLBACK_TEXT = "#\u91CD\u70B9";
var TYPE_START = 8;
var rand = mulberry324(20260717);
var TYPE_AT = (() => {
  const at = [];
  let f = TYPE_START;
  for (let i = 0; i < 12; i++) {
    at.push(f);
    f += 4 + Math.floor(rand() * 3);
  }
  return at;
})();
var MORPH = 48;
var MOVE_START = 66;
var MOVE_END = 80;
var REVEAL = 83;
var FS2 = 132;
var HERO = { x: 960, y: 540 };
var PILL_W = 740;
var PILL_H = 236;
var END_SCALE = 0.554;
var SLOT = { x: 361, y: 473 };
var NoteIcon = ({ size, color }) => /* @__PURE__ */ jsxs17("svg", { width: size, height: size, viewBox: "0 0 48 48", style: { display: "block" }, children: [
  /* @__PURE__ */ jsx17("ellipse", { cx: "11", cy: "39", rx: "7.2", ry: "5.6", fill: color, transform: "rotate(-18 11 39)" }),
  /* @__PURE__ */ jsx17("ellipse", { cx: "35", cy: "35", rx: "7.2", ry: "5.6", fill: color, transform: "rotate(-18 35 35)" }),
  /* @__PURE__ */ jsx17("rect", { x: "15.4", y: "12.5", width: "3", height: "27", fill: color }),
  /* @__PURE__ */ jsx17("rect", { x: "39.4", y: "8.5", width: "3", height: "27", fill: color }),
  /* @__PURE__ */ jsx17("polygon", { points: "15.4,12.5 42.4,8.5 42.4,16.5 15.4,20.5", fill: color })
] });
var Pill2 = ({ bg, iconColor, textColor, text, borderColor }) => /* @__PURE__ */ jsxs17("div", { style: {
  width: PILL_W,
  height: PILL_H,
  borderRadius: PILL_H / 2,
  background: bg,
  border: borderColor ? `3px solid ${borderColor}` : void 0,
  display: "flex",
  alignItems: "center",
  paddingLeft: 96,
  boxSizing: "border-box",
  gap: 66
}, children: [
  /* @__PURE__ */ jsx17(NoteIcon, { size: 104, color: iconColor }),
  /* @__PURE__ */ jsx17("span", { style: { fontSize: Math.min(FS2, text.length > 5 ? 94 : FS2), fontWeight: 650, color: textColor, letterSpacing: 2 }, children: text.replace(/^#/, "") })
] });
var HashtagToPillMaterialize = ({
  title = "\u91CD\u70B9\u4FE1\u606F",
  subtitle = "\u628A\u4E00\u53E5\u8BDD\u6536\u675F\u6210\u53EF\u8BC6\u522B\u6807\u7B7E",
  items = [],
  palette = {}
}) => {
  const frame = useCurrentFrame16();
  const keyword = `#${fitPillLabel((items[0] || title || FALLBACK_TEXT).replace(/^#/, ""))}`;
  const pillBackground = palette.card ?? C.pillSage;
  const pillText = contrastTextFor(pillBackground);
  const transparentCanvas = !palette.canvas || palette.canvas === "transparent";
  const titleColor = palette.line ?? (transparentCanvas ? "#46d7ff" : C.titleGreen);
  const bodyColor = transparentCanvas ? "#f7fbff" : contrastTextFor(palette.canvas);
  const typingColor = transparentCanvas ? "#f7fbff" : C.ink;
  const typedCount = TYPE_AT.filter((t) => frame >= t).length;
  const typed = keyword.slice(0, Math.min(typedCount, keyword.length));
  const moveT = interpolate15(frame, [MOVE_START, MOVE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing12.bezier(0.5, 0, 0.25, 1)
  });
  const px = interpolate15(moveT, [0, 1], [HERO.x, SLOT.x]);
  const py = interpolate15(moveT, [0, 1], [HERO.y, SLOT.y]);
  const ps = interpolate15(moveT, [0, 1], [1, END_SCALE]);
  const settle = interpolate15(frame, [MORPH, MORPH + 3], [1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing12.out(Easing12.quad)
  });
  const revealed = frame >= REVEAL;
  return /* @__PURE__ */ jsxs17(AbsoluteFill10, { style: { background: revealed ? palette.canvas ?? "rgba(244,241,229,.9)" : "transparent", fontFamily: FONT3 }, children: [
    revealed && /* @__PURE__ */ jsxs17(Fragment2, { children: [
      /* @__PURE__ */ jsx17("div", { style: {
        position: "absolute",
        left: 160,
        top: 168,
        fontSize: 122,
        fontWeight: 700,
        color: titleColor,
        letterSpacing: 0.5
      }, children: title }),
      /* @__PURE__ */ jsxs17("div", { style: {
        position: "absolute",
        left: 152,
        top: 618,
        fontSize: 70,
        fontWeight: 500,
        color: bodyColor,
        lineHeight: 1.33,
        letterSpacing: 0.3
      }, children: [
        subtitle,
        /* @__PURE__ */ jsx17("br", {}),
        items.slice(1, 3).join(" \xB7 ") || "\u91CD\u70B9\u88AB\u63D0\u70BC\u540E\uFF0C\u4FE1\u606F\u66F4\u5BB9\u6613\u7406\u89E3\u548C\u8BB0\u4F4F"
      ] })
    ] }),
    frame < MORPH && /* @__PURE__ */ jsx17(AbsoluteFill10, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxs17("div", { style: { display: "flex", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx17("span", { style: { fontSize: FS2, fontWeight: 500, color: typingColor, letterSpacing: 2, whiteSpace: "pre" }, children: typed }),
      /* @__PURE__ */ jsx17("span", { style: {
        display: "inline-block",
        width: 7,
        height: 150,
        background: C.cursor,
        marginLeft: 8,
        borderRadius: 2
      } })
    ] }) }),
    frame >= MORPH && /* @__PURE__ */ jsx17("div", { style: {
      position: "absolute",
      left: 0,
      top: 0,
      // origin 必须是 0 0：translate 先把原点送到目标中心，scale 绕该点缩放，
      // 否则默认 50% 50% 会让落位时中心漂移 (1-s)*半宽
      transformOrigin: "0 0",
      transform: `translate(${px}px, ${py}px) scale(${ps * settle})`
    }, children: /* @__PURE__ */ jsx17("div", { style: { transform: "translate(-50%, -50%)" }, children: revealed ? /* @__PURE__ */ jsx17(Pill2, { text: keyword, bg: pillBackground, iconColor: palette.accent ?? C.iconSage, textColor: pillText, borderColor: palette.line }) : /* @__PURE__ */ jsx17(Pill2, { text: keyword, bg: pillBackground, iconColor: palette.accent ?? C.iconGray, textColor: pillText, borderColor: palette.line }) }) })
  ] });
};

// external/video-shotcraft/demos/opening/icon-field-colorize/IconFieldColorize.tsx
import { AbsoluteFill as AbsoluteFill11, interpolate as interpolate16, useCurrentFrame as useCurrentFrame17 } from "remotion";
import { Fragment as Fragment3, jsx as jsx18, jsxs as jsxs18 } from "react/jsx-runtime";
var mulberry325 = (a) => () => {
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
var SHAPES = [
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M12 21s-7.5-4.7-9.6-9C.9 8.7 2.7 5 6.2 5c2 0 3.3 1 4 2.1h3.6C14.5 6 15.8 5 17.8 5c3.5 0 5.3 3.7 3.8 7-2.1 4.3-9.6 9-9.6 9z", transform: "scale(0.92) translate(1,0)" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M12 2l2.7 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.2 6.1 19.8l1.6-6.6L2.5 8.8l6.8-.5z" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M13 2L4 14h6l-1 8 9-12h-6z" }),
  (c) => /* @__PURE__ */ jsx18("circle", { fill: c, cx: "12", cy: "12", r: "9" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M9 3v12.3A3.5 3.5 0 1 0 11 18V7h7v6.3A3.5 3.5 0 1 0 20 16V3z", transform: "scale(0.85) translate(1.5,1.5)" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2z", transform: "scale(0.85) translate(2,2)" }),
  (c) => /* @__PURE__ */ jsxs18(Fragment3, { children: [
    /* @__PURE__ */ jsx18("rect", { fill: c, x: "3", y: "6", width: "18", height: "13", rx: "2.5" }),
    /* @__PURE__ */ jsx18("circle", { fill: "#fff", cx: "12", cy: "12.5", r: "3.6" }),
    /* @__PURE__ */ jsx18("rect", { fill: c, x: "8", y: "3.5", width: "8", height: "4", rx: "1.5" })
  ] }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M6.5 19a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 17.8 8.7 4.2 4.2 0 0 1 17.5 19z" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z", transform: "scale(0.9) translate(1.2,0.5)" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M3.5 10L12 3l8.5 7V21h-6v-6h-5v6h-6z" }),
  (c) => /* @__PURE__ */ jsxs18(Fragment3, { children: [
    /* @__PURE__ */ jsx18("rect", { fill: c, x: "3", y: "8", width: "18", height: "4", rx: "1" }),
    /* @__PURE__ */ jsx18("rect", { fill: c, x: "5", y: "12", width: "14", height: "9", rx: "1" }),
    /* @__PURE__ */ jsx18("rect", { fill: "#fff", x: "10.9", y: "8", width: "2.2", height: "13" })
  ] }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M9.4 20.6l-1 1.9 7.2-.1 4.9-8.5-2.2.1-2 3.4L13 4.5h-2.1L7.6 17.3z", transform: "scale(0.9) translate(1,1)" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M20.3 6.7L9.6 17.4l-5.9-5.9 2.1-2.1 3.8 3.8 8.6-8.6z" }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M21.5 15.5L14 12V5.5a2 2 0 1 0-4 0V12l-7.5 3.5v2l7.5-2v4l-2.5 2v1.5l4.5-1 4.5 1V21.5l-2.5-2v-4l7.5 2z", transform: "scale(0.85) translate(1.8,1.8)" }),
  (c) => /* @__PURE__ */ jsxs18(Fragment3, { children: [
    /* @__PURE__ */ jsx18("circle", { fill: c, cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx18("path", { fill: c, d: "M12 1.5l1.4 3.6h-2.8zM12 22.5l-1.4-3.6h2.8zM1.5 12l3.6-1.4v2.8zM22.5 12l-3.6 1.4v-2.8zM4.6 4.6l3.5 1.5-2 2zM19.4 19.4l-3.5-1.5 2-2zM19.4 4.6l-1.5 3.5-2-2zM4.6 19.4l1.5-3.5 2 2z" })
  ] }),
  (c) => /* @__PURE__ */ jsx18("path", { fill: c, d: "M20 4C10 4 4.5 9 4 15.7 3.9 17.5 4 20 4 20s2.7-.2 4.4-.3C15 19.2 20 13.5 20 4zM6.8 17.2C10 11 15 8 15 8s-5.5 1.5-8.8 8z" })
];
var COLS = 17;
var ROWS = 10;
var CELL = 110;
var ICON = 44;
var GRAYS = ["#9a9a9a", "#7c7c7c", "#b0b0b0", "#8b8b8b"];
var WAVES = [
  { color: "#5b67e8", fromRow: 0, start: 78 },
  { color: "#e7a03c", fromRow: 3, start: 90 },
  { color: "#34a56f", fromRow: 6, start: 100 },
  { color: "#e2606b", fromRow: 9, start: 110 }
];
var IconFieldColorize = ({
  title = "\u80FD\u529B\u5168\u9762\u5C55\u5F00",
  subtitle = "\u591A\u79CD\u5DE5\u5177\u534F\u540C\u5DE5\u4F5C",
  palette = {}
}) => {
  const frame = useCurrentFrame17();
  const rand2 = mulberry325(20260718);
  const icons = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const r1 = rand2(), r2 = rand2(), r3 = rand2();
      const batch = Math.floor(r1 * 10);
      const t0 = 4 + batch * 4 + r2 * 3;
      const ap = interpolate16(frame, [t0, t0 + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      });
      if (ap <= 0) continue;
      const easeOut2 = 1 - Math.pow(1 - ap, 3);
      const appearScale = ap < 1 ? 0.55 + easeOut2 * 0.52 - Math.max(0, ap - 0.72) * 0.25 : 1;
      const gray = GRAYS[Math.floor(r2 * GRAYS.length)];
      let color = gray;
      let flipPhase = 0;
      for (const w of WAVES) {
        if (r < w.fromRow) continue;
        const arrive = w.start + (r - w.fromRow) * 1.4 + c * 0.25 + r3 * 1.5;
        const p = interpolate16(frame, [arrive, arrive + 3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });
        if (p > 0) {
          color = w.color;
          flipPhase = p;
        }
      }
      const flipPop = flipPhase > 0 && flipPhase < 1 ? 1 + Math.sin(flipPhase * Math.PI) * 0.22 : 1;
      const shape = SHAPES[Math.floor(r3 * SHAPES.length) % SHAPES.length];
      const x = 48 + c * CELL + r % 2 * 26;
      const y = 26 + r * CELL;
      icons.push(
        /* @__PURE__ */ jsx18("div", { style: {
          position: "absolute",
          left: x,
          top: y,
          width: ICON,
          height: ICON,
          opacity: ap,
          transform: `scale(${appearScale * flipPop})`
        }, children: /* @__PURE__ */ jsx18("svg", { viewBox: "0 0 24 24", width: ICON, height: ICON, children: shape(color) }) }, `${r}-${c}`)
      );
    }
  }
  const titleIn = interpolate16(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxs18(AbsoluteFill11, { style: { background: palette.canvas ?? "transparent" }, children: [
    /* @__PURE__ */ jsx18("div", { style: { position: "absolute", inset: 0, opacity: 0.82 }, children: icons }),
    /* @__PURE__ */ jsxs18("div", { style: {
      position: "absolute",
      left: 470,
      right: 470,
      top: 390,
      minHeight: 260,
      borderRadius: 32,
      background: "rgba(10,14,22,.9)",
      border: `2px solid ${palette.accent ?? "#5b67e8"}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "36px 60px",
      boxSizing: "border-box",
      opacity: titleIn,
      transform: `scale(${0.9 + titleIn * 0.1})`
    }, children: [
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 64, lineHeight: 1.14, fontWeight: 850, color: "#fff" }, children: title }),
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 29, lineHeight: 1.4, marginTop: 20, color: palette.accent ?? "#8ea0ff" }, children: subtitle })
    ] })
  ] });
};

// external/video-shotcraft/demos/transition/line-carry-transition/LineCarryTransition.tsx
import { AbsoluteFill as AbsoluteFill12, useCurrentFrame as useCurrentFrame18, interpolate as interpolate17, Easing as Easing13 } from "remotion";
import { jsx as jsx19, jsxs as jsxs19 } from "react/jsx-runtime";
var PATH = "M 400 705 L 2600 705 L 2600 375 L 3160 375 L 3160 705 L 2600 705";
var SEGS = [
  [400, 705, 2600, 705, 2200],
  [2600, 705, 2600, 375, 330],
  [2600, 375, 3160, 375, 560],
  [3160, 375, 3160, 705, 330],
  [3160, 705, 2600, 705, 560]
];
var TOTAL = 3980;
var tipAt = (drawn) => {
  let d = Math.max(0, Math.min(drawn, TOTAL));
  for (const [x1, y1, x2, y2, len] of SEGS) {
    if (d <= len) {
      const t = d / len;
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
    d -= len;
  }
  return [2600, 705];
};
var LineCarryTransition = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame18();
  const cam = interpolate17(frame, [34, 94], [0, 1920], {
    easing: Easing13.inOut(Easing13.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  let drawn;
  if (frame < 24) {
    drawn = interpolate17(frame, [0, 24], [0, 560], {
      easing: Easing13.out(Easing13.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
  } else if (frame < 34) {
    drawn = interpolate17(frame, [24, 34], [560, 1100], {
      extrapolateRight: "clamp"
    });
  } else if (frame < 94) {
    drawn = 1100 + cam;
  } else {
    drawn = interpolate17(frame, [94, 112], [3020, TOTAL], {
      easing: Easing13.out(Easing13.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
  }
  const contentOpacity = interpolate17(frame, [112, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const tipMounted = frame < 118;
  const tipOpacity = interpolate17(frame, [112, 118], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const [tx, ty] = tipAt(drawn);
  return /* @__PURE__ */ jsx19(AbsoluteFill12, { style: { background: palette.canvas || G.bg, overflow: "hidden" }, children: /* @__PURE__ */ jsxs19(
    "div",
    {
      style: {
        position: "absolute",
        width: 3840,
        height: 1080,
        transform: `translateX(${-cam}px)`
      },
      children: [
        /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: 1920, top: 0, width: 1920, height: 1080, background: palette.panel || G.panel } }),
        /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: 400, top: 250 }, children: /* @__PURE__ */ jsx19(TitleBlock, { text: items[0] || title || "\u8D77\u70B9", size: 56 }) }),
        /* @__PURE__ */ jsx19(Card, { w: 560, h: 330, seed: 2, style: { position: "absolute", left: 400, top: 350 } }),
        /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: 400, top: 702, width: 560, height: 6, borderRadius: 3, background: G.line } }),
        /* @__PURE__ */ jsxs19("svg", { width: 3840, height: 1080, style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: [
          /* @__PURE__ */ jsx19(
            "path",
            {
              d: PATH,
              fill: "none",
              stroke: palette.accent || G.ink,
              strokeWidth: 6,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeDasharray: TOTAL,
              strokeDashoffset: TOTAL - drawn
            }
          ),
          tipMounted && /* @__PURE__ */ jsx19("circle", { cx: tx, cy: ty, r: 11, fill: palette.accent || G.ink, opacity: tipOpacity })
        ] }),
        /* @__PURE__ */ jsxs19(
          "div",
          {
            style: {
              position: "absolute",
              left: 2600,
              top: 375,
              width: 560,
              height: 330,
              boxSizing: "border-box",
              padding: 26,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: contentOpacity
            },
            children: [
              /* @__PURE__ */ jsx19("div", { style: { fontSize: 38, fontWeight: 850 }, children: subtitle || items[1] || title }),
              items.slice(2, 5).map((item) => /* @__PURE__ */ jsxs19("div", { style: { fontSize: 25 }, children: [
                "\u2022 ",
                item
              ] }, item)),
              /* @__PURE__ */ jsxs19("div", { style: { marginTop: "auto", display: "flex", gap: 10, alignItems: "center" }, children: [
                /* @__PURE__ */ jsx19("div", { style: { width: 30, height: 30, borderRadius: 15, background: G.mid } }),
                /* @__PURE__ */ jsx19("div", { style: { height: 11, width: 90, background: G.line, borderRadius: 5 } })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx19("div", { style: { position: "absolute", left: 2600, top: 275, opacity: contentOpacity }, children: /* @__PURE__ */ jsx19(TitleBlock, { text: items[1] || subtitle || "\u7ED3\u679C", size: 56 }) })
      ]
    }
  ) });
};

// external/video-shotcraft/demos/ui-entrance/draw-svg-trace/DrawSvgTrace.tsx
import { useCurrentFrame as useCurrentFrame19, interpolate as interpolate18, Easing as Easing14 } from "remotion";
import { jsx as jsx20, jsxs as jsxs20 } from "react/jsx-runtime";
var CW = 560;
var CH = 380;
var CX2 = (1920 - CW) / 2;
var CY2 = (1080 - CH) / 2;
var PEN = 0.045;
var DrawSvgTrace = ({ title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame19();
  const p = interpolate18(frame, [8, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing14.inOut(Easing14.cubic)
  });
  const flashUp = interpolate18(frame, [48, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const flashDown = interpolate18(frame, [50, 56], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing14.out(Easing14.quad)
  });
  const flash = frame < 50 ? flashUp : flashDown;
  const strokeW = 4 + flash * 4;
  const strokeColor = flash > 0.5 ? "#000000" : G.ink;
  const contentOp = interpolate18(frame, [48, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing14.out(Easing14.quad)
  });
  const traceOp = interpolate18(frame, [54, 64], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const borderOp = 1 - traceOp;
  const penOp = p > 0.02 && p < 0.985 ? 1 : 0;
  const up = interpolate18(frame, [68, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing14.out(Easing14.cubic)
  });
  const upenOp = up > 0.03 && up < 0.97 ? 1 : 0;
  const UW = 300;
  return /* @__PURE__ */ jsxs20("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx20("div", { style: { position: "absolute", left: 120, top: 96 }, children: /* @__PURE__ */ jsx20(TitleBlock, { text: title || "\u91CD\u70B9\u4FE1\u606F", size: 54 }) }),
    /* @__PURE__ */ jsxs20(
      "div",
      {
        style: {
          position: "absolute",
          left: CX2,
          top: CY2,
          width: CW,
          height: CH,
          borderRadius: 14,
          background: palette.card || G.card,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: 32,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: contentOp
        },
        children: [
          /* @__PURE__ */ jsx20("div", { style: { fontSize: 38, fontWeight: 850, lineHeight: 1.2 }, children: subtitle || items[0] || title }),
          /* @__PURE__ */ jsx20("div", { style: { height: 6 } }),
          items.slice(1, 4).map((item) => /* @__PURE__ */ jsxs20("div", { style: { fontSize: 27, color: "#475569" }, children: [
            "\u2022 ",
            item
          ] }, item)),
          /* @__PURE__ */ jsxs20("div", { style: { marginTop: "auto", display: "flex", gap: 12, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx20("div", { style: { width: 34, height: 34, borderRadius: 17, background: G.mid } }),
            /* @__PURE__ */ jsx20("div", { style: { height: 12, width: 96, background: G.line, borderRadius: 6 } })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx20(
      "div",
      {
        style: {
          position: "absolute",
          left: CX2,
          top: CY2,
          width: CW,
          height: CH,
          borderRadius: 14,
          border: `2px solid ${G.border}`,
          boxSizing: "border-box",
          opacity: borderOp
        }
      }
    ),
    traceOp > 1e-3 && /* @__PURE__ */ jsxs20(
      "svg",
      {
        width: CW,
        height: CH,
        style: { position: "absolute", left: CX2, top: CY2, overflow: "visible", opacity: traceOp },
        children: [
          /* @__PURE__ */ jsx20(
            "rect",
            {
              x: 1,
              y: 1,
              width: CW - 2,
              height: CH - 2,
              rx: 14,
              fill: "none",
              stroke: strokeColor,
              strokeWidth: strokeW,
              pathLength: 1,
              strokeDasharray: "1",
              strokeDashoffset: 1 - p,
              strokeLinecap: "round"
            }
          ),
          penOp > 0 && /* @__PURE__ */ jsx20(
            "rect",
            {
              x: 1,
              y: 1,
              width: CW - 2,
              height: CH - 2,
              rx: 14,
              fill: "none",
              stroke: G.ink,
              strokeWidth: 7,
              pathLength: 1,
              strokeDasharray: `${PEN} ${1 - PEN}`,
              strokeDashoffset: PEN - p,
              strokeLinecap: "round"
            }
          )
        ]
      }
    ),
    up > 1e-3 && /* @__PURE__ */ jsxs20(
      "svg",
      {
        width: UW,
        height: 8,
        style: { position: "absolute", left: CX2 + 32, top: CY2 + 32 + 24 + 10, overflow: "visible" },
        children: [
          /* @__PURE__ */ jsx20(
            "line",
            {
              x1: 0,
              y1: 4,
              x2: UW,
              y2: 4,
              stroke: G.ink,
              strokeWidth: 4,
              pathLength: 1,
              strokeDasharray: "1",
              strokeDashoffset: 1 - up,
              strokeLinecap: "round"
            }
          ),
          upenOp > 0 && /* @__PURE__ */ jsx20(
            "line",
            {
              x1: 0,
              y1: 4,
              x2: UW,
              y2: 4,
              stroke: G.ink,
              strokeWidth: 7,
              pathLength: 1,
              strokeDasharray: `${PEN * 2} ${1 - PEN * 2}`,
              strokeDashoffset: PEN * 2 - up,
              strokeLinecap: "round"
            }
          )
        ]
      }
    )
  ] });
};

// external/video-shotcraft/demos/data/gauge-readout-moves/NeedleSweepSelftest.tsx
import { useCurrentFrame as useCurrentFrame20, interpolate as interpolate19, Easing as Easing15 } from "remotion";
import { jsx as jsx21, jsxs as jsxs21 } from "react/jsx-runtime";
var AMBER = "#b45309";
var CARD_W5 = 1500;
var CARD_H5 = 640;
var CARD_X = (1920 - CARD_W5) / 2;
var CARD_Y2 = 300;
var GA_W = CARD_W5 / 3;
var R = 148;
var CX3 = GA_W / 2;
var CY3 = 240;
var polar = (a, r) => [
  CX3 + r * Math.cos(a * Math.PI / 180),
  CY3 + r * Math.sin(a * Math.PI / 180)
];
var arcPath = (d0, d1, r) => {
  const [x0, y0] = polar(135 + d0, r);
  const [x1, y1] = polar(135 + d1, r);
  const large = d1 - d0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
var GAUGES = [
  { start: 12, target: 190 },
  { start: 16, target: 120 },
  { start: 20, target: 235 }
];
var needleAngle = (frame, s, target) => {
  if (frame <= s) return 0;
  if (frame <= s + 12) {
    return interpolate19(frame, [s, s + 12], [0, 270], {
      easing: Easing15.out(Easing15.cubic)
    });
  }
  if (frame <= s + 25) {
    return interpolate19(frame, [s + 12, s + 25], [270, target - 8], {
      easing: Easing15.inOut(Easing15.cubic)
    });
  }
  return interpolate19(frame, [s + 25, s + 32], [target - 8, target], {
    easing: Easing15.out(Easing15.cubic),
    extrapolateRight: "clamp"
  });
};
var Gauge = ({ start, target, label, accent, highText, tickColor }) => {
  const frame = useCurrentFrame20();
  const d = needleAngle(frame, start, target);
  const settle = start + 32;
  const value = Math.round(target / 270 * 100);
  const popScale = interpolate19(frame, [settle, settle + 4, settle + 8], [0.3, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const popOp = interpolate19(frame, [settle, settle + 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const [tipX, tipY] = polar(135, R - 26);
  const [tailX, tailY] = polar(315, 36);
  const ticks = [];
  for (let k = 0; k <= 30; k++) {
    const dd = k * 9;
    const major = k % 3 === 0;
    const a = 135 + dd;
    const [x0, y0] = polar(a, R - 8);
    const [x1, y1] = polar(a, major ? R - 30 : R - 19);
    ticks.push(
      /* @__PURE__ */ jsx21(
        "line",
        {
          x1: x0,
          y1: y0,
          x2: x1,
          y2: y1,
          stroke: dd >= 225 ? accent : major ? highText : tickColor,
          strokeWidth: major ? 4 : 2
        },
        k
      )
    );
  }
  return /* @__PURE__ */ jsxs21("div", { style: { width: GA_W, height: 480, position: "relative" }, children: [
    /* @__PURE__ */ jsxs21("svg", { width: GA_W, height: 430, children: [
      /* @__PURE__ */ jsx21("path", { d: arcPath(0, 270, R), fill: "none", stroke: tickColor, strokeWidth: 10, strokeLinecap: "round" }),
      /* @__PURE__ */ jsx21("path", { d: arcPath(225, 270, R), fill: "none", stroke: accent, strokeWidth: 10, strokeLinecap: "round", opacity: 0.85 }),
      ticks,
      /* @__PURE__ */ jsx21("g", { transform: `rotate(${d.toFixed(3)} ${CX3} ${CY3})`, children: /* @__PURE__ */ jsx21("line", { x1: tailX, y1: tailY, x2: tipX, y2: tipY, stroke: accent, strokeWidth: 9, strokeLinecap: "round" }) }),
      /* @__PURE__ */ jsx21("circle", { cx: CX3, cy: CY3, r: 15, fill: highText }),
      /* @__PURE__ */ jsx21("circle", { cx: CX3, cy: CY3, r: 6, fill: accent })
    ] }),
    /* @__PURE__ */ jsxs21("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 396,
      textAlign: "center",
      opacity: popOp,
      transform: `scale(${popScale.toFixed(4)})`
    }, children: [
      /* @__PURE__ */ jsx21("span", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 62, color: highText }, children: value }),
      /* @__PURE__ */ jsx21("span", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 30, color: accent, marginLeft: 8 }, children: "%" }),
      /* @__PURE__ */ jsx21("div", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontSize: 24, fontWeight: 720, color: highText, marginTop: 10 }, children: label })
    ] })
  ] });
};
var NeedleSweepSelftest = ({
  title = "\u4E09\u9879\u5173\u952E\u6307\u6807",
  subtitle = "\u6570\u636E\u81EA\u68C0\u5B8C\u6210",
  items = [],
  palette = {}
}) => {
  const labels = Array.from({ length: 3 }, (_, i) => items[i] || `\u6307\u6807 ${i + 1}`);
  const gauges = GAUGES.map((g, i) => {
    const found = labels[i].match(/\d+(?:\.\d+)?/);
    const pct = found ? Math.min(100, Number(found[0])) : Math.round(g.target / 270 * 100);
    return { ...g, target: pct * 2.7 };
  });
  const accent = palette.accent ?? AMBER;
  const highText = "#f8fbff";
  const tickColor = "#70a2b8";
  return /* @__PURE__ */ jsxs21("div", { style: { width: 1920, height: 1080, background: palette.canvas ?? "transparent", position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs21("div", { style: { position: "absolute", top: 110, width: "100%", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx21("div", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 850, fontSize: 72, color: highText, letterSpacing: -1 }, children: title }),
      /* @__PURE__ */ jsx21("div", { style: { fontSize: 28, color: accent, fontWeight: 700, marginTop: 12 }, children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs21("div", { style: {
      position: "absolute",
      left: CARD_X,
      top: CARD_Y2,
      width: CARD_W5,
      height: CARD_H5,
      background: palette.card ?? "rgba(247,247,244,.96)",
      border: `2px solid ${palette.line ?? G.border}`,
      borderRadius: 14,
      boxSizing: "border-box",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: 32
    }, children: [
      /* @__PURE__ */ jsx21("div", { style: { height: 16, width: 320, background: `linear-gradient(90deg, ${accent}, ${palette.line ?? "#8b5cf6"})`, borderRadius: 8 } }),
      /* @__PURE__ */ jsx21("div", { style: { position: "absolute", left: 0, top: 96, display: "flex" }, children: gauges.map((g, i) => /* @__PURE__ */ jsx21(Gauge, { start: g.start, target: g.target, label: labels[i], accent, highText, tickColor }, i)) })
    ] })
  ] });
};

// external/video-shotcraft/demos/interaction/command-palette-summon/CommandPaletteSummon.tsx
import { useCurrentFrame as useCurrentFrame21, interpolate as interpolate20, Easing as Easing16 } from "remotion";
import { jsx as jsx22, jsxs as jsxs22 } from "react/jsx-runtime";
var CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
var DIM0 = 12;
var DIM1 = 22;
var PANEL_IN = 18;
var ROWS_START = 32;
var KEY1 = 62;
var KEY2 = 78;
var HL = 94;
var BLINK_END = 104;
var PANEL_W = 780;
var PANEL_X = (1920 - PANEL_W) / 2;
var PANEL_Y = 290;
var ROW_H = 72;
var ROW_GAP = 8;
var EXIT_DUR = 10;
var MAX_COMMAND_LABEL_GRAPHEMES = 12;
var fitCommandLabel = (value) => {
  const graphemes = Array.from(value.trim());
  return graphemes.length <= MAX_COMMAND_LABEL_GRAPHEMES ? graphemes.join("") : `${graphemes.slice(0, MAX_COMMAND_LABEL_GRAPHEMES - 1).join("")}\u2026`;
};
var ROWS2 = [
  { titleW: 52, exitAt: 0 },
  { titleW: 38, exitAt: 0 },
  { titleW: 61, exitAt: 2 },
  { titleW: 45, exitAt: 1 },
  { titleW: 56, exitAt: 1 }
];
var PaletteRow = ({ i, frame, label, accent, panelBackground, panelText }) => {
  const { titleW, exitAt } = ROWS2[i];
  const inStart = ROWS_START + i * 4;
  const exitStart = exitAt === 1 ? KEY1 + 3 : exitAt === 2 ? KEY2 + 3 : null;
  if (exitStart !== null && frame >= exitStart + EXIT_DUR) return null;
  const inOp = interpolate20(frame, [inStart, inStart + 8], [0, 1], CL);
  const inY = interpolate20(frame, [inStart, inStart + 8], [12, 0], {
    easing: Easing16.out(Easing16.cubic),
    ...CL
  });
  const exitT = exitStart === null ? 1 : interpolate20(frame, [exitStart, exitStart + EXIT_DUR], [1, 0], {
    easing: Easing16.inOut(Easing16.cubic),
    ...CL
  });
  const hl = i === 0 ? interpolate20(frame, [HL, HL + 10], [0, 1], CL) : 0;
  const highlightBackground = accent;
  const rowText = hl > 0.5 ? contrastTextFor(highlightBackground) : panelText;
  return /* @__PURE__ */ jsx22(
    "div",
    {
      style: {
        height: (ROW_H + ROW_GAP) * exitT,
        opacity: inOp * exitT,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxs22(
        "div",
        {
          style: {
            height: ROW_H,
            borderRadius: 12,
            background: hl > 0 ? highlightBackground : panelBackground,
            boxShadow: hl > 0 ? `inset 4px 0 0 ${accent}` : "none",
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 22px",
            boxSizing: "border-box",
            transform: `translateY(${inY}px)`
          },
          children: [
            /* @__PURE__ */ jsx22("div", { style: { width: 36, height: 36, borderRadius: 9, background: accent, color: contrastTextFor(accent), display: "grid", placeItems: "center", fontWeight: 800 }, children: i + 1 }),
            /* @__PURE__ */ jsx22("div", { style: { width: `${titleW}%`, color: rowText, fontSize: 24, fontWeight: 720, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: fitCommandLabel(label) }),
            /* @__PURE__ */ jsx22("div", { style: { marginLeft: "auto", color: rowText, fontSize: 18, fontWeight: 650 }, children: "\u6267\u884C" })
          ]
        }
      )
    }
  );
};
var CommandPaletteSummon = ({
  title = "\u9009\u62E9\u4E0B\u4E00\u6B65\u64CD\u4F5C",
  subtitle = "\u8F93\u5165\u547D\u4EE4\uFF0C\u5FEB\u901F\u6267\u884C",
  items = [],
  palette = {}
}) => {
  const frame = useCurrentFrame21();
  const labels = Array.from({ length: ROWS2.length }, (_, i) => items[i] || `${title} \xB7 ${i + 1}`);
  const accent = palette.accent ?? "#86e3ce";
  const panelBackground = palette.card ?? "#f5f5f2";
  const panelText = contrastTextFor(panelBackground);
  const panelMutedText = panelText;
  const dim = interpolate20(frame, [DIM0, DIM1], [0, 0.45], CL);
  const blur = interpolate20(frame, [DIM0, DIM1], [0, 10], CL);
  const panelY = frame < PANEL_IN + 9 ? interpolate20(frame, [PANEL_IN, PANEL_IN + 9], [-20, 8], {
    easing: Easing16.out(Easing16.cubic),
    ...CL
  }) : interpolate20(frame, [PANEL_IN + 9, PANEL_IN + 15], [8, 0], {
    easing: Easing16.inOut(Easing16.cubic),
    ...CL
  });
  const panelOp = interpolate20(frame, [PANEL_IN, PANEL_IN + 7], [0, 1], CL);
  const typed = (frame >= KEY1 ? 1 : 0) + (frame >= KEY2 ? 1 : 0);
  const cursorOn = frame >= BLINK_END ? true : (frame - PANEL_IN) % 16 < 8;
  return /* @__PURE__ */ jsxs22("div", { style: { width: 1920, height: 1080, background: palette.canvas ?? "transparent", position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx22("div", { style: { position: "absolute", left: 570, top: 185, width: 780, color: "#fff", textAlign: "center", opacity: panelOp }, children: /* @__PURE__ */ jsx22("div", { style: { fontSize: 28, color: accent, fontWeight: 760, letterSpacing: 2 }, children: subtitle }) }),
    /* @__PURE__ */ jsx22("div", { style: { position: "absolute", inset: 0, background: `rgba(20,20,20,${dim * 0.28})`, backdropFilter: frame < DIM0 ? void 0 : `blur(${blur * 0.15}px)` } }),
    frame >= PANEL_IN && /* @__PURE__ */ jsxs22(
      "div",
      {
        style: {
          position: "absolute",
          left: PANEL_X,
          top: PANEL_Y,
          width: PANEL_W,
          transform: `translateY(${panelY}px)`,
          opacity: panelOp,
          background: panelBackground,
          borderRadius: 18,
          border: `2px solid ${palette.line ?? G.border}`,
          boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
          padding: 20,
          boxSizing: "border-box"
        },
        children: [
          /* @__PURE__ */ jsxs22(
            "div",
            {
              style: {
                height: 76,
                borderBottom: `2px solid ${palette.line ?? G.line}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 10px 14px 10px",
                boxSizing: "border-box"
              },
              children: [
                /* @__PURE__ */ jsx22("div", { style: { width: 32, height: 32, borderRadius: 8, background: accent } }),
                Array.from({ length: typed }).map((_, c) => /* @__PURE__ */ jsx22("div", { style: { width: 28, height: 38, borderRadius: 6, background: accent } }, c)),
                cursorOn && /* @__PURE__ */ jsx22("div", { style: { width: 4, height: 42, background: panelText, borderRadius: 2 } }),
                typed === 0 && /* @__PURE__ */ jsx22("div", { style: { color: panelMutedText, fontSize: 27, fontWeight: 750, maxWidth: 610, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: fitCommandLabel(title) })
              ]
            }
          ),
          /* @__PURE__ */ jsx22("div", { style: { paddingTop: 14 }, children: ROWS2.map((_, i) => /* @__PURE__ */ jsx22(PaletteRow, { i, frame, label: labels[i], accent, panelBackground, panelText }, i)) })
        ]
      }
    )
  ] });
};

// external/video-shotcraft/template/src/aifl/live/SceneFlyIn.tsx
import { Img as Img2, interpolate as interpolate22, useCurrentFrame as useCurrentFrame23, Easing as Easing18 } from "remotion";

// external/video-shotcraft/template/src/aifl/live/PageCam.tsx
import { AbsoluteFill as AbsoluteFill13, Img, interpolate as interpolate21, staticFile, useCurrentFrame as useCurrentFrame22, Easing as Easing17 } from "remotion";
import { jsx as jsx23, jsxs as jsxs23 } from "react/jsx-runtime";
var lerp = (a, b, t) => a + (b - a) * t;
var PageCam = ({ src, pageH, keys, children, blur = 0, saturate = 1, ease = Easing17.bezier(0.33, 0, 0.15, 1), dof }) => {
  const frame = useCurrentFrame22();
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].frame && frame <= keys[i + 1].frame) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const t = a.frame === b.frame ? 1 : interpolate21(frame, [a.frame, b.frame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease
  });
  const cx = lerp(a.cx, b.cx, t);
  const cy = lerp(a.cy, b.cy, t);
  const zoom = lerp(a.zoom, b.zoom, t);
  const filters = [];
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (saturate !== 1) filters.push(`saturate(${saturate})`);
  const has3D = keys.some((k) => k.rotX !== void 0 || k.rotY !== void 0 || k.rotZ !== void 0 || k.persp !== void 0);
  if (!has3D) {
    return /* @__PURE__ */ jsx23(AbsoluteFill13, { style: { overflow: "hidden", backgroundColor: "#faf7f2" }, children: /* @__PURE__ */ jsxs23(
      "div",
      {
        style: {
          position: "absolute",
          width: 1920,
          height: pageH,
          transform: `translate(${960 - cx * zoom}px, ${540 - cy * zoom}px) scale(${zoom})`,
          transformOrigin: "0 0",
          filter: filters.length ? filters.join(" ") : void 0
        },
        children: [
          /* @__PURE__ */ jsx23(Img, { src: staticFile(src), style: { position: "absolute", width: 1920, height: pageH } }),
          children
        ]
      }
    ) });
  }
  const rotX = lerp(a.rotX ?? 0, b.rotX ?? 0, t);
  const rotY = lerp(a.rotY ?? 0, b.rotY ?? 0, t);
  const rotZ = lerp(a.rotZ ?? 0, b.rotZ ?? 0, t);
  const persp = lerp(a.persp ?? 1400, b.persp ?? 1400, t);
  return /* @__PURE__ */ jsxs23(AbsoluteFill13, { style: { overflow: "hidden", backgroundColor: "#faf7f2" }, children: [
    /* @__PURE__ */ jsx23(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          perspective: `${persp * zoom}px`,
          perspectiveOrigin: "960px 540px"
        },
        children: /* @__PURE__ */ jsxs23(
          "div",
          {
            style: {
              position: "absolute",
              width: 1920,
              height: pageH,
              zoom,
              transform: `translate(${960 / zoom - cx}px, ${540 / zoom - cy}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transformStyle: "preserve-3d",
              filter: filters.length ? filters.join(" ") : void 0
            },
            children: [
              /* @__PURE__ */ jsx23(Img, { src: staticFile(src), style: { position: "absolute", width: 1920, height: pageH } }),
              children
            ]
          }
        )
      }
    ),
    dof ? /* @__PURE__ */ jsx23(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: Math.max(0, dof.focusY),
          backdropFilter: `blur(${dof.strength}px)`,
          WebkitBackdropFilter: `blur(${dof.strength}px)`,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none"
        }
      }
    ) : null
  ] });
};

// external/video-shotcraft/template/src/aifl/live-layout.json
var live_layout_default = {
  pageW: 1920,
  projects: {
    pageH: 1746,
    header: {
      x: 0,
      y: 0,
      w: 1920,
      h: 61
    },
    cards: [
      {
        file: "card1.png",
        x: 408,
        y: 247,
        w: 357.328125,
        h: 288,
        title: "Self-healing CI triage router"
      },
      {
        file: "card2.png",
        x: 781.328125,
        y: 247,
        w: 357.328125,
        h: 288,
        title: "Screenshot-grounded retrieval agents"
      },
      {
        file: "card3.png",
        x: 408,
        y: 616,
        w: 357.328125,
        h: 312,
        title: "On-device continual tuning PoC"
      },
      {
        file: "card4.png",
        x: 781.328125,
        y: 616,
        w: 357.328125,
        h: 312,
        title: "Confidence-routed model cascade"
      },
      {
        file: "card5.png",
        x: 1154.65625,
        y: 616,
        w: 357.34375,
        h: 312,
        title: "Tabular foundation probes"
      },
      {
        file: "card6.png",
        x: 408,
        y: 1009,
        w: 357.328125,
        h: 312,
        title: "Sensor drift early-warning"
      },
      {
        file: "card7.png",
        x: 781.328125,
        y: 1009,
        w: 357.328125,
        h: 312,
        title: "Dialect-robust speech recognition"
      },
      {
        file: "card8.png",
        x: 1154.65625,
        y: 1009,
        w: 357.34375,
        h: 312,
        title: "Warehouse re-ID robustness"
      },
      {
        file: "card9.png",
        x: 408,
        y: 1402,
        w: 357.328125,
        h: 312,
        title: "nano-lab: automated research loop"
      },
      {
        file: "card10.png",
        x: 781.328125,
        y: 1402,
        w: 357.328125,
        h: 312,
        title: "Long-horizon coding arena"
      }
    ],
    sections: [
      {
        text: "\u5168\u90E8\u9879\u76EE",
        x: 408,
        y: 93,
        w: 51.84375,
        h: 16
      },
      {
        text: "Agents & Dev Tools",
        x: 408,
        y: 206,
        w: 149.5625,
        h: 16
      },
      {
        text: "Efficient Models",
        x: 408,
        y: 575,
        w: 130.046875,
        h: 16
      },
      {
        text: "Perception & Sensing",
        x: 408,
        y: 968,
        w: 163.953125,
        h: 16
      },
      {
        text: "Research Infra",
        x: 408,
        y: 1361,
        w: 116.84375,
        h: 16
      }
    ]
  },
  detail: {
    pageH: 1172,
    rows: [
      {
        x: 408,
        y: 666,
        w: 1104,
        h: 94.5
      },
      {
        x: 408,
        y: 760.5,
        w: 1104,
        h: 95
      },
      {
        x: 408,
        y: 855.5,
        w: 1104,
        h: 95
      },
      {
        x: 408,
        y: 950.5,
        w: 1104,
        h: 95
      },
      {
        x: 408,
        y: 1045.5,
        w: 1104,
        h: 94.5
      }
    ],
    expPageH: 6857
  },
  float: [
    {
      file: "float-filter.png",
      x: 1436,
      y: 130,
      w: 76,
      h: 44
    },
    {
      file: "float-search.png",
      x: 408,
      y: 130,
      w: 1016,
      h: 44
    },
    {
      file: "float-section.png",
      x: 408,
      y: 206,
      w: 149.5625,
      h: 16
    },
    {
      file: "float-stats.png",
      x: 429,
      y: 388,
      w: 315.328125,
      h: 56
    }
  ],
  wbr: {
    pageH: 1080,
    blocks: [
      {
        x: 576,
        y: 189,
        w: 401.203125,
        h: 28,
        tag: "h1"
      },
      {
        x: 576,
        y: 242.1875,
        w: 167,
        h: 23,
        tag: "h2"
      },
      {
        x: 598.390625,
        y: 277.21875,
        w: 665.609375,
        h: 54.375,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 337.984375,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 576,
        y: 383.5625,
        w: 26.609375,
        h: 23,
        tag: "h2"
      },
      {
        x: 598.390625,
        y: 418.59375,
        w: 665.609375,
        h: 54.375,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 479.359375,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 512.9375,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 576,
        y: 558.515625,
        w: 55.96875,
        h: 23,
        tag: "h2"
      },
      {
        x: 598.390625,
        y: 593.546875,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 627.125,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 660.703125,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 576,
        y: 706.28125,
        w: 38.125,
        h: 23,
        tag: "h2"
      },
      {
        x: 598.390625,
        y: 741.3125,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 774.890625,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 808.46875,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 576,
        y: 854.046875,
        w: 44.953125,
        h: 23,
        tag: "h2"
      },
      {
        x: 598.390625,
        y: 889.078125,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 922.65625,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      },
      {
        x: 598.390625,
        y: 956.234375,
        w: 665.609375,
        h: 27.1875,
        tag: "li"
      }
    ],
    leftRail: {
      x: 0,
      y: 61,
      w: 208,
      h: 1019
    },
    rightRail: {
      x: 1632,
      y: 61,
      w: 288,
      h: 1019
    }
  },
  papers: {
    pageH: 1489,
    cards: [
      {
        x: 408,
        y: 214,
        w: 1104,
        h: 224.5
      },
      {
        x: 408,
        y: 454.5,
        w: 1104,
        h: 224.5
      },
      {
        x: 408,
        y: 695,
        w: 1104,
        h: 224.5
      },
      {
        x: 408,
        y: 935.5,
        w: 1104,
        h: 224.5
      },
      {
        x: 408,
        y: 1176,
        w: 1104,
        h: 224.5
      }
    ]
  }
};

// external/video-shotcraft/template/src/aifl/live/SceneFlyIn.tsx
import { jsx as jsx24, jsxs as jsxs24 } from "react/jsx-runtime";
var cards = live_layout_default.projects.cards;
var PAGE_H = live_layout_default.projects.pageH;
var HOVER_H = 40;
var SETTLE_EASE = Easing18.bezier(0.3, 0, 0.25, 1.15);
var DIVE_EASE = Easing18.bezier(0.3, 0, 0.2, 1);
var SLIDE_EASE = Easing18.bezier(0.35, 0, 0.2, 1);
var PAPER2 = "#f9f6f1";
var FIELD = "#fefcf9";
var COLS2 = [408, 781.328125, 1154.65625];
var CARD_W6 = 357.328125;
var EXTRA_ROWS = [1795, 2188, 2581, 2974, 3367];
var PAPER_EXT = { x: 0, y: PAGE_H, w: 1920, h: 2036 };
var extras = Array.from({ length: 16 }, (_, i) => ({
  file: `card${(i * 3 + 2) % 10 + 1}.png`,
  // deterministic, neighbors differ
  x: i === 0 ? COLS2[2] : COLS2[(i - 1) % 3],
  y: i === 0 ? 1402 : EXTRA_ROWS[Math.floor((i - 1) / 3)],
  w: CARD_W6,
  h: 312,
  title: ""
}));
var PILE = { x: 1430, y: 240 };
var N_CARDS = 26;
var DEAL_START = 36;
var STACK_STEP = 3;
var METAL_FADE = [34, 56];
var grid = [
  ...cards.map((c) => ({ file: c.file, x: c.x, y: c.y, w: c.w, h: c.h, title: c.title })),
  ...extras
].sort((a, b) => a.y - b.y || a.x - b.x).map((c, k) => ({
  ...c,
  cue: DEAL_START + 4 * k - 0.0792 * k * (k - 1),
  // pile pose: tiny alternating offsets + roll, stacked top-down by k
  px: PILE.x + (k * 7 % 9 - 4) * 2,
  py: PILE.y + (k * 5 % 7 - 3) * 2,
  protZ: k * 11 % 7 - 3,
  pz: (N_CARDS - k) * STACK_STEP
  // physical stack height; k=0 rides on top
}));
var nanoIdx = grid.findIndex((c) => c.title.includes("nano-lab"));
var nano = grid[nanoIdx];
var NANO_TO = { x: 408, y: 247 };
var CLICK_C = { x: 586, y: 391 };
var leaveRank = /* @__PURE__ */ new Map();
grid.forEach((_, i) => {
  if (i !== nanoIdx) leaveRank.set(i, leaveRank.size);
});
var SEARCH = { x: 408, y: 130, w: 1016, h: 44 };
var TYPE_START2 = 128;
var FILTER_START = 160;
var PILE_CX = PILE.x + CARD_W6 / 2;
var PILE_CY = PILE.y + 156;
var CAM_KEYS = [
  { frame: 0, cx: PILE_CX - 30, cy: PILE_CY + 60, zoom: 1.95, rotX: 46, rotY: -30, rotZ: 9, persp: 1100 },
  // low side view of the stack, left-oblique
  { frame: 34, cx: PILE_CX + 30, cy: PILE_CY + 40, zoom: 1.85, rotX: 42, rotY: 26, rotZ: -7, persp: 1100 },
  // orbit around the pile to a right-oblique
  { frame: 62, cx: 960, cy: 900, zoom: 0.88, rotX: 26, rotY: 0, rotZ: 2, persp: 1300 },
  // pull back — dashboard revealed, dealing underway
  { frame: 82, cx: 950, cy: 1900, zoom: 0.78, rotX: 14, rotY: 0, rotZ: 0, persp: 1300 },
  // speeding up (~50 px/f)
  { frame: 98, cx: 960, cy: 3032, zoom: 0.72, rotX: 0, rotY: 0, rotZ: 0, persp: 1300 },
  // fastest leg (~70 px/f), arrives straight at the paper's flush bottom
  { frame: 113, cx: 960, cy: 3032, zoom: 0.72, rotX: 0, rotY: 0, rotZ: 0, persp: 1300 },
  // 0.5s REST on the full board
  { frame: 124, cx: 960, cy: 380, zoom: 0.9, rotX: 0, rotY: 0, rotZ: 0, persp: 1300 },
  // swoosh back up to the search/filter header
  { frame: 174, cx: 960, cy: 380, zoom: 0.9, rotX: 0, rotY: 0, rotZ: 0, persp: 1300 },
  // hold through typing, breath, filter, slide
  { frame: 190, cx: CLICK_C.x, cy: CLICK_C.y, zoom: 2.2, rotX: 0, rotY: 0, rotZ: 0, persp: 1300 }
  // push into the clicked card, carried through the white flash
];
var SceneFlyIn = ({ imageUrl, title = "", subtitle = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame23();
  const authoredItems = items.map((item) => item.trim()).filter(Boolean);
  const query = (authoredItems[0] || title || "").slice(0, 12);
  const renderEditableCard = (index) => {
    const label = authoredItems[index % Math.max(1, authoredItems.length)] || "";
    return /* @__PURE__ */ jsxs24("div", { style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gap: 18,
      boxSizing: "border-box",
      padding: "30px 28px 25px",
      color: "#17191f",
      background: palette.card ?? "#fffdf8",
      fontFamily: '"PingFang SC","Microsoft YaHei",ui-sans-serif,system-ui,sans-serif'
    }, children: [
      /* @__PURE__ */ jsxs24("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, fontWeight: 800, color: "#666b76" }, children: [
        /* @__PURE__ */ jsx24("span", { children: String(index % Math.max(1, authoredItems.length) + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx24("i", { style: { display: "block", width: 54, height: 8, borderRadius: 99, background: palette.accent ?? "#ffd166" } })
      ] }),
      /* @__PURE__ */ jsx24("strong", { style: { alignSelf: "center", fontSize: 38, lineHeight: 1.18, letterSpacing: "-0.04em" }, children: label }),
      /* @__PURE__ */ jsx24("span", { style: { fontSize: 21, lineHeight: 1.35, color: "#686d78" }, children: subtitle })
    ] });
  };
  const dofStrength = interpolate22(frame, [82, 98], [5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const typedCount = frame < TYPE_START2 ? 0 : Math.min(query.length, Math.floor((frame - TYPE_START2) / 3) + 1);
  const caretOn = frame >= TYPE_START2 - 2 && frame <= 185 && (frame <= TYPE_START2 + 24 || Math.floor((frame - (TYPE_START2 + 24)) / 8) % 2 === 0);
  return /* @__PURE__ */ jsxs24(
    PageCam,
    {
      src: "textures/live/projects-empty.png",
      pageH: PAGE_H,
      keys: CAM_KEYS,
      ease: Easing18.bezier(0.33, 0, 0.15, 1),
      dof: dofStrength > 0.1 ? { focusY: 260, strength: dofStrength } : void 0,
      children: [
        /* @__PURE__ */ jsxs24("div", { style: {
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 112,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 24,
          boxSizing: "border-box",
          padding: "0 120px",
          color: "#1b1d22",
          background: palette.canvas ?? PAPER2,
          borderBottom: "2px solid rgba(27,29,34,.12)",
          fontFamily: '"PingFang SC","Microsoft YaHei",ui-sans-serif,system-ui,sans-serif',
          zIndex: 30
        }, children: [
          /* @__PURE__ */ jsx24("strong", { style: { fontSize: 34, letterSpacing: "-.03em" }, children: title }),
          /* @__PURE__ */ jsx24("span", { style: { maxWidth: 700, fontSize: 22, color: "#6d717b", textAlign: "right" }, children: subtitle })
        ] }),
        frame < METAL_FADE[1] ? /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: -3e3,
              top: -3e3,
              width: 9e3,
              height: 9e3,
              opacity: interpolate22(frame, [METAL_FADE[0], METAL_FADE[1]], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp"
              }),
              background: [
                // warm key light pooled on the pile
                `radial-gradient(1300px 900px at ${3e3 + PILE_CX}px ${3e3 + PILE_CY}px, rgba(255,214,150,0.20), rgba(255,190,120,0.06) 40%, transparent 68%)`,
                // brushed-metal grain: fine anisotropic streaks
                "repeating-linear-gradient(100deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 2px, transparent 7px)",
                "repeating-linear-gradient(100deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 4px, transparent 13px)",
                // broad steel sheen
                "linear-gradient(115deg, #2a2d33 0%, #383c44 28%, #22242a 55%, #33363e 78%, #1d1f24 100%)"
              ].join(", "),
              pointerEvents: "none"
            }
          }
        ) : null,
        /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: PAPER_EXT.x,
              top: PAPER_EXT.y,
              width: PAPER_EXT.w,
              height: PAPER_EXT.h,
              background: palette.canvas ?? PAPER2,
              pointerEvents: "none"
            }
          }
        ),
        frame >= FILTER_START ? /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 500,
              width: 1920,
              height: PAGE_H - 500,
              background: palette.canvas ?? PAPER2,
              opacity: interpolate22(frame, [FILTER_START, FILTER_START + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp"
              }),
              pointerEvents: "none"
            }
          }
        ) : null,
        grid.map((c, i) => {
          const { cue } = c;
          const radius = 16;
          const isNano = i === nanoIdx;
          const outCue = isNano ? Infinity : FILTER_START + leaveRank.get(i) * 0.4;
          if (frame >= outCue + 5) return null;
          const outT = isNano ? 0 : interpolate22(frame, [outCue, outCue + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing18.inOut(Easing18.quad)
          });
          const diveT = interpolate22(frame, [cue, cue + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: DIVE_EASE
          });
          const settleT = interpolate22(frame, [cue + 8, cue + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SETTLE_EASE
          });
          const dx = (c.px - c.x) * (1 - diveT);
          const dy = (c.py - c.y) * (1 - diveT);
          const rotFlight = c.protZ * (1 - diveT);
          const arc = Math.sin(diveT * Math.PI) * 90;
          const zDive = interpolate22(diveT, [0, 1], [c.pz, HOVER_H]) + arc;
          const z = frame < cue ? c.pz : zDive * (1 - settleT);
          const dealScale = 1 + Math.sin(diveT * Math.PI) * 0.06;
          const press = interpolate22(frame, [cue + 10, cue + 11, cue + 12], [1, 0.996, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
          });
          const scale = dealScale * press;
          const slideT = isNano ? interpolate22(frame, [FILTER_START, FILTER_START + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SLIDE_EASE
          }) : 0;
          const slideDy = (NANO_TO.y - nano.y) * slideT;
          const slideDx = (NANO_TO.x - nano.x) * slideT;
          const float = Math.sin(slideT * Math.PI);
          const slideScale = 1 + 0.02 * float;
          const slideZ = 18 * float;
          const landed = frame >= cue + 12;
          const inPile = frame < cue;
          const transform = isNano && frame >= FILTER_START ? `translate3d(${slideDx}px, ${slideDy}px, ${slideZ}px) scale(${slideScale})` : outT > 0 ? `translate3d(0px, ${8 * outT}px, 0px)` : landed ? "translate3d(0px, 0px, 0px)" : inPile ? `translate3d(${c.px - c.x}px, ${c.py - c.y}px, ${c.pz}px) rotateZ(${c.protZ}deg)` : `translate3d(${dx}px, ${dy}px, ${z}px) rotateZ(${rotFlight}deg) scale(${scale})`;
          const shadow = isNano && frame >= FILTER_START ? `0 ${2 + 14 * float}px ${6 + 26 * float}px rgba(60,45,30,${0.08 + 0.1 * float})` : landed ? "0 2px 6px rgba(60,45,30,.08)" : inPile ? "0 1px 3px rgba(60,45,30,.14)" : `0 ${36 - 30 * settleT}px ${70 - 60 * settleT}px rgba(60,45,30,${0.3 - 0.22 * settleT})`;
          const showGhost = diveT > 0.02 && diveT < 0.98;
          const ghostLagX = (c.px - c.x) * 0.05;
          const ghostLagY = (c.py - c.y) * 0.05;
          return /* @__PURE__ */ jsxs24("div", { style: { transformStyle: "preserve-3d" }, children: [
            showGhost ? /* @__PURE__ */ jsxs24(
              "div",
              {
                style: {
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  height: c.h,
                  transform: `translate3d(${dx + ghostLagX}px, ${dy + ghostLagY}px, ${z}px) rotateZ(${rotFlight}deg) scale(${scale})`,
                  transformOrigin: "center center",
                  opacity: 0.25 * (1 - diveT),
                  filter: "blur(6px)",
                  borderRadius: radius,
                  overflow: "hidden",
                  pointerEvents: "none"
                },
                children: [
                  imageUrl ? /* @__PURE__ */ jsx24(Img2, { src: imageUrl, style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", objectFit: "cover" } }) : null,
                  renderEditableCard(i)
                ]
              }
            ) : null,
            /* @__PURE__ */ jsxs24(
              "div",
              {
                style: {
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  height: c.h,
                  transform,
                  transformOrigin: "center center",
                  boxShadow: shadow,
                  borderRadius: radius,
                  opacity: 1 - outT,
                  overflow: "hidden"
                },
                children: [
                  imageUrl ? /* @__PURE__ */ jsx24(Img2, { src: imageUrl, style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", objectFit: "cover" } }) : null,
                  renderEditableCard(i)
                ]
              }
            )
          ] }, `${c.file}-${i}`);
        }),
        frame >= 118 ? /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: 440,
              top: SEARCH.y + 4,
              width: SEARCH.x + SEARCH.w - 448,
              height: SEARCH.h - 8,
              background: palette.card ?? FIELD,
              opacity: interpolate22(frame, [118, 124], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp"
              }),
              pointerEvents: "none"
            }
          }
        ) : null,
        frame >= TYPE_START2 - 2 ? /* @__PURE__ */ jsxs24(
          "div",
          {
            style: {
              position: "absolute",
              left: 448,
              top: SEARCH.y,
              height: SEARCH.h,
              display: "flex",
              alignItems: "center",
              fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
              fontSize: 15,
              letterSpacing: 0.2,
              color: "oklch(25% 0.006 82)",
              pointerEvents: "none"
            },
            children: [
              /* @__PURE__ */ jsx24("span", { children: query.slice(0, Math.min(query.length, typedCount)) }),
              caretOn ? /* @__PURE__ */ jsx24(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: 2,
                    height: 20,
                    marginLeft: 2,
                    background: palette.accent ?? "oklch(58% 0.13 65)"
                  }
                }
              ) : null
            ]
          }
        ) : null,
        [0, 1].map((r) => {
          const start = 176 + r * 3;
          if (frame < start || frame > start + 10) return null;
          const t = interpolate22(frame, [start, start + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing18.out(Easing18.cubic)
          });
          const rad = interpolate22(t, [0, 1], [14, r === 0 ? 54 : 78]);
          return /* @__PURE__ */ jsx24(
            "div",
            {
              style: {
                position: "absolute",
                left: CLICK_C.x - rad,
                top: CLICK_C.y - rad,
                width: rad * 2,
                height: rad * 2,
                borderRadius: "50%",
                border: "2px solid oklch(58% 0.13 65)",
                opacity: 1 - t,
                pointerEvents: "none"
              }
            },
            `ripple-${r}`
          );
        }),
        frame >= 178 ? /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: NANO_TO.x - 6,
              top: NANO_TO.y - 6,
              width: nano.w + 12,
              height: nano.h + 12,
              borderRadius: 16,
              border: "3px solid oklch(58% 0.13 65)",
              boxShadow: "0 0 40px rgba(180,120,50,0.5)",
              opacity: interpolate22(frame, [178, 181], [0.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp"
              }),
              pointerEvents: "none"
            }
          }
        ) : null,
        /* @__PURE__ */ jsx24(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              right: 0,
              top: PAPER_EXT.y + PAPER_EXT.h - 8,
              height: 8,
              background: "rgba(255,255,255,0.85)",
              filter: "blur(6px)",
              opacity: 0.5,
              pointerEvents: "none"
            }
          }
        )
      ]
    }
  );
};

// external/video-shotcraft/demos/interaction/canvas-materialize-moves/PanelToCanvasMaterialize.tsx
import { AbsoluteFill as AbsoluteFill14, useCurrentFrame as useCurrentFrame24, interpolate as interpolate23, spring as spring3, useVideoConfig as useVideoConfig4, Easing as Easing19 } from "remotion";
import { Fragment as Fragment4, jsx as jsx25, jsxs as jsxs25 } from "react/jsx-runtime";
var PANEL_X2 = 1210;
var PANEL_Y2 = 90;
var PANEL_W2 = 620;
var ROW_H2 = 92;
var ROWS_TOP = 210;
var TARGETS = [
  { x: 150, y: 150, rot: -2 },
  { x: 480, y: 420, rot: 1.5 },
  { x: 180, y: 660, rot: 2 }
];
var CARD_W7 = 480;
var CARD_H6 = 240;
var CHECK_FRAMES = [12, 22, 32];
var BUTTON_FRAME = 46;
var FLY_START = [54, 60, 66];
var PanelToCanvasMaterialize = ({
  title = "\u6DFB\u52A0\u5230\u753B\u5E03",
  items = [],
  palette = {}
}) => {
  const frame = useCurrentFrame24();
  const { fps } = useVideoConfig4();
  const labels = [...items.filter(Boolean), "\u4EFB\u52A1\u4E00", "\u4EFB\u52A1\u4E8C", "\u4EFB\u52A1\u4E09"].slice(0, 3);
  const P = {
    ...G,
    bg: palette.canvas ?? G.bg,
    panel: palette.panel ?? G.panel,
    card: palette.card ?? G.card,
    ink: palette.accent ?? G.ink,
    side: palette.accent ?? G.side,
    line: palette.line ?? G.line,
    border: palette.line ?? G.border
  };
  const btnPress = interpolate23(frame, [BUTTON_FRAME, BUTTON_FRAME + 3, BUTTON_FRAME + 9], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxs25(AbsoluteFill14, { style: { background: P.bg, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx25(
      AbsoluteFill14,
      {
        style: {
          backgroundImage: `radial-gradient(${P.line} 3px, transparent 3px)`,
          backgroundSize: "52px 52px"
        }
      }
    ),
    /* @__PURE__ */ jsxs25(
      "div",
      {
        style: {
          position: "absolute",
          left: PANEL_X2,
          top: PANEL_Y2,
          width: PANEL_W2,
          height: 900,
          background: P.panel,
          border: `2px solid ${P.border}`,
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
          padding: 28
        },
        children: [
          /* @__PURE__ */ jsx25("div", { style: { height: 20, width: 260, background: P.bar, borderRadius: 10, marginBottom: 14 } }),
          /* @__PURE__ */ jsx25("div", { style: { height: 12, width: 380, background: P.line, borderRadius: 6, marginBottom: 26 } }),
          /* @__PURE__ */ jsx25("div", { style: { height: 34, background: P.line, borderRadius: 8, marginBottom: 12, opacity: 0.6 } }),
          [0, 1, 2].map((i) => /* @__PURE__ */ jsx25(RowSlot, { idx: i, frame, fps, label: labels[i], P }, i)),
          /* @__PURE__ */ jsx25(
            "div",
            {
              style: {
                position: "absolute",
                left: 28,
                bottom: 28,
                right: 28,
                height: 64,
                borderRadius: 14,
                background: btnPress > 0 ? P.ink : P.side,
                transform: `scale(${1 - btnPress * 0.06})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ jsx25("div", { style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 22, color: "#f2f2f0", letterSpacing: 0.5 }, children: title.slice(0, 12) })
            }
          )
        ]
      }
    ),
    [0, 1, 2].map((i) => /* @__PURE__ */ jsx25(FlyingCard, { idx: i, frame, fps, label: labels[i], P }, i)),
    /* @__PURE__ */ jsx25(Cursor, { frame, P })
  ] });
};
var RowSlot = ({ idx, frame, fps, label, P }) => {
  const checkF = CHECK_FRAMES[idx];
  const flyF = FLY_START[idx];
  const checked = frame >= checkF;
  const checkPop = spring3({ frame: frame - checkF, fps, config: { damping: 10, stiffness: 260 } });
  const flown = frame >= flyF;
  return /* @__PURE__ */ jsx25(
    "div",
    {
      style: {
        height: ROW_H2 - 12,
        marginBottom: 12,
        borderRadius: 10,
        border: flown ? `2px dashed ${P.line}` : `2px solid ${P.border}`,
        background: flown ? "transparent" : P.card,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 20px",
        opacity: flown ? 0.7 : 1
      },
      children: !flown && /* @__PURE__ */ jsxs25(Fragment4, { children: [
        /* @__PURE__ */ jsx25(
          "div",
          {
            style: {
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `3px solid ${checked ? P.ink : P.bar}`,
              background: checked ? P.ink : "transparent",
              boxSizing: "border-box",
              transform: checked ? `scale(${0.8 + 0.2 * checkPop})` : "scale(1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: checked && /* @__PURE__ */ jsx25("svg", { width: "18", height: "18", viewBox: "0 0 18 18", children: /* @__PURE__ */ jsx25("path", { d: "M3 9.5 L7.2 13.5 L15 4.5", stroke: "#fff", strokeWidth: "3.2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) })
          }
        ),
        /* @__PURE__ */ jsx25("div", { style: { width: 260 + idx * 36, color: P.ink, fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 20, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: label }),
        /* @__PURE__ */ jsx25("div", { style: { marginLeft: "auto", height: 12, width: 90, background: P.line, borderRadius: 6 } })
      ] })
    }
  );
};
var FlyingCard = ({ idx, frame, fps, label, P }) => {
  const flyF = FLY_START[idx];
  if (frame < flyF) return null;
  const t = spring3({ frame: frame - flyF, fps, config: { damping: 16, stiffness: 60 }, durationInFrames: 34 });
  const sx = PANEL_X2 + 30;
  const sy = ROWS_TOP + idx * ROW_H2;
  const sw = PANEL_W2 - 60;
  const sh = ROW_H2 - 12;
  const tgt = TARGETS[idx];
  const mx = (sx + tgt.x) / 2;
  const my = Math.min(sy, tgt.y) - 170;
  const u = t;
  const x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * mx + u * u * tgt.x;
  const y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * my + u * u * tgt.y;
  const w = sw + (CARD_W7 - sw) * u;
  const h2 = sh + (CARD_H6 - sh) * u;
  const rot = tgt.rot * u;
  const radius = 10 + 8 * u;
  const shadow = interpolate23(u, [0, 1], [0.08, 0.16]);
  const rowOp = Math.max(0, 1 - u * 2.2);
  const cardOp = Math.max(0, (u - 0.45) / 0.55);
  return /* @__PURE__ */ jsxs25(
    "div",
    {
      style: {
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h2,
        background: P.card,
        border: `2px solid ${P.border}`,
        borderRadius: radius,
        boxShadow: `0 ${10 + 14 * u}px ${24 + 20 * u}px rgba(0,0,0,${shadow})`,
        transform: `rotate(${rot}deg)`,
        boxSizing: "border-box",
        overflow: "hidden",
        zIndex: 10 + idx
      },
      children: [
        /* @__PURE__ */ jsxs25("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", opacity: rowOp }, children: [
          /* @__PURE__ */ jsx25("div", { style: { width: 30, height: 30, borderRadius: 8, background: P.ink } }),
          /* @__PURE__ */ jsx25("div", { style: { height: 14, width: 180 + idx * 40, background: P.bar, borderRadius: 7 } })
        ] }),
        /* @__PURE__ */ jsxs25("div", { style: { position: "absolute", inset: 0, padding: 24, display: "flex", flexDirection: "column", gap: 12, opacity: cardOp, boxSizing: "border-box" }, children: [
          /* @__PURE__ */ jsx25("div", { style: { color: P.ink, fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 26, lineHeight: 1.2, maxWidth: "94%" }, children: label }),
          /* @__PURE__ */ jsx25("div", { style: { height: 11, width: "84%", background: P.line, borderRadius: 5 } }),
          /* @__PURE__ */ jsx25("div", { style: { height: 11, width: "66%", background: P.line, borderRadius: 5 } }),
          /* @__PURE__ */ jsxs25("div", { style: { marginTop: "auto", display: "flex", gap: 10, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx25("div", { style: { width: 28, height: 28, borderRadius: 14, background: P.mid } }),
            /* @__PURE__ */ jsx25("div", { style: { height: 11, width: 70, background: P.line, borderRadius: 5 } })
          ] })
        ] })
      ]
    }
  );
};
var Cursor = ({ frame, P }) => {
  const bx = PANEL_X2 + PANEL_W2 / 2;
  const by = PANEL_Y2 + 900 - 60;
  const x = interpolate23(frame, [8, BUTTON_FRAME - 4], [900, bx], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing19.inOut(Easing19.quad)
  });
  const y = interpolate23(frame, [8, BUTTON_FRAME - 4], [560, by], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing19.inOut(Easing19.quad)
  });
  const press = interpolate23(frame, [BUTTON_FRAME, BUTTON_FRAME + 3, BUTTON_FRAME + 8], [1, 0.78, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsx25(
    "svg",
    {
      width: 40,
      height: 44,
      viewBox: "0 0 20 22",
      style: { position: "absolute", left: x, top: y, transform: `scale(${press})`, zIndex: 40 },
      children: /* @__PURE__ */ jsx25("path", { d: "M2 1 L2 17 L6.5 13.2 L9.4 20 L12.4 18.7 L9.5 12 L15 11.6 Z", fill: P.ink, stroke: "#fff", strokeWidth: "1.4" })
    }
  );
};

// external/video-shotcraft/demos/transition/card-flip-reveal/CardFlipReveal.tsx
import { useCurrentFrame as useCurrentFrame25, interpolate as interpolate24, Easing as Easing20 } from "remotion";
import { jsx as jsx26, jsxs as jsxs26 } from "react/jsx-runtime";
var CW2 = 440;
var CH2 = 300;
var GAP3 = 60;
var Y = (1080 - CH2) / 2;
var FLIP_START = 18;
var STAGGER2 = 10;
var FLIP_DUR = 18;
var SETTLE2 = 8;
var OVERSHOOT2 = 12;
var angleAt = (f, i) => {
  const s = FLIP_START + i * STAGGER2;
  if (f < s + FLIP_DUR) {
    return interpolate24(f, [s, s + FLIP_DUR], [0, 180 + OVERSHOOT2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing20.bezier(0.55, 0, 0.3, 1)
    });
  }
  return interpolate24(f, [s + FLIP_DUR, s + FLIP_DUR + SETTLE2], [180 + OVERSHOOT2, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing20.out(Easing20.poly(5))
  });
};
var Sheen = ({ angle }) => {
  const pos = interpolate24(angle, [35, 145], [-25, 115], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const op = Math.max(0, 1 - Math.abs(angle - 90) / 55);
  if (op <= 4e-3) return null;
  return /* @__PURE__ */ jsx26(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        pointerEvents: "none",
        opacity: op,
        background: `linear-gradient(105deg, rgba(0,0,0,0) ${pos - 14}%, rgba(0,0,0,0.32) ${pos}%, rgba(0,0,0,0) ${pos + 14}%)`
      }
    }
  );
};
var FlipCard = ({ i, count, frame, result, card, line, accent }) => {
  const angle = angleAt(frame, i);
  return /* @__PURE__ */ jsx26(
    "div",
    {
      style: {
        position: "absolute",
        left: (1920 - (CW2 * count + GAP3 * (count - 1))) / 2 + i * (CW2 + GAP3),
        top: Y,
        width: CW2,
        height: CH2,
        perspective: 1200
      },
      children: /* @__PURE__ */ jsxs26(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${angle}deg)`
          },
          children: [
            /* @__PURE__ */ jsxs26(
              "div",
              {
                "data-card-flip-front": true,
                style: { position: "absolute", inset: 0, backfaceVisibility: "hidden", background: card },
                children: [
                  /* @__PURE__ */ jsx26(Card, { w: CW2, h: CH2, seed: i + 1, palette: { card, line, accent } }),
                  /* @__PURE__ */ jsx26(
                    "span",
                    {
                      "data-card-flip-front-label": true,
                      style: {
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 40,
                        boxSizing: "border-box",
                        textAlign: "center",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 800,
                        fontSize: 54,
                        lineHeight: 1.12,
                        color: contrastTextFor(card)
                      },
                      children: result
                    }
                  ),
                  /* @__PURE__ */ jsx26(Sheen, { angle })
                ]
              }
            ),
            /* @__PURE__ */ jsxs26(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: card,
                  border: `2px solid ${line}`,
                  borderRadius: 14,
                  boxSizing: "border-box",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: [
                  /* @__PURE__ */ jsx26(
                    "span",
                    {
                      "data-card-flip-result": true,
                      style: {
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 800,
                        fontSize: 96,
                        color: contrastTextFor(card),
                        letterSpacing: -2
                      },
                      children: result
                    }
                  ),
                  /* @__PURE__ */ jsx26(Sheen, { angle })
                ]
              }
            )
          ]
        }
      )
    }
  );
};
var CardFlipReveal = ({ title = "", items = [], palette = {} }) => {
  const frame = useCurrentFrame25();
  const accent = palette.accent || G.ink;
  const results = items.map((item) => item.trim()).filter(Boolean).slice(0, 3);
  const renderedResults = results.length ? results : [title || "\u5173\u952E\u7ED3\u679C"];
  return /* @__PURE__ */ jsxs26("div", { style: { width: 1920, height: 1080, background: palette.canvas || G.bg, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx26("div", { style: { position: "absolute", left: 120, top: 96 }, children: /* @__PURE__ */ jsx26(TitleBlock, { text: title || "\u5173\u952E\u7ED3\u679C", size: 54, color: accent }) }),
    renderedResults.map((result, i) => /* @__PURE__ */ jsx26(FlipCard, { i, count: renderedResults.length, frame, result: result.slice(0, 10), card: palette.card || G.card, line: palette.line || G.border, accent: palette.accent || G.ink }, `${result}-${i}`))
  ] });
};

// src/gpt56-relay-templates.tsx
import { jsx as jsx27, jsxs as jsxs27 } from "react/jsx-runtime";
var clamp01 = (value) => Math.max(0, Math.min(1, value));
var easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
var spring4 = (value) => {
  const t = clamp01(value);
  return 1 - Math.cos(t * Math.PI * 2.5) * Math.exp(-t * 7);
};
var phase = (progress, start, duration = 0.22) => easeOut((progress - start) / duration);
function Frame({ settings, children, className = "" }) {
  const palette = {
    "--relay-canvas": settings.panelCanvasColor,
    "--relay-panel": settings.panelSurfaceColor,
    "--relay-card": settings.panelCardColor,
    "--relay-accent": settings.panelAccentColor,
    "--relay-line": settings.panelLineColor
  };
  return /* @__PURE__ */ jsx27("div", { className: `motion gpt56-relay ${className}`, style: palette, children });
}
function ImpactQuestion({ settings, progress }) {
  const hit = spring4(progress / 0.24);
  const question = phase(progress, 0.2, 0.2);
  const answer = phase(progress, 0.62, 0.18);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-impact-question", children: [
    /* @__PURE__ */ jsx27("div", { className: "relay-grid" }),
    /* @__PURE__ */ jsxs27("header", { "data-motion-primitive": "hit", style: { transform: `translateY(${(1 - hit) * 18}cqw) scale(${0.72 + hit * 0.28}) rotate(${(1 - hit) * -4}deg)`, opacity: hit }, children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "OPENING QUESTION" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title })
    ] }),
    /* @__PURE__ */ jsx27("strong", { "data-motion-primitive": "slide", style: { transform: `translateX(${(1 - question) * 12}cqw)`, opacity: question }, children: settings.subtitle }),
    /* @__PURE__ */ jsx27("footer", { "data-motion-primitive": "stamp", style: { transform: `scale(${0.72 + answer * 0.28}) rotate(${(1 - answer) * -3}deg)`, opacity: answer }, children: settings.items[0] || "\u91CD\u70B9\u63ED\u6653" })
  ] });
}
function TokenVelocity({ settings, progress }) {
  const items = settings.items.filter(Boolean).slice(0, 4);
  const route = easeOut(progress / 0.72);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-token-velocity", children: [
    /* @__PURE__ */ jsxs27("header", { children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "TASK RELAY" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsxs27("main", { "data-motion-primitive": "route", children: [
      /* @__PURE__ */ jsx27("i", { className: "relay-route-line", children: /* @__PURE__ */ jsx27("b", { style: { transform: `scaleX(${route})` } }) }),
      items.map((item, index) => {
        const enter = spring4((progress - 0.12 - index * 0.12) / 0.22);
        return /* @__PURE__ */ jsxs27("article", { style: { opacity: clamp01(enter), transform: `translateY(${(1 - enter) * 5}cqw) scale(${0.8 + enter * 0.2})` }, children: [
          /* @__PURE__ */ jsxs27("b", { children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx27("strong", { children: item })
        ] }, `${item}-${index}`);
      }),
      /* @__PURE__ */ jsx27("span", { className: "relay-task-token", style: { transform: `translateX(${route * 69}cqw) skewX(${(1 - route) * -12}deg)` }, children: "TASK" })
    ] })
  ] });
}
function ThreeStation({ settings, progress }) {
  const items = settings.items.filter(Boolean).slice(0, 3);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-three-station", children: [
    /* @__PURE__ */ jsxs27("header", { children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "03 STATIONS" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx27("main", { children: items.map((item, index) => {
      const enter = spring4((progress - 0.08 - index * 0.18) / 0.24);
      return /* @__PURE__ */ jsxs27("article", { "data-motion-primitive": "lift", className: index === Math.min(2, Math.floor(progress * 3)) ? "active" : "", style: { opacity: clamp01(enter), transform: `translateY(${(1 - enter) * 8}cqw) scale(${0.82 + enter * 0.18})` }, children: [
        /* @__PURE__ */ jsxs27("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx27("strong", { children: item }),
        /* @__PURE__ */ jsx27("span", { children: ["\u8BA8\u8BBA\u65B9\u5411", "\u5F62\u6210\u4EA4\u4ED8", "\u5DE5\u7A0B\u6267\u884C"][index] })
      ] }, `${item}-${index}`);
    }) })
  ] });
}
function SignalPath({ settings, progress }) {
  const items = settings.items.filter(Boolean).slice(0, 4);
  const route = easeOut(progress / 0.78);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-signal-path", children: [
    /* @__PURE__ */ jsxs27("header", { children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "SIGNAL PATH" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsxs27("main", { "data-motion-primitive": "route", children: [
      /* @__PURE__ */ jsx27("svg", { viewBox: "0 0 1000 250", preserveAspectRatio: "none", "data-export-outline-only": "true", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx27("path", { d: "M40 170 C200 20 330 230 500 105 S800 25 960 150", pathLength: "1", fill: "none", stroke: "var(--relay-line)", strokeWidth: "8", strokeLinecap: "round", strokeDasharray: "1", style: { fill: "none", strokeDashoffset: 1 - route } }) }),
      items.map((item, index) => /* @__PURE__ */ jsxs27("article", { style: { left: `${7 + index * (86 / Math.max(1, items.length - 1))}%`, opacity: phase(progress, 0.12 + index * 0.14, 0.18), transform: `translate(-50%,-50%) scale(${0.72 + phase(progress, 0.12 + index * 0.14, 0.18) * 0.28})` }, children: [
        /* @__PURE__ */ jsxs27("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx27("strong", { children: item })
      ] }, `${item}-${index}`)),
      /* @__PURE__ */ jsx27("span", { className: "relay-pulse", style: { left: `${4 + route * 92}%` } })
    ] })
  ] });
}
function StateStamp({ settings, progress }) {
  const hit = spring4(progress / 0.28);
  const stamp = spring4((progress - 0.48) / 0.22);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-state-stamp", children: [
    /* @__PURE__ */ jsxs27("header", { "data-motion-primitive": "hit", style: { opacity: clamp01(hit), transform: `scale(${0.62 + hit * 0.38}) rotate(${(1 - hit) * -5}deg)` }, children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "STATE CHANGE" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx27("main", { children: settings.items.filter(Boolean).slice(0, 3).map((item, index) => /* @__PURE__ */ jsx27("span", { style: { opacity: phase(progress, 0.2 + index * 0.09, 0.2), transform: `translateX(${(1 - phase(progress, 0.2 + index * 0.09, 0.2)) * -5}cqw)` }, children: item }, `${item}-${index}`)) }),
    /* @__PURE__ */ jsx27("strong", { "data-motion-primitive": "stamp", style: { opacity: clamp01(stamp), transform: `scale(${1.55 - stamp * 0.55}) rotate(${(1 - stamp) * -14}deg)` }, children: "LOCKED" })
  ] });
}
function CompletionRail({ settings, progress }) {
  const items = settings.items.filter(Boolean).slice(0, 4);
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: "relay-completion-rail", children: [
    /* @__PURE__ */ jsxs27("header", { children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote || "FINAL CHECKPOINTS" }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx27("main", { children: items.map((item, index) => {
      const done = phase(progress, 0.12 + index * 0.16, 0.22);
      return /* @__PURE__ */ jsxs27("article", { "data-motion-primitive": index === items.length - 1 ? "stamp" : "slide", children: [
        /* @__PURE__ */ jsx27("span", { children: item }),
        /* @__PURE__ */ jsx27("i", { children: /* @__PURE__ */ jsx27("b", { style: { transform: `scaleX(${done})` } }) }),
        /* @__PURE__ */ jsx27("strong", { style: { opacity: done }, children: index === items.length - 1 ? "HUMAN" : "DONE" })
      ] }, `${item}-${index}`);
    }) })
  ] });
}
function ModelSketch({ settings, progress, kind }) {
  const intro = phase(progress, 0.04, 0.2);
  const part = (index) => {
    const enter = spring4((progress - 0.16 - index * 0.12) / 0.24);
    return { opacity: clamp01(enter), transform: `translateY(${(1 - enter) * 4}cqw) scale(${0.82 + enter * 0.18})` };
  };
  return /* @__PURE__ */ jsxs27(Frame, { settings, className: `relay-model-sketch model-${kind}`, children: [
    /* @__PURE__ */ jsx27("div", { className: "relay-grid" }),
    /* @__PURE__ */ jsxs27("header", { style: { opacity: intro, transform: `translateX(${(1 - intro) * -4}cqw)` }, children: [
      /* @__PURE__ */ jsx27("small", { children: settings.quote }),
      /* @__PURE__ */ jsx27("h2", { children: settings.title }),
      /* @__PURE__ */ jsx27("p", { children: settings.subtitle }),
      /* @__PURE__ */ jsx27("div", { className: "model-sketch-tags", children: settings.items.filter(Boolean).slice(0, 3).map((item, index) => /* @__PURE__ */ jsx27("span", { children: item }, `${item}-${index}`)) })
    ] }),
    /* @__PURE__ */ jsxs27("main", { "aria-label": kind === "sol" ? "\u4EBA\u7269\u63A8\u7740\u91CD\u7269\u6500\u4E0A\u65D7\u5CF0\u7684\u7B80\u7B14\u753B" : kind === "terra" ? "\u4EBA\u7269\u5728\u5DE5\u4F5C\u53F0\u4E0E\u5E73\u8861\u79E4\u65C1\u5904\u7406\u65E5\u5E38\u4EFB\u52A1\u7684\u7B80\u7B14\u753B" : "\u4EBA\u7269\u4E58\u7EB8\u98DE\u673A\u63A0\u8FC7\u6708\u7259\u4E0E\u901F\u5EA6\u7EBF\u7684\u7B80\u7B14\u753B", children: [
      kind === "sol" && /* @__PURE__ */ jsxs27("svg", { viewBox: "0 0 640 420", role: "img", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-paper", style: part(0), children: [
          /* @__PURE__ */ jsx27("path", { d: "M62 354 238 167 316 253 440 86 579 354Z" }),
          /* @__PURE__ */ jsx27("path", { d: "M440 86v-52m0 4 86 23-86 24" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-accent", style: part(1), children: [
          /* @__PURE__ */ jsx27("circle", { cx: "440", cy: "86", r: "22" }),
          /* @__PURE__ */ jsx27("path", { d: "m414 100 26-14 22 20-19 17Z" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-line", style: part(2), children: [
          /* @__PURE__ */ jsx27("circle", { cx: "235", cy: "244", r: "28" }),
          /* @__PURE__ */ jsx27("path", { d: "m236 272-8 62m8-39 44-21m-46 29-39 22m33 10-29 38m31-37 42 33" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-boulder", style: part(3), children: [
          /* @__PURE__ */ jsx27("circle", { cx: "323", cy: "246", r: "58" }),
          /* @__PURE__ */ jsx27("path", { d: "m286 229 34-24 42 31-16 45-48 8-26-34Z" })
        ] }),
        /* @__PURE__ */ jsx27("g", { className: "sketch-piece sketch-speed", style: part(4), children: /* @__PURE__ */ jsx27("path", { d: "m105 312 58-60m-34 87 56-58m176-111 51-58" }) })
      ] }),
      kind === "terra" && /* @__PURE__ */ jsxs27("svg", { viewBox: "0 0 640 420", role: "img", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-paper", style: part(0), children: [
          /* @__PURE__ */ jsx27("path", { d: "M77 306h300v30H77zm42 30v58m215-58v58" }),
          /* @__PURE__ */ jsx27("rect", { x: "106", y: "104", width: "196", height: "122", rx: "16" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-accent", style: part(1), children: [
          /* @__PURE__ */ jsx27("rect", { x: "132", y: "128", width: "48", height: "72", rx: "8" }),
          /* @__PURE__ */ jsx27("rect", { x: "189", y: "144", width: "88", height: "14", rx: "7" }),
          /* @__PURE__ */ jsx27("rect", { x: "189", y: "172", width: "70", height: "14", rx: "7" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-line", style: part(2), children: [
          /* @__PURE__ */ jsx27("circle", { cx: "362", cy: "184", r: "27" }),
          /* @__PURE__ */ jsx27("path", { d: "m360 211-15 77m7-50-47 31m45-19 39 31m-43 9-24 46m25-44 35 46" })
        ] }),
        /* @__PURE__ */ jsx27("g", { className: "sketch-piece sketch-balance", style: part(3), children: /* @__PURE__ */ jsx27("path", { d: "M493 127v186m-74-137h148m-74-51-32 51h64zm-72 51-29 62h58zm144 0-29 62h58zM447 313h92" }) }),
        /* @__PURE__ */ jsx27("g", { className: "sketch-piece sketch-speed", style: part(4), children: /* @__PURE__ */ jsx27("path", { d: "M108 261h73m-73 18h116m181 82h148" }) })
      ] }),
      kind === "luna" && /* @__PURE__ */ jsxs27("svg", { viewBox: "0 0 640 420", role: "img", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx27("g", { className: "sketch-piece sketch-paper", style: part(0), children: /* @__PURE__ */ jsx27("path", { d: "M500 74c-76 22-106 116-61 178 35 48 105 56 151 19-101 5-144-120-90-197Z" }) }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-accent", style: part(1), children: [
          /* @__PURE__ */ jsx27("path", { d: "m124 251 248-123-82 174-65-57-101 6Z" }),
          /* @__PURE__ */ jsx27("path", { d: "m225 245 147-117-82 174" })
        ] }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-line", style: part(2), children: [
          /* @__PURE__ */ jsx27("circle", { cx: "239", cy: "183", r: "24" }),
          /* @__PURE__ */ jsx27("path", { d: "m242 207 31 51m-20-28-45 15m57-2 48-5" })
        ] }),
        /* @__PURE__ */ jsx27("g", { className: "sketch-piece sketch-speed", style: part(3), children: /* @__PURE__ */ jsx27("path", { d: "M48 198h111M29 233h126M69 273h106" }) }),
        /* @__PURE__ */ jsxs27("g", { className: "sketch-piece sketch-coins", style: part(4), children: [
          /* @__PURE__ */ jsx27("ellipse", { cx: "478", cy: "325", rx: "46", ry: "13" }),
          /* @__PURE__ */ jsx27("path", { d: "M432 325v34c0 7 21 13 46 13s46-6 46-13v-34m-92 17c0 7 21 13 46 13s46-6 46-13" })
        ] })
      ] }),
      /* @__PURE__ */ jsx27("strong", { children: kind === "sol" ? "\u653B\u575A" : kind === "terra" ? "\u5747\u8861" : "\u8F7B\u5FEB" })
    ] })
  ] });
}
function Gpt56RelayTemplatePlayer({ id, settings, progress }) {
  if (id === "relayImpactQuestion") return /* @__PURE__ */ jsx27(ImpactQuestion, { settings, progress });
  if (id === "relayTokenVelocity") return /* @__PURE__ */ jsx27(TokenVelocity, { settings, progress });
  if (id === "relayThreeStation") return /* @__PURE__ */ jsx27(ThreeStation, { settings, progress });
  if (id === "relaySignalPath") return /* @__PURE__ */ jsx27(SignalPath, { settings, progress });
  if (id === "relayStateStamp") return /* @__PURE__ */ jsx27(StateStamp, { settings, progress });
  if (id === "modelSketchSol") return /* @__PURE__ */ jsx27(ModelSketch, { settings, progress, kind: "sol" });
  if (id === "modelSketchTerra") return /* @__PURE__ */ jsx27(ModelSketch, { settings, progress, kind: "terra" });
  if (id === "modelSketchLuna") return /* @__PURE__ */ jsx27(ModelSketch, { settings, progress, kind: "luna" });
  return /* @__PURE__ */ jsx27(CompletionRail, { settings, progress });
}

// m5-original-selected:src/App.tsx
import { jsx as jsx28, jsxs as jsxs28 } from "react/jsx-runtime";
function normalizedTextCoverage(text) {
  return text.replace(/<[^>]+>/g, "").replace(/[\s，。；、：,;:！？!?「」“”‘’【】()（）…—-]/g, "").toLocaleLowerCase();
}
function visualBeatUnits(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
  return Array.from(segmenter.segment(compact), ({ segment }) => segment);
}
function splitTextWithoutOrphans(text, requestedParts) {
  const original = text.replace(/\s+/g, " ").trim();
  const units = visualBeatUnits(original);
  const visibleLength = normalizedTextCoverage(original).length;
  if (visibleLength < 4 || requestedParts < 2 || units.length < 2)
    return [original];
  const partCount = Math.max(1, Math.min(requestedParts, Math.floor(visibleLength / 2)));
  if (partCount < 2)
    return [original];
  const parts = [];
  let current = "";
  let currentWeight = 0;
  let consumedWeight = 0;
  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    const weight = normalizedTextCoverage(unit).length;
    const remainingParts = partCount - parts.length;
    const remainingWeight = visibleLength - consumedWeight;
    const targetWeight = remainingWeight / remainingParts;
    const needsObject = /(?:配置|同步给|发送给|写入|读取|告诉|作为|将|把|让|给)$/i.test(current.trim());
    const canClose = parts.length < partCount - 1 && normalizedTextCoverage(current).length >= 2 && !needsObject;
    if (canClose && currentWeight + weight > targetWeight && normalizedTextCoverage(units.slice(index).join("")).length >= (remainingParts - 1) * 2) {
      parts.push(current.trim());
      current = "";
      currentWeight = 0;
    }
    current += unit;
    currentWeight += weight;
    consumedWeight += weight;
  }
  if (current.trim())
    parts.push(current.trim());
  for (let index = 0; index < parts.length; index += 1) {
    if (normalizedTextCoverage(parts[index]).length !== 1 || parts.length === 1)
      continue;
    if (index < parts.length - 1)
      parts.splice(index, 2, `${parts[index]}${parts[index + 1]}`);
    else
      parts.splice(index - 1, 2, `${parts[index - 1]}${parts[index]}`);
    index = Math.max(-1, index - 2);
  }
  return normalizedTextCoverage(parts.join("")) === normalizedTextCoverage(original) ? parts.filter(Boolean) : [original];
}
function compactFlowHeading(text, maxLength = 8) {
  const cleaned = text.replace(/^(当你|如果你|然后|接着|现在|我们|它会|它不会|就是|其实)+/g, "").replace(/[「」“”‘’【】()（）]/g, "").trim();
  const clauses = cleaned.split(/[，。；、：,;:！？!?]/).map((part) => part.trim()).filter(Boolean);
  const preferred = clauses.find((part) => /流程|步骤|分析|设计|生成|系统|网站|产品/.test(part)) || clauses[0] || "\u56DB\u6B65\u6D41\u7A0B";
  const compact = preferred.replace(/^(先|首先|再|然后)/, "");
  return Array.from(compact).slice(0, maxLength).join("") || "\u56DB\u6B65\u6D41\u7A0B";
}
function densityClass(...values) {
  const length = values.join("").replace(/\s/g, "").length;
  return length <= 18 ? "density-short" : length >= 58 ? "density-long" : "density-medium";
}
var DASHBOARD_FACT_DEFINITIONS = [
  [/(\d+)\s*种?\s*UI\s*风格/i, "\u79CD", "UI \u98CE\u683C"],
  [/(\d+)\s*套?\s*行业配色/i, "\u5957", "\u884C\u4E1A\u914D\u8272"],
  [/(\d+)\s*组?\s*字体组合/i, "\u7EC4", "\u5B57\u4F53\u7EC4\u5408"],
  [/(\d+)\s*条?\s*行业推理规则/i, "\u6761", "\u884C\u4E1A\u63A8\u7406\u89C4\u5219"],
  [/(\d+)\s*条?\s*UX\s*规范/i, "\u6761", "UX \u89C4\u8303"],
  [/(\d+)\s*种?\s*图表方案/i, "\u79CD", "\u56FE\u8868\u65B9\u6848"]
];
function extractDashboardFacts(text) {
  return DASHBOARD_FACT_DEFINITIONS.flatMap(([pattern, unit, label]) => {
    const value = text.match(pattern)?.[1];
    return value ? [{ value, unit, label }] : [];
  }).slice(0, 6);
}
function clamp012(value) {
  return Math.max(0, Math.min(1, value));
}
function easeOutCubic(value) {
  const t = clamp012(value);
  return 1 - Math.pow(1 - t, 3);
}
function Glyph({ type }) {
  const paths = {
    input: "M5 12h14M12 5l7 7-7 7",
    skill: "M8 4h8v4h4v8h-4v4H8v-4H4V8h4V4Z",
    process: "M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8",
    result: "m5 12 4 4L19 6",
    chart: "M5 19V9m7 10V5m7 14v-7",
    search: "m20 20-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
  };
  return /* @__PURE__ */ jsx28("svg", { className: "glyph", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx28("path", { d: paths[type] }) });
}
function OrderedViewpoint({ settings }) {
  return /* @__PURE__ */ jsxs28("div", { className: "motion ordered-viewpoint", children: [
    /* @__PURE__ */ jsx28("div", { className: "viewpoint-orbit viewpoint-orbit-a" }),
    /* @__PURE__ */ jsx28("div", { className: "viewpoint-orbit viewpoint-orbit-b" }),
    /* @__PURE__ */ jsxs28("div", { className: "viewpoint-page", children: [
      /* @__PURE__ */ jsx28("span", { className: "viewpoint-order", children: settings.metric }),
      /* @__PURE__ */ jsx28("i", { className: "viewpoint-rule" }),
      /* @__PURE__ */ jsx28("h2", { children: settings.title }),
      /* @__PURE__ */ jsx28("small", { children: "CHAPTER / KEY VIEWPOINT" })
    ] })
  ] });
}
function FlowCards({ settings, count }) {
  const icons = ["input", "skill", "process", "result"];
  if (count === 4) {
    const steps = settings.items.slice(0, 4);
    return /* @__PURE__ */ jsx28("div", { className: "motion flow-cards flow-4", children: /* @__PURE__ */ jsxs28("div", { className: "flow-four-stage", children: [
      /* @__PURE__ */ jsxs28("header", { className: "flow-four-header", children: [
        /* @__PURE__ */ jsx28("small", { children: "SEQUENTIAL WORKFLOW \xB7 04 STEPS" }),
        /* @__PURE__ */ jsx28("h2", { title: settings.title, children: compactFlowHeading(settings.title, 12) }),
        /* @__PURE__ */ jsx28("p", { children: settings.subtitle || "\u4ECE\u8F93\u5165\u5230\u7ED3\u679C\uFF0C\u6309\u987A\u5E8F\u9010\u6B65\u5B8C\u6210" })
      ] }),
      /* @__PURE__ */ jsx28("div", { className: "flow-four-track", role: "list", "aria-label": "\u56DB\u6B65\u8FDE\u7EED\u6D41\u7A0B", children: steps.map((item, index) => /* @__PURE__ */ jsxs28("div", { className: "flow-four-unit", children: [
        /* @__PURE__ */ jsxs28("article", { className: `flow-four-step accent-${index}`, role: "listitem", style: { "--flow-delay": `calc(var(--motion-speed) * ${index * 0.18})` }, children: [
          /* @__PURE__ */ jsxs28("div", { className: "flow-four-step-head", children: [
            /* @__PURE__ */ jsx28("span", { className: "flow-four-marker", children: String(index + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx28("span", { className: "flow-four-icon", children: /* @__PURE__ */ jsx28(Glyph, { type: icons[index] }) })
          ] }),
          /* @__PURE__ */ jsxs28("small", { children: [
            "STEP ",
            String(index + 1).padStart(2, "0")
          ] }),
          /* @__PURE__ */ jsx28("strong", { children: item })
        ] }),
        index < steps.length - 1 && /* @__PURE__ */ jsxs28("div", { className: "flow-four-connector", "aria-hidden": "true", style: { "--flow-delay": `calc(var(--motion-speed) * ${index * 0.18 + 0.1})` }, children: [
          /* @__PURE__ */ jsx28("span", {}),
          /* @__PURE__ */ jsx28("i", {})
        ] })
      ] }, `${item}-${index}`)) }),
      /* @__PURE__ */ jsxs28("div", { className: "flow-four-progress", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx28("b", { children: "START" }),
        /* @__PURE__ */ jsx28("span", { children: /* @__PURE__ */ jsx28("i", {}) }),
        /* @__PURE__ */ jsx28("b", { children: "DELIVER" })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx28("div", { className: "motion flow-cards flow-3", children: /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-right", children: [
    /* @__PURE__ */ jsx28("h2", { children: settings.title }),
    /* @__PURE__ */ jsx28("p", { className: "flow-subtitle", children: settings.subtitle }),
    /* @__PURE__ */ jsx28("div", { className: "flow-list flow-list-three", children: settings.items.slice(0, count).map((item, index) => /* @__PURE__ */ jsxs28("div", { className: "flow-step-group", children: [
      /* @__PURE__ */ jsxs28("div", { className: "flow-node", style: { "--flow-delay": `calc(var(--motion-speed) * ${index * 0.16})` }, children: [
        /* @__PURE__ */ jsx28("span", { children: /* @__PURE__ */ jsx28(Glyph, { type: icons[index] }) }),
        /* @__PURE__ */ jsx28("b", { children: String(index + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx28("strong", { children: item })
      ] }),
      index < count - 1 && /* @__PURE__ */ jsxs28("div", { className: "flow-connector", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx28("span", {}),
        /* @__PURE__ */ jsx28("i", {})
      ] })
    ] }, `${item}-${index}`)) })
  ] }) });
}
function DataChart({ settings }) {
  return /* @__PURE__ */ jsx28("div", { className: "motion data-chart", children: /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-left", children: [
    /* @__PURE__ */ jsxs28("div", { className: "chart-head", children: [
      /* @__PURE__ */ jsx28(Glyph, { type: "chart" }),
      /* @__PURE__ */ jsx28("span", { children: "VERIFIED DATA ONLY" })
    ] }),
    /* @__PURE__ */ jsx28("h2", { children: settings.title }),
    /* @__PURE__ */ jsx28("div", { className: "bars", children: [42, 70, 55, 92].map((height, index) => /* @__PURE__ */ jsxs28("div", { children: [
      /* @__PURE__ */ jsx28("i", { style: { height: `${height}%` } }),
      /* @__PURE__ */ jsx28("span", { children: settings.items[index] })
    ] }, height)) }),
    /* @__PURE__ */ jsxs28("b", { className: "chart-result", children: [
      settings.metric,
      settings.prefix
    ] }),
    !settings.dataConfirmed && /* @__PURE__ */ jsx28("div", { className: "chart-inline-warning", children: "\u672A\u786E\u8BA4\u771F\u5B9E\u6570\u636E\uFF0C\u7981\u6B62\u5BFC\u51FA" })
  ] }) });
}
function EvidenceWindow({ settings }) {
  return /* @__PURE__ */ jsx28("div", { className: "motion evidence-window", children: /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-right", children: [
    /* @__PURE__ */ jsxs28("div", { className: "window-bar", children: [
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("span", { children: settings.items[0] })
    ] }),
    /* @__PURE__ */ jsxs28("div", { className: "window-body", children: [
      /* @__PURE__ */ jsx28("div", { className: "evidence-line strong" }),
      /* @__PURE__ */ jsx28("div", { className: "evidence-line" }),
      /* @__PURE__ */ jsx28("div", { className: "evidence-line short" }),
      /* @__PURE__ */ jsxs28("div", { className: "roi-focus", children: [
        /* @__PURE__ */ jsx28(Glyph, { type: "search" }),
        /* @__PURE__ */ jsx28("b", { children: settings.title }),
        /* @__PURE__ */ jsx28("span", { children: settings.subtitle })
      ] })
    ] })
  ] }) });
}
var DASHBOARD_DEMO_FACTS = [
  { value: "84", unit: "\u79CD", label: "UI \u98CE\u683C" },
  { value: "192", unit: "\u5957", label: "\u884C\u4E1A\u914D\u8272" },
  { value: "74", unit: "\u7EC4", label: "\u5B57\u4F53\u7EC4\u5408" },
  { value: "161", unit: "\u6761", label: "\u884C\u4E1A\u63A8\u7406\u89C4\u5219" },
  { value: "98", unit: "\u6761", label: "UX \u89C4\u8303" },
  { value: "25", unit: "\u79CD", label: "\u56FE\u8868\u65B9\u6848" }
];
var DASHBOARD_COLORS = ["#8b7cff", "#ffb43b", "#55c7ff", "#55ddad", "#ff6f7d", "#c5f85a"];
function resolvedDashboardFacts(settings) {
  const parsed = extractDashboardFacts(settings.sourceText || [settings.title, settings.subtitle, ...settings.items].join(" "));
  return { facts: parsed.length >= 2 ? parsed : DASHBOARD_DEMO_FACTS, isDemo: parsed.length < 2 };
}
function dashboardScale(facts) {
  return Math.max(1, ...facts.map((fact) => Number(fact.value) || 0));
}
function DashboardHeading({ settings, isDemo, eyebrow }) {
  return /* @__PURE__ */ jsxs28("header", { className: "dashboard-heading", children: [
    /* @__PURE__ */ jsxs28("div", { children: [
      /* @__PURE__ */ jsx28("small", { children: eyebrow }),
      /* @__PURE__ */ jsx28("h2", { children: settings.title || "UI / UX Pro Max \u8BBE\u8BA1\u89C4\u6A21" }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle || "\u6570\u636E\u3001\u56FE\u8868\u4E0E\u7ED3\u8BBA" })
    ] }),
    /* @__PURE__ */ jsx28("span", { className: isDemo ? "dashboard-demo-badge" : "dashboard-verified-badge", children: isDemo ? "\u6A21\u677F\u9884\u89C8\u6570\u636E" : "\u5DF2\u7ED1\u5B9A\u771F\u5B9E\u6570\u636E" })
  ] });
}
function RankDashboard({ settings, progress = 1 }) {
  const { facts, isDemo } = resolvedDashboardFacts(settings);
  const sorted = [...facts].sort((left, right) => Number(right.value) - Number(left.value));
  const max = dashboardScale(sorted);
  return /* @__PURE__ */ jsxs28("div", { className: "motion reference-page dashboard-page rank-dashboard", children: [
    /* @__PURE__ */ jsx28(DashboardHeading, { settings, isDemo, eyebrow: "DATA SYSTEM / RANKING" }),
    /* @__PURE__ */ jsxs28("div", { className: "rank-dashboard-body", children: [
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsxs28("div", { className: "dashboard-panel-title", children: [
          /* @__PURE__ */ jsx28("b", { children: "\u6307\u6807\u89C4\u6A21\u6392\u540D" }),
          /* @__PURE__ */ jsx28("span", { children: "\u9AD8 \u2192 \u4F4E" })
        ] }),
        sorted.map((fact, index) => {
          const reveal = easeOutCubic((progress - (0.05 + index * 0.07)) / 0.16);
          return /* @__PURE__ */ jsxs28("div", { className: "rank-row", children: [
            /* @__PURE__ */ jsx28("strong", { children: String(index + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx28("span", { children: fact.label }),
            /* @__PURE__ */ jsx28("i", { children: /* @__PURE__ */ jsx28("b", { style: { width: `${Number(fact.value) / max * 100}%`, background: DASHBOARD_COLORS[index], transform: `scaleX(${reveal})` } }) }),
            /* @__PURE__ */ jsxs28("em", { children: [
              fact.value,
              fact.unit
            ] })
          ] }, fact.label);
        })
      ] }),
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("small", { children: "TOP METRIC" }),
        /* @__PURE__ */ jsx28("b", { children: sorted[0].value }),
        /* @__PURE__ */ jsxs28("span", { children: [
          sorted[0].unit,
          " \xB7 ",
          sorted[0].label
        ] }),
        /* @__PURE__ */ jsx28("p", { children: "\u591A\u7EF4\u8BBE\u8BA1\u8D44\u4EA7\u4E0E\u89C4\u5219\u5171\u540C\u7EC4\u6210\u53EF\u68C0\u7D22\u3001\u53EF\u6267\u884C\u7684\u4E13\u4E1A\u77E5\u8BC6\u5E93\u3002" })
      ] })
    ] })
  ] });
}
function capitalFacts(settings, _variant) {
  const supplied = settings.items.map((item) => item.trim()).filter(Boolean);
  return supplied.slice(0, 4);
}
function capitalValue(value, fallback) {
  const number = Number(value.match(/\d+(?:\.\d+)?/)?.[0]);
  return Number.isFinite(number) ? number : fallback;
}
function CapitalInfographic({ settings, variant, progress = 1 }) {
  const facts = capitalFacts(settings, variant);
  const values = facts.map((fact, index) => capitalValue(fact, [82, 66, 51, 38][index]));
  const max = Math.max(1, ...values);
  const title = settings.title;
  const header = /* @__PURE__ */ jsx28("header", { className: "capital-head", children: /* @__PURE__ */ jsxs28("div", { children: [
    /* @__PURE__ */ jsx28("h2", { children: title }),
    settings.subtitle && /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
  ] }) });
  if (variant === "kpi")
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-kpi", children: [
      header,
      /* @__PURE__ */ jsx28("div", { className: "capital-kpi-grid", children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("article", { style: { "--capital-delay": index, opacity: easeOutCubic((progress - index * 0.06) / 0.25) }, children: [
        /* @__PURE__ */ jsxs28("span", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("b", { children: fact.match(/[$¥€]?\d+(?:\.\d+)?(?:%|B|亿|万)?/)?.[0] || "" }),
        /* @__PURE__ */ jsx28("p", { children: fact.replace(/[$¥€]?\d+(?:\.\d+)?(?:%|B|亿|万)?/, "").trim() })
      ] }, fact)) }),
      settings.quote && /* @__PURE__ */ jsx28("aside", { children: /* @__PURE__ */ jsx28("span", { children: settings.quote }) })
    ] });
  if (variant === "waterfall")
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-waterfall", children: [
      header,
      /* @__PURE__ */ jsx28("div", { className: "capital-waterfall-chart", children: facts.map((fact, index) => {
        const signed = Number(fact.match(/[-+]?\d+(?:\.\d+)?/)?.[0] || values[index]);
        const height = 5 + Math.abs(signed) / max * 12;
        return /* @__PURE__ */ jsxs28("article", { className: signed < 0 ? "is-negative" : index === 0 || index === facts.length - 1 ? "is-total" : "is-positive", children: [
          /* @__PURE__ */ jsxs28("b", { children: [
            signed > 0 && index > 0 && index < facts.length - 1 ? "+" : "",
            signed
          ] }),
          /* @__PURE__ */ jsx28("i", { style: { height: `${height}cqw`, transform: `scaleY(${easeOutCubic((progress - index * 0.08) / 0.45)})` } }),
          /* @__PURE__ */ jsx28("span", { children: fact.replace(/[-+]?\d+(?:\.\d+)?(?:%|B|亿|万)?/, "").trim() })
        ] }, fact);
      }) })
    ] });
  if (variant === "bullet")
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-bullet", children: [
      header,
      /* @__PURE__ */ jsx28("div", { className: "capital-bullet-grid", children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("header", { children: [
          /* @__PURE__ */ jsxs28("span", { children: [
            "0",
            index + 1,
            " / TARGET"
          ] }),
          /* @__PURE__ */ jsxs28("b", { children: [
            values[index],
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("i", { style: { width: `${Math.min(100, values[index]) * easeOutCubic((progress - index * 0.07) / 0.5)}%` } }),
          /* @__PURE__ */ jsx28("em", { style: { left: "75%" } })
        ] }),
        /* @__PURE__ */ jsx28("p", { children: fact.replace(/\d+(?:\.\d+)?%?/, "").trim() })
      ] }, fact)) })
    ] });
  if (variant === "donut") {
    const total = values.reduce((sum, value) => sum + value, 0) || 100;
    let cursor = 0;
    const stops = values.map((value, index) => {
      const start = cursor;
      cursor += value / total * 100;
      return `var(--capital-c${index}) ${start}% ${cursor}%`;
    }).join(",");
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-donut", children: [
      header,
      /* @__PURE__ */ jsxs28("div", { className: "capital-donut-body", children: [
        /* @__PURE__ */ jsx28("div", { className: "capital-donut-chart", style: { background: `conic-gradient(${stops})` }, children: /* @__PURE__ */ jsxs28("i", { children: [
          /* @__PURE__ */ jsx28("b", { children: settings.metric || "100%" }),
          /* @__PURE__ */ jsx28("span", { children: settings.metricLabel || "\u603B\u89C4\u6A21" })
        ] }) }),
        /* @__PURE__ */ jsx28("div", { className: "capital-legend", children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("i", { style: { background: `var(--capital-c${index})` } }),
          /* @__PURE__ */ jsx28("span", { children: fact }),
          /* @__PURE__ */ jsxs28("b", { children: [
            Math.round(values[index] / total * 100),
            "%"
          ] })
        ] }, fact)) })
      ] })
    ] });
  }
  if (variant === "bubble")
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-bubble", children: [
      header,
      /* @__PURE__ */ jsxs28("div", { className: "capital-axis", children: [
        /* @__PURE__ */ jsx28("span", { className: "axis-y", children: "\u4EF7\u503C / \u4F30\u503C" }),
        facts.map((fact, index) => /* @__PURE__ */ jsxs28("i", { className: `capital-bubble-dot dot-${index}`, style: { width: `${3.8 + values[index] / max * 4.2}cqw`, height: `${3.8 + values[index] / max * 4.2}cqw` }, children: [
          /* @__PURE__ */ jsx28("b", { children: fact.split(/\s+/)[0] }),
          /* @__PURE__ */ jsx28("small", { children: fact.match(/\d+(?:\.\d+)?/)?.[0] })
        ] }, fact)),
        /* @__PURE__ */ jsx28("span", { className: "axis-x", children: "\u6536\u5165 / \u5151\u73B0\u80FD\u529B \u2192" })
      ] })
    ] });
  if (variant === "rank" || variant === "pareto")
    return /* @__PURE__ */ jsxs28("div", { className: `motion capital-page capital-bars capital-${variant}`, children: [
      header,
      /* @__PURE__ */ jsx28("div", { className: "capital-bar-list", children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("strong", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("span", { children: fact.replace(/\d+(?:\.\d+)?%?/, "").trim() }),
        /* @__PURE__ */ jsx28("i", { children: /* @__PURE__ */ jsx28("b", { style: { width: `${values[index] / max * 100}%` } }) }),
        /* @__PURE__ */ jsx28("em", { children: fact.match(/\d+(?:\.\d+)?%?/)?.[0] })
      ] }, fact)) }),
      variant === "pareto" && /* @__PURE__ */ jsx28("svg", { viewBox: "0 0 100 36", preserveAspectRatio: "none", children: /* @__PURE__ */ jsx28("polyline", { points: "4,27 34,19 64,11 96,5" }) })
    ] });
  if (variant === "flow")
    return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-flow", children: [
      header,
      /* @__PURE__ */ jsxs28("div", { className: "capital-flow-grid", children: [
        /* @__PURE__ */ jsxs28("article", { children: [
          settings.metric && /* @__PURE__ */ jsx28("b", { children: settings.metric }),
          settings.metricLabel && /* @__PURE__ */ jsx28("span", { children: settings.metricLabel })
        ] }),
        /* @__PURE__ */ jsx28("div", { children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("span", { style: { "--flow-index": index }, children: [
          /* @__PURE__ */ jsx28("i", {}),
          fact,
          /* @__PURE__ */ jsx28("i", {})
        ] }, fact)) }),
        /* @__PURE__ */ jsx28("article", { children: settings.prefix && /* @__PURE__ */ jsx28("b", { children: settings.prefix }) })
      ] })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion capital-page capital-risk", children: [
    header,
    /* @__PURE__ */ jsx28("div", { className: "capital-risk-grid", children: facts.map((fact, index) => /* @__PURE__ */ jsxs28("article", { children: [
      /* @__PURE__ */ jsxs28("small", { children: [
        "0",
        index + 1
      ] }),
      /* @__PURE__ */ jsx28("b", { children: fact })
    ] }, fact)) })
  ] });
}
function TitleHero({ settings }) {
  return /* @__PURE__ */ jsxs28("div", { className: "motion title-hero", children: [
    /* @__PURE__ */ jsx28("small", { children: "TOPIC / HIGHLIGHT" }),
    /* @__PURE__ */ jsx28("h2", { children: settings.title }),
    /* @__PURE__ */ jsx28("p", { children: settings.subtitle }),
    /* @__PURE__ */ jsx28("div", { children: settings.items.slice(0, 3).map((item, i) => /* @__PURE__ */ jsx28("span", { className: `accent-${i}`, children: item }, item)) })
  ] });
}
function MetricFocus({ settings }) {
  const metricIsCopy = Array.from(settings.metric.trim()).length > 4 || !/\d/.test(settings.metric);
  return /* @__PURE__ */ jsxs28("div", { className: "motion metric-focus", children: [
    /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-left", children: [
      /* @__PURE__ */ jsx28("div", { className: "eyebrow", children: "METRIC / VALUE" }),
      /* @__PURE__ */ jsx28("div", { className: "metric-rule" }),
      /* @__PURE__ */ jsxs28("div", { className: "metric-lockup", children: [
        /* @__PURE__ */ jsx28("span", { className: `metric-number ${metricIsCopy ? "metric-number-copy" : ""}`, children: settings.metric }),
        /* @__PURE__ */ jsx28("span", { className: "metric-prefix", children: settings.prefix })
      ] })
    ] }),
    /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-right metric-copy-zone", children: [
      /* @__PURE__ */ jsx28("span", { className: "metric-kicker", children: "\u6838\u5FC3\u7ED3\u679C" }),
      /* @__PURE__ */ jsx28("div", { className: "metric-label", children: settings.metricLabel }),
      /* @__PURE__ */ jsx28("div", { className: "metric-index", children: "SRT \xB7 TIME MATCHED" })
    ] })
  ] });
}
function CompareSolit({ settings }) {
  const isDualRole = /ChatGPT/i.test(settings.leftTitle) && /Codex/i.test(settings.rightTitle);
  const blocks = [
    { title: settings.leftTitle, body: settings.leftBody, index: isDualRole ? "CHATGPT" : "A" },
    { title: settings.rightTitle, body: settings.rightBody, index: isDualRole ? "CODEX" : "B" }
  ];
  return /* @__PURE__ */ jsxs28("div", { className: `motion compare-solit${settings.author === "virtual-society" ? " virtual-society-compare" : ""}`, children: [
    /* @__PURE__ */ jsx28("div", { className: "compare-grid", children: blocks.map((block, index) => /* @__PURE__ */ jsxs28("section", { className: `compare-card compare-card-${index} ${densityClass(block.title, block.body)}`, children: [
      /* @__PURE__ */ jsx28("div", { className: "card-index", children: block.index }),
      /* @__PURE__ */ jsxs28("div", { className: "card-copy", children: [
        /* @__PURE__ */ jsx28("h2", { children: block.title }),
        /* @__PURE__ */ jsx28("p", { children: block.body })
      ] }),
      /* @__PURE__ */ jsx28("div", { className: "card-line" })
    ] }, block.index)) }),
    /* @__PURE__ */ jsx28("div", { className: "compare-caption", children: isDualRole ? "\u53CC\u4EE3\u7406 \xB7 \u5E73\u884C\u804C\u8D23" : "A / B \xB7 \u4E24\u79CD\u8DEF\u5F84" })
  ] });
}
function QuoteoLockup({ settings }) {
  const inhotAudienceCopy = settings.author === "inhot-ecommerce";
  return /* @__PURE__ */ jsxs28("div", { className: "motion quote-lockup", children: [
    /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-left quote-primary", children: [
      /* @__PURE__ */ jsx28("div", { className: "quote-mark", children: "\u201C" }),
      /* @__PURE__ */ jsx28("div", { className: "quote-copy", children: settings.quote })
    ] }),
    /* @__PURE__ */ jsxs28("div", { className: "side-zone side-zone-right quote-secondary", children: [
      /* @__PURE__ */ jsx28("span", { className: "quote-number", children: settings.author === "ai-answer" ? "" : inhotAudienceCopy ? settings.title : "KEY" }),
      /* @__PURE__ */ jsx28("div", { className: "quote-rule" }),
      /* @__PURE__ */ jsx28("b", { children: inhotAudienceCopy || settings.author === "ai-answer" ? settings.subtitle : /浏览器|实例|资源|架构/.test(settings.sourceText) ? "\u67B6\u6784\u7ED3\u8BBA" : "\u6838\u5FC3\u7ED3\u8BBA" }),
      !inhotAudienceCopy && settings.author !== "ai-answer" && /* @__PURE__ */ jsx28("span", { children: settings.author })
    ] })
  ] });
}
function phraseParts(text) {
  const clean = text.replace(/[，。；、：,;:！？!?]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean)
    return ["\u7B49\u5F85", "\u5B57\u5E55", "\u5185\u5BB9"];
  const requestedParts = Math.min(6, Math.max(1, Math.ceil(Array.from(clean).length / 4)));
  return splitTextWithoutOrphans(clean, requestedParts);
}
function KineticEditorial({ settings }) {
  const words = phraseParts(settings.quote);
  const copyLength = Array.from(settings.quote.replace(/\s+/g, "")).length;
  const lengthClass = copyLength > 16 ? " editorial-copy-long" : copyLength > 10 ? " editorial-copy-medium" : "";
  return /* @__PURE__ */ jsxs28("div", { className: "motion kinetic-editorial", children: [
    /* @__PURE__ */ jsx28("div", { className: `editorial-copy${lengthClass}`, children: words.map((word, index) => /* @__PURE__ */ jsx28("span", { className: index === words.length - 1 || index === 1 ? "accent-word" : "", style: { "--word-index": index }, children: word }, `${word}-${index}`)) }),
    /* @__PURE__ */ jsx28("small", { children: "EDITORIAL / WORD BUILD" })
  ] });
}
function PunctuationLockup({ settings }) {
  const isQuestion = /为什么|怎么|吗|[？?]/.test(settings.quote);
  const mark = isQuestion ? "\uFF1F" : "\uFF01";
  const clean = settings.quote.replace(/[？?!！]/g, "");
  const pivot = settings.author === "donskill" && clean.includes("\uFF0C") ? clean.indexOf("\uFF0C") + 1 : Math.max(2, Math.ceil(clean.length * 0.46));
  return /* @__PURE__ */ jsxs28("div", { className: "motion punctuation-lockup", children: [
    /* @__PURE__ */ jsxs28("div", { children: [
      /* @__PURE__ */ jsx28("span", { children: clean.slice(0, pivot) }),
      /* @__PURE__ */ jsx28("b", { children: clean.slice(pivot) })
    ] }),
    /* @__PURE__ */ jsx28("i", { children: mark }),
    /* @__PURE__ */ jsx28("small", { children: isQuestion ? "QUESTION / HOOK" : "ACTION / LOCKUP" })
  ] });
}
function importedPageKind(id) {
  if (["quote", "editorial", "ribbon", "punctuation", "hero", "viewpoints"].includes(id))
    return "statement";
  if (["flow3", "apps", "tags", "suspended", "featureDeck"].includes(id))
    return "pillars";
  if (["metric", "threeMetricCards", "chart", "dashboard", "dashboardRank", "dashboardKpi", "capitalBubble", "capitalDonut", "capitalRank", "capitalFlow", "capitalPareto", "capitalRisk", "capitalWaterfall", "capitalBullet"].includes(id))
    return "stat";
  if (["flow4", "deck", "tasks", "actions", "processor"].includes(id))
    return "timeline";
  if (id === "compare")
    return "compare";
  if (["evidence", "workspace", "stage", "perspectiveMedia"].includes(id))
    return "evidence";
  if (id === "document" || id === "hub")
    return "plan";
  return "quote";
}
function importedCopy(settings) {
  const items = settings.items.filter(Boolean).slice(0, 4);
  return {
    title: settings.title || settings.metricLabel || settings.quote,
    statement: settings.quote || settings.sourceText || settings.title,
    subtitle: settings.subtitle || settings.author,
    items: items.length ? items : [settings.leftTitle, settings.rightTitle, settings.metricLabel].filter(Boolean)
  };
}
function PeoplesPlatformPage({ id, settings, media }) {
  const kind = importedPageKind(id);
  const copy = importedCopy(settings);
  if (kind === "statement" || kind === "quote")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-manifesto", children: [
      /* @__PURE__ */ jsx28("span", { className: "pp-stamp", children: "BIG IDEA" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
      /* @__PURE__ */ jsx28("i", { children: "say it like you mean it" })
    ] });
  if (kind === "pillars")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-pillars", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("b", { children: "THREE" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("em", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        /* @__PURE__ */ jsx28("span", { children: "\u2192" })
      ] }, item)) })
    ] });
  if (kind === "stat")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-stat", children: [
      /* @__PURE__ */ jsx28("span", { children: "THE NUMBER" }),
      /* @__PURE__ */ jsx28("strong", { children: settings.metric }),
      /* @__PURE__ */ jsx28("h2", { children: settings.metricLabel || copy.title }),
      /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
    ] });
  if (kind === "timeline")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-roadmap", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "ROADMAP" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("h3", { children: item })
      ] }, item)) })
    ] });
  if (kind === "compare")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-compare", children: [
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("span", { children: "NOW" }),
          /* @__PURE__ */ jsx28("h3", { children: settings.leftTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.leftBody })
        ] }),
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("span", { children: "NEXT" }),
          /* @__PURE__ */ jsx28("h3", { children: settings.rightTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.rightBody })
        ] })
      ] })
    ] });
  if (kind === "evidence")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-evidence", children: [
      /* @__PURE__ */ jsx28("section", { children: media ? /* @__PURE__ */ jsx28("img", { src: media.url }) : /* @__PURE__ */ jsxs28("b", { children: [
        "VISUAL",
        /* @__PURE__ */ jsx28("br", {}),
        "PROOF"
      ] }) }),
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "SEE IT" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
      ] })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page pp-page pp-plan", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("span", { children: "THE FULL PLAN" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title })
    ] }),
    /* @__PURE__ */ jsx28("div", { children: copy.items.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
      /* @__PURE__ */ jsx28("b", { children: index + 1 }),
      /* @__PURE__ */ jsx28("p", { children: item })
    ] }, item)) })
  ] });
}
function BlockFramePage({ id, settings, media }) {
  const kind = importedPageKind(id);
  const copy = importedCopy(settings);
  if (id === "hero")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-hero", children: [
      /* @__PURE__ */ jsx28("span", { children: "NEW CHAPTER" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
      /* @__PURE__ */ jsx28("i", { children: "\u2726" }),
      /* @__PURE__ */ jsx28("b", { children: copy.subtitle })
    ] });
  if (id === "apps")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-deliver", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "WHAT WE DELIVER" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("h3", { children: item })
      ] }, item)) })
    ] });
  if (id === "chart")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-growth", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "GROWTH METRICS" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("i", { style: { height: `${35 + index * 16}%` } }),
        /* @__PURE__ */ jsx28("b", { children: item })
      ] }, item)) })
    ] });
  if (id === "tasks")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-timeline", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "PROJECT TIMELINE" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("h3", { children: item })
      ] }, item)) })
    ] });
  if (kind === "statement" || kind === "quote")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-quote", children: [
      /* @__PURE__ */ jsx28("span", { children: "KEY TAKEAWAY" }),
      /* @__PURE__ */ jsx28("blockquote", { children: copy.statement }),
      /* @__PURE__ */ jsx28("b", { children: copy.subtitle }),
      /* @__PURE__ */ jsx28("i", { children: "\u2726" })
    ] });
  if (kind === "pillars")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-features", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "FEATURE SET" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("b", { children: String.fromCharCode(65 + index) }),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        /* @__PURE__ */ jsx28("i", {})
      ] }, item)) })
    ] });
  if (kind === "stat")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-stats", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "IMPACT AT A GLANCE" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: [settings.metric, ...copy.items].slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("strong", { children: item }),
        /* @__PURE__ */ jsx28("p", { children: index ? "KEY SIGNAL" : settings.metricLabel })
      ] }, `${item}-${index}`)) })
    ] });
  if (kind === "timeline")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-method", children: [
      /* @__PURE__ */ jsx28("span", { children: "HOW IT WORKS" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("h3", { children: item })
      ] }, item)) })
    ] });
  if (kind === "compare")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-compare", children: [
      /* @__PURE__ */ jsx28("span", { children: "BEFORE / AFTER" }),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("b", { children: "01" }),
          /* @__PURE__ */ jsx28("h2", { children: settings.leftTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.leftBody })
        ] }),
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("b", { children: "02" }),
          /* @__PURE__ */ jsx28("h2", { children: settings.rightTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.rightBody })
        ] })
      ] })
    ] });
  if (kind === "evidence")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-evidence", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "SHOW THE WORK" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
      ] }),
      /* @__PURE__ */ jsx28("section", { children: media ? /* @__PURE__ */ jsx28("img", { src: media.url }) : /* @__PURE__ */ jsxs28("b", { children: [
        "DROP",
        /* @__PURE__ */ jsx28("br", {}),
        "MEDIA",
        /* @__PURE__ */ jsx28("br", {}),
        "HERE"
      ] }) })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bf-page bf-deliver", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("span", { children: "WHAT WE DELIVER" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title })
    ] }),
    /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
      /* @__PURE__ */ jsxs28("b", { children: [
        "0",
        index + 1
      ] }),
      /* @__PURE__ */ jsx28("h3", { children: item })
    ] }, item)) })
  ] });
}
function BroadsidePage({ id, settings, media }) {
  const kind = importedPageKind(id);
  const copy = importedCopy(settings);
  const statementSignals = (copy.items.length ? copy.items : phraseParts(copy.statement)).filter(Boolean).slice(0, 3);
  const icons = ["idea", "scan", "memory", "system"];
  if (id === "prompt")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-prompt", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "PROMPT / \u63D0\u793A\u8BCD" }),
        /* @__PURE__ */ jsx28("b", { children: "DIRECTIVE 01" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "bs-prompt-grid", children: [
        /* @__PURE__ */ jsxs28("section", { children: [
          /* @__PURE__ */ jsx28("small", { children: "INPUT" }),
          /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
          /* @__PURE__ */ jsx28("div", { className: "bs-prompt-tags", children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("span", { children: [
            /* @__PURE__ */ jsx28(SemanticIcon, { type: icons[index] }),
            item
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs28("aside", { children: [
          /* @__PURE__ */ jsxs28("div", { className: "bs-scan-orbit", children: [
            /* @__PURE__ */ jsx28(SemanticIcon, { type: "scan" }),
            /* @__PURE__ */ jsx28("i", {}),
            /* @__PURE__ */ jsx28("i", {}),
            /* @__PURE__ */ jsx28("i", {})
          ] }),
          /* @__PURE__ */ jsx28("strong", { children: "\u7406\u89E3 \xB7 \u62C6\u89E3 \xB7 \u6267\u884C" }),
          /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
        ] })
      ] })
    ] });
  if (id === "hub" || id === "document")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-map", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "KNOWLEDGE MAP / \u5173\u7CFB\u56FE" }),
        /* @__PURE__ */ jsx28("b", { children: "CONNECTED" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "bs-map-stage", children: [
        /* @__PURE__ */ jsxs28("section", { children: [
          /* @__PURE__ */ jsx28(SemanticIcon, { type: id === "document" ? "memory" : "system" }),
          /* @__PURE__ */ jsx28("h2", { children: copy.title })
        ] }),
        copy.items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { className: `node-${index + 1}`, children: [
          /* @__PURE__ */ jsx28(SemanticIcon, { type: icons[index] }),
          /* @__PURE__ */ jsx28("span", { children: item })
        ] }, item)),
        /* @__PURE__ */ jsx28("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", children: /* @__PURE__ */ jsx28("path", { d: "M50 50 L18 24 M50 50 L82 24 M50 50 L18 78 M50 50 L82 78" }) })
      ] })
    ] });
  if (id === "flow3" || id === "flow4" || id === "actions")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-process", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "PROCESS / \u8DEF\u5F84" }),
        /* @__PURE__ */ jsx28("b", { children: id === "flow4" ? "04" : "03" })
      ] }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, id === "flow4" ? 4 : 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("span", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28(SemanticIcon, { type: icons[index] }),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        index < (id === "flow4" ? 3 : 2) && /* @__PURE__ */ jsx28("b", { children: "\u2192" })
      ] }, item)) })
    ] });
  if (id === "compare")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-compare bs-compare-rich", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "BEFORE / AFTER" }),
        /* @__PURE__ */ jsx28("b", { children: "SHIFT" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28(SemanticIcon, { type: "memory" }),
          /* @__PURE__ */ jsx28("h3", { children: settings.leftTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.leftBody })
        ] }),
        /* @__PURE__ */ jsx28("i", { children: "\u2192" }),
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28(SemanticIcon, { type: "idea" }),
          /* @__PURE__ */ jsx28("h3", { children: settings.rightTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.rightBody })
        ] })
      ] }),
      /* @__PURE__ */ jsx28("footer", { children: copy.items.slice(0, 3).map((item) => /* @__PURE__ */ jsxs28("span", { children: [
        "\u25C6 ",
        item
      ] }, item)) })
    ] });
  if (id === "viewpoints")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-viewpoint", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "POINT OF VIEW / \u89C2\u70B9" }),
        /* @__PURE__ */ jsx28("b", { children: "CHAPTER" })
      ] }),
      /* @__PURE__ */ jsxs28("main", { children: [
        /* @__PURE__ */ jsxs28("aside", { children: [
          /* @__PURE__ */ jsx28(SemanticIcon, { type: "idea" }),
          /* @__PURE__ */ jsx28("strong", { children: settings.metric })
        ] }),
        /* @__PURE__ */ jsxs28("section", { children: [
          /* @__PURE__ */ jsx28("h2", { children: settings.title }),
          /* @__PURE__ */ jsx28("div", { children: statementSignals.map((item, index) => /* @__PURE__ */ jsxs28("span", { children: [
            /* @__PURE__ */ jsx28(SemanticIcon, { type: icons[index + 1] }),
            item
          ] }, `${item}-${index}`)) })
        ] })
      ] })
    ] });
  if (id === "metric")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-metric-rich", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "KEY OUTPUT / \u7ED3\u679C" }),
        /* @__PURE__ */ jsx28("b", { children: "MEASURED" })
      ] }),
      /* @__PURE__ */ jsxs28("main", { children: [
        /* @__PURE__ */ jsxs28("section", { children: [
          /* @__PURE__ */ jsxs28("div", { className: "bs-metric-ring", children: [
            /* @__PURE__ */ jsx28("strong", { children: settings.metric }),
            /* @__PURE__ */ jsx28("i", {}),
            /* @__PURE__ */ jsx28("i", {}),
            /* @__PURE__ */ jsx28("i", {})
          ] }),
          /* @__PURE__ */ jsx28("h2", { children: settings.metricLabel })
        ] }),
        /* @__PURE__ */ jsx28("aside", { children: statementSignals.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsxs28("b", { children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx28(SemanticIcon, { type: icons[index] }),
          /* @__PURE__ */ jsx28("span", { children: item })
        ] }, `${item}-${index}`)) })
      ] })
    ] });
  if (id === "hero")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-chapter", children: [
      /* @__PURE__ */ jsx28("span", { children: "01 / CHAPTER" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
      /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
    ] });
  if (id === "suspended")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-fadelist", children: [
      /* @__PURE__ */ jsx28("span", { children: "STAGES / \u9636\u6BB5" }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsx28("h2", { style: { opacity: 1 - index * 0.34 }, children: item }, item)) })
    ] });
  if (id === "chart")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-chart", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "THE SHIFT / \u8D8B\u52BF" }),
        /* @__PURE__ */ jsx28("b", { children: "10" })
      ] }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("i", { style: { height: `${30 + index * 17}%` } }),
        /* @__PURE__ */ jsx28("span", { children: item })
      ] }, item)) })
    ] });
  if (kind === "statement")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-statement", children: [
      /* @__PURE__ */ jsxs28("div", { className: "bs-statement-head", children: [
        /* @__PURE__ */ jsx28("span", { children: "THE STATEMENT / \u89C2\u70B9" }),
        /* @__PURE__ */ jsx28("b", { children: "EDITORIAL 01 \u2197" })
      ] }),
      /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
      /* @__PURE__ */ jsx28("div", { className: "bs-statement-signals", children: statementSignals.map((item, index) => /* @__PURE__ */ jsxs28("p", { children: [
        /* @__PURE__ */ jsx28("i", { children: ["\u25C6", "\u2197", "\u2726"][index] }),
        /* @__PURE__ */ jsx28("span", { children: item })
      ] }, `${item}-${index}`)) }),
      /* @__PURE__ */ jsx28("i", { className: "bs-statement-rule" })
    ] });
  if (kind === "quote")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-quote", children: [
      /* @__PURE__ */ jsx28("b", { children: "\u201C" }),
      /* @__PURE__ */ jsx28("blockquote", { children: copy.statement }),
      /* @__PURE__ */ jsx28("span", { children: copy.subtitle })
    ] });
  if (kind === "pillars" || kind === "plan")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-list", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "FRAMEWORK / \u6846\u67B6" }),
        /* @__PURE__ */ jsx28("b", { children: "03" })
      ] }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("p", { children: [
        /* @__PURE__ */ jsx28("b", { children: String(index + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx28("i", { children: ["\u25C6", "\u2197", "\u2726"][index] }),
        /* @__PURE__ */ jsx28("span", { children: item })
      ] }, item)) })
    ] });
  if (kind === "stat")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-stats", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "THE NUMBERS / \u6570\u636E" }),
        /* @__PURE__ */ jsx28("b", { children: "05" })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: [settings.metric, ...copy.items].slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("strong", { children: item }),
        /* @__PURE__ */ jsx28("p", { children: index ? "signal" : settings.metricLabel })
      ] }, `${item}-${index}`)) })
    ] });
  if (kind === "timeline")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-timeline", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "STAGES / \u9636\u6BB5" }),
        /* @__PURE__ */ jsx28("b", { children: "08" })
      ] }),
      /* @__PURE__ */ jsx28("div", { children: copy.items.map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("h3", { children: item })
      ] }, item)) })
    ] });
  if (kind === "compare")
    return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-compare", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("span", { children: "BEFORE / AFTER" }),
        /* @__PURE__ */ jsx28("b", { children: "09" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("h3", { children: settings.leftTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.leftBody })
        ] }),
        /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsx28("h3", { children: settings.rightTitle }),
          /* @__PURE__ */ jsx28("p", { children: settings.rightBody })
        ] })
      ] })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion imported-page bs-page bs-split", children: [
    /* @__PURE__ */ jsx28("section", { children: media ? /* @__PURE__ */ jsx28("img", { src: media.url }) : /* @__PURE__ */ jsx28("span", { children: "IMAGE SUPPORT" }) }),
    /* @__PURE__ */ jsxs28("aside", { children: [
      /* @__PURE__ */ jsx28("span", { children: "VISUAL PROOF / \u8BC1\u636E" }),
      /* @__PURE__ */ jsx28("h2", { children: copy.title }),
      /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
    ] })
  ] });
}
function SemanticIcon({ type }) {
  if (type === "scan")
    return /* @__PURE__ */ jsxs28("svg", { className: "semantic-icon", viewBox: "0 0 48 48", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx28("circle", { cx: "21", cy: "21", r: "11" }),
      /* @__PURE__ */ jsx28("path", { d: "m29 29 10 10M8 15V8h7M33 8h7v7M8 33v7h7" })
    ] });
  if (type === "memory")
    return /* @__PURE__ */ jsxs28("svg", { className: "semantic-icon", viewBox: "0 0 48 48", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx28("path", { d: "M12 8h21a5 5 0 0 1 5 5v27H17a5 5 0 0 1-5-5z" }),
      /* @__PURE__ */ jsx28("path", { d: "M12 34a6 6 0 0 1 6-6h20M20 16h11M20 22h8" })
    ] });
  if (type === "system")
    return /* @__PURE__ */ jsxs28("svg", { className: "semantic-icon", viewBox: "0 0 48 48", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx28("circle", { cx: "24", cy: "24", r: "6" }),
      /* @__PURE__ */ jsx28("circle", { cx: "9", cy: "13", r: "4" }),
      /* @__PURE__ */ jsx28("circle", { cx: "39", cy: "13", r: "4" }),
      /* @__PURE__ */ jsx28("circle", { cx: "9", cy: "37", r: "4" }),
      /* @__PURE__ */ jsx28("circle", { cx: "39", cy: "37", r: "4" }),
      /* @__PURE__ */ jsx28("path", { d: "m13 15 6 5m10 0 6-5M13 35l6-5m10 0 6 5" })
    ] });
  return /* @__PURE__ */ jsxs28("svg", { className: "semantic-icon", viewBox: "0 0 48 48", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx28("path", { d: "M16 31c-4-3-6-7-5-12 1-7 7-12 14-11 7 0 12 6 12 13 0 4-2 8-6 10l-2 5H18z" }),
    /* @__PURE__ */ jsx28("path", { d: "M18 40h12M24 3V0M8 8 4 4M40 8l4-4" })
  ] });
}
function ImportedTemplateRenderer({ style, id, settings, media }) {
  if (style === "peoplesPlatform")
    return /* @__PURE__ */ jsx28(PeoplesPlatformPage, { id, settings, media });
  if (style === "blockFrame")
    return /* @__PURE__ */ jsx28(BlockFramePage, { id, settings, media });
  return /* @__PURE__ */ jsx28(BroadsidePage, { id, settings, media });
}
function OriginalZinePage({ id, settings }) {
  const copy = importedCopy(settings);
  const items = copy.items.length ? copy.items : [copy.title, copy.subtitle];
  if (id === "zineCover")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-cover", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("b", { children: "INDIE BOOKSTORE" }),
        /* @__PURE__ */ jsx28("span", { children: "ISSUE / 01" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "zorig-cover-title", children: [
        /* @__PURE__ */ jsx28("i", { children: copy.title }),
        /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
        /* @__PURE__ */ jsx28("strong", { children: copy.subtitle })
      ] }),
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "FIELD GUIDE" }),
        /* @__PURE__ */ jsx28("p", { children: items[0] }),
        /* @__PURE__ */ jsx28("p", { children: items[1] })
      ] })
    ] });
  if (id === "zineWhat")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-what", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("b", { children: "ZINE" }),
        /* @__PURE__ */ jsxs28("span", { children: [
          "SELF",
          /* @__PURE__ */ jsx28("br", {}),
          "PUBLISH",
          /* @__PURE__ */ jsx28("br", {}),
          "NOW"
        ] })
      ] }),
      /* @__PURE__ */ jsxs28("main", { children: [
        /* @__PURE__ */ jsx28("small", { children: "DEFINITION / \u5B9A\u4E49" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title }),
        /* @__PURE__ */ jsx28("h3", { children: copy.statement }),
        /* @__PURE__ */ jsx28("div", { children: items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
          /* @__PURE__ */ jsxs28("b", { children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx28("p", { children: item })
        ] }, item)) })
      ] })
    ] });
  if (id === "zineHistory")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-history", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h2", { children: copy.title }),
          /* @__PURE__ */ jsx28("span", { children: "HISTORY / TIMELINE" })
        ] })
      ] }),
      /* @__PURE__ */ jsx28("div", { className: "zorig-history-line" }),
      /* @__PURE__ */ jsx28("main", { children: items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("b", { children: 1960 + index * 20 }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        /* @__PURE__ */ jsx28("p", { children: index % 2 ? "DIY CULTURE" : "INDEPENDENT VOICE" })
      ] }, item)) })
    ] });
  if (id === "zineProcess")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-process", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h2", { children: copy.title }),
          /* @__PURE__ */ jsx28("span", { children: "RISOGRAPH / PROCESS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "zorig-process-band", children: [
        /* @__PURE__ */ jsx28("b", { children: "PRINT" }),
        /* @__PURE__ */ jsx28("span", { children: copy.statement })
      ] }),
      /* @__PURE__ */ jsx28("main", { children: items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("header", { children: [
          /* @__PURE__ */ jsxs28("b", { children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx28("span", { children: "STEP" })
        ] }),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        /* @__PURE__ */ jsx28("p", { children: index % 2 ? "INK + PAPER" : "LAYER BY LAYER" })
      ] }, item)) })
    ] });
  if (id === "zineContentTypes")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-types", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h2", { children: copy.title }),
          /* @__PURE__ */ jsx28("span", { children: "CONTENT / TYPES" })
        ] })
      ] }),
      /* @__PURE__ */ jsx28("main", { children: items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("h3", { children: item }),
        /* @__PURE__ */ jsx28("span", { children: ["ESSAY / \u968F\u7B14", "PHOTO / \u6444\u5F71", "COMIC / \u6F2B\u753B"][index] }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
      ] }, item)) })
    ] });
  if (id === "zineCities")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-cities", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h2", { children: copy.title }),
          /* @__PURE__ */ jsx28("span", { children: "THREE CITIES / \u4E09\u5EA7\u57CE\u5E02" })
        ] })
      ] }),
      /* @__PURE__ */ jsx28("div", { className: "zorig-cities-band", children: copy.statement }),
      /* @__PURE__ */ jsx28("main", { children: items.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("header", { children: [
          /* @__PURE__ */ jsx28("h3", { children: item }),
          /* @__PURE__ */ jsxs28("span", { children: [
            "0",
            index + 1
          ] })
        ] }),
        /* @__PURE__ */ jsx28("b", { children: ["TOKYO", "BERLIN", "SHANGHAI"][index] }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
      ] }, item)) })
    ] });
  if (id === "zineBrowse")
    return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-browse", children: [
      /* @__PURE__ */ jsxs28("header", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h2", { children: copy.title }),
          /* @__PURE__ */ jsx28("span", { children: "HOW TO / GUIDE" })
        ] })
      ] }),
      /* @__PURE__ */ jsx28("main", { children: items.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("h3", { children: item }),
          /* @__PURE__ */ jsx28("p", { children: index % 2 ? "TAKE YOUR TIME" : "FOLLOW YOUR CURIOSITY" })
        ] })
      ] }, item)) })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion zorig zorig-outro", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("b", { children: "INDIE BOOKSTORE" }),
      /* @__PURE__ */ jsx28("span", { children: "END / 18" })
    ] }),
    /* @__PURE__ */ jsxs28("main", { children: [
      /* @__PURE__ */ jsx28("i", { children: copy.title }),
      /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
      /* @__PURE__ */ jsx28("strong", { children: copy.subtitle })
    ] }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("b", { children: "KEEP READING." }),
      /* @__PURE__ */ jsx28("span", { children: "MAKE YOUR OWN." })
    ] })
  ] });
}
function TalkingHeadDerivative({ id, settings }) {
  const copy = importedCopy(settings);
  const items = copy.items.slice(0, 4);
  if (id === "zineSideQuote")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-zine th-zine-quote", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "EDITOR'S NOTE" }),
        /* @__PURE__ */ jsx28("b", { children: "\u201C" })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
        /* @__PURE__ */ jsx28("i", { children: copy.subtitle })
      ] })
    ] });
  if (id === "zineSideNotes")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-zine th-zine-notes", children: [
      /* @__PURE__ */ jsx28("aside", { children: items.filter((_, i) => i % 2 === 0).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) }),
      /* @__PURE__ */ jsx28("section", { children: items.filter((_, i) => i % 2 === 1).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 3
        ] }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) })
    ] });
  if (id === "zineSideProof")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-zine th-zine-proof", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "PROOF / \u8BC1\u636E" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("b", { children: "\u2726" }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle }),
        /* @__PURE__ */ jsx28("i", { children: "ISSUE 01" })
      ] })
    ] });
  if (id === "ppSideManifesto")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-pp th-pp-manifesto", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "BIG IDEA" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.statement })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("b", { children: "\u2192" }),
        /* @__PURE__ */ jsxs28("i", { children: [
          "say it",
          /* @__PURE__ */ jsx28("br", {}),
          "out loud"
        ] })
      ] })
    ] });
  if (id === "ppSidePriorities")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-pp th-pp-priorities", children: [
      /* @__PURE__ */ jsx28("aside", { children: items.slice(0, 2).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) }),
      /* @__PURE__ */ jsx28("section", { children: items.slice(2, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 3
        ] }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) })
    ] });
  if (id === "ppSideCallout")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-pp th-pp-callout", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("b", { children: "LISTEN" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.title })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("span", { children: "THE POINT" }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle || copy.statement })
      ] })
    ] });
  if (id === "bfSideQuote")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bf th-bf-quote", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "KEY TAKEAWAY" }),
        /* @__PURE__ */ jsx28("b", { children: "\u201C" })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("h2", { children: copy.statement }),
        /* @__PURE__ */ jsx28("i", { children: "\u2726" })
      ] })
    ] });
  if (id === "bfSideFeatures")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bf th-bf-features", children: [
      /* @__PURE__ */ jsx28("aside", { children: items.filter((_, i) => i % 2 === 0).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("b", { children: String.fromCharCode(65 + index) }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) }),
      /* @__PURE__ */ jsx28("section", { children: items.filter((_, i) => i % 2 === 1).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsx28("b", { children: String.fromCharCode(67 + index) }),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) })
    ] });
  if (id === "bfSideSteps")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bf th-bf-steps", children: [
      /* @__PURE__ */ jsx28("aside", { children: items.slice(0, 2).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) }),
      /* @__PURE__ */ jsx28("section", { children: items.slice(2, 4).map((item, index) => /* @__PURE__ */ jsxs28("article", { children: [
        /* @__PURE__ */ jsxs28("b", { children: [
          "0",
          index + 3
        ] }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("p", { children: item })
      ] }, item)) })
    ] });
  if (id === "bsSideStatement")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bs th-bs-statement", children: [
      /* @__PURE__ */ jsxs28("aside", { children: [
        /* @__PURE__ */ jsx28("span", { children: "STATEMENT / \u89C2\u70B9" }),
        /* @__PURE__ */ jsx28("h2", { children: copy.statement })
      ] }),
      /* @__PURE__ */ jsxs28("section", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("b", { children: "01" }),
        /* @__PURE__ */ jsx28("p", { children: copy.subtitle })
      ] })
    ] });
  if (id === "bsSideList")
    return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bs th-bs-list", children: [
      /* @__PURE__ */ jsx28("aside", { children: items.slice(0, 2).map((item) => /* @__PURE__ */ jsxs28("p", { children: [
        /* @__PURE__ */ jsx28("b", { children: "/" }),
        item
      ] }, item)) }),
      /* @__PURE__ */ jsx28("section", { children: items.slice(2, 4).map((item) => /* @__PURE__ */ jsxs28("p", { children: [
        /* @__PURE__ */ jsx28("b", { children: "/" }),
        item
      ] }, item)) })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion th-layout th-bs th-bs-quote", children: [
    /* @__PURE__ */ jsx28("aside", { children: /* @__PURE__ */ jsx28("b", { children: "\u201C" }) }),
    /* @__PURE__ */ jsxs28("section", { children: [
      /* @__PURE__ */ jsx28("blockquote", { children: copy.statement }),
      /* @__PURE__ */ jsx28("span", { children: copy.subtitle })
    ] })
  ] });
}
function VideoWorkflowPipeline({ settings }) {
  const stages = [
    ...settings.items,
    ...settings.author === "codex-money" ? [settings.leftTitle] : []
  ].map((item) => item.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxs28("div", { className: "motion video-workflow-pipeline", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsxs28("small", { children: [
          "ADAPTIVE WORKFLOW / ",
          String(stages.length).padStart(2, "0"),
          " STEPS"
        ] }),
        /* @__PURE__ */ jsx28("h2", { children: settings.title })
      ] }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx28("main", { style: { "--pipeline-count": Math.max(1, stages.length) }, children: stages.map((stage, stageIndex) => /* @__PURE__ */ jsxs28("article", { style: { "--stage-index": stageIndex }, children: [
      /* @__PURE__ */ jsx28("b", { children: String(stageIndex + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsx28("strong", { children: stage }),
        /* @__PURE__ */ jsxs28("span", { children: [
          "STEP ",
          String(stageIndex + 1).padStart(2, "0")
        ] })
      ] })
    ] }, `${stage}-${stageIndex}`)) }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("b", { children: "START" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsxs28("span", { children: [
        "\u53EA\u5448\u73B0\u5F53\u524D\u6587\u6848\u660E\u786E\u63D0\u4F9B\u7684 ",
        stages.length,
        " \u4E2A\u6B65\u9AA4"
      ] }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("b", { children: "RESULT" })
    ] })
  ] });
}
function P0BackdropHeadline({ settings, progress }) {
  const enter = easeOutCubic(progress / 0.36);
  const accent = easeOutCubic((progress - 0.16) / 0.34);
  const headline = settings.title === "\u7B49\u5F85\u5B57\u5E55\u5185\u5BB9" ? "\u81EA\u52A8\u526A\u8F91" : settings.title.trim();
  const headlineLength = Array.from(headline).length;
  const headlineSize = Math.max(5.2, 9.1 - Math.max(0, headlineLength - 8) * 0.72);
  return /* @__PURE__ */ jsxs28("div", { className: "motion p0-native p0-backdrop-headline", children: [
    /* @__PURE__ */ jsx28("div", { className: "p0-backdrop-word", style: { opacity: enter, fontSize: `${headlineSize}cqw`, transform: `translateX(${(1 - enter) * -7}cqw) scale(${0.92 + enter * 0.08})` }, children: headline }),
    /* @__PURE__ */ jsx28("div", { className: "p0-person-void", "aria-label": "\u771F\u4EBA\u5B89\u5168\u533A" }),
    /* @__PURE__ */ jsxs28("header", { style: { opacity: accent, transform: `translateY(${(1 - accent) * 1.2}cqw)` }, children: [
      /* @__PURE__ */ jsx28("small", { children: "KEY MESSAGE / \u5173\u952E\u5224\u65AD" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("b", { children: settings.subtitle })
    ] })
  ] });
}
function P0AdaptiveSteps({ settings, progress }) {
  const steps = settings.items.filter(Boolean).slice(0, 4);
  return /* @__PURE__ */ jsxs28("div", { className: "motion p0-native p0-adaptive-steps", style: { "--p0-cyan": settings.panelAccentColor }, children: [
    /* @__PURE__ */ jsx28("div", { className: "p0-person-void", "aria-label": "\u771F\u4EBA\u5B89\u5168\u533A" }),
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("small", { children: "PROCESS / STEP DETAIL" }),
      /* @__PURE__ */ jsx28("h2", { children: settings.title === "\u7B49\u5F85\u5B57\u5E55\u5185\u5BB9" ? "\u64CD\u4F5C\u6B65\u9AA4" : settings.title }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx28("section", { children: steps.map((item, index) => {
      const reveal = easeOutCubic((progress - (0.08 + index * 0.1)) / 0.28);
      const active = progress >= 0.18 + index * 0.13;
      return /* @__PURE__ */ jsxs28("article", { className: active ? "active" : "", style: { opacity: reveal, transform: `translateX(${(1 - reveal) * 3.4}cqw)` }, children: [
        /* @__PURE__ */ jsx28("span", { children: String(index + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx28("i", { children: /* @__PURE__ */ jsx28("b", {}) }),
        /* @__PURE__ */ jsx28("strong", { children: item })
      ] }, `${item}-${index}`);
    }) }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      steps.length,
      " STEPS \xB7 FROM CURRENT PROJECT"
    ] })
  ] });
}
function P0MetricGrowth({ settings, progress }) {
  const reveal = easeOutCubic(progress / 0.42);
  const bars = [0.32, 0.55, 0.72, 1];
  const metric = settings.metric === "\u2014" ? "100" : settings.metric;
  const label = settings.metricLabel === "\u7B49\u5F85\u5339\u914D\u5F53\u524D\u5B57\u5E55" ? "\u5904\u7406\u6548\u7387" : settings.metricLabel;
  const isTokenPriceShock = settings.author === "agent-plus-plus" && /1\s*亿/.test(metric) && /2\s*元/.test(label);
  if (isTokenPriceShock)
    return /* @__PURE__ */ jsxs28("div", { className: "motion p0-native p0-metric-growth p0-token-price-shock", children: [
      /* @__PURE__ */ jsx28("div", { className: "p0-person-void", "aria-label": "\u771F\u4EBA\u5B89\u5168\u533A" }),
      /* @__PURE__ */ jsx28("div", { className: "p0-price-panel-bg p0-price-panel-left", style: { opacity: reveal, transform: `translateX(${(1 - reveal) * -4}cqw)` } }),
      /* @__PURE__ */ jsx28("div", { className: "p0-price-panel-bg p0-price-panel-right", style: { opacity: reveal, transform: `translateX(${(1 - reveal) * 4}cqw)` } }),
      /* @__PURE__ */ jsxs28("section", { style: { opacity: reveal, transform: `translateX(${(1 - reveal) * -3}cqw) scale(${0.82 + reveal * 0.18})` }, children: [
        /* @__PURE__ */ jsx28("small", { children: "VOLUME / 100,000,000" }),
        /* @__PURE__ */ jsxs28("div", { children: [
          /* @__PURE__ */ jsx28("strong", { children: metric }),
          /* @__PURE__ */ jsx28("em", { children: "TOKEN" })
        ] }),
        /* @__PURE__ */ jsx28("h2", { children: "\u4E00\u4EBF\u7F13\u5B58\u547D\u4E2D\u8F93\u5165\u91CF" })
      ] }),
      /* @__PURE__ */ jsxs28("aside", { style: { opacity: reveal, transform: `translateX(${(1 - reveal) * 3}cqw) scale(${0.82 + reveal * 0.18})` }, children: [
        /* @__PURE__ */ jsx28("small", { children: "CACHE-HIT INPUT COST" }),
        /* @__PURE__ */ jsx28("strong", { children: "\u2248 \xA52" }),
        /* @__PURE__ */ jsx28("h2", { children: "\u622A\u81F3 2026-08-14" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "p0-price-vs", style: { opacity: reveal, transform: `translate(-50%,-50%) scale(${0.72 + reveal * 0.28})` }, children: [
        /* @__PURE__ */ jsx28("b", { children: "\u2248" }),
        /* @__PURE__ */ jsx28("span", { children: "\u6781\u4F4E\u6210\u672C\u53CD\u5DEE" })
      ] }),
      /* @__PURE__ */ jsxs28("div", { className: "p0-price-ratio", style: { opacity: reveal }, children: [
        /* @__PURE__ */ jsx28("span", { children: "100,000,000 TOKEN" }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("strong", { children: "\u2248 \xA52" })
      ] }),
      /* @__PURE__ */ jsxs28("footer", { children: [
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("span", { children: "DEEPSEEK CACHE-HIT INPUT" }),
        /* @__PURE__ */ jsx28("b", { children: "RECORDED 2026-08-14" })
      ] })
    ] });
  return /* @__PURE__ */ jsxs28("div", { className: "motion p0-native p0-metric-growth", children: [
    /* @__PURE__ */ jsx28("div", { className: "p0-person-void", "aria-label": "\u771F\u4EBA\u5B89\u5168\u533A" }),
    /* @__PURE__ */ jsxs28("section", { children: [
      /* @__PURE__ */ jsx28("small", { children: "VERIFIED METRIC" }),
      /* @__PURE__ */ jsxs28("div", { children: [
        /* @__PURE__ */ jsx28("strong", { style: { transform: `translateY(${(1 - reveal) * 2}cqw)`, opacity: reveal }, children: metric }),
        /* @__PURE__ */ jsx28("em", { children: settings.prefix === "\xD7" ? "" : settings.prefix })
      ] }),
      /* @__PURE__ */ jsx28("h2", { children: label }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx28("aside", { children: bars.map((height, index) => {
      const value = easeOutCubic((progress - (0.12 + index * 0.08)) / 0.34);
      return /* @__PURE__ */ jsxs28("i", { style: { height: `${height * 12}cqw` }, children: [
        /* @__PURE__ */ jsx28("b", { style: { transform: `scaleY(${value})` } }),
        /* @__PURE__ */ jsx28("span", { children: String(index + 1).padStart(2, "0") })
      ] }, height);
    }) }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("span", { children: "DATA CONFIRMED" }),
      /* @__PURE__ */ jsx28("b", { children: "ONLY REAL VALUES" })
    ] })
  ] });
}
function namedProductLabel(settings) {
  const source = [settings.sourceText, settings.title, settings.subtitle, settings.quote, ...settings.items].join(" ");
  return source.match(/Codex|ChatGPT|豆包|Claude|Obsidian|飞书|微信|企微|企业微信|QQ|WeCom|Lark/i)?.[0] || "\u5F53\u524D\u4E3B\u9898";
}
function NumberedChapter({ settings, progress }) {
  const index = settings.metric || "01";
  const palette = index === "01" ? { primary: "#42D1AA", secondary: "#FFBE3D", paper: "#102A2A" } : index === "02" ? { primary: "#FF9A3D", secondary: "#58C7D9", paper: "#2C1E18" } : { primary: "#FF665C", secondary: "#FFD34E", paper: "#2A171A" };
  const numberIn = easeOutCubic(progress / 0.22);
  const copyIn = easeOutCubic((progress - 0.1) / 0.22);
  return /* @__PURE__ */ jsxs28("div", { className: "motion codex-settings-chapter", "data-export-safe-gradient": "opaque", style: { "--chapter-primary": palette.primary, "--chapter-secondary": palette.secondary, "--chapter-paper": palette.paper }, children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("span", { children: "NUMBERED CHAPTER" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsxs28("b", { children: [
        "CHAPTER ",
        index
      ] })
    ] }),
    /* @__PURE__ */ jsxs28("main", { children: [
      /* @__PURE__ */ jsx28("strong", { style: { opacity: numberIn, transform: `translateX(${(1 - numberIn) * -3.5}cqw)` }, children: index }),
      /* @__PURE__ */ jsxs28("section", { style: { opacity: copyIn, transform: `translateX(${(1 - copyIn) * 3}cqw)` }, children: [
        /* @__PURE__ */ jsxs28("small", { children: [
          "STEP / ",
          index
        ] }),
        /* @__PURE__ */ jsx28("h2", { children: settings.title }),
        /* @__PURE__ */ jsx28("p", { children: settings.subtitle }),
        /* @__PURE__ */ jsx28("i", {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("b", { children: "CONTEXT" }),
      /* @__PURE__ */ jsx28("span", { children: "FOCUS" }),
      /* @__PURE__ */ jsx28("span", { children: "NEXT" })
    ] })
  ] });
}
function ThreeOptionMatrix({ settings, progress }) {
  const recommended = settings.quote.trim();
  const options = [
    { index: "01", title: settings.items[0] || "\u9009\u9879\u4E00", detail: "\u7B2C\u4E00\u79CD\u9009\u62E9" },
    { index: "02", title: settings.items[1] || "\u9009\u9879\u4E8C", detail: "\u7B2C\u4E8C\u79CD\u9009\u62E9" },
    { index: "03", title: settings.items[2] || "\u9009\u9879\u4E09", detail: "\u7B2C\u4E09\u79CD\u9009\u62E9" }
  ].map((option) => ({ ...option, tone: recommended === option.title ? "recommended" : "neutral" }));
  return /* @__PURE__ */ jsxs28("div", { className: "motion codex-approval-matrix", "data-export-safe-gradient": "opaque", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("small", { children: "OPTION MATRIX / 03 OPTIONS" }),
      /* @__PURE__ */ jsx28("h2", { children: settings.title }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsx28("main", { children: options.map((option, index) => {
      const reveal = easeOutCubic((progress - (0.08 + index * 0.08)) / 0.24);
      return /* @__PURE__ */ jsxs28("article", { className: option.tone, style: { opacity: reveal, transform: `translateY(${(1 - reveal) * 2}cqw)` }, children: [
        /* @__PURE__ */ jsx28("span", { children: option.index }),
        /* @__PURE__ */ jsx28("b", { children: option.title }),
        /* @__PURE__ */ jsx28("i", {}),
        /* @__PURE__ */ jsx28("p", { children: option.detail }),
        option.tone === "recommended" && /* @__PURE__ */ jsx28("strong", { children: "\u5F53\u524D\u63A8\u8350" })
      ] }, option.index);
    }) }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("span", { children: "\u9009\u9879 01" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("b", { children: "\u6839\u636E\u5F53\u524D\u8BED\u4E49\u9009\u62E9" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("span", { children: "\u9009\u9879 03" })
    ] })
  ] });
}
function ScreenOperationDemo({ settings, progress }) {
  const copyIn = easeOutCubic(progress / 0.22);
  const screenIn = easeOutCubic((progress - 0.08) / 0.26);
  const steps = settings.items.filter(Boolean).slice(0, 3);
  const product = namedProductLabel(settings);
  return /* @__PURE__ */ jsxs28("div", { className: "motion codex-screen-demo", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("span", { children: "SCREEN / OPERATION DEMO" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsxs28("b", { children: [
        "STEP ",
        settings.metric
      ] })
    ] }),
    /* @__PURE__ */ jsxs28("main", { children: [
      /* @__PURE__ */ jsxs28("aside", { style: { opacity: copyIn, transform: `translateX(${(1 - copyIn) * -2.2}cqw)` }, children: [
        /* @__PURE__ */ jsx28("small", { children: "\u64CD\u4F5C\u6F14\u793A" }),
        /* @__PURE__ */ jsx28("h2", { children: settings.title }),
        /* @__PURE__ */ jsx28("p", { children: settings.subtitle }),
        /* @__PURE__ */ jsx28("ol", { children: steps.map((step, index) => /* @__PURE__ */ jsxs28("li", { children: [
          /* @__PURE__ */ jsx28("b", { children: String(index + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx28("span", { children: step })
        ] }, step)) })
      ] }),
      /* @__PURE__ */ jsxs28("section", { className: "codex-screen-slot", "aria-label": "\u5F55\u5C4F\u7D20\u6750\u5C55\u793A\u533A\u57DF", style: { opacity: screenIn, transform: `translateX(${(1 - screenIn) * 2.8}cqw) scale(${0.97 + screenIn * 0.03})` }, children: [
        /* @__PURE__ */ jsxs28("div", { className: "codex-screen-bar", children: [
          /* @__PURE__ */ jsx28("i", {}),
          /* @__PURE__ */ jsx28("i", {}),
          /* @__PURE__ */ jsx28("i", {}),
          /* @__PURE__ */ jsxs28("span", { children: [
            product,
            " \xB7 \u64CD\u4F5C\u5F55\u5C4F"
          ] })
        ] }),
        /* @__PURE__ */ jsxs28("div", { className: "codex-screen-preview", children: [
          /* @__PURE__ */ jsx28("b", { children: "\u25BB" }),
          /* @__PURE__ */ jsx28("strong", { children: "\u5F55\u5C4F\u64CD\u4F5C\u533A\u57DF" }),
          /* @__PURE__ */ jsx28("span", { children: "\u540E\u7EED\u76F4\u63A5\u653E\u5165\u5BF9\u5E94\u6B65\u9AA4\u5F55\u5C4F" })
        ] }),
        /* @__PURE__ */ jsxs28("footer", { children: [
          /* @__PURE__ */ jsx28("span", { children: "SCREEN RECORDING" }),
          /* @__PURE__ */ jsx28("i", {}),
          /* @__PURE__ */ jsx28("b", { children: "16:9 SAFE FRAME" })
        ] })
      ] })
    ] })
  ] });
}
function DualConceptPair({ settings, progress }) {
  const leftIn = easeOutCubic(progress / 0.24);
  const rightIn = easeOutCubic((progress - 0.08) / 0.24);
  const leftTitle = settings.leftTitle || settings.items[0];
  const rightTitle = settings.rightTitle || settings.items[1];
  const leftBody = settings.leftBody || "\u8D1F\u8D23\u7EC4\u7EC7\u6A21\u578B\u6240\u9700\u4FE1\u606F";
  const rightBody = settings.rightBody || "\u8D1F\u8D23\u6267\u884C\u4E0E\u4EA4\u4E92\u8C03\u5EA6";
  const leftSummary = [leftTitle, leftBody].filter(Boolean).join(" ");
  const rightSummary = [rightTitle, rightBody].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs28("div", { className: "motion codex-memory-pair", children: [
    /* @__PURE__ */ jsxs28("header", { children: [
      /* @__PURE__ */ jsx28("small", { children: "DUAL CONCEPT / 02 ITEMS" }),
      /* @__PURE__ */ jsx28("h2", { children: settings.title }),
      /* @__PURE__ */ jsx28("p", { children: settings.subtitle })
    ] }),
    /* @__PURE__ */ jsxs28("main", { children: [
      /* @__PURE__ */ jsxs28("article", { className: "memory-chat", style: { opacity: leftIn, transform: `translateX(${(1 - leftIn) * -2.5}cqw)` }, children: [
        /* @__PURE__ */ jsx28("b", { children: "01" }),
        /* @__PURE__ */ jsx28("i", { children: "\u25C6" }),
        /* @__PURE__ */ jsx28("strong", { children: leftTitle }),
        /* @__PURE__ */ jsx28("span", { children: leftBody })
      ] }),
      /* @__PURE__ */ jsx28("div", { "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs28("article", { className: "memory-profile", style: { opacity: rightIn, transform: `translateX(${(1 - rightIn) * 2.5}cqw)` }, children: [
        /* @__PURE__ */ jsx28("b", { children: "02" }),
        /* @__PURE__ */ jsx28("i", { children: "\u25CF" }),
        /* @__PURE__ */ jsx28("strong", { children: rightTitle }),
        /* @__PURE__ */ jsx28("span", { children: rightBody })
      ] })
    ] }),
    /* @__PURE__ */ jsxs28("footer", { children: [
      /* @__PURE__ */ jsx28("span", { children: leftSummary }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("b", { children: "DUAL RELATION" }),
      /* @__PURE__ */ jsx28("i", {}),
      /* @__PURE__ */ jsx28("span", { children: rightSummary })
    ] })
  ] });
}
function M5SelectedOriginalRenderer({ rendererKey, settings, progress }) {
  if (rendererKey === "impactQuestionGlitch") return /* @__PURE__ */ jsx28(Gpt56RelayTemplatePlayer, { id: "relayImpactQuestion", settings, progress });
  if (rendererKey === "tokenVelocityRelay") return /* @__PURE__ */ jsx28(Gpt56RelayTemplatePlayer, { id: "relayTokenVelocity", settings, progress });
  if (rendererKey === "signalPathActivation") return /* @__PURE__ */ jsx28(Gpt56RelayTemplatePlayer, { id: "relaySignalPath", settings, progress });
  if (rendererKey === "editorialStateStamp") return /* @__PURE__ */ jsx28(Gpt56RelayTemplatePlayer, { id: "relayStateStamp", settings, progress });
  if (rendererKey === "completionCheckRail") return /* @__PURE__ */ jsx28(Gpt56RelayTemplatePlayer, { id: "relayCompletionRail", settings, progress });
  if (rendererKey === "numberedChapter") return /* @__PURE__ */ jsx28(NumberedChapter, { settings, progress });
  if (rendererKey === "threeOptionMatrix") return /* @__PURE__ */ jsx28(ThreeOptionMatrix, { settings, progress });
  if (rendererKey === "screenOperationDemo") return /* @__PURE__ */ jsx28(ScreenOperationDemo, { settings, progress });
  if (rendererKey === "dualConceptPair") return /* @__PURE__ */ jsx28(DualConceptPair, { settings, progress });
  if (rendererKey === "backdropHeadline") return /* @__PURE__ */ jsx28(P0BackdropHeadline, { settings, progress });
  if (rendererKey === "adaptiveSteps") return /* @__PURE__ */ jsx28(P0AdaptiveSteps, { settings, progress });
  if (rendererKey === "metricGrowth") return /* @__PURE__ */ jsx28(P0MetricGrowth, { settings, progress });
  if (rendererKey === "chapterViewpoint") return /* @__PURE__ */ jsx28(OrderedViewpoint, { settings });
  if (rendererKey === "metricFocus") return /* @__PURE__ */ jsx28(MetricFocus, { settings });
  if (rendererKey === "compareSplit") return /* @__PURE__ */ jsx28(CompareSolit, { settings });
  if (rendererKey === "quoteLockup") return /* @__PURE__ */ jsx28(QuoteoLockup, { settings });
  if (rendererKey === "flowThree") return /* @__PURE__ */ jsx28(FlowCards, { settings, count: 3 });
  if (rendererKey === "videoWorkflowPipeline") return /* @__PURE__ */ jsx28(VideoWorkflowPipeline, { settings });
  if (rendererKey === "dataChart") return /* @__PURE__ */ jsx28(DataChart, { settings });
  if (rendererKey === "evidenceWindow") return /* @__PURE__ */ jsx28(EvidenceWindow, { settings });
  if (rendererKey === "rankDashboard") return /* @__PURE__ */ jsx28(RankDashboard, { settings, progress });
  if (rendererKey === "capitalRisk") return /* @__PURE__ */ jsx28(CapitalInfographic, { settings, variant: "risk", progress });
  if (rendererKey === "titleHero") {
    const linear = Math.max(0, Math.min(1, progress / 0.18));
    const enter = 1 - Math.pow(1 - linear, 3);
    return /* @__PURE__ */ jsx28("div", { style: { position: "absolute", inset: 0, opacity: 0.02 + 0.98 * enter, transform: "translateY(" + (1 - enter) * 54 + "px)", filter: "blur(" + (1 - enter) * 12 + "px)" }, children: /* @__PURE__ */ jsx28(TitleHero, { settings }) });
  }
  if (rendererKey === "kineticEditorial") return /* @__PURE__ */ jsx28(KineticEditorial, { settings });
  if (rendererKey === "punctuationLockup") return /* @__PURE__ */ jsx28(PunctuationLockup, { settings });
  if (rendererKey === "zinePresenterQuote") return /* @__PURE__ */ jsx28(TalkingHeadDerivative, { id: "zineSideQuote", settings });
  if (rendererKey === "zineRisoProcess") return /* @__PURE__ */ jsx28(OriginalZinePage, { id: "zineProcess", settings });
  if (rendererKey === "peoplesManifesto") return /* @__PURE__ */ jsx28(ImportedTemplateRenderer, { style: "peoplesPlatform", id: "quote", settings });
  if (rendererKey === "blockHeroPoster") return /* @__PURE__ */ jsx28(ImportedTemplateRenderer, { style: "blockFrame", id: "hero", settings });
  if (rendererKey === "blockShowWork") return /* @__PURE__ */ jsx28(ImportedTemplateRenderer, { style: "blockFrame", id: "evidence", settings });
  if (rendererKey === "broadsideSplitCompare") return /* @__PURE__ */ jsx28(ImportedTemplateRenderer, { style: "broadside", id: "compare", settings });
  throw new Error("\u672A\u5B9E\u73B0\u7684\u5B66\u5458\u6A21\u677F\u539F\u7EC4\u4EF6\uFF1A" + rendererKey);
}

// qa/_m5build/entry.tsx
var external = {
  timelineTravel: TimelineTravel,
  wordRelayFilmstrip: WordRelayFilmstrip,
  neonTripleMarquee: NeonTripleMarquee,
  odometerDigitRoll: OdometerDigitRoll,
  tiltReveal: TiltReveal,
  cubeRotate: CubeRotate,
  pageWaterfallWall: PageWaterfallWall,
  gridFlashMosaic: GridFlashMosaic,
  maskingTapeSlap: MaskingTapeSlap,
  paperPlaneMessenger: PaperPlaneMessenger,
  pillSlotCycle: PillSlotCycle,
  sakugaTimingShift: SakugaTimingShift,
  skeletonReveal: SkeletonReveal,
  splitFlapFlip: SplitFlapFlip,
  hashtagToPill: HashtagToPillMaterialize,
  iconFieldColorize: IconFieldColorize,
  lineCarryTransition: LineCarryTransition,
  drawSvgTrace: DrawSvgTrace,
  needleSweepSelftest: NeedleSweepSelftest,
  commandPaletteSummon: CommandPaletteSummon,
  deckDealFlyIn: SceneFlyIn,
  panelToCanvas: PanelToCanvasMaterialize,
  cardFlipReveal: CardFlipReveal
};
export {
  M5SelectedOriginalRenderer,
  external
};
