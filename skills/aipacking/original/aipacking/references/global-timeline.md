# 全程顶部时间轴

安装复制组件后，必须接入工程的主合成，在所有场景Sequence、包装层与转场外：

```tsx
import {WithGlobalTimeline} from './custom/GlobalTimeline';
return <WithGlobalTimeline brand="我的视频" chapters={[{at:0,label:'开场'},{at:12,label:'方法'},{at:35,label:'总结'}]}>
  {/* 原有全部场景和转场 */}
</WithGlobalTimeline>;
```

章节at单位为秒，来自本稿SRT与方案，不能照搬示例；章节名称自动在可用宽度内均分，内容多时精简文案。Wrapper放在主合成，不能放进从非零帧起始的Sequence，也不能包在会缩放的场景内部。使用useVideoConfig的尺寸、fps和总时长，首尾同一位置高度，按整片时间推进。头部高度42设计像素（1080高画面）；所有模板预留该区域，RefContinuity使用navigation:false。

抽查首帧、不同模板、人物离场、转场前后与末帧；时间轴不能被盖住、出现双条、错位或重置进度。安装脚本不会猜测并重写任意工程的主入口，集成与实际渲染检查必须完成。
