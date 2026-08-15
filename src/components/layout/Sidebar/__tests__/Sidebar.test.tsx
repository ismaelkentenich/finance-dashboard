import { LocaleProvider } from "@/contexts/LocaleContext";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../Sidebar";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("Sidebar Component", () => {
  it("renders main branding with localized text", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByText("FinFlow")).toBeInTheDocument();
  });

  it("renders navigation links for overview and transactions", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByRole("link", { name: /Visão Geral/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Transações/i })).toHaveAttribute(
      "href",
      "#transactions"
    );
  });

  it("renders user information in the sidebar footer", () => {
    renderWithLocale(<Sidebar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Conta Premium")).toBeInTheDocument();
  });

  it("renders navigation links correctly", () => {
    render(
      <LocaleProvider>
        <Sidebar />
      </LocaleProvider>
    );

    expect(screen.getByRole("complementary", { name: "Main Navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /visão geral/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /transações/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked in mobile mode", () => {
    const handleClose = vi.fn();
    render(
      <LocaleProvider>
        <Sidebar isOpen onClose={handleClose} />
      </LocaleProvider>
    );

    const closeButton = screen.getByTestId("sidebar-close-button");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    render(
      <LocaleProvider>
        <Sidebar isOpen onClose={handleClose} />
      </LocaleProvider>
    );

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when navigation links are clicked", () => {
    const handleClose = vi.fn();
    render(
      <LocaleProvider>
        <Sidebar isOpen onClose={handleClose} />
      </LocaleProvider>
    );

    const overviewLink = screen.getByRole("link", { name: /visão geral/i });
    fireEvent.click(overviewLink);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
