import type { Transaction } from "@/types";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  title?: string;
  id?: string;
  className?: string;
  "data-testid"?: string;
}
