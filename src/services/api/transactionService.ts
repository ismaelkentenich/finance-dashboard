import {
  createTransactionResponseSchema,
  getDashboardDataResponseSchema,
} from "@/schemas/api.schema";
import { telemetryService } from "@/services/telemetry";
import type { FetchTransactionsParams, GetDashboardDataResponse, Transaction } from "@/types";

export const transactionService = {
  async getDashboardData(params: FetchTransactionsParams = {}): Promise<GetDashboardDataResponse> {
    const searchParams = new URLSearchParams();

    if (params.period) searchParams.set("period", params.period);
    if (params.type && params.type !== "all") searchParams.set("type", params.type);
    if (params.category && params.category !== "all") {
      searchParams.set("category", params.category);
    }
    if (params.currency) {
      searchParams.set("currency", params.currency);
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/transactions${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch transactions: ${response.status} ${response.statusText}`
      );

      telemetryService.logError(error, {
        operation: "transactionService.getDashboardData",
        status: response.status,
        statusText: response.statusText,
        endpoint,
      });

      throw error;
    }

    const rawData: unknown = await response.json();
    const parseResult = getDashboardDataResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      const validationError = new Error("Invalid API response contract: dashboard schema mismatch");

      telemetryService.logError(validationError, {
        operation: "transactionService.getDashboardData",
        endpoint,
        issues: parseResult.error.issues,
      });

      throw validationError;
    }

    return parseResult.data;
  },

  async createTransaction(payload: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create transaction: ${response.status}`);
    }

    const rawData: unknown = await response.json();
    const parseResult = createTransactionResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      const validationError = new Error(
        "Invalid API response contract: transaction creation schema mismatch"
      );

      telemetryService.logError(validationError, {
        operation: "transactionService.createTransaction",
        endpoint: "/api/transactions",
        issues: parseResult.error.issues,
      });

      throw validationError;
    }

    return parseResult.data.data;
  },
};
