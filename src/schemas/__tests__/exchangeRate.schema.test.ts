import {
  exchangeRateResponseSchema,
  exchangeRateSchema,
  frankfurterRateResponseSchema,
} from "@/schemas/exchangeRate.schema";
import { describe, expect, it } from "vitest";

describe("Exchange Rate Schemas", () => {
  describe("frankfurterRateResponseSchema", () => {
    it("accepts valid exchange rate response", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: 5.42,
      });

      expect(result.success).toBe(true);
    });

    it("rejects unsupported base currency", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-08-19",
        base: "DOGE",
        quote: "BRL",
        rate: 5.42,
      });

      expect(result.success).toBe(false);
    });

    it("rejects unsupported quote currency", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-08-19",
        base: "USD",
        quote: "DOGE",
        rate: 5.42,
      });

      expect(result.success).toBe(false);
    });

    it("rejects zero rate", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: 0,
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative rate", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: -5,
      });

      expect(result.success).toBe(false);
    });

    it("rejects malformed date", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "19/08/2026",
        base: "USD",
        quote: "BRL",
        rate: 5.42,
      });

      expect(result.success).toBe(false);
    });

    it("rejects impossible calendar date", () => {
      const result = frankfurterRateResponseSchema.safeParse({
        date: "2026-02-30",
        base: "USD",
        quote: "BRL",
        rate: 5.42,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("exchangeRateSchema", () => {
    it("accepts valid internal exchange rate", () => {
      const result = exchangeRateSchema.safeParse({
        from: "USD",
        to: "BRL",
        rate: 5.42,
        date: "2026-08-19",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid leap-year date", () => {
      const result = exchangeRateSchema.safeParse({
        from: "USD",
        to: "BRL",
        rate: 5.42,
        date: "2024-02-29",
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid leap-year date", () => {
      const result = exchangeRateSchema.safeParse({
        from: "USD",
        to: "BRL",
        rate: 5.42,
        date: "2025-02-29",
      });

      expect(result.success).toBe(false);
    });

    it("rejects invalid month", () => {
      const result = exchangeRateSchema.safeParse({
        from: "USD",
        to: "BRL",
        rate: 5.42,
        date: "2026-13-01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("exchangeRateResponseSchema", () => {
    it("accepts valid FinFlow API response", () => {
      const result = exchangeRateResponseSchema.safeParse({
        data: {
          from: "USD",
          to: "BRL",
          rate: 5.42,
          date: "2026-08-19",
        },
      });

      expect(result.success).toBe(true);
    });

    it("rejects response missing data envelope", () => {
      const result = exchangeRateResponseSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("rejects invalid internal rate", () => {
      const result = exchangeRateResponseSchema.safeParse({
        data: {
          from: "USD",
          to: "BRL",
          rate: 0,
          date: "2026-08-19",
        },
      });

      expect(result.success).toBe(false);
    });
  });
});
