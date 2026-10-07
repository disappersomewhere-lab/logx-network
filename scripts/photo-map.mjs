// Maps LOGX product families to the original photographs in `logx oreginal image/`.
//
// Keyed by filename, deliberately. An earlier version keyed on the file's index
// in the sorted folder, which silently re-pointed every product the moment a
// photograph was added.
//
// Each family intentionally has one representative image. Prefer an original
// LOGX product photo; use clean artwork only when no matching product photo
// exists. Never substitute a visually different sibling product.
//
// Each part family has its own matching photography or a clean product
// illustration where the source shoot only captured a retail package or a
// tangled cable. Do not assign a sibling's photo when its construction differs.

export const families = {
  "cat6-cable": ["@artwork/bulk-cable-cat6.svg"],
  "cat6a-cable": ["@artwork/bulk-cable-cat6a.svg"],
  "cat6a-sftp-cable": ["@artwork/bulk-cable-cat6a-sftp.svg"],
  "patch-cord-cat6-short": ["@open-source/pexels-ethernet-connector-white.jpg"],
  "patch-cord-cat6-half": ["@open-source/pexels-ethernet-connector-white.jpg"],
  "patch-cord-cat6-1m": ["@open-source/pexels-ethernet-connector-white.jpg"],
  "patch-cord-cat6-long": ["@open-source/pexels-ethernet-connector-white.jpg"],
  "patch-cord-cat6a": ["@artwork/patch-cord-cat6a.svg"],
  "faceplate": ["٢٠٢٥٠٣١٣_٢١٥٦٤٤_2.jpg"],
  "faceplate-2-port": ["@artwork/faceplate-2-port.svg"],
  "keystone-cat6": ["٢٠٢٥٠٣١٣_٢٢٠٥٣٤_8.jpg"],
  "keystone-cat6a": ["٢٠٢٥٠٣١٣_٢٢٠٦٤٣_4.jpg"],
  "cable-manager-1u": ["٢٠٢٥٠٣٠٣_٠٠١٧٠٩_3.jpg"],
  "cable-manager-2u": ["٢٠٢٥٠٣٠٣_٠٠١٧٣٨_2.jpg"],
  "patch-panel-24": ["@open-source/pexels-patch-panel-context.jpg"],
  "patch-panel-48": ["@open-source/pexels-patch-panel-context.jpg"],
  "rj45-plug": [
    "@artwork/rj45-plug.svg"
  ],
  "rj45-plug-shielded": [
    "@artwork/rj45-plug-shielded.svg"
  ],
  "drop-fiber-4": ["٢٠٢٥٠٣١٣_٢٢١٦٢١.jpg"],
  "drop-fiber-8": ["٢٠٢٥٠٣١٣_٢٢١٦٤٥_1.jpg"],
  "drop-fiber-12": ["٢٠٢٥٠٣١٣_٢٢٢٦٠٢_2.jpg"],
  "fiber-panel-12": ["٢٠٢٥٠٣٠٣_٢٣٥٩٥٤_3.jpg"],
  "fiber-panel-24": ["٢٠٢٥٠٣٠٤_٠٠٠٤٢٢_13.jpg"],
  "fiber-cord-sm": [
    "@artwork/fiber-cord-sm.svg"
  ],
  "fiber-cord-om3": ["٢٠٢٥٠٣٠٢_٢٣٣٨٢٦.jpg"],
  "pigtail-sm": ["٢٠٢٥٠٣١٣_٢٢١٣٠٢_4.jpg"],
  "pigtail-om3": ["٢٠٢٥٠٣١٣_٢٢١٠٣٢_3.jpg"],
  "tools-bag": ["٢٠٢٥٠٣١٣_٢٢٤٤١١.jpg"],
  "media-converter": ["@artwork/media-converter.svg"],
  "terminal-box-4": [
    "fiber D 4 port.jpeg"
  ],
  "terminal-box-8": [
    "fiber D 8 port.jpeg prot.jpeg"
  ],
  "pdu": ["PDU.jpeg"],
};

/** Extra rotation, in degrees clockwise, after applying the EXIF orientation. */
export const rotations = {
  "٢٠٢٥٠٣٠٤_٠٠٠٠٣٥.jpg": 270, // fiber patch panel, on its side
};

/**
 * Crop applied before anything else, as [left, top, width, height] fractions
 * of the source. Used on the in-situ photographs so the product fills the frame
 * and the warehouse behind it falls outside the crop, which is honest where a
 * background cutout is not: these products are dark, and the blurred racking
 * behind them contains regions darker still, so no luminance threshold
 * separates the two without eating the product or keeping half the shelf.
 */
export const crops = {
  // Stops short of the bottom edge: a shoe is in frame below the connectors.
  'fiber D 4 port.jpeg': [0.03, 0.02, 0.8, 0.91],
  'fiber D 8 port.jpeg prot.jpeg': [0.175, 0.15, 0.635, 0.83],
  'PDU.jpeg': [0.03, 0.45, 0.94, 0.19],
  'PDU..jpeg': [0.02, 0.44, 0.96, 0.19]
};

// Resolves a part number to a family key. First match wins, so order matters.
const rules = [
  [/^LXC6UUPVG305$/, 'cat6-cable'],
  [/^LXC6AUUPVG305$/, 'cat6a-cable'],
  [/^LXC6ASFPVG305$/, 'cat6a-sftp-cable'],

  [/^LXPC6UUPVG0\.25$/, 'patch-cord-cat6-short'],
  [/^LXPC6UUPVG0\.5$/, 'patch-cord-cat6-half'],
  [/^LXPC6UUPVG1$/, 'patch-cord-cat6-1m'],
  [/^LXPC6UUPVG(3|5|10)$/, 'patch-cord-cat6-long'],
  [/^LXPC6AUUPVG/, 'patch-cord-cat6a'],

  [/^LXA10$/, 'faceplate'],
  [/^LXA20$/, 'faceplate-2-port'],
  [/^LXCJ6UFT$/, 'keystone-cat6'],
  [/^LXCJ6AUFT$/, 'keystone-cat6a'],

  [/^LXCPCMNM1$/, 'cable-manager-1u'],
  [/^LXCPCMNM2$/, 'cable-manager-2u'],
  [/^LXPP6U2410$/, 'patch-panel-24'],
  [/^LXPP6U4820$/, 'patch-panel-48'],
  [/^LXCPUTC6$/, 'rj45-plug'],
  [/^LXCPPTC6$/, 'rj45-plug'],
  [/^LXCPSTC6A$/, 'rj45-plug-shielded'],

  [/^LXFHN047ALS$/, 'drop-fiber-4'],
  [/^LXFHS087ALS$/, 'drop-fiber-8'],
  [/^LXFHS127ALS$/, 'drop-fiber-12'],

  [/^LXFPRDLC12$/, 'fiber-panel-12'],
  [/^LXFPRDLC24$/, 'fiber-panel-24'],
  [/^LXFPRDLC48$/, 'fiber-panel-24'],

  [/^LXFCLCLCDUS2/, 'fiber-cord-sm'],
  [/^LXFCLCLCDUS3/, 'fiber-cord-om3'],
  [/^LXFTLCSUS2/, 'pigtail-sm'],
  [/^LXFTLCSUM3/, 'pigtail-om3'],

  [/^BT-Tools$/, 'tools-bag'],
  [/^LGX-MC1000GSFP$/, 'media-converter'],
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
  return families[family].map(
    (_, index) => `/products/photos/${family}-${String(index + 1).padStart(2, '0')}.webp`
  );
}

/** The 1200x630 JPEG link-preview card for a part, shared across its family. */
export function ogImageFor(partNumber) {
  const family = familyFor(partNumber);
  return family ? `/products/photos/${family}-og.jpg` : '/og-default.png';
}
