import type {Localized, ProductCategory} from '@/lib/catalog';

/**
 * Shortcuts shown in the Products mega menu. Each one opens the catalogue
 * filtered to its category and pre-filled with a search term, so the menu
 * reaches product lines without the catalogue needing a second filter axis.
 * The term is written per language because the search box shows it.
 */
export type MegaLink = {label: Localized; query: Localized};

export const megaLinks: Record<ProductCategory, MegaLink[]> = {
  fiber: [
    {label: {en: 'Fiber patch cords', ar: 'وصلات الألياف'}, query: {en: 'patch cord', ar: 'وصلة'}},
    {label: {en: 'Pigtails', ar: 'ضفائر الألياف'}, query: {en: 'pigtail', ar: 'ضفيرة'}},
    {
      label: {en: 'Fiber patch panels', ar: 'لوحات توصيل الألياف'},
      query: {en: 'patch panel', ar: 'لوحة توصيل'}
    },
    {label: {en: 'Drop cables', ar: 'كابلات الألياف التفريعية'}, query: {en: 'drop cable', ar: 'تفريعي'}},
    {label: {en: 'Terminal boxes', ar: 'صناديق الإنهاء'}, query: {en: 'terminal box', ar: 'صندوق إنهاء'}}
  ],
  copper: [
    {label: {en: 'LAN cable boxes', ar: 'صناديق كابلات الشبكة'}, query: {en: 'lan cable', ar: 'كابل شبكة'}},
    {label: {en: 'CAT6 / CAT6A patch cords', ar: 'وصلات CAT6 / CAT6A'}, query: {en: 'patch cord', ar: 'وصلة تصحيح'}}
  ],
  accessories: [
    {label: {en: 'Keystone jacks', ar: 'وحدات Keystone'}, query: {en: 'keystone jack', ar: 'وحدة Keystone'}},
    {label: {en: 'Patch panels', ar: 'لوحات التوصيل'}, query: {en: 'keystone patch panel', ar: 'لوحة توصيل Keystone'}},
    {label: {en: 'Faceplates', ar: 'وجهات التركيب'}, query: {en: 'faceplate', ar: 'وجهة تركيب'}},
    {label: {en: 'Cable managers', ar: 'منظمات الكابلات'}, query: {en: 'cable manager', ar: 'منظم كابلات'}},
    {label: {en: 'Media converters', ar: 'محولات الوسائط'}, query: {en: 'media converter', ar: 'محول وسائط'}}
  ]
};

/** Catalogue address for a mega-menu shortcut. */
export function megaHref(locale: 'en' | 'ar', category: ProductCategory, link: MegaLink) {
  const params = new URLSearchParams({category, q: link.query[locale]});
  return `/${locale}/products?${params.toString()}`;
}
