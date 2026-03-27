/**
 * record-immersive-post.mjs — Swift Designz Immersive Space Post
 * ───────────────────────────────────────────────────────────────
 * Records public/immersive-tunnel-post.html as a full-loop MP4
 * at 1080×1080 for Instagram / social media.
 *
 * One full loop ≈ 53s  (4 cards + logo outro)
 *
 * Output:  public/images/instagram/immersive-post.mp4
 *
 * Requirements:
 *   - puppeteer-core  (npm i puppeteer-core)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage:  node scripts/record-immersive-post.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML       = path.join(ROOT, 'public', 'immersive-tunnel-post.html');
const OUT_DIR    = path.join(ROOT, 'public', 'images', 'instagram');
const WEBM_OUT   = path.join(OUT_DIR, 'immersive-post.webm');
const MP4_OUT    = path.join(OUT_DIR, 'immersive-post.mp4');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 1:1 square — 1080×1080 CSS px
const VIEWPORT   = { width: 1080, height: 1080, deviceScaleFactor: 1 };
const RECORD_MS  = 70_000; // 51s full loop + 19s safety buffer

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Immersive Space Post Recorder');
  console.log('  ──────────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/immersive-tunnel-post.html not found.');
    process.exit(1);
  }
  if (!hasFfmpeg()) {
    console.error('  ERROR: ffmpeg not found on PATH.');
    console.error('  Install from https://ffmpeg.org/download.html and add to PATH.\n');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',   // new headless has proper compositor timing
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--disable-web-security',
      '--allow-file-access-from-files',
      // Prevent Chrome from throttling timers / rendering in headless
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-ipc-flooding-protection',
      '--force-color-profile=srgb',
      '--run-all-compositor-stages-before-draw',
      '--autoplay-policy=no-user-gesture-required',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  Loading: ${fileUrl}`);
  // 'load' not 'networkidle0' — Google Fonts CDN requests can prevent network idle
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  // Allow canvas + CSS animations to initialise
  await new Promise(r => setTimeout(r, 1500));

  console.log(`  Recording ${RECORD_MS / 1000}s @ 1080×1080…`);
  console.log(`  (4 cards + logo outro — this will take a while)\n`);

  const recorder = await page.screencast({ path: WEBM_OUT });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await browser.close();

  console.log(`\n  Converting WebM → MP4 via ffmpeg…`);
  execSync(
    `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${MP4_OUT}"`,
    { stdio: 'inherit' }
  );

  const kb = Math.round(fs.statSync(MP4_OUT).size / 1024);
  fs.unlinkSync(WEBM_OUT);

  console.log(`\n  Done!`);
  console.log(`  Output: ${MP4_OUT}`);
  console.log(`  Size:   ${kb} KB\n`);
})();
