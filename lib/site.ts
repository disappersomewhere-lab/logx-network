import {defaultLocale, locales} from '@/i18n';

/** Production domain. Also the fallback, so a build can never ship localhost. */
export const productionUrl = 'https://logxnetwork.com';

/**
 * Canonical origin for the deployed site. Everything that emits an absolute
 * URL — canonical links, hreflang, Open Graph, sitemap, robots — reads it from
 * here, so the origin is configured in one place rather than in each consumer.
 *
 * Set NEXT_PUBLIC_SITE_URL explicitly on every environment: a preview or
 * staging deployment that falls back to the production domain would publish
 * canonical links pointing at the live site.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? productionUrl : 'http://localhost:3000');

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    '\n  WARNING  NEXT_PUBLIC_SITE_URL is not set.\n' +
      `           Falling back to ${productionUrl} for canonical links, hreflang,\n` +
      '           Open Graph and sitemap.xml. Correct for production, wrong for a\n' +
      '           preview or staging deployment. Set it explicitly on the host.\n'
  );
}

/**
 * Public contact details. Kept here so changing the sales address is one edit
 * rather than a search across pages, metadata and both message catalogues.
 */
export const contact = {
  email: 'sales@logxnetwork.com'
} as const;

/** `mailto:` link to sales, optionally pre-filling the subject. */
export function mailto(subject?: string) {
  return subject
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${contact.email}`;
}

export type Office = {
  id: 'uk' | 'sa';
  name: string;
  addressLines: string[];
  phones?: string[];
  email: string;
  website: string;
  /** Google Maps embed URL for the office location */
  mapUrl?: string;
  /** Google Maps directions URL */
  directionsUrl?: string;
};

/**
 * The physical offices behind the site: the UK entity that owns the LOGX
 * brand, and the Middle East distributor that carries its stock. Each
 * office's `role` label (head office / regional distributor) is localised in
 * the message catalogues under `contact.offices.<id>.role` rather than kept
 * here, since the rest of this record is proper nouns.
 */
export const offices: Office[] = [
  {
    id: 'uk',
    name: 'LOGX NETWORKS LTD.',
    addressLines: ['71-75 Shelton Street', 'Covent Garden', 'London, WC2H 9JQ', 'United Kingdom'],
    email: 'hello@logxn.co.uk',
    website: 'logxn.co.uk',
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.7876!2d-0.12388!3d51.51474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604d1f9e2e85f%3A0x4a03b7e16c476f1a!2s71-75%20Shelton%20St%2C%20London%20WC2H%209JQ!5e0!3m2!1sen!2suk!4v1696000000000!5m2!1sen!2suk',
    directionsUrl:
      'https://maps.google.com/?q=71-75+Shelton+Street,+Covent+Garden,+London,+WC2H+9JQ,+United+Kingdom'
  },
  {
    id: 'sa',
    name: 'Networks Sea Company',
    addressLines: ['Prince Muhammad Ibn Abd Al Aziz Rd', 'Olaya District', 'Riyadh 12214', 'Saudi Arabia'],
    phones: ['+966 11 217 0269', '+966 53 990 9932'],
    email: 'sales@nsea.com.sa',
    website: 'nsea.com.sa',
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.2!2d46.67!3d24.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sOlaya%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2ssa!4v1696000000000!5m2!1sen!2ssa',
    directionsUrl:
      'https://maps.google.com/?q=Olaya+District,+Riyadh,+Saudi+Arabia'
  }
];

/**
 * Canonical + hreflang for one page, in every locale.
 *
 * Next merges metadata by replacing whole fields, so a page that returns
 * `alternates: {canonical}` drops the `languages` map inherited from the
 * layout. Building both together here keeps hreflang on every page.
 *
 * @param locale the locale being rendered
 * @param path   the path after the locale segment, e.g. '' or '/products'
 */
export function alternatesFor(locale: string, path = '') {
  const languages: Record<string, string> = {};
  for (const other of locales) languages[other] = `/${other}${path}`;
  // Tells search engines which version to serve when no locale matches.
  languages['x-default'] = `/${defaultLocale}${path}`;

  return {canonical: `/${locale}${path}`, languages};
}
