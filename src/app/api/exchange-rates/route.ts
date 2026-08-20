import { exchangeRateResponseSchema } from "@/schemas/exchangeRate.schema";
import { exchangeRateQuerySchema } from "@/schemas/exchangeRateRequest.schema";
import { exchangeRateProvider } from "@/services/exchange";
import { telemetryService } from "@/services/telemetry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const parseResult = exchangeRateQuerySchema.safeParse({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    date: searchParams.get("date") ?? undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid exchange rate query parameters.",

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
    const exchangeRate = await exchangeRateProvider.getRate(parseResult.data);

    const responsePayload = {
      data: exchangeRate,
    };

    const responseParseResult = exchangeRateResponseSchema.safeParse(responsePayload);

    if (!responseParseResult.success) {
      const validationError = new Error("Invalid internal exchange rate response contract.");

      telemetryService.logError(validationError, {
        operation: "GET /api/exchange-rates",
        from: parseResult.data.from,
        to: parseResult.data.to,
        date: parseResult.data.date,
        issues: responseParseResult.error.issues,
      });

      return NextResponse.json(
        {
          error: "Unable to retrieve exchange rate.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(responseParseResult.data, {
      status: 200,
    });
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));

    telemetryService.logError(normalizedError, {
      operation: "GET /api/exchange-rates",
      from: parseResult.data.from,
      to: parseResult.data.to,
      date: parseResult.data.date,
    });

    return NextResponse.json(
      {
        error: "Unable to retrieve exchange rate.",
      },
      {
        status: 502,
      }
    );
  }
}
