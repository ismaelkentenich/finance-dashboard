import { LocaleProvider } from "@/contexts/LocaleContext";
import type { FinancialSummary } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "../SummaryCards";

function createFinancialSummary(overrides: Partial<FinancialSummary> = {}): FinancialSummary {
  return {
    currentBalance: 7001.8,
    totalIncome: 10300,
    totalExpenses: 3298.2,
    savingsRate: 68,
    periodComparison: {
      balanceVariation: 12.5,
      incomeVariation: 5.0,
      expensesVariation: -8.2,
    },
    ...overrides,
  };
}

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("SummaryCards Feature Grid Component", () => {
  it("renders all four primary financial summary cards", () => {
    const summary = createFinancialSummary();
    renderWithLocale(<SummaryCards summary={summary} />);

    expect(screen.getByTestId("summary-card-balance")).toBeInTheDocument();
    expect(screen.getByTestId("summary-card-income")).toBeInTheDocument();
    expect(screen.getByTestId("summary-card-expenses")).toBeInTheDocument();
    expect(screen.getByTestId("summary-card-savings")).toBeInTheDocument();
  });

  it("formats currency values according to active locale", () => {
    const summary = createFinancialSummary({ currentBalance: 7001.8 });
    renderWithLocale(<SummaryCards summary={summary} />);

    expect(screen.getByText(/R\$\s*7\.001,80/)).toBeInTheDocument();
  });

  it("displays variation badges with trend indications", () => {
    const summary = createFinancialSummary({
      periodComparison: {
        balanceVariation: 12.5,
        incomeVariation: 5.0,
        expensesVariation: -8.2,
      },
    });
    renderWithLocale(<SummaryCards summary={summary} />);

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("+5.0%")).toBeInTheDocument();
    expect(screen.getByText("-8.2%")).toBeInTheDocument();
  });
});
