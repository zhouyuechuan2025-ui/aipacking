import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fitSize} from '../lib/fit';
import {onColor} from '../lib/theme';

const panel = '#201B2A';
const light = '#FFF6E9';
const line = '#EADFFF42';
const easing = (x:number) => 1-Math.pow(1-x,3);
type Item = {text:string; value?:number; unit?:string; at?:number};

export function SemanticMotion({id,items,width,height,color,startFrame}: {
  id:string; items:Item[]; width:number; height:number; color:string; startFrame:number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ink = onColor(color);
  const labels = items.map(item => item.text);
  const timing = (i:number) => items[i]?.at == null ? i*.18*fps : Math.round(items[i].at!*fps)-startFrame;
  const tween = (i:number,span=.32) => interpolate(frame,[timing(i),timing(i)+Math.max(1,fps*span)],[0,1],
    {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing});
  const vertical = ['rail','checklist','ribbon','word-mask','verdict','bars'].includes(id);
  const font = (text:string,available=width-28) => {
    const rowHeight=vertical ? (height-6-8*Math.max(0,labels.length-1))/Math.max(1,labels.length) : height;
    return fitSize(text,Math.min(43,Math.max(11,rowHeight*.65)),available,11);
  };
  const card:React.CSSProperties = {
    display:'flex',alignItems:'center',justifyContent:'center',gap:9,minWidth:0,minHeight:0,lineHeight:1.1,
    border:'1px solid '+line,borderRadius:12,background:panel,color:light,fontWeight:800,
  };
  const title = (text:string,available?:number) => <span style={{fontSize:font(text,available),whiteSpace:'nowrap'}}>{text}</span>;
  const group:React.CSSProperties = {display:'flex',flexDirection:'row',alignItems:'stretch',gap:8,padding:3,justifyContent:'center'};
  const list:React.CSSProperties = {...group,flexDirection:'column'};
  const p = tween(0);
  const center:React.CSSProperties = {display:'grid',placeItems:'center',inset:'8% 5%',position:'absolute'};

  switch (id) {
    case 'rail':
    case 'checklist':
      return <AbsoluteFill style={list}>{labels.map((text,i) => {
        const k=tween(i);
        return <div key={i} style={{...card,justifyContent:'flex-start',padding:'0 12px',flex:1,opacity:k,
          transform:'translateX('+((1-k)*-36)+'px)',boxShadow:'inset '+(k*4)+'px 0 '+color}}>
          <span style={{color,fontWeight:900,fontSize:Math.min(25,height/labels.length*.5)}}>{id==='rail' ? String(i+1).padStart(2,'0') : '✓'}</span>
          {title(text,width-84)}</div>;
      })}</AbsoluteFill>;
    case 'ribbon':
    case 'word-mask':
      return <AbsoluteFill style={list}>{labels.map((text,i) => <div key={i} style={{...card,flex:1,
        background:id==='ribbon' && i===1 ? color : panel,color:id==='ribbon' && i===1 ? ink : light,
        clipPath:'inset(0 '+((1-tween(i))*100)+'% 0 0)'}}>{title(text)}</div>)}</AbsoluteFill>;
    case 'type-line': {
      const text=Array.from(labels[0] ?? '');
      const shown=text.slice(0,Math.floor(tween(0,.64)*text.length)).join('');
      return <div style={{...center,...card,justifyContent:'flex-start',padding:'0 15px',opacity:p}}>
        <span style={{color,fontWeight:850}}>›</span>{title(shown)}
        <div style={{width:3,height:Math.min(28,height*.46),background:color,opacity:Math.floor(frame/8)%2 ? 1 : .32}}/>
      </div>;
    }
    case 'compare':
      return <AbsoluteFill style={group}>{labels.map((text,i) => <div key={i} style={{...card,flex:1,opacity:tween(i),borderBottom:'4px solid '+color,
        transform:'translateX('+((i===0?-1:1)*(1-tween(i))*50)+'px)'}}>{title(text,width/2-20)}</div>)}</AbsoluteFill>;
    case 'swap':
      return <>{labels.map((text,i) => {
        const k=tween(i), shift=i===0?tween(1):0;
        return <div key={i} style={{...center,...card,opacity:k*(1-shift),
          background:i===1?color:panel,color:i===1?ink:light,transform:'translateY('+((1-k-shift)*height*.55)+'px)'}}>{title(text)}</div>;
      })}</>;
    case 'verdict':
      return <AbsoluteFill style={list}>{labels.map((text,i) => <div key={i} style={{...card,flex:1,position:'relative',
        opacity:tween(i),background:i===1?color:panel,color:i===1?ink:light}}>
        {title(text)}{i===0 && <span style={{position:'absolute',width:(tween(1)*73)+'%',height:3,background:color}}/>}
      </div>)}</AbsoluteFill>;
    case 'flow':
      return <AbsoluteFill style={{...group,alignItems:'center'}}>{labels.map((text,i) => <React.Fragment key={i}>
        {i>0 && <span style={{color,opacity:tween(i),transform:'scaleX('+tween(i)+')'}}>→</span>}
        <div style={{...card,flex:1,height:'60%',opacity:tween(i)}}>{title(text,(width-(labels.length-1)*24)/labels.length-8)}</div>
      </React.Fragment>)}</AbsoluteFill>;
    case 'merge':
    case 'branch': {
      const merge=id==='merge';
      const groupItems=merge?labels.slice(0,-1):labels.slice(1);
      const single=merge?labels.length-1:0;
      const column:React.CSSProperties = {display:'flex',flexDirection:'column',gap:5,flex:1,padding:'4px 0'};
      const ends = <div style={column}>{groupItems.map((text,i) => {
        const j=merge?i:i+1;
        return <div key={j} style={{...card,flex:1,opacity:tween(j)}}>{title(text,width*.36-14)}</div>;
      })}</div>;
      const one = <div style={{...card,width:'35%',alignSelf:'center',height:'48%',background:color,color:ink,opacity:tween(single)}}>{title(labels[single],width*.35-14)}</div>;
      return <AbsoluteFill style={group}>{merge?ends:one}
        <svg width="20%" height="100%" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden>
          {groupItems.map((_,i) => <path key={i} d={merge?'M0 '+((i+.5)*100/groupItems.length)+' Q52 50 80 50':'M0 50 Q32 50 80 '+((i+.5)*100/groupItems.length)}
            pathLength={1} stroke={color} strokeWidth={3} fill="none" strokeDasharray="1 1" strokeDashoffset={1-tween(merge?single:i+1)}/>)}
        </svg>{merge?one:ends}</AbsoluteFill>;
    }
    case 'bars': {
      const max = Math.max(1,...items.map(item=>item.value ?? 0));
      return <AbsoluteFill style={list}>{items.map((item,i) => <div key={i} style={{...card,position:'relative',
        justifyContent:'space-between',flex:1,padding:'0 10px',overflow:'hidden',opacity:tween(i)}}>
        <div style={{position:'absolute',inset:'auto auto 0 0',height:5,background:color,width:(tween(i,.48)*(item.value ?? 0)/max*100)+'%'}}/>
        {title(item.text,width*.63)}{title(String(item.value)+(item.unit ?? ''),width*.28)}
      </div>)}</AbsoluteFill>;
    }
    case 'count': {
      const value=items[0]?.value ?? 0;
      const text=new Intl.NumberFormat('en-US',{maximumFractionDigits:3,useGrouping:false}).format(value*tween(0,.52))+(items[0]?.unit ?? '');
      return <div style={{...center,...card,opacity:p,display:'flex',gap:14,fontVariantNumeric:'tabular-nums',boxShadow:'inset 0 -4px '+color}}>
        {title(labels[0] ?? '',width*.4)}<span style={{color,fontWeight:900,fontSize:fitSize(text,Math.min(68,height*.6),width*.48,18)}}>{text}</span>
      </div>;
    }
    case 'timeline':
      return <AbsoluteFill style={{...group,alignItems:'center'}}>
        <div style={{position:'absolute',left:'5%',top:'38%',height:3,width:(tween(labels.length-1,.45)*90)+'%',background:color}}/>
        {labels.map((text,i) => <div key={i} style={{flex:1,display:'grid',justifyItems:'center',gap:6,opacity:tween(i),position:'relative'}}>
          <div style={{width:14,height:14,borderRadius:'50%',background:color}}/>{title(text,width/labels.length-12)}</div>)}
      </AbsoluteFill>;
    case 'focus-box':
    case 'scan-line':
      return <AbsoluteFill>
        <svg width={width} height={height} viewBox={'0 0 '+width+' '+height} aria-hidden>
          {id==='focus-box' ? ['M4 24 V4 H24',`M${width-24} 4 H${width-4} V24`,`M4 ${height-24} V${height-4} H24`,`M${width-24} ${height-4} H${width-4} V${height-24}`].map(d =>
            <path key={d} d={d} pathLength={1} fill="none" stroke={color} strokeWidth={4} strokeDasharray="1 1" strokeDashoffset={1-p}/>)
            : <path d={'M8 '+(8+(height-16)*tween(0,.68))+' H'+(width-8)} stroke={color} strokeWidth={4} opacity={p}/>}
        </svg>
        {labels[0] && <div style={{position:'absolute',right:10,top:8,...card,padding:'3px 9px',opacity:p}}>{title(labels[0])}</div>}
      </AbsoluteFill>;
    case 'stack-fan':
      return <>{labels.map((text,i) => {
        const k=tween(i);
        return <div key={i} style={{...card,position:'absolute',left:(5+i*7)+'%',right:(23-i*6)+'%',height:'34%',top:(i*28+4)+'%',
          opacity:k,transform:'translateX('+((1-k)*-55)+'px) rotate('+((1-k)*-12+(i-1)*2)+'deg)'}}>{title(text,width*.6)}</div>;
      })}</>;
    case 'pin':
      return <AbsoluteFill>
        <svg width={width} height={height} viewBox={'0 0 '+width+' '+height} aria-hidden>
          <circle cx={10} cy={height-11} r={5*p} fill={color}/>
          <path d={`M10 ${height-11} L${width*.31} ${height*.52} H${width*.55}`} pathLength={1} fill="none" stroke={color}
            strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={1-p}/>
        </svg>
        <div style={{...card,position:'absolute',right:4,top:'21%',padding:'4px 10px',opacity:tween(0,.5)}}>{title(labels[0],width*.67-18)}</div>
      </AbsoluteFill>;
    default:
      return null;
  }
}
