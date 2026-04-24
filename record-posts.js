/**
 * Swift Designz � True HD Video Recorder
 *
 * Quality strategy:
 *   - Scrubs CSS animations to exact time positions via Web Animations API
 *     (currentTime scrubbing) � no timing drift, frame-perfect animation
 *   - Captures lossless PNG frames piped directly to ffmpeg stdin
 *     (bypasses Playwright's internal JPEG screencaster)
 *   - CRF 18 H.264 encode � visually lossless, uses 20-50 Mbps as needed
 *   - -tune animation � H.264 profile tuned for animated/graphic content
 *
 * Run: node record-posts.js
 */

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const path         = require('path');
const fs           = require('fs');

const POSTS = [
  { file: 'public/video-post-1-deserves-better.html',              name: 'post-1-deserves-better'   },
  { file: 'public/video-post-2-why-swift.html',                    name: 'post-2-why-swift'          },
  { file: 'public/video-post-3-logo-showcase.html',                name: 'post-3-logo-showcase'      },
  { file: 'public/mobile-posts-static-march2026.html#post1',       name: 'mobile-post-1-services'    },
  { file: 'public/mobile-posts-static-march2026.html#post2',       name: 'mobile-post-2-pricing'     },
  { file: 'public/mobile-posts-static-march2026.html#post3',       name: 'mobile-post-3-cta'         },
];

const OUTPUT_FPS   = 30;
const ANIM_SECONDS = 16;
const FRAMES       = OUTPUT_FPS * ANIM_SECONDS;  // 480
const WIDTH        = 1080;
const HEIGHT       = 1920;
const CRF          = '18';
const OUTPUT_DIR   = path.resolve('public/video-output');

async function recordPost(browser, post) {
  const outPath = path.join(OUTPUT_DIR, `${post.name}.mp4`);

  const ff = spawn('ffmpeg', [
    '-y',
    '-f',        'image2pipe',
    '-vcodec',   'png',
    '-r',        String(OUTPUT_FPS),
    '-i',        'pipe:0',
    '-vcodec',   'libx264',
    '-crf',      CRF,
    '-preset',   'slow',
    '-tune',     'animation',
    '-pix_fmt',  'yuv420p',
    '-r',        String(OUTPUT_FPS),
    '-movflags', '+faststart',
    outPath,
  ], { stdio: ['pipe', 'ignore', 'ignore'] });

  ff.stdin.setMaxListeners(0);
  ff.on('error', (err) => { throw err; });

  const context = await browser.newContext({
    viewport:          { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const [filePart, hashPart] = post.file.split('#');
  const absPath = path.resolve(filePart).replace(/\\/g, '/');
  const url = hashPart ? `file:///${absPath}#${hashPart}` : `file:///${absPath}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait one RAF tick so all CSS animations register in the WAAPI tree
  await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

  process.stdout.write(`   Capturing ${FRAMES} frames `);

  for (let i = 0; i < FRAMES; i++) {
    const frameTimeMs = (i / OUTPUT_FPS) * 1000;

    // Scrub every animation to the exact time this frame represents
    await page.evaluate((t) => {
      document.getAnimations().forEach(a => {
        a.pause();
        a.currentTime = t;
      });
      return new Promise(r => requestAnimationFrame(r));
    }, frameTimeMs);

    const buf = await page.screenshot({ type: 'png' });

    if (!ff.stdin.write(buf)) {
      await new Promise(resolve => ff.stdin.once('drain', resolve));
    }

    if ((i + 1) % 60 === 0) process.stdout.write('.');
  }

  ff.stdin.end();

  await new Promise((resolve, reject) => {
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });

  await context.close();

  const mb = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(` done!\n   Saved -> ${post.name}.mp4  (${mb} MB)\n`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Optional filter: node record-posts.js mobile  -> only runs posts whose name includes 'mobile'
  const filterArg = process.argv[2] || null;
  const postsToRun = filterArg ? POSTS.filter(p => p.name.includes(filterArg)) : POSTS;

  console.log('\n Swift Designz -- True HD Video Recorder');
  console.log(` ${WIDTH}x${HEIGHT}  |  CRF ${CRF} (visually lossless)  |  ${OUTPUT_FPS} fps  |  ${ANIM_SECONDS}s per post`);
  console.log(` Frame-perfect: animations scrubbed to exact time via Web Animations API`);
  if (filterArg) console.log(` Filter: '${filterArg}' -> ${postsToRun.length} post(s)`);
  console.log('');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  for (const post of postsToRun) {
    console.log(` -> ${post.name}`);
    await recordPost(browser, post);
  }

  await browser.close();
  console.log(' All done! Upload .mp4 files directly to Instagram Reels, TikTok, or YouTube Shorts.\n');
}

main().catch(err => {
  console.error('\n Error:', err.message);
  process.exit(1);
});
