/**
 * record-immersive-whatsapp.mjs — Swift Designz Immersive Post (WhatsApp Edition)
 * ─────────────────────────────────────────────────────────────────────────────────
 * Records public/immersive-tunnel-post.html as a full-loop 1080×1080 MP4,
 * then automatically splits it into 4 WhatsApp-ready clips (each ≤ 30s).
 *
 *  Clip 1  wa-01-superpower.mp4       Card 1 — "Code Is Our Superpower"     (~13s)
 *  Clip 2  wa-02-delivered.mp4        Card 2 — "Your Vision Delivered"       (~11s)
 *  Clip 3  wa-03-growth.mp4           Card 3 — "Built For Growth"            (~12s)
 *  Clip 4  wa-04-start-project.mp4    Card 4 + Logo Outro                    (~17s)
 *
 * Output directory:  public/images/instagram/whatsapp/
 * Full video also saved as: public/images/instagram/immersive-post.mp4
 *
 * Requirements:
 *   - puppeteer-core  (npm i puppeteer-core)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage:  node scripts/record-immersive-whatsapp.mjs
 *
 * ── TIMING NOTES ─────────────────────────────────────────────────────────────────
 * Derived from the card sequencer in immersive-tunnel-post.html:
 *   Card 0 starts at t=0s, exits at ~12.6s
 *   Card 1 starts at ~12.6s, exits at ~24.0s
 *   Card 2 starts at ~24.0s, exits at ~35.9s
 *   Card 3 + Logo Outro: ~35.9s → ~52s
 *
 * Adjust the CLIPS array below if the timings feel off after a test run.
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { spawnSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML       = path.join(ROOT, 'public', 'immersive-tunnel-post.html');
const OUT_DIR    = path.join(ROOT, 'public', 'images', 'instagram');
const WA_DIR     = path.join(OUT_DIR, 'whatsapp');
const WEBM_TMP   = path.join(OUT_DIR, 'immersive-post.webm');
const MP4_FULL   = path.join(OUT_DIR, 'immersive-post.mp4');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT   = { width: 1080, height: 1080, deviceScaleFactor: 1 };

// One full loop is ~52s. Add a generous buffer so no frame is cut.
const RECORD_MS  = 70_000;

// ── WHATSAPP CLIPS ────────────────────────────────────────────────────────────
// Each clip: { name, start (seconds), dur (seconds), label }
// Adjust start/dur if the animation timing drifts on your machine.
const CLIPS = [
  {
    name:  'wa-01-superpower',
    start: 0,
    dur:   13,
    label: 'Card 1 — Code Is Our Superpower',
  },
  {
    name:  'wa-02-delivered',
    start: 13,
    dur:   11,
    label: 'Card 2 — Your Vision Delivered',
  },
  {
    name:  'wa-03-growth',
    start: 24,
    dur:   12,
    label: 'Card 3 — Built For Growth',
  },
  {
    name:  'wa-04-start-project',
    start: 36,
    dur:   17,
    label: 'Card 4 — Start Your Project + Logo Outro',
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(WA_DIR))  fs.mkdirSync(WA_DIR,  { recursive: true });

function hasFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore', windowsHide: true });
  return r.status !== null && !r.error; // null status = process didn't start
}

/**
 * Run ffmpeg with an args array.
 * Uses spawnSync so Windows native-command stderr does NOT get re-thrown as a
 * Node exception (execSync lifts stderr as an error in PowerShell environments).
 */
function ffmpeg(args) {
  const result = spawnSync('ffmpeg', args, {
    stdio: 'inherit',
    shell: false,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg exited with code ${result.status}`);
}

function kbSize(p) {
  return Math.round(fs.statSync(p).size / 1024);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n  Swift Designz — Immersive Post  (WhatsApp Edition)');
  console.log('  ─────────────────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/immersive-tunnel-post.html not found.');
    process.exit(1);
  }
  if (!hasFfmpeg()) {
    console.error('  ERROR: ffmpeg not found on PATH.');
    console.error('  Download from https://ffmpeg.org/download.html and add to PATH.\n');
    process.exit(1);
  }

  // ── Step 1: Launch browser & record ──────────────────────────────────────
  console.log('  [1/3] Launching browser…');
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
      '--autoplay-policy=no-user-gesture-required',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();

  // Let canvas + CSS animations initialise before we start capturing
  await new Promise(r => setTimeout(r, 1500));

  console.log(`\n  [2/3] Recording ${RECORD_MS / 1000}s @ 1080×1080…`);
  console.log('        (4 cards + logo outro — grab a coffee)\n');

  const recorder = await page.screencast({ path: WEBM_TMP });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await browser.close();

  // ── Step 2: Convert WebM → full MP4 ──────────────────────────────────────
  console.log('\n  [2/3 cont.] Converting WebM → full MP4…');
  ffmpeg([
    '-y', '-i', WEBM_TMP,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p',
    MP4_FULL,
  ]);
  fs.unlinkSync(WEBM_TMP);
  console.log(`  Full video: ${MP4_FULL}  (${kbSize(MP4_FULL)} KB)`);

  // ── Step 3: Slice into WhatsApp clips ────────────────────────────────────
  console.log('\n  [3/3] Slicing into WhatsApp clips…\n');

  for (const clip of CLIPS) {
    const outPath = path.join(WA_DIR, `${clip.name}.mp4`);
    console.log(`  ▸ ${clip.label}`);
    console.log(`    ${clip.start}s → ${clip.start + clip.dur}s  →  ${outPath}`);

    ffmpeg([
      '-y', '-i', MP4_FULL,
      '-ss', String(clip.start), '-t', String(clip.dur),
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outPath,
    ]);

    console.log(`    Size: ${kbSize(outPath)} KB\n`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('  ──────────────────────────────────────────────────────');
  console.log('  Done!  WhatsApp clips saved to:');
  console.log(`  ${WA_DIR}\n`);
  console.log('  Files:');
  for (const clip of CLIPS) {
    const p = path.join(WA_DIR, `${clip.name}.mp4`);
    console.log(`  • ${clip.name}.mp4  (${kbSize(p)} KB)  —  ${clip.dur}s`);
  }
  console.log('\n  TIP: If a clip cuts a card mid-animation, tweak the');
  console.log('       start/dur values in the CLIPS array at the top of');
  console.log('       scripts/record-immersive-whatsapp.mjs and re-run.\n');
})();
