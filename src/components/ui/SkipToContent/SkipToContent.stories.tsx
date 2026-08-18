import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkipToContent } from "./SkipToContent";

const meta: Meta<typeof SkipToContent> = {
  title: "Design System/UI/SkipToContent",
  component: SkipToContent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Accessible bypass link for WCAG 2.4.1 compliance. Hidden off-screen by default and displayed at the top when receiving keyboard focus via Tab.",
      },
    },
  },
  argTypes: {
    targetId: {
      control: "text",
      description: "Target HTML element ID to jump focus to",
      table: {
        defaultValue: { summary: "main-content" },
      },
    },
    label: {
      control: "text",
      description: "Accessible text label displayed inside the anchor",
      table: {
        defaultValue: { summary: "Pular para o conteúdo principal" },
      },
    },
    className: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipToContent>;

export const Default: Story = {
  args: {
    targetId: "main-content",
    label: "Pular para o conteúdo principal",
  },
  render: (args) => (
    <div>
      <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", marginBottom: "1rem" }}>
        💡{" "}
        <em>
          Pressione a tecla <strong>Tab</strong> no teclado para visualizar o link aparecendo no
          topo.
        </em>
      </p>
      <SkipToContent {...args} />
      <div
        id="main-content"
        tabIndex={-1}
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          border: "1px dashed var(--border-color)",
          borderRadius: "8px",
        }}
      >
        Área de Conteúdo Principal (Alvo do Link)
      </div>
    </div>
  ),
};
