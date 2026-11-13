# aipacking 3.0 动效索引

下面的 ID 可以直接写入分镜。既有模板与八种旧叠加元素另见[原目录](../skills/aipacking/references/motion-library.md)。

## 内容动效

在 elements 中用 kind 为 semantic、preset 为下表 ID，每项内容通过 itemsData 指定 text 和 at。

| ID | 名称 | 用法 | 条目数 |
| --- | --- | --- | --- |
| `rail` | 节点点亮 | 把并列主题或清单逐个点亮 | 2–4 |
| `checklist` | 勾选清单 | 逐条确认已经完成的动作 | 2–4 |
| `ribbon` | 双层卷标 | 先给类别，再揭示重点 | 2–2 |
| `word-mask` | 逐行擦字 | 长观点拆为两三行，遮罩逐行扫开 | 1–3 |
| `type-line` | 逐字输入 | 显示原文指令或要搜索的短词 | 1–1 |
| `compare` | 双卡对照 | 并排展示两个选项 | 2–2 |
| `swap` | 前后换卡 | 保留同一位置，显示做法或状态变化 | 2–2 |
| `verdict` | 更正与强调 | 先指出误区，再亮出正确表述 | 2–2 |
| `flow` | 流程连线 | 节点随讲解建立，连线逐条接通 | 2–4 |
| `merge` | 多源汇入 | 两至三个来源连接到同一结果 | 3–4 |
| `branch` | 一步分流 | 一个条件通向两至三个选项 | 3–4 |
| `bars` | 实数比较条 | 比较两个到四个有原稿依据的数值 | 2–4 |
| `count` | 数字滚入 | 原稿数字的落点或结果 | 1–1 |
| `timeline` | 时间节点 | 有顺序的阶段、事件或版本推进 | 2–4 |
| `focus-box` | 双角聚焦 | 用四角框住真实资料上的局部 | 0–1 |
| `scan-line` | 证据扫读 | 线条扫向截图需要阅读的一行 | 0–1 |
| `stack-fan` | 多卡铺开 | 把并列材料或示例分层铺开 | 2–3 |
| `pin` | 引线批注 | 用引线把一个词与对象局部关联 | 1–1 |

## 常用入场、强调与离场 · 97 项

用 animation 填写 ID。强动作须在分镜写 motionReason，并在实样中检查。

| ID | 时机 | 强动作 |
| --- | --- | --- |
| `animate-bounce` | 强调 | 是 |
| `animate-flash` | 强调 | 是 |
| `animate-pulse` | 强调 | 否 |
| `animate-rubberBand` | 强调 | 是 |
| `animate-shakeX` | 强调 | 是 |
| `animate-shakeY` | 强调 | 是 |
| `animate-headShake` | 强调 | 否 |
| `animate-swing` | 强调 | 否 |
| `animate-tada` | 强调 | 是 |
| `animate-wobble` | 强调 | 是 |
| `animate-jello` | 强调 | 是 |
| `animate-heartBeat` | 强调 | 是 |
| `animate-backInDown` | 入场 | 否 |
| `animate-backInLeft` | 入场 | 否 |
| `animate-backInRight` | 入场 | 否 |
| `animate-backInUp` | 入场 | 否 |
| `animate-backOutDown` | 离场 | 否 |
| `animate-backOutLeft` | 离场 | 否 |
| `animate-backOutRight` | 离场 | 否 |
| `animate-backOutUp` | 离场 | 否 |
| `animate-bounceIn` | 入场 | 是 |
| `animate-bounceInDown` | 入场 | 是 |
| `animate-bounceInLeft` | 入场 | 是 |
| `animate-bounceInRight` | 入场 | 是 |
| `animate-bounceInUp` | 入场 | 是 |
| `animate-bounceOut` | 离场 | 是 |
| `animate-bounceOutDown` | 离场 | 是 |
| `animate-bounceOutLeft` | 离场 | 是 |
| `animate-bounceOutRight` | 离场 | 是 |
| `animate-bounceOutUp` | 离场 | 是 |
| `animate-fadeIn` | 入场 | 否 |
| `animate-fadeInDown` | 入场 | 否 |
| `animate-fadeInDownBig` | 入场 | 是 |
| `animate-fadeInLeft` | 入场 | 否 |
| `animate-fadeInLeftBig` | 入场 | 是 |
| `animate-fadeInRight` | 入场 | 否 |
| `animate-fadeInRightBig` | 入场 | 是 |
| `animate-fadeInUp` | 入场 | 否 |
| `animate-fadeInUpBig` | 入场 | 是 |
| `animate-fadeInTopLeft` | 入场 | 否 |
| `animate-fadeInTopRight` | 入场 | 否 |
| `animate-fadeInBottomLeft` | 入场 | 否 |
| `animate-fadeInBottomRight` | 入场 | 否 |
| `animate-fadeOut` | 离场 | 否 |
| `animate-fadeOutDown` | 离场 | 否 |
| `animate-fadeOutDownBig` | 离场 | 是 |
| `animate-fadeOutLeft` | 离场 | 否 |
| `animate-fadeOutLeftBig` | 离场 | 是 |
| `animate-fadeOutRight` | 离场 | 否 |
| `animate-fadeOutRightBig` | 离场 | 是 |
| `animate-fadeOutUp` | 离场 | 否 |
| `animate-fadeOutUpBig` | 离场 | 是 |
| `animate-fadeOutTopLeft` | 离场 | 否 |
| `animate-fadeOutTopRight` | 离场 | 否 |
| `animate-fadeOutBottomRight` | 离场 | 否 |
| `animate-fadeOutBottomLeft` | 离场 | 否 |
| `animate-flip` | 强调 | 否 |
| `animate-flipInX` | 入场 | 否 |
| `animate-flipInY` | 入场 | 否 |
| `animate-flipOutX` | 离场 | 否 |
| `animate-flipOutY` | 离场 | 否 |
| `animate-lightSpeedInRight` | 入场 | 是 |
| `animate-lightSpeedInLeft` | 入场 | 是 |
| `animate-lightSpeedOutRight` | 离场 | 是 |
| `animate-lightSpeedOutLeft` | 离场 | 是 |
| `animate-rotateIn` | 入场 | 否 |
| `animate-rotateInDownLeft` | 入场 | 否 |
| `animate-rotateInDownRight` | 入场 | 否 |
| `animate-rotateInUpLeft` | 入场 | 否 |
| `animate-rotateInUpRight` | 入场 | 否 |
| `animate-rotateOut` | 离场 | 否 |
| `animate-rotateOutDownLeft` | 离场 | 否 |
| `animate-rotateOutDownRight` | 离场 | 否 |
| `animate-rotateOutUpLeft` | 离场 | 否 |
| `animate-rotateOutUpRight` | 离场 | 否 |
| `animate-hinge` | 离场 | 是 |
| `animate-jackInTheBox` | 入场 | 否 |
| `animate-rollIn` | 入场 | 否 |
| `animate-rollOut` | 离场 | 否 |
| `animate-zoomIn` | 入场 | 否 |
| `animate-zoomInDown` | 入场 | 否 |
| `animate-zoomInLeft` | 入场 | 否 |
| `animate-zoomInRight` | 入场 | 否 |
| `animate-zoomInUp` | 入场 | 否 |
| `animate-zoomOut` | 离场 | 否 |
| `animate-zoomOutDown` | 离场 | 否 |
| `animate-zoomOutLeft` | 离场 | 否 |
| `animate-zoomOutRight` | 离场 | 否 |
| `animate-zoomOutUp` | 离场 | 否 |
| `animate-slideInDown` | 入场 | 否 |
| `animate-slideInLeft` | 入场 | 否 |
| `animate-slideInRight` | 入场 | 否 |
| `animate-slideInUp` | 入场 | 否 |
| `animate-slideOutDown` | 离场 | 否 |
| `animate-slideOutLeft` | 离场 | 否 |
| `animate-slideOutRight` | 离场 | 否 |
| `animate-slideOutUp` | 离场 | 否 |

## 空间变形与过渡 · 24 项

用 animation 填写 ID。强动作须在分镜写 motionReason，并在实样中检查。

| ID | 时机 | 强动作 |
| --- | --- | --- |
| `magic-puffIn` | 入场 | 否 |
| `magic-puffOut` | 离场 | 否 |
| `magic-vanishIn` | 入场 | 否 |
| `magic-vanishOut` | 离场 | 否 |
| `magic-boingInUp` | 入场 | 是 |
| `magic-boingOutDown` | 离场 | 是 |
| `magic-swap` | 强调 | 否 |
| `magic-twisterInDown` | 入场 | 是 |
| `magic-twisterInUp` | 入场 | 是 |
| `magic-foolishIn` | 入场 | 是 |
| `magic-swashIn` | 入场 | 否 |
| `magic-swashOut` | 离场 | 否 |
| `magic-spaceInDown` | 入场 | 否 |
| `magic-spaceInLeft` | 入场 | 否 |
| `magic-spaceInRight` | 入场 | 否 |
| `magic-spaceInUp` | 入场 | 否 |
| `magic-perspectiveDownReturn` | 入场 | 否 |
| `magic-perspectiveLeftReturn` | 入场 | 否 |
| `magic-perspectiveRightReturn` | 入场 | 否 |
| `magic-perspectiveUpReturn` | 入场 | 否 |
| `magic-openDownLeftReturn` | 入场 | 否 |
| `magic-openUpRightReturn` | 入场 | 否 |
| `magic-tinDownIn` | 入场 | 是 |
| `magic-tinRightIn` | 入场 | 是 |

## 实际画面

[内容动效案例 MP4](assets/aipacking-3/case-demo.mp4) · [全部动效图鉴 MP4](assets/aipacking-3/motion-gallery.mp4) · [生成与核验](../examples/aipacking-demo/README.md)
