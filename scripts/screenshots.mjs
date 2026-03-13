import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://swiftdesignz.co.za";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// iPhone 14 Pro dimensions
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

async function capturePage(browser, url, filename, scrollToBottom = false) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  );
  console.log(`Loading: ${url}`);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Dismiss splash screen cookie if present - set cookie directly
  await page.setCookie({ name: "swift-splash-seen", value: "true", domain: new URL(BASE).hostname });
  await sleep(1500);

  if (scrollToBottom) {
    // Slowly scroll to trigger animations/lazy load, then stay at bottom
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const timer = setInterval(() => {
          y += 400;
          window.scrollTo(0, y);
          if (y >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
        }, 150);
      });
    });
    await sleep(1000);
    // Screenshot of current viewport (bottom of page)
    await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
  } else {
    // Full page screenshot
    await page.screenshot({ path: path.join(outDir, filename), fullPage: true });
  }

  console.log(`  Saved: screenshots/${filename}`);
  await page.close();
}

async function run() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Hero section - full page so hero is visible at top
  await capturePage(browser, BASE + "/", "home-hero-mobile.png", false);

  // Services page - scroll to bottom custom design section
  await capturePage(browser, BASE + "/services", "services-custom-design-mobile.png", true);

  await browser.close();
  console.log("\nDone! Check the /screenshots folder.");
}

run().catch(console.error);
