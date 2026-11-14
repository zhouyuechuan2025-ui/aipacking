# aipacking 安装与使用

1. [下载 aipacking ZIP](../downloads/aipacking.zip?raw=true) 并完整解压。把其中包含 `SKILL.md` 的目录放进你的 Agent 技能目录，或者在对话里直接指定这份 `SKILL.md`。
2. 准备一个兼容的 Motion Studio / Remotion 独立作业工程，装好工程依赖，并让终端可以运行 Node.js、FFmpeg 和 ffprobe。ZIP 提供 Skill，作业工程需另行准备。
3. 让 Agent 读取 `SKILL.md`。使用 `SKILL.md`「安装与范围」里的命令，传入独立作业工程的绝对路径和 `--check`。检查通过后，去掉 `--check` 执行安装。
4. 按安装后工程里的时间轴文档，把 `WithGlobalTimeline` 放在主合成最外层。交给 Agent 你的 16:9 MP4、同版 UTF-8 SRT 和要使用的真实资料，依照包内流程编排、检查并导出。

下载文件的 SHA-256 为：

```text
dbfbaffd4af7b556aae60f71759d2d9a7fc9fa8b3b384573f8d0806958032fd2
```
