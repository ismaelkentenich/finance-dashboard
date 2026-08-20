import type { FinancialSummary } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryCards } from "./SummaryCards";

const meta: Meta<typeof SummaryCards> = {
  title: "Features/Dashboard/SummaryCards",
  component: SummaryCards,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Financial summary metrics displaying Current Balance, Total Income, Total Expenses, and Savings Rate with independent locale and currency formatting.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SummaryCards>;

const sampleSummary: FinancialSummary = {
  currentBalance: 7001.8,
  totalIncome: 10300,
  totalExpenses: 3298.2,
  savingsRate: 68,
  periodComparison: {
    balanceVariation: 12.5,
    incomeVariation: 5,
    expensesVariation: -8.2,
  },
};

export const Default: Story = {
  args: {
    summary: sampleSummary,
    currency: "BRL",
  },
};

export const USD: Story = {
  args: {
    summary: sampleSummary,
    currency: "USD",
  },
};

export const EUR: Story = {
  args: {
    summary: sampleSummary,
    currency: "EUR",
  },
};

export const NegativeBalance: Story = {
  args: {
    currency: "BRL",
    summary: {
      currentBalance: -450,
      totalIncome: 2000,
      totalExpenses: 2450,
      savingsRate: -22.5,
      periodComparison: {
        balanceVariation: -115,
        incomeVariation: -10,
        expensesVariation: 25,
      },
    },
  },
};
