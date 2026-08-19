import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatPercentage, normalizeSpaces } from "../formatters";

describe("formatters utility engine", () => {
  describe("formatCurrency", () => {
    describe("integer and decimal values", () => {
      it("formats standard integer amounts with two decimal digits in BRL currency format", () => {
        const result = formatCurrency(1500);
        expect(normalizeSpaces(result)).toBe("R$ 1.500,00");
      });

      it("formats amounts with single decimal digit appending a trailing zero", () => {
        const result = formatCurrency(250.5);
        expect(normalizeSpaces(result)).toBe("R$ 250,50");
      });

      it("rounds amounts with more than two decimal digits to two places", () => {
        const result = formatCurrency(99.999);
        expect(normalizeSpaces(result)).toBe("R$ 100,00");
      });

      it("truncates fractional cents using standard rounding", () => {
        const result = formatCurrency(45.124);
        expect(normalizeSpaces(result)).toBe("R$ 45,12");
      });
    });

    describe("formatCurrency multi-currency", () => {
      it("formats BRL using pt-BR locale", () => {
        expect(formatCurrency(1000, "pt-BR", "BRL")).toMatch(/R\$\s*1\.000,00/);
      });

      it("formats USD using en-US locale", () => {
        expect(formatCurrency(1000, "en-US", "USD")).toBe("$1,000.00");
      });

      it("formats USD while keeping pt-BR number formatting", () => {
        const result = normalizeSpaces(formatCurrency(1000, "pt-BR", "USD"));

        expect(result).toContain("1.000,00");
      });

      it("formats BRL while keeping en-US number formatting", () => {
        const result = normalizeSpaces(formatCurrency(1000, "en-US", "BRL"));

        expect(result).toContain("1,000.00");
      });

      it("formats EUR independently from locale", () => {
        expect(formatCurrency(1000, "en-US", "EUR")).toContain("€");
      });
    });

    describe("boundary and extreme numeric amounts", () => {
      it("formats zero amount with standard currency sign and zero decimals", () => {
        const result = formatCurrency(0);
        expect(normalizeSpaces(result)).toBe("R$ 0,00");
      });

      it("formats negative zero identical to standard zero", () => {
        const result = formatCurrency(-0);
        expect(normalizeSpaces(result)).toBe("R$ 0,00");
      });

      it("formats negative numbers with a leading minus sign before the currency symbol", () => {
        const result = formatCurrency(-1250.75);
        expect(normalizeSpaces(result)).toBe("-R$ 1.250,75");
      });

      it("formats large numbers using thousands dot separators", () => {
        const result = formatCurrency(1000000);
        expect(normalizeSpaces(result)).toBe("R$ 1.000.000,00");
      });

      it("formats multi-million numbers with multiple thousand groups", () => {
        const result = formatCurrency(12345678.9);
        expect(normalizeSpaces(result)).toBe("R$ 12.345.678,90");
      });
    });
  });

  describe("formatPercentage", () => {
    describe("positive percentage values", () => {
      it("prepends a plus sign to positive whole numbers with one decimal place", () => {
        expect(formatPercentage(15)).toBe("+15.0%");
      });

      it("prepends a plus sign and preserves single decimal precision", () => {
        expect(formatPercentage(8.4)).toBe("+8.4%");
      });

      it("rounds multi-decimal positive numbers to one decimal place", () => {
        expect(formatPercentage(12.467)).toBe("+12.5%");
      });
    });

    describe("negative percentage values", () => {
      it("preserves native minus sign without adding redundant prefixes", () => {
        expect(formatPercentage(-5.2)).toBe("-5.2%");
      });

      it("rounds multi-decimal negative values to one decimal place", () => {
        expect(formatPercentage(-14.89)).toBe("-14.9%");
      });
    });

    describe("zero percentage edge cases", () => {
      it("formats numeric zero without positive or negative signs", () => {
        expect(formatPercentage(0)).toBe("0.0%");
      });

      it("avoids negative zero output when rounding minute negative values", () => {
        expect(formatPercentage(-0.01)).toBe("-0.0%");
      });
    });
  });

  describe("formatDate", () => {
    describe("date string formatting (YYYY-MM-DD)", () => {
      it("formats beginning of month dates into localized day, abbreviated month and year", () => {
        const result = formatDate("2026-08-01");
        expect(result.toLowerCase()).toContain("01");
        expect(result.toLowerCase()).toContain("ago");
        expect(result).toContain("2026");
      });

      it("formats end of month dates across month boundaries", () => {
        const result = formatDate("2026-07-31");
        expect(result.toLowerCase()).toContain("31");
        expect(result.toLowerCase()).toContain("jul");
        expect(result).toContain("2026");
      });

      it("formats leap year date without altering day representation", () => {
        const result = formatDate("2024-02-29");
        expect(result.toLowerCase()).toContain("29");
        expect(result.toLowerCase()).toContain("fev");
        expect(result).toContain("2024");
      });

      it("formats end of calendar year dates", () => {
        const result = formatDate("2025-12-31");
        expect(result.toLowerCase()).toContain("31");
        expect(result.toLowerCase()).toContain("dez");
        expect(result).toContain("2025");
      });

      it("formats first day of the year", () => {
        const result = formatDate("2026-01-01");
        expect(result.toLowerCase()).toContain("01");
        expect(result.toLowerCase()).toContain("jan");
        expect(result).toContain("2026");
      });
    });

    describe("full ISO 8601 timestamps", () => {
      it("parses and formats ISO timestamp strings containing UTC timezone descriptors", () => {
        const result = formatDate("2026-08-14T18:45:00.000Z");
        expect(result.toLowerCase()).toContain("14");
        expect(result.toLowerCase()).toContain("ago");
        expect(result).toContain("2026");
      });

      it("strips trailing abbreviations dots from formatted month names", () => {
        const result = formatDate("2026-03-10T10:00:00.000Z");
        expect(result).not.toContain(".");
      });
    });
  });
  describe("normalizeSpaces", () => {
    describe("Unicode non-breaking space replacement", () => {
      it("replaces standard non-breaking space (\\u00a0) with standard ASCII space", () => {
        const input = "R$\u00a01.500,00";
        const result = normalizeSpaces(input);

        expect(result).toBe("R$ 1.500,00");
        expect(result).not.toContain("\u00a0");
      });

      it("replaces narrow non-breaking space (\\u202f) with standard ASCII space", () => {
        const input = "R$\u202f8.500,50";
        const result = normalizeSpaces(input);

        expect(result).toBe("R$ 8.500,50");
        expect(result).not.toContain("\u202f");
      });

      it("replaces multiple occurrences of mixed Unicode spaces within the same string", () => {
        const input = "\u00a0R$\u202f1.000,00\u00a0";
        const result = normalizeSpaces(input);

        expect(result).toBe(" R$ 1.000,00 ");
        expect(result).not.toMatch(/[\u00a0\u202f]/);
      });
    });

    describe("strings without non-breaking spaces", () => {
      it("returns plain ASCII strings without modifications", () => {
        const input = "Standard space separated text";
        const result = normalizeSpaces(input);

        expect(result).toBe("Standard space separated text");
      });

      it("returns empty string when input is empty", () => {
        const result = normalizeSpaces("");
        expect(result).toBe("");
      });

      it("preserves tabs, newlines, and carriage returns unaltered", () => {
        const input = "Line1\nLine2\tTabbed\r";
        const result = normalizeSpaces(input);

        expect(result).toBe("Line1\nLine2\tTabbed\r");
      });
    });
  });
});
