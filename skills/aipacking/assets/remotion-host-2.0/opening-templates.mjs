export const openingTemplates = {
  'opening-mosaic': {duration: 180, range: [44, 114], images: [2, 12]},
  'opening-logo-assemble': {duration: 108, range: [31, 103], images: [4, 12], required: ['logoSrc', 'brandName']},
  'opening-tilt-reveal': {duration: 145, range: [46, 76], required: ['image']},
  'snap-hero-launch': {duration: 170, range: [74, 121], images: [2, 2]},
  'snap-announce-title': {duration: 170, range: [18, 56], required: ['eyebrow', 'title']},
};

export function isOpeningTemplate(effect) {
  return Object.hasOwn(openingTemplates, effect);
}
