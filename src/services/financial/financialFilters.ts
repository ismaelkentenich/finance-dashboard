import type { FilterOptions, PeriodFilter, Transaction } from "@/types";

export function applyTransactionFilters(
  transactions: Transaction[],
  options: FilterOptions = {}
): Transaction[] {
  const { type, category } = options;

  let result = transactions;

  if (type && type !== "all") {
    result = result.filter((tx) => tx.type === type);
  }

  if (category && category !== "all") {
    result = result.filter((tx) => tx.category === category);
  }

  return result;
}

function getYearMonthParts(referenceDate: Date | string): { year: number; month: number } {
  if (typeof referenceDate === "string") {
    const [yearStr, monthStr] = referenceDate.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;

    if (!isNaN(year) && !isNaN(month)) {
      return { year, month };
    }
  }

  const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
  };
}

function formatYearMonth(year: number, month: number): string {
  const adjustedDate = new Date(Date.UTC(year, month, 1));
  const y = adjustedDate.getUTCFullYear();
  const m = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: PeriodFilter,
  referenceDate: Date | string = new Date()
): Transaction[] {
  const { year, month } = getYearMonthParts(referenceDate);

  if (period === "current-month") {
    const currentYearMonth = formatYearMonth(year, month);
    return transactions.filter((tx) => tx.date.startsWith(currentYearMonth));
  }

  if (period === "previous-month") {
    const previousYearMonth = formatYearMonth(year, month - 1);
    return transactions.filter((tx) => tx.date.startsWith(previousYearMonth));
  }

  if (period === "last-3-months") {
    const targetMonths = new Set([
      formatYearMonth(year, month),
      formatYearMonth(year, month - 1),
      formatYearMonth(year, month - 2),
    ]);

    return transactions.filter((tx) => {
      const txYearMonth = tx.date.substring(0, 7);
      return targetMonths.has(txYearMonth);
    });
  }

  return transactions;
}

export function filterTransactionsByEquivalentPreviousPeriod(
  transactions: Transaction[],
  period: PeriodFilter,
  referenceDate: Date | string = new Date()
): Transaction[] {
  const { year, month } = getYearMonthParts(referenceDate);

  if (period === "current-month") {
    const previousMonth = formatYearMonth(year, month - 1);
    return transactions.filter((tx) => tx.date.startsWith(previousMonth));
  }

  if (period === "previous-month") {
    const twoMonthsAgo = formatYearMonth(year, month - 2);
    return transactions.filter((tx) => tx.date.startsWith(twoMonthsAgo));
  }

  if (period === "last-3-months") {
    const priorThreeMonths = new Set([
      formatYearMonth(year, month - 3),
      formatYearMonth(year, month - 4),
      formatYearMonth(year, month - 5),
    ]);

    return transactions.filter((tx) => {
      const txYearMonth = tx.date.substring(0, 7);
      return priorThreeMonths.has(txYearMonth);
    });
  }

  return [];
}
