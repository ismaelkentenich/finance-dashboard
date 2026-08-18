import { INITIAL_MOCK_TRANSACTIONS } from "@/mocks/transactions.mock";
import { MockTransactionRepository } from "@/services/repository/mockTransactionRepository";
import {
  getTransactionRepository,
  setTransactionRepository,
} from "@/services/repository/transactionRepository";
import type { ITransactionRepository } from "@/services/repository/transactionRepository.types";
import type { Transaction } from "@/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Transaction Repository Layer", () => {
  let repository: MockTransactionRepository;

  const mockTransactionPayload: Transaction = {
    id: "tx-custom-001",
    description: "Cloud Hosting Subscription",
    amount: 120.5,
    type: "expense",
    category: "services",
    date: "2026-08-15",
    createdAt: "2026-08-15T10:00:00.000Z",
  };

  beforeEach(() => {
    repository = new MockTransactionRepository();
    setTransactionRepository(repository);
  });

  describe("MockTransactionRepository (Adapter)", () => {
    it("should instantiate with default initial dataset if no parameters are supplied", async () => {
      const allTransactions = await repository.getAll();

      expect(allTransactions).toHaveLength(INITIAL_MOCK_TRANSACTIONS.length);
      expect(allTransactions).toEqual(INITIAL_MOCK_TRANSACTIONS);
    });

    it("should allow instantiating with custom isolated dataset", async () => {
      const customInitialData: Transaction[] = [mockTransactionPayload];
      const customRepo = new MockTransactionRepository(customInitialData);

      const items = await customRepo.getAll();

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual(mockTransactionPayload);
    });

    it("should prepend new transaction to the top of the collection when added", async () => {
      const initialCount = (await repository.getAll()).length;

      const added = await repository.add(mockTransactionPayload);
      const afterAdd = await repository.getAll();

      expect(added).toEqual(mockTransactionPayload);
      expect(afterAdd).toHaveLength(initialCount + 1);
      expect(afterAdd[0]).toEqual(mockTransactionPayload);
    });

    it("should ensure immutability by returning a shallow copy on getAll", async () => {
      const firstFetch = await repository.getAll();
      firstFetch.pop();

      const secondFetch = await repository.getAll();
      expect(secondFetch).toHaveLength(INITIAL_MOCK_TRANSACTIONS.length);
    });

    it("should restore transactions back to initial state on reset", async () => {
      await repository.add(mockTransactionPayload);
      expect((await repository.getAll()).length).toBe(INITIAL_MOCK_TRANSACTIONS.length + 1);

      await repository.reset();
      const restored = await repository.getAll();

      expect(restored).toHaveLength(INITIAL_MOCK_TRANSACTIONS.length);
      expect(restored).not.toContainEqual(mockTransactionPayload);
    });
  });

  describe("Repository Factory & Dependency Injection", () => {
    it("should provide the active global repository instance via getTransactionRepository", () => {
      const currentRepo = getTransactionRepository();
      expect(currentRepo).toBe(repository);
    });

    it("should allow dynamically swapping repository implementation with custom provider", async () => {
      const stubTransactions: Transaction[] = [
        {
          id: "tx-remote-999",
          description: "Database Remote Record",
          amount: 5000,
          type: "income",
          category: "salary",
          date: "2026-08-01",
          createdAt: "2026-08-01T08:00:00.000Z",
        },
      ];

      const customDatabaseAdapter: ITransactionRepository = {
        getAll: vi.fn().mockResolvedValue(stubTransactions),
        add: vi.fn().mockImplementation(async (tx: Transaction) => tx),
        reset: vi.fn().mockResolvedValue(undefined),
      };

      setTransactionRepository(customDatabaseAdapter);

      const activeRepo = getTransactionRepository();
      const result = await activeRepo.getAll();

      expect(customDatabaseAdapter.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(stubTransactions);
    });

    it("should correctly forward add invocations through the swapped repository contract", async () => {
      const addSpy = vi.fn().mockResolvedValue(mockTransactionPayload);
      const customDatabaseAdapter: ITransactionRepository = {
        getAll: vi.fn().mockResolvedValue([]),
        add: addSpy,
      };

      setTransactionRepository(customDatabaseAdapter);

      const activeRepo = getTransactionRepository();
      const saved = await activeRepo.add(mockTransactionPayload);

      expect(addSpy).toHaveBeenCalledWith(mockTransactionPayload);
      expect(saved).toEqual(mockTransactionPayload);
    });
  });
});
