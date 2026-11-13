# aipacking 3.0 新动效

使用 motionVersion 3。先从原词判断需要哪种状态变化，再选可执行的模板和叠加元素。普通口播保持稳定构图，节奏由侧边标签、图解和资料状态推进。关键落点才轻推并回位。

- **18 项内容动效**使用 kind 为 semantic 和 preset 为目录 ID。清单可选 rail、checklist，文字可选 ribbon、word-mask、type-line，关系可选 compare、swap、verdict，流程可选 flow、merge、branch、timeline，数据可选 bars、count，证据可选 focus-box、scan-line、pin，资料组可选 stack-fan。
- 内容动效可独立选为 MotionLane_<ID> 或 MotionPage_<ID>，也可叠在已有镜头上。独立模板的 elements 须包含匹配的 semantic 元素，Lane 用 left 或 right，Page 用 full。两种布局复用同一动效，计数仍是 18 项。
- **121 项关键帧动效**使用 animation 字段，可给独立的 kind: motion 标签添加文字，也可应用于既有叠加元素。入场按 at 开始，离场在元素寿命末尾发生。animationDuration 默认 0.45 秒。带 restricted 标识的动作需填 motionReason。动效裁在元素矩形内，侧边使用时离脸、字幕和顶栏留空。
- 两份完整目录在宿主的 src/motion/semantic.json 和 src/motion/keyframes.json。可读版见 [公开动效索引](https://github.com/zhouyuechuan2025-ui/aipacking/blob/main/docs/MOTION-INDEX.md)。npm run studio 选 MotionGallery，可预览全部新增效果。

以下是镜头内的 elements，时间是绝对秒。每个 at 与分镜的可见 beats 对齐。itemsData 每项分别绑定台词，最后一项留出至少 0.28 秒。证据类动效圈出已授权真实截图上的位置。数值类只用原稿能证实的数据，bars 接受非负值。

```json
[
  {"kind":"motion","text":"备选单","animation":"magic-puffIn","animationDuration":0.4,"at":12.5,"duration":1.4,"x":1390,"y":214,"width":440,"height":80},
  {"kind":"semantic","preset":"checklist","at":14,"duration":2.3,"x":90,"y":214,"width":440,"height":172,"itemsData":[{"text":"先查来源","at":14},{"text":"再核数字","at":15.1}]}
]
```

普通真人镜头至少一半实际使用扩展动效，阅读停留单独说明。30 秒以上分镜至少三类扩展动作，同一类动作的方向变体只算一类。逐镜注明名称、触发词、位置、入场与收尾状态。把确认后的 elements 原样传入实际生产计划。

风格预览抽 3–5 个实帧。使用一个或多个 `--clip 开始秒 结束秒` 覆盖完整运镜，并至少展示一项完整新增动效。检查标签推进、人物避让及真实资料停稳后的阅读效果。获得当前版确认后再渲染整片。
