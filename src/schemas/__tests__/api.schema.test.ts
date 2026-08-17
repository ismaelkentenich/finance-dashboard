import {
  createTransactionResponseSchema,
  getDashboardDataResponseSchema,
} from "@/schemas/api.schema";
import { describe, expect, it } from "vitest";

describe("API Response Schemas (Runtime Contract Validation)", () => {
  const validDashboardPayload = {
    data: {
      transactions: [
        {
          id: "tx-001",
          description: "Salário Mensal",
          amount: 5000,
          type: "income",
          category: "salary",
          date: "2026-08-01",
          createdAt: "2026-08-01T00:00:00Z",
        },
      ],
      summary: {
        currentBalance: 5000,
        totalIncome: 5000,
        totalExpenses: 0,
        savingsRate: 100,
        periodComparison: {
          balanceVariation: 10,
          incomeVariation: 5,
          expensesVariation: 0,
        },
      },
      categories: [
        {
          category: "housing",
          categoryLabel: "Moradia",
          totalAmount: 1200,
          percentage: 100,
          transactionCount: 1,
        },
      ],
    },
    meta: {
      totalCount: 1,
      period: "current-month",
    },
  };

  describe("getDashboardDataResponseSchema", () => {
    it("successfully parses valid dashboard response", () => {
      const result = getDashboardDataResponseSchema.safeParse(validDashboardPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validDashboardPayload);
      }
    });

    it("rejects payload missing the data envelope", () => {
      const result = getDashboardDataResponseSchema.safeParse({
        meta: { totalCount: 0, period: "current-month" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects payload with invalid transaction structure", () => {
      const invalid = {
        ...validDashboardPayload,
        data: {
          ...validDashboardPayload.data,
          transactions: [
            {
              id: "tx-1",
              description: "Item",
              amount: "not-a-number", // Type error
              type: "income",
              category: "salary",
              date: "2026-08-01",
              createdAt: "2026-08-01T00:00:00Z",
            },
          ],
        },
      };
      const result = getDashboardDataResponseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects payload with missing summary comparison metrics", () => {
      const invalid = {
        ...validDashboardPayload,
        data: {
          ...validDashboardPayload.data,
          summary: {
            currentBalance: 5000,
            totalIncome: 5000,
            totalExpenses: 0,
            savingsRate: 100,
            // periodComparison missing
          },
        },
      };
      const result = getDashboardDataResponseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects payload with invalid period in meta", () => {
      const invalid = {
        ...validDashboardPayload,
        meta: {
          totalCount: 1,
          period: "invalid-period-key",
        },
      };
      const result = getDashboardDataResponseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("createTransactionResponseSchema", () => {
    it("successfully parses valid transaction creation response", () => {
      const validCreation = {
        data: {
          id: "tx-new-123",
          description: "Supermercado",
          amount: 250,
          type: "expense",
          category: "food",
          date: "2026-08-15",
          createdAt: "2026-08-15T12:00:00Z",
        },
      };

      const result = createTransactionResponseSchema.safeParse(validCreation);
      expect(result.success).toBe(true);
    });

    it("rejects transaction creation response missing the data field", () => {
      const result = createTransactionResponseSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
