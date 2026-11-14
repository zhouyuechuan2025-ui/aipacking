import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync, lstatSync, readFileSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const textExtensions = new Set(['', '.md', '.txt', '.json', '.yaml', '.yml', '.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.gitignore', '.npmrc']);
const sourceMedia = new Set(['.mp4', '.mov', '.mkv', '.avi', '.webm', '.wav', '.mp3', '.m4a']);
const publicDemoMedia = new Set([
  'docs/assets/guide/guide.mp4',
  'docs/assets/aipacking-3/case-demo.mp4', 'docs/assets/aipacking-3/motion-gallery.mp4',
  'docs/assets/native-templates/native-showcase.mp4', 'docs/assets/native-templates/motiongit-native-demo.mp4',
  'docs/assets/native-templates/overlay-native-demo.mp4',
  'docs/assets/native-templates-3.2/scene-reel.mp4', 'docs/assets/native-templates-3.2/side-reel.mp4',
  'docs/assets/native-templates-3.2/overlay-focus.mp4', 'docs/assets/native-templates-3.2/motion-kinetic.mp4',
  'docs/assets/native-templates-3.2/overlay-cards.mp4',
  'docs/assets/native-templates-3.2/motion-native-scenes.mp4',
  'docs/assets/native-templates-3.3/scene-reel.mp4',
  'docs/assets/aipacking-demo/preview.mp4',
]);
const templateSource = 'skills/aipacking/assets/remotion-host-2.0/';
const originalRegistry = 'skills/aipacking/original/aipacking/assets/fusion-source-registry.json';
const originalRegistrySha256 = '4d50fb38bafef7b4c9cfee4ced57ac50df4b1bff506d090d079eba011dcb907d';
const uiPlaceholderPaths = new Set([
  'docs/NATIVE-TEMPLATES.md', templateSource + 'docs/catalog.json', templateSource + 'src/motion/native-scenes.json',
  'skills/aipacking/original/aipacking/assets/workbench-library/WorkbenchNative.css',
  ...[
    'agent/before-after/BeforeAfter.tsx', 'agent/image-carousel/ImageCarousel.tsx',
    'snap/click-type/index.tsx', 'snap/input/index.tsx', 'snap/laptop-frame/index.tsx',
    'snap/phone-frame/index.tsx', 'snap/prompt-send/index.tsx', 'snap/prompt-zoom/index.tsx',
  ].map(file => templateSource + 'external/native-scenes/' + file),
]);
const directDPath = new RegExp(`\\b${['D', ':', '\\\\'].join('')}`, 'i');
const userPath = new RegExp(`[A-Z]:${['\\\\', 'Users', '\\\\', '[^\\\\]+', '\\\\'].join('')}`, 'i');
const nonPublicTerms = [new RegExp(['motion', 'playground'].join('\\s*'), 'i'), new RegExp(['动效', '工作台'].join('\\s*'), 'i')];
const secretPatterns = [
  /(?:api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key)\s*[:=]\s*["']?[a-z0-9_\-]{8,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{24,}/,
];

export const scanEntries = (entries) => {
  const findings = [];
  for (const entry of entries) {
    const normalized = entry.path.replaceAll('\\', '/');
    const extension = extname(normalized).toLowerCase();
    if (/(^|\/)\.env(?:\.|$)/i.test(normalized) || /\.(?:pem|key|p12|pfx)$/i.test(normalized)) findings.push(`${normalized}: forbidden-file`);
    if (sourceMedia.has(extension) && !publicDemoMedia.has(normalized)) findings.push(`${normalized}: source-media`);
    if (entry.size > 20 * 1024 * 1024) findings.push(`${normalized}: file-over-20mb`);
    if (entry.text !== null) {
      // The verified original registry includes build-time provenance paths.
      const isOriginalRegistry = normalized === originalRegistry &&
        createHash('sha256').update(entry.text, 'utf8').digest('hex') === originalRegistrySha256;
      if (!isOriginalRegistry && (directDPath.test(entry.text) || userPath.test(entry.text))) {
        findings.push(`${normalized}: absolute-local-path`);
      }
      if (nonPublicTerms.some((pattern) => pattern.test(entry.text))) findings.push(`${normalized}: non-public-term`);
      if (secretPatterns.some((pattern) => pattern.test(entry.text))) findings.push(`${normalized}: possible-secret`);
      const marker = new RegExp(`\\b(?:${['TO' + 'DO', 'T' + 'BD', 'FIX' + 'ME', 'PLACE' + 'HOLDER'].join('|')})\\b`, 'i');
      let markerText = normalized === 'skills/aipacking/assets/remotion-host-2.0/src/pages/more3.tsx'
        ? entry.text.replaceAll('p.place' + 'holder', '')
        : entry.text;
      if (uiPlaceholderPaths.has(normalized)) markerText = markerText.replace(/\bplaceholder\b/gi, '');
      if (marker.test(markerText)) findings.push(`${normalized}: ${'place' + 'holder'}`);
    }
  }
  return findings;
};

const collectCandidates = (root) => {
  const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {cwd: root, encoding: 'utf8', windowsHide: true});
  return output.split('\0').filter(Boolean).map((path) => {
    const absolute = resolve(root, path);
    if (!existsSync(absolute)) return null;
    const stat = lstatSync(absolute);
    if (!stat.isFile() || stat.isSymbolicLink()) return null;
    const extension = extname(path).toLowerCase();
    return {path, size: stat.size, text: textExtensions.has(extension) ? readFileSync(absolute, 'utf8') : null};
  }).filter(Boolean);
};

export const verifyPublicRepo = (root) => {
  const findings = scanEntries(collectCandidates(root));
  if (findings.length) throw new Error(`Public repository verification failed:\n${findings.join('\n')}`);
  return {ok: true, files: collectCandidates(root).length};
};

const isDirect = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isDirect) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const result = verifyPublicRepo(root);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
