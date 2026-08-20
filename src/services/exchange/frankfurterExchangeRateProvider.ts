import { FRANKFURTER_API_BASE_URL } from "@/constants/currency.constants";
import { frankfurterRateResponseSchema } from "@/schemas/exchangeRate.schema";
import { telemetryService } from "@/services/telemetry";
import type { ExchangeRate, GetExchangeRateParams } from "@/types";
import type { ExchangeRateProvider } from "./exchangeRateProvider";

export class FrankfurterExchangeRateProvider implements ExchangeRateProvider {
  async getRate({ from, to, date }: GetExchangeRateParams): Promise<ExchangeRate> {
    const resolvedDate = date ?? new Date().toISOString().slice(0, 10);
    if (from === to) {
      return {
        from,
        to,
        rate: 1,
        date: resolvedDate,
      };
    }

    const endpoint = this.buildEndpoint({
      from,
      to,
      date,
    });

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
        operation: "FrankfurterExchangeRateProvider.getRate",
        endpoint,
        from,
        to,
        date,
        reason: "network_error",
      });

      throw new Error("Failed to fetch exchange rate.");
    }

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch exchange rate: ${response.status} ${response.statusText}`
      );

      telemetryService.logError(error, {
        operation: "FrankfurterExchangeRateProvider.getRate",
        endpoint,
        from,
        to,
        date,
        status: response.status,
        statusText: response.statusText,
      });

      throw error;
    }

    const rawData: unknown = await response.json();

    const parseResult = frankfurterRateResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      const validationError = new Error("Invalid exchange rate provider response.");

      telemetryService.logError(validationError, {
        operation: "FrankfurterExchangeRateProvider.getRate",
        endpoint,
        from,
        to,
        date,
        issues: parseResult.error.issues,
      });

      throw validationError;
    }

    const data = parseResult.data;

    if (data.base !== from || data.quote !== to) {
      const mismatchError = new Error(
        "Exchange rate provider returned an unexpected currency pair."
      );

      telemetryService.logError(mismatchError, {
        operation: "FrankfurterExchangeRateProvider.getRate",
        endpoint,
        expectedFrom: from,
        expectedTo: to,
        receivedFrom: data.base,
        receivedTo: data.quote,
      });

      throw mismatchError;
    }

    return {
      from: data.base,
      to: data.quote,
      rate: data.rate,
      date: data.date,
    };
  }

  private buildEndpoint({ from, to, date }: GetExchangeRateParams): string {
    const endpoint = `${FRANKFURTER_API_BASE_URL}` + `/rate/${from}/${to}`;

    if (!date) {
      return endpoint;
    }

    const searchParams = new URLSearchParams({
      date,
    });

    return `${endpoint}?${searchParams.toString()}`;
  }
}
