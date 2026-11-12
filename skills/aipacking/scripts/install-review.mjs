import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const [target, mode] = process.argv.slice(2);
if (!target || !path.isAbsolute(target) || !['--check', '--apply'].includes(mode)) throw new Error('用法：node install-review.mjs <独立作业的绝对路径> --check|--apply');
const dir = fs.realpathSync(target);
const here = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.render !== 'node scripts/render.mjs' || !pkg.dependencies?.['@remotion/renderer']) throw new Error('不是已知的使用者 Remotion 入口，停止，不覆盖其他宿主。');
for (const f of ['scripts/prepare.mjs', 'scripts/validate.mjs', 'src/index.ts', 'src/lib/anchors.ts', 'src/custom/index.ts', 'docs/catalog.json', 'AGENTS.md']) read(f);
const render = read('scripts/render.mjs');
const guide = read('AGENTS.md');
const oldRule = '**不要停下来等用户确认**，直接往下做；出片时用 2~3 行告诉用户你的思路。';
const newRule = '**先发完整分镜并等用户确认，再出实际风格图。风格图获用户确认后才能渲染全片。**';
const guideMarker = '## Nana 分镜与风格双审（覆盖旧工作流的确认时机）';
const nextGuide = guide.includes(guideMarker) ? guide : '# ' + guideMarker.slice(3) + '\n\n' +
  '本作业的分镜确认和风格确认顺序以 aipacking 为准。保留本文的视觉、素材、模板与验收规则，但旧文中的直接出片、免确认不能用于本作业。\n\n' +
  guide.replace(oldRule, newRule);
const marker = "import './nana-review-render-gate.mjs';";
if (!render.includes("id: 'Final'") || !render.includes('const args = process.argv.slice(2);')) throw new Error('渲染脚本不符合原版接口，停止。');
const names = ['nana-review.mjs', 'nana-review-preview.mjs', 'nana-review-render-gate.mjs'];
for (const name of names) {
  const dest = path.join(dir, 'scripts', name);
  if (fs.existsSync(dest) && read('scripts/' + name) !== fs.readFileSync(path.join(here, name), 'utf8')) throw new Error('同名脚本已有不同版本，停止：' + dest);
}
const checkDest = path.join(dir, 'scripts', 'nana-review-check-tech.mjs');
const checkSource = path.join(here, 'check-tech-plan.mjs');
if (fs.existsSync(checkDest) && !fs.readFileSync(checkDest).equals(fs.readFileSync(checkSource))) throw new Error('工作台已有不同版本的增强模板检查器：' + checkDest);
if (mode === '--check') { console.log('兼容：' + dir); process.exit(0); }
for (const name of names) {
  const dest = path.join(dir, 'scripts', name);
  if (!fs.existsSync(dest)) fs.copyFileSync(path.join(here, name), dest, fs.constants.COPYFILE_EXCL);
}
if (!fs.existsSync(checkDest)) fs.copyFileSync(checkSource, checkDest, fs.constants.COPYFILE_EXCL);
if (!render.includes(marker) || guide !== nextGuide) {
  const backup = path.join(dir, '.skill-backups', 'nana-review-' + new Date().toISOString().replace(/[:.]/g, '-'));
  fs.mkdirSync(backup, {recursive:true});
  if (!render.includes(marker)) {
    fs.copyFileSync(path.join(dir, 'scripts/render.mjs'), path.join(backup, 'render.mjs'));
    fs.writeFileSync(path.join(dir, 'scripts/render.mjs'), marker + '\n' + render);
  }
  if (guide !== nextGuide) {
    fs.copyFileSync(path.join(dir, 'AGENTS.md'), path.join(backup, 'AGENTS.md'));
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), nextGuide);
  }
}
console.log('已接入原工作台渲染入口；原模板及历史产物未改。');
