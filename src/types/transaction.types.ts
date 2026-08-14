import { ALL_CATEGORIES } from "@/constants/transaction.constants";

export type TransactionType = "income" | "expense";

export type TransactionCategory = (typeof ALL_CATEGORIES)[number];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}
