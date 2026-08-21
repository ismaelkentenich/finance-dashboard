import type { ExchangeRate, GetExchangeRateParams } from "@/types";

export interface ExchangeRateProvider {
  getRate(params: GetExchangeRateParams): Promise<ExchangeRate>;
}
