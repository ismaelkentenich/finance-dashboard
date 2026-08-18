"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { staggerContainerVariants, summaryCardItemVariants } from "@/motion";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { motion } from "framer-motion";
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
      numericValue: summary.currentBalance,
      formatter: (val: number) => formatCurrency(val, locale),
      value: formatCurrency(summary.currentBalance, locale),
      icon: <Wallet size={16} aria-hidden="true" />,
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
      numericValue: summary.totalIncome,
      formatter: (val: number) => formatCurrency(val, locale),
      value: formatCurrency(summary.totalIncome, locale),
      icon: <TrendingUp size={16} aria-hidden="true" />,
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
      numericValue: summary.totalExpenses,
      formatter: (val: number) => formatCurrency(val, locale),
      value: formatCurrency(summary.totalExpenses, locale),
      icon: <TrendingDown size={16} aria-hidden="true" />,
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
      numericValue: summary.savingsRate,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      value: `${summary.savingsRate}%`,
      icon: <PiggyBank size={16} aria-hidden="true" />,
      iconVariant: "savings" as const,
      footerText: t.summary.ofTotalIncome,
    },
  ];

  return (
    <motion.section
      data-testid={testId}
      className={styles.gridContainer}
      aria-label={t.summary.cardsLabel}
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      {cardsData.map((card) => (
        <SummaryCard
          key={card.id}
          data-testid={`summary-card-${card.id}`}
          title={card.title}
          value={card.value}
          numericValue={card.numericValue}
          formatter={card.formatter}
          icon={card.icon}
          iconVariant={card.iconVariant}
          badge={card.badge}
          footerText={card.footerText}
          variants={summaryCardItemVariants}
        />
      ))}
    </motion.section>
  );
}
