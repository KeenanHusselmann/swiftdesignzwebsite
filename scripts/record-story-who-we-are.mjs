/**
 * record-story-who-we-are.mjs — Swift Designz "Who We Are" Story Post
 * ─────────────────────────────────────────────────────────────────────
 * Records public/story-post-who-we-are.html as a 9:16 vertical MP4
 * at 1080×1920 (HD mobile story format).
 *
 * Output: public/video-output/story-who-we-are.mp4
 *
 * Requirements:
 *   - puppeteer-core  (already installed)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at C:\Program Files\Google\Chrome\Application\chrome.exe
 *
 * Usage:  node scripts/record-story-who-we-are.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'story-post-who-we-are.html');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output');
const WEBM_OUT  = path.join(OUT_DIR, 'story-who-we-are.webm');
const MP4_OUT   = path.join(OUT_DIR, 'story-who-we-are.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 9:16 HD mobile story — 1080×1920
const VIEWPORT  = { width: 1080, height: 1920, deviceScaleFactor: 1 };

// Record for 8 seconds:
// - All animations stagger in over ~3s
// - Give 5 extra seconds for viewers to read all 3 cards + footer
const RECORD_MS = 8_000;

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n  Swift Designz — "Who We Are" Story Recorder');
  console.log('  ─────────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/story-post-who-we-are.html not found.');
    process.exit(1);
  }

  if (!hasFfmpeg()) {
    console.error('  ERROR: ffmpeg not found on PATH.');
    console.error('  Install from https://www.gyan.dev/ffmpeg/builds/ and add to PATH.\n');
    process.exit(1);
  }

  ensureDir(OUT_DIR);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-ipc-flooding-protection',
      '--force-color-profile=srgb',
      '--run-all-compositor-stages-before-draw',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  // Allow fonts + CSS animations to fully initialise before recording starts
  await new Promise(r => setTimeout(r, 800));

  console.log(`  Recording ${RECORD_MS / 1000}s @ 1080×1920 (HD mobile story)…\n`);

  const recorder = await page.screencast({ path: WEBM_OUT });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await browser.close();

  console.log('  Converting WebM → MP4 (H.264, yuv420p)…');

  execSync(
    `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -movflags +faststart "${MP4_OUT}"`,
    { stdio: 'pipe' }
  );

  // Clean up intermediate webm
  fs.unlinkSync(WEBM_OUT);

  const sizeMB = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(2);
  console.log(`\n  Done!`);
  console.log(`  Output : public/video-output/story-who-we-are.mp4`);
  console.log(`  Size   : ${sizeMB} MB`);
  console.log(`  Format : 1080×1920 HD · H.264 · mobile story ready\n`);
})();
