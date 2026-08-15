import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import type { TranslationSchema } from "@/locales/types";
import { z } from "zod";

export const getCreateTransactionSchema = (t: TranslationSchema) =>
  z
    .object({
      description: z
        .string({ message: t.validation.descriptionMin })
        .trim()
        .min(3, { message: t.validation.descriptionMin })
        .max(60, { message: t.validation.descriptionMax }),

      amount: z
        .number({ message: t.validation.amountInvalid })
        .finite({ message: t.validation.amountInvalid })
        .positive({ message: t.validation.amountPositive }),

      type: z.enum(["income", "expense"] as const, {
        message: t.validation.typeRequired,
      }),

      category: z.enum(ALL_CATEGORIES, {
        message: t.validation.categoryRequired,
      }),

      date: z
        .string({ message: t.validation.dateRequired })
        .min(1, { message: t.validation.dateRequired })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: t.validation.dateFormat,
        })
        .refine(
          (val) => {
            const parsed = new Date(`${val}T12:00:00Z`);
            return !isNaN(parsed.getTime());
          },
          { message: t.validation.dateInvalid }
        ),
    })
    .strict();

export type CreateTransactionSchemaType = ReturnType<typeof getCreateTransactionSchema>;
export type CreateTransactionFormData = z.infer<CreateTransactionSchemaType>;
