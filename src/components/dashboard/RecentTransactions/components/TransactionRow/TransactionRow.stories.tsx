import type { Transaction } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionRow } from "./TransactionRow";

const meta: Meta<typeof TransactionRow> = {
  title: "Features/Dashboard/RecentTransactions/TransactionRow",
  component: TransactionRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Individual transaction table row displaying description, formatted category badge, localized date, and color-coded financial amount.",
      },
    },
  },
  decorators: [
    (Story) => (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TransactionRow>;

const mockIncomeTransaction: Transaction = {
  id: "tx-income-1",
  description: "Monthly Salary Deposit",
  amount: 8500,
  type: "income",
  category: "salary",
  date: "2026-08-05",
  createdAt: "2026-08-05T09:00:00.000Z",
};

const mockExpenseTransaction: Transaction = {
  id: "tx-expense-1",
  description: "Apartment Monthly Rent",
  amount: 2200,
  type: "expense",
  category: "housing",
  date: "2026-08-06",
  createdAt: "2026-08-06T14:30:00.000Z",
};

export const IncomeRow: Story = {
  args: {
    transaction: mockIncomeTransaction,
  },
};

export const ExpenseRow: Story = {
  args: {
    transaction: mockExpenseTransaction,
  },
};

export const MultipleRowsComparison: Story = {
  render: () => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <TransactionRow transaction={mockIncomeTransaction} />
        <TransactionRow transaction={mockExpenseTransaction} />
        <TransactionRow
          transaction={{
            id: "tx-expense-2",
            description: "Supermarket Groceries",
            amount: 642.5,
            type: "expense",
            category: "food",
            date: "2026-08-08",
            createdAt: "2026-08-08T18:15:00.000Z",
          }}
        />
      </tbody>
    </table>
  ),
};
