import { telemetryService } from "@/services/telemetry";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FrankfurterExchangeRateProvider } from "../frankfurterExchangeRateProvider";

function createJsonResponse(
  payload: unknown,
  init: ResponseInit = {
    status: 200,
    statusText: "OK",
  }
): Response {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

function createErrorResponse(status: number, statusText: string): Response {
  return new Response(null, {
    status,
    statusText,
  });
}

describe("FrankfurterExchangeRateProvider", () => {
  let provider: FrankfurterExchangeRateProvider;

  beforeEach(() => {
    provider = new FrankfurterExchangeRateProvider();

    vi.stubGlobal("fetch", vi.fn());

    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetches latest rate for a currency pair", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: 5.42,
      })
    );

    const result = await provider.getRate({
      from: "USD",
      to: "BRL",
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith("https://api.frankfurter.dev/v2/rate/USD/BRL", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    expect(result).toEqual({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-19",
    });
  });

  it("fetches historical rate using requested date", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-01-15",
        base: "USD",
        quote: "BRL",
        rate: 6.1,
      })
    );

    const result = await provider.getRate({
      from: "USD",
      to: "BRL",
      date: "2026-01-15",
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.frankfurter.dev/v2/rate/USD/BRL?date=2026-01-15",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    expect(result).toEqual({
      from: "USD",
      to: "BRL",
      rate: 6.1,
      date: "2026-01-15",
    });
  });

  it("returns rate 1 without network request when currencies are equal", async () => {
    const result = await provider.getRate({
      from: "BRL",
      to: "BRL",
      date: "2026-08-15",
    });

    expect(result).toEqual({
      from: "BRL",
      to: "BRL",
      rate: 1,
      date: "2026-08-15",
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("throws and logs telemetry when HTTP response fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse(422, "Unprocessable Entity"));

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Failed to fetch exchange rate: 422 Unprocessable Entity");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        from: "USD",
        to: "BRL",
        status: 422,
        statusText: "Unprocessable Entity",
      })
    );
  });

  it("throws controlled error when network request fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Failed to fetch exchange rate.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        from: "USD",
        to: "BRL",
        reason: "network_error",
      })
    );
  });

  it("rejects invalid JSON returned by provider", async () => {
    const response = new Response(null, {
      status: 200,
      statusText: "OK",
    });

    vi.spyOn(response, "json").mockRejectedValueOnce(new SyntaxError("Unexpected token"));

    vi.mocked(fetch).mockResolvedValueOnce(response);

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        from: "USD",
        to: "BRL",
        reason: "invalid_json",
      })
    );
  });

  it("rejects malformed provider payload", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: "invalid",
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        from: "USD",
        to: "BRL",
        issues: expect.any(Array),
      })
    );
  });

  it("rejects payload containing unsupported base currency", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "DOGE",
        quote: "BRL",
        rate: 1.25,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        issues: expect.any(Array),
      })
    );
  });

  it("rejects payload containing unsupported quote currency", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "DOGE",
        rate: 1.25,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");
  });

  it("rejects zero exchange rate returned by provider", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: 0,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");
  });

  it("rejects negative exchange rate returned by provider", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "BRL",
        rate: -5.42,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");
  });

  it("rejects invalid provider date", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-02-30",
        base: "USD",
        quote: "BRL",
        rate: 5.42,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Invalid exchange rate provider response.");
  });

  it("rejects response when provider returns a different base currency", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "EUR",
        quote: "BRL",
        rate: 6.3,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Exchange rate provider returned an unexpected currency pair.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        expectedFrom: "USD",
        expectedTo: "BRL",
        receivedFrom: "EUR",
        receivedTo: "BRL",
      })
    );
  });

  it("rejects response when provider returns a different quote currency", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        date: "2026-08-19",
        base: "USD",
        quote: "EUR",
        rate: 0.86,
      })
    );

    await expect(
      provider.getRate({
        from: "USD",
        to: "BRL",
      })
    ).rejects.toThrow("Exchange rate provider returned an unexpected currency pair.");

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "FrankfurterExchangeRateProvider.getRate",
        expectedFrom: "USD",
        expectedTo: "BRL",
        receivedFrom: "USD",
        receivedTo: "EUR",
      })
    );
  });
});
