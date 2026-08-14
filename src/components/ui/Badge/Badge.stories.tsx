import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge.types";

const BADGE_VARIANTS: { variant: BadgeVariant; label: string }[] = [
  { variant: "neutral", label: "Neutral / Category" },
  { variant: "success", label: "+12.4% Income" },
  { variant: "danger", label: "-5.2% Expense" },
  { variant: "info", label: "Info / Processing" },
];

const meta: Meta<typeof Badge> = {
  title: "Design System/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "success", "danger", "info"],
      description: "Visual semantic style variant of the badge",
    },
    children: {
      control: "text",
      description: "Content displayed inside the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Housing",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "+12.4%",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "-5.2%",
  },
};

export const Information: Story = {
  args: {
    variant: "info",
    children: "Pending",
  },
};

export const AllVariations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {BADGE_VARIANTS.map(({ variant, label }) => (
        <Badge key={variant} variant={variant}>
          {label}
        </Badge>
      ))}
    </div>
  ),
};
