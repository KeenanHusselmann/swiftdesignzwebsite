/**
 * Generate SME Grant / Loan Application Pack for Swift Designz
 * Creates a professional .docx with:
 *   1. Business Loan Proposal / Motivation Letter
 *   2. Budget Breakdown
 *   3. Business Plan Summary
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, PageNumber, ImageRun, ExternalHyperlink,
  TabStopType, TabStopPosition,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "docs", "docx");

// ── Brand colours ──
const TEAL = "30B0B0";
const DARK = "303030";
const DEEP_TEAL = "307070";
const LIGHT_BG = "F0FAFA";
const WHITE = "FFFFFF";
const BLACK = "000000";

// ── Table helpers ──
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const contentWidth = 9360; // A4 with 1" margins in DXA

function makeCell(text, opts = {}) {
  const { bold, width, shading, align, font, size, color } = opts;
  return new TableCell({
    borders: cellBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: bold || false,
            font: font || "Arial",
            size: size || 22,
            color: color || DARK,
          }),
        ],
      }),
    ],
  });
}

function makeHeaderCell(text, width) {
  return makeCell(text, { bold: true, width, shading: TEAL, color: WHITE, size: 22 });
}

function budgetRow(item, qty, unitCost, total, note) {
  const cols = [3200, 800, 1600, 1600, 2160];
  return new TableRow({
    children: [
      makeCell(item, { width: cols[0] }),
      makeCell(qty, { width: cols[1], align: AlignmentType.CENTER }),
      makeCell(unitCost, { width: cols[2], align: AlignmentType.RIGHT }),
      makeCell(total, { width: cols[3], align: AlignmentType.RIGHT, bold: true }),
      makeCell(note, { width: cols[4], size: 20 }),
    ],
  });
}

function totalRow(label, amount) {
  const cols = [3200, 800, 1600, 1600, 2160];
  return new TableRow({
    children: [
      new TableCell({
        borders: cellBorders, width: { size: cols[0] + cols[1] + cols[2], type: WidthType.DXA },
        columnSpan: 3, margins: cellMargins,
        shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: label, bold: true, font: "Arial", size: 24, color: WHITE }),
        ] })],
      }),
      new TableCell({
        borders: cellBorders, width: { size: cols[3], type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: amount, bold: true, font: "Arial", size: 24, color: WHITE }),
        ] })],
      }),
      new TableCell({
        borders: cellBorders, width: { size: cols[4], type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: "", font: "Arial", size: 20 })] })],
      }),
    ],
  });
}

// ── Budget Data ──
const macPrice = "R 28,000";
const winPrice = "R 18,000";
const internMonthly = "R 2,000";
const internAnnual = "R 24,000";
const contingency = "R 5,000";
const totalLoan = "R 75,000";

// ── Build the document ──
const logoPath = path.join(rootDir, "public", "images", "logo.png");
const hasLogo = fs.existsSync(logoPath);

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: TEAL })],
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: DEEP_TEAL })],
  });
}

function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.afterSpacing || 160 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        font: "Arial",
        size: 22,
        color: DARK,
        bold: opts.bold || false,
        italics: opts.italic || false,
      }),
    ],
  });
}

function bulletItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })],
  });
}

const today = new Date();
const dateStr = today.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: DEEP_TEAL },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // ══════════════════════════════════════════════════════════
    // COVER / MOTIVATION LETTER
    // ══════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Swift Designz  |  SME Growth Fund Application", font: "Arial", size: 18, color: TEAL, italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Swift Designz  \u2022  swiftdesignz.co.za  \u2022  keenan@swiftdesignz.co.za", font: "Arial", size: 16, color: "999999" }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Logo
        ...(hasLogo
          ? [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [
                  new ImageRun({
                    type: "png",
                    data: fs.readFileSync(logoPath),
                    transformation: { width: 160, height: 160 },
                    altText: { title: "Swift Designz Logo", description: "Swift Designz teal S logo", name: "logo" },
                  }),
                ],
              }),
            ]
          : []),

        // Title block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "SWIFT DESIGNZ", bold: true, font: "Arial", size: 44, color: TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: "Freelance Software Development & Digital Solutions", font: "Arial", size: 24, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 8 } },
          children: [new TextRun({ text: " ", font: "Arial", size: 8 })],
        }),

        // Document title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 60 },
          children: [new TextRun({ text: "SME Growth Fund Application", bold: true, font: "Arial", size: 36, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Business Loan Proposal & Motivation", font: "Arial", size: 24, color: DEEP_TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: dateStr, font: "Arial", size: 22, color: "666666" })],
        }),

        // ── Applicant details ──
        new Paragraph({
          spacing: { after: 160 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 4 } },
          children: [new TextRun({ text: "APPLICANT DETAILS", bold: true, font: "Arial", size: 24, color: TEAL })],
        }),

        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [
              makeCell("Full Name:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Keenan Husselmann", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Trading As:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Swift Designz", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Location:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Windhoek, Namibia (Remote — Serves clients worldwide)", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Email:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("keenan@swiftdesignz.co.za", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Phone:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("+264 81 853 6789", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Website:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("https://swiftdesignz.co.za", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Industry:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Software Development & Digital Services", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Business Type:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Sole Proprietor / Freelance", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Loan Amount Requested:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("R 75,000", { width: 6160, bold: true, color: TEAL }),
            ] }),
          ],
        }),

        // PAGE BREAK → Motivation Letter
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════════════════════
        // SECTION 1: MOTIVATION LETTER
        // ══════════════════════════════════════════════════════════
        sectionHeading("1. Motivation Letter"),

        subHeading("1.1 Purpose of This Application"),
        bodyParagraph(
          "I, Keenan Husselmann, trading as Swift Designz, hereby apply for an SME growth fund / government grant to the value of R 75,000 (Seventy-Five Thousand Rand). This funding is requested to acquire essential development equipment and to onboard a junior intern developer for a twelve-month period, enabling me to scale the business, increase service delivery capacity, and create meaningful employment."
        ),

        subHeading("1.2 About Swift Designz"),
        bodyParagraph(
          "Swift Designz is a freelance software development and digital solutions business founded by Keenan Husselmann. The business specialises in website development, e-commerce store creation, mobile and desktop application development, project management training, and AI training. Operating fully remote from Windhoek, Namibia, Swift Designz serves clients across Africa and internationally."
        ),
        bodyParagraph(
          "With over two years of web development experience, one year of application development experience, and a formal qualification in Software Development, I have built a growing client base and a strong portfolio of projects. The business is registered and operates under the domain swiftdesignz.co.za."
        ),

        subHeading("1.3 Why This Funding Is Needed"),
        bodyParagraph(
          "As a sole proprietor, I currently operate with a single workstation. This creates several critical limitations:"
        ),
        bulletItem("I cannot develop and test applications across both macOS and Windows environments simultaneously, which is essential for cross-platform software delivery.", "bullets"),
        bulletItem("I am limited in the number of concurrent projects I can handle, resulting in longer turnaround times and potential loss of clients.", "bullets"),
        bulletItem("I cannot effectively mentor or employ an intern without a dedicated workstation for them to use.", "bullets"),
        bulletItem("The business cannot grow beyond a one-person operation without additional computing resources and human capacity.", "bullets"),

        bodyParagraph(
          "This funding will directly address these constraints by providing two development workstations (one macOS, one Windows) and financing a junior intern developer position for 12 months."
        ),

        subHeading("1.4 Expected Impact"),
        bodyParagraph("The investment will achieve the following outcomes:"),
        bulletItem("Job Creation: One junior developer intern position for 12 months, providing real-world software development experience and skills transfer.", "bullets"),
        bulletItem("Increased Revenue Capacity: With two developers and cross-platform capability, the business can take on 2-3x more projects simultaneously.", "bullets"),
        bulletItem("Cross-Platform Development: A macOS machine enables native iOS/macOS app testing alongside Windows development, opening new service offerings.", "bullets"),
        bulletItem("Skills Transfer: The intern will receive hands-on training in modern web technologies (Next.js, TypeScript, React), project delivery, and client management.", "bullets"),
        bulletItem("Sustainability: By month 6-8, the increased project throughput is expected to generate enough revenue to sustain the intern position independently.", "bullets"),

        subHeading("1.5 Repayment Plan"),
        bodyParagraph(
          "I have identified a structured repayment capacity of R 4,000 per month, funded from two committed sources:"
        ),
        bulletItem("Active investor contribution: R 2,000 per month (currently committed, ongoing).", "bullets"),
        bulletItem("Business revenue contribution: R 2,000 per month from Swift Designz operating income.", "bullets"),
        bodyParagraph(
          "At a combined repayment rate of R 4,000 per month, the full loan of R 75,000 would be repaid over approximately 19 months. With increased revenue from the funded growth (additional projects and cross-platform capacity), accelerated repayments are anticipated from month 6 onwards."
        ),

        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({ children: [
              makeHeaderCell("Repayment Source", 3120),
              makeHeaderCell("Monthly Amount", 3120),
              makeHeaderCell("Notes", 3120),
            ] }),
            new TableRow({ children: [
              makeCell("Active Investor", { width: 3120 }),
              makeCell("R 2,000", { width: 3120, align: AlignmentType.CENTER }),
              makeCell("Currently committed, paid monthly", { width: 3120 }),
            ] }),
            new TableRow({ children: [
              makeCell("Swift Designz Business Revenue", { width: 3120 }),
              makeCell("R 2,000", { width: 3120, align: AlignmentType.CENTER }),
              makeCell("From operating income, month 1 onwards", { width: 3120 }),
            ] }),
            new TableRow({ children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                margins: cellMargins,
                shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "TOTAL MONTHLY REPAYMENT", bold: true, font: "Arial", size: 22, color: WHITE })] })],
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                margins: cellMargins,
                shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "R 4,000", bold: true, font: "Arial", size: 22, color: WHITE })] })],
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3120, type: WidthType.DXA },
                margins: cellMargins,
                shading: { fill: DEEP_TEAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Full repayment ~19 months", bold: true, font: "Arial", size: 22, color: WHITE })] })],
              }),
            ] }),
          ],
        }),

        bodyParagraph("", { afterSpacing: 120 }),
        bodyParagraph(
          "I am committed to providing monthly progress reports detailing project intake, revenue generated, investor contributions, and intern development milestones. I understand the obligation to use these funds strictly for the stated purposes and am prepared to provide receipts and documentation for all expenditures."
        ),

        // PAGE BREAK → Budget
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════════════════════
        // SECTION 2: BUDGET BREAKDOWN
        // ══════════════════════════════════════════════════════════
        sectionHeading("2. Detailed Budget Breakdown"),

        bodyParagraph("The following table provides a line-by-line breakdown of the requested funding:"),

        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3200, 800, 1600, 1600, 2160],
          rows: [
            // Header row
            new TableRow({
              children: [
                makeHeaderCell("Item", 3200),
                makeHeaderCell("Qty", 800),
                makeHeaderCell("Unit Cost", 1600),
                makeHeaderCell("Total", 1600),
                makeHeaderCell("Notes", 2160),
              ],
            }),
            // Equipment
            budgetRow("Apple MacBook Air M3 (16GB, 512GB SSD)", "1", "R 28,000", macPrice, "macOS/iOS dev & testing"),
            budgetRow("Windows Development Laptop (i7, 16GB RAM, 512GB SSD)", "1", "R 18,000", winPrice, "Windows dev & intern workstation"),
            // Personnel
            budgetRow("Junior Intern Developer (monthly stipend)", "12 mo", "R 2,000", internAnnual, "12-month contract"),
            // Contingency
            budgetRow("Contingency / Software Licences", "1", "R 5,000", contingency, "IDE, hosting, domain renewals, misc"),
          ],
        }),

        bodyParagraph("", { afterSpacing: 80 }),

        // Totals summary
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3200, 800, 1600, 1600, 2160],
          rows: [
            totalRow("TOTAL FUNDING REQUESTED", "R 75,000"),
          ],
        }),

        bodyParagraph("", { afterSpacing: 200 }),

        subHeading("2.1 Equipment Justification"),

        bodyParagraph("MacBook Air M3:", { bold: true, afterSpacing: 60 }),
        bulletItem("Required for iOS and macOS application development and testing (Xcode is only available on macOS).", "bullets"),
        bulletItem("Enables cross-platform development with React Native, Flutter, and Swift.", "bullets"),
        bulletItem("The M3 chip provides excellent performance-per-watt, reducing electricity costs in a home-office environment.", "bullets"),

        bodyParagraph("Windows Development Laptop:", { bold: true, afterSpacing: 60 }),
        bulletItem("Dedicated workstation for the junior intern developer.", "bullets"),
        bulletItem("Required for Windows-specific testing, .NET development, and client demos.", "bullets"),
        bulletItem("Ensures the intern has dedicated equipment to work productively from day one.", "bullets"),

        subHeading("2.2 Personnel Justification"),
        bodyParagraph(
          "The junior intern developer will receive a monthly stipend of R 2,000 for a period of 12 months. This is structured as a learning-and-earning internship, where the intern will:"
        ),
        bulletItem("Assist with front-end and back-end development tasks under direct supervision.", "bullets"),
        bulletItem("Learn modern development practices including Git version control, agile methodologies, and code review.", "bullets"),
        bulletItem("Progressively take on client-facing project work, increasing the business delivery capacity.", "bullets"),
        bulletItem("Gain a portfolio of real-world projects to enhance their employability post-internship.", "bullets"),

        subHeading("2.3 Contingency Fund"),
        bodyParagraph(
          "The R 5,000 contingency covers essential software licences (IDE subscriptions, cloud hosting credits, domain renewals), peripherals (mouse, keyboard, monitor adapters), and any unforeseen costs associated with onboarding the intern."
        ),

        // PAGE BREAK → Business Plan
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════════════════════
        // SECTION 3: BUSINESS PLAN SUMMARY
        // ══════════════════════════════════════════════════════════
        sectionHeading("3. Business Plan Summary"),

        subHeading("3.1 Business Overview"),
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [
              makeCell("Business Name:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Swift Designz", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Owner:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Keenan Husselmann", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Founded:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("2024", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Industry:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Information Technology — Software Development & Digital Solutions", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Service Model:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Remote-first, project-based delivery", { width: 6160 }),
            ] }),
            new TableRow({ children: [
              makeCell("Target Market:", { width: 3200, bold: true, shading: LIGHT_BG }),
              makeCell("Small-to-medium businesses, startups, and individuals — worldwide", { width: 6160 }),
            ] }),
          ],
        }),

        subHeading("3.2 Services Offered"),
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3400, 3000, 2960],
          rows: [
            new TableRow({ children: [
              makeHeaderCell("Service", 3400),
              makeHeaderCell("Starting From", 3000),
              makeHeaderCell("Delivery", 2960),
            ] }),
            new TableRow({ children: [
              makeCell("Website Development", { width: 3400 }),
              makeCell("R 2,500", { width: 3000 }),
              makeCell("4-21 business days", { width: 2960 }),
            ] }),
            new TableRow({ children: [
              makeCell("E-Commerce Stores", { width: 3400 }),
              makeCell("R 4,000", { width: 3000 }),
              makeCell("5-25 business days", { width: 2960 }),
            ] }),
            new TableRow({ children: [
              makeCell("Apps & Software", { width: 3400 }),
              makeCell("R 5,000", { width: 3000 }),
              makeCell("10-30+ business days", { width: 2960 }),
            ] }),
            new TableRow({ children: [
              makeCell("Project Management Training", { width: 3400 }),
              makeCell("Custom quote", { width: 3000 }),
              makeCell("Flexible", { width: 2960 }),
            ] }),
            new TableRow({ children: [
              makeCell("AI Training", { width: 3400 }),
              makeCell("Custom quote", { width: 3000 }),
              makeCell("Flexible", { width: 2960 }),
            ] }),
          ],
        }),

        subHeading("3.3 Qualifications & Experience"),
        bulletItem("Software Development Degree / Diploma", "bullets"),
        bulletItem("2+ years professional web development experience", "bullets"),
        bulletItem("1+ year application development experience", "bullets"),
        bulletItem("Proficient in: TypeScript, React, Next.js, Node.js, Tailwind CSS, Framer Motion, Python", "bullets"),
        bulletItem("Experience with: Vercel, Netlify, Resend, Git, CI/CD, Agile methodologies", "bullets"),

        subHeading("3.4 Growth Projections"),
        bodyParagraph("Swift Designz is already an active business. The table below shows the current baseline and projected trajectory with the requested equipment and intern:"),

        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [
            new TableRow({ children: [
              makeHeaderCell("Metric", 2340),
              makeHeaderCell("Current (Apr 2026)", 2340),
              makeHeaderCell("Month 6", 2340),
              makeHeaderCell("Month 12", 2340),
            ] }),
            new TableRow({ children: [
              makeCell("Active Projects", { width: 2340, bold: true }),
              makeCell("6", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("8-10", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("12-16", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Project Income Range", { width: 2340, bold: true }),
              makeCell("R 2,500 - R 6,500", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 3,500 - R 10,000", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 5,000 - R 15,000", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Est. Project Revenue", { width: 2340, bold: true }),
              makeCell("R 15,000 - R 39,000", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 28,000 - R 55,000", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 60,000 - R 100,000+", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Retainer Clients (R 800/client/mo)", { width: 2340, bold: true }),
              makeCell("2-3 clients", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("5-7 clients", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("10-15 clients", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Retainer Income (est.)", { width: 2340, bold: true }),
              makeCell("R 1,600 - R 2,400", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 4,000 - R 5,600", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("R 8,000 - R 12,000", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Team Size", { width: 2340, bold: true }),
              makeCell("1 (owner)", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("2 (owner + intern)", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("2-3", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
            new TableRow({ children: [
              makeCell("Platforms Supported", { width: 2340, bold: true }),
              makeCell("Web-first", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("Web + iOS + Android", { width: 2340, align: AlignmentType.CENTER }),
              makeCell("Full cross-platform", { width: 2340, align: AlignmentType.CENTER }),
            ] }),
          ],
        }),

        bodyParagraph("Note: Project revenue based on 6 active projects at R 2,500-R 6,500 each. Retainer income is a recurring R 800/month per signed-off client for ongoing support & maintenance — a predictable, compounding revenue stream that grows with every completed project.", { italic: true, afterSpacing: 80 }),

        subHeading("3.5 Sustainability & Repayment Plan"),
        bodyParagraph(
          "Swift Designz is already generating active revenue, with 6 concurrent projects and per-project income ranging from R 2,500 to R 6,500 — equating to an estimated R 15,000 to R 39,000 per month in project fees alone. In addition, every signed-off project generates an ongoing retainer fee of R 800 per month per client for support and maintenance. This recurring retainer income compounds with each completed project, providing a growing, predictable revenue base that is independent of new project sales. This demonstrates a proven, sustainable business model — the requested funding will accelerate growth, not fund an untested idea."
        ),
        bodyParagraph(
          "Repayment is backed by two committed sources: an active investor contributing R 2,000 per month, and a minimum R 2,000 per month from Swift Designz business revenue — giving a guaranteed minimum repayment of R 4,000 per month from day one. At this rate, the full R 75,000 is repaid in approximately 19 months, with accelerated repayment expected as revenue grows."
        ),
        bodyParagraph(
          "The intern stipend of R 2,000 per month is modest relative to current monthly revenue, meaning it can be sustained from operating cashflow within the first few months. Long-term, if the intern performs well, they may transition into a permanent role funded entirely from business revenue — achieving both business growth and sustained job creation."
        ),

        subHeading("3.6 Risk Mitigation"),
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [3100, 1500, 4760],
          rows: [
            new TableRow({ children: [
              makeHeaderCell("Risk", 3100),
              makeHeaderCell("Likelihood", 1500),
              makeHeaderCell("Mitigation", 4760),
            ] }),
            new TableRow({ children: [
              makeCell("Slow client uptake", { width: 3100 }),
              makeCell("Medium", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("6 active projects already in progress; diversified service offering; word-of-mouth referrals from existing clients; ongoing social media marketing", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Late or non-payment by clients", { width: 3100 }),
              makeCell("Medium", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("50% deposit required before work commences; formal signed quotes and invoices issued for every project; payment plan agreements in place where needed", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Scope creep / project overruns", { width: 3100 }),
              makeCell("Medium", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("Detailed scope-of-work defined upfront in signed proposals; change requests billed separately; client onboarding documents in place", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Key person dependency (sole founder)", { width: 3100 }),
              makeCell("Medium", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("Intern onboarding reduces single-point-of-failure; all work stored in cloud (Git, Vercel, Google Drive); documented processes and handover procedures", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Intern underperformance", { width: 3100 }),
              makeCell("Low", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("Structured onboarding plan; weekly one-on-ones; clearly defined tasks with deadlines; performance reviewed at 30, 60, and 90 days", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Connectivity / remote work disruption", { width: 3100 }),
              makeCell("Low", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("Primary and backup internet connections; mobile data as failover; all deliverables cloud-hosted so work continues from any location", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Equipment failure", { width: 3100 }),
              makeCell("Low", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("Manufacturer warranty on both machines; all code and assets stored in Git and cloud storage — no critical data stored locally only", { width: 4760 }),
            ] }),
            new TableRow({ children: [
              makeCell("Data security / client data breach", { width: 3100 }),
              makeCell("Low", { width: 1500, align: AlignmentType.CENTER }),
              makeCell("HTTPS enforced on all platforms; no sensitive client data stored locally; secure password management; NDAs signed with enterprise clients", { width: 4760 }),
            ] }),
          ],
        }),

        // ── Closing ──
        bodyParagraph("", { afterSpacing: 300 }),
        new Paragraph({
          spacing: { after: 160 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 8 } },
          children: [new TextRun({ text: " ", font: "Arial", size: 8 })],
        }),

        bodyParagraph(
          "I believe this investment represents a high-impact, low-risk opportunity to grow a viable technology business while creating meaningful employment. I am available to discuss this application in further detail at your convenience.",
          { afterSpacing: 400 }
        ),

        // Signature block
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
          children: [new TextRun({ text: "Founder — Swift Designz", font: "Arial", size: 22, color: DEEP_TEAL })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: dateStr, font: "Arial", size: 20, color: "666666" })],
        }),
      ],
    },
  ],
});

// ── Write output ──
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, "swift-designz-sme-grant-application.docx");
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);

console.log(`\nSME Grant Application Pack generated successfully!`);
console.log(`  Output: ${outputPath}`);
console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
console.log(`\nContents:`);
console.log(`  1. Motivation Letter (Cover + applicant details)`);
console.log(`  2. Detailed Budget Breakdown (R 75,000 total)`);
console.log(`  3. Business Plan Summary (services, projections, risks)`);
