"use client";

import { telemetryService } from "@/services/telemetry";
import {
  DEFAULT_OVERVIEW_SETTINGS,
  DEFAULT_WIDGET_ORDER,
  type OverviewWidgetPreferences,
  type WidgetId,
} from "@/types/settings.types";
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "finflow_overview_settings";

interface SettingsContextData {
  overviewSettings: OverviewWidgetPreferences;
  updateOverviewSettings: (settings: Partial<OverviewWidgetPreferences>) => void;
  resetOverviewSettings: () => void;
  reorderWidgets: (newOrder: WidgetId[]) => void;
}

const SettingsContext = createContext<SettingsContextData | undefined>(undefined);

/**
 * Defensive logging helper for observability in development and production
 */
function reportSettingsStorageError(action: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[SettingsStorage] Failed during ${action}:`, error);
  }

  const normalizedError =
    error instanceof Error ? error : new Error(`SettingsStorage Error: ${String(error)}`);

  telemetryService.logError(normalizedError, {
    action,
    domain: "SettingsContext",
  });
}

/**
 * Parses raw JSON string from storage ensuring schema validity and complete widget list.
 */
function parseOverviewSettings(raw: string | null): OverviewWidgetPreferences {
  if (!raw) return DEFAULT_OVERVIEW_SETTINGS;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_OVERVIEW_SETTINGS;
    }

    const savedOrder: WidgetId[] = Array.isArray(parsed.widgetOrder)
      ? parsed.widgetOrder.filter((id: string): id is WidgetId =>
          DEFAULT_WIDGET_ORDER.includes(id as WidgetId)
        )
      : [];

    const missingWidgets = DEFAULT_WIDGET_ORDER.filter((id) => !savedOrder.includes(id));
    const mergedOrder =
      savedOrder.length > 0 ? [...savedOrder, ...missingWidgets] : DEFAULT_WIDGET_ORDER;

    return {
      ...DEFAULT_OVERVIEW_SETTINGS,
      ...parsed,
      widgetOrder: mergedOrder,
    };
  } catch (error) {
    reportSettingsStorageError("parseOverviewSettings", error);
    return DEFAULT_OVERVIEW_SETTINGS;
  }
}

/**
 * In-memory fallback for SSR and initial snapshot synchronization
 */
let cachedStorageValue: string | null = null;
let cachedSettings: OverviewWidgetPreferences = DEFAULT_OVERVIEW_SETTINGS;

function getClientSnapshot(): OverviewWidgetPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_OVERVIEW_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedStorageValue) {
      cachedStorageValue = raw;
      cachedSettings = parseOverviewSettings(raw);
    }
    return cachedSettings;
  } catch (error) {
    reportSettingsStorageError("getClientSnapshot", error);
    return cachedSettings ?? DEFAULT_OVERVIEW_SETTINGS;
  }
}

function getServerSnapshot(): OverviewWidgetPreferences {
  return DEFAULT_OVERVIEW_SETTINGS;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleCustomSync = () => {
    callback();
  };

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener("finflow-settings-change", handleCustomSync);

  return () => {
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener("finflow-settings-change", handleCustomSync);
  };
}

function notifySettingsChange() {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("finflow-settings-change"));
    } catch (error) {
      reportSettingsStorageError("notifySettingsChange", error);
    }
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const overviewSettings = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const persistSettings = useCallback((nextSettings: OverviewWidgetPreferences, action: string) => {
    try {
      const serialized = JSON.stringify(nextSettings);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      cachedStorageValue = serialized;
      cachedSettings = nextSettings;
    } catch (error) {
      reportSettingsStorageError(`persistSettings:${action}`, error);
      cachedSettings = nextSettings;
    } finally {
      notifySettingsChange();
    }
  }, []);

  const updateOverviewSettings = useCallback(
    (partial: Partial<OverviewWidgetPreferences>) => {
      const current = getClientSnapshot();
      const nextSettings: OverviewWidgetPreferences = { ...current, ...partial };
      persistSettings(nextSettings, "updateOverviewSettings");
    },
    [persistSettings]
  );

  const resetOverviewSettings = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      cachedStorageValue = null;
      cachedSettings = DEFAULT_OVERVIEW_SETTINGS;
    } catch (error) {
      reportSettingsStorageError("resetOverviewSettings", error);
      cachedSettings = DEFAULT_OVERVIEW_SETTINGS;
    } finally {
      notifySettingsChange();
    }
  }, []);

  const reorderWidgets = useCallback(
    (newOrder: WidgetId[]) => {
      const current = getClientSnapshot();
      const nextSettings: OverviewWidgetPreferences = { ...current, widgetOrder: newOrder };
      persistSettings(nextSettings, "reorderWidgets");
    },
    [persistSettings]
  );

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
