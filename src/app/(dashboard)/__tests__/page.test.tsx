import { useModal } from "@/contexts/ModalContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { customRender } from "@/test/utils";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
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

  beforeEach(() => {
    vi.clearAllMocks();

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

  it("renders loading skeleton state when data is loading (Line 21)", () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: mockRefetch,
    });

    renderDashboardPage();
    expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument();
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

  it("triggers refetch callback when TransactionFormModal fires onSuccess (Line 96)", async () => {
    const user = userEvent.setup();
    renderDashboardPage();

    await user.click(screen.getByTestId("open-modal-btn"));
    await user.click(screen.getByTestId("trigger-success-btn"));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
