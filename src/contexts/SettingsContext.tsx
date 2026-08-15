"use client";

import {
  DEFAULT_OVERVIEW_SETTINGS,
  DEFAULT_WIDGET_ORDER,
  type OverviewWidgetPreferences,
  type WidgetId,
} from "@/types/settings.types";
import { createContext, useContext, useState, type ReactNode } from "react";

const STORAGE_KEY = "finflow_overview_settings";

interface SettingsContextData {
  overviewSettings: OverviewWidgetPreferences;
  updateOverviewSettings: (settings: Partial<OverviewWidgetPreferences>) => void;
  resetOverviewSettings: () => void;
  reorderWidgets: (newOrder: WidgetId[]) => void;
}

const SettingsContext = createContext<SettingsContextData | undefined>(undefined);

function getPersistedSettings(): OverviewWidgetPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_OVERVIEW_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_OVERVIEW_SETTINGS,
        ...parsed,
        widgetOrder: parsed.widgetOrder || DEFAULT_WIDGET_ORDER,
      };
    }
  } catch {
    // Silent fallback
  }

  return DEFAULT_OVERVIEW_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [overviewSettings, setOverviewSettings] =
    useState<OverviewWidgetPreferences>(getPersistedSettings);

  const updateOverviewSettings = (partial: Partial<OverviewWidgetPreferences>) => {
    setOverviewSettings((prev) => {
      const updated = { ...prev, ...partial };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetOverviewSettings = () => {
    setOverviewSettings(DEFAULT_OVERVIEW_SETTINGS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const reorderWidgets = (newOrder: WidgetId[]) => {
    setOverviewSettings((prev) => {
      const updated = { ...prev, widgetOrder: newOrder };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        overviewSettings,
        updateOverviewSettings,
        resetOverviewSettings,
        reorderWidgets,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
