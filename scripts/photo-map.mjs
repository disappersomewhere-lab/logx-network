// Maps LOGX product families to the original photographs in `logx oreginal image/`.
//
// Indices refer to the source folder listed alphabetically (see `sourceFiles()`),
// which is stable for a fixed folder. `build-images.mjs` writes the resolved
// filenames into `data/photo-sources.json` so the mapping stays auditable.
//
// Where a photograph shows a legible part-number label it is assigned to that
// exact part; families without their own labelled shot reuse an unlabelled
// photograph of the same product line rather than a mismatched label.

export const families = {
  'cat6-cable': [31, 33, 29, 30, 27, 28, 32],
  'cat6a-cable': [33, 32, 31],
  'patch-cord-cat6-short': [10, 11, 21],
  'patch-cord-cat6-half': [21, 22, 10],
  'patch-cord-cat6-1m': [23, 24, 11],
  'patch-cord-cat6-long': [19, 20, 24],
  'patch-cord-cat6a': [20, 24, 19],
  'faceplate': [86, 87, 84, 85],
  'keystone-cat6': [96, 99, 88, 89, 91, 92],
  'keystone-cat6a': [97, 98, 94, 93],
  'cable-manager-1u': [38, 37, 39, 34, 35],
  'cable-manager-2u': [36, 39, 38, 37],
  'patch-panel-24': [50, 49, 51, 52, 40],
  'patch-panel-48': [45, 46, 47, 44, 42],
  'rj45-plug': [25, 26],
  'drop-fiber-4': [106, 111, 112, 115],
  'drop-fiber-8': [107, 113, 116, 117],
  'drop-fiber-12': [114, 118, 110, 109],
  'fiber-panel-12': [70, 71, 72, 73],
  'fiber-panel-24': [78, 79, 76, 77, 74],
  'fiber-panel-48': [80, 81, 82, 83],
  'fiber-cord-sm': [15, 16],
  'fiber-cord-om3': [17, 18, 12, 13, 14],
  'pigtail-sm': [103, 104, 105],
  'pigtail-om3': [100, 101, 102],
  'tools-bag': [119, 120],
  'media-converter': [1],
  'terminal-box-4': [4],
  'terminal-box-8': [0],
  'pdu': [2, 3],
  // Brand / editorial imagery used outside the catalogue grid.
  'brand-packaging': [8, 7, 6, 9]
};

// Resolves a part number to a family key. First match wins, so order matters.
const rules = [
  [/^LXC6UUPVG305$/, 'cat6-cable'],
  [/^LXC6AUUPVG305$/, 'cat6a-cable'],
  [/^LXC6ASFPVG305$/, 'cat6a-cable'],

  [/^LXPC6UUPVG0\.25$/, 'patch-cord-cat6-short'],
  [/^LXPC6UUPVG0\.5$/, 'patch-cord-cat6-half'],
  [/^LXPC6UUPVG1$/, 'patch-cord-cat6-1m'],
  [/^LXPC6UUPVG(3|5|10)$/, 'patch-cord-cat6-long'],
  [/^LXPC6AUUPVG/, 'patch-cord-cat6a'],

  [/^LXA(10|20)$/, 'faceplate'],
  [/^LXCJ6UFT$/, 'keystone-cat6'],
  [/^LXCJ6AUFT$/, 'keystone-cat6a'],

  [/^LXCPCMNM1$/, 'cable-manager-1u'],
  [/^LXCPCMNM2$/, 'cable-manager-2u'],
  [/^LXPP6U2410$/, 'patch-panel-24'],
  [/^LXPP6U4820$/, 'patch-panel-48'],
  [/^LXCP(PTC6|UTC6|STC6A)$/, 'rj45-plug'],

  [/^LXFHN047ALS$/, 'drop-fiber-4'],
  [/^LXFHS087ALS$/, 'drop-fiber-8'],
  [/^LXFHS127ALS$/, 'drop-fiber-12'],

  [/^LXFPRDLC12$/, 'fiber-panel-12'],
  [/^LXFPRDLC24$/, 'fiber-panel-24'],
  [/^LXFPRDLC48$/, 'fiber-panel-48'],

  [/^LXFCLCLCDUS2/, 'fiber-cord-sm'],
  [/^LXFCLCLCDUS3/, 'fiber-cord-om3'],
  [/^LXFTLCSUS2/, 'pigtail-sm'],
  [/^LXFTLCSUM3/, 'pigtail-om3'],

  [/^BT-Tools$/, 'tools-bag'],
  [/^LGX-MC/, 'media-converter'],
  [/^LXFTBLC04$/, 'terminal-box-4'],
  [/^LXFTBLC08$/, 'terminal-box-8'],
  [/^LGX-PDU/, 'pdu']
];

export function familyFor(partNumber) {
  const key = String(partNumber).trim();
  const hit = rules.find(([pattern]) => pattern.test(key));
  return hit ? hit[1] : null;
}

export function imagesFor(partNumber) {
  const family = familyFor(partNumber);
  if (!family) return [];
  return families[family].map((_, index) => `/products/photos/${family}-${String(index + 1).padStart(2, '0')}.webp`);
}

/** The 1200x630 JPEG link-preview card for a part, shared across its family. */
export function ogImageFor(partNumber) {
  const family = familyFor(partNumber);
  return family ? `/products/photos/${family}-og.jpg` : '/opengraph-image.png';
}
