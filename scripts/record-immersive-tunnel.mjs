/**
 * record-immersive-tunnel.mjs — Swift Designz Hex Tunnel Post
 * ─────────────────────────────────────────────────────────────
 * Records public/immersive-tunnel-post.html as a 10-second
 * 1080×1080 MP4 for Instagram / social media.
 *
 * Output:  public/images/instagram/immersive-tunnel.mp4
 * Usage:   node scripts/record-immersive-tunnel.mjs
 */

import puppeteer        from 'puppeteer-core';
import path             from 'path';
import fs               from 'fs';
import { execSync }     from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const HTML      = path.join(ROOT, 'public', 'immersive-tunnel-post.html');
const OUT_DIR   = path.join(ROOT, 'public', 'images', 'instagram');
const WEBM_OUT  = path.join(OUT_DIR, 'immersive-tunnel.webm');
const MP4_OUT   = path.join(OUT_DIR, 'immersive-tunnel.mp4');
const CHROME    = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORT  = { width: 1080, height: 1080, deviceScaleFactor: 1 };
const RECORD_MS = 10500;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function hasFfmpeg() {
  for (const bin of ['ffmpeg', 'ffmpeg.exe']) {
    try { execSync(`${bin} -version`, { stdio: 'ignore', windowsHide: true }); return true; } catch {}
  }
  return false;
}

(async () => {
  console.log('\n  Swift Designz — Hex Tunnel Post Recorder');
  console.log('  ──────────────────────────────────────────\n');

  if (!fs.existsSync(HTML)) { console.error('  ERROR: HTML file not found.'); process.exit(1); }
  if (!hasFfmpeg())         { console.error('  ERROR: ffmpeg not on PATH.');   process.exit(1); }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--hide-scrollbars',
           '--disable-web-security','--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const fileUrl = `file:///${HTML.replace(/\\/g, '/')}`;
  console.log(`  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30_000 });
  await new Promise(r => setTimeout(r, 400));

  console.log(`  Recording 10s @ 1080×1080…`);
  const recorder = await page.screencast({ path: WEBM_OUT });
  await new Promise(r => setTimeout(r, RECORD_MS));
  await recorder.stop();
  await browser.close();

  console.log(`  Converting WebM → MP4…`);
  execSync(
    `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${MP4_OUT}"`,
    { stdio: 'inherit' }
  );

  const kb = Math.round(fs.statSync(MP4_OUT).size / 1024);
  fs.unlinkSync(WEBM_OUT);
  console.log(`\n  Done!  ${MP4_OUT}  (${kb} KB)\n`);
})();
