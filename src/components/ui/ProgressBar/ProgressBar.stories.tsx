import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Design System/UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current progress value",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "info"],
      description: "Color variation of the progress fill",
    },
    label: {
      control: "text",
      description: "Accessible aria-label description",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 65,
    label: "Housing expense: 65%",
  },
};

export const SuccessVariant: Story = {
  args: {
    value: 85,
    variant: "success",
    label: "Savings goal: 85%",
  },
};

export const DangerVariant: Story = {
  args: {
    value: 95,
    variant: "danger",
    label: "Credit limit used: 95%",
  },
};
