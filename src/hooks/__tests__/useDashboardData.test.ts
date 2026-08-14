import { LocaleProvider } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type { GetDashboardDataResponse, TransactionFiltersState } from "@/types";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardData } from "../useDashboardData";

vi.mock("@/services/api/transactionService", () => ({
  transactionService: {
    getDashboardData: vi.fn(),
  },
}));

const mockDashboardResponse: GetDashboardDataResponse = {
  data: {
    transactions: [
      {
        id: "tx-1",
        description: "Salário Principal",
        amount: 8500,
        type: "income",
        category: "salary",
        date: "2026-08-05",
        createdAt: "2026-08-05T09:00:00.000Z",
      },
    ],
    summary: {
      currentBalance: 8500,
      totalIncome: 8500,
      totalExpenses: 0,
      savingsRate: 100,
      periodComparison: {
        balanceVariation: 0,
        incomeVariation: 0,
        expensesVariation: 0,
      },
    },
    categories: [],
  },
  meta: {
    totalCount: 1,
    period: "current-month",
  },
};

const defaultParams: TransactionFiltersState = {
  period: "current-month",
  type: "all",
  category: "all",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(LocaleProvider, null, children);
}

describe("useDashboardData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial load and loading state transitions", () => {
    it("starts with isLoading as true, data as null and error as null", () => {
      vi.mocked(transactionService.getDashboardData).mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useDashboardData(defaultParams), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("populates data and sets isLoading to false on successful API response", async () => {
      vi.mocked(transactionService.getDashboardData).mockResolvedValueOnce(mockDashboardResponse);

      const { result } = renderHook(() => useDashboardData(defaultParams), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockDashboardResponse.data);
      expect(result.current.error).toBeNull();
      expect(transactionService.getDashboardData).toHaveBeenCalledTimes(1);
      expect(transactionService.getDashboardData).toHaveBeenCalledWith({
        period: "current-month",
        type: "all",
        category: "all",
      });
    });
  });

  describe("Error handling", () => {
    it("sets error message and marks isLoading as false when service request rejects", async () => {
      vi.mocked(transactionService.getDashboardData).mockRejectedValueOnce(
        new Error("Network Error")
      );

      const { result } = renderHook(() => useDashboardData(defaultParams), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe("Nenhum dado disponível.");
    });
  });

  describe("Reactivity on filter changes", () => {
    it("triggers a new data fetch whenever filter parameters change", async () => {
      vi.mocked(transactionService.getDashboardData).mockResolvedValue(mockDashboardResponse);

      const { result, rerender } = renderHook(
        (props: TransactionFiltersState) => useDashboardData(props),
        {
          initialProps: defaultParams,
          wrapper,
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(transactionService.getDashboardData).toHaveBeenCalledWith({
        period: "current-month",
        type: "all",
        category: "all",
      });

      rerender({
        period: "previous-month",
        type: "expense",
        category: "food",
      });

      await waitFor(() => {
        expect(transactionService.getDashboardData).toHaveBeenCalledWith({
          period: "previous-month",
          type: "expense",
          category: "food",
        });
      });

      expect(transactionService.getDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  describe("Lifecycle and unmount cleanup", () => {
    it("aborts state updates cleanly when unmounted before request completes", async () => {
      let resolvePromise: (value: GetDashboardDataResponse) => void;
      const delayedPromise = new Promise<GetDashboardDataResponse>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(transactionService.getDashboardData).mockReturnValueOnce(delayedPromise);
      const { result, unmount } = renderHook(() => useDashboardData(defaultParams), { wrapper });

      expect(result.current.isLoading).toBe(true);
      unmount();

      resolvePromise!(mockDashboardResponse);
      expect(result.current.data).toBeNull();
    });
  });
});
