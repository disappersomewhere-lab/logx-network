// Rebrands the master product data sheet in LOGX's own identity: the stand-in
// blue header (with its look-alike logo) is replaced by the real vector logo
// on brand ink, and every navy section bar is recoloured to brand red, keeping
// the anti-aliased white lettering intact.
//
//   npm run build:master-sheet
//
// Source: docs/master-sheet/logx-product-data-sheet.jpg (the untouched
// original, kept out of the repo like the other source artwork).
// Output: public/logx-product-data-sheet.{jpg,webp}, committed.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const SRC = process.argv[2] || path.join(ROOT, 'docs', 'master-sheet', 'logx-product-data-sheet.jpg');
const OUT = path.join(ROOT, 'public', 'logx-product-data-sheet');

// Brand tokens, as in app/globals.css
const INK = [20, 20, 20];
const RED = [211, 19, 27];

const BANNER = 53; // rows 0..52 are the original header band
const FOOTER = 638; // a thin navy strip runs along the bottom edge

// The original bars are a flat navy around rgb(4, 48, 109).
const NAVY_LUMA = 43;
const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const isNavy = (r, g, b) => r <= 45 && g >= 25 && g <= 80 && b >= 85 && b <= 150 && b - r >= 60;

// Re-tints a pixel that sat somewhere between navy and white onto the same
// position between `target` and white, so text edges stay smooth.
function retint(data, i, target) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (b - r < 18) return; // neutral: page, rules, photography
  const t = Math.min(1, Math.max(0, (luma(r, g, b) - NAVY_LUMA) / (250 - NAVY_LUMA)));
  for (let k = 0; k < 3; k++) data[i + k] = Math.round(target[k] + (255 - target[k]) * t);
}

// Finds the section bars: navy pixels, dilated so the lettering doesn't split
// a bar in two, grouped into connected blobs, and kept when bar-shaped.
function findBars(data, W, H, C) {
  const mask = new Uint8Array(W * H);
  for (let y = BANNER; y < FOOTER; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      if (isNavy(data[i], data[i + 1], data[i + 2])) mask[y * W + x] = 1;
    }
  }

  const R = 4;
  const horiz = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!mask[y * W + x]) continue;
      for (let dx = Math.max(0, x - R); dx <= Math.min(W - 1, x + R); dx++) horiz[y * W + dx] = 1;
    }
  }
  const grown = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!horiz[y * W + x]) continue;
      for (let dy = Math.max(0, y - R); dy <= Math.min(H - 1, y + R); dy++) grown[dy * W + x] = 1;
    }
  }

  const seen = new Uint8Array(W * H);
  const bars = [];
  for (let start = 0; start < W * H; start++) {
    if (!grown[start] || seen[start]) continue;
    let minX = W, minY = H, maxX = 0, maxY = 0, count = 0;
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % W;
      const y = (p - x) / W;
      if (mask[p]) {
        count++;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q < 0 || q >= W * H || seen[q] || !grown[q]) continue;
        if (Math.abs((q % W) - x) > 1) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    if (count && w >= 80 && h >= 6 && h <= 30 && count / (w * h) > 0.4) {
      bars.push({minX: minX - 2, minY: minY - 2, maxX: maxX + 2, maxY: maxY + 2});
    }
  }
  return bars;
}

async function banner(width) {
  const logoHeight = 36;
  const logo = await sharp(path.join(ROOT, 'public', 'logx-logo-light.svg'), {density: 600})
    .resize({height: logoHeight})
    .png()
    .toBuffer();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${BANNER}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#141414"/>
        <stop offset="0.6" stop-color="#1d1d1d"/>
        <stop offset="1" stop-color="#2a1012"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${BANNER}" fill="url(#bg)"/>
    <rect y="${BANNER - 3}" width="${width}" height="3" fill="rgb(${RED})"/>
    <rect x="128" y="11" width="1.5" height="28" fill="#ffffff" opacity="0.18"/>
    <text x="142" y="23" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="9" font-weight="700"
          letter-spacing="1.6" fill="#ffffff" opacity="0.62">CONNECTIVITY SOLUTIONS</text>
    <text x="142" y="36" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="9"
          letter-spacing="0.4" fill="#ffffff" opacity="0.62">Copper · Fiber · Racks · Power</text>
    <text x="${width - 24}" y="27" text-anchor="end" font-family="Segoe UI, Arial, Helvetica, sans-serif"
          font-size="21" font-weight="800" letter-spacing="0.6" fill="#ffffff">PRODUCT DATA SHEET</text>
    <text x="${width - 24}" y="41" text-anchor="end" font-family="Segoe UI, Arial, Helvetica, sans-serif"
          font-size="10.5" fill="#ffffff" opacity="0.75">Complete Connectivity Solutions for Networks</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .composite([{input: logo, left: 20, top: Math.round((BANNER - 3 - logoHeight) / 2)}])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source sheet not found: ${SRC}`);
    process.exit(1);
  }

  const {data, info} = await sharp(SRC).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const {width: W, height: H, channels: C} = info;

  const bars = findBars(data, W, H, C);
  for (const bar of bars) {
    for (let y = Math.max(BANNER, bar.minY); y <= Math.min(H - 1, bar.maxY); y++) {
      for (let x = Math.max(0, bar.minX); x <= Math.min(W - 1, bar.maxX); x++) retint(data, (y * W + x) * C, RED);
    }
  }
  for (let y = FOOTER; y < H; y++) {
    for (let x = 0; x < W; x++) retint(data, (y * W + x) * C, INK);
  }

  const sheet = sharp(data, {raw: {width: W, height: H, channels: C}}).composite([
    {input: await banner(W), left: 0, top: 0}
  ]);
  const rebranded = await sheet.png().toBuffer();

  await sharp(rebranded).jpeg({quality: 92, mozjpeg: true}).toFile(`${OUT}.jpg`);
  await sharp(rebranded).webp({quality: 88}).toFile(`${OUT}.webp`);
  console.log(`Recoloured ${bars.length} section bars → ${path.relative(ROOT, OUT)}.{jpg,webp}`);
}

main();
