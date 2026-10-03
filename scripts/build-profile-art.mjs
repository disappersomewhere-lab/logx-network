// Generates the two vector backdrops used by the company profile's light
// themes, recreating the artwork in the reference decks under
// "LogX profile example/" (which ship it as vectors, so it cannot be lifted
// out as an image):
//
//   wave.svg  the halftone ribbon of the "wave" theme (Profile example 2)
//   mesh.svg  the low-poly network lattice of the "mesh" theme (example 3)
//
//   npm run build:profile-art
//
// Output is deterministic (seeded), so regenerating produces no diff unless
// the parameters below change. Writes to public/profile/, committed.

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(import.meta.dirname, '..', 'public', 'profile');
const RED = '#e3262b';

/** Small seeded PRNG (mulberry32), so the lattice is the same on every run. */
function prng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

/**
 * A ribbon of dotted strands. Each strand is a cubic curve whose control
 * points drift with the strand index, so neighbouring strands fan apart and
 * twist like the printed ribbon; the round-capped zero-length dashes turn each
 * strand into a row of dots, and the opacity swell gives the halftone falloff.
 */
function wave() {
  const W = 1000;
  const H = 700;
  const strands = 46;
  const paths = [];
  for (let i = 0; i < strands; i++) {
    const t = i / (strands - 1);
    const swell = Math.sin(t * Math.PI);
    const y0 = 760 - t * 140;
    const c1x = 220 + t * 60;
    const c1y = 520 - swell * 260 - t * 120;
    const c2x = 620 - t * 90;
    const c2y = 120 + swell * 240 + t * 60;
    const y1 = -60 + t * 210;
    const opacity = 0.18 + swell * 0.7;
    const width = 1.6 + swell * 1.6;
    paths.push(
      `<path d="M-40 ${r1(y0)}C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${W + 40} ${r1(y1)}" ` +
        `stroke-width="${r1(width)}" stroke-opacity="${r1(opacity * 100) / 100}"/>`
    );
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<g fill="none" stroke="${RED}" stroke-linecap="round" stroke-dasharray="0 5.2">${paths.join('')}</g></svg>\n`
  );
}

/**
 * Scattered nodes joined to their nearest neighbours: grey hairlines with red
 * and grey vertices, densest along the bottom edge and thinning upward, the
 * way the reference lattice rises out of the page foot.
 */
function mesh() {
  const W = 1000;
  const H = 420;
  const rand = prng(20251001);
  const nodes = [];
  for (let i = 0; i < 280; i++) {
    const x = rand() * (W + 80) - 40;
    // Bias toward the bottom: squaring a uniform pulls samples to one end.
    const y = H - rand() ** 1.8 * H * 0.95;
    nodes.push([x, y]);
  }

  const edges = new Set();
  nodes.forEach(([x, y], i) => {
    const nearest = nodes
      .map(([nx, ny], j) => [j, (nx - x) ** 2 + (ny - y) ** 2])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 4);
    for (const [j] of nearest) edges.add(i < j ? `${i}-${j}` : `${j}-${i}`);
  });

  const lines = [...edges].map((key) => {
    const [a, b] = key.split('-').map(Number);
    return `<path d="M${r1(nodes[a][0])} ${r1(nodes[a][1])}L${r1(nodes[b][0])} ${r1(nodes[b][1])}"/>`;
  });
  const dots = nodes.map(([x, y], i) => {
    const red = i % 4 === 0;
    return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${red ? 2.2 : 1.5}" fill="${red ? RED : '#9a9a9a'}"/>`;
  });

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">` +
    `<g stroke="#b9b9b9" stroke-width=".7" stroke-opacity=".75">${lines.join('')}</g>` +
    `<g>${dots.join('')}</g></svg>\n`
  );
}

fs.mkdirSync(OUT_DIR, {recursive: true});
fs.writeFileSync(path.join(OUT_DIR, 'wave.svg'), wave());
fs.writeFileSync(path.join(OUT_DIR, 'mesh.svg'), mesh());
console.log('Wrote public/profile/wave.svg and public/profile/mesh.svg');
