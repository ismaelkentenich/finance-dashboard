import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { customRender } from "@/test/utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsPage from "../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/transactions",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/useDashboardData");
vi.mock("@/hooks/useTransactionFilters");

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

const mockTransactions = [
  {
    id: "tx-1",
    description: "Supermercado Extra",
    amount: 350,
    type: "expense" as const,
    category: "food" as const,
    date: "2026-08-01",
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "tx-2",
    description: "Mercado Central",
    amount: 120,
    type: "expense" as const,
    category: "food" as const,
    date: "2026-08-02",
    createdAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "tx-3",
    description: "Salário Mensal",
    amount: 5000,
    type: "income" as const,
    category: "salary" as const,
    date: "2026-08-03",
    createdAt: "2026-08-03T00:00:00Z",
  },
];

function renderTransactionsPage(locale: "pt-BR" | "en-US" = "pt-BR") {
  return customRender(<TransactionsPage />, {
    locale,
  });
}

describe("TransactionsPage Search Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: { period: "current-month", type: "all", category: "all" },
      setFilters: vi.fn(),
      resetFilters: vi.fn(),
      hasActiveFilters: false,
    });

    vi.mocked(useDashboardData).mockReturnValue({
      data: {
        transactions: mockTransactions,
        summary: {
          currentBalance: 4530,
          totalIncome: 5000,
          totalExpenses: 470,
          savingsRate: 90.6,
          periodComparison: {
            balanceVariation: 0,
            incomeVariation: 0,
            expensesVariation: 0,
          },
        },
        categories: [],
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  describe("Accessibility and localization", () => {
    it("renders filters and search region with localized accessible name in pt-BR", () => {
      renderTransactionsPage("pt-BR");

      expect(
        screen.getByRole("region", {
          name: /filtros e busca de transações/i,
        })
      ).toBeInTheDocument();
    });

    it("renders filters and search region with localized accessible name in en-US", () => {
      renderTransactionsPage("en-US");

      expect(
        screen.getByRole("region", {
          name: /transaction filters and search/i,
        })
      ).toBeInTheDocument();
    });
  });

  it("renders search input with search icon and total transactions count when no search is active", () => {
    renderTransactionsPage();

    expect(screen.getByTestId("transaction-search-input-start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-search-stats")).toHaveTextContent(
      "3 transações encontradas"
    );
  });

  it("filters transactions and updates stats feedback with query and pluralization in pt-BR", async () => {
    const user = userEvent.setup();

    renderTransactionsPage("pt-BR");

    await user.type(screen.getByTestId("transaction-search-input"), "mercado");

    expect(screen.getByTestId("transaction-search-stats")).toHaveTextContent(
      '2 resultados para "mercado"'
    );

    expect(screen.getByTestId("transaction-row-tx-1")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-row-tx-2")).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-row-tx-3")).not.toBeInTheDocument();
  });

  it("formats singular query result correctly in en-US", async () => {
    const user = userEvent.setup();

    renderTransactionsPage("en-US");

    const searchInput = screen.getByTestId("transaction-search-input");

    await user.type(searchInput, "Salário");

    expect(screen.getByTestId("transaction-search-stats")).toHaveTextContent(
      '1 result for "Salário"'
    );
  });

  it("clears search query and restores full list when clicking the clear button", async () => {
    const user = userEvent.setup();

    renderTransactionsPage();

    const searchInput = screen.getByTestId("transaction-search-input");

    await user.type(searchInput, "Extra");

    expect(screen.getByTestId("transaction-search-input-clear-button")).toBeInTheDocument();

    await user.click(screen.getByTestId("transaction-search-input-clear-button"));

    expect(searchInput).toHaveValue("");
    expect(screen.getByTestId("transaction-search-stats")).toHaveTextContent(
      "3 transações encontradas"
    );
  });

  it("displays EmptyState when search matches zero items", async () => {
    const user = userEvent.setup();

    renderTransactionsPage();

    const searchInput = screen.getByTestId("transaction-search-input");

    await user.type(searchInput, "inexistente");

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-search-stats")).toHaveTextContent(
      '0 resultados para "inexistente"'
    );
  });

  it("keeps existing transactions visible while filtered data is being refetched", () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: {
        transactions: mockTransactions,
        summary: {
          currentBalance: 4530,
          totalIncome: 5000,
          totalExpenses: 470,
          savingsRate: 90.6,
          periodComparison: {
            balanceVariation: 0,
            incomeVariation: 0,
            expensesVariation: 0,
          },
        },
        categories: [],
      },
      isLoading: false,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    });

    renderTransactionsPage();

    const status = screen.getByTestId("transactions-updating-status");

    expect(status).toHaveAttribute("role", "status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Atualizando");

    expect(screen.getByText("Supermercado Extra")).toBeInTheDocument();
    expect(screen.getByText("Mercado Central")).toBeInTheDocument();
    expect(screen.getByText("Salário Mensal")).toBeInTheDocument();

    expect(screen.queryByTestId("transactions-loading")).not.toBeInTheDocument();
  });
});
