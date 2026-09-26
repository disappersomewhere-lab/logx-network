import {getTranslations} from 'next-intl/server';
import type {Metadata} from 'next';
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

      <div className="contact-offices">
        {offices.map((office) => (
          <div className="office-card" key={office.id}>
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
                <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} dir="ltr">
                  {t('contact.offices.phoneLabel')}: {phone}
                </a>
              ))}
              <a href={`mailto:${office.email}`}>
                {t('contact.offices.emailLabel')}: {office.email}
              </a>
              <a href={`https://${office.website}`} target="_blank" rel="noreferrer">
                {office.website}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
