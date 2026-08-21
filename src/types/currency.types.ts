import type { SupportedCurrency } from "@/constants/currency.constants";

export type CurrencyCode = SupportedCurrency;

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  date: string;
}

export interface GetExchangeRateParams {
  from: CurrencyCode;
  to: CurrencyCode;
  date?: string;
}
