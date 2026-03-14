/**
 * Social Media Reel Recorder — Swift Designz
 * ---------------------------------------------
 * Records a separate 9:16 portrait video for each page.
 * Scrolls slowly section-by-section, pausing 3 s on each,
 * stopping just before the footer.
 *
 * Outputs (screenshots/):
 *   reel-home.mp4
 *   reel-about.mp4
 *   reel-services.mp4
 *
 * Usage:  node scripts/record-social-video.mjs
 */

import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { execSync, spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE   = "https://swiftdesignz.co.za";
const sleep  = (ms) => new Promise((r) => setTimeout(r, ms));

// 9:16 portrait - iPhone 14 Pro Max CSS pixels
const VIEWPORT = { width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

// Pages to record
const PAGES = [
  { slug: "/",         label: "Home",     file: "reel-home"     },
  { slug: "/about",    label: "About",    file: "reel-about"    },
  { slug: "/services", label: "Services", file: "reel-services" },
];

// -- ffmpeg check --
function checkFfmpeg() {
  for (const bin of ["ffmpeg", "ffmpeg.exe"]) {
    try { spawnSync(bin, ["-version"], { stdio: "ignore", windowsHide: true }); return true; } catch {}
  }
  return false;
}

// -- Detect section scroll-stops on the current page --
// Returns an array of Y positions (px from top) for each visible section,
// stopping before the footer. Always includes 0 (top of page).
async function getSectionTops(page) {
  return page.evaluate(() => {
    const vh      = window.innerHeight;
    const footer  = document.querySelector("footer");
    const footerY = footer
      ? footer.getBoundingClientRect().top + window.scrollY - 20
      : document.body.scrollHeight;

    const candidates = Array.from(
      document.querySelectorAll("section, main > div, main > article, main > header")
    );

    const tops = [0];
    for (const el of candidates) {
      const rect   = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      // Only include if taller than 100px and clearly before the footer
      if (rect.height > 100 && absTop > vh * 0.4 && absTop < footerY) {
        tops.push(Math.round(absTop));
      }
    }

    // Deduplicate positions within 80px of each other (keep first)
    const deduped = [];
    for (const y of [...new Set(tops)].sort((a, b) => a - b)) {
      if (!deduped.length || y - deduped[deduped.length - 1] > 80) {
        deduped.push(y);
      }
    }
    return deduped;
  });
}

// -- Smooth-scroll from current position to targetY over durationMs --
async function smoothScrollTo(page, targetY, durationMs) {
  await page.evaluate(
    (to, dur) =>
      new Promise((resolve) => {
        const from  = window.scrollY;
        const delta = to - from;
        if (Math.abs(delta) < 2) { resolve(); return; }
        const t0 = performance.now();
        function step(now) {
          const t    = Math.min((now - t0) / dur, 1);
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          window.scrollTo(0, from + delta * ease);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      }),
    targetY,
    durationMs
  );
}

// -- Record one page --
async function recordPage(browser, { slug, label, file }) {
  const webmOut = path.join(outDir, `${file}.webm`);
  const mp4Out  = path.join(outDir, `${file}.mp4`);

  console.log(`\n+-- ${label}  (${BASE}${slug})`);

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(UA);
  await page.setCookie({ name: "swift-splash-seen", value: "true", domain: new URL(BASE).hostname });

  // Load page
  console.log(`|  Loading...`);
  await page.goto(BASE + slug, { waitUntil: "networkidle2", timeout: 40000 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(2000);

  // Detect sections
  const sectionTops = await getSectionTops(page);
  console.log(`|  Sections found: ${sectionTops.length}  -> [${sectionTops.join(", ")}] px`);

  // Start recording
  console.log(`|  Recording...`);
  const recorder = await page.screencast({ path: webmOut });

  // Hold on hero for 3 s
  await sleep(3000);

  // Scroll to each subsequent section
  for (let i = 1; i < sectionTops.length; i++) {
    const from    = sectionTops[i - 1];
    const to      = sectionTops[i];
    const dist    = to - from;
    // Speed: ~80 px/s, clamped 1 s – 3 s
    const scrollMs = Math.min(Math.max(Math.round((dist / 80) * 1000), 1000), 3000);
    console.log(`|  -> section ${i + 1}/${sectionTops.length}  (y=${to}px, scroll ${scrollMs}ms)`);
    await smoothScrollTo(page, to, scrollMs);
    await sleep(3000); // pause 3 s on each section
  }

  // Stop recording
  await recorder.stop();
  await page.close();

  const webmMB = (fs.statSync(webmOut).size / 1024 / 1024).toFixed(1);
  console.log(`|  WebM: ${file}.webm  (${webmMB} MB)`);

  // Convert to MP4
  console.log(`|  Converting to MP4...`);
  execSync(
    `ffmpeg -y -i "${webmOut}" -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart -vf "scale=1080:-2:flags=lanczos" -an "${mp4Out}"`,
    { stdio: "pipe" }
  );
  const mp4MB = (fs.statSync(mp4Out).size / 1024 / 1024).toFixed(1);
  console.log(`+-- OK  ${file}.mp4  (${mp4MB} MB)`);
}

// -- Entry point --
async function run() {
  console.log("\nSwift Designz - Social Reel Recorder (per-page)");
  console.log("=================================================\n");

  if (!checkFfmpeg()) {
    console.error("ERROR: ffmpeg not found.\n");
    console.log("  winget install Gyan.FFmpeg      <- easiest on Windows");
    console.log("  Then open a new terminal and re-run.\n");
    process.exit(1);
  }
  console.log("[OK] ffmpeg detected");

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      "--disable-infobars",
      "--hide-scrollbars",
    ],
  });

  for (const pageConfig of PAGES) {
    await recordPage(browser, pageConfig);
  }

  await browser.close();

  console.log("\nAll done! Files saved in screenshots/");
  console.log("   reel-home.mp4");
  console.log("   reel-about.mp4");
  console.log("   reel-services.mp4\n");
}

run().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
