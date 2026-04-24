/**
 * record-services-pack.mjs — Swift Designz Services Pack (WhatsApp Edition)
 * ─────────────────────────────────────────────────────────────────────────────
 * Records public/whatsapp-services-pack.html as a full-loop 1080×1080 MP4,
 * then automatically splits it into 6 WhatsApp-ready clips (each ≤ 30s).
 *
 *  Clip 1  wa-svc-01-web.mp4           Web Development + pricing        (~13s)
 *  Clip 2  wa-svc-02-ecommerce.mp4     E-Commerce + pricing             (~12s)
 *  Clip 3  wa-svc-03-apps.mp4          Apps & Software + pricing        (~12s)
 *  Clip 4  wa-svc-04-training.mp4      PM & AI Training                 (~12s)
 *  Clip 5  wa-svc-05-why-swift.mp4     Why Swift Designz                (~12s)
 *  Clip 6  wa-svc-06-cta.mp4           Get a Quote + Logo Outro         (~24s)
 *
 * Output directory: public/video-output/services-pack/
 * Full video also saved as: public/video-output/services-pack-full.mp4
 *
 * Requirements:
 *   - puppeteer-core  (npm i puppeteer-core)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage: node scripts/record-services-pack.mjs
 *
 * ── TIMING NOTES ─────────────────────────────────────────────────────────────
 * Derived from the card sequencer in whatsapp-services-pack.html:
 *   Page loads; cards start at ~1.4s.
 *   Card 1 (web):       t=0s  → ~13s   (zoom-in enter + typing + hold + exit)
 *   Card 2 (ecommerce): ~13s  → ~25s
 *   Card 3 (apps):      ~25s  → ~37s
 *   Card 4 (training):  ~37s  → ~49s
 *   Card 5 (why swift): ~49s  → ~62s
 *   Card 6 (cta):       ~62s  → ~71s
 *   Logo outro:         ~71s  → ~76s
 *
 * If a clip cuts a card mid-animation, tweak the start/dur values in
 * the CLIPS array below and re-run.
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { spawnSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'whatsapp-services-pack.html');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output', 'services-pack');
const WEBM_TMP  = path.join(OUT_DIR, '_services-pack.webm');
const MP4_FULL  = path.join(OUT_DIR, 'services-pack-full.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT  = { width: 1080, height: 1080, deviceScaleFactor: 1 };

// One full pass is ~76s. Add a generous buffer so no frame is cut.
const RECORD_MS = 90_000;

// ── WHATSAPP CLIPS ────────────────────────────────────────────────────────────
// Adjust start/dur if animation timing drifts on your machine.
const CLIPS = [
  {
    name:  'wa-svc-01-web',
    start: 0,
    dur:   13,
    label: 'Card 1 — Web Development (Websites That Convert)',
  },
  {
    name:  'wa-svc-02-ecommerce',
    start: 13,
    dur:   12,
    label: 'Card 2 — E-Commerce (Your Store, Live)',
  },
  {
    name:  'wa-svc-03-apps',
    start: 25,
    dur:   12,
    label: 'Card 3 — Apps & Software (Built to Scale)',
  },
  {
    name:  'wa-svc-04-training',
    start: 37,
    dur:   12,
    label: 'Card 4 — PM & AI Training (Skills That Compound)',
  },
  {
    name:  'wa-svc-05-why-swift',
    start: 49,
    dur:   13,
    label: 'Card 5 — Why Swift Designz (Remote. Reliable.)',
  },
  {
    name:  'wa-svc-06-cta',
    start: 62,
    dur:   24,
    label: 'Card 6 — Get a Free Quote + Logo Outro',
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function hasFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore', windowsHide: true });
  return r.status !== null && !r.error;
}

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
  console.log('\n  Swift Designz — Services Pack  (WhatsApp Edition)');
  console.log('  ──────────────────────────────────────────────────\n');
  console.log('  6 cards: Web · E-Commerce · Apps · Training · Why Swift · CTA\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/whatsapp-services-pack.html not found.');
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

  // Let canvas + CSS animations initialise before capturing
  await new Promise(r => setTimeout(r, 1500));

  console.log(`\n  [2/3] Recording ${RECORD_MS / 1000}s @ 1080×1080…`);
  console.log('        (6 service cards + logo outro — grab a coffee)\n');

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
    const outPath = path.join(OUT_DIR, `${clip.name}.mp4`);
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
  console.log(`  ${OUT_DIR}\n`);
  console.log('  Files:');
  for (const clip of CLIPS) {
    const p = path.join(OUT_DIR, `${clip.name}.mp4`);
    console.log(`  • ${clip.name}.mp4  (${kbSize(p)} KB)  —  ${clip.dur}s`);
  }
  console.log('\n  TIP: If a clip cuts a card mid-animation, tweak the');
  console.log('       start/dur values in the CLIPS array near the top');
  console.log('       of scripts/record-services-pack.mjs and re-run.\n');
})();
