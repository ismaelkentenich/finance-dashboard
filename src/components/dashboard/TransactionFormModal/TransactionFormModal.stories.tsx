import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TransactionFormModal } from "./TransactionFormModal";

const meta: Meta<typeof TransactionFormModal> = {
  title: "Features/Dashboard/TransactionFormModal",
  component: TransactionFormModal,
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component:
          "Transaction creation modal with localized currency selection and historical exchange-rate preview when the transaction currency differs from the configured display currency.",
      },
    },
  },

  args: {
    isOpen: true,
    onClose: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof TransactionFormModal>;

export const DefaultOpen: Story = {
  args: {
    isOpen: true,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
