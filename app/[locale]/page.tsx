import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import ProductCard from '@/components/ProductCard';
import MasterDataSheetViewer from '@/components/MasterDataSheetViewer';
import MissionCommitment from '@/components/MissionCommitment';
import CategoryVignettes from '@/components/CategoryVignettes';
import InteractiveWorldMap from '@/components/InteractiveWorldMap';
import {contact, mailto} from '@/lib/site';
import {catalog, categories, countByCategory, featuredProducts, type Locale} from '@/lib/catalog';

// Editorial picks: the shots that best represent each part of the range.
const HERO_SHOTS = [
  '/products/photos/fiber-panel-24-01.webp',
  '/products/photos/keystone-cat6a-01.webp',
  '/products/photos/cat6-cable-01.webp'
];

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isAr = locale === 'ar';
  const featured = featuredProducts(8);

  const masterSheetLabels = {
    eyebrow: t('masterSheet.eyebrow'),
    title: t('masterSheet.title'),
    subtitle: t('masterSheet.subtitle'),
    badge: t('masterSheet.badge'),
    ctaInspect: t('masterSheet.ctaInspect'),
    ctaDownload: t('masterSheet.ctaDownload'),
    ctaWebp: t('masterSheet.ctaWebp'),
    inspectHint: t('masterSheet.inspectHint'),
    zoomIn: t('masterSheet.zoomIn'),
    zoomOut: t('masterSheet.zoomOut'),
    resetZoom: t('masterSheet.resetZoom'),
    close: t('masterSheet.close'),
    categoriesCount: t('masterSheet.categoriesCount'),
    partsCount: t('masterSheet.partsCount'),
    standards: t('masterSheet.standards'),
    dragHint: t('masterSheet.dragHint'),
    categoriesTitle: t('masterSheet.categoriesTitle'),
    browseCategory: t('masterSheet.browseCategory'),
    categories: {
      copperCables: t('masterSheet.categories.copperCables'),
      patchCordsCat6: t('masterSheet.categories.patchCordsCat6'),
      patchCordsCat6A: t('masterSheet.categories.patchCordsCat6A'),
      rackAccessories: t('masterSheet.categories.rackAccessories'),
      faceplatesKeystones: t('masterSheet.categories.faceplatesKeystones'),
      fiberPatchPanels: t('masterSheet.categories.fiberPatchPanels'),
      fiberOpticCables: t('masterSheet.categories.fiberOpticCables'),
      fiberCordsSM: t('masterSheet.categories.fiberCordsSM'),
      fiberCordsOM3: t('masterSheet.categories.fiberCordsOM3'),
      fiberPigtails: t('masterSheet.categories.fiberPigtails'),
      toolsEquipment: t('masterSheet.categories.toolsEquipment'),
      fiberTerminalBoxes: t('masterSheet.categories.fiberTerminalBoxes'),
      powerDistribution: t('masterSheet.categories.powerDistribution')
    }
  };

  const vignetteCategories = [
    {
      id: 'fiber' as const,
      title: t('catalogueCategories.fiber.title'),
      tag: t('catalogueCategories.fiber.tag'),
      desc: t('catalogueCategories.fiber.desc'),
      image: '/products/photos/fiber-cord-om3-01.webp',
      count: countByCategory('fiber'),
      ringColor: '#e31e24',
      highlights: ['OS2 Single-Mode', 'OM3 Multimode', 'LC-LC / SC-SC', 'Low Insertion Loss']
    },
    {
      id: 'copper' as const,
      title: t('catalogueCategories.copper.title'),
      tag: t('catalogueCategories.copper.tag'),
      desc: t('catalogueCategories.copper.desc'),
      image: '/products/photos/patch-cord-cat6-long-01.webp',
      count: countByCategory('copper'),
      ringColor: '#2563eb',
      highlights: ['CAT6 UTP', 'CAT6A 10G', '100% Fluke Tested', '305M Reels & Cords']
    },
    {
      id: 'accessories' as const,
      title: t('catalogueCategories.accessories.title'),
      tag: t('catalogueCategories.accessories.tag'),
      desc: t('catalogueCategories.accessories.desc'),
      image: '/products/photos/patch-panel-24-01.webp',
      count: countByCategory('accessories'),
      ringColor: '#059669',
      highlights: ['24/48-Port Panels', 'Keystone Jacks', 'Faceplates', 'Rack Cable Managers']
    }
  ];

  const mapHubs = [
    {
      id: 'uk' as const,
      city: isAr ? 'لندن، المملكة المتحدة' : 'London, United Kingdom',
      country: 'UK',
      name: 'LOGX NETWORKS LTD',
      roleBadge: isAr ? 'المقر الرئيسي (HQ)' : 'HQ',
      isMain: false,
      coords: { x: 47, y: 20 },
      email: 'hello@logxn.co.uk',
      address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ',
      directionsUrl: 'https://maps.google.com/?q=71-75+Shelton+Street,+Covent+Garden,+London,+WC2H+9JQ,+United+Kingdom'
    },
    {
      id: 'sa' as const,
      city: isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      country: 'SA',
      name: isAr ? 'شركة بحر الشبكات (Networks Sea Co.)' : 'Networks Sea Co.',
      roleBadge: isAr ? 'الموزع الرئيسي المعتمد' : 'Main Distributor',
      isMain: true,
      coords: { x: 61, y: 44 },
      phones: ['+966 11 217 0269', '+966 53 990 9932'],
      email: 'sales@nsea.com.sa',
      address: isAr ? 'طريق الأمير محمد بن عبد العزيز، حي العليا، الرياض 12214' : 'Prince Muhammad Ibn Abd Al Aziz Rd, Olaya District, Riyadh 12214',
      directionsUrl: 'https://maps.google.com/?q=Olaya+District,+Riyadh,+Saudi+Arabia'
    }
  ];

  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="hero">
        <div>
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <div className="action-row">
            <Link href={`/${locale}/products`} className="button button-primary">
              {t('hero.cta')}
            </Link>
            <a href="#why-choose" className="button button-quiet">
              {t('hero.secondary')}
            </a>
            <Link href={`/${locale}/company-profile`} className="button button-ghost">
              {t('companyProfile.nav')} ↗
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

          <div className="hero-brand-strip">
            <span className="hero-brand-strip-label">
              {isAr ? 'الأنظمة' : 'Systems'}
            </span>
            <div className="hero-brand-strip-tags">
              <span className="hero-brand-tag">CAT6 UTP</span>
              <span className="hero-brand-tag">CAT6A UTP</span>
              <span className="hero-brand-tag">OS2 Single-Mode</span>
              <span className="hero-brand-tag">OM3 Multimode</span>
              <span className="hero-brand-tag">Fiber Panels</span>
              <span className="hero-brand-tag">Rack PDU</span>
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
            <Logo size="1.4rem" tone="light" />
            <p>
              <strong>CAT6 · CAT6A · OS2 · OM3</strong>
              {t('proof.standards')}
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------- Brand Slogan & 3 Core Performance Pillars */}
      <section className="brand-pillars-strip bleed">
        <div className="brand-pillars-inner">
          <div className="brand-slogan-box">
            <span className="brand-slogan-tag">LOGX NETWORK</span>
            <h2 className="brand-slogan-title">{t('slogan.tagline')}</h2>
          </div>
          <div className="brand-pillars-grid">
            <div className="brand-pillar-card">
              <div className="pillar-icon-badge" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div className="pillar-card-text">
                <strong>{t('slogan.pillars.reliable.title')}</strong>
                <p>{t('slogan.pillars.reliable.desc')}</p>
              </div>
            </div>

            <div className="brand-pillar-card">
              <div className="pillar-icon-badge" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div className="pillar-card-text">
                <strong>{t('slogan.pillars.performance.title')}</strong>
                <p>{t('slogan.pillars.performance.desc')}</p>
              </div>
            </div>

            <div className="brand-pillar-card">
              <div className="pillar-icon-badge" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div className="pillar-card-text">
                <strong>{t('slogan.pillars.eco.title')}</strong>
                <p>{t('slogan.pillars.eco.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------- Mission & Commitment (Page 4) */}
      <MissionCommitment
        eyebrow={t('missionCommitment.eyebrow')}
        title={t('missionCommitment.title')}
        missionPill={t('missionCommitment.mission.pill')}
        missionText={t('missionCommitment.mission.text')}
        commitmentPill={t('missionCommitment.commitment.pill')}
        commitmentText={t('missionCommitment.commitment.text')}
        locale={locale}
      />

      {/* --------------------------------- Circular Category Vignettes (Page 6 & 7) */}
      <CategoryVignettes
        eyebrow={t('catalogueCategories.eyebrow')}
        title={t('catalogueCategories.title')}
        subtitle={t('catalogueCategories.subtitle')}
        categories={vignetteCategories}
        locale={locale}
      />

      {/* ----------------------------------------------- Featured Products Grid */}
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

      {/* ------------------------------------- Why Choose LOGX (Page 5) */}
      <section className="section-block why-logx-section" id="why-choose">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="why-logx-header">
            <div className="why-logx-title-block">
              <p className="eyebrow">{t('whyLogx.eyebrow')}</p>
              <h2>{t('whyLogx.title')}</h2>
              <p className="why-logx-subtitle">{t('whyLogx.subtitle')}</p>
            </div>
            <div className="why-logx-actions">
              <Link href={`/${locale}/company-profile`} className="button button-primary">
                {t('companyProfile.nav')} ↗
              </Link>
              <Link href={`/${locale}/products`} className="button button-quiet">
                {t('catalog.link')} ↗
              </Link>
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

      {/* --------------------------------- Master Data Sheet Architectural Viewer */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('masterSheet.homeSectionEyebrow')}</p>
            <h2>{t('masterSheet.homeSectionTitle')}</h2>
          </div>
          <Link href={`/${locale}/datasheets`} className="text-link">
            {t('masterSheet.exploreCatalog')}
          </Link>
        </div>

        <MasterDataSheetViewer labels={masterSheetLabels} locale={locale} />
      </section>

      {/* --------------------------------- Standards & Compliance Badges */}
      <div className="certifications-strip">
        <div className="certifications-strip-head">
          <h2>{isAr ? 'المعايير الدولية والمطابقة الهندسية' : 'Standards & Engineering Compliance'}</h2>
          <p className="eyebrow" style={{margin: 0}}>
            {isAr ? 'مُصمَّم ومعتمد وفق المعايير القياسية العالمية' : 'Engineered to rigorous international network standards'}
          </p>
        </div>
        <div className="cert-badges">
          {([
            {name: 'ANSI/TIA-568.2-D', desc: isAr ? 'الفئة 6 / 6A' : 'Category 6 / 6A'},
            {name: 'ISO/IEC 11801', desc: isAr ? 'تمديدات دولية' : 'International Cabling'},
            {name: 'IEEE 802.3', desc: isAr ? 'إيثرنت وPoE' : 'Ethernet & PoE'},
            {name: 'RoHS & REACH', desc: isAr ? 'امتثال المواد والبيئة' : 'Material Compliance'},
            {name: 'ISO 9001', desc: isAr ? 'جودة التصنيع المعتمدة' : 'Quality Management'},
          ] as const).map((cert) => (
            <div className="cert-badge" key={cert.name}>
              <div className="cert-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <div className="cert-badge-text">
                <strong>{cert.name}</strong>
                <span>{cert.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------- Interactive World Locations Map (Page 9) */}
      <InteractiveWorldMap
        eyebrow={t('globalFootprint.eyebrow')}
        title={t('globalFootprint.title')}
        subtitle={isAr ? 'شبكة متصلة تنطلق من لندن وتصل مباشرة إلى الرياض لدعم كبرى مشاريع البنية التحتية.' : 'A connected physical layer engineered in London, stocked centrally in Riyadh.'}
        locale={locale}
        hubs={mapHubs}
      />

      {/* --------------------------------- Contact CTA Card (Page 10) */}
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
            <a href="tel:+966112170269" dir="ltr">+966 11 217 0269</a>
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
