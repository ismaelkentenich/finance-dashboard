import { useModal } from "@/contexts/ModalContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { customRender } from "@/test/utils";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../page";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/useDashboardData");
vi.mock("@/hooks/useTransactionFilters");

vi.mock("@/components/dashboard/TransactionFormModal", () => ({
  TransactionFormModal: ({ isOpen, onSuccess }: { isOpen: boolean; onSuccess: () => void }) =>
    isOpen ? (
      <div data-testid="mock-modal">
        <button onClick={onSuccess} data-testid="trigger-success-btn">
          Success Trigger
        </button>
      </div>
    ) : null,
}));

vi.mock("@/contexts/SettingsContext", async () => {
  const actual = await vi.importActual<typeof import("@/contexts/SettingsContext")>(
    "@/contexts/SettingsContext"
  );

  return {
    ...actual,
    useSettings: vi.fn(),
  };
});

function OpenModalTrigger() {
  const { openTransactionModal } = useModal();
  return (
    <button onClick={openTransactionModal} data-testid="open-modal-btn">
      Open
    </button>
  );
}

function renderDashboardPage() {
  return customRender(
    <>
      <OpenModalTrigger />
      <DashboardPage />
    </>
  );
}

describe("DashboardPage Component Integration", () => {
  const mockSetFilters = vi.fn();
  const mockResetFilters = vi.fn();
  const mockRefetch = vi.fn();
  const mockReorderWidgets = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSettings).mockReturnValue({
      overviewSettings: {
        showSummaryCards: true,
        showFinancialChart: true,
        showCategoryBreakdown: true,
        showRecentTransactions: true,
        widgetOrder: ["summaryCards", "financialChart", "categoryBreakdown", "recentTransactions"],
      },
      currencySettings: {
        displayCurrency: "BRL",
      },
      updateOverviewSettings: vi.fn(),
      updateCurrencySettings: vi.fn(),
      resetOverviewSettings: vi.fn(),
      resetCurrencySettings: vi.fn(),
      reorderWidgets: mockReorderWidgets,
    });

    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: { period: "current-month", type: "all", category: "all" },
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
      hasActiveFilters: false,
    });

    vi.mocked(useDashboardData).mockReturnValue({
      data: {
        transactions: [
          {
            id: "tx-1",
            description: "Salário",
            amount: 5000,
            normalizedAmount: 5000,
            currency: "BRL",
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
            balanceVariation: 10,
            incomeVariation: 5,
            expensesVariation: 0,
          },
        },
        categories: [],
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it("keeps skeleton on initial load without rendering the updating indicator", () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: mockRefetch,
    });

    renderDashboardPage();

    expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-updating-status")).not.toBeInTheDocument();
  });

  it("keeps current dashboard content visible and renders accessible status while refetching", () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: {
        transactions: [
          {
            id: "tx-1",
            description: "Salário",
            amount: 5000,
            normalizedAmount: 5000,
            currency: "BRL",
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
            balanceVariation: 10,
            incomeVariation: 5,
            expensesVariation: 0,
          },
        },
        categories: [],
      },
      isLoading: false,
      isFetching: true,
      error: null,
      refetch: mockRefetch,
    });

    renderDashboardPage();

    const status = screen.getByTestId("dashboard-updating-status");

    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("role", "status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Atualizando");

    const transactionRow = screen.getByTestId("transaction-row-tx-1");

    expect(transactionRow).toBeInTheDocument();
    expect(within(transactionRow).getByTestId("transaction-description")).toHaveTextContent(
      "Salário"
    );

    expect(screen.queryByTestId("dashboard-loading")).not.toBeInTheDocument();
  });

  it("does not render updating status when no background fetch is running", () => {
    renderDashboardPage();

    expect(screen.queryByTestId("dashboard-updating-status")).not.toBeInTheDocument();
  });

  it("renders error banner when loading encounters an error and retries on click", async () => {
    const user = userEvent.setup();
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: "Falha na conexão",
      refetch: mockRefetch,
    });

    renderDashboardPage();
    expect(screen.getByTestId("dashboard-error-banner")).toBeInTheDocument();
    expect(screen.getByText("Falha na conexão")).toBeInTheDocument();

    const retryBtn = screen.getByTestId("dashboard-error-banner-retry-button");
    await user.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("invokes setFilters when changing period, type, or category selectors", async () => {
    const user = userEvent.setup();
    renderDashboardPage();

    await user.selectOptions(screen.getByTestId("period-filter-select"), "last-3-months");
    expect(mockSetFilters).toHaveBeenCalledWith({ period: "last-3-months" });

    await user.selectOptions(screen.getByTestId("type-filter-select"), "expense");
    expect(mockSetFilters).toHaveBeenCalledWith({ type: "expense" });

    await user.selectOptions(screen.getByTestId("category-filter-select"), "food");
    expect(mockSetFilters).toHaveBeenCalledWith({ category: "food" });
  });

  it("renders empty state with filter reset action button when hasActiveFilters is true", async () => {
    const user = userEvent.setup();
    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: { period: "last-3-months", type: "expense", category: "food" },
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
      hasActiveFilters: true,
    });

    vi.mocked(useDashboardData).mockReturnValue({
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
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    });

    renderDashboardPage();

    const emptyStateContainer = screen.getByTestId("empty-state");
    expect(emptyStateContainer).toBeInTheDocument();

    const clearButton = within(emptyStateContainer).getByRole("button", {
      name: /limpar filtros/i,
    });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it("reorders widgets through keyboard using the same persisted reorder action", async () => {
    const user = userEvent.setup();

    renderDashboardPage();

    const handle = screen.getByTestId("widget-drag-handle-financialChart");

    handle.focus();

    await user.keyboard("{ArrowUp}");

    expect(mockReorderWidgets).toHaveBeenCalledWith([
      "financialChart",
      "summaryCards",
      "categoryBreakdown",
      "recentTransactions",
    ]);
  });

  it("renders widgets-hidden empty state when transactions exist but all dashboard widgets are disabled", () => {
    vi.mocked(useSettings).mockReturnValue({
      overviewSettings: {
        showSummaryCards: false,
        showFinancialChart: false,
        showCategoryBreakdown: false,
        showRecentTransactions: false,
        widgetOrder: ["summaryCards", "financialChart", "categoryBreakdown", "recentTransactions"],
      },
      currencySettings: {
        displayCurrency: "BRL",
      },
      updateOverviewSettings: vi.fn(),
      updateCurrencySettings: vi.fn(),
      resetOverviewSettings: vi.fn(),
      resetCurrencySettings: vi.fn(),
      reorderWidgets: mockReorderWidgets,
    });

    renderDashboardPage();

    const emptyState = screen.getByTestId("dashboard-no-widgets-empty-state");

    expect(emptyState).toBeInTheDocument();

    expect(
      within(emptyState).getByTestId("dashboard-no-widgets-empty-state-title")
    ).toHaveTextContent("Todos os widgets do dashboard estão ocultos");

    expect(
      within(emptyState).getByTestId("dashboard-no-widgets-empty-state-description")
    ).toHaveTextContent("Escolha quais widgets deseja exibir nas configurações do dashboard.");

    expect(screen.queryByText("Nenhuma transação encontrada")).not.toBeInTheDocument();
  });

  it("navigates to settings from the widgets-hidden empty state action", async () => {
    const user = userEvent.setup();

    vi.mocked(useSettings).mockReturnValue({
      overviewSettings: {
        showSummaryCards: false,
        showFinancialChart: false,
        showCategoryBreakdown: false,
        showRecentTransactions: false,
        widgetOrder: ["summaryCards", "financialChart", "categoryBreakdown", "recentTransactions"],
      },
      currencySettings: {
        displayCurrency: "BRL",
      },
      updateOverviewSettings: vi.fn(),
      updateCurrencySettings: vi.fn(),
      resetOverviewSettings: vi.fn(),
      resetCurrencySettings: vi.fn(),
      reorderWidgets: mockReorderWidgets,
    });

    renderDashboardPage();

    await user.click(screen.getByTestId("dashboard-open-settings-button"));

    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith("/settings");
  });

  it("renders widgets-hidden empty state in en-US", () => {
    vi.mocked(useSettings).mockReturnValue({
      overviewSettings: {
        showSummaryCards: false,
        showFinancialChart: false,
        showCategoryBreakdown: false,
        showRecentTransactions: false,
        widgetOrder: ["summaryCards", "financialChart", "categoryBreakdown", "recentTransactions"],
      },
      currencySettings: {
        displayCurrency: "USD",
      },
      updateOverviewSettings: vi.fn(),
      updateCurrencySettings: vi.fn(),
      resetOverviewSettings: vi.fn(),
      resetCurrencySettings: vi.fn(),
      reorderWidgets: mockReorderWidgets,
    });

    customRender(<DashboardPage />, {
      locale: "en-US",
    });

    expect(screen.getByText("All dashboard widgets are hidden")).toBeInTheDocument();

    expect(
      screen.getByText("Choose which widgets you want to display in your dashboard settings.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Open settings",
      })
    ).toBeInTheDocument();
  });
});
