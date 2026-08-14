import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Design System/UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const DefaultCard: Story = {
  render: () => (
    <Card style={{ maxWidth: "360px" }}>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
      </CardHeader>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--color-neutral-900)" }}>
        R$ 8.420,50
      </div>
      <p style={{ fontSize: "12px", color: "var(--color-neutral-500)", marginTop: "8px" }}>
        Updated today
      </p>
    </Card>
  ),
};
