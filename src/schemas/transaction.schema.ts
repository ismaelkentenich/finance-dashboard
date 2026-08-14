import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z
    .string()
    .min(3, { message: "A descrição deve ter pelo menos 3 caracteres." })
    .max(60, { message: "A descrição não pode exceder 60 caracteres." }),

  amount: z
    .number({ message: "Insira um valor numérico válido." })
    .positive({ message: "O valor deve ser maior que zero." }),

  type: z.enum(["income", "expense"] as const, {
    message: "Selecione o tipo de transação.",
  }),

  category: z.enum(ALL_CATEGORIES, {
    message: "Selecione uma categoria válida.",
  }),

  date: z
    .string()
    .min(1, { message: "Selecione uma data válida." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Formato de data inválido (AAAA-MM-DD).",
    }),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
