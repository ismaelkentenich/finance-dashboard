import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useFocusTrap } from "../useFocusTrap";

interface TestModalProps {
  isOpen: boolean;
  onEscape?: () => void;
  hasButtons?: boolean;
  initialFocusInput?: boolean;
}

function TestDialog({
  isOpen,
  onEscape,
  hasButtons = true,
  initialFocusInput = false,
}: TestModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onEscape,
    initialFocusRef: initialFocusInput ? inputRef : undefined,
  });

  if (!isOpen) return null;

  return (
    <div ref={trapRef} role="dialog" aria-modal="true" data-testid="dialog-container">
      {hasButtons ? (
        <>
          <button data-testid="button-first">First Action</button>
          <input ref={inputRef} data-testid="input-middle" placeholder="Type here..." />
          <button data-testid="button-last">Last Action</button>
        </>
      ) : (
        <p data-testid="static-content">Information only</p>
      )}
    </div>
  );
}

function WrapperHarness({ initialButtons = true }: { initialButtons?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [removeOpener, setRemoveOpener] = useState(false);

  return (
    <div>
      {!removeOpener ? (
        <button data-testid="open-dialog-btn" onClick={() => setIsOpen(true)}>
          Open Dialog
        </button>
      ) : null}
      <button data-testid="destroy-opener-btn" onClick={() => setRemoveOpener(true)}>
        Destroy Opener
      </button>

      <TestDialog isOpen={isOpen} onEscape={() => setIsOpen(false)} hasButtons={initialButtons} />
    </div>
  );
}

describe("useFocusTrap", () => {
  it("open → focus inside: moves focus to first focusable element when opened", async () => {
    render(<WrapperHarness />);

    const openBtn = screen.getByTestId("open-dialog-btn");
    openBtn.focus();
    expect(document.activeElement).toBe(openBtn);

    fireEvent.click(openBtn);

    const firstBtn = await screen.findByTestId("button-first");
    expect(document.activeElement).toBe(firstBtn);
  });

  it("Tab → trapped: cycles focus from last element back to first element", async () => {
    render(<WrapperHarness />);
    fireEvent.click(screen.getByTestId("open-dialog-btn"));

    const firstBtn = await screen.findByTestId("button-first");
    const lastBtn = screen.getByTestId("button-last");

    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(firstBtn);
  });

  it("Shift+Tab → trapped: cycles focus from first element back to last element", async () => {
    render(<WrapperHarness />);
    fireEvent.click(screen.getByTestId("open-dialog-btn"));

    const firstBtn = await screen.findByTestId("button-first");
    const lastBtn = screen.getByTestId("button-last");

    firstBtn.focus();
    expect(document.activeElement).toBe(firstBtn);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(lastBtn);
  });

  it("Escape → close: calls onEscape callback when Escape key is pressed", async () => {
    const handleEscape = vi.fn();
    render(<TestDialog isOpen={true} onEscape={handleEscape} />);

    await screen.findByTestId("dialog-container");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleEscape).toHaveBeenCalledTimes(1);
  });

  it("close → restore focus: restores focus to previously active trigger element", async () => {
    render(<WrapperHarness />);
    const openBtn = screen.getByTestId("open-dialog-btn");
    openBtn.focus();
    fireEvent.click(openBtn);

    await screen.findByTestId("dialog-container");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByTestId("dialog-container")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(openBtn);
  });

  it("previous focus removed → safe fallback: safely handles focus restoration when trigger is unmounted", async () => {
    render(<WrapperHarness />);
    const openBtn = screen.getByTestId("open-dialog-btn");
    openBtn.focus();
    fireEvent.click(openBtn);

    await screen.findByTestId("dialog-container");

    // Simulate removing opener button from DOM while modal is open
    fireEvent.click(screen.getByTestId("destroy-opener-btn"));

    expect(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    }).not.toThrow();
  });

  it("no focusable children → dialog still usable: focuses the dialog container itself and traps Tab", async () => {
    render(<WrapperHarness initialButtons={false} />);
    fireEvent.click(screen.getByTestId("open-dialog-btn"));

    const container = await screen.findByTestId("dialog-container");
    expect(document.activeElement).toBe(container);

    // Pressing Tab should keep focus in container
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(container);
  });
});
