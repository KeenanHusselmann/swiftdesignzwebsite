"use client";

import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/app/components/ui/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/packages", key: "nav.packages" },
  { href: "/portfolio", key: "nav.portfolio" },
  { href: "/testimonials", key: "nav.testimonials" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    startTransition(() => setMobileOpen(false));
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "glass-strong py-3"
            : "py-5"
        }`}
        style={{
          borderBottom: scrolled ? "1px solid rgba(48, 176, 176, 0.1)" : "none",
        }}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2"
            >
              <Image src="/images/favicon.png" alt="" width={32} height={32} className="w-8 h-8" />
              <span
                className="font-bold text-lg tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #fff 30%, var(--swift-teal) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Swift <span style={{ WebkitTextFillColor: "var(--swift-teal)", color: "var(--swift-teal)" }}>Designz</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navKeys.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-lg ${
                    pathname === link.href
                      ? "text-[var(--swift-teal)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {t(link.key)}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px]"
                      style={{
                        background: "linear-gradient(90deg, var(--swift-teal), rgba(217,119,6,0.6))",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            ))}
            <Link href="/quote" className="neon-btn ml-4 !py-2 !px-5 text-sm">
              {t("nav.getQuote")}
            </Link>
            {/* Language Switcher — far right */}
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-10 p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} color="var(--swift-teal)" />
            ) : (
              <Menu size={24} color="var(--swift-teal)" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
            style={{
              background: "rgba(16, 16, 16, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
            {navKeys.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`text-2xl font-light tracking-wider transition-colors ${
                    pathname === link.href
                      ? "neon-text"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.key)}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <LanguageSwitcher />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/quote"
                className="neon-btn-filled neon-btn mt-4"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.getQuote")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
