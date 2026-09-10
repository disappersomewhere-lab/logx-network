import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import ProductCard from '@/components/ProductCard';
import {catalog, categories, countByCategory, featuredProducts, type Locale} from '@/lib/catalog';

// Editorial picks: the shots that best represent each part of the range.
const HERO_SHOTS = [
  '/products/photos/fiber-panel-24-01.webp',
  '/products/photos/keystone-cat6a-01.webp',
  '/products/photos/cat6-cable-01.webp'
];

const CATEGORY_SHOTS = {
  copper: '/products/photos/patch-cord-cat6-long-01.webp',
  fiber: '/products/photos/fiber-cord-om3-01.webp',
  accessories: '/products/photos/patch-panel-24-01.webp'
} as const;

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const featured = featuredProducts(8);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <div className="action-row">
            <Link href={`/${locale}/products`} className="button button-primary">
              {t('hero.cta')}
            </Link>
            <Link href={`/${locale}/contact`} className="button button-quiet">
              {t('contact.cta')}
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{catalog.length}</strong>
              <span>{t('home.stats.parts')}</span>
            </div>
            <div>
              <strong>{categories.length}</strong>
              <span>{t('home.stats.families')}</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>{t('home.stats.tested')}</span>
            </div>
          </div>
        </div>

        <div className="hero-collage">
          {HERO_SHOTS.map((src, index) => (
            <figure key={src}>
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                priority={index === 0}
              />
            </figure>
          ))}
          <div className="hero-note">
            <Logo size="1.4rem" />
            <p>
              <strong>CAT6 · CAT6A · OS2 · OM3</strong>
              {t('proof.standards')}
            </p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('catalog.eyebrow')}</p>
            <h2>{t('catalog.title')}</h2>
          </div>
          <Link href={`/${locale}/products`} className="text-link">
            {t('catalog.link')}
          </Link>
        </div>

        <div className="category-strip">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/${locale}/products?category=${category}`}
              className="category-tile"
            >
              <div className="category-tile-image">
                <Image
                  src={CATEGORY_SHOTS[category]}
                  alt=""
                  fill
                  sizes="(max-width: 860px) 92vw, 400px"
                />
              </div>
              <div className="category-tile-body">
                <strong>{t(`categories.${category}`)}</strong>
                <span>
                  {countByCategory(category)} {t('catalog.items')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('home.featured.eyebrow')}</p>
            <h2>{t('home.featured.title')}</h2>
          </div>
          <Link href={`/${locale}/products`} className="text-link">
            {t('catalog.link')}
          </Link>
        </div>

        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale as Locale}
              viewLabel={t('catalog.view')}
            />
          ))}
        </div>
      </section>

      <section className="proof-band bleed">
        <div>
          <strong>100%</strong>
          <span>{t('proof.tested')}</span>
        </div>
        <div>
          <strong>{catalog.length}</strong>
          <span>{t('proof.range')}</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>{t('proof.support')}</span>
        </div>
      </section>

      <section className="contact-cta">
        <div>
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
        </div>
        <Link href={`/${locale}/contact`} className="button button-primary">
          {t('contact.cta')}
        </Link>
      </section>
    </>
  );
}
