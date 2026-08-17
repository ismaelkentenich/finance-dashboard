import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input";

describe("Input UI Component", () => {
  describe("DOM rendering and basic properties", () => {
    it("renders input element with default data-testid", () => {
      render(<Input placeholder="Enter value" />);

      expect(screen.getByTestId("input-container")).toBeInTheDocument();
      expect(screen.getByTestId("input")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
    });

    it("renders label element associated with the input through unique identifier", () => {
      render(<Input label="Transaction Description" />);

      const label = screen.getByText("Transaction Description");
      const input = screen.getByRole("textbox", { name: "Transaction Description" });

      expect(label).toHaveAttribute("for", input.id);
    });

    it("forwards ref to the underlying HTMLInputElement", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} data-testid="ref-input" />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("accessibility and validation messaging", () => {
    it("associates helper text via aria-describedby when helperText is supplied", () => {
      render(<Input id="amount-field" label="Amount" helperText="Positive decimal number" />);

      const input = screen.getByRole("textbox");
      const helper = screen.getByTestId("input-helper");

      expect(helper).toHaveTextContent("Positive decimal number");
      expect(input).toHaveAttribute("aria-describedby", "amount-field-helper");
    });

    it("renders error message with role alert and sets aria-invalid to true", () => {
      render(<Input id="date-field" label="Date" error="Date is required" />);

      const input = screen.getByRole("textbox");
      const errorAlert = screen.getByRole("alert");

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "date-field-error");
      expect(errorAlert).toHaveTextContent("Date is required");
    });
  });

  describe("interactive states and event handling", () => {
    it("invokes onChange handler when user types text", () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByTestId("input");
      fireEvent.change(input, { target: { value: "Grocery Store" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("disables input element when disabled prop is true", () => {
      render(<Input disabled />);

      expect(screen.getByTestId("input")).toBeDisabled();
    });
  });

  describe("styling modifiers", () => {
    it("applies fullWidth modifier class to root container when fullWidth is true", () => {
      render(<Input fullWidth />);

      expect(screen.getByTestId("input-container").className).toMatch(/fullWidth/i);
    });

    it("applies inputError modifier class on input when error prop is present", () => {
      render(<Input error="Invalid field" />);

      expect(screen.getByTestId("input").className).toMatch(/inputError/i);
    });
  });

  describe("startIcon and onClear action", () => {
    it("renders start icon when provided", () => {
      render(<Input startIcon={<span data-testid="search-icon">🔍</span>} />);
      expect(screen.getByTestId("input-start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("renders clear button and triggers onClear callback when clicked", async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <Input value="Test query" onClear={handleClear} clearButtonAriaLabel="Limpar busca" />
      );

      const clearBtn = screen.getByTestId("input-clear-button");
      expect(clearBtn).toBeInTheDocument();
      expect(clearBtn).toHaveAttribute("aria-label", "Limpar busca");

      await user.click(clearBtn);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });
});
