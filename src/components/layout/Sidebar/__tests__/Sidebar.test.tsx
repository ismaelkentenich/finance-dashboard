import { LocaleProvider } from "@/contexts/LocaleContext";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "../Sidebar";

let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("Sidebar Component", () => {
  beforeEach(() => {
    currentPathname = "/";
  });

  it("renders main branding with localized text", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByText("FinFlow")).toBeInTheDocument();
  });

  it("renders navigation links for overview and transactions with correct routes", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByRole("link", { name: /Visão Geral/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Transações/i })).toHaveAttribute(
      "href",
      "/transactions"
    );
  });

  it("highlights active page based on pathname", () => {
    currentPathname = "/";
    const { rerender } = renderWithLocale(<Sidebar />);

    const overviewLink = screen.getByRole("link", { name: /Visão Geral/i });
    const transactionsLink = screen.getByRole("link", { name: /Transações/i });

    expect(overviewLink).toHaveAttribute("aria-current", "page");
    expect(transactionsLink).not.toHaveAttribute("aria-current");

    currentPathname = "/transactions";
    rerender(
      <LocaleProvider>
        <Sidebar />
      </LocaleProvider>
    );

    expect(overviewLink).not.toHaveAttribute("aria-current");
    expect(transactionsLink).toHaveAttribute("aria-current", "page");
  });

  it("renders user information in the sidebar footer", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Conta Premium")).toBeInTheDocument();
  });

  it("renders navigation landmarks and accessible names", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByRole("complementary", { name: "Main Navigation" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked in mobile mode", () => {
    const handleClose = vi.fn();
    renderWithLocale(<Sidebar isOpen onClose={handleClose} />);

    const closeButton = screen.getByTestId("sidebar-close-button");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    renderWithLocale(<Sidebar isOpen onClose={handleClose} />);

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when navigation links are clicked", () => {
    const handleClose = vi.fn();
    renderWithLocale(<Sidebar isOpen onClose={handleClose} />);

    const overviewLink = screen.getByRole("link", { name: /visão geral/i });
    fireEvent.click(overviewLink);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  describe("Sidebar Motion Indicator & Active State", () => {
    it("renders active motion indicator only inside the active route link", () => {
      currentPathname = "/";
      const { rerender } = renderWithLocale(<Sidebar />);

      const overviewLink = screen.getByRole("link", { name: /Visão Geral/i });
      const transactionsLink = screen.getByRole("link", { name: /Transações/i });
      const settingsLink = screen.getByRole("link", { name: /Configurações/i });

      const indicators = screen.getAllByTestId("active-sidebar-indicator");
      expect(indicators).toHaveLength(1);
      expect(overviewLink).toContainElement(indicators[0]);

      currentPathname = "/transactions";
      rerender(
        <LocaleProvider>
          <Sidebar />
        </LocaleProvider>
      );

      const updatedIndicators = screen.getAllByTestId("active-sidebar-indicator");
      expect(updatedIndicators).toHaveLength(1);
      expect(transactionsLink).toContainElement(updatedIndicators[0]);
      expect(overviewLink).not.toContainElement(updatedIndicators[0]);
      expect(settingsLink).not.toContainElement(updatedIndicators[0]);
    });
  });
});
