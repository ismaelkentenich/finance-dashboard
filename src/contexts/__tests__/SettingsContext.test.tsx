import { LocaleProvider } from "@/contexts/LocaleContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { telemetryService } from "@/services/telemetry";
import { DEFAULT_OVERVIEW_SETTINGS } from "@/types/settings.types";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const OVERVIEW_STORAGE_KEY = "finflow_overview_settings";
const CURRENCY_STORAGE_KEY = "finflow_currency_settings";

type SupportedTestLocale = "pt-BR" | "en-US";

function CurrencySettingsConsumer() {
  const { currencySettings, updateCurrencySettings, resetCurrencySettings } = useSettings();

  return (
    <div>
      <span data-testid="display-currency">{currencySettings.displayCurrency}</span>

      <button
        type="button"
        onClick={() =>
          updateCurrencySettings({
            displayCurrency: "EUR",
          })
        }
      >
        Set EUR
      </button>

      <button
        type="button"
        onClick={() =>
          updateCurrencySettings({
            displayCurrency: "GBP",
          })
        }
      >
        Set GBP
      </button>

      <button type="button" onClick={resetCurrencySettings}>
        Reset Currency
      </button>
    </div>
  );
}

function createSettingsWrapper(locale: SupportedTestLocale = "pt-BR") {
  return function SettingsTestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <LocaleProvider initialLocale={locale}>
        <SettingsProvider>{children}</SettingsProvider>
      </LocaleProvider>
    );
  };
}

const SettingsTestWrapper = createSettingsWrapper("pt-BR");

function renderCurrencySettings(locale: SupportedTestLocale = "pt-BR") {
  return render(<CurrencySettingsConsumer />, {
    wrapper: createSettingsWrapper(locale),
  });
}

describe("SettingsContext", () => {
  beforeEach(() => {
    window.localStorage.clear();

    vi.restoreAllMocks();

    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  describe("Currency Preferences", () => {
    it("defaults display currency to BRL for pt-BR", () => {
      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("BRL");
    });

    it("defaults display currency to USD for en-US", () => {
      renderCurrencySettings("en-US");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("USD");
    });

    it("updates display currency preference", async () => {
      const user = userEvent.setup();

      renderCurrencySettings("pt-BR");

      await user.click(
        screen.getByRole("button", {
          name: "Set EUR",
        })
      );

      expect(screen.getByTestId("display-currency")).toHaveTextContent("EUR");
    });

    it("persists selected display currency in localStorage", async () => {
      const user = userEvent.setup();

      renderCurrencySettings("pt-BR");

      await user.click(
        screen.getByRole("button", {
          name: "Set EUR",
        })
      );

      const storedCurrencySettings = window.localStorage.getItem(CURRENCY_STORAGE_KEY);

      expect(storedCurrencySettings).not.toBeNull();

      expect(JSON.parse(storedCurrencySettings ?? "{}")).toEqual({
        displayCurrency: "EUR",
      });
    });

    it("restores persisted currency preference independently from locale", () => {
      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "GBP",
        })
      );

      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("GBP");
    });

    it("keeps persisted currency when locale default would be different", () => {
      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "EUR",
        })
      );

      renderCurrencySettings("en-US");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("EUR");
    });

    it("falls back to locale default when persisted currency is unsupported", () => {
      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "DOGE",
        })
      );

      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("BRL");
    });

    it("falls back to USD for invalid persisted currency in en-US", () => {
      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "INVALID",
        })
      );

      renderCurrencySettings("en-US");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("USD");
    });

    it("falls back safely when currency storage contains invalid JSON", () => {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, "{invalid-json");

      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("BRL");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          action: "parseCurrencySettings",
          domain: "SettingsContext",
        })
      );
    });

    it("falls back safely when persisted currency settings are not an object", () => {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(["EUR"]));

      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("BRL");
    });

    it("resets currency preference to BRL when locale is pt-BR", async () => {
      const user = userEvent.setup();

      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "EUR",
        })
      );

      renderCurrencySettings("pt-BR");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("EUR");

      await user.click(
        screen.getByRole("button", {
          name: "Reset Currency",
        })
      );

      expect(screen.getByTestId("display-currency")).toHaveTextContent("BRL");

      expect(window.localStorage.getItem(CURRENCY_STORAGE_KEY)).toBeNull();
    });

    it("resets currency preference to USD when locale is en-US", async () => {
      const user = userEvent.setup();

      window.localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify({
          displayCurrency: "EUR",
        })
      );

      renderCurrencySettings("en-US");

      expect(screen.getByTestId("display-currency")).toHaveTextContent("EUR");

      await user.click(
        screen.getByRole("button", {
          name: "Reset Currency",
        })
      );

      expect(screen.getByTestId("display-currency")).toHaveTextContent("USD");

      expect(window.localStorage.getItem(CURRENCY_STORAGE_KEY)).toBeNull();
    });
  });

  describe("Corrupted or invalid overview data recovery", () => {
    it("returns default settings when localStorage is empty", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);
    });

    it("returns default settings when localStorage contains syntactically invalid JSON", () => {
      window.localStorage.setItem(OVERVIEW_STORAGE_KEY, "{ invalid-json: true, ");

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          action: "parseOverviewSettings",
          domain: "SettingsContext",
        })
      );
    });

    it("returns default settings when JSON is a primitive or an array", () => {
      window.localStorage.setItem(OVERVIEW_STORAGE_KEY, JSON.stringify(["not", "an", "object"]));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);
    });

    it("applies default values for keys with invalid types", () => {
      const corruptedData = {
        showSummaryCards: "invalid_string",
        showFinancialChart: 123,
        showCategoryBreakdown: null,
        showRecentTransactions: false,
        widgetOrder: "not_an_array",
      };

      window.localStorage.setItem(OVERVIEW_STORAGE_KEY, JSON.stringify(corruptedData));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      expect(result.current.overviewSettings.showSummaryCards).toBe(
        DEFAULT_OVERVIEW_SETTINGS.showSummaryCards
      );

      expect(result.current.overviewSettings.showFinancialChart).toBe(
        DEFAULT_OVERVIEW_SETTINGS.showFinancialChart
      );

      expect(result.current.overviewSettings.showCategoryBreakdown).toBe(
        DEFAULT_OVERVIEW_SETTINGS.showCategoryBreakdown
      );

      expect(result.current.overviewSettings.showRecentTransactions).toBe(false);

      expect(result.current.overviewSettings.widgetOrder).toEqual(
        DEFAULT_OVERVIEW_SETTINGS.widgetOrder
      );
    });

    it("sanitizes widgetOrder by removing non-existent IDs, duplicates, and filling in missing ones", () => {
      const corruptedOrder = {
        widgetOrder: ["unknownWidget", "financialChart", "financialChart", "invalidWidget2"],
      };

      window.localStorage.setItem(OVERVIEW_STORAGE_KEY, JSON.stringify(corruptedOrder));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      expect(result.current.overviewSettings.widgetOrder).toEqual([
        "financialChart",
        "summaryCards",
        "categoryBreakdown",
        "recentTransactions",
      ]);
    });
  });

  describe("Persistence and valid overview updates", () => {
    it("persists and updates valid settings normally", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      act(() => {
        result.current.updateOverviewSettings({
          showFinancialChart: false,
        });
      });

      expect(result.current.overviewSettings.showFinancialChart).toBe(false);

      const stored = JSON.parse(window.localStorage.getItem(OVERVIEW_STORAGE_KEY) ?? "{}");

      expect(stored.showFinancialChart).toBe(false);
    });

    it("reorders widgets while preserving structural integrity", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      const newOrder = [
        "recentTransactions",
        "categoryBreakdown",
        "financialChart",
        "summaryCards",
      ] as const;

      act(() => {
        result.current.reorderWidgets([...newOrder]);
      });

      expect(result.current.overviewSettings.widgetOrder).toEqual(newOrder);

      const stored = JSON.parse(window.localStorage.getItem(OVERVIEW_STORAGE_KEY) ?? "{}");

      expect(stored.widgetOrder).toEqual(newOrder);
    });

    it("restores defaults when executing resetOverviewSettings", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsTestWrapper,
      });

      act(() => {
        result.current.updateOverviewSettings({
          showSummaryCards: false,
        });
      });

      expect(result.current.overviewSettings.showSummaryCards).toBe(false);

      act(() => {
        result.current.resetOverviewSettings();
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);

      expect(window.localStorage.getItem(OVERVIEW_STORAGE_KEY)).toBeNull();
    });
  });
});
