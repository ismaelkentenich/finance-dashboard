import { createNormalizedTransaction, mockCategories } from "@/test/utils";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinancialChart } from "./FinancialChart";

const mockNormalizedTransactions = [
  createNormalizedTransaction({
    id: "tx-001",
    description: "Salário Principal",
    amount: 8500,
    currency: "BRL",
    type: "income",
    category: "salary",
    date: "2026-08-05",
  }),

  createNormalizedTransaction({
    id: "tx-002",
    description: "Aluguel",
    amount: 2200,
    currency: "BRL",
    type: "expense",
    category: "housing",
    date: "2026-08-06",
  }),
];

const meta: Meta<typeof FinancialChart> = {
  title: "Features/Dashboard/FinancialChart",
  component: FinancialChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Customizable financial chart container orchestrating metric views (Income vs Expense, Balance Trend, Category Breakdown) and dynamic chart types (Bar, Area, Pie).",
      },
    },
  },
  args: {
    transactions: mockNormalizedTransactions,
    categories: mockCategories,
  },
};

export default meta;
type Story = StoryObj<typeof FinancialChart>;

export const Default: Story = {};

export const EmptyState: Story = {
  args: {
    transactions: [],
    categories: [],
  },
};
