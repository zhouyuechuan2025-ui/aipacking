import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
export { calculateCodeEditorDuration } from "./codeEditorTiming";

export type CodeEditorPreset = "midnight" | "github" | "neon";
export type CodeEditorProps = {
  code?: string;
  title?: string;
  language?: string;
  preset?: CodeEditorPreset;
  reveal?: "static" | "type" | "lines";
  charactersPerFrame?: number;
  framesPerLine?: number;
  holdDurationInFrames?: number;
  highlightLines?: number[];
  accent?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const tokenize = (line: string) =>
  line
    .split(/(\s+|[(){}[\],.;:=<>+\-*/]|"[^"]*"|'[^']*'|`[^`]*`)/g)
    .filter(Boolean);

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code = "const launch = await agentMotion.add('cursor-tour');\n\nrender({\n  component: launch,\n  preset: 'midnight',\n});",
  title = "launch.tsx",
  language = "TypeScript",
  preset = "midnight",
  reveal = "lines",
  charactersPerFrame = 2,
  framesPerLine = 10,
  highlightLines = [3, 4],
  accent = "#c7ff4a",
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { width: compositionWidth, height: compositionHeight } =
    useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const light = preset === "github";
  const neon = preset === "neon";
  const surface = light ? "#ffffff" : neon ? "#090711" : "#101318";
  const chrome = light ? "#f6f8fa" : neon ? "#120c1f" : "#191e26";
  const text = light ? "#24292f" : "#e6edf3";
  const muted = light ? "#8c959f" : "#7d8590";
  const border = light ? "#d0d7de" : neon ? "#4b2869" : "#30363d";
  const visibleCode =
    reveal === "type"
      ? code.slice(
          0,
          Math.max(1, Math.floor(frame * Math.max(0.1, charactersPerFrame))),
        )
      : code;
  const lines = visibleCode.split("\n");
  const visibleLineCount =
    reveal === "lines"
      ? Math.max(1, Math.floor(frame / Math.max(1, framesPerLine)) + 1)
      : lines.length;
  const unit = Math.max(
    0.45,
    Math.min(componentWidth / 1536, componentHeight / 864),
  );
  const fontSize = Math.max(12, 27 * unit);

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
          borderRadius: Math.max(12, 24 * unit),
          border: `1px solid ${border}`,
          backgroundColor: surface,
          boxShadow: "0 35px 90px rgba(0,0,0,0.28)",
          color: text,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        <div
          style={{
            height: Math.max(48, 76 * unit),
            padding: `0 ${Math.max(18, 28 * unit)}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${border}`,
            backgroundColor: chrome,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
              <span
                key={color}
                style={{
                  width: Math.max(8, 13 * unit),
                  height: Math.max(8, 13 * unit),
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
            ))}
            <span
              style={{
                marginLeft: Math.max(8, 18 * unit),
                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                fontSize: Math.max(12, 19 * unit),
                fontWeight: 650,
              }}
            >
              {title}
            </span>
          </div>
          <span
            style={{
              fontSize: Math.max(10, 15 * unit),
              color: muted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {language}
          </span>
        </div>
        <div
          style={{
            height: `calc(100% - ${Math.max(48, 76 * unit)}px)`,
            padding: `${Math.max(20, 38 * unit)}px 0`,
            overflow: "hidden",
            fontSize,
            lineHeight: 1.72,
          }}
        >
          {lines.map((line, index) => {
            const shown = index < visibleLineCount;
            const highlighted = highlightLines.includes(index + 1);
            return (
              <div
                key={index}
                style={{
                  height: `${1.72}em`,
                  display: "flex",
                  opacity: shown ? 1 : 0,
                  backgroundColor: highlighted
                    ? `${accent}${light ? "1c" : "18"}`
                    : "transparent",
                  borderLeft: highlighted
                    ? `${Math.max(2, 4 * unit)}px solid ${accent}`
                    : `${Math.max(2, 4 * unit)}px solid transparent`,
                }}
              >
                <span
                  style={{
                    width: Math.max(48, 76 * unit),
                    flexShrink: 0,
                    paddingRight: Math.max(12, 22 * unit),
                    color: muted,
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ whiteSpace: "pre" }}>
                  {tokenize(line).map((token, tokenIndex) => {
                    const keyword =
                      /^(const|let|await|return|export|import|from|new|true|false)$/.test(
                        token,
                      );
                    const string = /^("|'|`)/.test(token);
                    const number = /^\d/.test(token);
                    return (
                      <span
                        key={tokenIndex}
                        style={{
                          color: keyword
                            ? neon
                              ? "#ff7de9"
                              : "#ff7b72"
                            : string
                              ? neon
                                ? "#9efff1"
                                : light
                                  ? "#0a3069"
                                  : "#a5d6ff"
                              : number
                                ? "#d2a8ff"
                                : text,
                        }}
                      >
                        {token}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
