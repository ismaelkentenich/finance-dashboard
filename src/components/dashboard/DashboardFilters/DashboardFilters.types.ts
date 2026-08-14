import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";

export interface DashboardFiltersProps {
  period: PeriodFilter;
  type: "all" | TransactionType;
  category: "all" | TransactionCategory;
  onPeriodChange: (period: PeriodFilter) => void;
  onTypeChange: (type: "all" | TransactionType) => void;
  onCategoryChange: (category: "all" | TransactionCategory) => void;
  onReset: () => void;
  hasActiveFilters?: boolean;
  className?: string;
  "data-testid"?: string;
}
