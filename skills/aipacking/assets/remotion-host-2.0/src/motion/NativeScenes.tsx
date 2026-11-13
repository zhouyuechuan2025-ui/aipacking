import React from 'react';
import {AbsoluteFill, Freeze, Internals, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import type {PageProps} from '../pages/full';
import registry from './native-scenes.json';
import {nativeComponents} from './native-scenes.generated';

export function NativeScene({index, duration, props, side}: {index:number; duration:number; props:Record<string,unknown>; side?:'left'|'right'}) {
  const frame = useCurrentFrame();
  const sequence = React.useContext(Internals.SequenceContext);
  const entry = registry[index];
  const Original = nativeComponents[index] as React.ComponentType<Record<string, unknown>>;
  const width = side ? 535 : 1920;
  const height = side ? 342 : 1080;
  const factor = Math.min(width/entry.width,height/entry.height);
  const sourceFrame = Math.max(0,Math.min(entry.frames-1,Math.round(frame/Math.max(1,duration-1)*(entry.frames-1))));
  return <div style={{position:'absolute',left:side==='left'?72:side==='right'?1313:0,top:side?164:0,width,height,
    background:props.canvas as string || (entry.source==='SnapCN'?'#f5f3ee':'#14141a'),overflow:'hidden',borderRadius:side?18:0}}>
    <div style={{position:'absolute',width:entry.width,height:entry.height,
      left:(width-entry.width*factor)/2,top:(height-entry.height*factor)/2,
      transform:'scale('+factor+')',transformOrigin:'top left'}}>
      <Freeze frame={sourceFrame}>
        {sequence && <Internals.SequenceContext.Provider value={{...sequence,cumulatedFrom:0,width:entry.width,height:entry.height,durationInFrames:entry.frames}}>
          <Original {...props}/>
        </Internals.SequenceContext.Provider>}
      </Freeze>
    </div>
  </div>;
}

export const NATIVE_SCENES: Record<string,React.FC<PageProps>> = Object.fromEntries(registry.map((entry,index)=>[
  entry.id, ({p,dur}:PageProps) => <NativeScene index={index} duration={dur} props={p.native}/>,
]));

export const NATIVE_SCENE_LANES: Record<string,React.FC<PageProps & {side:'left'|'right'}>> = Object.fromEntries(registry.map((entry,index)=>[
  entry.id, ({p,dur,side}:PageProps & {side:'left'|'right'}) => <NativeScene index={index} duration={dur} props={p.native} side={side}/>,
]));

export const NativeRenderedClip: React.FC<PageProps> = ({p}) => (
  <AbsoluteFill style={{background:'#14141a'}}>
    <OffthreadVideo muted src={staticFile(p.media)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
  </AbsoluteFill>
);

export const NativeOverlayLayer: React.FC<PageProps> = ({p}) => (
  <AbsoluteFill>
    <OffthreadVideo muted transparent src={staticFile(p.media)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
  </AbsoluteFill>
);
