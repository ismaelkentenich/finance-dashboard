import { LocaleProvider } from "@/contexts/LocaleContext";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ToastContainer } from "../Toast";

describe("Toast Accessibility (WCAG 2.1 AA Compliance)", () => {
  it("has zero automated accessibility violations", async () => {
    const { container } = render(
      <LocaleProvider>
        <ToastContainer
          toasts={[
            {
              id: "1",
              type: "success",
              title: "Sucesso",
              message: "Ação concluída",
              duration: 5000,
            },
            { id: "2", type: "error", title: "Erro", message: "Ação falhou", duration: 5000 },
          ]}
          onDismiss={vi.fn()}
        />
      </LocaleProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
