"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { CURRENCY_LABELS, SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { useLocale } from "@/contexts/LocaleContext";
import { useSettings } from "@/contexts/SettingsContext";
import { isSupportedCurrency } from "@/utils/currency";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { t, locale } = useLocale();

  const {
    overviewSettings,
    currencySettings,
    updateOverviewSettings,
    updateCurrencySettings,
    resetOverviewSettings,
    resetCurrencySettings,
  } = useSettings();

  const [isResetting, setIsResetting] = useState(false);

  const currencyOptions = useMemo(
    () =>
      SUPPORTED_CURRENCIES.map((currency) => ({
        value: currency,
        label: `${currency} — ${CURRENCY_LABELS[currency][locale]}`,
      })),
    [locale]
  );

  const handleResetSettings = () => {
    setIsResetting(true);

    resetOverviewSettings();
    resetCurrencySettings();

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
        <section className={styles.settingsSection} aria-labelledby="currency-settings-title">
          <div className={styles.sectionHeader}>
            <h3 id="currency-settings-title" className={styles.sectionTitle}>
              {t.settings.currency.title}
            </h3>

            <p className={styles.sectionDescription}>{t.settings.currency.description}</p>
          </div>

          <div className={styles.currencyField}>
            <Select
              label={t.settings.currency.displayCurrency}
              options={currencyOptions}
              value={currencySettings.displayCurrency}
              onChange={(event) => {
                const currency = event.target.value;

                if (isSupportedCurrency(currency)) {
                  updateCurrencySettings({
                    displayCurrency: currency,
                  });
                }
              }}
              data-testid="display-currency-select"
              fullWidth
            />
          </div>
        </section>

        <section className={styles.widgetsSection}>
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
                <span className={styles.optionDescription}>
                  {t.settings.cards.chart.description}
                </span>
              </div>
              <Switch
                checked={overviewSettings.showFinancialChart}
                onCheckedChange={(checked) =>
                  updateOverviewSettings({ showFinancialChart: checked })
                }
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
        </section>

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
