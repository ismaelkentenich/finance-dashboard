import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ErrorBanner } from "./ErrorBanner";

const meta: Meta<typeof ErrorBanner> = {
  title: "Design System/UI/ErrorBanner",
  component: ErrorBanner,
  tags: ["autodocs"],
  args: {
    onRetry: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBanner>;

export const Default: Story = {
  args: {
    title: "Erro de Comunicação",
    message: "Não foi possível carregar os dados financeiros. Verifique sua conexão.",
    retryLabel: "Tentar novamente",
  },
};

export const WithoutTitle: Story = {
  args: {
    message: "Ocorreu uma falha inesperada na requisição.",
  },
};
