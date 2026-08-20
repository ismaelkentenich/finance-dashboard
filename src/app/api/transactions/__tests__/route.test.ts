import { GET } from "@/app/api/transactions/route";
import { MockTransactionRepository } from "@/services/repository/mockTransactionRepository";
import { setTransactionRepository } from "@/services/repository/transactionRepository";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

function createRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost/api/transactions${query}`);
}

describe("GET /api/transactions", () => {
  beforeEach(() => {
    setTransactionRepository(new MockTransactionRepository([]));
  });

  it("returns 400 when period is invalid", async () => {
    const response = await GET(createRequest("?period=invalid-period"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.error).toBe("Invalid transaction query parameters.");

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "period",
        }),
      ])
    );
  });

  it("returns 400 when type is invalid", async () => {
    const response = await GET(createRequest("?type=transfer"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "type",
        }),
      ])
    );
  });

  it("returns 400 when category is invalid", async () => {
    const response = await GET(createRequest("?category=invalid-category"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "category",
        }),
      ])
    );
  });

  it("returns 400 when currency is unsupported", async () => {
    const response = await GET(createRequest("?currency=DOGE"));

    const json = await response.json();

    expect(response.status).toBe(400);

    expect(json.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "currency",
        }),
      ])
    );
  });

  it("accepts supported transaction query parameters", async () => {
    const response = await GET(
      createRequest("?period=previous-month&type=expense&category=food&currency=BRL")
    );

    const json = await response.json();

    expect(response.status).toBe(200);

    expect(json).toEqual(
      expect.objectContaining({
        data: {
          transactions: [],
          summary: expect.any(Object),
          categories: [],
        },

        meta: {
          totalCount: 0,
          period: "previous-month",
        },
      })
    );
  });

  it("uses current-month and BRL defaults when query parameters are omitted", async () => {
    const response = await GET(createRequest());

    const json = await response.json();

    expect(response.status).toBe(200);

    expect(json.meta).toEqual({
      totalCount: 0,
      period: "current-month",
    });
  });

  it("accepts all for type and category filters", async () => {
    const response = await GET(createRequest("?type=all&category=all"));

    expect(response.status).toBe(200);
  });
});
