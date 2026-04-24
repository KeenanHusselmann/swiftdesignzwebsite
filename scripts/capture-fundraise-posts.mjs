/**
 * capture-fundraise-posts.mjs — Swift Designz Fundraise Post Capture
 * ─────────────────────────────────────────────────────────────────────
 * Screenshots both fundraise posts at 1080×1080 (WhatsApp/Instagram square).
 * Outputs crisp PNG files ready to share or import into video editors.
 *
 * Output:
 *   public/video-output/fundraise-1a-who-is-keenan.png
 *   public/video-output/fundraise-1b-the-raise.png
 *
 * Requirements:
 *   - puppeteer-core  (already installed)
 *   - Chrome at C:\Program Files\Google\Chrome\Application\chrome.exe
 *
 * Usage: node scripts/capture-fundraise-posts.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const POSTS = [
  {
    html:     'fundraise-who-is-keenan.html',
    out:      'fundraise-1a-who-is-keenan.png',
    label:    'Post 1A — Who Is Keenan?',
    wait:     2000,
    viewport: { width: 1080, height: 1920, deviceScaleFactor: 2 }, // 9:16 portrait
  },
  {
    html:     'fundraise-the-raise.html',
    out:      'fundraise-1b-the-raise.png',
    label:    'Post 1B — The Raise',
    wait:     2500,
    viewport: { width: 1080, height: 1920, deviceScaleFactor: 2 }, // 9:16 portrait
  },
];

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

(async () => {
  console.log('\n  Swift Designz — Fundraise Post Capture');
  console.log('  ─────────────────────────────────────────\n');

  ensureDir(OUT_DIR);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
    defaultViewport: null,
  });

  for (const post of POSTS) {
    const htmlPath = path.join(ROOT, 'public', post.html);
    const outPath  = path.join(OUT_DIR, post.out);

    if (!fs.existsSync(htmlPath)) {
      console.error(`  ✗ Not found: public/${post.html}`);
      continue;
    }

    console.log(`  Capturing: ${post.label}`);
    const page = await browser.newPage();
    await page.setViewport(post.viewport);
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

    // Extra wait for web fonts + CSS animations to settle
    await new Promise(r => setTimeout(r, post.wait));

    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();

    const dpr = post.viewport.deviceScaleFactor;
    const w   = post.viewport.width  * dpr;
    const h   = post.viewport.height * dpr;
    console.log(`  ✓ Saved:    public/video-output/${post.out}  (${w}×${h})`);
  }

  await browser.close();

  console.log('\n  Done. Posts captured (2x retina).\n');
  console.log('  Files:');
  for (const post of POSTS) {
    console.log(`    public/video-output/${post.out}`);
  }
  console.log('');
})();
