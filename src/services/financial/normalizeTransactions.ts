import type { ExchangeRateProvider } from "@/services/exchange";
import type { CurrencyCode, ExchangeRate, NormalizedTransaction, Transaction } from "@/types";
import { convertAmount } from "./currencyConversion";

interface NormalizeTransactionsParams {
  transactions: Transaction[];
  targetCurrency: CurrencyCode;
  exchangeRateProvider: ExchangeRateProvider;
}

function createRateCacheKey(from: CurrencyCode, to: CurrencyCode, date: string): string {
  return `${from}:${to}:${date}`;
}

export async function normalizeTransactions({
  transactions,
  targetCurrency,
  exchangeRateProvider,
}: NormalizeTransactionsParams): Promise<NormalizedTransaction[]> {
  const rateCache = new Map<string, Promise<ExchangeRate>>();

  const normalizedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      if (transaction.currency === targetCurrency) {
        return {
          ...transaction,
          normalizedAmount: transaction.amount,
          normalizedCurrency: targetCurrency,
        };
      }

      const cacheKey = createRateCacheKey(transaction.currency, targetCurrency, transaction.date);

      let ratePromise = rateCache.get(cacheKey);

      if (!ratePromise) {
        ratePromise = exchangeRateProvider.getRate({
          from: transaction.currency,
          to: targetCurrency,
          date: transaction.date,
        });

        rateCache.set(cacheKey, ratePromise);
      }

      const exchangeRate = await ratePromise;

      return {
        ...transaction,

        normalizedAmount: convertAmount(transaction.amount, exchangeRate.rate),

        normalizedCurrency: targetCurrency,
      };
    })
  );

  return normalizedTransactions;
}
