import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { customRender } from "@/test/utils";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineIndicator } from "../OfflineIndicator";

vi.mock("@/hooks/useOnlineStatus");

describe("OfflineIndicator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render anything while the application is online", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(true);

    customRender(<OfflineIndicator />);

    expect(screen.queryByTestId("offline-indicator")).not.toBeInTheDocument();
  });

  it("renders the offline indicator when the application is offline", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);

    customRender(<OfflineIndicator />);

    expect(screen.getByTestId("offline-indicator")).toBeInTheDocument();
  });

  it("renders localized offline message in pt-BR", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);

    customRender(<OfflineIndicator />, {
      locale: "pt-BR",
    });

    expect(
      screen.getByText("Você está offline. Alguns dados podem estar desatualizados.")
    ).toBeInTheDocument();
  });

  it("renders localized offline message in en-US", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);

    customRender(<OfflineIndicator />, {
      locale: "en-US",
    });

    expect(screen.getByText("You are offline. Some data may be out of date.")).toBeInTheDocument();
  });

  it("exposes a polite live region for assistive technologies", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);

    customRender(<OfflineIndicator />);

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("renders the offline icon as decorative content", () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);

    customRender(<OfflineIndicator />);

    const icon = screen.getByTestId("offline-indicator-icon");

    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
