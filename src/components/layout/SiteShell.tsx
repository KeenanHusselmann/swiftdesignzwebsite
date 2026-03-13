"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import SplashScreen from "@/components/ui/SplashScreen";
import FunButton from "@/components/fun/FunButton";
import TetrisButton from "@/components/fun/TetrisButton";
import ClickTracker from "@/components/ui/ClickTracker";

/** Pages that should render without the global site chrome (nav/footer/effects). */
const STANDALONE_ROUTES = ["/links"];

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isStandalone) {
    return (
      <>
        <main>{children}</main>
        <CookieConsent />
      </>
    );
  }

  return (
    <>
      <SplashScreen />
      <BackgroundEffects />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
      <FunButton />
      <TetrisButton />
      <ClickTracker />
    </>
  );
}
