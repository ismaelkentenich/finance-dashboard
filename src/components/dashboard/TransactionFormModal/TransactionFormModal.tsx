"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { CURRENCY_LABELS, SUPPORTED_CURRENCIES } from "@/constants/currency.constants";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { useLocale } from "@/contexts/LocaleContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/contexts/ToastContext";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboardData";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import {
  createTransactionSchema,
  getTranslatedValidationMessage,
  type CreateTransactionFormData,
} from "@/schemas/transaction.schema";
import { transactionService } from "@/services/api/transactionService";
import { convertAmount } from "@/services/financial/currencyConversion";
import type { TransactionCategory, TransactionType } from "@/types";
import { getLocalDateISOString } from "@/utils/date";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch, type FieldErrors, type UseFormSetFocus } from "react-hook-form";
import styles from "./TransactionFormModal.module.css";
import type { TransactionFormModalProps } from "./TransactionFormModal.types";

/**
 * Visual priority order of fields for focus transfer
 * in the event of a validation error.
 */
const FORM_VALIDATION_PRIORITY_ORDER: readonly (keyof CreateTransactionFormData)[] = [
  "description",
  "amount",
  "currency",
  "date",
  "type",
  "category",
];

/**
 * Manages keyboard focus on the first invalid field,
 * respecting the visual order of the form.
 */
function focusFirstInvalidField(
  formErrors: FieldErrors<CreateTransactionFormData>,
  setFormFocus: UseFormSetFocus<CreateTransactionFormData>
): void {
  const firstInvalidFieldName = FORM_VALIDATION_PRIORITY_ORDER.find(
    (fieldName) => formErrors[fieldName]
  );

  if (!firstInvalidFieldName) {
    return;
  }

  setFormFocus(firstInvalidFieldName, {
    shouldSelect: true,
  });
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  "data-testid": testId = "transaction-form-modal",
}: TransactionFormModalProps) {
  const { t, locale } = useLocale();
  const { showToast } = useToast();
  const { currencySettings } = useSettings();

  const queryClient = useQueryClient();

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  /**
   * Select options are the single source of truth
   * for available categories and their localized labels.
   */
  const categoryOptions = useMemo<
    {
      value: TransactionCategory;
      label: string;
    }[]
  >(
    () =>
      ALL_CATEGORIES.map((categoryKey) => ({
        value: categoryKey,
        label: t.categories.labels[categoryKey] || categoryKey,
      })),
    [t]
  );

  /**
   * Localized transaction-type options.
   */
  const typeOptions = useMemo<
    {
      value: TransactionType;
      label: string;
    }[]
  >(
    () => [
      {
        value: "income",
        label: t.filters.types.income,
      },
      {
        value: "expense",
        label: t.filters.types.expense,
      },
    ],
    [t]
  );

  /**
   * Localized currency options.
   */
  const currencyOptions = useMemo(
    () =>
      SUPPORTED_CURRENCIES.map((currency) => ({
        value: currency,
        label: `${currency} — ${CURRENCY_LABELS[currency][locale]}`,
      })),
    [locale]
  );

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setFocus,
    control,
    formState: { errors: formErrors, isSubmitting: isFormSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),

    shouldFocusError: false,

    defaultValues: {
      description: "",
      amount: undefined,
      currency: currencySettings.displayCurrency,
      type: typeOptions[0].value,
      category: categoryOptions[0].value,
      date: getLocalDateISOString(),
    },
  });

  const [amount, transactionCurrency, transactionDate] = useWatch({
    control,
    name: ["amount", "currency", "date"],
  });

  const displayCurrency = currencySettings.displayCurrency;

  const hasValidAmount = typeof amount === "number" && Number.isFinite(amount) && amount > 0;

  const shouldFetchExchangeRate =
    hasValidAmount && Boolean(transactionDate) && transactionCurrency !== displayCurrency;

  const exchangeRateQuery = useExchangeRate({
    from: transactionCurrency,
    to: displayCurrency,
    date: transactionDate,
    enabled: shouldFetchExchangeRate,
  });

  const convertedAmount =
    hasValidAmount && exchangeRateQuery.data
      ? convertAmount(amount, exchangeRateQuery.data.rate)
      : undefined;

  const formattedOriginalAmount = hasValidAmount
    ? formatCurrency(amount, locale, transactionCurrency)
    : null;

  const formattedConvertedAmount =
    convertedAmount !== undefined ? formatCurrency(convertedAmount, locale, displayCurrency) : null;

  const formattedRate = exchangeRateQuery.data
    ? `1 ${exchangeRateQuery.data.from} = ${exchangeRateQuery.data.rate.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })} ${exchangeRateQuery.data.to}`
    : null;

  const formattedRateDate = exchangeRateQuery.data
    ? formatDate(exchangeRateQuery.data.date, locale)
    : null;

  const descriptionRegister = register("description");

  const createTransactionMutation = useMutation(
    {
      mutationFn: (formData: CreateTransactionFormData) =>
        transactionService.createTransaction({
          description: formData.description,
          amount: formData.amount,
          currency: formData.currency,
          type: formData.type,
          category: formData.category,
          date: formData.date,
        }),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [DASHBOARD_QUERY_KEY],
        });

        showToast({
          type: "success",
          title: t.transactionModal.successTitle,
          message: t.transactionModal.successMessage,
        });

        resetForm();

        onSuccess();
        onClose();
      },

      onError: () => {
        setApiErrorMessage(t.transactionModal.errorMessage);

        showToast({
          type: "error",
          title: t.transactionModal.errorTitle,
          message: t.transactionModal.errorMessage,
        });
      },
    },
    queryClient
  );

  function handleValidSubmit(formData: CreateTransactionFormData): void {
    setApiErrorMessage(null);

    createTransactionMutation.mutate(formData);
  }

  function handleInvalidSubmit(validationErrors: FieldErrors<CreateTransactionFormData>): void {
    focusFirstInvalidField(validationErrors, setFocus);
  }

  const isPending = isFormSubmitting || createTransactionMutation.isPending;

  const isExchangeRateLoading = shouldFetchExchangeRate && exchangeRateQuery.isFetching;

  const hasExchangeRateError = shouldFetchExchangeRate && exchangeRateQuery.isError;

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

        {/* Description */}
        <Input
          label={t.transactionModal.fields.descriptionLabel}
          placeholder={t.transactionModal.fields.descriptionPlaceholder}
          error={getTranslatedValidationMessage(formErrors.description?.message, t)}
          disabled={isPending}
          data-testid="transaction-description-input"
          {...descriptionRegister}
          ref={(node) => {
            descriptionRegister.ref(node);

            firstFieldRef.current = node;
          }}
        />

        {/* Amount + currency */}
        <div className={styles.row}>
          <Input
            type="number"
            step="0.01"
            label={t.transactionModal.fields.amountLabel}
            placeholder={t.transactionModal.fields.amountPlaceholder}
            error={getTranslatedValidationMessage(formErrors.amount?.message, t)}
            disabled={isPending}
            data-testid="transaction-amount-input"
            {...register("amount", {
              valueAsNumber: true,
            })}
          />

          <Select
            label={t.transactionModal.fields.currencyLabel}
            options={currencyOptions}
            error={getTranslatedValidationMessage(formErrors.currency?.message, t)}
            disabled={isPending}
            data-testid="transaction-currency-select"
            {...register("currency")}
          />
        </div>

        {/* Date */}
        <div className={styles.row}>
          <Input
            type="date"
            label={t.transactionModal.fields.dateLabel}
            error={getTranslatedValidationMessage(formErrors.date?.message, t)}
            disabled={isPending}
            data-testid="transaction-date-input"
            {...register("date")}
          />
        </div>

        {/* Type + category */}
        <div className={styles.row}>
          <Select
            label={t.transactionModal.fields.typeLabel}
            options={typeOptions}
            error={getTranslatedValidationMessage(formErrors.type?.message, t)}
            disabled={isPending}
            data-testid="transaction-type-select"
            {...register("type")}
          />

          <Select
            label={t.transactionModal.fields.categoryLabel}
            options={categoryOptions}
            error={getTranslatedValidationMessage(formErrors.category?.message, t)}
            disabled={isPending}
            data-testid="transaction-category-select"
            {...register("category")}
          />
        </div>

        {/* Conversion Preview */}
        {shouldFetchExchangeRate && (
          <section
            className={styles.conversionPreview}
            aria-labelledby="transaction-conversion-title"
            data-testid="transaction-conversion-preview"
          >
            <h3 id="transaction-conversion-title" className={styles.conversionTitle}>
              {t.transactionModal.conversion.title}
            </h3>

            <div
              className={styles.conversionStatus}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              data-testid="transaction-conversion-status"
            >
              {isExchangeRateLoading && (
                <div
                  className={styles.conversionLoading}
                  data-testid="transaction-conversion-loading"
                >
                  <span className={styles.conversionSpinner} aria-hidden="true" />

                  <span>{t.transactionModal.conversion.loading}</span>
                </div>
              )}

              {hasExchangeRateError && (
                <p className={styles.conversionError} data-testid="transaction-conversion-error">
                  {t.transactionModal.conversion.error}
                </p>
              )}

              {!isExchangeRateLoading &&
                !hasExchangeRateError &&
                exchangeRateQuery.data &&
                formattedOriginalAmount &&
                formattedConvertedAmount &&
                formattedRate &&
                formattedRateDate && (
                  <div
                    className={styles.conversionContent}
                    data-testid="transaction-conversion-result"
                  >
                    <div className={styles.conversionAmounts}>
                      <span
                        className={styles.originalAmount}
                        data-testid="transaction-original-amount"
                      >
                        {formattedOriginalAmount}
                      </span>

                      <span className={styles.conversionArrow} aria-hidden="true">
                        ≈
                      </span>

                      <strong
                        className={styles.convertedAmount}
                        data-testid="transaction-converted-amount"
                      >
                        {formattedConvertedAmount}
                      </strong>
                    </div>

                    <div className={styles.conversionMetadata}>
                      <span data-testid="transaction-exchange-rate">
                        {t.transactionModal.conversion.rate}: {formattedRate}
                      </span>

                      <span data-testid="transaction-exchange-rate-date">
                        {t.transactionModal.conversion.rateDate}: {formattedRateDate}
                      </span>
                    </div>

                    <span className="sr-only">
                      {t.transactionModal.conversion.approximateIndicator}
                    </span>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Actions */}
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
