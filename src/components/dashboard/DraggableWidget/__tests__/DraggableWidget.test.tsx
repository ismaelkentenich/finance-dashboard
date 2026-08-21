import { LocaleProvider } from "@/contexts/LocaleContext";
import type { WidgetId } from "@/types/settings.types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reorder } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DraggableWidget } from "../DraggableWidget";
import type { DraggableWidgetProps } from "../DraggableWidget.types";

const mockStartDrag = vi.fn();

// Mock framer-motion drag controls lifecycle for Vitest JSDOM environment
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useDragControls: () => ({
      start: mockStartDrag,
      subscribe: vi.fn(() => () => {}),
      setComponentControls: vi.fn(),
    }),
  };
});

function renderDraggableWidget(
  props: Partial<DraggableWidgetProps> = {},
  groupValues: WidgetId[] = ["summaryCards"]
) {
  const defaultProps: DraggableWidgetProps = {
    value: "summaryCards",
    children: <div>Widget Inner Content</div>,
    widgetLabel: "Summary Cards",
    position: 1,
    totalItems: groupValues.length,
    canMoveUp: false,
    canMoveDown: false,
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    ...props,
  };

  return render(
    <LocaleProvider initialLocale="en-US">
      <Reorder.Group values={groupValues} onReorder={vi.fn()}>
        <DraggableWidget {...defaultProps} />
      </Reorder.Group>
    </LocaleProvider>
  );
}

describe("DraggableWidget Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DOM structure and child rendering", () => {
    it("renders children elements passed to the widget container", () => {
      renderDraggableWidget({
        children: <div data-testid="custom-child">Child Element</div>,
      });

      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
      expect(screen.getByText("Child Element")).toBeInTheDocument();
    });

    it("applies dynamic data-testid using widget value identifier", () => {
      renderDraggableWidget({ value: "financialChart" });

      expect(screen.getByTestId("draggable-widget-financialChart")).toBeInTheDocument();
    });

    it("appends custom className alongside scoped item styles", () => {
      renderDraggableWidget({
        value: "recentTransactions",
        className: "custom-grid-span-2",
      });

      const container = screen.getByTestId("draggable-widget-recentTransactions");
      expect(container.className).toContain("custom-grid-span-2");
      expect(container.className).toMatch(/item/i);
    });
  });

  describe("Drag handle button, cursor states and accessibility", () => {
    it("renders drag handle button with native type attribute set to button", () => {
      renderDraggableWidget({
        widgetLabel: "Summary Cards",
      });

      const handleButton = screen.getByRole("button", {
        name: "Summary Cards: Reorder widget",
      });

      expect(handleButton).toBeInTheDocument();
      expect(handleButton).toHaveAttribute("type", "button");
    });

    it("sets localized reorder instructions as title tooltip", () => {
      renderDraggableWidget({
        widgetLabel: "Summary Cards",
      });

      const handleButton = screen.getByRole("button", {
        name: "Summary Cards: Reorder widget",
      });

      expect(handleButton).toHaveAttribute(
        "title",
        "Drag to reorder. Use Arrow Up or Arrow Down to move this widget."
      );
    });

    it("starts pointer dragging from the reorder handle", () => {
      renderDraggableWidget({
        widgetLabel: "Financial Chart",
      });

      const handleButton = screen.getByRole("button", {
        name: "Financial Chart: Reorder widget",
      });

      expect(handleButton).toHaveAttribute("data-dragging", "false");

      fireEvent.pointerDown(handleButton);

      expect(mockStartDrag).toHaveBeenCalledTimes(1);
    });
  });
  describe("Keyboard reorder accessibility", () => {
    it("moves the widget up when ArrowUp is pressed", async () => {
      const user = userEvent.setup();
      const handleMoveUp = vi.fn();

      renderDraggableWidget({
        position: 2,
        totalItems: 4,
        canMoveUp: true,
        canMoveDown: true,
        onMoveUp: handleMoveUp,
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowUp}");

      expect(handleMoveUp).toHaveBeenCalledTimes(1);
    });

    it("moves the widget down when ArrowDown is pressed", async () => {
      const user = userEvent.setup();
      const handleMoveDown = vi.fn();

      renderDraggableWidget({
        position: 2,
        totalItems: 4,
        canMoveUp: true,
        canMoveDown: true,
        onMoveDown: handleMoveDown,
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowDown}");

      expect(handleMoveDown).toHaveBeenCalledTimes(1);
    });

    it("does not move above the first position", async () => {
      const user = userEvent.setup();
      const handleMoveUp = vi.fn();

      renderDraggableWidget({
        position: 1,
        totalItems: 4,
        canMoveUp: false,
        canMoveDown: true,
        onMoveUp: handleMoveUp,
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowUp}");

      expect(handleMoveUp).not.toHaveBeenCalled();
    });

    it("does not move below the last position", async () => {
      const user = userEvent.setup();
      const handleMoveDown = vi.fn();

      renderDraggableWidget({
        position: 4,
        totalItems: 4,
        canMoveUp: true,
        canMoveDown: false,
        onMoveDown: handleMoveDown,
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowDown}");

      expect(handleMoveDown).not.toHaveBeenCalled();
    });

    it("keeps focus on the drag handle after keyboard reorder", async () => {
      const user = userEvent.setup();

      renderDraggableWidget({
        position: 2,
        totalItems: 4,
        canMoveUp: true,
        canMoveDown: true,
        onMoveDown: vi.fn(),
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowDown}");

      await waitFor(() => {
        expect(handle).toHaveFocus();
      });
    });

    it("announces the new widget position after keyboard reorder", async () => {
      const user = userEvent.setup();

      renderDraggableWidget({
        widgetLabel: "Summary Cards",
        position: 2,
        totalItems: 4,
        canMoveUp: true,
        canMoveDown: true,
        onMoveDown: vi.fn(),
      });

      const handle = screen.getByTestId("widget-drag-handle-summaryCards");

      handle.focus();

      await user.keyboard("{ArrowDown}");

      const status = screen.getByTestId("widget-reorder-status-summaryCards");

      expect(status).toHaveAttribute("role", "status");
      expect(status).toHaveAttribute("aria-live", "polite");

      expect(status).toHaveTextContent("Summary Cards moved to position 3 of 4.");
    });

    it("exposes keyboard shortcuts on the reorder handle", () => {
      renderDraggableWidget({
        canMoveDown: true,
      });

      expect(screen.getByTestId("widget-drag-handle-summaryCards")).toHaveAttribute(
        "aria-keyshortcuts",
        "ArrowUp ArrowDown"
      );
    });
  });
});
