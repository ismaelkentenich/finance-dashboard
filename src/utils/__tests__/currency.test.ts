import { describe, expect, it } from "vitest";
import { isSupportedCurrency } from "../currency";

describe("isSupportedCurrency", () => {
  it.each(["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"])(
    "returns true for supported currency %s",
    (currency) => {
      expect(isSupportedCurrency(currency)).toBe(true);
    }
  );

  it.each(["XYZ", "", "usd", null, undefined, 123, {}, []])(
    "returns false for unsupported value %s",
    (value) => {
      expect(isSupportedCurrency(value)).toBe(false);
    }
  );
});
