import fs from 'node:fs';

const folder = 'skills/aipacking/assets/remotion-host-2.0/src/motion/';
const read = file => JSON.parse(fs.readFileSync(folder+file,'utf8'));
const entries = Object.entries(read('semantic.json'));
const keyframes = Object.entries(read('keyframes.json'));
const phases = {entry:'入场',exit:'离场',emphasis:'强调'};
const output = [
  '# aipacking 3.0 动效索引',
  '',
  '下面的 ID 可以直接写入分镜。既有模板与八种旧叠加元素另见[原目录](../skills/aipacking/references/motion-library.md)。',
  '',
  '## 内容动效',
  '',
  '在 elements 中用 kind 为 semantic、preset 为下表 ID，每项内容通过 itemsData 指定 text 和 at。',
  '',
  '| ID | 名称 | 用法 | 条目数 |',
  '| --- | --- | --- | --- |',
  ...entries.map(([id,e]) => `| \`${id}\` | ${e.name} | ${e.use} | ${e.min}–${e.max} |`),
];
for (const [source,title,url] of [
  ['animate','Animate.css','https://github.com/animate-css/animate.css/tree/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c'],
  ['magic','Magic CSS','https://github.com/miniMAC/magic/tree/f26d3c3beaf3017c90fb27ac6f67168fac26de06'],
]) {
  const subset=keyframes.filter(([,e])=>e.source===source);
  output.push('',`## ${title} · ${subset.length} 项`,'',
    `[源代码和 MIT 许可](${url})。用 animation 填写 ID。强动作须在分镜写 motionReason，并在实样中检查。`,
    '', '| ID | 时机 | 强动作 |','| --- | --- | --- |',
    ...subset.map(([id,e]) => `| \`${id}\` | ${phases[e.category]} | ${e.restricted?'是':'否'} |`));
}
output.push('','## 实际画面','','[内容动效案例 MP4](assets/aipacking-3/case-demo.mp4) · [全部动效图鉴 MP4](assets/aipacking-3/motion-gallery.mp4) · [生成与核验](../examples/aipacking-demo/README.md)','');
fs.writeFileSync('docs/MOTION-INDEX.md',output.join('\n'));
