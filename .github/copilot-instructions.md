# GitHub Copilot Instructions for Swift Designz Website

## Project Overview
- **Business:** Swift Designz - Freelance software development, web app design, e-commerce, apps, PM training, AI training
- **Owner:** Keenan
- **Domain:** swiftdesignz.co.za

## Tech Stack & Architecture
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom glassmorphism/neon CSS
- **Animations:** Framer Motion
- **Email:** Resend API
- **Internationalization (i18n):** next-intl (English + Afrikaans)
- **Icons:** Lucide React

## Brand Identity & Design Guidelines
- **Core Colors:** #30B0B0 (teal), #303030 (dark gray), #509090 (muted teal), #307070 (deep teal), #101010 (near black)
- **Visual Style:** Glassmorphism, neon accents, metallic elements, animated, clean, professional
- **Tone & Rules:** 
  - **NO:** Emojis, boilerplate templates, faith references
  - **YES:** Interactive, fun, creative, elegant

## Special Features to Remember
- Drag-to-unlock splash screen (first visit / once per session)
- Fun interactive elements (jokes, random animations, did-you-know)
- Mascot character (GitHub Octocat-inspired)
- Cookie consent banner
- "Get a Quote" buttons on packages
- Bilingual: EN + AF

## Coding Standards
- Ensure strict TypeScript typing.
- Follow Next.js 15 App Router best practices (`page.tsx`, `layout.tsx`, server vs client components).
- Ensure all new text updates utilize `next-intl` localization files (`messages/en.json` and `messages/af.json`) rather than hardcoding English text.
- Maintain the glassmorphism and neon aesthetic using Tailwind CSS utility classes and custom defined CSS variables.