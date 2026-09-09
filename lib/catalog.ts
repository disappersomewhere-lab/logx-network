import products from '@/data/products.json';

export const categories = ['copper', 'fiber', 'accessories'] as const;
export type ProductCategory = (typeof categories)[number];

export type Locale = 'en' | 'ar';
export type Localized = Record<Locale, string>;

export type Spec = {
  label: Localized;
  value: Localized;
};

export type Product = {
  slug: string;
  partNumber: string;
  category: ProductCategory;
  family: string | null;
  name: Localized;
  summary: Localized;
  specs: Spec[];
  images: string[];
  /** Verbatim description from the LOGX price list. */
  raw: string;
};

export const catalog = products as Product[];

export function isCategory(value: string | undefined): value is ProductCategory {
  return categories.includes(value as ProductCategory);
}

export function getProduct(slug: string) {
  return catalog.find((product) => product.slug === slug);
}

export function getProductsByCategory(category?: ProductCategory) {
  return category ? catalog.filter((product) => product.category === category) : catalog;
}

export function countByCategory(category: ProductCategory) {
  return catalog.filter((product) => product.category === category).length;
}

/**
 * One card per product family, dealt round-robin across the three categories so
 * the landing page shows the breadth of the range rather than eight lengths of
 * the same patch cord.
 */
export function featuredProducts(limit = 8) {
  const seen = new Set<string>();
  const byCategory = new Map<ProductCategory, Product[]>(
    categories.map((category) => [category, []])
  );

  for (const product of catalog) {
    const key = product.family ?? product.slug;
    if (seen.has(key)) continue;
    seen.add(key);
    byCategory.get(product.category)?.push(product);
  }

  const picked: Product[] = [];
  for (let round = 0; picked.length < limit; round++) {
    const before = picked.length;
    for (const category of categories) {
      const product = byCategory.get(category)?.[round];
      if (product && picked.length < limit) picked.push(product);
    }
    if (picked.length === before) break; // every category exhausted
  }

  return picked;
}

/** Same family first, then same category, so a detail page always has neighbours. */
export function relatedProducts(product: Product, limit = 4) {
  const others = catalog.filter((candidate) => candidate.slug !== product.slug);
  const sameFamily = product.family
    ? others.filter((candidate) => candidate.family === product.family)
    : [];
  const sameCategory = others.filter(
    (candidate) => candidate.category === product.category && !sameFamily.includes(candidate)
  );
  return [...sameFamily, ...sameCategory].slice(0, limit);
}
