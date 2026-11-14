export const TECH_PRESETS = {
  'violet-tech': {bg:'#E8E7F8',panel:'#F9F7FF',ink:'#29264F',muted:'#64607E',main:'#5750D9',secondary:'#067D8B',tertiary:'#A13C58',line:'#C3BEDF'},
  'cyan-data': {bg:'#DDF0ED',panel:'#F5FFFA',ink:'#193D45',muted:'#567378',main:'#006D70',secondary:'#6954CA',tertiary:'#AE5129',line:'#B4D8D0'},
  'warm-tech': {bg:'#F5EAD8',panel:'#FFFCF2',ink:'#49332F',muted:'#886B64',main:'#A54B33',secondary:'#4666BF',tertiary:'#866718',line:'#E4CCB8'},
  'gallery-light': {bg:'#F3F1FA',panel:'#FFFFFF',ink:'#201D32',muted:'#615974',main:'#6342C7',secondary:'#007477',tertiary:'#A13361',line:'#D5CEE5'},
} as const;
export type TechPreset = keyof typeof TECH_PRESETS;
