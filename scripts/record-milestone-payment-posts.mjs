/**
 * record-milestone-payment-posts.mjs — Swift Designz April 2026
 * ─────────────────────────────────────────────────────────────────────────────
 * Records both posts from posts-milestone-payment-april2026.html
 * using sequential page.screenshot() calls (reliable with canvas RAF animations).
 *
 *  Post 0  milestone-7clients.mp4   — "7 Active Clients · Building Across 2 Nations"
 *  Post 1  milestone-payment.mp4    — "Your Way To Pay · Flexible Payment Plans"
 *
 * Output directory: public/video-output/
 * Format: 1080×1080 · H.264 · CRF 15 · 30fps · mobile-ready
 *
 * Usage: node scripts/record-milestone-payment-posts.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'posts-milestone-payment-april2026.html');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT      = { width: 1080, height: 1080, deviceScaleFactor: 1 };
const CAPTURE_FPS   = 15;   // screenshots per second — reliably achievable
const OUTPUT_FPS    = 30;   // ffmpeg output fps (frames duplicated by ffmpeg)
const RECORD_SECS   = 12;

const POSTS = [
  { param: 0, outFile: 'milestone-7clients.mp4',  label: 'Post 0 — 7 Active Clients' },
  { param: 1, outFile: 'milestone-payment.mp4',   label: 'Post 1 — Payment Plans'    },
];

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function removeDir(d) { if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true }); }
function mb(p) { return (fs.statSync(p).size / 1024 / 1024).toFixed(2); }
function hasFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  try { execSync('ffmpeg.exe -version', { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  return false;
}

async function recordPost({ param, outFile, label }) {
  const FRAMES_DIR = path.join(OUT_DIR, `_frames_${param}_tmp`);
  const MP4_OUT    = path.join(OUT_DIR, outFile);
  const fileUrl    = `file:///${HTML.replace(/\\/g, '/')}?post=${param}`;

  console.log(`\n  ── ${label} ──`);
  console.log(`  URL: ${fileUrl}`);

  removeDir(FRAMES_DIR);
  ensureDir(FRAMES_DIR);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars',
      '--disable-web-security', '--allow-file-access-from-files',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows', '--disable-ipc-flooding-protection',
      '--force-color-profile=srgb', '--no-first-run', '--no-default-browser-check',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  // Let the canvas init and starfield ramp up
  await new Promise(r => setTimeout(r, 2000));

  // ── Screenshot loop ───────────────────────────────────────────────────────
  const totalFrames = RECORD_SECS * CAPTURE_FPS;
  const frameInterval = Math.round(1000 / CAPTURE_FPS);  // ms between captures
  const clip = { x: 0, y: 0, width: 1080, height: 1080 };

  console.log(`  Capturing ${totalFrames} frames @ ${CAPTURE_FPS}fps over ${RECORD_SECS}s…`);

  for (let i = 0; i < totalFrames; i++) {
    const t0  = Date.now();
    const jpg = await page.screenshot({ type: 'jpeg', quality: 90, clip });
    fs.writeFileSync(
      path.join(FRAMES_DIR, `frame-${String(i).padStart(6, '0')}.jpg`),
      jpg
    );
    const elapsed = Date.now() - t0;
    const wait    = Math.max(0, frameInterval - elapsed);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    if (i % CAPTURE_FPS === 0) process.stdout.write(`\r  Frame ${i + 1}/${totalFrames}`);
  }
  process.stdout.write(`\r  Captured ${totalFrames} frames.             \n`);

  await browser.close();

  // ── Encode — ffmpeg reads at CAPTURE_FPS, outputs at OUTPUT_FPS ──────────
  console.log(`  Encoding ${OUTPUT_FPS}fps H.264 (CRF 15)…`);
  execSync(
    `ffmpeg -y -framerate ${CAPTURE_FPS} -i "${path.join(FRAMES_DIR, 'frame-%06d.jpg')}" ` +
    `-vf "fps=${OUTPUT_FPS},scale=1080:1080:flags=lanczos,format=yuv420p" ` +
    `-c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -movflags +faststart "${MP4_OUT}"`,
    { stdio: 'pipe' }
  );

  removeDir(FRAMES_DIR);
  console.log(`  Done! ${mb(MP4_OUT)} MB → ${outFile}`);
}

(async () => {
  console.log('\n  Swift Designz — Milestone + Payment Posts Recorder');
  console.log('  ────────────────────────────────────────────────────');

  if (!fs.existsSync(HTML)) {
    console.error(`\n  ERROR: HTML not found:\n  ${HTML}\n`);
    process.exit(1);
  }
  if (!hasFfmpeg()) {
    console.error('\n  ERROR: ffmpeg not found on PATH.\n');
    process.exit(1);
  }

  ensureDir(OUT_DIR);

  for (const post of POSTS) {
    await recordPost(post);
  }

  console.log('\n  All done!');
  console.log(`  public/video-output/milestone-7clients.mp4  — 1080×1080 · ${OUTPUT_FPS}fps`);
  console.log(`  public/video-output/milestone-payment.mp4   — 1080×1080 · ${OUTPUT_FPS}fps\n`);
})();
