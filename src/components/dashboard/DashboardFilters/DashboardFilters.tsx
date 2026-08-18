"use client";

import { Select } from "@/components/ui/Select";
import { useLocale } from "@/contexts/LocaleContext";
import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";
import { FilterX } from "lucide-react";
import { useMemo } from "react";
import { getCategoryOptions, getPeriodOptions, getTypeOptions } from "./DashboardFilters.helpers";
import styles from "./DashboardFilters.module.css";
import type { DashboardFiltersProps } from "./DashboardFilters.types";

export function DashboardFilters({
  period,
  type,
  category,
  onPeriodChange,
  onTypeChange,
  onCategoryChange,
  onReset,
  hasActiveFilters = false,
  className = "",
  "data-testid": testId = "dashboard-filters",
}: DashboardFiltersProps) {
  const { t } = useLocale();

  const periodOptions = useMemo(() => getPeriodOptions(t), [t]);
  const typeOptions = useMemo(() => getTypeOptions(t), [t]);
  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);

  return (
    <section
      data-testid={testId}
      className={`${styles.filterContainer} ${className}`.trim()}
      aria-label={t.filters.toolbarLabel}
    >
      <div className={styles.controlsGroup}>
        {/* Period Selector */}
        <Select
          label={t.filters.periodLabel}
          options={periodOptions}
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as PeriodFilter)}
          data-testid="period-filter-select"
        />

        {/* Type Selector */}
        <Select
          label={t.filters.typeLabel}
          options={typeOptions}
          value={type}
          onChange={(e) => onTypeChange(e.target.value as "all" | TransactionType)}
          data-testid="type-filter-select"
        />

        {/* Category Selector */}
        <Select
          label={t.filters.categoryLabel}
          options={categoryOptions}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as "all" | TransactionCategory)}
          data-testid="category-filter-select"
        />
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          data-testid="reset-filters-button"
          className={styles.resetButton}
          onClick={onReset}
          aria-label={t.filters.clearFilters}
        >
          <FilterX size={16} aria-hidden="true" />
          {t.filters.clearFilters}
        </button>
      )}
    </section>
  );
}
