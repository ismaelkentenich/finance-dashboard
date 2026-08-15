import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarChart } from "./BarChart";

const meta: Meta<typeof BarChart> = {
  title: "Design System/Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Reusable bar chart primitive with support for horizontal/vertical layouts, multiple series, and custom color tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const DualSeries: Story = {
  render: () => (
    <div style={{ width: "100%", height: "320px" }}>
      <BarChart
        data={[
          { label: "Jan", income: 8500, expense: 3200 },
          { label: "Feb", income: 6200, expense: 4100 },
          { label: "Mar", income: 7800, expense: 2900 },
        ]}
        series={[
          { dataKey: "income", name: "Receitas", color: "var(--color-primary-green-100)" },
          { dataKey: "expense", name: "Despesas", color: "var(--color-status-error-200)" },
        ]}
      />
    </div>
  ),
};

export const VerticalCategoryBreakdown: Story = {
  render: () => (
    <div style={{ width: "100%", height: "280px" }}>
      <BarChart
        data={[
          { name: "Moradia", value: 2200 },
          { name: "Alimentação", value: 800 },
          { name: "Transporte", value: 450 },
        ]}
        layout="vertical"
        xAxisKey="name"
        series={[{ dataKey: "value", name: "Despesas", color: "var(--color-primary-green-100)" }]}
        valueFormatter={(val) => `R$ ${val}`}
      />
    </div>
  ),
};
