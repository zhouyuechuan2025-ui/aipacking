import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = (...parts) => path.join(root, ...parts);
const boardDir = 'review/hyperframes';
const need = (ok, message) => { if (!ok) throw new Error(message); };
const json = (file) => JSON.parse(fs.readFileSync(at(file), 'utf8').replace(/^\uFEFF/, ''));
const put = (file, data) => {
  const dest = at(file);
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  fs.writeFileSync(dest, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
};
const hash = (files) => {
  const all = createHash('sha256'), buffer = Buffer.allocUnsafe(1024 * 1024);
  for (const rel of [...new Set(files)].sort()) {
    const abs = at(rel), h = createHash('sha256');
    need(fs.lstatSync(abs).isFile(), '不是常规文件：' + rel);
    const fd = fs.openSync(abs, 'r');
    try { let n; while ((n = fs.readSync(fd, buffer, 0, buffer.length, null))) h.update(buffer.subarray(0, n)); }
    finally { fs.closeSync(fd); }
    all.update(JSON.stringify([rel, h.digest('hex')]) + '\n');
  }
  return all.digest('hex');
};
const filesIn = (dir) => fs.readdirSync(at(dir), {withFileTypes:true}).flatMap((e) => {
  const rel = dir + '/' + e.name;
  if (e.isDirectory()) return filesIn(rel);
  need(e.isFile(), '素材和组件目录不能包含链接：' + rel);
  return [rel];
});
const run = (args, cwd = root) => {
  const r = spawnSync(process.execPath, args, {cwd, encoding:'utf8', maxBuffer:16 * 1024 * 1024, windowsHide:true});
  if (r.error || r.status !== 0) throw new Error('执行失败：' + args.join(' ') + '\n' + (r.error || r.stdout + r.stderr));
  return r.stdout;
};
const text = (s) => typeof s === 'string' && s.trim().length > 0;
const number = Number.isFinite;
const equal = (a,b) => number(a) && number(b) && Math.abs(a-b) < 1e-6;
const note = (s) => String(s).replace(/\|/g, '｜').replace(/\r?\n/g, ' ');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function sources() {
  const m = json('plan/meta.json');
  for (const name of ['video', 'srt']) need(typeof m[name] === 'string' && /^input\/[^/\\]+$/.test(m[name]) && !m[name].includes('..'), '先用原工作台 prepare-input 生成 MP4 和 SRT 的元数据。');
  need(number(m.duration) && m.duration > 0 && number(m.fps) && m.fps > 0 && json('plan/subs.json').length > 0, '输入时长、帧率或字幕无效。');
  return {meta:m, files:['plan/meta.json','plan/subs.json','public/' + m.video,'public/' + m.srt]};
}
function checkMotionBoard(board, shots, fps) {
  if (board.motionVersion === undefined) return;
  need(board.motionVersion === 1, '未知的 motionVersion。');
  const chapters = board.chapterTimeline;
  need(Array.isArray(chapters) && chapters.length >= 1 && chapters.length <= 7 && chapters[0].start === 0,
    '章节时间轴需要 1–7 段，并从 0 秒开始。');
  for (const [i, c] of chapters.entries()) {
    need(text(c.title) && c.title.length <= 10 && number(c.start) && c.start >= 0 && c.start < board.duration
      && (i === 0 || c.start > chapters[i-1].start) && shots.some(s => equal(c.start, s.start)), '章节时间轴须使用镜头切点和短标题。');
  }
  for (const [i, s] of shots.entries()) {
    const before = shots[i-1], next = shots[i+1];
    const inShot = n => number(n) && n >= s.start && n < s.end;
    need(equal(s.start, before?.end ?? 0) && (next || equal(s.end, board.duration)), '新版动效分镜须连续覆盖全片：' + s.id);
    need(Array.isArray(s.beats) && s.beats.length && s.beats.every(b => inShot(b.at) && text(b.label)), '每镜需要有时点的有效视觉动作：' + s.id);
    const points = [s.start, ...s.beats.map(b => b.at).sort((a,b) => a-b), s.end];
    need(points.slice(1).every((p,k) => p - points[k] <= 3.25), '相邻视觉动作超过 3.25 秒：' + s.id);
    if (s.camera) {
      const {keys, focusY, windowKeys} = s.camera;
      need(s.layout !== 'full' && (keys !== undefined || windowKeys !== undefined)
        && (focusY == null || number(focusY) && focusY >= 65 && focusY <= 100), '运镜仅用于真人镜头，须有缩放或收窗关键帧：' + s.id);
      if (keys !== undefined) {
        need(Array.isArray(keys) && keys.length >= 2
          && keys.every((key,k) => Array.isArray(key) && number(key[0]) && number(key[1]) && key[1] >= 1 && key[1] <= 1.12
            && (k === 0 || Math.round(key[0]*fps) - Math.round(keys[k-1][0]*fps) >= 2))
          && equal(keys[0][0], s.start) && equal(keys.at(-1)[0], s.end),
          '缩放关键帧须覆盖镜头全段，时间递增且倍率在 1.00–1.12：' + s.id);
      }
      if (windowKeys !== undefined) {
        const window = windowKeys;
        need(Array.isArray(window) && window.length >= 3
          && equal(window[0][0], s.start) && equal(window.at(-1)[0], s.end)
          && window[0][1] === 0 && window.at(-1)[1] === 0
          && window.some(([,v]) => v === 1)
          && window.every(([t,v],k) => number(t) && number(v) && v >= 0 && v <= 1
            && (k === 0 || Math.round(t*fps) - Math.round(window[k-1][0]*fps) >= 2))
          && s.layout === 'right', '收窗须回到原画，信息列在右侧：' + s.id);
      }
    }
    if (before && before.layout !== 'full' && s.layout !== 'full') {
      const prevScale = before.camera?.keys?.at(-1)?.[1] ?? 1;
      const nextScale = s.camera?.keys?.[0]?.[1] ?? 1;
      need(equal(prevScale, nextScale) && (prevScale === 1 || (before.camera?.focusY ?? 92) === (s.camera?.focusY ?? 92)), '相邻真人镜头的运镜边界须连续：' + s.id);
    }
    if (s.type === 'SideBeats') {
      const {variant,items,y,width} = s.side || {};
      need(['tags','signal','steps','stack'].includes(variant) && Array.isArray(items)
        && items.length >= 1 && items.length <= 4
        && items.every((item,k) => text(item.text) && item.text.length <= 18 && inShot(item.at)
          && (k===0 || item.at>items[k-1].at))
        && (s.end-s.start < 3 || items.length >= 2)
        && (y == null || number(y) && y >= 92 && y <= 420)
        && (width == null || number(width) && width >= 260 && width <= 480),
        '侧边动作需要有效变体、位置和分批入场时间：' + s.id);
    }
  }
  const human = shots.filter(s => s.layout !== 'full');
  if (human.length > 1) {
    const kits = new Set(human.map(s => s.type === 'SideBeats' ? s.type + '/' + s.side.variant : s.type));
    need(kits.size >= 2, '至少两种侧边动效结构，保持编排变化。');
  }
}

function readBoard() {
  const {meta,files} = sources(), b = json('plan/storyboard.json'), seen = new Set();
  const catalog = new Map(json('docs/catalog.json').map((item) => [item.type, item]));
  need(equal(b.duration, meta.duration) && Array.isArray(b.shots) && b.shots.length, '分镜必须对应完整源片时长并至少包含一镜。');
  let cursor = 0;
  const shots = [...b.shots].sort((a,b) => a.start - b.start);
  for (const s of shots) {
    need(typeof s.id === 'string' && /^[a-z][a-z0-9_-]{0,49}$/.test(s.id) && !seen.has(s.id), '分镜 ID 无效或重复：' + s.id); seen.add(s.id);
    need(number(s.start) && number(s.end) && s.start >= 0 && s.end > s.start && s.end <= b.duration + 1e-6, '分镜时间无效：' + s.id);
    need(s.start - cursor <= .5 + 1e-6, '分镜有超过 0.5 秒未安排：' + s.id); cursor = Math.max(cursor, s.end);
    for (const k of ['quote','purpose','aRoll','bRoll','motion','cue','layout','type']) need(text(s[k]), s.id + ' 缺字段 ' + k);
    need(catalog.has(s.type), s.id + ' 未登记实际模板：' + s.type);
    need(Array.isArray(s.assets) && s.assets.every((x) => text(x)), s.id + ' assets 必须为字符串清单，没素材写 []。');
  }
  need(b.duration - cursor <= .5 + 1e-6, '分镜漏掉末尾。');
  checkMotionBoard(b, shots, meta.fps);
  return {b, shots, meta, files};
}

function compileBoard(cli) {
  need(cli && path.isAbsolute(cli), '请提供已安装的 HyperFrames CLI JS 入口绝对路径。');
  const {b,shots} = readBoard();
  const gsapDir = path.join(path.dirname(cli), '..', 'dist', 'vendor', 'npm');
  const gsap = fs.readdirSync(gsapDir).filter((f) => f.startsWith('gsap@')).map((f) => path.join(gsapDir, f, 'dist', 'gsap.min.js')).find((f) => fs.existsSync(f));
  need(gsap, '当前 HyperFrames 包缺本地 GSAP。请使用已测试的 CLI 包结构。');
  const frameHtml = shots.map((s,i) => '<section class="clip" id="' + s.id + '" data-start="' + s.start + '" data-duration="' + (s.end-s.start).toFixed(6) + '" data-track-index="' + i + '" data-track-kind="graphics" style="z-index:' + (i+1) + '"><small>' + s.id + ' / ' + esc(s.type) + '</small><h1>' + esc(s.quote) + '</h1><p>' + esc(s.purpose) + '</p><p>A-roll：' + esc(s.aRoll) + '</p><p>B-roll：' + esc(s.bRoll) + '</p><p>动效：' + esc(s.motion) + '</p></section>').join('\n');
  put(boardDir + '/index.html', '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>口播分镜 · 非风格预览</title><style>body{margin:0;background:#171a22;color:#fff;font:24px system-ui}#root{position:relative;width:1280px;height:720px;overflow:hidden}.clip{position:absolute;inset:0;background:#171a22;padding:80px}small{color:#ace7ff}p{line-height:1.4}</style><body><div id="root" data-composition-id="nana-storyboard" data-duration="' + b.duration + '" data-width="1280" data-height="720">\n' + frameHtml + '\n</div><script src="assets/gsap.min.js"></script><script>window.__timelines={};const tl=gsap.timeline({paused:true});document.querySelectorAll(".clip").forEach(el=>tl.fromTo(el.querySelector("h1"),{opacity:.6},{opacity:1,duration:Math.min(.18,+el.dataset.duration/2),immediateRender:false},+el.dataset.start));window.__timelines["nana-storyboard"]=tl;</script></body></html>\n');
  fs.mkdirSync(at(boardDir,'assets'), {recursive:true});
  fs.copyFileSync(gsap, at(boardDir,'assets','gsap.min.js'));
  const lint = JSON.parse(run([cli,'lint','--json'],at(boardDir)));
  need(!lint.errorCount && !lint.errors?.length && !lint.findings?.some((x) => x.severity === 'error') && lint.ok !== false && lint.valid !== false, 'HyperFrames lint 未通过。');
  const timeline = JSON.parse(run([cli,'timeline','--json'],at(boardDir)));
  const clips = [];
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (v.absStart != null && v.absEnd != null) clips.push(v);
    Object.values(v).forEach(walk);
  };
  walk(timeline);
  for (const s of shots) {
    need(clips.some((c) => [c.id,c.ref,c.selector].some((x) => x === s.id || x === '#' + s.id) && Math.abs(c.absStart-s.start) < .001 && Math.abs(c.absEnd-s.end) < .001), 'HyperFrames 未读回对应镜头：' + s.id);
  }
  put('review/hyperframes-lint.json', lint);
  put('review/hyperframes-timeline.json', timeline);
  put('plan/storyboard.md', '# 口播包装完整分镜（非风格图）\n\n' +
    (b.chapterTimeline?.length ? '顶部章节轴 · ' + b.chapterTimeline.map(c => c.start.toFixed(3) + ' 秒 ' + c.title).join(' → ') + '。从开头贯穿到片尾。\n\n' : '') +
    '| 镜号 / 秒 | 台词和画面目的 | A-roll | B-roll / 素材 | 原模板 / 布局 | 动效与触发点 |\n|---|---|---|---|---|---|\n' +
    shots.map((s) => '| ' + [s.id + ' / ' + s.start + '–' + s.end, s.quote + '；' + s.purpose, s.aRoll, s.bRoll + (s.assets.length ? '；' + s.assets.join('、') : ''), s.type + ' / ' + s.layout, s.motion + '。' + s.cue + (s.beats ? '　动作点：' + s.beats.map(b => b.at.toFixed(2) + '秒 ' + b.label).join('、') : '') +
      (s.camera?.keys ? '　真人缩放：' + s.camera.keys.map(([t,z]) => t.toFixed(2) + '秒 ' + Math.round(z*100) + '%').join(' → ') : '') +
      (s.camera?.windowKeys ? '　收窗进度：' + s.camera.windowKeys.map(([t,k]) => t.toFixed(2) + '秒 ' + Math.round(k*100) + '%').join(' → ') : '')].map(note).join(' | ') + ' |').join('\n') + '\n');
  put('review/board-ready.json', {fingerprint:boardHash()});
}
function boardHash() {
  return hash([...readBoard().files,'plan/storyboard.json','plan/storyboard.md','plan/analysis.md',boardDir+'/index.html',boardDir+'/assets/gsap.min.js','review/hyperframes-lint.json','review/hyperframes-timeline.json']);
}
export function requireBoard() {
  const digest = boardHash();
  need(json('review/board-ready.json').fingerprint === digest, '分镜未通过 HyperFrames 时间轴核对，或分镜已改。');
  need(fs.existsSync(at('review/approved-board.json')) && json('review/approved-board.json').fingerprint === digest, '第一关未批准或版本已失效：重新发送分镜，等待用户确认。');
  return digest;
}
export function productionCheck() {
  requireBoard();
  const {b,shots,meta} = readBoard(), p = json('plan/plan.json');
  if (b.motionVersion === 1) need(isDeepStrictEqual(p.chapterTimeline, b.chapterTimeline), '章节时间轴与已审分镜不同。');
  need(p.meta?.video === meta.video && equal(p.meta?.duration,meta.duration) && equal(p.meta?.fps,meta.fps), '成片主轨不是已审分镜的原 MP4 / 时钟。');
  need(Array.isArray(p.scenes) && p.scenes.length === shots.length, '实际分镜镜数与已确认版本不同。');
  for (const s of shots) {
    const scene = p.scenes.find((x) => x.id === s.id);
    need(scene && s.type === scene.type && s.layout === scene.layout && equal(s.start,scene.start) && equal(s.end,scene.end), '成片分镜偏离已审时间、布局或模板：' + s.id);
    if (b.motionVersion === 1) {
      need(isDeepStrictEqual(scene.camera, s.camera), '运镜与已审分镜不同：' + s.id);
      if (s.type === 'SideBeats') need(isDeepStrictEqual(scene.props, s.side), '侧边编排与已审分镜不同：' + s.id);
    }
  }
  process.stdout.write(run(['scripts/validate.mjs']));
  process.stdout.write(run(['scripts/nana-review-check-tech.mjs',root]));
}
export function styleHash() {
  const files = ['plan/design.md','plan/plan.json','package.json','docs/catalog.json','scripts/render.mjs','scripts/nana-review-preview.mjs',...filesIn('src'),...filesIn('public')];
  if (fs.existsSync(at('package-lock.json'))) files.push('package-lock.json');
  return createHash('sha256').update(requireBoard() + hash(files)).digest('hex');
}
function readyStyle() {
  need(fs.existsSync(at('review/preview-ready.json')), '第二关风格预览还未生成：先用 Remotion 生成并展示 3–5 张实帧。');
  const ready = json('review/preview-ready.json');
  need(ready.production === styleHash() && Array.isArray(ready.images) && ready.images.length >= 3 && ready.images.length <= 5 && new Set(ready.images).size === ready.images.length && ready.images.every((x) => /^review\/previews\/[a-z0-9-]+\/frame-\d+\.png$/.test(x)), '风格预览缺失、参数已改，或当前版本未预览。');
  return createHash('sha256').update(ready.production + hash(ready.images)).digest('hex');
}
export function requireStyle() {
  const digest = readyStyle();
  need(fs.existsSync(at('review/approved-style.json')) && json('review/approved-style.json').fingerprint === digest, '第二关未批准或版本已失效：展示当前 Remotion 风格图，等待用户确认。');
}
function cliMain() {
  const [cmd,stage,token,reply] = process.argv.slice(2);
  if (cmd === 'board') {
    compileBoard(stage);
    console.log('请展示 plan/storyboard.md 并等待明确确认。分镜版本：' + boardHash().slice(0,16));
  } else if (cmd === 'status') {
    if (stage === 'board') {
      const digest = boardHash(); need(json('review/board-ready.json').fingerprint === digest, '先重跑 board。');
      console.log(digest.slice(0,16));
    } else if (stage === 'style') console.log(readyStyle().slice(0,16));
    else throw new Error('status board|style');
  } else if (cmd === 'approve') {
    need(['board','style'].includes(stage) && text(reply), 'approve board|style <发给用户的版本号> <用户原话>');
    const digest = stage === 'board' ? boardHash() : readyStyle();
    if (stage === 'board') need(json('review/board-ready.json').fingerprint === digest,'先重跑 board。');
    need(digest.slice(0,16) === token,'当前版本与用户看到的不一致。');
    put('review/approved-' + stage + '.json', {fingerprint:digest, userReply:reply, recordedAt:new Date().toISOString()});
    console.log('已记录用户确认：' + stage + ' ' + token);
  } else throw new Error('用法：board <HyperFrames CLI 绝对路径> | status board|style | approve board|style <版本号> <用户原话>');
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  try { cliMain(); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
