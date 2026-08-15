import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import DashboardLayout from "../layout";

function renderDashboardLayout(children: React.ReactNode) {
  return render(
    <LocaleProvider>
      <ModalProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </ModalProvider>
    </LocaleProvider>
  );
}

describe("DashboardLayout Component", () => {
  it("renders SkipToContent, Sidebar, Header, and pageContainer containing children", () => {
    renderDashboardLayout(<div data-testid="dashboard-children-content">Conteúdo da Página</div>);

    expect(screen.getByTestId("skip-to-content")).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();

    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveAttribute("id", "main-content");
    expect(mainElement).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByTestId("dashboard-children-content")).toBeInTheDocument();
  });
});
