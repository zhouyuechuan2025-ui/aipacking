import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {fitSize} from '../lib/fit';
import {prog, clamp} from '../lib/anim';
import {ShineBorder} from '../lib/ShineBorder';
import {TextReveal} from '../visuals/SnapTextReveal';
import {FlashCut} from '../visuals/InkPressFlash';
import {SpotlightReveal} from '../visuals/SpotlightReveal';

export type ElementKind = 'trace' | 'tabs' | 'stamp' | 'split' | 'focus' | 'shine' | 'snap' | 'flash';
export type MotionElement = {
  kind: ElementKind;
  at: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  items?: string[];
  direction?: 'left' | 'right';
  color?: string;
};

const font = '"Inter Tight", "Noto Sans SC", sans-serif';

function Element({e,frames,color}: {e: MotionElement; frames: number; color: string}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = Math.min(frames - 1,Math.max(2,Math.round(fps*.32)));
  const k = prog(frame,0,reveal);
  const out = clamp((frames - frame)/Math.max(2,Math.round(fps*.16)));
  const size = fitSize(e.text ?? '',Math.min(48,e.height*.68),e.width-24,22);
  const {width,height,text,items=[]} = e;
  const reverse = e.direction === 'left';
  const outline = <svg width={width} height={height} viewBox={'0 0 '+width+' '+height} aria-hidden>
    <rect x="3" y="3" width={width-6} height={height-6} rx="14" fill="none" stroke={color}
      strokeWidth="3" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1-k}/>
  </svg>;
  const title = <div style={{fontSize:size,whiteSpace:'nowrap',fontWeight:850}}>{text}</div>;

  switch (e.kind) {
    case 'trace':
      return <AbsoluteFill style={{opacity:out,display:'flex',justifyContent:'flex-end'}}>
        <div style={{position:'absolute',bottom:2,width:width*k,height:4,background:color,left:reverse?undefined:0,right:reverse?0:undefined}}/>
        {text && <div style={{padding:'0 8px 10px',opacity:k,textShadow:'0 2px 6px #000'}}>{title}</div>}
      </AbsoluteFill>;
    case 'tabs':
      return <div style={{display:'flex',gap:10,opacity:out,width,height}}>
        {items.map((item,i) => {
          const t = prog(frame,i*3,i*3+reveal);
          return <div key={i} style={{flex:'1 1 0',minWidth:0,display:'grid',placeItems:'center',borderRadius:8,
            background:i===items.length-1?color:'#231b32',border:'1px solid #fff5e950',opacity:t,
            transform:'translateY('+((1-t)*25)+'px)',fontSize:fitSize(item,32,width/items.length-22,18),fontWeight:800,whiteSpace:'nowrap'}}>{item}</div>;
        })}
      </div>;
    case 'stamp':
      return <div style={{height,width,display:'grid',placeItems:'center',border:'3px solid '+color,background:'#231b32',
        borderRadius:10,opacity:k*out,transform:'scale('+(1.24-.24*k)+') rotate('+(-7+4*k)+'deg)'}}>{title}</div>;
    case 'split':
      return <AbsoluteFill style={{opacity:out,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10}}>
        {items.map((item,i) => {
          const t=prog(frame,i*4,i*4+reveal);
          return <div key={i} style={{width:'47%',height:'90%',display:'grid',placeItems:'center',borderRadius:12,background:'#241c31',
            borderBottom:'4px solid '+color,opacity:t,transform:'translateX('+((i===0?-1:1)*(1-t)*34)+'px)',
            whiteSpace:'nowrap',fontSize:fitSize(item,36,width/2-25,18),fontWeight:850}}>{item}</div>;
        })}
      </AbsoluteFill>;
    case 'focus':
      return <AbsoluteFill style={{opacity:out}}>
        <SpotlightReveal width={width} height={height} duration={reveal} frame={frame}>{outline}</SpotlightReveal>
      </AbsoluteFill>;
    case 'shine':
      return <AbsoluteFill style={{opacity:out}}>
        <ShineBorder duration={Math.min(frames-1,Math.round(.68*fps))} radius={14} colors={['#fff5df',color]} borderWidth={3}/>
      </AbsoluteFill>;
    case 'snap':
      return <AbsoluteFill style={{opacity:out}}>
        <TextReveal text={text} fontSize={size} color={color} initialScale={1.23} fontFamily={font}/>
      </AbsoluteFill>;
    case 'flash':
      return <FlashCut peak={.32} color={color} duration={frames-1}/>;
  }
}

export function MotionElements({elements,start,accent}: {elements: MotionElement[]; start: number; accent?: string}) {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{fontFamily:font,color:'#fff8ed',pointerEvents:'none'}}>
    {elements.map((e,i) => {
      const from=Math.round(e.at*fps)-Math.round(start*fps);
      const frames=Math.max(2,Math.round(e.duration*fps));
      return <Sequence key={i} from={from} durationInFrames={frames} layout="none">
        <div style={{position:'absolute',left:e.x,top:e.y,width:e.width,height:e.height,overflow:'hidden'}}>
          <Element e={e} frames={frames} color={e.color || accent || '#ad6b53'}/>
        </div>
      </Sequence>;
    })}
  </AbsoluteFill>;
}
