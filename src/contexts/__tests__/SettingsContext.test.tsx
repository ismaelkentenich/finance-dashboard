import { telemetryService } from "@/services/telemetry";
import { DEFAULT_OVERVIEW_SETTINGS } from "@/types/settings.types";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsProvider, useSettings } from "../SettingsContext";

const STORAGE_KEY = "finflow_overview_settings";

describe("SettingsContext Validation & Storage Robustness", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Corrupted or invalid data recovery", () => {
    it("returns default settings when localStorage is empty", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);
    });

    it("returns default settings when localStorage contains syntactically invalid JSON", () => {
      window.localStorage.setItem(STORAGE_KEY, "{ invalid-json: true, ");

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);
      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ action: "parseOverviewSettings" })
      );
    });

    it("returns default settings when JSON is a primitive or an array", () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(["not", "an", "object"]));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.overviewSettings).toEqual(DEFAULT_OVERVIEW_SETTINGS);
    });

    it("applies default values for keys with invalid types", () => {
      const corruptedData = {
        showSummaryCards: "invalid_string",
        showFinancialChart: 123,
        showCategoryBreakdown: null,
        showRecentTransactions: false, // Valid
        widgetOrder: "not_an_array",
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(corruptedData));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(corruptedOrder));

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.overviewSettings.widgetOrder).toEqual([
        "financialChart",
        "summaryCards",
        "categoryBreakdown",
        "recentTransactions",
      ]);
    });
  });

  describe("Persistence and valid updates", () => {
    it("persists and updates valid settings normally", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      act(() => {
        result.current.updateOverviewSettings({
          showFinancialChart: false,
        });
      });

      expect(result.current.overviewSettings.showFinancialChart).toBe(false);

      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.showFinancialChart).toBe(false);
    });

    it("reorders widgets while preserving structural integrity", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
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

      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.widgetOrder).toEqual(newOrder);
    });

    it("restores defaults when executing resetOverviewSettings", () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
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
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
