import { LocaleProvider } from "@/contexts/LocaleContext";
import type { FinancialSummary } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "../SummaryCards";

const mockSummary: FinancialSummary = {
  currentBalance: 7001.8,
  totalIncome: 10300,
  totalExpenses: 3298.2,
  savingsRate: 68,
  periodComparison: {
    balanceVariation: 12.5,
    incomeVariation: 5.0,
    expensesVariation: -8.2,
  },
};

describe("SummaryCards Metric Badges A11y and Screen Reader Context", () => {
  it("provides informative aria-label on positive balance variation badge", () => {
    render(
      <LocaleProvider>
        <SummaryCards summary={mockSummary} currency="BRL" />
      </LocaleProvider>
    );

    const balanceCard = screen.getByTestId("summary-card-balance");
    const badge = balanceCard.querySelector('[data-testid="summary-card-badge"]');

    expect(badge).toHaveAttribute("aria-label", "Aumento de +12.5% em relação ao período anterior");
  });

  it("provides informative aria-label on negative expense variation badge", () => {
    render(
      <LocaleProvider>
        <SummaryCards summary={mockSummary} currency="BRL" />
      </LocaleProvider>
    );

    const expenseCard = screen.getByTestId("summary-card-expenses");
    const badge = expenseCard.querySelector('[data-testid="summary-card-badge"]');

    expect(badge).toHaveAttribute("aria-label", "Redução de -8.2% em relação ao período anterior");
  });
});
