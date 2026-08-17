import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import DashboardLayout from "../layout";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

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

  it("applies dashboardShell styling class with ambient background capability", () => {
    const { container } = renderDashboardLayout(<div>Test Child</div>);
    const shellElement = container.firstChild as HTMLElement;

    expect(shellElement.className).toMatch(/dashboardShell/i);
  });
});
