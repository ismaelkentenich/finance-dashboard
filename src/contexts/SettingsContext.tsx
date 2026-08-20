"use client";

import { DEFAULT_CURRENCY_BY_LOCALE } from "@/constants/currency.constants";
import { useLocale } from "@/contexts/LocaleContext";
import { telemetryService } from "@/services/telemetry";
import {
  DEFAULT_OVERVIEW_SETTINGS,
  DEFAULT_WIDGET_ORDER,
  type CurrencyPreferences,
  type OverviewWidgetPreferences,
  type WidgetId,
} from "@/types/settings.types";
import { isSupportedCurrency } from "@/utils/currency";
import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const OVERVIEW_STORAGE_KEY = "finflow_overview_settings";
const CURRENCY_STORAGE_KEY = "finflow_currency_settings";

interface SettingsContextData {
  overviewSettings: OverviewWidgetPreferences;
  currencySettings: CurrencyPreferences;

  updateOverviewSettings: (settings: Partial<OverviewWidgetPreferences>) => void;

  updateCurrencySettings: (settings: Partial<CurrencyPreferences>) => void;

  resetOverviewSettings: () => void;
  resetCurrencySettings: () => void;

  reorderWidgets: (newOrder: WidgetId[]) => void;
}

const SettingsContext = createContext<SettingsContextData | undefined>(undefined);

/**
 * Defensive logging helper for observability
 * in development and production.
 */
function reportSettingsStorageError(action: string, error: unknown): void {
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
 * Determines whether an unknown value represents
 * one of the dashboard widget identifiers.
 */
function isValidWidgetId(id: unknown): id is WidgetId {
  return typeof id === "string" && DEFAULT_WIDGET_ORDER.includes(id as WidgetId);
}

/**
 * Sanitizes the persisted widget order.
 *
 * - Removes invalid values.
 * - Removes duplicated widget IDs.
 * - Reintroduces missing widgets.
 */
function sanitizeWidgetOrder(rawOrder: unknown): WidgetId[] {
  if (!Array.isArray(rawOrder)) {
    return [...DEFAULT_WIDGET_ORDER];
  }

  const validUniqueWidgets = Array.from(new Set(rawOrder.filter(isValidWidgetId)));

  const missingWidgets = DEFAULT_WIDGET_ORDER.filter((id) => !validUniqueWidgets.includes(id));

  return [...validUniqueWidgets, ...missingWidgets];
}

/**
 * Parses overview preferences stored in localStorage.
 *
 * Invalid or incomplete values are replaced individually
 * with their corresponding defaults.
 */
function parseOverviewSettings(raw: string | null): OverviewWidgetPreferences {
  if (!raw) {
    return DEFAULT_OVERVIEW_SETTINGS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return DEFAULT_OVERVIEW_SETTINGS;
    }

    const candidate = parsed as Record<string, unknown>;

    const showSummaryCards =
      typeof candidate.showSummaryCards === "boolean"
        ? candidate.showSummaryCards
        : DEFAULT_OVERVIEW_SETTINGS.showSummaryCards;

    const showFinancialChart =
      typeof candidate.showFinancialChart === "boolean"
        ? candidate.showFinancialChart
        : DEFAULT_OVERVIEW_SETTINGS.showFinancialChart;

    const showCategoryBreakdown =
      typeof candidate.showCategoryBreakdown === "boolean"
        ? candidate.showCategoryBreakdown
        : DEFAULT_OVERVIEW_SETTINGS.showCategoryBreakdown;

    const showRecentTransactions =
      typeof candidate.showRecentTransactions === "boolean"
        ? candidate.showRecentTransactions
        : DEFAULT_OVERVIEW_SETTINGS.showRecentTransactions;

    const widgetOrder = sanitizeWidgetOrder(candidate.widgetOrder);

    return {
      showSummaryCards,
      showFinancialChart,
      showCategoryBreakdown,
      showRecentTransactions,
      widgetOrder,
    };
  } catch (error) {
    reportSettingsStorageError("parseOverviewSettings", error);

    return DEFAULT_OVERVIEW_SETTINGS;
  }
}

/**
 * Returns the initial currency preference for
 * the current application locale.
 *
 * Locale only defines the default. Once the user
 * explicitly persists another currency, that preference
 * takes precedence over the locale.
 */
const DEFAULT_CURRENCY_SETTINGS_BY_LOCALE: Record<"pt-BR" | "en-US", CurrencyPreferences> = {
  "pt-BR": {
    displayCurrency: DEFAULT_CURRENCY_BY_LOCALE["pt-BR"],
  },
  "en-US": {
    displayCurrency: DEFAULT_CURRENCY_BY_LOCALE["en-US"],
  },
};

function getDefaultCurrencySettings(locale: "pt-BR" | "en-US"): CurrencyPreferences {
  return DEFAULT_CURRENCY_SETTINGS_BY_LOCALE[locale];
}

/**
 * Parses persisted currency preferences safely.
 */
function parseCurrencySettings(raw: string | null, locale: "pt-BR" | "en-US"): CurrencyPreferences {
  const defaults = getDefaultCurrencySettings(locale);

  if (!raw) {
    return defaults;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return defaults;
    }

    const candidate = parsed as Record<string, unknown>;

    return {
      displayCurrency: isSupportedCurrency(candidate.displayCurrency)
        ? candidate.displayCurrency
        : defaults.displayCurrency,
    };
  } catch (error) {
    reportSettingsStorageError("parseCurrencySettings", error);

    return defaults;
  }
}

/**
 * Overview settings cache.
 *
 * useSyncExternalStore requires stable snapshots.
 * Returning freshly-created objects every time would cause
 * unnecessary render loops.
 */
let cachedOverviewStorageValue: string | null = null;

let cachedOverviewSettings: OverviewWidgetPreferences = DEFAULT_OVERVIEW_SETTINGS;

/**
 * Currency settings cache.
 *
 * Currency defaults depend on locale, so each supported
 * locale maintains its own cached default snapshot.
 */
let cachedCurrencyStorageValue: string | null = null;

let cachedCurrencyLocale: "pt-BR" | "en-US" | null = null;

let cachedCurrencySettings: CurrencyPreferences = DEFAULT_CURRENCY_SETTINGS_BY_LOCALE["pt-BR"];
/**
 * Returns the browser snapshot for dashboard overview
 * settings.
 */
function getOverviewClientSnapshot(): OverviewWidgetPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_OVERVIEW_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(OVERVIEW_STORAGE_KEY);

    if (raw !== cachedOverviewStorageValue) {
      cachedOverviewStorageValue = raw;

      cachedOverviewSettings = parseOverviewSettings(raw);
    }

    return cachedOverviewSettings;
  } catch (error) {
    reportSettingsStorageError("getOverviewClientSnapshot", error);

    return cachedOverviewSettings;
  }
}

/**
 * Stable SSR snapshot for overview settings.
 */
function getOverviewServerSnapshot(): OverviewWidgetPreferences {
  return DEFAULT_OVERVIEW_SETTINGS;
}

/**
 * Subscribes SettingsContext consumers to:
 *
 * - cross-tab storage events;
 * - changes performed by this application instance.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === OVERVIEW_STORAGE_KEY || event.key === CURRENCY_STORAGE_KEY) {
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

/**
 * Notifies subscribers when the current browser tab
 * changes a setting.
 *
 * Native storage events only fire in other documents,
 * so a custom event is needed for the current tab.
 */
function notifySettingsChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.dispatchEvent(new Event("finflow-settings-change"));
  } catch (error) {
    reportSettingsStorageError("notifySettingsChange", error);
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();

  /**
   * Dashboard overview preferences.
   */
  const overviewSettings = useSyncExternalStore(
    subscribe,
    getOverviewClientSnapshot,
    getOverviewServerSnapshot
  );

  /**
   * Currency preference snapshot.
   *
   * Locale determines only the initial fallback when no
   * explicit persisted preference exists.
   */
  const getCurrencyClientSnapshot = useCallback((): CurrencyPreferences => {
    if (typeof window === "undefined") {
      return getDefaultCurrencySettings(locale);
    }

    try {
      const raw = window.localStorage.getItem(CURRENCY_STORAGE_KEY);

      if (raw !== cachedCurrencyStorageValue || locale !== cachedCurrencyLocale) {
        cachedCurrencyStorageValue = raw;
        cachedCurrencyLocale = locale;
        cachedCurrencySettings = parseCurrencySettings(raw, locale);
      }

      return cachedCurrencySettings;
    } catch (error) {
      reportSettingsStorageError("getCurrencyClientSnapshot", error);

      return cachedCurrencySettings;
    }
  }, [locale]);

  const getCurrencyServerSnapshot = useCallback(
    (): CurrencyPreferences => getDefaultCurrencySettings(locale),
    [locale]
  );

  const currencySettings = useSyncExternalStore(
    subscribe,
    getCurrencyClientSnapshot,
    getCurrencyServerSnapshot
  );

  /**
   * Persists dashboard overview preferences.
   */
  const persistOverviewSettings = useCallback(
    (nextSettings: OverviewWidgetPreferences, action: string) => {
      try {
        const serialized = JSON.stringify(nextSettings);

        window.localStorage.setItem(OVERVIEW_STORAGE_KEY, serialized);

        cachedOverviewStorageValue = serialized;

        cachedOverviewSettings = nextSettings;
      } catch (error) {
        reportSettingsStorageError(`persistOverviewSettings:${action}`, error);

        /**
         * Keep the in-memory value available even when
         * persistence is unavailable.
         */
        cachedOverviewSettings = nextSettings;
      } finally {
        notifySettingsChange();
      }
    },
    []
  );

  /**
   * Persists the selected dashboard display currency.
   */
  const persistCurrencySettings = useCallback(
    (nextSettings: CurrencyPreferences, action: string) => {
      try {
        const serialized = JSON.stringify(nextSettings);

        window.localStorage.setItem(CURRENCY_STORAGE_KEY, serialized);

        cachedCurrencyStorageValue = serialized;
        cachedCurrencyLocale = locale;
        cachedCurrencySettings = nextSettings;
      } catch (error) {
        reportSettingsStorageError(`persistCurrencySettings:${action}`, error);

        cachedCurrencyLocale = locale;
        cachedCurrencySettings = nextSettings;
      } finally {
        notifySettingsChange();
      }
    },
    [locale]
  );

  /**
   * Updates only recognized overview properties.
   */
  const updateOverviewSettings = useCallback(
    (partial: Partial<OverviewWidgetPreferences>) => {
      const current = getOverviewClientSnapshot();

      const nextSettings: OverviewWidgetPreferences = {
        ...current,

        ...(typeof partial.showSummaryCards === "boolean" && {
          showSummaryCards: partial.showSummaryCards,
        }),

        ...(typeof partial.showFinancialChart === "boolean" && {
          showFinancialChart: partial.showFinancialChart,
        }),

        ...(typeof partial.showCategoryBreakdown === "boolean" && {
          showCategoryBreakdown: partial.showCategoryBreakdown,
        }),

        ...(typeof partial.showRecentTransactions === "boolean" && {
          showRecentTransactions: partial.showRecentTransactions,
        }),

        ...(Array.isArray(partial.widgetOrder) && {
          widgetOrder: sanitizeWidgetOrder(partial.widgetOrder),
        }),
      };

      persistOverviewSettings(nextSettings, "updateOverviewSettings");
    },
    [persistOverviewSettings]
  );

  /**
   * Updates display currency only when the received value
   * belongs to the supported currency domain.
   */
  const updateCurrencySettings = useCallback(
    (partial: Partial<CurrencyPreferences>) => {
      const current = getCurrencyClientSnapshot();

      const nextSettings: CurrencyPreferences = {
        ...current,

        ...(isSupportedCurrency(partial.displayCurrency) && {
          displayCurrency: partial.displayCurrency,
        }),
      };

      persistCurrencySettings(nextSettings, "updateCurrencySettings");
    },
    [getCurrencyClientSnapshot, persistCurrencySettings]
  );

  /**
   * Restores dashboard widget preferences.
   */
  const resetOverviewSettings = useCallback(() => {
    try {
      window.localStorage.removeItem(OVERVIEW_STORAGE_KEY);

      cachedOverviewStorageValue = null;

      cachedOverviewSettings = DEFAULT_OVERVIEW_SETTINGS;
    } catch (error) {
      reportSettingsStorageError("resetOverviewSettings", error);

      cachedOverviewSettings = DEFAULT_OVERVIEW_SETTINGS;
    } finally {
      notifySettingsChange();
    }
  }, []);

  /**
   * Restores currency preference according to the
   * current locale.
   */
  const resetCurrencySettings = useCallback(() => {
    try {
      window.localStorage.removeItem(CURRENCY_STORAGE_KEY);

      cachedCurrencyStorageValue = null;
      cachedCurrencyLocale = locale;
      cachedCurrencySettings = getDefaultCurrencySettings(locale);
    } catch (error) {
      reportSettingsStorageError("resetCurrencySettings", error);

      cachedCurrencyLocale = locale;
      cachedCurrencySettings = getDefaultCurrencySettings(locale);
    } finally {
      notifySettingsChange();
    }
  }, [locale]);
  /**
   * Persists a sanitized widget order.
   */
  const reorderWidgets = useCallback(
    (newOrder: WidgetId[]) => {
      const current = getOverviewClientSnapshot();

      const nextSettings: OverviewWidgetPreferences = {
        ...current,

        widgetOrder: sanitizeWidgetOrder(newOrder),
      };

      persistOverviewSettings(nextSettings, "reorderWidgets");
    },
    [persistOverviewSettings]
  );

  return (
    <SettingsContext.Provider
      value={{
        overviewSettings,
        currencySettings,

        updateOverviewSettings,
        updateCurrencySettings,

        resetOverviewSettings,
        resetCurrencySettings,

        reorderWidgets,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextData {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
}
