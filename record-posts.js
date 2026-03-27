/**
 * Swift Designz — Video Post Recorder (High Quality)
 * Captures PNG frames at 30fps via Playwright → encodes to H.264 MP4
 * via ffmpeg at 8 Mbps for crisp 1080×1920 social-ready output.
 *
 * Run: node record-posts.js
 */

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const path         = require('path');
const fs           = require('fs');

const POSTS = [
  { file: 'public/video-post-1-deserves-better.html', name: 'post-1-deserves-better' },
  { file: 'public/video-post-2-why-swift.html',       name: 'post-2-why-swift'       },
  { file: 'public/video-post-3-logo-showcase.html',   name: 'post-3-logo-showcase'   },
];

const FPS          = 30;
const DURATION_S   = 16;          // seconds to record per post
const WARM_UP_MS   = 800;         // let page render before first frame
const OUTPUT_DIR   = path.resolve('public/video-output');
const WIDTH        = 1080;
const HEIGHT       = 1920;
const BITRATE      = '8000k';     // 8 Mbps — crisp 1080p quality

/** Pipe raw PNG frames into ffmpeg and return a Promise that resolves when encoding finishes */
function encodeMp4(outputPath) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', [
      '-y',                            // overwrite output
      '-f',    'image2pipe',           // read frames from stdin
      '-vcodec','png',
      '-r',    String(FPS),            // input framerate
      '-i',    'pipe:0',              // stdin
      '-vcodec','libx264',
      '-pix_fmt','yuv420p',           // broad compatibility
      '-b:v',  BITRATE,
      '-preset','fast',
      '-movflags','+faststart',        // streaming-friendly
      outputPath,
    ], { stdio: ['pipe', 'ignore', 'ignore'] });

    ff.on('close', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
    ff.on('error', reject);

    // expose the stdin stream so callers can write frames
    encodeMp4._stdin = ff.stdin;
  });
}

async function recordPost(browser, post) {
  const outputPath = path.join(OUTPUT_DIR, `${post.name}.mp4`);
  const absPath    = path.resolve(post.file).replace(/\\/g, '/');
  const fileUrl    = `file:///${absPath}`;

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(WARM_UP_MS);  // let entry animations start

  const totalFrames  = FPS * DURATION_S;
  const frameDelayMs = 1000 / FPS;

  // Start ffmpeg encoder
  const encodePromise = encodeMp4(outputPath);
  const ffStdin       = encodeMp4._stdin;

  process.stdout.write(`   Capturing ${totalFrames} frames`);

  for (let i = 0; i < totalFrames; i++) {
    const frame = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    ffStdin.write(frame);
    if (i % 30 === 0) process.stdout.write('.');
    await page.waitForTimeout(frameDelayMs);
  }

  ffStdin.end();
  await encodePromise;

  process.stdout.write('\n');
  await context.close();
  return outputPath;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('\n Swift Designz — High-Quality Video Recorder');
  console.log(` Resolution : ${WIDTH}×${HEIGHT} (9:16 mobile)`);
  console.log(` Framerate  : ${FPS}fps  |  Bitrate: ${BITRATE}  |  Duration: ${DURATION_S}s`);
  console.log(` Output     : ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--force-device-scale-factor=1'],
  });

  for (const post of POSTS) {
    console.log(` → ${post.name}`);
    const out = await recordPost(browser, post);
    const mb  = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
    console.log(`   Saved → ${path.basename(out)}  (${mb} MB)\n`);
  }

  await browser.close();
  console.log(' All done! Upload the .mp4 files directly to Instagram Reels, TikTok, or YouTube Shorts.\n');
}

main().catch(err => {
  console.error('\n Error:', err.message);
  process.exit(1);
});
