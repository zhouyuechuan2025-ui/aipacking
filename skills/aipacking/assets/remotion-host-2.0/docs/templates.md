# 模板目录（161 个）

> 由 `npm run catalog` 从 docs/catalog.json 自动生成，不要手改。props 里的 `at`/`xxxAt` 用来让元素卡在某个词说出口的瞬间：**写原句里的关键词**（如 `"at": "绝望"`），脚本自动换算成秒；示例里省略了 at，元素会按默认节奏依次出现。每页的时长不能短于「最短时长」，否则校验报错。视觉硬规则见 docs/visual-rules.md。

## 编辑·两侧

### SideBlocks  `left|right`
- 语境：编辑·两侧/文字块
- 何时用：观点、背景、自我介绍、暴论：真人保持全屏，2~3 个关键词块从侧边拉出；可带大数字（number）、划线（strike）、✓/未必（mark）。露脸时的首选
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "SideBlocks",
 "layout": "left",
 "props": {
  "meta": "BACKGROUND · 我的背景",
  "lines": [
   {
    "text": "中传科班"
   },
   {
    "text": "做传媒多年"
   },
   {
    "text": "有点绝望",
    "hi": true,
    "slam": true
   }
  ]
 }
}
```

### FollowBar  `overlay`
- 语境：编辑·两侧/结尾关注
- 何时用：结尾求关注：纸白条从左推出，按钮被点一下
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "FollowBar",
 "layout": "overlay",
 "props": {
  "meta": "FOLLOW",
  "name": "关注 nana",
  "sub": "持续分享 AI 实战经验"
 }
}
```

## 两侧

### SideBeats  `left|right`
- 语境：两侧/逐词侧边动效
- 何时用：真人侧边按台词逐项揭示：tags 标签、signal 指标提示、steps 步骤轨、stack 文字条
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "SideBeats",
 "layout": "left",
 "props": {
  "variant": "steps",
  "items": [
   {
    "text": "自动签到",
    "at": 2.1
   },
   {
    "text": "自动领取",
    "at": 4.2,
    "highlight": true
   }
  ]
 }
}
```

## 编辑·变形

### SplitHero  `full`
- 语境：编辑·变形/开场分屏
- 何时用：开场第一句、全片主题：左侧真人画面擦出，右侧巨型标题 + 等宽元信息，结束时真人放大回全屏
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "SplitHero",
 "layout": "full",
 "props": {
  "meta": "PROMPT → FILM",
  "lines": [
   "一句话",
   "生成成片"
  ],
  "hi": 1,
  "size": 210,
  "caption": "REC ● OPUS 5.5",
  "facts": [
   {
    "k": "MODEL",
    "v": "Opus 5.5"
   },
   {
    "k": "PROMPT",
    "v": "1 句话"
   },
   {
    "k": "OUTPUT",
    "v": "成片"
   }
  ]
 }
}
```

### PushSplit  `full`
- 语境：编辑·变形/推开分屏
- 何时用：讲要点又要露脸：左侧纸面把真人推到右边，大字逐行升起，可带一个大数字
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "PushSplit",
 "layout": "full",
 "props": {
  "meta": "KEY POINT",
  "lines": [
   {
    "text": "技术平权"
   },
   {
    "text": "差距更大",
    "hi": true
   }
  ],
  "notes": [
   {
    "text": "会用 AI 的人 vs 普通使用者"
   }
  ]
 }
}
```

### PersonQuote  `full`
- 语境：编辑·变形/帖子引用
- 何时用：引用网上的说法/别人的话：真人缩成一张倾斜的帖子卡片，左侧引用语逐词砸入
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "PersonQuote",
 "layout": "full",
 "props": {
  "meta": "PUBLIC OPINION",
  "caption": "@ 网络热议",
  "words": [
   {
    "text": "直接"
   },
   {
    "text": "杀死比赛",
    "hi": true
   }
  ]
 }
}
```

### Diverge  `full`
- 语境：编辑·变形/差距拉开
- 何时用：差距越来越大、两极分化：两条线从同一点出发越拉越开，真人缩成小窗
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Diverge",
 "layout": "full",
 "props": {
  "meta": "GAP · 差距",
  "title": "人和人的差距",
  "note": "前所未有的大",
  "upLabel": "会用 AI 的人",
  "downLabel": "普通使用者"
 }
}
```

### MaskWord  `full`
- 语境：编辑·变形/画面藏进字里
- 何时用：全片最强金句：黑底，左侧句子逐行升起，右侧一个巨型字，真人画面只出现在笔画里
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "MaskWord",
 "layout": "full",
 "props": {
  "meta": "THE CEILING",
  "lines": [
   {
    "text": "AI 的上限"
   },
   {
    "text": "永远取决于"
   },
   {
    "text": "使用它的",
    "hi": true
   }
  ],
  "word": "人",
  "size": 120
 }
}
```

### PromptResult  `full`
- 语境：编辑·变形/结果位
- 何时用：一句话指令 → 得到结果：顶部输入框打字、回车，真人画面落进结果位
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PromptResult",
 "layout": "full",
 "props": {
  "meta": "PROMPT",
  "prompt": "帮我做一条产品介绍视频",
  "result": "基础成片",
  "resultSub": "一句话提示词就能做到"
 }
}
```

### InputTriptych  `full`
- 语境：编辑·变形/三栏输入
- 何时用：先否定旧观点，再给出三要素：划掉旧词 → 参考/素材/指令三栏落下
- 最短时长：3 秒
- 示例：
```json
{
 "type": "InputTriptych",
 "layout": "full",
 "props": {
  "old": "会不会操作软件",
  "cols": [
   {
    "t": "参考",
    "sub": "你想要的样子"
   },
   {
    "t": "素材",
    "sub": "真实的内容"
   },
   {
    "t": "指令",
    "sub": "清晰的要求",
    "lines": [
     "风格：发布会排版",
     "节奏：跟随口播"
    ]
   }
  ]
 }
}
```

### Amplify  `full`
- 语境：编辑·变形/能力放大
- 何时用：几个能力/条件 → 价值被放大：左侧能力词逐个出现，右侧真人卡片在关键词时放大
- 最短时长：3 秒
- 示例：
```json
{
 "type": "Amplify",
 "layout": "full",
 "props": {
  "meta": "CREATOR",
  "words": [
   {
    "t": "懂内容"
   },
   {
    "t": "懂流量"
   },
   {
    "t": "有审美"
   }
  ],
  "ampText": "AI 的价值，彻底放大"
 }
}
```

## 编辑·全屏

### TickerDrop  `full`
- 语境：编辑·全屏/断崖下跌
- 何时用：某样东西贬值、崩盘、不再重要：行情线一路走高，说到关键词时断崖下跌（示意）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TickerDrop",
 "layout": "full",
 "props": {
  "meta": "SKILL INDEX · 示意",
  "title": "剪辑包装技巧",
  "dropWord": "↓ 小儿科",
  "dropMeta": "在强模型面前",
  "marks": [
   {
    "x": 0.12,
    "label": "苦练 · 第 1 年"
   },
   {
    "x": 0.72,
    "label": "强模型出现"
   }
  ]
 }
}
```

### Crossover  `full`
- 语境：编辑·全屏/此消彼长
- 何时用：一个上升一个下降：两个巨型词沿相反的线运动并交叉
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Crossover",
 "layout": "full",
 "props": {
  "up": "模型能力",
  "upMeta": "MODEL ↑",
  "down": "工具操作",
  "downMeta": "SKILL ↓",
  "cross": "当模型足够强"
 }
}
```

### BlindTest  `full`
- 语境：编辑·全屏/盲测对比
- 何时用：两者分不出高下：两个画面并排扫描比对，结论大字横着砸过
- 最短时长：3 秒
- 示例：
```json
{
 "type": "BlindTest",
 "layout": "full",
 "props": {
  "meta": "BLIND TEST · 盲测",
  "a": "AI 生成",
  "b": "专业动效师",
  "verdict": "根本分不清"
 }
}
```

### IntoBox  `full`
- 语境：编辑·全屏/输入黑盒
- 何时用：把 X、Y、Z 交给 AI → 得到结果：巨型词沿线条送进黑盒子，盒子吐出结果
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "IntoBox",
 "layout": "full",
 "props": {
  "inputs": [
   {
    "t": "审美"
   },
   {
    "t": "判断"
   },
   {
    "t": "创作思考"
   }
  ],
  "box": "AI",
  "out": "好作品"
 }
}
```

### TickRows  `full`
- 语境：编辑·全屏/核对表
- 何时用：条件清单逐条判断：条目逐行出现，右侧盖 ✓ 或「未必」，适合纠正误区
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "TickRows",
 "layout": "full",
 "props": {
  "meta": "PROFILE CHECK",
  "title": "技术型选手",
  "rows": [
   {
    "text": "很懂代码"
   },
   {
    "text": "精通 AI 底层"
   },
   {
    "text": "做出好作品",
    "state": "no"
   }
  ]
 }
}
```

### ScaleSwap  `full`
- 语境：编辑·全屏/不在 A 而在 B
- 何时用：「关键不在 A，而在 B」：前者缩小变灰划掉，后者放大变色
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ScaleSwap",
 "layout": "full",
 "props": {
  "meta": "WHAT MATTERS",
  "q": "以后 AI 内容的质量差距",
  "a": "工具熟练度",
  "aMeta": "根本不在",
  "b": "内容判断力",
  "bMeta": "而在创作者本身的"
 }
}
```

### PanSteps  `full`
- 语境：编辑·全屏/横移步骤
- 何时用：有先后的 2~4 步：镜头横向平移，巨型步骤词逐个滑入并用箭头连接
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PanSteps",
 "layout": "full",
 "props": {
  "meta": "ROADMAP",
  "title": "想靠 AI 赚钱？",
  "steps": [
   {
    "t": "做账号"
   },
   {
    "t": "做内容"
   },
   {
    "t": "变现"
   }
  ]
 }
}
```

### Equation  `full`
- 语境：编辑·全屏/算式
- 何时用：A + B → C = 结果：一条算式按节拍逐项出现，结果项高亮
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Equation",
 "layout": "full",
 "props": {
  "meta": "FORMULA",
  "terms": [
   {
    "t": "流量",
    "m": "TRAFFIC"
   },
   {
    "t": "+"
   },
   {
    "t": "商业",
    "m": "BUSINESS"
   },
   {
    "t": "→"
   },
   {
    "t": "AI",
    "box": true,
    "m": "TOOL"
   },
   {
    "t": "="
   },
   {
    "t": "价值",
    "hi": true,
    "m": "VALUE"
   }
  ],
  "foot": "一定是先搞懂流量和商业"
 }
}
```

## 钩子

### HookTitle  `full`
- 语境：钩子/开场
- 何时用：开头第一句、全片最强结论、爆点词（≤6字最佳）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "HookTitle",
 "layout": "full",
 "bg": {
  "variant": "aurora"
 },
 "props": {
  "kicker": "很多人说",
  "title": "杀死比赛",
  "en": "GAME OVER",
  "color": "pink"
 }
}
```

### HookQuestion  `full`
- 语境：钩子/提问
- 何时用：用问题开场、抛悬念、反问观众
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "HookQuestion",
 "layout": "full",
 "props": {
  "kicker": "先问你一个问题",
  "question": "为什么同样用 AI，有人月入十万？",
  "sub": "答案可能和你想的不一样"
 }
}
```

### HookGlitch  `full`
- 语境：钩子/冲击
- 何时用：颠覆性观点、技术感强的开场、「系统崩了」类情绪
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "HookGlitch",
 "layout": "full",
 "props": {
  "title": "AI 改变一切",
  "sub": "SYSTEM OVERRIDE"
 }
}
```

### QAReveal  `full`
- 语境：钩子/问答揭晓
- 何时用：「很多人问我……答案是……」：先抛问题，停顿后揭晓答案，答案里用 [ ] 包住要高亮的词
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "QAReveal",
 "layout": "full",
 "props": {
  "q": "AI 时代，什么能力最值钱？",
  "a": "不是工具，是[判断力]"
 }
}
```

## 金句

### BigWords  `full`
- 语境：金句
- 何时用：一句话拆成 2~4 个词逐个砸下，跟着语音节奏
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "BigWords",
 "layout": "full",
 "props": {
  "words": [
   {
    "text": "不是工具"
   },
   {
    "text": "是"
   },
   {
    "text": "判断力"
   }
  ],
  "color": "gold"
 }
}
```

### HighlightSentence  `full`
- 语境：金句
- 何时用：完整一句话 + 关键词马克笔高亮，用 [] 包住关键词
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "HighlightSentence",
 "layout": "full",
 "props": {
  "kicker": "记住这句话",
  "text": "AI 的上限，永远取决于[使用它的人]"
 }
}
```

### Statement  `full`
- 语境：金句/结论大字
- 何时用：苹果发布会式大字，[方括号] 内的词渐变高亮
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Statement",
 "layout": "full",
 "props": {
  "eyebrow": "THE CEILING",
  "lines": [
   {
    "text": "AI 的上限",
    "at": 27.2
   },
   {
    "text": "永远取决于[使用它的人]",
    "at": 28.1
   }
  ],
  "size": 112
 }
}
```

## 引用

### Quote  `full`
- 语境：引用/观点
- 何时用：名言、别人的原话、需要郑重其事的观点
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Quote",
 "layout": "full",
 "props": {
  "lines": [
   "AI 的上限",
   "永远取决于使用它的人"
  ],
  "highlightLine": 1,
  "author": "nana"
 }
}
```

### QuoteCard  `right`
- 语境：引用/新闻/报告
- 何时用：引用别人的话、新闻或报告时的白色纸面卡（带出处）
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "QuoteCard",
 "layout": "right",
 "props": {
  "source": "网络热议",
  "sub": "关于 Opus 5.5 的评价",
  "en": "PUBLIC OPINION",
  "quote": "“Opus 5.5\n直接杀死比赛”",
  "lines": [
   1,
   2,
   3
  ],
  "foot": "很多人这么说"
 }
}
```

## 数据

### BigNumber  `full`
- 语境：数据
- 何时用：单个震撼数字（金额/增长/人数），数字要从文案里来
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "BigNumber",
 "layout": "full",
 "props": {
  "label": "我的账号三个月涨粉",
  "value": 12.8,
  "decimals": 1,
  "unit": "万",
  "caption": "全靠 AI 做内容",
  "color": "cyan"
 }
}
```

### StatImpact  `full`
- 语境：数据/百分比
- 何时用：百分比、进度、分数逐级升高（60→80→100）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "StatImpact",
 "layout": "full",
 "props": {
  "kicker": "UNLOCK THE POTENTIAL",
  "label": "发挥潜力",
  "finalWord": "拉 满",
  "keyframes": [
   {
    "value": 60
   },
   {
    "value": 80
   },
   {
    "value": 100
   }
  ]
 }
}
```

### StatGrid  `full`
- 语境：数据/多指标
- 何时用：同时出现 2~4 个指标
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "StatGrid",
 "layout": "full",
 "props": {
  "title": "一条视频的成本",
  "stats": [
   {
    "label": "制作时间",
    "value": 15,
    "unit": "分钟",
    "en": "TIME"
   },
   {
    "label": "外部素材",
    "value": 0,
    "unit": "张",
    "en": "ASSETS"
   },
   {
    "label": "动效页面",
    "value": 27,
    "unit": "页",
    "en": "SCENES"
   }
  ]
 }
}
```

### TimeCompare  `full`
- 语境：数据/时间对比
- 何时用：「以前要 3 天，现在 15 分钟」：两条时长条（sec 填换算成秒的时长，决定条的长度），最后一句结论
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TimeCompare",
 "layout": "full",
 "props": {
  "title": "做一条包装视频要多久",
  "before": {
   "label": "以前 · 专业软件",
   "value": "3",
   "unit": " 天",
   "sec": 259200
  },
  "after": {
   "label": "现在 · 一句话",
   "value": "15",
   "unit": " 分钟",
   "sec": 900
  },
  "note": "快了 288 倍"
 }
}
```

## 排行

### BarRace  `full`
- 语境：排行/对比数据
- 何时用：多个项目比大小、排行榜（数据新闻风，带空间倾斜）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "BarRace",
 "layout": "full",
 "props": {
  "title": "各类视频内容热度",
  "kicker": "示意数据",
  "items": [
   {
    "label": "科普知识",
    "value": 107
   },
   {
    "label": "游戏",
    "value": 87
   },
   {
    "label": "影视解说",
    "value": 81
   },
   {
    "label": "美食",
    "value": 78
   },
   {
    "label": "旅行",
    "value": 64
   }
  ]
 }
}
```

### Podium  `full`
- 语境：排行/前三
- 何时用：TOP3、冠亚季军
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Podium",
 "layout": "full",
 "props": {
  "title": "最值得学的三件事",
  "items": [
   {
    "label": "内容判断"
   },
   {
    "label": "流量思维"
   },
   {
    "label": "AI 工具"
   }
  ]
 }
}
```

## 占比

### Donut  `full`
- 语境：占比
- 何时用：比例、构成、时间分配
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Donut",
 "layout": "full",
 "props": {
  "title": "做好一条 AI 视频",
  "segments": [
   {
    "label": "选题判断",
    "value": 40
   },
   {
    "label": "素材参考",
    "value": 30
   },
   {
    "label": "提示词",
    "value": 20
   },
   {
    "label": "工具操作",
    "value": 10
   }
  ],
  "centerLabel": "精力分配"
 }
}
```

## 差距

### Bars3D  `full`
- 语境：差距/对比数据
- 何时用：两三个数值的戏剧性差距（3D 柱，镜头环绕）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Bars3D",
 "layout": "full",
 "props": {
  "title": "差距拉到前所未有的大",
  "series": [
   {
    "label": "创作者 A",
    "value": 18,
    "display": "普通",
    "color": "cyan"
   },
   {
    "label": "创作者 B",
    "value": 100,
    "display": "×10",
    "color": "gold"
   }
  ]
 }
}
```

## 趋势

### LineChart  `full`
- 语境：趋势
- 何时用：两条趋势此消彼长、增长曲线
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "LineChart",
 "layout": "full",
 "props": {
  "title": "当模型足够强",
  "xLabels": [
   "2023",
   "2024",
   "2025",
   "2026"
  ],
  "series": [
   {
    "label": "模型能力 ↑",
    "color": "cyan",
    "values": [
     0.1,
     0.3,
     0.6,
     0.95
    ]
   },
   {
    "label": "工具操作 ↓",
    "color": "pink",
    "values": [
     0.8,
     0.55,
     0.3,
     0.1
    ],
    "labelDy": 70
   }
  ],
  "callout": {
   "text": "工具越来越不重要"
  }
 }
}
```

## 对比

### Versus  `full`
- 语境：对比
- 何时用：两类人/两种做法并列对比，可以 focus 其中一边
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Versus",
 "layout": "full",
 "props": {
  "focus": "right",
  "left": {
   "tag": "技术派",
   "title": "技术理解",
   "items": [
    "很懂代码",
    "精通底层"
   ]
  },
  "right": {
   "tag": "创作派",
   "title": "内容创作",
   "items": [
    "懂流量",
    "有审美",
    "有设计思维"
   ]
  },
  "verdict": {
   "text": "价值 ×10",
   "color": "gold"
  }
 }
}
```

### Quadrant  `full`
- 语境：对比/四象限
- 何时用：两个维度分出四类人或四种情况，最后高亮其中一格（hi：0 左上 1 右上 2 左下 3 右下）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Quadrant",
 "layout": "full",
 "props": {
  "title": "你在哪个象限？",
  "x": [
   "不会用 AI",
   "会用 AI"
  ],
  "y": [
   "没判断力",
   "有判断力"
  ],
  "cells": [
   {
    "text": "被替代",
    "sub": "最危险"
   },
   {
    "text": "被放大",
    "sub": "最赚钱"
   },
   {
    "text": "原地踏步"
   },
   {
    "text": "工具人"
   }
  ],
  "hi": 1
 }
}
```

### CompareTable  `full`
- 语境：对比/对照表
- 何时用：多个维度逐项对比 A 和 B（2 列、3~5 行），值可以写文字或 ✓ / ✕，win 指定胜出的一列（0 或 1）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CompareTable",
 "layout": "full",
 "props": {
  "title": "专业动效师 vs AI",
  "cols": [
   "专业动效师",
   "AI"
  ],
  "win": 1,
  "rows": [
   {
    "k": "出片时间",
    "a": "3 天",
    "b": "15 分钟"
   },
   {
    "k": "需要的技术",
    "a": "✓",
    "b": "✕"
   },
   {
    "k": "成本",
    "a": "高",
    "b": "几乎为零"
   }
  ]
 }
}
```

### Venn  `full`
- 语境：对比/交集
- 何时用：「既要 A 又要 B，交集才是 C」：两个圆靠拢，重叠处出现结论
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Venn",
 "layout": "full",
 "props": {
  "title": "真正值钱的人",
  "a": "懂内容",
  "aSub": "知道拍什么",
  "b": "会用 AI",
  "bSub": "知道怎么做",
  "mid": "稀缺"
 }
}
```

### ProsCons  `full`
- 语境：对比/优缺点
- 何时用：好处和代价两栏并列（每栏 2~4 条）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "ProsCons",
 "layout": "full",
 "props": {
  "title": "全靠 AI 做内容",
  "pros": [
   "出片快",
   "成本低",
   "不用学软件"
  ],
  "cons": [
   "同质化严重",
   "没有个人风格"
  ]
 }
}
```

## 前后变化

### BeforeAfter  `full`
- 语境：前后变化
- 何时用：以前 vs 现在、用 AI 前 vs 用 AI 后
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "BeforeAfter",
 "layout": "full",
 "props": {
  "before": {
   "title": "以前",
   "lines": [
    "剪一条片 2 天",
    "学 AE 3 个月"
   ]
  },
  "after": {
   "title": "现在",
   "lines": [
    "一句话生成",
    "15 分钟出片"
   ]
  }
 }
}
```

## 权衡

### Balance  `full`
- 语境：权衡/比较
- 何时用：A 与 B 谁更重要，天平倒向赢家
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Balance",
 "layout": "full",
 "props": {
  "title": "JUDGMENT > TOOL",
  "winner": "right",
  "left": {
   "label": "工具熟练度",
   "en": "TOOL SKILL"
  },
  "right": {
   "label": "内容判断力",
   "en": "JUDGMENT"
  }
 }
}
```

## 误区

### MythFact  `full`
- 语境：误区/真相
- 何时用：纠正常见误解：误区 ✕ → 真相 ✓
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "MythFact",
 "layout": "full",
 "props": {
  "title": "最常见的误区",
  "myth": "学会 AI 工具就能赚钱",
  "fact": "先懂流量和商业，AI 才有价值"
 }
}
```

## 反转

### Reversal  `full`
- 语境：反转/打脸
- 何时用：先说一个旧观点，再划掉给出新观点
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Reversal",
 "layout": "full",
 "props": {
  "from": "AI 会取代创作者",
  "to": "AI 会放大创作者"
 }
}
```

## 并列要点(2~4)

### TripleCards  `full`
- 语境：并列要点(2~4)
- 何时用：并列的 2~4 个概念，可 merge 汇聚成一个核心
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TripleCards",
 "layout": "full",
 "props": {
  "kicker": "FEED IT",
  "title": "把这些喂给 AI",
  "cards": [
   {
    "title": "审美",
    "en": "TASTE"
   },
   {
    "title": "判断",
    "en": "JUDGMENT"
   },
   {
    "title": "创作思考",
    "en": "THINKING"
   }
  ],
  "merge": {
   "label": "AI"
  }
 }
}
```

## 清单

### Checklist  `full`
- 语境：清单
- 何时用：条件、要求、需要逐条打勾的事项
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Checklist",
 "layout": "full",
 "props": {
  "kicker": "CHECKLIST",
  "title": "高质量输入三要素",
  "items": [
   "参考：你想要的样子",
   "素材：真实的内容",
   "指令：清晰的要求"
  ]
 }
}
```

## 要点墙

### BentoGrid  `full`
- 语境：要点墙
- 何时用：4~6 个关键词/能力/特征一次铺开
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "BentoGrid",
 "layout": "full",
 "props": {
  "title": "一个好创作者需要",
  "cells": [
   {
    "title": "内容判断",
    "icon": "◎",
    "sub": "知道什么值得拍"
   },
   {
    "title": "流量",
    "icon": "↗"
   },
   {
    "title": "审美",
    "icon": "✦"
   },
   {
    "title": "设计思维",
    "icon": "▦"
   },
   {
    "title": "商业",
    "icon": "¥"
   },
   {
    "title": "AI 工具",
    "icon": "⚡",
    "sub": "放大前面所有能力"
   }
  ]
 }
}
```

## 编号要点

### NumberedList  `full`
- 语境：编号要点
- 何时用：有顺序的要点，逐条高亮（第一、第二、第三）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "NumberedList",
 "layout": "full",
 "props": {
  "title": "三个建议",
  "items": [
   {
    "title": "别死磕工具",
    "sub": "工具迭代太快"
   },
   {
    "title": "先懂流量",
    "sub": "知道观众要什么"
   },
   {
    "title": "再用 AI 放大",
    "sub": "效率 ×10"
   }
  ]
 }
}
```

## 步骤

### Steps  `full`
- 语境：步骤
- 何时用：横向 2~4 步流程，可盖章强调
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Steps",
 "layout": "full",
 "props": {
  "kicker": "如果你想",
  "title": "靠 AI 赚钱",
  "steps": [
   {
    "title": "做账号",
    "en": "ACCOUNT"
   },
   {
    "title": "做内容",
    "en": "CONTENT"
   },
   {
    "title": "变现",
    "en": "REVENUE"
   }
  ],
  "stamp": {
   "text": "别死磕工具"
  }
 }
}
```

### CardDeck  `full`
- 语境：步骤/阶段/几个要点轮换
- 何时用：3D 卡片堆，每个时间点前卡落下、下一张顶上；左侧同步高亮目录
- 最短时长：3 秒
- 示例：
```json
{
 "type": "CardDeck",
 "layout": "full",
 "props": {
  "eyebrow": "MONETIZE",
  "title": "想靠 AI 赚钱？",
  "cards": [
   {
    "title": "做账号",
    "sub": "定位 · 人设 · 选题",
    "icon": "user",
    "color": "blue",
    "at": 65.9
   },
   {
    "title": "做内容",
    "sub": "持续产出好作品",
    "icon": "doc",
    "color": "violet",
    "at": 66.5
   },
   {
    "title": "变现",
    "sub": "流量 → 商业价值",
    "icon": "money",
    "color": "green",
    "at": 67.1
   }
  ],
  "color": "blue"
 }
}
```

## 流程

### FlowChart  `full`
- 语境：流程/因果链
- 何时用：A→B→C 的因果或工作流，有流动光点
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "FlowChart",
 "layout": "full",
 "props": {
  "title": "一条视频是怎么来的",
  "nodes": [
   {
    "title": "一句话",
    "en": "PROMPT"
   },
   {
    "title": "写代码",
    "en": "CODE"
   },
   {
    "title": "渲染",
    "en": "RENDER"
   },
   {
    "title": "成片",
    "en": "VIDEO"
   }
  ]
 }
}
```

## 漏斗

### Funnel  `full`
- 语境：漏斗/筛选
- 何时用：转化链路、层层筛选
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Funnel",
 "layout": "full",
 "props": {
  "title": "流量是怎么变成钱的",
  "stages": [
   {
    "label": "曝光",
    "value": "100万"
   },
   {
    "label": "点赞关注",
    "value": "5万"
   },
   {
    "label": "私信咨询",
    "value": "2000"
   },
   {
    "label": "成交",
    "value": "300"
   }
  ]
 }
}
```

## 闭环

### Cycle  `full`
- 语境：闭环/飞轮
- 何时用：循环、正反馈飞轮
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Cycle",
 "layout": "full",
 "props": {
  "title": "内容飞轮",
  "center": "AI",
  "nodes": [
   {
    "title": "选题"
   },
   {
    "title": "制作"
   },
   {
    "title": "发布"
   },
   {
    "title": "复盘"
   }
  ]
 }
}
```

## 顺序

### Timeline  `full`
- 语境：顺序/时间线
- 何时用：先后顺序、优先级（先 A 再 B 最后 C）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Timeline",
 "layout": "full",
 "props": {
  "kicker": "THE RIGHT ORDER",
  "title": "一定是先搞懂",
  "nodes": [
   {
    "title": "流量",
    "en": "TRAFFIC"
   },
   {
    "title": "商业",
    "en": "BUSINESS"
   },
   {
    "title": "AI",
    "en": "THEN AI"
   }
  ]
 }
}
```

## 演变

### Evolution  `full`
- 语境：演变/时代
- 何时用：从过去到现在的演进（年份+阶段）
- 最短时长：3 秒
- 示例：
```json
{
 "type": "Evolution",
 "layout": "full",
 "props": {
  "title": "视频制作的三个时代",
  "eras": [
   {
    "year": "2015",
    "title": "专业软件",
    "sub": "AE / PR"
   },
   {
    "year": "2020",
    "title": "剪映模板",
    "sub": "人人可剪"
   },
   {
    "year": "2026",
    "title": "一句话生成",
    "sub": "AI 原生"
   }
  ]
 }
}
```

## 悬念揭晓

### Mystery  `full`
- 语境：悬念揭晓
- 何时用：「答案是……」停顿后揭晓
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Mystery",
 "layout": "full",
 "props": {
  "lead": "真正拉开差距的是……",
  "answer": "判断力"
 }
}
```

## 情绪

### EmotionHit  `full`
- 语境：情绪
- 何时用：震惊/绝望/狂喜等强情绪词（1~3 字）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "EmotionHit",
 "layout": "full",
 "props": {
  "word": "绝望",
  "sub": "DESPAIR",
  "color": "red"
 }
}
```

## 身份

### ProfileCard  `full`
- 语境：身份/背景
- 何时用：自我介绍、资历背书
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "ProfileCard",
 "layout": "full",
 "props": {
  "kicker": "WHO AM I",
  "name": "nana",
  "creds": [
   {
    "text": "中国传媒大学 · 本科",
    "icon": "🎓"
   },
   {
    "text": "传媒行业多年"
   },
   {
    "text": "AI 自媒体博主"
   }
  ],
  "photo": "self"
 }
}
```

## 作品

### Showcase  `full`
- 语境：作品/工具展示
- 何时用：展示一段视频/网页/截图（浏览器样机 + 提示词）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Showcase",
 "layout": "full",
 "props": {
  "media": "self",
  "kicker": "ONE PROMPT → FULL VIDEO",
  "prompt": "帮我做一支炫酷的展示片",
  "titleLines": [
   "一句话",
   "直接生成"
  ]
 }
}
```

## 手机

### PhoneMockup  `full`
- 语境：手机/App/短视频
- 何时用：展示手机端内容、App、短视频账号
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "PhoneMockup",
 "layout": "full",
 "props": {
  "media": "self",
  "kicker": "竖屏短视频",
  "titleLines": [
   "用代码",
   "做短视频"
  ],
  "bullets": [
   "一句话出片",
   "自动卡点"
  ]
 }
}
```

## AI 对话

### ChatThread  `full`
- 语境：AI 对话
- 何时用：和 AI 的对话过程、问答
- 最短时长：3 秒
- 示例：
```json
{
 "type": "ChatThread",
 "layout": "full",
 "props": {
  "title": "我是这样跟 AI 说的",
  "messages": [
   {
    "from": "me",
    "text": "帮我做一支炫酷的展示片"
   },
   {
    "from": "ai",
    "text": "好的，我先用代码搭 8 个场景，再按 120 BPM 卡点。"
   }
  ]
 }
}
```

## 代码

### Terminal  `full`
- 语境：代码/命令行
- 何时用：技术过程、跑命令、写代码
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Terminal",
 "layout": "full",
 "props": {
  "lines": [
   {
    "text": "npx remotion render Final out.mp4"
   },
   {
    "text": "✓ 2347 frames rendered",
    "type": "out"
   },
   {
    "text": "✓ done in 4m 12s",
    "type": "out",
    "color": "cyan"
   }
  ]
 }
}
```

## 提示词

### PromptBox  `full`
- 语境：提示词/一句话
- 何时用：「一句话提示词就能……」输入→发送→结果
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "PromptBox",
 "layout": "full",
 "props": {
  "kicker": "ONE PROMPT",
  "prompt": "做一支 AI 视频，要炫酷",
  "result": "基础成片 ✓",
  "resultSub": "60 / 100"
 }
}
```

## 案例

### MediaGallery  `full`
- 语境：案例/作品集
- 何时用：多个案例、截图、作品轮播（3D 封面流）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "MediaGallery",
 "layout": "full",
 "props": {
  "title": "使用者作品",
  "items": [
   {
    "src": "self",
    "caption": "案例 01"
   },
   {
    "src": "self",
    "caption": "案例 02"
   },
   {
    "src": "self",
    "caption": "案例 03"
   }
  ]
 }
}
```

## 画中画讲解

### SplitPresenter  `full`
- 语境：画中画讲解
- 何时用：人物缩进窗口 + 右侧要点，适合需要露脸又要信息的段落
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "SplitPresenter",
 "layout": "full",
 "props": {
  "kicker": "KEY POINTS",
  "title": "创作者真正的壁垒",
  "points": [
   "懂内容",
   "懂流量",
   "有审美"
  ]
 }
}
```

## 章节切换

### ChapterBreak  `full`
- 语境：章节切换
- 何时用：进入新章节（每章开头 1~1.5 秒）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "ChapterBreak",
 "layout": "full",
 "props": {
  "index": 2,
  "title": "技巧贬值",
  "en": "CHAPTER TWO"
 }
}
```

## 总结

### Recap  `full`
- 语境：总结
- 何时用：结尾划重点
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Recap",
 "layout": "full",
 "props": {
  "title": "划重点",
  "points": [
   "别死磕工具",
   "先懂流量和商业",
   "把审美喂给 AI",
   "判断力 > 工具"
  ]
 }
}
```

## 结尾

### EndCard  `full`
- 语境：结尾/关注
- 何时用：整屏结尾关注页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "EndCard",
 "layout": "full",
 "props": {
  "name": "nana",
  "desc": "AI 创作 · 流量与商业实战",
  "next": "下期：AI 账号冷启动"
 }
}
```

## 侧边信息卡

### SideCard  `left|right`
- 语境：侧边信息卡
- 何时用：人物出镜时，旁边补充关键词/信息（可划线、盖章）
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "SideCard",
 "layout": "left",
 "props": {
  "tag": "BACKGROUND",
  "title": "中国传媒大学",
  "lines": [
   {
    "text": "本科 · 传媒专业"
   },
   {
    "text": "做传媒这么多年"
   }
  ]
 }
}
```

## 关键词气泡

### KeywordPop  `overlay`
- 语境：关键词气泡
- 何时用：人物出镜时弹出 1~3 个关键词/情绪词
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "KeywordPop",
 "layout": "overlay",
 "props": {
  "words": [
   {
    "text": "绝望",
    "x": 1400,
    "y": 300,
    "color": "red"
   }
  ]
 }
}
```

## 警示横幅

### Banner  `top`
- 语境：警示横幅
- 何时用：注意、误区、重要提醒
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "Banner",
 "layout": "top",
 "props": {
  "text": "AI 创作最容易被误解的地方",
  "tag": "COMMON MISTAKE"
 }
}
```

## 身份条

### LowerThird  `overlay`
- 语境：身份条
- 何时用：人名 + 头衔（首次出镜）
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "LowerThird",
 "layout": "overlay",
 "props": {
  "name": "nana",
  "title": "AI 自媒体博主 · 中传传媒人"
 }
}
```

## 箭头标注

### Callout  `overlay`
- 语境：箭头标注
- 何时用：指向画面中的某物/某处
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "Callout",
 "layout": "overlay",
 "props": {
  "text": "就是这个",
  "target": [
   960,
   700
  ],
  "label": [
   1450,
   300
  ]
 }
}
```

## 章节导航

### ProgressNav  `overlay`
- 语境：章节导航
- 何时用：整条视频常驻的顶部章节导航（start=0,end=时长）
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "ProgressNav",
 "layout": "overlay",
 "props": {}
}
```

## 关注引导

### FollowCTA  `overlay`
- 语境：关注引导
- 何时用：人物说「点个关注」时的关注卡片 + 点击动效
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "FollowCTA",
 "layout": "overlay",
 "props": {
  "name": "nana",
  "desc": "AI 创作 · 流量与商业实战"
 }
}
```

### FollowPill  `overlay`
- 语境：关注引导
- 何时用：苹果风关注卡，说「点个关注」时出现并自动点击
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "FollowPill",
 "layout": "overlay",
 "props": {
  "name": "关注我",
  "sub": "持续分享 AI 实战经验",
  "tapAt": 76.9,
  "color": "cyan"
 }
}
```

## 一句话出片

### PromptToFilm  `full`
- 语境：一句话出片/AI生成
- 何时用：说到「一句话/提示词生成」时：窗口里打字→生成进度→成片卡弹出
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PromptToFilm",
 "layout": "full",
 "props": {
  "window": "Claude · Opus 5.5",
  "prompt": "做一条介绍 Opus 5.5 的炫酷短片",
  "typeAt": 0.1,
  "genAt": 1.5,
  "doneAt": 2.3,
  "result": "成片",
  "resultSub": "ONE PROMPT · READY",
  "duration": "00:44"
 }
}
```

## 数据变化

### ShiftBars  `full`
- 语境：数据变化/价值升降
- 何时用：某些能力/指标此消彼长；支持划掉某一行（dimAt）；示意数据要在 source 写「示意」
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "ShiftBars",
 "layout": "full",
 "props": {
  "title": "以前苦练的剪辑包装技巧",
  "rows": [
   {
    "label": "剪辑技巧",
    "sub": "苦练多年",
    "icon": "tool",
    "color": "cyan",
    "from": 88,
    "to": 20,
    "at": 10.4,
    "moveAt": 12.4,
    "valueText": "",
    "note": "→ 小儿科"
   },
   {
    "label": "包装技巧",
    "sub": "动效 · 转场 · 调色",
    "icon": "palette",
    "color": "violet",
    "from": 82,
    "to": 16,
    "at": 10.9,
    "moveAt": 12.6,
    "valueText": "",
    "note": "→ 小儿科"
   }
  ],
  "source": "示意 · 在强模型面前的价值变化"
 }
}
```

### EditorCollapse  `full`
- 语境：数据变化/技能贬值
- 何时用：专业剪辑软件界面，说到关键词时整体褪色后倒，表达「以前苦练的技能不值钱了」
- 最短时长：3 秒
- 示例：
```json
{
 "type": "EditorCollapse",
 "layout": "full",
 "props": {
  "lead": "苦练的",
  "words": [
   "剪辑技巧",
   "包装技巧",
   "小儿科"
  ],
  "color": "blue",
  "clips": [
   3,
   9,
   16,
   24,
   31,
   40,
   52,
   60
  ]
 }
}
```

## 趋势交叉

### CrossChart  `full`
- 语境：趋势交叉
- 何时用：A 上升、B 下降的「此消彼长」趋势（示意）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "CrossChart",
 "layout": "full",
 "props": {
  "title": "模型越强，工具操作越不重要",
  "lines": [
   {
    "label": "模型能力",
    "pts": [
     12,
     28,
     50,
     74,
     94
    ],
    "color": "cyan"
   },
   {
    "label": "工具操作的重要性",
    "pts": [
     88,
     72,
     50,
     30,
     14
    ],
    "color": "red"
   }
  ],
  "drawAt": 14.6,
  "crossAt": 15.6,
  "crossLabel": "此消彼长"
 }
}
```

## AB 对比

### ABCards  `full`
- 语境：AB 对比/真假难辨
- 何时用：两个东西并排比较，最后给结论胶囊（如「根本分不清」）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "ABCards",
 "layout": "full",
 "props": {
  "cards": [
   {
    "label": "AI 生成",
    "sub": "一句话提示词",
    "color": "cyan",
    "at": 17.5
   },
   {
    "label": "专业动效师",
    "sub": "多年经验",
    "color": "pink",
    "icon": "user",
    "at": 17.9
   }
  ],
  "revealAt": 19.9,
  "verdict": "根本分不清"
 }
}
```

## 产品

### PhoneChat  `full`
- 语境：产品/AI对话演示
- 何时用：手机里的对话气泡 + 右侧说明卡，适合「用 AI 做某事」的过程
- 最短时长：3 秒
- 示例：
```json
{
 "type": "PhoneChat",
 "layout": "full",
 "props": {
  "app": "AI 视频助手",
  "messages": [
   {
    "text": "帮我做一条产品介绍视频",
    "at": 29.9
   },
   {
    "from": "ai",
    "text": "基础成片已生成 · 00:30",
    "card": true,
    "at": 31.8
   }
  ],
  "side": [
   {
    "icon": "text",
    "title": "一句话提示词",
    "sub": "人人都会写",
    "at": 30.3,
    "color": "cyan"
   },
   {
    "icon": "play",
    "title": "基础成片",
    "sub": "能用，但只是起点",
    "at": 32,
    "color": "gold"
   }
  ]
 }
}
```

## 要素

### InputCards  `full`
- 语境：要素/条件/能力清单
- 何时用：3~4 个关键要素卡依次点亮打勾，可先划掉一个旧观点（old），最后给结论
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "InputCards",
 "layout": "full",
 "props": {
  "title": "关键不是操作，而是输入",
  "old": "会操作软件",
  "strikeAt": 38.6,
  "items": [
   {
    "title": "参考",
    "sub": "你想要的样子",
    "icon": "image",
    "color": "cyan",
    "at": 40.2
   },
   {
    "title": "素材",
    "sub": "真实的内容",
    "icon": "doc",
    "color": "violet",
    "at": 40.8
   },
   {
    "title": "指令",
    "sub": "清晰的要求",
    "icon": "text",
    "color": "gold",
    "at": 41.3
   }
  ]
 }
}
```

## 输入→AI→产出

### HubFlow  `full`
- 语境：输入→AI→产出
- 何时用：几个输入汇聚到中心节点，再流向结果；适合讲机制/因果
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "HubFlow",
 "layout": "full",
 "props": {
  "title": "把你的思考喂给 AI",
  "inputs": [
   {
    "title": "审美",
    "icon": "palette",
    "color": "pink",
    "at": 42.4
   },
   {
    "title": "判断",
    "icon": "target",
    "color": "cyan",
    "at": 43
   },
   {
    "title": "创作思考",
    "icon": "brain",
    "color": "violet",
    "at": 43.7
   }
  ],
  "hubAt": 42.1,
  "output": "好作品",
  "outputSub": "带着你的风格",
  "outputAt": 44.2
 }
}
```

## 画像核对

### ProfileCheck  `full`
- 语境：画像核对/条件不满足
- 何时用：一个人物/方案的条件逐条 ✓ / ✕，右侧给结论
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ProfileCheck",
 "layout": "full",
 "props": {
  "name": "技术型选手",
  "nameSub": "写代码 · 懂模型",
  "rows": [
   {
    "text": "很懂代码",
    "at": 47.9
   },
   {
    "text": "精通 AI 底层技术",
    "at": 49
   },
   {
    "text": "做出好的 AI 视频",
    "state": "no",
    "tag": "未必",
    "at": 51
   }
  ],
  "verdict": "技术强\n≠ 作品好",
  "verdictAt": 51.4
 }
}
```

## 路线

### FlowSteps  `full`
- 语境：路线/步骤/时间线
- 何时用：横向路线节点依次点亮，可带警示标签（warn）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "FlowSteps",
 "layout": "full",
 "props": {
  "title": "想靠 AI 赚钱？",
  "steps": [
   {
    "title": "做账号",
    "at": 65.9
   },
   {
    "title": "做内容",
    "at": 66.4
   },
   {
    "title": "变现",
    "at": 67
   }
  ],
  "warn": "别死磕 AI 工具",
  "warnAt": 67.8
 }
}
```

## 人物旁数据

### FactPanel  `left`
- 语境：人物旁数据/事实
- 何时用：说到数据、背景、观点时贴在人物一侧：章节胶囊 + 大数字 + 事实条目 + 来源脚注
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "FactPanel",
 "layout": "left",
 "props": {
  "tag": {
   "en": "POTENTIAL",
   "cn": "潜力发挥"
  },
  "number": {
   "from": 80,
   "to": 100,
   "unit": "%",
   "at": 34.6,
   "frames": 52
  },
  "lines": [
   {
    "text": "基础成片 · [人人都能]",
    "at": 33.6
   },
   {
    "text": "[拉满] · 取决于你",
    "at": 36.2
   }
  ],
  "bar": {
   "value": 100,
   "at": 34.6
  },
  "y": 190
 }
}
```

## 人物旁对比条

### GapBars  `right`
- 语境：人物旁对比条
- 何时用：「差距拉大」「此消彼长」时在人物一侧的两条对比横条
- 最短时长：1.2 秒
- 示例：
```json
{
 "type": "GapBars",
 "layout": "right",
 "props": {
  "title": "但人和人的差距",
  "rows": [
   {
    "label": "普通使用者",
    "from": 50,
    "to": 30,
    "moveAt": 25.9,
    "color": "cyan",
    "at": 23.9
   },
   {
    "label": "会用 AI 的创作者",
    "from": 52,
    "to": 97,
    "moveAt": 25.9,
    "color": "gold",
    "at": 24.3
   }
  ],
  "note": "前所未有的大",
  "noteAt": 26.2,
  "source": "示意 ILLUSTRATIVE",
  "y": 330
 }
}
```

## 技能

### KeywordWall  `full`
- 语境：技能/工具/关键词一大堆
- 何时用：关键词跑马灯墙 + 中间胶囊里轮换的词；可整墙划掉（strikeAt），适合「以前那些技巧都没用了」
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "KeywordWall",
 "layout": "full",
 "props": {
  "rows": [
   [
    "剪辑",
    "调色",
    "转场",
    "字幕",
    "卡点",
    "配乐"
   ],
   [
    "特效",
    "包装",
    "抠像",
    "关键帧",
    "蒙版",
    "节奏"
   ],
   [
    "动效",
    "排版",
    "分镜",
    "滤镜",
    "音效",
    "跟踪"
   ]
  ],
  "lead": "苦练的",
  "words": [
   "剪辑技巧",
   "包装技巧",
   "小儿科"
  ],
  "times": [
   10.6,
   11.3,
   13.4
  ],
  "strikeAt": 12.6,
  "color": "blue"
 }
}
```

## 金句（逐词强调）

### FocusLine  `full`
- 语境：金句（逐词强调）
- 何时用：苹果风金句：焦点框在 2~4 个词之间移动、其余虚化；times 卡在每个词说出口的瞬间
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "FocusLine",
 "layout": "full",
 "props": {
  "eyebrow": "THE CEILING",
  "words": [
   "AI 的上限",
   "取决于",
   "使用它的人"
  ],
  "times": [
   27.3,
   28.3,
   28.8
  ],
  "size": 104,
  "color": "blue"
 }
}
```

## 素材

### FolderDrop  `full`
- 语境：素材/资料/输入
- 何时用：文件夹打开，文件一张张飞出排开；适合「参考、素材、指令」「资料包」
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "FolderDrop",
 "layout": "full",
 "props": {
  "title": "关键不是会不会操作软件",
  "sub": "而是你能不能给它高质量的输入",
  "folder": "你的输入",
  "openAt": 39.9,
  "files": [
   {
    "title": "参考",
    "sub": "想要的样子",
    "icon": "image",
    "color": "blue",
    "at": 40.3
   },
   {
    "title": "素材",
    "sub": "真实的内容",
    "icon": "doc",
    "color": "violet",
    "at": 40.8
   },
   {
    "title": "指令",
    "sub": "清晰的要求",
    "icon": "text",
    "color": "orange",
    "at": 41.3
   }
  ],
  "color": "blue"
 }
}
```

## 生态

### OrbitHub  `full`
- 语境：生态/多要素围绕核心
- 何时用：中心节点 + 倾斜轨道上环绕的标签（两圈），适合「把 A、B、C 都喂给 AI」「围绕某个核心」
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "OrbitHub",
 "layout": "full",
 "props": {
  "title": "把你的思考喂给 AI",
  "center": "AI",
  "items": [
   {
    "title": "审美",
    "icon": "palette",
    "color": "pink",
    "at": 42.4,
    "ring": 0
   },
   {
    "title": "判断",
    "icon": "target",
    "color": "blue",
    "at": 43,
    "ring": 0
   },
   {
    "title": "创作思考",
    "icon": "brain",
    "color": "violet",
    "at": 43.6,
    "ring": 0
   },
   {
    "title": "参考",
    "icon": "image",
    "color": "orange",
    "at": 42.2,
    "ring": 1
   },
   {
    "title": "素材",
    "icon": "doc",
    "color": "green",
    "at": 42.3,
    "ring": 1
   },
   {
    "title": "指令",
    "icon": "text",
    "color": "gold",
    "at": 42.4,
    "ring": 1
   }
  ],
  "result": "作品带上你的风格",
  "resultAt": 44.3,
  "color": "blue"
 }
}
```

## 能力

### BentoBoard  `full`
- 语境：能力/卖点/多维总结
- 何时用：Bento 格子（大小不一的卡片依次亮起、聚光、扫光，可放迷你趋势线），col/row/w/h 自由排版
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "BentoBoard",
 "layout": "full",
 "props": {
  "title": "真正放大 AI 价值的创作者",
  "cells": [
   {
    "col": 0,
    "row": 0,
    "w": 2,
    "title": "懂内容",
    "sub": "知道讲什么、怎么讲",
    "icon": "doc",
    "color": "blue",
    "at": 52.8
   },
   {
    "col": 2,
    "row": 0,
    "title": "懂流量",
    "sub": "知道谁在看",
    "icon": "chart",
    "color": "green",
    "at": 53.5
   },
   {
    "col": 3,
    "row": 0,
    "title": "有审美",
    "sub": "知道什么好看",
    "icon": "palette",
    "color": "pink",
    "at": 54.2
   },
   {
    "col": 0,
    "row": 1,
    "title": "有设计思维",
    "sub": "知道怎么表达",
    "icon": "spark",
    "color": "orange",
    "at": 54.9
   },
   {
    "col": 1,
    "row": 1,
    "w": 3,
    "title": "AI 的价值被彻底放大",
    "sub": "创作者越强，放大倍数越高",
    "icon": "target",
    "color": "violet",
    "spark": [
     8,
     12,
     18,
     30,
     52,
     80,
     96
    ],
    "at": 56.3,
    "hi": true,
    "hiAt": 56.8,
    "kicker": "AMPLIFY"
   }
  ],
  "color": "blue"
 }
}
```

## 工具

### DockTools  `full`
- 语境：工具/软件/App 一排
- 何时用：macOS Dock 图标放大波浪扫过，可整体置灰（strikeAt）+ 结论胶囊
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "DockTools",
 "layout": "full",
 "props": {
  "title": "别死磕 AI 工具",
  "sub": "学工具本身，并不能直接帮你赚钱",
  "tools": [
   {
    "name": "剪辑",
    "icon": "play",
    "color": "blue"
   },
   {
    "name": "AI 绘图",
    "icon": "image",
    "color": "pink"
   },
   {
    "name": "AI 视频",
    "icon": "spark",
    "color": "violet"
   },
   {
    "name": "配音",
    "icon": "flow",
    "color": "orange"
   },
   {
    "name": "字幕",
    "icon": "text",
    "color": "green"
   },
   {
    "name": "调色",
    "icon": "palette",
    "color": "red"
   },
   {
    "name": "代码",
    "icon": "code",
    "color": "gold"
   }
  ],
  "waveAt": 68,
  "strikeAt": 69.9,
  "verdict": "工具 ≠ 赚钱",
  "verdictAt": 70.1,
  "verdictColor": "red",
  "color": "blue"
 }
}
```

## 关键数字（翻页牌）

### FlapStat  `full`
- 语境：关键数字（翻页牌）
- 何时用：机场翻页牌式大数字 + 单位 + 说明 + 来源；数字必须来自文案
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "FlapStat",
 "layout": "full",
 "props": {
  "eyebrow": "POTENTIAL",
  "value": "100",
  "unit": "%",
  "label": "把潜力发挥到极致",
  "at": 35
 }
}
```

## 评论

### NotifyStack  `full`
- 语境：评论/观点/消息很多
- 何时用：iOS 通知逐条弹入、旧的往下推；适合「很多人说」「评论区都在问」（非原话要标示意）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "NotifyStack",
 "layout": "full",
 "props": {
  "title": "很多人都在说",
  "items": [
   {
    "app": "评论区 · 示意",
    "title": "这效果也太强了",
    "at": 8
   },
   {
    "app": "评论区 · 示意",
    "title": "剪辑师要失业了？",
    "at": 8.6
   }
  ]
 }
}
```

## 开场标题

### TypeHero  `full`
- 语境：开场标题/提问
- 何时用：大字打字机 + 胶囊标签依次弹出
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "TypeHero",
 "layout": "full",
 "props": {
  "eyebrow": "ONE PROMPT",
  "text": "一句话，生成一条成片",
  "chips": [
   {
    "text": "动效"
   },
   {
    "text": "包装"
   },
   {
    "text": "配乐"
   }
  ],
  "hi": 0
 }
}
```

## AI生成

### HeroPrompt  `full`
- 语境：AI生成/一句话出片
- 何时用：演示「输入一句话 → 生成成片」：电脑里打字，手机里弹出成片画面，周围漂浮立体图标
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "HeroPrompt",
 "layout": "full",
 "props": {
  "app": "AI 视频生成",
  "prompt": "做一条介绍 Opus 5.5 的炫酷短片",
  "cps": 24,
  "result": "成片 · 00:44",
  "color": "violet"
 }
}
```

## 结构

### Agenda  `full`
- 语境：结构/目录
- 何时用：开场列大纲：「今天讲三件事」，逐条出现，说到哪条哪条高亮（2~5 条）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Agenda",
 "layout": "full",
 "props": {
  "kicker": "AGENDA",
  "title": "今天讲三件事",
  "items": [
   {
    "text": "技巧为什么贬值",
    "sub": "强模型出现之后"
   },
   {
    "text": "真正拉开差距的是什么"
   },
   {
    "text": "普通人怎么用 AI 赚钱"
   }
  ]
 }
}
```

### Pyramid  `full`
- 语境：结构/层级
- 何时用：分层、层级、从基础到顶端（3~5 层，从上到下写）
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Pyramid",
 "layout": "full",
 "props": {
  "kicker": "LAYERS",
  "title": "AI 内容的三层能力",
  "layers": [
   {
    "text": "判断力",
    "sub": "决定上限"
   },
   {
    "text": "审美",
    "sub": "决定质感"
   },
   {
    "text": "工具",
    "sub": "谁都能学会"
   }
  ]
 }
}
```

## 概念

### Definition  `full`
- 语境：概念/名词解释
- 何时用：解释一个词：「所谓 X，其实就是……」，大号词条 + 释义（释义最多两行）
- 最短时长：1.5 秒
- 示例：
```json
{
 "type": "Definition",
 "layout": "full",
 "props": {
  "kicker": "DEFINITION",
  "term": "技术平权",
  "en": "LEVELED FIELD",
  "def": "过去要苦练多年的技术，现在一句话就能交给 AI 完成，人人站在同一起跑线上",
  "example": "不会剪辑也能出成片"
 }
}
```

## 互动

### Poll  `full`
- 语境：互动/提问
- 何时用：抛给观众选择：「你选 A 还是 B？」2~3 个选项，最后引导评论
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "Poll",
 "layout": "full",
 "props": {
  "kicker": "你怎么选",
  "question": "学 AI 工具，还是先学流量？",
  "options": [
   "先学工具",
   "先学流量",
   "两个一起"
  ],
  "cta": "评论区告诉我你的选择"
 }
}
```

## 模板包54·标题、Hook、章节与收束

### ImpactQuestionGlitch  `full`
- 语境：模板包54·标题、Hook、章节与收束/冲击问题故障开场
- 何时用：冲击问题故障开场（上一版模板包第 1 号模板）：短问题砸入、矛盾副句滑入
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ImpactQuestionGlitch",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### EditorialStateStamp  `full`
- 语境：模板包54·标题、Hook、章节与收束/编辑状态盖章
- 何时用：编辑状态盖章（上一版模板包第 4 号模板）：观点建立后以强状态章完成判断收束、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "EditorialStateStamp",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### SplitFlapFlip  `full`
- 语境：模板包54·标题、Hook、章节与收束/翻牌式标题
- 何时用：翻牌式标题（上一版模板包第 19 号模板）：机场翻牌机械换字、短标题限定
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "SplitFlapFlip",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### NumberedChapter  `full`
- 语境：模板包54·标题、Hook、章节与收束/编号统一章节页
- 何时用：编号统一章节页（上一版模板包第 29 号模板）：01、02、03、同版式多色章节页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "NumberedChapter",
 "layout": "full",
 "props": {
  "title": "技巧贬值",
  "subtitle": "第二章",
  "items": [
   "以前",
   "现在",
   "以后"
  ],
  "metric": "02"
 }
}
```

### BackdropHeadline  `full`
- 语境：模板包54·标题、Hook、章节与收束/P0 · 人物身后大字
- 何时用：P0 · 人物身后大字（上一版模板包第 33 号模板）：Hook、结论、关键转折、短句限定
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "BackdropHeadline",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### ChapterViewpoint  `full`
- 语境：模板包54·标题、Hook、章节与收束/章节观点页
- 何时用：章节观点页（上一版模板包第 36 号模板）：第一、第二、第三、章节、完整标题、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ChapterViewpoint",
 "layout": "full",
 "props": {
  "title": "技巧贬值",
  "subtitle": "第二章",
  "items": [
   "以前",
   "现在",
   "以后"
  ],
  "metric": "02"
 }
}
```

### TitleHero  `full`
- 语境：模板包54·标题、Hook、章节与收束/全屏标题页
- 何时用：全屏标题页（上一版模板包第 46 号模板）：片头、章节、强结论、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TitleHero",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### PunctuationLockup  `full`
- 语境：模板包54·标题、Hook、章节与收束/标点收束标题
- 何时用：标点收束标题（上一版模板包第 48 号模板）：问题、悬念、CTA、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PunctuationLockup",
 "layout": "full",
 "props": {
  "title": "一句话生成成片",
  "subtitle": "在强模型面前，剪辑技巧像小儿科",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

## 模板包54·流程、时间线与因果

### TokenVelocityRelay  `full`
- 语境：模板包54·流程、时间线与因果/令牌高速接力
- 何时用：令牌高速接力（上一版模板包第 2 号模板）：一个任务令牌穿过、3–4、个有序阶段、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TokenVelocityRelay",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### SignalPathActivation  `full`
- 语境：模板包54·流程、时间线与因果/信号路径激活
- 何时用：信号路径激活（上一版模板包第 3 号模板）：3–4、个语义节点沿曲线路径依次通电、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "SignalPathActivation",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### CompletionCheckRail  `full`
- 语境：模板包54·流程、时间线与因果/完成检查轨
- 何时用：完成检查轨（上一版模板包第 5 号模板）：3–4、个真实检查点顺序完成、末项可保留人工审核
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CompletionCheckRail",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### TimelineTravel  `full`
- 语境：模板包54·流程、时间线与因果/横向时间轴旅行
- 何时用：横向时间轴旅行（上一版模板包第 6 号模板）：3–5个真实里程碑、加速掠过并急停现在
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TimelineTravel",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### LineCarryTransition  `full`
- 语境：模板包54·流程、时间线与因果/线条接力转场
- 何时用：线条接力转场（上一版模板包第 22 号模板）：现有进度线连续延伸并围出下一场、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "LineCarryTransition",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### CardFlipReveal  `full`
- 语境：模板包54·流程、时间线与因果/卡片翻面揭示
- 何时用：卡片翻面揭示（上一版模板包第 28 号模板）：2–4、组“功能、结果”因果配对、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CardFlipReveal",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### AdaptiveSteps  `full`
- 语境：模板包54·流程、时间线与因果/P0 · 自适应步骤卡
- 何时用：P0 · 自适应步骤卡（上一版模板包第 34 号模板）：2–4、步预览、正式接入后按文案数量生成
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "AdaptiveSteps",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### FlowThree  `full`
- 语境：模板包54·流程、时间线与因果/三步流程
- 何时用：三步流程（上一版模板包第 40 号模板）：输入、处理、结果、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "FlowThree",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

### VideoWorkflowPipeline  `full`
- 语境：模板包54·流程、时间线与因果/自适应流程图
- 何时用：自适应流程图（上一版模板包第 41 号模板）：仅按当前文案的实际步骤生成、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "VideoWorkflowPipeline",
 "layout": "full",
 "props": {
  "title": "靠 AI 赚钱的路线",
  "subtitle": "先搞懂流量和商业",
  "items": [
   "做账号",
   "做内容",
   "变现"
  ]
 }
}
```

## 模板包54·素材、录屏与证据

### WordRelayFilmstrip  `full`
- 语境：模板包54·素材、录屏与证据/胶片证据与动词接力
- 何时用：胶片证据与动词接力（上一版模板包第 7 号模板）：一个主体、3–4项能力、左证据右论点
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "WordRelayFilmstrip",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### PageWaterfallWall  `full`
- 语境：模板包54·素材、录屏与证据/页面瀑布墙
- 何时用：页面瀑布墙（上一版模板包第 12 号模板）：重点模板、三列真实页面差速反向循环
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PageWaterfallWall",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### SkeletonReveal  `full`
- 语境：模板包54·素材、录屏与证据/草稿骨架内容三级显影
- 何时用：草稿骨架内容三级显影（上一版模板包第 18 号模板）：重点模板、涂鸦、骨架、真实内容
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "SkeletonReveal",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### DrawSvgTrace  `full`
- 语境：模板包54·素材、录屏与证据/SVG 描边圈注
- 何时用：SVG 描边圈注（上一版模板包第 23 号模板）：单一主体沿轮廓画出后交棒、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "DrawSvgTrace",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### CommandPaletteSummon  `full`
- 语境：模板包54·素材、录屏与证据/命令面板召唤
- 何时用：命令面板召唤（上一版模板包第 25 号模板）：快捷命令、搜索、功能收窄、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CommandPaletteSummon",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### ScreenOperationDemo  `full`
- 语境：模板包54·素材、录屏与证据/操作录屏主导页
- 何时用：操作录屏主导页（上一版模板包第 31 号模板）：录屏占主画面、左侧步骤说明
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ScreenOperationDemo",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

### EvidenceWindow  `full`
- 语境：模板包54·素材、录屏与证据/真实证据窗口
- 何时用：真实证据窗口（上一版模板包第 43 号模板）：截图、录屏、ROI、证据页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "EvidenceWindow",
 "layout": "full",
 "props": {
  "title": "一句话出片",
  "subtitle": "真实提示词生成的基础成片",
  "items": [
   "提示词",
   "生成",
   "成片"
  ]
 }
}
```

## 模板包54·文字、重点词与观点表达

### NeonTripleMarquee  `full`
- 语境：模板包54·文字、重点词与观点表达/三行霓虹对向跑马灯
- 何时用：三行霓虹对向跑马灯（上一版模板包第 8 号模板）：三组主题词奇偶反向滚动、一亮两暗轮唱
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "NeonTripleMarquee",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### PillSlotCycle  `full`
- 语境：模板包54·文字、重点词与观点表达/胶囊词槽轮换
- 何时用：胶囊词槽轮换（上一版模板包第 16 号模板）：同一语法位轮换多个短词、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PillSlotCycle",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思"
  ]
 }
}
```

### HashtagToPill  `full`
- 语境：模板包54·文字、重点词与观点表达/话题词胶囊实体化
- 何时用：话题词胶囊实体化（上一版模板包第 20 号模板）：打字、一帧实体化、缩移归位、成品页、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "HashtagToPill",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思"
  ]
 }
}
```

### QuoteLockup  `full`
- 语境：模板包54·文字、重点词与观点表达/金句定格卡
- 何时用：金句定格卡（上一版模板包第 39 号模板）：观点、结论、金句、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "QuoteLockup",
 "layout": "full",
 "props": {
  "title": "AI 的上限",
  "subtitle": "永远取决于使用它的人",
  "items": [
   "上限",
   "使用",
   "人"
  ]
 }
}
```

### KineticEditorial  `full`
- 语境：模板包54·文字、重点词与观点表达/逐词编辑排版
- 何时用：逐词编辑排版（上一版模板包第 47 号模板）：半句、重点词、逐级建立、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "KineticEditorial",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

## 模板包54·数据、比较与判断

### OdometerDigitRoll  `full`
- 语境：模板包54·数据、比较与判断/机械里程表数字滚动
- 何时用：机械里程表数字滚动（上一版模板包第 9 号模板）：单个真实王牌指标、逐位锁定
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "OdometerDigitRoll",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### NeedleSweepSelftest  `full`
- 语境：模板包54·数据、比较与判断/仪表满弧自检
- 何时用：仪表满弧自检（上一版模板包第 24 号模板）：指针扫满量程再回落真实读数、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "NeedleSweepSelftest",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### ThreeOptionMatrix  `full`
- 语境：模板包54·数据、比较与判断/三档选项矩阵
- 何时用：三档选项矩阵（上一版模板包第 30 号模板）：三个并列选项、仅在文案明确推荐时突出
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ThreeOptionMatrix",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### MetricGrowth  `full`
- 语境：模板包54·数据、比较与判断/P0 · 数值增长组件
- 何时用：P0 · 数值增长组件（上一版模板包第 35 号模板）：真实数值、单位、标签才允许触发、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "MetricGrowth",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### MetricFocus  `full`
- 语境：模板包54·数据、比较与判断/核心数字动效
- 何时用：核心数字动效（上一版模板包第 37 号模板）：数字、数据、结果、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "MetricFocus",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### CompareSplit  `full`
- 语境：模板包54·数据、比较与判断/左右对比卡
- 何时用：左右对比卡（上一版模板包第 38 号模板）：前后、新旧、方案、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CompareSplit",
 "layout": "full",
 "props": {
  "title": "工具 vs 判断",
  "subtitle": "质量差距不在工具",
  "items": [
   "工具熟练度",
   "内容判断力"
  ]
 }
}
```

### DataChart  `full`
- 语境：模板包54·数据、比较与判断/数据图表
- 何时用：数据图表（上一版模板包第 42 号模板）：真实数值、比例、趋势、人物页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "DataChart",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### RankDashboard  `full`
- 语境：模板包54·数据、比较与判断/指标排名看板
- 何时用：指标排名看板（上一版模板包第 44 号模板）：分类排名、横向比较、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "RankDashboard",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

### CapitalRisk  `full`
- 语境：模板包54·数据、比较与判断/四象限风险图
- 何时用：四象限风险图（上一版模板包第 45 号模板）：四项风险、观点矩阵、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CapitalRisk",
 "layout": "full",
 "props": {
  "title": "潜力发挥到极致",
  "subtitle": "会用 AI 的人",
  "items": [
   "会用 AI",
   "普通人",
   "差距"
  ],
  "metric": "100%"
 }
}
```

## 模板包54·动效与转场

### TiltReveal  `full`
- 语境：模板包54·动效与转场/俯仰抬正揭示
- 何时用：俯仰抬正揭示（上一版模板包第 10 号模板）：平躺页面抬正、从窄带到完整单页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "TiltReveal",
 "layout": "full",
 "props": {
  "title": "技术平权",
  "subtitle": "差距前所未有的大",
  "items": [
   "以前",
   "现在",
   "以后"
  ]
 }
}
```

### CubeRotate  `full`
- 语境：模板包54·动效与转场/立方体翻页转场
- 何时用：立方体翻页转场（上一版模板包第 11 号模板）：两个并列页面以相邻立方体面换场、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "CubeRotate",
 "layout": "full",
 "props": {
  "title": "技术平权",
  "subtitle": "差距前所未有的大",
  "items": [
   "以前",
   "现在",
   "以后"
  ]
 }
}
```

### MaskingTapeSlap  `full`
- 语境：模板包54·动效与转场/纸胶带拍定卡片
- 何时用：纸胶带拍定卡片（上一版模板包第 14 号模板）：两条胶带先后拍下、第二拍按死卡片
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "MaskingTapeSlap",
 "layout": "full",
 "props": {
  "title": "技术平权",
  "subtitle": "差距前所未有的大",
  "items": [
   "以前",
   "现在",
   "以后"
  ]
 }
}
```

### PaperPlaneMessenger  `full`
- 语境：模板包54·动效与转场/纸飞机信使转场
- 何时用：纸飞机信使转场（上一版模板包第 15 号模板）：发送动作、伴飞、第二场景接管、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PaperPlaneMessenger",
 "layout": "full",
 "props": {
  "title": "技术平权",
  "subtitle": "差距前所未有的大",
  "items": [
   "以前",
   "现在",
   "以后"
  ]
 }
}
```

### SakugaTimingShift  `full`
- 语境：模板包54·动效与转场/作画节奏突变
- 何时用：作画节奏突变（上一版模板包第 17 号模板）：常速建立、突发高密动作、静止、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "SakugaTimingShift",
 "layout": "full",
 "props": {
  "title": "技术平权",
  "subtitle": "差距前所未有的大",
  "items": [
   "以前",
   "现在",
   "以后"
  ]
 }
}
```

## 模板包54·卡片、总览与信息布局

### GridFlashMosaic  `full`
- 语境：模板包54·卡片、总览与信息布局/面板网格闪现马赛克
- 何时用：面板网格闪现马赛克（上一版模板包第 13 号模板）：多面板按节拍形成信息墙、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "GridFlashMosaic",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### IconFieldColorize  `full`
- 语境：模板包54·卡片、总览与信息布局/图标原野波纹翻色
- 何时用：图标原野波纹翻色（上一版模板包第 21 号模板）：灰阶功能宇宙、品牌色横带点亮、全图页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "IconFieldColorize",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### DeckDealFlyIn  `full`
- 语境：模板包54·卡片、总览与信息布局/卡牌高速发牌入场
- 何时用：卡牌高速发牌入场（上一版模板包第 26 号模板）：重点模板、大量内容加速汇入网格
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "DeckDealFlyIn",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### PanelToCanvas  `full`
- 语境：模板包54·卡片、总览与信息布局/面板内容上画布
- 何时用：面板内容上画布（上一版模板包第 27 号模板）：重点模板、严格三行任务变成三张可视卡片
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PanelToCanvas",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### DualConceptPair  `full`
- 语境：模板包54·卡片、总览与信息布局/双信息关系页
- 何时用：双信息关系页（上一版模板包第 32 号模板）：严格用于两个并列对象、中间人物留空
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "DualConceptPair",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

## 模板包54·风格化代表模板

### ZinePresenterQuote  `full`
- 语境：模板包54·风格化代表模板/真人拼贴引语页
- 何时用：真人拼贴引语页（上一版模板包第 49 号模板）：透明背景、中间人物留空
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ZinePresenterQuote",
 "layout": "full",
 "props": {
  "title": "AI 的上限",
  "subtitle": "永远取决于使用它的人",
  "items": [
   "上限",
   "使用",
   "人"
  ]
 }
}
```

### ZineRisoProcess  `full`
- 语境：模板包54·风格化代表模板/原版印刷流程
- 何时用：原版印刷流程（上一版模板包第 50 号模板）：SVG、06、顶部色带、四流程卡
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "ZineRisoProcess",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### PeoplesManifesto  `full`
- 语境：模板包54·风格化代表模板/核心宣言页
- 何时用：核心宣言页（上一版模板包第 51 号模板）：原模板、03、单一核心观点
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "PeoplesManifesto",
 "layout": "full",
 "props": {
  "title": "AI 的上限",
  "subtitle": "永远取决于使用它的人",
  "items": [
   "上限",
   "使用",
   "人"
  ]
 }
}
```

### BlockHeroPoster  `full`
- 语境：模板包54·风格化代表模板/海报标题页
- 何时用：海报标题页（上一版模板包第 52 号模板）：原模板、01、章节与强结论
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "BlockHeroPoster",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### BlockShowWork  `full`
- 语境：模板包54·风格化代表模板/作品证据页
- 何时用：作品证据页（上一版模板包第 53 号模板）：原版媒体卡适配、证据页
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "BlockShowWork",
 "layout": "full",
 "props": {
  "title": "真正拉开差距的",
  "subtitle": "不是工具，是判断",
  "items": [
   "审美",
   "判断",
   "创作思考"
  ]
 }
}
```

### BroadsideSplitCompare  `full`
- 语境：模板包54·风格化代表模板/橙黑对比页
- 何时用：橙黑对比页（上一版模板包第 54 号模板）：原模板、09、Before、After
- 最短时长：2.5 秒
- 示例：
```json
{
 "type": "BroadsideSplitCompare",
 "layout": "full",
 "props": {
  "title": "工具 vs 判断",
  "subtitle": "质量差距不在工具",
  "items": [
   "工具熟练度",
   "内容判断力"
  ]
 }
}
```

## 科技艺术增强

### TechHero  `full`
- 语境：科技艺术增强
- 何时用：Frame-based multi-color tech art
- 最短时长：3 秒
- 示例：
```json
{
 "type": "TechHero",
 "layout": "full"
}
```

### TechBento  `full`
- 语境：科技艺术增强
- 何时用：Frame-based multi-color tech art
- 最短时长：4 秒
- 示例：
```json
{
 "type": "TechBento",
 "layout": "full"
}
```

### TechFlow  `full`
- 语境：科技艺术增强
- 何时用：Frame-based multi-color tech art
- 最短时长：4 秒
- 示例：
```json
{
 "type": "TechFlow",
 "layout": "full"
}
```
