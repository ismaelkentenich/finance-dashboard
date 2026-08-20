import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { exchangeRateDateSchema } from "@/schemas/exchangeRate.schema";
import { z } from "zod";

export const historicalExchangeRateDateSchema = exchangeRateDateSchema.refine(
  (value) => {
    const selectedDate = new Date(`${value}T00:00:00Z`);

    const now = new Date();

    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    return selectedDate <= todayUtc;
  },
  {
    message: "Exchange rate date cannot be in the future.",
  }
);

export const exchangeRateQuerySchema = z.object({
  from: z.enum(SUPPORTED_CURRENCIES),
  to: z.enum(SUPPORTED_CURRENCIES),
  date: historicalExchangeRateDateSchema.optional(),
});

export type ExchangeRateQuery = z.infer<typeof exchangeRateQuerySchema>;
