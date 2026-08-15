import type { Transaction } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_MOCK_TRANSACTIONS, mockTransactionsStore } from "../transactions.mock";

describe("MockTransactionsStore", () => {
  beforeEach(() => {
    mockTransactionsStore.reset();
  });

  it("should initialize with initial mock transactions", () => {
    const transactions = mockTransactionsStore.getAll();
    expect(transactions).toHaveLength(INITIAL_MOCK_TRANSACTIONS.length);
    expect(transactions[0].id).toBe("tx-001");
  });

  it("should add a new transaction to the beginning of the list", () => {
    const newTx: Transaction = {
      id: "tx-test-new",
      description: "Test Transaction",
      amount: 150,
      type: "expense",
      category: "food",
      date: "2026-08-15",
      createdAt: "2026-08-15T12:00:00.000Z",
    };

    const saved = mockTransactionsStore.add(newTx);
    expect(saved).toEqual(newTx);

    const all = mockTransactionsStore.getAll();
    expect(all[0]).toEqual(newTx);
    expect(all.length).toBe(INITIAL_MOCK_TRANSACTIONS.length + 1);
  });

  it("should return a clone of transactions to prevent external direct mutation", () => {
    const listA = mockTransactionsStore.getAll();
    listA.pop();

    const listB = mockTransactionsStore.getAll();
    expect(listB.length).toBe(INITIAL_MOCK_TRANSACTIONS.length);
  });

  it("should reset correctly to initial dataset", () => {
    mockTransactionsStore.add({
      id: "temp-tx",
      description: "Temp",
      amount: 10,
      type: "income",
      category: "salary",
      date: "2026-08-15",
      createdAt: new Date().toISOString(),
    });

    expect(mockTransactionsStore.getAll().length).toBe(INITIAL_MOCK_TRANSACTIONS.length + 1);
    mockTransactionsStore.reset();
    expect(mockTransactionsStore.getAll().length).toBe(INITIAL_MOCK_TRANSACTIONS.length);
  });
});
