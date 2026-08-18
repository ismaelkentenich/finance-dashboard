import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ModalProvider, useModal } from "../ModalContext";

describe("ModalContext", () => {
  it("throws error when useModal is consumed outside of ModalProvider", () => {
    expect(() => renderHook(() => useModal())).toThrow(
      "useModal must be used within a ModalProvider"
    );
  });

  it("toggles modal state via openTransactionModal and closeTransactionModal", async () => {
    const user = userEvent.setup();

    function TestComponent() {
      const { isTransactionModalOpen, openTransactionModal, closeTransactionModal } = useModal();
      return (
        <div>
          <span data-testid="status">{isTransactionModalOpen ? "open" : "closed"}</span>
          <button onClick={openTransactionModal} data-testid="open-btn">
            Open
          </button>
          <button onClick={closeTransactionModal} data-testid="close-btn">
            Close
          </button>
        </div>
      );
    }

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    expect(screen.getByTestId("status")).toHaveTextContent("closed");

    await user.click(screen.getByTestId("open-btn"));
    expect(screen.getByTestId("status")).toHaveTextContent("open");

    await user.click(screen.getByTestId("close-btn"));
    expect(screen.getByTestId("status")).toHaveTextContent("closed");
  });
});
