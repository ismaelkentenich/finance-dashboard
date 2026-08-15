"use client";

import { Card } from "@/components/ui/Card";
import { AreaChart, BarChart, PieChart } from "@/components/ui/Charts";
import { Select } from "@/components/ui/Select";
import { useLocale } from "@/contexts/LocaleContext";
import type { ChartMetric, ChartPreferences, ChartType } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { useMemo, useState } from "react";
import { CATEGORY_COLORS } from "./FinancialChart.constants";
import {
  buildCategoryChartData,
  buildTimeSeriesData,
  getMetricOptions,
  getTypeOptions,
} from "./FinancialChart.helpers";
import styles from "./FinancialChart.module.css";
import type { FinancialChartProps } from "./FinancialChart.types";

export function FinancialChart({
  transactions,
  categories,
  className = "",
  "data-testid": testId = "financial-chart-container",
}: FinancialChartProps) {
  const { t, locale } = useLocale();

  const [preferences, setPreferences] = useState<ChartPreferences>({
    chartType: "bar",
    metric: "income_vs_expense",
    showGrid: true,
  });

  const timeSeriesData = useMemo(
    () => buildTimeSeriesData(transactions, locale),
    [transactions, locale]
  );

  const categoryData = useMemo(() => {
    const rawData = buildCategoryChartData(categories, t);
    return rawData.map((item, index) => ({
      ...item,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [categories, t]);

  const typeOptions = useMemo(() => getTypeOptions(t, preferences.metric), [t, preferences.metric]);
  const metricOptions = useMemo(() => getMetricOptions(t), [t]);

  const handleMetricChange = (metric: ChartMetric) => {
    const defaultType: ChartType = metric === "category_breakdown" ? "pie" : "bar";
    setPreferences((prev) => ({ ...prev, metric, chartType: defaultType }));
  };

  const handleTypeChange = (chartType: ChartType) => {
    setPreferences((prev) => ({ ...prev, chartType }));
  };

  const hasData =
    preferences.metric === "category_breakdown"
      ? categoryData.length > 0
      : timeSeriesData.length > 0;

  const valueFormatter = (value: unknown): string => {
    if (typeof value === "number") return formatCurrency(value, locale);
    if (typeof value === "string" && !isNaN(Number(value))) {
      return formatCurrency(Number(value), locale);
    }
    return String(value ?? "");
  };

  return (
    <Card data-testid={testId} className={`${styles.card} ${className}`.trim()}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.charts.title}</h2>

        <div className={styles.controls}>
          <div className={styles.selectWrapper}>
            <Select
              options={metricOptions}
              value={preferences.metric}
              onChange={(e) => handleMetricChange(e.target.value as ChartMetric)}
              aria-label={t.charts.metricLabel}
              data-testid="chart-metric-select"
            />
          </div>

          <div className={styles.selectWrapper}>
            <Select
              options={typeOptions}
              value={preferences.chartType}
              onChange={(e) => handleTypeChange(e.target.value as ChartType)}
              aria-label={t.charts.typeLabel}
              data-testid="chart-type-select"
            />
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {!hasData ? (
          <div data-testid="chart-empty-state" className={styles.emptyState}>
            {t.charts.empty}
          </div>
        ) : preferences.metric === "category_breakdown" ? (
          preferences.chartType === "pie" ? (
            <PieChart
              data={categoryData}
              valueFormatter={valueFormatter}
              data-testid="financial-pie-chart"
            />
          ) : (
            <BarChart
              data={categoryData}
              layout="vertical"
              xAxisKey="name"
              series={[
                {
                  dataKey: "value",
                  name: t.charts.expense,
                  color: "var(--color-primary-green-100)",
                },
              ]}
              valueFormatter={valueFormatter}
              data-testid="financial-bar-chart"
            />
          )
        ) : preferences.metric === "income_vs_expense" ? (
          preferences.chartType === "bar" ? (
            <BarChart
              data={timeSeriesData}
              xAxisKey="label"
              series={[
                {
                  dataKey: "income",
                  name: t.charts.income,
                  color: "var(--color-primary-green-100)",
                },
                {
                  dataKey: "expense",
                  name: t.charts.expense,
                  color: "var(--color-status-error-200)",
                },
              ]}
              valueFormatter={valueFormatter}
              data-testid="financial-bar-chart"
            />
          ) : (
            <AreaChart
              data={timeSeriesData}
              xAxisKey="label"
              series={[
                {
                  dataKey: "income",
                  name: t.charts.income,
                  color: "var(--color-primary-green-100)",
                },
                {
                  dataKey: "expense",
                  name: t.charts.expense,
                  color: "var(--color-status-error-200)",
                },
              ]}
              valueFormatter={valueFormatter}
              data-testid="financial-area-chart"
            />
          )
        ) : (
          <AreaChart
            data={timeSeriesData}
            xAxisKey="label"
            series={[
              {
                dataKey: "balance",
                name: t.charts.balance,
                color: "var(--color-blue-200)",
              },
            ]}
            valueFormatter={valueFormatter}
            data-testid="financial-area-chart"
          />
        )}
      </div>
    </Card>
  );
}
