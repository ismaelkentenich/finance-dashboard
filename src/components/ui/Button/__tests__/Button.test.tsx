import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button";

describe("Button UI Component", () => {
  describe("rendering and variants", () => {
    it("renders children content inside button element", () => {
      render(<Button>Confirm Transaction</Button>);

      const button = screen.getByRole("button", { name: "Confirm Transaction" });
      expect(button).toBeInTheDocument();
    });

    it("applies primary variant and md size CSS classes by default", () => {
      render(<Button>Save</Button>);

      const button = screen.getByTestId("button");
      expect(button.className).toMatch(/primary/i);
      expect(button.className).toMatch(/sizeMd/i);
    });

    it("applies specific style classes for requested variant and size", () => {
      render(
        <Button variant="danger" size="sm">
          Delete Item
        </Button>
      );

      const button = screen.getByTestId("button");
      expect(button.className).toMatch(/danger/i);
      expect(button.className).toMatch(/sizeSm/i);
    });

    it("renders secondary and ghost variants correctly", () => {
      const { rerender } = render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByTestId("button").className).toMatch(/secondary/i);

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByTestId("button").className).toMatch(/ghost/i);
    });
  });

  describe("events and interactive states", () => {
    it("triggers onClick callback when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Submit</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disables button and prevents onClick events when disabled prop is true", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Action
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders loading spinner and disables button when isLoading is true", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Processing
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button.querySelector("span[aria-hidden='true']")).toBeInTheDocument();

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
