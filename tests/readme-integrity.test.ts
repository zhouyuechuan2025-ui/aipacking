import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path));
const sha256 = (value: Buffer) => createHash('sha256').update(value).digest('hex').toUpperCase();

describe('public README evidence', () => {
  it('links only existing local preview assets', () => {
    const markdown = read('README.md').toString('utf8');
    const links = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThanOrEqual(4);
    expect(markdown).not.toContain('docs/assets/previews/');
    for (const link of links) expect(existsSync(resolve(root, link))).toBe(true);
  });

  it('maps every preview to the verified output and matching file hash', () => {
    const dir = 'docs/assets/aipacking-3/';
    const manifest = JSON.parse(read(dir+'manifest.json').toString('utf8'));
    expect(manifest.kind).toBe('aipacking-synthetic-demo');
    expect(manifest.version).toBe('3.0.0');
    const motion = 'skills/aipacking/assets/remotion-host-2.0/src/motion/';
    const ids = ['semantic.json','keyframes.json'].flatMap(file => Object.keys(JSON.parse(read(motion+file).toString('utf8'))));
    expect(ids.length).toBe(139);
    expect(manifest.motion.map((entry: {id:string})=>entry.id)).toEqual(ids);
    expect(manifest.motion.every((entry: {changedArea:number})=>entry.changedArea >= .001)).toBe(true);
    for (const frame of manifest.assets) {
      const path = resolve(root, dir+frame.file);
      expect(existsSync(path)).toBe(true);
      expect(sha256(readFileSync(path))).toBe(frame.sha256.toUpperCase());
    }
    const home = read('README.md').toString('utf8');
    for (const file of ['opening.png','side-checklist.png','branch.png','merge.png','case-demo.mp4','motion-gallery.mp4']) {
      expect(home).toContain(dir+file);
    }
  });

  it('keeps the approved business WeChat and QR code together at the end', () => {
    const lines = read('README.md').toString('utf8').trimEnd().split(/\r?\n/).filter(Boolean);
    expect(lines.at(-2)).toBe('感兴趣的朋友欢迎咨询业务微信：nanaya093');
    expect(lines.at(-1)).toBe('<img src="docs/assets/contact/nana-wechat-qr.jpg" alt="Nana 业务微信二维码" width="320">');
  });
});
