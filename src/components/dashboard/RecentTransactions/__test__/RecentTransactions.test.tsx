import type { Transaction } from "@/types";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecentTransactions } from "../RecentTransactions";

function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).substring(2, 9)}`,
    description: "Sample Description",
    amount: 100,
    type: "expense",
    category: "food",
    date: "2026-08-14",
    createdAt: "2026-08-14T00:00:00.000Z",
    ...overrides,
  };
}

describe("RecentTransactions Component", () => {
  describe("header and accessible structure", () => {
    it("renders the component title inside a level 2 heading", () => {
      render(<RecentTransactions transactions={[]} />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: "Recent Transactions",
      });
      expect(heading).toBeInTheDocument();
    });

    it("applies the default data-testid on the root container", () => {
      render(<RecentTransactions transactions={[]} />);

      expect(screen.getByTestId("recent-transactions")).toBeInTheDocument();
    });

    it("overrides default test identifier when data-testid is explicitly supplied", () => {
      render(<RecentTransactions transactions={[]} data-testid="custom-recent-transactions" />);

      expect(screen.getByTestId("custom-recent-transactions")).toBeInTheDocument();
      expect(screen.queryByTestId("recent-transactions")).not.toBeInTheDocument();
    });
  });

  describe("empty state presentation", () => {
    it("displays the empty message when transactions array is empty", () => {
      render(<RecentTransactions transactions={[]} />);

      const emptyMessage = screen.getByTestId("empty-transactions-message");
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent("No transactions found for the selected period.");
    });

    it("does not render the table element when transactions list is empty", () => {
      render(<RecentTransactions transactions={[]} />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.queryByTestId("transactions-table")).not.toBeInTheDocument();
    });
  });

  describe("table header rendering", () => {
    it("renders all four expected column headers in order", () => {
      const transactions = [createTransaction()];
      render(<RecentTransactions transactions={transactions} />);

      const table = screen.getByTestId("transactions-table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(4);
      expect(headers[0]).toHaveTextContent("Description");
      expect(headers[1]).toHaveTextContent("Category");
      expect(headers[2]).toHaveTextContent("Date");
      expect(headers[3]).toHaveTextContent("Amount");
    });
  });

  describe("transaction list rendering", () => {
    it("renders the exact number of rows corresponding to the provided transactions", () => {
      const mockList: Transaction[] = [
        createTransaction({ id: "tx-1", description: "Monthly Salary" }),
        createTransaction({ id: "tx-2", description: "Apartment Rent" }),
        createTransaction({ id: "tx-3", description: "Supermarket" }),
      ];

      render(<RecentTransactions transactions={mockList} />);

      const tableBody = screen.getAllByRole("row");
      expect(tableBody).toHaveLength(4);

      expect(screen.getByTestId("transaction-row-tx-1")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-row-tx-2")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-row-tx-3")).toBeInTheDocument();
    });

    it("does not display the empty state message when transactions are present", () => {
      const transactions = [createTransaction()];
      render(<RecentTransactions transactions={transactions} />);

      expect(screen.queryByTestId("empty-transactions-message")).not.toBeInTheDocument();
    });

    it("renders distinct items with their respective descriptions inside table cells", () => {
      const mockList: Transaction[] = [
        createTransaction({ id: "tx-income", description: "Freelance Project" }),
        createTransaction({ id: "tx-expense", description: "Gym Membership" }),
      ];

      render(<RecentTransactions transactions={mockList} />);

      const rowIncome = screen.getByTestId("transaction-row-tx-income");
      const rowExpense = screen.getByTestId("transaction-row-tx-expense");

      expect(within(rowIncome).getByText("Freelance Project")).toBeInTheDocument();
      expect(within(rowExpense).getByText("Gym Membership")).toBeInTheDocument();
    });
  });
});
