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
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
});

const lobster = Lobster({
  subsets: ["latin"],
  variable: "--font-lobster",
  weight: ["400"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--font-abril",
  weight: ["400"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400"],
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
  openGraph: {
    title: "Swift Designz | Crafting Digital Excellence",
    description:
      "Professional web development, e-commerce solutions, custom software & apps.",
    url: "https://swiftdesignz.co.za",
    siteName: "Swift Designz",
    type: "website",
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
        {/* Preload logo so the browser fetches it before JS hydration */}
        <link rel="preload" as="image" href="/images/logo.png" />
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
