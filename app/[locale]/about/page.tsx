import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ConstellationMesh from '@/components/ConstellationMesh';
import MissionCommitment from '@/components/MissionCommitment';
import BrandHallmarks from '@/components/BrandHallmarks';
import {alternatesFor, offices} from '@/lib/site';
import {catalog, categories} from '@/lib/catalog';

const SHOWCASE = [
  '/products/photos/fiber-panel-24-01.webp',
  '/products/photos/patch-panel-48-01.webp',
  '/products/photos/keystone-cat6-01.webp',
  '/products/photos/brand-packaging-01.webp'
];

const VALUES = [
  {
    key: 'quality',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    )
  },
  {
    key: 'range',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    key: 'contact',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
      </svg>
    )
  }
] as const;

const CERTIFICATIONS = [
  {id: 'ansi', name: 'ANSI/TIA-568.2-D', desc: 'Category 6 / 6A'},
  {id: 'iso', name: 'ISO/IEC 11801', desc: 'International Cabling'},
  {id: 'ieee', name: 'IEEE 802.3', desc: 'Ethernet & PoE'},
  {id: 'rohs', name: 'RoHS & REACH', desc: 'Material Compliance'},
  {id: 'ce', name: 'CE Certified', desc: 'European Conformity'},
  {id: 'iso9001', name: 'ISO 9001', desc: 'Quality Management'},
];

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('nav.about'),
    description: t('about.description'),
    alternates: alternatesFor(locale, '/about')
  };
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isAr = locale === 'ar';

  return (
    <div>
      {/* ------------------------------------------------ Enhanced Hero (Page 2 & 3) */}
      <div className="about-hero-enhanced" style={{ position: 'relative', overflow: 'hidden' }}>
        <ConstellationMesh opacity={0.4} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="about-hero-badge">
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--brand)',
              display: 'inline-block',
              flexShrink: 0
            }} />
            {isAr ? 'عن لوجكس شبكات · حيث يلتقي التميز بالابتكار' : 'About Us · Where Excellence Meets Innovation'}
          </span>
          <h1>{t('about.title')}</h1>
          <p>{t('about.description')}</p>

          <p style={{ marginTop: 18, color: 'var(--ink)', fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.7 }}>
            {isAr
              ? 'تجسد منتجات لوجكس شبكات أحدث ما توصلت إليه التكنولوجيا، مقدمةً مجموعة شاملة ومتنوعة من حلول التوصيل عالية المستوى لتلبية كافة احتياجات شبكات البيانات ونقل الإشارة الموثوق.'
              : 'Our products epitomize cutting-edge technology, offering a diverse array of top-tier products to fulfill all your data connection requirements, ensuring your data transmission is seamless, reliable, and always up to the mark.'}
          </p>

          <div className="action-row" style={{marginTop: 28}}>
            <Link href={`/${locale}/company-profile`} className="button button-primary">
              {t('companyProfile.nav')} ↗
            </Link>
            <Link href={`/${locale}/contact`} className="button button-quiet">
              {t('contact.cta')} ↗
            </Link>
          </div>
        </div>

        <div className="about-hero-stats" style={{ position: 'relative', zIndex: 1 }}>
          <div className="about-stat">
            <strong>{catalog.length}<em>+</em></strong>
            <span>{isAr ? 'منتج مُوثَّق' : 'Part Numbers'}</span>
          </div>
          <div className="about-stat">
            <strong>{categories.length}</strong>
            <span>{isAr ? 'أسرة منتجات' : 'Product Families'}</span>
          </div>
          <div className="about-stat">
            <strong>3</strong>
            <span>{isAr ? 'مكاتب دولية' : 'Global Offices'}</span>
          </div>
          <div className="about-stat">
            <strong>100<em>%</em></strong>
            <span>{isAr ? 'مُختبَر Fluke' : 'Fluke Tested'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Brand Hallmarks (Page 3 & 5) */}
      <BrandHallmarks locale={locale} />

      {/* ------------------------------------------------ Mission & Commitment (Page 4) */}
      <MissionCommitment
        eyebrow={t('missionCommitment.eyebrow')}
        title={t('missionCommitment.title')}
        missionPill={t('missionCommitment.mission.pill')}
        missionText={t('missionCommitment.mission.text')}
        commitmentPill={t('missionCommitment.commitment.pill')}
        commitmentText={t('missionCommitment.commitment.text')}
        pageNumber="01"
        locale={locale}
      />

      {/* ------------------------------------------------ Core Values */}
      <section style={{ marginTop: 64 }}>
        <p className="eyebrow">{isAr ? 'قيمنا الجوهرية' : 'Our Core Values'}</p>
        <h2 style={{fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', margin: '0 0 8px', maxWidth: '22ch'}}>
          {isAr ? 'مبادئ راسخة في كل منتج' : 'Principles behind every product'}
        </h2>
        <p style={{color: 'var(--ink-soft)', fontSize: '1.02rem', maxWidth: '60ch', margin: '0 0 32px'}}>
          {isAr
            ? 'نؤمن بأن البنية التحتية للشبكات تستحق نفس قدر الدقة والموثوقية التي توفرها الأجهزة التي تدعمها.'
            : 'We believe network infrastructure deserves the same level of precision and reliability as the devices it supports.'}
        </p>
        <div className="value-cards-grid">
          {VALUES.map(({key, icon}) => (
            <div className="value-card" key={key}>
              <div className="value-card-icon">{icon}</div>
              <h3>{t(`about.${key}Title`)}</h3>
              <p>{t(`about.${key}`)}</p>
              {key === 'contact' && (
                <Link href={`/${locale}/contact`} className="text-link" style={{marginTop: 4}}>
                  {t('contact.cta')} ↗
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Why Choose LOGX (Page 5) */}
      <section className="section-block why-logx-section" id="why-choose" style={{ marginTop: 64 }}>
        <div className="why-logx-header">
          <div className="why-logx-title-block">
            <p className="eyebrow">{t('whyLogx.eyebrow')}</p>
            <h2>{t('whyLogx.title')}</h2>
            <p className="why-logx-subtitle">{t('whyLogx.subtitle')}</p>
          </div>
          <div className="why-logx-actions">
            <Link href={`/${locale}/company-profile`} className="button button-quiet">
              {t('whyLogx.viewCatalogue')} ↗
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
      </section>

      {/* ------------------------------------------------ Product Gallery */}
      <div className="about-gallery" style={{marginTop: 64}}>
        {SHOWCASE.map((src) => (
          <figure key={src}>
            <Image src={src} alt="" fill sizes="(max-width: 720px) 45vw, 280px" />
          </figure>
        ))}
      </div>

      {/* ------------------------------------------------ Certifications & Standards */}
      <div className="certifications-strip">
        <div className="certifications-strip-head">
          <h2>{isAr ? 'المعايير والامتثال الدولي' : 'Standards & Compliance'}</h2>
          <p className="eyebrow" style={{margin: 0}}>
            {isAr ? 'تصميم حول معايير تعرفها بالفعل' : 'Designed to the standards you already specify'}
          </p>
        </div>
        <div className="cert-badges">
          {CERTIFICATIONS.map((cert) => (
            <div className="cert-badge" key={cert.id}>
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

      {/* ------------------------------------------------ Global Presence / Offices (Page 9) */}
      <section className="about-offices-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('contact.offices.title')}</p>
            <h2>{t('about.officesTitle')}</h2>
            <p className="section-lede">{t('about.officesIntro')}</p>
          </div>
        </div>

        <div className="about-offices-grid">
          {offices.map((office) => (
            <div className="about-office-card" key={office.id}>
              <div className="about-office-badge">
                {office.id === 'uk' ? '🇬🇧' : office.id === 'sa' ? '🇸🇦' : '🇦🇪'}{' '}
                {t(`contact.offices.${office.id}.role`)}
              </div>
              <h3>{office.name}</h3>
              <address>
                {office.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
              <div className="about-office-meta">
                {office.phones?.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} dir="ltr" className="about-office-link">
                    📞 {phone}
                  </a>
                ))}
                <a href={`mailto:${office.email}`} className="about-office-link">
                  ✉️ {office.email}
                </a>
              </div>
              {office.directionsUrl && (
                <a
                  href={office.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-quiet button-sm"
                  style={{marginTop: 8, alignSelf: 'flex-start'}}
                >
                  {t('contact.offices.directionsLabel')} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Contact CTA (Page 10) */}
      <section className="contact-cta">
        <div>
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
        </div>
        <div className="action-row">
          <Link href={`/${locale}/company-profile`} className="button button-quiet">
            {t('companyProfile.nav')}
          </Link>
          <Link href={`/${locale}/contact`} className="button button-primary">
            {t('contact.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
