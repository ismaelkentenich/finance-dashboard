import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Design System/UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible toggle switch primitive for boolean settings with keyboard operation, state animations, and focus ring.",
      },
    },
  },
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Unchecked: Story = {
  args: {
    checked: false,
    "aria-label": "Toggle setting",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    "aria-label": "Toggle setting",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Receber notificações por email",
    defaultChecked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    checked: false,
    label: "Opção desabilitada",
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: "Opção desabilitada (ativa)",
  },
};

export const InteractiveControlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          label={`Estado atual: ${checked ? "Ligado" : "Desligado"}`}
        />
      </div>
    );
  },
};
