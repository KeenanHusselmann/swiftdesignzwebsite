"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en" as const, label: "English", short: "EN" },
  { code: "af" as const, label: "Afrikaans", short: "AF" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: "rgba(48, 176, 176, 0.08)",
          border: "1px solid rgba(48, 176, 176, 0.15)",
          color: "var(--swift-teal)",
        }}
      >
        <Globe size={12} />
        {languages.find((l) => l.code === locale)?.short}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute right-0 top-full mt-2 glass-strong rounded-lg overflow-hidden min-w-[120px] z-50"
          style={{ border: "1px solid rgba(48, 176, 176, 0.15)" }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                locale === lang.code
                  ? "text-[var(--swift-teal)] bg-[rgba(48,176,176,0.08)]"
                  : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              {lang.label}
              {locale === lang.code && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--swift-teal)]" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
