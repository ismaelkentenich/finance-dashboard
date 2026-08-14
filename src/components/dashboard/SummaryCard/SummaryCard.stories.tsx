import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { SummaryCard } from "./SummaryCard";

const meta: Meta<typeof SummaryCard> = {
  title: "Features/Dashboard/SummaryCard",
  component: SummaryCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

export const BalanceCard: Story = {
  args: {
    title: "Saldo Atual",
    value: "R$ 7.001,80",
    icon: Wallet,
    iconVariant: "balance",
    badge: { text: "+12.5%", variant: "success" },
    footerText: "vs mês anterior",
  },
};

export const IncomeCard: Story = {
  args: {
    title: "Receitas Totais",
    value: "R$ 10.300,00",
    icon: TrendingUp,
    iconVariant: "income",
    badge: { text: "+5.0%", variant: "success" },
    footerText: "vs mês anterior",
  },
};

export const ExpenseCard: Story = {
  args: {
    title: "Despesas Totais",
    value: "R$ 3.298,20",
    icon: TrendingDown,
    iconVariant: "expense",
    badge: { text: "-8.2%", variant: "success" },
    footerText: "vs mês anterior",
  },
};

export const SavingsRateCardWithoutBadge: Story = {
  args: {
    title: "Taxa de Poupança",
    value: "68.0%",
    icon: PiggyBank,
    iconVariant: "savings",
    footerText: "Do total de receitas no mês",
  },
};
