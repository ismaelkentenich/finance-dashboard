"use client";

import { en } from "@/locales/en";
import { pt } from "@/locales/pt-br";
import type { SupportedLocale, TranslationSchema } from "@/locales/types";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface LocaleContextValue {
  locale: SupportedLocale;
  t: TranslationSchema;
  setLocale: (locale: SupportedLocale) => void;
}

const DICTIONARY_MAP: Record<SupportedLocale, TranslationSchema> = {
  "en-US": en,
  "pt-BR": pt,
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>("pt-BR");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value: LocaleContextValue = {
    locale,
    t: DICTIONARY_MAP[locale],
    setLocale,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
