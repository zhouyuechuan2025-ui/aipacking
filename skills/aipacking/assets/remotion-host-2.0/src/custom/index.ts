import { TechHero, TechBento, TechFlow } from './TechVisuals';
// 现场定制页面注册表：Codex 为某条视频新写的页面放在 src/custom/ 下，并在这里注册。
// 例：import { MyScene } from './MyScene'; export const CUSTOM = { MyScene, TechHero, TechBento, TechFlow };
// 好用的定制页面可以通过「沉淀到模板库」流程移到 src/pages/ 并写进 docs/catalog.json。
import React from 'react';
import type { PageProps } from '../pages/full';
import { CoverGrid } from './CoverGrid';
export const CUSTOM: Record<string, React.FC<PageProps>> = { CoverGrid, TechHero, TechBento, TechFlow };
