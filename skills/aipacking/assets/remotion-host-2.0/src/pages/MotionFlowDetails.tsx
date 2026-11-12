import React from 'react';
import { prog } from '../lib/anim';

const gold = '#FFCB75';
const mint = '#A9E6CA';
const paper = '#F8F0DF';
const purple = '#C6A6FF';
const font = '"Inter Tight","Noto Sans SC",sans-serif';

function Token({x,y,color = gold,scale = 1}: {x: number; y: number; color?: string; scale?: number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="3" rx="16" ry="12" fill="#503B2A"/>
    <ellipse cx="0" cy="0" rx="16" ry="12" fill={color}/>
    <path d="M -5 -3 H5 M-4 2 H4" stroke="#342A3D" strokeWidth="2.5" strokeLinecap="round"/>
  </g>;
}

export function MergeTokens({frame,fps,inputs,out}: {frame:number;fps:number;inputs:{y:number;at:number}[];out:number}) {
  const incoming=(from:number, y:number, color:string, index:number) => {
    const t = prog(frame,from,from+Math.round(fps*.64));
    if (t===0 || t===1) return null;
    const u=1-t;
    return <Token key={index} x={u**3*640+3*u*u*t*760+3*u*t*t*760+t**3*850}
      y={u**3*y+3*u*u*t*y+3*u*t*t*560+t**3*560} color={color}/>;
  };
  const forward = (at:number) => prog(frame,at,at+Math.round(fps*.61));
  const begin = out + Math.round(fps*.25);
  const arrivals=[begin,begin+Math.round(fps*.27),begin+Math.round(fps*.54)];
  return <svg width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden>
    {inputs.flatMap(({y,at},i)=>[0,1,2].map((j)=>incoming(at+Math.round(fps*(.27+.26*j)),y,i%2?mint:gold,i*3+j)))}
    {arrivals.map((a,i)=>{
      const t=forward(a);
      return t>0 && t<1 ? <Token key={i} x={1070+220*t} y={560} color={i%2?mint:gold} /> : null;
    })}
  </svg>;
}

export function MergeReceipt({frame,fps,out}: {frame:number;fps:number;out:number}) {
  return <svg width="150" height="66" style={{position:'absolute',right:31,top:24}} aria-hidden>
    <path d="M 21 50 Q 21 58 31 58 H 127 Q 137 58 137 50" stroke="#C6A6FF77" fill="none" strokeWidth="3"/>
    {[0,1,2].map(i=>{
      const at=out+Math.round(fps*(.86+i*.27)), k=prog(frame,at,at+Math.round(fps*.24));
      return <g key={i} opacity={k}><Token x={47+i*31} y={39-(1-k)*30} color={i===1?mint:gold} scale={.82}/></g>;
    })}
  </svg>;
}

export function RelayTransfer({frame,fps,from,handoff,context,caption}: {frame:number;fps:number;from:number;handoff:number;context:number;caption?:string}) {
  const start = 366, end = 1552, y=815;
  const enter=prog(frame,from,from+Math.round(fps*.38));
  const move=prog(frame,handoff,handoff+Math.round(fps*1.08));
  const arrived=prog(frame,handoff+Math.round(fps*.92),handoff+Math.round(fps*1.25));
  const note=prog(frame,context,context+Math.round(fps*.4));
  return <div style={{position:'absolute',inset:0,pointerEvents:'none',fontFamily:font,opacity:enter}}>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}} aria-hidden>
      <path d={`M${start} 737 V${y} H${end} V737`} stroke="#A496BA58" strokeWidth="3" fill="none"/>
      <path d={`M${start} ${y} H${start+(end-start)*move}`} stroke={mint} strokeWidth="4" fill="none"/>
      <circle cx={start} cy={y} r="6" fill={purple}/>
      <circle cx={end} cy={y} r={6+6*arrived} fill={mint} opacity={.3+.7*arrived}/>
    </svg>
    <div style={{position:'absolute',left:start+(end-start)*move,top:y-24,transform:'translateX(-50%)',
      background:move>=1?'#283E34':'#382C46',border:`1px solid ${move>=1?mint:purple}`,borderRadius:25,
      color:paper,padding:'7px 22px',fontWeight:760,fontSize:25}}>同一任务</div>
    {caption && <div style={{position:'absolute',left:100,top:881,color:'#D9CEDF',fontWeight:600,fontSize:24,opacity:note}}>
      {caption}
    </div>}
  </div>;
}
