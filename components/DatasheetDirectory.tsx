'use client';

import {useState, useMemo} from 'react';
import Link from 'next/link';

export type DatasheetItem = {
  partNumber: string;
  slug: string;
  name: string;
  category: 'copper' | 'fiber' | 'accessories';
  familyTitle: string;
  pdfUrl: string | null;
  pdfBytes: number | null;
  formattedSize: string | null;
  hasSheet: boolean;
};

type Props = {
  items: DatasheetItem[];
  locale: string;
  labels: {
    searchPlaceholder: string;
    allCategories: string;
    view: string;
    download: string;
    parts: string;
    noResults: string;
    categories: Record<string, string>;
  };
};

export default function DatasheetDirectory({items, locale, labels}: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.partNumber.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.familyTitle.toLowerCase().includes(q)
      );
    });
  }, [items, query, activeCategory]);

  // Group filtered items by family
  const grouped = useMemo(() => {
    const map = new Map<string, DatasheetItem[]>();
    for (const item of filtered) {
      const list = map.get(item.familyTitle) || [];
      list.push(item);
      map.set(item.familyTitle, list);
    }
    return Array.from(map.entries()).map(([familyTitle, products]) => ({
      familyTitle,
      products
    }));
  }, [filtered]);

  return (
    <div className="datasheet-directory">
      {/* Search and filter controls */}
      <div className="datasheet-controls">
        <div className="datasheet-search-box">
          <svg
            className="datasheet-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="datasheet-search-input"
            aria-label={labels.searchPlaceholder}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="datasheet-search-clear"
              aria-label="Clear search"
            >
              ×
            </button>
          ) : null}
        </div>

        <div className="datasheet-filter-tabs">
          <button
            type="button"
            className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            {labels.allCategories}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeCategory === 'copper' ? 'active' : ''}`}
            onClick={() => setActiveCategory('copper')}
          >
            {labels.categories.copper || 'Copper'}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeCategory === 'fiber' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fiber')}
          >
            {labels.categories.fiber || 'Fiber'}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeCategory === 'accessories' ? 'active' : ''}`}
            onClick={() => setActiveCategory('accessories')}
          >
            {labels.categories.accessories || 'Accessories'}
          </button>
        </div>
      </div>

      {/* Results summary count */}
      <div className="datasheet-count-bar">
        <span>
          <strong>{filtered.length}</strong> {labels.parts}
        </span>
        {query || activeCategory !== 'all' ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveCategory('all');
            }}
            className="datasheet-reset-btn"
          >
            {locale === 'ar' ? 'إعادة ضبط عوامل التصفية' : 'Reset filters'}
          </button>
        ) : null}
      </div>

      {/* Results listing */}
      {filtered.length === 0 ? (
        <div className="datasheet-empty">
          <p>{labels.noResults}</p>
        </div>
      ) : (
        grouped.map(({familyTitle, products}) => (
          <section className="catalog-group" key={familyTitle}>
            <div className="group-heading">
              <h2>{familyTitle}</h2>
              <span>
                {String(products.length).padStart(2, '0')} {labels.parts}
              </span>
            </div>

            <table className="ds-index">
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug}>
                    <td className="ds-index-part">
                      <span className="product-code">{product.partNumber}</span>
                    </td>
                    <td className="ds-index-name">
                      <Link href={`/${locale}/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </td>
                    <td className="ds-index-actions">
                      {product.hasSheet ? (
                        <Link
                          href={`/${locale}/products/${product.slug}/datasheet`}
                          className="text-link ds-action-view"
                        >
                          {labels.view}
                        </Link>
                      ) : null}
                      {product.pdfUrl ? (
                        <a
                          href={product.pdfUrl}
                          className="ds-index-pdf"
                          download
                          title={`${labels.download} ${product.partNumber}`}
                        >
                          <span className="pdf-badge" aria-hidden="true">
                            PDF
                          </span>
                          <span>{product.formattedSize}</span>
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </div>
  );
}
