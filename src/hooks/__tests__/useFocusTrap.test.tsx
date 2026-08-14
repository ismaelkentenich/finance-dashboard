import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useFocusTrap } from "../useFocusTrap";

interface TestTrapHarnessProps {
  isOpen: boolean;
  onEscape?: () => void;
}

function TestTrapHarness({ isOpen, onEscape }: TestTrapHarnessProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ isOpen, onEscape });

  if (!isOpen) return null;

  return (
    <div ref={containerRef} data-testid="trap-container">
      <button type="button" data-testid="first-button">
        First
      </button>
      <input data-testid="middle-input" placeholder="Middle" />
      <button type="button" data-testid="last-button">
        Last
      </button>
    </div>
  );
}

describe("useFocusTrap custom hook", () => {
  describe("initial focus and restoration", () => {
    it("moves focus to the first focusable element when opened", () => {
      render(<TestTrapHarness isOpen={true} />);

      const firstButton = screen.getByTestId("first-button");
      expect(firstButton).toHaveFocus();
    });

    it("restores focus to previously active element on unmount/close", () => {
      const { unmount } = render(
        <div>
          <button type="button" data-testid="trigger-btn">
            Open
          </button>
          <TestTrapHarness isOpen={false} />
        </div>
      );

      const triggerBtn = screen.getByTestId("trigger-btn");
      triggerBtn.focus();
      expect(triggerBtn).toHaveFocus();

      // Mount trap container with isOpen = true
      const { unmount: unmountModal } = render(<TestTrapHarness isOpen={true} />);
      expect(screen.getByTestId("first-button")).toHaveFocus();

      // Unmount/close trap container
      unmountModal();
      expect(triggerBtn).toHaveFocus();

      unmount();
    });
  });

  describe("keyboard navigation loops", () => {
    it("cycles focus from last element back to first on Tab press", async () => {
      const user = userEvent.setup();
      render(<TestTrapHarness isOpen={true} />);

      const firstBtn = screen.getByTestId("first-button");
      const middleInput = screen.getByTestId("middle-input");
      const lastBtn = screen.getByTestId("last-button");

      expect(firstBtn).toHaveFocus();

      // Tab -> middle
      await user.tab();
      expect(middleInput).toHaveFocus();

      // Tab -> last
      await user.tab();
      expect(lastBtn).toHaveFocus();

      // Tab on last element -> wraps back to first element
      await user.tab();
      expect(firstBtn).toHaveFocus();
    });

    it("cycles focus from first element back to last on Shift+Tab press", async () => {
      const user = userEvent.setup();
      render(<TestTrapHarness isOpen={true} />);

      const firstBtn = screen.getByTestId("first-button");
      const lastBtn = screen.getByTestId("last-button");

      expect(firstBtn).toHaveFocus();

      // Shift + Tab on first element -> wraps back to last element
      await user.tab({ shift: true });
      expect(lastBtn).toHaveFocus();
    });

    it("triggers onEscape callback when pressing Escape key", () => {
      const handleEscape = vi.fn();
      render(<TestTrapHarness isOpen={true} onEscape={handleEscape} />);

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleEscape).toHaveBeenCalledTimes(1);
    });
  });
});
