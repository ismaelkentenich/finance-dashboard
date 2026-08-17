import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "../Switch";

describe("Switch Accessibility (WCAG 2.1 AA Compliance)", () => {
  it("has no automated accessibility violations with aria-label", async () => {
    const { container } = render(<Switch aria-label="Configuração de áudio" checked={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no automated accessibility violations when rendered with label", async () => {
    const { container } = render(<Switch label="Exibir cartões de resumo" checked={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no violations in disabled state", async () => {
    const { container } = render(<Switch label="Recurso indisponível" disabled={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
