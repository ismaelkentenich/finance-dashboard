import { LocaleProvider } from "@/contexts/LocaleContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SettingsPage from "../page";

function renderSettingsPage() {
  return render(
    <LocaleProvider>
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    </LocaleProvider>
  );
}

describe("SettingsPage Micro-interactions", () => {
  it("animates the restore icon when clicking restore defaults button", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const resetButton = screen.getByTestId("reset-settings-button");
    const resetIcon = screen.getByTestId("reset-settings-icon");

    expect(resetIcon.getAttribute("class") || "").not.toMatch(/resetIconAnimated/);

    await user.click(resetButton);

    expect(resetIcon.getAttribute("class") || "").toMatch(/resetIconAnimated/);
  });
});
