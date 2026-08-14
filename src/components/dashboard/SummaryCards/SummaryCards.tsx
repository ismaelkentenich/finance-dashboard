"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { SummaryCard } from "../SummaryCard";
import styles from "./SummaryCards.module.css";
import type { SummaryCardsProps } from "./SummaryCards.types";

export function SummaryCards({
  summary,
  "data-testid": testId = "summary-cards-grid",
}: SummaryCardsProps) {
  const { t, locale } = useLocale();

  const formatVariationAriaLabel = (variation: number) => {
    const formatted = formatPercentage(variation);
    const template =
      variation >= 0 ? t.summary.increaseVsPreviousMonth : t.summary.decreaseVsPreviousMonth;
    return template.replace("{value}", formatted);
  };

  const cardsData = [
    {
      id: "balance",
      title: t.summary.balance,
      value: formatCurrency(summary.currentBalance, locale),
      icon: Wallet,
      iconVariant: "balance" as const,
      badge: {
        variant:
          summary.periodComparison.balanceVariation >= 0
            ? ("success" as const)
            : ("danger" as const),
        text: formatPercentage(summary.periodComparison.balanceVariation),
        ariaLabel: formatVariationAriaLabel(summary.periodComparison.balanceVariation),
      },
      footerText: t.summary.vsPreviousMonth,
    },
    {
      id: "income",
      title: t.summary.income,
      value: formatCurrency(summary.totalIncome, locale),
      icon: TrendingUp,
      iconVariant: "income" as const,
      badge: {
        variant:
          summary.periodComparison.incomeVariation >= 0
            ? ("success" as const)
            : ("danger" as const),
        text: formatPercentage(summary.periodComparison.incomeVariation),
        ariaLabel: formatVariationAriaLabel(summary.periodComparison.incomeVariation),
      },
      footerText: t.summary.vsPreviousMonth,
    },
    {
      id: "expenses",
      title: t.summary.expenses,
      value: formatCurrency(summary.totalExpenses, locale),
      icon: TrendingDown,
      iconVariant: "expense" as const,
      badge: {
        variant:
          summary.periodComparison.expensesVariation <= 0
            ? ("success" as const)
            : ("danger" as const),
        text: formatPercentage(summary.periodComparison.expensesVariation),
        ariaLabel: formatVariationAriaLabel(summary.periodComparison.expensesVariation),
      },
      footerText: t.summary.vsPreviousMonth,
    },
    {
      id: "savings",
      title: t.summary.savingsRate,
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      iconVariant: "savings" as const,
      footerText: t.summary.ofTotalIncome,
    },
  ];

  return (
    <section
      data-testid={testId}
      className={styles.gridContainer}
      aria-label="Financial Summary Cards"
    >
      {cardsData.map((card) => (
        <SummaryCard
          key={card.id}
          data-testid={`summary-card-${card.id}`}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconVariant={card.iconVariant}
          badge={card.badge}
          footerText={card.footerText}
        />
      ))}
    </section>
  );
}
