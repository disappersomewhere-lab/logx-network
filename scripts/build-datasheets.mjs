// Renders every datasheet page to PDF with headless Edge/Chrome, so the PDF a
// customer downloads is exactly the sheet they see on the site.
//
//   npm run build            # the sheets are pages, so the site must be built
//   npm run build:datasheets # then this starts it, prints, and shuts it down
//
// Output: public/datasheets/<PART>.pdf, committed. The pages show the PDF's
// size, read from disk at build time, so rebuild once more after generating
// if you want the local preview to show the new sizes; a deploy build always
// sees the committed files.

import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {readRows} from './price-list.mjs';
import {DATASHEET_DIR, datasheetFileFor} from './datasheets.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const PORT = Number(process.env.DATASHEET_PORT || 3457);
const PARALLEL = 3;

const BROWSERS = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

function findBrowser() {
  const found = BROWSERS.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    console.error('No Chromium-based browser found. Set BROWSER_PATH to msedge.exe or chrome.exe.');
    process.exit(1);
  }
  return found;
}

// The parts that get a sheet: in the price list AND covered by authored content.
function sheetTargets() {
  const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8'));
  const families = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'families.json'), 'utf8'));
  const covered = new Set(families.flatMap((family) => family.parts.map((part) => part.partNumber)));
  const listed = new Set(readRows().map((row) => row.partNumber));
  return products.filter((product) => listed.has(product.partNumber) && covered.has(product.partNumber));
}

async function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not come up at ${url}`);
}

function startSite() {
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('No production build found. Run `npm run build` first.');
    process.exit(1);
  }
  const child = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: ROOT,
    shell: true,
    stdio: 'ignore',
    env: {...process.env, NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://logxnetwork.com'}
  });
  return child;
}

function stopSite(child) {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], {stdio: 'ignore'});
  } else {
    child.kill('SIGTERM');
  }
}

function printToPdf(browser, url, outputPath, profileDir) {
  const result = spawnSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profileDir}`,
      '--no-pdf-header-footer',
      // Lets lazy work (image decode, fonts) settle before the print snapshot.
      '--virtual-time-budget=6000',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${outputPath}`,
      url
    ],
    {stdio: 'ignore', timeout: 60_000}
  );
  if (result.error) throw result.error;

  // A PDF that failed to render is usually a near-empty file, not a crash.
  const stat = fs.existsSync(outputPath) ? fs.statSync(outputPath) : null;
  if (!stat || stat.size < 8_000) {
    throw new Error(`Suspiciously small output (${stat?.size ?? 0} bytes) for ${url}`);
  }
  const head = Buffer.alloc(5);
  const fd = fs.openSync(outputPath, 'r');
  fs.readSync(fd, head, 0, 5, 0);
  fs.closeSync(fd);
  if (head.toString() !== '%PDF-') throw new Error(`Not a PDF: ${outputPath}`);
}

async function main() {
  const browser = findBrowser();
  const targets = sheetTargets();
  fs.mkdirSync(DATASHEET_DIR, {recursive: true});

  console.log(`Rendering ${targets.length} datasheet(s) with ${path.basename(browser)}`);
  const site = startSite();

  const profiles = Array.from({length: PARALLEL}, (_, i) =>
    fs.mkdtempSync(path.join(os.tmpdir(), `logx-ds-${i}-`))
  );

  const failures = [];
  const written = new Set();

  try {
    await waitForServer(`http://localhost:${PORT}/en`);

    let next = 0;
    const worker = async (profileDir) => {
      while (next < targets.length) {
        const product = targets[next++];
        const file = datasheetFileFor(product.partNumber);
        const url = `http://localhost:${PORT}/en/products/${product.slug}/datasheet`;
        try {
          printToPdf(browser, url, path.join(DATASHEET_DIR, file), profileDir);
          written.add(file);
          console.log(`  ✓ ${file}`);
        } catch (error) {
          failures.push(`${product.partNumber}: ${error.message}`);
          console.log(`  ✗ ${file}`);
        }
      }
    };
    await Promise.all(profiles.map(worker));
  } finally {
    stopSite(site);
    for (const dir of profiles) fs.rmSync(dir, {recursive: true, force: true});
  }

  // Drop PDFs for parts that no longer get a sheet — but only after a clean
  // run, so a transient render failure never deletes a good file.
  const stale = failures.length
    ? []
    : fs.readdirSync(DATASHEET_DIR).filter((name) => !written.has(name));
  for (const name of stale) fs.unlinkSync(path.join(DATASHEET_DIR, name));

  console.log(`\nWrote ${written.size} PDF(s) to public/datasheets/` + (stale.length ? ` (removed ${stale.length} stale)` : ''));
  if (failures.length) {
    console.error(`\n${failures.length} failed:\n  ${failures.join('\n  ')}`);
    process.exitCode = 1;
  }
}

main();
