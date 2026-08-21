import { exchangeRateResponseSchema } from "@/schemas/exchangeRate.schema";
import { telemetryService } from "@/services/telemetry";
import type { ExchangeRate, GetExchangeRateParams } from "@/types";

export const exchangeRateService = {
  async getRate({ from, to, date }: GetExchangeRateParams): Promise<ExchangeRate> {
    const searchParams = new URLSearchParams({
      from,
      to,
    });

    if (date) {
      searchParams.set("date", date);
    }

    const endpoint = `/api/exchange-rates?${searchParams.toString()}`;

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error(String(error));

      telemetryService.logError(normalizedError, {
        operation: "exchangeRateService.getRate",
        endpoint,
        from,
        to,
        date,
        reason: "network_error",
      });

      throw new Error("Failed to fetch exchange rate.");
    }

    if (!response.ok) {
      const requestError = new Error(
        `Failed to fetch exchange rate: ${response.status} ${response.statusText}`
      );

      telemetryService.logError(requestError, {
        operation: "exchangeRateService.getRate",
        endpoint,
        from,
        to,
        date,
        status: response.status,
        statusText: response.statusText,
      });

      throw requestError;
    }

    let rawData: unknown;

    try {
      rawData = await response.json();
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error(String(error));

      telemetryService.logError(normalizedError, {
        operation: "exchangeRateService.getRate",
        endpoint,
        from,
        to,
        date,
        reason: "invalid_json",
      });

      throw new Error("Invalid exchange rate API response.");
    }

    const parseResult = exchangeRateResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      const validationError = new Error(
        "Invalid API response contract: exchange rate schema mismatch"
      );

      telemetryService.logError(validationError, {
        operation: "exchangeRateService.getRate",
        endpoint,
        from,
        to,
        date,
        issues: parseResult.error.issues,
      });

      throw validationError;
    }

    return parseResult.data.data;
  },
};
