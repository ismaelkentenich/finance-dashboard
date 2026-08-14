import type { en } from "./en";

export type NestedTranslations<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? NestedTranslations<T[K]>
      : T[K];
};

export type SupportedLocale = "en-US" | "pt-BR";

export type TranslationSchema = NestedTranslations<typeof en>;
