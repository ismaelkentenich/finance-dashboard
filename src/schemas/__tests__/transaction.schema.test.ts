import { en } from "@/locales/en";
import { pt } from "@/locales/pt-br";
import {
  createTransactionSchema,
  getTranslatedValidationMessage,
  TRANSACTION_ISSUE_CODES,
} from "@/schemas/transaction.schema";
import { describe, expect, it } from "vitest";

describe("createTransactionSchema (Domain validation)", () => {
  const validPayload = {
    description: "Salário Mensal",
    amount: 5000,
    currency: "BRL",
    type: "income",
    category: "salary",
    date: "2026-08-15",
  };

  it("should successfully validate a well-formed payload", () => {
    const result = createTransactionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  describe("description validation", () => {
    it("should return DESCRIPTION_MIN when description has less than 3 chars", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        description: "ab",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.DESCRIPTION_MIN);
      }
    });

    it("should return DESCRIPTION_MAX when description exceeds 60 chars", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        description: "a".repeat(61),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.DESCRIPTION_MAX);
      }
    });
  });

  describe("amount validation", () => {
    it("should return AMOUNT_INVALID when amount is not a number", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        amount: "invalid-number",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.AMOUNT_INVALID);
      }
    });

    it("should return AMOUNT_POSITIVE when amount is zero or negative", () => {
      const resultZero = createTransactionSchema.safeParse({
        ...validPayload,
        amount: 0,
      });
      const resultNegative = createTransactionSchema.safeParse({
        ...validPayload,
        amount: -50,
      });

      expect(resultZero.success).toBe(false);
      expect(resultNegative.success).toBe(false);

      if (!resultZero.success) {
        expect(resultZero.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.AMOUNT_POSITIVE);
      }
    });
  });

  describe("currency validation", () => {
    it("rejects payload when currency is missing", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currency: _currency, ...payloadWithoutCurrency } = validPayload;

      const result = createTransactionSchema.safeParse(payloadWithoutCurrency);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["currency"],
              message: TRANSACTION_ISSUE_CODES.CURRENCY_REQUIRED,
            }),
          ])
        );
      }
    });
    it("rejects unsupported currency", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        currency: "DOGE",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toContain("currency");
      }
    });

    it("accepts supported foreign currency", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        currency: "USD",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.currency).toBe("USD");
      }
    });
  });

  describe("type and category validation", () => {
    it("should return TYPE_REQUIRED when type is invalid", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        type: "invalid_type",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.TYPE_REQUIRED);
      }
    });

    it("should return CATEGORY_REQUIRED when category is invalid", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        category: "unknown_category",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.CATEGORY_REQUIRED);
      }
    });
  });

  describe("date validation", () => {
    it("should return DATE_FORMAT when date pattern is invalid", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        date: "15-08-2026",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.DATE_FORMAT);
      }
    });

    it("should return DATE_INVALID when date is an impossible calendar date", () => {
      const result = createTransactionSchema.safeParse({
        ...validPayload,
        date: "2026-02-31",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(TRANSACTION_ISSUE_CODES.DATE_INVALID);
      }
    });
  });
  describe("getTranslatedValidationMessage (i18n mapping)", () => {
    it("should correctly translate issue codes to Portuguese (pt-BR)", () => {
      expect(getTranslatedValidationMessage(TRANSACTION_ISSUE_CODES.DESCRIPTION_MIN, pt)).toBe(
        pt.validation.descriptionMin
      );
      expect(getTranslatedValidationMessage(TRANSACTION_ISSUE_CODES.AMOUNT_POSITIVE, pt)).toBe(
        pt.validation.amountPositive
      );
    });

    it("should correctly translate issue codes to English (en-US)", () => {
      expect(getTranslatedValidationMessage(TRANSACTION_ISSUE_CODES.DESCRIPTION_MIN, en)).toBe(
        en.validation.descriptionMin
      );
      expect(getTranslatedValidationMessage(TRANSACTION_ISSUE_CODES.AMOUNT_POSITIVE, en)).toBe(
        en.validation.amountPositive
      );
    });
  });
});
