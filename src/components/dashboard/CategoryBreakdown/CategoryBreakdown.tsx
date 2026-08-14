"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLocale } from "@/contexts/LocaleContext";
import { formatCurrency } from "@/utils/formatters";
import styles from "./CategoryBreakdown.module.css";
import type { CategoryBreakdownProps } from "./CategoryBreakdown.types";

export function CategoryBreakdown({
  categories,
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
        <div className={styles.categoryList} data-testid="category-list">
          {categories.map((cat) => {
            const label = t.categories.labels[cat.category] || cat.categoryLabel || cat.category;
            const formattedAmount = `${formatCurrency(cat.totalAmount, locale)} (${cat.percentage}%)`;

            return (
              <div
                key={cat.category}
                className={styles.categoryItem}
                data-testid={`category-item-${cat.category}`}
              >
                <div className={styles.categoryHeader}>
                  <span
                    data-testid={`category-label-${cat.category}`}
                    className={styles.categoryLabel}
                  >
                    {label}
                  </span>
                  <span
                    data-testid={`category-amount-${cat.category}`}
                    className={styles.categoryAmount}
                  >
                    {formattedAmount}
                  </span>
                </div>

                <ProgressBar
                  value={cat.percentage}
                  label={`${label}: ${cat.percentage}%`}
                  data-testid={`category-progress-${cat.category}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
