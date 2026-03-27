/**
 * record-promo-video.mjs — Swift Designz Brand Promo
 * ─────────────────────────────────────────────────────
 * Records public/promo-video.html as a 20-second 9:16
 * vertical MP4 at effective 1080×1920 resolution.
 *
 * Output:  public/images/promo-video.mp4
 *
 * Requirements:
 *   - puppeteer-core  (npm i puppeteer-core)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage:  node scripts/record-promo-video.mjs
 */

import puppeteer       from 'puppeteer-core';
import path            from 'path';
import fs              from 'fs';
import { execSync }    from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'promo-video.html');
const OUT_DIR   = path.join(ROOT, 'public', 'images');
const WEBM_OUT  = path.join(OUT_DIR, 'promo-video.webm');
const MP4_OUT   = path.join(OUT_DIR, 'promo-video.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 9:16 — 540×960 CSS px, deviceScaleFactor:2 → effective 1080×1920
const VIEWPORT  = { width: 540, height: 960, deviceScaleFactor: 2 };
const RECORD_MS = 21000; // 20s content + 1s tail buffer

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── ffmpeg check ─────────────────────────────────────────────
function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Brand Promo Recorder');
  console.log('  ──────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/promo-video.html not found.');
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

  // Allow canvas/animations to initialise
  await new Promise(r => setTimeout(r, 400));

  console.log(`  Recording ${RECORD_MS / 1000}s at 540×960 (2x) …`);
  const recorder = await page.screencast({ path: WEBM_OUT });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await page.close();
  await browser.close();

  const webmKb = Math.round(fs.statSync(WEBM_OUT).size / 1024);
  console.log(`  WebM captured: ${webmKb} KB`);

  // ── WebM → MP4 (H.264, yuv420p for broad compatibility) ──
  console.log('  Converting to MP4 …');
  try {
    execSync(
      `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "${MP4_OUT}"`,
      { stdio: 'pipe' }
    );
    const mp4Kb = Math.round(fs.statSync(MP4_OUT).size / 1024);
    console.log(`\n  Done.  promo-video.mp4  (${mp4Kb} KB)`);
    console.log(`  Path:  ${MP4_OUT}\n`);
    fs.unlinkSync(WEBM_OUT);
  } catch (err) {
    console.error('  ffmpeg conversion failed:', err.message);
    console.log(`  Raw WebM kept at: ${WEBM_OUT}\n`);
  }
})();
