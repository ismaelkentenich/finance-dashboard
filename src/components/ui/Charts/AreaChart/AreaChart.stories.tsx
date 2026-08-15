import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaChart } from "./AreaChart";

const meta: Meta<typeof AreaChart> = {
  title: "Design System/Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Smooth area/line chart primitive with automatic gradient background shading and responsive container scaling.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

export const SingleBalanceTrend: Story = {
  render: () => (
    <div style={{ width: "100%", height: "300px" }}>
      <AreaChart
        data={[
          { label: "01/Ago", balance: 5000 },
          { label: "05/Ago", balance: 8500 },
          { label: "10/Ago", balance: 6300 },
          { label: "15/Ago", balance: 7800 },
        ]}
        series={[{ dataKey: "balance", name: "Evolução do Saldo", color: "var(--color-blue-200)" }]}
        valueFormatter={(val) => `R$ ${val}`}
      />
    </div>
  ),
};

export const DualIncomeExpenseArea: Story = {
  render: () => (
    <div style={{ width: "100%", height: "300px" }}>
      <AreaChart
        data={[
          { label: "Semana 1", income: 3000, expense: 1200 },
          { label: "Semana 2", income: 4500, expense: 2100 },
          { label: "Semana 3", income: 2800, expense: 1800 },
        ]}
        series={[
          { dataKey: "income", name: "Receitas", color: "var(--color-primary-green-100)" },
          { dataKey: "expense", name: "Despesas", color: "var(--color-status-error-200)" },
        ]}
      />
    </div>
  ),
};
