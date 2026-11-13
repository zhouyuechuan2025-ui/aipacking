import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type BrowserType = 'chrome' | 'safari';
export type BrowserTheme = 'light' | 'dark';
export type BrowserLogo = string | React.ReactElement;
export type BrowserScrollMode = 'auto' | 'none';

export type BrowserSpotlightProps = {
  browser?: BrowserType;
  theme?: BrowserTheme;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  url?: string;
  logo?: BrowserLogo;
  children?: React.ReactNode;
  scrollMode?: BrowserScrollMode;
  scrollStartFrame?: number;
  scrollEndFrame?: number;
};

type ContentSize = {
  width: number;
  height: number;
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const TrafficLights: React.FC = () => (
  <div style={{display: 'flex', gap: 12}}>
    {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
      <div key={color} style={{width: 18, height: 18, borderRadius: '50%', backgroundColor: color}} />
    ))}
  </div>
);

const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
    <path d="M9.5 20v-6h5v6" />
  </svg>
);

const ChevronIcon: React.FC<{direction: 'left' | 'right'}> = ({direction}) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

const ReloadIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 11a8 8 0 1 0-2.34 5.66" />
    <path d="M20 4v7h-7" />
  </svg>
);

const MoreIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);

const SiteLogo: React.FC<{logo?: BrowserLogo}> = ({logo}) => {
  if (!logo) return null;

  return (
    <div style={{width: 18, height: 18, flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', borderRadius: 4}}>
      {typeof logo === 'string' ? <Img src={logo} style={{width: 18, height: 18, objectFit: 'contain'}} /> : logo}
    </div>
  );
};

const ChromeControls: React.FC<{theme: BrowserTheme; url: string; logo?: BrowserLogo}> = ({theme, url, logo}) => {
  const isDark = theme === 'dark';
  const text = isDark ? '#d8dce3' : '#4f5661';
  const muted = isDark ? '#9298a3' : '#747b86';
  const surface = isDark ? '#202124' : '#f1f3f4';
  const address = isDark ? '#292a2d' : '#ffffff';

  return (
    <div style={{height: 112, flexShrink: 0, backgroundColor: surface, color: text, borderBottom: `1px solid ${isDark ? '#34363a' : '#d9dce1'}`}}>
      <div style={{height: 47, display: 'flex', alignItems: 'flex-end', paddingLeft: 18}}>
        <div style={{width: 320, height: 38, padding: '0 18px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: address, fontSize: 16}}>
          <SiteLogo logo={logo} />
          <span style={{flex: 1}}>New tab</span>
          <span style={{fontSize: 20, color: muted}}>×</span>
        </div>
        <span style={{fontSize: 25, lineHeight: '38px', padding: '0 18px', color: muted}}>+</span>
      </div>
      <div style={{height: 65, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', backgroundColor: address}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, color: muted}}>
          <ChevronIcon direction="left" />
          <ChevronIcon direction="right" />
          <ReloadIcon />
        </div>
        <div style={{height: 42, flex: 1, minWidth: 0, borderRadius: 22, display: 'flex', alignItems: 'center', padding: '0 18px', backgroundColor: isDark ? '#202124' : '#f1f3f4', color: muted, fontSize: 17}}>
          <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{url}</span>
        </div>
        <span style={{display: 'grid', placeItems: 'center', color: muted}}><MoreIcon /></span>
      </div>
    </div>
  );
};

const SafariControls: React.FC<{theme: BrowserTheme; url: string}> = ({theme, url}) => {
  const isDark = theme === 'dark';
  const surface = isDark ? '#2c2d2f' : '#e8e8e8';
  const text = isDark ? '#d7d8da' : '#56585c';
  const address = isDark ? '#3a3b3e' : '#ffffff';

  return (
    <div style={{height: 76, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 22, padding: '0 20px', backgroundColor: surface, color: text, borderBottom: `1px solid ${isDark ? '#414246' : '#cfd0d2'}`}}>
      <TrafficLights />
      <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: 0.72}}>
        <HomeIcon />
        <ChevronIcon direction="left" />
        <ChevronIcon direction="right" />
      </div>
      <div style={{height: 42, flex: 1, minWidth: 0, borderRadius: 11, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 18px', backgroundColor: address, fontSize: 16}}>
        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{url}</span>
      </div>
    </div>
  );
};

export const BrowserSpotlight: React.FC<BrowserSpotlightProps> = ({
  browser = 'chrome',
  theme = 'light',
  x,
  y,
  width,
  height,
  url = 'website.com',
  logo,
  children,
  scrollMode = 'auto',
  scrollStartFrame,
  scrollEndFrame,
}) => {
  const frame = useCurrentFrame();
  const {width: compositionWidth, height: compositionHeight, durationInFrames, fps} = useVideoConfig();
  const contentRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [contentSize, setContentSize] = useState<ContentSize | null>(null);
  const [measurementHandle] = useState(() => delayRender('Measuring BrowserSpotlight content'));
  const measurementContinued = useRef(false);
  const isDark = theme === 'dark';
  const chromeHeight = browser === 'safari' ? 76 : 112;
  const maximumBrowserWidth = width ?? compositionWidth * 0.8;
  const maximumBrowserHeight = height ?? compositionHeight * 0.8;
  const hasContent = typeof children === 'string' ? children.trim().length > 0 : children !== null && children !== undefined;
  const browserWidth = width ?? (hasContent && contentSize
    ? clamp(contentSize.width, Math.min(320, maximumBrowserWidth), maximumBrowserWidth)
    : maximumBrowserWidth);
  const browserHeight = height ?? (hasContent && contentSize
    ? clamp(chromeHeight + contentSize.height, Math.min(240, maximumBrowserHeight), maximumBrowserHeight)
    : maximumBrowserHeight);
  const browserX = x ?? (compositionWidth - browserWidth) / 2;
  const browserY = y ?? (compositionHeight - browserHeight) / 2;
  const viewportHeight = Math.max(0, browserHeight - chromeHeight);
  const maximumScroll = Math.max(0, (contentSize?.height ?? 0) - viewportHeight);
  const resolvedScrollStart = Math.max(0, scrollStartFrame ?? Math.round(fps * 0.8));
  const resolvedScrollEnd = Math.max(resolvedScrollStart + 1, scrollEndFrame ?? durationInFrames - Math.round(fps * 0.8));
  const scrollOffset = scrollMode === 'auto' && maximumScroll > 0
    ? interpolate(frame, [resolvedScrollStart, resolvedScrollEnd], [0, maximumScroll], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0, 0.2, 1),
    })
    : 0;
  const htmlDocument = typeof children === 'string'
    ? `<!doctype html><html><head><style>html,body{margin:0;overflow:hidden;background:transparent}*{box-sizing:border-box}#agent-motion-content{display:block;width:max-content;max-width:${maximumBrowserWidth}px;transform-origin:top left}</style></head><body><div id="agent-motion-content">${children}</div></body></html>`
    : null;

  const updateContentSize = (nextSize: ContentSize) => {
    const normalized = {
      width: Math.max(0, Math.ceil(nextSize.width)),
      height: Math.max(0, Math.ceil(nextSize.height)),
    };
    setContentSize((current) => current?.width === normalized.width && current.height === normalized.height ? current : normalized);
  };

  useLayoutEffect(() => {
    if (htmlDocument !== null || !contentRef.current) return;
    const node = contentRef.current;
    const measure = () => updateContentSize({
      width: Math.max(node.scrollWidth, node.getBoundingClientRect().width),
      height: Math.max(node.scrollHeight, node.getBoundingClientRect().height),
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children, htmlDocument, maximumBrowserWidth]);

  useLayoutEffect(() => {
    if (htmlDocument === null) return;
    const content = iframeRef.current?.contentDocument?.getElementById('agent-motion-content');
    if (content) content.style.setProperty('translate', `0 -${scrollOffset}px`);
  }, [htmlDocument, scrollOffset]);

  useEffect(() => {
    if (contentSize === null || measurementContinued.current) return;
    measurementContinued.current = true;
    continueRender(measurementHandle);
  }, [contentSize, measurementHandle]);

  const measureIframeContent = () => {
    const content = iframeRef.current?.contentDocument?.getElementById('agent-motion-content');
    if (!content) {
      updateContentSize({width: maximumBrowserWidth, height: 0});
      return;
    }
    updateContentSize({
      width: Math.max(content.scrollWidth, content.getBoundingClientRect().width),
      height: Math.max(content.scrollHeight, content.getBoundingClientRect().height),
    });
  };

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: browserX,
          top: browserY,
          width: browserWidth,
          height: browserHeight,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: browser === 'safari' ? 18 : 14,
          backgroundColor: isDark ? '#17181b' : '#ffffff',
          border: `1px solid ${isDark ? '#383a3f' : '#cfd4dc'}`,
          boxShadow: isDark ? '0 52px 140px rgba(0, 0, 0, 0.6)' : '0 52px 140px rgba(38, 52, 73, 0.25)',
        }}
      >
        {browser === 'safari' ? <SafariControls theme={theme} url={url} /> : <ChromeControls theme={theme} url={url} logo={logo} />}
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            backgroundColor: isDark ? '#17181b' : '#ffffff',
          }}
        >
          {htmlDocument === null ? (
            <div
              ref={contentRef}
              style={{
                width: width === undefined ? 'max-content' : '100%',
                maxWidth: width === undefined ? maximumBrowserWidth : undefined,
                translate: `0 -${scrollOffset}px`,
              }}
            >
              {children}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Browser content"
              sandbox="allow-same-origin"
              srcDoc={htmlDocument}
              onLoad={measureIframeContent}
              style={{width: '100%', height: '100%', display: 'block', border: 0, backgroundColor: 'transparent'}}
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
