import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type FeatureListProps = {eyebrow?: string; title?: string; features?: string[]; accent?: string};

export const FeatureList: React.FC<FeatureListProps> = ({eyebrow='Why teams switch',title='Built for velocity.',features=['Discover by intent','Edit the source','Render deterministically'],accent='#ff7048'}) => {
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <AbsoluteFill style={{color:'#171713',fontFamily:'Arial, sans-serif',padding:'86px 100px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80}}>
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}><div style={{fontSize:20,textTransform:'uppercase',letterSpacing:4,color:accent}}>{eyebrow}</div><div style={{fontSize:112,fontWeight:760,lineHeight:.9,letterSpacing:-7,maxWidth:720}}>{title}</div><div style={{width:64,height:64,borderRadius:99,backgroundColor:accent}}/></div>
    <div style={{alignSelf:'center',borderTop:'2px solid #c9c3b7'}}>{features.map((feature,index)=>{const enter=spring({frame:frame-12-index*14,fps,config:{damping:20}});return <div key={feature} style={{height:150,borderBottom:'2px solid #c9c3b7',display:'grid',gridTemplateColumns:'70px 1fr',alignItems:'center',opacity:enter,translate:`${interpolate(enter,[0,1],[45,0])}px 0`}}><span style={{fontSize:17,color:'#888278'}}>0{index+1}</span><span style={{fontSize:38,fontWeight:700,letterSpacing:-1.5}}>{feature}</span></div>})}</div>
  </AbsoluteFill>;
};
