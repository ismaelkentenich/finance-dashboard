import { createTransactionSchema } from "@/schemas/transaction.schema";
import { transactionQuerySchema } from "@/schemas/transactionQuery.schema";
import { exchangeRateProvider } from "@/services/exchange";
import {
  calculateCategoryBreakdown,
  calculateFinancialSummary,
} from "@/services/financial/financialCalculations";
import {
  applyTransactionFilters,
  filterTransactionsByEquivalentPreviousPeriod,
  filterTransactionsByPeriod,
} from "@/services/financial/financialFilters";
import { normalizeTransactions } from "@/services/financial/normalizeTransactions";
import { getTransactionRepository } from "@/services/repository/transactionRepository";
import type { Transaction } from "@/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parseResult = transactionQuerySchema.safeParse({
    period: searchParams.get("period") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    currency: searchParams.get("currency") ?? undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid transaction query parameters.",
        issues: parseResult.error.issues.map((issue) => ({
          field: issue.path.join(".") || "unknown",
          message: issue.message,
        })),
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { period, type, category, currency } = parseResult.data;

    const filterOptions = {
      type,
      category,
    };

    const repository = getTransactionRepository();

    const allTransactions = await repository.getAll();

    const currentPeriodTxs = filterTransactionsByPeriod(allTransactions, period);

    const filtered = applyTransactionFilters(currentPeriodTxs, filterOptions);

    const previousPeriodTxs = filterTransactionsByEquivalentPreviousPeriod(allTransactions, period);

    const previousPeriodFiltered = applyTransactionFilters(previousPeriodTxs, filterOptions);

    const normalizedTransactions = await normalizeTransactions({
      transactions: filtered,
      targetCurrency: currency,
      exchangeRateProvider,
    });

    const normalizedPreviousPeriodTransactions = await normalizeTransactions({
      transactions: previousPeriodFiltered,
      targetCurrency: currency,
      exchangeRateProvider,
    });

    const summary = calculateFinancialSummary(
      normalizedTransactions,
      normalizedPreviousPeriodTransactions
    );

    const categories = calculateCategoryBreakdown(normalizedTransactions);

    return NextResponse.json({
      data: {
        transactions: normalizedTransactions,
        summary,
        categories,
      },

      meta: {
        totalCount: normalizedTransactions.length,
        period,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to load transactions.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const result = createTransactionSchema.safeParse(payload);

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        code: issue.message,
      }));

      return NextResponse.json(
        {
          error: "Invalid transaction payload.",
          issues,
        },
        { status: 400 }
      );
    }

    const validData = result.data;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      description: validData.description,
      amount: validData.amount,
      currency: validData.currency,
      type: validData.type,
      category: validData.category,
      date: validData.date,
      createdAt: new Date().toISOString(),
    };

    const repository = getTransactionRepository();
    const savedTransaction = await repository.add(newTransaction);

    return NextResponse.json(
      {
        data: savedTransaction,
      },
      {
        status: 201,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to process the request.",
      },
      {
        status: 500,
      }
    );
  }
}
