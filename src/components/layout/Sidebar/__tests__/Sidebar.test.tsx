import { customRender } from "@/test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "../Sidebar";

let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    currentPathname = "/";
  });

  it("renders main branding with localized text", () => {
    customRender(<Sidebar />);

    expect(screen.getByText("FinFlow")).toBeInTheDocument();
  });

  it("renders navigation links for overview and transactions with correct routes", () => {
    customRender(<Sidebar />);

    expect(screen.getByRole("link", { name: /Visão Geral/i })).toHaveAttribute("href", "/");

    expect(screen.getByRole("link", { name: /Transações/i })).toHaveAttribute(
      "href",
      "/transactions"
    );
  });

  it("highlights active page based on pathname", () => {
    currentPathname = "/";

    const { rerender } = customRender(<Sidebar />);

    expect(screen.getByRole("link", { name: /Visão Geral/i })).toHaveAttribute(
      "aria-current",
      "page"
    );

    expect(screen.getByRole("link", { name: /Transações/i })).not.toHaveAttribute("aria-current");

    currentPathname = "/transactions";

    rerender(<Sidebar />);

    expect(screen.getByRole("link", { name: /Visão Geral/i })).not.toHaveAttribute("aria-current");

    expect(screen.getByRole("link", { name: /Transações/i })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders user information in the sidebar footer", () => {
    customRender(<Sidebar />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Conta Premium")).toBeInTheDocument();
  });

  describe("Accessibility and localization", () => {
    it("renders navigation landmark with localized accessible name in pt-BR", () => {
      customRender(<Sidebar />, {
        locale: "pt-BR",
      });

      expect(
        screen.getByRole("complementary", {
          name: /navegação principal/i,
        })
      ).toBeInTheDocument();
    });

    it("renders navigation landmark with localized accessible name in en-US", () => {
      customRender(<Sidebar />, {
        locale: "en-US",
      });

      expect(
        screen.getByRole("complementary", {
          name: /main navigation/i,
        })
      ).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked in mobile mode", () => {
    const handleClose = vi.fn();

    customRender(<Sidebar isOpen onClose={handleClose} />);

    const closeButton = screen.getByTestId("sidebar-close-button");

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();

    customRender(<Sidebar isOpen onClose={handleClose} />);

    const backdrop = screen.getByTestId("sidebar-backdrop");

    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when navigation links are clicked", () => {
    const handleClose = vi.fn();

    customRender(<Sidebar isOpen onClose={handleClose} />);

    const overviewLink = screen.getByRole("link", {
      name: /visão geral/i,
    });

    fireEvent.click(overviewLink);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
