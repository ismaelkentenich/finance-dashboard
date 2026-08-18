import { VALID_PERIODS } from "@/constants/filter.constants";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";
import { z } from "zod";

const TRANSACTION_TYPES: readonly [TransactionType, ...TransactionType[]] = ["income", "expense"];

const TRANSACTION_CATEGORIES: readonly [TransactionCategory, ...TransactionCategory[]] =
  ALL_CATEGORIES;

const PERIOD_FILTERS: readonly [PeriodFilter, ...PeriodFilter[]] = [
  VALID_PERIODS[0],
  ...VALID_PERIODS.slice(1),
];

export const transactionSchema = z.object({
  id: z.string().min(1),
  description: z.string(),
  amount: z.number(),
  type: z.enum(TRANSACTION_TYPES),
  category: z.enum(TRANSACTION_CATEGORIES),
  date: z.string(),
  createdAt: z.string(),
});

export const periodComparisonSchema = z.object({
  balanceVariation: z.number(),
  incomeVariation: z.number(),
  expensesVariation: z.number(),
});

export const financialSummarySchema = z.object({
  currentBalance: z.number(),
  totalIncome: z.number(),
  totalExpenses: z.number(),
  savingsRate: z.number(),
  periodComparison: periodComparisonSchema,
});

export const categorySummarySchema = z.object({
  category: z.enum(TRANSACTION_CATEGORIES),
  categoryLabel: z.string(),
  totalAmount: z.number(),
  percentage: z.number(),
  transactionCount: z.number(),
});

export const dashboardDataSchema = z.object({
  transactions: z.array(transactionSchema),
  summary: financialSummarySchema,
  categories: z.array(categorySummarySchema),
});

export const dashboardMetaSchema = z.object({
  totalCount: z.number(),
  period: z.enum(PERIOD_FILTERS),
});

export const getDashboardDataResponseSchema = z.object({
  data: dashboardDataSchema,
  meta: dashboardMetaSchema,
});

export const createTransactionResponseSchema = z.object({
  data: transactionSchema,
});

export type GetDashboardDataResponseSchema = z.infer<typeof getDashboardDataResponseSchema>;
export type CreateTransactionResponseSchema = z.infer<typeof createTransactionResponseSchema>;
