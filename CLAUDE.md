# Swift Designz Website - Project Tracker

## Project Overview
- **Business:** Swift Designz - Freelance software development, web design, e-commerce, apps, PM training, AI training
- **Owner:** Keenan Husselmann
- **Domain:** swiftdesignz.co.za (hosted by IT-Guru, South Africa)
- **Emails:** info@swiftdesignz.co.za, keenan@swiftdesignz.co.za
- **Phone:** NAM +264 81 388 1111 | SA +27 76 255 7783
- **Deployment:** Netlify (auto-deploy from GitHub: KeenanHusselmann/swiftdesignzwebsite)

## Tech Stack
- **Framework:** Next.js 16.2.4 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom glassmorphism/neon CSS
- **Animations:** Framer Motion
- **Email:** Resend API
- **i18n:** next-intl (English + Afrikaans)
- **Icons:** Lucide React

## Brand Identity
- **Colors:** #30B0B0 (teal), #303030 (dark gray), #509090 (muted teal), #307070 (deep teal), #101010 (near black)
- **Style:** Glassmorphism, neon accents, metallic elements, animated, clean, professional
- **NO:** Emojis, boilerplate templates, faith references
- **YES:** Interactive, fun, creative, elegant

## Social & Marketing
- **Facebook Page:** https://www.facebook.com/profile.php?id=61589116923728
- **Instagram:** https://www.instagram.com/swiftdesignz101
- **Meta Pixel ID:** 1731133011582846 (in src/app/layout.tsx)
- **Active Ads:** Lead Gen campaign (R50/day) + Boosted Reel (R50/day) = R100/day total
- **Ad Account Spending Limit:** R400/month cap
- **Google Sheets:** "Swift Designz - Leads" — auto lead delivery from Meta forms

## Pages
- [x] Home - Hero, services overview, CTA
- [x] About - Story, qualifications, 2yr web exp, 1yr app exp, Software Dev degree
- [x] Services - Web dev, E-commerce, Apps/Software, PM Training, AI Training
- [x] Packages - 3 tiers per service (Websites from R2500, Stores from R4000, Apps from R5000)
- [x] Portfolio - Template for showcasing projects
- [x] Testimonials - Multiple testimonials section
- [x] Contact - Form with Resend integration + phone numbers sidebar card
- [x] Privacy Policy
- [x] Terms & Conditions
- [x] Cookie Policy

## Special Features
- Drag-to-unlock splash screen (first visit / once per session)
  - Skipped for Facebook/Instagram in-app browsers (UA detection)
  - Skipped for ad/social traffic (fbclid, utm_source, utm_medium, gclid params)
  - localStorage + cookie dual check to prevent repeat shows
- Fun interactive elements (jokes, random animations, did-you-know)
- Mascot character (GitHub Octocat-inspired)
- Cookie consent banner
- "Get a Quote" buttons on packages
- Bilingual: EN + AF
- Facebook + Instagram social icons in footer
- Phone numbers (NAM + SA) in footer and contact page sidebar

## Package Pricing
### Websites
- Starter: From R2,500 (up to 3 pages, basic design)
- Professional: From R5,000 (up to 7 pages, custom design)
- Premium: From R10,000 (10+ pages, full custom + animations)

### E-Commerce Stores
- Starter: From R4,000 (up to 20 products, catalogue only)
- Business: From R7,500 (up to 100 products, advanced features)
- Enterprise: From R15,000 (unlimited products, full custom)

### Apps & Software
- MVP: From R5,000 (core features, 1 platform)
- Standard: From R12,000 (full features, 2 platforms)
- Full-Scale: From R25,000+ (enterprise-grade, cross-platform)

## Build Progress
- Phase 1: Project setup, configs, design system ✅
- Phase 2: Layout, navigation, splash screen ✅
- Phase 3: All pages ✅
- Phase 4: Interactive elements, i18n, polish ✅
- Phase 5: Marketing infrastructure ✅
  - Meta Pixel deployed
  - Lead Gen campaign live
  - Boosted reel live
  - Google Sheets lead delivery
  - Social links in footer
  - Phone numbers sitewide
  - Doc templates updated (old number replaced)
  - Splash screen fixed for FB/ad traffic

