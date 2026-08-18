import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TransactionFormModal } from "./TransactionFormModal";

const meta: Meta<typeof TransactionFormModal> = {
  title: "Features/Dashboard/TransactionFormModal",
  component: TransactionFormModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onClose: fn(),
    onSuccess: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TransactionFormModal>;

export const DefaultOpen: Story = {
  args: {
    isOpen: true,
  },
};
