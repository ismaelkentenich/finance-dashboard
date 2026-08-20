import { POST } from "@/app/api/transactions/route";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/transactions - Server-Side Validation", () => {
  it("creates a transaction and returns 201 for a valid payload", async () => {
    const validPayload = {
      description: "Supermercado Mensal",
      amount: 450.75,
      currency: "BRL",
      type: "expense",
      category: "food",
      date: "2026-08-15",
    };

    const request = createPostRequest(validPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.data).toMatchObject({
      description: "Supermercado Mensal",
      amount: 450.75,
      currency: "BRL",
      type: "expense",
      category: "food",
      date: "2026-08-15",
    });
    expect(json.data.id).toBeDefined();
    expect(json.data.createdAt).toBeDefined();
  });

  it("returns 400 when required fields are missing", async () => {
    const invalidPayload = {
      description: "Falta o resto",
    };

    const request = createPostRequest(invalidPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Payload de transação inválido.");
    expect(json.issues.length).toBeGreaterThan(0);
  });

  it("returns 400 when currency is missing", async () => {
    const invalidPayload = {
      description: "Supermercado Mensal",
      amount: 450.75,
      type: "expense",
      category: "food",
      date: "2026-08-15",
    };

    const response = await POST(createPostRequest(invalidPayload));

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

  it("returns 400 when currency is unsupported", async () => {
    const invalidPayload = {
      description: "Supermercado Mensal",
      amount: 450.75,
      currency: "DOGE",
      type: "expense",
      category: "food",
      date: "2026-08-15",
    };

    const response = await POST(createPostRequest(invalidPayload));

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

  it("returns 400 when type is not 'income' or 'expense'", async () => {
    const invalidPayload = {
      description: "Transferência",
      amount: 100,
      type: "transfer", // invalid enum
      category: "services",
      date: "2026-08-15",
    };

    const request = createPostRequest(invalidPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "type" })])
    );
  });

  it("returns 400 when category is invalid", async () => {
    const invalidPayload = {
      description: "Jogo de azar",
      amount: 100,
      type: "expense",
      category: "gambling_non_existent",
      date: "2026-08-15",
    };

    const request = createPostRequest(invalidPayload);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "category" })])
    );
  });

  it("returns 400 when amount is non-finite, zero or negative", async () => {
    const zeroPayload = {
      description: "Teste Zero",
      amount: 0,
      type: "expense",
      category: "food",
      date: "2026-08-15",
    };

    const responseZero = await POST(createPostRequest(zeroPayload));
    expect(responseZero.status).toBe(400);

    const negativePayload = {
      description: "Teste Negativo",
      amount: -50,
      type: "expense",
      category: "food",
      date: "2026-08-15",
    };

    const responseNegative = await POST(createPostRequest(negativePayload));
    expect(responseNegative.status).toBe(400);
  });

  it("returns 400 when date is invalid or in incorrect format", async () => {
    const invalidDatePayload = {
      description: "Teste Data",
      amount: 100,
      type: "income",
      category: "salary",
      date: "15/08/2026", // format error
    };

    const response = await POST(createPostRequest(invalidDatePayload));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "date" })])
    );
  });

  it("returns 400 when unexpected extra properties are present due to strict schema", async () => {
    const extraPayload = {
      description: "Teste Extra Field",
      amount: 100,
      type: "income",
      category: "salary",
      date: "2026-08-15",
      isAdmin: true, // unrecognised key
    };

    const response = await POST(createPostRequest(extraPayload));
    expect(response.status).toBe(400);
  });
});
