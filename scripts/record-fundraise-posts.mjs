/**
 * record-fundraise-posts.mjs — Swift Designz Fundraise Post Video Recorder
 * ───────────────────────────────────────────────────────────────────────────
 * Records both fundraise HTML posts as MP4 videos (1080×1080 square).
 *
 * Output:
 *   public/video-output/fundraise-1a-who-is-keenan.mp4
 *   public/video-output/fundraise-1b-the-raise.mp4
 *
 * Requirements:
 *   - puppeteer-core  (already installed)
 *   - ffmpeg on PATH
 *   - Chrome at C:\Program Files\Google\Chrome\Application\chrome.exe
 *
 * Usage: node scripts/record-fundraise-posts.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT  = { width: 1080, height: 1080, deviceScaleFactor: 1 };

const POSTS = [
  {
    html:    'fundraise-who-is-keenan.html',
    webm:    'fundraise-1a-who-is-keenan.webm',
    mp4:     'fundraise-1a-who-is-keenan.mp4',
    label:   'Post 1A — Who Is Keenan?',
    waitMs:  800,
    recordMs: 6_000,
  },
  {
    html:    'fundraise-the-raise.html',
    webm:    'fundraise-1b-the-raise.webm',
    mp4:     'fundraise-1b-the-raise.mp4',
    label:   'Post 1B — The Raise',
    waitMs:  2000,
    recordMs: 6_000,
  },
];

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Fundraise Post Video Recorder');
  console.log('  ───────────────────────────────────────────────\n');

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

  for (const post of POSTS) {
    const htmlPath = path.join(ROOT, 'public', post.html);
    const webmPath = path.join(OUT_DIR, post.webm);
    const mp4Path  = path.join(OUT_DIR, post.mp4);

    if (!fs.existsSync(htmlPath)) {
      console.error(`  ✗ Not found: public/${post.html}`);
      continue;
    }

    console.log(`  Recording: ${post.label} (${post.recordMs / 1000}s)…`);

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
    await page.bringToFront();

    // Let fonts + background settle
    await new Promise(r => setTimeout(r, post.waitMs));

    const recorder = await page.screencast({ path: webmPath });
    await new Promise(r => setTimeout(r, post.recordMs));
    await recorder.stop();
    await page.close();

    if (fs.existsSync(webmPath)) {
      const webmSize = fs.statSync(webmPath).size;
      if (webmSize < 1000) {
        console.error(`  ✗ WebM too small (${webmSize} bytes) — recording likely failed. Skipping MP4 conversion.`);
        fs.unlinkSync(webmPath);
        continue;
      }
    } else {
      console.error(`  ✗ WebM not found — recording failed.`);
      continue;
    }

    console.log(`  Converting → MP4…`);
    execSync(
      `ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -movflags +faststart "${mp4Path}"`,
      { stdio: 'pipe' }
    );

    if (fs.existsSync(webmPath)) fs.unlinkSync(webmPath);

    const sizeMB = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(2);
    console.log(`  ✓ Saved:   public/video-output/${post.mp4}  (${sizeMB} MB)\n`);
  }

  await browser.close();

  console.log('  Done. Both videos ready.\n');
  console.log('  Files:');
  for (const post of POSTS) {
    console.log(`    public/video-output/${post.mp4}`);
  }
  console.log('');
})();
