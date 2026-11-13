import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const args=process.argv.slice(2),pos=args.filter(x=>!x.startsWith('--'));
if(pos.length!==3)throw Error('Usage: mix-audio.mjs <project> <rendered.mp4> <new-output.mp4> [--check]');
const [root,input,output]=pos.map(x=>path.resolve(x)),plan=JSON.parse(fs.readFileSync(path.join(root,'plan/plan.json'),'utf8'));
const audio=plan.audio;if(!audio||(!audio.music&&!(audio.cues||[]).length)){console.log('No audio additions configured; no file modified');process.exit(0);}
if(input===output||fs.existsSync(output))throw Error('Use a new output path');
const probe=p=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',p]).toString());
const meta=probe(input);if(!meta.streams.some(x=>x.codec_type==='audio'))throw Error('Base must contain narration');
const duration=+meta.format.duration,base=fs.realpathSync(path.join(root,'public'));
const time=(v,n)=>{if(!Number.isFinite(v)||v<0||v>=duration)throw Error('Invalid '+n);return v;};
const db=(v,d)=>{v=v??d;if(!Number.isFinite(v)||v>0||v< -90)throw Error('Invalid gain');return v;};
const file=m=>{if(typeof m.src!=='string'||path.isAbsolute(m.src))throw Error('Use public-relative src');const p=fs.realpathSync(path.join(base,m.src));if(!p.startsWith(base+path.sep))throw Error('Source escapes public');const x=probe(p);if(!x.streams.some(x=>x.codec_type==='audio'))throw Error('Source has no audio');return {path:p,duration:+x.format.duration};};
const cmd=['-v','error','-n','-i',input],filters=['[0:a]aresample=48000[a0]'],labels=['[a0]'];let idx=1;
if(audio.music){const m=audio.music,s=file(m),start=time(m.start??0,'music.start'),end=m.end??duration;if(!Number.isFinite(end)||end<=start||end>duration+.01)throw Error('Invalid music.end');let expr=String(10**(db(m.gainDb,-24)/20));
 for(const d of m.duck||[]){time(d.start,'duck.start');if(!Number.isFinite(d.end)||d.end<=d.start||d.end>duration)throw Error('Invalid duck.end');const g=10**(db(d.gainDb,-12)/20),fade=Math.min(.04,(d.end-d.start)/2);expr+=`*(1+(${g}-1)*min(max(0,min(1,(t-${d.start})/${fade})),max(0,min(1,(${d.end}-t)/${fade}))))`;}
 if(m.loop===true)cmd.push('-stream_loop','-1');cmd.push('-i',s.path);const len=Math.min(end-start,m.loop===true?duration:s.duration);
 // Automation clock is the project clock, including a delayed music start.
 expr=expr.replace(/\bt\b/g,`(t+${start})`);
 filters.push(`[${idx}:a]aresample=48000,atrim=duration=${len},asetpts=PTS-STARTPTS,volume='${expr}':eval=frame,afade=t=in:d=0.06,afade=t=out:st=${Math.max(0,len-.12)}:d=0.12,adelay=${Math.round(start*1000)}:all=1[a${idx}]`);labels.push(`[a${idx++}]`);
}
for(const c of audio.cues||[]){const s=file(c),at=time(c.at,'cue.at');cmd.push('-i',s.path);filters.push(`[${idx}:a]aresample=48000,asetpts=PTS-STARTPTS,volume=${10**(db(c.gainDb,-16)/20)},afade=t=out:st=${Math.max(0,s.duration-.03)}:d=0.03,adelay=${Math.round(at*1000)}:all=1[a${idx}]`);labels.push(`[a${idx++}]`);}
filters.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first:dropout_transition=0,alimiter=limit=0.8913:level=0:latency=1[mix]`);
if(args.includes('--check')){console.log(`PASS: ${labels.length-1} additions, sources and timing valid; no file modified`);process.exit(0);}
fs.mkdirSync(path.dirname(output),{recursive:true});execFileSync('ffmpeg',[...cmd,'-filter_complex',filters.join(';'),'-map','0:v:0','-map','[mix]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',String(duration),output],{stdio:'inherit'});console.log('Mixed to new file: '+output);
