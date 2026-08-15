import { VALID_PERIODS, VALID_TRANSACTION_TYPES } from "@/constants/filter.constants";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";

/**
 * Runtime type guard to validate whether an arbitrary value is a valid PeriodFilter.
 */
export function isValidPeriod(value: unknown): value is PeriodFilter {
  return typeof value === "string" && (VALID_PERIODS as readonly string[]).includes(value);
}

/**
 * Runtime type guard to validate whether an arbitrary value is a valid TransactionType or 'all'.
 */
export function isValidTransactionType(value: unknown): value is "all" | TransactionType {
  return (
    typeof value === "string" && (VALID_TRANSACTION_TYPES as readonly string[]).includes(value)
  );
}

/**
 * Runtime type guard to validate whether an arbitrary value is a valid TransactionCategory.
 */
export function isValidCategory(value: unknown): value is TransactionCategory {
  return typeof value === "string" && (ALL_CATEGORIES as readonly string[]).includes(value);
}
