import { Button } from "@/components/ui/Button";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterX } from "lucide-react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Design System/UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Nenhuma transação encontrada",
    description: "Não existem registros financeiros correspondentes aos filtros aplicados.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Nenhum resultado para este período",
    description: "Tente selecionar outro mês ou limpe os filtros para visualizar os dados.",
    action: (
      <Button variant="secondary" size="sm">
        <FilterX size={16} aria-hidden="true" />
        Limpar Filtros
      </Button>
    ),
  },
};
