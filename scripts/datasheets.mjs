// Where a part's PDF datasheet lives once imported, and whether it exists.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
export const DATASHEET_DIR = path.join(ROOT, 'public', 'datasheets');

/**
 * Filename for a part's datasheet. `+` is legal in a URL path but is mangled
 * by enough proxies and copy-pastes that it is not worth the risk.
 */
export function datasheetFileFor(partNumber) {
  return `${String(partNumber).replace(/\+/g, '-plus')}.pdf`;
}

/**
 * `{url, bytes}` for the part's datasheet if one has been imported, else null.
 * The size is recorded so the page can say "PDF · 420 KB" without a request.
 */
export function datasheetFor(partNumber) {
  const file = datasheetFileFor(partNumber);
  const full = path.join(DATASHEET_DIR, file);
  if (!fs.existsSync(full)) return null;
  return {url: `/datasheets/${file}`, bytes: fs.statSync(full).size};
}
