import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME   = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const HTML     = path.resolve(__dirname, "../public/mobile-persuasion-april2026.html");
const OUT      = path.resolve(__dirname, "../public/video-output/mobile-persuasion");
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2 }; // 2x for retina-quality
const SETTLE   = 2800; // ms — canvas fully animated

const CARDS = [
  { n: 0, name: "mob-01-invisible"  },
  { n: 1, name: "mob-02-phones"     },
  { n: 2, name: "mob-03-rivals"     },
  { n: 3, name: "mob-04-wasting"    },
  { n: 4, name: "mob-05-delay"      },
];

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
    console.log(`[${n + 1}/5] Card ${n} → ${name}`);
    await page.goto(url, { waitUntil: "networkidle0" });
    await sleep(SETTLE);

    const outPath = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: outPath, type: "png", fullPage: false });
    console.log(`       Saved → ${outPath}`);

    await page.close();
  }

  await browser.close();
  console.log("\nDone. All 5 mobile PNGs saved to:");
  console.log(OUT);
})();
