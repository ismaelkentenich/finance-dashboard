import { LocaleProvider } from "@/contexts/LocaleContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DashboardFilters } from "../DashboardFilters";
import type { DashboardFiltersProps } from "../DashboardFilters.types";

function renderDashboardFilters(props: Partial<DashboardFiltersProps> = {}) {
  const defaultProps: DashboardFiltersProps = {
    period: "current-month",
    type: "all",
    category: "all",
    onPeriodChange: vi.fn(),
    onTypeChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onReset: vi.fn(),
    hasActiveFilters: false,
    ...props,
  };

  const renderResult = render(
    <LocaleProvider>
      <DashboardFilters {...defaultProps} />
    </LocaleProvider>
  );

  return {
    ...renderResult,
    props: defaultProps,
  };
}

describe("DashboardFilters Component", () => {
  describe("Accessibility and structural rendering", () => {
    it("renders semantic section container with accessible label and default test identifier", () => {
      renderDashboardFilters();

      const section = screen.getByTestId("dashboard-filters");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute("aria-label", "Transaction Filters Bar");
    });

    it("propagates custom data-testid and custom className to root element", () => {
      renderDashboardFilters({
        "data-testid": "custom-filters-bar",
        className: "custom-filter-class",
      });

      const section = screen.getByTestId("custom-filters-bar");
      expect(section).toBeInTheDocument();
      expect(section.className).toContain("custom-filter-class");
    });

    it("renders all three filter select elements in the document", () => {
      renderDashboardFilters();

      expect(screen.getByTestId("period-filter-select")).toBeInTheDocument();
      expect(screen.getByTestId("type-filter-select")).toBeInTheDocument();
      expect(screen.getByTestId("category-filter-select")).toBeInTheDocument();
    });
  });

  describe("Initial select values mapping", () => {
    it("displays initial period, type, and category values passed via props", () => {
      renderDashboardFilters({
        period: "last-3-months",
        type: "expense",
        category: "housing",
      });

      const periodSelect = screen.getByTestId("period-filter-select") as HTMLSelectElement;
      const typeSelect = screen.getByTestId("type-filter-select") as HTMLSelectElement;
      const categorySelect = screen.getByTestId("category-filter-select") as HTMLSelectElement;

      expect(periodSelect.value).toBe("last-3-months");
      expect(typeSelect.value).toBe("expense");
      expect(categorySelect.value).toBe("housing");
    });
  });

  describe("User interaction and callback dispatching", () => {
    it("invokes onPeriodChange with selected value when period option changes", async () => {
      const user = userEvent.setup();
      const handlePeriodChange = vi.fn();

      renderDashboardFilters({ onPeriodChange: handlePeriodChange });

      const periodSelect = screen.getByTestId("period-filter-select");
      await user.selectOptions(periodSelect, "previous-month");

      expect(handlePeriodChange).toHaveBeenCalledTimes(1);
      expect(handlePeriodChange).toHaveBeenCalledWith("previous-month");
    });

    it("invokes onTypeChange with selected value when type option changes", async () => {
      const user = userEvent.setup();
      const handleTypeChange = vi.fn();

      renderDashboardFilters({ onTypeChange: handleTypeChange });

      const typeSelect = screen.getByTestId("type-filter-select");
      await user.selectOptions(typeSelect, "income");

      expect(handleTypeChange).toHaveBeenCalledTimes(1);
      expect(handleTypeChange).toHaveBeenCalledWith("income");
    });

    it("invokes onCategoryChange with selected value when category option changes", async () => {
      const user = userEvent.setup();
      const handleCategoryChange = vi.fn();

      renderDashboardFilters({ onCategoryChange: handleCategoryChange });

      const categorySelect = screen.getByTestId("category-filter-select");
      await user.selectOptions(categorySelect, "food");

      expect(handleCategoryChange).toHaveBeenCalledTimes(1);
      expect(handleCategoryChange).toHaveBeenCalledWith("food");
    });
  });

  describe("Reset button visibility and trigger flow", () => {
    it("does not mount reset filters button when hasActiveFilters is false", () => {
      renderDashboardFilters({ hasActiveFilters: false });

      expect(screen.queryByTestId("reset-filters-button")).not.toBeInTheDocument();
    });

    it("renders reset button with localized aria-label when hasActiveFilters is true", () => {
      renderDashboardFilters({ hasActiveFilters: true });

      const resetButton = screen.getByTestId("reset-filters-button");
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveAttribute("type", "button");
      expect(resetButton).toHaveAttribute("aria-label", "Limpar Filtros");
    });

    it("invokes onReset callback when clicking reset filters button", async () => {
      const user = userEvent.setup();
      const handleReset = vi.fn();

      renderDashboardFilters({
        hasActiveFilters: true,
        onReset: handleReset,
      });

      const resetButton = screen.getByTestId("reset-filters-button");
      await user.click(resetButton);

      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });
});
