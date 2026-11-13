import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {OverlayProps} from '../pages/overlay';
import type {PageProps} from '../pages/full';
import {MotionElements} from '../pages/MotionElements';
import registry from './semantic.json';

export const SEMANTIC_LANES: Record<string,React.FC<OverlayProps>> = Object.fromEntries(
  Object.keys(registry).map(preset=>['MotionLane_'+preset, ({p,start}:OverlayProps) =>
    <MotionElements elements={p._elements} start={start} accent={p._accent}/>]),
);

export const SEMANTIC_PAGES: Record<string,React.FC<PageProps>> = Object.fromEntries(
  Object.keys(registry).map(preset=>['MotionPage_'+preset, ({p,start}:PageProps) =>
    <AbsoluteFill style={{background:p.background ?? 'radial-gradient(ellipse at 45% 35%,#332436,#1B1724 75%)'}}>
      <MotionElements elements={p._elements} start={start} accent={p._accent}/>
    </AbsoluteFill>]),
);
