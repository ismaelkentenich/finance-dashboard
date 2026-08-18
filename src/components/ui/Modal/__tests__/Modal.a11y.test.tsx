import { LocaleProvider } from "@/contexts/LocaleContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Modal } from "../Modal";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("Modal Accessibility (WCAG 2.1 AA Compliance)", () => {
  it("has zero detectable automated accessibility violations according to axe-core", async () => {
    const { container } = renderWithLocale(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Acessibilidade de Diálogo"
        description="Descrição clara."
      >
        <div>
          <button type="button">Ação 1</button>
          <button type="button">Ação 2</button>
        </div>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("traps keyboard focus within modal when navigating forward with Tab", async () => {
    const user = userEvent.setup();

    renderWithLocale(
      <Modal isOpen={true} onClose={vi.fn()} title="Focus Trap Modal">
        <div>
          <input data-testid="input-first" placeholder="Primeiro campo" />
          <button type="button" data-testid="button-last">
            Último elemento
          </button>
        </div>
      </Modal>
    );

    const closeBtn = screen.getByTestId("modal-close-button");
    const inputFirst = screen.getByTestId("input-first");
    const buttonLast = screen.getByTestId("button-last");

    // The close button receives initial focus because it is the first interactive element in the header.
    expect(closeBtn).toHaveFocus();

    // Tab -> Primeiro input
    await user.tab();
    expect(inputFirst).toHaveFocus();

    // Tab -> Last button
    await user.tab();
    expect(buttonLast).toHaveFocus();

    // Tab -> Circularly returns to the closeButton
    await user.tab();
    expect(closeBtn).toHaveFocus();
  });

  it("traps keyboard focus within modal when navigating backwards with Shift+Tab", async () => {
    const user = userEvent.setup();

    renderWithLocale(
      <Modal isOpen={true} onClose={vi.fn()} title="Shift Tab Focus Trap">
        <div>
          <button type="button" data-testid="button-last">
            Último elemento
          </button>
        </div>
      </Modal>
    );

    const closeBtn = screen.getByTestId("modal-close-button");
    const buttonLast = screen.getByTestId("button-last");

    expect(closeBtn).toHaveFocus();

    // Shift+Tab from the first button moves focus to the last element
    await user.tab({ shift: true });
    expect(buttonLast).toHaveFocus();
  });
});
