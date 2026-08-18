import { LocaleProvider } from "@/contexts/LocaleContext";
import { MotionProvider } from "@/providers/MotionProvider";
import type { CategorySummary } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryBreakdown } from "../CategoryBreakdown";

function renderWithLocale(ui: React.ReactElement) {
  return render(
    <MotionProvider>
      <LocaleProvider>{ui}</LocaleProvider>
    </MotionProvider>
  );
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

    it("renders animated category items inside stagger container", () => {
      renderWithLocale(<CategoryBreakdown categories={mockCategories} />);

      expect(screen.getByTestId("category-list")).toBeInTheDocument();
      expect(screen.getByTestId("category-item-housing")).toBeInTheDocument();
      expect(screen.getByTestId("category-item-food")).toBeInTheDocument();
    });
  });
});
