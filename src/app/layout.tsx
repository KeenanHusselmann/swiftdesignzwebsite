import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Dancing_Script,
  Cinzel,
  Cormorant_Garamond,
  Bebas_Neue,
  Lobster,
  Great_Vibes,
  Abril_Fatface,
  Orbitron,
  Raleway,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import SplashScreen from "@/components/ui/SplashScreen";
import FunButton from "@/components/fun/FunButton";
import TetrisButton from "@/components/fun/TetrisButton";
import { I18nProvider } from "@/i18n/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400"],
  display: "optional",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
});

const lobster = Lobster({
  subsets: ["latin"],
  variable: "--font-lobster",
  weight: ["400"],
  display: "optional",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
  display: "optional",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--font-abril",
  weight: ["400"],
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swift Designz | Crafting Digital Excellence",
  description:
    "Professional web development, e-commerce solutions, custom software & apps. Fast, elegant, creative digital services in South Africa.",
  keywords: [
    "web development",
    "e-commerce",
    "software development",
    "mobile apps",
    "South Africa",
    "Swift Designz",
    "freelance developer",
  ],
  authors: [{ name: "Swift Designz" }],
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    apple: "/images/favicon.png",
    shortcut: "/images/favicon.png",
  },
  openGraph: {
    title: "Swift Designz | Crafting Digital Excellence",
    description:
      "Professional web development, e-commerce solutions, custom software & apps. Fast, elegant, creative digital services in South Africa.",
    url: "https://swiftdesignz.co.za",
    siteName: "Swift Designz",
    type: "website",
    images: [
      {
        url: "https://swiftdesignz.co.za/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Swift Designz – Crafting Digital Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swift Designz | Crafting Digital Excellence",
    description:
      "Professional web development, e-commerce solutions, custom software & apps.",
    images: ["https://swiftdesignz.co.za/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} ${cinzel.variable} ${cormorantGaramond.variable} ${bebasNeue.variable} ${lobster.variable} ${greatVibes.variable} ${abrilFatface.variable} ${orbitron.variable} ${raleway.variable}`}>
      <head>
        {/* Preload critical hero assets */}
        <link rel="preload" as="image" href="/images/logo.png" />
        <link rel="preload" as="image" href="/images/favicon.png" />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <SplashScreen />
          <BackgroundEffects />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <FunButton />
          <TetrisButton />
        </I18nProvider>
      </body>
    </html>
  );
}
