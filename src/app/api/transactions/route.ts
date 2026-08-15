import { pt } from "@/locales/pt-br";
import { INITIAL_MOCK_TRANSACTIONS } from "@/mocks/transactions.mock";
import { getCreateTransactionSchema } from "@/schemas/transaction.schema";
import {
  calculateCategoryBreakdown,
  calculateFinancialSummary,
} from "@/services/financial/financialCalculations";
import {
  applyTransactionFilters,
  filterTransactionsByPeriod,
} from "@/services/financial/financialFilters";
import type { PeriodFilter, Transaction, TransactionCategory, TransactionType } from "@/types";
import { NextResponse, type NextRequest } from "next/server";

// In-memory mutable store for the dev server session
let transactionsStore: Transaction[] = [...INITIAL_MOCK_TRANSACTIONS];

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") as PeriodFilter) || "current-month";
  const type = searchParams.get("type") as "all" | TransactionType | null;
  const category = searchParams.get("category") as "all" | TransactionCategory | null;

  const filterOptions = { type, category };

  const currentPeriodTxs = filterTransactionsByPeriod(transactionsStore, period);
  const filtered = applyTransactionFilters(currentPeriodTxs, filterOptions);

  const previousPeriodTxs = filterTransactionsByPeriod(transactionsStore, "previous-month");
  const previousPeriodFiltered = applyTransactionFilters(previousPeriodTxs, filterOptions);

  const summary = calculateFinancialSummary(filtered, previousPeriodFiltered);
  const categories = calculateCategoryBreakdown(filtered);

  return NextResponse.json({
    data: {
      transactions: filtered,
      summary,
      categories,
    },
    meta: {
      totalCount: filtered.length,
      period,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const schema = getCreateTransactionSchema(pt);
    const result = schema.safeParse(payload);

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
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
      type: validData.type,
      category: validData.category,
      date: validData.date,
      createdAt: new Date().toISOString(),
    };

    transactionsStore = [newTransaction, ...transactionsStore];

    return NextResponse.json({ data: newTransaction }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Falha ao processar a requisição." }, { status: 500 });
  }
}
