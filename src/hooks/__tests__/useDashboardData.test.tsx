import { transactionService } from "@/services/api/transactionService";
import { customRenderHook } from "@/test/utils";
import type {
  GetDashboardDataResponse,
  PeriodFilter,
  TransactionCategory,
  TransactionType,
} from "@/types";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardData } from "../useDashboardData";

vi.mock("@/services/api/transactionService", () => ({
  transactionService: {
    getDashboardData: vi.fn(),
  },
}));

const emptyDashboardResponse: GetDashboardDataResponse = {
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

const initialDashboardResponse: GetDashboardDataResponse = {
  data: {
    transactions: [
      {
        id: "tx-1",
        description: "Salário",
        amount: 5000,
        currency: "BRL",
        normalizedAmount: 5000,
        normalizedCurrency: "BRL",
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

const lastThreeMonthsDashboardResponse: GetDashboardDataResponse = {
  data: {
    transactions: [],
    summary: {
      currentBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      savingsRate: 0,
      periodComparison: {
        balanceVariation: 0,
        incomeVariation: 0,
        expensesVariation: 0,
      },
    },
    categories: [],
  },
  meta: {
    totalCount: 0,
    period: "last-3-months",
  },
};

type DashboardFilters = {
  period: PeriodFilter;
  type: "all" | TransactionType;
  category: "all" | TransactionCategory;
};

const defaultFilters: DashboardFilters = {
  period: "current-month",
  type: "all",
  category: "all",
};

describe("useDashboardData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("fetches dashboard data successfully using TanStack Query", async () => {
    vi.mocked(transactionService.getDashboardData).mockResolvedValueOnce(emptyDashboardResponse);

    const { result } = customRenderHook(() => useDashboardData(defaultFilters));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(emptyDashboardResponse.data);
    expect(result.current.error).toBeNull();

    expect(transactionService.getDashboardData).toHaveBeenCalledWith({
      period: "current-month",
      type: "all",
      category: "all",
      currency: "BRL",
    });
  });

  it("preserves previous data (keepPreviousData) across filter parameter changes to ensure layout animation continuity", async () => {
    vi.mocked(transactionService.getDashboardData)
      .mockResolvedValueOnce(initialDashboardResponse)
      .mockResolvedValueOnce(lastThreeMonthsDashboardResponse);

    const { result, rerender } = customRenderHook(
      (params: DashboardFilters) => useDashboardData(params),
      {
        initialProps: defaultFilters,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.transactions).toHaveLength(1);
    expect(result.current.data?.transactions[0].id).toBe("tx-1");

    rerender({
      period: "last-3-months",
      type: "all",
      category: "all",
    });

    /*
     * placeholderData: keepPreviousData preserves the previous query
     * result while the next query is being fetched.
     */
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.transactions).toHaveLength(1);

    await waitFor(() => {
      expect(result.current.data?.transactions).toHaveLength(0);
    });

    expect(transactionService.getDashboardData).toHaveBeenNthCalledWith(1, {
      period: "current-month",
      type: "all",
      category: "all",
      currency: "BRL",
    });

    expect(transactionService.getDashboardData).toHaveBeenNthCalledWith(2, {
      period: "last-3-months",
      type: "all",
      category: "all",
      currency: "BRL",
    });
  });

  it("maps technical fetch errors to a localized pt-BR user message", async () => {
    vi.mocked(transactionService.getDashboardData).mockRejectedValueOnce(
      new Error("Failed to fetch transactions: 500 Internal Server Error")
    );

    const { result } = customRenderHook(() => useDashboardData(defaultFilters), {
      locale: "pt-BR",
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();

    expect(result.current.error).toBe(
      "Não foi possível carregar seus dados financeiros. Tente novamente."
    );

    expect(result.current.error).not.toContain("500");
    expect(result.current.error).not.toContain("Internal Server Error");
  });

  it("maps technical fetch errors to a localized en-US user message", async () => {
    vi.mocked(transactionService.getDashboardData).mockRejectedValueOnce(
      new Error("Failed to fetch transactions: 503 Service Unavailable")
    );

    const { result } = customRenderHook(() => useDashboardData(defaultFilters), {
      locale: "en-US",
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();

    expect(result.current.error).toBe("Unable to load your financial data. Please try again.");

    expect(result.current.error).not.toContain("503");
    expect(result.current.error).not.toContain("Service Unavailable");

    expect(transactionService.getDashboardData).toHaveBeenCalledWith({
      period: "current-month",
      type: "all",
      category: "all",
      currency: "USD",
    });
  });

  it("keeps refetch working after a failed request", async () => {
    const recoveredResponse: GetDashboardDataResponse = {
      data: {
        transactions: [],
        summary: {
          currentBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          savingsRate: 0,
          periodComparison: {
            balanceVariation: 0,
            incomeVariation: 0,
            expensesVariation: 0,
          },
        },
        categories: [],
      },
      meta: {
        totalCount: 0,
        period: "current-month",
      },
    };

    vi.mocked(transactionService.getDashboardData)
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce(recoveredResponse);

    const { result } = customRenderHook(() => useDashboardData(defaultFilters));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    expect(result.current.data).toEqual(recoveredResponse.data);

    expect(transactionService.getDashboardData).toHaveBeenCalledTimes(2);
  });

  it("requests dashboard data using BRL as the configured display currency for pt-BR", async () => {
    vi.mocked(transactionService.getDashboardData).mockResolvedValueOnce(emptyDashboardResponse);

    customRenderHook(() => useDashboardData(defaultFilters), {
      locale: "pt-BR",
    });

    await waitFor(() => {
      expect(transactionService.getDashboardData).toHaveBeenCalledWith({
        period: "current-month",
        type: "all",
        category: "all",
        currency: "BRL",
      });
    });
  });

  it("requests dashboard data using USD as the configured display currency for en-US", async () => {
    vi.mocked(transactionService.getDashboardData).mockResolvedValueOnce(emptyDashboardResponse);

    customRenderHook(() => useDashboardData(defaultFilters), {
      locale: "en-US",
    });

    await waitFor(() => {
      expect(transactionService.getDashboardData).toHaveBeenCalledWith({
        period: "current-month",
        type: "all",
        category: "all",
        currency: "USD",
      });
    });
  });
});
