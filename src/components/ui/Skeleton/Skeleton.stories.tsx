import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Design System/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Utility component for loading states (shimmer placeholder). Accessible by default via `aria-hidden="true"` to avoid cluttering screen readers.',
      },
    },
  },
  argTypes: {
    width: {
      control: "text",
      description: "Width of the skeleton (supports px, rem, %, or numeric values).",
      table: {
        defaultValue: { summary: "100%" },
        type: { summary: "string | number" },
      },
    },
    height: {
      control: "text",
      description: "Height of the skeleton (supports px, rem, %, or numeric values).",
      table: {
        defaultValue: { summary: "1rem" },
        type: { summary: "string | number" },
      },
    },
    borderRadius: {
      control: "text",
      description: "Border radius of the skeleton (supports px, rem, %, etc.).",
      table: {
        defaultValue: { summary: "undefined" },
        type: { summary: "string" },
      },
    },
    className: {
      control: false,
      description: "Additional CSS classes.",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Atomic Stories (Basic Variations)
 */
export const Default: Story = {
  args: {
    width: "100%",
    height: "5rem",
  },
};

export const CircularAvatar: Story = {
  args: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
};

export const Block: Story = {
  args: {
    width: "100%",
    height: "180px",
    borderRadius: "8px",
  },
};

/**
 * Composition Stories (Real-World Dashboard Scenarios)
 */
export const SummaryCardSkeleton: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "1.5rem",
        backgroundColor: "var(--color-neutral-50, #ffffff)",
        border: "1px solid var(--border-color, #e2e8f0)",
        borderRadius: "8px",
        maxWidth: "300px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width="100px" height="14px" />
        <Skeleton width="24px" height="24px" borderRadius="50%" />
      </div>
      <Skeleton width="160px" height="28px" borderRadius="4px" />
      <Skeleton width="120px" height="12px" />
    </div>
  ),
};

export const TransactionRowList: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "600px",
        padding: "1rem",
        backgroundColor: "var(--color-neutral-50, #ffffff)",
        borderRadius: "8px",
        border: "1px solid var(--border-color, #e2e8f0)",
      }}
    >
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
              <Skeleton width="50%" height="14px" />
              <Skeleton width="30%" height="12px" />
            </div>
          </div>
          <Skeleton width="80px" height="16px" />
        </div>
      ))}
    </div>
  ),
};
