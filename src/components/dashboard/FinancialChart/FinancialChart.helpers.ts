import type { SelectOption } from "@/components/ui/Select";
import type { TranslationSchema } from "@/locales/types";
import type {
  CategoryChartPoint,
  CategorySummary,
  ChartMetric,
  TimeSeriesPoint,
  Transaction,
} from "@/types";
import { formatDate } from "@/utils/formatters";

export function getTypeOptions(t: TranslationSchema, metric: ChartMetric): SelectOption[] {
  if (metric === "category_breakdown") {
    return [
      { value: "pie", label: t.charts.types.pie },
      { value: "bar", label: t.charts.types.bar },
    ];
  }
  return [
    { value: "bar", label: t.charts.types.bar },
    { value: "area", label: t.charts.types.area },
  ];
}

export function getMetricOptions(t: TranslationSchema): SelectOption[] {
  return [
    { value: "income_vs_expense", label: t.charts.metrics.income_vs_expense },
    { value: "balance_trend", label: t.charts.metrics.balance_trend },
    { value: "category_breakdown", label: t.charts.metrics.category_breakdown },
  ];
}

export function buildTimeSeriesData(
  transactions: Transaction[],
  locale: "pt-BR" | "en-US"
): TimeSeriesPoint[] {
  const map = new Map<string, { income: number; expense: number }>();

  // Sort transactions chronologically
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((tx) => {
    const current = map.get(tx.date) || { income: 0, expense: 0 };
    if (tx.type === "income") {
      current.income += tx.amount;
    } else {
      current.expense += tx.amount;
    }
    map.set(tx.date, current);
  });

  let runningBalance = 0;
  return Array.from(map.entries()).map(([date, values]) => {
    runningBalance += values.income - values.expense;
    return {
      date,
      label: formatDate(date, locale),
      income: values.income,
      expense: values.expense,
      balance: runningBalance,
    };
  });
}

export function buildCategoryChartData(
  categories: CategorySummary[],
  t: TranslationSchema
): CategoryChartPoint[] {
  return categories.map((cat) => ({
    category: cat.category,
    name: t.categories.labels[cat.category] || cat.categoryLabel || cat.category,
    value: cat.totalAmount,
    percentage: cat.percentage,
  }));
}
