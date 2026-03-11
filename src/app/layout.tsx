import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import SplashScreen from "@/components/ui/SplashScreen";
import FunButton from "@/components/fun/FunButton";
import { I18nProvider } from "@/i18n/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <I18nProvider>
          <SplashScreen />
          <BackgroundEffects />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <FunButton />
        </I18nProvider>
      </body>
    </html>
  );
}
