# aipacking 安装与使用

aipacking 为剪好的横屏真人口播加上章节轴、重点文字、关系图解、资料画面和人物窗口变化。[《指南》真人案例与截图](../README.md#真人案例指南)展示了这些元素如何配合台词。

## 1. 从 GitHub 安装

**Codex**：使用内置 Skill Installer，指定 [仓库中的 `skills/aipacking`](https://github.com/zhouyuechuan2025-ui/aipacking/tree/main/skills/aipacking)：

```text
请用 $skill-installer 从 https://github.com/zhouyuechuan2025-ui/aipacking/tree/main/skills/aipacking 安装 aipacking。
```

安装后新开对话，输入 `$aipacking`。如果已经装有同名 Skill，先备份旧目录，再安装这一版。其他支持 Agent Skill 的工具可以克隆本仓库，把整个 `skills/aipacking` 目录注册为 Skill；请保留子目录。也可以在本仓库中直接让 Agent 读取 `skills/aipacking/SKILL.md`。

## 2. 准备工程和素材

- 准备一个**兼容的 Motion Studio / Remotion 独立作业工程**。原包需要工程中已经存在 `src/custom/index.ts`、`docs/catalog.json`、`AGENTS.md`、`package.json` 以及可用的 Remotion 依赖。这些文件只是基本要求，实际是否兼容由包内安装检查判定。先在终端运行 `node --version`、`ffmpeg -version`、`ffprobe -version`，确认它们能启动。
- 准备 16:9 横屏真人 MP4、同一版 UTF-8 SRT。如果打算展示真实资料，同时提供正确版本的截图、录屏或链接。用 SRT 的开头、中间、结尾抽查台词和时间码。

## 3. 检查工程并接入章节轴

调用 `$aipacking` 后，Agent 会从入口找到原始 `SKILL.md`，使用「安装与范围」里给出的安装脚本和独立作业工程的**绝对路径**。先带 `--check` 执行检查。通过后，去掉 `--check` 重跑以安装。若检查提示不兼容，先按报错准备合适的工程，再重试。

安装后，按包内时间轴说明把 `WithGlobalTimeline` 接到**主合成最外层**，包住全部场景 `Sequence` 和转场。章节来自这条视频的字幕与分镜，`at` 使用全片秒数。引用素材的场景关闭内部导航，以免出现两条时间轴。渲染首帧、一个转场和末帧检查章节轴是否固定在顶部、进度是否连续。

## 4. 给 Agent 一个具体的任务

把项目路径和以下信息一起发给 Agent：

```text
请用 $aipacking 包装下面的视频。
独立作业工程的绝对路径：<填写>
口播 MP4 和同版 SRT：<填写>
可用的真实截图、录屏或链接：<填写>

请先按包内说明检查、安装并接入章节轴。抽帧确认人物位置、脸部安全区和原片是否已带字幕。
通读字幕，做逐段方案，标明时间码、原话、上屏重点、人物构图、资料和动作落点。缺少的真实素材请标出来。
请先给我开场、人物与资料同屏、核心图解和收尾等场景的实渲截图。收窗等关键动作可以另外给一段动态短样。
确认预览后导出完整 MP4，原声原速，章节轴从头到尾可见。检查脸部与字幕遮挡、转场和音画同步。
```

具体的准备、预检、渲染命令按独立工程与包内规则执行。样片确认后，用同一份方案继续导出。最终检查建议包括 `ffprobe`、FFmpeg 完整解码、首尾和转场抽帧，以及正常速度播放。检查后交付 MP4 文件和已验证项目的说明。

## 5. 遇到问题时

| 现象 | 先检查 |
| --- | --- |
| 安装检查报错 | 脚本收到的是独立工程的绝对路径；核对工程目录、组件注册入口和依赖。 |
| 顶部章节轴消失或重置 | 查看实际渲染的主合成是否在最外层调用 `WithGlobalTimeline`，以及内部导航是否关闭。 |
| 人物窗里仍有一层字幕 | 先确认原片是否已经有固定字幕，分别检查全屏口播、收窗和资料全屏时字幕的显示来源。 |
| 内容或动作对不上拍 | 对照 MP4 与 SRT 的几处时间点，复查动效触发词与绝对时间，再渲染出问题的片段。 |
| 预览里有资料占位图 | 补齐实际截图或录屏，明确区分口播摘要、解释图和真实证据。 |

如需使用历史基础 CLI，见 [独立使用说明](USAGE.md)。完整的 aipacking Skill 随 [Skill 目录](../skills/aipacking/) 安装。
