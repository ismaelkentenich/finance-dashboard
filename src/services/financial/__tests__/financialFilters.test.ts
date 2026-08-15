import type { PeriodFilter, Transaction } from "@/types";
import { describe, expect, it } from "vitest";
import { applyTransactionFilters, filterTransactionsByPeriod } from "../financialFilters";

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

describe("financialFilters Engine", () => {
  describe("applyTransactionFilters", () => {
    const dataset: Transaction[] = [
      createTransaction({ id: "tx-1", type: "income", category: "salary", amount: 5000 }),
      createTransaction({ id: "tx-2", type: "expense", category: "food", amount: 200 }),
      createTransaction({ id: "tx-3", type: "expense", category: "housing", amount: 1500 }),
      createTransaction({ id: "tx-4", type: "income", category: "freelance", amount: 800 }),
    ];

    it("returns all transactions when no filters or 'all' options are provided", () => {
      expect(applyTransactionFilters(dataset)).toEqual(dataset);
      expect(applyTransactionFilters(dataset, { type: "all", category: "all" })).toEqual(dataset);
    });

    it("filters transactions by type", () => {
      const incomes = applyTransactionFilters(dataset, { type: "income" });
      const expenses = applyTransactionFilters(dataset, { type: "expense" });

      expect(incomes.map((tx) => tx.id)).toEqual(["tx-1", "tx-4"]);
      expect(expenses.map((tx) => tx.id)).toEqual(["tx-2", "tx-3"]);
    });

    it("filters transactions by category", () => {
      const foodOnly = applyTransactionFilters(dataset, { category: "food" });
      expect(foodOnly.map((tx) => tx.id)).toEqual(["tx-2"]);
    });

    it("filters transactions by both type and category combinatorially", () => {
      const salaryIncome = applyTransactionFilters(dataset, {
        type: "income",
        category: "salary",
      });
      const salaryExpense = applyTransactionFilters(dataset, {
        type: "expense",
        category: "salary",
      });

      expect(salaryIncome.map((tx) => tx.id)).toEqual(["tx-1"]);
      expect(salaryExpense).toHaveLength(0);
    });
  });

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

      it("returns an empty array when no transactions exist for the reference month", () => {
        const transactions: Transaction[] = [
          createTransaction({ id: "tx-jul", date: "2026-07-15" }),
          createTransaction({ id: "tx-may", date: "2026-05-10" }),
        ];

        const result = filterTransactionsByPeriod(transactions, "current-month", "2026-08-01");

        expect(result).toEqual([]);
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
        // Reference Jan/2026: target [2026-01, 2025-12, 2025-11]
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
        // Reference Feb/2026: target [2026-02, 2026-01, 2025-12]
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

    describe("when filtering by 'custom' or fallback criteria", () => {
      it("preserves all transactions unmodified when period is 'custom'", () => {
        const transactions: Transaction[] = [
          createTransaction({ id: "tx-1", date: "2024-01-01" }),
          createTransaction({ id: "tx-2", date: "2026-08-01" }),
        ];

        const result = filterTransactionsByPeriod(transactions, "custom", "2026-08-15");

        expect(result).toHaveLength(2);
        expect(result).toEqual(transactions);
      });

      it("returns all transactions when an unhandled period is provided", () => {
        const transactions: Transaction[] = [
          createTransaction({ id: "tx-1", date: "2026-08-01" }),
          createTransaction({ id: "tx-2", date: "2026-07-01" }),
        ];

        const result = filterTransactionsByPeriod(
          transactions,
          "unknown" as unknown as PeriodFilter,
          "2026-08-15"
        );

        expect(result).toHaveLength(2);
        expect(result).toEqual(transactions);
      });
    });
  });
});
