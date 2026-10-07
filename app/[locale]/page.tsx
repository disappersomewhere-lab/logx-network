import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import HeroCarousel, {type HeroSlide} from '@/components/HeroCarousel';
import SystemsTabs, {type SystemTab} from '@/components/SystemsTabs';
import InteractiveWorldMap from '@/components/InteractiveWorldMap';
import {contact, mailto, offices} from '@/lib/site';
import {catalog, categories, countByCategory, type Locale, type ProductCategory} from '@/lib/catalog';
import {pickLines, productGroups} from '@/lib/groups';

/**
 * Photography for the home page, each used once on it.
 *
 * Scenes come from the LOGX catalogue artwork in /public/profile; the product
 * shot is a real LOGX part. Product lines shown in the systems module are
 * dealt out by `pickLines` against `taken`, so a line used in the hero is never
 * repeated further down.
 */
const SCENES = {
  fiber: '/profile/fiber-lights.webp',
  network: '/profile/city-network.webp'
} as const;

const SYSTEM_SCENES: Record<ProductCategory, string> = {
  fiber: '/profile/category-fiber.webp',
  copper: '/profile/category-copper.webp',
  // A real LOGX product shot (the installation tool kit), not stock artwork.
  accessories: '/products/photos/tools-bag-01.webp'
};

/** Product shots sit on their own backdrop; stock scenes fill the frame. */
const SYSTEM_SCENE_FIT: Record<ProductCategory, 'cover' | 'contain'> = {
  fiber: 'cover',
  copper: 'cover',
  accessories: 'contain'
};

/** Product lines to show first in each system, best-photographed first. */
const SYSTEM_LINES: Record<ProductCategory, string[]> = {
  fiber: ['fiber-cord-om3', 'fiber-cord-sm', 'pigtail-sm', 'drop-fiber'],
  copper: ['cat6-cable', 'patch-cord-cat6', 'patch-cord-cat6a'],
  accessories: ['patch-panel', 'cable-manager', 'keystone', 'faceplate']
};

const HERO_PRODUCT = {
  /** Fiber panel, drawer open: the strongest frame in the shoot. */
  src: '/products/photos/fiber-panel-24-01.webp',
  line: 'fiber-panel',
  code: 'LXFPRDLC24'
} as const;

const PILLAR_ICONS = {
  reliable: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  performance: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  eco: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  )
} as const;

const STANDARDS = ['ANSI/TIA-568.2-D', 'ISO/IEC 11801', 'IEEE 802.3', 'RoHS & REACH', 'ISO 9001'];

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isAr = locale === 'ar';
  const language = locale as Locale;

  // Product lines already on the page; the systems module picks around them.
  const taken = new Set<string>([HERO_PRODUCT.line, 'tools-bag']);
  const heroPart = catalog.find((product) => product.partNumber === HERO_PRODUCT.code);

  const slides: HeroSlide[] = [
    {
      id: 'fiber',
      tone: 'fiber',
      image: SCENES.fiber,
      eyebrow: t('hero.eyebrow'),
      title: t('hero.title'),
      text: t('hero.subtitle'),
      primary: {href: `/${locale}/products`, label: t('hero.cta')},
      secondary: {href: `/${locale}#why-choose`, label: t('hero.secondary')}
    },
    {
      id: 'network',
      tone: 'network',
      image: SCENES.network,
      eyebrow: t('globalFootprint.eyebrow'),
      title: t('globalFootprint.title'),
      text: t('home.slides.network.text'),
      primary: {href: `/${locale}/contact`, label: t('contact.cta')},
      secondary: {href: `/${locale}/about`, label: t('nav.about')}
    },
    {
      id: 'rack',
      tone: 'rack',
      eyebrow: t('home.slides.rack.eyebrow'),
      title: t('home.slides.rack.title'),
      text: t('home.slides.rack.text'),
      primary: {href: `/${locale}/products?category=accessories`, label: t('home.slides.rack.cta')},
      secondary: {href: `/${locale}/datasheets`, label: t('datasheet.index')},
      product: heroPart
        ? {
            src: HERO_PRODUCT.src,
            alt: heroPart.name[language],
            caption: `${heroPart.partNumber} · ${heroPart.name.en}`
          }
        : undefined
    }
  ];

  const tabs: SystemTab[] = categories.map((category) => {
    const lines = pickLines(category, SYSTEM_LINES[category], 4, taken);
    const label = t(`categories.${category}`);
    return {
      id: category,
      label,
      tag: t(`catalogueCategories.${category}.tag`),
      description: t(`catalogueCategories.${category}.desc`),
      image: SYSTEM_SCENES[category],
      imageFit: SYSTEM_SCENE_FIT[category],
      highlights: t.raw(`home.systems.highlights.${category}`) as string[],
      count: t('home.systems.parts', {count: countByCategory(category)}),
      browse: {
        href: `/${locale}/products?category=${category}`,
        label: t('home.systems.browse', {system: label})
      },
      lines: lines.map((group) => ({
        href: `/${locale}/products/${group.lead.slug}`,
        image: group.cover,
        title: group.title[language],
        code: group.products.length === 1 ? group.lead.partNumber : undefined,
        range: group.range?.[language],
        parts: group.products.length > 1 ? t('catalog.lineParts', {count: group.products.length}) : null,
        cta: group.products.length > 1 ? t('catalog.viewLine') : t('catalog.view')
      }))
    };
  });

  const masterCategories = Object.keys(t.raw('masterSheet.categories') as object).length;

  const mapHubs = [
    {
      id: 'uk' as const,
      city: isAr ? 'لندن، المملكة المتحدة' : 'London, United Kingdom',
      country: 'UK',
      name: 'LOGX NETWORKS LTD',
      roleBadge: isAr ? 'المقر الرئيسي (HQ)' : 'HQ',
      isMain: false,
      coords: {x: 47, y: 20},
      email: 'hello@logxn.co.uk',
      address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
      directionsUrl:
        'https://maps.google.com/?q=71-75+Shelton+Street,+Covent+Garden,+London,+WC2H+9JQ,+United+Kingdom'
    },
    {
      id: 'sa' as const,
      city: isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      country: 'SA',
      name: isAr ? 'شركة بحر الشبكات (Networks Sea Co.)' : 'Networks Sea Co.',
      roleBadge: isAr ? 'الموزع الرئيسي المعتمد' : 'Main Distributor',
      isMain: true,
      coords: {x: 61, y: 44},
      phones: ['+966 11 217 0269', '+966 53 990 9932'],
      email: 'sales@nsea.com.sa',
      address: isAr
        ? 'طريق الأمير محمد بن عبد العزيز، حي العليا، الرياض 12214'
        : 'Prince Muhammad Ibn Abd Al Aziz Rd, Olaya District, Riyadh 12214',
      directionsUrl: 'https://maps.google.com/?q=Olaya+District,+Riyadh,+Saudi+Arabia'
    }
  ];

  const stats = [
    {value: String(catalog.length), suffix: '', label: t('home.stats.parts')},
    {value: String(productGroups.length), suffix: '', label: t('home.stats.lines')},
    {value: '100', suffix: '%', label: t('home.stats.tested')},
    {value: String(offices.length), suffix: '', label: t('home.stats.offices')}
  ];

  const resourceArrow = (
    <span className="cx-arrow" aria-hidden="true">
      →
    </span>
  );

  return (
    <>
      {/* ----------------------------------------------------- Story hero */}
      <HeroCarousel
        slides={slides}
        labels={{
          region: t('home.carousel.label'),
          prev: t('home.carousel.prev'),
          next: t('home.carousel.next'),
          pause: t('home.carousel.pause'),
          play: t('home.carousel.play'),
          goTo: t('home.carousel.goTo', {n: '{n}'})
        }}
      />

      {/* ------------------------------------------- Statement + numbers */}
      <section className="cx-statement" aria-labelledby="statement-eyebrow">
        <div>
          <p className="eyebrow" id="statement-eyebrow">
            {t('home.statement.eyebrow')}
          </p>
          <p className="cx-statement-text">{t('missionCommitment.mission.text')}</p>
          <Link href={`/${locale}/about`} className="text-link">
            {t('home.statement.link')} ↗
          </Link>

          <div className="cx-chips" aria-label={t('home.standards.eyebrow')}>
            <span className="cx-chips-label">{t('home.standards.eyebrow')}</span>
            {STANDARDS.map((standard) => (
              <span className="cx-chip" key={standard} dir="ltr">
                {standard}
              </span>
            ))}
          </div>
        </div>

        <div className="cx-stats">
          {stats.map((stat) => (
            <div className="cx-stat" key={stat.label}>
              <strong>
                {stat.value}
                {stat.suffix ? <em>{stat.suffix}</em> : null}
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="cx-pillars">
        {(['reliable', 'performance', 'eco'] as const).map((key) => (
          <div className="cx-pillar" key={key}>
            <div className="cx-pillar-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {PILLAR_ICONS[key]}
              </svg>
            </div>
            <div>
              <strong>{t(`slogan.pillars.${key}.title`)}</strong>
              <p>{t(`slogan.pillars.${key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------- Product systems */}
      <section className="cx-section" aria-labelledby="systems-title">
        <div className="cx-section-head">
          <div>
            <p className="eyebrow">{t('home.featured.eyebrow')}</p>
            <h2 id="systems-title">{t('home.featured.title')}</h2>
          </div>
          <Link href={`/${locale}/products`} className="text-link">
            {t('catalog.link')}
          </Link>
        </div>
        <SystemsTabs tabs={tabs} />
      </section>

      {/* ------------------------------------------------ Why LOGX */}
      <section className="section-block why-logx-section" id="why-choose">
        <div style={{position: 'relative', zIndex: 1}}>
          <div className="why-logx-header">
            <div className="why-logx-title-block">
              <p className="eyebrow">{t('whyLogx.eyebrow')}</p>
              <h2>{t('whyLogx.title')}</h2>
              <p className="why-logx-subtitle">{t('whyLogx.subtitle')}</p>
            </div>
          </div>

          <div className="why-logx-grid">
            {(['quality', 'durability', 'warranty', 'availability'] as const).map((key) => (
              <div className="why-card" key={key}>
                <div className="why-card-top">
                  <span className="why-tag">{t(`whyLogx.items.${key}.tag`)}</span>
                  <span className="why-brand-dot" aria-hidden="true" />
                </div>
                <h3>{t(`whyLogx.items.${key}.title`)}</h3>
                <p>{t(`whyLogx.items.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Resources */}
      <section className="cx-section" aria-labelledby="library-title">
        <div className="cx-section-head">
          <div>
            <p className="eyebrow">{t('home.library.eyebrow')}</p>
            <h2 id="library-title">{t('home.library.title')}</h2>
          </div>
        </div>

        <div className="cx-library">
          <Link href={`/${locale}/datasheets#master-sheet`} className="cx-resource cx-resource-feature">
            <span className="cx-resource-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </span>
            <span className="cx-resource-tag">{t('home.library.master.tag')}</span>
            <h3>{t('home.library.master.title')}</h3>
            <p>
              {t('home.library.master.text', {categories: masterCategories, parts: catalog.length})}
            </p>
            <span className="cx-resource-cta">
              {t('home.library.master.cta')}
              {resourceArrow}
            </span>
          </Link>

          <Link href={`/${locale}/company-profile`} className="cx-resource">
            <span className="cx-resource-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </span>
            <span className="cx-resource-tag">{t('home.library.profile.tag')}</span>
            <h3>{t('home.library.profile.title')}</h3>
            <p>{t('home.library.profile.text')}</p>
            <span className="cx-resource-cta">
              {t('home.library.profile.cta')}
              {resourceArrow}
            </span>
          </Link>

          <Link href={`/${locale}/datasheets`} className="cx-resource">
            <span className="cx-resource-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8" />
              </svg>
            </span>
            <span className="cx-resource-tag">{t('home.library.sheets.tag')}</span>
            <h3>{t('home.library.sheets.title')}</h3>
            <p>{t('home.library.sheets.text')}</p>
            <span className="cx-resource-cta">
              {t('home.library.sheets.cta')}
              {resourceArrow}
            </span>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------ Where we are */}
      <InteractiveWorldMap
        eyebrow={t('globalFootprint.eyebrow')}
        title={t('globalFootprint.title')}
        subtitle={t('home.slides.network.text')}
        locale={locale}
        hubs={mapHubs}
      />

      {/* ------------------------------------------------ Contact */}
      <section className="contact-cta">
        <div>
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
          <p className="contact-cta-lede">
            {isAr
              ? 'تواصل مباشرة مع فريق المبيعات والمهندسين لطلب عروض الأسعار والتوريد الفوري وشهادات المطابقة.'
              : 'Connect directly with our engineering and sales teams for quotes, immediate stock, and compliance certificates.'}
          </p>
          <div className="contact-cta-lines">
            <a href="tel:+966112170269" dir="ltr">
              +966 11 217 0269
            </a>
            <a href={mailto()}>{contact.email}</a>
          </div>
        </div>
        <div>
          <Link href={`/${locale}/contact`} className="button button-primary">
            {t('contact.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
