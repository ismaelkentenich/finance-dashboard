import { LocaleProvider } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type {
  GetDashboardDataResponse,
  PeriodFilter,
  TransactionCategory,
  TransactionType,
} from "@/types";
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
        gcTime: 0,
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

  it("preserves previous data (keepPreviousData) across filter parameter changes to ensure layout animation continuity", async () => {
    const initialResponse: GetDashboardDataResponse = {
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
          periodComparison: { balanceVariation: 0, incomeVariation: 0, expensesVariation: 0 },
        },
        categories: [],
      },
      meta: { totalCount: 1, period: "current-month" },
    };

    const nextResponse: GetDashboardDataResponse = {
      data: {
        transactions: [],
        summary: {
          currentBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          savingsRate: 0,
          periodComparison: { balanceVariation: 0, incomeVariation: 0, expensesVariation: 0 },
        },
        categories: [],
      },
      meta: { totalCount: 0, period: "last-3-months" },
    };

    vi.mocked(transactionService.getDashboardData)
      .mockResolvedValueOnce(initialResponse)
      .mockResolvedValueOnce(nextResponse);

    const initialProps: {
      period: PeriodFilter;
      type: "all" | TransactionType;
      category: "all" | TransactionCategory;
    } = {
      period: "current-month",
      type: "all",
      category: "all",
    };

    const { result, rerender } = renderHook((params) => useDashboardData(params), {
      wrapper: createWrapper(),
      initialProps,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.transactions).toHaveLength(1);

    rerender({
      period: "last-3-months",
      type: "all",
      category: "all",
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.transactions).toHaveLength(1);

    await waitFor(() => expect(result.current.data?.transactions).toHaveLength(0));
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
