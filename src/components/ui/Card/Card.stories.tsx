import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Design System/UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Surface container establishing elevation hierarchy across flat, raised, and interactive states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "raised", "interactive"],
      description: "Visual elevation and interaction variant of the card surface",
    },
    children: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Flat: Story = {
  args: {
    variant: "flat",
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: "360px" }}>
      <CardHeader>
        <CardTitle>Flat Surface (Static)</CardTitle>
      </CardHeader>
      <div style={{ fontSize: "14px", color: "var(--color-neutral-700)", marginTop: "8px" }}>
        Border-only separation without drop shadow. Used for standard panels and static content.
      </div>
    </Card>
  ),
};

export const Raised: Story = {
  args: {
    variant: "raised",
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: "360px" }}>
      <CardHeader>
        <CardTitle>Raised Surface (Emphasized)</CardTitle>
      </CardHeader>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--color-neutral-900)" }}>
        R$ 8.420,50
      </div>
      <p style={{ fontSize: "12px", color: "var(--color-neutral-500)", marginTop: "8px" }}>
        Elevated surface with depth shadow for key KPI summary metrics.
      </p>
    </Card>
  ),
};

export const Interactive: Story = {
  args: {
    variant: "interactive",
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: "360px" }} onClick={() => alert("Card clicked!")}>
      <CardHeader>
        <CardTitle>Interactive Surface</CardTitle>
      </CardHeader>
      <div style={{ fontSize: "14px", color: "var(--color-neutral-700)", marginTop: "8px" }}>
        Clickable surface with dynamic hover state and cursor pointer.
      </div>
    </Card>
  ),
};

export const ElevationMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
      <Card variant="flat" style={{ width: "260px" }}>
        <CardHeader>
          <CardTitle>Flat</CardTitle>
        </CardHeader>
        <p style={{ fontSize: "12px", color: "var(--color-neutral-500)", marginTop: "8px" }}>
          Static / Border only
        </p>
      </Card>

      <Card variant="raised" style={{ width: "260px" }}>
        <CardHeader>
          <CardTitle>Raised</CardTitle>
        </CardHeader>
        <p style={{ fontSize: "12px", color: "var(--color-neutral-500)", marginTop: "8px" }}>
          Shadow-md elevation
        </p>
      </Card>

      <Card variant="interactive" style={{ width: "260px" }}>
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
        </CardHeader>
        <p style={{ fontSize: "12px", color: "var(--color-neutral-500)", marginTop: "8px" }}>
          Hover elevation feedback
        </p>
      </Card>
    </div>
  ),
};
