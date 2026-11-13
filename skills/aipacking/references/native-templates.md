# aipacking 原版模板

先按台词语义从两份原版目录选镜头。写入本期文字、数据和媒体后，在实际合成中检查入场、中段、退出以及它与人物和字幕的关系。

## 随包渲染

读取宿主 `src/motion/native-scenes.json`。每项都有 `id`、来源、版本、原始画布、必填字段和供复核的 `demo`。分镜写 `type: id` 和 `native` 参数，生产计划把同一份参数放进 `props.native`。

- **Agent Motion（MotionAgent）**。版本按组件锁定。浏览器聚焦、设备框和光标巡览绑定实际截图 `src`，前后对比、图片轮播与标志入场使用各自的媒体字段。
- **SnapCN**。原版镜头与时间曲线随包，改用宿主字体。按各组件输入约定填写数组或分隔字符串。屏幕录制、手机墙等在合成里静音，当前视频原声走主轨。
- **ShotCraft**。原版 List Reveal 和 Research Card Stack Scroll 使用本期标题、条目、出处。历史扩展批另有 `legacyId`、上游文件路径和源文件 SHA-256，卡片媒体、文案和数据直接进入原镜头。
- **媒体**。必填的 `mediaFields` 指向作业目录 `public/native/` 中的当前文件。写相对路径，例如 `native/current-report.png`。根据 `fieldLengths` 提供原布局所需的槽位数。带媒体和文案的组合字段沿用条目给出的格式。
- **版式**。支持 `full`、`left`、`right`。侧边用短词、单值和少量要点。完整网页、复杂数据图和多镜头画廊优先全屏。实际运行时检查内容可读、人物未被遮挡。

## 原工程渲染后接入

读取 `src/motion/external-native-scenes.json`。分镜使用该条目的 `id` 和 `layout`，`native` 记录 `sourceProject`、`sourceRevision`、`templateId`、`media` 与填有本期参数的 `input`。成片的 `props` 原样照录。媒体放入 `public/native/`。

- **.Motion**。从 [MotionGit](https://github.com/motiontemplates/all) 获取酷炫科技风 0.2.7-open-beta，用本期 `basic` 分别编排 B1 关键词、B2 清单、B3 对比与 B4 行动。按包内说明执行 prepare、preview、render，使用对应原生 MP4，时长以原工程为准。视频层静音，主轨保留原声。
- **Overlay Studio**。使用 [原项目](https://github.com/jeszhou/overlay-studio) 的 OverlayDoc、原卡与导出。普通卡导出透明 ProRes 4444 MOV 后使用 `overlay` 布局。字幕卡和章节卡与已有相同图层协调，只显示一套；保留章节导航及字幕可读性。若使用这些替代图层，先在实际合成里确认位置和时钟。
- **Overlay FocusCard**。把同一段口播按已审镜头边界切出等时长工作副本，保留原画幅并用原版卡导出含人物的画面。用 `Overlay_focus-card` 放回 `full` 轨，原声仍走主轨。只在关键落点使用，覆盖原幅、收窗、条目入场及回位的动态预览。若原片有烧录字幕，核对收窗里字幕与宿主重绘的关系。
- **编排**。按原词入场，给后续条目、数据状态或图解连线留时。普通真人镜头保持稳定。固定演示、包装层上的替换贴字和 CSS 关键帧不计入原版镜头清单。

[完整清单、版本及实际渲染](https://github.com/zhouyuechuan2025-ui/aipacking/blob/main/docs/NATIVE-TEMPLATES.md)。
