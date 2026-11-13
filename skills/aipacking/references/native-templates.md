# aipacking 原版模板

新项目优先从本页选完整构图和镜头。旧关键帧仍可用作单个标签的入退场。它们的数量不代表原版模板数量。

## 随包渲染

读取宿主 `src/motion/native-scenes.json`，按来源、名称和参数选型。`external/native-scenes/agent/` 的组件按 Agent Motion 版本取源码。`snap/` 保留 SnapCN 镜头和时间曲线，字体改用宿主本地字体。`shotcraft/` 保留上游镜头和运动曲线，ListReveal 的标题、行项目和副文案已接成参数，ResearchCardStackScroll 改用本期标题和来源。

分镜使用目录里的真实 type，写 `native` 参数。生产计划把同一份参数放进 `props.native`。支持 `full`、`left`、`right`。侧边窗口优先用于标题、引用或少量步骤，含长句或复杂图表的组件用全屏。逐镜检查替换文字、来源、颜色与安全区。目录中的 demo 字段只供图鉴抽测。

## 原工程分开运行

- **.Motion**。使用实际下载的 [MotionGit 模板包](https://github.com/motiontemplates/all)，按包内参数与原生渲染入口做本期镜头。酷炫科技风 B1 已用替换文字走过 prepare、preview 和 render。其他包按各自的素材合同和版本验收。将本期生成的 MP4 放在 `public/native/`，分镜用 `NativeRenderedClip`，`native` 写 `{ "sourceProject": ".Motion", "templateId": "kinetic-tech/B1", "sourceRevision": "0.2.7-open-beta", "media": "native/scene.mp4" }`。成片 `props` 与这一对象相同。镜头时长以原渲染为准，原工程配音和音效默认静音，aipacking 主轨负责原声。
- **Overlay Studio**。沿用 [原项目](https://github.com/jeszhou/overlay-studio) 的卡片、OverlayDoc 时钟和导出。按上游操作生成透明 ProRes 4444 MOV，把本期输出放入 `public/native/`。分镜填 `NativeOverlayLayer`、`layout: "overlay"` 和原项目、版本、原卡 ID、媒体路径，`props` 原样照录。aipacking 保留主轨、字幕和顶部时间轴。VS 对撞卡 `versus-card` 已走原工程实渲染。独立安装 Overlay，按上游许可使用。
- **ShotCraft**。本版新增的原版接入是 ListReveal 和 ResearchCardStackScroll。此前已接的 Mosaic、Tilt Reveal 及 M5 中的 ShotCraft 组件继续按各自接口使用。上游画廊固定演示和其他配方均需逐张验证内容可替换，再注册到生产目录。Research Card Stack Scroll 来自上游更新的镜头源码，归入扩展候选。用户所指独立扩展批仍需用原始文件或清单核对。

完整展示见 [原版模板清单和样片](https://github.com/zhouyuechuan2025-ui/aipacking/blob/main/docs/NATIVE-TEMPLATES.md)。
