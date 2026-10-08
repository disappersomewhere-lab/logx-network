import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import LineCard from '@/components/LineCard';
import {catalog, getProduct, type Locale} from '@/lib/catalog';
import {relatedGroups, siblingsOf} from '@/lib/groups';
import {alternatesFor, contact, mailto} from '@/lib/site';
import {formatBytes} from '@/lib/format';
import {datasheetFor} from '@/lib/datasheets';
import {contentFor} from '@/lib/families';
import {locales} from '@/i18n';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    catalog.map((product) => ({locale, slug: product.slug}))
  );
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const language = locale as Locale;
  return {
    title: product.name[language],
    description: product.summary[language],
    alternates: alternatesFor(locale, `/products/${slug}`),
    openGraph: {
      title: product.name[language],
      description: product.summary[language],
      images: [{url: product.ogImage, width: 1200, height: 630, alt: product.name[language]}]
    }
  };
}

export default async function ProductPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations();
  const language = locale as Locale;
  const siblings = siblingsOf(product);
  const related = relatedGroups(product);
  const family = contentFor(product.partNumber);
  const hasSheet = Boolean(family);
  const pdf = datasheetFor(product.partNumber);

  // Structured data so the part shows up correctly in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[language],
    description: product.summary[language],
    sku: product.partNumber,
    mpn: product.partNumber,
    brand: {'@type': 'Brand', name: 'LOGX NETWORK'},
    ...(!product.representativeImage && product.images.length ? {image: product.images} : {}),
    ...(pdf
      ? {
          subjectOf: {
            '@type': 'DigitalDocument',
            name: `${product.partNumber} datasheet`,
            encodingFormat: 'application/pdf',
            url: pdf.url
          }
        }
      : {})
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      <Link href={`/${locale}/products`} className="back-link">
        <span className="arrow" aria-hidden="true">
          ←
        </span>
        {t('productDetail.back')}
      </Link>

      <div className={product.images.length ? 'detail-grid' : 'detail-grid detail-grid-solo'}>
        <ProductGallery
          images={product.images}
          alt={
            product.representativeImage
              ? t('catalog.representativeImage')
              : product.name[language]
          }
          thumbLabel={t('productDetail.viewPhoto')}
          representativeImage={product.representativeImage}
          representativeImageLabel={t('catalog.representativeImage')}
          representativeImageNote={t('productDetail.representativeImageNote')}
        />

        <div className="detail-copy">
          <div className="detail-header-meta">
            <span className="product-code">{product.partNumber}</span>
            <span className="brand-origin-badge">{t('productDetail.brandOrigin')}</span>
          </div>

          <h1>{product.name[language]}</h1>
          <p className="detail-summary">{product.summary[language]}</p>

          <div className="detail-tags">
            <span className="tag">{t(`categories.${product.category}`)}</span>
            {product.specs.slice(0, 2).map((spec) => (
              <span className="tag" key={spec.label.en}>
                {spec.value[language]}
              </span>
            ))}
          </div>

          <div className="spec-table">
            <table>
              <caption>{t('productDetail.specifications')}</caption>
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.label.en}>
                    <th scope="row">{spec.label[language]}</th>
                    <td>{spec.value[language]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Technical Documentation & Datasheet Box */}
          {(hasSheet || pdf) && (
            <div className="product-datasheet-card">
              <div className="pds-head">
                <div className="pds-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="pds-titles">
                  <h4>{t('productDetail.technicalDocumentation')}</h4>
                  <p>{t('productDetail.technicalDocDesc')}</p>
                </div>
                {pdf && (
                  <span className="pds-badge">
                    <span className="pdf-badge" aria-hidden="true">PDF</span>
                    <span>{formatBytes(pdf.bytes, language)}</span>
                  </span>
                )}
              </div>

              {family?.compliance && family.compliance.length > 0 && (
                <div className="pds-compliance">
                  <span className="pds-compliance-title">{t('productDetail.standardsCompliance')}:</span>
                  <div className="pds-tags">
                    {family.compliance.map((item) => (
                      <span className="pds-tag" key={item}>
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pds-actions">
                {pdf && (
                  <a href={pdf.url} className="button button-primary" download>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {t('productDetail.downloadDatasheet')}
                  </a>
                )}
                {hasSheet && (
                  <Link
                    href={`/${locale}/products/${product.slug}/datasheet`}
                    className="button button-quiet"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    {t('productDetail.viewInteractiveSheet')}
                  </Link>
                )}
              </div>
            </div>
          )}

          <dl className="detail-source">
            <dt>{t('productDetail.sourceLabel')}</dt>
            <dd>{product.raw}</dd>
          </dl>

          <div className="detail-actions">
            <Link
              href={`/${locale}/contact?product=${encodeURIComponent(product.partNumber)}`}
              className="button button-primary"
            >
              {t('productDetail.quote')}
            </Link>
            <a
              href={mailto(`${product.partNumber} — ${product.name.en}`)}
              className="button button-quiet"
            >
              {contact.email}
            </a>
          </div>
        </div>
      </div>

      {siblings.length > 1 ? (
        <section className="variants" aria-labelledby="variants-title">
          <h2 id="variants-title">{t('productDetail.variants')}</h2>
          <p>{t('productDetail.variantsHint')}</p>
          <ul className="variants-list">
            {siblings.map((item) =>
              item.slug === product.slug ? (
                <li key={item.slug}>
                  <span className="variants-current" aria-current="page">
                    <span className="variants-code">{item.partNumber}</span>
                    <span className="variants-name">{item.name[language]}</span>
                    <span className="variants-state">{t('productDetail.viewing')}</span>
                  </span>
                </li>
              ) : (
                <li key={item.slug}>
                  <Link href={`/${locale}/products/${item.slug}`}>
                    <span className="variants-code">{item.partNumber}</span>
                    <span className="variants-name">{item.name[language]}</span>
                    <span className="variants-state" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </section>
      ) : null}

      {related.length ? (
        <section className="section-block">
          <div className="section-heading">
            <h2>{t('productDetail.relatedLines')}</h2>
          </div>
          <div className="product-grid">
            {related.map((group) => {
              const several = group.products.length > 1;
              return (
                <LineCard
                  key={group.key}
                  href={`/${locale}/products/${group.lead.slug}`}
                  image={group.cover}
                  representativeImage={group.representativeImage}
                  representativeImageLabel={t('catalog.representativeImage')}
                  title={group.title[language]}
                  code={several ? undefined : group.lead.partNumber}
                  range={several ? group.range?.[language] : null}
                  parts={several ? t('catalog.lineParts', {count: group.products.length}) : null}
                  cta={several ? t('catalog.viewLine') : t('catalog.view')}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
