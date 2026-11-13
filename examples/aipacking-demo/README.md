# aipacking 3.0 公开样例

[案例 MP4](../../docs/assets/aipacking-3/case-demo.mp4) 使用合成主持人、示例文案和实际 Remotion Final 合成。包含轻推、逐字输入、逐项勾选、分流、汇流、对照和状态换卡。两条示例视频为静音。

[动效图鉴 MP4](../../docs/assets/aipacking-3/motion-gallery.mp4) 使用实际 MotionElements 合成，按页展示全部 139 项。每页两秒，按 [manifest](../../docs/assets/aipacking-3/manifest.json) 的 gallerySeconds 跳转。

## 复现

从仓库根目录运行以下命令。WORK 为新作业绝对路径，OUTPUT 为审片输出目录。生成工具需要 Node.js、npm、FFmpeg、Python 及 Pillow、NumPy。若本机需要指定浏览器，通过 NANA_BROWSER_EXECUTABLE 指向 Chrome。

```bash
node skills/aipacking/scripts/new-workbench.mjs WORK
npm ci --prefix WORK
python examples/aipacking-demo/make-source.py WORK/public/input
node scripts/render-aipacking-demo.mjs WORK OUTPUT
python examples/aipacking-demo/verify-and-copy.py OUTPUT docs/assets/aipacking-3
```

渲染前在 WORK/plan 创建 subs.json，内容为 []。创建 plan.json，内容如下。这是空的合成默认值，案例内容由脚本传入，使用范围为公开合成演示。

```json
{"meta":{"fps":30,"width":1920,"height":1080,"duration":22,"video":"","burnedSubtitles":false},"scenes":[]}
```

验证脚本抽每页九帧，对每个区域检查可见变化，完整解码两条 MP4，写入校验和及索引。
