import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
export type TimelineChapter={at:number;label:string};
export type TimelineProps={chapters:TimelineChapter[];brand?:string};
export function GlobalTimeline({chapters,brand='AI / 创作'}:TimelineProps){
 const frame=useCurrentFrame(),{fps,durationInFrames,width,height}=useVideoConfig(),s=height/1080,time=frame/fps,total=durationInFrames/fps;
 const list=[...chapters].sort((a,b)=>a.at-b.at);let active=0;list.forEach((c,i)=>{if(time>=c.at)active=i});
 const clock=(v:number)=>Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0');
 return <div data-global-timeline="persistent" style={{position:'absolute',top:0,left:0,width,height:42*s,zIndex:2147483647,background:'#f8f6ff',color:'#777182',borderBottom:'1px solid #c3bccf',boxSizing:'border-box',fontFamily:'"Noto Sans SC",sans-serif',fontSize:20*s,display:'flex',alignItems:'center',padding:'0 '+24*s+'px',gap:20*s,pointerEvents:'none'}}>
 <b style={{flexShrink:0,color:'#9c6b00',maxWidth:'18%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{brand}</b>
 <div style={{display:'flex',flex:1,minWidth:0,gap:12*s}}>{list.map((c,i)=><div key={i} style={{flex:1,minWidth:0,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',color:i===active?'#9c6b00':'#8c8794',fontWeight:i===active?900:500}}>{i===active?'● ':'· '}{c.label}</div>)}</div>
 <span style={{fontSize:18*s,flexShrink:0,fontVariantNumeric:'tabular-nums'}}>{clock(time)} / {clock(total)}</span>
 <div data-global-progress="true" style={{position:'absolute',left:0,bottom:0,height:3*s,width:Math.max(0,Math.min(1,frame/Math.max(1,durationInFrames-1)))*100+'%',background:'linear-gradient(90deg,#a67816,#7953bd,#248c93)'}}/>
 </div>;
}
export function WithGlobalTimeline({children,...props}:TimelineProps&{children:React.ReactNode}){return <AbsoluteFill>{children}<GlobalTimeline {...props}/></AbsoluteFill>}
