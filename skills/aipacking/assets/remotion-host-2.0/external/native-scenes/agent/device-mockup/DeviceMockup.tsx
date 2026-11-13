import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

export type DeviceMockupPreset = "iphone" | "android" | "tablet" | "laptop";
export type DeviceMockupProps = {
  preset?: DeviceMockupPreset;
  theme?: "light" | "dark";
  children?: React.ReactNode;
  screenColor?: string;
  accent?: string;
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shadow?: boolean;
};

const renderContent = (children: React.ReactNode, background: string) => {
  if (typeof children !== "string") return children;
  const html = `<!doctype html><html><head><style>html,body{width:100%;height:100%;margin:0;overflow:hidden;background:${background};font-family:Inter,system-ui,sans-serif}*{box-sizing:border-box}</style></head><body>${children}</body></html>`;
  return (
    <iframe
      title="Device content"
      sandbox=""
      srcDoc={html}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
    />
  );
};

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  preset = "iphone",
  theme = "dark",
  children = "",
  screenColor,
  accent = "#c7ff4a",
  label = "Agent Motion",
  x,
  y,
  width,
  height,
  shadow = true,
}) => {
  const { width: compositionWidth, height: compositionHeight } =
    useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const isLaptop = preset === "laptop";
  const isTablet = preset === "tablet";
  const ratio = isLaptop
    ? 16 / 10
    : isTablet
      ? 4 / 3
      : preset === "android"
        ? 9 / 19.5
        : 9 / 19.5;
  const maxDeviceWidth = isLaptop
    ? componentWidth * 0.92
    : isTablet
      ? componentWidth * 0.7
      : componentWidth * 0.46;
  const maxDeviceHeight = isLaptop
    ? componentHeight * 0.78
    : isTablet
      ? componentHeight * 0.92
      : componentHeight * 0.96;
  const deviceWidth = Math.min(maxDeviceWidth, maxDeviceHeight * ratio);
  const deviceHeight = deviceWidth / ratio;
  const unit = Math.max(
    0.25,
    Math.min(
      deviceWidth / (isLaptop ? 1280 : isTablet ? 900 : 430),
      deviceHeight / (isLaptop ? 800 : isTablet ? 675 : 932),
    ),
  );
  const dark = theme === "dark";
  const shell = dark ? "#121416" : "#e8eaed";
  const edge = dark ? "#3b3f44" : "#aeb4bd";
  const resolvedScreen = screenColor ?? (dark ? "#0b0d0f" : "#ffffff");
  const empty = children === "" || children === null || children === undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left: componentX,
          top: componentY,
          width: componentWidth,
          height: componentHeight,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: deviceWidth,
            height: deviceHeight,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              borderRadius: isLaptop
                ? 20 * unit
                : isTablet
                  ? 42 * unit
                  : preset === "android"
                    ? 38 * unit
                    : 54 * unit,
              border: `${Math.max(2, 4 * unit)}px solid ${edge}`,
              backgroundColor: shell,
              padding: isLaptop ? 12 * unit : isTablet ? 18 * unit : 14 * unit,
              boxShadow: shadow ? "0 50px 110px rgba(0,0,0,0.36)" : "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: isLaptop
                  ? 10 * unit
                  : isTablet
                    ? 29 * unit
                    : preset === "android"
                      ? 27 * unit
                      : 40 * unit,
                backgroundColor: resolvedScreen,
              }}
            >
              {empty ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: `radial-gradient(circle at 50% 40%, ${accent}33, transparent 48%), ${resolvedScreen}`,
                    color: dark ? "#f7f8f5" : "#161815",
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: Math.max(14, 34 * unit),
                        fontWeight: 760,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        width: Math.max(28, 72 * unit),
                        height: Math.max(3, 7 * unit),
                        margin: `${Math.max(9, 20 * unit)}px auto 0`,
                        borderRadius: 999,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>
              ) : (
                renderContent(children, resolvedScreen)
              )}
              {!isLaptop && !isTablet ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: preset === "android" ? 10 * unit : 8 * unit,
                    translate: "-50% 0",
                    width: preset === "android" ? 14 * unit : 112 * unit,
                    height: preset === "android" ? 14 * unit : 31 * unit,
                    borderRadius: 999,
                    backgroundColor: "#070809",
                    boxShadow:
                      preset === "android"
                        ? `0 0 0 ${4 * unit}px rgba(255,255,255,0.06)`
                        : "none",
                  }}
                />
              ) : null}
            </div>
          </div>
          {isLaptop ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: "-8%",
                  top: "100%",
                  width: "116%",
                  height: 25 * unit,
                  borderRadius: `0 0 ${18 * unit}px ${18 * unit}px`,
                  background: dark
                    ? "linear-gradient(#8b9098,#4e535b)"
                    : "linear-gradient(#eef0f3,#aeb4bc)",
                  boxShadow: shadow ? "0 24px 35px rgba(0,0,0,0.24)" : "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "42%",
                  top: "100%",
                  width: "16%",
                  height: 7 * unit,
                  borderRadius: `0 0 ${7 * unit}px ${7 * unit}px`,
                  backgroundColor: dark ? "#30343a" : "#8f959e",
                }}
              />
            </>
          ) : null}
          {isTablet ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 6 * unit,
                translate: "-50% 0",
                width: 8 * unit,
                height: 8 * unit,
                borderRadius: "50%",
                backgroundColor: "#050607",
              }}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
