---
name: aipacking
description: 用 Motion Studio 和 Remotion 为真人口播视频及同版 SRT 设计分镜、制作动效预览并交付 MP4。全程显示章节时间轴。
metadata:
  version: "4.0.0"
---

# aipacking

在独立作业里运行。用 `node scripts/create-workbench.mjs <新作业绝对路径>` 创建并安装工作台，再到作业目录执行 `npm ci`。将 MP4 和 SRT 放入 `public/input/`，用 `npm run prepare-input -- "视频.mp4" "视频.srt"` 整理输入。运行依赖为 Node.js 22+、FFmpeg、ffprobe 和 npm 依赖。

先读完整字幕，查看参考帧，按台词确定每段的视觉焦点、人物安全区、真实证据与动作落点。用 [aipacking 原版规则](assets/engine/references/density-diversity.md) 和 [模板目录](assets/engine/assets/workbench-library/catalog.json) 选择构图和组件。随包有 27 个工作台模板、7 个 Tech 组件及连续参考库。全程用统一章节时间轴。普通口播保持稳定，推拉用在少数关键落点。人物、字幕与资料都须实渲检查。

按用户当前要求执行分镜、样片和成片审阅。使用 `node scripts/preview-workbench.mjs <3–5 个秒点> --clip <开始秒> <结束秒>` 输出实际预览，可多次传 `--clip`。渲染整片前执行工作台的 validate、渲染前检查和 QA。证据使用当前真实截图或录屏，保留原声原速，检查成片解码、音画同步和完整章节轴。使用规则见 [aipacking 指南](references/workflow.md)。
