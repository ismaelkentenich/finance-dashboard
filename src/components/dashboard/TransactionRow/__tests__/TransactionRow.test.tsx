import { LocaleProvider } from "@/contexts/LocaleContext";
import type { Transaction } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionRow } from "../TransactionRow";

function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-test-1",
    description: "Sample Description",
    amount: 150,
    type: "expense",
    category: "food",
    date: "2026-08-14",
    createdAt: "2026-08-14T10:00:00.000Z",
    ...overrides,
  };
}

function renderInTableWithLocale(ui: React.ReactElement) {
  return render(
    <LocaleProvider>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </LocaleProvider>
  );
}

describe("TransactionRow Component", () => {
  describe("description and category presentation", () => {
    it("renders transaction description inside the corresponding cell", () => {
      const transaction = createMockTransaction({ description: "Supermarket Purchase" });
      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const descCell = screen.getByTestId("transaction-description");
      expect(descCell).toHaveTextContent("Supermarket Purchase");
    });

    it("renders mapped human-readable category label from locale dictionary in badge", () => {
      const transaction = createMockTransaction({ category: "housing" });
      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const badge = screen.getByTestId("category-badge");
      // Mapped to pt-BR dictionary ("Moradia")
      expect(badge).toHaveTextContent("Moradia");
    });
  });

  describe("date column formatting", () => {
    it("formats ISO date string into localized pt-BR presentation", () => {
      const transaction = createMockTransaction({ date: "2026-08-05" });
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
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const amountCell = screen.getByTestId("transaction-amount");
      expect(amountCell.textContent).toMatch(/\+\s*R\$\s*8\.500,00/);
      expect(amountCell.className).toMatch(/incomeAmount/i);
      expect(amountCell.className).not.toMatch(/expenseAmount/i);
    });

    it("prepends minus sign and applies expense styling when transaction type is expense", () => {
      const transaction = createMockTransaction({
        type: "expense",
        amount: 2200,
      });

      renderInTableWithLocale(<TransactionRow transaction={transaction} />);

      const amountCell = screen.getByTestId("transaction-amount");
      expect(amountCell.textContent).toMatch(/-\s*R\$\s*2\.200,00/);
      expect(amountCell.className).toMatch(/expenseAmount/i);
      expect(amountCell.className).not.toMatch(/incomeAmount/i);
    });
  });

  describe("custom test identifier support", () => {
    it("renders custom data-testid on row element when supplied", () => {
      const transaction = createMockTransaction({ id: "tx-custom-99" });
      renderInTableWithLocale(
        <TransactionRow transaction={transaction} data-testid="custom-row-item" />
      );

      expect(screen.getByTestId("custom-row-item")).toBeInTheDocument();
    });
  });
});
