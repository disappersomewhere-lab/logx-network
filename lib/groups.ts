import {catalog, type Localized, type Product, type ProductCategory} from '@/lib/catalog';

/**
 * A product line: every part number that is the same product in a different
 * size or variant. The catalogue shows the line once and lists its part
 * numbers, instead of a card per size with an identical (or near-identical)
 * picture.
 *
 * `family` is the key `scripts/photo-map.mjs` assigns photographs by. Some
 * lines span several families because each size was photographed on its own;
 * `lineOfFamily` folds those back into one line.
 */
export type ProductGroup = {
  key: string;
  category: ProductCategory;
  /** First part of the line, in catalogue order. */
  lead: Product;
  /** The photograph that stands for the whole line on a card. */
  cover?: string;
  representativeImage: boolean;
  products: Product[];
  title: Localized;
  /** Short range line such as "1 m – 100 m"; null when the line has one part. */
  range: Localized | null;
};

/** Photo families that are one line in different sizes. */
const lineOfFamily: Record<string, string> = {
  'patch-cord-cat6-short': 'patch-cord-cat6',
  'patch-cord-cat6-half': 'patch-cord-cat6',
  'patch-cord-cat6-1m': 'patch-cord-cat6',
  'patch-cord-cat6-long': 'patch-cord-cat6',
  'faceplate-2-port': 'faceplate',
  'keystone-cat6': 'keystone',
  'keystone-cat6a': 'keystone',
  'cable-manager-1u': 'cable-manager',
  'cable-manager-2u': 'cable-manager',
  'patch-panel-24': 'patch-panel',
  'patch-panel-48': 'patch-panel',
  'rj45-plug-shielded': 'rj45-plug',
  'drop-fiber-4': 'drop-fiber',
  'drop-fiber-8': 'drop-fiber',
  'drop-fiber-12': 'drop-fiber',
  'fiber-panel-12': 'fiber-panel',
  'fiber-panel-24': 'fiber-panel',
  'terminal-box-4': 'terminal-box',
  'terminal-box-8': 'terminal-box'
};

/**
 * Display names and range lines for lines with more than one part. A
 * single-part line simply uses its own product name; these exist where the
 * parts' names differ by a size or variant that has to come out of the title.
 * A `lengths` range is computed from the parts instead of written here.
 */
const lineText: Record<string, {title: Localized; range?: Localized; lengths?: true}> = {
  'cat6-cable': {
    title: {en: 'CAT6 / CAT6A LAN Cable, 305 m Box', ar: 'كابل شبكة CAT6 / CAT6A — صندوق 305 متر'},
    range: {en: 'CAT6 · CAT6A · CAT6A S/FTP', ar: 'CAT6 · CAT6A · CAT6A S/FTP'}
  },
  'patch-cord-cat6': {
    title: {en: 'CAT6 U/UTP Patch Cord', ar: 'وصلة تصحيح CAT6 غير مُدرَّعة'},
    lengths: true
  },
  'patch-cord-cat6a': {
    title: {en: 'CAT6A U/UTP Patch Cord', ar: 'وصلة تصحيح CAT6A غير مُدرَّعة'},
    lengths: true
  },
  faceplate: {
    title: {en: '86 Type Faceplate', ar: 'وجهة تركيب قياس 86'},
    range: {en: '1 port · 2 port', ar: 'منفذ واحد · منفذان'}
  },
  keystone: {
    title: {en: 'Toolless UTP Keystone Jack', ar: 'وحدة Keystone غير مُدرَّعة بدون أدوات'},
    range: {en: 'CAT6 · CAT6A', ar: 'CAT6 · CAT6A'}
  },
  'cable-manager': {
    title: {en: 'Metal Cable Manager', ar: 'منظم كابلات معدني'},
    range: {en: '1U 24 slot · 2U 48 slot', ar: '1U بـ 24 فتحة · 2U بـ 48 فتحة'}
  },
  'patch-panel': {
    title: {en: 'Keystone Patch Panel', ar: 'لوحة توصيل Keystone'},
    range: {en: '24 port 1U · 48 port 2U', ar: '24 منفذاً 1U · 48 منفذاً 2U'}
  },
  'rj45-plug': {
    title: {en: 'RJ45 Plugs & Boots', ar: 'قوابس RJ45 وأغطية الحماية'},
    range: {en: 'UTP plug · FTP shielded · boot', ar: 'قابس UTP · مُدرَّع FTP · غطاء حماية'}
  },
  'drop-fiber': {
    title: {en: 'Single-Mode Drop Cable', ar: 'كابل ألياف تفريعي أحادي النمط'},
    range: {en: '4 · 8 · 12 core, 1000 m', ar: '4 · 8 · 12 ليفاً، 1000 متر'}
  },
  'fiber-panel': {
    title: {en: 'LC Duplex Fiber Patch Panel', ar: 'لوحة توصيل ألياف LC مزدوجة'},
    range: {en: '12 · 24 · 48 port', ar: '12 · 24 · 48 منفذاً'}
  },
  'fiber-cord-sm': {
    title: {en: 'LC-LC UPC Single-Mode Duplex Patch Cord', ar: 'وصلة ألياف LC-LC UPC أحادية النمط مزدوجة'},
    lengths: true
  },
  'fiber-cord-om3': {
    title: {en: 'LC-LC UPC OM3 Duplex Patch Cord', ar: 'وصلة ألياف LC-LC UPC OM3 مزدوجة'},
    lengths: true
  },
  'pigtail-sm': {
    title: {en: 'LC/UPC Single-Mode Pigtail', ar: 'ضفيرة ألياف LC/UPC أحادية النمط'},
    lengths: true
  },
  'pigtail-om3': {
    title: {en: 'LC/UPC OM3 Pigtail', ar: 'ضفيرة ألياف LC/UPC OM3'},
    lengths: true
  },
  'terminal-box': {
    title: {en: 'LC Fiber Terminal Box', ar: 'صندوق إنهاء ألياف LC'},
    range: {en: '4 port · 8 port', ar: '4 منافذ · 8 منافذ'}
  },
  'media-converter': {
    title: {en: 'SFP Media Converter', ar: 'محول وسائط SFP'},
    range: {en: '1G SFP · 10G SFP+', ar: '1G SFP · 10G SFP+'}
  }
};

/**
 * Cover photograph for lines whose first part's own frame is not the best one:
 * a bag that fills the frame rather than a speck in it, a chassis with the logo
 * showing rather than a sliver. Every path is a frame from the same shoot.
 */
const coverOverride: Record<string, string> = {
  'patch-cord-cat6': '/products/photos/patch-cord-cat6-1m-01.webp',
  'patch-panel': '/products/photos/patch-panel-48-01.webp',
  'fiber-panel': '/products/photos/fiber-panel-24-01.webp',
  'drop-fiber': '/products/photos/drop-fiber-12-01.webp'
};

/** Leading number of a name's length: "…, 1.5 m" → 1.5. */
function lengthOf(product: Product) {
  const match = product.name.en.match(/([\d.]+)\s*m\b/i);
  return match ? Number(match[1]) : null;
}

function rangeFor(text: (typeof lineText)[string] | undefined, products: Product[]): Localized | null {
  if (products.length < 2 || !text) return null;
  if (text.lengths) {
    const lengths = products.map(lengthOf).filter((n): n is number => n !== null);
    if (lengths.length) {
      const min = Math.min(...lengths);
      const max = Math.max(...lengths);
      return {en: `${min} m – ${max} m`, ar: `${min} م – ${max} م`};
    }
  }
  return text.range ?? null;
}

export const productGroups: ProductGroup[] = (() => {
  const byKey = new Map<string, Product[]>();
  for (const product of catalog) {
    const family = product.family ?? product.slug;
    const key = lineOfFamily[family] ?? family;
    const list = byKey.get(key);
    if (list) list.push(product);
    else byKey.set(key, [product]);
  }

  return [...byKey.entries()].map(([key, products]) => {
    const [lead] = products;
    const text = lineText[key];
    return {
      key,
      category: lead.category,
      lead,
      cover: coverOverride[key] ?? lead.images[0],
      representativeImage: products.some((product) => product.representativeImage),
      products,
      title: products.length > 1 && text ? text.title : lead.name,
      range: rangeFor(text, products)
    };
  });
})();

export function groupOf(product: Product) {
  const family = product.family ?? product.slug;
  const key = lineOfFamily[family] ?? family;
  return productGroups.find((group) => group.key === key);
}

export function groupsInCategory(category: ProductCategory) {
  return productGroups.filter((group) => group.category === category);
}

/** Part numbers in the same product line, in catalogue order. */
export function siblingsOf(product: Product) {
  return groupOf(product)?.products ?? [product];
}

/**
 * Other product lines to suggest on a detail page: the same category first,
 * then the rest, one card per line so no photograph repeats.
 */
export function relatedGroups(product: Product, limit = 4) {
  const own = groupOf(product)?.key;
  const others = productGroups.filter((group) => group.key !== own);
  const sameCategory = others.filter((group) => group.category === product.category);
  const rest = others.filter((group) => group.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * Hands out product lines for a page that shows several, never the same line
 * twice, so a photograph appears only once on it. Lines already used elsewhere
 * on the page go in `taken`, which is updated with what this call picks.
 */
export function pickLines(
  category: ProductCategory,
  prefer: string[],
  count: number,
  taken: Set<string> = new Set()
) {
  const pool = groupsInCategory(category).filter((group) => !taken.has(group.key));
  const preferred = prefer
    .map((key) => pool.find((group) => group.key === key))
    .filter((group): group is ProductGroup => Boolean(group));

  const picked: ProductGroup[] = [];
  for (const group of [...preferred, ...pool]) {
    if (picked.length >= count) break;
    if (picked.includes(group)) continue;
    picked.push(group);
    taken.add(group.key);
  }
  return picked;
}
