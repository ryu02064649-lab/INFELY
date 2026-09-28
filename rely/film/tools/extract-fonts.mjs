/**
 * Copies the font files the film needs out of the site's own build, so the
 * film uses exactly the typefaces the website uses.
 *
 *   npm run build && node film/tools/extract-fonts.mjs
 *
 * Only the files whose unicode-range covers a character used in the film
 * are copied. Re-run after changing any on-screen text in film/film.js.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const chunks = path.join(root, "out/_next/static/chunks");
const media = path.join(root, "out/_next/static/media");
const dest = path.join(root, "film/fonts");

const filmSource = fs.readFileSync(path.join(root, "film/film.js"), "utf8");
// Every character inside a string literal in film.js, plus basic Latin.
const chars = new Set();
for (const m of filmSource.matchAll(/"([^"\n]*)"/g)) for (const c of m[1]) chars.add(c.codePointAt(0));
for (let c = 0x20; c < 0x7f; c++) chars.add(c);

const WANT = {
  "Bodoni Moda": { style: "normal" },
  Jost: { style: "normal" },
  "Shippori Mincho": { style: "normal" },
};

function parseRange(range) {
  return range.split(",").map((part) => {
    const p = part.trim().replace(/^U\+/i, "");
    if (p.includes("?")) return [parseInt(p.replace(/\?/g, "0"), 16), parseInt(p.replace(/\?/g, "f"), 16)];
    const [a, b] = p.split("-");
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  });
}

const css = fs.readdirSync(chunks).filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(path.join(chunks, f), "utf8")).join("\n");
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

const out = [];
const seen = new Set();
for (const [, body] of css.matchAll(/@font-face\{([^}]*)\}/g)) {
  const family = body.match(/font-family:([^;]+)/)?.[1].trim().replace(/['"]/g, "");
  const style = body.match(/font-style:([^;]+)/)?.[1].trim();
  const weight = body.match(/font-weight:([^;]+)/)?.[1].trim();
  const file = body.match(/url\(([^)]+)\)/)?.[1].split("/").pop();
  const range = body.match(/unicode-range:([^;}]+)/)?.[1];
  if (!family || !WANT[family] || style !== WANT[family].style || !file || !range) continue;
  const ranges = parseRange(range);
  const needed = [...chars].some((c) => ranges.some(([a, b]) => c >= a && c <= b));
  if (!needed) continue;
  const key = `${family}|${weight}|${file}`;
  if (seen.has(key)) continue;
  seen.add(key);
  fs.copyFileSync(path.join(media, file), path.join(dest, file));
  out.push(`@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url(${file}) format("woff2");unicode-range:${range};}`);
}
fs.writeFileSync(path.join(dest, "fonts.css"), out.join("\n") + "\n");
console.log(`fonts: ${out.length} faces, ${fs.readdirSync(dest).length - 1} files → film/fonts`);
