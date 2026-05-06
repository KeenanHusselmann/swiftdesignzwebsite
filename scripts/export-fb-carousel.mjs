import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "public", "marketing");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SLIDE_COUNT = 12;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1080,1080"],
  defaultViewport: { width: 1080, height: 1080, deviceScaleFactor: 2 },
});

const page = await browser.newPage();

// Serve the local HTML via file:// — images load from public/ via Next.js dev server
// Run `npm run dev` first, then this script
const url = "http://localhost:3000/fb-carousel-portfolio.html";
console.log(`Loading: ${url}`);
await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

for (let i = 1; i <= SLIDE_COUNT; i++) {
  const slideEl = await page.$(`#slide-${i}`);
  if (!slideEl) {
    console.warn(`  Slide #${i} not found, skipping.`);
    continue;
  }

  const outFile = path.join(outputDir, `fb-carousel-portfolio-${String(i).padStart(2, "0")}.png`);
  await slideEl.screenshot({ path: outFile });
  console.log(`  Saved slide ${i}: ${outFile}`);
}

await browser.close();
console.log("\nAll done. Files saved to public/marketing/");
