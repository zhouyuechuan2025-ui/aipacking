import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

export type ProductTimelineProps = {title?: string; milestones?: string[]; accent?: string};

export const ProductTimeline: React.FC<ProductTimelineProps> = ({title='A launch in four moves',milestones=['Brief','Compose','Review','Publish'],accent='#4ad9ff'}) => {
  const frame=useCurrentFrame();const progress=interpolate(frame,[12,105],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{backgroundColor:'#08161c',color:'#eefaff',fontFamily:'Arial, sans-serif',padding:'88px 100px'}}>
    <div style={{fontSize:22,letterSpacing:4,textTransform:'uppercase',color:accent}}>Product workflow</div><div style={{fontSize:76,fontWeight:760,letterSpacing:-4,marginTop:22}}>{title}</div>
    <div style={{position:'relative',marginTop:180,display:'grid',gridTemplateColumns:`repeat(${milestones.length},1fr)`,gap:24}}><div style={{position:'absolute',left:30,right:30,top:24,height:6,backgroundColor:'#20343c'}}/><div style={{position:'absolute',left:30,top:24,height:6,width:`calc((100% - 60px) * ${progress})`,backgroundColor:accent,boxShadow:`0 0 24px ${accent}`}}/>{milestones.map((milestone,index)=>{const threshold=index/Math.max(1,milestones.length-1);const active=progress>=threshold;return <div key={milestone} style={{position:'relative'}}><div style={{width:54,height:54,borderRadius:99,backgroundColor:active?accent:'#20343c',border:'8px solid #08161c',boxShadow:active?`0 0 24px ${accent}66`:'none'}}/><div style={{fontSize:31,fontWeight:700,marginTop:32,color:active?'#eefaff':'#53666e'}}>{milestone}</div><div style={{fontSize:16,color:'#61747c',marginTop:12}}>Step {String(index+1).padStart(2,'0')}</div></div>})}</div>
  </AbsoluteFill>;
};
