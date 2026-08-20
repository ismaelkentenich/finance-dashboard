import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboardData";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { transactionService } from "@/services/api/transactionService";
import { createTestQueryClient, customRender } from "@/test/utils";
import type { CurrencyCode, Transaction, TransactionCategory, TransactionType } from "@/types";
import { getLocalDateISOString } from "@/utils/date";
import { QueryClient } from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
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

vi.mock("@/hooks/useExchangeRate", () => ({
  useExchangeRate: vi.fn(),
}));

function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).substring(2, 9)}`,
    description: "Consulting Service",
    amount: 1500,
    currency: "BRL",
    type: "income",
    category: "freelance",
    date: "2026-08-14",
    createdAt: "2026-08-14T00:00:00.000Z",
    ...overrides,
  };
}

function renderTransactionModal(
  props: Partial<TransactionFormModalProps> = {},
  initialLocale: "pt-BR" | "en-US" = "pt-BR",
  queryClient?: QueryClient
) {
  const defaultProps: TransactionFormModalProps = {
    isOpen: true,
    onClose: vi.fn(),
    ...props,
  };

  const renderResult = customRender(<TransactionFormModal {...defaultProps} />, {
    locale: initialLocale,
    queryClient,
  });

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
    currency?: CurrencyCode;
    type?: TransactionType;
    category?: TransactionCategory;
    date?: string;
  }
) {
  const description = overrides?.description ?? "Monthly Rent";
  const amount = overrides?.amount ?? "2200";
  const currency = overrides?.currency ?? "BRL";
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

  const currencySelect = screen.getByTestId("transaction-currency-select");
  fireEvent.change(currencySelect, {
    target: {
      value: currency,
    },
  });

  await user.click(screen.getByTestId("transaction-submit-button"));
}

function mockExchangeRateQuery(overrides: Partial<ReturnType<typeof useExchangeRate>> = {}) {
  vi.mocked(useExchangeRate).mockReturnValue({
    data: undefined,
    error: null,
    isError: false,
    isFetching: false,
    isLoading: false,
    isPending: false,
    isSuccess: false,
    status: "pending",
    fetchStatus: "idle",
    ...overrides,
  } as ReturnType<typeof useExchangeRate>);
}

describe("TransactionFormModal Feature Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExchangeRateQuery();
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

      const todayLocalDate = getLocalDateISOString();

      expect(typeSelect.value).toBe(typeSelect.options[0].value);
      expect(categorySelect.value).toBe(categorySelect.options[0].value);
      expect(dateInput.value).toBe(todayLocalDate);
      expect(descriptionInput.value).toBe("");
    });

    it("initializes the date field with the local day, even if it differs from the UTC day", () => {
      vi.useFakeTimers();
      const lateNightDate = new Date("2026-08-18T01:00:00.000Z");
      vi.setSystemTime(lateNightDate);

      renderTransactionModal();

      const dateInput = screen.getByTestId("transaction-date-input") as HTMLInputElement;
      expect(dateInput.value).toBe(getLocalDateISOString(lateNightDate));
      vi.useRealTimers();
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
        currency: "BRL",
        type: "expense",
        category: "housing",
        date: "2026-08-05",
      });

      await waitFor(() => {
        expect(transactionService.createTransaction).toHaveBeenCalledWith({
          description: "Monthly Rent",
          amount: 2200,
          currency: "BRL",
          type: "expense",
          category: "housing",
          date: "2026-08-05",
        });
      });
    });

    it("submits transaction using selected foreign currency", async () => {
      const user = userEvent.setup();

      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction({
          currency: "USD",
        })
      );

      renderTransactionModal();

      await fillAndSubmitForm(user, {
        description: "Software Subscription",
        amount: "25",
        currency: "USD",
        type: "expense",
        category: "services",
        date: "2026-08-05",
      });

      await waitFor(() => {
        expect(transactionService.createTransaction).toHaveBeenCalledWith({
          description: "Software Subscription",
          amount: 25,
          currency: "USD",
          type: "expense",
          category: "services",
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
        currency: "BRL",
        type: "income",
        category: "salary",
        date: "2026-08-01",
      });

      await waitFor(() => {
        expect(transactionService.createTransaction).toHaveBeenCalledWith({
          description: "Salary Payment",
          amount: 9000,
          currency: "BRL",
          type: "income",
          category: "salary",
          date: "2026-08-01",
        });
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

      vi.mocked(transactionService.createTransaction).mockRejectedValueOnce(
        new Error("Network Error")
      );

      renderTransactionModal({ onClose: handleClose });

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
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("invalidates the dashboard query using the QueryClient provided by the application context", async () => {
      const user = userEvent.setup();
      const queryClient = createTestQueryClient();

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      vi.mocked(transactionService.createTransaction).mockResolvedValueOnce(
        createMockTransaction()
      );

      renderTransactionModal({}, "pt-BR", queryClient);

      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
          queryKey: [DASHBOARD_QUERY_KEY],
        });
      });
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

  describe("Currency conversion preview", () => {
    it("does not request exchange rate when transaction and display currencies are equal", async () => {
      const user = userEvent.setup();

      renderTransactionModal({}, "pt-BR");

      await user.type(screen.getByTestId("transaction-amount-input"), "100");

      expect(useExchangeRate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          from: "BRL",
          to: "BRL",
          enabled: false,
        })
      );

      expect(screen.queryByTestId("transaction-conversion-preview")).not.toBeInTheDocument();
    });

    it("renders accessible loading state while exchange rate is being fetched", async () => {
      mockExchangeRateQuery({
        isFetching: true,
        fetchStatus: "fetching",
      });

      const user = userEvent.setup();

      renderTransactionModal({}, "pt-BR");

      await user.type(screen.getByTestId("transaction-amount-input"), "100");

      fireEvent.change(screen.getByTestId("transaction-currency-select"), {
        target: {
          value: "USD",
        },
      });

      const status = screen.getByTestId("transaction-conversion-status");

      expect(status).toHaveAttribute("role", "status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveTextContent("Carregando cotação");

      expect(screen.getByTestId("transaction-conversion-loading")).toBeInTheDocument();
    });

    it("renders original amount, converted amount, rate and rate date", async () => {
      mockExchangeRateQuery({
        data: {
          from: "USD",
          to: "BRL",
          rate: 5.42,
          date: "2026-08-20",
        },
        isSuccess: true,
        status: "success",
      });

      const user = userEvent.setup();

      renderTransactionModal({}, "pt-BR");

      await user.type(screen.getByTestId("transaction-amount-input"), "100");

      fireEvent.change(screen.getByTestId("transaction-currency-select"), {
        target: {
          value: "USD",
        },
      });

      expect(screen.getByTestId("transaction-original-amount")).toHaveTextContent(/US\$\s*100,00/);

      expect(screen.getByTestId("transaction-converted-amount")).toHaveTextContent(/R\$\s*542,00/);

      expect(screen.getByTestId("transaction-exchange-rate")).toHaveTextContent(/1 USD = 5,42 BRL/);

      expect(screen.getByTestId("transaction-exchange-rate-date")).toHaveTextContent(
        /20.*ago.*2026/i
      );
    });

    it("renders localized non-blocking exchange rate error", async () => {
      mockExchangeRateQuery({
        error: new Error("Provider unavailable"),
        isError: true,
        status: "error",
      });

      const user = userEvent.setup();

      renderTransactionModal({}, "pt-BR");

      await user.type(screen.getByTestId("transaction-amount-input"), "100");

      fireEvent.change(screen.getByTestId("transaction-currency-select"), {
        target: {
          value: "USD",
        },
      });

      expect(screen.getByTestId("transaction-conversion-error")).toHaveTextContent(
        "Não foi possível obter a cotação para esta transação."
      );

      expect(screen.queryByTestId("transaction-converted-amount")).not.toBeInTheDocument();

      expect(screen.getByTestId("transaction-submit-button")).not.toBeDisabled();
    });

    it("localizes conversion preview metadata in en-US", async () => {
      mockExchangeRateQuery({
        data: {
          from: "BRL",
          to: "USD",
          rate: 0.2,
          date: "2026-08-20",
        },
        isSuccess: true,
        status: "success",
      });

      const user = userEvent.setup();

      renderTransactionModal({}, "en-US");

      await user.type(screen.getByTestId("transaction-amount-input"), "500");

      fireEvent.change(screen.getByTestId("transaction-currency-select"), {
        target: {
          value: "BRL",
        },
      });

      expect(screen.getByTestId("transaction-conversion-preview")).toHaveTextContent(
        "Currency conversion"
      );

      expect(screen.getByTestId("transaction-exchange-rate")).toHaveTextContent("Exchange rate");

      expect(screen.getByTestId("transaction-exchange-rate-date")).toHaveTextContent("Rate date");
    });
  });
});
