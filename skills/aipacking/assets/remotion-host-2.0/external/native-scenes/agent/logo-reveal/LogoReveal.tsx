import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type LogoRevealProps = {
  logo?: React.ReactNode;
  logoSrc?: string;
  logoSize?: number;
  brand?: string;
  tagline?: string;
  accent?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
};

const FallbackMark: React.FC<{accent: string; backgroundColor: string}> = ({
  accent,
  backgroundColor,
}) => (
  <div
    style={{
      position: "relative",
      width: "58%",
      height: "58%",
      rotate: "45deg",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: `18px solid ${accent}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "39%",
        top: "-14%",
        width: "22%",
        height: "128%",
        backgroundColor,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "43%",
        top: "43%",
        width: "14%",
        height: "14%",
        borderRadius: "50%",
        backgroundColor: accent,
        boxShadow: `0 0 34px ${accent}`,
      }}
    />
  </div>
);

export const LogoReveal: React.FC<LogoRevealProps> = ({
  logo,
  logoSrc,
  logoSize = 300,
  brand = "NORTH/STAR",
  tagline = "Make the signal visible.",
  accent = "#edff5b",
  backgroundColor = "#11110f",
  textColor = "#f6f5ef",
  mutedColor = "#92958c",
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const unit = Math.max(0.55, Math.min(width / 1080, height / 1080));
  const resolvedLogoSize = Math.max(80, logoSize) * unit;
  const markEntrance = spring({
    frame: frame - 5,
    fps,
    config: {damping: 18, stiffness: 135, mass: 0.8},
  });
  const ringEntrance = spring({
    frame: frame - 1,
    fps,
    config: {damping: 22, stiffness: 90, mass: 0.9},
  });
  const copyEntrance = spring({
    frame: frame - 30,
    fps,
    config: {damping: 22, stiffness: 145, mass: 0.75},
  });
  const hasCustomLogo = logo !== undefined && logo !== null && logo !== "";

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
        backgroundImage: `radial-gradient(circle at 50% 44%, ${accent}16 0%, transparent 38%)`,
        color: textColor,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: resolvedLogoSize * 2.15,
          height: resolvedLogoSize * 2.15,
          border: `1px solid ${accent}22`,
          borderRadius: "50%",
          opacity: interpolate(ringEntrance, [0, 1], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(ringEntrance, [0, 1], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
          translate: "-50% -50%",
        }}
      />

      <div
        style={{
          position: "relative",
          width: resolvedLogoSize,
          height: resolvedLogoSize,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          opacity: interpolate(markEntrance, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(markEntrance, [0, 1], [0.68, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
          translate: `0 ${interpolate(markEntrance, [0, 1], [46, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px`,
          rotate: `${interpolate(markEntrance, [0, 1], [-6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}deg`,
        }}
      >
        {hasCustomLogo ? (
          logo
        ) : logoSrc ? (
          <CanvasImage
            src={logoSrc}
            style={{width: "100%", height: "100%", objectFit: "contain"}}
          />
        ) : (
          <FallbackMark accent={accent} backgroundColor={backgroundColor} />
        )}

        <div
          style={{
            position: "absolute",
            top: "-30%",
            bottom: "-30%",
            left: "-25%",
            width: "18%",
            rotate: "14deg",
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)",
            filter: "blur(10px)",
            opacity: interpolate(frame, [18, 28, 52, 62], [0, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `${interpolate(frame, [18, 62], [0, resolvedLogoSize * 1.55], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            })}px 0px`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </div>

      {(brand || tagline) && (
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            marginTop: 68 * unit,
            opacity: interpolate(copyEntrance, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0 ${interpolate(copyEntrance, [0, 1], [32, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px`,
          }}
        >
          {brand ? (
            <div
              style={{
                fontSize: 62 * unit,
                fontWeight: 820,
                lineHeight: 1,
                letterSpacing: 5 * unit,
              }}
            >
              {brand}
            </div>
          ) : null}
          {tagline ? (
            <div
              style={{
                marginTop: 22 * unit,
                color: mutedColor,
                fontSize: 22 * unit,
                fontWeight: 520,
                lineHeight: 1.25,
                letterSpacing: 2.5 * unit,
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>
      )}
    </AbsoluteFill>
  );
};
