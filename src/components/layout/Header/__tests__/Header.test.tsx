import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider, useModal } from "@/contexts/ModalContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "../Header";

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

function renderHeader() {
  return render(
    <LocaleProvider>
      <ModalProvider>
        <Header />
        <ModalConsumer />
      </ModalProvider>
    </LocaleProvider>
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
        screen.getByRole("heading", { level: 1, name: "Visão Geral Financeira" })
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
    it("renders default period badge label ('Mês Atual') when no query params exist", () => {
      renderHeader();

      const badge = screen.getByTestId("header-period-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Mês Atual");
      expect(badge).toHaveAttribute("aria-label", "Selected period: Mês Atual");
    });

    it("renders 'Mês Anterior' when URL contains period=previous-month", () => {
      mockSearchParams = new URLSearchParams("period=previous-month");
      renderHeader();

      const badge = screen.getByTestId("header-period-badge");
      expect(badge).toHaveTextContent("Mês Anterior");
      expect(badge).toHaveAttribute("aria-label", "Selected period: Mês Anterior");
    });

    it("renders 'Últimos 3 Meses' when URL contains period=last-3-months", () => {
      mockSearchParams = new URLSearchParams("period=last-3-months");
      renderHeader();

      const badge = screen.getByTestId("header-period-badge");
      expect(badge).toHaveTextContent("Últimos 3 Meses");
      expect(badge).toHaveAttribute("aria-label", "Selected period: Últimos 3 Meses");
    });
  });

  describe("Modal context integration", () => {
    it("opens the transaction modal when clicking the new transaction button", async () => {
      const user = userEvent.setup();
      renderHeader();

      expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");

      const newTransactionBtn = screen.getByTestId("new-transaction-header-button");
      await user.click(newTransactionBtn);

      expect(screen.getByTestId("modal-state")).toHaveTextContent("open");
    });
  });

  describe("Language switching (i18n)", () => {
    it("switches language to English and updates header title, buttons and period badge", async () => {
      const user = userEvent.setup();
      renderHeader();

      // No estado inicial pt-BR o botão EN possui o aria-label "Mudar idioma para Inglês"
      const enButton = screen.getByRole("button", {
        name: /mudar idioma para ingl[êe]s|switch language to english/i,
      });
      await user.click(enButton);

      expect(
        screen.getByRole("heading", { level: 1, name: "Financial Overview" })
      ).toBeInTheDocument();

      const badge = screen.getByTestId("header-period-badge");
      expect(badge).toHaveTextContent("Current Month");
      expect(badge).toHaveAttribute("aria-label", "Selected period: Current Month");
    });

    it("switches language back to Portuguese when clicking PT button", async () => {
      const user = userEvent.setup();
      renderHeader();

      // 1. Muda para Inglês
      const enButton = screen.getByRole("button", {
        name: /mudar idioma para ingl[êe]s|switch language to english/i,
      });
      await user.click(enButton);

      // 2. Retorna para Português
      const ptButton = screen.getByRole("button", {
        name: /mudar idioma para portugu[êe]s|switch language to portuguese/i,
      });
      await user.click(ptButton);

      expect(
        screen.getByRole("heading", { level: 1, name: "Visão Geral Financeira" })
      ).toBeInTheDocument();

      const badge = screen.getByTestId("header-period-badge");
      expect(badge).toHaveTextContent("Mês Atual");
    });
  });
});
