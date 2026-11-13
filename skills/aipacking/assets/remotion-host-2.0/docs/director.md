# 编导规则（Director Rules）

这份文件是工作台的「审美」。编分镜前完整读一遍，同时遵守 `docs/visual-rules.md`（视觉硬规则，违反了校验会报错）。

目标：用户第一次看到成片就愿意发布。全程都有包装，但不是每句都上全屏：过渡句用轻包装，高光句才用重包装。宁可轻，也不要乱。

---

## 1. 先理解整条视频（写进导演思路，出片时告诉用户 2~3 行）

1. **一句话核心观点**是什么？
2. **情绪曲线**：哪里抛钩子、哪里转折、哪里是高潮、哪里收尾？
3. **分章**：3~6 章，每章一个 2~6 字的标题（写进 `chapters`）。
4. **高光句**：全片最值得被截图传播的 3~5 句话，给最强的页面。
5. **主风格家族**：按第 4 节选一个，全片统一。

---

## 2. 语义分析协议（逐句做，做完再选模板）

对 `plan/transcript.txt` 的**每一句**判断四件事：

| 判断项 | 怎么判断 |
|---|---|
| **语境类别** | 这句话在做什么，从下面 16 类里选一个 |
| **包装强度** | `1` 轻包装（真人保持全屏，旁边叠文字块/标注/关键词）· `2` 重包装（全屏页面）。**没有 0：全片每一秒都要有包装，不许出现空白的纯人物画面** |
| **上屏关键词** | 只能从原句里摘词，不许改写成原句没有的话；标题 ≤ 8 字，要点 ≤ 12 字 |
| **画面意象**（可选） | 原句里有具体画面（比喻、动作、场景）时记下来，优先选能表达这个画面的模板，没有就现场定制 |

**16 类语境**：

| # | 语境 | 典型说法 |
|---|---|---|
| 1 | 钩子 / 开场 | 第一句、抛结论、「很多人说……」 |
| 2 | 提问 / 悬念 | 「为什么……？」「你猜……」 |
| 3 | 金句 / 观点 | 下判断、可以截图传播的话 |
| 4 | 引用 / 他人说法 | 「有人说」「网上都在说」「某某报告指出」 |
| 5 | 数据 / 数字 | 具体数字、百分比、倍数、时长 |
| 6 | 对比 / 差距 | A 和 B、两类人、谁更重要 |
| 7 | 前后变化 / 趋势 | 以前 vs 现在、此消彼长、贬值 |
| 8 | 纠正误区 / 反转 | 「不是……而是……」「其实……」 |
| 9 | 并列要点 / 清单 | 2~5 个并列的东西、条件、要素 |
| 10 | 步骤 / 流程 / 因果 | 先…再…最后、A 导致 B、输入→产出 |
| 11 | 时间线 / 演变 | 时代、阶段、路线图 |
| 12 | 概念解释 / 结构 | 「所谓 X 就是」、分层、四象限、交集 |
| 13 | 情绪 / 态度 | 绝望、震惊、兴奋、吐槽 |
| 14 | 身份 / 背景 / 经历 | 自我介绍、资历、个人故事 |
| 15 | 展示 / 演示 / 证据 | 作品、录屏、聊天、提示词、截图 |
| 16 | 结构 / 章节 / 总结 / 互动 | 目录、章节切换、划重点、求关注、提问观众 |
| — | 过渡 / 口头禅 / 闲聊 | 强度 1，从原句摘一个最有态度的词做轻包装（KeywordPop、SideBlocks 加一行、SideCard），或把前后页面延长过来盖住。Banner 是警示胶带样式，只用于「注意 / 误区」 |

**强度分配原则**：
- 高光句 → 强度 2，用最强的页面。
- 个人经历、情绪表达、过渡句 → 强度 1，让人物出来，但旁边一定有东西。
- 连续三句以上都是强度 2 时，中间至少插一句强度 1，不要做成幻灯片。
- 全片露脸（强度 1 的时长）占 40%~60%，以用户要求为准。
- **全程有包装**：两页之间的空档不能超过 0.5 秒（`npm run validate` 会报错）。句子之间的停顿，把前一页延长到下一页开始即可。

---

## 3. 语境 → 模板对照表

每类语境在四个风格家族里的可选模板（详细参数见 `docs/templates.md`）。**先在主风格家族里选，主家族没有合适的再看「通用」**。叠加类（强度 1）标了 ⓘ。

| 语境 | 编辑排版 | 通用（可换风格） | 报告风 | 上一版包 |
|---|---|---|---|---|
| 1 钩子（抛结论/痛点） | SplitHero, MaskWord | HookTitle, HookGlitch | TypeHero | SplitFlapFlip, BackdropHeadline, TitleHero |
| 2 提问/悬念 | — | HookQuestion, Mystery, QAReveal | TypeHero | ImpactQuestionGlitch |
| 3 金句/观点 | MaskWord, SideBlocks ⓘ | BigWords, HighlightSentence, KeywordPop ⓘ | Statement, FocusLine | QuoteLockup, KineticEditorial, PunctuationLockup, PeoplesManifesto, NeonTripleMarquee |
| 4 引用/他人说法 | PersonQuote | Quote | QuoteCard ⓘ, NotifyStack | ZinePresenterQuote, QuoteLockup |
| 5 数据/数字 | SideBlocks ⓘ（带数字） | BigNumber, StatImpact, StatGrid, Donut, TimeCompare | FlapStat, FactPanel ⓘ | MetricFocus, MetricGrowth, OdometerDigitRoll, NeedleSweepSelftest, DataChart |
| 6 对比/差距 | Diverge, BlindTest, ScaleSwap | Versus, Bars3D, BarRace, Podium, Balance, CompareTable, Venn | ABCards, GapBars ⓘ | CompareSplit, BroadsideSplitCompare, ThreeOptionMatrix, RankDashboard |
| 7 前后变化/趋势 | TickerDrop, Crossover | BeforeAfter, LineChart, Evolution | ShiftBars, CrossChart, EditorCollapse | CapitalRisk |
| 8 纠正误区/反转 | ScaleSwap, TickRows | MythFact, Reversal, Banner ⓘ | ProfileCheck | EditorialStateStamp |
| 9 并列要点/清单 | InputTriptych, Amplify, TickRows | TripleCards, Checklist, BentoGrid, NumberedList, ProsCons, SplitPresenter | InputCards, BentoBoard, KeywordWall, DockTools | GridFlashMosaic, IconFieldColorize, DeckDealFlyIn, PanelToCanvas, PillSlotCycle, HashtagToPill, DualConceptPair |
| 10 步骤/流程/因果 | PanSteps, IntoBox, Equation | Steps, FlowChart, Funnel, Cycle | HubFlow, FlowSteps, CardDeck | AdaptiveSteps, FlowThree, VideoWorkflowPipeline, TokenVelocityRelay, SignalPathActivation, CompletionCheckRail, CardFlipReveal, ZineRisoProcess |
| 11 时间线/演变 | PanSteps | Timeline, Evolution | FlowSteps | TimelineTravel, LineCarryTransition |
| 12 概念解释/结构 | IntoBox, Equation | Definition, Pyramid, Quadrant, Venn | OrbitHub | DualConceptPair, CapitalRisk |
| 13 情绪/态度 | SideBlocks ⓘ（slam） | EmotionHit, KeywordPop ⓘ | — | SakugaTimingShift |
| 14 身份/背景 | SideBlocks ⓘ, PushSplit | ProfileCard, LowerThird ⓘ, SideCard ⓘ | FactPanel ⓘ | — |
| 15 展示/演示/证据 | PromptResult, BlindTest | Showcase, PhoneMockup, ChatThread, Terminal, PromptBox, MediaGallery, Callout ⓘ | PromptToFilm, HeroPrompt, PhoneChat, FolderDrop | ScreenOperationDemo, EvidenceWindow, WordRelayFilmstrip, PageWaterfallWall, SkeletonReveal, DrawSvgTrace, CommandPaletteSummon, BlockShowWork |
| 16 结构/章节/总结/互动 | FollowBar ⓘ | Agenda, ChapterBreak, Recap, EndCard, Poll, FollowCTA ⓘ, ProgressNav ⓘ | FollowPill ⓘ | NumberedChapter, ChapterViewpoint, BlockHeroPoster |
| 转场（两页之间） | — | — | — | TiltReveal, CubeRotate, MaskingTapeSlap, PaperPlaneMessenger, SakugaTimingShift, LineCarryTransition |

### 3.1 开场页怎么选（最容易千篇一律的地方）

「开场」是**位置**，不是语境。开场页按**前 1~3 句自己的语境**去上表里选，和别的句子一视同仁；只是强度固定为 2，且必须是全片最抓眼的一页。

| 开头在说什么 | 例句 | 优先考虑 |
|---|---|---|
| 抛结论 / 痛点 | 「一个人做号太累」 | SplitHero, HookTitle, BackdropHeadline, MaskWord |
| 提问 / 悬念 | 「为什么你越努力越穷？」 | HookQuestion, QAReveal, ImpactQuestionGlitch, Mystery |
| 热点 / 新发现 / 「最近 X 很火」 | 「最近 GitHub 上这个指南很火」 | Showcase, EvidenceWindow, PageWaterfallWall, MediaGallery, TitleHero |
| 别人的说法 / 评价 | 「有人说这是……」 | PersonQuote, NotifyStack, Quote |
| 数字 | 「我花了 3 万块」 | BigNumber, FlapStat, StatImpact |
| 对比 / 反差 | 「同样做号，有人月入十万」 | Versus, Diverge, ScaleSwap |
| 清单 / 大纲预告 | 「今天讲三件事」 | Agenda, Steps, TripleCards |
| 个人经历 / 身份 | 「我做了 8 年运营」 | PushSplit, ProfileCard |
| 原句有很具体的画面 | 「钱从屏幕里飞出来」 | 现场定制 |

硬规则：
- `plan/analysis.md` 的第一行必须写清「开头在说什么 → 为什么选这个模板」。
- **开场模板不能和上一条视频的开场一样**（`out/` 里其他视频最新一版的第一页）。`npm run validate` 会检查，撞了就换。
- 每一行的候选都是平等的，按内容挑最贴切的，不要默认选第一个。

---

## 4. 风格家族与搭配规则

| 家族 | 观感 | 适合 |
|---|---|---|
| **编辑排版**（`style: "editorial"`） | 黑白灰 + 一个强调色，大字网格，真人画面参与排版 | 观点类、知识类口播（默认推荐） |
| **通用（可换风格）** | 随 `style` 变：`keynote` 暗色发布会、`report-light` 报告浅色、`report` 报告深色、`swiss` 瑞士排版、`dataviz` 数据叙事、`whiteboard` 白板、`tech-dark` 科技暗黑 | 补充主家族没有的语境 |
| **报告风** | 苹果发布会式浅色卡片 / 玻璃 / 人物虚化背景 | 数据、产品、工具测评 |
| **上一版包** | 两种固定配色：深蓝底金色强调，或浅色画布深橙强调 | 教程、操作演示、流程讲解 |

**搭配规则（防止「风格混杂」）**：
1. **全片选一个主家族**，至少 70% 的页面来自主家族。
2. **通用模板的 `style` 跟主家族对齐**：主家族是编辑排版就用 `editorial`，报告风就用 `report-light` / `report-glass`，包就用 `keynote`（深色）或 `report-light`（浅色）。整条视频写在顶层 `"style"`，不要逐页换。
3. **一章之内不换家族**；换家族只能发生在章节切换处。
4. 深色页面和浅色页面不要来回交替（同一章内统一深或浅）。
5. 全片强调色一处设定（4.1 节的 `palette`），同一章只用 1~2 个强调色。

### 4.1 按视频主题定配色

整体仍是「黑白灰 + 一个强调色」，但**强调色跟着这条视频的主题走**，不要每条都用同一个蓝。在 plan.json 顶层写：

```json
"palette": { "main": "#E8590C", "alert": "#D92B1F" }
```

- `main`：主强调色（高亮词、数字、选中格、结论色块）。`alert`：否定/划线/警示用，一般保持红色；`main` 本身是红色时，`alert` 写 `#0A0A0B`（用黑色划线）。
- 颜色太浅会被自动加深到看得清，不用自己算对比度。

| 视频主题 | main | 说明 |
|---|---|---|
| AI / 科技 / 工具 / 效率 | `#2F5BFF` 电光蓝 | 默认 |
| 钱 / 理财 / 商业 / 副业 | `#0F7B55` 墨绿 | |
| 生活 / 人生建议 / 成长 / 省钱 | `#E8590C` 暖橙 | |
| 学习 / 知识 / 读书 / 考试 | `#5B3FD6` 靛紫 | |
| 情感 / 关系 / 女性 / 家庭 | `#B0234F` 酒红 | 不要用糖果粉 |
| 热点 / 新闻 / 避坑 / 警示 | `#D92B1F` 信号红 | 此时 alert 用 `#0A0A0B` |
| 美食 / 旅行 / 设计 / 时尚 | `#C27C0E` 琥珀 | |

表里没有的主题按同样思路选一个**饱和、偏深**的颜色，并在 `plan/analysis.md` 第一行写明「主题 → 配色」。禁止糖果色、荧光色、渐变。

---

## 5. 节奏与密度

- **每页时长**：不能短于模板的「最短时长」（`docs/templates.md` 里写着，校验会检查）；全屏页一般 2~5 秒，超过 8 秒拆成两页。
- **切点**：页面的开始/结束卡在**字幕句子的边界**上（`start` = 某句的开始时间）。相邻全屏页首尾相接，中间不要留 < 0.3 秒的人物闪现。
- **元素卡点**：每个关键元素都用 `at` 卡在对应的词上，**写原句里的关键词**（`"at": "绝望"`），不要自己估秒数。
- **开头 3 秒**必须有强视觉（按 3.1 节选），不要一上来就是人物干讲。
- **高光句的结论词至少停留 1.5 秒**：结论词往往在句末才说出口，页面卡在句子边界结束的话，它只能闪一下。这种情况把页面延长到下一句里（下一页相应缩短，但不能短于它的最短时长）。

## 6. 多样性（避免「PPT 感」）

- 同一种模板**不连用**；全片同一模板最多出现 2 次。
- 一条 60 秒视频至少用 **10 种**不同模板；90 秒以上至少 14 种。
- 相邻两个全屏页不要同一种版式（比如两个都是「左右对比」）。

## 7. 文案上屏

- **页面上的字永远比口播少**，只放关键词。
- 上屏文字必须能在原句里找到出处；数字、事实必须来自文案，示意性质的数据写「示意」。
- 模板有字数上限的（`docs/templates.md` 的「limits」），超了校验会报错：精简文字，或换一个容量更大的模板，或拆成两页。**不许缩小字号硬塞**。
- 字幕已烧录的视频：叠加层不要放在底部 150px（字幕区），避开脸。

## 8. 什么时候现场定制

- 原句有很具体的画面感（比喻、场景、动作），模板只能抽象表达；
- 同一个语境在视频里反复出现，需要一个专属的视觉母题；
- 用户明确说「这个模板不行，我要 xx 样的」。

定制流程见 `AGENTS.md` 第四节；定制页面同样要遵守 `docs/visual-rules.md`。
