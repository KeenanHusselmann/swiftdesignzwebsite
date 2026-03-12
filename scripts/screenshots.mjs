import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://swiftdesignz.co.za";

const PAGES = [
  { name: "home",       path: "/" },
  { name: "about",      path: "/about" },
  { name: "services",   path: "/services" },
  { name: "packages",   path: "/packages" },
  { name: "portfolio",  path: "/portfolio" },
  { name: "contact",    path: "/contact" },
];

// iPhone 14 Pro dimensions
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

async function run() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const pg of PAGES) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );

    const url = BASE + pg.path;
    console.log(`Capturing: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Dismiss splash screen if present (click/drag unlock)
    await page.waitForTimeout(2000);
    try {
      // Try pressing Escape or clicking to dismiss
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    } catch {}

    // Scroll slowly to trigger lazy load / animations
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = 300;
        const delay = 120;
        const timer = setInterval(() => {
          window.scrollBy(0, step);
          y += step;
          if (y >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, delay);
      });
    });

    await page.waitForTimeout(1500);

    // Full-page screenshot
    const file = path.join(outDir, `${pg.name}-mobile.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  Saved: screenshots/${pg.name}-mobile.png`);
    await page.close();
  }

  await browser.close();
  console.log("\nAll done! Check the /screenshots folder.");
}

run().catch(console.error);
