import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "../Header";

function renderHeader() {
  return render(
    <LocaleProvider>
      <ModalProvider>
        <Header />
      </ModalProvider>
    </LocaleProvider>
  );
}

describe("Header Language Switcher A11y & Descriptive Labels", () => {
  it("provides full descriptive aria-labels on language switcher buttons in Portuguese", () => {
    renderHeader();

    const ptButton = screen.getByRole("button", { name: "Mudar idioma para Português" });
    const enButton = screen.getByRole("button", { name: "Mudar idioma para Inglês" });

    expect(ptButton).toBeInTheDocument();
    expect(ptButton).toHaveAttribute("aria-label", "Mudar idioma para Português");
    expect(ptButton).toHaveAttribute("aria-pressed", "true");

    expect(enButton).toBeInTheDocument();
    expect(enButton).toHaveAttribute("aria-label", "Mudar idioma para Inglês");
    expect(enButton).toHaveAttribute("aria-pressed", "false");
  });

  it("updates aria-labels dynamically when switching locale to English", async () => {
    const user = userEvent.setup();
    renderHeader();

    const enButton = screen.getByRole("button", { name: "Mudar idioma para Inglês" });
    await user.click(enButton);

    const ptButtonUpdated = screen.getByRole("button", {
      name: "Switch language to Portuguese",
    });
    const enButtonUpdated = screen.getByRole("button", {
      name: "Switch language to English",
    });

    expect(ptButtonUpdated).toBeInTheDocument();
    expect(ptButtonUpdated).toHaveAttribute("aria-pressed", "false");

    expect(enButtonUpdated).toBeInTheDocument();
    expect(enButtonUpdated).toHaveAttribute("aria-pressed", "true");
  });
});
