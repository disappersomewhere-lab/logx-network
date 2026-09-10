import type {MetadataRoute} from 'next';
import {catalog} from '@/lib/catalog';
import {siteUrl} from '@/lib/site';
import {defaultLocale, locales} from '@/i18n';

const STATIC_PATHS = ['', '/products', '/about', '/contact', '/privacy', '/terms'];

// Each entry lists its translations so search engines pair the locales instead
// of treating them as competing duplicates.
function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = `${siteUrl}/${locale}${path}`;

  return {
    url: `${siteUrl}/${defaultLocale}${path}`,
    changeFrequency: 'monthly',
    priority,
    alternates: {languages}
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((path) => entry(path, path === '' ? 1 : 0.7)),
    ...catalog.map((product) => entry(`/products/${product.slug}`, 0.6))
  ];
}
