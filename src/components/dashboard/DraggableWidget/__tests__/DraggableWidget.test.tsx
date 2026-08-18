import { LocaleProvider } from "@/contexts/LocaleContext";
import type { WidgetId } from "@/types/settings.types";
import { fireEvent, render, screen } from "@testing-library/react";
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
    ...props,
  };

  return render(
    <LocaleProvider>
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
      renderDraggableWidget({ dragLabel: "Arrastar widget" });

      const handleButton = screen.getByRole("button", { name: "Arrastar widget" });
      expect(handleButton).toBeInTheDocument();
      expect(handleButton).toHaveAttribute("type", "button");
    });

    it("sets title tooltip attribute on drag handle button from locale dictionary", () => {
      renderDraggableWidget({ dragLabel: "Arrastar widget" });

      const handleButton = screen.getByRole("button", { name: "Arrastar widget" });
      expect(handleButton).toHaveAttribute("title");
    });

    it("toggles dragging attribute on drag handle button during pointer interactions", () => {
      renderDraggableWidget({ dragLabel: "Arrastar painel" });

      const handleButton = screen.getByRole("button", { name: "Arrastar painel" });
      expect(handleButton).toHaveAttribute("data-dragging", "false");

      fireEvent.pointerDown(handleButton);
      expect(mockStartDrag).toHaveBeenCalledTimes(1);
    });
  });
});
