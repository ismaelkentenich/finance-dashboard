import { LocaleProvider } from "@/contexts/LocaleContext";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../Modal";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("Modal UI Component", () => {
  function ControlledModal({ initiallyOpen = true }: { initiallyOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    return (
      <>
        <button type="button" data-testid="modal-opener" onClick={() => setIsOpen(true)}>
          Open modal
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Animated Modal">
          <button type="button">Dialog action</button>
        </Modal>
      </>
    );
  }
  describe("visibility and DOM mounting", () => {
    it("returns null and does not mount to DOM when isOpen is false", () => {
      renderWithLocale(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("renders dialog elements with title, description, and children when isOpen is true", () => {
      renderWithLocale(
        <Modal
          isOpen={true}
          onClose={vi.fn()}
          title="New Transaction Dialog"
          description="Fill in the transaction details."
        >
          <form>Form fields</form>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(screen.getByText("New Transaction Dialog")).toBeInTheDocument();
      expect(screen.getByText("Fill in the transaction details.")).toBeInTheDocument();
      expect(screen.getByText("Form fields")).toBeInTheDocument();
    });
  });

  describe("keyboard and click interactions", () => {
    it("triggers onClose callback when clicking the close button", () => {
      const handleClose = vi.fn();
      renderWithLocale(
        <Modal isOpen={true} onClose={handleClose} title="Closeable Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.click(screen.getByTestId("modal-close-button"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("triggers onClose callback when clicking the backdrop overlay", () => {
      const handleClose = vi.fn();
      renderWithLocale(
        <Modal isOpen={true} onClose={handleClose} title="Backdrop Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.click(screen.getByTestId("modal-backdrop"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("triggers onClose callback when pressing the Escape key", () => {
      const handleClose = vi.fn();
      renderWithLocale(
        <Modal isOpen={true} onClose={handleClose} title="Escape Key Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("locks and restores document body overflow style during mount and unmount", () => {
      const { unmount } = renderWithLocale(
        <Modal isOpen={true} onClose={vi.fn()} title="Scroll Lock Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("unset");
    });
  });

  it("keeps the dialog mounted and scroll locked until the exit animation completes", async () => {
    renderWithLocale(<ControlledModal />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByTestId("modal-close-button"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(document.body.style.overflow).toBe("unset");
  });

  it("restores focus to the opener only after the exit animation finishes", async () => {
    renderWithLocale(<ControlledModal initiallyOpen={false} />);

    const opener = screen.getByTestId("modal-opener");

    opener.focus();
    expect(opener).toHaveFocus();

    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeInTheDocument();
    expect(opener).not.toHaveFocus();

    fireEvent.click(screen.getByTestId("modal-close-button"));

    // AnimatePresence keeps the dialog mounted during exit.
    expect(dialog).toBeInTheDocument();

    // Wait for Framer Motion to actually finish the exit lifecycle.
    await waitForElementToBeRemoved(dialog);

    await waitFor(() => {
      expect(opener).toHaveFocus();
    });
  });
});
