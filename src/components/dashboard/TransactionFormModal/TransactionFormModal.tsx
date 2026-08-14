"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { useLocale } from "@/contexts/LocaleContext";
import {
  createTransactionSchema,
  type CreateTransactionFormData,
} from "@/schemas/transaction.schema";
import { transactionService } from "@/services/api/transactionService";
import type { TransactionCategory, TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./TransactionFormModal.module.css";
import type { TransactionFormModalProps } from "./TransactionFormModal.types";

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  "data-testid": testId = "transaction-form-modal",
}: TransactionFormModalProps) {
  const { t } = useLocale();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    shouldFocusError: true,
    defaultValues: {
      description: "",
      amount: undefined,
      type: "expense",
      category: "food",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const categoryOptions = ALL_CATEGORIES.map((cat) => ({
    value: cat,
    label: t.categories.labels[cat] || cat,
  }));

  const typeOptions = [
    { value: "income", label: t.filters.types.income },
    { value: "expense", label: t.filters.types.expense },
  ];

  async function onSubmit(formData: CreateTransactionFormData) {
    try {
      setApiError(null);
      await transactionService.createTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        type: formData.type as TransactionType,
        category: formData.category as TransactionCategory,
        date: formData.date,
      });

      reset();
      onSuccess();
      onClose();
    } catch {
      setApiError(t.transactionModal.errorMessage);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.transactionModal.title}
      description={t.transactionModal.description}
      data-testid={testId}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("amount", { valueAsNumber: true })}
            data-testid="transaction-amount-input"
          />

          <Input
            type="date"
            label={t.transactionModal.fields.dateLabel}
            error={errors.date?.message}
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
            {...register("type")}
            data-testid="transaction-type-select"
          />

          <Select
            label={t.transactionModal.fields.categoryLabel}
            options={categoryOptions}
            error={errors.category?.message}
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
            disabled={isSubmitting}
            data-testid="transaction-cancel-button"
          >
            {t.transactionModal.buttons.cancel}
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            data-testid="transaction-submit-button"
          >
            {isSubmitting
              ? t.transactionModal.buttons.submitting
              : t.transactionModal.buttons.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
