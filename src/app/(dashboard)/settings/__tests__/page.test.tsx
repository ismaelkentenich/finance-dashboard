import { LocaleProvider } from "@/contexts/LocaleContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import SettingsPage from "../page";

function renderSettingsPage(locale: "pt-BR" | "en-US" = "pt-BR") {
  return render(
    <LocaleProvider initialLocale={locale}>
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    </LocaleProvider>
  );
}

describe("SettingsPage Micro-interactions", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("animates the restore icon when clicking restore defaults button", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const resetButton = screen.getByTestId("reset-settings-button");
    const resetIcon = screen.getByTestId("reset-settings-icon");

    expect(resetIcon.getAttribute("class") || "").not.toMatch(/resetIconAnimated/);

    await user.click(resetButton);

    expect(resetIcon.getAttribute("class") || "").toMatch(/resetIconAnimated/);
  });

  it("renders BRL as default display currency for pt-BR", () => {
    renderSettingsPage("pt-BR");

    expect(screen.getByTestId("display-currency-select")).toHaveValue("BRL");
  });

  it("renders USD as default display currency for en-US", () => {
    renderSettingsPage("en-US");

    expect(screen.getByTestId("display-currency-select")).toHaveValue("USD");
  });

  it("updates display currency when user selects another currency", async () => {
    const user = userEvent.setup();

    renderSettingsPage("pt-BR");

    const select = screen.getByTestId("display-currency-select");

    expect(select).toHaveValue("BRL");

    await user.selectOptions(select, "EUR");

    expect(select).toHaveValue("EUR");

    expect(JSON.parse(window.localStorage.getItem("finflow_currency_settings") ?? "{}")).toEqual({
      displayCurrency: "EUR",
    });
  });

  it("renders localized currency labels in pt-BR", async () => {
    const user = userEvent.setup();

    renderSettingsPage("pt-BR");

    const currencyCombobox = screen.getByRole("combobox", {
      name: "Moeda de exibição",
    });

    expect(currencyCombobox).toHaveTextContent("BRL — Real brasileiro");
    expect(currencyCombobox).toHaveAttribute("aria-expanded", "false");

    await user.click(currencyCombobox);

    expect(currencyCombobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "BRL — Real brasileiro",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "USD — Dólar americano",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "EUR — Euro",
      })
    ).toBeInTheDocument();
  });

  it("renders localized currency labels in en-US", async () => {
    const user = userEvent.setup();

    renderSettingsPage("en-US");

    const currencyCombobox = screen.getByRole("combobox", {
      name: "Display currency",
    });

    expect(currencyCombobox).toHaveTextContent("USD — US Dollar");
    expect(currencyCombobox).toHaveAttribute("aria-expanded", "false");

    await user.click(currencyCombobox);

    expect(currencyCombobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "BRL — Brazilian Real",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "USD — US Dollar",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "EUR — Euro",
      })
    ).toBeInTheDocument();
  });
  it("resets overview and currency preferences together", async () => {
    const user = userEvent.setup();

    renderSettingsPage("pt-BR");

    const currencySelect = screen.getByTestId("display-currency-select");

    await user.selectOptions(currencySelect, "EUR");

    await user.click(screen.getByTestId("toggle-summary-cards"));

    expect(currencySelect).toHaveValue("EUR");

    await user.click(screen.getByTestId("reset-settings-button"));

    expect(currencySelect).toHaveValue("BRL");

    expect(screen.getByTestId("toggle-summary-cards")).toBeChecked();

    expect(window.localStorage.getItem("finflow_currency_settings")).toBeNull();
  });
});
