import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const HTML   = path.resolve(__dirname, "../public/whatsapp-april2026-static.html");
const OUT    = path.resolve(__dirname, "../public/video-output/april2026-pack");

const CARDS = [
  { n: 0, name: "wa-apr-01-services" },
  { n: 1, name: "wa-apr-02-pricing"  },
  { n: 2, name: "wa-apr-03-results"  },
  { n: 3, name: "wa-apr-04-brand"    },
  { n: 4, name: "wa-apr-05-promo"    },
];

const VIEWPORT = { width: 1080, height: 1080, deviceScaleFactor: 1 };
const SETTLE_MS = 2500; // wait for canvas animation to populate

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
  });

  for (const { n, name } of CARDS) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    const url = `file:///${HTML.replace(/\\/g, "/")}?card=${n}`;
    console.log(`[${n + 1}/5] Loading card ${n}: ${name}`);
    await page.goto(url, { waitUntil: "networkidle0" });
    await sleep(SETTLE_MS);

    const outPath = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: outPath, type: "png", fullPage: false });
    console.log(`       Saved → ${outPath}`);

    await page.close();
  }

  await browser.close();
  console.log("\nDone. All 5 PNGs saved to:");
  console.log(OUT);
})();
