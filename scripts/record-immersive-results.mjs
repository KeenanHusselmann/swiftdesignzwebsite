/**
 * record-immersive-results.mjs — Swift Designz "Small Businesses. Big Results."
 * ────────────────────────────────────────────────────────────────────────────
 * Uses CDP Page.startScreencast (push model) so Chrome sends frames at its
 * own render rate rather than us polling screenshots. Each frame arrives with
 * an accurate timestamp so ffmpeg can encode at the correct speed.
 *
 * Outputs:
 *   public/video-output/immersive-results-post.mp4          ← Full ~28s video
 *   public/video-output/whatsapp-part1-intro.mp4            ← ~7.5s
 *   public/video-output/whatsapp-part2-track-record.mp4     ← ~7s
 *   public/video-output/whatsapp-part3-client-first.mp4     ← ~7s
 *   public/video-output/whatsapp-part4-youre-next.mp4       ← ~8.5s (+ outro)
 *
 * Usage: node scripts/record-immersive-results.mjs
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { execSync }      from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML       = path.join(ROOT, 'public', 'immersive-results-post.html');
const OUT_DIR    = path.join(ROOT, 'public', 'video-output');
const FRAMES_DIR = path.join(OUT_DIR, '_frames_temp');
const MP4_OUT    = path.join(OUT_DIR, 'immersive-results-post.mp4');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT    = { width: 1080, height: 1920, deviceScaleFactor: 1 };
const RECORD_SECS = 28;   // total seconds of animation to capture
const OUTPUT_FPS  = 25;   // final video fps

// WhatsApp split times (card timing from HTML setTimeouts):
//   Card 1: ~0.8s → ~7.0s   Card 2: ~7.5s → ~13s
//   Card 3: ~13.5s → ~19s   Card 4: ~19.5s → ~27s (incl. outro)
const WA_PARTS = [
  { name: 'whatsapp-part1-intro',        start: 0,    end: 7.5  },
  { name: 'whatsapp-part2-track-record', start: 7,    end: 14   },
  { name: 'whatsapp-part3-client-first', start: 13,   end: 20   },
  { name: 'whatsapp-part4-youre-next',   start: 19.5, end: 28   },
];

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}
function removeDir(d) {
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
}
function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}
function mb(filePath) {
  return (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
}

(async () => {
  console.log('\n  Swift Designz — Immersive Results Post Recorder (CDP Screencast)');
  console.log('  ──────────────────────────────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/immersive-results-post.html not found.');
    process.exit(1);
  }
  if (!hasFfmpeg()) {
    console.error('  ERROR: ffmpeg not found on PATH.\n  Install from https://www.gyan.dev/ffmpeg/builds/');
    process.exit(1);
  }

  ensureDir(OUT_DIR);
  removeDir(FRAMES_DIR);
  ensureDir(FRAMES_DIR);

  // ── LAUNCH BROWSER ───────────────────────────────────────────
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

  // Allow canvas + fonts to fully initialise
  await new Promise(r => setTimeout(r, 500));

  // ── OPEN CDP SESSION ─────────────────────────────────────────
  const client = await page.createCDPSession();

  // Each frame: { data: base64jpg, timestamp: seconds }
  const frameBuffer = [];
  let frameIdx = 0;

  client.on('Page.screencastFrame', (event) => {
    frameBuffer.push({ data: event.data, ts: event.metadata.timestamp });
    // ACK immediately so Chrome keeps sending frames
    client.send('Page.screencastFrameAck', { sessionId: event.sessionId })
      .catch(() => {});
  });

  // ── START SCREENCAST ─────────────────────────────────────────
  // everyNthFrame: 2 → ~30fps source; quality 90 for HD clarity
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
    maxWidth: 1080,
    maxHeight: 1920,
    everyNthFrame: 2,
  });

  console.log(`  Recording ${RECORD_SECS}s via CDP screencast…`);

  // Wait for the full animation + a small buffer
  await new Promise(r => setTimeout(r, (RECORD_SECS + 2) * 1000));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`  Received ${frameBuffer.length} frames. Saving JPEG files…`);

  // ── SAVE FRAMES ──────────────────────────────────────────────
  // Normalise: only keep frames within RECORD_SECS from the first frame
  const t0 = frameBuffer[0]?.ts ?? 0;
  const kept = frameBuffer.filter(f => (f.ts - t0) <= RECORD_SECS + 0.1);

  for (let i = 0; i < kept.length; i++) {
    const imgPath = path.join(FRAMES_DIR, `frame-${String(i).padStart(6, '0')}.jpg`);
    fs.writeFileSync(imgPath, Buffer.from(kept[i].data, 'base64'));
    if (i % 50 === 0) {
      process.stdout.write(`\r  Saving: ${i}/${kept.length}`);
    }
  }
  process.stdout.write(`\r  Saved ${kept.length} frames.                    \n\n`);

  // ── BUILD FFMPEG CONCAT FILE (with real timestamps) ──────────
  // ffmpeg concat demuxer with `duration` gives VFR input that preserves
  // the original animation timing exactly.
  const concatLines = [];
  for (let i = 0; i < kept.length; i++) {
    const frameName = `frame-${String(i).padStart(6, '0')}.jpg`;
    concatLines.push(`file '${frameName}'`);
    if (i < kept.length - 1) {
      const dur = (kept[i + 1].ts - kept[i].ts).toFixed(6);
      concatLines.push(`duration ${dur}`);
    } else {
      concatLines.push(`duration 0.040`); // last frame hold
    }
  }
  const concatFile = path.join(FRAMES_DIR, 'frames.txt');
  fs.writeFileSync(concatFile, concatLines.join('\n'));

  // ── ENCODE FULL VIDEO ────────────────────────────────────────
  console.log(`  Encoding full video at ${OUTPUT_FPS}fps (H.264, CRF 15)…`);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -vf "fps=${OUTPUT_FPS}" -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -movflags +faststart "${MP4_OUT}"`,
    { stdio: 'pipe' }
  );
  console.log(`  Full video: ${mb(MP4_OUT)} MB → ${MP4_OUT}\n`);

  // ── SPLIT INTO WHATSAPP PARTS ────────────────────────────────
  console.log('  Splitting into WhatsApp parts…\n');
  for (const part of WA_PARTS) {
    const outPath = path.join(OUT_DIR, `${part.name}.mp4`);
    const duration = (part.end - part.start).toFixed(2);
    execSync(
      `ffmpeg -y -i "${MP4_OUT}" -ss ${part.start} -t ${duration} -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -movflags +faststart "${outPath}"`,
      { stdio: 'pipe' }
    );
    console.log(`  ✓  ${part.name}.mp4  (${duration}s · ${mb(outPath)} MB)`);
  }

  // ── CLEANUP ──────────────────────────────────────────────────
  removeDir(FRAMES_DIR);

  console.log('\n  ─────────────────────────────────────────────────────');
  console.log(`  Full video  : public/video-output/immersive-results-post.mp4`);
  console.log(`  WhatsApp    : 4 parts in public/video-output/`);
  console.log(`  Format      : 1080×1920 HD · H.264 · ${OUTPUT_FPS}fps · mobile ready`);
  console.log('  ─────────────────────────────────────────────────────\n');
})();
