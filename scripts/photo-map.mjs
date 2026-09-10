// Maps LOGX product families to the original photographs in `logx oreginal image/`.
//
// Keyed by filename, deliberately. An earlier version keyed on the file's index
// in the sorted folder, which silently re-pointed every product the moment a
// photograph was added.
//
// Where a photograph shows a legible part-number label it is assigned to that
// exact part; families without their own labelled shot reuse an unlabelled
// photograph of the same product line rather than a mismatched label.

export const families = {
  "cat6-cable": [
    "٢٠٢٥٠٣٠٣_٠٠٠٧٥٥_6.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٩٣٨_5.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٧١١_4.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٧٤٠.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٦٢٢_3.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٦٥٦_1.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٩٠٧_2.jpg"
  ],
  "cat6a-cable": [
    "٢٠٢٥٠٣٠٣_٠٠٠٩٣٨_5.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٩٠٧_2.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٠٧٥٥_6.jpg"
  ],
  "patch-cord-cat6-short": [
    "٢٠٢٥٠٣٠٢_٢٣٣٦٣٩_4.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٦٤٥_3.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٤٣٧_3.jpg"
  ],
  "patch-cord-cat6-half": [
    "٢٠٢٥٠٣٠٢_٢٣٤٤٣٧_3.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٤٥٨_4.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٦٣٩_4.jpg"
  ],
  "patch-cord-cat6-1m": [
    "٢٠٢٥٠٣٠٢_٢٣٤٥٣٨_3.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٥٤١_2.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٦٤٥_3.jpg"
  ],
  "patch-cord-cat6-long": [
    "٢٠٢٥٠٣٠٢_٢٣٤٤٠٦_6.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٤١٧_5.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٥٤١_2.jpg"
  ],
  "patch-cord-cat6a": [
    "٢٠٢٥٠٣٠٢_٢٣٤٤١٧_5.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٥٤١_2.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٤٠٦_6.jpg"
  ],
  "faceplate": [
    "٢٠٢٥٠٣١٣_٢١٥٦٤٤_2.jpg",
    "٢٠٢٥٠٣١٣_٢١٥٧٠٥_1.jpg",
    "٢٠٢٥٠٣١٣_٢١٥٤٤٦_5.jpg",
    "٢٠٢٥٠٣١٣_٢١٥٥٠٦_6.jpg"
  ],
  "keystone-cat6": [
    "٢٠٢٥٠٣١٣_٢٢٠٥٣٤_8.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠٨٤١_3.jpg",
    "٢٠٢٥٠٣١٣_٢١٥٩٢٩_6.jpg",
    "٢٠٢٥٠٣١٣_٢١٥٩٣٨_7.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠٠٥٨_1.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠١٣٨.jpg"
  ],
  "keystone-cat6a": [
    "٢٠٢٥٠٣١٣_٢٢٠٦٤٣_4.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠٧٣٠.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠٣٢١_4.jpg",
    "٢٠٢٥٠٣١٣_٢٢٠٣١٣_3.jpg"
  ],
  "cable-manager-1u": [
    "٢٠٢٥٠٣٠٣_٠٠١٧٠٩_3.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٦٤٧.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٧٣٨_2.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٤٤٠_2.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٥٠٥_1.jpg"
  ],
  "cable-manager-2u": [
    "٢٠٢٥٠٣٠٣_٠٠١٥٤٦_5.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٧٣٨_2.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٧٠٩_3.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٦٤٧.jpg"
  ],
  "patch-panel-24": [
    "٢٠٢٥٠٣٠٣_٠٠٣٣٢٦.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٣٣٢٣_1.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٣٤٣٨_2.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٣٧١٠_4.jpg",
    "٢٠٢٥٠٣٠٣_٠٠١٩٣٤.jpg"
  ],
  "patch-panel-48": [
    "٢٠٢٥٠٣٠٣_٠٠٢٥١٦_3.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٢٧٠٩_3.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٢٧٥٠_6.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٢٤٣٢_5.jpg",
    "٢٠٢٥٠٣٠٣_٠٠٢٠٢٩_5.jpg"
  ],
  "rj45-plug": [
    "٢٠٢٥٠٣٠٢_٢٣٤٥٥٨.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٦١١_1.jpg"
  ],
  "drop-fiber-4": [
    "٢٠٢٥٠٣١٣_٢٢١٦٢١.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٢٤١_1.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٢٥٤_3.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٦١٨_4.jpg"
  ],
  "drop-fiber-8": [
    "٢٠٢٥٠٣١٣_٢٢١٦٤٥_1.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٥٣٣_5.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٨٥٣_3.jpg",
    "٢٠٢٥٠٣١٣_٢٢٣٠٥١_1.jpg"
  ],
  "drop-fiber-12": [
    "٢٠٢٥٠٣١٣_٢٢٢٦٠٢_2.jpg",
    "٢٠٢٥٠٣١٣_٢٢٣١٠٦_2.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢٢٠٨.jpg",
    "٢٠٢٥٠٣١٣_٢٢٢١٠٥.jpg"
  ],
  "fiber-panel-12": [
    "٢٠٢٥٠٣٠٣_٢٣٥٩٥٤_3.jpg",
    "٢٠٢٥٠٣٠٣_٢٣٥٩٥٤_5.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٠١٧_1.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٠١٧_9.jpg"
  ],
  "fiber-panel-24": [
    "٢٠٢٥٠٣٠٤_٠٠٠٤٢٢_13.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٤٢٢_3.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٠٥٦_2.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٠٥٦_4.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٠٣٥.jpg"
  ],
  "fiber-panel-48": [
    "٢٠٢٥٠٣٠٤_٠٠٠٥٥٨.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٥٥٨_4.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٦١٤_1.jpg",
    "٢٠٢٥٠٣٠٤_٠٠٠٦١٤_6.jpg"
  ],
  "fiber-cord-sm": [
    "٢٠٢٥٠٣٠٢_٢٣٤٢١٧_6.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٢٤٥_5.jpg"
  ],
  "fiber-cord-om3": [
    "٢٠٢٥٠٣٠٢_٢٣٤٣٢٦_5.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٣٣٣_4.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٨٢٦.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٩١٨_2.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٤٠١٥_1.jpg"
  ],
  "pigtail-sm": [
    "٢٠٢٥٠٣١٣_٢٢١٢١٢_2.jpg",
    "٢٠٢٥٠٣١٣_٢٢١٣٠٢_4.jpg",
    "٢٠٢٥٠٣١٣_٢٢١٣٢٠_6.jpg"
  ],
  "pigtail-om3": [
    "٢٠٢٥٠٣١٣_٢٢٠٩٣٨_5.jpg",
    "٢٠٢٥٠٣١٣_٢٢١٠٣٢_3.jpg",
    "٢٠٢٥٠٣١٣_٢٢١٠٤٠_4.jpg"
  ],
  "tools-bag": [
    "٢٠٢٥٠٣١٣_٢٢٤٤١١.jpg",
    "٢٠٢٥٠٣١٣_٢٢٤٤٤٤_1.jpg"
  ],
  "media-converter": [
    "SFP Media converter.jpeg"
  ],
  "terminal-box-4": [
    "fiber D 4 port.jpeg"
  ],
  "terminal-box-8": [
    "fiber D 8 port.jpeg prot.jpeg"
  ],
  "pdu": [
    "PDU.jpeg",
    "PDU..jpeg"
  ],
  "brand-packaging": [
    "٢٠٢٥٠٣٠٢_٢٣٣٤٤٩_1.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٤٢١_2.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٤١٤.jpg",
    "٢٠٢٥٠٣٠٢_٢٣٣٥٣٦.jpg"
  ]
};

/**
 * Extra rotation, in degrees clockwise, applied after the EXIF orientation.
 * These were shot with the product lying on its side or upside down, so the
 * printed LOGX branding did not read horizontally on the site.
 *
 * Two cases are deliberately absent. The keystone jacks read LOGX in reverse
 * because the logo sits on a hinged dust cap printed to read when closed, while
 * the moulded CAT.6 / CAT.6A on the body already reads correctly — rotating
 * would fix the cap and break the body text. The old 8 port terminal box shot
 * was in-situ, so rotating turned the whole shop scene over; it has since been
 * replaced with a better photograph.
 */
export const rotations = {
  "٢٠٢٥٠٣٠٢_٢٣٣٤١٤.jpg": 180, // packaging
  "٢٠٢٥٠٣٠٢_٢٣٣٥٣٦.jpg": 180, // packaging
  "٢٠٢٥٠٣٠٢_٢٣٤٢٤٥_5.jpg": 180, // SM fiber patch cord bag
  "٢٠٢٥٠٣٠٢_٢٣٤٣٢٦_5.jpg": 180, // OM3 fiber patch cord bag
  "٢٠٢٥٠٣٠٢_٢٣٤٣٣٣_4.jpg": 180, // OM3 fiber patch cord bag
  "٢٠٢٥٠٣٠٢_٢٣٤٤٠٦_6.jpg": 90, // CAT6 patch cord bag, on its side
  "٢٠٢٥٠٣٠٢_٢٣٤٤١٧_5.jpg": 90, // CAT6 patch cord bag, on its side
  "٢٠٢٥٠٣٠٢_٢٣٤٤٣٧_3.jpg": 90, // CAT6 patch cord bag, on its side
  "٢٠٢٥٠٣٠٢_٢٣٤٤٥٨_4.jpg": 180, // CAT6 patch cord bag, upside down
  "٢٠٢٥٠٣٠٢_٢٣٤٥٥٨.jpg": 90, // RJ45 plug carton, on its side
  "٢٠٢٥٠٣٠٢_٢٣٤٦١١_1.jpg": 90, // RJ45 plug carton, on its other side
  "٢٠٢٥٠٣٠٣_٠٠٠٩٣٨_5.jpg": 180, // bulk cable coil, jacket print upside down
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
  'SFP Media converter.jpeg': [0.235, 0.455, 0.5, 0.3],
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
  return families[family].map(
    (_, index) => `/products/photos/${family}-${String(index + 1).padStart(2, '0')}.webp`
  );
}

/** The 1200x630 JPEG link-preview card for a part, shared across its family. */
export function ogImageFor(partNumber) {
  const family = familyFor(partNumber);
  return family ? `/products/photos/${family}-og.jpg` : '/og-default.png';
}
