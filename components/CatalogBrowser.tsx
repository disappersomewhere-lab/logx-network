'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import LineCard from '@/components/LineCard';
import ProductCard from '@/components/ProductCard';
import {categories, type Locale, type Product, type ProductCategory} from '@/lib/catalog';
import {productGroups} from '@/lib/groups';

type CatalogBrowserProps = {
  products: Product[];
  locale: Locale;
  initialCategory?: ProductCategory;
  initialQuery?: string;
  labels: {
    all: string;
    search: string;
    view: string;
    results: string;
    emptyTitle: string;
    emptyBody: string;
    categories: Record<ProductCategory, string>;
  };
};

type View = 'lines' | 'parts';

function normalise(value: string) {
  return value
    .toLowerCase()
    // Fold Arabic diacritics and alef variants so "الياف" finds "ألياف".
    .replace(/[ً-ْٰ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي');
}

export default function CatalogBrowser({
  products,
  locale,
  initialCategory,
  initialQuery = '',
  labels
}: CatalogBrowserProps) {
  const t = useTranslations('catalog');
  const [category, setCategory] = useState<ProductCategory | undefined>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [view, setView] = useState<View>('lines');

  // Precompute one searchable string per product so typing stays cheap.
  const haystacks = useMemo(
    () =>
      new Map(
        products.map((product) => [
          product.slug,
          normalise(
            [
              product.partNumber,
              product.name.en,
              product.name.ar,
              product.summary.en,
              product.summary.ar,
              product.raw
            ].join(' ')
          )
        ])
      ),
    [products]
  );

  const visible = useMemo(() => {
    const needle = normalise(query.trim());
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (!needle) return true;
      return needle.split(/\s+/).every((word) => haystacks.get(product.slug)?.includes(word));
    });
  }, [products, category, query, haystacks]);

  const visibleSlugs = useMemo(() => new Set(visible.map((product) => product.slug)), [visible]);

  function choose(next?: ProductCategory) {
    setCategory(next);
    // Keep the address bar shareable without a navigation round-trip.
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('category', next);
    else url.searchParams.delete('category');
    window.history.replaceState(null, '', url);
  }

  function updateQuery(next: string) {
    setQuery(next);
    const url = new URL(window.location.href);
    if (next.trim()) url.searchParams.set('q', next);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }

  const groups = category ? [category] : categories;

  // Product lines with at least one matching part, and which parts matched.
  const lines = useMemo(
    () =>
      productGroups
        .map((group) => ({group, matches: group.products.filter((p) => visibleSlugs.has(p.slug))}))
        .filter((entry) => entry.matches.length > 0),
    [visibleSlugs]
  );

  const countFor = (group: ProductCategory) =>
    view === 'lines'
      ? lines.filter((entry) => entry.group.category === group).length
      : visible.filter((product) => product.category === group).length;

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label={labels.all}>
          <button type="button" aria-pressed={!category} onClick={() => choose(undefined)}>
            {labels.all}
          </button>
          {categories.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={category === option}
              onClick={() => choose(option)}
            >
              {labels.categories[option]}
            </button>
          ))}
        </div>

        <div className="catalog-search">
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
          />
        </div>

        <div className="catalog-view" role="group" aria-label={t('display')}>
          <button type="button" aria-pressed={view === 'lines'} onClick={() => setView('lines')}>
            {t('byLine')}
          </button>
          <button type="button" aria-pressed={view === 'parts'} onClick={() => setView('parts')}>
            {t('byPart')}
          </button>
        </div>

        <p className="catalog-count" role="status" aria-live="polite">
          {view === 'lines'
            ? `${lines.length} ${labels.results} · ${t('lineParts', {count: visible.length})}`
            : `${visible.length} ${labels.results}`}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="catalog-empty">
          <strong>{labels.emptyTitle}</strong>
          <p>{labels.emptyBody}</p>
        </div>
      ) : (
        groups.map((group, groupIndex) => {
          const total = countFor(group);
          if (!total) return null;

          return (
            <section className="catalog-group" key={group}>
              <div className="group-heading">
                <h2>{labels.categories[group]}</h2>
                <span>
                  {String(total).padStart(2, '0')} {labels.results}
                </span>
              </div>
              <div className="product-grid">
                {view === 'lines'
                  ? lines
                      .filter((entry) => entry.group.category === group)
                      .map(({group: line, matches}, index) => {
                        const [lead] = matches;
                        const several = line.products.length > 1;
                        return (
                          <LineCard
                            key={line.key}
                            href={`/${locale}/products/${lead.slug}`}
                            image={line.cover}
                            representativeImage={line.representativeImage}
                            representativeImageLabel={t('representativeImage')}
                            title={line.title[locale]}
                            code={several ? undefined : lead.partNumber}
                            range={several ? line.range?.[locale] : null}
                            parts={
                              several
                                ? matches.length === line.products.length
                                  ? t('lineParts', {count: matches.length})
                                  : t('lineMatches', {count: matches.length})
                                : null
                            }
                            cta={several ? t('viewLine') : labels.view}
                            preload={groupIndex === 0 && index < 4}
                          />
                        );
                      })
                  : visible
                      .filter((product) => product.category === group)
                      .map((product, index) => (
                        <ProductCard
                          key={product.slug}
                          product={product}
                          locale={locale}
                          viewLabel={labels.view}
                          preload={groupIndex === 0 && index < 4}
                        />
                      ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
