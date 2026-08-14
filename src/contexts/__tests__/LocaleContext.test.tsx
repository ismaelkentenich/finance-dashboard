import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider, useLocale } from "../LocaleContext";

function TestConsumer() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="header-title">{t.header.title}</span>
      <button type="button" onClick={() => setLocale("en-US")}>
        Set English
      </button>
      <button type="button" onClick={() => setLocale("pt-BR")}>
        Set Portuguese
      </button>
    </div>
  );
}

describe("LocaleContext & Document HTML lang Synchronization", () => {
  beforeEach(() => {
    document.documentElement.lang = "pt-BR";
  });

  afterEach(() => {
    document.documentElement.lang = "pt-BR";
  });

  describe("Initial document html lang setup", () => {
    it("synchronizes document.documentElement.lang to default locale pt-BR on mount", () => {
      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      expect(document.documentElement.lang).toBe("pt-BR");
      expect(screen.getByTestId("current-locale")).toHaveTextContent("pt-BR");
    });
  });

  describe("Dynamic html lang update on locale change", () => {
    it("updates document.documentElement.lang to en-US when switching locale", async () => {
      const user = userEvent.setup();

      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      const englishButton = screen.getByRole("button", { name: "Set English" });
      await user.click(englishButton);

      expect(document.documentElement.lang).toBe("en-US");
      expect(screen.getByTestId("current-locale")).toHaveTextContent("en-US");
      expect(screen.getByTestId("header-title")).toHaveTextContent("Financial Overview");
    });

    it("restores document.documentElement.lang to pt-BR when switching back", async () => {
      const user = userEvent.setup();

      render(
        <LocaleProvider>
          <TestConsumer />
        </LocaleProvider>
      );

      const englishButton = screen.getByRole("button", { name: "Set English" });
      const portugueseButton = screen.getByRole("button", { name: "Set Portuguese" });

      await user.click(englishButton);
      expect(document.documentElement.lang).toBe("en-US");

      await user.click(portugueseButton);
      expect(document.documentElement.lang).toBe("pt-BR");
      expect(screen.getByTestId("current-locale")).toHaveTextContent("pt-BR");
      expect(screen.getByTestId("header-title")).toHaveTextContent("Visão Geral Financeira");
    });
  });

  describe("Hook usage validation", () => {
    it("throws an error when useLocale is called outside of LocaleProvider", () => {
      expect(() => renderHook(() => useLocale())).toThrow(
        "useLocale must be used within a LocaleProvider"
      );
    });
  });
});
