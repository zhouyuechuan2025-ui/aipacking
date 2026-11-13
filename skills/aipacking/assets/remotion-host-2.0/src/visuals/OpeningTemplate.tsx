import React, {useContext} from 'react';
import {AbsoluteFill, Freeze, Img, Internals, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {MosaicReframe} from '../../external/video-shotcraft-locked/demos/transition/mosaic-reframe/MosaicReframe';
import {TiltReveal} from '../../external/video-shotcraft/demos/camera/overhead-camera-moves/TiltReveal';
import {LogoAssemble} from '../../external/snapcn/registry/snap-cn/logo-assemble';
import {HeroLaunch} from '../../external/snapcn/registry/snap-cn/hero-launch';
import {AnnounceTitle} from '../../external/snapcn/registry/snap-cn/announce-title';
import {openingTemplates} from '../../opening-templates.mjs';
import {NanaWatermark} from '../lib/NanaWatermark';

type Effect = keyof typeof openingTemplates;

export type OpeningOptions = {
  images?: string[];
  image?: string;
  centerSrc?: string;
  logoSrc?: string;
  brandName?: string;
  middleText?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  tagline?: string;
  sourceFrames?: [number, number];
  centerFade?: [number, number];
  palette?: {canvas?: string; glow?: string; line?: string; ink?: string; paper?: string; accent?: string};
};

const WIDTH = 1920;
const HEIGHT = 1080;

function NativeStage({duration, children}: React.PropsWithChildren<{duration: number}>) {
  const sequence = useContext(Internals.SequenceContext);
  if (!sequence) throw new Error('An opening template must be inside a scene sequence');
  return <Internals.SequenceContext.Provider value={{...sequence, width: WIDTH, height: HEIGHT, durationInFrames: duration}}>
    {children}
  </Internals.SequenceContext.Provider>;
}

export function OpeningTemplate({effect, options, duration, width, height, watermark}: {
  effect: Effect; options: OpeningOptions; duration: number; width: number; height: number;
  watermark: {frame: number; color: string; opacity: number};
}) {
  const frame = useCurrentFrame();
  const spec = openingTemplates[effect];
  const [first, last] = options.sourceFrames ?? spec.range;
  const progress = Math.min(1, frame / (duration - 1));
  const nativeFrame = Math.round(first + (last - first) * progress);
  const images = options.images?.map(src => staticFile(src)) ?? [];
  const absolute = (url: string) => new URL(url, window.location.href).href;
  const palette = options.palette ?? {};
  const scale = Math.min(width / WIDTH, height / HEIGHT);

  let content: React.ReactNode;
  switch (effect) {
    case 'opening-mosaic':
      content = <MosaicReframe imageUrls={images}/>;
      break;
    case 'opening-logo-assemble':
      content = <LogoAssemble logoSrc={absolute(staticFile(options.logoSrc!))} brandName={options.brandName}
        middleText={options.middleText ?? ''} count={images.length} images={images.map(absolute)}
        background="transparent" theme={{foreground: palette.ink ?? '#fff3db'}}/>;
      break;
    case 'opening-tilt-reveal':
      content = <TiltReveal imageUrl={staticFile(options.image!)} title={options.title} subtitle={options.subtitle}
        palette={{canvas: palette.canvas ?? '#eee8d8', panel: options.title || options.subtitle ? '#211837' : 'transparent',
          accent: palette.accent ?? 'transparent'}}/>;
      break;
    case 'snap-hero-launch': {
      const urls = images.map(absolute);
      const canvas = palette.canvas ?? '#180f2e';
      content = <>
        <AbsoluteFill style={{background: canvas, transform:'translateY(-130px)'}}>
          <HeroLaunch image1={urls[0]} image2={urls[1]} heading={options.title ?? ''}
            theme={{background: canvas, card: palette.glow ?? '#382263', foreground: palette.ink ?? '#f9f1ff'}}/>
        </AbsoluteFill>
        <AbsoluteFill style={{background:'linear-gradient(180deg, transparent 75%, '+canvas+' 88%)'}}/>
      </>;
      break;
    }
    case 'snap-announce-title':
      content = <AnnounceTitle eyebrow={options.eyebrow} title={options.title} tagline={options.tagline ?? ''}
        fieldColor={palette.canvas ?? '#4c25cb'} paperColor={palette.paper ?? '#f8edcf'}
        titleColor={palette.ink ?? '#241541'}/>;
      break;
  }

  const ring = effect === 'opening-logo-assemble';
  const [fadeIn, fadeOut] = options.centerFade ?? [first + (last - first) * .19, first + (last - first) * .36];
  const evidence = interpolate(nativeFrame, [fadeIn, fadeOut], [1, 0], {extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const line = palette.line ?? '#e9d5ff38';
  return <AbsoluteFill style={{overflow:'hidden', background:palette.canvas ?? '#170e2e'}}>
    <div style={{position:'absolute',left:(width-WIDTH*scale)/2,top:(height-HEIGHT*scale)/2,
      width:WIDTH,height:HEIGHT,transform:'scale('+scale+')',transformOrigin:'top left',overflow:'hidden'}}>
      {ring && <AbsoluteFill style={{background:'radial-gradient(ellipse at center,'+(palette.glow ?? '#573288')+',#2c194c 47%,'+(palette.canvas ?? '#170e2e')+' 86%)'}}>
        <NanaWatermark frame={watermark.frame} color={watermark.color} opacity={watermark.opacity}/>
        <div style={{position:'absolute',left:560,top:141,width:800,height:800,border:'1px solid '+line,borderRadius:'50%'}}/>
        <div style={{position:'absolute',left:537,top:118,width:846,height:846,border:'1px dashed '+line,borderRadius:'50%'}}/>
        {options.centerSrc && evidence>0 && <div style={{position:'absolute',left:756,top:391,width:408,height:298,
          opacity:evidence,transform:'scale('+(.66+.34*evidence)+')',borderRadius:18,overflow:'hidden',
          border:'2px solid #d0adff9c',boxShadow:'0 25px 48px #11041eaa'}}>
          <Img src={staticFile(options.centerSrc)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>}
      </AbsoluteFill>}
      <Freeze frame={nativeFrame}><NativeStage duration={spec.duration}>{content}</NativeStage></Freeze>
    </div>
  </AbsoluteFill>;
}
