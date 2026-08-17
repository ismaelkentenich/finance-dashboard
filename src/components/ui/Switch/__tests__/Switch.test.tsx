import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "../Switch";

describe("Switch UI Component", () => {
  describe("Rendering & Semantic Attributes", () => {
    it("renders with role='switch' and default testid", () => {
      render(<Switch aria-label="Toggle notifications" />);
      const switchElement = screen.getByRole("switch", { name: "Toggle notifications" });
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute("aria-checked", "false");
    });

    it("reflects checked state via aria-checked and thumb class", () => {
      render(<Switch checked={true} aria-label="Active toggle" />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-checked", "true");
      expect(screen.getByTestId("switch-thumb").className).toMatch(/thumbChecked/i);
    });

    it("renders label and associates with switch input via id", () => {
      render(<Switch label="Ativar modo escuro" />);
      const label = screen.getByText("Ativar modo escuro");
      const switchElement = screen.getByRole("switch");
      expect(label).toHaveAttribute("for", switchElement.id);
    });
  });

  describe("Mouse Interactions", () => {
    it("toggles state and calls onCheckedChange on mouse click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle setting" />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("does not trigger change when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} aria-label="Disabled setting" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();

      await user.click(switchElement);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Interactions", () => {
    it("toggles on Space key press", async () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} aria-label="Keyboard switch" />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();

      fireEvent.keyDown(switchElement, { key: " " });
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("toggles on Enter key press", async () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} aria-label="Keyboard switch" />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();

      fireEvent.keyDown(switchElement, { key: "Enter" });
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });
});
