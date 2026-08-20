import { createTransactionSchema } from "@/schemas/transaction.schema";
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
import type { PeriodFilter, Transaction, TransactionCategory, TransactionType } from "@/types";
import { isSupportedCurrency } from "@/utils/currency";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") as PeriodFilter) || "current-month";
    const type = searchParams.get("type") as "all" | TransactionType | null;
    const category = searchParams.get("category") as "all" | TransactionCategory | null;

    const currencyParam = searchParams.get("currency");

    if (currencyParam !== null && !isSupportedCurrency(currencyParam)) {
      return NextResponse.json(
        {
          error: "Invalid currency.",
        },
        {
          status: 400,
        }
      );
    }

    const currency = currencyParam ?? "BRL";

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
          error: "Payload de transação inválido.",
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

    return NextResponse.json({ data: savedTransaction }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Falha ao processar a requisição." }, { status: 500 });
  }
}
