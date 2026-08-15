export type WidgetId =
  "summaryCards" | "financialChart" | "categoryBreakdown" | "recentTransactions";

export interface OverviewWidgetPreferences {
  showSummaryCards: boolean;
  showCategoryBreakdown: boolean;
  showRecentTransactions: boolean;
  showFinancialChart: boolean;
  widgetOrder: WidgetId[];
}

export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "summaryCards",
  "financialChart",
  "categoryBreakdown",
  "recentTransactions",
];

export const DEFAULT_OVERVIEW_SETTINGS: OverviewWidgetPreferences = {
  showSummaryCards: true,
  showCategoryBreakdown: true,
  showRecentTransactions: true,
  showFinancialChart: true,
  widgetOrder: DEFAULT_WIDGET_ORDER,
};
