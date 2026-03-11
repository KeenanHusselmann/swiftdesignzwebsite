"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import en from "@/messages/en.json";
import af from "@/messages/af.json";
import Cookies from "js-cookie";

type Locale = "en" | "af";
type Messages = typeof en;

const messages: Record<Locale, Messages> = { en, af };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (path: string) => path,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = Cookies.get("swift-locale") as Locale | undefined;
    if (saved && (saved === "en" || saved === "af")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    Cookies.set("swift-locale", newLocale, { expires: 365 });
  }, []);

  const t = useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let result: unknown = messages[locale];
      for (const key of keys) {
        if (result && typeof result === "object" && key in result) {
          result = (result as Record<string, unknown>)[key];
        } else {
          return path;
        }
      }
      return typeof result === "string" ? result : path;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
