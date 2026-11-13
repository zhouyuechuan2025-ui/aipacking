import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type ChatMessageSide = "incoming" | "outgoing";
export type ChatMessage = {
  text: string;
  side: ChatMessageSide;
};

export type ChatConversationProps = {
  contact?: string;
  messages?: ChatMessage[];
  accent?: string;
  staggerInFrames?: number;
  bubbleStyle?: "whatsapp" | "rounded";
  avatarSrc?: string;
  backgroundSrc?: string;
  theme?: "light" | "dark";
  contactFontSize?: number;
  statusFontSize?: number;
  messageFontSize?: number;
  composerFontSize?: number;
  avatarFontSize?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    text: "Can we make the launch video feel more alive?",
    side: "incoming",
  },
  {
    text: "Already found three components for it.",
    side: "outgoing",
  },
  {
    text: "I can send the first cut in ten minutes.",
    side: "outgoing",
  },
  { text: "Perfect — I’ll take a look.", side: "incoming" },
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "?";

type AppIconName =
  | "back"
  | "video"
  | "phone"
  | "more"
  | "smile"
  | "paperclip"
  | "mic";

const AppIcon: React.FC<{ name: AppIconName; size?: number }> = ({
  name,
  size = 26,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {name === "back" ? <path d="M15 18l-6-6 6-6" /> : null}
    {name === "video" ? (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="M16 10l5-3v10l-5-3" />
      </>
    ) : null}
    {name === "phone" ? (
      <path d="M6.6 2.8l3 3.1-2 2.8c1.6 3.1 3.8 5.3 6.9 6.9l2.8-2 3.1 3c.5.5.6 1.3.2 1.9l-1.3 2c-.4.7-1.2 1-2 .8C9.6 19.5 4.5 14.4 2.7 6.7c-.2-.8.1-1.6.8-2l2-1.3c.4-.4.8-.6 1.1-.6z" />
    ) : null}
    {name === "more" ? (
      <>
        <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </>
    ) : null}
    {name === "smile" ? (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14.5c1.9 2 5.1 2 7 0M9 9h.01M15 9h.01" />
      </>
    ) : null}
    {name === "paperclip" ? (
      <path d="M20.5 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l9.2-9.2a3.5 3.5 0 015 5l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5" />
    ) : null}
    {name === "mic" ? (
      <>
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" />
      </>
    ) : null}
  </svg>
);

export const ChatConversation: React.FC<ChatConversationProps> = ({
  contact = "Maya Chen",
  messages = DEFAULT_MESSAGES,
  accent,
  staggerInFrames = 18,
  bubbleStyle = "whatsapp",
  avatarSrc,
  backgroundSrc,
  theme = "light",
  contactFontSize = 25,
  statusFontSize = 15,
  messageFontSize = 22,
  composerFontSize = 19,
  avatarFontSize = 21,
  x,
  y,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const {
    fps,
    width: compositionWidth,
    height: compositionHeight,
  } = useVideoConfig();
  const componentWidth = width ?? compositionWidth * 0.8;
  const componentHeight = height ?? compositionHeight * 0.8;
  const componentX = x ?? (compositionWidth - componentWidth) / 2;
  const componentY = y ?? (compositionHeight - componentHeight) / 2;
  const unit = Math.max(
    0.2,
    Math.min(componentWidth / 864, componentHeight / 1080),
  );
  const dark = theme === "dark";
  const outgoingBubbleColor = accent ?? (dark ? "#005c4b" : "#d9fdd3");
  const avatarColor = accent ?? (dark ? "#00a884" : "#d9fdd3");
  const incomingBubbleColor = dark ? "#202c33" : "#ffffff";
  const messageColor = dark ? "#e9edef" : "#18221f";

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: componentX,
          top: componentY,
          width: componentWidth / unit,
          height: componentHeight / unit,
          scale: unit,
          transformOrigin: "top left",
          backgroundColor: dark ? "#0b141a" : "#efeae2",
          borderRadius: 42,
          overflow: "hidden",
          boxShadow: dark
            ? "0 35px 100px rgba(0,0,0,.5)"
            : "0 35px 100px rgba(21,43,34,.24)",
          display: "flex",
          flexDirection: "column",
          border: dark
            ? "1px solid rgba(255,255,255,.08)"
            : "1px solid rgba(255,255,255,.5)",
        }}
      >
        <div
          style={{
            height: 116,
            flexShrink: 0,
            backgroundColor: dark ? "#202c33" : "#075e54",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,.18)",
            zIndex: 2,
          }}
        >
          <AppIcon name="back" size={32} />
          <div
            style={{
              width: 62,
              height: 62,
              flexShrink: 0,
              borderRadius: 99,
              backgroundColor: avatarColor,
              color: dark ? "#062f2a" : "#123d37",
              display: "grid",
              placeItems: "center",
              fontSize: avatarFontSize,
              fontWeight: 800,
              overflow: "hidden",
            }}
          >
            {avatarSrc ? (
              <CanvasImage
                src={avatarSrc}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              getInitials(contact)
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: contactFontSize,
                lineHeight: 1.1,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {contact}
            </div>
            <div
              style={{
                fontSize: statusFontSize,
                color: dark ? "#8696a0" : "#c9e4df",
                marginTop: 6,
              }}
            >
              online
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <AppIcon name="video" />
            <AppIcon name="phone" />
            <AppIcon name="more" />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            padding: "28px 26px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
            backgroundColor: dark ? "#0b141a" : "#efeae2",
            backgroundImage:
              backgroundSrc
                ? "none"
                : dark
                  ? "radial-gradient(circle at 12px 12px,rgba(255,255,255,.04) 0 2px,transparent 2.5px),radial-gradient(circle at 34px 28px,rgba(255,255,255,.025) 0 3px,transparent 3.5px)"
                  : "radial-gradient(circle at 12px 12px,rgba(7,94,84,.055) 0 2px,transparent 2.5px),radial-gradient(circle at 34px 28px,rgba(7,94,84,.04) 0 3px,transparent 3.5px),linear-gradient(45deg,transparent 47%,rgba(7,94,84,.025) 48% 52%,transparent 53%)",
            backgroundSize: "52px 52px,68px 68px,42px 42px",
          }}
        >
          {backgroundSrc ? (
            <CanvasImage
              src={backgroundSrc}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
          {messages.map((message, index) => {
            const side = message.side;
            const mine = side === "outgoing";
            const previousSide =
              index > 0 ? messages[index - 1]?.side : undefined;
            const nextSide =
              index < messages.length - 1
                ? messages[index + 1]?.side
                : undefined;
            const startsGroup = previousSide !== side;
            const endsGroup = nextSide !== side;
            const enter = spring({
              frame: frame - 10 - index * Math.max(1, staggerInFrames),
              fps,
              config: { damping: 18, stiffness: 120 },
            });
            const progress = interpolate(enter, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const whatsappRadius = mine
              ? `${startsGroup ? 18 : 6}px 18px ${endsGroup ? 4 : 6}px 18px`
              : `18px ${startsGroup ? 18 : 6}px 18px ${endsGroup ? 4 : 6}px`;

            return (
              <div
                key={`${message.text}-${index}`}
                style={{
                  display: "grid",
                  gridTemplateRows: `${progress}fr`,
                  marginTop: (startsGroup ? 16 : 5) * progress,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    minHeight: 0,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: mine ? "flex-end" : "flex-start",
                    paddingLeft: mine ? 12 : 0,
                    paddingRight: mine ? 0 : 12,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "78%",
                      backgroundColor: mine
                        ? outgoingBubbleColor
                        : incomingBubbleColor,
                      color: messageColor,
                      borderRadius:
                        bubbleStyle === "whatsapp"
                          ? whatsappRadius
                          : mine
                            ? "24px 24px 6px 24px"
                            : "24px 24px 24px 6px",
                      padding: mine ? "14px 48px 14px 18px" : "14px 18px",
                      fontSize: messageFontSize,
                      lineHeight: 1.35,
                      boxShadow: "0 2px 5px rgba(31,47,42,.14)",
                      opacity: progress,
                      translate: `0 ${interpolate(progress, [0, 1], [46, 0])}px`,
                      scale: interpolate(progress, [0, 1], [0.96, 1]),
                    }}
                  >
                    {message.text}
                    {mine ? (
                      <span
                        style={{
                          position: "absolute",
                          right: 14,
                          bottom: 10,
                          color: "#25a7d9",
                          fontSize: Math.max(10, messageFontSize * 0.68),
                          fontWeight: 800,
                          letterSpacing: -4,
                        }}
                      >
                        ✓✓
                      </span>
                    ) : null}
                    {bubbleStyle === "whatsapp" && endsGroup ? (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: mine ? undefined : -9,
                          right: mine ? -9 : undefined,
                          width: 12,
                          height: 12,
                          backgroundColor: mine
                            ? outgoingBubbleColor
                            : incomingBubbleColor,
                          clipPath: mine
                            ? "polygon(0 0, 100% 100%, 0 100%)"
                            : "polygon(100% 0, 100% 100%, 0 100%)",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            height: 92,
            flexShrink: 0,
            padding: "12px 14px",
            backgroundColor: dark ? "#202c33" : "#f0f2f5",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: dark ? "#8696a0" : "#667781",
            boxShadow: "0 -1px 5px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              height: 62,
              flex: 1,
              borderRadius: 32,
              backgroundColor: dark ? "#2a3942" : "#ffffff",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,.08)",
            }}
          >
            <AppIcon name="smile" size={25} />
            <span
              style={{
                flex: 1,
                fontSize: composerFontSize,
                color: dark ? "#8696a0" : "#8c999f",
              }}
            >
              Message
            </span>
            <AppIcon name="paperclip" size={25} />
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 99,
              backgroundColor: dark ? "#00a884" : "#00897b",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 3px 8px rgba(0,86,77,.25)",
            }}
          >
            <AppIcon name="mic" size={27} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
