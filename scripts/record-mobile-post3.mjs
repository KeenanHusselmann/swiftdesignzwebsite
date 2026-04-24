/**
 * record-mobile-post3.mjs — Swift Designz Post 3 "Let's Build Something Great"
 * ──────────────────────────────────────────────────────────────────────────────
 * Records post3 from mobile-posts-static-march2026.html using CDP screencast
 * (push model — no polling, no timing drift, no glitch).
 *
 * Output: public/video-output/mobile-post3-cta.mp4  (1080×1920 · H.264 · 25fps)
 *
 * Usage: node scripts/record-mobile-post3.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML       = path.join(ROOT, 'public', 'mobile-posts-static-march2026.html');
const OUT_DIR    = path.join(ROOT, 'public', 'video-output');
const FRAMES_DIR = path.join(OUT_DIR, '_frames_p3_temp');
const MP4_OUT    = path.join(OUT_DIR, 'mobile-post3-cta.mp4');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT    = { width: 1080, height: 1920, deviceScaleFactor: 1 };
const RECORD_SECS = 9;    // intro animations fire in ~2s; sun + planets loop — 9s shows it all
const OUTPUT_FPS  = 25;

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function removeDir(d) { if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true }); }
function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}
function mb(p) { return (fs.statSync(p).size / 1024 / 1024).toFixed(2); }

(async () => {
  console.log('\n  Swift Designz — Mobile Post 3 Recorder (CDP Screencast)');
  console.log('  ────────────────────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) { console.error('  ERROR: mobile-posts-static-march2026.html not found.'); process.exit(1); }
  if (!hasFfmpeg())         { console.error('  ERROR: ffmpeg not found on PATH.'); process.exit(1); }

  ensureDir(OUT_DIR);
  removeDir(FRAMES_DIR);
  ensureDir(FRAMES_DIR);

  // ── Launch ──────────────────────────────────────────────────────────────
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars',
      '--disable-web-security', '--allow-file-access-from-files',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows', '--disable-ipc-flooding-protection',
      '--force-color-profile=srgb', '--run-all-compositor-stages-before-draw',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Navigate to post3 only via hash isolation
  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}#post3`;
  console.log(`  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  // Let sun corona + planet animations initialise
  await new Promise(r => setTimeout(r, 500));

  // ── CDP Screencast ──────────────────────────────────────────────────────
  const client = await page.createCDPSession();
  const frameBuffer = [];

  client.on('Page.screencastFrame', (event) => {
    frameBuffer.push({ data: event.data, ts: event.metadata.timestamp });
    client.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: 1080,
    maxHeight: 1920,
    everyNthFrame: 2,
  });

  console.log(`  Recording ${RECORD_SECS}s…`);
  await new Promise(r => setTimeout(r, (RECORD_SECS + 1) * 1000));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`  Received ${frameBuffer.length} frames. Saving…`);

  // ── Save frames ─────────────────────────────────────────────────────────
  const t0   = frameBuffer[0]?.ts ?? 0;
  const kept = frameBuffer.filter(f => (f.ts - t0) <= RECORD_SECS + 0.1);

  for (let i = 0; i < kept.length; i++) {
    fs.writeFileSync(
      path.join(FRAMES_DIR, `frame-${String(i).padStart(6, '0')}.jpg`),
      Buffer.from(kept[i].data, 'base64')
    );
    if (i % 50 === 0) process.stdout.write(`\r  Saving: ${i}/${kept.length}`);
  }
  process.stdout.write(`\r  Saved ${kept.length} frames.                   \n\n`);

  // ── ffmpeg concat with real timestamps ─────────────────────────────────
  const lines = [];
  for (let i = 0; i < kept.length; i++) {
    lines.push(`file '${`frame-${String(i).padStart(6, '0')}.jpg`}'`);
    lines.push(`duration ${i < kept.length - 1 ? (kept[i + 1].ts - kept[i].ts).toFixed(6) : '0.040'}`);
  }
  const concatFile = path.join(FRAMES_DIR, 'frames.txt');
  fs.writeFileSync(concatFile, lines.join('\n'));

  // ── Encode ──────────────────────────────────────────────────────────────
  console.log(`  Encoding at ${OUTPUT_FPS}fps (H.264, CRF 15)…`);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -vf "fps=${OUTPUT_FPS}" -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -movflags +faststart "${MP4_OUT}"`,
    { stdio: 'pipe' }
  );

  removeDir(FRAMES_DIR);

  console.log(`\n  Done! ${mb(MP4_OUT)} MB`);
  console.log(`  Output : public/video-output/mobile-post3-cta.mp4`);
  console.log(`  Format : 1080×1920 · H.264 · ${OUTPUT_FPS}fps · mobile ready\n`);
})();
