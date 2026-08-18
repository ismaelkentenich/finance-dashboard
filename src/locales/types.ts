import type { SUPPORTED_LOCALES } from "@/constants/locale.constants";
import type { en } from "./en";

export type NestedTranslations<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? NestedTranslations<T[K]>
      : T[K];
};

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type TranslationSchema = NestedTranslations<typeof en>;
