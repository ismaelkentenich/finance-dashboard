import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { VALID_PERIODS, VALID_TRANSACTION_TYPES } from "@/constants/filter.constants";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { z } from "zod";

const TRANSACTION_CATEGORIES = ["all", ...ALL_CATEGORIES] as const;

export const transactionQuerySchema = z.object({
  period: z.enum(VALID_PERIODS).default("current-month"),
  type: z.enum(VALID_TRANSACTION_TYPES).optional(),
  category: z.enum(TRANSACTION_CATEGORIES).optional(),
  currency: z.enum(SUPPORTED_CURRENCIES).default("BRL"),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
