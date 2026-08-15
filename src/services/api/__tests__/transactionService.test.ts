import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { transactionService } from "../transactionService";

describe("transactionService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getDashboardData", () => {
    it("fetches dashboard data from default endpoint without parameters", async () => {
      const mockPayload = { data: { transactions: [], summary: {}, categories: [] } };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPayload,
      } as Response);

      const result = await transactionService.getDashboardData();

      expect(fetch).toHaveBeenCalledWith("/api/transactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      expect(result).toEqual(mockPayload);
    });

    it("appends period, type, and category search params when supplied", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
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
    });
  });

  describe("createTransaction", () => {
    it("sends POST request with serialized payload and returns created transaction", async () => {
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
  });
});
