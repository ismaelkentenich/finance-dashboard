"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
} from "@/constants/locale.constants";
import { en } from "@/locales/en";
import { pt } from "@/locales/pt-br";
import type { SupportedLocale, TranslationSchema } from "@/locales/types";
import { telemetryService } from "@/services/telemetry";
import { isValidLocale } from "@/utils/locale";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface LocaleContextValue {
  locale: SupportedLocale;
  t: TranslationSchema;
  setLocale: (locale: SupportedLocale) => void;
}

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}

const DICTIONARY_MAP: Record<SupportedLocale, TranslationSchema> = {
  "en-US": en,
  "pt-BR": pt,
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function getPersistedClientLocale(): SupportedLocale | null {
  if (typeof window === "undefined") return null;

  // Attempt to read from document cookies in browser environment
  try {
    const cookieMatch = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`));

    if (cookieMatch) {
      const rawValue = cookieMatch.split("=")[1];
      const cookieVal = decodeURIComponent(rawValue);
      if (isValidLocale(cookieVal)) return cookieVal;
    }
  } catch (error) {
    telemetryService.log("warn", "Failed to read or parse locale from document cookies", {
      boundary: "LocaleContext.getPersistedClientLocale",
      error: toError(error).message,
    });
  }

  // Fallback to localStorage
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isValidLocale(stored)) return stored;
  } catch (error) {
    telemetryService.log("warn", "Failed to read locale from localStorage", {
      boundary: "LocaleContext.getPersistedClientLocale",
      error: toError(error).message,
    });
  }

  return null;
}

function persistLocale(nextLocale: SupportedLocale): void {
  if (typeof window === "undefined") return;

  // Persist to cookie with 1-year expiration
  try {
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(
      nextLocale
    )}; path=/; max-age=${oneYearInSeconds}; SameSite=Lax`;
  } catch (error) {
    telemetryService.log("warn", "Failed to persist locale to cookie", {
      boundary: "LocaleContext.persistLocale",
      locale: nextLocale,
      error: toError(error).message,
    });
  }

  // Persist to localStorage as client-side fallback
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  } catch (error) {
    telemetryService.log("warn", "Failed to persist locale to localStorage", {
      boundary: "LocaleContext.persistLocale",
      locale: nextLocale,
      error: toError(error).message,
    });
  }
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale;
    }
    const clientPersisted = getPersistedClientLocale();
    if (clientPersisted) {
      return clientPersisted;
    }
    return DEFAULT_LOCALE;
  });

  useEffect(() => {
    try {
      document.documentElement.lang = locale;
    } catch (error) {
      telemetryService.log("warn", "Failed to update documentElement lang attribute", {
        boundary: "LocaleContext.useEffect",
        locale,
        error: toError(error).message,
      });
    }
  }, [locale]);

  const setLocale = (newLocale: SupportedLocale) => {
    if (!isValidLocale(newLocale) || newLocale === locale) return;
    setLocaleState(newLocale);
    persistLocale(newLocale);
  };

  const value: LocaleContextValue = {
    locale,
    t: DICTIONARY_MAP[locale] || pt,
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
