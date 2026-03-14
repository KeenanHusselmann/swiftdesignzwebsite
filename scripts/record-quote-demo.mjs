/**
 * record-quote-demo.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Records a full walkthrough of the Swift Designz online quote form as an MP4.
 *
 *   Viewport  : 1280 × 800 (desktop, 16:9)
 *   Inputs    : pasted (instant) — not typed — keeps the clip short
 *   API mock  : /api/quote intercepted → {ok:true}  (no real email sent)
 *   Output    : screenshots/quote-demo.mp4
 *
 * Prerequisites
 *   • ffmpeg on PATH    →  winget install Gyan.FFmpeg
 *   • Chrome at default install path
 *
 * Usage
 *   node scripts/record-quote-demo.mjs
 */

import puppeteer             from "puppeteer-core";
import path                  from "path";
import fs                    from "fs";
import { fileURLToPath }     from "url";
import { execSync, spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE     = "https://swiftdesignz.co.za";
const OUT_DIR  = path.join(__dirname, "..", "screenshots");
const WEBM_OUT = path.join(OUT_DIR, "quote-demo.webm");
const MP4_OUT  = path.join(OUT_DIR, "quote-demo.mp4");
const CHROME   = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 1 };

// ── Utilities ─────────────────────────────────────────────────────────────────

function checkFfmpeg() {
  for (const bin of ["ffmpeg", "ffmpeg.exe"]) {
    const r = spawnSync(bin, ["-version"], { stdio: "ignore", windowsHide: true });
    if (!r.error && r.status === 0) return true;
  }
  return false;
}

/**
 * Instant-fill a React-controlled <input> or <textarea>  (simulates paste).
 * Scrolls the element into view, sets value via native setter, fires
 * both "input" and "change" events so React state updates.
 */
async function paste(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`paste: element not found — "${sel}"`);
    el.scrollIntoView({ behavior: "instant", block: "nearest" });
    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, val);
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, selector, value);
}

/**
 * Set a React-controlled <select>.
 * Identified via a unique option value/text it contains, so it works
 * regardless of how many selects are on the page at once.
 */
async function pickSelect(page, uniqueOption, value) {
  await page.evaluate((probe, val) => {
    const el = Array.from(document.querySelectorAll("select")).find((s) =>
      Array.from(s.options).some((o) => o.value === probe || o.text === probe)
    );
    if (!el) return;
    el.scrollIntoView({ behavior: "instant", block: "nearest" });
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")
      .set.call(el, val);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, uniqueOption, value);
}

/**
 * Click the first non-disabled button whose trimmed textContent includes `text`.
 * Scrolls it into view first. Returns true if found, false otherwise.
 */
async function clickBtn(page, text) {
  return page.evaluate((t) => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => !b.disabled && b.textContent.trim().includes(t)
    );
    if (!btn) return false;
    btn.scrollIntoView({ behavior: "instant", block: "nearest" });
    btn.click();
    return true;
  }, text);
}

/** Smooth-scroll to absolute Y position over `ms` milliseconds. */
async function scrollTo(page, targetY, ms = 800) {
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
    ms
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("\nSwift Designz — Quote Demo Recorder");
  console.log("=====================================\n");

  if (!checkFfmpeg()) {
    console.error("ERROR: ffmpeg not found.\n");
    console.log("  winget install Gyan.FFmpeg  ← easiest on Windows");
    console.log("  Then open a new terminal and re-run.\n");
    process.exit(1);
  }
  console.log("[OK] ffmpeg found\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: VIEWPORT,
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

  // Skip the splash screen on first load
  await page.setCookie({
    name:   "swift-splash-seen",
    value:  "true",
    domain: new URL(BASE).hostname,
  });

  // ── Mock /api/quote → instant success, zero real emails sent ──────────────
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("/api/quote") && req.method() === "POST") {
      req.respond({
        status:      200,
        contentType: "application/json",
        body:        JSON.stringify({ ok: true }),
      });
    } else {
      req.continue();
    }
  });

  // ── Load quote page ───────────────────────────────────────────────────────
  console.log("Loading /quote…");
  await page.goto(`${BASE}/quote`, { waitUntil: "networkidle2", timeout: 40000 });
  await sleep(1200);
  await scrollTo(page, 280, 1000);
  await sleep(1000);

  // ── START RECORDING ───────────────────────────────────────────────────────
  console.log("Recording started…\n");
  const recorder = await page.screencast({ path: WEBM_OUT });

  // Hold on hero / page title
  await sleep(2000);

  // Scroll down to reveal the step-progress indicator
  await scrollTo(page, 560, 1200);
  await sleep(1500);

  // ══════════════════════════════════════════════════════════════════════════
  //  STEP 1 — Contact Info
  // ══════════════════════════════════════════════════════════════════════════
  console.log("Step 1: Contact Info");

  await paste(page, 'input[placeholder="Your full name"]',          "Alex Botha");
  await sleep(500);
  await paste(page, 'input[placeholder="your@email.com"]',          "alex@botharetail.co.za");
  await sleep(500);
  await paste(page, 'input[placeholder="+"]',                       "+27 82 555 0123");
  await sleep(400);
  await paste(page, 'input[placeholder="If applicable"]',           "Botha Retail (Pty) Ltd");
  await sleep(400);
  await paste(page, 'input[placeholder*="Cape Town"]',              "Cape Town, South Africa");
  await sleep(800);

  // Scroll to and click Next
  await scrollTo(page, 950, 700);
  await sleep(500);
  await clickBtn(page, "Next");
  await sleep(900);

  // ══════════════════════════════════════════════════════════════════════════
  //  STEP 2 — Service & Package
  // ══════════════════════════════════════════════════════════════════════════
  console.log("Step 2: Service & Package");

  await scrollTo(page, 560, 700);
  await sleep(700);

  // Service tile
  await clickBtn(page, "Website");
  await sleep(700);

  // Package tiles animate in
  await scrollTo(page, 720, 600);
  await sleep(500);
  await clickBtn(page, "Professional");
  await sleep(700);

  await scrollTo(page, 1050, 600);
  await sleep(400);
  await clickBtn(page, "Next");
  await sleep(900);

  // ══════════════════════════════════════════════════════════════════════════
  //  STEP 3 — Project Details
  // ══════════════════════════════════════════════════════════════════════════
  console.log("Step 3: Project Details");

  await scrollTo(page, 560, 700);
  await sleep(600);

  // Description (textarea)
  await paste(
    page,
    "textarea",
    "We need a fully custom website for our 7-store Western Cape retail chain. " +
    "Goal: brand awareness, lead generation, and CRM integration. " +
    "Target audience: affluent homeowners aged 30–55. " +
    "We want smooth animations, a product showcase, and a client testimonials section."
  );
  await sleep(700);

  // Features
  await scrollTo(page, 800, 700);
  await sleep(400);
  for (const f of ["SEO Optimisation", "Contact Form", "Blog / News Section", "Analytics Integration"]) {
    await clickBtn(page, f);
    await sleep(350);
  }

  // Look & feel
  await scrollTo(page, 1150, 700);
  await sleep(500);
  for (const f of ["Clean & Minimal", "Corporate & Professional"]) {
    await clickBtn(page, f);
    await sleep(380);
  }

  // Colour theme
  await scrollTo(page, 1400, 700);
  await sleep(400);
  await clickBtn(page, "Dark theme");
  await sleep(350);
  await clickBtn(page, "Custom brand colours");
  await sleep(380);

  // Vibe keywords
  await scrollTo(page, 1650, 700);
  await sleep(400);
  for (const k of ["Trustworthy", "Premium", "Authoritative"]) {
    await clickBtn(page, k);
    await sleep(320);
  }

  // Timeline + Content Ready selects
  await scrollTo(page, 1950, 700);
  await sleep(500);
  await pickSelect(page, "ASAP (within 2 weeks)",   "2 to 3 months");
  await sleep(500);
  await pickSelect(page, "Yes - ready to go",        "Partially ready");
  await sleep(500);

  // Reference URLs
  await paste(page, 'input[placeholder*="example.com"]', "https://apple.com, https://headspace.com");
  await sleep(600);

  // Next
  await scrollTo(page, 2300, 700);
  await sleep(400);
  await clickBtn(page, "Next");
  await sleep(900);

  // ══════════════════════════════════════════════════════════════════════════
  //  STEP 4 — Review & Submit
  // ══════════════════════════════════════════════════════════════════════════
  console.log("Step 4: Review & Submit");

  await scrollTo(page, 560, 700);
  await sleep(2500); // Let viewer read the summary

  await scrollTo(page, 920, 700);
  await sleep(1500);

  // Budget select  (identified by the "R2,500 to R5,000" option it contains)
  await pickSelect(page, "R2,500 to R5,000", "R10,000 to R25,000");
  await sleep(500);

  // Notes textarea
  await paste(
    page,
    "textarea",
    "We would love a quick 15-min discovery call early next week if possible."
  );
  await sleep(500);

  // How did you hear (identified by the "Google Search" option)
  await pickSelect(page, "Google Search", "Social Media (Instagram / Facebook)");
  await sleep(500);

  // Scroll to Submit button and click
  await scrollTo(page, 1250, 600);
  await sleep(600);
  await clickBtn(page, "Submit Quote Request");
  console.log("Submitted! Waiting for success state…");
  await sleep(3500); // plane animation + React state update

  // ══════════════════════════════════════════════════════════════════════════
  //  SUCCESS — Scroll through the generated quote document
  // ══════════════════════════════════════════════════════════════════════════
  console.log("Scrolling through the quote…");

  await scrollTo(page, 0, 600);
  await sleep(2200); // Hold on "Quote Request Sent!" confirmation bar

  // Measure the quote document's full rendered height
  const docBottom = await page.evaluate(() => {
    const el = document.getElementById("quote-preview");
    if (el) {
      const rect = el.getBoundingClientRect();
      return Math.round(rect.bottom + window.scrollY + 40);
    }
    return document.body.scrollHeight;
  });

  // Scroll through the quote in 8 sections, pausing on each
  const SECTIONS = 8;
  for (let i = 1; i <= SECTIONS; i++) {
    await scrollTo(page, Math.round((docBottom / SECTIONS) * i), 1200);
    await sleep(1800);
  }

  // Final pause
  await sleep(2000);

  // ── STOP RECORDING ────────────────────────────────────────────────────────
  await recorder.stop();
  await browser.close();

  const webmMB = (fs.statSync(WEBM_OUT).size / 1024 / 1024).toFixed(1);
  console.log(`\nWebM: ${webmMB} MB  →  converting to MP4…`);

  execSync(
    `ffmpeg -y -i "${WEBM_OUT}" -c:v libx264 -preset slow -crf 20 ` +
    `-profile:v high -pix_fmt yuv420p -movflags +faststart -an "${MP4_OUT}"`,
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  fs.unlinkSync(WEBM_OUT); // clean up intermediate file

  const mp4MB = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(1);
  console.log(`\nDone!  screenshots/quote-demo.mp4  (${mp4MB} MB)\n`);
}

run().catch(console.error);
