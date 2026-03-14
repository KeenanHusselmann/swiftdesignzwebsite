// ─── SHARED QUOTE UTILITIES ──────────────────────────────────────────────────
// Used by both the quote form (page.tsx) and the API route (route.ts).

export interface Phase {
  title: string;
  desc: string;
  duration: string;
  deliverable: string;
}

export const SERVICE_LABELS: Record<string, string> = {
  website:       "Website Development",
  ecommerce:     "E-Commerce Store",
  app:           "App / Software Development",
  "ai-training": "AI Training",
  "pm-training": "Project Management Training",
};

export const PACKAGES_LABELS: Record<string, Record<string, string>> = {
  website:       { starter: "Starter (from R2,500)", professional: "Professional (from R5,000)", premium: "Premium (from R10,000)", "not-sure": "Not sure yet" },
  ecommerce:     { starter: "Starter (from R4,000)", business: "Business (from R7,500)", enterprise: "Enterprise (from R15,000)", "not-sure": "Not sure yet" },
  app:           { mvp: "MVP (from R5,000)", standard: "Standard (from R12,000)", "full-scale": "Full-Scale (from R25,000)", "not-sure": "Not sure yet" },
  "ai-training": { individual: "Individual Session", team: "Team Training", workshop: "Workshop / Course", "not-sure": "Not sure yet" },
  "pm-training": { individual: "Individual Session", team: "Team Training", workshop: "Workshop / Course", "not-sure": "Not sure yet" },
};

export const PROPOSED_PLANS: Record<string, Record<string, Phase[]>> = {
  website: {
    starter: [
      { title: "Discovery & Brief",         desc: "We gather your goals, brand assets, and content.",          duration: "1–2 days",  deliverable: "Project brief & sitemap" },
      { title: "Design Mockup",             desc: "A styled mockup of your homepage for approval.",            duration: "2–4 days",  deliverable: "Homepage design" },
      { title: "Development",               desc: "All pages built, mobile-responsive.",                       duration: "5–8 days",  deliverable: "Live staging site" },
      { title: "Review & Revisions",        desc: "You review, we apply final polish.",                        duration: "1–2 days",  deliverable: "Up to 2 revision rounds" },
      { title: "Launch",                    desc: "Site deployed to your domain with basic SEO.",              duration: "1 day",     deliverable: "Live website + handover notes" },
    ],
    professional: [
      { title: "Discovery & Strategy",      desc: "Deep-dive into your brand, competitors, and goals.",        duration: "2–3 days",  deliverable: "Strategy doc + sitemap" },
      { title: "Design System",             desc: "Full UI kit: typography, colours, component library.",      duration: "4–6 days",  deliverable: "Figma design system" },
      { title: "Development",               desc: "All pages built with animations and CMS if needed.",        duration: "8–12 days", deliverable: "Staging site" },
      { title: "QA & Cross-Browser Testing",desc: "Tested across device sizes and browsers.",                  duration: "2 days",    deliverable: "QA sign-off sheet" },
      { title: "SEO & Performance",         desc: "Meta tags, sitemap, Google Search Console setup.",          duration: "1–2 days",  deliverable: "SEO baseline report" },
      { title: "Launch & Handover",         desc: "Deployed + training on content management.",                duration: "1 day",     deliverable: "Live site + walkthrough" },
    ],
    premium: [
      { title: "Discovery & Branding",      desc: "Full brand audit, target audience research, positioning.",  duration: "3–5 days",   deliverable: "Brand strategy doc" },
      { title: "UX Research & Wireframes",  desc: "User flows, wireframes, and content architecture.",         duration: "4–6 days",   deliverable: "Wireframe deck" },
      { title: "Design System",             desc: "Premium UI kit with micro-animations and brand guidelines.", duration: "6–10 days",  deliverable: "Full Figma design system" },
      { title: "Development Sprint 1",      desc: "Core pages, navigation, and component library.",            duration: "8–12 days",  deliverable: "Core shell" },
      { title: "Development Sprint 2",      desc: "Remaining pages, integrations, animations.",                duration: "6–10 days",  deliverable: "Full staging site" },
      { title: "QA, Accessibility & SEO",   desc: "WCAG compliance, Lighthouse audit, full SEO setup.",        duration: "3–4 days",   deliverable: "Audit reports" },
      { title: "Launch & Handover",         desc: "Go-live, analytics, training, and post-launch support.",    duration: "1–2 days",   deliverable: "Live site + support plan" },
    ],
  },
  ecommerce: {
    starter: [
      { title: "Setup & Configuration",     desc: "Platform setup, payment gateway, delivery zones.",          duration: "1–2 days",   deliverable: "Store skeleton" },
      { title: "Product Upload",            desc: "Up to 20 products with categories and descriptions.",       duration: "2–4 days",   deliverable: "Populated catalogue" },
      { title: "Design & Branding",         desc: "Branded storefront matching your identity.",                duration: "3–5 days",   deliverable: "Styled storefront" },
      { title: "Review & Testing",          desc: "End-to-end purchase flow tested.",                          duration: "1–2 days",   deliverable: "Test order confirmation" },
      { title: "Launch",                    desc: "Live store with domain and basic SEO.",                     duration: "1 day",      deliverable: "Live store + handover" },
    ],
    business: [
      { title: "Strategy & Setup",          desc: "Platform config, payment, shipping, tax rules.",            duration: "2–3 days",   deliverable: "Configured environment" },
      { title: "Custom Theme Design",       desc: "Fully branded theme with custom components.",               duration: "5–8 days",   deliverable: "Design sign-off" },
      { title: "Development",               desc: "Custom theme build, wish lists, reviews, filters.",         duration: "8–12 days",  deliverable: "Staging store" },
      { title: "Product Upload & SEO",      desc: "Up to 100 products, SEO product descriptions.",            duration: "3–5 days",   deliverable: "Optimised catalogue" },
      { title: "Testing & QA",              desc: "Order flow, mobile, cross-browser, load testing.",          duration: "2–3 days",   deliverable: "QA report" },
      { title: "Launch & Handover",         desc: "Go-live, analytics, staff training.",                       duration: "1 day",      deliverable: "Live store + training" },
    ],
    enterprise: [
      { title: "Discovery & Architecture",  desc: "ERP mapping, integrations scoping, API planning.",          duration: "4–6 days",   deliverable: "Technical architecture doc" },
      { title: "Design System",             desc: "Branded UI kit, custom component library.",                 duration: "7–10 days",  deliverable: "Figma system" },
      { title: "Core Development",          desc: "Platform, custom features, admin dashboard.",               duration: "14–20 days", deliverable: "Core build" },
      { title: "Integrations",              desc: "ERP, CRM, logistics API, payment gateways.",                duration: "5–8 days",   deliverable: "Integration test suite" },
      { title: "Data Migration & Upload",   desc: "Inventory import, historical data, SEO URLs.",              duration: "4–6 days",   deliverable: "Migrated catalogue" },
      { title: "QA & Load Testing",         desc: "Full regression, performance, and security audit.",         duration: "4–5 days",   deliverable: "Signed-off QA doc" },
      { title: "Launch & Handover",         desc: "Phased go-live, staff training, support SLA.",              duration: "2–3 days",   deliverable: "Live store + SLA" },
    ],
  },
  app: {
    mvp: [
      { title: "Requirements Gathering",    desc: "User stories, feature list, and success criteria.",         duration: "2–3 days",   deliverable: "Requirements doc" },
      { title: "UI/UX Design",              desc: "Wireframes and high-fidelity screens for core flows.",      duration: "3–6 days",   deliverable: "Figma prototype" },
      { title: "Development",               desc: "Core feature build: auth, main flows, database schema.",    duration: "10–16 days", deliverable: "Working app build" },
      { title: "Testing & Bug Fixes",       desc: "Functional testing, edge cases, performance checks.",       duration: "3–4 days",   deliverable: "Test results" },
      { title: "Deployment",                desc: "Deployed to cloud / app store with CI/CD pipeline.",        duration: "1–2 days",   deliverable: "Live app + deploy docs" },
    ],
    standard: [
      { title: "Discovery & Architecture",  desc: "Technical stack decision, data models, API design.",        duration: "3–5 days",   deliverable: "Tech spec" },
      { title: "UX Research & Design",      desc: "Full UX flow, component library, responsive design.",       duration: "6–10 days",  deliverable: "Figma design system" },
      { title: "Backend Development",       desc: "APIs, database, auth, admin dashboard.",                    duration: "10–14 days", deliverable: "API + admin ready" },
      { title: "Frontend Development",      desc: "Full UI connected to backend APIs.",                        duration: "8–12 days",  deliverable: "Integrated app" },
      { title: "Testing & QA",              desc: "Unit, integration, and end-to-end tests.",                  duration: "4–5 days",   deliverable: "Test suite + report" },
      { title: "Deployment & Handover",     desc: "Multi-platform deploy, monitoring, documentation.",         duration: "2–3 days",   deliverable: "Live app + docs" },
    ],
    "full-scale": [
      { title: "Discovery & Planning",      desc: "Stakeholder workshops, business process mapping.",          duration: "5–7 days",   deliverable: "Project charter" },
      { title: "Architecture Design",       desc: "System architecture, microservices, security model.",       duration: "5–8 days",   deliverable: "Architecture doc" },
      { title: "Design System",             desc: "Enterprise UI kit, accessibility, multi-platform.",         duration: "8–12 days",  deliverable: "Full design system" },
      { title: "Sprint 1 — Foundation",     desc: "Core infrastructure, auth, user management.",               duration: "10–14 days", deliverable: "Base platform" },
      { title: "Sprint 2 — Features",       desc: "Primary feature modules development.",                      duration: "14–20 days", deliverable: "Feature-complete build" },
      { title: "Sprint 3 — Integrations",   desc: "Third-party APIs, payments, notifications.",                duration: "8–12 days",  deliverable: "Integrated system" },
      { title: "QA & Security Audit",       desc: "Full regression, penetration testing, performance.",        duration: "6–8 days",   deliverable: "Security audit report" },
      { title: "Deployment & Handover",     desc: "CI/CD pipeline, monitoring, staff training, SLA.",          duration: "3–5 days",   deliverable: "Live system + SLA" },
    ],
  },
  "ai-training": {
    individual: [
      { title: "Needs Assessment",          desc: "Understand your current skill level and goals.",            duration: "15 min",        deliverable: "Tailored session plan" },
      { title: "Session Preparation",       desc: "Custom examples and exercises created for you.",            duration: "1 day",         deliverable: "Session materials" },
      { title: "Live Training Session",     desc: "Interactive 1-on-1 session via video call.",               duration: "30 min",        deliverable: "Recorded session (optional)" },
      { title: "Resource Pack",             desc: "Cheat sheets, prompts, and further learning links.",        duration: "After session", deliverable: "PDF resource pack" },
    ],
    team: [
      { title: "Needs Assessment",          desc: "Team survey to align on goals and current AI usage.",       duration: "2–3 days",      deliverable: "Team readiness report" },
      { title: "Custom Content Creation",   desc: "Industry-specific examples and exercises for your team.",   duration: "3–5 days",      deliverable: "Training slide deck" },
      { title: "Live Group Session",        desc: "Interactive 1.5hr training via video call.",               duration: "1.5 hrs",       deliverable: "Recorded session" },
      { title: "Q&A Follow-up",             desc: "Async Q&A channel open for 7 days post-training.",         duration: "7 days",        deliverable: "Written Q&A summary" },
      { title: "Resource Pack",             desc: "Team toolkit, prompt library, and reference guide.",        duration: "After session", deliverable: "Team resource pack" },
    ],
    workshop: [
      { title: "Needs Assessment & Scoping",desc: "Define learning outcomes, audience, and duration.",         duration: "3–5 days",      deliverable: "Curriculum outline" },
      { title: "Curriculum Design",         desc: "Full multi-session programme with exercises.",              duration: "5–8 days",      deliverable: "Full slide deck + workbooks" },
      { title: "Session Delivery",          desc: "Full-day or multi-session live workshop.",                  duration: "1–3 days",      deliverable: "Live workshop recordings" },
      { title: "Assessment & Feedback",     desc: "Participant assessment and programme feedback report.",     duration: "2–3 days",      deliverable: "Performance report" },
      { title: "Resource Library",          desc: "Complete resource pack, certifications, and next steps.",   duration: "After workshop", deliverable: "Resource library" },
    ],
  },
  "pm-training": {
    individual: [
      { title: "Needs Assessment",          desc: "Understand your role, project types, and growth goals.",    duration: "15 min",        deliverable: "Tailored session plan" },
      { title: "Session Preparation",       desc: "Custom scenarios from your industry.",                     duration: "1 day",         deliverable: "Session materials" },
      { title: "Live Coaching Session",     desc: "1-on-1 PM coaching session via video call.",               duration: "30 min",        deliverable: "Recorded session (optional)" },
      { title: "Action Plan",               desc: "Personalised PM improvement roadmap and resources.",        duration: "After session", deliverable: "Action plan PDF" },
    ],
    team: [
      { title: "Team Assessment",           desc: "Survey on current PM maturity, tools, and blockers.",       duration: "2–3 days",      deliverable: "PM maturity report" },
      { title: "Custom Workshop Design",    desc: "Tailored content for your team's frameworks and tools.",    duration: "3–5 days",      deliverable: "Workshop slide deck" },
      { title: "Live Group Training",       desc: "Interactive 1.5hr PM training session.",                   duration: "1.5 hrs",       deliverable: "Recorded session" },
      { title: "Follow-up & Templates",     desc: "Templates for sprints, retros, and planning.",              duration: "After session", deliverable: "PM template library" },
    ],
    workshop: [
      { title: "Scoping & Outcome Design",  desc: "Define goals, audience, certifications targeted.",          duration: "3–5 days",      deliverable: "Programme outline" },
      { title: "Curriculum Design",         desc: "Multi-session Agile, Scrum, or Kanban programme.",          duration: "5–8 days",      deliverable: "Full curriculum + workbooks" },
      { title: "Live Delivery",             desc: "Full-day or multi-day workshop programme.",                 duration: "1–5 days",      deliverable: "Workshop + recordings" },
      { title: "Certification Support",     desc: "Exam guidance, practice tests, and study materials.",       duration: "Ongoing",       deliverable: "Study pack" },
      { title: "Retrospective & Report",    desc: "Programme feedback and next-steps recommendation.",         duration: "2–3 days",      deliverable: "Programme report" },
    ],
  },
};

/** Returns the proposed project phases for a given service + package combo. */
export function buildPlan(service: string, pkg: string): Phase[] {
  const key = pkg.toLowerCase().replace(/\s+/g, "-");
  return PROPOSED_PLANS[service]?.[key] ?? [];
}

/** Escapes HTML special characters to prevent XSS. */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/** Validates a basic email format. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** All valid service IDs. */
export const VALID_SERVICES = Object.keys(SERVICE_LABELS);

/** Returns the human-readable package label with price, or falls back to the raw value. */
export function getPackageLabel(service: string, pkg: string): string {
  return (PACKAGES_LABELS[service]?.[pkg] ?? pkg) || "—";
}
