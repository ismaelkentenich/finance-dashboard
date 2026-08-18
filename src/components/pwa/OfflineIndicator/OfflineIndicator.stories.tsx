import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfflineIndicator } from "./OfflineIndicator";

const meta: Meta<typeof OfflineIndicator> = {
  title: "PWA/OfflineIndicator",
  component: OfflineIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a localized and accessible status indicator when the application loses network connectivity.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OfflineIndicator>;

export const Offline: Story = {
  beforeEach: () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });

    window.dispatchEvent(new Event("offline"));

    return () => {
      Object.defineProperty(navigator, "onLine", {
        configurable: true,
        value: true,
      });

      window.dispatchEvent(new Event("online"));
    };
  },
};

export const Online: Story = {
  beforeEach: () => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });

    window.dispatchEvent(new Event("online"));
  },
};
