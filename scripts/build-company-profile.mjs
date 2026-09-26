// Renders the company profile page to PDF, one per locale, with headless
// Edge/Chrome, so the PDF a visitor downloads is exactly the document they
// see on the site. Mirrors scripts/build-datasheets.mjs.
//
//   npm run build                    # the profile is a page, so build first
//   npm run build:company-profile    # then this starts the site, prints, shuts it down
//
// Output: public/company-profile/LOGX-Company-Profile-<locale>.pdf, committed.

import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const PORT = Number(process.env.COMPANY_PROFILE_PORT || 3458);
const OUT_DIR = path.join(ROOT, 'public', 'company-profile');
const LOCALES = ['en', 'ar'];

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
      '--virtual-time-budget=6000',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${outputPath}`,
      url
    ],
    {stdio: 'ignore', timeout: 60_000}
  );
  if (result.error) throw result.error;

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
  fs.mkdirSync(OUT_DIR, {recursive: true});

  console.log(`Rendering ${LOCALES.length} company profile PDF(s) with ${path.basename(browser)}`);
  const site = startSite();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logx-cp-'));

  const failures = [];
  const written = new Set();

  try {
    await waitForServer(`http://localhost:${PORT}/en`);

    for (const locale of LOCALES) {
      const file = `LOGX-Company-Profile-${locale}.pdf`;
      const url = `http://localhost:${PORT}/${locale}/company-profile`;
      try {
        printToPdf(browser, url, path.join(OUT_DIR, file), profileDir);
        written.add(file);
        console.log(`  ✓ ${file}`);
      } catch (error) {
        failures.push(`${locale}: ${error.message}`);
        console.log(`  ✗ ${file}`);
      }
    }
  } finally {
    stopSite(site);
    try {
      fs.rmSync(profileDir, {recursive: true, force: true});
    } catch {
      // Windows can still hold the just-closed browser's profile directory
      // locked for a moment; it's in the OS temp dir, so leaving it behind
      // this once is harmless.
    }
  }

  console.log(`\nWrote ${written.size} PDF(s) to public/company-profile/`);
  if (failures.length) {
    console.error(`\n${failures.length} failed:\n  ${failures.join('\n  ')}`);
    process.exitCode = 1;
  }
}

main();
