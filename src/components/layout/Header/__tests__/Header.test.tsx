import { Header } from "@/components/layout/Header";
import { useModal } from "@/contexts/ModalContext";
import { customRender } from "@/test/utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

function ModalConsumer() {
  const { isTransactionModalOpen } = useModal();

  return <div data-testid="modal-state">{isTransactionModalOpen ? "open" : "closed"}</div>;
}

function renderHeader(
  locale: "pt-BR" | "en-US" = "pt-BR",
  props: React.ComponentProps<typeof Header> = {}
) {
  return customRender(
    <>
      <Header {...props} />
      <ModalConsumer />
    </>,
    {
      locale,
    }
  );
}

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe("Layout and title rendering", () => {
    it("renders the localized page header title in level 1 heading", () => {
      renderHeader();

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Visão Geral Financeira",
        })
      ).toBeInTheDocument();
    });

    it("renders the new transaction action button", () => {
      renderHeader();

      const newTransactionBtn = screen.getByTestId("new-transaction-header-button");

      expect(newTransactionBtn).toBeInTheDocument();
      expect(newTransactionBtn).toHaveTextContent("Nova Transação");
    });
  });

  describe("Dynamic period badge rendering", () => {
    it("renders default localized period badge when no query params exist", () => {
      renderHeader("pt-BR");

      const badge = screen.getByTestId("header-period-badge");

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Mês Atual");
      expect(badge).toHaveAccessibleName("Período selecionado: Mês Atual");
    });

    it("renders previous month with localized accessible name", () => {
      mockSearchParams = new URLSearchParams("period=previous-month");

      renderHeader("pt-BR");

      const badge = screen.getByTestId("header-period-badge");

      expect(badge).toHaveTextContent("Mês Anterior");
      expect(badge).toHaveAccessibleName("Período selecionado: Mês Anterior");
    });

    it("renders last three months with localized accessible name", () => {
      mockSearchParams = new URLSearchParams("period=last-3-months");

      renderHeader("pt-BR");

      const badge = screen.getByTestId("header-period-badge");

      expect(badge).toHaveTextContent("Últimos 3 Meses");
      expect(badge).toHaveAccessibleName("Período selecionado: Últimos 3 Meses");
    });

    it("renders period accessible name in en-US", () => {
      renderHeader("en-US");

      expect(screen.getByTestId("header-period-badge")).toHaveAccessibleName(
        "Selected period: Current Month"
      );
    });
  });

  describe("Accessibility and localization", () => {
    it("renders language selector group with localized accessible name in pt-BR", () => {
      renderHeader("pt-BR");

      expect(
        screen.getByRole("group", {
          name: /seleção de idioma/i,
        })
      ).toBeInTheDocument();
    });

    it("renders language selector group with localized accessible name in en-US", () => {
      renderHeader("en-US");

      expect(
        screen.getByRole("group", {
          name: /language selection/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Modal context integration", () => {
    it("opens the transaction modal when clicking the new transaction button", async () => {
      const user = userEvent.setup();

      renderHeader();

      expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");

      await user.click(screen.getByTestId("new-transaction-header-button"));

      expect(screen.getByTestId("modal-state")).toHaveTextContent("open");
    });
  });

  describe("Language switching (i18n)", () => {
    it("switches language to English and updates header title, buttons and period badge", async () => {
      const user = userEvent.setup();

      renderHeader();

      const enButton = screen.getByRole("button", {
        name: /mudar idioma para ingl[êe]s|switch language to english/i,
      });

      await user.click(enButton);

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Financial Overview",
        })
      ).toBeInTheDocument();

      const badge = screen.getByTestId("header-period-badge");

      expect(badge).toHaveTextContent("Current Month");
      expect(badge).toHaveAccessibleName("Selected period: Current Month");

      expect(
        screen.getByRole("group", {
          name: /language selection/i,
        })
      ).toBeInTheDocument();
    });

    it("switches language back to Portuguese when clicking PT button", async () => {
      const user = userEvent.setup();

      renderHeader();

      const enButton = screen.getByRole("button", {
        name: /mudar idioma para ingl[êe]s|switch language to english/i,
      });

      await user.click(enButton);

      const ptButton = screen.getByRole("button", {
        name: /mudar idioma para portugu[êe]s|switch language to portuguese/i,
      });

      await user.click(ptButton);

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Visão Geral Financeira",
        })
      ).toBeInTheDocument();

      expect(screen.getByTestId("header-period-badge")).toHaveAccessibleName(
        "Período selecionado: Mês Atual"
      );

      expect(
        screen.getByRole("group", {
          name: /seleção de idioma/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Header Component Responsiveness & Behavior", () => {
    it("renders the main heading, primary CTA, period badge, and locale switcher", () => {
      renderHeader();

      expect(
        screen.getByRole("heading", {
          level: 1,
        })
      ).toBeInTheDocument();

      expect(screen.getByTestId("new-transaction-header-button")).toBeInTheDocument();

      expect(screen.getByTestId("header-period-badge")).toBeInTheDocument();

      expect(
        screen.getByRole("group", {
          name: /seleção de idioma/i,
        })
      ).toBeInTheDocument();
    });

    it("switches active locale without breaking the layout contract", async () => {
      const user = userEvent.setup();

      renderHeader();

      const enButton = screen.getByRole("button", {
        name: /mudar idioma para ingl[êe]s|switch language to english/i,
      });

      await user.click(enButton);

      expect(enButton).toHaveAttribute("aria-pressed", "true");

      expect(screen.getByText("Financial Overview")).toBeInTheDocument();
    });

    it("renders mobile menu button and triggers onToggleMenu", () => {
      const handleToggle = vi.fn();

      renderHeader("pt-BR", {
        onToggleMenu: handleToggle,
        isMenuOpen: false,
      });

      const toggleButton = screen.getByTestId("mobile-menu-toggle");

      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
      expect(toggleButton).toHaveAccessibleName("Abrir menu de navegação");

      fireEvent.click(toggleButton);

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("reflects open state in aria-expanded and localized accessible name", () => {
      renderHeader("pt-BR", {
        onToggleMenu: vi.fn(),
        isMenuOpen: true,
      });

      const toggleButton = screen.getByTestId("mobile-menu-toggle");

      expect(toggleButton).toHaveAttribute("aria-expanded", "true");

      expect(toggleButton).toHaveAccessibleName("Fechar menu de navegação");
    });
  });
});
