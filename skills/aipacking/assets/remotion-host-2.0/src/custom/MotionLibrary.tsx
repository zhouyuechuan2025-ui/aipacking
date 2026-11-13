import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame, useVideoConfig} from 'remotion';
import {OpeningTemplate} from '../visuals/OpeningTemplate';
import {TextMaskReveal} from '../visuals/TextMaskReveal';
import {KineticWordStack} from '../visuals/KineticWordStack';
import {RefContinuity} from './reference-motion/ContinuityPack';
import {WorkbenchNative} from './legacy-native/WorkbenchNative.js';
import native from './legacy-native/catalog.json';
import './legacy-native/WorkbenchNative.css';
import type {PageProps} from '../pages/full';

const openingEffects = {
  ShotcraftMosaic: 'opening-mosaic',
  SnapLogoAssemble: 'opening-logo-assemble',
  ShotcraftTiltReveal: 'opening-tilt-reveal',
  SnapHeroLaunch: 'snap-hero-launch',
  SnapAnnounceTitle: 'snap-announce-title',
} as const;

const openings = Object.fromEntries(Object.entries(openingEffects).map(([type, effect]) => [
  type,
  ({p,dur}: PageProps) => {
    const frame = useCurrentFrame();
    const options = effect === 'opening-tilt-reveal' ? {...p,title:undefined,subtitle:undefined} : p;
    return <AbsoluteFill>
      <OpeningTemplate effect={effect} options={options} duration={Math.max(2,dur)}
        width={1920} height={1080} watermark={{frame,color:'#dbc3e8',opacity:p.watermark ? .067 : 0}}/>
      {effect === 'opening-tilt-reveal' && p.credit && <div style={{position:'absolute',top:77,left:108,
        background:'#241c31',color:'#fff6e9',padding:'9px 18px',borderRadius:7,
        fontFamily:'"Inter Tight","Noto Sans SC",sans-serif',fontSize:23,fontWeight:700}}>{p.credit}</div>}
    </AbsoluteFill>;
  },
]));

const nativeTemplate = (key: string, side: boolean): React.FC<PageProps> => ({p,dur}) =>
  <AbsoluteFill style={side ? {} : {background:p.background || '#241c31'}}>
    <WorkbenchNative p={{...p,templateKey:key,durationFrames:dur}}/>
  </AbsoluteFill>;

const nativeEntries = (side: boolean) => Object.fromEntries(native.filter(row => (row.mode === '人物页') === side)
  .map(row => ['Native_' + row.id, nativeTemplate(row.key,side)]));

function ContinuityPage({p,dur,start,video,chapter}: PageProps) {
  return <RefContinuity p={{...p,navigation:false,overlay:false,study:false}} dur={dur} start={start} video={video} chapter={chapter}/>;
}

function ContinuityOverlay({p,dur,start}: PageProps) {
  return <RefContinuity p={{...p,navigation:false,overlay:true,personMode:'hidden',study:false}} dur={dur} start={start}/>;
}

function MaskTitle({p}: PageProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Freeze frame={Math.min(96, Math.round(frame * 30 / fps))}>
    <TextMaskReveal lines={p.lines} backgroundColor={p.background || '#241c31'}
      accentColor={p.accent || '#ffc09c'} textColor={p.ink || '#fff6e9'}/>
  </Freeze>;
}

function WordStack({p,start}: PageProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Freeze frame={Math.round(frame * 30 / fps)}>
    <KineticWordStack words={p.words} wordFrames={p.wordAt?.map((at:number) => Math.round((at-start)*30))} backgroundColor={p.background || '#241c31'}
      accentColor={p.accent || '#ffc09c'} textColor={p.ink || '#fff6e9'}/>
  </Freeze>;
}

export const MOTION_LIBRARY_PAGES = {...openings, ...nativeEntries(false), MaskTitle, WordStack, ContinuityPage};
export const MOTION_LIBRARY_OVERLAYS = {...nativeEntries(true), ContinuityOverlay};
