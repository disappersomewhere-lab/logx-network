import type {MetadataRoute} from 'next';
import {catalog} from '@/lib/catalog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/products', '/about', '/contact'];
  const localizedPages = ['en', 'ar'].flatMap((locale) => pages.map((page) => ({url: `${siteUrl}/${locale}${page}`, changeFrequency: 'monthly' as const, priority: page === '' ? 1 : .7})));
  const products = ['en', 'ar'].flatMap((locale) => catalog.map((product) => ({url: `${siteUrl}/${locale}/products/${product.slug}`, changeFrequency: 'monthly' as const, priority: .6})));
  return [...localizedPages, ...products];
}