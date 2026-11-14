// Pure, seek-safe object tracks. These functions are shared by rendering and boundary tests.
export const clamp=x=>Math.min(1,Math.max(0,x));
export const E=(t,a,b)=>{const k=clamp((t-a)/(b-a));return k*k*(3-2*k)};
export const mix=(a,b,k)=>a+(b-a)*k;
export const R=(x,y,w,h,r=14)=>({x,y,w,h,r});
export const blend=(a,b,k)=>Object.fromEntries(Object.keys(a).map(n=>[n,mix(a[n],b[n]??a[n],k)]));
export function track(t,keys){let last=keys[0][1];if(t<=keys[0][0])return {...last};for(let i=1;i<keys.length;i++){if(t<=keys[i][0])return blend(last,keys[i][1],E(t,keys[i-1][0],keys[i][0]));last=keys[i][1]}return {...last}}
export const FULL=R(0,42,1920,1038,0),LEFT=R(65,90,470,790),SMALL=R(65,90,420,390),CIRCLE=R(35,800,252,252,126);
export const actorTrack=t=>track(t,[
 [0,FULL],[7.75,FULL],[8.4,LEFT],[13.25,LEFT],[13.7,CIRCLE],[17.15,CIRCLE],[17.55,FULL],[19.25,FULL],
 [41.25,LEFT],[43.5,LEFT],[43.8,SMALL],[47.4,SMALL],[47.85,LEFT],[49.4,LEFT],[49.65,FULL],
 [60.17,FULL],[60.55,LEFT],[72.47,LEFT],[87.4,FULL],[91.7,FULL],[92.05,LEFT],[96.77,LEFT],
 [102.5,CIRCLE],[106.03,CIRCLE],[106.35,FULL],[109.4,FULL],[109.7,CIRCLE],[117.53,CIRCLE],[117.88,LEFT],[124.3,LEFT],
 [135.57,FULL],[140.5,FULL],[140.85,LEFT],[142.2,LEFT],[142.55,CIRCLE],[152.0,CIRCLE],[152.5,CIRCLE],[152.8,FULL],
 [162.5,FULL],[162.85,LEFT],[170.2,LEFT],[176.1,LEFT],[176.45,CIRCLE],[185.1,CIRCLE],[185.65,FULL],[198.201,FULL]
]);
export const POST=R(600,80,1250,850),POST_FULL=R(50,80,1800,880);
export function articleTrack(t){
 if(t<20)return track(t,[[7.75,R(1990,80,1250,850)],[8.4,POST],[10.9,POST],[11.25,R(565,80,1030,850)],[13.25,R(565,80,1030,850)],[13.7,POST_FULL],[17.15,POST_FULL],[17.55,R(1520,70,350,450)],[18.05,R(1990,70,350,450)]]);
 return track(t,[[41.25,POST],[43.5,POST],[43.85,R(535,80,1315,390)],[47.4,R(535,80,1315,390)],[47.8,R(1980,80,1315,390)]]);
}
export const methodIds=['writing','diagram','web','video'];
export function methodTrack(t,id){
 const i=methodIds.indexOf(id),base=R(60+i*455,525,430,400),grid=R(710+(i%2)*555,100+Math.floor(i/2)*410,520,385);
 const final=[R(710,650,330,260),R(1080,610,330,135),R(1080,755,330,135),R(1450,390,330,520)][i];
 return track(t,[[43.5,base],[47.4,base],[47.85,grid],[48.1,grid],[49.05,final]]);
}
export function reportBlockTrack(t,id){
 const i=id==='results'?0:1,origin=i?R(110,610,1670,275):R(110,220,1670,350),target=i?R(900,545,935,355):R(900,105,935,395);
 return blend(origin,target,E(t,i?115.1:114.5,i?115.65:114.95));
}
export function flowTransform(t){return blend(R(0,0,1920,1000,0),R(1420,210,400,300,18),E(t,185.1,185.48))}
export function frameTime(frame,study,sourceStart=0){return study?Math.floor(frame*.5):sourceStart+frame}
export function sceneAt(t,scenes){return scenes.find(s=>t>=s.referenceStart&&t<s.referenceEnd)||scenes.at(-1)}
export const CONTINUITY_IDS={presenter:'presenter-primary',article:'evidence-primary',methods:methodIds,report:['report-results','report-decisions'],product:'product-skill',flow:'workflow-primary'};
export const CHAIN_RANGES={opening:[0,19.25],methods:[41.25,72.47],structure:[87.4,96.77],report:[102.5,124.3],examples:[135.57,162.5],delivery:[162.5,198.201]};
export function referenceClock(frame,stages){let at=0;for(let i=0;i<stages.length;i++){const s=stages[i];if(frame<at+s.frames||i===stages.length-1)return mix(s.referenceStart,s.referenceEnd,clamp((frame-at)/s.frames));at+=s.frames}throw Error('Empty stageMap')}
