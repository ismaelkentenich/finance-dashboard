import type { Transaction } from "@/types";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  className?: string;
  "data-testid"?: string;
}
