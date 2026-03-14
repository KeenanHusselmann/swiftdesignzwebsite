import puppeteer from "puppeteer-core";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlFile = path.resolve(__dirname, "../public/instagram-launch-pack.html");
const outDir = path.resolve(__dirname, "../public/images/instagram");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  defaultViewport: { width: 1200, height: 800, deviceScaleFactor: 3 },
});

const page = await browser.newPage();

// Load the HTML file and wait for fonts + images
await page.goto(`file:///${htmlFile.replace(/\\/g, "/")}`, {
  waitUntil: "networkidle0",
});

// Extra wait for Google Fonts
await new Promise((r) => setTimeout(r, 1500));

// Find all .post elements
const posts = await page.$$(".post");

const labels = [
  "01-launch-announcement",
  "02-services",
  "03-pricing",
  "04-cta",
  "05-about",
  "06-process",
  "07-link-in-bio",
];

for (let i = 0; i < posts.length; i++) {
  const label = labels[i] ?? `post-${i + 1}`;
  const outPath = path.join(outDir, `${label}.png`);

  await posts[i].screenshot({
    path: outPath,
    omitBackground: false,
  });

  console.log(`✓ ${label}.png`);
}

await browser.close();
console.log(`\nAll ${posts.length} posts saved to public/images/instagram/`);
