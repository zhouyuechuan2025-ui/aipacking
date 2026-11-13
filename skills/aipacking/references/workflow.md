# aipacking 使用说明

1. 创建独立作业并安装 npm 依赖。核对源视频和同版 SRT，查看人物与烧录字幕的位置。
2. 写 `plan/analysis.md`、`plan/design.md` 和 `plan/plan.json`。章节写入 `chapterTimeline`。逐项给素材指定本地文件，按台词填写文案和动作。模板的 `visual` 和 `motionBeats` 见 [节奏与构图](../assets/engine/references/density-diversity.md)。`WorkbenchNative` 需要 `props.templateKey`、本期内容和字幕编号。
3. 运行 `npm run validate` 和 `node scripts/skill-render-preflight.mjs`。先用 `node scripts/preview-workbench.mjs 1.6 12.4 26.8 47.4 --clip 0 3.3 --clip 45.5 50.8` 审实际效果。这里的秒点为用法示例。
4. 确认成片制作后执行 `npm run render`。检查首尾、转场、人物安全区、唯一口播声轨和章节时间轴。Windows 可用 `NANA_BROWSER_EXECUTABLE` 指定本机 Edge 或 Chrome。
