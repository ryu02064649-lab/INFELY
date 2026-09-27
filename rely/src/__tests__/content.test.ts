import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { services, serviceCategories } from "@/data/services";
import { plans, option, pricingNotes } from "@/data/pricing";
import { steps } from "@/data/steps";
import { candidates, candidateRows } from "@/data/example";

const publicDir = join(__dirname, "..", "..", "public");

describe("services", () => {
  it("keeps the specified display order, ending with OTHER", () => {
    expect(services.map((s) => s.name)).toEqual([
      "DINING",
      "STAY",
      "EXPERIENCE",
      "GIFT",
      "RESEARCH",
      "OTHER",
    ]);
  });

  it("has unique ids and matches the form categories", () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(serviceCategories.map((c) => c.label)).toEqual(services.map((s) => s.name));
  });

  it("references images that exist and have alt text", () => {
    for (const s of services) {
      if (!s.image) continue;
      expect(s.image.alt.length).toBeGreaterThan(0);
      expect(existsSync(join(publicDir, s.image.src))).toBe(true);
    }
  });
});

describe("pricing", () => {
  it("lists the agreed prices", () => {
    const table = Object.fromEntries([...plans, option].map((p) => [p.name, `${p.price}${p.suffix}`]));
    expect(table).toEqual({
      "ONE REQUEST": "¥10,000〜",
      "DEEP RESEARCH": "¥25,000〜",
      "RELY CONCIERGE": "¥48,000〜 / MONTH",
      "BUSINESS RESEARCH": "¥30,000〜",
      "RESERVATION / ARRANGEMENT SUPPORT": "¥2,000〜",
    });
  });

  it("states that actual goods/venue costs are separate", () => {
    expect(pricingNotes.some((n) => n.includes("別途"))).toBe(true);
  });
});

describe("how it works", () => {
  it("has four steps in order", () => {
    expect(steps.map((s) => s.name)).toEqual(["REQUEST", "RESEARCH", "CURATION", "DELIVERY"]);
  });
});

describe("example", () => {
  it("fills every comparison row for every candidate", () => {
    for (const c of candidates) {
      for (const row of candidateRows) expect(c.values[row.key]).toBeTruthy();
      expect(c.reason).toBeTruthy();
    }
  });

  it("uses placeholder names, not real venues", () => {
    expect(candidates.map((c) => c.name)).toEqual(["RESTAURANT A", "RESTAURANT B", "RESTAURANT C"]);
  });
});

describe("copy guardrails", () => {
  const all = JSON.stringify({ services, plans, option, pricingNotes, steps, candidates });
  it("contains no guarantee wording or rating/review claims", () => {
    for (const banned of ["必ず予約", "保証", "★", "万人", "満足度", "No.1"]) {
      expect(all).not.toContain(banned);
    }
  });
});
