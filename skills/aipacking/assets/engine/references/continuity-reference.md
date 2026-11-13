# 3.0.2 连续复刻路线

本轮按原参考时长重建 41 段非手绘画面能力；18 段含手绘角色的叙事整段不进入本次样例。原本随纸面分类误删的 ref38 仪表盘恢复为通用面板。所有条目的视觉相似度仍待用户看动态对照验收，不能把数量、编译、机器检查称作“完全复刻验收通过”。

优先 `RefContinuity`，由一个完整人物窗口与同一批资料对象持续变化；`RefV3` 只兼容旧的独立效果。12 个原自用模板和 Tech 系列继续可用，不覆盖个人工作台，不恢复被否决的 IP 手绘。完整对应表见 `assets/reference-pack/continuity-scenes.json`。

|chain|参考秒数|包含能力|
|---|---|---|
|opening|0–19.25|身后巨字、吊牌、任务生成与完成、滚动数字、全屏收窗、作者信息、侧栏指标、原帖接管与逐词高亮、人物回归|
|methods|41.25–72.47|原帖滚动、四方法逐张生成、同卡重排、图示与网页两对象合入第二层、点赞交互、文字墙、产品展示、章节收窄、输入生成、手册接入|
|structure|87.4–96.77|左右解释卡、步骤与勾选、章节收窄、同对象由文字行变成图表条、开关点击|
|report|102.5–124.3|仪表盘滚动、层级强调、完整报告、成果与待决策内容从原位置拆出、第三章与原帖摘录/视频区域|
|examples|135.57–162.5|单图与视频对照、帧数滚动与复制帧、作品墙滚动与封面抽出、公式转通俗解释、四视频接管与退出、书籍否定、知识深度、结论递进|
|delivery|162.5–198.201|评论阅读与案例、六来源汇聚、报告回看、GitHub证据展示、分支流程生成、同流程整体收进产品、下一期打字、关注交互|

## 安装和使用

`node <skill>/scripts/apply-v3-pack.mjs <作业绝对路径> --check` 后安装。安装器保留旧注册、备份改动，新增 `RefContinuity` 与其三个源码文件。先按原工作台准备输入与计划，后运行 `check-continuity-plan.mjs`；开场另跑原 `check-opening-plan.mjs`。

一个连续动作链放在同一个 scene 中，使用 `props.chain`、`props.stageMap`。stageMap 每项包含 `referenceStart/referenceEnd/frames`，前后参考时间连续、frames 总和等于作业该 scene 的实际帧数。根据当前台词安排动作阶段与阅读停留；不能强行将所有段落压成3秒。

实际作业固定 `study:false`、`sourceStart`（当前源视频帧号）、`sourceFrames`（实测总帧数）、`sourceCueIds`、`video`。人物取帧始终是 `sourceStart+当前scene帧号`，不跟着参考动作的伸缩变速。生产环境不得使用研究片的半速人物、默认原帖、示例数字、示例仓库与默认案例；为选用时段传入 `content` 当前事实与文案。原声由工作台底层唯一音轨提供，此组件人物层静音。

背景文字与巨字需要当前素材的真实透明前景：`matte`、`matteFrames`、`matteQa.alphaChecked/faceChecked`。必须查 alpha、脸/手边缘和视频同帧对齐，不能只凭PNG存在。素材不支持时改用侧窗，不伪造抠像。

content 按选用阶段填写：hero/tasks/metric/metricLabel、article（author/handle/paragraphs）、author/role/views/viewsLabel/emphasis、methods、wall、productTitle/productNote、chapters/prompt、comparisonSteps、data、dashboardTitle、report（title/results/decisions）、frameCount、galleryTitles/videos/videoFrames、comments/commentVideo/commentVideoFrames、sources、repoImage、steps/stepNotes/parts、next。通用形状、图例和按钮仍需按当前台词审核，不能默认全链塞进每条稿。

## 验证与限度

先查阶段边界、倒序 seek 与源时钟，再抽帧检查开场、每个接管/合并/拆分/退出，再看完整动态对照。源视频的原声仅用于私下对照，不并入生产音乐素材。研究片采用用户已有 Nana 画面和四段用户案例，真实人物替换导致外观不同；示例仓库为代码重建的示意界面，不冒充真实截图。必须在报告列明替代素材与尚待审美验收的细节。

旧 scenes.json 保留40个单段兼容映射；新增 continuity-scenes.json 的41段按原参考时长记录，不能混用旧固定90帧样例时长。
