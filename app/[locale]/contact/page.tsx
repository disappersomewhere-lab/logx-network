import {getTranslations} from 'next-intl/server';
import type {Metadata} from 'next';
import OfficeMap from '@/components/OfficeMap';
import QuoteForm from '@/components/QuoteForm';
import {alternatesFor, contact, offices} from '@/lib/site';

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{product?: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('nav.contact'),
    description: t('contact.description'),
    alternates: alternatesFor(locale, '/contact')
  };
}

export default async function ContactPage({searchParams}: Props) {
  const {product} = await searchParams;
  const t = await getTranslations();

  return (
    <div className="contact-page">
      <div className="contact-intro">
        <p className="eyebrow">{t('contact.eyebrow')}</p>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.description')}</p>
      </div>

      <QuoteForm
        defaultProduct={product ?? ''}
        labels={{
          name: t('contact.form.name'),
          email: t('contact.form.email'),
          company: t('contact.form.company'),
          product: t('contact.form.product'),
          message: t('contact.form.message'),
          submit: t('contact.form.submit'),
          sending: t('contact.form.sending'),
          success: t('contact.form.success'),
          error: t('contact.form.error', {email: contact.email})
        }}
      />

      {/* Office cards */}
      <div className="contact-offices">
        {offices.map((office) => (
          <div className="office-card" key={office.id}>
            {/* Map embed */}
            {office.mapUrl && (
              <OfficeMap
                src={office.mapUrl}
                title={`${office.name} location`}
                name={office.name}
                href={office.directionsUrl}
                openLabel={t('contact.offices.openMapLabel')}
              />
            )}

            <div className="office-card-body">
              <p className="office-role">{t(`contact.offices.${office.id}.role`)}</p>
              <h3>{office.name}</h3>

              <address>
                {office.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>

              <div className="office-links">
                {office.phones?.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} dir="ltr" className="office-link office-link-phone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.35 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {phone}
                  </a>
                ))}

                <a href={`mailto:${office.email}`} className="office-link office-link-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {office.email}
                </a>

                <a href={`https://${office.website}`} target="_blank" rel="noreferrer" className="office-link office-link-web">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  {office.website}
                </a>

                {office.directionsUrl && (
                  <a
                    href={office.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="office-directions-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                    </svg>
                    {t('contact.offices.directionsLabel')}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
