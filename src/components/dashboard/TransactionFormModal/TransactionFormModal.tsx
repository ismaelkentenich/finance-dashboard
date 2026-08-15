"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { useLocale } from "@/contexts/LocaleContext";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboardData";
import {
  getCreateTransactionSchema,
  type CreateTransactionFormData,
} from "@/schemas/transaction.schema";
import { transactionService } from "@/services/api/transactionService";
import type { TransactionCategory, TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors, type UseFormSetFocus } from "react-hook-form";
import styles from "./TransactionFormModal.module.css";
import type { TransactionFormModalProps } from "./TransactionFormModal.types";

const fallbackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function useSafeQueryClient(): QueryClient {
  try {
    return useQueryClient();
  } catch {
    return fallbackQueryClient;
  }
}

/**
 * Visual priority order of fields for focus transfer in the event of an error.
 */
const FORM_VALIDATION_PRIORITY_ORDER: readonly (keyof CreateTransactionFormData)[] = [
  "description",
  "amount",
  "date",
  "type",
  "category",
] as const;

/**
 * Manages keyboard focus on the first invalid field, respecting WCAG and test environments (JSDOM).
 */
function focusFirstInvalidField(
  formErrors: FieldErrors<CreateTransactionFormData>,
  setFormFocus: UseFormSetFocus<CreateTransactionFormData>
): void {
  const firstInvalidFieldName = FORM_VALIDATION_PRIORITY_ORDER.find(
    (fieldName) => formErrors[fieldName]
  );

  if (!firstInvalidFieldName) return;

  setFormFocus(firstInvalidFieldName, { shouldSelect: true });

  // Schedule focus for after the submit button click cycle
  setTimeout(() => {
    const targetInputElement = document.querySelector<HTMLElement>(
      `[name="${firstInvalidFieldName}"]`
    );

    targetInputElement?.focus();
  }, 0);
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  "data-testid": testId = "transaction-form-modal",
}: TransactionFormModalProps) {
  const { t } = useLocale();
  const queryClient = useSafeQueryClient();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const validationSchema = useMemo(() => getCreateTransactionSchema(t), [t]);

  /**
   * Select options are the single source of truth for the available values
   * and their ordering.
   */
  const categoryOptions = useMemo<{ value: TransactionCategory; label: string }[]>(
    () =>
      ALL_CATEGORIES.map((categoryKey) => ({
        value: categoryKey,
        label: t.categories.labels[categoryKey] || categoryKey,
      })),
    [t]
  );

  const typeOptions = useMemo<{ value: TransactionType; label: string }[]>(
    () => [
      { value: "income", label: t.filters.types.income },
      { value: "expense", label: t.filters.types.expense },
    ],
    [t]
  );

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setFocus,
    formState: { errors: formErrors, isSubmitting: isFormSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(validationSchema),
    shouldFocusError: true,
    defaultValues: {
      description: "",
      amount: undefined,
      type: typeOptions[0].value,
      category: categoryOptions[0].value,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const descriptionRegister = register("description");

  const createTransactionMutation = useMutation(
    {
      mutationFn: (formData: CreateTransactionFormData) =>
        transactionService.createTransaction({
          description: formData.description,
          amount: formData.amount,
          type: formData.type,
          category: formData.category,
          date: formData.date,
        }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [DASHBOARD_QUERY_KEY],
        });

        resetForm();
        onSuccess();
        onClose();
      },
      onError: () => {
        setApiErrorMessage(t.transactionModal.errorMessage);
      },
    },
    queryClient
  );

  async function handleValidSubmit(formData: CreateTransactionFormData) {
    setApiErrorMessage(null);
    createTransactionMutation.mutate(formData);
  }

  function handleInvalidSubmit(validationErrors: FieldErrors<CreateTransactionFormData>) {
    focusFirstInvalidField(validationErrors, setFocus);
  }

  const isPending = isFormSubmitting || createTransactionMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.transactionModal.title}
      description={t.transactionModal.description}
      initialFocusRef={firstFieldRef}
      data-testid={testId}
    >
      <form
        onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        className={styles.form}
        data-testid="transaction-form"
        noValidate
      >
        {apiErrorMessage && (
          <div className={styles.apiError} role="alert" data-testid="transaction-form-api-error">
            {apiErrorMessage}
          </div>
        )}

        {/* Description Field */}
        <Input
          label={t.transactionModal.fields.descriptionLabel}
          placeholder={t.transactionModal.fields.descriptionPlaceholder}
          error={formErrors.description?.message}
          disabled={isPending}
          data-testid="transaction-description-input"
          {...descriptionRegister}
          ref={(node) => {
            descriptionRegister.ref(node);
            firstFieldRef.current = node;
          }}
        />

        {/* Amount and Date Group */}
        <div className={styles.row}>
          <Input
            type="number"
            step="0.01"
            label={t.transactionModal.fields.amountLabel}
            placeholder={t.transactionModal.fields.amountPlaceholder}
            error={formErrors.amount?.message}
            disabled={isPending}
            data-testid="transaction-amount-input"
            {...register("amount", { valueAsNumber: true })}
          />

          <Input
            type="date"
            label={t.transactionModal.fields.dateLabel}
            error={formErrors.date?.message}
            disabled={isPending}
            data-testid="transaction-date-input"
            {...register("date")}
          />
        </div>

        {/* Type and Category Group */}
        <div className={styles.row}>
          <Select
            label={t.transactionModal.fields.typeLabel}
            options={typeOptions}
            error={formErrors.type?.message}
            disabled={isPending}
            data-testid="transaction-type-select"
            {...register("type")}
          />

          <Select
            label={t.transactionModal.fields.categoryLabel}
            options={categoryOptions}
            error={formErrors.category?.message}
            disabled={isPending}
            data-testid="transaction-category-select"
            {...register("category")}
          />
        </div>

        {/* Actions Bar */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            data-testid="transaction-cancel-button"
          >
            {t.transactionModal.buttons.cancel}
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            data-testid="transaction-submit-button"
          >
            {isPending ? t.transactionModal.buttons.submitting : t.transactionModal.buttons.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
