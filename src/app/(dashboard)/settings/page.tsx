"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { useSettings } from "@/contexts/SettingsContext";
import { RotateCcw } from "lucide-react";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { t } = useLocale();
  const { overviewSettings, updateOverviewSettings, resetOverviewSettings } = useSettings();

  return (
    <div className={styles.container} data-testid="settings-page">
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>{t.settings.title}</h2>
        <p className={styles.pageSubtitle}>{t.settings.subtitle}</p>
      </div>

      <Card className={styles.settingsCard}>
        <div className={styles.optionsList}>
          <label className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span className={styles.optionTitle}>{t.settings.cards.summary.title}</span>
              <span className={styles.optionDescription}>
                {t.settings.cards.summary.description}
              </span>
            </div>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={overviewSettings.showSummaryCards}
              onChange={(e) => updateOverviewSettings({ showSummaryCards: e.target.checked })}
              data-testid="toggle-summary-cards"
            />
          </label>

          <label className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span className={styles.optionTitle}>{t.settings.cards.categories.title}</span>
              <span className={styles.optionDescription}>
                {t.settings.cards.categories.description}
              </span>
            </div>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={overviewSettings.showCategoryBreakdown}
              onChange={(e) => updateOverviewSettings({ showCategoryBreakdown: e.target.checked })}
              data-testid="toggle-category-breakdown"
            />
          </label>

          <label className={styles.optionItem}>
            <div className={styles.optionInfo}>
              <span className={styles.optionTitle}>{t.settings.cards.transactions.title}</span>
              <span className={styles.optionDescription}>
                {t.settings.cards.transactions.description}
              </span>
            </div>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={overviewSettings.showRecentTransactions}
              onChange={(e) => updateOverviewSettings({ showRecentTransactions: e.target.checked })}
              data-testid="toggle-recent-transactions"
            />
          </label>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={resetOverviewSettings}
            data-testid="reset-settings-button"
          >
            <RotateCcw size={16} aria-hidden="true" />
            {t.settings.restoreDefaults}
          </Button>
        </div>
      </Card>
    </div>
  );
}
