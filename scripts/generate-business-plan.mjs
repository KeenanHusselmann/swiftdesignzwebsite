/**
 * Swift Designz: Business Plan (Funding Application)
 * Professional .docx for funding applications
 * Currency: N$ (Namibian Dollar), pegged 1:1 to ZAR
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, PageNumber, ImageRun,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "docs", "docx");

// ── Colours ──────────────────────────────────────────────
const TEAL      = "30B0B0";
const DARK      = "303030";
const DEEP_TEAL = "307070";
const MID_TEAL  = "509090";
const LIGHT_BG  = "F0FAFA";
const WHITE     = "FFFFFF";

// ── Table helpers ─────────────────────────────────────────
const thin   = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const borders  = { top: thin, bottom: thin, left: thin, right: thin };
const noB      = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const pad      = { top: 80, bottom: 80, left: 140, right: 140 };
const padWide  = { top: 100, bottom: 100, left: 160, right: 160 };
const W = 9360; // content width A4 1" margins

function cell(text, { bold=false, w, shade, align=AlignmentType.LEFT, color=DARK, sz=22, italic=false, top=80, bot=80, left=140, right=140, brd=borders }={}) {
  return new TableCell({
    borders: brd,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top, bottom: bot, left, right },
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, font: "Arial", size: sz, color, italics: italic })],
    })],
  });
}

function hCell(text, w) {
  return cell(text, { bold: true, w, shade: TEAL, color: WHITE, sz: 22 });
}

function subHCell(text, w) {
  return cell(text, { bold: true, w, shade: DEEP_TEAL, color: WHITE, sz: 20 });
}

// ── Typography helpers ────────────────────────────────────
const today = new Date();
const dateStr = today.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

function h1(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 6 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, font: "Arial", size: 34, color: TEAL })],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 27, color: DEEP_TEAL })],
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: MID_TEAL })],
  });
}

function body(text, { after=160, align=AlignmentType.JUSTIFIED, bold=false, italic=false, color=DARK }={}) {
  return new Paragraph({
    spacing: { after },
    alignment: align,
    children: [new TextRun({ text, font: "Arial", size: 22, color, bold, italics: italic })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function rule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD", space: 4 } },
    children: [new TextRun({ text: " ", size: 4 })],
  });
}

function spacer(after=200) {
  return body("", { after });
}

// ── Logo ──────────────────────────────────────────────────
const logoPath = path.join(rootDir, "public", "images", "logo.png");
const hasLogo  = fs.existsSync(logoPath);

// ═════════════════════════════════════════════════════════
// DOCUMENT
// ═════════════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: DARK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 27, bold: true, font: "Arial", color: DEEP_TEAL },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 4 } },
          children: [new TextRun({ text: "Swift Designz  |  Business Plan for Funding  |  Confidential", font: "Arial", size: 18, color: MID_TEAL, italics: true })],
        }),
      ]}),
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "EEEEEE", space: 4 } },
          children: [
            new TextRun({ text: "Swift Designz  \u2022  swiftdesignz.co.za  \u2022  keenan@swiftdesignz.co.za  \u2022  +264 81 853 6789     Page ", font: "Arial", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
          ],
        }),
      ]}),
    },

    children: [

      // ════════════════════════════════════════
      // COVER PAGE
      // ════════════════════════════════════════
      ...(hasLogo ? [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 320 },
        children: [new ImageRun({
          type: "png",
          data: fs.readFileSync(logoPath),
          transformation: { width: 180, height: 180 },
          altText: { title: "Swift Designz", description: "Swift Designz logo", name: "logo" },
        })],
      })] : []),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "SWIFT DESIGNZ", bold: true, font: "Arial", size: 56, color: TEAL })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Software Development Studio", font: "Arial", size: 26, color: DARK })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 10 } },
        children: [new TextRun({ text: " ", size: 8 })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 80 },
        children: [new TextRun({ text: "BUSINESS PLAN FOR FUNDING", bold: true, font: "Arial", size: 40, color: DARK })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Confidential, Prepared in Support of a Funding Application", font: "Arial", size: 24, color: MID_TEAL, italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 700 },
        children: [new TextRun({ text: dateStr, font: "Arial", size: 22, color: "888888" })],
      }),

      // Cover summary stats
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [new TableRow({ children: [
          cell("8\nActive Clients",  { w: 2340, shade: TEAL,      color: WHITE, bold: true, sz: 24, align: AlignmentType.CENTER }),
          cell("6\nService Lines",   { w: 2340, shade: DEEP_TEAL, color: WHITE, bold: true, sz: 24, align: AlignmentType.CENTER }),
          cell("2\nCountries",       { w: 2340, shade: MID_TEAL,  color: WHITE, bold: true, sz: 24, align: AlignmentType.CENTER }),
          cell("N$13,775\nRevenue",   { w: 2340, shade: TEAL,    color: WHITE, bold: true, sz: 24, align: AlignmentType.CENTER }),
        ]})],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // TABLE OF CONTENTS (manual)
      // ════════════════════════════════════════
      h1("Contents"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [8000, 1360],
        rows: [
          ...[
            ["1.  Executive Summary", "3"],
            ["2.  Business Overview", "3"],
            ["3.  Problem & Opportunity", "4"],
            ["4.  Services & Pricing", "4"],
            ["5.  Competitive Advantage", "5"],
            ["6.  Target Market", "5"],
            ["7.  Revenue Model", "6"],
            ["8.  Current Traction", "6"],
            ["9.  Growth Projections", "7"],
            ["10. Operational Plan", "8"],
            ["11. Investment Ask", "8"],
            ["12. Use of Funds", "9"],
            ["13. Roadmap", "9"],
            ["14. Risk & Mitigation", "10"],
            ["15. Team", "11"],
            ["16. Closing Statement", "11"],
          ].map(([title, pg]) => new TableRow({ children: [
            cell(title, { w: 8000, brd: noB }),
            cell(pg,    { w: 1360, brd: noB, align: AlignmentType.RIGHT }),
          ]})),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 1. EXECUTIVE SUMMARY
      // ════════════════════════════════════════
      h1("1. Executive Summary"),
      body("Swift Designz grew out of a real frustration. Keenan Husselmann, a software engineering graduate from NUST in Windhoek, kept watching small businesses get stuck between two bad options: pay a big agency R50,000 for a basic website, or buy a cheap template that looked amateur and fell apart within a year. He believed there was a better way to run a studio. One built on real code, honest pricing, and a genuine care for the quality of what gets delivered."),
      body("Today, Swift Designz has 8 active clients across 6 service lines, including 2 live Shopify e-commerce stores and 6 custom-built websites. Total revenue earned stands at N$13,775 and is growing steadily. Project fees range from N$2,500 for a starter site to N$25,000 for a full-scale application. Every project that is completed also becomes a monthly support retainer at N$800 per client, which means the business earns recurring income long after each job is done. That retainer base grows with every new client delivered."),
      body("Keenan is not dependent on the business alone to survive. He holds a full-time job that brings in N$10,000 each month, earns approximately N$6,000 per month in client project deposits, and receives N$3,000 per month in investment returns. His total personal income sits at N$19,000 per month. A repayment of N$3,000 per month represents just 16% of that figure, meaning repayments are affordable and consistent regardless of what any single month's project revenue looks like."),
      body("The single biggest barrier to the next chapter of Swift Designz is hardware. Building and publishing apps to the Apple App Store legally requires a Mac. Right now, Keenan is operating on a Windows machine, which means he cannot offer or complete iOS development no matter how skilled he is. The N$50,000 requested will be used to purchase an Apple iMac M4 (24-inch, 24GB RAM, 512GB SSD) and cover 12 months of AI-assisted development tool subscriptions. With this in place, Swift Designz can offer full iOS and Android app development, publish directly to both the App Store and Google Play, and serve a significantly larger range of clients. Repayment of N$3,000 per month begins from month one."),

      // ════════════════════════════════════════
      // 2. BUSINESS OVERVIEW
      // ════════════════════════════════════════
      h1("2. Business Overview"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [3200, 6160],
        rows: [
          new TableRow({ children: [cell("Business Name",     { w: 3200, bold: true, shade: LIGHT_BG }), cell("Swift Designz",                                               { w: 6160 })] }),
          new TableRow({ children: [cell("Founder",           { w: 3200, bold: true, shade: LIGHT_BG }), cell("Keenan Husselmann",                                           { w: 6160 })] }),
          new TableRow({ children: [cell("Qualification",     { w: 3200, bold: true, shade: LIGHT_BG }), cell("BSc Software Engineering at NUST, Windhoek",                  { w: 6160 })] }),
          new TableRow({ children: [cell("Founded",           { w: 3200, bold: true, shade: LIGHT_BG }), cell("2024",                                                        { w: 6160 })] }),
          new TableRow({ children: [cell("Headquarters",      { w: 3200, bold: true, shade: LIGHT_BG }), cell("Windhoek, Namibia",                                           { w: 6160 })] }),
          new TableRow({ children: [cell("Service Area",      { w: 3200, bold: true, shade: LIGHT_BG }), cell("Namibia, South Africa, expanding into the SADC region and internationally",  { w: 6160 })] }),
          new TableRow({ children: [cell("Business Model",    { w: 3200, bold: true, shade: LIGHT_BG }), cell("Project-based fees + recurring monthly retainers",            { w: 6160 })] }),
          new TableRow({ children: [cell("Website",           { w: 3200, bold: true, shade: LIGHT_BG }), cell("https://swiftdesignz.co.za",                                  { w: 6160 })] }),
          new TableRow({ children: [cell("Entity Status",     { w: 3200, bold: true, shade: LIGHT_BG }), cell("Sole proprietor, with formal business registration currently in progress",    { w: 6160 })] }),
          new TableRow({ children: [cell("Active Clients",    { w: 3200, bold: true, shade: LIGHT_BG }), cell("8 (2 Shopify stores, 6 websites)",                                                           { w: 6160 })] }),
          new TableRow({ children: [cell("Revenue to Date",   { w: 3200, bold: true, shade: LIGHT_BG }), cell("N$13,775",                                                   { w: 6160 })] }),
          new TableRow({ children: [cell("Partner",           { w: 3200, bold: true, shade: LIGHT_BG }), cell("IT-Guru Online, co-marketing and hosting infrastructure partner",    { w: 6160 })] }),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 3. PROBLEM & OPPORTUNITY
      // ════════════════════════════════════════
      h1("3. Problem & Opportunity"),
      h2("The Problem"),
      body("Walk into almost any small business in Windhoek or Cape Town and ask if they are happy with their website. Most will tell you they either spent too much and got too little, or they used a cheap template that embarrasses them every time they hand out a business card. Proper agencies quote R50,000 for a basic site. Budget freelancers deliver Wix exports that load slowly, break on mobile, and cannot be updated without paying someone again. There is almost no one in the middle: a developer who writes real code, delivers a professional result, and charges a fair and transparent price."),
      h2("The Opportunity"),
      bullet("Namibia and South Africa have a combined population of over 60 million people, and the majority of SMEs remain digitally underserved."),
      bullet("E-commerce adoption is accelerating across Africa. Businesses need stores and platforms that can scale."),
      bullet("AI tools and project management training are high-demand areas as businesses attempt to modernise workflows with limited internal expertise."),
      bullet("The shift to remote-first work normalises hiring a developer based in Namibia for clients in Cape Town, Johannesburg, Durban, or internationally."),
      bullet("There is no single developer/studio in the Namibian market offering the combination of Next.js performance, Shopify e-commerce, Flutter mobile apps, brand design, and training under one roof at published fixed prices."),

      h2("Swift Designz's Position"),
      body("That gap is exactly where Swift Designz operates. It is not an agency with overheads and account managers. It is a skilled developer who takes ownership of every job, communicates directly with the client, and delivers work that actually holds up. That combination of quality, transparency, and personal accountability is genuinely rare in this market."),

      // ════════════════════════════════════════
      // 4. SERVICES & PRICING
      // ════════════════════════════════════════
      h1("4. Services & Pricing"),
      body("All prices are in N$ (Namibian Dollar) and represent starting points. Complex projects are quoted individually based on scope. Every project begins with a free, obligation-free consultation."),
      spacer(100),

      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2200, 1800, 1800, 3560],
        rows: [
          new TableRow({ children: [hCell("Service", 2200), hCell("Tier", 1800), hCell("Price (from)", 1800), hCell("Includes", 3560)] }),
          new TableRow({ children: [cell("Web Development",     { w: 2200, bold: true }), cell("Starter",    { w: 1800 }), cell("N$2,500",  { w: 1800 }), cell("3 pages, mobile responsive, SEO basics, contact form", { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Professional",{ w: 1800 }), cell("N$5,000",  { w: 1800 }), cell("7 pages, custom design, animations, CMS integration",   { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Premium",    { w: 1800 }), cell("N$10,000", { w: 1800 }), cell("10+ pages, full custom, advanced SEO, integrations",     { w: 3560 })] }),
          new TableRow({ children: [cell("E-Commerce",          { w: 2200, bold: true }), cell("Starter",    { w: 1800 }), cell("N$4,000",  { w: 1800 }), cell("20 products, catalogue only, Shopify",                   { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Business",   { w: 1800 }), cell("N$7,500",  { w: 1800 }), cell("100 products, advanced features, payments",              { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Enterprise", { w: 1800 }), cell("N$15,000", { w: 1800 }), cell("Unlimited products, full custom, multi-currency",         { w: 3560 })] }),
          new TableRow({ children: [cell("Mobile Apps",         { w: 2200, bold: true }), cell("MVP",        { w: 1800 }), cell("N$5,000",  { w: 1800 }), cell("Core features, 1 platform (Flutter)",                    { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Standard",   { w: 1800 }), cell("N$12,000", { w: 1800 }), cell("Full features, 2 platforms (iOS + Android)",             { w: 3560 })] }),
          new TableRow({ children: [cell("",                    { w: 2200 }),              cell("Full-Scale", { w: 1800 }), cell("N$25,000+",{ w: 1800 }), cell("Enterprise-grade, cross-platform, backend included",     { w: 3560 })] }),
          new TableRow({ children: [cell("Brand & Design",      { w: 2200, bold: true }), cell("Custom",     { w: 1800 }), cell("Quoted",   { w: 1800 }), cell("Logo, identity, collateral, brand systems",              { w: 3560 })] }),
          new TableRow({ children: [cell("PM & AI Training",    { w: 2200, bold: true }), cell("Workshop",   { w: 1800 }), cell("Custom",   { w: 1800 }), cell("Agile, Scrum, AI workflow, delivered remotely",            { w: 3560 })] }),
          new TableRow({ children: [cell("Support & Retainer",  { w: 2200, bold: true }), cell("Monthly",    { w: 1800 }), cell("N$800/mo", { w: 1800 }), cell("Bug fixes, updates, monitoring, per client post sign-off",{ w: 3560 })] }),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 5. COMPETITIVE ADVANTAGE
      // ════════════════════════════════════════
      h1("5. Competitive Advantage"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [3200, 6160],
        rows: [
          new TableRow({ children: [hCell("Advantage", 3200), hCell("Detail", 6160)] }),
          new TableRow({ children: [cell("Modern tech stack",         { w: 3200, bold: true, shade: LIGHT_BG }), cell("Next.js, TypeScript, Tailwind CSS, Flutter, the same tools used by Vercel, Shopify, and enterprise teams globally. Real code clients own, not drag-and-drop builder exports.", { w: 6160 })] }),
          new TableRow({ children: [cell("Design-first",              { w: 3200, bold: true, shade: LIGHT_BG }), cell("Every project starts from a visual identity perspective. Premium aesthetics and animated interactions that make products look credible and memorable from day one.",               { w: 6160 })] }),
          new TableRow({ children: [cell("Transparent fixed pricing", { w: 3200, bold: true, shade: LIGHT_BG }), cell("Published tiers from N$2,500. Clients know exactly what they are paying before the first meeting. No hourly billing surprises, no hidden fees.",                              { w: 6160 })] }),
          new TableRow({ children: [cell("One person, full stack",    { w: 3200, bold: true, shade: LIGHT_BG }), cell("Clients communicate directly with the developer. No account managers or telephone games. Front-end, back-end, deployment, and support: all by one person, one responsibility.",  { w: 6160 })] }),
          new TableRow({ children: [cell("Fully remote & accessible", { w: 3200, bold: true, shade: LIGHT_BG }), cell("No geographic restrictions. Serves clients across time zones. Lower operational overhead means better pricing for clients.",                                                   { w: 6160 })] }),
          new TableRow({ children: [cell("Partnership leverage",      { w: 3200, bold: true, shade: LIGHT_BG }), cell("IT-Guru Online co-marketing and hosting partnership extends reach, provides infrastructure credibility, and generates mutual referrals.",                                        { w: 6160 })] }),
          new TableRow({ children: [cell("Recurring revenue model",   { w: 3200, bold: true, shade: LIGHT_BG }), cell("Every project completion generates a N$800/month retainer. This creates a compounding passive income base that grows with every client delivered.",                            { w: 6160 })] }),
          new TableRow({ children: [cell("Bilingual capability",      { w: 3200, bold: true, shade: LIGHT_BG }), cell("Full English and Afrikaans service, reaching a wider African market at no extra cost. No competitor in the Namibian market offers this.",                                      { w: 6160 })] }),
        ],
      }),

      // ════════════════════════════════════════
      // 6. TARGET MARKET
      // ════════════════════════════════════════
      h1("6. Target Market"),
      h2("Primary Market"),
      bullet("Small and medium businesses in Namibia and South Africa needing an online presence (website, e-commerce, app) for the first time or needing to replace outdated platforms."),
      bullet("Startups validating product ideas, particularly those seeking MVP apps at N$5,000 before committing large budgets."),
      bullet("Entrepreneurs and sole traders who need professional branding and digital presence on a defined budget."),

      h2("Secondary Market"),
      bullet("Corporate and government departments requiring PM and AI training workshops for their teams."),
      bullet("Existing businesses scaling their e-commerce operations with Shopify and requiring ongoing technical support."),
      bullet("International clients (UK, Europe, US, Middle East) leveraging competitive pricing and remote delivery."),

      h2("Market Size"),
      body("Namibia has approximately 60,000 registered SMEs. South Africa has over 3.5 million SMEs, with an estimated 60-70% lacking a professional digital presence. Even capturing a fraction of one percent of this addressable market represents a significant business opportunity."),

      pageBreak(),

      // ════════════════════════════════════════
      // 7. REVENUE MODEL
      // ════════════════════════════════════════
      h1("7. Revenue Model"),
      body("Swift Designz operates two revenue streams that work together and reinforce each other:"),
      spacer(80),

      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2800, 3200, 3360],
        rows: [
          new TableRow({ children: [hCell("Stream", 2800), hCell("Structure", 3200), hCell("Characteristics", 3360)] }),
          new TableRow({ children: [
            cell("Project Fees",       { w: 2800, bold: true, shade: LIGHT_BG }),
            cell("N$2,500 - N$25,000+ per project, 50% deposit upfront", { w: 3200 }),
            cell("Variable; driven by new client acquisition; grows with reputation and referrals", { w: 3360 }),
          ]}),
          new TableRow({ children: [
            cell("Monthly Retainers",  { w: 2800, bold: true, shade: LIGHT_BG }),
            cell("N$800 per client per month, post project sign-off", { w: 3200 }),
            cell("Recurring, predictable, compounding, and grows with every completed project", { w: 3360 }),
          ]}),
          new TableRow({ children: [
            cell("Training Workshops", { w: 2800, bold: true, shade: LIGHT_BG }),
            cell("Custom per engagement, remote delivery", { w: 3200 }),
            cell("High-margin; no hardware or travel cost; scales via recorded content", { w: 3360 }),
          ]}),
          new TableRow({ children: [
            cell("Employment Income",  { w: 2800, bold: true, shade: LIGHT_BG }),
            cell("N$10,000/month stable salary", { w: 3200 }),
            cell("Provides financial stability and underpins loan repayment capacity", { w: 3360 }),
          ]}),
          new TableRow({ children: [
            cell("Investment Returns", { w: 2800, bold: true, shade: LIGHT_BG }),
            cell("N$3,000/month from unit trust investments", { w: 3200 }),
            cell("Passive income stream reinvested for growth; growing over time", { w: 3360 }),
          ]}),
        ],
      }),

      spacer(160),
      body("The retainer model is what makes this business structurally strong. Every client delivered is not just a one-time payment. It becomes a permanent recurring unit adding N$800 per month to the base. That number grows quietly and consistently with every project completed, regardless of whether new work comes in that month."),

      // ════════════════════════════════════════
      // 8. CURRENT TRACTION
      // ════════════════════════════════════════
      h1("8. Current Traction"),
      body("Swift Designz is not a business plan on paper. It is already running, already earning, and already delivering real work for real clients. These are the facts as at April 2026:"),
      spacer(80),

      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [hCell("Metric", 4680), hCell("Status", 4680)] }),
          new TableRow({ children: [cell("Active clients",          { w: 4680, bold: true, shade: LIGHT_BG }), cell("8",                                                { w: 4680 })] }),
          new TableRow({ children: [cell("Active projects",         { w: 4680, bold: true, shade: LIGHT_BG }), cell("8 (2 Shopify stores, 6 custom websites)",          { w: 4680 })] }),
          new TableRow({ children: [cell("Revenue to date",         { w: 4680, bold: true, shade: LIGHT_BG }), cell("N$13,775",                                         { w: 4680 })] }),
          new TableRow({ children: [cell("Monthly income (founder)", { w: 4680, bold: true, shade: LIGHT_BG }), cell("N$19,000+/month (employment N$10,000 + client deposits N$6,000 + investment returns N$3,000)", { w: 4680 })] }),
          new TableRow({ children: [cell("Project fee range",       { w: 4680, bold: true, shade: LIGHT_BG }), cell("N$2,500 – N$6,500 per project (current average)", { w: 4680 })] }),
          new TableRow({ children: [cell("Countries served",        { w: 4680, bold: true, shade: LIGHT_BG }), cell("2 (Namibia, South Africa)",                        { w: 4680 })] }),
          new TableRow({ children: [cell("Partnership",             { w: 4680, bold: true, shade: LIGHT_BG }), cell("IT-Guru Online, providing hosting and co-marketing",          { w: 4680 })] }),
          new TableRow({ children: [cell("Website",                 { w: 4680, bold: true, shade: LIGHT_BG }), cell("Live at swiftdesignz.co.za",                       { w: 4680 })] }),
        ],
      }),

      spacer(160),
      body('"From my experience working with many developers across various projects, you should be proud of yourself. You take ownership, and your work ethic truly stands out. Your work clearly reflects your passion, dedication, and skill." - Ambrose Isaacs, Project Manager, IT-Guru Online', { italic: true, color: MID_TEAL }),

      pageBreak(),

      // ════════════════════════════════════════
      // 9. GROWTH PROJECTIONS
      // ════════════════════════════════════════
      h1("9. Growth Projections"),
      body("Projections are based on current active project volume, average project fees, and the retainer model. They assume the investment funds are deployed within 30 days of receipt."),
      spacer(80),

      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2700, 1665, 1665, 1665, 1665],
        rows: [
          new TableRow({ children: [
            hCell("Metric", 2700), hCell("Now (Apr 2026)", 1665), hCell("Qtr 2 (Oct 2026)", 1665), hCell("Qtr 3 (Jan 2027)", 1665), hCell("Qtr 4 (Apr 2027)", 1665),
          ]}),
          new TableRow({ children: [
            cell("Active Projects",         { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("6",                       { w: 1665, align: AlignmentType.CENTER }),
            cell("8-10",                    { w: 1665, align: AlignmentType.CENTER }),
            cell("10-14",                   { w: 1665, align: AlignmentType.CENTER }),
            cell("14-20",                   { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Project Fee Range",       { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("N$2,500-N$6,500",         { w: 1665, align: AlignmentType.CENTER }),
            cell("N$3,500-N$10,000",        { w: 1665, align: AlignmentType.CENTER }),
            cell("N$5,000-N$15,000",        { w: 1665, align: AlignmentType.CENTER }),
            cell("N$5,000-N$25,000",        { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Est. Project Revenue/mo", { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("N$15,000-N$39,000",       { w: 1665, align: AlignmentType.CENTER }),
            cell("N$28,000-N$55,000",       { w: 1665, align: AlignmentType.CENTER }),
            cell("N$50,000-N$80,000",       { w: 1665, align: AlignmentType.CENTER }),
            cell("N$70,000-N$120,000+",     { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Retainer Clients",        { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("2-3",                     { w: 1665, align: AlignmentType.CENTER }),
            cell("5-7",                     { w: 1665, align: AlignmentType.CENTER }),
            cell("8-12",                    { w: 1665, align: AlignmentType.CENTER }),
            cell("12-18",                   { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Retainer Income/mo",      { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("N$1,600-N$2,400",         { w: 1665, align: AlignmentType.CENTER }),
            cell("N$4,000-N$5,600",         { w: 1665, align: AlignmentType.CENTER }),
            cell("N$6,400-N$9,600",         { w: 1665, align: AlignmentType.CENTER }),
            cell("N$9,600-N$14,400",        { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Team Size",               { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("1 (founder)",             { w: 1665, align: AlignmentType.CENTER }),
            cell("2 (+ intern)",            { w: 1665, align: AlignmentType.CENTER }),
            cell("2-3",                     { w: 1665, align: AlignmentType.CENTER }),
            cell("3-4",                     { w: 1665, align: AlignmentType.CENTER }),
          ]}),
          new TableRow({ children: [
            cell("Platforms",               { w: 2700, bold: true, shade: LIGHT_BG }),
            cell("Web-first",               { w: 1665, align: AlignmentType.CENTER }),
            cell("Web + iOS + Android",     { w: 1665, align: AlignmentType.CENTER }),
            cell("Full cross-platform",     { w: 1665, align: AlignmentType.CENTER }),
            cell("Full cross-platform",     { w: 1665, align: AlignmentType.CENTER }),
          ]}),
        ],
      }),

      spacer(120),
      body("Note: Projections are conservative and based on current demonstrated revenue capacity. The retainer income is additive and compounding. It does not get replaced by new projects, it accumulates alongside them.", { italic: true, color: MID_TEAL }),

      pageBreak(),

      // ════════════════════════════════════════
      // 10. OPERATIONAL PLAN
      // ════════════════════════════════════════
      h1("10. Operational Plan"),
      h2("Current Operations"),
      bullet("All client work is delivered remotely via video calls, email, Git repositories, and Vercel/Netlify deployments."),
      bullet("Project management handled through direct communication, signed quotes, and structured delivery milestones."),
      bullet("Hosting and domain infrastructure managed in partnership with IT-Guru Online."),
      bullet("All code stored in Git with cloud backups, and zero client data is stored locally only."),

      h2("Post-Investment Operations"),
      bullet("Month 1: Procure Apple iMac M4 and activate AI/software subscriptions. Begin iOS development setup."),
      bullet("Month 1-2: Complete Xcode/Apple Developer account setup. Begin intake of first iOS/Android app projects."),
      bullet("Month 2-4: First mobile app projects delivered and submitted to App Store and Google Play Store."),
      bullet("Month 4-6: Expanded retainer base from delivered projects. AI tools improving delivery speed and quality. Mobile app service line fully operational."),
      bullet("Month 6-12: Full cross-platform capability established. Website, e-commerce, mobile, and AI training services all generating consistent revenue. Monthly income projected at N$30,000+."),
      bullet("Year 2: Register as Pty (Ltd). Formalize IT-Guru partnership. Begin SADC market expansion. Explore hiring first junior developer."),

      h2("Technology Stack"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2000, 7360],
        rows: [
          new TableRow({ children: [hCell("Layer", 2000), hCell("Tools", 7360)] }),
          new TableRow({ children: [cell("Front-end",   { w: 2000, bold: true, shade: LIGHT_BG }), cell("Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion",       { w: 7360 })] }),
          new TableRow({ children: [cell("Mobile",      { w: 2000, bold: true, shade: LIGHT_BG }), cell("Flutter (iOS, Android, Desktop)",                                  { w: 7360 })] }),
          new TableRow({ children: [cell("Back-end",    { w: 2000, bold: true, shade: LIGHT_BG }), cell("Node.js, Next.js API routes, Python",                              { w: 7360 })] }),
          new TableRow({ children: [cell("E-Commerce",  { w: 2000, bold: true, shade: LIGHT_BG }), cell("Shopify, custom storefronts",                                      { w: 7360 })] }),
          new TableRow({ children: [cell("Deployment",  { w: 2000, bold: true, shade: LIGHT_BG }), cell("Vercel, Netlify, IT-Guru hosting infrastructure",                  { w: 7360 })] }),
          new TableRow({ children: [cell("Version Ctrl",{ w: 2000, bold: true, shade: LIGHT_BG }), cell("Git (GitHub)",                                                     { w: 7360 })] }),
          new TableRow({ children: [cell("Email",       { w: 2000, bold: true, shade: LIGHT_BG }), cell("Resend API (DNS verified, DKIM/SPF)",                              { w: 7360 })] }),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 11. INVESTMENT ASK
      // ════════════════════════════════════════
      h1("11. Investment Ask"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [hCell("Parameter", 4680), hCell("Detail", 4680)] }),
          new TableRow({ children: [cell("Funding Amount",           { w: 4680, bold: true, shade: LIGHT_BG }), cell("N$50,000",                                                                                      { w: 4680 })] }),
          new TableRow({ children: [cell("Purpose",                  { w: 4680, bold: true, shade: LIGHT_BG }), cell("Acquisition of Apple iMac M4 and AI/software subscriptions to unlock iOS development capability", { w: 4680 })] }),
          new TableRow({ children: [cell("Offering",                 { w: 4680, bold: true, shade: LIGHT_BG }), cell("Equity stake in Swift Designz + monthly loan repayment",                                        { w: 4680 })] }),
          new TableRow({ children: [cell("Repayment",                { w: 4680, bold: true, shade: LIGHT_BG }), cell("N$3,000/month from personal income, with full repayment in approximately 17 months",                             { w: 4680 })] }),
          new TableRow({ children: [cell("Repayment Capacity",       { w: 4680, bold: true, shade: LIGHT_BG }), cell("Founder earns N$19,000+/month (employment + clients + investments) and repayment represents 16% of current income", { w: 4680 })] }),
          new TableRow({ children: [cell("Reporting",                { w: 4680, bold: true, shade: LIGHT_BG }), cell("Monthly progress report: revenue, active projects, fund use receipts",                          { w: 4680 })] }),
        ],
      }),

      // ════════════════════════════════════════
      // 12. USE OF FUNDS
      // ════════════════════════════════════════
      h1("12. Use of Funds"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [3200, 1600, 1600, 2960],
        rows: [
          new TableRow({ children: [hCell("Item", 3200), hCell("Qty", 1600), hCell("Amount", 1600), hCell("Purpose", 2960)] }),
          new TableRow({ children: [
            cell("Apple iMac M4: 24-inch, Retina 4.5K, M4 10-core CPU/GPU, 24GB, 512GB SSD", { w: 3200 }),
            cell("1",        { w: 1600, align: AlignmentType.CENTER }),
            cell("N$43,000", { w: 1600, align: AlignmentType.RIGHT }),
            cell("iOS, macOS and App Store development. This is the core unlock for mobile app services.", { w: 2960 }),
          ]}),
          new TableRow({ children: [
            cell("AI Subscriptions (12 months): ChatGPT Plus, Copilot Pro, Claude Pro", { w: 3200 }),
            cell("12 mo",    { w: 1600, align: AlignmentType.CENTER }),
            cell("N$4,500",  { w: 1600, align: AlignmentType.RIGHT }),
            cell("AI-assisted development, client automation tools, content generation", { w: 2960 }),
          ]}),
          new TableRow({ children: [
            cell("Software licences & peripherals (IDE, design tools, accessories)", { w: 3200 }),
            cell("1",        { w: 1600, align: AlignmentType.CENTER }),
            cell("N$2,500",  { w: 1600, align: AlignmentType.RIGHT }),
            cell("Xcode toolchain, design software, mouse/keyboard peripheral upgrades", { w: 2960 }),
          ]}),
          new TableRow({ children: [
            new TableCell({
              borders, columnSpan: 2, margins: pad,
              width: { size: 4800, type: WidthType.DXA },
              shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "TOTAL", bold: true, font: "Arial", size: 24, color: WHITE })] })],
            }),
            new TableCell({
              borders, margins: pad,
              width: { size: 1600, type: WidthType.DXA },
              shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "N$50,000", bold: true, font: "Arial", size: 24, color: WHITE })] })],
            }),
            new TableCell({
              borders, margins: pad,
              width: { size: 2960, type: WidthType.DXA },
              shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Full amount deployed to revenue-generating assets", font: "Arial", size: 20, color: WHITE })] })],
            }),
          ]}),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 13. ROADMAP
      // ════════════════════════════════════════
      h1("13. Roadmap"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2200, 7160],
        rows: [
          new TableRow({ children: [hCell("Phase", 2200), hCell("Milestones", 7160)] }),
          new TableRow({ children: [
            subHCell("Now\n(Apr 2026)", 2200),
            cell("8 active clients, 8 concurrent projects (2 Shopify stores + 6 websites), N$13,775 revenue, IT-Guru partnership active", { w: 7160 }),
          ]}),
          new TableRow({ children: [
            subHCell("Months 1-3\n(Q2 2026)", 2200),
            cell("Deploy investment funds; procure iMac M4; activate AI subscriptions; complete Apple Developer account setup; begin first iOS/Android project intake", { w: 7160 }),
          ]}),
          new TableRow({ children: [
            subHCell("Months 3-6\n(Q3 2026)", 2200),
            cell("First apps submitted to App Store and Google Play; 10-12 active clients; 5-7 retainer clients; monthly revenue N$20,000-N$30,000", { w: 7160 }),
          ]}),
          new TableRow({ children: [
            subHCell("Months 6-12\n(Q4 2026-Q1 2027)", 2200),
            cell("Full cross-platform capability; 15-20 active clients; loan repayment on track (N$3,000/month from month 1); monthly revenue N$30,000+; Pty Ltd registration initiated", { w: 7160 }),
          ]}),
          new TableRow({ children: [
            subHCell("Year 2-3", 2200),
            cell("Pty Ltd registered; formalized IT-Guru partnership; hire first junior developer; SADC-wide client base; N$50,000-N$80,000+/month revenue", { w: 7160 }),
          ]}),
          new TableRow({ children: [
            subHCell("Year 3-5", 2200),
            cell("Hybrid agency and product studio; go-to tech partner for Africa; multiple independent product revenue streams; expanded SADC and international presence", { w: 7160 }),
          ]}),
        ],
      }),

      // ════════════════════════════════════════
      // 14. RISK & MITIGATION
      // ════════════════════════════════════════
      h1("14. Risk & Mitigation"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [2800, 1400, 5160],
        rows: [
          new TableRow({ children: [hCell("Risk", 2800), hCell("Likelihood", 1400), hCell("Mitigation", 5160)] }),
          new TableRow({ children: [
            cell("Slow new client acquisition",     { w: 2800 }),
            cell("Medium", { w: 1400, align: AlignmentType.CENTER }),
            cell("6 active projects already in progress; diversified services; IT-Guru referral pipeline; active social media marketing; retainer income provides floor revenue independent of new projects", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Late or non-payment by clients",  { w: 2800 }),
            cell("Medium", { w: 1400, align: AlignmentType.CENTER }),
            cell("50% deposit required upfront before work begins; formal signed quotes and invoices on every project; payment plan agreements for larger projects", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Scope creep / overruns",          { w: 2800 }),
            cell("Medium", { w: 1400, align: AlignmentType.CENTER }),
            cell("Detailed scope-of-work defined and signed before any work commences; change requests documented and billed separately; client onboarding documents limit ambiguity", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Key person dependency",           { w: 2800 }),
            cell("Medium", { w: 1400, align: AlignmentType.CENTER }),
            cell("Intern reduces single-point-of-failure; all code in Git; client files in cloud; processes documented; IT-Guru partnership provides infrastructure redundancy", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Intern underperformance",         { w: 2800 }),
            cell("Low",    { w: 1400, align: AlignmentType.CENTER }),
            cell("Structured onboarding; weekly one-on-ones; clearly defined tasks with deadlines; performance reviewed at 30, 60, and 90 days; intern stipend is modest relative to revenue", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Connectivity disruption",         { w: 2800 }),
            cell("Low",    { w: 1400, align: AlignmentType.CENTER }),
            cell("Primary and mobile data backup; all deliverables cloud-hosted; work continues from any location with internet access", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Equipment failure",               { w: 2800 }),
            cell("Low",    { w: 1400, align: AlignmentType.CENTER }),
            cell("Manufacturer warranty on both machines; all code and assets in cloud, and no critical data is stored locally only", { w: 5160 }),
          ]}),
          new TableRow({ children: [
            cell("Data security / breach",          { w: 2800 }),
            cell("Low",    { w: 1400, align: AlignmentType.CENTER }),
            cell("HTTPS on all platforms; no sensitive client data stored locally; secure password management; NDAs signed with enterprise-level clients", { w: 5160 }),
          ]}),
        ],
      }),

      pageBreak(),

      // ════════════════════════════════════════
      // 15. TEAM
      // ════════════════════════════════════════
      h1("15. Team"),
      h2("Keenan Husselmann, Founder and Lead Developer"),
      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: [3200, 6160],
        rows: [
          new TableRow({ children: [cell("Qualification",  { w: 3200, bold: true, shade: LIGHT_BG }), cell("BSc Software Engineering at NUST, Windhoek, Namibia (academic bursary awarded by Rehoboth Community Trust)", { w: 6160 })] }),
          new TableRow({ children: [cell("Experience",     { w: 3200, bold: true, shade: LIGHT_BG }), cell("2+ years web development; 1+ year application development; 1+ year freelance studio operation", { w: 6160 })] }),
          new TableRow({ children: [cell("Core Skills",    { w: 3200, bold: true, shade: LIGHT_BG }), cell("TypeScript, React, Next.js, Node.js, Flutter, Tailwind CSS, Framer Motion, Python, Shopify", { w: 6160 })] }),
          new TableRow({ children: [cell("Delivery",       { w: 3200, bold: true, shade: LIGHT_BG }), cell("Vercel, Netlify, Git, CI/CD, Agile methodologies, remote project management", { w: 6160 })] }),
          new TableRow({ children: [cell("Design",         { w: 3200, bold: true, shade: LIGHT_BG }), cell("UI/UX design, brand identity, glassmorphism/neon aesthetics, motion design", { w: 6160 })] }),
          new TableRow({ children: [cell("Contact",        { w: 3200, bold: true, shade: LIGHT_BG }), cell("keenan@swiftdesignz.co.za  |  +264 81 853 6789", { w: 6160 })] }),
        ],
      }),

      spacer(200),
      h2("Planned Team Growth"),
      bullet("Junior Intern Developer (Month 2-3): Front-end and mobile development support. Real-world skills training."),
      bullet("Year 2: 1-2 additional junior developers or designers as revenue scales."),
      bullet("Year 3+: Full design and development team supporting SADC-wide client base."),

      h2("Strategic Partner"),
      body("IT-Guru Online (Ambrose Isaacs) provides hosting, domain registration, and IT infrastructure. The co-marketing partnership generates mutual referrals and provides Swift Designz with enterprise-grade infrastructure without the associated capital cost."),

      // ════════════════════════════════════════
      // 16. CLOSING STATEMENT
      // ════════════════════════════════════════
      h1("16. Closing Statement"),
      body("Keenan Husselmann built Swift Designz from scratch without a loan, without a co-founder, and without a marketing budget. Everything here has been earned through the quality of the work and the trust of clients who keep coming back. This funding application is not about survival. It is about removing the one technical barrier that is preventing the next stage of growth: the ability to build and publish iOS apps. A Mac changes that entirely."),
      body("Keenan holds a stable personal income of N$19,000 per month from his job, client deposits, and investment returns. He commits to repaying N$3,000 per month starting from month one. That repayment is not contingent on the business growing. It is covered by his existing income. The iMac itself is a tangible asset backed by a manufacturer warranty. The AI tools will accelerate every project the studio takes on. Together, these two investments do not just benefit Swift Designz. They benefit every client who will get better, faster, more capable work as a result."),
      body("This is a story about a developer who started something real, proved it works, and is now asking for the tools to take it further. I welcome the opportunity to discuss this in more detail and am available at your convenience."),

      spacer(400),
      rule(),

      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "____________________________", font: "Arial", size: 22, color: DARK })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Keenan Husselmann", bold: true, font: "Arial", size: 22, color: DARK })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Founder, Swift Designz", font: "Arial", size: 22, color: DEEP_TEAL })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: dateStr, font: "Arial", size: 20, color: "888888" })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "swiftdesignz.co.za  |  keenan@swiftdesignz.co.za  |  +264 81 853 6789", font: "Arial", size: 20, color: MID_TEAL })],
      }),
    ],
  }],
});

// ── Write output ──────────────────────────────────────────
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "swift-designz-business-plan-funding.docx");
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);

console.log("\nInvestor Business Plan generated successfully!");
console.log(`  Output: ${outputPath}`);
console.log(`  Size:   ${(buffer.length / 1024).toFixed(1)} KB`);
console.log("\nSections:");
console.log("  1. Executive Summary          9. Growth Projections");
console.log("  2. Business Overview         10. Operational Plan");
console.log("  3. Problem & Opportunity     11. Investment Ask");
console.log("  4. Services & Pricing        12. Use of Funds");
console.log("  5. Competitive Advantage     13. Roadmap");
console.log("  6. Target Market             14. Risk & Mitigation");
console.log("  7. Revenue Model             15. Team");
console.log("  8. Current Traction          16. Closing Statement");
