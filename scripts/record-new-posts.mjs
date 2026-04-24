/**
 * record-new-posts.mjs — Records post-before-after.html + post-social-proof.html
 * ─────────────────────────────────────────────────────────────────────────────────
 * Uses CDP screencast push model (accurate timestamps, no polling drift).
 * Runs both recordings sequentially in a single browser session.
 *
 * Outputs:
 *   public/video-output/post-before-after.mp4   (1080×1920 · 12s · H.264 · 25fps)
 *   public/video-output/post-social-proof.mp4   (1080×1920 · 12s · H.264 · 25fps)
 *
 * Usage: node scripts/record-new-posts.mjs
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

const VIEWPORT    = { width: 1080, height: 1920, deviceScaleFactor: 1 };
const OUTPUT_FPS  = 25;

const POSTS = [
  {
    name:    'post-before-after',
    html:    'post-before-after.html',
    secs:    12,   // divider at ~1.6s, wipe at ~1.8s, labels ~2.2s, stats ~3.4s, CTA ~5.0s
    label:   'Before & After',
  },
  {
    name:    'post-social-proof',
    html:    'post-social-proof.html',
    secs:    12,   // counters finish ~3.4s, quote ~3.6s, CTA ~4.6s
    label:   'Social Proof',
  },
];

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function removeDir(d) { if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true }); }
function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}
function mb(p) { return (fs.statSync(p).size / 1024 / 1024).toFixed(2); }

async function recordPost(page, post) {
  const htmlPath  = path.join(ROOT, 'public', post.html);
  const framesDir = path.join(OUT_DIR, `_frames_${post.name}_temp`);
  const mp4Out    = path.join(OUT_DIR, `${post.name}.mp4`);

  if (!fs.existsSync(htmlPath)) { console.error(`  ERROR: ${post.html} not found.`); return; }

  removeDir(framesDir);
  ensureDir(framesDir);

  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  console.log(`\n  [${post.label}] Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30_000 });
  await page.bringToFront();
  await new Promise(r => setTimeout(r, 400));

  const client      = await page.createCDPSession();
  const frameBuffer = [];

  client.on('Page.screencastFrame', (event) => {
    frameBuffer.push({ data: event.data, ts: event.metadata.timestamp });
    client.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg', quality: 92,
    maxWidth: 1080, maxHeight: 1920,
    everyNthFrame: 2,
  });

  console.log(`  [${post.label}] Recording ${post.secs}s…`);
  await new Promise(r => setTimeout(r, (post.secs + 1) * 1000));
  await client.send('Page.stopScreencast');
  await client.detach();

  console.log(`  [${post.label}] Received ${frameBuffer.length} frames. Saving…`);

  const t0   = frameBuffer[0]?.ts ?? 0;
  const kept = frameBuffer.filter(f => (f.ts - t0) <= post.secs + 0.1);

  for (let i = 0; i < kept.length; i++) {
    fs.writeFileSync(
      path.join(framesDir, `frame-${String(i).padStart(6, '0')}.jpg`),
      Buffer.from(kept[i].data, 'base64')
    );
    if (i % 60 === 0) process.stdout.write(`\r  Saving: ${i}/${kept.length}`);
  }
  process.stdout.write(`\r  Saved ${kept.length} frames.                   \n`);

  // Concat file with real timestamps
  const lines = [];
  for (let i = 0; i < kept.length; i++) {
    lines.push(`file '${`frame-${String(i).padStart(6, '0')}.jpg`}'`);
    lines.push(`duration ${i < kept.length - 1 ? (kept[i + 1].ts - kept[i].ts).toFixed(6) : '0.040'}`);
  }
  const concatFile = path.join(framesDir, 'frames.txt');
  fs.writeFileSync(concatFile, lines.join('\n'));

  console.log(`  [${post.label}] Encoding at ${OUTPUT_FPS}fps (H.264 CRF 15)…`);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -vf "fps=${OUTPUT_FPS}" -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -movflags +faststart "${mp4Out}"`,
    { stdio: 'pipe' }
  );

  removeDir(framesDir);
  console.log(`  [${post.label}] Done! ${mb(mp4Out)} MB → ${post.name}.mp4`);
}

(async () => {
  console.log('\n  Swift Designz — Batch Post Recorder (CDP Screencast)');
  console.log('  ──────────────────────────────────────────────────────\n');

  if (!hasFfmpeg()) { console.error('  ERROR: ffmpeg not found on PATH.'); process.exit(1); }
  ensureDir(OUT_DIR);

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

  for (const post of POSTS) {
    await recordPost(page, post);
  }

  await browser.close();

  console.log('\n  ──────────────────────────────────────────────────────');
  console.log('  All done! Outputs in public/video-output/');
  for (const post of POSTS) {
    const out = path.join(OUT_DIR, `${post.name}.mp4`);
    if (fs.existsSync(out)) console.log(`    ${post.name}.mp4  (${mb(out)} MB)`);
  }
  console.log();
})();
