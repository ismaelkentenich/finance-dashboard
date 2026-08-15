import type { Transaction } from "@/types";

export interface TransactionsTableProps {
  transactions: Transaction[];
  title?: string;
  id?: string;
  className?: string;
  "data-testid"?: string;
}
