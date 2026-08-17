"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { useLocale } from "@/contexts/LocaleContext";
import { useSettings } from "@/contexts/SettingsContext";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { t } = useLocale();
  const { overviewSettings, updateOverviewSettings, resetOverviewSettings } = useSettings();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetSettings = () => {
    setIsResetting(true);
    resetOverviewSettings();
    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  return (
    <div className={styles.container} data-testid="settings-page">
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>{t.settings.title}</h2>
        <p className={styles.pageSubtitle}>{t.settings.subtitle}</p>
      </div>

      <Card className={styles.settingsCard}>
        <div className={styles.optionsList}>
          {/* Summary Cards */}
          <div className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span id="summary-cards-title" className={styles.optionTitle}>
                {t.settings.cards.summary.title}
              </span>
              <span className={styles.optionDescription}>
                {t.settings.cards.summary.description}
              </span>
            </div>
            <Switch
              checked={overviewSettings.showSummaryCards}
              onCheckedChange={(checked) => updateOverviewSettings({ showSummaryCards: checked })}
              aria-labelledby="summary-cards-title"
              data-testid="toggle-summary-cards"
            />
          </div>

          {/* Financial Chart Toggle */}
          <div className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span id="financial-chart-title" className={styles.optionTitle}>
                {t.settings.cards.chart.title}
              </span>
              <span className={styles.optionDescription}>{t.settings.cards.chart.description}</span>
            </div>
            <Switch
              checked={overviewSettings.showFinancialChart}
              onCheckedChange={(checked) => updateOverviewSettings({ showFinancialChart: checked })}
              aria-labelledby="financial-chart-title"
              data-testid="toggle-financial-chart"
            />
          </div>

          {/* Category Breakdown */}
          <div className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span id="category-breakdown-title" className={styles.optionTitle}>
                {t.settings.cards.categories.title}
              </span>
              <span className={styles.optionDescription}>
                {t.settings.cards.categories.description}
              </span>
            </div>
            <Switch
              checked={overviewSettings.showCategoryBreakdown}
              onCheckedChange={(checked) =>
                updateOverviewSettings({ showCategoryBreakdown: checked })
              }
              aria-labelledby="category-breakdown-title"
              data-testid="toggle-category-breakdown"
            />
          </div>

          {/* Recent Transactions */}
          <div className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span id="recent-transactions-title" className={styles.optionTitle}>
                {t.settings.cards.transactions.title}
              </span>
              <span className={styles.optionDescription}>
                {t.settings.cards.transactions.description}
              </span>
            </div>
            <Switch
              checked={overviewSettings.showRecentTransactions}
              onCheckedChange={(checked) =>
                updateOverviewSettings({ showRecentTransactions: checked })
              }
              aria-labelledby="recent-transactions-title"
              data-testid="toggle-recent-transactions"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetSettings}
            data-testid="reset-settings-button"
          >
            <RotateCcw
              size={16}
              aria-hidden="true"
              className={isResetting ? styles.resetIconAnimated : undefined}
              data-testid="reset-settings-icon"
            />
            {t.settings.restoreDefaults}
          </Button>
        </div>
      </Card>
    </div>
  );
}
