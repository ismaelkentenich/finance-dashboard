import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { z } from "zod";

export const frankfurterRateResponseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  base: z.enum(SUPPORTED_CURRENCIES),
  quote: z.enum(SUPPORTED_CURRENCIES),
  rate: z.number().positive(),
});

export type FrankfurterRateResponse = z.infer<typeof frankfurterRateResponseSchema>;
