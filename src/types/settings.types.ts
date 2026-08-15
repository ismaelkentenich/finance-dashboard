export interface OverviewWidgetPreferences {
  showSummaryCards: boolean;
  showCategoryBreakdown: boolean;
  showRecentTransactions: boolean;
}

export const DEFAULT_OVERVIEW_SETTINGS: OverviewWidgetPreferences = {
  showSummaryCards: true,
  showCategoryBreakdown: true,
  showRecentTransactions: true,
};
