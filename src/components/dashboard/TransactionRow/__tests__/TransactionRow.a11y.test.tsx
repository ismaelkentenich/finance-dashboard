import { LocaleProvider } from "@/contexts/LocaleContext";
import type { NormalizedTransaction } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionRow } from "../TransactionRow";

function renderWithTable(ui: React.ReactNode, locale: "pt-BR" | "en-US" = "pt-BR") {
  return render(
    <LocaleProvider initialLocale={locale}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </LocaleProvider>
  );
}

const mockIncomeTx: NormalizedTransaction = {
  id: "tx-income-1",
  description: "Salary Deposit",

  amount: 8500,
  currency: "BRL",

  normalizedAmount: 8500,
  normalizedCurrency: "BRL",

  type: "income",
  category: "salary",
  date: "2026-08-05",
  createdAt: "2026-08-05T09:00:00.000Z",
};

const mockExpenseTx: NormalizedTransaction = {
  id: "tx-expense-1",
  description: "House Rent",

  amount: 2200,
  currency: "BRL",

  normalizedAmount: 2200,
  normalizedCurrency: "BRL",

  type: "expense",
  category: "housing",
  date: "2026-08-06",
  createdAt: "2026-08-06T14:30:00.000Z",
};

describe("TransactionRow Auditory Semantics & A11y", () => {
  it("renders visually-hidden sr-only text identifying an income transaction", () => {
    renderWithTable(<TransactionRow transaction={mockIncomeTx} />);

    const amountCell = screen.getByTestId("transaction-amount");

    const srLabel = amountCell.querySelector(".sr-only");

    expect(srLabel).toBeInTheDocument();

    expect(srLabel).toHaveTextContent("Receitas:");

    expect(amountCell).toHaveTextContent(/Receitas:\s*\+\s*R\$\s*8\.500,00/);
  });

  it("renders visually-hidden sr-only text identifying an expense transaction", () => {
    renderWithTable(<TransactionRow transaction={mockExpenseTx} />);

    const amountCell = screen.getByTestId("transaction-amount");

    const srLabel = amountCell.querySelector(".sr-only");

    expect(srLabel).toBeInTheDocument();

    expect(srLabel).toHaveTextContent("Despesas:");

    expect(amountCell).toHaveTextContent(/Despesas:\s*-\s*R\$\s*2\.200,00/);
  });

  it("announces normalized amount in the normalized currency", () => {
    const transaction: NormalizedTransaction = {
      ...mockExpenseTx,

      amount: 100,
      currency: "USD",

      normalizedAmount: 542,
      normalizedCurrency: "BRL",
    };

    renderWithTable(<TransactionRow transaction={transaction} />);

    expect(screen.getByTestId("transaction-amount")).toHaveTextContent(
      /Despesas:\s*-\s*R\$\s*542,00/
    );
  });

  it("localizes financial type semantic label in en-US", () => {
    renderWithTable(<TransactionRow transaction={mockIncomeTx} />, "en-US");

    const amountCell = screen.getByTestId("transaction-amount");

    const srLabel = amountCell.querySelector(".sr-only");

    expect(srLabel).toHaveTextContent("Income:");
  });
});
