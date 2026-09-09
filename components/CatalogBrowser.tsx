'use client';

import {useMemo, useState} from 'react';
import ProductCard from '@/components/ProductCard';
import {categories, type Locale, type Product, type ProductCategory} from '@/lib/catalog';

type CatalogBrowserProps = {
  products: Product[];
  locale: Locale;
  initialCategory?: ProductCategory;
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
  labels
}: CatalogBrowserProps) {
  const [category, setCategory] = useState<ProductCategory | undefined>(initialCategory);
  const [query, setQuery] = useState('');

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

  function choose(next?: ProductCategory) {
    setCategory(next);
    // Keep the address bar shareable without a navigation round-trip.
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('category', next);
    else url.searchParams.delete('category');
    window.history.replaceState(null, '', url);
  }

  const groups = category ? [category] : categories;

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
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
          />
        </div>

        <p className="catalog-count" role="status" aria-live="polite">
          {visible.length} {labels.results}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="catalog-empty">
          <strong>{labels.emptyTitle}</strong>
          <p>{labels.emptyBody}</p>
        </div>
      ) : (
        groups.map((group) => {
          const inGroup = visible.filter((product) => product.category === group);
          if (!inGroup.length) return null;

          return (
            <section className="catalog-group" key={group}>
              <div className="group-heading">
                <h2>{labels.categories[group]}</h2>
                <span>
                  {String(inGroup.length).padStart(2, '0')} {labels.results}
                </span>
              </div>
              <div className="product-grid">
                {inGroup.map((product, index) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    locale={locale}
                    viewLabel={labels.view}
                    priority={index < 4}
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
