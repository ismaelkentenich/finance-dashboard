import { SUPPORTED_LOCALES } from "@/constants/locale.constants";
import { isValidLocale } from "@/utils/locale";
import { describe, expect, it } from "vitest";

describe("isValidLocale type guard", () => {
  describe("Scenario: Valid Supported Locales", () => {
    it.each(SUPPORTED_LOCALES)("should return true for the supported locale: %s", (locale) => {
      expect(isValidLocale(locale)).toBe(true);
    });
  });

  describe("Scenario: Unsupported Strings & Formatting Edge Cases", () => {
    it("should return false for unsupported language/country codes", () => {
      expect(isValidLocale("es-ES")).toBe(false);
      expect(isValidLocale("fr-FR")).toBe(false);
      expect(isValidLocale("de-DE")).toBe(false);
      expect(isValidLocale("ja-JP")).toBe(false);
    });

    it("should return false for case-sensitive mismatches", () => {
      expect(isValidLocale("pt-br")).toBe(false);
      expect(isValidLocale("PT-BR")).toBe(false);
      expect(isValidLocale("en-us")).toBe(false);
      expect(isValidLocale("EN-US")).toBe(false);
    });

    it("should return false for base language codes without region", () => {
      expect(isValidLocale("pt")).toBe(false);
      expect(isValidLocale("en")).toBe(false);
    });

    it("should return false for empty or whitespace-padded strings", () => {
      expect(isValidLocale("")).toBe(false);
      expect(isValidLocale("   ")).toBe(false);
      expect(isValidLocale(" pt-BR ")).toBe(false);
      expect(isValidLocale("en-US ")).toBe(false);
    });
  });

  describe("Scenario: Non-String & Falsy Values", () => {
    it("should return false for null and undefined", () => {
      expect(isValidLocale(null)).toBe(false);
      expect(isValidLocale(undefined)).toBe(false);
    });

    it("should return false for numeric and boolean primitives", () => {
      expect(isValidLocale(0)).toBe(false);
      expect(isValidLocale(1)).toBe(false);
      expect(isValidLocale(NaN)).toBe(false);
      expect(isValidLocale(true)).toBe(false);
      expect(isValidLocale(false)).toBe(false);
    });

    it("should return false for complex objects, arrays, and functions", () => {
      expect(isValidLocale({})).toBe(false);
      expect(isValidLocale({ locale: "pt-BR" })).toBe(false);
      expect(isValidLocale(["pt-BR"])).toBe(false);
      expect(isValidLocale(() => "pt-BR")).toBe(false);
      expect(isValidLocale(Symbol("pt-BR"))).toBe(false);
    });
  });
});
