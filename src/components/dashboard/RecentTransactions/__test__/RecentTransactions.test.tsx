import { LocaleProvider } from "@/contexts/LocaleContext";
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

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("RecentTransactions Component", () => {
  describe("header and accessible structure", () => {
    it("renders the default component title inside a level 2 heading matching locale", () => {
      renderWithLocale(<RecentTransactions transactions={[]} />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: "Transações",
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders custom title when title prop is provided", () => {
      renderWithLocale(<RecentTransactions transactions={[]} title="Transações Recentes" />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: "Transações Recentes",
      });
      expect(heading).toBeInTheDocument();
    });

    it("applies the default data-testid on the root container", () => {
      renderWithLocale(<RecentTransactions transactions={[]} />);

      expect(screen.getByTestId("recent-transactions")).toBeInTheDocument();
    });

    it("overrides default test identifier when data-testid is explicitly supplied", () => {
      renderWithLocale(
        <RecentTransactions transactions={[]} data-testid="custom-recent-transactions" />
      );

      expect(screen.getByTestId("custom-recent-transactions")).toBeInTheDocument();
      expect(screen.queryByTestId("recent-transactions")).not.toBeInTheDocument();
    });
  });

  describe("empty state presentation", () => {
    it("displays the localized empty message when transactions array is empty", () => {
      renderWithLocale(<RecentTransactions transactions={[]} />);

      const emptyMessage = screen.getByTestId("empty-transactions-message");
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent(
        "Nenhuma transação encontrada para o período selecionado."
      );
    });

    it("does not render the table element when transactions list is empty", () => {
      renderWithLocale(<RecentTransactions transactions={[]} />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.queryByTestId("transactions-table")).not.toBeInTheDocument();
    });
  });

  describe("table header rendering", () => {
    it("renders all four expected localized column headers in order", () => {
      const transactions = [createTransaction()];
      renderWithLocale(<RecentTransactions transactions={transactions} />);

      const table = screen.getByTestId("transactions-table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(4);
      expect(headers[0]).toHaveTextContent("Descrição");
      expect(headers[1]).toHaveTextContent("Categoria");
      expect(headers[2]).toHaveTextContent("Data");
      expect(headers[3]).toHaveTextContent("Valor");
    });
  });

  describe("transaction list rendering", () => {
    it("renders the exact number of rows corresponding to the provided transactions", () => {
      const mockList: Transaction[] = [
        createTransaction({ id: "tx-1", description: "Monthly Salary" }),
        createTransaction({ id: "tx-2", description: "Apartment Rent" }),
        createTransaction({ id: "tx-3", description: "Supermarket" }),
      ];

      renderWithLocale(<RecentTransactions transactions={mockList} />);

      const tableBody = screen.getAllByRole("row");
      expect(tableBody).toHaveLength(4);

      expect(screen.getByTestId("transaction-row-tx-1")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-row-tx-2")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-row-tx-3")).toBeInTheDocument();
    });

    it("does not display the empty state message when transactions are present", () => {
      const transactions = [createTransaction()];
      renderWithLocale(<RecentTransactions transactions={transactions} />);

      expect(screen.queryByTestId("empty-transactions-message")).not.toBeInTheDocument();
    });

    it("renders distinct items with their respective descriptions inside table cells", () => {
      const mockList: Transaction[] = [
        createTransaction({ id: "tx-income", description: "Freelance Project" }),
        createTransaction({ id: "tx-expense", description: "Gym Membership" }),
      ];

      renderWithLocale(<RecentTransactions transactions={mockList} />);

      const rowIncome = screen.getByTestId("transaction-row-tx-income");
      const rowExpense = screen.getByTestId("transaction-row-tx-expense");

      expect(within(rowIncome).getByText("Freelance Project")).toBeInTheDocument();
      expect(within(rowExpense).getByText("Gym Membership")).toBeInTheDocument();
    });
  });

  describe("RecentTransactions Anchor & Structure Navigation", () => {
    it("has id='transactions' on the root container by default", () => {
      render(
        <LocaleProvider>
          <RecentTransactions transactions={[]} />
        </LocaleProvider>
      );

      const container = screen.getByTestId("recent-transactions");
      expect(container).toHaveAttribute("id", "transactions");
    });

    it("applies custom id prop when passed", () => {
      render(
        <LocaleProvider>
          <RecentTransactions transactions={[]} id="custom-anchor" />
        </LocaleProvider>
      );

      const container = screen.getByTestId("recent-transactions");
      expect(container).toHaveAttribute("id", "custom-anchor");
    });
  });
});
