/**
 * generate-social-posts.mjs
 * Renders social-posts-pack.html → individual PNGs for Instagram + Facebook.
 *
 * Instagram posts:  1080×1080 px  (540px CSS × deviceScaleFactor 2)
 * Facebook posts:   1512×792 px   (756px CSS × deviceScaleFactor 2)
 *
 * Usage:  node scripts/generate-social-posts.mjs
 */

import puppeteer from 'puppeteer-core';
import path      from 'path';
import fs        from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML_FILE = path.join(ROOT, 'public', 'social-posts-pack.html');

const OUTPUT_DIR_IG = path.join(ROOT, 'public', 'images', 'instagram');
const OUTPUT_DIR_FB = path.join(ROOT, 'public', 'images', 'facebook');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const POSTS = [
  // Instagram square 1:1  (540×540 CSS → 1080×1080 at 2x)
  { selector: '.post-bold-intro',   file: 'ig-01-bold-intro',        dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  { selector: '.post-quote',        file: 'ig-02-quote',              dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  { selector: '.post-logo-hero',    file: 'ig-03-brand-card',         dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  // Facebook 1.91:1  (756×396 CSS → 1512×792 at 2x)
  { selector: '.post-fb-promo',     file: 'fb-01-promo-banner',       dir: OUTPUT_DIR_FB, w: 756, h: 396 },
  { selector: '.post-fb-services',  file: 'fb-02-services-grid',      dir: OUTPUT_DIR_FB, w: 756, h: 396 },
];

// March 2026 new posts — sourced from social-posts-new-march2026.html
const HTML_FILE_MAR26 = path.join(ROOT, 'public', 'social-posts-new-march2026.html');
const POSTS_MAR26 = [
  { selector: '#post1', file: 'ig-mar26-01-remote',     dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  { selector: '#post2', file: 'ig-mar26-02-services',   dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  { selector: '#post3', file: 'ig-mar26-03-web-ecom',   dir: OUTPUT_DIR_IG, w: 540, h: 540 },
  { selector: '#post4', file: 'ig-mar26-04-apps-train', dir: OUTPUT_DIR_IG, w: 540, h: 540 },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function shot(page, selector, outPath) {
  const el = await page.$(selector);
  if (!el) throw new Error(`Selector not found: ${selector}`);
  await el.screenshot({ path: outPath, type: 'png' });
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`  ✓ ${path.basename(outPath)}  (${kb} KB)`);
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  ensureDir(OUTPUT_DIR_IG);
  ensureDir(OUTPUT_DIR_FB);

  console.log('\n🖼  Swift Designz — Social Posts Generator v2');
  console.log('──────────────────────────────────────────────\n');

  // Use a wide viewport so the grid layout renders in one pass.
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
  });

  const page = await browser.newPage();

  // deviceScaleFactor 2 → crisp retina exports
  await page.setViewport({ width: 1400, height: 2400, deviceScaleFactor: 2 });

  const url = `file:///${HTML_FILE.replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Give Google Fonts a moment if they were served from cache
  await new Promise(r => setTimeout(r, 600));

  for (const post of POSTS) {
    const outPath = path.join(post.dir, `${post.file}.png`);
    console.log(`  Capturing ${post.file}…`);
    await shot(page, post.selector, outPath);
  }

  // ── March 2026 posts ──────────────────────────────────────────────────────
  console.log('\n📸  March 2026 posts…\n');
  const url26 = `file:///${HTML_FILE_MAR26.replace(/\\/g, '/')}`;
  await page.goto(url26, { waitUntil: 'networkidle0', timeout: 30_000 });
  // Wait for canvas star animations to initialise and fonts to load
  await new Promise(r => setTimeout(r, 1200));

  for (const post of POSTS_MAR26) {
    const outPath = path.join(post.dir, `${post.file}.png`);
    console.log(`  Capturing ${post.file}…`);
    await shot(page, post.selector, outPath);
  }

  await browser.close();

  console.log(`\n✅  Done!`);
  console.log(`   Instagram → ${OUTPUT_DIR_IG}`);
  console.log(`   Facebook  → ${OUTPUT_DIR_FB}\n`);
})();
