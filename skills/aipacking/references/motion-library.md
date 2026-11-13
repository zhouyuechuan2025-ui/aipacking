# Nana 历版模板与动效选型

## 分镜先写对象和动作

把每个动作写成「哪一个对象，在什么词上，发生什么变化，最后停在哪里」。常规口播优先稳定构图，隔 0.8–2.6 秒让一个与内容有关的对象入场、改状态、移动或接到下一项。长句拆成子拍。证据读字与结论停留可更长，在 readingHold 中注明内容和原因。章节轴常驻，单独呼吸光、章节进度和装饰运动不计入内容动作。

把镜头变化和内容变化分开写。常规真人累计 10 秒以上，新稿默认至少有一个清楚的推近—停留—回位。建议从 1.06–1.08 开始，开场重音、反转或结论选 1–3 个落点。峰值时检查额头、下巴、手势和最长烧录字幕。使用 focusY 给下方字幕留足空间，动效与章节轴保持自己的坐标。收窗是单独的 windowKeys。完全稳镜头时在分镜写 cameraIntent 为 steady 和具体理由。

按真正的构图、源组件和可见动作去重。普通信息条、编号、划线和贴纸轮换使用。需要比较时做两个对象对照，需要讲关系时让连线承接，需要证据时由真实网页或录屏接管。前后两镜保留同一对象有助理解时，写明 continuityReason。新项目不要把所有模板各套一个通用侧卡。

## 直接可调用的组件

组件 type 和示例见[完整目录](../assets/remotion-host-2.0/docs/templates.md)。新增源代码随包。模板默认的演示信息、图片和数字须逐项替换为本期素材，接入源代码不等于所有旧范例都能用于任意题材。

| 来源 | 组件和调用条件 |
| --- | --- |
| 使用者 2.0 / 2.4 | 161 项原目录仍可选。人物侧用 SideBlocks、SideCard、SideBeats、FactPanel、标注等。论点用对照和流程结构，证据用带真实媒体输入的 Showcase。 |
| 随包 原生批次 | 27 个 Native_ 前缀，分别绑定各自的旧组件。记录当前字幕序号 sourceCueIds、原稿 settings.sourceText 和实际检查结论 contentVerified。完整列表见目录。两个人物模板沿用原双侧区域；其他按目录使用全屏。含固定示例数据、旧截图或固定话题的模板，只用于主题匹配并逐项换成本期输入的项目。章节截图、生成能力和 Seedance 三个原生模板用 settings.image 绑定本期真实素材。检查所有旧示例文案、数值和截图均已替换后再出预览。 |
| 使用者 3.x 连续批次 | ContinuityPage 和 ContinuityOverlay 调用随包原组件。六条连续链、41 个阶段用于原对象保持、重排、证据接手和人物回归。30 fps，按原链 stageMap 绑定当前内容、sourceCueIds 与 sourceStart/sourceFrames。原示例台词和媒体由本片输入替换。 |
| Nana 5.0 开场批次 | ShotcraftMosaic 用 2–12 张实际资料做重排。SnapLogoAssemble 用 4–12 张实图和实际终态标志。ShotcraftTiltReveal 把单张真实证据从俯角翻入。SnapHeroLaunch 用两张实图做 Y 轴窗口交接。SnapAnnounceTitle 用章节、标题和副标落字。props 可填 sourceFrames 选择原组件起止帧。 |
| Nana 5.0 语义联动 | HubFlow/merge 做来源汇入；SideBeats/checkin 做执行与结果落位；TechFlow/relay 让同一对象交接。普通话题可选其他结构。设 motionDetail 时写入已审分镜和生产计划。 |
| RenderComp | MaskTitle 用色块逐行揭字；WordStack 用弹性错拍堆叠 2–4 个短词。文字较长时先缩短文案并审最终实帧。 |

## 叠加元素

elements 写在各镜头，逐项指定 kind、at、duration、x、y、width、height。时间用原片绝对秒，坐标基于 1920×1080。需要文字时填 text 或 items。常用尺寸为宽 260–480 px。动作与 beats 中的原词对齐，并为每次出现安排可读时间。

| kind | 表达什么 | 主要输入 |
| --- | --- | --- |
| trace | 一个词落定后的短下划线 | text 可选 |
| tabs | 同一问题的 2–4 个并列入口 | items |
| stamp | 结论或否定状态的一次盖印 | text |
| split | 两类对象沿相反方向进入，同屏对照 | 两个 items |
| focus | 真实证据中需读清的区域 | 区域坐标，复用 Video ShotCraft 聚光 |
| shine | 边缘短扫过，确认窗口当前焦点 | 区域坐标，复用 Magic UI 描边 |
| snap | 一个短语按词组错拍落位 | text，用空格分词组，复用 Snapcn |
| flash | 结果落定的一次局部暖白光 | 区域坐标，复用 Video ShotCraft |

分镜和生产计划的 elements 保持一致。第二审的静帧看版式，还要提供一个覆盖关键推拉或资料交接的动态短样。动态样片从相同 Remotion Final 合成输出选定帧区间，带源音轨。等本版风格和动效获确认，再出整条 MP4。

## 其他研究批次

Nana 5.0 的 01–10 与使用者 3.x 的连续动作适合按以下结构取用。当前项目的台词、媒体、颜色、布局与真实证据都要重绑定。以同一个对象的状态变化为主。

- 01 真人稳镜头与轻标签。02 真人让位、证据接管。03 抠像遮挡大字，先核验前景遮罩和逐帧同源。
- 04 真实录屏局部聚焦。05 多份证据逐一到阅读位，停稳后读字。06 电脑与手机做同一任务的焦点交接。
- 07 原句分流图。08 时间线回溯。09 试听卡按同一口径对照。10 有来源的实测数据。
- 连续链的阶段区间见工作台 src/custom/reference-motion/continuity-scenes.json。study 填 false，stageMap 各项填 referenceStart、referenceEnd、frames。参考时间连续，帧数加起来等于成片该镜帧数。旧示例使用的媒体不随新版分发。使用人物遮挡大字时按真实帧核验 matte。
- Talkcraft 用于查找手法，Overlay Studio 用于参考构图和人物运镜。随包运行组件的来源和许可见[许可证目录](../assets/remotion-host-2.0/licenses/README.md)。
