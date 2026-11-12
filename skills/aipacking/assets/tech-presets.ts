export const TECH_PRESETS = {
  'violet-tech': {bg:'#080B16',panel:'#12182B',ink:'#F6F7FF',muted:'#B6BED5',main:'#B7A1FF',secondary:'#58E1FF',tertiary:'#FFADCE',line:'#2D3652'},
  'cyan-data': {bg:'#061511',panel:'#102822',ink:'#F3FFF9',muted:'#BCD3CB',main:'#70EDC5',secondary:'#91BCFF',tertiary:'#F5D782',line:'#2B4B42'},
  'warm-tech': {bg:'#190D18',panel:'#301F2F',ink:'#FFF5EF',muted:'#D6C3D0',main:'#FFB090',secondary:'#C9ACFF',tertiary:'#FFDF8D',line:'#584052'},
  'gallery-light': {bg:'#F3F1FA',panel:'#FFFFFF',ink:'#201D32',muted:'#615974',main:'#6342C7',secondary:'#007477',tertiary:'#A13361',line:'#D5CEE5'},
} as const;
export type TechPreset = keyof typeof TECH_PRESETS;
