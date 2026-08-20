import type { NormalizedTransaction } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionRow } from "./TransactionRow";

const meta: Meta<typeof TransactionRow> = {
  title: "Features/Dashboard/TransactionsTable/TransactionRow",
  component: TransactionRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Individual transaction table row displaying description, localized category badge, formatted date, and normalized financial amount.",
      },
    },
  },
  decorators: [
    (Story) => (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TransactionRow>;

const mockIncomeTransaction: NormalizedTransaction = {
  id: "tx-income-1",
  description: "Depósito de Salário",

  amount: 8500,
  currency: "BRL",

  normalizedAmount: 8500,
  normalizedCurrency: "BRL",

  type: "income",
  category: "salary",
  date: "2026-08-05",
  createdAt: "2026-08-05T09:00:00.000Z",
};

const mockExpenseTransaction: NormalizedTransaction = {
  id: "tx-expense-1",
  description: "Aluguel Apartamento",

  amount: 2200,
  currency: "BRL",

  normalizedAmount: 2200,
  normalizedCurrency: "BRL",

  type: "expense",
  category: "housing",
  date: "2026-08-06",
  createdAt: "2026-08-06T14:30:00.000Z",
};

const mockForeignCurrencyTransaction: NormalizedTransaction = {
  id: "tx-expense-usd",
  description: "Software Subscription",

  amount: 25,
  currency: "USD",

  normalizedAmount: 135.5,
  normalizedCurrency: "BRL",

  type: "expense",
  category: "services",
  date: "2026-08-08",
  createdAt: "2026-08-08T18:15:00.000Z",
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

export const ForeignCurrencyRow: Story = {
  args: {
    transaction: mockForeignCurrencyTransaction,
  },
};

export const MultipleRowsComparison: Story = {
  render: () => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <TransactionRow transaction={mockIncomeTransaction} />

        <TransactionRow transaction={mockExpenseTransaction} />

        <TransactionRow transaction={mockForeignCurrencyTransaction} />
      </tbody>
    </table>
  ),
};
