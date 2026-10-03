// Server-only: touches the filesystem. Import from pages and layouts, never
// from a client component. Mirrors lib/datasheets.ts for the company profile,
// which is generated per locale and per theme rather than per part.

import fs from 'node:fs';
import path from 'node:path';
import type {Locale} from '@/lib/catalog';
import {profileThemes, type ProfileTheme} from '@/lib/profile-themes';

const COMPANY_PROFILE_DIR = path.join(process.cwd(), 'public', 'company-profile');

/** Filename for one locale and theme. Mirrors scripts/build-company-profile.mjs. */
export function companyProfileFileFor(locale: Locale, theme: ProfileTheme) {
  return `LOGX-Company-Profile-${locale}-${theme}.pdf`;
}

export type CompanyProfilePdf = {url: string; bytes: number};

/**
 * `{url, bytes}` per theme for the locale's generated PDFs; a theme whose PDF
 * has not been generated is left out. Resolved at build time, so the deployed
 * page reflects the PDFs committed alongside it.
 */
export function companyProfilesFor(locale: Locale) {
  const found: Partial<Record<ProfileTheme, CompanyProfilePdf>> = {};
  for (const theme of profileThemes) {
    const file = companyProfileFileFor(locale, theme);
    try {
      const {size} = fs.statSync(path.join(COMPANY_PROFILE_DIR, file));
      found[theme] = {url: `/company-profile/${file}`, bytes: size};
    } catch {
      // not generated yet
    }
  }
  return found;
}
