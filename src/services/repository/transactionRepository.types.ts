import type { Transaction } from "@/types";

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>;
  add(transaction: Transaction): Promise<Transaction>;
  reset?(): Promise<void>;
}
