import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PieChart } from "./PieChart";

const meta: Meta<typeof PieChart> = {
  title: "Design System/Charts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Donut/Pie chart primitive for proportional data visualization with customizable inner/outer radii and legend.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PieChart>;

export const DonutBreakdown: Story = {
  render: () => (
    <div style={{ width: "100%", height: "300px" }}>
      <PieChart
        data={[
          { name: "Moradia", value: 2200, fill: "#008f47" },
          { name: "Alimentação", value: 642.5, fill: "#2f63c0" },
          { name: "Transporte", value: 230, fill: "#5530e8" },
          { name: "Contas", value: 179.9, fill: "#ff850a" },
        ]}
        valueFormatter={(val) => `R$ ${val}`}
      />
    </div>
  ),
};
