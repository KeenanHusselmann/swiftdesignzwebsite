/**
 * generate-social-videos.mjs
 *
 * Captures animated frames from social-posts-new-march2026.html and encodes
 * each post as a 1080×1080 MP4 — ready for Instagram Reels, Facebook Reels,
 * and WhatsApp Status.
 *
 * Strategy:
 *   • Puppeteer screenshots each post for CAPTURE_SECONDS of real wall-clock time
 *   • Actual capture fps is derived from elapsed time (so animation plays at
 *     true speed, not sped-up/slowed-down)
 *   • ffmpeg encodes with input-framerate = real fps, output -r 30 — frames are
 *     duplicated so the final video is exactly CAPTURE_SECONDS long at 30fps.
 *
 * Output: public/videos/vid-mar26-0*.mp4  (1080×1080, 30fps H.264, ~5s)
 *
 * Usage: node scripts/generate-social-videos.mjs
 */

import puppeteer    from 'puppeteer-core';
import path         from 'path';
import fs           from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const HTML_FILE  = path.join(ROOT, 'public', 'social-posts-new-march2026.html');
const OUTPUT_DIR = path.join(ROOT, 'public', 'videos');
const FRAMES_TMP = path.join(OUTPUT_DIR, '_frames');
const CHROME     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/** How many seconds of live animation to capture per post */
const CAPTURE_SECS = 5;

const POSTS = [
  { selector: '#post1', file: 'vid-mar26-01-remote'     },
  { selector: '#post2', file: 'vid-mar26-02-services'   },
  { selector: '#post3', file: 'vid-mar26-03-web-ecom'   },
  { selector: '#post4', file: 'vid-mar26-04-apps-train' },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

/**
 * Screenshot the element as fast as Puppeteer allows for CAPTURE_SECS seconds.
 * Returns the number of frames captured.
 */
async function captureFrames(page, selector, framesDir) {
  const el = await page.$(selector);
  if (!el) throw new Error(`Selector not found: ${selector}`);

  const deadline = Date.now() + CAPTURE_SECS * 1000;
  let count = 0;

  while (Date.now() < deadline) {
    await el.screenshot({
      path: path.join(framesDir, `f${String(count).padStart(4, '0')}.jpg`),
      type: 'jpeg',
      quality: 93,
    });
    count++;

    if (count % 5 === 0) {
      const rem = Math.max(0, (deadline - Date.now()) / 1000).toFixed(1);
      process.stdout.write(`  capturing… ${rem}s remaining   \r`);
    }
  }

  process.stdout.write('\n');
  return count;
}

/**
 * Encode captured JPEG frames into an H.264 MP4 via ffmpeg.
 * inputFps is derived from real capture time so animation speed is accurate.
 */
function encode(framesDir, outPath, frameCount) {
  const inputFps = (frameCount / CAPTURE_SECS).toFixed(4);
  const pattern  = `${framesDir.replace(/\\/g, '/')}/f%04d.jpg`;
  const out      = outPath.replace(/\\/g, '/');

  const cmd = [
    'ffmpeg -y',
    `-framerate ${inputFps}`,       // real capture fps → correct animation speed
    `-i "${pattern}"`,
    `-vf "scale=1080:1080"`,        // crisp 1080×1080 for IG / FB / WhatsApp
    `-c:v libx264`,
    `-pix_fmt yuv420p`,             // max compat: iOS, Android, web browsers
    `-crf 20`,                      // quality/size balance (lower = better)
    `-preset fast`,
    `-r 30`,                        // output locked to 30fps
    `-movflags +faststart`,         // web-optimised moov atom at front
    `"${out}"`,
  ].join(' ');

  execSync(cmd, { stdio: 'pipe' });
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  ensureDir(OUTPUT_DIR);
  ensureDir(FRAMES_TMP);

  console.log('\n🎬  Swift Designz — Social Video Generator');
  console.log('─────────────────────────────────────────────');
  console.log(`   ${POSTS.length} posts  ×  ${CAPTURE_SECS}s capture  →  MP4 1080×1080 30fps\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
  });

  const page = await browser.newPage();

  // deviceScaleFactor 2 → 1080×1080 from 540×540 CSS posts
  await page.setViewport({ width: 1400, height: 2400, deviceScaleFactor: 2 });

  const fileUrl = `file:///${HTML_FILE.replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Allow fonts + canvas starfields to fully initialise before frame 1
  await new Promise(r => setTimeout(r, 1500));

  for (const post of POSTS) {
    const framesDir = path.join(FRAMES_TMP, post.file);
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
    fs.mkdirSync(framesDir, { recursive: true });

    console.log(`\n📹  ${post.file}`);

    const frameCount = await captureFrames(page, post.selector, framesDir);
    console.log(`  ${frameCount} frames captured  →  encoding…`);

    const outPath = path.join(OUTPUT_DIR, `${post.file}.mp4`);

    try {
      encode(framesDir, outPath, frameCount);
    } catch (err) {
      console.error(`  ✗ ffmpeg failed:\n${err.stderr?.toString() ?? err.message}`);
      await browser.close();
      process.exit(1);
    }

    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`  ✓ ${post.file}.mp4  (${kb} KB)`);

    // Free disk space: remove frames after each post is encoded
    fs.rmSync(framesDir, { recursive: true });
  }

  await browser.close();

  if (fs.existsSync(FRAMES_TMP)) fs.rmSync(FRAMES_TMP, { recursive: true });

  console.log(`\n✅  Done!`);
  console.log(`   Videos → ${OUTPUT_DIR}\n`);
  console.log('   Tip: upload MP4 directly to Instagram Reels, Facebook Reels, or WhatsApp Status.\n');
})();
