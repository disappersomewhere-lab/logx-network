import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';

type CategoryItem = {
  id: 'fiber' | 'copper' | 'accessories';
  title: string;
  tag: string;
  desc: string;
  image: string;
  count: number;
  ringColor: string;
  highlights: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  categories: CategoryItem[];
  locale: string;
  viewAllLabel?: string;
  pageNumber?: string;
};

/**
 * Recreates the circular vignette category showcase from Page 6 & 7 of the PDF:
 * High-definition circular product photos framed with themed color rings,
 * crisp explanatory text, and immediate category exploration.
 */
export default function CategoryVignettes({
  eyebrow,
  title,
  subtitle,
  categories,
  locale,
  pageNumber
}: Props) {
  const isAr = locale === 'ar';

  return (
    <section className="category-vignettes-section">
      <div className="section-heading-centered">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {subtitle && <p className="section-subtitle-max">{subtitle}</p>}
      </div>

      <div className="vignettes-grid">
        {categories.map((cat) => (
          <div className="vignette-card" key={cat.id}>
            <div className="vignette-circle-wrapper">
              <div
                className="vignette-circle"
                style={{ borderColor: cat.ringColor }}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 220px, 260px"
                  className="vignette-img"
                />
              </div>
              <span
                className="vignette-tag-pill"
                style={{ backgroundColor: cat.ringColor }}
              >
                {cat.tag}
              </span>
            </div>

            <div className="vignette-body">
              <h3 className="vignette-title">{cat.title}</h3>
              <p className="vignette-desc">{cat.desc}</p>

              <div className="vignette-highlights">
                {cat.highlights.map((h, i) => (
                  <span className="vignette-chip" key={i}>
                    {h}
                  </span>
                ))}
              </div>

              <div className="vignette-action">
                <Link
                  href={`/${locale}/products?category=${cat.id}`}
                  className="vignette-link button button-quiet button-sm"
                >
                  {isAr ? `تصفح منتجات ${cat.title}` : `Browse ${cat.title}`}
                  <span className="arrow" aria-hidden="true">
                    {isAr ? '←' : '→'}
                  </span>
                </Link>
                <span className="vignette-count">
                  {cat.count} {isAr ? 'منتج معتمد' : 'products'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageNumber && (
        <div className="mc-editorial-footer" aria-hidden="true" style={{ marginTop: 56 }}>
          <Logo size="0.95rem" />
          <span className="mc-footer-line" />
          <span className="mc-page-number">{pageNumber}</span>
        </div>
      )}
    </section>
  );
}
