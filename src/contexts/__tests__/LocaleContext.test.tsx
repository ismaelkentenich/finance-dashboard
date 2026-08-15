import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
} from "@/constants/locale.constants";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

function TestConsumer() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="header-title">{t.header.title}</span>
      <button onClick={() => setLocale("en-US")} data-testid="set-en-btn">
        EN
      </button>
      <button onClick={() => setLocale("pt-BR")} data-testid="set-pt-btn">
        PT
      </button>
    </div>
  );
}

describe("LocaleContext & Provider", () => {
  beforeEach(() => {
    // Clear cookies and storage state prior to each test run
    document.cookie = `${LOCALE_COOKIE_NAME}=; max-age=0; path=/`;
    localStorage.clear();
    document.documentElement.lang = "pt-BR";
  });

  describe("Scenario: Initialization & SSR Hydration", () => {
    it("should initialize with initialLocale and update document element lang attribute", () => {
      render(
        <LocaleProvider initialLocale="en-US">
          <TestConsumer />
        </LocaleProvider>
      );

      expect(screen.getByTestId("current-locale")).toHaveTextContent("en-US");
      expect(screen.getByTestId("header-title")).toHaveTextContent("Financial Overview");
      expect(document.documentElement.lang).toBe("en-US");
    });

    it("should fallback to DEFAULT_LOCALE ('pt-BR') when no initialLocale or persistent storage exists", () => {
      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      expect(screen.getByTestId("current-locale")).toHaveTextContent(DEFAULT_LOCALE);
      expect(screen.getByTestId("header-title")).toHaveTextContent("Visão Geral Financeira");
      expect(document.documentElement.lang).toBe("pt-BR");
    });

    it("should retrieve saved client cookie preference when initialLocale is not passed", () => {
      document.cookie = `${LOCALE_COOKIE_NAME}=en-US; path=/`;

      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      expect(screen.getByTestId("current-locale")).toHaveTextContent("en-US");
    });
  });

  describe("Scenario: Locale Switching & Persistence", () => {
    it("should persist locale update in cookies, localStorage, and synchronize UI translations and document lang", async () => {
      const user = userEvent.setup();

      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      const enBtn = screen.getByTestId("set-en-btn");
      await user.click(enBtn);

      expect(screen.getByTestId("current-locale")).toHaveTextContent("en-US");
      expect(screen.getByTestId("header-title")).toHaveTextContent("Financial Overview");
      expect(document.documentElement.lang).toBe("en-US");
      expect(document.cookie).toContain(`${LOCALE_COOKIE_NAME}=en-US`);
      expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en-US");
    });
  });
});
