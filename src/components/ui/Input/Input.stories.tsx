import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "lucide-react";
import { fn } from "storybook/test";
import { Input } from "./Input";
import type { InputSize, InputVariant } from "./Input.types";

const ALL_VARIANTS: InputVariant[] = ["filled", "outline", "ghost"];
const ALL_SIZES: InputSize[] = ["sm", "md", "lg"];

const meta: Meta<typeof Input> = {
  title: "Design System/UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Customizable text input component supporting visual variants (filled, outline, ghost), multiple sizing scales, start/end icons, and a clearable action button.",
      },
    },
  },
  args: {
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ALL_VARIANTS,
      description: "Visual style variant of the input",
      table: {
        defaultValue: { summary: "filled" },
      },
    },
    size: {
      control: "select",
      options: ALL_SIZES,
      description: "Dimension height and padding size",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    disabled: { control: "boolean", description: "Disables user interaction" },
    fullWidth: {
      control: "boolean",
      description: "Stretches input to fill 100% of the container width",
    },
    error: { control: "text", description: "Validation error message text" },
    helperText: { control: "text", description: "Informative auxiliary helper text" },
    label: { control: "text", description: "Accessible top label text" },
    placeholder: { control: "text", description: "Input placeholder text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Transaction Description",
    placeholder: "e.g. Supermarket Groceries",
    variant: "filled",
    size: "md",
  },
};

export const OutlineVariant: Story = {
  args: {
    label: "Full Name",
    placeholder: "Enter your name",
    variant: "outline",
    size: "md",
  },
};

export const GhostVariant: Story = {
  args: {
    placeholder: "Quick borderless search...",
    variant: "ghost",
    size: "md",
    startIcon: <Search size={16} />,
  },
};

export const SearchWithIconAndClear: Story = {
  args: {
    placeholder: "Search by description...",
    variant: "filled",
    size: "md",
    value: "Supermarket",
    startIcon: <Search size={16} />,
    clearButtonAriaLabel: "Clear search",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    type: "number",
    variant: "filled",
    helperText: "Enter the numeric amount in USD.",
  },
};

export const WithError: Story = {
  args: {
    label: "Date",
    type: "date",
    variant: "outline",
    error: "Invalid date format.",
    defaultValue: "2026-08-14",
  },
};

export const Disabled: Story = {
  args: {
    label: "Source Account",
    value: "Primary Checking Account",
    disabled: true,
    variant: "filled",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "360px" }}>
      {ALL_SIZES.map((size) => (
        <Input
          key={size}
          size={size}
          variant="filled"
          label={`Size ${size.toUpperCase()}`}
          placeholder={`Input height ${size.toUpperCase()}`}
        />
      ))}
    </div>
  ),
};

export const VariantsMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem",
        maxWidth: "900px",
      }}
    >
      {ALL_VARIANTS.map((variant) => (
        <div key={variant} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h4
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-neutral-500)",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "4px",
            }}
          >
            Variant: {variant}
          </h4>

          <Input variant={variant} placeholder={`Standard (${variant})`} />

          <Input variant={variant} startIcon={<Search size={16} />} placeholder="With start icon" />

          <Input variant={variant} error="Invalid input value" defaultValue="Incorrect value" />

          <Input variant={variant} disabled value={`Disabled (${variant})`} />
        </div>
      ))}
    </div>
  ),
};
