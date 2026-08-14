import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../Modal";

describe("Modal UI Component", () => {
  describe("visibility and DOM mounting", () => {
    it("returns null and does not mount to DOM when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("renders dialog elements with title, description, and children when isOpen is true", () => {
      render(
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
      render(
        <Modal isOpen={true} onClose={handleClose} title="Closeable Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.click(screen.getByTestId("modal-close-button"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("triggers onClose callback when clicking the backdrop overlay", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Backdrop Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.click(screen.getByTestId("modal-backdrop"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("triggers onClose callback when pressing the Escape key", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Escape Key Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("locks and restores document body overflow style during mount and unmount", () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Scroll Lock Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("unset");
    });
  });
});
