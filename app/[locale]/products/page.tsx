import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import CatalogBrowser from '@/components/CatalogBrowser';
import {catalog, isCategory, type Locale} from '@/lib/catalog';
import {alternatesFor} from '@/lib/site';

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{category?: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('nav.products'),
    description: t('catalog.description'),
    alternates: alternatesFor(locale, '/products')
  };
}

export default async function ProductsPage({params, searchParams}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const {category} = await searchParams;
  const t = await getTranslations({locale});

  return (
    <div>
      <div className="catalog-intro">
        <div>
          <p className="eyebrow">{t('catalog.eyebrow')}</p>
          <h1>{t('nav.products')}</h1>
        </div>
        <div>
          <p>{t('catalog.description')}</p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px'}}>
            <Link href={`/${locale}/datasheets`} className="text-link">
              {t('datasheet.indexTitle')} ↗
            </Link>
            <Link href={`/${locale}/datasheets#master-sheet`} className="text-link">
              {t('masterSheet.title')} ↗
            </Link>
          </div>
        </div>
      </div>

      <CatalogBrowser
        products={catalog}
        locale={locale as Locale}
        initialCategory={isCategory(category) ? category : undefined}
        labels={{
          all: t('catalog.all'),
          search: t('catalog.searchPlaceholder'),
          view: t('catalog.view'),
          results: t('catalog.items'),
          emptyTitle: t('catalog.emptyTitle'),
          emptyBody: t('catalog.emptyBody'),
          categories: {
            copper: t('categories.copper'),
            fiber: t('categories.fiber'),
            accessories: t('categories.accessories')
          }
        }}
      />
    </div>
  );
}
