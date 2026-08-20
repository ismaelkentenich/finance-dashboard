import { exchangeRateProvider } from "@/services/exchange";
import { telemetryService } from "@/services/telemetry";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../route";

vi.mock("@/services/exchange", () => ({
  exchangeRateProvider: {
    getRate: vi.fn(),
  },
}));

function createRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost/api/exchange-rates${query}`);
}

describe("GET /api/exchange-rates", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  it("returns exchange rate for valid request", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });

    const response = await GET(createRequest("?from=USD&to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(200);

    expect(exchangeRateProvider.getRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
      date: undefined,
    });

    expect(json).toEqual({
      data: {
        from: "USD",
        to: "BRL",
        rate: 5.42,
        date: "2026-08-20",
      },
    });
  });

  it("passes historical date to exchange rate provider", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });

    const response = await GET(createRequest("?from=USD&to=BRL&date=2026-01-10"));

    const json = await response.json();

    expect(response.status).toBe(200);

    expect(exchangeRateProvider.getRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
      date: "2026-01-10",
    });

    expect(json.data).toEqual({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });
  });

  it("returns 400 when from currency is missing", async () => {
    const response = await GET(createRequest("?to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.error).toBe("Invalid exchange rate query parameters.");

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("returns 400 when to currency is missing", async () => {
    const response = await GET(createRequest("?from=USD"));

    expect(response.status).toBe(400);

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported source currency", async () => {
    const response = await GET(createRequest("?from=DOGE&to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "from",
        }),
      ])
    );

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported target currency", async () => {
    const response = await GET(createRequest("?from=USD&to=DOGE"));

    expect(response.status).toBe(400);

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid historical date format", async () => {
    const response = await GET(createRequest("?from=USD&to=BRL&date=20/08/2026"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "date",
        }),
      ])
    );

    expect(exchangeRateProvider.getRate).not.toHaveBeenCalled();
  });

  it("returns 502 when exchange rate provider fails", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockRejectedValueOnce(
      new Error("Frankfurter unavailable")
    );

    const response = await GET(createRequest("?from=USD&to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(502);

    expect(json).toEqual({
      error: "Unable to retrieve exchange rate.",
    });

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "GET /api/exchange-rates",
        from: "USD",
        to: "BRL",
      })
    );
  });

  it("returns 500 when provider result violates internal response contract", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 0,
      date: "2026-08-20",
    });

    const response = await GET(createRequest("?from=USD&to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(500);

    expect(json).toEqual({
      error: "Unable to retrieve exchange rate.",
    });

    expect(telemetryService.logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        operation: "GET /api/exchange-rates",
        from: "USD",
        to: "BRL",
        issues: expect.any(Array),
      })
    );
  });

  it("supports requests where source and target currencies are equal", async () => {
    vi.mocked(exchangeRateProvider.getRate).mockResolvedValueOnce({
      from: "BRL",
      to: "BRL",
      rate: 1,
      date: "2026-08-20",
    });

    const response = await GET(createRequest("?from=BRL&to=BRL"));

    const json = await response.json();

    expect(response.status).toBe(200);

    expect(json.data).toEqual({
      from: "BRL",
      to: "BRL",
      rate: 1,
      date: "2026-08-20",
    });
  });
});
