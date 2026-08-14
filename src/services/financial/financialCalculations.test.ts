import type { Transaction, TransactionCategory } from "@/types/transaction.types";
import { describe, expect, it } from "vitest";
import { calculateCategoryBreakdown, calculateFinancialSummary } from "./financialCalculations";

function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-test-id",
    description: "Sample Description",
    amount: 100,
    type: "expense",
    category: "other",
    date: "2026-08-14",
    createdAt: "2026-08-14T00:00:00.000Z",
    ...overrides,
  };
}

describe("Financial Calculations Engine", () => {
  describe("calculateFinancialSummary Function", () => {
    describe("current period totals", () => {
      it("returns zeroed totals when the transaction list is empty", () => {
        const summary = calculateFinancialSummary([]);

        expect(summary.totalIncome).toBe(0);
        expect(summary.totalExpenses).toBe(0);
        expect(summary.currentBalance).toBe(0);
        expect(summary.savingsRate).toBe(0);
      });

      it("aggregates exclusively income transactions when no expenses exist", () => {
        const transactions: Transaction[] = [
          createTransaction({ type: "income", amount: 3000 }),
          createTransaction({ type: "income", amount: 1500 }),
        ];

        const summary = calculateFinancialSummary(transactions);

        expect(summary.totalIncome).toBe(4500);
        expect(summary.totalExpenses).toBe(0);
        expect(summary.currentBalance).toBe(4500);
        expect(summary.savingsRate).toBe(100);
      });

      it("aggregates exclusively expense transactions when no income exists", () => {
        const transactions: Transaction[] = [
          createTransaction({ type: "expense", amount: 450 }),
          createTransaction({ type: "expense", amount: 550 }),
        ];

        const summary = calculateFinancialSummary(transactions);

        expect(summary.totalIncome).toBe(0);
        expect(summary.totalExpenses).toBe(1000);
        expect(summary.currentBalance).toBe(-1000);
        expect(summary.savingsRate).toBe(0);
      });

      it("calculates net balance and rounds savings rate to one decimal place", () => {
        const transactions: Transaction[] = [
          createTransaction({ type: "income", amount: 3333.33 }),
          createTransaction({ type: "expense", amount: 1111.11 }),
        ];

        const summary = calculateFinancialSummary(transactions);

        expect(summary.totalIncome).toBeCloseTo(3333.33, 2);
        expect(summary.totalExpenses).toBeCloseTo(1111.11, 2);
        expect(summary.currentBalance).toBeCloseTo(2222.22, 2);
        expect(summary.savingsRate).toBe(66.7);
      });

      it("computes negative savings rate when expenses exceed income", () => {
        const transactions: Transaction[] = [
          createTransaction({ type: "income", amount: 2000 }),
          createTransaction({ type: "expense", amount: 3000 }),
        ];

        const summary = calculateFinancialSummary(transactions);

        expect(summary.currentBalance).toBe(-1000);
        expect(summary.savingsRate).toBe(-50);
      });
    });

    describe("period comparisons and variations", () => {
      it("returns 100% variation when previous period value was 0 and current is positive", () => {
        const currentTransactions: Transaction[] = [
          createTransaction({ type: "income", amount: 5000 }),
          createTransaction({ type: "expense", amount: 2000 }),
        ];
        const previousTransactions: Transaction[] = [];

        const summary = calculateFinancialSummary(currentTransactions, previousTransactions);

        expect(summary.periodComparison.incomeVariation).toBe(100);
        expect(summary.periodComparison.expensesVariation).toBe(100);
        expect(summary.periodComparison.balanceVariation).toBe(100);
      });

      it("returns 0% variation when both previous and current values are 0", () => {
        const summary = calculateFinancialSummary([], []);

        expect(summary.periodComparison.incomeVariation).toBe(0);
        expect(summary.periodComparison.expensesVariation).toBe(0);
        expect(summary.periodComparison.balanceVariation).toBe(0);
      });

      it("calculates percentage growth between previous and current period", () => {
        const previousTransactions: Transaction[] = [
          createTransaction({ type: "income", amount: 4000 }),
          createTransaction({ type: "expense", amount: 2000 }),
        ];
        const currentTransactions: Transaction[] = [
          createTransaction({ type: "income", amount: 6000 }),
          createTransaction({ type: "expense", amount: 1500 }),
        ];

        const summary = calculateFinancialSummary(currentTransactions, previousTransactions);

        expect(summary.periodComparison.incomeVariation).toBe(50);
        expect(summary.periodComparison.expensesVariation).toBe(-25);
        expect(summary.periodComparison.balanceVariation).toBe(125);
      });

      it("handles variation calculation when previous balance was negative", () => {
        const previousTransactions: Transaction[] = [
          createTransaction({ type: "income", amount: 1000 }),
          createTransaction({ type: "expense", amount: 2000 }),
        ];
        const currentTransactions: Transaction[] = [
          createTransaction({ type: "income", amount: 3000 }),
          createTransaction({ type: "expense", amount: 1000 }),
        ];

        const summary = calculateFinancialSummary(currentTransactions, previousTransactions);

        expect(summary.periodComparison.balanceVariation).toBe(300);
      });
    });
  });
  describe("calculateCategoryBreakdown Function", () => {
    it("returns an empty array when transaction list has no expenses", () => {
      const transactions: Transaction[] = [
        createTransaction({ type: "income", amount: 5000, category: "salary" }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      expect(breakdown).toEqual([]);
    });

    it("ignores income transactions and processes only expenses", () => {
      const transactions: Transaction[] = [
        createTransaction({ type: "income", amount: 10000, category: "salary" }),
        createTransaction({ type: "expense", amount: 500, category: "food" }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      expect(breakdown).toHaveLength(1);
      expect(breakdown[0].category).toBe("food");
      expect(breakdown[0].totalAmount).toBe(500);
      expect(breakdown[0].percentage).toBe(100);
      expect(breakdown[0].transactionCount).toBe(1);
    });

    it("aggregates multiple expenses belonging to the same category", () => {
      const transactions: Transaction[] = [
        createTransaction({ type: "expense", amount: 120.5, category: "food" }),
        createTransaction({ type: "expense", amount: 79.5, category: "food" }),
        createTransaction({ type: "expense", amount: 100, category: "food" }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      expect(breakdown).toHaveLength(1);
      expect(breakdown[0].category).toBe("food");
      expect(breakdown[0].totalAmount).toBe(300);
      expect(breakdown[0].percentage).toBe(100);
      expect(breakdown[0].transactionCount).toBe(3);
    });

    it("sorts categories in descending order based on total spent", () => {
      const transactions: Transaction[] = [
        createTransaction({ type: "expense", amount: 100, category: "entertainment" }),
        createTransaction({ type: "expense", amount: 1200, category: "housing" }),
        createTransaction({ type: "expense", amount: 300, category: "food" }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      expect(breakdown).toHaveLength(3);
      expect(breakdown.map((item) => item.category)).toEqual(["housing", "food", "entertainment"]);
      expect(breakdown[0].totalAmount).toBe(1200);
      expect(breakdown[1].totalAmount).toBe(300);
      expect(breakdown[2].totalAmount).toBe(100);
    });

    it("maps presentation labels from CATEGORY_LABELS or falls back to raw key", () => {
      const unmappedCategory = "custom-unmapped" as unknown as TransactionCategory;

      const transactions: Transaction[] = [
        createTransaction({ type: "expense", amount: 200, category: "housing" }),
        createTransaction({ type: "expense", amount: 100, category: unmappedCategory }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      const housingItem = breakdown.find((item) => item.category === "housing");
      const unmappedItem = breakdown.find(
        (item) => (item.category as string) === "custom-unmapped"
      );

      expect(housingItem?.categoryLabel).toBe("Housing");
      expect(unmappedItem?.categoryLabel).toBe("custom-unmapped");
    });

    it("formats percentages and total amounts with fixed decimal precision", () => {
      const transactions: Transaction[] = [
        createTransaction({ type: "expense", amount: 33.333, category: "food" }),
        createTransaction({ type: "expense", amount: 66.666, category: "transportation" }),
      ];

      const breakdown = calculateCategoryBreakdown(transactions);

      const transportation = breakdown.find((i) => i.category === "transportation");
      const food = breakdown.find((i) => i.category === "food");

      expect(transportation?.totalAmount).toBe(66.67);
      expect(transportation?.percentage).toBe(66.7);
      expect(food?.totalAmount).toBe(33.33);
      expect(food?.percentage).toBe(33.3);
    });
  });
});
