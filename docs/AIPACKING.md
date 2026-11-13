# aipacking

适用于真人口播 MP4 和同版 UTF-8 SRT。全程显示顶部章节时间轴。

从 [aipacking ZIP](../downloads/aipacking.zip?raw=true) 解压，把 aipacking 目录安装为 Agent Skill，然后调用 $aipacking。需要 Node.js 22+、FFmpeg、ffprobe 和 npm 依赖。

    node <Skill目录>/scripts/create-workbench.mjs <新作业绝对路径>

进入作业目录执行 npm ci。将视频和字幕放进 public/input/，再执行以下命令。

    npm run prepare-input -- "视频.mp4" "视频.srt"

按分镜编排并实际渲染预览。手动运行命令与校验见 [aipacking 使用说明](../skills/aipacking/references/workflow.md)。

[查看 aipacking 模板](TEMPLATES.md)
