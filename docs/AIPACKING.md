# aipacking 3.3

适用于已剪好的 **16:9 真人口播 MP4 和同版 UTF-8 SRT**。可以附上获准使用的截图、录屏、实拍 B-roll 和仅供参考的片子。成片沿用原声原速和人物质感。

## 安装

从 [3.3 ZIP](../downloads/aipacking-3.3.zip?raw=true) 解压，或从仓库获取 [完整 Skill 目录](../skills/aipacking/)。把整个 `aipacking` 目录放进 Agent 的 Skills 目录，在对话中调用 `$aipacking`。如果 Agent 没有 Skill 安装入口，可以请它读取目录里的 [SKILL.md](../skills/aipacking/SKILL.md) 并按其中流程执行。

运行环境需要 Node.js 22+、npm、PATH 上的 FFmpeg 和 ffprobe，以及可访问 npm 依赖的网络。ZIP 含原版 Remotion 模板源码与双审脚本，依赖和字体通过 npm 安装。

每条视频创建一个独立作业目录。以下命令中的 `SKILL` 和 `WORK` 分别换成 Skill 和新作业的绝对目录。先建好作业的上级目录，`WORK` 本身应尚未创建。

```bash
node "SKILL/scripts/new-workbench.mjs" "WORK"
cd "WORK"
npm ci
npm install --prefix review-tools --no-save hyperframes@0.8.214
```

已有可用的 HyperFrames CLI 时可复用。下面的 `HF_CLI` 是该 CLI 的 JavaScript 入口绝对路径。按上面的命令安装时，入口在作业的 `review-tools/node_modules/hyperframes/bin/hyperframes.mjs`。

把 MP4 和 SRT 放入作业的 `public/input/`，然后运行：

```bash
npm run prepare-input -- "口播.mp4" "口播.srt"
```

检查 `plan/frames/` 下的四张原片参考帧。若视频自带画面字幕，生产计划设置 `meta.burnedSubtitles: true`，在全屏图解盖住原字幕时从 SRT 补绘；若原片无字幕，则设为 `false`，全程绘制 SRT 字幕。缩窗时检查人物和原字幕的可读性。

## 制作与双审

1. **确认分镜。** 读完字幕，写 `plan/storyboard.json`，执行 `node scripts/nana-review.mjs board "HF_CLI"`。逐段分镜包含时间码、台词、画面目的、真人保留或收窗、B-roll、模板、入场词和缺失素材。把生成的 `plan/storyboard.md` 和版本号交给用户。收到该版确认后，用 `node scripts/nana-review.mjs approve board "版本号" "用户确认原话"` 记录。
2. **确认实际预览。** 用同一分镜写 Remotion 的 `plan/plan.json`，以 `node scripts/nana-review-preview.mjs 1.3 5.8 9.6` 为例选 3–5 个实际秒点，从最终合成抽 PNG。覆盖开场、人物与动效同屏、核心图解或 B-roll。有运镜或使用新增动效时加 `--clip 开始秒 结束秒`，用同一合成出一段或多段 1–8 秒动态短样并与实帧一起确认。用 `node scripts/nana-review.mjs status style` 取当前版本号。收到确认后，用 `node scripts/nana-review.mjs approve style "版本号" "用户确认原话"` 记录。
3. **渲染和复查。** 两次确认均匹配当前版本后，用 `npm run render` 导出完整 MP4。检查关键转场、字幕时序、脸和字幕安全区、音画同步，并做 ffprobe、完整解码和正常速度播放。改镜头时间、构图结构、模板、B-roll 或内容时重新审分镜；只改配色、字重或风格时重新审预览。

分镜、计划字段和校验命令见 [双审流程](../skills/aipacking/references/review-workflow.md)。可直接复制 [启动提示词](../skills/aipacking/references/start-prompt.md)。

## 动效规则

[135 个模板与实渲染样片](NATIVE-TEMPLATES.md)

[辅助动效索引与图鉴](MOTION-INDEX.md) · [分镜参数及使用条件](../skills/aipacking/references/motion-expanded.md)

- 普通口播保持原构图。默认在开场重音或关键结论安排少数可见轻推并回位。新稿用 motionVersion 3，把原词、动作与发生时间写进分镜。有独立信息区时按需收窗。
- 每段安排与台词有关的可见动作。侧边用标签、要点划线、步骤或状态变化分批出现，图解随台词逐步建立，给观众留出阅读时间。
- 顶部章节进度贯穿真人、全屏图解与 B-roll。优先保证脸、手势和字幕可见。真实截图与录屏应可追溯，概念图注明“示意”。

[运镜、侧边动效与章节轴参数](../skills/aipacking/references/motion-direction.md) · [语义动效选型](../skills/aipacking/references/semantic-motion.md) · [随包组件许可](../skills/aipacking/assets/remotion-host-2.0/licenses/README.md)

[历版模板、叠加元素与动态审片](../skills/aipacking/references/motion-library.md)
