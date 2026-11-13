import React from 'react';
import {Img,staticFile} from 'remotion';
import {RP,ease,Frame,Presenter,personProps,Card,T,Badge,Stroke} from './ReferencePack';
const F='"Noto Sans SC","Inter Tight",sans-serif';
const pos=(x:number,y:number,w:number,h?:number,extra:any={})=>({position:'absolute' as const,left:x,top:y,width:w,height:h,...extra});
/** Actual text spans own their highlights; no full-width generic sweep. */
export const ReadingPanel=({p,f,x=0,y=0,w=1000,h=720}:any)=>{
 const lines=p.content||[],active=Math.min(lines.length-1,Math.floor(Math.max(0,f-12)/(p.readStepFrames||30))),compact=h<420;
 return <div style={pos(x,y,w,h,{background:'#faf8ef',borderRadius:12,padding:compact?'22px 32px':'32px 42px',boxSizing:'border-box',overflow:'hidden',color:RP.ink,fontFamily:F})}>
 <div style={{fontSize:Math.max(18,Math.min(compact?29:38,w/18)),fontWeight:900,borderBottom:'1px solid #26303933',paddingBottom:compact?14:22,marginBottom:compact?14:25}}>{p.documentTitle||'口播内容摘录'}</div>
 <div style={{fontSize:compact?18:22,color:'#66716c',marginBottom:compact?12:20}}>{p.evidenceKind==='transcript-excerpt'?'来自本次口播 · 文字整理':'复刻练习 · 内容示意'}</div>
 {lines.map((line:string,i:number)=>{const words=line.split(/(、|，|和|与|的|不是|而是|→)/).filter(Boolean);return <p key={i} style={{fontSize:p.bodySize||Math.max(20,Math.min(compact?29:37,w/24)),lineHeight:1.6,margin:compact?'14px 0':'22px 0',fontWeight:i===active?800:500,color:p.variant==='highlight'&&i!==active?'#9a9b91':RP.ink}}>{words.map((word:string,j:number)=>{const q=p.variant==='highlight'&&i===active?ease(f,12+i*(p.readStepFrames||30)+j*3,22+i*(p.readStepFrames||30)+j*3):0;return <span key={j} style={{backgroundImage:`linear-gradient(${RP.gold}bb,${RP.gold}bb)`,backgroundRepeat:'no-repeat',backgroundPosition:'0 80%',backgroundSize:`${q*100}% 55%`}}>{word}</span>})}</p>})}
 </div>;
};
export const DigitRoll=({text,f=0,x=0,y=0,w=650,size=135,color=RP.gold,delay=0}:any)=>{
 const q=ease(f,delay,delay+22);
 return <div style={pos(x,y,w,size*1.2,{overflow:'hidden',fontFamily:F,fontSize:size,fontWeight:900,color,display:'flex',alignItems:'flex-start',letterSpacing:-4})}>{Array.from(String(text)).map((c,i)=><div key={i} style={{height:size*1.2,overflow:'hidden',width:/[0-9]/.test(c)?size*.68:size*.72}}>{/[0-9]/.test(c)?<div style={{transform:`translateY(${-3*size*1.2*(1-ease(f,delay+i*2,delay+22+i*2))}px)`}}>{[c,(Number(c)+7)%10,(Number(c)+3)%10,c].map((d,j)=><div key={j} style={{height:size*1.2,lineHeight:1.2}}>{d}</div>)}</div>:<div style={{lineHeight:1.2}}>{c}</div>}</div>)}</div>;
};
export const SemanticGraphic=({label,f,w=300,h=220,index=0}:any)=><div style={{position:'absolute',left:18,top:122,width:w,height:h}}>
 <svg width={w} height={h} viewBox="0 0 300 240"><g fill="none" stroke={[RP.gold,RP.cyan,RP.green,RP.red][index%4]} strokeWidth="3">
 {index===0?<><rect x="14" y="80" width="75" height="65" rx="8"/><rect x="205" y="20" width="78" height="65" rx="8"/><rect x="205" y="137" width="78" height="65" rx="8"/><path d="M89 112H145V52H205 M145 112V169H205" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ease(f,0,24)}/></>:index===1?<><rect x="16" y="18" width="265" height="180" rx="9"/><path d="M16 50H281M88 50V198"/>{[0,1,2].map(i=><rect key={i} x={110+(i%2)*85} y={72+Math.floor(i/2)*66} width="66" height="49" rx="5" opacity={ease(f,i*5,i*5+14)}/>)}<path d="M31 74H70M31 92H70M31 110H70"/></>:index===2?<><rect x="16" y="18" width="265" height="172" rx="9"/><path d="M122 54L122 145L199 101Z" fill={RP.green+'33'}/><path d="M32 169H261" strokeDasharray="220" strokeDashoffset={220*(1-ease(f,0,25))}/></>:<><rect x="16" y="18" width="265" height="180" rx="9"/><path d="M16 50H281M35 80H110M35 111H140M35 142H175" opacity={ease(f,0,20)}/><rect x="198" y="78" width="61" height="29" rx="14" fill={f>20?RP.red+'44':'none'}/><circle cx={f>20?244:213} cy="93" r="9" fill={RP.red}/><path d="M240 128L240 165L251 152L265 156Z" fill={RP.paper}/></>}
 </g><text x="150" y="225" textAnchor="middle" fill={RP.muted} fontSize="18" fontFamily={F}>结构示意</text></svg>
 </div>;

/** Original ref56 geometry generalized to five literal business stages, no invented metrics. */
export const V3Pipeline=({p,f}:any)=>{
 const stages=p.steps||[],w=stages.length===5?265:300,gap=stages.length===5?26:50,x0=stages.length===5?330:390;
 const sourceWidth=stages.length===5?225:265;
 return <Frame p={p} f={f}><Presenter {...personProps(p,f)} circle/>
 <ReadingPanel p={{...p,content:[p.sourceLabel||'内容'],documentTitle:'输入材料'}} f={f} x={70} y={110} w={sourceWidth} h={390}/>
 {stages.map((label:string,i:number)=>{const x=x0+i*(w+gap),at=14+i*18;return <React.Fragment key={label}>{i>0&&<svg width={gap} height="70" style={pos(x-gap,285,gap,70)}><Stroke d={`M0 35H${gap-2}l-8 -8 M${gap-2} 35l-8 8`} f={f} delay={at-5}/></svg>}<Card x={x} y={255} w={w} h={125} f={f} delay={at} color={i===stages.length-1?RP.cyan:RP.gold} title={`0${i+1}`}><T x={20} y={58} w={w-40} size={42}>{label}</T></Card><Card x={x} y={435} w={w} h={285} f={f} delay={at+8} color={[RP.gold,RP.cyan,RP.red,RP.green][i%4]} title={label}><T x={22} y={80} w={w-44} size={29}>{p.stepNotes?.[i]||label}</T><div style={pos(22,220,(w-44)*ease(f,at+15,at+35),5,{background:RP.gold})}/></Card></React.Fragment>})}
 <Badge text={p.headline||'全链路'} x={780} y={105} f={f} rot={-2}/>
 <svg width="1400" height="130" style={pos(300,790,1400,130)}><Stroke d="M0 90 C220 110 930 110 1350 25" f={f} delay={70} color={RP.cyan}/></svg>
 </Frame>;
};
