import { SUPPORTED_LOCALES } from "@/constants/locale.constants";
import type { SupportedLocale } from "@/locales/types";

/**
 * Type guard to validate whether an unknown value is a SupportedLocale.
 */
export function isValidLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
