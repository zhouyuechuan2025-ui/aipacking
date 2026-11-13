# 分镜与风格双审

使用者可复制 [启动提示词](starter-prompt.md)。随包是以 2.0 工作台为底的 16:9 Remotion 动效版，不含视频、Node.js、FFmpeg 或 HyperFrames 运行时。不承诺十分钟：分开记录编导、抽帧、渲染耗时。

## 准备

命令在独立作业副本根目录运行。SKILL、WORK 分别是本 Skill 和作业的绝对目录；HF_CLI 是已安装 HyperFrames npm 包的 package.json 内 bin.hyperframes 对应 JS 入口绝对路径，测试版为 0.8.214。找不到 CLI 时只能先做待校验草稿，不能冒称已调用。

1. **使用 2.5 动效版：** 在新版随包宿主创建独立作业副本。运行 `node "<SKILL>/scripts/new-workbench.mjs" "<WORK>"`，进入新目录执行 `npm ci`。需要 HyperFrames CLI 时，可在该作业单独装 `npm install --prefix review-tools --no-save hyperframes@0.8.214`，JS 入口位于 `review-tools/node_modules/hyperframes/bin/hyperframes.mjs`。两边需要 Node.js 22+；依赖和缓存放在作业盘。已有旧作业升级时同样创建独立新版副本，再复制原片、SRT 和所需真实素材。
2. 把源文件放进 `public/input/`，用 `npm run prepare-input -- "口播.mp4" "口播.srt"`。检查四张原片帧、字幕与比例，写 `plan/analysis.md`。已冻结可用素材放进 public，不用会变的外链；参考片默认只分析，不擅自剪入。

## 第一关：分镜

写 `plan/storyboard.json`，总时长等于源片，连续覆盖。type、layout 以实际宿主支持为准。写出具体动作和镜头理由。按 [动作字段说明](motion-direction.md) 填写 `motionVersion: 2`、`chapterTimeline`、`cameraIntent` 和每镜 `beats`。普通口播由侧边元素带节奏，关键落点或需要收窗的镜头才填写 `camera`。

    {
      "duration": 4,
      "motionVersion": 2,
      "cameraIntent": "accent",
      "chapterTimeline": [{"start": 0, "title": "制作流程"}],
      "shots": [{
        "id": "s01", "start": 0, "end": 4,
        "quote": "先拆字幕，再做动效。", "purpose": "把先后关系讲清",
        "aRoll": "全屏流程接管，保留原声", "bRoll": "解释图，不冒充真实界面",
        "motion": "先亮起字幕节点，随后流向动效节点，停留读完",
        "beats": [{"at": 0.3, "label": "字幕节点", "word": "字幕", "role": "entry"}, {"at": 2, "label": "连线点亮动效节点", "word": "动效", "role": "update"}],
        "cue": "说到动效时点亮第二个节点",
        "layout": "full", "type": "TechFlow", "assets": []
      }]
    }

运行 `node scripts/nana-review.mjs board "<HF_CLI>"`。脚本生成 HyperFrames 可读的时间轴草图，通过真实 CLI lint 和镜头时间读回；把 `plan/storyboard.md` 和当前版本号发给用户审。草图不是风格预览，不用 HyperFrames 渲染成片。只有明确收到用户对该版本的确认，才运行 `node scripts/nana-review.mjs approve board "<版本号>" "<用户确认原话>"`。有改动则重发新版。

## 第二关：实际风格

按已审分镜落实 `plan/plan.json`，需要丰富视觉动作时读取 [语义动效选型](semantic-motion.md)。照录顶层 `chapterTimeline` 和已审镜头里实际存在的 `camera`，SideBeats 将分镜中的 `side` 原样作为 `props`。照录已审的 elements 和 motionDetail。同一镜号、时间、布局和模板一对一匹配；核对素材、锚点和实际动效也一致（这是编导核对，脚本不能判断语义）。按 [2.0 设计规则](design-system.md) 写 `plan/design.md`。Tech 预设继续用 props.preset，旧 plan.palette 仍只支持 main / alert。

按具体素材选 3–5 个不同秒点，覆盖开场、人物同屏、关键 B-roll 或典型转场；没有某类镜头就不硬凑。运行 `node scripts/nana-review-preview.mjs 1.3 5.8 9.6`（示例秒点）及 `node scripts/nana-review.mjs status style`。检查并给用户看 Remotion Final 的实际 PNG，标出秒点和风格选择。有运镜时加 `--clip 开始秒 结束秒`，从同一合成取 1–8 秒，完整覆盖一次推近与回位或收窗。把短样和实帧一起交审。Windows 无头浏览器异常时，可将 NANA_BROWSER_EXECUTABLE 指向本机 Chrome 可执行文件。

用户确认预览后才运行 `node scripts/nana-review.mjs approve style "<版本号>" "<用户确认原话>"`。调色或字体需重出风格图；改镜头结构、时间、模板、B-roll 或内容，回第一关。不得替用户确认。

## 渲染与复查

只用已接入门禁的 `npm run render`。npm、直接调用 scripts/render.mjs 与 render:mov 共用门禁；单独 --back 只恢复分镜，不出片，恢复后重新确认。分镜确认绑定源 MP4/SRT 和分镜；风格确认绑定实际分镜、组件、素材和已展示的 PNG。输入或方案变化后，旧版本确认不能继续使用。脚本不能核验聊天身份，Agent 只能按真实用户消息记录确认。独立作业中勿并发改素材和渲染。

继续执行原 validate、增强校验、QA、实帧/正常速度播放、ffprobe 与完整解码。报告实际交付和未验证项；不改变原工作台尺寸、模板、音轨、字幕和增量机制。
