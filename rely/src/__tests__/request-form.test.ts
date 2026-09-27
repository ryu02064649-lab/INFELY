import { describe, expect, it, vi } from "vitest";
import { encodeFormData, submitRequest } from "@/lib/submit-request";
import { validateRequest } from "@/lib/validate-request";

function form(entries: [string, string][]) {
  const fd = new FormData();
  entries.forEach(([k, v]) => fd.append(k, v));
  return fd;
}

describe("validateRequest", () => {
  it("requires name, email, at least one category and consent", () => {
    const errors = validateRequest(form([]));
    expect(Object.keys(errors).sort()).toEqual(["category", "consent", "email", "name"]);
  });

  it("rejects a malformed email", () => {
    const errors = validateRequest(
      form([["name", "A"], ["email", "not-an-email"], ["category", "OTHER"], ["consent", "yes"]]),
    );
    expect(errors.email).toBeDefined();
    expect(errors.name).toBeUndefined();
  });

  it("accepts a minimal valid request", () => {
    expect(
      validateRequest(
        form([["name", "山田"], ["email", "a@example.com"], ["category", "DINING"], ["consent", "yes"]]),
      ),
    ).toEqual({});
  });
});

describe("encodeFormData", () => {
  it("joins repeated category values into one field", () => {
    const body = encodeFormData(form([["category", "STAY"], ["category", "DINING"], ["name", "A B"]]));
    const params = new URLSearchParams(body);
    expect(params.get("category")).toBe("STAY, DINING");
    expect(params.get("name")).toBe("A B");
  });
});

describe("submitRequest", () => {
  it("POSTs urlencoded data including form-name", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    await submitRequest(form([["name", "A"]]), fetcher);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("/");
    expect(init.method).toBe("POST");
    expect(new URLSearchParams(init.body).get("form-name")).toBe("request");
  });

  it("throws when the endpoint fails", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("no", { status: 500 }));
    await expect(submitRequest(form([]), fetcher)).rejects.toThrow();
  });
});
