export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "housing"
  | "food"
  | "transportation"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "education"
  | "shopping"
  | "services"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}
