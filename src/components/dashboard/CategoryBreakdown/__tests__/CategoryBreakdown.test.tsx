import { LocaleProvider } from "@/contexts/LocaleContext";
import type { CategorySummary } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryBreakdown } from "../CategoryBreakdown";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("CategoryBreakdown Component", () => {
  describe("header and container rendering", () => {
    it("renders the component title inside a level 2 heading matching locale", () => {
      renderWithLocale(<CategoryBreakdown categories={[]} />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: "Despesas por Categoria",
      });
      expect(heading).toBeInTheDocument();
    });

    it("applies the default data-testid on the root card element", () => {
      renderWithLocale(<CategoryBreakdown categories={[]} />);

      expect(screen.getByTestId("category-breakdown")).toBeInTheDocument();
    });

    it("renders custom data-testid when explicitly provided", () => {
      renderWithLocale(<CategoryBreakdown categories={[]} data-testid="custom-breakdown-card" />);

      expect(screen.getByTestId("custom-breakdown-card")).toBeInTheDocument();
      expect(screen.queryByTestId("category-breakdown")).not.toBeInTheDocument();
    });
  });

  describe("empty state handling", () => {
    it("displays the localized empty state message when categories array is empty", () => {
      renderWithLocale(<CategoryBreakdown categories={[]} />);

      const emptyMessage = screen.getByTestId("empty-category-message");
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent("Nenhum dado de despesa para este período.");
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("populated categories presentation", () => {
    const mockCategories: CategorySummary[] = [
      {
        category: "housing",
        categoryLabel: "Housing",
        totalAmount: 2200,
        percentage: 65.5,
        transactionCount: 1,
      },
      {
        category: "food",
        categoryLabel: "Food & Groceries",
        totalAmount: 800,
        percentage: 23.8,
        transactionCount: 4,
      },
    ];

    it("renders all category items with localized labels and formatted percentages", () => {
      renderWithLocale(<CategoryBreakdown categories={mockCategories} />);

      expect(screen.getByTestId("category-label-housing")).toHaveTextContent("Moradia");
      expect(screen.getByTestId("category-label-food")).toHaveTextContent("Alimentação & Mercado");

      expect(screen.getByTestId("category-amount-housing").textContent).toMatch(
        /R\$\s*2\.200,00\s*\(65\.5%\)/
      );
      expect(screen.getByTestId("category-amount-food").textContent).toMatch(
        /R\$\s*800,00\s*\(23\.8%\)/
      );
    });

    it("configures accessible progressbar attributes matching percentage values", () => {
      renderWithLocale(<CategoryBreakdown categories={mockCategories} />);

      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars).toHaveLength(2);

      expect(progressBars[0]).toHaveAttribute("aria-valuenow", "65.5");
      expect(progressBars[0]).toHaveAttribute("aria-valuemin", "0");
      expect(progressBars[0]).toHaveAttribute("aria-valuemax", "100");
    });
  });
});
