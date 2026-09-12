// The LOGX price list, read once for every importer that needs it, so the
// exclusions and clean-up rules live in one place.

import XLSX from 'xlsx';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');

/** Committed beside the catalogue so a fresh clone can regenerate it. */
export const PRICE_LIST = path.join(ROOT, 'data', 'source', "Logx product's.xls");

/**
 * Part numbers that appear in the price list but must not reach the site.
 * Keeping the exclusion here rather than editing generated files means it
 * survives the next import from the same spreadsheet.
 */
export const EXCLUDED = new Map([
  ['LXFPRDLC06', 'not a real product — confirmed 2026-09-10']
]);

export const clean = (value) => String(value).replace(/\s+/g, ' ').trim();

/**
 * Rows of the price list as `{raw, partNumber}`, in sheet order, with blank
 * rows, duplicates and excluded parts removed. Logs what it skipped.
 */
export function readRows(source = PRICE_LIST) {
  const workbook = XLSX.readFile(source);
  const rows = XLSX.utils
    .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1, defval: ''})
    .slice(1);

  const seen = new Set();
  const result = [];

  for (const row of rows) {
    if (!row[0] || !row[1]) continue;
    const raw = clean(row[0]);
    const partNumber = clean(row[1]);

    if (EXCLUDED.has(partNumber)) {
      console.log(`  - skipping ${partNumber}: ${EXCLUDED.get(partNumber)}`);
      continue;
    }
    if (seen.has(partNumber)) {
      console.warn(`  ! duplicate part number ${partNumber} — keeping the first row`);
      continue;
    }
    seen.add(partNumber);
    result.push({raw, partNumber});
  }

  return result;
}
