import { frankfurterRateResponseSchema } from "@/schemas/exchangeRate.schema";
import { describe, expect, it } from "vitest";

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
});
