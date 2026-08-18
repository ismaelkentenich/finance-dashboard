import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { BUTTON_SIZE_MAP, BUTTON_VARIANT_MAP } from "./Button.constants";
import type { ButtonSize, ButtonVariant } from "./Button.types";

const ALL_VARIANTS = Object.keys(BUTTON_VARIANT_MAP) as ButtonVariant[];
const ALL_SIZES = Object.keys(BUTTON_SIZE_MAP) as ButtonSize[];

const meta: Meta<typeof Button> = {
  title: "Design System/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Standard interactive button component supporting multiple semantic style variants, sizes, full-width layouts, and accessible loading/disabled states.",
      },
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ALL_VARIANTS,
      description: "Semantic visual style variant of the button",
    },
    size: {
      control: "select",
      options: ALL_SIZES,
      description: "Dimension height and padding size",
    },
    isLoading: {
      control: "boolean",
      description: "Displays an accessible spinner and disables user interaction",
    },
    disabled: {
      control: "boolean",
      description: "Prevents user clicks and triggers disabled CSS styling",
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches button to fill 100% width of the container",
    },
    children: {
      control: "text",
      description: "Button text content or nested icon elements",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Salvar Transação",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Exportar Extrato",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Excluir Registro",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Cancelar",
  },
};

export const LoadingState: Story = {
  args: {
    variant: "primary",
    isLoading: true,
    children: "Processando...",
  },
};

export const DisabledState: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Ação Indisponível",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {ALL_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)} Action
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {ALL_SIZES.map((size) => (
        <Button key={size} size={size} variant="primary">
          Size {size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

export const ButtonMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      {ALL_SIZES.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
            Size: {size.toUpperCase()}
          </h4>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
            {ALL_VARIANTS.map((variant) => (
              <Button key={`${size}-${variant}`} size={size} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}

            <Button size={size} variant="primary" isLoading>
              Loading
            </Button>

            <Button size={size} variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};
