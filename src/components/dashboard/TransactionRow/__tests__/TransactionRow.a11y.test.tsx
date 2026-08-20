import { LocaleProvider } from "@/contexts/LocaleContext";
import type { Transaction } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionRow } from "../TransactionRow";

function renderWithTable(ui: React.ReactNode) {
  return render(
    <LocaleProvider>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </LocaleProvider>
  );
}

const mockIncomeTx: Transaction = {
  id: "tx-income-1",
  description: "Salary Deposit",
  amount: 8500,
  currency: "BRL",
  type: "income",
  category: "salary",
  date: "2026-08-05",
  createdAt: "2026-08-05T09:00:00.000Z",
};

const mockExpenseTx: Transaction = {
  id: "tx-expense-1",
  description: "House Rent",
  amount: 2200,
  currency: "BRL",
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
});
