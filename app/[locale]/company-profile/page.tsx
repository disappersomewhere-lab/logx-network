import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import PrintButton from '@/components/PrintButton';
import {catalog, countByCategory, type Locale} from '@/lib/catalog';
import {alternatesFor, contact, mailto, offices} from '@/lib/site';
import {companyProfileFor} from '@/lib/company-profile';
import {formatBytes} from '@/lib/format';
import {locales} from '@/i18n';

type Props = {
  params: Promise<{locale: string}>;
};

// One representative shot per category — the same editorial picks the home
// page uses, so the profile stays visually consistent with the site.
const CATEGORY_SHOTS = {
  copper: '/products/photos/patch-cord-cat6-long-01.webp',
  fiber: '/products/photos/fiber-cord-om3-01.webp',
  accessories: '/products/photos/patch-panel-24-01.webp'
} as const;

const GALLERY = [
  '/products/photos/fiber-panel-24-01.webp',
  '/products/photos/patch-panel-48-01.webp',
  '/products/photos/keystone-cat6a-01.webp',
  '/products/photos/brand-packaging-01.webp'
];

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('companyProfile.nav'),
    description: t('companyProfile.cover.subtitle'),
    alternates: alternatesFor(locale, '/company-profile')
  };
}

export default async function CompanyProfilePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const language = locale as Locale;
  const isRTL = locale === 'ar';
  const pdf = companyProfileFor(language);

  return (
    <div className="cp-page">
      {/* Screen-only controls; the print stylesheet removes them. */}
      <div className="cp-toolbar">
        <Link href={`/${locale}/about`} className="back-link">
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          {t('companyProfile.back')}
        </Link>
        <div className="cp-toolbar-actions">
          <PrintButton label={t('companyProfile.print')} />
          {pdf ? (
            <a href={pdf.url} className="button button-primary" download>
              <span className="pdf-badge" aria-hidden="true">
                PDF
              </span>
              {t('companyProfile.download')}
              <small className="ds-size">{formatBytes(pdf.bytes, language)}</small>
            </a>
          ) : null}
        </div>
      </div>

      <article className="cp-doc" lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* ---------------------------------------------------------- cover */}
        <section className="cp-sheet cp-cover">
          <div className="cp-cover-photo">
            <Image
              src={CATEGORY_SHOTS.fiber}
              alt=""
              fill
              sizes="210mm"
              priority
            />
          </div>
          <div className="cp-cover-brand">
            <Logo size="1.7rem" />
          </div>
          <div className="cp-cover-body">
            <p className="cp-cover-eyebrow">{t('companyProfile.cover.eyebrow')}</p>
            <h1>{t('companyProfile.cover.title')}</h1>
            <p className="cp-cover-tagline">{t('companyProfile.cover.tagline')}</p>
            <p className="cp-cover-subtitle">{t('companyProfile.cover.subtitle')}</p>
          </div>
        </section>

        {/* ------------------------------------------------ about / mission */}
        <section className="cp-sheet">
          <header className="cp-sheet-head">
            <Logo size="1.3rem" />
            <small>{t('companyProfile.docType')}</small>
          </header>

          <div>
            <h2>{t('companyProfile.about.title')}</h2>
            <p className="cp-lede">{t('companyProfile.about.body1')}</p>
            <p style={{marginTop: '8pt'}}>{t('companyProfile.about.body2')}</p>
          </div>

          <div className="cp-block">
            <h2>{t('companyProfile.mission.title')}</h2>
            <div className="cp-columns">
              <div className="cp-callout">
                <p className="cp-callout-label">{t('companyProfile.mission.visionLabel')}</p>
                <p>{t('companyProfile.mission.vision')}</p>
              </div>
              <div className="cp-callout">
                <p className="cp-callout-label">{t('companyProfile.mission.missionLabel')}</p>
                <p>{t('companyProfile.mission.mission')}</p>
              </div>
            </div>
          </div>

          <div className="cp-block">
            <h2>{t('companyProfile.why.title')}</h2>
            <div className="cp-columns">
              <div className="cp-points">
                <div>
                  <strong>{t('companyProfile.why.point1Title')}</strong>
                  <p>{t('companyProfile.why.point1')}</p>
                </div>
                <div>
                  <strong>{t('companyProfile.why.point2Title')}</strong>
                  <p>{t('companyProfile.why.point2')}</p>
                </div>
                <div>
                  <strong>{t('companyProfile.why.point3Title')}</strong>
                  <p>{t('companyProfile.why.point3')}</p>
                </div>
              </div>
              <div>
                <p style={{marginBottom: '6pt'}}>{t('companyProfile.compliance.intro')}</p>
                <ul className="cp-checks">
                  <li>{t('companyProfile.compliance.item1')}</li>
                  <li>{t('companyProfile.compliance.item2')}</li>
                  <li>{t('companyProfile.compliance.item3')}</li>
                  <li>{t('companyProfile.compliance.item4')}</li>
                  <li>{t('companyProfile.compliance.item5')}</li>
                </ul>
              </div>
            </div>
          </div>

          <footer className="cp-foot">
            <span>© LOGX NETWORK</span>
            <span>{t('companyProfile.footNote')}</span>
          </footer>
        </section>

        {/* ------------------------------------------------- product range */}
        <section className="cp-sheet">
          <header className="cp-sheet-head">
            <Logo size="1.3rem" />
            <small>{t('companyProfile.docType')}</small>
          </header>

          <div>
            <h2>{t('companyProfile.range.title')}</h2>
            <p className="cp-lede">{t('companyProfile.range.intro')}</p>
          </div>

          <div className="cp-range-grid">
            <div className="cp-range-card">
              <div className="cp-range-photo">
                <Image src={CATEGORY_SHOTS.copper} alt="" fill sizes="210mm" />
              </div>
              <div className="cp-range-card-body">
                <h3>{t('companyProfile.range.copperTitle')}</h3>
                <p>{t('companyProfile.range.copperBody')}</p>
                <span className="cp-range-count">
                  {countByCategory('copper')} {t('catalog.items')}
                </span>
              </div>
            </div>

            <div className="cp-range-card">
              <div className="cp-range-photo">
                <Image src={CATEGORY_SHOTS.fiber} alt="" fill sizes="210mm" />
              </div>
              <div className="cp-range-card-body">
                <h3>{t('companyProfile.range.fiberTitle')}</h3>
                <p>{t('companyProfile.range.fiberBody')}</p>
                <span className="cp-range-count">
                  {countByCategory('fiber')} {t('catalog.items')}
                </span>
              </div>
            </div>

            <div className="cp-range-card">
              <div className="cp-range-photo">
                <Image src={CATEGORY_SHOTS.accessories} alt="" fill sizes="210mm" />
              </div>
              <div className="cp-range-card-body">
                <h3>{t('companyProfile.range.accessoriesTitle')}</h3>
                <p>{t('companyProfile.range.accessoriesBody')}</p>
                <span className="cp-range-count">
                  {countByCategory('accessories')} {t('catalog.items')}
                </span>
              </div>
            </div>
          </div>

          <div className="cp-gallery">
            {GALLERY.map((src) => (
              <figure key={src}>
                <Image src={src} alt="" fill sizes="120mm" />
              </figure>
            ))}
          </div>

          <footer className="cp-foot">
            <span>© LOGX NETWORK</span>
            <span>
              {catalog.length} {t('home.stats.parts')}
            </span>
          </footer>
        </section>

        {/* ------------------------------------------------------- contact */}
        <section className="cp-sheet">
          <header className="cp-sheet-head">
            <Logo size="1.3rem" />
            <small>{t('companyProfile.docType')}</small>
          </header>

          <div>
            <h2>{t('companyProfile.contactSection.title')}</h2>
            <p className="cp-lede">{t('companyProfile.contactSection.body')}</p>
          </div>

          <div className="cp-offices">
            {offices.map((office) => (
              <div className="cp-office" key={office.id}>
                <p className="cp-office-role">{t(`contact.offices.${office.id}.role`)}</p>
                <h3>{office.name}</h3>
                <address>
                  {office.addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </address>
                <div className="cp-office-links">
                  {office.phones?.map((phone) => <span key={phone}>{phone}</span>)}
                  <span>{office.email}</span>
                  <span>{office.website}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cp-callout">
            <p className="cp-callout-label">{t('companyProfile.contactSection.salesLabel')}</p>
            <p style={{direction: 'ltr', textAlign: 'start'}}>
              <a href={mailto()}>{contact.email}</a>
            </p>
          </div>

          <footer className="cp-foot" style={{marginTop: 'auto'}}>
            <span>© LOGX NETWORK</span>
            <span>{t('companyProfile.footNote')}</span>
          </footer>
        </section>
      </article>
    </div>
  );
}
