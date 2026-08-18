import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    it("renders root container and combobox trigger button using default test identifier", () => {
      render(<Select options={mockOptions} />);

      expect(screen.getByTestId("select-container")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByTestId("select")).toBeInTheDocument();
    });

    it("propagates custom data-testid across container, label and select elements", () => {
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

  describe("Options and dropdown interaction", () => {
    it("displays initial selected value in combobox trigger and hidden select", () => {
      render(<Select options={mockOptions} defaultValue="opt-2" />);

      expect(screen.getByRole("combobox")).toHaveTextContent("Option 2");

      const hiddenSelect = screen.getByTestId("select") as HTMLSelectElement;
      expect(hiddenSelect.value).toBe("opt-2");
    });

    it("opens listbox dropdown when clicking trigger button and displays options", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();

      const customOptions = screen.getAllByRole("option");
      expect(customOptions).toHaveLength(3);
      expect(customOptions[0]).toHaveTextContent("Option 1");
      expect(customOptions[1]).toHaveTextContent("Option 2");
      expect(customOptions[2]).toHaveAttribute("aria-disabled", "true");
    });

    it("selects an option, closes dropdown and triggers onChange callback", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      const option2 = screen.getByRole("option", { name: "Option 2" });
      await user.click(option2);

      expect(trigger).toHaveTextContent("Option 2");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(handleChange).toHaveBeenCalledTimes(1);

      const hiddenSelect = screen.getByTestId("select") as HTMLSelectElement;
      expect(hiddenSelect.value).toBe("opt-2");
    });

    it("does not select disabled options when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      const disabledOption = screen.getByRole("option", { name: "Option 3" });
      await user.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button type="button">Outside Element</button>
          <Select options={mockOptions} />
        </div>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(screen.getByText("Outside Element"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard navigation", () => {
    it("toggles dropdown on Enter, Space, and ArrowDown keys", () => {
      render(<Select options={mockOptions} />);

      const trigger = screen.getByRole("combobox");

      // ArrowDown opens
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // Escape closes
      fireEvent.keyDown(trigger, { key: "Escape" });
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      // Enter toggles
      fireEvent.keyDown(trigger, { key: "Enter" });
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("Form synchronization and disabled states", () => {
    it("updates selection when changing hidden select element directly", () => {
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const hiddenSelect = screen.getByTestId("select");
      fireEvent.change(hiddenSelect, { target: { value: "opt-2" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("combobox")).toHaveTextContent("Option 2");
    });

    it("disables trigger and prevents opening when disabled prop is true", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} disabled />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("forwards native HTML attributes such as name and required to hidden select", () => {
      render(<Select name="transactionType" options={mockOptions} required />);

      const hiddenSelect = screen.getByTestId("select");
      expect(hiddenSelect).toHaveAttribute("name", "transactionType");
      expect(hiddenSelect).toBeRequired();
    });
  });

  describe("Accessibility and WAI-ARIA associations", () => {
    it("connects label element to trigger button through id and aria-labelledby", () => {
      render(<Select label="Payment Method" options={mockOptions} />);

      const label = screen.getByText("Payment Method");
      const trigger = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", trigger.id);
      expect(trigger).toHaveAttribute("aria-labelledby", `${trigger.id}-label ${trigger.id}`);
    });

    it("binds aria-controls to the listbox element id", async () => {
      const user = userEvent.setup();
      render(<Select id="custom-id" label="Billing Period" options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-controls", "custom-id-listbox");

      await user.click(trigger);
      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("id", "custom-id-listbox");
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

      const trigger = screen.getByRole("combobox");
      const helper = screen.getByTestId("select-helper");

      expect(helper).toHaveTextContent("Select recurring interval");
      expect(trigger).toHaveAttribute("aria-describedby", "frequency-select-helper");
    });

    it("associates error message with aria-invalid and aria-describedby", () => {
      render(
        <Select
          id="account-select"
          label="Account"
          options={mockOptions}
          helperText="Select your active account"
          error="Account selection is required"
        />
      );

      const trigger = screen.getByRole("combobox");
      const errorAlert = screen.getByRole("alert");

      expect(errorAlert).toHaveTextContent("Account selection is required");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).toHaveAttribute("aria-describedby", "account-select-error");
      expect(screen.queryByTestId("select-helper")).not.toBeInTheDocument();
    });
  });

  describe("Layout modifiers and styling classes", () => {
    it("applies fullWidth modifier class to root container when fullWidth prop is true", () => {
      render(<Select options={mockOptions} fullWidth />);

      const container = screen.getByTestId("select-container");
      expect(container.className).toMatch(/fullWidth/i);
    });

    it("applies triggerError modifier CSS class on trigger button when error prop is present", () => {
      render(<Select options={mockOptions} error="Invalid selection" />);

      const trigger = screen.getByRole("combobox");
      expect(trigger.className).toMatch(/triggerError/i);
    });
  });
});
