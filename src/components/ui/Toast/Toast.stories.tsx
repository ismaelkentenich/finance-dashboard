import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast, ToastContainer } from "./Toast";
import type { ToastItem } from "./Toast.types";

const meta: Meta<typeof ToastContainer> = {
  title: "Design System/UI/Toast",
  component: ToastContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Colorful notification toast cards matching design reference with circular solid badge icons and smooth animations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

const sampleToasts: ToastItem[] = [
  {
    id: "1",
    type: "success",
    title: "Congratulations!",
    message: "Your transaction has been created and synced with the dashboard.",
    duration: 5000,
  },
  {
    id: "2",
    type: "info",
    title: "Did you know?",
    message: "You can reorder widgets by dragging them on the overview screen.",
    duration: 5000,
  },
  {
    id: "3",
    type: "warning",
    title: "Warning!",
    message: "Your monthly expense budget has reached 85% of total limit.",
    duration: 5000,
  },
  {
    id: "4",
    type: "error",
    title: "Something went wrong!",
    message: "Failed to connect to the banking sync service.",
    duration: 5000,
  },
];

export const Success: Story = {
  render: () => <Toast toast={sampleToasts[0]} onDismiss={() => {}} />,
};

export const InfoVariant: Story = {
  render: () => <Toast toast={sampleToasts[1]} onDismiss={() => {}} />,
};

export const WarningVariant: Story = {
  render: () => <Toast toast={sampleToasts[2]} onDismiss={() => {}} />,
};

export const ErrorVariant: Story = {
  render: () => <Toast toast={sampleToasts[3]} onDismiss={() => {}} />,
};

export const AllColorVariantsStack: Story = {
  args: {
    toasts: sampleToasts,
    onDismiss: () => {},
  },
};
