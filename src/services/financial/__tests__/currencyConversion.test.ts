import { describe, expect, it } from "vitest";
import { convertAmount } from "../currencyConversion";

describe("convertAmount", () => {
  it("converts amount using exchange rate", () => {
    expect(convertAmount(100, 5.42)).toBe(542);
  });

  it("supports decimal amounts", () => {
    expect(convertAmount(19.99, 5.1234)).toBe(102.42);
  });

  it("rounds converted result to two decimal places", () => {
    expect(convertAmount(10, 1.23456)).toBe(12.35);
  });

  it("returns zero when amount is zero", () => {
    expect(convertAmount(0, 5.42)).toBe(0);
  });

  it("supports exchange rate equal to one", () => {
    expect(convertAmount(100, 1)).toBe(100);
  });

  it("supports negative finite amounts", () => {
    expect(convertAmount(-100, 5.42)).toBe(-542);
  });

  it.each([NaN, Infinity, -Infinity])("rejects invalid amount %s", (amount) => {
    expect(() => convertAmount(amount, 5.42)).toThrow("Amount must be a finite number.");
  });

  it.each([0, -1, NaN, Infinity, -Infinity])("rejects invalid exchange rate %s", (rate) => {
    expect(() => convertAmount(100, rate)).toThrow(
      "Exchange rate must be a positive finite number."
    );
  });
});
