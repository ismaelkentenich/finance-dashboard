import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "../Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Design System/UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const OpenDialog: Story = {
  args: {
    isOpen: true,
    title: "Adicionar Nova Transação",
    description: "Preencha as informações para registrar a movimentação financeira.",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "14px", color: "var(--color-neutral-700)" }}>
          Este é um exemplo de conteúdo aninhado dentro do modal acessível.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="primary">Confirmar</Button>
        </div>
      </div>
    ),
  },
};
