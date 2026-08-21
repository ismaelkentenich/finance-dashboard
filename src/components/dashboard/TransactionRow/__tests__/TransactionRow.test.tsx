import { LocaleProvider } from "@/contexts/LocaleContext";
import type { NormalizedTransaction } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionRow } from "../TransactionRow";

function createMockTransaction(
  overrides: Partial<NormalizedTransaction> = {}
): NormalizedTransaction {
  return {
    id: "tx-test-1",
    description: "Sample Description",

    amount: 150,
    currency: "BRL",

    normalizedAmount: 150,
    normalizedCurrency: "BRL",

    type: "expense",
    category: "food",
    date: "2026-08-14",
    createdAt: "2026-08-14T10:00:00.000Z",

    ...overrides,
  };
}

function renderInTableWithLocale(ui: React.ReactElement, locale: "pt-BR" | "en-US" = "pt-BR") {
  return render(
    <LocaleProvider initialLocale={locale}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </LocaleProvider>
  );
}

describe("TransactionRow Component", () => {
  describe("description and category presentation", () => {
    it("renders transaction description inside the corresponding cell", () => {
      const transaction = createMockTransaction({
        description: "Supermarket Purchase",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      expect(screen.getByTestId("transaction-description")).toHaveTextContent(
        "Supermarket Purchase"
      );
    });

    it("renders mapped localized category label in badge", () => {
      const transaction = createMockTransaction({
        category: "housing",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      expect(screen.getByTestId("category-badge")).toHaveTextContent("Moradia");
    });
  });

  describe("date column formatting", () => {
    it("formats ISO date string into localized pt-BR presentation", () => {
      const transaction = createMockTransaction({
        date: "2026-08-05",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const dateCell = screen.getByTestId("transaction-date");

      expect(dateCell.textContent?.toLowerCase()).toContain("05");
      expect(dateCell.textContent?.toLowerCase()).toContain("ago");
      expect(dateCell.textContent).toContain("2026");
    });
  });

  describe("amount formatting and financial type styling", () => {
    it("prepends plus sign and applies income styling when transaction type is income", () => {
      const transaction = createMockTransaction({
        type: "income",

        amount: 8500,
        currency: "BRL",

        normalizedAmount: 8500,
        normalizedCurrency: "BRL",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const amountCell = screen.getByTestId("transaction-amount");

      expect(amountCell).toHaveTextContent(/Receitas:\s*\+\s*R\$\s*8\.500,00/);

      expect(amountCell.className).toMatch(/incomeAmount/i);
      expect(amountCell.className).not.toMatch(/expenseAmount/i);
    });

    it("prepends minus sign and applies expense styling when transaction type is expense", () => {
      const transaction = createMockTransaction({
        type: "expense",

        amount: 2200,
        currency: "BRL",

        normalizedAmount: 2200,
        normalizedCurrency: "BRL",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const amountCell = screen.getByTestId("transaction-amount");

      expect(amountCell).toHaveTextContent(/Despesas:\s*-\s*R\$\s*2\.200,00/);

      expect(amountCell.className).toMatch(/expenseAmount/i);
      expect(amountCell.className).not.toMatch(/incomeAmount/i);
    });

    it("renders normalized amount instead of original amount", () => {
      const transaction = createMockTransaction({
        type: "expense",

        amount: 100,
        currency: "USD",

        normalizedAmount: 542,
        normalizedCurrency: "BRL",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const amountCell = screen.getByTestId("transaction-amount");

      expect(amountCell).toHaveTextContent(/-\s*R\$\s*542,00/);

      expect(amountCell).not.toHaveTextContent(/100,00/);
    });

    it("formats normalized currency independently from locale", () => {
      const transaction = createMockTransaction({
        type: "income",

        amount: 500,
        currency: "BRL",

        normalizedAmount: 100,
        normalizedCurrency: "USD",
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />, "pt-BR");

      expect(screen.getByTestId("transaction-amount")).toHaveTextContent(/US\$\s*100,00/);
    });
  });

  describe("custom test identifier and className support", () => {
    it("renders custom data-testid on row element when supplied", () => {
      const transaction = createMockTransaction({
        id: "tx-custom-99",
      });

      renderInTableWithLocale(
        <TransactionRow transaction={transaction} data-testid="custom-row-item" />
      );

      expect(screen.getByTestId("custom-row-item")).toBeInTheDocument();
    });

    it("appends custom className to the row element", () => {
      const transaction = createMockTransaction();

      renderInTableWithLocale(
        <TransactionRow transaction={transaction} className="custom-highlight-row" />
      );

      const row = screen.getByTestId(`transaction-row-${transaction.id}`);

      expect(row.className).toContain("custom-highlight-row");
    });
  });
});
