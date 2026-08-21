import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { isValidISODate } from "@/utils/date";
import { z } from "zod";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const exchangeRateDateSchema = z
  .string()
  .regex(ISO_DATE_REGEX, {
    message: "Invalid date format. Expected YYYY-MM-DD.",
  })
  .refine(isValidISODate, {
    message: "Invalid calendar date.",
  });

export const frankfurterRateResponseSchema = z.object({
  date: exchangeRateDateSchema,
  base: z.enum(SUPPORTED_CURRENCIES),
  quote: z.enum(SUPPORTED_CURRENCIES),
  rate: z.number().positive(),
});

export const exchangeRateSchema = z.object({
  from: z.enum(SUPPORTED_CURRENCIES),
  to: z.enum(SUPPORTED_CURRENCIES),
  rate: z.number().positive(),
  date: exchangeRateDateSchema,
});

export const exchangeRateResponseSchema = z.object({
  data: exchangeRateSchema,
});

export type ExchangeRateDateSchema = z.infer<typeof exchangeRateDateSchema>;
export type FrankfurterRateResponse = z.infer<typeof frankfurterRateResponseSchema>;
export type ExchangeRateResponseSchema = z.infer<typeof exchangeRateResponseSchema>;
