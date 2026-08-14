import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Select } from "./Select";

const sampleOptions = [
  { value: "current-month", label: "Mês Atual" },
  { value: "previous-month", label: "Mês Anterior" },
  { value: "last-3-months", label: "Últimos 3 Meses" },
  { value: "custom", label: "Personalizado", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Design System/UI/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Período",
    options: sampleOptions,
    defaultValue: "current-month",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Filtrar por Tipo",
    options: [
      { value: "all", label: "Todos os Tipos" },
      { value: "income", label: "Receitas" },
      { value: "expense", label: "Despesas" },
    ],
    helperText: "Selecione o tipo de movimentação financeira.",
  },
};

export const WithError: Story = {
  args: {
    label: "Categoria",
    options: sampleOptions,
    error: "Campo obrigatório.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Conta Bancária",
    options: sampleOptions,
    disabled: true,
  },
};
