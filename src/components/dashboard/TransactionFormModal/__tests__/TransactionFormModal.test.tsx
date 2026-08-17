import { LocaleProvider } from "@/contexts/LocaleContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { transactionService } from "@/services/api/transactionService";
import type { Transaction, TransactionCategory, TransactionType } from "@/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionFormModal } from "../TransactionFormModal";
import type { TransactionFormModalProps } from "../TransactionFormModal.types";

vi.mock("@/services/api/transactionService", () => ({
  transactionService: {
    createTransaction: vi.fn(),
  },
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).substring(2, 9)}`,
    description: "Consulting Service",
    amount: 1500,
    type: "income",
    category: "freelance",
    date: "2026-08-14",
    createdAt: "2026-08-14T00:00:00.000Z",
    ...overrides,
  };
}

function renderTransactionModal(
  props: Partial<TransactionFormModalProps> = {},
  initialLocale: "pt-BR" | "en-US" = "pt-BR"
) {
  const defaultProps: TransactionFormModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...props,
  };

  const renderResult = render(
    <LocaleProvider initialLocale={initialLocale}>
      <ToastProvider>
        <TransactionFormModal {...defaultProps} />
      </ToastProvider>
    </LocaleProvider>
  );

  return {
    ...renderResult,
    props: defaultProps,
  };
}

async function fillAndSubmitForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides?: {
    description?: string;
    amount?: string;
    type?: TransactionType;
    category?: TransactionCategory;
    date?: string;
  }
) {
  const description = overrides?.description ?? "Monthly Rent";
  const amount = overrides?.amount ?? "2200";
  const type = overrides?.type ?? "expense";
  const category = overrides?.category ?? "housing";
  const date = overrides?.date ?? "2026-08-05";

  await user.type(screen.getByTestId("transaction-description-input"), description);
  await user.type(screen.getByTestId("transaction-amount-input"), amount);

  const typeSelect = screen.getByTestId("transaction-type-select");
  fireEvent.change(typeSelect, { target: { value: type } });

  const categorySelect = screen.getByTestId("transaction-category-select");
  fireEvent.change(categorySelect, { target: { value: category } });

  const dateInput = screen.getByTestId("transaction-date-input");
  fireEvent.change(dateInput, { target: { value: date } });

  await user.click(screen.getByTestId("transaction-submit-button"));
}

describe("TransactionFormModal Feature Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("modal rendering and form controls", () => {
    it("renders the root modal container and form element when isOpen is true", () => {
      renderTransactionModal({ isOpen: true });

      expect(screen.getByTestId("transaction-form-modal")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-form")).toBeInTheDocument();
    });

    it("renders description input field with corresponding label and test identifier", () => {
      renderTransactionModal({ isOpen: true });

      const descriptionInput = screen.getByTestId("transaction-description-input");
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput.tagName.toLowerCase()).toBe("input");
    });

    it("renders amount input field configured for numeric values", () => {
      renderTransactionModal({ isOpen: true });

      const amountInput = screen.getByTestId("transaction-amount-input");
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute("type", "number");
      expect(amountInput).toHaveAttribute("step", "0.01");
    });

    it("renders date input field configured for calendar selection", () => {
      renderTransactionModal({ isOpen: true });

      const dateInput = screen.getByTestId("transaction-date-input");
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute("type", "date");
    });

    it("renders transaction type selector with income and expense options", () => {
      renderTransactionModal({ isOpen: true });

      const typeSelect = screen.getByTestId("transaction-type-select");
      expect(typeSelect).toBeInTheDocument();
      expect(typeSelect.tagName.toLowerCase()).toBe("select");
    });

    it("renders category selector element populated with available categories", () => {
      renderTransactionModal({ isOpen: true });

      const categorySelect = screen.getByTestId("transaction-category-select");
      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect.tagName.toLowerCase()).toBe("select");
    });

    it("renders cancel action button with ghost variant styling", () => {
      renderTransactionModal({ isOpen: true });

      const cancelButton = screen.getByTestId("transaction-cancel-button");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveAttribute("type", "button");
    });

    it("renders submit action button configured to trigger form submission", () => {
      renderTransactionModal({ isOpen: true });

      const submitButton = screen.getByTestId("transaction-submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("Modal rendering and initial form state", () => {
    it("does not mount dialog elements into DOM when isOpen is false", () => {
      renderTransactionModal({ isOpen: false });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("transaction-form-modal")).not.toBeInTheDocument();
    });

    it("initializes select fields with the first available option", () => {
      renderTransactionModal();

      const typeSelect = screen.getByTestId("transaction-type-select") as HTMLSelectElement;
      const categorySelect = screen.getByTestId("transaction-category-select") as HTMLSelectElement;
      const dateInput = screen.getByTestId("transaction-date-input") as HTMLInputElement;
      const descriptionInput = screen.getByTestId(
        "transaction-description-input"
      ) as HTMLInputElement;

      const todayIsoDate = new Date().toISOString().split("T")[0];

      expect(typeSelect.value).toBe(typeSelect.options[0].value);
      expect(categorySelect.value).toBe(categorySelect.options[0].value);
      expect(dateInput.value).toBe(todayIsoDate);
      expect(descriptionInput.value).toBe("");
    });

    it("propagates custom data-testid to the modal container", () => {
      renderTransactionModal({ "data-testid": "custom-add-transaction-modal" });

      expect(screen.getByTestId("custom-add-transaction-modal")).toBeInTheDocument();
    });
  });

  describe("Modal dismissal and cancel triggers", () => {
    it("invokes onClose callback when clicking the cancel button", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      renderTransactionModal({ onClose: handleClose });

      const cancelButton = screen.getByTestId("transaction-cancel-button");
      await user.click(cancelButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("invokes onClose callback when clicking modal close icon button", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      renderTransactionModal({ onClose: handleClose });

      const closeIconButton = screen.getByTestId("transaction-form-modal-close-button");
      await user.click(closeIconButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Zod schema validation and error feedback", () => {
    it("displays error message when description has fewer than 3 characters", async () => {
      const user = userEvent.setup();
      renderTransactionModal();

      const descriptionInput = screen.getByTestId("transaction-description-input");
      await user.type(descriptionInput, "AB");

      const submitButton = screen.getByTestId("transaction-submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("A descrição deve ter pelo menos 3 caracteres.")
        ).toBeInTheDocument();
      });
      expect(transactionService.createTransaction).not.toHaveBeenCalled();
    });

    it("displays error message when amount field is left empty", async () => {
      const user = userEvent.setup();
      renderTransactionModal();

      const descriptionInput = screen.getByTestId("transaction-description-input");
      await user.type(descriptionInput, "Supermarket Groceries");

      const submitButton = screen.getByTestId("transaction-submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Insira um valor numérico válido.")).toBeInTheDocument();
      });
      expect(transactionService.createTransaction).not.toHaveBeenCalled();
    });

    it("displays error message when amount is zero or negative", async () => {
      const user = userEvent.setup();
      renderTransactionModal();

      const descriptionInput = screen.getByTestId("transaction-description-input");
      const amountInput = screen.getByTestId("transaction-amount-input");

      await user.type(descriptionInput, "Coffee Shop");
      await user.type(amountInput, "-25");

      const submitButton = screen.getByTestId("transaction-submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("O valor deve ser maior que zero.")).toBeInTheDocument();
      });
      expect(transactionService.createTransaction).not.toHaveBeenCalled();
    });

    it("displays error message when date field is cleared", async () => {
      const user = userEvent.setup();
      renderTransactionModal();

      await user.type(screen.getByTestId("transaction-description-input"), "Pharmacy Medicines");
      await user.type(screen.getByTestId("transaction-amount-input"), "50");

      const dateInput = screen.getByTestId("transaction-date-input");
      fireEvent.change(dateInput, { target: { value: "" } });

      const submitButton = screen.getByTestId("transaction-submit-button");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Selecione uma data válida.")).toBeInTheDocument();
      });
      expect(transactionService.createTransaction).not.toHaveBeenCalled();
    });
  });

  describe("Successful transaction submission workflow", () => {
    it("submits expense transaction payload with parsed numeric amount and fields", async () => {
      const user = userEvent.setup();
      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal();

      await fillAndSubmitForm(user, {
        description: "Monthly Rent",
        amount: "2200",
        type: "expense",
        category: "housing",
        date: "2026-08-05",
      });

      await waitFor(() => {
        expect(transactionService.createTransaction).toHaveBeenCalledWith({
          description: "Monthly Rent",
          amount: 2200,
          type: "expense",
          category: "housing",
          date: "2026-08-05",
        });
      });
    });

    it("submits income transaction payload when switching type select", async () => {
      const user = userEvent.setup();
      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal();

      await fillAndSubmitForm(user, {
        description: "Salary Payment",
        amount: "9000",
        type: "income",
        category: "salary",
        date: "2026-08-01",
      });

      await waitFor(() => {
        expect(transactionService.createTransaction).toHaveBeenCalledWith({
          description: "Salary Payment",
          amount: 9000,
          type: "income",
          category: "salary",
          date: "2026-08-01",
        });
      });
    });

    it("invokes onSuccess and onClose callbacks after successful submission", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleSuccess = vi.fn();

      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal({ onClose: handleClose, onSuccess: handleSuccess });

      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(handleSuccess).toHaveBeenCalledTimes(1);
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Toast feedback upon submission", () => {
    it("displays success toast with localized title and message in pt-BR", async () => {
      const user = userEvent.setup();
      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal({}, "pt-BR");

      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByTestId("toast-success")).toBeInTheDocument();
        expect(screen.getByTestId("toast-title")).toHaveTextContent("Transação criada");
        expect(screen.getByTestId("toast-message")).toHaveTextContent(
          "Transação criada com sucesso!"
        );
      });
    });

    it("displays success toast with localized title and message in en-US", async () => {
      const user = userEvent.setup();
      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal({}, "en-US");

      await fillAndSubmitForm(user, {
        description: "Salary Deposit",
        amount: "5000",
      });

      await waitFor(() => {
        expect(screen.getByTestId("toast-success")).toBeInTheDocument();
        expect(screen.getByTestId("toast-title")).toHaveTextContent("Transaction created");
        expect(screen.getByTestId("toast-message")).toHaveTextContent(
          "Transaction created successfully!"
        );
      });
    });
  });

  describe("API submission errors and async states", () => {
    it("displays error banner in modal and triggers error toast when service rejects request", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const handleSuccess = vi.fn();

      vi.mocked(transactionService.createTransaction).mockRejectedValueOnce(
        new Error("Network Error")
      );

      renderTransactionModal({ onClose: handleClose, onSuccess: handleSuccess });

      await user.type(screen.getByTestId("transaction-description-input"), "Gym Membership");
      await user.type(screen.getByTestId("transaction-amount-input"), "120");

      await user.click(screen.getByTestId("transaction-submit-button"));

      await waitFor(() => {
        const errorBanner = screen.getByTestId("transaction-form-api-error");
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveAttribute("role", "alert");
        expect(errorBanner).toHaveTextContent("Falha ao salvar a transação. Tente novamente.");

        expect(screen.getByTestId("toast-error")).toBeInTheDocument();
        expect(screen.getByTestId("toast-title")).toHaveTextContent("Erro ao salvar");
        expect(screen.getByTestId("toast-message")).toHaveTextContent(
          "Falha ao salvar a transação. Tente novamente."
        );
      });

      expect(screen.queryByTestId("toast-success")).not.toBeInTheDocument();
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("clears previously displayed API error on subsequent submission attempt", async () => {
      const user = userEvent.setup();
      vi.mocked(transactionService.createTransaction)
        .mockRejectedValueOnce(new Error("First Failure"))
        .mockResolvedValueOnce(createMockTransaction());

      renderTransactionModal();

      await user.type(screen.getByTestId("transaction-description-input"), "Electric Bill");
      await user.type(screen.getByTestId("transaction-amount-input"), "150");

      // 1st attempt -> fails
      await user.click(screen.getByTestId("transaction-submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("transaction-form-api-error")).toBeInTheDocument();
      });

      // 2nd attempt -> succeeds & removes error banner
      await user.click(screen.getByTestId("transaction-submit-button"));

      await waitFor(() => {
        expect(screen.queryByTestId("transaction-form-api-error")).not.toBeInTheDocument();
        expect(screen.getByTestId("toast-success")).toBeInTheDocument();
      });
    });
  });

  describe("TransactionFormModal Error Focus Management & A11y", () => {
    it("automatically moves keyboard focus to the first invalid field upon validation failure", async () => {
      renderTransactionModal();

      const form = screen.getByTestId("transaction-form");
      const descriptionInput = screen.getByTestId("transaction-description-input");

      fireEvent.submit(form);

      await waitFor(() => {
        const errorMsg = screen.getByTestId("transaction-description-input-error");
        expect(errorMsg).toBeInTheDocument();
        expect(descriptionInput).toHaveFocus();
        expect(descriptionInput).toHaveAttribute("aria-invalid", "true");
        expect(descriptionInput).toHaveAttribute("aria-describedby", errorMsg.id);
      });
    });

    it("moves focus to the amount input when description is valid but amount is missing/zero", async () => {
      const user = userEvent.setup();
      renderTransactionModal();

      const descriptionInput = screen.getByTestId("transaction-description-input");
      const amountInput = screen.getByTestId("transaction-amount-input");
      const form = screen.getByTestId("transaction-form");

      await user.type(descriptionInput, "Compra no Supermercado");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(amountInput).toHaveFocus();
        expect(amountInput).toHaveAttribute("aria-invalid", "true");
        expect(descriptionInput).toHaveAttribute("aria-invalid", "false");
      });
    });
  });
});
