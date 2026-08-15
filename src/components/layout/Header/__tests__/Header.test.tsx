import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider, useModal } from "@/contexts/ModalContext";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "../Header";

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
  it("renders the localized page header title and period badge", () => {
    renderHeader();
    expect(
      screen.getByRole("heading", { level: 1, name: "Visão Geral Financeira" })
    ).toBeInTheDocument();
    expect(screen.getByText("Agosto 2026")).toBeInTheDocument();
  });

  it("opens the transaction modal when clicking the new transaction button", async () => {
    const user = userEvent.setup();
    renderHeader();

    expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");
    await user.click(screen.getByTestId("new-transaction-header-button"));
    expect(screen.getByTestId("modal-state")).toHaveTextContent("open");
  });

  it("switches language to English and updates UI text accordingly", async () => {
    const user = userEvent.setup();
    renderHeader();

    const enButton = screen.getByRole("button", {
      name: /mudar idioma para ingl[êe]s|switch language to english/i,
    });
    await user.click(enButton);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Financial Overview");
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

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Visão Geral Financeira");
  });
});
