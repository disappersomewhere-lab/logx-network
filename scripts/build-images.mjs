// Turns the original LOGX product photographs into clean, uniform catalogue
// assets: EXIF-rotated, white-balanced against their own backdrop, trimmed of
// dead space and padded to a square on white.
//
//   npm run build:images
//
// Source photos stay out of the bundle; only the processed WebP files under
// public/products/photos/ are served.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import {families, rotations} from './photo-map.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const SRC = process.argv[2] || path.join(ROOT, 'logx oreginal image');
const OUT = path.join(ROOT, 'public', 'products', 'photos');

const SIZE = 1400; // master square; next/image derives the responsive sizes
const MARGIN = 0.055; // breathing room around the product, as a fraction of SIZE
const WHITE = {r: 255, g: 255, b: 255};
const CANVAS = {r: 250, g: 250, b: 250}; // matches the levelled backdrop, so padding is seamless

export function sourceFiles(dir = SRC) {
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort();
}

// Samples the outer frame of the photo. A bright, low-variance frame means the
// product sits on a seamless backdrop we can neutralise to white; a noisy one
// means an in-situ shot (a desk, a floor) that has to stay as photographed.
async function backdrop(buffer) {
  const {data, info} = await sharp(buffer)
    .resize(64, 64, {fit: 'fill'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});

  const {width, height, channels} = info;
  const luminances = [];
  const perChannel = [[], [], []];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const onFrame = x < 4 || y < 4 || x >= width - 4 || y >= height - 4;
      if (!onFrame) continue;
      const i = (y * width + x) * channels;
      perChannel[0].push(data[i]);
      perChannel[1].push(data[i + 1]);
      perChannel[2].push(data[i + 2]);
      luminances.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
    }
  }

  const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  // A dark product touching the frame drags the overall spread up, so judge the
  // backdrop on its bright pixels only: how much of the frame is backdrop, and
  // how even that part is.
  const bright = luminances.filter((value) => value > 120);
  const brightFraction = bright.length / luminances.length;
  const brightMean = bright.reduce((sum, value) => sum + value, 0) / (bright.length || 1);
  const brightSpread = Math.sqrt(
    bright.reduce((sum, value) => sum + (value - brightMean) ** 2, 0) / (bright.length || 1)
  );

  return {
    luma: median(luminances),
    brightFraction,
    brightSpread,
    rgb: perChannel.map(median)
  };
}

async function processPhoto(sourcePath, outputPath, rotation = 0) {
  // EXIF orientation first, then any correction carried by the photo map.
  let upright = await sharp(sourcePath).rotate().toBuffer();
  if (rotation) upright = await sharp(upright).rotate(rotation).toBuffer();

  const {luma, brightFraction, brightSpread, rgb} = await backdrop(upright);

  // A seamless backdrop fills most of the frame, is bright, and is even.
  // Anything else is an in-situ shot that has to keep its scene.
  const seamless = luma >= 130 && brightFraction >= 0.72 && brightSpread < 22;

  let subject = upright;

  if (seamless) {
    // Per-channel gain neutralises the backdrop's colour cast and lifts it to
    // white in one step, so the padding added later is invisible. Aiming a
    // little under 255 keeps a white-on-white product from losing its edges.
    const gains = rgb.map((channel) => Math.min(250 / Math.max(channel, 1), 2.2));

    const levelled = await sharp(upright)
      .linear(gains, [0, 0, 0])
      .modulate({saturation: 1.08})
      .sharpen({sigma: 0.7})
      .toBuffer();

    subject = levelled;

    try {
      const trimmed = await sharp(levelled)
        .trim({background: WHITE, threshold: 22})
        .toBuffer({resolveWithObject: true});
      const source = await sharp(levelled).metadata();
      const keptArea = (trimmed.info.width * trimmed.info.height) / (source.width * source.height);
      if (keptArea > 0.05) subject = trimmed.data;
    } catch {
      // A uniform frame makes trim throw; keep the levelled image.
    }

    const inner = Math.round(SIZE * (1 - MARGIN * 2));
    await sharp(subject)
      .resize(inner, inner, {fit: 'inside'})
      .flatten({background: CANVAS})
      .resize(SIZE, SIZE, {fit: 'contain', background: CANVAS})
      .webp({quality: 82, effort: 5})
      .toFile(outputPath);
    return;
  }

  // In-situ shot: keep the scene, just square it off around the centre of interest.
  await sharp(subject)
    .resize(SIZE, SIZE, {fit: 'cover', position: sharp.strategy.attention})
    .modulate({saturation: 1.04, brightness: 1.03})
    .webp({quality: 82, effort: 5})
    .toFile(outputPath);
}

// ---------------------------------------------------------------- Open Graph
//
// Link previews need a 1200x630 raster. WhatsApp and LinkedIn do not reliably
// render WebP, so these are JPEG/PNG rather than reusing the page assets.

const OG = {width: 1200, height: 630};
const FONT = 'Arial, Helvetica, sans-serif';

// The LOGX wordmark, drawn as SVG so it renders identically without a webfont.
// The X is skewed about its own baseline origin: skewX() alone shears the whole
// coordinate system, which would drag the glyph left over the G.
function wordmark({x, y, size, subdued = false}) {
  const sub = size * 0.17;
  return `
    <text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="900"
          letter-spacing="${-size * 0.045}" fill="#141414">LOG</text>
    <g transform="translate(${x + size * 2.02} ${y}) skewX(-11)">
      <text x="0" y="0" font-family="${FONT}" font-size="${size * 1.18}" font-weight="900"
            fill="#d3131b">X</text>
    </g>
    <text x="${x + size * 0.06}" y="${y + sub * 1.9}" font-family="${FONT}" font-size="${sub}"
          font-weight="700" letter-spacing="${sub * 0.42}"
          fill="${subdued ? '#8b8b8b' : '#5d5d5d'}">NETWORK</text>
  `;
}

// The default card, used by every page that does not set its own image.
async function buildBrandCard(outputPath) {
  const strip = ['fiber-panel-24', 'keystone-cat6a', 'patch-cord-cat6-long', 'fiber-cord-om3'];
  const thumbs = [];

  for (let i = 0; i < strip.length; i++) {
    const source = path.join(OUT, `${strip[i]}-01.webp`);
    if (!fs.existsSync(source)) continue;
    const buffer = await sharp(source).resize(170, 170, {fit: 'contain', background: CANVAS}).toBuffer();
    thumbs.push({input: buffer, left: 640 + i * 140, top: 230});
  }

  const overlay = Buffer.from(`
    <svg width="${OG.width}" height="${OG.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${OG.width}" height="${OG.height}" fill="#fafafa"/>
      <rect width="${OG.width}" height="14" fill="#d3131b"/>
      ${wordmark({x: 80, y: 250, size: 92})}
      <text x="82" y="360" font-family="${FONT}" font-size="34" font-weight="700" fill="#141414">
        Connectivity solutions
      </text>
      <text x="82" y="410" font-family="${FONT}" font-size="25" fill="#5d5d5d">
        CAT6 · CAT6A copper · OS2 · OM3 fiber · racks
      </text>
      <rect x="82" y="450" width="120" height="5" fill="#d3131b"/>
    </svg>
  `);

  await sharp({
    create: {width: OG.width, height: OG.height, channels: 3, background: CANVAS}
  })
    .composite([{input: overlay, left: 0, top: 0}, ...thumbs])
    .png()
    .toFile(outputPath);
}

// One card per family: the product on white, branded. Deliberately carries no
// part number -- a family's card is shared by every length in it, so a printed
// part number would be wrong for all but one of them. The exact name and part
// number reach the preview through og:title and og:description.
async function buildProductCard(sourcePath, outputPath) {
  const photo = await sharp(sourcePath)
    .resize(470, 470, {fit: 'contain', background: CANVAS})
    .toBuffer();

  const overlay = Buffer.from(`
    <svg width="${OG.width}" height="${OG.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${OG.width}" height="${OG.height}" fill="#fafafa"/>
      <rect width="${OG.width}" height="14" fill="#d3131b"/>
      ${wordmark({x: 80, y: 130, size: 48})}
      <rect x="80" y="560" width="110" height="5" fill="#d3131b"/>
    </svg>
  `);

  await sharp({
    create: {width: OG.width, height: OG.height, channels: 3, background: CANVAS}
  })
    .composite([
      {input: overlay, left: 0, top: 0},
      {input: photo, left: Math.round((OG.width - 470) / 2), top: 90}
    ])
    .jpeg({quality: 86})
    .toFile(outputPath);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source folder not found: ${SRC}`);
    process.exit(1);
  }

  const files = sourceFiles();
  fs.mkdirSync(OUT, {recursive: true});

  const manifest = {};
  let written = 0;

  for (const [family, indices] of Object.entries(families)) {
    manifest[family] = [];
    for (let position = 0; position < indices.length; position++) {
      const sourceName = files[indices[position]];
      if (!sourceName) {
        console.warn(`  ! ${family}[${position}] -> index ${indices[position]} is out of range`);
        continue;
      }
      const name = `${family}-${String(position + 1).padStart(2, '0')}.webp`;
      await processPhoto(path.join(SRC, sourceName), path.join(OUT, name), rotations[indices[position]] ?? 0);
      manifest[family].push({source: sourceName, output: `/products/photos/${name}`});
      written++;
    }
    console.log(`  ${family.padEnd(24)} ${manifest[family].length} photo(s)`);
  }

  // Link-preview cards: one per family, plus the site-wide default.
  const ogNames = new Set();
  for (const [family, entries] of Object.entries(manifest)) {
    if (family.startsWith('brand-') || !entries.length) continue;
    const name = `${family}-og.jpg`;
    await buildProductCard(path.join(OUT, path.basename(entries[0].output)), path.join(OUT, name));
    ogNames.add(name);
  }
  await buildBrandCard(path.join(ROOT, 'public', 'og-default.png'));
  console.log(`  ${'open graph'.padEnd(24)} ${ogNames.size} product card(s) + 1 default`);

  // Drop files left behind by a family that shrank or was renamed.
  const expected = new Set([
    ...Object.values(manifest)
      .flat()
      .map((entry) => path.basename(entry.output)),
    ...ogNames
  ]);
  const orphans = fs.readdirSync(OUT).filter((name) => !expected.has(name));
  for (const orphan of orphans) fs.unlinkSync(path.join(OUT, orphan));

  fs.writeFileSync(
    path.join(ROOT, 'data', 'photo-sources.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  console.log(
    `\nWrote ${written} images to public/products/photos/` +
      (orphans.length ? ` (removed ${orphans.length} stale file(s))` : '')
  );
}

main();
