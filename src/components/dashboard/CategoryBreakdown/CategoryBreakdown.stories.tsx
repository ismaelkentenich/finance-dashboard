import type { CategorySummary } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryBreakdown } from "./CategoryBreakdown";

const meta: Meta<typeof CategoryBreakdown> = {
  title: "Features/Dashboard/CategoryBreakdown",
  component: CategoryBreakdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CategoryBreakdown>;

const sampleCategories: CategorySummary[] = [
  {
    category: "housing",
    categoryLabel: "Housing",
    totalAmount: 2200,
    percentage: 55,
    transactionCount: 1,
  },
  {
    category: "food",
    categoryLabel: "Food",
    totalAmount: 1000,
    percentage: 25,
    transactionCount: 4,
  },
  {
    category: "transportation",
    categoryLabel: "Transportation",
    totalAmount: 800,
    percentage: 20,
    transactionCount: 3,
  },
];

export const Default: Story = {
  args: {
    categories: sampleCategories,
    currency: "BRL",
  },
};

export const USD: Story = {
  args: {
    categories: sampleCategories,
    currency: "USD",
  },
};

export const SingleCategory: Story = {
  args: {
    currency: "BRL",
    categories: [
      {
        category: "housing",
        categoryLabel: "Housing",
        totalAmount: 1500,
        percentage: 100,
        transactionCount: 1,
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    categories: [],
    currency: "BRL",
  },
};
