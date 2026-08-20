import { SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { VALID_PERIODS, VALID_TRANSACTION_TYPES } from "@/constants/filter.constants";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { describe, expect, it } from "vitest";
import { transactionQuerySchema } from "../transactionQuery.schema";

describe("transactionQuerySchema", () => {
  describe("defaults", () => {
    it("applies default period and currency when query is empty", () => {
      const result = transactionQuerySchema.parse({});

      expect(result).toEqual({
        period: "current-month",
        currency: "BRL",
      });
    });

    it("keeps optional type and category undefined when omitted", () => {
      const result = transactionQuerySchema.parse({});

      expect(result.type).toBeUndefined();
      expect(result.category).toBeUndefined();
    });
  });

  describe("period validation", () => {
    it.each(VALID_PERIODS)("accepts valid period '%s'", (period) => {
      const result = transactionQuerySchema.safeParse({
        period,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.period).toBe(period);
      }
    });

    it("rejects unsupported period", () => {
      const result = transactionQuerySchema.safeParse({
        period: "invalid-period",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["period"],
            }),
          ])
        );
      }
    });
  });

  describe("type validation", () => {
    it.each(VALID_TRANSACTION_TYPES)("accepts valid transaction type '%s'", (type) => {
      const result = transactionQuerySchema.safeParse({
        type,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.type).toBe(type);
      }
    });

    it("rejects unsupported transaction type", () => {
      const result = transactionQuerySchema.safeParse({
        type: "transfer",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["type"],
            }),
          ])
        );
      }
    });
  });

  describe("category validation", () => {
    it("accepts 'all' category", () => {
      const result = transactionQuerySchema.safeParse({
        category: "all",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.category).toBe("all");
      }
    });

    it.each(ALL_CATEGORIES)("accepts supported category '%s'", (category) => {
      const result = transactionQuerySchema.safeParse({
        category,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.category).toBe(category);
      }
    });

    it("rejects unsupported category", () => {
      const result = transactionQuerySchema.safeParse({
        category: "invalid-category",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["category"],
            }),
          ])
        );
      }
    });
  });

  describe("currency validation", () => {
    it.each(SUPPORTED_CURRENCIES)("accepts supported currency '%s'", (currency) => {
      const result = transactionQuerySchema.safeParse({
        currency,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.currency).toBe(currency);
      }
    });

    it("rejects unsupported currency", () => {
      const result = transactionQuerySchema.safeParse({
        currency: "DOGE",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["currency"],
            }),
          ])
        );
      }
    });
  });

  describe("complete query", () => {
    it("parses a fully valid transaction query", () => {
      const result = transactionQuerySchema.safeParse({
        period: "previous-month",
        type: "expense",
        category: "food",
        currency: "USD",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          period: "previous-month",
          type: "expense",
          category: "food",
          currency: "USD",
        });
      }
    });

    it("reports multiple invalid fields in the same query", () => {
      const result = transactionQuerySchema.safeParse({
        period: "invalid-period",
        type: "transfer",
        category: "invalid-category",
        currency: "DOGE",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const invalidFields = result.error.issues.map((issue) => issue.path[0]);

        expect(invalidFields).toEqual(
          expect.arrayContaining(["period", "type", "category", "currency"])
        );
      }
    });
  });
});
