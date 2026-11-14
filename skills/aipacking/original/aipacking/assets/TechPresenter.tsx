import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig,spring} from 'remotion';
import type {PageProps} from '../pages/full';
import {VideoAt} from '../fx/visual';
import {fitSize,fitLines} from '../lib/fit';
import {rel,clamp} from '../lib/anim';
import {onColor} from '../lib/theme';
import {TECH_PRESETS,type TechPreset} from './tech-presets';

const FONT='"Inter Tight","Noto Sans SC",sans-serif';
const MONO='"JetBrains Mono","Noto Sans SC",monospace';
const E=(t:number)=>1-Math.pow(1-clamp(t),3);
const FULL={x:0,y:0,w:1920,h:1080,r:0,rot:0};
const mix=(a:typeof FULL,b:typeof FULL,k:number)=>Object.fromEntries(Object.keys(a).map(key=>[key,(a as any)[key]+((b as any)[key]-(a as any)[key])*k])) as typeof FULL;

/** 原口播作为版式的一部分。底层主视频提供原声，窗口必须静音并按同一时间轴取帧。 */
const Presenter:React.FC<{video?:string;start:number;rect:typeof FULL;zoom:number;border:string;shadow?:boolean}>=({video,start,rect,zoom,border,shadow=true})=><div style={{position:'absolute',left:rect.x,top:rect.y,width:rect.w,height:rect.h,borderRadius:rect.r,overflow:'hidden',transform:`rotate(${rect.rot}deg)`,boxShadow:shadow?'0 28px 70px rgba(0,0,0,.35)':undefined,border:rect.r?`1px solid ${border}`:undefined,boxSizing:'border-box'}}>
  {/* 隐去原画面底部已烧录字幕；主工作台按SRT统一绘制屏幕底部字幕。 */}
  <div style={{position:'absolute',left:0,top:0,width:'100%',height:'118%',transform:`scale(${zoom})`,transformOrigin:'50% 26%'}}><VideoAt video={video} start={start} style={{objectPosition:'50% 0%'}} /></div>
</div>;

export const TechPresenter:React.FC<PageProps>=({p,start,dur,video,chapter})=>{
  const f=useCurrentFrame();const {fps}=useVideoConfig();const c=TECH_PRESETS[p.preset as TechPreset]||TECH_PRESETS['violet-tech'];
  const at=(v:any,fallback:number)=>rel(v,start,fps,fallback);const enter=E(f/18),out=E((f-(dur-10))/10),k=enter*(1-out);
  const mode=p.mode||'push';
  const targets:Record<string,typeof FULL>={push:{x:1030,y:155,w:800,h:720,r:30,rot:0},focus:{x:100,y:160,w:1060,h:720,r:28,rot:0},float:{x:115,y:160,w:970,h:550,r:28,rot:-2.2},process:{x:100,y:160,w:650,h:740,r:28,rot:0},final:FULL};
  const rect=mix(FULL,targets[mode]||targets.push,k);
  const punch=E((f-at(p.focusAt,10))/16);const zoom=mode==='final'?1+.04*E(f/40):1+(mode==='focus'?.115:.035)*punch;
  const lines=Array.isArray(p.title)?p.title:[p.title||''];const words=(p.words||[]).slice(0,3);
  const content=mode==='final'?E(f/12)*(1-out):E((f-8)/14)*(1-out);
  const textX=mode==='push'?100:mode==='focus'?1230:mode==='float'?1170:mode==='process'?830:100;
  const textW=mode==='push'?850:mode==='focus'?590:mode==='float'?640:mode==='process'?990:600;
  const titleSize=fitLines(lines,mode==='push'?140:mode==='focus'?78:mode==='process'?91:96,textW,42);
  return <AbsoluteFill style={{background:c.bg,color:c.ink,fontFamily:FONT,overflow:'hidden'}}>
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 70% 20%,${c.main}29,transparent 65%),radial-gradient(ellipse at 20% 85%,${c.secondary}18,transparent 65%)`}} />
    <svg width="1920" height="1080" style={{position:'absolute',opacity:.2}} aria-hidden>{Array.from({length:14},(_,i)=><line key={i} x1={i*150} x2={i*150} y1="0" y2="1080" stroke={c.line} />)}</svg>
    <Presenter video={video} start={start} rect={rect} zoom={zoom} border={c.line} shadow={k>.1} />
    {mode==='float' && <>
      <div style={{position:'absolute',left:1450,top:525,color:c.secondary,fontFamily:MONO,fontSize:19,opacity:content}}>同帧特写</div>
      <AbsoluteFill style={{opacity:content}}><Presenter video={video} start={start} rect={{x:1420+(1-content)*110,y:570,w:390,h:250,r:20,rot:3*content}} zoom={1.3} border={c.secondary} /></AbsoluteFill>
      <div style={{position:'absolute',left:145,top:770,display:'flex',gap:18,opacity:content}}>{words.map((x:any,i:number)=>{const s=spring({frame:f-at(x.at,12+i*6),fps,config:{damping:18,stiffness:180}});const color=[c.main,c.secondary,c.tertiary][i];return <div key={i} style={{padding:'16px 30px',borderRadius:12,background:color,color:onColor(color),fontSize:36,fontWeight:800,opacity:clamp(s),transform:`translateY(${(1-s)*35}px) rotate(${i%2?1:-1}deg)`}}>{x.text}</div>;})}</div>
    </>}
    <div style={{position:'absolute',left:textX,top:mode==='final'?290:235,width:textW,opacity:content}}>
      <div style={{fontFamily:MONO,fontSize:22,color:mode==='final'?'#FFFFFF':c.secondary,marginBottom:28,...(mode==='final'?{background:c.bg,padding:'8px 14px',display:'inline-block'}:{})}}>{p.kicker||chapter?.title}</div>
      {lines.map((line:any,i:number)=>{const reveal=E((f-at(p.titleAt,9)-i*5)/14);return <div key={i} style={{overflow:'hidden',marginBottom:10}}><div style={{fontSize:titleSize,fontWeight:900,lineHeight:1.15,whiteSpace:'nowrap',color:mode==='final'?'#fff':i?c.main:c.ink,transform:`translateY(${(1-reveal)*110}%)`,...(mode==='final'?{background:c.main,color:onColor(c.main),padding:'6px 18px',display:'inline-block'}:{})}}>{line}</div></div>;})}
      {mode==='push' && <div style={{height:5,width:350*E((f-20)/18),background:`linear-gradient(90deg,${c.main},${c.secondary})`,marginTop:34}} />}
      {mode==='focus' && <div style={{marginTop:35,padding:'24px 28px',background:c.panel,border:`1px solid ${c.line}`,borderRadius:18,opacity:E((f-at(p.focusAt,10))/14),transform:`translateX(${(1-E((f-at(p.focusAt,10))/14))*60}px)`}}><div style={{fontFamily:MONO,fontSize:20,color:c.muted,marginBottom:14}}>{p.label||'关键词'}</div><div style={{fontSize:fitSize(p.detail||'',52,textW-56,28),fontWeight:800,color:c.main,whiteSpace:'nowrap'}}>{p.detail}</div></div>}
    </div>
    {mode==='process' && <div style={{position:'absolute',left:830,top:495,width:990,display:'flex',alignItems:'center',gap:20,opacity:content}}>
      {words.map((x:any,i:number)=>{const s=spring({frame:f-at(x.at,14+i*8),fps,config:{damping:21,stiffness:170}});const color=[c.main,c.secondary,c.tertiary][i];return <React.Fragment key={i}>{i>0&&<div style={{color,opacity:clamp(s),fontSize:34}}>→</div>}<div style={{width:285,height:230,padding:'25px 20px',boxSizing:'border-box',borderRadius:20,background:c.panel,border:`1px solid ${c.line}`,opacity:clamp(s),transform:`translateY(${(1-s)*50}px)`}}><div style={{fontSize:20,fontFamily:MONO,color:c.muted,marginBottom:35}}>0{i+1}</div><div style={{fontSize:fitSize(x.text,48,245,28),fontWeight:900,color,whiteSpace:'nowrap'}}>{x.text}</div></div></React.Fragment>;})}
    </div>}
    {mode==='final'&&p.detail&&<div style={{position:'absolute',right:115,top:285,padding:'18px 26px',borderRadius:12,background:c.bg,color:c.secondary,fontSize:38,fontWeight:800,opacity:content,transform:`translateX(${(1-content)*70}px)`}}>{p.detail}</div>}
    <div style={{position:'absolute',top:55,left:100,color:c.muted,fontFamily:MONO,fontSize:20,opacity:k}}>{chapter?`${String(chapter.index).padStart(2,'0')} / ${String(chapter.total).padStart(2,'0')}`:'MOTION STUDIO'}</div>
  </AbsoluteFill>;
};
(TechPresenter as any).selfTrans=true;
