import React from 'react';
import {AbsoluteFill,Freeze,Img,OffthreadVideo,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import type {PageProps} from '../pages/full';
import {VideoAt} from '../fx/visual';
import {fitLines,fitSize} from '../lib/fit';
import {rel,clamp} from '../lib/anim';
import {TECH_PRESETS,type TechPreset} from './tech-presets';
const FONT='"Inter Tight","Noto Sans SC",sans-serif';
const E=(x:number)=>1-Math.pow(1-clamp(x),3);
const useDesign=(p:any,start:number)=>{const f=useCurrentFrame(),{fps}=useVideoConfig();return {f,fps,c:TECH_PRESETS[p.preset as TechPreset]||TECH_PRESETS['violet-tech'],at:(v:any,d:number)=>rel(v,start,fps,d)};};
const Back:React.FC<{c:any;children?:React.ReactNode}>=({c,children})=><AbsoluteFill style={{background:c.bg,color:c.ink,fontFamily:FONT,overflow:'hidden'}}><AbsoluteFill style={{background:`radial-gradient(ellipse at 85% 15%,${c.main}28,transparent 65%),radial-gradient(ellipse at 15% 85%,${c.secondary}18,transparent 65%)`}}/>{children}</AbsoluteFill>;
const Person:React.FC<{video?:string;start:number;x:number;y:number;w:number;h:number;rot?:number}>=({video,start,x,y,w,h,rot=0})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:25,overflow:'hidden',transform:`rotate(${rot}deg)`,boxShadow:'0 22px 65px #0006'}}><div style={{width:'100%',height:'118%'}}><VideoAt video={video} start={start} style={{objectPosition:'50% 0%'}}/></div></div>;
// Only B-roll/media time is frozen or retimed. Person always follows the original clock.
const Media:React.FC<{m:any;frame:number;fps:number}>=({m,frame,fps})=>m.kind==='video'?<Freeze frame={Math.max(0,frame)}><OffthreadVideo muted src={staticFile(m.src)} startFrom={Math.round((m.offset||0)*fps)} style={{width:'100%',height:'100%',objectFit:m.fit||'contain'}}/></Freeze>:<Img src={staticFile(m.src)} style={{width:'100%',height:'100%',objectFit:m.fit||'contain'}}/>;
const Card:React.FC<{m:any;x:number;y:number;w:number;h:number;rot:number;c:any;k:number;frame:number;fps:number}>=({m,x,y,w,h,rot,c,k,frame,fps})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:20,overflow:'hidden',background:c.panel,border:`1px solid ${c.line}`,boxShadow:'0 20px 55px #0007',opacity:k,transform:`translateY(${(1-k)*45}px) rotate(${rot*k}deg) scale(${.96+.04*k})`}}><Media m={m} frame={frame} fps={fps}/>{m.label&&<span style={{position:'absolute',left:15,top:13,fontSize:20,background:c.bg,color:c.ink,padding:'6px 12px',borderRadius:7}}>{m.label}</span>}</div>;

/** Typography rests before a short impact. Material panels establish depth without fake matting. */
export const TechImpact:React.FC<PageProps>=({p,start,video})=>{
 const {f,fps,c,at}=useDesign(p,start),hit=at(p.hitAt,15),attack=E((f-hit)/6),settle=E((f-hit-6)/12);
 const pulse=f>=hit&&f<hit+18?Math.sin((f-hit)/18*Math.PI):0;
 const lines=Array.isArray(p.title)?p.title:[p.title];const media=(p.media||[]).slice(0,2);
 const titleSize=fitLines(lines,100,440,42);
 return <Back c={c}>
  <div style={{position:'absolute',left:85,top:55,fontSize:23,color:c.secondary}}>{p.kicker}</div>
  <div style={{position:'absolute',left:85,top:260,width:440,opacity:E((f-at(p.titleAt,0))/10),transform:`perspective(1500px) rotateY(${(-8+8*settle)}deg) scale(${1+.055*pulse})`}}>{lines.map((x:any,i:number)=><div key={i} style={{fontWeight:900,fontSize:titleSize,lineHeight:1.15,whiteSpace:'nowrap',color:i?c.main:c.ink,marginBottom:16}}>{x}</div>)}<div style={{height:5,width:330*attack,background:c.secondary,marginTop:30}}/></div>
  <div style={{opacity:E(f/12),transform:`translateY(${-8*pulse}px)`}}><Person video={video} start={start} x={590} y={150} w={740} h={745}/></div>
  {media.map((m:any,i:number)=><Card key={i} m={m} x={i?1270:1170} y={i?555:205} w={i?535:570} h={i?330:330} rot={i?5:-4} c={c} k={E((f-at(m.at,hit+i*4))/10)} frame={f} fps={fps}/>)}
  {p.note&&<div style={{position:'absolute',left:90,top:770,width:440,fontSize:fitSize(p.note,32,440,24),color:c.muted,opacity:attack}}>{p.note}</div>}
 </Back>;
};

/** One large presenter window and staggered material cards. Cards hold still after building. */
export const TechCollage:React.FC<PageProps>=({p,start,video})=>{
 const {f,fps,c,at}=useDesign(p,start);const media=(p.media||[]).slice(0,3);
 if(p.mode==='diagonal'){
  const masks=['polygon(0 0,38% 0,18% 100%,0 100%)','polygon(38% 0,72% 0,52% 100%,18% 100%)','polygon(72% 0,100% 0,100% 100%,52% 100%)'];
  return <Back c={c}>
   <div style={{position:'absolute',left:90,top:55,fontSize:22,color:c.secondary}}>{p.kicker}</div>
   <div style={{position:'absolute',left:90,top:112,fontSize:fitSize(p.title,74,1720,40),fontWeight:900}}>{p.title}</div>
   <div style={{position:'absolute',left:90,top:245,width:1290,height:640,overflow:'hidden',borderRadius:22,background:c.panel}}>
    {media.map((m:any,i:number)=>{const k=E((f-at(m.at,3+i*4))/12);return <AbsoluteFill key={i} style={{clipPath:masks[i],opacity:k,transform:`translateX(${(1-k)*(i%2?-95:95)}px)`}}><Media m={{...m,fit:'cover'}} frame={f} fps={fps}/></AbsoluteFill>;})}
   </div>
   <Person video={video} start={start} x={1430} y={245} w={395} h={640}/>
   <div style={{position:'absolute',left:95,top:912,color:c.muted,fontSize:24}}>{p.note}</div>
  </Back>;
 }
 const rects=[{x:1110,y:215,w:650,h:365,r:-3},{x:1010,y:470,w:680,h:380,r:3},{x:1430,y:650,w:380,h:215,r:-4}];
 return <Back c={c}>
  <div style={{position:'absolute',left:90,top:55,fontSize:22,color:c.secondary}}>{p.kicker}</div>
  <div style={{position:'absolute',left:90,top:111,fontSize:fitSize(p.title,76,1720,40),fontWeight:900}}>{p.title}</div>
  <Person video={video} start={start} x={95} y={245} w={970} h={565} rot={-1.5*E(f/16)}/>
  {media.map((m:any,i:number)=>{const r=rects[i];return <Card key={i} m={m} x={r.x} y={r.y} w={r.w} h={r.h} rot={r.r} c={c} k={E((f-at(m.at,5+i*6))/12)} frame={f} fps={fps}/>;})}
  {p.note&&<div style={{position:'absolute',left:100,top:850,width:850,fontSize:fitSize(p.note,32,850,24),color:c.main}}>{p.note}</div>}
 </Back>;
};

/** Fast/slow contrast on actual materials, using a consistent rectangle for visual match cuts. */
export const TechMontage:React.FC<PageProps>=({p,start,video})=>{
 const {f,fps,c,at}=useDesign(p,start),media=p.media||[];if(!media.length)return <Back c={c}/>;
 const cut=Math.max(6,Math.round((p.cutEvery||.55)*fps)),hold=at(p.holdAt,Math.round(cut*1.5)),holdN=Math.round((p.holdDuration||1.2)*fps);
 const clock=f<hold?f:f<hold+holdN?hold:f-holdN;
 const index=Math.min(media.length-1,Math.floor(Math.max(0,clock)/cut)),local=Math.max(0,clock-index*cut);
 const m=media[index],reveal=E((f-at(p.titleAt,0))/12);
 return <Back c={c}>
  <div style={{position:'absolute',left:90,top:55,fontSize:22,color:c.secondary}}>{p.kicker}</div>
  <div style={{position:'absolute',left:90,top:115,fontWeight:900,fontSize:fitSize(p.title,72,1720,40),opacity:reveal}}>{p.title}</div>
  <Card m={m} x={90} y={235} w={1290} h={650} rot={0} c={c} k={E((f+6)/12)} frame={local} fps={fps}/>
  <Person video={video} start={start} x={1430} y={235} w={395} h={650}/>
  <div style={{position:'absolute',left:95,top:911,color:c.muted,fontSize:22}}>{p.note||m.label}</div>
 </Back>;
};
for(const C of [TechImpact,TechCollage,TechMontage])(C as any).selfTrans=true;
