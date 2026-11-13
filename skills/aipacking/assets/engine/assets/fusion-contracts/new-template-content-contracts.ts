export type NewTemplateContent = {
  title: string
  subtitle: string
  items: string[]
  sceneSeconds: number
  sourcePhrases?: string[]
  hasMedia?: boolean
}

type Range = { min: number; max: number }

export type NewTemplateContentContract = {
  semanticTags: string[]
  semanticDescription: string
  autoMatch: boolean
  replacementStatus: 'adapted' | 'source-locked'
  replaceable: { title: boolean; subtitle: boolean; items: boolean; media: boolean; palette: boolean }
  mediaRequired: boolean
  limits: { title: Range; subtitle: Range; item: Range }
  itemCount: Range
  completePhraseOnly: true
  overflowPolicy: 'reject-template'
  minSceneSeconds: number
}

const range = (min: number, max: number): Range => ({ min, max })
const adapted = (
  semanticTags: string[],
  semanticDescription: string,
  limits: NewTemplateContentContract['limits'],
  itemCount = range(0, 0),
  replaceable: Partial<NewTemplateContentContract['replaceable']> = {},
): NewTemplateContentContract => ({
  semanticTags,
  semanticDescription,
  autoMatch: true,
  replacementStatus: 'adapted',
  replaceable: { title: limits.title.max > 0, subtitle: limits.subtitle.max > 0, items: itemCount.max > 0, media: false, palette: false, ...replaceable },
  mediaRequired: replaceable.media === true,
  limits,
  itemCount,
  completePhraseOnly: true,
  overflowPolicy: 'reject-template',
  minSceneSeconds: 3.2,
})
export const NEW_TEMPLATE_CONTENT_CONTRACTS: Record<string, NewTemplateContentContract> = {
  snapSearchTyping: adapted(['搜索', '提问', '输入'], '完整搜索词或完整问题的打字输入；不承载并列信息。', { title: range(4, 36), subtitle: range(0, 0), item: range(0, 0) }),
  snapPromptZoom: adapted(['AI提问', '输入框', '提示词'], 'AI 首页到输入框的提问近景；问题与辅助说明必须对应。', { title: range(2, 12), subtitle: range(4, 28), item: range(2, 12) }, range(0, 4)),
  snapAnswerStream: adapted(['AI回答', '生成结果', '问答'], '问题提交、流式回答和结果卡；问题与回答必须是同一语义。', { title: range(2, 18), subtitle: range(6, 42), item: range(2, 14) }, range(0, 3)),
  snapPhoneFrame: adapted(['手机录屏', 'App', '移动端'], '真实手机截图或录屏展示；无真实素材时禁止使用。', { title: range(0, 0), subtitle: range(0, 0), item: range(0, 0) }, range(0, 0), { media: true }),
  snapLaptopFrame: adapted(['网页录屏', '桌面软件', '网站'], '真实网页或桌面录屏展示，可使用一个短设备标签。', { title: range(2, 16), subtitle: range(0, 0), item: range(0, 0) }, range(0, 0), { media: true }),
  snapTerminalSimulator: adapted(['命令行', '终端', '日志'], '真实命令、日志和执行结果；禁止用抽象观点伪装终端内容。', { title: range(2, 18), subtitle: range(3, 32), item: range(2, 28) }, range(1, 6)),
  snapLogoAssemble: adapted(['品牌', '素材汇聚', '案例合集'], '多张真实素材汇聚到品牌锁定；需要真实素材。', { title: range(2, 12), subtitle: range(2, 18), item: range(0, 0) }, range(0, 0), { media: true }),
  snapLogoFlicker: adapted(['品牌', '素材闪回', '片头'], '多张真实素材高速闪回后显现完整品牌名。', { title: range(2, 12), subtitle: range(0, 0), item: range(0, 0) }, range(0, 0), { media: true }),
  snapBlockWordmark: adapted(['品牌词', '关键词', '短标题'], '仅用于 3–8 个字符的完整短词、品牌名或短标题。', { title: range(3, 8), subtitle: range(0, 0), item: range(0, 0) }),
  snapAnnounceTitle: adapted(['发布', '版本', '强片头'], '版本发布、产品登场或强片头的分段标题。', { title: range(4, 18), subtitle: range(2, 18), item: range(0, 0) }),
  snapHeroLaunch: adapted(['产品开场', '视觉证据', '强开场'], '两张真实素材与一句完整标题构成产品级开场。', { title: range(4, 20), subtitle: range(0, 0), item: range(0, 0) }, range(0, 0), { media: true }),
  snapOrbitGallery: adapted(['案例合集', '图片宇宙', '素材墙'], '多张真实素材围绕同一主题持续展示。', { title: range(2, 16), subtitle: range(2, 24), item: range(0, 0) }, range(0, 0), { media: true }),
  snapMoodboardReveal: adapted(['情绪板', '风格', '主图揭示'], '多张同主题氛围素材最终落到一张主图。', { title: range(2, 12), subtitle: range(2, 18), item: range(2, 8) }, range(1, 1), { media: true }),
  snapStatusCycle: adapted(['状态', '步骤状态', '产品动词'], '同一对象的 2–4 个短状态或动作轮换。', { title: range(2, 12), subtitle: range(0, 0), item: range(1, 10) }, range(2, 4)),
  snapFollowerRush: adapted(['粉丝增长', '等待名单', '真实数据'], '只用于字幕中明确出现的真实增长数量和名单。', { title: range(0, 0), subtitle: range(0, 0), item: range(1, 12) }, range(1, 8), { media: true }),
  snapPulsingBorder: adapted(['AI生成中', '思考中', '边框叠加'], '只作为生成或思考状态的透明边框，不承载文字。', { title: range(0, 0), subtitle: range(0, 0), item: range(0, 0) }),

  shotDiagramCascade: adapted(['流程树', '级联生成', '关系图', '拆解'], '一句目标逐层长成 3–7 个完整节点。', { title: range(4, 32), subtitle: range(0, 24), item: range(2, 12) }, range(3, 7)),
  shotCardStack: adapted(['卡片堆叠', '多项目', '案例集', '批量'], '4–8 个并列对象以牌堆扇展表现。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 12) }, range(4, 8)),
  shotCarousel3D: adapted(['轮播', '多页面', '案例集', '多方案'], '4–8 个同级页面、方案或案例构成立体轮播。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 12) }, range(4, 8)),
  shotOscilloscopeStreamV2: adapted(['实时信号', '监控', '波形', '实时数据'], '只用于字幕明确声明的实时变化或异常信号。', { title: range(2, 18), subtitle: range(2, 24), item: range(1, 12) }, range(1, 3)),
  shotAxisRescaleShock: adapted(['坐标变化', '异常波动', '数据冲击', '爆发增长'], '真实数值冲出既有尺度并触发坐标重标。', { title: range(2, 18), subtitle: range(2, 24), item: range(1, 12) }, range(1, 4)),
  shotChipBlackout: adapted(['单选', '聚焦', '筛选', '只选一个'], '3–8 个选项中明确聚焦一个结论。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(3, 8)),
  shotChipLiftUserPill: adapted(['用户选择', '标签归属', '选项移动', '定位'], '一个标签从候选组移动到目标用户或对象。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 10) }, range(2, 6)),
  shotCursorCastEnsemble: adapted(['多人协作', '光标协作', '团队', '共同完成'], '3–5 个角色或成员共同完成同一任务。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(3, 5)),
  shotCounterConfetti: adapted(['里程碑', '计数', '庆祝', '达成'], '只用于字幕中明确出现的真实数字或完成节点。', { title: range(2, 18), subtitle: range(2, 24), item: range(1, 12) }, range(1, 3)),
  shotCubeNavigation: adapted(['页面切换', '模块切换', '导航', '六个模块'], '3–6 个模块或页面沿立方体面依次切换。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(3, 6)),
  shotCursorFlyover: adapted(['光标操作', '界面巡览', '点击', '人工操作'], '光标依次巡览 3–4 个真实操作区域。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 10) }, range(3, 4)),
  shotDashboardGlowPill: adapted(['仪表盘', '重点指标', '高亮', '核心数据'], '在 2–4 个真实指标中圈出唯一重点。', { title: range(2, 18), subtitle: range(2, 24), item: range(1, 12) }, range(2, 4)),
  shotDocParkPillDeal: adapted(['文档', '归档', '任务分发', '整理'], '文档停靠后分发 2–5 个标签或任务。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 12) }, range(2, 5)),
  shotDocumentTypewriterSource: adapted(['文档生成', '打字', '报告', '自动写入'], '文档从标题到 2–4 个正文要点逐步写入。', { title: range(2, 18), subtitle: range(4, 32), item: range(2, 16) }, range(2, 4)),
  shotFlyingWords: adapted(['关键词', '文字飞入', '观点', '概念'], '3–6 个完整关键词在空间中汇聚。', { title: range(2, 18), subtitle: range(0, 20), item: range(2, 10) }, range(3, 6)),
  shotFracture: adapted(['破裂', '转折', '冲击开场', '打破'], '短而明确的冲击转折；标题必须完整。', { title: range(3, 16), subtitle: range(2, 20), item: range(0, 0) }),
  shotTapeScrollPointer: adapted(['刻度', '量级', '固定指针', '读数'], '字幕出现真实量级或读数时使用。', { title: range(2, 18), subtitle: range(2, 20), item: range(1, 12) }, range(1, 3)),
  shotGlassDictation: adapted(['语音输入', '听写', '提示词', '输入'], '一条完整输入或提示词进入玻璃胶囊。', { title: range(4, 28), subtitle: range(2, 18), item: range(0, 0) }),
  shotHatchDepth: adapted(['深度', '层级', '空间', '深入'], '2–4 个层级从表层推进到深层。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 10) }, range(2, 4)),
  shotIntegrationHubMap: adapted(['集成', '连接', '生态', '中枢'], '一个中心连接 3–6 个明确系统或能力；英文产品与 Skill 名称必须完整。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 18) }, range(3, 6)),
  shotMosaicReframe: adapted(['多画面', '重构', '案例墙', '素材'], '4–8 个同主题画面或信息块重新编排。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(4, 8)),
  shotQuadSplit: adapted(['四路并行', '多场景', '分屏', '同时'], '严格四个并行场景或动作。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(4, 4)),
  shotRadialRipplePhone: adapted(['手机', '功能扩散', '触点', '移动端'], '一个手机主体向外连接 3–6 个功能。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 10) }, range(3, 6)),
  shotScanlineAnnotate: adapted(['扫描', '标注', '重点定位', '圈出'], '扫描后标注 1–3 个明确重点。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 12) }, range(1, 3)),
  shotScanlineAssemble: adapted(['扫描组装', '界面生成', '模块飞入', '搭建'], '3–6 个模块被扫描并组装成完整界面。', { title: range(2, 18), subtitle: range(2, 24), item: range(2, 10) }, range(3, 6)),
  shotSteepTiltGlide: adapted(['长页面', '侧掠', '界面巡览', '多个模块'], '4–8 个页面模块沿强透视方向连续巡览。', { title: range(2, 18), subtitle: range(0, 24), item: range(2, 10) }, range(4, 8)),
}

export const NEW_TEMPLATE_AUTOMATCH_IDS = Object.keys(NEW_TEMPLATE_CONTENT_CONTRACTS)

export const NEW_TEMPLATE_FAMILY_BY_ID: Record<string, string> = {
  snapSearchTyping:'input', snapPromptZoom:'input', snapAnswerStream:'ai-response', snapPhoneFrame:'device', snapLaptopFrame:'device', snapTerminalSimulator:'terminal', snapLogoAssemble:'brand-media', snapLogoFlicker:'brand-media', snapBlockWordmark:'title', snapAnnounceTitle:'title', snapHeroLaunch:'brand-media', snapOrbitGallery:'media-gallery', snapMoodboardReveal:'media-gallery', snapStatusCycle:'labels', snapFollowerRush:'metric', snapPulsingBorder:'ai-response',
  shotDiagramCascade:'structure', shotCardStack:'card-gallery', shotCarousel3D:'card-gallery', shotOscilloscopeStreamV2:'metric', shotAxisRescaleShock:'metric', shotChipBlackout:'selection', shotChipLiftUserPill:'selection', shotCursorCastEnsemble:'collaboration', shotCounterConfetti:'metric', shotCubeNavigation:'navigation', shotCursorFlyover:'navigation', shotDashboardGlowPill:'metric', shotDocParkPillDeal:'document', shotDocumentTypewriterSource:'document', shotFlyingWords:'labels', shotFracture:'title', shotTapeScrollPointer:'metric', shotGlassDictation:'input', shotHatchDepth:'structure', shotIntegrationHubMap:'structure', shotMosaicReframe:'media-gallery', shotQuadSplit:'parallel', shotRadialRipplePhone:'device', shotScanlineAnnotate:'focus', shotScanlineAssemble:'structure', shotSteepTiltGlide:'navigation',
}

export function newTemplateSemanticScore(text: string, id: string) {
  const contract = NEW_TEMPLATE_CONTENT_CONTRACTS[id]
  if (!contract?.autoMatch) return 0
  const normalized = text.toLocaleLowerCase()
  const hits = contract.semanticTags.filter((tag) => normalized.includes(tag.toLocaleLowerCase())).length
  return hits > 0 ? 64 + (hits - 1) * 16 : 0
}

export function isNewTemplateFamilyRepeat(id: string, recent: string[]) {
  const family = NEW_TEMPLATE_FAMILY_BY_ID[id]
  const previousFamily = NEW_TEMPLATE_FAMILY_BY_ID[recent.at(-1) ?? '']
  return Boolean(family && previousFamily && family === previousFamily)
}

const visibleLength = (value: string) => Array.from(value.trim()).length
const within = (value: string, limit: Range) => {
  const length = visibleLength(value)
  if (limit.max === 0) return length === 0
  return length >= limit.min && length <= limit.max
}

function containsPartialSourcePhrase(value: string, sourcePhrases: string[]) {
  const normalized = value.trim().toLocaleLowerCase()
  if (!normalized) return false
  return sourcePhrases.some((phrase) => {
    const source = phrase.trim().toLocaleLowerCase()
    return source !== normalized && source.length > normalized.length && source.includes(normalized)
  })
}

export function isNewTemplateAutoMatchAllowed(id: string) {
  const contract = NEW_TEMPLATE_CONTENT_CONTRACTS[id]
  return contract ? contract.autoMatch : true
}

const protectedChinesePhrases = ['AI博主', '自媒体', '工作台', '智能体', '知识库', '提示词', '永久记忆', '质检项', '检测规则', '自动剪辑', '视频包装']

export function integritySourcePhrases(text: string) {
  const latinWords = text.match(/[A-Za-z][A-Za-z0-9_+.#-]*/g) ?? []
  const knownPhrases = protectedChinesePhrases.filter((phrase) => text.toLocaleLowerCase().includes(phrase.toLocaleLowerCase()))
  return Array.from(new Set([...latinWords, ...knownPhrases]))
}

export function templateContentFits(id: string, content: NewTemplateContent) {
  const contract = NEW_TEMPLATE_CONTENT_CONTRACTS[id]
  if (!contract) return { ok: true, reasons: [] as string[] }
  const reasons: string[] = []
  if (!contract.autoMatch && contract.replacementStatus === 'source-locked') reasons.push('源码未开放内容替换槽')
  if (content.sceneSeconds < contract.minSceneSeconds) reasons.push(`时长不足 ${contract.minSceneSeconds} 秒`)
  if (contract.mediaRequired && !content.hasMedia) reasons.push('缺少模板要求的真实图片或录屏素材')
  if (contract.replaceable.title && !within(content.title, contract.limits.title)) reasons.push(`标题字数应为 ${contract.limits.title.min}–${contract.limits.title.max}`)
  if (contract.replaceable.subtitle && !within(content.subtitle, contract.limits.subtitle)) reasons.push(`副标题字数应为 ${contract.limits.subtitle.min}–${contract.limits.subtitle.max}`)
  if (contract.replaceable.items && (content.items.length < contract.itemCount.min || content.items.length > contract.itemCount.max)) reasons.push(`项目数量应为 ${contract.itemCount.min}–${contract.itemCount.max}`)
  if (contract.replaceable.items && content.items.some((item) => !within(item, contract.limits.item))) reasons.push(`单项字数应为 ${contract.limits.item.min}–${contract.limits.item.max}`)
  if (content.sourcePhrases?.some(Boolean)) {
    if (containsPartialSourcePhrase(content.title, content.sourcePhrases) || containsPartialSourcePhrase(content.subtitle, content.sourcePhrases) || content.items.some((item) => containsPartialSourcePhrase(item, content.sourcePhrases!))) {
      reasons.push('检测到源词或语义短语被截成残词')
    }
  }
  return { ok: reasons.length === 0, reasons }
}
