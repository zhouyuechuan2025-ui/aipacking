import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {MotionElements,type MotionElement} from '../pages/MotionElements';
import keyframes from './keyframes.json';
import semantic from './semantic.json';

export const motionIds = [...Object.keys(semantic), ...Object.keys(keyframes)];
export const perPage = 12;
export const pageFrames = 60;

export function MotionGallery() {
  const frame = useCurrentFrame();
  const page = Math.floor(frame/pageFrames);
  const first = page*perPage;
  const ids = motionIds.slice(first,first+perPage);
  const start = page*pageFrames/30;
  const isSemantic = (id:string): id is keyof typeof semantic => Object.prototype.hasOwnProperty.call(semantic,id);
  const labels:Record<string,string[]> = {
    rail:['准备素材','逐段排镜','检查结果'], checklist:['核对原声','检查字幕','导出预览'],
    ribbon:['实拍素材','原声保留'], 'word-mask':['顺着原词','逐行揭示'],
    'type-line':['查找原始出处'], compare:['选择甲','选择乙'], swap:['等待预览','预览就绪'],
    verdict:['先出整片','先审预览'], flow:['原稿','分镜','预览'], merge:['原声','字幕','分镜'],
    branch:['选择格式','横屏','透明层'], bars:['方案甲','方案乙','方案丙'], count:['预览片段'],
    timeline:['准备','预览','成片'], 'focus-box':['看这一行'], 'scan-line':['逐行阅读'],
    'stack-fan':['原片','截图','流程'], pin:['核对出处'],
  };
  const positions = ids.map((_,i) => ({x:65+i%3*605,y:175+Math.floor(i/3)*209,width:564,height:144}));
  const elements: MotionElement[] = ids.map((id,i) => {
    const pos = positions[i];
    if (!isSemantic(id)) return {...pos,kind:'motion',text:keyframes[id as keyof typeof keyframes].name,
      animation:id,animationDuration:1,at:start,duration:2};
    return {...pos,kind:'semantic',preset:id,at:start,duration:2,itemsData:labels[id].map((text,j) =>
      ({text,at:start+j*.21,...(id==='bars'||id==='count'?{value:[7,4,6][j],unit:'项'}:{})}))};
  });
  return <AbsoluteFill style={{background:'#17141D',color:'#FFF5E9',fontFamily:'"Inter Tight","Noto Sans SC",sans-serif'}}>
    <div style={{position:'absolute',left:65,top:44,fontSize:50,fontWeight:850}}>aipacking <span style={{color:'#FFB08D'}}> / 动效图鉴</span></div>
    <div style={{position:'absolute',right:65,top:55,fontSize:25,color:'#DACBD7'}}>样例 {first+1}–{first+ids.length} / {motionIds.length}</div>
    {ids.map((id,i) => {
      const {x,y,width,height} = positions[i];
      return <React.Fragment key={id}>
        <div style={{position:'absolute',left:x,top:y-35,width,fontSize:20,color:'#DCCCD8'}}>{String(first+i+1).padStart(3,'0')} · {id}</div>
        <div style={{position:'absolute',left:x,top:y,width,height,boxSizing:'border-box',border:'1px solid #F4D9DE35',
          borderRadius:12,background:'linear-gradient(145deg,#242031,#191621)'}}/>
      </React.Fragment>;
    })}
    <MotionElements key={first} elements={elements} start={0} accent="#FFB08D"/>
  </AbsoluteFill>;
}
