import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../Select";
import type { SelectOption } from "../Select.types";

const mockOptions: SelectOption[] = [
  { value: "opt-1", label: "Option 1" },
  { value: "opt-2", label: "Option 2" },
  { value: "opt-3", label: "Option 3", disabled: true },
];

describe("Select UI Component", () => {
  describe("DOM structure and basic rendering", () => {
    it("renders root container and combobox element using default test identifier", () => {
      render(<Select options={mockOptions} />);

      expect(screen.getByTestId("select-container")).toBeInTheDocument();
      expect(screen.getByTestId("select")).toBeInTheDocument();
    });

    it("propagates custom data-testid across container and select elements", () => {
      render(<Select label="Account" options={mockOptions} data-testid="custom-account-select" />);

      expect(screen.getByTestId("custom-account-select-container")).toBeInTheDocument();
      expect(screen.getByTestId("custom-account-select")).toBeInTheDocument();
      expect(screen.getByTestId("custom-account-select-label")).toBeInTheDocument();
    });

    it("omits label element when label prop is not provided", () => {
      render(<Select options={mockOptions} />);

      expect(screen.queryByTestId("select-label")).not.toBeInTheDocument();
    });
  });

  describe("Options and Children configuration", () => {
    it("maps options array to HTML option elements with corresponding values and labels", () => {
      render(<Select label="Category" options={mockOptions} />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue("opt-1");
      expect(options[0]).toHaveTextContent("Option 1");
      expect(options[1]).toHaveValue("opt-2");
      expect(options[1]).toHaveTextContent("Option 2");
    });

    it("marks specific option element as disabled when opt.disabled is true", () => {
      render(<Select options={mockOptions} />);

      const disabledOption = screen.getByRole("option", { name: "Option 3" });
      expect(disabledOption).toBeDisabled();
    });

    it("renders custom children elements when options prop is omitted", () => {
      render(
        <Select label="Custom Filter">
          <option value="direct-income">Income Transactions</option>
          <option value="direct-expense">Expense Transactions</option>
        </Select>
      );

      expect(screen.getByRole("option", { name: "Income Transactions" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Expense Transactions" })).toBeInTheDocument();
    });

    it("sets initial selected value when defaultValue or value prop is provided", () => {
      render(<Select options={mockOptions} defaultValue="opt-2" />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("opt-2");
    });
  });

  describe("Interactive states and event handling", () => {
    it("invokes onChange callback with new target value on selection change", () => {
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "opt-2" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("disables select element and prevents interactions when disabled prop is true", () => {
      render(<Select options={mockOptions} disabled />);

      const select = screen.getByRole("combobox");
      expect(select).toBeDisabled();
    });

    it("forwards native HTML attributes such as required and name", () => {
      render(<Select name="transactionType" options={mockOptions} required />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("name", "transactionType");
      expect(select).toBeRequired();
    });
  });

  describe("Accessibility and WAI-ARIA associations", () => {
    it("connects label element to select combobox via unique generated id", () => {
      render(<Select label="Payment Method" options={mockOptions} />);

      const label = screen.getByText("Payment Method");
      const select = screen.getByRole("combobox", { name: "Payment Method" });

      expect(label).toHaveAttribute("for", select.id);
    });

    it("binds explicit id prop to label htmlFor and select id", () => {
      render(<Select id="custom-select-id" label="Billing Period" options={mockOptions} />);

      const label = screen.getByText("Billing Period");
      const select = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "custom-select-id");
      expect(select).toHaveAttribute("id", "custom-select-id");
    });

    it("associates helper text through aria-describedby when helperText is supplied without errors", () => {
      render(
        <Select
          id="frequency-select"
          label="Frequency"
          options={mockOptions}
          helperText="Select recurring interval"
        />
      );

      const select = screen.getByRole("combobox");
      const helper = screen.getByTestId("select-helper");

      expect(helper).toHaveTextContent("Select recurring interval");
      expect(select).toHaveAttribute("aria-describedby", "frequency-select-helper");
    });

    it("overrides helper text association with error message in aria-describedby when error exists", () => {
      render(
        <Select
          id="account-select"
          label="Account"
          options={mockOptions}
          helperText="Select your active account"
          error="Account selection is required"
        />
      );

      const select = screen.getByRole("combobox");
      const errorAlert = screen.getByRole("alert");

      expect(errorAlert).toHaveTextContent("Account selection is required");
      expect(select).toHaveAttribute("aria-invalid", "true");
      expect(select).toHaveAttribute("aria-describedby", "account-select-error");
      expect(screen.queryByTestId("select-helper")).not.toBeInTheDocument();
    });
  });

  describe("Layout modifiers and styling classes", () => {
    it("applies fullWidth modifier class to root container when fullWidth prop is true", () => {
      render(<Select options={mockOptions} fullWidth />);

      const container = screen.getByTestId("select-container");
      expect(container.className).toMatch(/fullWidth/i);
    });

    it("appends custom className to root container alongside scoped styles", () => {
      render(<Select options={mockOptions} className="custom-filter-grid-span" />);

      const container = screen.getByTestId("select-container");
      expect(container.className).toContain("custom-filter-grid-span");
      expect(container.className).toMatch(/container/i);
    });

    it("applies selectError modifier CSS class on select element when error prop is present", () => {
      render(<Select options={mockOptions} error="Invalid selection" />);

      const select = screen.getByRole("combobox");
      expect(select.className).toMatch(/selectError/i);
    });
  });
});
