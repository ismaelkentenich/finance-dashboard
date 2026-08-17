import { LocaleProvider } from "@/contexts/LocaleContext";
import { MotionProvider } from "@/providers/MotionProvider";
import { mockCategories, mockTransactions } from "@/test/utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FinancialChart } from "../FinancialChart";

function renderFinancialChart(props = {}) {
  const defaultProps = {
    transactions: mockTransactions,
    categories: mockCategories,
    ...props,
  };

  return render(
    <MotionProvider>
      <LocaleProvider>
        <FinancialChart {...defaultProps} />
      </LocaleProvider>
    </MotionProvider>
  );
}

describe("FinancialChart Feature Component", () => {
  describe("header and accessibility", () => {
    it("renders localized title and select filters", () => {
      renderFinancialChart();

      expect(
        screen.getByRole("heading", { level: 2, name: "Análise Gráfica" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("chart-metric-select")).toBeInTheDocument();
      expect(screen.getByTestId("chart-type-select")).toBeInTheDocument();
    });
  });

  describe("empty state presentation", () => {
    it("displays localized empty state message when datasets are empty", () => {
      renderFinancialChart({ transactions: [], categories: [] });

      expect(screen.getByTestId("chart-empty-state")).toBeInTheDocument();
      expect(
        screen.getByText("Sem dados suficientes para gerar o gráfico no período selecionado.")
      ).toBeInTheDocument();
    });
  });

  describe("metric and chart switching with animated transitions", () => {
    it("renders animated motion wrapper around active chart", () => {
      renderFinancialChart();

      expect(screen.getByTestId("financial-chart-animated-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("financial-bar-chart")).toBeInTheDocument();
    });

    it("switches to Pie chart when category breakdown metric is selected", async () => {
      const user = userEvent.setup();
      renderFinancialChart();

      const metricSelect = screen.getByTestId("chart-metric-select");
      await user.selectOptions(metricSelect, "category_breakdown");

      expect(await screen.findByTestId("financial-pie-chart")).toBeInTheDocument();
      expect(screen.getByTestId("financial-chart-animated-wrapper")).toBeInTheDocument();
    });

    it("switches smoothly between bar and area visualizations on type change", async () => {
      const user = userEvent.setup();
      renderFinancialChart();

      expect(screen.getByTestId("financial-bar-chart")).toBeInTheDocument();

      const typeSelect = screen.getByTestId("chart-type-select");
      await user.selectOptions(typeSelect, "area");

      expect(await screen.findByTestId("financial-area-chart")).toBeInTheDocument();
      expect(screen.getByTestId("financial-chart-animated-wrapper")).toBeInTheDocument();
    });

    it("renders balance trend in BarChart by default and switches to AreaChart when selected", async () => {
      const user = userEvent.setup();
      renderFinancialChart();

      const metricSelect = screen.getByTestId("chart-metric-select");
      await user.selectOptions(metricSelect, "balance_trend");

      expect(await screen.findByTestId("financial-bar-chart")).toBeInTheDocument();

      const typeSelect = screen.getByTestId("chart-type-select");
      await user.selectOptions(typeSelect, "area");

      expect(await screen.findByTestId("financial-area-chart")).toBeInTheDocument();
    });

    it("keeps select controls active and fully accessible during chart type change", async () => {
      const user = userEvent.setup();
      renderFinancialChart();

      const metricSelect = screen.getByTestId("chart-metric-select");
      const typeSelect = screen.getByTestId("chart-type-select");

      expect(metricSelect).not.toBeDisabled();
      expect(typeSelect).not.toBeDisabled();

      await user.selectOptions(typeSelect, "area");

      await waitFor(() => {
        expect(typeSelect).toHaveFocus();
      });
    });
  });
});
