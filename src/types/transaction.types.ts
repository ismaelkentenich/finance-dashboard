import { ALL_CATEGORIES } from "@/constants/transaction.constants";
import type { CurrencyCode } from "./currency.types";

export type TransactionType = "income" | "expense";

export type TransactionCategory = (typeof ALL_CATEGORIES)[number];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}

export interface NormalizedTransaction extends Transaction {
  normalizedAmount: number;
  normalizedCurrency: CurrencyCode;
}
