import { customRender } from "@/test/utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "../Toast";

describe("Toast UI Component", () => {
  it("renders message and optional title correctly", () => {
    customRender(
      <Toast
        toast={{
          id: "t1",
          type: "success",
          title: "Congratulations!",
          message: "Action completed successfully",
        }}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByTestId("toast-title")).toHaveTextContent("Congratulations!");

    expect(screen.getByTestId("toast-message")).toHaveTextContent("Action completed successfully");

    expect(screen.getByTestId("toast-icon-success")).toBeInTheDocument();
  });

  it("renders warning variant correctly with role='alert'", () => {
    customRender(
      <Toast
        toast={{
          id: "tw",
          type: "warning",
          title: "Warning!",
          message: "Limit close to threshold",
        }}
        onDismiss={vi.fn()}
      />
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("aria-live", "assertive");

    expect(screen.getByTestId("toast-icon-warning")).toBeInTheDocument();
  });

  it("applies role='alert' and aria-live='assertive' on error variants", () => {
    customRender(
      <Toast
        toast={{
          id: "t2",
          type: "error",
          message: "Something went wrong",
        }}
        onDismiss={vi.fn()}
      />
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("applies role='status' and aria-live='polite' on success/info variants", () => {
    customRender(
      <Toast
        toast={{
          id: "t3",
          type: "info",
          message: "Did you know?",
        }}
        onDismiss={vi.fn()}
      />
    );

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
  });

  describe("Accessibility and localization", () => {
    it("renders localized close button accessible name in pt-BR", () => {
      customRender(
        <Toast
          toast={{
            id: "t4",
            type: "info",
            message: "Mensagem",
          }}
          onDismiss={vi.fn()}
        />,
        {
          locale: "pt-BR",
        }
      );

      expect(
        screen.getByRole("button", {
          name: /fechar diálogo/i,
        })
      ).toBeInTheDocument();
    });

    it("renders localized close button accessible name in en-US", () => {
      customRender(
        <Toast
          toast={{
            id: "t5",
            type: "info",
            message: "Message",
          }}
          onDismiss={vi.fn()}
        />,
        {
          locale: "en-US",
        }
      );

      expect(
        screen.getByRole("button", {
          name: /close dialog/i,
        })
      ).toBeInTheDocument();
    });

    describe("Accessibility and localization", () => {
      it("renders localized close button accessible name in pt-BR", () => {
        customRender(
          <Toast
            toast={{
              id: "t4",
              type: "info",
              message: "Mensagem",
            }}
            onDismiss={vi.fn()}
          />,
          {
            locale: "pt-BR",
          }
        );

        expect(
          screen.getByRole("button", {
            name: /fechar diálogo/i,
          })
        ).toBeInTheDocument();
      });

      it("renders localized close button accessible name in en-US", () => {
        customRender(
          <Toast
            toast={{
              id: "t5",
              type: "info",
              message: "Message",
            }}
            onDismiss={vi.fn()}
          />,
          {
            locale: "en-US",
          }
        );

        expect(
          screen.getByRole("button", {
            name: /close dialog/i,
          })
        ).toBeInTheDocument();
      });

      it("renders toast container region with localized accessible name in pt-BR", () => {
        customRender(<></>, {
          locale: "pt-BR",
        });

        expect(
          screen.getByRole("region", {
            name: /notificações/i,
          })
        ).toBeInTheDocument();
      });

      it("renders toast container region with localized accessible name in en-US", () => {
        customRender(<></>, {
          locale: "en-US",
        });

        expect(
          screen.getByRole("region", {
            name: /notifications/i,
          })
        ).toBeInTheDocument();
      });
    });
  });
});
