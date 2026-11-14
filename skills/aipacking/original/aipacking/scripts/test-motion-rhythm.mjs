import fs from'node:fs';import assert from'node:assert/strict';import{checkMotionRhythm}from'./check-motion-rhythm.mjs';
const root=process.argv[2];if(!root)throw Error('Pass the current production fixture directory');
const valid=JSON.parse(fs.readFileSync(root+'/plan/plan.json','utf8'));assert.deepEqual(checkMotionRhythm(valid).errors,[]);
const renamed=structuredClone(valid);for(const [i,s]of renamed.scenes.entries()){s.type='InventedUniqueName'+i;s.props.templateKey='native--quote';s.visual.templateId='quote';delete s.props.design}assert.ok(checkMotionRhythm(renamed).errors.some(x=>x.includes('repeats')),'Component aliases must not bypass actual source identity');
const style=structuredClone(valid);for(let i=0;i<3;i++){style.scenes[i].props.templateKey=['native--quote','broadside--quote','peoplesPlatform--quote'][i];delete style.scenes[i].props.design;style.scenes[i].visual.templateId='quote'}assert.ok(checkMotionRhythm(style).errors.some(x=>x.includes('repeats 3')),'Style changes must collapse to the same source ID');
const decorative=structuredClone(valid);decorative.scenes[0].motionBeats.push({time:1,kind:'glow',action:'blink'});assert.ok(checkMotionRhythm(decorative).errors.some(x=>x.includes('decorative')));
const gap=structuredClone(valid);gap.scenes[0].end=7;gap.scenes[1].start=7;gap.scenes[1].motionBeats=[{time:7,kind:'structural',action:'new scene'}];assert.ok(checkMotionRhythm(gap).errors.some(x=>x.includes('no effective visual change')));
console.log('PASS actual fixture plus four regressions: aliases, skin variants, decorative beats, long gaps');
