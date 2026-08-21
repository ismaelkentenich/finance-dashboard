import type { SupportedLocale } from "@/locales/types";

export const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY_BY_LOCALE = {
  "pt-BR": "BRL",
  "en-US": "USD",
} as const satisfies Record<SupportedLocale, SupportedCurrency>;

export const CURRENCY_LABELS = {
  BRL: {
    "pt-BR": "Real brasileiro",
    "en-US": "Brazilian Real",
  },
  USD: {
    "pt-BR": "Dólar americano",
    "en-US": "US Dollar",
  },
  EUR: {
    "pt-BR": "Euro",
    "en-US": "Euro",
  },
  GBP: {
    "pt-BR": "Libra esterlina",
    "en-US": "British Pound",
  },
  JPY: {
    "pt-BR": "Iene japonês",
    "en-US": "Japanese Yen",
  },
  CAD: {
    "pt-BR": "Dólar canadense",
    "en-US": "Canadian Dollar",
  },
  AUD: {
    "pt-BR": "Dólar australiano",
    "en-US": "Australian Dollar",
  },
} as const satisfies Record<SupportedCurrency, Record<SupportedLocale, string>>;

export const FRANKFURTER_API_BASE_URL = "https://api.frankfurter.dev/v2";
