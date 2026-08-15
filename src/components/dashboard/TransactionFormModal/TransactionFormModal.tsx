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
import { useMemo, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
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

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  "data-testid": testId = "transaction-form-modal",
}: TransactionFormModalProps) {
  const { t } = useLocale();
  const queryClient = useSafeQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = useMemo(() => getCreateTransactionSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      description: "",
      amount: undefined,
      type: "expense",
      category: "food",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation(
    {
      mutationFn: (formData: CreateTransactionFormData) =>
        transactionService.createTransaction({
          description: formData.description,
          amount: Number(formData.amount),
          type: formData.type as TransactionType,
          category: formData.category as TransactionCategory,
          date: formData.date,
        }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
        reset();
        onSuccess();
        onClose();
      },
      onError: () => {
        setApiError(t.transactionModal.errorMessage);
      },
    },
    queryClient
  );

  const categoryOptions = ALL_CATEGORIES.map((cat) => ({
    value: cat,
    label: t.categories.labels[cat] || cat,
  }));

  const typeOptions = [
    { value: "income", label: t.filters.types.income },
    { value: "expense", label: t.filters.types.expense },
  ];

  async function onSubmit(formData: CreateTransactionFormData) {
    setApiError(null);
    createMutation.mutate(formData);
  }

  function onInvalid(formErrors: FieldErrors<CreateTransactionFormData>) {
    const errorFields = Object.keys(formErrors) as (keyof CreateTransactionFormData)[];
    if (errorFields.length > 0) {
      setFocus(errorFields[0]);
    }
  }

  const isPending = isFormSubmitting || createMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.transactionModal.title}
      description={t.transactionModal.description}
      data-testid={testId}
    >
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={styles.form}
        data-testid="transaction-form"
        noValidate
      >
        {apiError && (
          <div className={styles.apiError} role="alert" data-testid="transaction-form-api-error">
            {apiError}
          </div>
        )}

        {/* Description */}
        <Input
          label={t.transactionModal.fields.descriptionLabel}
          placeholder={t.transactionModal.fields.descriptionPlaceholder}
          error={errors.description?.message}
          disabled={isPending}
          {...register("description")}
          data-testid="transaction-description-input"
        />

        {/* Amount and Date */}
        <div className={styles.row}>
          <Input
            type="number"
            step="0.01"
            label={t.transactionModal.fields.amountLabel}
            placeholder={t.transactionModal.fields.amountPlaceholder}
            error={errors.amount?.message}
            disabled={isPending}
            {...register("amount", { valueAsNumber: true })}
            data-testid="transaction-amount-input"
          />

          <Input
            type="date"
            label={t.transactionModal.fields.dateLabel}
            error={errors.date?.message}
            disabled={isPending}
            {...register("date")}
            data-testid="transaction-date-input"
          />
        </div>

        {/* Type and Category */}
        <div className={styles.row}>
          <Select
            label={t.transactionModal.fields.typeLabel}
            options={typeOptions}
            error={errors.type?.message}
            disabled={isPending}
            {...register("type")}
            data-testid="transaction-type-select"
          />

          <Select
            label={t.transactionModal.fields.categoryLabel}
            options={categoryOptions}
            error={errors.category?.message}
            disabled={isPending}
            {...register("category")}
            data-testid="transaction-category-select"
          />
        </div>

        {/* Buttons */}
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
