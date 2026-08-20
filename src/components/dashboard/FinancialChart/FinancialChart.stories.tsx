import { createNormalizedTransaction, mockCategories } from "@/test/utils";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinancialChart } from "./FinancialChart";

const mockNormalizedTransactions = [
  createNormalizedTransaction({
    id: "tx-001",
    description: "Salário",
    amount: 10000,
    currency: "BRL",
    normalizedAmount: 10000,
    normalizedCurrency: "BRL",
    type: "income",
    category: "salary",
    date: "2026-08-05",
  }),

  createNormalizedTransaction({
    id: "tx-002",
    description: "Aluguel",
    amount: 2200,
    currency: "BRL",
    normalizedAmount: 2200,
    normalizedCurrency: "BRL",
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
          "Customizable financial chart container using normalized monetary values and an explicit display currency.",
      },
    },
  },
  args: {
    transactions: mockNormalizedTransactions,
    categories: mockCategories,
    currency: "BRL",
  },
};

export default meta;

type Story = StoryObj<typeof FinancialChart>;

export const Default: Story = {};

export const USD: Story = {
  args: {
    currency: "USD",
  },
};

export const EUR: Story = {
  args: {
    currency: "EUR",
  },
};

export const EmptyState: Story = {
  args: {
    transactions: [],
    categories: [],
    currency: "BRL",
  },
};
