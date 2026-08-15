import { LocaleProvider } from "@/contexts/LocaleContext";
import { render, screen } from "@testing-library/react";
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
});
