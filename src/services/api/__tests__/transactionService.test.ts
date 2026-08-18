import { telemetryService } from "@/services/telemetry";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { transactionService } from "../transactionService";

describe("transactionService", () => {
  const validMockDashboardPayload = {
    data: {
      transactions: [
        {
          id: "tx-1",
          description: "Salário",
          amount: 5000,
          type: "income",
          category: "salary",
          date: "2026-08-01",
          createdAt: "2026-08-01T00:00:00Z",
        },
      ],
      summary: {
        currentBalance: 5000,
        totalIncome: 5000,
        totalExpenses: 0,
        savingsRate: 100,
        periodComparison: {
          balanceVariation: 10,
          incomeVariation: 5,
          expensesVariation: 0,
        },
      },
      categories: [
        {
          category: "housing",
          categoryLabel: "Moradia",
          totalAmount: 1200,
          percentage: 100,
          transactionCount: 1,
        },
      ],
    },
    meta: {
      totalCount: 1,
      period: "current-month",
    },
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getDashboardData", () => {
    it("fetches and returns validated dashboard data from endpoint without parameters", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => validMockDashboardPayload,
      } as Response);

      const result = await transactionService.getDashboardData();

      expect(fetch).toHaveBeenCalledWith("/api/transactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      expect(result).toEqual(validMockDashboardPayload);
    });

    it("appends period, type, and category search params when supplied", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => validMockDashboardPayload,
      } as Response);

      await transactionService.getDashboardData({
        period: "previous-month",
        type: "expense",
        category: "housing",
      });

      expect(fetch).toHaveBeenCalledWith(
        "/api/transactions?period=previous-month&type=expense&category=housing",
        expect.any(Object)
      );
    });

    it("throws an error when GET response is not ok", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(transactionService.getDashboardData()).rejects.toThrow(
        "Failed to fetch transactions: 500 Internal Server Error"
      );

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to fetch transactions: 500 Internal Server Error",
        }),
        {
          operation: "transactionService.getDashboardData",
          status: 500,
          statusText: "Internal Server Error",
          endpoint: "/api/transactions",
        }
      );
    });

    it("throws a controlled error and logs telemetry when response payload is malformed", async () => {
      const malformedPayload = {
        data: {
          transactions: "not-an-array", // Type mismatch
          summary: {},
        },
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => malformedPayload,
      } as Response);

      await expect(transactionService.getDashboardData()).rejects.toThrow(
        "Invalid API response contract: dashboard schema mismatch"
      );

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid API response contract: dashboard schema mismatch",
        }),
        expect.objectContaining({
          operation: "transactionService.getDashboardData",
          endpoint: "/api/transactions",
          issues: expect.any(Array),
        })
      );
    });

    it("throws a controlled error when response is an arbitrary primitive or null", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      } as Response);

      await expect(transactionService.getDashboardData()).rejects.toThrow(
        "Invalid API response contract: dashboard schema mismatch"
      );
    });
  });

  describe("createTransaction", () => {
    it("sends POST request with serialized payload and returns validated created transaction", async () => {
      const payload = {
        description: "Aluguel",
        amount: 2500,
        type: "expense" as const,
        category: "housing" as const,
        date: "2026-08-14",
      };

      const mockCreated = { id: "tx-new", ...payload, createdAt: "2026-08-14T00:00:00Z" };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCreated }),
      } as Response);

      const result = await transactionService.createTransaction(payload);

      expect(fetch).toHaveBeenCalledWith("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(mockCreated);
    });

    it("throws an error when POST request returns failure status", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      await expect(
        transactionService.createTransaction({
          description: "Inválido",
          amount: 0,
          type: "expense",
          category: "food",
          date: "2026-08-14",
        })
      ).rejects.toThrow("Failed to create transaction: 400");
    });

    it("throws a controlled error when POST returns malformed transaction data", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { invalidField: true } }),
      } as Response);

      await expect(
        transactionService.createTransaction({
          description: "Mercado",
          amount: 100,
          type: "expense",
          category: "food",
          date: "2026-08-14",
        })
      ).rejects.toThrow("Invalid API response contract: transaction creation schema mismatch");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "transactionService.createTransaction",
        })
      );
    });
  });
});
