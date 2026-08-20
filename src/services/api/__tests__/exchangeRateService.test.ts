import { telemetryService } from "@/services/telemetry";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exchangeRateService } from "../exchangeRateService";

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

describe("exchangeRateService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());

    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("getRate", () => {
    it("fetches latest exchange rate without date", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "USD",
            to: "BRL",
            rate: 5.42,
            date: "2026-08-20",
          },
        })
      );

      const result = await exchangeRateService.getRate({
        from: "USD",
        to: "BRL",
      });

      expect(fetch).toHaveBeenCalledTimes(1);

      expect(fetch).toHaveBeenCalledWith("/api/exchange-rates?from=USD&to=BRL", {
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
        date: "2026-08-20",
      });
    });

    it("includes historical date when supplied", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "USD",
            to: "BRL",
            rate: 5.1,
            date: "2026-01-10",
          },
        })
      );

      const result = await exchangeRateService.getRate({
        from: "USD",
        to: "BRL",
        date: "2026-01-10",
      });

      expect(fetch).toHaveBeenCalledWith("/api/exchange-rates?from=USD&to=BRL&date=2026-01-10", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      expect(result).toEqual({
        from: "USD",
        to: "BRL",
        rate: 5.1,
        date: "2026-01-10",
      });
    });

    it("returns only the data payload from API response", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "EUR",
            to: "BRL",
            rate: 6.35,
            date: "2026-08-20",
          },
        })
      );

      const result = await exchangeRateService.getRate({
        from: "EUR",
        to: "BRL",
      });

      expect(result).toEqual({
        from: "EUR",
        to: "BRL",
        rate: 6.35,
        date: "2026-08-20",
      });

      expect(result).not.toHaveProperty("data");
    });

    it("throws and logs telemetry when API returns 400", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse(400, "Bad Request"));

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Failed to fetch exchange rate: 400 Bad Request");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          endpoint: "/api/exchange-rates?from=USD&to=BRL",
          from: "USD",
          to: "BRL",
          status: 400,
          statusText: "Bad Request",
        })
      );
    });

    it("throws and logs telemetry when API returns 500", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse(500, "Internal Server Error"));

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Failed to fetch exchange rate: 500 Internal Server Error");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          status: 500,
        })
      );
    });

    it("throws and logs telemetry when API returns 502", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse(502, "Bad Gateway"));

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Failed to fetch exchange rate: 502 Bad Gateway");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          status: 502,
        })
      );
    });

    it("throws controlled error when network request fails", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Failed to fetch exchange rate.");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          from: "USD",
          to: "BRL",
          reason: "network_error",
        })
      );
    });

    it("throws controlled error when API returns invalid JSON", async () => {
      const response = new Response(null, {
        status: 200,
        statusText: "OK",
      });

      vi.spyOn(response, "json").mockRejectedValueOnce(new SyntaxError("Unexpected token"));

      vi.mocked(fetch).mockResolvedValueOnce(response);

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Invalid exchange rate API response.");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          reason: "invalid_json",
        })
      );
    });

    it("rejects malformed API response contract", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "USD",
            to: "BRL",
            rate: "invalid",
            date: "2026-08-20",
          },
        })
      );

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Invalid API response contract: exchange rate schema mismatch");

      expect(telemetryService.logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: "exchangeRateService.getRate",
          issues: expect.any(Array),
        })
      );
    });

    it("rejects API response missing data envelope", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          from: "USD",
          to: "BRL",
          rate: 5.42,
          date: "2026-08-20",
        })
      );

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Invalid API response contract: exchange rate schema mismatch");
    });

    it("rejects API response with unsupported currency", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "DOGE",
            to: "BRL",
            rate: 5.42,
            date: "2026-08-20",
          },
        })
      );

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Invalid API response contract: exchange rate schema mismatch");
    });

    it("rejects API response with non-positive rate", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createJsonResponse({
          data: {
            from: "USD",
            to: "BRL",
            rate: 0,
            date: "2026-08-20",
          },
        })
      );

      await expect(
        exchangeRateService.getRate({
          from: "USD",
          to: "BRL",
        })
      ).rejects.toThrow("Invalid API response contract: exchange rate schema mismatch");
    });
  });
});
