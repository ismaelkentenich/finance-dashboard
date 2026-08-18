import { customRender } from "@/test/utils";
import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import DashboardLayout from "../layout";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

function renderDashboardLayout(children: React.ReactNode, locale: "pt-BR" | "en-US" = "pt-BR") {
  return customRender(<DashboardLayout>{children}</DashboardLayout>, {
    locale,
  });
}

describe("DashboardLayout Component", () => {
  it("renders SkipToContent, Sidebar, Header, and pageContainer containing children", () => {
    renderDashboardLayout(<div data-testid="dashboard-children-content">Conteúdo da Página</div>);

    expect(screen.getByTestId("skip-to-content")).toBeInTheDocument();

    expect(
      screen.getByRole("complementary", {
        name: /navegação principal/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("banner")).toBeInTheDocument();

    const mainElement = screen.getByRole("main");

    expect(mainElement).toHaveAttribute("id", "main-content");
    expect(mainElement).toHaveAttribute("tabIndex", "-1");

    expect(screen.getByTestId("dashboard-children-content")).toBeInTheDocument();
  });

  it("renders Sidebar landmark with localized accessible name in en-US", () => {
    renderDashboardLayout(<div>Test Child</div>, "en-US");

    expect(
      screen.getByRole("complementary", {
        name: /main navigation/i,
      })
    ).toBeInTheDocument();
  });

  it("applies dashboardShell styling class with ambient background capability", () => {
    const { container } = renderDashboardLayout(<div>Test Child</div>);

    const shellElement = container.firstChild as HTMLElement;

    expect(shellElement.className).toMatch(/dashboardShell/i);
  });
});
