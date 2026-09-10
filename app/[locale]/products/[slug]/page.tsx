import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import {catalog, getProduct, relatedProducts, type Locale} from '@/lib/catalog';
import {alternatesFor, contact, mailto} from '@/lib/site';
import {locales} from '@/i18n';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

/**
 * The catalogue is fixed at build time, so a slug that was not generated is a
 * real 404 rather than a page to render on demand. Without this, an unknown
 * slug renders the not-found page with a 200 status — a soft 404, which search
 * engines may index.
 */
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
      // A dedicated 1200x630 JPEG: link previews on WhatsApp and LinkedIn do
      // not reliably render the WebP used on the page itself.
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
  const related = relatedProducts(product);

  // Structured data so the part shows up correctly in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[language],
    description: product.summary[language],
    sku: product.partNumber,
    mpn: product.partNumber,
    brand: {'@type': 'Brand', name: 'LOGX NETWORK'},
    image: product.images
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

      <div className="detail-grid">
        <ProductGallery
          images={product.images}
          alt={product.name[language]}
          thumbLabel={t('productDetail.viewPhoto')}
        />

        <div className="detail-copy">
          <p className="eyebrow product-code">{product.partNumber}</p>
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

      {related.length ? (
        <section className="section-block">
          <div className="section-heading">
            <h2>{t('productDetail.related')}</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard
                key={item.slug}
                product={item}
                locale={language}
                viewLabel={t('catalog.view')}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
