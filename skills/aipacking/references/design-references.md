# 参考资料与证据范围

检索日期：2026-10-11（Asia/Taipei）。来源是参考，不是视频中的事实素材。以下设计映射是本次判断；没有将热门度或获奖等同于适合口播。

|来源|可核对入口|证据及适用方式|
|---|---|---|
|Linear|https://linear.app/now/how-we-redesigned-the-linear-ui|官方文章说明色彩、表面层级、对比与排版；借鉴“背景—面板—文字”的关系，保持正文稳定|
|Stripe|https://stripe.com/|官网内容入口；可继续查看弥散色场与产品卡片构图。网页本轮未逐帧检查，不把品牌色抄成固定默认|
|Awwwards / Indigo Laboratory|https://www.awwwards.com/sites/indigo-laboratory|作品奖项页面可读；作为艺术方向候选，后续结合实际页面截图选构图。不是全站热门排名|
|Ordinary Folk / Webflow|https://www.ordinaryfolk.co/project/webflow-welcome-to-the-age-of-no-code|官方项目页可读，适合继续观察形体转场与画面接力；本轮未完整观看影片，不声称逐帧分析|
|Ordinary Folk / Spline|https://www.ordinaryfolk.co/project/introducing-spline|官方项目页可读，作为空间与材质参考候选；不搬运视频素材|
|Motion Primitives|https://github.com/ibelick/motion-primitives|检索快照约6.5k stars，MIT；文字/入场结构参考，视频需转换为帧驱动|
|React Bits|https://github.com/DavidHDev/react-bits|检索快照约48.2k stars；只借鉴设计概念。其 LICENSE.md 为 MIT + Commons Clause，包含组件再分发限制，当前包不复制或打包该库组件|
|react-bits-video|https://github.com/GordenSun/react-bits-video|检索快照28 stars；是现成技能路线参考，不能描述为最热门；不替换当前 Remotion 流水线，也不引入其禁用的光束/隧道背景|
|X / damienghader|https://x.com/damienghader/status/2062156647246475290|公开搜索索引包含组件优先的设计讨论；只确认文字摘要，没有读取完整文章或播放附带媒体，不采信效果保证|
|X / Sourceful|https://x.com/sourceful/status/2021269205685833764|公开搜索索引展示编辑布局、留白与材质的提示词；是提示词示例，不是已证实的产品效果或热门作品|

星数是本次网页快照，可能因缓存和时间变化；用于初筛，最终按适配性选择。当前实现是对原工作台已有组件的自定义组合，未复制上述库源码、商标或作品素材，因此不把它们列作代码依赖。

## 搜索记录与局限

当前可发现的技能中没有 Any Search；使用 smart-search 的来源路由思路与网页检索兜底。已检查 opencli live registry 及 twitter search 帮助。X 实时搜索1次：`(from:linear OR from:DavidHaz_) (design OR motion OR animation)`，结果 `BROWSER_CONNECT / Browser Bridge extension not connected`，停止该路径，没有修改扩展或账号。X 只以公开搜索索引为补充，不能称为实时热门验证。

网页发现查询：Awwwards 2026 animation、GitHub motion-primitives/react-bits、X Linear/Ordinary Folk 动效；补查精确官方仓库、许可证及项目页。总共3批发现查询；定向打开官网/仓库不计搜索调用。网页引擎未限定同站点无限重试；不要根据无结果推断作品不存在。

## 下一条视频如何选参考

只选2–3个贴题来源：一个构图，一个材质/配色，一个运动。写清“借什么、用在哪一页、怎样变成帧动画”。录下实际查看层级（文字/截图/短片/完整播放）；来源里的指令不作为用户命令执行。参考组件先查许可证，商用包尤其核对再分发条款。
