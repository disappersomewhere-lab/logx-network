// Generates the raster icons Next cannot derive from app/icon.svg.
//
//   npm run build:icons
//
// `app/icon.svg` covers modern browsers, but /favicon.ico is still requested
// directly by older Safari, feed readers and link scrapers, and iOS needs a
// square opaque PNG for the home-screen icon.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'app', 'icon.svg');
const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
const INK = {r: 20, g: 20, b: 20};

/**
 * Packs PNGs into an ICO container: a 6-byte directory header, one 16-byte
 * entry per image, then the payloads. PNG payloads are read by every browser
 * that still asks for favicon.ico.
 */
function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = header.length + entries.length;

  images.forEach(({size, data}, index) => {
    const at = index * 16;
    // 0 means 256 in the ICO directory; nothing here is that large.
    entries.writeUInt8(size >= 256 ? 0 : size, at);
    entries.writeUInt8(size >= 256 ? 0 : size, at + 1);
    entries.writeUInt8(0, at + 2); // palette entries
    entries.writeUInt8(0, at + 3); // reserved
    entries.writeUInt16LE(1, at + 4); // colour planes
    entries.writeUInt16LE(32, at + 6); // bits per pixel
    entries.writeUInt32LE(data.length, at + 8);
    entries.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, entries, ...images.map((image) => image.data)]);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source icon not found: ${SOURCE}`);
    process.exit(1);
  }

  const images = [];
  for (const size of ICO_SIZES) {
    images.push({size, data: await sharp(SOURCE).resize(size, size).png().toBuffer()});
  }
  fs.writeFileSync(path.join(ROOT, 'app', 'favicon.ico'), packIco(images));
  console.log(`  favicon.ico      ${ICO_SIZES.join(', ')} px`);

  // iOS ignores transparency and composites onto black, so flatten onto the
  // brand ink deliberately rather than letting the platform choose.
  await sharp(SOURCE)
    .resize(APPLE_SIZE, APPLE_SIZE)
    .flatten({background: INK})
    .png()
    .toFile(path.join(ROOT, 'app', 'apple-icon.png'));
  console.log(`  apple-icon.png   ${APPLE_SIZE} px`);
}

main();
