// Where the generated PDF datasheets live and how they are named. The site
// reads them through lib/datasheets.ts, which mirrors the filename rule.

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
