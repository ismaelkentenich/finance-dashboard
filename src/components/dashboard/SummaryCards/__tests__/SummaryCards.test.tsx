import { customRender } from "@/test/utils";
import type { FinancialSummary } from "@/types";
import { screen, within } from "@testing-library/react";
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

describe("SummaryCards Feature Grid Component", () => {
  it("renders all four primary financial summary cards inside motion section", () => {
    const summary = createFinancialSummary();

    customRender(<SummaryCards summary={summary} />);

    expect(screen.getByTestId("summary-cards-grid")).toBeInTheDocument();

    expect(screen.getByTestId("summary-card-balance")).toBeInTheDocument();

    expect(screen.getByTestId("summary-card-income")).toBeInTheDocument();

    expect(screen.getByTestId("summary-card-expenses")).toBeInTheDocument();

    expect(screen.getByTestId("summary-card-savings")).toBeInTheDocument();
  });

  describe("Accessibility and localization", () => {
    it("renders summary region with localized accessible name in pt-BR", () => {
      const summary = createFinancialSummary();

      customRender(<SummaryCards summary={summary} />, {
        locale: "pt-BR",
      });

      expect(
        screen.getByRole("region", {
          name: "Resumo financeiro",
        })
      ).toBeInTheDocument();
    });

    it("renders summary region with localized accessible name in en-US", () => {
      const summary = createFinancialSummary();

      customRender(<SummaryCards summary={summary} />, {
        locale: "en-US",
      });

      expect(
        screen.getByRole("region", {
          name: "Financial summary",
        })
      ).toBeInTheDocument();
    });
  });

  it("formats currency values according to active locale", () => {
    const summary = createFinancialSummary({
      currentBalance: 7001.8,
    });

    customRender(<SummaryCards summary={summary} />, {
      locale: "pt-BR",
    });

    const balanceCard = screen.getByTestId("summary-card-balance");

    const valueContainer = within(balanceCard).getByTestId("summary-card-value");

    expect(valueContainer).toHaveAttribute("aria-label", expect.stringMatching(/R\$\s*7\.001,80/));

    expect(within(valueContainer).getAllByText(/R\$\s*7\.001,80/).length).toBeGreaterThanOrEqual(1);
  });

  it("formats currency values according to en-US locale", () => {
    const summary = createFinancialSummary({
      currentBalance: 7001.8,
    });

    customRender(<SummaryCards summary={summary} />, {
      locale: "en-US",
    });

    const balanceCard = screen.getByTestId("summary-card-balance");

    const valueContainer = within(balanceCard).getByTestId("summary-card-value");

    expect(valueContainer).toHaveAttribute("aria-label", expect.stringMatching(/\$7,001\.80/));
  });

  it("displays variation badges with trend indications", () => {
    const summary = createFinancialSummary({
      periodComparison: {
        balanceVariation: 12.5,
        incomeVariation: 5.0,
        expensesVariation: -8.2,
      },
    });

    customRender(<SummaryCards summary={summary} />);

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("+5.0%")).toBeInTheDocument();
    expect(screen.getByText("-8.2%")).toBeInTheDocument();
  });
});
