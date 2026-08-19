import type { SupportedLocale } from "@/locales/types";

export const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"] as const;

export const DEFAULT_CURRENCY_BY_LOCALE = {
  "pt-BR": "BRL",
  "en-US": "USD",
} as const satisfies Record<SupportedLocale, (typeof SUPPORTED_CURRENCIES)[number]>;
