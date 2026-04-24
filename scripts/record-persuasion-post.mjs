/**
 * record-persuasion-post.mjs — Swift Designz April 2026
 * ─────────────────────────────────────────────────────────────────────────────
 * Records video-post-8-persuasion.html as a WhatsApp-ready portrait MP4.
 *
 * Output: public/video-output/persuasion-post.mp4
 * Format: 1080×1920 · H.264 · CRF 18 · 30fps · portrait
 *         WhatsApp-friendly: <16 MB, movflags +faststart, yuv420p
 *
 * Usage: node scripts/record-persuasion-post.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML       = path.join(ROOT, 'public', 'video-post-8-persuasion.html');
const OUT_DIR    = path.join(ROOT, 'public', 'video-output');
const FRAMES_DIR = path.join(OUT_DIR, '_frames_persuasion_tmp');
const MP4_OUT    = path.join(OUT_DIR, 'persuasion-post.mp4');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT     = { width: 1080, height: 1920, deviceScaleFactor: 1 };
const OUTPUT_FPS   = 30;
const RECORD_SECS  = 14;   // full animation timeline + hold

function ensureDir(d)  { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function removeDir(d)  { if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true }); }
function mb(p)         { return (fs.statSync(p).size / 1024 / 1024).toFixed(2); }
function hasFfmpeg()   {
  try { execSync('ffmpeg -version', { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Persuasion Post Recorder');
  console.log('  ──────────────────────────────────────────');

  if (!fs.existsSync(HTML)) { console.error(`\n  ERROR: HTML not found:\n  ${HTML}\n`); process.exit(1); }
  if (!hasFfmpeg())         { console.error('\n  ERROR: ffmpeg not found on PATH.\n');   process.exit(1); }

  ensureDir(OUT_DIR);
  removeDir(FRAMES_DIR);
  ensureDir(FRAMES_DIR);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  URL: ${fileUrl}`);

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
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  await new Promise(r => setTimeout(r, 600));

  const client      = await page.createCDPSession();
  const frameBuffer = [];

  client.on('Page.screencastFrame', (event) => {
    frameBuffer.push({ data: event.data, ts: event.metadata.timestamp });
    client.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });

  await client.send('Page.startScreencast', {
    format:        'jpeg',
    quality:       92,
    maxWidth:      1080,
    maxHeight:     1920,
    everyNthFrame: 2,
  });

  console.log(`  Recording ${RECORD_SECS}s…`);
  await new Promise(r => setTimeout(r, (RECORD_SECS + 1) * 1000));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`  Received ${frameBuffer.length} frames. Saving…`);

  const t0   = frameBuffer[0]?.ts ?? 0;
  const kept = frameBuffer.filter(f => (f.ts - t0) <= RECORD_SECS + 0.1);

  for (let i = 0; i < kept.length; i++) {
    fs.writeFileSync(
      path.join(FRAMES_DIR, `frame-${String(i).padStart(6, '0')}.jpg`),
      Buffer.from(kept[i].data, 'base64')
    );
    if (i % 50 === 0) process.stdout.write(`\r  Saving: ${i}/${kept.length}`);
  }
  process.stdout.write(`\r  Saved ${kept.length} frames.                   \n`);

  const lines = [];
  for (let i = 0; i < kept.length; i++) {
    lines.push(`file '${`frame-${String(i).padStart(6, '0')}.jpg`}'`);
    lines.push(`duration ${i < kept.length - 1 ? (kept[i + 1].ts - kept[i].ts).toFixed(6) : '0.040'}`);
  }
  fs.writeFileSync(path.join(FRAMES_DIR, 'frames.txt'), lines.join('\n'));

  console.log(`  Encoding ${OUTPUT_FPS}fps H.264 (CRF 18, WhatsApp-ready)…`);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${path.join(FRAMES_DIR, 'frames.txt')}" ` +
    `-vf "fps=${OUTPUT_FPS},scale=1080:1920:flags=lanczos,format=yuv420p" ` +
    `-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p ` +
    `-profile:v baseline -level 3.1 ` +
    `-movflags +faststart "${MP4_OUT}"`,
    { stdio: 'pipe' }
  );

  removeDir(FRAMES_DIR);

  console.log(`\n  Done! ${mb(MP4_OUT)} MB`);
  console.log(`  Output: ${MP4_OUT}`);
  console.log(`  (WhatsApp-ready: H.264 baseline, yuv420p, faststart)\n`);
})();
