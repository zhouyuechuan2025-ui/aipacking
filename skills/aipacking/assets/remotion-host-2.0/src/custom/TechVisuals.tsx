import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import type {PageProps} from '../pages/full';
import {fitSize, fitLines} from '../lib/fit';
import {RelayTransfer} from '../pages/MotionFlowDetails';
import {rel, clamp} from '../lib/anim';
import {onColor} from '../lib/theme';
import {TECH_PRESETS, type TechPreset} from './tech-presets';

const FONT='"Inter Tight","Noto Sans SC",sans-serif';
const MONO='"JetBrains Mono","Noto Sans SC",monospace';
const preset=(p:any)=>TECH_PRESETS[p.preset as TechPreset] || TECH_PRESETS['violet-tech'];
const ease=(t:number)=>1-Math.pow(1-clamp(t),3);
const item=(x:any)=>typeof x==='string'?{title:x}:x;
const useMotion=(start:number)=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return {f,fps,at:(v:any,fallback:number)=>rel(v,start,fps,fallback)};};

const Canvas: React.FC<{p:any;chapter?:any;children:React.ReactNode}> = ({p,chapter,children})=>{
  const {f}=useMotion(0);const c=preset(p);const drift=Math.sin(f/95)*36;
  return <AbsoluteFill style={{background:c.bg,color:c.ink,fontFamily:FONT,overflow:'hidden'}}>
    <AbsoluteFill style={{background:`radial-gradient(ellipse at ${75+drift/7}% 18%, ${c.main}29 0%, transparent 54%),radial-gradient(ellipse at 15% 85%, ${c.secondary}1C 0%, transparent 58%)`}} />
    <svg width="1920" height="1080" style={{position:'absolute',opacity:.28}} aria-hidden>
      <defs><pattern id="tech-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke={c.line} strokeWidth="1" /></pattern></defs>
      <rect width="1920" height="1080" fill="url(#tech-grid)" />
      {[0,1,2].map(i=><path key={i} d={`M ${1100+i*180} -20 Q ${950+i*210} 420 ${1500+i*190} 950`} fill="none" stroke={c.secondary} strokeOpacity=".17" strokeWidth="1.5" />)}
    </svg>
    <div style={{position:'absolute',left:100,right:100,top:62,display:'flex',justifyContent:'space-between',fontFamily:MONO,fontSize:20,color:c.muted}}>
      <span>{p.kicker || chapter?.title || 'TECH / KNOWLEDGE'}</span><span>{p.headerRight ?? (chapter ? `${String(chapter.index).padStart(2,'0')} / ${String(chapter.total).padStart(2,'0')}` : 'MOTION STUDIO')}</span>
    </div>
    <div style={{position:'absolute',left:100,top:112,width:1720,height:1,background:c.line}} />
    {children}
  </AbsoluteFill>;
};

export const TechHero: React.FC<PageProps> = ({p,start,chapter})=>{
  const {f,fps,at}=useMotion(start);const c=preset(p);const lines=Array.isArray(p.title)?p.title.slice(0,2):[p.title || '科技艺术'];
  const titleK=ease((f-at(p.titleAt,3))/18);const fs=fitLines(lines,128,860,52);const labels=(p.items || ['语义','结构','表达']).slice(0,3).map(item);
  return <Canvas p={p} chapter={chapter}>
    <div style={{position:'absolute',left:100,top:278,width:900}}>
      <div style={{color:c.secondary,fontFamily:MONO,fontSize:24,marginBottom:30,opacity:ease(f/12)}}>{p.label || 'A NEW VISUAL LANGUAGE'}</div>
      <div style={{overflow:'hidden'}}><div style={{transform:`translateY(${(1-titleK)*70}px)`,opacity:titleK}}>
        {lines.map((t:any,i:number)=><div key={i} style={{fontSize:fs,fontWeight:900,lineHeight:1.16,whiteSpace:'nowrap',color:i?c.main:c.ink}}>{t}</div>)}
      </div></div>
      {p.note && <div style={{marginTop:35,fontSize:fitSize(p.note,34,850,24),color:c.muted,opacity:ease((f-at(p.noteAt,18))/12),whiteSpace:'nowrap'}}>{p.note}</div>}
      <div style={{marginTop:42,width:260*titleK,height:5,background:`linear-gradient(90deg,${c.main},${c.secondary})`}} />
    </div>
    <div style={{position:'absolute',left:1150,top:230,width:660,height:630,transform:`perspective(1600px) rotateY(${-8+6*ease(f/35)}deg)`}}>
      <div style={{position:'absolute',left:60,top:40,width:540,height:505,borderRadius:28,border:`1px solid ${c.line}`,background:c.panel,boxShadow:`0 32px 90px ${c.main}16`,transform:`translateY(${(1-ease(f/22))*50}px)`,opacity:ease(f/22)}}>
        <div style={{padding:'32px 38px',fontFamily:MONO,color:c.muted,fontSize:20,borderBottom:`1px solid ${c.line}`}}>{p.diagramLabel || '概念示意'}</div>
        {labels.map((x:any,i:number)=>{const k=spring({frame:f-at(x.at,8+i*5),fps,config:{damping:20,stiffness:150}});const color=[c.main,c.secondary,c.tertiary][i];return <div key={i} style={{margin:'22px 28px',padding:'20px 26px',borderRadius:15,border:`1px solid ${c.line}`,background:c.bg,display:'flex',alignItems:'center',gap:20,opacity:clamp(k),transform:`translateX(${(1-k)*34}px)`}}>
          <div style={{width:7,height:42,borderRadius:2,background:color,flexShrink:0}} /><span style={{fontSize:fitSize(x.title,40,360,24),fontWeight:700,whiteSpace:'nowrap'}}>{x.title}</span>
        </div>;})}
      </div>
      <div style={{position:'absolute',right:4,bottom:60,padding:'20px 32px',borderRadius:14,background:c.main,color:onColor(c.main),fontSize:29,fontWeight:800,opacity:ease((f-24)/14),transform:`translateY(${(1-ease((f-24)/14))*30}px)`}}>{p.badge || '语义驱动'}</div>
    </div>
  </Canvas>;
};

export const TechBento: React.FC<PageProps> = ({p,start,chapter})=>{
  const {f,fps,at}=useMotion(start);const c=preset(p);const items=(p.items || []).slice(0,4).map(item);const colors=[c.main,c.secondary,c.tertiary,c.main];
  const titleK=ease((f-at(p.titleAt,2))/14);
  const smallN=Math.max(1,items.length-1);const smallH=(590-(smallN-1)*18)/smallN;
  return <Canvas p={p} chapter={chapter}>
    <div style={{position:'absolute',left:100,top:156,fontSize:fitSize(p.title || '',66,1720,36),fontWeight:800,opacity:titleK,transform:`translateY(${(1-titleK)*20}px)`}}>{p.title}</div>
    {items.map((x:any,i:number)=>{const k=spring({frame:f-at(x.at,7+i*4),fps,config:{damping:22,stiffness:160}});const rect=i===0?{left:100,top:284,width:930,height:590}:{left:1050,top:284+(i-1)*(smallH+18),width:770,height:smallH};return <div key={i} style={{position:'absolute',...rect,padding:i===0?'52px':'24px 34px',boxSizing:'border-box',borderRadius:24,background:c.panel,border:`1px solid ${c.line}`,boxShadow:`0 15px 45px ${c.bg}25`,opacity:clamp(k),transform:`translateY(${(1-k)*42}px) scale(${.97+.03*k})`}}>
      <div style={{display:'flex',justifyContent:'space-between',fontFamily:MONO,fontSize:20,color:colors[i]}}><span>{String(i+1).padStart(2,'0')}</span><span>{x.label || (i===0?'KEY IDEA':'DETAIL')}</span></div>
      <div style={{marginTop:i===0?70:12,fontWeight:900,fontSize:fitSize(x.title,i===0?104:42,rect.width-(i===0?104:68),28),color:i===0?c.main:c.ink,whiteSpace:'nowrap'}}>{x.title}</div>
      {x.body && <div style={{marginTop:i===0?25:9,fontSize:fitSize(x.body,i===0?36:26,rect.width-(i===0?104:68),20),color:c.muted,whiteSpace:'nowrap'}}>{x.body}</div>}
      {i===0 && <svg width="810" height="150" viewBox="0 0 810 150" style={{position:'absolute',left:50,bottom:35}} aria-hidden><path d="M0 120 C 150 120 170 35 315 35 S 490 120 645 70 S 745 20 810 20" fill="none" stroke={c.secondary} strokeWidth="3" strokeDasharray="1000" strokeDashoffset={1000*(1-ease((f-18)/28))} /></svg>}
    </div>;})}
  </Canvas>;
};

export const TechFlow: React.FC<PageProps> = ({p,start,chapter})=>{
  const {f,fps,at}=useMotion(start);const c=preset(p);const items=(p.items || []).slice(0,4).map(item);const count=items.length;const gap=44;const width=(1720-gap*Math.max(0,count-1))/Math.max(1,count);const colors=[c.main,c.secondary,c.tertiary,c.main];
  const relay = p._motionDetail === 'relay' && count===3;
  const handoff = at(items[2]?.at, 35);
  return <Canvas p={p} chapter={chapter}>
    <div style={{position:'absolute',left:100,top:172,fontSize:fitSize(p.title || '',70,1720,36),fontWeight:900,opacity:ease((f-at(p.titleAt,2))/16)}}>{p.title}</div>
    {p.note && <div style={{position:'absolute',left:100,top:278,fontSize:30,color:c.muted,opacity:ease((f-at(p.noteAt,6))/12)}}>{p.note}</div>}
    {items.map((x:any,i:number)=>{const d=at(x.at,8+i*7),k=spring({frame:f-d,fps,config:{damping:22,stiffness:160}});const xPos=100+i*(width+gap);const link=ease((f-d-5)/18);return <React.Fragment key={i}>
      {i>0 && <svg width={gap} height="38" style={{position:'absolute',left:xPos-gap,top:528}} aria-hidden><path d={`M 0 19 L ${gap*link} 19`} stroke={colors[i]} strokeWidth="3" fill="none" />{link>0 && <rect x={Math.max(0,(f/45%1)*gap-3)} y="16" width="6" height="6" fill={colors[i]} opacity={link} />}</svg>}
      <div style={{position:'absolute',left:xPos,top:406,width,height:330,borderRadius:22,background:c.panel,border:`1px solid ${relay && i===2 && f>handoff+fps*.85 ? '#A9E6CA' : c.line}`,padding:'35px 28px',boxSizing:'border-box',opacity:clamp(k),transform:`translateY(${(1-k)*45}px)`}}>
        <div style={{fontFamily:MONO,color:colors[i],fontSize:24}}>0{i+1} / {x.label ?? (i===count-1?'OUTPUT':'PROCESS')}</div>
        <div style={{fontSize:fitSize(x.title,58,width-56,28),fontWeight:900,color:colors[i],marginTop:40,whiteSpace:'nowrap'}}>{x.title}</div>
        {x.body && <div style={{fontSize:fitSize(x.body,29,width-56,20),color:c.muted,marginTop:24,whiteSpace:'nowrap'}}>{x.body}</div>}
      </div>
    </React.Fragment>;})}
    {relay && <RelayTransfer frame={f} fps={fps} from={at(items[0].at,8)} handoff={handoff} context={at(p.noteAt,40)} caption={p._motionNote}/>}
  </Canvas>;
};
