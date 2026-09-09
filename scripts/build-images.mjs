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
import {families} from './photo-map.mjs';

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

async function processPhoto(sourcePath, outputPath) {
  const upright = await sharp(sourcePath).rotate().toBuffer();
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
      await processPhoto(path.join(SRC, sourceName), path.join(OUT, name));
      manifest[family].push({source: sourceName, output: `/products/photos/${name}`});
      written++;
    }
    console.log(`  ${family.padEnd(24)} ${manifest[family].length} photo(s)`);
  }

  // Drop files left behind by a family that shrank or was renamed.
  const expected = new Set(
    Object.values(manifest)
      .flat()
      .map((entry) => path.basename(entry.output))
  );
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
