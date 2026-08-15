import { mockCategories, mockTransactions } from "@/test/utils";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinancialChart } from "./FinancialChart";

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
    transactions: mockTransactions,
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
