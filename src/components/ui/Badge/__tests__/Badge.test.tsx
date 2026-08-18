import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../Badge";

describe("Badge Component", () => {
  it("displays the received text content inside the container", () => {
    render(<Badge>Sample Status</Badge>);

    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Sample Status");
  });

  it("appends extra custom className when passed via props", () => {
    render(<Badge className="custom-extra-class">Custom Class Badge</Badge>);

    const badge = screen.getByTestId("badge");
    expect(badge.className).toContain("custom-extra-class");
  });

  it("assigns the neutral variant class by default when no variant prop is provided", () => {
    render(<Badge data-testid="default-badge">Default Neutral</Badge>);

    const badge = screen.getByTestId("default-badge");
    expect(badge.className).toMatch(/badgeneutral/i);
  });

  it("assigns the neutral variant class when variant is explicitly set to neutral", () => {
    render(
      <Badge variant="neutral" data-testid="neutral-badge">
        Housing
      </Badge>
    );

    const badge = screen.getByTestId("neutral-badge");
    expect(badge.className).toMatch(/badgeneutral/i);
    expect(badge.className).not.toMatch(/badgesuccess|badgedanger|badgeinfo/i);
  });

  it("assigns the success variant class when variant is set to success", () => {
    render(
      <Badge variant="success" data-testid="success-badge">
        +12.4%
      </Badge>
    );

    const badge = screen.getByTestId("success-badge");
    expect(badge.className).toMatch(/badgesuccess/i);
    expect(badge.className).not.toMatch(/badgedanger|badgeneutral|badgeinfo/i);
  });

  it("assigns the danger variant class when variant is set to danger", () => {
    render(
      <Badge variant="danger" data-testid="danger-badge">
        -5.2%
      </Badge>
    );

    const badge = screen.getByTestId("danger-badge");
    expect(badge.className).toMatch(/badgedanger/i);
    expect(badge.className).not.toMatch(/badgesuccess|badgeneutral|badgeinfo/i);
  });

  it("assigns the info variant class when variant is set to info", () => {
    render(
      <Badge variant="info" data-testid="info-badge">
        Pending
      </Badge>
    );

    const badge = screen.getByTestId("info-badge");
    expect(badge.className).toMatch(/badgeinfo/i);
    expect(badge.className).not.toMatch(/badgesuccess|badgedanger|badgeneutral/i);
  });
});
