import { LocaleProvider } from "@/contexts/LocaleContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "../Toast";

describe("Toast UI Component", () => {
  it("renders message and optional title correctly", () => {
    render(
      <LocaleProvider>
        <Toast
          toast={{
            id: "t1",
            type: "success",
            title: "Congratulations!",
            message: "Action completed successfully",
          }}
          onDismiss={vi.fn()}
        />
      </LocaleProvider>
    );

    expect(screen.getByTestId("toast-title")).toHaveTextContent("Congratulations!");
    expect(screen.getByTestId("toast-message")).toHaveTextContent("Action completed successfully");
    expect(screen.getByTestId("toast-icon-success")).toBeInTheDocument();
  });

  it("renders warning variant correctly with role='alert'", () => {
    render(
      <LocaleProvider>
        <Toast
          toast={{
            id: "tw",
            type: "warning",
            title: "Warning!",
            message: "Limit close to threshold",
          }}
          onDismiss={vi.fn()}
        />
      </LocaleProvider>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(screen.getByTestId("toast-icon-warning")).toBeInTheDocument();
  });

  it("applies role='alert' and aria-live='assertive' on error variants", () => {
    render(
      <LocaleProvider>
        <Toast
          toast={{
            id: "t2",
            type: "error",
            message: "Something went wrong",
          }}
          onDismiss={vi.fn()}
        />
      </LocaleProvider>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("applies role='status' and aria-live='polite' on success/info variants", () => {
    render(
      <LocaleProvider>
        <Toast
          toast={{
            id: "t3",
            type: "info",
            message: "Did you know?",
          }}
          onDismiss={vi.fn()}
        />
      </LocaleProvider>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });
});
