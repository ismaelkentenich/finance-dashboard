import type { PeriodFilter, TransactionFiltersState, TransactionType } from "@/types";

export const VALID_PERIODS: readonly PeriodFilter[] = [
  "current-month",
  "previous-month",
  "last-3-months",
  "custom",
] as const;

export const VALID_TRANSACTION_TYPES: readonly ("all" | TransactionType)[] = [
  "all",
  "income",
  "expense",
] as const;

export const DEFAULT_TRANSACTION_FILTERS: TransactionFiltersState = {
  period: "current-month",
  type: "all",
  category: "all",
} as const;
