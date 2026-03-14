/**
 * Hero Shooting-Star Screenshot — Swift Designz
 * ───────────────────────────────────────────────
 * Loads the home page, waits for the starfield canvas animation to fill with
 * star trails, then fires a rapid burst of screenshots so you can pick the
 * best frame with the most dramatic shooting-star tails.
 *
 * Outputs: screenshots/hero-star-1.png  …  hero-star-10.png
 *
 * Usage:  node scripts/hero-screenshot.mjs
 */

import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir    = path.join(__dirname, "..", "screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE   = "https://swiftdesignz.co.za";
const sleep  = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Viewport: iPhone 14 Pro Max — tall 9:16 portrait ─────────────────────
const VIEWPORT = {
  width: 430,
  height: 932,
  deviceScaleFactor: 3,   // retina — crisp output at 1290×2796 px
  isMobile: true,
  hasTouch: true,
};

const BURST_COUNT    = 10;   // how many shots to take
const BURST_INTERVAL = 120;  // ms between shots — catches different star positions

async function run() {
  console.log("\nSwift Designz — Hero Shooting-Star Screenshot");
  console.log("===============================================\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      "--hide-scrollbars",
      "--disable-infobars",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 " +
    "(KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
  );

  // Bypass splash screen
  await page.setCookie({
    name:   "swift-splash-seen",
    value:  "true",
    domain: new URL(BASE).hostname,
  });

  console.log("Loading home page...");
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 40000 });

  // Ensure we're at the top (hero section)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

  // Boost the starfield: inject JS that temporarily widens star tails and
  // increases trail length so they look dramatic in a still frame.
  await page.evaluate(() => {
    // Override getContext so any canvas lineTo gets a thicker, brighter stroke
    // (We do this on the existing 2D context via prototype patch)
    const proto = CanvasRenderingContext2D.prototype;
    const _stroke = proto.stroke;
    proto.stroke = function (...args) {
      this.lineWidth = Math.max(this.lineWidth * 2.5, 1.2);
      _stroke.apply(this, args);
    };
  });

  // Wait for the animation to build up lots of star trails
  // The starfield has alpha-blended trails — 4 s gives a rich, layered look
  console.log("Waiting 4 s for starfield animation to build up...");
  await sleep(4000);

  // Take a rapid burst of screenshots (viewport only = hero section)
  console.log(`Taking burst of ${BURST_COUNT} screenshots (${BURST_INTERVAL}ms apart)...\n`);

  for (let i = 1; i <= BURST_COUNT; i++) {
    const filename = path.join(outDir, `hero-star-${i}.png`);
    await page.screenshot({
      path:     filename,
      fullPage: false,  // viewport only = just the hero
      clip: {
        x:      0,
        y:      0,
        width:  VIEWPORT.width,
        height: VIEWPORT.height,
      },
    });
    const kb = Math.round(fs.statSync(filename).size / 1024);
    console.log(`  [${i}/${BURST_COUNT}] hero-star-${i}.png  (${kb} KB)`);

    if (i < BURST_COUNT) await sleep(BURST_INTERVAL);
  }

  await browser.close();

  console.log(`\nDone! ${BURST_COUNT} hero screenshots saved to screenshots/`);
  console.log("Pick the one with the most dramatic shooting-star trails.");
  console.log("Best candidates are usually frames 3-7 where tails are longest.\n");
}

run().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
