import type { Transaction } from "@/types";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  "data-testid"?: string;
}
