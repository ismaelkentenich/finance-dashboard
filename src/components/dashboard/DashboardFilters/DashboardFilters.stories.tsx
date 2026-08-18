import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { DashboardFilters } from "./DashboardFilters";

const meta: Meta<typeof DashboardFilters> = {
  title: "Features/Dashboard/DashboardFilters",
  component: DashboardFilters,
  tags: ["autodocs"],
  args: {
    onPeriodChange: fn(),
    onTypeChange: fn(),
    onCategoryChange: fn(),
    onReset: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DashboardFilters>;

export const Default: Story = {
  args: {
    period: "current-month",
    type: "all",
    category: "all",
    hasActiveFilters: false,
  },
};

export const WithActiveFilters: Story = {
  args: {
    period: "last-3-months",
    type: "expense",
    category: "food",
    hasActiveFilters: true,
  },
};
