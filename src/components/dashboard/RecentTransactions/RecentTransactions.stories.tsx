import type { Transaction } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RecentTransactions } from "./RecentTransactions";

const meta: Meta<typeof RecentTransactions> = {
  title: "Features/Dashboard/RecentTransactions/RecentTransactionsTable",
  component: RecentTransactions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container component presenting a semantic table of recent transactions with empty state handling and responsive horizontal scroll.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RecentTransactions>;

const sampleTransactions: Transaction[] = [
  {
    id: "tx-001",
    description: "Main Salary",
    amount: 8500.0,
    type: "income",
    category: "salary",
    date: "2026-08-05",
    createdAt: "2026-08-05T09:00:00.000Z",
  },
  {
    id: "tx-002",
    description: "Apartment Rent",
    amount: 2200.0,
    type: "expense",
    category: "housing",
    date: "2026-08-06",
    createdAt: "2026-08-06T14:30:00.000Z",
  },
  {
    id: "tx-003",
    description: "Supermarket Groceries",
    amount: 642.5,
    type: "expense",
    category: "food",
    date: "2026-08-08",
    createdAt: "2026-08-08T18:15:00.000Z",
  },
  {
    id: "tx-004",
    description: "Freelance Design Project",
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
