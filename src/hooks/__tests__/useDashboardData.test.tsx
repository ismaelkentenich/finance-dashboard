import { LocaleProvider } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type { GetDashboardDataResponse } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardData } from "../useDashboardData";

vi.mock("@/services/api/transactionService", () => ({
  transactionService: {
    getDashboardData: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>{children}</LocaleProvider>
      </QueryClientProvider>
    );
  };
}

describe("useDashboardData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches dashboard data successfully using TanStack Query", async () => {
    const mockResponse: GetDashboardDataResponse = {
      data: {
        transactions: [],
        summary: {
          currentBalance: 5000,
          totalIncome: 7000,
          totalExpenses: 2000,
          savingsRate: 71.4,
          periodComparison: {
            balanceVariation: 10,
            incomeVariation: 5,
            expensesVariation: -2,
          },
        },
        categories: [],
      },
      meta: {
        totalCount: 0,
        period: "current-month",
      },
    };

    vi.mocked(transactionService.getDashboardData).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () =>
        useDashboardData({
          period: "current-month",
          type: "all",
          category: "all",
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse.data);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors gracefully", async () => {
    vi.mocked(transactionService.getDashboardData).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { result } = renderHook(
      () =>
        useDashboardData({
          period: "current-month",
          type: "all",
          category: "all",
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network Error");
  });
});
