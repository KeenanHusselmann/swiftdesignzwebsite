/**
 * record-animated-posts.mjs
 * Records each animated post from animated-posts.html as a 7-second MP4.
 *
 * Instagram: 540×540 px  →  public/images/instagram/anim-*.mp4
 * Facebook:  756×396 px  →  public/images/facebook/anim-*.mp4
 *
 * Usage: node scripts/record-animated-posts.mjs
 */

import puppeteer        from 'puppeteer-core';
import path             from 'path';
import fs               from 'fs';
import { execSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML_FILE = path.join(ROOT, 'public', 'animated-posts.html');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const OUT_IG = path.join(ROOT, 'public', 'images', 'instagram');
const OUT_FB = path.join(ROOT, 'public', 'images', 'facebook');

const POSTS = [
  // Instagram square
  { id: 'ig-01', w: 540, h: 540, file: 'anim-ig-01-code-rain',     dir: OUT_IG, dur: 7500  },
  { id: 'ig-02', w: 540, h: 540, file: 'anim-ig-02-stats-counter', dir: OUT_IG, dur: 7500  },
  { id: 'ig-03', w: 540, h: 540, file: 'anim-ig-03-rings-pulse',   dir: OUT_IG, dur: 7500  },
  // Facebook landscape
  { id: 'fb-01', w: 756, h: 396, file: 'anim-fb-01-split-build',   dir: OUT_FB, dur: 7000  },
  { id: 'fb-02', w: 756, h: 396, file: 'anim-fb-02-card-flip',     dir: OUT_FB, dur: 7000  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function toMp4(webm, mp4) {
  execSync(
    `ffmpeg -y -i "${webm}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p "${mp4}"`,
    { stdio: 'pipe' }
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  [OUT_IG, OUT_FB].forEach(ensureDir);

  console.log('\n🎬  Swift Designz — Animated Post Recorder');
  console.log('─────────────────────────────────────────────\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
  });

  for (const post of POSTS) {
    const webm = path.join(post.dir, `${post.file}.webm`);
    const mp4  = path.join(post.dir, `${post.file}.mp4`);

    console.log(`  📹  Recording ${post.file} (${post.w}×${post.h})…`);

    const page = await browser.newPage();
    await page.setViewport({ width: post.w, height: post.h, deviceScaleFactor: 1 });

    const url = `file:///${HTML_FILE.replace(/\\/g, '/')}?post=${post.id}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20_000 });

    // Brief pause for fonts + canvas initialisation
    await wait(350);

    const recorder = await page.screencast({ path: webm });
    await wait(post.dur);
    await recorder.stop();

    await page.close();

    // WebM → MP4
    console.log(`  🔄  Converting → MP4…`);
    try {
      toMp4(webm, mp4);
      const kb = Math.round(fs.statSync(mp4).size / 1024);
      console.log(`  ✓   ${path.basename(mp4)}  (${kb} KB)\n`);
      fs.unlinkSync(webm);
    } catch (err) {
      console.error(`  ✗   ffmpeg failed: ${err.message}`);
    }
  }

  await browser.close();

  console.log('✅  Done!');
  console.log(`   Instagram → ${OUT_IG}`);
  console.log(`   Facebook  → ${OUT_FB}\n`);
})();
