import { MockTransactionRepository } from "./mockTransactionRepository";
import type { ITransactionRepository } from "./transactionRepository.types";

let currentRepository: ITransactionRepository = new MockTransactionRepository();

export function getTransactionRepository(): ITransactionRepository {
  return currentRepository;
}

export function setTransactionRepository(repository: ITransactionRepository): void {
  currentRepository = repository;
}
