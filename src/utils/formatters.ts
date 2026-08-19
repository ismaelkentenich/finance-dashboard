import type { SupportedLocale } from "@/locales/types";
import { CurrencyCode } from "@/types";

export function normalizeSpaces(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

export function formatCurrency(
  value: number,
  locale: SupportedLocale = "pt-BR",
  currency?: CurrencyCode
): string {
  const sanitizedValue = Object.is(value, -0) || value === 0 ? 0 : value;

  const resolvedCurrency = currency ?? (locale === "pt-BR" ? "BRL" : "USD");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: resolvedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sanitizedValue);
}

export function formatPercentage(value: number): string {
  const sanitizedValue = Object.is(value, -0) || value === 0 ? 0 : value;
  const sign = sanitizedValue > 0 ? "+" : "";
  return `${sign}${sanitizedValue.toFixed(1)}%`;
}

export function formatDate(dateString: string, locale: SupportedLocale = "pt-BR"): string {
  const sanitizedDate = dateString.includes("T")
    ? new Date(dateString)
    : new Date(`${dateString}T12:00:00Z`);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(sanitizedDate)
    .replace(".", "");
}
