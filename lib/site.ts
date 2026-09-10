import {defaultLocale, locales} from '@/i18n';

/**
 * Canonical origin for the deployed site. Everything that emits an absolute
 * URL — canonical links, hreflang, Open Graph, sitemap, robots — reads it from
 * here so a misconfigured deployment fails in one place rather than silently
 * publishing localhost URLs across the whole site.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    '\n  WARNING  NEXT_PUBLIC_SITE_URL is not set.\n' +
      `           Canonical links, hreflang, Open Graph and sitemap.xml will all\n` +
      `           point at ${siteUrl}, which search engines cannot reach.\n` +
      '           Set it in the hosting provider before deploying.\n'
  );
}

/**
 * Public contact details. Kept here so changing the sales address is one edit
 * rather than a search across pages, metadata and both message catalogues.
 */
export const contact = {
  email: 'sales@logxconnect.com'
} as const;

/** `mailto:` link to sales, optionally pre-filling the subject. */
export function mailto(subject?: string) {
  return subject
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${contact.email}`;
}

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
