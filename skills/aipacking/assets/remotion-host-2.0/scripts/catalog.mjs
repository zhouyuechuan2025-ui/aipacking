// 由 docs/catalog.json 生成 docs/templates.md（模板目录，给 Agent 和人看）
import fs from 'fs';
const c = JSON.parse(fs.readFileSync('docs/catalog.json', 'utf8'));
const groups = {}; c.forEach(x => { const g = (x.ctx ?? x.context).split('/')[0]; (groups[g] ||= []).push(x); });
let md = `# 模板目录（${c.length} 个）\n\n> 由 \`npm run catalog\` 从 docs/catalog.json 自动生成，不要手改。props 里的 \`at\`/\`xxxAt\` 用来让元素卡在某个词说出口的瞬间：**写原句里的关键词**（如 \`"at": "绝望"\`），脚本自动换算成秒；示例里省略了 at，元素会按默认节奏依次出现。每页的时长不能短于「最短时长」，否则校验报错。视觉硬规则见 docs/visual-rules.md。\n\n`;
for (const [g, xs] of Object.entries(groups)) {
  md += `## ${g}\n\n`;
  for (const x of xs) md += `### ${x.type}  \`${x.layout}\`\n- 语境：${x.ctx ?? x.context}\n- 何时用：${x.use ?? x.description}\n- 最短时长：${x.minDur ?? 1.5} 秒\n- 示例：\n\`\`\`json\n${JSON.stringify({ type: x.type, layout: x.layout.split('|')[0], ...(x.bg ? { bg: x.bg } : {}), props: x.props }, null, 1)}\n\`\`\`\n\n`;
}
fs.writeFileSync('docs/templates.md', md); console.log('✓ docs/templates.md');
