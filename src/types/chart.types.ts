import type { TransactionCategory } from "./transaction.types";

export type ChartType = "bar" | "area" | "pie";
export type ChartMetric = "income_vs_expense" | "balance_trend" | "category_breakdown";

export interface ChartPreferences {
  chartType: ChartType;
  metric: ChartMetric;
  showGrid: boolean;
}

export type TimeSeriesPoint = {
  date: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
  [key: string]: unknown;
};

export type CategoryChartPoint = {
  category: TransactionCategory;
  name: string;
  value: number;
  percentage: number;
  fill?: string;
  [key: string]: unknown;
};
