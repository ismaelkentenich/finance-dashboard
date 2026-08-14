import type { Transaction } from "@/types";

export interface TransactionRowProps {
  transaction: Transaction;
  className?: string;
  "data-testid"?: string;
}
