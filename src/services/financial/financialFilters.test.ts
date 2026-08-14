import type { PeriodFilter, Transaction } from "@/types";
import { describe, expect, it } from "vitest";
import { filterTransactionsByPeriod } from "./financialFilters";

function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-test-id",
    description: "Sample Description",
    amount: 100,
    type: "expense",
    category: "food",
    date: "2026-08-01",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("Financial Filters Engine", () => {
  describe("filterTransactionsByPeriod", () => {
    it("when processing an empty dataset returns an empty array regardless of the selected period", () => {
      const result = filterTransactionsByPeriod([], "current-month");
      expect(result).toEqual([]);
    });

    it("when filtering by 'current-month' includes only transactions with dates starting in August 2026", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-aug-1", date: "2026-08-01" }),
        createTransaction({ id: "tx-aug-2", date: "2026-08-31" }),
        createTransaction({ id: "tx-jul", date: "2026-07-31" }),
        createTransaction({ id: "tx-jun", date: "2026-06-15" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "current-month");

      expect(result).toHaveLength(2);
      expect(result.map((tx) => tx.id)).toEqual(["tx-aug-1", "tx-aug-2"]);
    });

    it("when filtering by 'current-month' returns an empty array when no August 2026 transactions exist", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-jul", date: "2026-07-15" }),
        createTransaction({ id: "tx-may", date: "2026-05-10" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "current-month");

      expect(result).toEqual([]);
    });

    it("when filtering by 'previous-month' includes only transactions with dates starting in July 2026", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-jul-1", date: "2026-07-01" }),
        createTransaction({ id: "tx-jul-2", date: "2026-07-15" }),
        createTransaction({ id: "tx-aug", date: "2026-08-01" }),
        createTransaction({ id: "tx-jun", date: "2026-06-30" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "previous-month");

      expect(result).toHaveLength(2);
      expect(result.map((tx) => tx.id)).toEqual(["tx-jul-1", "tx-jul-2"]);
    });

    it("when filtering by 'last-3-months' includes transactions spanning June, July, and August 2026", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-aug", date: "2026-08-10" }),
        createTransaction({ id: "tx-jul", date: "2026-07-20" }),
        createTransaction({ id: "tx-jun", date: "2026-06-05" }),
        createTransaction({ id: "tx-may", date: "2026-05-31" }),
        createTransaction({ id: "tx-apr", date: "2026-04-12" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "last-3-months");

      expect(result).toHaveLength(3);
      expect(result.map((tx) => tx.id)).toEqual(["tx-aug", "tx-jul", "tx-jun"]);
    });

    it("when filtering by 'last-3-months' maintains the original ordering of transactions when matching criteria", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-1", date: "2026-06-10" }),
        createTransaction({ id: "tx-2", date: "2026-08-01" }),
        createTransaction({ id: "tx-3", date: "2026-07-15" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "last-3-months");

      expect(result.map((tx) => tx.id)).toEqual(["tx-1", "tx-2", "tx-3"]);
    });

    it("when filtering by 'custom' or fallback criteria preserves all transactions unmodified when period is 'custom'", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-1", date: "2026-08-01" }),
        createTransaction({ id: "tx-2", date: "2026-01-01" }),
        createTransaction({ id: "tx-3", date: "2025-12-31" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "custom");

      expect(result).toHaveLength(3);
      expect(result).toEqual(transactions);
    });

    it("when filtering by 'custom' or fallback criteriareturns the entire transaction list unchanged when an unhandled period is provided", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-1", date: "2026-08-01" }),
        createTransaction({ id: "tx-2", date: "2026-07-01" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "unhandled-period" as PeriodFilter);

      expect(result).toHaveLength(2);
      expect(result).toEqual(transactions);
    });
  });
});
