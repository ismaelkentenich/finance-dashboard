import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { isValidCategory, isValidPeriod, isValidTransactionType } from "@/utils/filter";
import { describe, expect, it } from "vitest";

describe("Filter Runtime Validators & Type Guards", () => {
  describe("isValidPeriod", () => {
    it("returns true for all supported predefined periods", () => {
      expect(isValidPeriod("current-month")).toBe(true);
      expect(isValidPeriod("previous-month")).toBe(true);
      expect(isValidPeriod("last-3-months")).toBe(true);
      expect(isValidPeriod("custom")).toBe(true);
    });

    it("returns false for unsupported period strings", () => {
      expect(isValidPeriod("next-month")).toBe(false);
      expect(isValidPeriod("all-time")).toBe(false);
      expect(isValidPeriod("")).toBe(false);
      expect(isValidPeriod("   ")).toBe(false);
    });

    it("returns false for non-string types and nil values", () => {
      expect(isValidPeriod(null)).toBe(false);
      expect(isValidPeriod(undefined)).toBe(false);
      expect(isValidPeriod(123)).toBe(false);
      expect(isValidPeriod({})).toBe(false);
      expect(isValidPeriod([])).toBe(false);
      expect(isValidPeriod(true)).toBe(false);
    });
  });

  describe("isValidTransactionType", () => {
    it("returns true for valid transaction types and 'all'", () => {
      expect(isValidTransactionType("all")).toBe(true);
      expect(isValidTransactionType("income")).toBe(true);
      expect(isValidTransactionType("expense")).toBe(true);
    });

    it("returns false for unrecognized transaction types", () => {
      expect(isValidTransactionType("transfer")).toBe(false);
      expect(isValidTransactionType("investment")).toBe(false);
      expect(isValidTransactionType("ALL")).toBe(false);
      expect(isValidTransactionType("")).toBe(false);
    });

    it("returns false for non-string types and nil values", () => {
      expect(isValidTransactionType(null)).toBe(false);
      expect(isValidTransactionType(undefined)).toBe(false);
      expect(isValidTransactionType(0)).toBe(false);
      expect(isValidTransactionType({})).toBe(false);
      expect(isValidTransactionType(false)).toBe(false);
    });
  });

  describe("isValidCategory", () => {
    it("returns true for every valid category registered in ALL_CATEGORIES", () => {
      ALL_CATEGORIES.forEach((category) => {
        expect(isValidCategory(category)).toBe(true);
      });
    });

    it("returns false for 'all' since 'all' is an aggregate filter, not a transaction category", () => {
      expect(isValidCategory("all")).toBe(false);
    });

    it("returns false for unregistered or fabricated categories", () => {
      expect(isValidCategory("crypto")).toBe(false);
      expect(isValidCategory("gambling")).toBe(false);
      expect(isValidCategory("FOOD")).toBe(false);
      expect(isValidCategory("")).toBe(false);
    });

    it("returns false for non-string types and nil values", () => {
      expect(isValidCategory(null)).toBe(false);
      expect(isValidCategory(undefined)).toBe(false);
      expect(isValidCategory(42)).toBe(false);
      expect(isValidCategory({ category: "food" })).toBe(false);
      expect(isValidCategory(["housing"])).toBe(false);
    });
  });
});
