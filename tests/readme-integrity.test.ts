import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path));
const sha256 = (value: Buffer) => createHash('sha256').update(value).digest('hex').toUpperCase();

describe('public README evidence', () => {
  it('links to the verified aipacking ZIP and its installation guide', () => {
    const archive = 'downloads/aipacking.zip';
    const guide = 'docs/AIPACKING.md';
    const hash = 'dbfbaffd4af7b556aae60f71759d2d9a7fc9fa8b3b384573f8d0806958032fd2';
    const readme = read('README.md').toString('utf8');
    expect(readme).toContain(`(${archive}?raw=true)`);
    expect(readme).toContain(`(${guide})`);
    expect(read(guide).toString('utf8')).toContain(hash);
    expect(sha256(read(archive))).toBe(hash.toUpperCase());
  });

  it('keeps the approved business WeChat and QR code together at the end', () => {
    const lines = read('README.md').toString('utf8').trimEnd().split(/\r?\n/).filter(Boolean);
    expect(lines.at(-2)).toBe('感兴趣的朋友欢迎咨询业务微信：nanaya093');
    expect(lines.at(-1)).toBe('<img src="docs/assets/contact/nana-wechat-qr.jpg" alt="Nana 业务微信二维码" width="320">');
  });
});
