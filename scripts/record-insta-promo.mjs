/**
 * record-insta-promo.mjs — Swift Designz Instagram Promo
 * ────────────────────────────────────────────────────────
 * Records public/insta-promo-video.html as a 10-second
 * 1:1 square MP4 at 1080×1080 for Instagram.
 *
 * Output:  public/images/instagram/insta-promo.mp4
 *
 * Requirements:
 *   - puppeteer-core  (already installed)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage:  node scripts/record-insta-promo.mjs
 */

import puppeteer        from 'puppeteer-core';
import path             from 'path';
import fs               from 'fs';
import { execSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'insta-promo-video.html');
const OUT_DIR   = path.join(ROOT, 'public', 'images', 'instagram');
const WEBM_OUT  = path.join(OUT_DIR, 'insta-promo.webm');
const MP4_OUT   = path.join(OUT_DIR, 'insta-promo.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 1:1 — 1080×1080 CSS px, deviceScaleFactor:1
const VIEWPORT  = { width: 1080, height: 1080, deviceScaleFactor: 1 };
const RECORD_MS = 10500; // 10s content + 0.5s tail

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Instagram Promo Recorder');
  console.log('  ──────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/insta-promo-video.html not found.');
    process.exit(1);
  }
  if (!hasFfmpeg()) {
    console.error('  ERROR: ffmpeg not found on PATH.');
    console.error('  Install from https://ffmpeg.org/download.html and add to PATH.\n');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--disable-web-security',
      '--allow-file-access-from-files',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Allow canvas + CSS animations to initialise
  await new Promise(r => setTimeout(r, 400));

  console.log(`  Recording 10s @ 1080×1080…`);
  const recorder = await page.screencast({ path: WEBM_OUT });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await browser.close();

  console.log(`  Converting WebM → MP4 via ffmpeg…`);
  execSync(
    `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${MP4_OUT}"`,
    { stdio: 'inherit' }
  );

  const kb = Math.round(fs.statSync(MP4_OUT).size / 1024);
  fs.unlinkSync(WEBM_OUT);

  console.log(`\n  Done!  ${MP4_OUT}  (${kb} KB)\n`);
})();
