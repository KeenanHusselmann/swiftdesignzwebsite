/**
 * record-whatsapp-april2026.mjs — Swift Designz April 2026 Pack
 * ─────────────────────────────────────────────────────────────────────────────
 * Records public/whatsapp-april2026-pack.html as a full-loop 1080×1080 MP4,
 * then automatically splits it into 5 WhatsApp-ready clips (each ≤ 30s).
 *
 *  Clip 1  wa-apr-01-services.mp4     Services Showcase (Build Your Digital Future)  (~14s)
 *  Clip 2  wa-apr-02-pricing.mp4      Transparent Pricing (Quality At Any Budget)    (~12s)
 *  Clip 3  wa-apr-03-results.mp4      Client Transformations (From Zero To Launched) (~12s)
 *  Clip 4  wa-apr-04-brand.mp4        Brand Personality (Remote. Legendary.)         (~12s)
 *  Clip 5  wa-apr-05-promo.mp4        April 2026 Promo + Logo Outro                  (~20s)
 *
 * Output directory: public/video-output/april2026-pack/
 * Full video also saved as: public/video-output/april2026-pack/april2026-pack-full.mp4
 *
 * Requirements:
 *   - puppeteer-core  (npm i puppeteer-core)
 *   - ffmpeg on PATH  (https://ffmpeg.org/download.html)
 *   - Chrome at the path below
 *
 * Usage: node scripts/record-whatsapp-april2026.mjs
 *
 * ── TIMING NOTES ─────────────────────────────────────────────────────────────
 * Derived from the card sequencer in whatsapp-april2026-pack.html:
 *   Page loads; initial delay 1.4s; cards start at ~1.4s.
 *   Card 1 (services):   t=0s  → ~14s   (zoom-in enter + typing + 6 pills + hold + exit)
 *   Card 2 (pricing):    ~14s  → ~26s   (enter + typing + 4 tiers + hold + exit)
 *   Card 3 (results):    ~26s  → ~38s   (enter + typing + 4 BA rows + hold + exit)
 *   Card 4 (brand):      ~38s  → ~50s   (enter + typing + 6 pills + hold + exit)
 *   Card 5 (promo):      ~50s  → ~62s   (enter + promo tag + typing + CTA + hold + exit)
 *   Logo outro:          ~62s  → ~67s
 *
 * If a clip cuts mid-animation, tweak the start/dur values in the CLIPS array
 * below and re-run.
 */

import puppeteer         from 'puppeteer-core';
import path              from 'path';
import fs                from 'fs';
import { spawnSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'whatsapp-april2026-pack.html');
const OUT_DIR   = path.join(ROOT, 'public', 'video-output', 'april2026-pack');
const WEBM_TMP  = path.join(OUT_DIR, '_april2026-pack.webm');
const MP4_FULL  = path.join(OUT_DIR, 'april2026-pack-full.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT  = { width: 1080, height: 1080, deviceScaleFactor: 1 };

// One full pass is ~67s. Add a generous buffer so no frame is cut.
const RECORD_MS = 85_000;

// ── WHATSAPP CLIPS ────────────────────────────────────────────────────────────
// Adjust start/dur if animation timing drifts on your machine.
const CLIPS = [
  {
    name:  'wa-apr-01-services',
    start: 0,
    dur:   14,
    label: 'Card 1 — Services Showcase (Build Your Digital Future)',
  },
  {
    name:  'wa-apr-02-pricing',
    start: 14,
    dur:   12,
    label: 'Card 2 — Transparent Pricing (Quality At Any Budget)',
  },
  {
    name:  'wa-apr-03-results',
    start: 26,
    dur:   12,
    label: 'Card 3 — Client Results (From Zero To Launched)',
  },
  {
    name:  'wa-apr-04-brand',
    start: 38,
    dur:   12,
    label: 'Card 4 — Brand Personality (Remote. Legendary.)',
  },
  {
    name:  'wa-apr-05-promo',
    start: 50,
    dur:   20,
    label: 'Card 5 — April 2026 Promo + Logo Outro (Free 3-Month Hosting)',
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
  console.log('\n  Swift Designz — April 2026 Pack  (WhatsApp Edition)');
  console.log('  ────────────────────────────────────────────────────\n');
  console.log('  5 cards: Services · Pricing · Results · Brand · Promo\n');

  if (!fs.existsSync(HTML)) {
    console.error('  ERROR: public/whatsapp-april2026-pack.html not found.');
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
  console.log('        (5 content cards + logo outro — grab a coffee)\n');

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
    console.log(`    ${clip.start}s → ${clip.start + clip.dur}s  →  ${clip.name}.mp4`);

    ffmpeg([
      '-y', '-i', MP4_FULL,
      '-ss', String(clip.start), '-t', String(clip.dur),
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p',
      outPath,
    ]);

    console.log(`    Saved  (${kbSize(outPath)} KB)\n`);
  }

  console.log('  ─────────────────────────────────────────────────────');
  console.log(`  All clips saved to: ${OUT_DIR}`);
  console.log('  Ready to share on WhatsApp.\n');
})();
