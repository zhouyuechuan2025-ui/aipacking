import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path));
const sha256 = (value: Buffer) => createHash('sha256').update(value).digest('hex').toUpperCase();

describe('public README evidence', () => {
  it('documents installation from GitHub and verifies the bundled package', () => {
    const dir = 'skills/aipacking';
    const readme = read('README.md').toString('utf8');
    expect(readme).toContain('(skills/aipacking/)');
    expect(readme).toContain('(docs/AIPACKING.md)');
    expect(readme).not.toMatch(/\]\([^)]*\.zip\)/i);
    expect(read(dir + '/SKILL.md').toString('utf8')).toMatch(/^---\nname: aipacking\n/);

    const manifest = read(dir + '/original/SHA256SUMS.txt');
    expect(sha256(manifest)).toBe('8B5362614184ECE2DEBCF6886F3F4B1CDAC85B0314779AA85BD78037CD434D7A');
    const lines = manifest.toString('utf8').trim().split(/\r?\n/);
    expect(lines).toHaveLength(153);
    for (const line of lines) {
      const [hash, path] = line.split('  ');
      expect(sha256(read(dir + '/original/' + path)), path).toBe(hash.toUpperCase());
    }
  });

  it('publishes the approved Guide MP4 and links four actual frames from the README', () => {
    const dir = 'docs/assets/guide/';
    const readme = read('README.md').toString('utf8');
    expect(sha256(read(dir + 'guide.mp4'))).toBe('23752189B20A61A23772BF8B5AD6E71C1A6140CB114D9D0FB4468E000F2A61EC');
    expect(readme).toContain(`/${dir}guide.mp4)`);
    for (const name of ['opening', 'tradeoff', 'evidence', 'choices']) {
      expect(existsSync(resolve(root, dir + name + '.jpg'))).toBe(true);
      expect(readme).toContain(`(${dir}${name}.jpg)`);
    }
  });

  it('keeps the approved business WeChat and QR code together at the end', () => {
    const lines = read('README.md').toString('utf8').trimEnd().split(/\r?\n/).filter(Boolean);
    expect(lines.at(-2)).toBe('感兴趣的朋友欢迎咨询业务微信：nanaya093');
    expect(lines.at(-1)).toBe('<img src="docs/assets/contact/nana-wechat-qr.jpg" alt="Nana 业务微信二维码" width="320">');
  });
});
