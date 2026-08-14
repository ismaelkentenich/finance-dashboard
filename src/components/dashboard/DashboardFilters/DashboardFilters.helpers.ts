import type { SelectOption } from "@/components/ui/Select";
import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import type { TranslationSchema } from "@/locales/types";

export function getPeriodOptions(t: TranslationSchema): SelectOption[] {
  return [
    { value: "current-month", label: t.filters.periods["current-month"] },
    { value: "previous-month", label: t.filters.periods["previous-month"] },
    { value: "last-3-months", label: t.filters.periods["last-3-months"] },
  ];
}

export function getTypeOptions(t: TranslationSchema): SelectOption[] {
  return [
    { value: "all", label: t.filters.types.all },
    { value: "income", label: t.filters.types.income },
    { value: "expense", label: t.filters.types.expense },
  ];
}

export function getCategoryOptions(t: TranslationSchema): SelectOption[] {
  return [
    { value: "all", label: t.filters.allCategories },
    ...ALL_CATEGORIES.map((catKey) => ({
      value: catKey,
      label: t.categories.labels[catKey] || catKey,
    })),
  ];
}
