import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const skill = fileURLToPath(new URL('..', import.meta.url));
const target = process.argv[2];
if (!target || !path.isAbsolute(target) || fs.existsSync(target)) {
  throw new Error('Pass a new absolute workbench path.');
}
const seed = path.join(skill, 'assets/remotion-host-2.0');
fs.cpSync(seed, target, {recursive: true, errorOnExist: true, force: false});
fs.mkdirSync(path.join(target, 'public/input'), {recursive: true});
execFileSync(process.execPath, [path.join(skill, 'assets/engine/scripts/apply-pack.mjs'), target], {stdio: 'inherit'});
const main = path.join(target, 'src/Main.tsx');
let code = fs.readFileSync(main, 'utf8');
const oldTimeline = /      \{plan\.chapterTimeline\?\.length && !activeOverlay\('Overlay_chapter-bar'\) \? <ProgressNav[^]*?\/> : null\}\r?\n/;
if (!oldTimeline.test(code) || !code.includes('      {probe && <Probe tag={probe} />}')) {
  throw new Error('The bundled workbench main composition changed.');
}
code = code.replace(oldTimeline, '').replace("import { OVERLAYS as OV0, ProgressNav } from './pages/overlay';",
  "import { OVERLAYS as OV0 } from './pages/overlay';\nimport {WithGlobalTimeline} from './custom/GlobalTimeline';");
const tag = "  return (\n    <AbsoluteFill style={{ backgroundColor: transparent";
code = code.replace(tag, "  return (\n    <WithGlobalTimeline brand={plan.brand ?? ''} chapters={(plan.chapterTimeline ?? []).map(c => ({at:c.start,label:c.title}))}>\n    <AbsoluteFill style={{ backgroundColor: transparent");
code = code.replace("      {probe && <Probe tag={probe} />}\n    </AbsoluteFill>", "      {probe && <Probe tag={probe} />}\n    </AbsoluteFill>\n    </WithGlobalTimeline>");
code = code.replace('  style?: string;\n  palette?: Palette;', '  style?: string;\n  brand?: string;\n  palette?: Palette;');
if (!code.includes('<WithGlobalTimeline ') || !code.includes('</WithGlobalTimeline>')) throw new Error('Timeline wrapper is missing.');
fs.writeFileSync(main, code);
const render = path.join(target, 'scripts/render.mjs');
const browserOptions = "const browserExecutable = process.env.NANA_BROWSER_EXECUTABLE;\n"
  + "const browserOptions = browserExecutable ? {browserExecutable, chromeMode:'chrome-for-testing'} : {};\n";
const renderer = fs.readFileSync(render, 'utf8')
  .replace("const common = { serveUrl, chromiumOptions: { gl: 'angle' }", browserOptions + "const common = { serveUrl, ...browserOptions, chromiumOptions: { gl: 'swangle' }")
  .replaceAll("selectComposition({ serveUrl, id:", "selectComposition({ serveUrl, ...browserOptions, chromiumOptions:{gl:'swangle'}, id:")
  .replace("await renderMedia({ serveUrl, composition, chromiumOptions: { gl: 'angle' }",
    "await renderMedia({ serveUrl, composition, ...browserOptions, chromiumOptions: { gl: 'swangle' }");
fs.writeFileSync(render, renderer);
fs.copyFileSync(path.join(skill, 'scripts/preview-workbench.mjs'), path.join(target, 'scripts/preview-workbench.mjs'));
console.log('Created aipacking workbench at ' + target);
