// Imports the per-family engineering content — description, standards,
// features, applications, characteristic tables, ordering rows — that the
// earlier datasheet generator kept in its own catalogue, into
// data/families.json so the site's datasheet pages are built from it.
//
//   npm run import-family-content -- "path/to/logx-catalog.json"
//
// Run when the source catalogue changes. data/families.json is committed and
// is the file to edit for copy changes from here on.

import fs from 'node:fs';
import path from 'node:path';
import {EXCLUDED} from './price-list.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const DEFAULT_SOURCE = String.raw`C:\xampp\htdocs\My projects\logx\tools\logx-catalog.json`;

// The source was authored as HTML fragments; the site renders text.
const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ',
  '&times;': '×', '&Oslash;': 'Ø', '&deg;': '°', '&plusmn;': '±', '&micro;': 'µ',
  '&ge;': '≥', '&le;': '≤', '&ndash;': '–', '&mdash;': '—'
};
const decode = (value) =>
  String(value)
    .replace(/&[a-zA-Z]+;/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    // "Class E<sub>A</sub>" reads as "Class EA" in plain text, as the
    // standard is usually typed.
    .replace(/<\/?(sub|sup|i|em|span)>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// "<b>Lead phrase</b> rest of the sentence" → {lead, text}. Features without
// a bold lead keep lead: null so the page can render them uniformly.
function feature(html) {
  const match = /^\s*<b>(.*?)<\/b>\s*(.*)$/s.exec(html);
  if (match) return {lead: decode(match[1]), text: decode(match[2])};
  return {lead: null, text: decode(html.replace(/<\/?b>/g, ''))};
}

const table = (block) =>
  block ? {title: decode(block.title), rows: block.rows.map((row) => row.map(decode))} : null;

function main() {
  const source = process.argv[2] || DEFAULT_SOURCE;
  if (!fs.existsSync(source)) {
    console.error(`Content catalogue not found: ${source}`);
    process.exit(1);
  }

  const catalogue = JSON.parse(fs.readFileSync(source, 'utf8'));
  const revision = new Date().toISOString().slice(0, 7); // YYYY-MM
  const families = [];
  let partsSeen = 0;

  for (const family of catalogue.families) {
    const parts = family.products
      .filter((row) => !EXCLUDED.has(row.part))
      .map((row) => ({
        partNumber: decode(row.part),
        description: decode(row.desc),
        variant: decode(row.variant || row.last || '')
      }));
    partsSeen += parts.length;

    families.push({
      key: family.key,
      title: decode(family.headerTitle),
      modelLine: decode(family.modelLine),
      description: decode(family.description),
      compliance: family.compliance.map(decode),
      features: family.features.map(feature),
      applications: family.applications.map(decode),
      sideTable: table(family.sideTable),
      specsTitle: decode(family.specsTitle || 'Specifications & construction'),
      specs: family.specs.map((row) => row.map(decode)),
      mechanical: table(family.tableLeft),
      electrical: table(family.tableRight),
      variantHeader: decode(family.orderingLastHeader || 'Variant'),
      parts,
      revision
    });
  }

  fs.writeFileSync(
    path.join(ROOT, 'data', 'families.json'),
    `${JSON.stringify(families, null, 2)}\n`
  );
  console.log(`Imported ${families.length} families covering ${partsSeen} parts → data/families.json`);
}

main();
