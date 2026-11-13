# aipacking 3.2.1 原版模板

**122 项**使用可编辑的原镜头结构，逐项绑定新文字、数据或媒体并核对实帧。91 项随包在 Remotion 运行，31 项由原工程渲染后按独立 ID 接回 aipacking。计数排除 CSS 预设、固定演示及同一镜头的重复入口。

| 来源 | 项数 | 接入方式 |
| --- | ---: | --- |
| .Motion | 11 | 一个原工程的 11 个可编辑场景，渲染后接入 |
| Agent Motion | 25 | 随包渲染 |
| Overlay Studio | 20 | 原工程渲染后接入 |
| ShotCraft | 2 | 随包渲染 |
| ShotCraft 扩展批 | 13 | 随包渲染 |
| SnapCN | 51 | 随包渲染 |

## 实际渲染

[.Motion 新增七镜实渲染](assets/native-templates-3.2/motion-native-scenes.mp4?raw=true) · [八镜原版动态合辑](assets/native-templates-3.2/scene-reel.mp4?raw=true) · [两侧包装与章节轴](assets/native-templates-3.2/side-reel.mp4?raw=true) · [Overlay FocusCard 完整收窗回位](assets/native-templates-3.2/overlay-focus.mp4?raw=true) · [.Motion B1–B4](assets/native-templates-3.2/motion-kinetic.mp4?raw=true) · [Overlay 19 张动效卡](assets/native-templates-3.2/overlay-cards.mp4?raw=true)

![ShotCraft 扩展批 · 拼墙、立方体、级联图解等 13 项实渲染](assets/native-templates-3.2/shotcraft-expanded.jpg)

公开样片用合成素材、示例文案和演示数字验证替换与动作。生产项目的证据画面绑定真实出处。

| 八镜合辑时间 | 模板 | 换入内容 |
| --- | --- | --- |
| 00:00 | ShotCraft 扩展批 · Mosaic Reframe | 三种资料画面 |
| 00:06 | ShotCraft 扩展批 · Diagram Cascade Build | 检索指令、资料节点 |
| 00:11.3 | ShotCraft 扩展批 · Cube Navigation | 六个资料分类 |
| 00:17.3 | ShotCraft 扩展批 · Chip Grid Single Select Blackout | 五个选项与当前结果 |
| 00:22.3 | Agent Motion · Browser Spotlight | 原始报告画面 |
| 00:27.3 | Agent Motion · Before After | 原始报告与复核记录 |
| 00:32.3 | SnapCN · Capture Reveal | 页面截图和状态文案 |
| 00:36.7 | SnapCN · Card Rail | 三张资料卡和各自标题 |

## ShotCraft 扩展批的出处

旧版导出包的 assets/fusion-source-registry.json 将 “Video ShotCraft扩展批” 指向旧工程 src/shotcraft-expanded-originals.tsx。实查该文件的 SHA-256 为 35d75b34113e16b8c5da22ce06dc5c3b084687d0990b2d7f04be9630d2ffa8d3，与导出包登记一致。旧工程登记 26 个原 ID，本次 13 个已接入原镜头素材或文案字段，保留各自的旧 ID 和锁定源文件校验值。

尚未计入的 13 个旧 ID 为 shotOscilloscopeStreamV2、shotAxisRescaleShock、shotChipLiftUserPill、shotCursorCastEnsemble、shotCursorFlyover、shotDashboardGlowPill、shotDocParkPillDeal、shotDocumentTypewriterSource、shotIntegrationHubMap、shotQuadSplit、shotScanlineAnnotate、shotScanlineAssemble、shotSteepTiltGlide。

[随包模板、样例输入和原文件哈希](../skills/aipacking/assets/remotion-host-2.0/src/motion/native-scenes.json) · [原工程模板与样例参数](../skills/aipacking/assets/remotion-host-2.0/src/motion/external-native-scenes.json) · [生产参数与编排规则](../skills/aipacking/references/native-templates.md)

## .Motion · 11 个场景

11 个场景均出自「酷炫科技风」0.2.7-open-beta 的横屏公开工程。MotionGit 目录中的其他风格是独立项目，各有下载入口。现代图文和纸面透视的 .motion 包可在登录官网后获取。

[MotionGit 酷炫科技风](https://github.com/motiontemplates/385712) · [上游总目录](https://github.com/motiontemplates/all) · [现代图文](https://motiongit.com/@adunext/template-01-integrated) · [纸面透视](https://motiongit.com/@adunext/template-02-expanded)

| aipacking 模板 ID | 本期必填字段 | 版本或原卡 ID |
| --- | --- | --- |
| `Motion_KineticTech_B1` | `keyword`、`explanation` | `kinetic-tech/B1` |
| `Motion_KineticTech_B2` | `heading`、`points` | `kinetic-tech/B2` |
| `Motion_KineticTech_B3` | `heading`、`left`、`right`、`conclusion` | `kinetic-tech/B3` |
| `Motion_KineticTech_B4` | `summary`、`action` | `kinetic-tech/B4` |
| `Motion_KineticTech_A` | 3D 媒体墙，场景文案和 62 个媒体位 | `kinetic-tech/A` |
| `Motion_KineticTech_B` | 卡点蒙太奇，字幕和素材卡 | `kinetic-tech/B` |
| `Motion_KineticTech_C` | 加速媒体网格，替换媒体和标签，原镜头自带的计数只作动效 | `kinetic-tech/C` |
| `Motion_KineticTech_D` | 流程卡片与消散，步骤和两路素材 | `kinetic-tech/D` |
| `Motion_KineticTech_F` | 双媒体切换，标签和两路素材 | `kinetic-tech/F` |
| `Motion_KineticTech_S10` | 路径对比，弯路与直达的说明 | `kinetic-tech/S10` |
| `Motion_KineticTech_S11` | 四节点环形关系，节点文案和缩略图 | `kinetic-tech/S11` |

## Agent Motion · 25 项

[Agent Motion 组件目录](https://agent-motion.com/)

| aipacking 模板 ID | 本期必填字段 | 版本或原卡 ID |
| --- | --- | --- |
| `AgentMotion_AnimatedCounter` | `value`、`label` | `0.3.0` |
| `AgentMotion_AnimatedRouteMap` | `points`、`links` | `0.3.0` |
| `AgentMotion_ArchitectureDiagram` | `nodes`、`connections` | `0.2.0` |
| `AgentMotion_AreaChart` | `items` | `0.2.0` |
| `AgentMotion_BarChart` | `values`、`labels` | `0.2.0` |
| `AgentMotion_BlurFocusList` | `label`、`items` | `0.2.0` |
| `AgentMotion_ChatConversation` | `contact`、`messages` | `0.9.0` |
| `AgentMotion_CodeEditor` | `code` | `0.1.0` |
| `AgentMotion_CtaCard` | `items` | `0.3.0` |
| `AgentMotion_DataTable` | `columns`、`tableData` | `0.3.1` |
| `AgentMotion_DonutChart` | `items` | `0.3.0` |
| `AgentMotion_FeatureList` | `title`、`features` | `0.2.0` |
| `AgentMotion_OutlineTextEcho` | `text` | `0.13.0` |
| `AgentMotion_ProductTimeline` | `title`、`milestones` | `0.1.1` |
| `AgentMotion_ProgressRing` | `value`、`label` | `0.2.0` |
| `AgentMotion_QuoteHighlight` | `items` | `0.1.0` |
| `AgentMotion_TerminalSession` | `commands`、`outputs` | `0.2.0` |
| `AgentMotion_TestimonialCard` | `items` | `0.1.0` |
| `AgentMotion_WordTypewriter` | `text` | `0.5.1` |
| `AgentMotion_BeforeAfter` | `images`、`labels` | `0.3.0` |
| `AgentMotion_BrowserSpotlight` | `src` | `0.10.0` |
| `AgentMotion_DeviceMockup` | `src` | `0.1.0` |
| `AgentMotion_ImageCarousel` | `images`、`labels` | `0.1.0` |
| `AgentMotion_LogoReveal` | `logoSrc`、`brand`、`tagline` | `0.2.0` |
| `AgentMotion_CursorTour` | `xPositions`、`yPositions`、`src` | `0.2.0` |

## Overlay Studio · 20 项

[Overlay Studio 1.1.1](https://github.com/jeszhou/overlay-studio/tree/e35e1aff9dae3b3addc21f68f3bcd51f95bdc1a8)

| aipacking 模板 ID | 本期必填字段 | 版本或原卡 ID |
| --- | --- | --- |
| `Overlay_blur-text` | `text` | `blur-text` |
| `Overlay_caption-track` | `lines` | `caption-track` |
| `Overlay_chapter-bar` | `chapters` | `chapter-bar` |
| `Overlay_checklist` | `title`、`items`、`checked` | `checklist` |
| `Overlay_entity-chips` | `chips`、`note` | `entity-chips` |
| `Overlay_growth-curve` | `kicker`、`kickerZh`、`points`、`unit`、`caption` | `growth-curve` |
| `Overlay_odometer` | `kicker`、`value`、`unit`、`label` | `odometer` |
| `Overlay_pin-board` | `title`、`subtitle`、`items`、`stepMs` | `pin-board` |
| `Overlay_punch-pill` | `text` | `punch-pill` |
| `Overlay_rank-bars` | `title`、`rows`、`suffix` | `rank-bars` |
| `Overlay_ring-metric` | `kicker`、`value`、`max`、`label` | `ring-metric` |
| `Overlay_stat-proof` | `kicker`、`kickerZh`、`value`、`suffix`、`footEn`、`footZh` | `stat-proof` |
| `Overlay_step-timeline` | `title`、`steps`、`tagZh`、`nowZh` | `step-timeline` |
| `Overlay_term-card` | `term`、`def`、`en` | `term-card` |
| `Overlay_terminal-3d` | `file`、`lines` | `terminal-3d` |
| `Overlay_type-shift` | `lines`、`draftTag` | `type-shift` |
| `Overlay_ui-callout` | `label`、`hlWords` | `ui-callout` |
| `Overlay_versus-card` | `aKicker`、`aTitle`、`aSub`、`bKicker`、`bTitle`、`bSub`、`winner` | `versus-card` |
| `Overlay_quote-lockup` | `quote`、`author` | `quote-lockup` |
| `Overlay_focus-card` | `camSrc`、`camSize`、`eyebrow`、`items` | `focus-card` |

## ShotCraft · 2 项

[ShotCraft 上游源码](https://github.com/Vincentwei1021/video-shotcraft/tree/6700db2ba80572ebc777b99d72049679fed9840c)

| aipacking 模板 ID | 本期必填字段 | 版本或原卡 ID |
| --- | --- | --- |
| `ShotCraft_ListReveal` | `title`、`subtitle`、`items`、`kicker` | `6700db2ba805` |
| `ShotCraftExt_ResearchCardStackScroll` | `items` | `6700db2ba805` |

## ShotCraft 扩展批 · 13 项

[历史包锁定的 ShotCraft 源码](https://github.com/Vincentwei1021/video-shotcraft/tree/986427ee909a14dfaa96f6fa6cd7cfaa69b55881)

| aipacking 模板 ID | 本期必填字段 | 旧 ID |
| --- | --- | --- |
| `ShotCraftExt_CardStack` | `imageUrls` | `shotCardStack` |
| `ShotCraftExt_MosaicReframe` | `imageUrls` | `shotMosaicReframe` |
| `ShotCraftExt_FlyingWords` | `words` | `shotFlyingWords` |
| `ShotCraftExt_CounterConfetti` | `value` | `shotCounterConfetti` |
| `ShotCraftExt_Fracture` | `text` | `shotFracture` |
| `ShotCraftExt_HatchDepth` | `rows`、`heading` | `shotHatchDepth` |
| `ShotCraftExt_CubeNavigation` | `labels` | `shotCubeNavigation` |
| `ShotCraftExt_Carousel3D` | `labels` | `shotCarousel3D` |
| `ShotCraftExt_DiagramCascadeBuild` | `prompt`、`labels` | `shotDiagramCascade` |
| `ShotCraftExt_GlassPillDictationTyping` | `text` | `shotGlassDictation` |
| `ShotCraftExt_ChipGridSingleSelectBlackout` | `labels`、`caption` | `shotChipBlackout` |
| `ShotCraftExt_TapeScrollFixedPointer` | `title`、`from`、`to` | `shotTapeScrollPointer` |
| `ShotCraftExt_RadialRipplePhoneChips` | `imageUrls`、`labels` | `shotRadialRipplePhone` |

## SnapCN · 51 项

[SnapCN 原版注册表](https://github.com/shadcn-labs/snapcn/tree/18b973d7592adf2099a4d5cc2d8970862a4e1172)

| aipacking 模板 ID | 本期必填字段 | 版本或原卡 ID |
| --- | --- | --- |
| `SnapCN_AgentSteps` | `query`、`steps`、`result` | `18b973d7592a` |
| `SnapCN_AnswerHighlight` | `question`、`answer`、`statement`、`word` | `18b973d7592a` |
| `SnapCN_TextBuild` | `text` | `18b973d7592a` |
| `SnapCN_TextHighlight` | `highlight` | `18b973d7592a` |
| `SnapCN_TextRewrite` | `headline`、`keep`、`append` | `18b973d7592a` |
| `SnapCN_TextSelect` | `headline` | `18b973d7592a` |
| `SnapCN_TextSwap` | `fromText`、`toText` | `18b973d7592a` |
| `SnapCN_WordGather` | `text` | `18b973d7592a` |
| `SnapCN_WordWheel` | `headline`、`words` | `18b973d7592a` |
| `SnapCN_TitleSweep` | `titles` | `18b973d7592a` |
| `SnapCN_CheckCycle` | `headline`、`words` | `18b973d7592a` |
| `SnapCN_CountGrid` | `from`、`to`、`noun` | `18b973d7592a` |
| `SnapCN_TerminalSimulator` | `lines` | `18b973d7592a` |
| `SnapCN_AnswerStream` | `question`、`answer`、`headline`、`model` | `18b973d7592a` |
| `SnapCN_BlockWordmark` | `text` | `18b973d7592a` |
| `SnapCN_BloomLockup` | `wordmark`、`tagline`、`images`、`logo` | `18b973d7592a` |
| `SnapCN_BrandWheel` | `lead`、`items` | `18b973d7592a` |
| `SnapCN_ButtonPress` | `label`、`pending`、`done` | `18b973d7592a` |
| `SnapCN_CaptureReveal` | `headline`、`capturing`、`copied`、`src` | `18b973d7592a` |
| `SnapCN_CardRail` | `heading`、`cards` | `18b973d7592a` |
| `SnapCN_ChannelThread` | `messages` | `18b973d7592a` |
| `SnapCN_ClickType` | `placeholder`、`prompt`、`hint` | `18b973d7592a` |
| `SnapCN_FontShuffle` | `lead`、`subject` | `18b973d7592a` |
| `SnapCN_GatherLockup` | `wordmark`、`lines`、`images`、`captions`、`logo` | `18b973d7592a` |
| `SnapCN_HelloZoom` | `lead`、`rest`、`nextWord`、`words` | `18b973d7592a` |
| `SnapCN_KaraokeCaptions` | `text`、`emphasize` | `18b973d7592a` |
| `SnapCN_LaptopFrame` | `screenSrc`、`notchLabel` | `18b973d7592a` |
| `SnapCN_LogoCollapse` | `images`、`mark`、`wordmark`、`background` | `18b973d7592a` |
| `SnapCN_LogoDrift` | `headline`、`tiles` | `18b973d7592a` |
| `SnapCN_LogoFlicker` | `brandName`、`logoSrc`、`images` | `18b973d7592a` |
| `SnapCN_MoodboardReveal` | `leadIn`、`emphasis`、`tailIn`、`images`、`heroImage` | `18b973d7592a` |
| `SnapCN_OrbSwarm` | `script` | `18b973d7592a` |
| `SnapCN_OrbitGallery` | `title`、`subtitle`、`buttonLabel`、`images` | `18b973d7592a` |
| `SnapCN_PhoneFrame` | `screenSrc` | `18b973d7592a` |
| `SnapCN_PhoneStack` | `videos`、`time` | `18b973d7592a` |
| `SnapCN_PortalIntro` | `lead`、`trail`、`title`、`brand` | `18b973d7592a` |
| `SnapCN_PromptSend` | `text`、`placeholder`、`chips` | `18b973d7592a` |
| `SnapCN_PromptZoom` | `greeting`、`text`、`placeholder`、`model`、`effort` | `18b973d7592a` |
| `SnapCN_PunchLines` | `script` | `18b973d7592a` |
| `SnapCN_ReelCollage` | `topLine`、`bottomLine`、`swapTop`、`swapBottom`、`slides`、`collage` | `18b973d7592a` |
| `SnapCN_ReelWall` | `videos` | `18b973d7592a` |
| `SnapCN_RosterGrant` | `label`、`rows` | `18b973d7592a` |
| `SnapCN_ScreenRecording` | `src` | `18b973d7592a` |
| `SnapCN_SearchTyping` | `text`、`seed` | `18b973d7592a` |
| `SnapCN_SkyLockup` | `before`、`after`、`wordmark`、`logo`、`sky` | `18b973d7592a` |
| `SnapCN_StatusCycle` | `prefix`、`statuses`、`chips` | `18b973d7592a` |
| `SnapCN_TextReveal` | `text` | `18b973d7592a` |
| `SnapCN_TextSwell` | `text` | `18b973d7592a` |
| `SnapCN_TypeMorph` | `lead`、`emphasis`、`morphTo`、`finally_` | `18b973d7592a` |
| `SnapCN_WordCaptions` | `srt` | `18b973d7592a` |
| `SnapCN_WordmarkCut` | `word` | `18b973d7592a` |
