import { LocaleProvider } from "@/contexts/LocaleContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardFilters } from "../DashboardFilters";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("DashboardFilters Component", () => {
  it("renders all three filter select inputs with appropriate labels", () => {
    renderWithLocale(
      <DashboardFilters
        period="current-month"
        type="all"
        category="all"
        onPeriodChange={vi.fn()}
        onTypeChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByTestId("period-filter-select")).toBeInTheDocument();
    expect(screen.getByTestId("type-filter-select")).toBeInTheDocument();
    expect(screen.getByTestId("category-filter-select")).toBeInTheDocument();
  });

  it("triggers onPeriodChange callback when period selection changes", () => {
    const handlePeriodChange = vi.fn();
    renderWithLocale(
      <DashboardFilters
        period="current-month"
        type="all"
        category="all"
        onPeriodChange={handlePeriodChange}
        onTypeChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const select = screen.getByTestId("period-filter-select");
    fireEvent.change(select, { target: { value: "previous-month" } });

    expect(handlePeriodChange).toHaveBeenCalledTimes(1);
    expect(handlePeriodChange).toHaveBeenCalledWith("previous-month");
  });

  it("displays reset filters button only when hasActiveFilters is true", () => {
    const handleReset = vi.fn();
    const { rerender } = renderWithLocale(
      <DashboardFilters
        period="current-month"
        type="all"
        category="all"
        onPeriodChange={vi.fn()}
        onTypeChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onReset={handleReset}
        hasActiveFilters={false}
      />
    );

    expect(screen.queryByTestId("reset-filters-button")).not.toBeInTheDocument();

    rerender(
      <LocaleProvider>
        <DashboardFilters
          period="last-3-months"
          type="expense"
          category="food"
          onPeriodChange={vi.fn()}
          onTypeChange={vi.fn()}
          onCategoryChange={vi.fn()}
          onReset={handleReset}
          hasActiveFilters={true}
        />
      </LocaleProvider>
    );

    const resetButton = screen.getByTestId("reset-filters-button");
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
