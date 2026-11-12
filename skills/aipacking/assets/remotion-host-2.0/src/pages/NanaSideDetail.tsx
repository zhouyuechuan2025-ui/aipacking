import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { exitK, prog, rel } from '../lib/anim';
import { ShineBorder } from '../lib/ShineBorder';
import type { OverlayProps } from './overlay';

const paper = '#F8F0DF';
const muted = '#DACFDF';
const purple = '#C6A6FF';
const mint = '#A9E6CA';
const gold = '#FFCB75';
const panel = '#201827F2';
const font = '"Inter Tight","Noto Sans SC",sans-serif';
type Cue = {text: string; at: number};
type Progress = (index: number, seconds?: number) => number;

const word: React.CSSProperties = {fontWeight:850, whiteSpace:'nowrap'};
const caption: React.CSSProperties = {fontSize:22, color:muted, fontWeight:600};
const label: React.CSSProperties = {...word, fontSize:38};
const outlined: React.CSSProperties = {border:'1px solid #DAC7ED54',borderRadius:20,background:panel};
const marks = ['M 12 20 H48 V43 H12 Z M21 12 V20 M39 12 V20 M21 43 V51 M39 43 V51','M12 12 H48 V48 H12 Z','M12 30 H48 M30 12 V48'];

function Trace({d, k, color = purple, width = 4}: {d: string; k: number; color?: string; width?: number}) {
  return <path d={d} pathLength={1} stroke={color} strokeWidth={width} fill="none"
    strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1-k} />;
}

function Headline({items, action}: {items: Cue[]; action: Progress}) {
  const a = action(0,.3), b = action(1,.32);
  const words = items[0].text.split(' ');
  return <div style={{position:'relative',height:320,textShadow:'0 6px 20px #1F131AAA'}}>
    <svg width="415" height="290" style={{position:'absolute',inset:0}} aria-hidden>
      <Trace d="M 34 27 H 362 M 383 27 V 194 M 28 179 V 78" k={a} color={gold} width={3}/>
      <Trace d="M 30 220 Q 191 239 369 212" k={b} color={gold} width={5}/>
    </svg>
    <div style={{position:'relative',padding:'43px 0 0 44px',opacity:a,transform:`translateY(${(1-a)*26}px)`,...word,fontSize:72,lineHeight:1.05}}>
      <span style={{color:gold}}>{words[0]}</span><br/>{words.slice(1).join(' ')}
    </div>
    {items[1] && <div style={{position:'absolute',left:46,top:236,fontSize:34,fontWeight:720,color:paper,opacity:b,transform:`translateX(${(1-b)*24}px)`}}>
      {items[1].text}
    </div>}
  </div>;
}

function SourceSignal({items, action}: {items: Cue[]; action: Progress}) {
  const a = action(0), b = action(1), c = action(2);
  return <div style={{...outlined,padding:'22px 25px 24px',opacity:a,transform:`translateX(${(a-1)*29}px)`}}>
    <div style={{display:'flex',gap:16,alignItems:'center'}}>
      <svg width="58" height="58" viewBox="0 0 60 60" aria-hidden>
        <Trace d="M 18 14 L 5 30 L 18 46 M 41 14 L 54 30 L 41 46 M 36 10 L 25 50" k={a} color={gold} width={5}/>
      </svg>
      <span style={{...word,fontSize:53}}>{items[0].text}</span>
    </div>
    <svg width="100%" height="22" viewBox="0 0 325 22" preserveAspectRatio="none" aria-hidden>
      <Trace d="M 0 12 L 302 12 L 324 2" k={b} color={gold} width={3}/>
    </svg>
    <div style={{...label,opacity:b}}>{items[1]?.text}</div>
    <div style={{fontSize:27,color:mint,fontWeight:650,marginTop:15,opacity:c,transform:`translateX(${(1-c)*20}px)`}}>
      {items[2]?.text}
    </div>
  </div>;
}

function Sources({items, action}: {items: Cue[]; action: Progress}) {
  return <div style={{position:'relative',paddingTop:16}}>
    <div style={{...caption,marginBottom:7,opacity:action(0)}}>口播提及</div>
    <svg width="30" height="260" style={{position:'absolute',left:24,top:66}} aria-hidden>
      <Trace d="M 10 12 V 205" k={action(items.length-1)} color={purple} width={3}/>
    </svg>
    {items.map((item,i) => {
      const k=action(i,.42), color=[mint,gold,purple][i%3];
      return <div key={i} style={{height:84,display:'flex',alignItems:'center',gap:20,opacity:k,
        transform:`perspective(800px) translateX(${(1-k)*44}px) rotateY(${-30*(1-k)}deg)`,
        transformOrigin:'left center',position:'relative'}}>
        <div style={{borderRadius:12,background:panel,border:`1px solid ${color}`,width:68,height:58,display:'grid',placeItems:'center'}}>
          <svg width="31" height="31" viewBox="0 0 60 60" aria-hidden><Trace d={marks[i%3]} k={k} color={color} width={6}/></svg>
        </div>
        <div style={{...word,fontSize:37,color}}>{item.text}</div>
      </div>;
    })}
  </div>;
}

function Checkin({items, action, localFrame, itemFrame, note}: {
  items: Cue[]; action: Progress; localFrame: number; itemFrame:(index:number)=>number; note?:string;
}) {
  const a=action(0,.34), b=action(1,.62), c=action(2,.54), receipt=action(2,.86);
  const glowStart=itemFrame(2)+12;
  return <div style={{...outlined,position:'relative',padding:'18px 20px 22px',opacity:a}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:14}}>
      <div>
        <div style={caption}>口播机制示意</div>
        <div style={{...label,marginTop:5}}>{items[0].text}</div>
      </div>
      <div style={{width:78,height:38,borderRadius:25,background:mint,position:'relative',flexShrink:0}}>
        <div style={{position:'absolute',left:5+38*a,top:5,width:28,height:28,borderRadius:'50%',background:'#22382D'}}/>
      </div>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:19,opacity:b}}>
      {Array.from({length:4},(_,i) => <div key={i} style={{width:68,height:55,display:'grid',placeItems:'center',borderRadius:9,
        border:`1px solid ${i===2?mint:'#D9C8EE45'}`,background:i===2?'#3E6250':'#2B2032'}}>
        <svg width="31" height="31" viewBox="0 0 60 60" aria-hidden>
          {i===2?<Trace d="M12 26 L25 39 L52 12" k={b} color={mint} width={6}/>:<path d="M20 30 H40" stroke="#C3AAC8" strokeWidth={4} strokeLinecap="round"/>}
        </svg>
      </div>)}
    </div>
    <div style={{...caption,marginTop:9,opacity:b}}>{items[1]?.text}</div>
    <div style={{height:62,position:'relative',display:'grid',justifyItems:'center',opacity:c}}>
      <svg width="80" height="62" viewBox="0 0 80 62" aria-hidden>
        <Trace d="M40 0 V55 M32 46 L40 55 L48 46" k={c} color={gold} width={3}/>
      </svg>
      <div style={{position:'absolute',width:26,height:26,borderRadius:'50%',background:gold,top:36*c-10,
        boxShadow:`0 0 16px ${gold}80`,transform:`scale(${1-.16*receipt})`}}/>
    </div>
    <div style={{position:'relative',...outlined,background:'#32271C',borderColor:'#FFCB7588',padding:'9px 14px',
      color:gold,...label,opacity:receipt}}>
      {items[2]?.text}
      {localFrame>=glowStart && localFrame<glowStart+19 &&
        <Sequence from={glowStart} durationInFrames={19} layout="none">
          <ShineBorder duration={18} radius={20} colors={['#FFE9BD',gold]} borderWidth={2}/>
        </Sequence>}
    </div>
    {note && <div style={{...caption,opacity:receipt,marginTop:9}}>{note}</div>}
  </div>;
}

function Summary({items, action}: {items: Cue[]; action: Progress}) {
  const a=action(0), b=action(1);
  return <div style={{...outlined,padding:'19px 22px 21px',opacity:a}}>
    <div style={caption}>{items[0].text}</div>
    <div style={{...label,color:mint,marginTop:10,opacity:b}}>{items[1]?.text}</div>
    <svg width="100%" height="61" viewBox="0 0 342 61" aria-hidden>
      <Trace d="M171 6 V25 H72 V57 M171 25 H269 V57" k={action(2)} color={purple} width={3}/>
      <circle cx="171" cy="25" r={7*action(2)} fill={gold}/>
    </svg>
    <div style={{display:'flex',justifyContent:'space-between',gap:10}}>
      {items.slice(2).map((item,i)=><span key={i} style={{...word,fontSize:29,
        color:i===0?paper:gold,opacity:action(i+2),transform:`translateY(${12*(1-action(i+2))}px)`}}>{item.text}</span>)}
    </div>
  </div>;
}

export const NanaSideDetail: React.FC<OverlayProps> = ({p,start,dur,side}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const items: Cue[]=p.items;
  const itemFrame=(i: number)=>rel(items[i]?.at,start,fps);
  const action: Progress=(i, seconds=.35)=>items[i] ? prog(frame,itemFrame(i),itemFrame(i)+Math.max(3,Math.round(seconds*fps))) : 0;
  const props={items,action};
  const view={
    headline:<Headline {...props}/>,
    source:<SourceSignal {...props}/>,
    sources:<Sources {...props}/>,
    checkin:<Checkin {...props} localFrame={frame} itemFrame={itemFrame} note={p._motionNote}/>,
    summary:<Summary {...props}/>,
  }[p._motionDetail as string];
  return <AbsoluteFill style={{pointerEvents:'none',opacity:exitK(frame,dur,Math.round(fps*.2)),color:paper,fontFamily:font}}>
    <div style={{position:'absolute',left:side==='left'?90:undefined,right:side==='left'?undefined:90,
      top:p.y??224,width:p.width??400}}>{view}</div>
  </AbsoluteFill>;
};
