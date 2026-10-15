import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { categories, findItem, formatPrice, menu } from "@/data/menu";
import { about, gallery, recommends } from "@/data/content";
import { reserveChannels, telHref, hasReserveChannel } from "@/config/reservation";
import { mapHref, shop } from "@/data/shop";

const publicPath = (src: string) => join(__dirname, "../../public", src);

describe("images", () => {
  const all = [
    "/images/hero.webp",
    "/images/hero-sp.webp",
    about.image.src,
    ...menu.map((m) => m.image),
    ...recommends.map((r) => r.image.src),
    ...gallery.map((g) => g.src),
  ];
  it.each(all)("%s exists in public/", (src) => {
    expect(existsSync(publicPath(src))).toBe(true);
  });
});

describe("menu", () => {
  it("has unique ids", () => {
    expect(new Set(menu.map((m) => m.id)).size).toBe(menu.length);
  });
  it("only uses known categories, and every category has items", () => {
    const ids = new Set<string>(categories.map((c) => c.id));
    menu.forEach((m) => expect(ids.has(m.category)).toBe(true));
    categories.forEach((c) => expect(menu.some((m) => m.category === c.id)).toBe(true));
  });
  it("recommend section references existing items", () => {
    recommends.forEach((r) => expect(() => findItem(r.menuId)).not.toThrow());
  });
  it("formats prices", () => {
    expect(formatPrice(1280)).toBe("¥1,280");
    expect(formatPrice(null)).toBe("価格準備中");
  });
  it("features a lead item for the top page", () => {
    expect(menu.filter((m) => m.featured).length).toBeGreaterThanOrEqual(4);
  });
});

describe("reservation", () => {
  it("builds tel: links from formatted numbers", () => {
    expect(telHref("03-1234-5678")).toBe("tel:0312345678");
    expect(telHref("+81 3 1234 5678")).toBe("tel:+81312345678");
    expect(telHref("")).toBeNull();
  });
  it("disables channels that are not configured", () => {
    const ch = reserveChannels({ phone: "", webUrl: "", webLabel: "WEB" });
    expect(ch.every((c) => c.href === null)).toBe(true);
    expect(hasReserveChannel({ phone: "", webUrl: "", webLabel: "WEB" })).toBe(false);
  });
  it("enables configured channels and rejects non-http URLs", () => {
    const ch = reserveChannels({ phone: "03-1234-5678", webUrl: "javascript:alert(1)", webLabel: "WEB" });
    expect(ch.find((c) => c.kind === "phone")?.href).toBe("tel:0312345678");
    expect(ch.find((c) => c.kind === "web")?.href).toBeNull();
  });
});

describe("shop", () => {
  it("does not link to a map while the address is a placeholder", () => {
    expect(mapHref(shop, true)).toBeNull();
  });
  it("builds a Google Maps search link once the address is real", () => {
    expect(mapHref({ ...shop, mapUrl: "" }, false)).toMatch(/^https:\/\/www\.google\.com\/maps\/search\//);
  });
});

describe("gallery", () => {
  it("does not repeat images shown elsewhere on the top page", () => {
    const elsewhere = new Set([
      "/images/hero.webp",
      "/images/hero-sp.webp",
      about.image.src,
      ...recommends.map((r) => r.image.src),
      ...menu.filter((m) => m.featured).map((m) => m.image),
    ]);
    const srcs = gallery.map((g) => g.src);
    expect(new Set(srcs).size).toBe(srcs.length);
    srcs.forEach((s) => expect(elsewhere.has(s)).toBe(false));
  });
});
