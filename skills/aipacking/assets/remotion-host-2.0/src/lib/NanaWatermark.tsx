import React from 'react';

type WatermarkProps = {frame:number; color?:string; opacity?:number; top?:number; size?:number};

export function NanaWatermark({frame,color='#dbc3e8',opacity=.067,top=370,size=268}: WatermarkProps) {
  if (opacity <= 0) return null;
  const phase = (frame % 480) / 480;
  const x = 160 + 580 * (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return <div aria-hidden="true" data-nana-watermark="single" style={{
    position:'absolute',left:x,top,fontFamily:'Arial',fontSize:size,fontWeight:900,
    lineHeight:1,letterSpacing:-size*.061,whiteSpace:'nowrap',color,opacity,pointerEvents:'none',
  }}>NANA</div>;
}
