// Server-only: touches the filesystem. Import from pages and layouts, never
// from a client component.

import fs from 'node:fs';
import path from 'node:path';

const DATASHEET_DIR = path.join(process.cwd(), 'public', 'datasheets');

/**
 * Filename for a part's PDF. Mirrors `datasheetFileFor` in
 * scripts/datasheets.mjs, which names the files when they are generated.
 */
export function datasheetFileFor(partNumber: string) {
  return `${partNumber.replace(/\+/g, '-plus')}.pdf`;
}

/**
 * `{url, bytes}` for the part's generated PDF, or null if it has not been
 * generated. Resolved at build time, so the deployed pages reflect the PDFs
 * committed alongside them without a round trip through the catalogue.
 */
export function datasheetFor(partNumber: string) {
  const file = datasheetFileFor(partNumber);
  try {
    const {size} = fs.statSync(path.join(DATASHEET_DIR, file));
    return {url: `/datasheets/${file}`, bytes: size};
  } catch {
    return null;
  }
}
