import { INITIAL_MOCK_TRANSACTIONS } from "@/mocks/transactions.mock";
import type { Transaction } from "@/types";
import type { ITransactionRepository } from "./transactionRepository.types";

export class MockTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[];

  constructor(initialData: readonly Transaction[] = INITIAL_MOCK_TRANSACTIONS) {
    this.transactions = [...initialData];
  }

  async getAll(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async add(transaction: Transaction): Promise<Transaction> {
    this.transactions = [transaction, ...this.transactions];
    return transaction;
  }

  async reset(): Promise<void> {
    this.transactions = [...INITIAL_MOCK_TRANSACTIONS];
  }
}
