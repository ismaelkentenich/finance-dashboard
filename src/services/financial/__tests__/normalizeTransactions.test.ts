import type { ExchangeRateProvider } from "@/services/exchange";
import type { Transaction } from "@/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeTransactions } from "../normalizeTransactions";

function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    description: "Test transaction",
    amount: 100,
    currency: "BRL",
    type: "expense",
    category: "other",
    date: "2026-08-20",
    createdAt: "2026-08-20T10:00:00.000Z",
    ...overrides,
  };
}

describe("normalizeTransactions", () => {
  let exchangeRateProvider: ExchangeRateProvider;

  beforeEach(() => {
    exchangeRateProvider = {
      getRate: vi.fn(),
    };
  });

  it("keeps amount unchanged when currencies are equal", async () => {
    const transactions = [
      createTransaction({
        amount: 150,
        currency: "BRL",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(result).toEqual([
      expect.objectContaining({
        amount: 150,
        currency: "BRL",
        normalizedAmount: 150,
        normalizedCurrency: "BRL",
      }),
    ]);

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("converts transaction to target currency", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });

    const transactions = [
      createTransaction({
        amount: 100,
        currency: "USD",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(result[0]).toEqual(
      expect.objectContaining({
        amount: 100,
        currency: "USD",
        normalizedAmount: 542,
        normalizedCurrency: "BRL",
      })
    );

    expect(exchangeRateProvider.getRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
      date: "2026-08-20",
    });
  });

  it("preserves original transaction amount and currency", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "EUR",
      to: "BRL",
      rate: 6,
      date: "2026-08-20",
    });

    const transaction = createTransaction({
      amount: 50,
      currency: "EUR",
    });

    const result = await normalizeTransactions({
      transactions: [transaction],
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(result[0].amount).toBe(50);
    expect(result[0].currency).toBe("EUR");

    expect(result[0].normalizedAmount).toBe(300);

    expect(result[0].normalizedCurrency).toBe("BRL");
  });

  it("deduplicates exchange rate requests for same pair and date", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValue({
      from: "USD",
      to: "BRL",
      rate: 5,
      date: "2026-08-20",
    });

    const transactions = [
      createTransaction({
        id: "tx-1",
        amount: 100,
        currency: "USD",
        date: "2026-08-20",
      }),

      createTransaction({
        id: "tx-2",
        amount: 200,
        currency: "USD",
        date: "2026-08-20",
      }),

      createTransaction({
        id: "tx-3",
        amount: 300,
        currency: "USD",
        date: "2026-08-20",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(exchangeRateProvider.getRate).toHaveBeenCalledTimes(1);

    expect(result.map((transaction) => transaction.normalizedAmount)).toEqual([500, 1000, 1500]);
  });

  it("uses separate rates for different dates", async () => {
    vi.mocked(exchangeRateProvider.getRate)
      .mockResolvedValueOnce({
        from: "USD",
        to: "BRL",
        rate: 5,
        date: "2026-08-19",
      })
      .mockResolvedValueOnce({
        from: "USD",
        to: "BRL",
        rate: 5.5,
        date: "2026-08-20",
      });

    const transactions = [
      createTransaction({
        id: "tx-1",
        amount: 100,
        currency: "USD",
        date: "2026-08-19",
      }),

      createTransaction({
        id: "tx-2",
        amount: 100,
        currency: "USD",
        date: "2026-08-20",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(exchangeRateProvider.getRate).toHaveBeenCalledTimes(2);

    expect(result[0].normalizedAmount).toBe(500);

    expect(result[1].normalizedAmount).toBe(550);
  });

  it("uses separate rates for different source currencies", async () => {
    vi.mocked(exchangeRateProvider.getRate)
      .mockResolvedValueOnce({
        from: "USD",
        to: "BRL",
        rate: 5,
        date: "2026-08-20",
      })
      .mockResolvedValueOnce({
        from: "EUR",
        to: "BRL",
        rate: 6,
        date: "2026-08-20",
      });

    const transactions = [
      createTransaction({
        id: "tx-usd",
        amount: 100,
        currency: "USD",
      }),

      createTransaction({
        id: "tx-eur",
        amount: 100,
        currency: "EUR",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(exchangeRateProvider.getRate).toHaveBeenCalledTimes(2);

    expect(result[0].normalizedAmount).toBe(500);

    expect(result[1].normalizedAmount).toBe(600);
  });

  it("normalizes mixed transactions correctly", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5,
      date: "2026-08-20",
    });

    const transactions = [
      createTransaction({
        id: "tx-brl",
        amount: 200,
        currency: "BRL",
      }),

      createTransaction({
        id: "tx-usd",
        amount: 100,
        currency: "USD",
      }),
    ];

    const result = await normalizeTransactions({
      transactions,
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual(
      expect.objectContaining({
        normalizedAmount: 200,
        normalizedCurrency: "BRL",
      })
    );

    expect(result[1]).toEqual(
      expect.objectContaining({
        normalizedAmount: 500,
        normalizedCurrency: "BRL",
      })
    );
  });

  it("propagates provider errors", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockRejectedValueOnce(
      new Error("Exchange provider unavailable")
    );

    const transactions = [
      createTransaction({
        currency: "USD",
      }),
    ];

    await expect(
      normalizeTransactions({
        transactions,
        targetCurrency: "BRL",
        exchangeRateProvider,
      })
    ).rejects.toThrow("Exchange provider unavailable");
  });

  it("returns empty array when no transactions are provided", async () => {
    const result = await normalizeTransactions({
      transactions: [],
      targetCurrency: "BRL",
      exchangeRateProvider,
    });

    expect(result).toEqual([]);

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });
});
