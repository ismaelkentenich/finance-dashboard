"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLocale } from "@/contexts/LocaleContext";
import { staggerContainerVariants, summaryCardItemVariants } from "@/motion";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import styles from "./CategoryBreakdown.module.css";
import type { CategoryBreakdownProps } from "./CategoryBreakdown.types";

export function CategoryBreakdown({
  categories,
  currency,
  className = "",
  "data-testid": testId = "category-breakdown",
}: CategoryBreakdownProps) {
  const { t, locale } = useLocale();

  return (
    <Card data-testid={testId} className={className} aria-labelledby="category-breakdown-title">
      <h2 id="category-breakdown-title" className={styles.cardTitle}>
        {t.categories.title}
      </h2>

      {categories.length === 0 ? (
        <p data-testid="empty-category-message" className={styles.emptyText}>
          {t.categories.empty}
        </p>
      ) : (
        <motion.div
          className={styles.categoryList}
          data-testid="category-list"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {categories.map((category, index) => {
            const label =
              t.categories.labels[category.category] || category.categoryLabel || category.category;

            const formattedAmount = `${formatCurrency(
              category.totalAmount,
              locale,
              currency
            )} (${category.percentage}%)`;

            const staggerDelay = index * 0.1;

            return (
              <motion.div
                key={category.category}
                className={styles.categoryItem}
                data-testid={`category-item-${category.category}`}
                variants={summaryCardItemVariants}
              >
                <div className={styles.categoryHeader}>
                  <span
                    data-testid={`category-label-${category.category}`}
                    className={styles.categoryLabel}
                  >
                    {label}
                  </span>

                  <span
                    data-testid={`category-amount-${category.category}`}
                    className={styles.categoryAmount}
                  >
                    {formattedAmount}
                  </span>
                </div>

                <ProgressBar
                  value={category.percentage}
                  label={`${label}: ${category.percentage}%`}
                  delay={staggerDelay}
                  data-testid={`category-progress-${category.category}`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
}
