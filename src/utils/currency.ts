import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import type { CurrencyCode } from "@/types";

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}
