import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {alternatesFor} from '@/lib/site';

const SHOWCASE = [
  '/products/photos/fiber-panel-24-01.webp',
  '/products/photos/patch-panel-48-01.webp',
  '/products/photos/keystone-cat6-01.webp',
  '/products/photos/brand-packaging-01.webp'
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

  return (
    <div>
      <div className="about-hero">
        <p className="eyebrow">{t('about.eyebrow')}</p>
        <h1>{t('about.title')}</h1>
        <p>{t('about.description')}</p>
      </div>

      <div className="about-columns">
        <div>
          <span className="about-index">01</span>
          <h2>{t('about.qualityTitle')}</h2>
          <p>{t('about.quality')}</p>
        </div>
        <div>
          <span className="about-index">02</span>
          <h2>{t('about.rangeTitle')}</h2>
          <p>{t('about.range')}</p>
        </div>
        <div>
          <span className="about-index">03</span>
          <h2>{t('about.contactTitle')}</h2>
          <p>{t('about.contact')}</p>
          <Link href={`/${locale}/contact`} className="text-link">
            {t('contact.cta')} ↗
          </Link>
        </div>
      </div>

      <div className="about-gallery">
        {SHOWCASE.map((src) => (
          <figure key={src}>
            <Image src={src} alt="" fill sizes="(max-width: 720px) 45vw, 280px" />
          </figure>
        ))}
      </div>

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
