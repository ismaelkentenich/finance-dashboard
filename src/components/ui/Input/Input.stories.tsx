import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Design System/UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Descrição da Transação",
    placeholder: "Ex: Compras no Supermercado",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Valor",
    placeholder: "0.00",
    type: "number",
    helperText: "Insira o valor em Reais (BRL).",
  },
};

export const WithError: Story = {
  args: {
    label: "Data",
    type: "date",
    error: "Formato de data inválido.",
    defaultValue: "2026-08-14",
  },
};

export const Disabled: Story = {
  args: {
    label: "Conta de Origem",
    value: "Conta Corrente Principal",
    disabled: true,
  },
};
