# aipacking 原版模板

先按台词语义从两份原版目录选镜头。写入本期文字、数据和媒体后，在实际合成中检查入场、中段、退出以及它与人物和字幕的关系。

## 随包渲染

读取宿主 `src/motion/native-scenes.json` 查模板 ID、画布、必填字段和示例。分镜写 `type: id` 和 `native` 参数，生产计划把同一份参数放进 `props.native`。

- **网页和设备画面**。网页聚焦、设备框和光标巡览绑定实际截图 `src`，前后对比、图片轮播与标志入场使用各自的媒体字段。
- **列表、资料卡与录屏**。列表和资料卡使用本期标题、条目和证据说明。按各组件约定填写数组或分隔字符串。录屏、手机墙等在合成里静音，当前视频原声走主轨。
- **媒体**。必填的 `mediaFields` 指向作业目录 `public/native/` 中的当前文件。写相对路径，例如 `native/current-report.png`。根据 `fieldLengths` 提供原布局所需的槽位数。带媒体和文案的组合字段沿用条目给出的格式。
- **版式**。支持 `full`、`left`、`right`。侧边用短词、单值和少量要点。完整网页、复杂数据图和多镜头画廊优先全屏。实际运行时检查内容可读、人物未被遮挡。

## 原工程渲染后接入

读取 `src/motion/external-native-scenes.json`。分镜使用该条目的 `id` 和 `layout`，`native` 记录 `sourceProject`、`sourceRevision`、`templateId`、`media` 与填有本期参数的 `input`。成片的 `props` 原样照录。媒体放入 `public/native/`。

工程下载入口与许可见[许可证目录](../assets/remotion-host-2.0/licenses/README.md#external-rendering-dependencies)。

- **媒体墙与图解**。关键词、清单、对比和总结使用 `basic` 字段。媒体墙、蒙太奇、加速网格、流程卡、双媒体展示、路径对比和环形关系图按各自的 `contentFields`、`mediaRoles` 和 `duration` 绑定。加速网格的动态计数固定，用于装饰性资料拼贴。
- **全屏镜头导出**。按目录匹配工程版本和场景 ID，在包内 `user-media` 输入填写本期内容和媒体。分镜的素材路径以 `public/` 为基准，交给渲染入口时转换为可读路径。执行包内 prepare、preview、render，镜头边界按原时长对齐到项目帧。用 MP4 接回宿主，主轨保留原声。
- **透明叠加卡**。以 OverlayDoc 编排卡片，导出透明 ProRes 4444 MOV 后使用 `overlay` 布局。字幕和章节各显示一套，在实际合成里确认位置、时钟及可读性。
- **人物收窗**。把同一段口播按已审镜头边界切出等时长工作副本，保留原画幅并导出含人物的画面。用 `Overlay_focus-card` 放回 `full` 轨，原声仍走主轨。只在关键落点使用，动态预览覆盖原幅、收窗、条目入场及回位。若原片有烧录字幕，核对收窗里字幕与宿主重绘的关系。
- **编排**。按原词入场，给后续条目、数据状态或图解连线留时。普通真人镜头保持稳定。固定演示、包装层上的替换贴字和 CSS 关键帧不计入原版镜头清单。

[完整模板清单与实渲染](https://github.com/zhouyuechuan2025-ui/aipacking/blob/main/docs/NATIVE-TEMPLATES.md)。
