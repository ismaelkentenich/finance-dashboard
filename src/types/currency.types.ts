import type { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  date: string;
}
