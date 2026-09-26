// Server-only: touches the filesystem. Import from pages and layouts, never
// from a client component. Mirrors lib/datasheets.ts for the single company
// profile document, generated per locale rather than per part.

import fs from 'node:fs';
import path from 'node:path';
import type {Locale} from '@/lib/catalog';

const COMPANY_PROFILE_DIR = path.join(process.cwd(), 'public', 'company-profile');

/** Filename for a locale's PDF. Mirrors the naming in scripts/build-company-profile.mjs. */
export function companyProfileFileFor(locale: Locale) {
  return `LOGX-Company-Profile-${locale}.pdf`;
}

/**
 * `{url, bytes}` for the locale's generated PDF, or null if it has not been
 * generated. Resolved at build time, so the deployed page reflects the PDF
 * committed alongside it without a round trip through the build.
 */
export function companyProfileFor(locale: Locale) {
  const file = companyProfileFileFor(locale);
  try {
    const {size} = fs.statSync(path.join(COMPANY_PROFILE_DIR, file));
    return {url: `/company-profile/${file}`, bytes: size};
  } catch {
    return null;
  }
}
