import type { Transaction } from "@/types";
import { describe, expect, it } from "vitest";
import { filterTransactionsByPeriod } from "../financialFilters";

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

describe("filterTransactionsByPeriod", () => {
  describe("when processing an empty dataset", () => {
    it("returns an empty array regardless of the selected period", () => {
      const result = filterTransactionsByPeriod([], "current-month", "2026-08-15");
      expect(result).toEqual([]);
    });
  });

  describe("when filtering by 'current-month'", () => {
    it("dynamically filters transactions for the month of the reference date", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-oct-1", date: "2025-10-05" }),
        createTransaction({ id: "tx-oct-2", date: "2025-10-31" }),
        createTransaction({ id: "tx-sep", date: "2025-09-30" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "current-month", "2025-10-15");

      expect(result).toHaveLength(2);
      expect(result.map((tx) => tx.id)).toEqual(["tx-oct-1", "tx-oct-2"]);
    });
  });

  describe("when filtering by 'previous-month' across year boundaries", () => {
    it("selects December of previous year when reference date is in January", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-dec-prev", date: "2025-12-15" }),
        createTransaction({ id: "tx-jan-curr", date: "2026-01-10" }),
        createTransaction({ id: "tx-nov-prev", date: "2025-11-20" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "previous-month", "2026-01-15");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("tx-dec-prev");
    });

    it("selects previous month in the same year when not in January", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-jul", date: "2026-07-20" }),
        createTransaction({ id: "tx-aug", date: "2026-08-01" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "previous-month", "2026-08-10");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("tx-jul");
    });
  });

  describe("when filtering by 'last-3-months' across year boundaries", () => {
    it("includes transactions across year change when reference date is in January", () => {
      // For Jan 2026: January 2026, December 2025, November 2025
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-jan-2026", date: "2026-01-05" }),
        createTransaction({ id: "tx-dec-2025", date: "2025-12-25" }),
        createTransaction({ id: "tx-nov-2025", date: "2025-11-15" }),
        createTransaction({ id: "tx-oct-2025", date: "2025-10-31" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "last-3-months", "2026-01-20");

      expect(result).toHaveLength(3);
      expect(result.map((tx) => tx.id)).toEqual(["tx-jan-2026", "tx-dec-2025", "tx-nov-2025"]);
    });

    it("includes transactions across year change when reference date is in February", () => {
      // For Feb 2026: February 2026, January 2026, December 2025
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-feb-2026", date: "2026-02-14" }),
        createTransaction({ id: "tx-jan-2026", date: "2026-01-10" }),
        createTransaction({ id: "tx-dec-2025", date: "2025-12-31" }),
        createTransaction({ id: "tx-nov-2025", date: "2025-11-30" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "last-3-months", "2026-02-01");

      expect(result).toHaveLength(3);
      expect(result.map((tx) => tx.id)).toEqual(["tx-feb-2026", "tx-jan-2026", "tx-dec-2025"]);
    });
  });

  describe("when filtering by 'custom' or unknown criteria", () => {
    it("returns all transactions untouched", () => {
      const transactions: Transaction[] = [
        createTransaction({ id: "tx-1", date: "2024-01-01" }),
        createTransaction({ id: "tx-2", date: "2026-08-01" }),
      ];

      const result = filterTransactionsByPeriod(transactions, "custom", "2026-08-15");

      expect(result).toHaveLength(2);
      expect(result).toEqual(transactions);
    });
  });
});
