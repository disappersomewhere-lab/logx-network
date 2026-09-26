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
};

/**
 * The two physical offices behind the site: the UK entity that owns the LOGX
 * brand, and the Middle East distributor that carries its stock. Each
 * office's `role` label (head office / regional distributor) is localised in
 * the message catalogues under `contact.offices.<id>.role` rather than kept
 * here, since the rest of this record is proper nouns.
 */
export const offices: Office[] = [
  {
    id: 'uk',
    name: 'LOGX NETWORKS LTD.',
    addressLines: ['71-75 Shelton Street', 'Covent Garden, London', 'United Kingdom'],
    email: 'hello@logxn.co.uk',
    website: 'logxn.co.uk'
  },
  {
    id: 'sa',
    name: 'Networks Sea Company',
    addressLines: ['Olaya', 'Riyadh, Saudi Arabia'],
    phones: ['+966 11 217 0269', '+966 53 990 9932'],
    email: 'sales@nsea.com.sa',
    website: 'nsea.com.sa'
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
