import type { CategorySummary } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryBreakdown } from "./CategoryBreakdown";

const meta: Meta<typeof CategoryBreakdown> = {
  title: "Features/Dashboard/CategoryBreakdown",
  component: CategoryBreakdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visual breakdown showing percentage distribution of expenses across categories with accessible progress bars and dynamic currency formatting.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryBreakdown>;

const sampleCategories: CategorySummary[] = [
  {
    category: "housing",
    categoryLabel: "Housing",
    totalAmount: 2200.0,
    percentage: 66.7,
    transactionCount: 1,
  },
  {
    category: "food",
    categoryLabel: "Food & Groceries",
    totalAmount: 642.5,
    percentage: 19.5,
    transactionCount: 2,
  },
  {
    category: "transportation",
    categoryLabel: "Transportation",
    totalAmount: 230.0,
    percentage: 7.0,
    transactionCount: 1,
  },
  {
    category: "utilities",
    categoryLabel: "Utilities & Bills",
    totalAmount: 179.9,
    percentage: 5.5,
    transactionCount: 1,
  },
  {
    category: "healthcare",
    categoryLabel: "Healthcare",
    totalAmount: 145.8,
    percentage: 4.4,
    transactionCount: 1,
  },
];

export const Default: Story = {
  args: {
    categories: sampleCategories,
  },
};

export const SingleCategory: Story = {
  args: {
    categories: [
      {
        category: "housing",
        categoryLabel: "Housing",
        totalAmount: 1500.0,
        percentage: 100.0,
        transactionCount: 1,
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    categories: [],
  },
};
