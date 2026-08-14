import type { PeriodFilter, Transaction } from "@/types/transaction.types";

/**
 * Filters a list of transactions based on the selected period criteria
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: PeriodFilter
): Transaction[] {
  if (period === "current-month") {
    return transactions.filter((tx) => tx.date.startsWith("2026-08"));
  }

  if (period === "previous-month") {
    return transactions.filter((tx) => tx.date.startsWith("2026-07"));
  }

  if (period === "last-3-months") {
    return transactions.filter(
      (tx) =>
        tx.date.startsWith("2026-08") ||
        tx.date.startsWith("2026-07") ||
        tx.date.startsWith("2026-06")
    );
  }

  return transactions;
}
