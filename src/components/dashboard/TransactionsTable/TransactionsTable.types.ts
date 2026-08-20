import type { NormalizedTransaction } from "@/types";

export interface TransactionsTableProps {
  transactions: NormalizedTransaction[];
  title?: string;
  id?: string;
  className?: string;
  "data-testid"?: string;
}
