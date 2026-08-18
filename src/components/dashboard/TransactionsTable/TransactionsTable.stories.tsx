import type { Transaction } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionsTable } from "./TransactionsTable";

const meta: Meta<typeof TransactionsTable> = {
  title: "Features/Dashboard/TransactionsTable/TransactionsTable",
  component: TransactionsTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container component presenting a semantic table of recent transactions with localized headers, empty state handling, and responsive horizontal scroll.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionsTable>;

const sampleTransactions: Transaction[] = [
  {
    id: "tx-001",
    description: "Salário Mensal",
    amount: 8500.0,
    type: "income",
    category: "salary",
    date: "2026-08-05",
    createdAt: "2026-08-05T09:00:00.000Z",
  },
  {
    id: "tx-002",
    description: "Aluguel Apartamento",
    amount: 2200.0,
    type: "expense",
    category: "housing",
    date: "2026-08-06",
    createdAt: "2026-08-06T14:30:00.000Z",
  },
  {
    id: "tx-003",
    description: "Supermercado Mensal",
    amount: 642.5,
    type: "expense",
    category: "food",
    date: "2026-08-08",
    createdAt: "2026-08-08T18:15:00.000Z",
  },
  {
    id: "tx-004",
    description: "Projeto Freelance UI",
    amount: 1800.0,
    type: "income",
    category: "freelance",
    date: "2026-08-10",
    createdAt: "2026-08-10T11:00:00.000Z",
  },
];

export const Default: Story = {
  args: {
    transactions: sampleTransactions,
  },
};

export const EmptyState: Story = {
  args: {
    transactions: [],
  },
};
