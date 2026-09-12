// Copies the per-part PDF datasheets into public/datasheets/, named by part
// number, and reports how they line up with the price list.
//
//   npm run import-datasheets                    # from the default output folder
//   npm run import-datasheets -- "path/to/pdfs"  # or an explicit folder
//
// The sheets are rendered by a separate PowerShell tool (see
// README-DATASHEETS.md in the price list's original folder) as
// `NNN_PARTNUMBER.pdf`. The numeric prefix is only a render order and is
// dropped here so the URL is the part number. The copies are committed, so a
// fresh clone serves them without needing the generator.
//
// Run this BEFORE import-products: the product importer records which parts
// have a sheet by looking in public/datasheets/.

import fs from 'node:fs';
import path from 'node:path';
import {readRows} from './price-list.mjs';
import {DATASHEET_DIR, datasheetFileFor} from './datasheets.mjs';

const DEFAULT_SOURCE = String.raw`C:\Users\NSEA ITSM\OneDrive\Desktop\logx\LOGX_Datasheets_PerPart`;

function main() {
  const source = process.argv[2] || DEFAULT_SOURCE;
  if (!fs.existsSync(source)) {
    console.error(`Datasheet folder not found: ${source}`);
    process.exit(1);
  }

  // Rendered sheets keyed by the part number in their filename.
  const rendered = new Map(
    fs
      .readdirSync(source)
      .filter((name) => /\.pdf$/i.test(name))
      .map((name) => [name.replace(/^\d+_/, '').replace(/\.pdf$/i, ''), name])
  );

  fs.mkdirSync(DATASHEET_DIR, {recursive: true});

  const copied = new Set();
  const missing = [];

  for (const {partNumber} of readRows()) {
    const original = rendered.get(partNumber);
    if (!original) {
      missing.push(partNumber);
      continue;
    }
    const target = datasheetFileFor(partNumber);
    fs.copyFileSync(path.join(source, original), path.join(DATASHEET_DIR, target));
    copied.add(target);
    rendered.delete(partNumber);
  }

  // A sheet whose part is not in the price list (a removed product, a typo)
  // is reported but never copied, so a stale PDF cannot become a live URL.
  const unmatched = [...rendered.keys()];

  // And a copy whose product has since gone is removed.
  const stale = fs.readdirSync(DATASHEET_DIR).filter((name) => !copied.has(name));
  for (const name of stale) fs.unlinkSync(path.join(DATASHEET_DIR, name));

  console.log(`Copied ${copied.size} datasheet(s) to public/datasheets/`);
  if (missing.length) console.log(`  products without a rendered sheet: ${missing.join(', ')}`);
  if (unmatched.length) console.log(`  rendered sheets with no product (not copied): ${unmatched.join(', ')}`);
  if (stale.length) console.log(`  removed ${stale.length} stale copy(ies)`);
}

main();
