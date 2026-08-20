import { exchangeRateQuerySchema } from "@/schemas/exchangeRateRequest.schema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("exchangeRateQuerySchema", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-08-20T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts current rate query without date", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "BRL",
    });

    expect(result.success).toBe(true);
  });

  it("accepts historical rate query", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "BRL",
      date: "2026-01-10",
    });

    expect(result.success).toBe(true);
  });

  it("accepts today's date", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "BRL",
      date: "2026-08-20",
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid leap-year date", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "BRL",
      date: "2024-02-29",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsupported from currency", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "DOGE",
      to: "BRL",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsupported to currency", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "DOGE",
    });

    expect(result.success).toBe(false);
  });

  it.each(["20/08/2026", "08-20-2026", "20260820", ""])(
    "rejects invalid date format %s",
    (date) => {
      const result = exchangeRateQuerySchema.safeParse({
        from: "USD",
        to: "BRL",
        date,
      });

      expect(result.success).toBe(false);
    }
  );

  it.each(["2026-02-30", "2026-13-01", "2025-02-29"])(
    "rejects invalid calendar date %s",
    (date) => {
      const result = exchangeRateQuerySchema.safeParse({
        from: "USD",
        to: "BRL",
        date,
      });

      expect(result.success).toBe(false);
    }
  );

  it("rejects future exchange rate date", () => {
    const result = exchangeRateQuerySchema.safeParse({
      from: "USD",
      to: "BRL",
      date: "2026-08-21",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["date"],
            message: "Exchange rate date cannot be in the future.",
          }),
        ])
      );
    }
  });
});
