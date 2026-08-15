import type { TransactionCategory, TransactionType } from "./transaction.types";

export type PeriodFilter = "current-month" | "previous-month" | "last-3-months" | "custom";

export interface TransactionFilterParams {
  period?: PeriodFilter;
  type?: "all" | TransactionType;
  category?: TransactionCategory | "all";
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  referenceDate?: Date | string;
}

export interface TransactionFiltersState {
  period: PeriodFilter;
  type: "all" | TransactionType;
  category: "all" | TransactionCategory;
}
