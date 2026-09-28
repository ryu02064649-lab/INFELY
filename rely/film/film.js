/**
 * RELY — 15-second brand film.
 *
 * Every frame is drawn by code on a 2D canvas: no footage, no templates.
 * The only borrowed asset is the site's own emblem (public/images/emblem.webp)
 * and the site's own typefaces (film/fonts, copied from the site build).
 *
 * The film is a pure function of time: `film.draw(t)` always produces the
 * same frame for the same t, so the preview and the exported video match.
 *
 * Logical frame: 1080 × 1920 (9:16). All layout below is in those units.
 */

export const FILM = { width: 1080, height: 1920, fps: 30, duration: 15 };

/** Scene cues, in seconds. Use these to cut music to picture. */
export const CUES = [
  { t: 0.0, id: "dark", label: "暗闇 — ロゴに一筋の光" },
  { t: 2.0, id: "space", label: "空間 — 探す。" },
  { t: 4.5, id: "fragments", label: "情報の断片 — 比較する。" },
  { t: 7.0, id: "select", label: "整理 — 多数から、ひとつへ" },
  { t: 9.5, id: "quiet", label: "静寂 — あなたが選ぶ。その前を、RELYが。" },
  { t: 12.0, id: "mark", label: "ロゴ — RELY" },
  { t: 14.0, id: "tagline", label: "あなたの時間を、もっと自由に。" },
  { t: 15.0, id: "end", label: "黒" },
];

const W = FILM.width;
const H = FILM.height;

const BG = "#090909";
const IVORY = "244,241,234";
const SILVER = "184,184,184";

/* ------------------------------------------------------------------ */
/* Timing                                                              */
/* ------------------------------------------------------------------ */

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 40; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-7) break;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

/** No linear motion anywhere: every move starts slowly and settles slowly. */
const EASE = {
  // heavy start, carried middle, long settle — the closing car door
  door: bezier(0.66, 0, 0.18, 1),
  // text and light arriving
  reveal: bezier(0.45, 0, 0.12, 1),
  // leaving
  leave: bezier(0.5, 0, 0.55, 1),
  // long camera travel
  travel: bezier(0.42, 0, 0.3, 1),
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b, ease = EASE.door) => ease(clamp01((t - a) / (b - a)));
/** 0 → 1 between a–b, back to 0 between c–d. */
const win = (t, a, b, c, d, ein = EASE.reveal, eout = EASE.leave) =>
  Math.min(seg(t, a, b, ein), 1 - seg(t, c, d, eout));

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Canvas helpers                                                      */
/* ------------------------------------------------------------------ */

function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/* ------------------------------------------------------------------ */
/* Procedural black marble                                             */
/* ------------------------------------------------------------------ */

function valueNoise(seed) {
  const r = rng(seed);
  const p = new Uint8Array(512);
  const v = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = i;
    v[i] = r();
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  const h = (x, y) => v[p[(p[x & 255] + y) & 255]];
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
}

function makeMarble(w, h, seed) {
  const n = valueNoise(seed);
  const fbm = (x, y) => {
    let s = 0, a = 0.5, f = 1;
    for (let o = 0; o < 5; o++) {
      s += a * n(x * f + o * 17.3, y * f - o * 9.1);
      f *= 2.03;
      a *= 0.5;
    }
    return s / 0.97;
  };
  const smooth = (e0, e1, x) => {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };
  const c = canvas(w, h);
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  const d = img.data;
  // Nero Marquina: long, thin, branching veins running on a diagonal
  const ca = Math.cos(0.62), sa = Math.sin(0.62);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = (x / w) * 2.4, v = (y / h) * 4.27;
      // rotate, then stretch along the grain
      const ru = (u * ca - v * sa) * 0.42, rv = u * sa + v * ca;
      const wx = fbm(ru * 1.5 + 3.3, rv * 1.5 - 1.7), wy = fbm(ru * 1.5 - 7.9, rv * 1.5 + 2.2);
      const n1 = fbm(ru + 0.55 * wx, rv + 0.55 * wy);
      const r1 = 1 - Math.abs(n1 - 0.5) * 2;
      let vein = Math.pow(r1, 46);
      const n2 = fbm(ru * 2.6 + 0.4 * wy + 5.5, rv * 2.1 + 0.4 * wx - 3.1);
      vein += 0.45 * Math.pow(1 - Math.abs(n2 - 0.5) * 2, 110);
      const n3 = fbm(u * 5.5 + 21, v * 5.5 - 8);
      vein += 0.12 * Math.pow(1 - Math.abs(n3 - 0.5) * 2, 60);
      vein *= 0.2 + 0.8 * smooth(0.36, 0.66, fbm(u * 0.8 + 11, v * 0.8 + 4));
      const cloud = 0.045 + 0.075 * fbm(u * 1.3 - 4, v * 1.3 + 9) + 0.02 * wx;
      const i = (y * w + x) * 4;
      d[i] = 255 * Math.min(1, cloud + vein * 0.78);
      d[i + 1] = 255 * Math.min(1, cloud * 0.99 + vein * 0.77);
      d[i + 2] = 255 * Math.min(1, cloud * 0.97 + vein * 0.74);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

const TYPE = {
  jp: (size, weight = 500) => `${weight} ${size}px "Bodoni Moda", "Shippori Mincho", serif`,
  display: (size, weight = 400) => `${weight} ${size}px "Bodoni Moda", serif`,
  label: (size) => `400 ${size}px "Jost", sans-serif`,
};

/* ------------------------------------------------------------------ */
/* Story content                                                       */
/* ------------------------------------------------------------------ */

const WORD_SEARCH = "探す。";
const WORD_COMPARE = "比較する。";
const LINE_CHOOSE = "あなたが選ぶ。";
const LINE_BEFORE = "その前を、RELYが。";
const WORDMARK = "RELY";
const CATEGORY = "PRIVATE RESEARCH & CONCIERGE";
const TAGLINE = "あなたの時間を、もっと自由に。";

/** The five that survive the sorting. Order = final list order. */
const KEY_WORDS = ["Restaurant", "Hotel", "Experience", "Gift", "Research"];
const KEY_START = [
  [0.3, 0.215],
  [0.72, 0.305],
  [0.27, 0.665],
  [0.73, 0.72],
  [0.5, 0.8],
];

const FRAGMENTS = [
  ["Omakase", "d"], ["Ryokan", "d"], ["Suite", "d"], ["Vintage", "d"],
  ["Florist", "d"], ["Private room", "d"],
  ["Anniversary", "d"], ["Tasting menu", "d"],
  ["Itinerary", "d"], ["Chef's table", "d"],
  ["DINING", "l"], ["STAY", "l"], ["SEASON", "l"], ["DRESS CODE", "l"],
  ["OCCASION", "l"], ["LOCATION", "l"],
];

/* ------------------------------------------------------------------ */
/* Film                                                                */
/* ------------------------------------------------------------------ */

export class Film {
  constructor(target) {
    this.canvas = target;
    this.ctx = target.getContext("2d");
    this.textCache = new Map();
    this.setSize(target.width, target.height);
  }

  setSize(pw, ph) {
    this.canvas.width = pw;
    this.canvas.height = ph;
    this.s = pw / W;
    this.pw = pw;
    this.ph = ph;
    this.layerA = canvas(pw, ph);
    this.layerB = canvas(pw, ph);
    this.layerC = canvas(pw, ph);
    this.textCache.clear();
  }

  async load(base = "..") {
    const emblem = new Image();
    emblem.src = `${base}/public/images/emblem.webp`;
    await emblem.decode();
    this.buildEmblem(emblem);
    this.marble = makeMarble(720, 1280, 7);
    this.buildGrain();
    this.buildLayout();
    const loads = [];
    const jpText = WORD_SEARCH + WORD_COMPARE + LINE_CHOOSE + LINE_BEFORE + TAGLINE;
    loads.push(document.fonts.load(TYPE.jp(40), jpText));
    loads.push(document.fonts.load(TYPE.jp(40, 400), jpText));
    loads.push(document.fonts.load(TYPE.display(40), WORDMARK + KEY_WORDS.join("") + FRAGMENTS.map((f) => f[0]).join("")));
    loads.push(document.fonts.load(TYPE.label(20), CATEGORY + FRAGMENTS.map((f) => f[0]).join("")));
    await Promise.all(loads);
    await document.fonts.ready;
  }

  /** Emblem: a dark body (black material) and a highlight map (where light catches). */
  buildEmblem(img) {
    const n = img.naturalWidth;
    const src = canvas(n, n);
    const sctx = src.getContext("2d");
    sctx.drawImage(img, 0, 0);
    const data = sctx.getImageData(0, 0, n, n);
    const body = sctx.createImageData(n, n);
    const spec = sctx.createImageData(n, n);
    for (let i = 0; i < data.data.length; i += 4) {
      const r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
      const raw = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      // the artwork sits on a flat #0a0a0a field: remove it so no square shows
      const l = Math.max(0, raw - 0.047) / 0.953;
      const keep = raw > 0 ? l / raw : 0;
      // desaturate the bronze to a cool silver with a trace of warmth
      const k = 0.14;
      const br = Math.min(255, (l * 255 * (1 - k) + r * keep * k) * 1.08);
      const bg = Math.min(255, (l * 255 * (1 - k) + g * keep * k) * 1.08);
      const bb = Math.min(255, (l * 255 * (1 - k) + b * keep * k) * 1.1);
      body.data.set([br, bg, bb, 255], i);
      const h = Math.min(1, Math.pow(l, 1.9) * 2.1);
      spec.data.set([244 * h, 241 * h, 236 * h, 255], i);
    }
    this.emblemBody = canvas(n, n);
    this.emblemBody.getContext("2d").putImageData(body, 0, 0);
    this.emblemSpec = canvas(n, n);
    this.emblemSpec.getContext("2d").putImageData(spec, 0, 0);
    this.emblemWork = canvas(n, n);
    this.emblemSize = n;
  }

  buildGrain() {
    const r = rng(42);
    this.grain = [];
    for (let k = 0; k < 4; k++) {
      const c = canvas(540, 960);
      const ctx = c.getContext("2d");
      const img = ctx.createImageData(540, 960);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 128 + (r() - 0.5) * 90;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      this.grain.push(c);
    }
  }

  /** Fragment positions: seeded, spread out, clear of the centre line. */
  buildLayout() {
    const r = rng(1908);
    const placed = KEY_START.map(([x, y]) => [x * W, y * H]);
    this.fragments = [];
    for (const [text, kind] of FRAGMENTS) {
      let x = 0, y = 0;
      for (let tries = 0; tries < 400; tries++) {
        x = W * (0.12 + r() * 0.76);
        y = H * (0.14 + r() * 0.72);
        const inCentre = Math.abs(y - H * 0.5) < H * 0.085;
        const tooClose = placed.some(([px, py]) => Math.abs(px - x) < 320 && Math.abs(py - y) < 120);
        if (!inCentre && !tooClose) break;
      }
      placed.push([x, y]);
      const depth = 0.72 + r() * 0.85;
      const start = 4.5 + r() * 1.5;
      const life = 0.9 + r() * 0.9;
      this.fragments.push({ text, kind, x, y, depth, start, end: Math.min(7.25, start + life) });
    }
  }

  /* ---------- text ---------- */

  textImage(text, font, trackingEm, size) {
    const key = `${text}|${font}|${trackingEm}|${this.s}`;
    let hit = this.textCache.get(key);
    if (hit) return hit;
    const s = this.s;
    const probe = canvas(4, 4).getContext("2d");
    probe.font = font.replace(/(\d+(\.\d+)?)px/, (m, v) => `${v * s}px`);
    probe.letterSpacing = `${trackingEm * size * s}px`;
    const m = probe.measureText(text);
    const pad = Math.ceil(40 * s);
    const tw = m.width - trackingEm * size * s;
    const asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
    const c = canvas(tw + pad * 2, asc + desc + pad * 2);
    const ctx = c.getContext("2d");
    ctx.font = probe.font;
    ctx.letterSpacing = probe.letterSpacing;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, pad, pad + asc);
    hit = { c, pad, tw, asc, desc };
    this.textCache.set(key, hit);
    return hit;
  }

  /**
   * Draw text centred on (x, baseline y) with the film's reveal vocabulary:
   * opacity, blur → sharp, a slight vertical settle, and an optional
   * left-to-right light wipe.
   */
  text(text, { x, y, font, size, tracking = 0, color = IVORY, alpha = 1, blur = 0, rise = 0, wipe = null, soft = 0.35 }) {
    if (alpha <= 0.002) return;
    const s = this.s;
    const img = this.textImage(text, font, tracking, size);
    let src = img.c;
    if (wipe !== null && wipe < 1) {
      const w = this.layerC;
      const wctx = w.getContext("2d");
      wctx.setTransform(1, 0, 0, 1, 0, 0);
      wctx.globalCompositeOperation = "copy";
      wctx.drawImage(img.c, 0, 0);
      wctx.globalCompositeOperation = "destination-in";
      const x0 = img.pad, span = img.tw;
      const edge = lerp(-soft, 1, wipe);
      const g = wctx.createLinearGradient(x0, 0, x0 + span, 0);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(clamp01(edge), "rgba(0,0,0,1)");
      g.addColorStop(clamp01(edge + soft), "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, img.c.width, img.c.height);
      wctx.globalCompositeOperation = "source-over";
      src = w;
    }
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // tint: draw white glyphs through a coloured fill
    const t = this.layerB;
    const tctx = t.getContext("2d");
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = "copy";
    tctx.drawImage(src, 0, 0, img.c.width, img.c.height, 0, 0, img.c.width, img.c.height);
    tctx.globalCompositeOperation = "source-in";
    tctx.fillStyle = `rgb(${color})`;
    tctx.fillRect(0, 0, img.c.width, img.c.height);
    tctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = clamp01(alpha);
    if (blur > 0.05) ctx.filter = `blur(${blur * s}px)`;
    const dx = x * s - img.tw / 2 - img.pad;
    const dy = (y + rise) * s - img.asc - img.pad;
    ctx.drawImage(t, 0, 0, img.c.width, img.c.height, dx, dy, img.c.width, img.c.height);
    ctx.restore();
  }

  /* ---------- emblem ---------- */

  /**
   * The emblem as dark material: a faint body, and a narrow band of light
   * that only exists where the surface catches it.
   */
  emblem({ cx, cy, size, body, sweep, width = 0.1, gain = 1, angle = -0.42 }) {
    const ctx = this.ctx;
    const s = this.s;
    const n = this.emblemSize;
    const x = (cx - size / 2) * s, y = (cy - size / 2) * s, d = size * s;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    if (body > 0.002) {
      ctx.globalAlpha = clamp01(body);
      ctx.drawImage(this.emblemBody, x, y, d, d);
    }
    if (sweep !== null && gain > 0.002) {
      const w = this.emblemWork;
      const wctx = w.getContext("2d");
      wctx.globalCompositeOperation = "copy";
      wctx.drawImage(this.emblemSpec, 0, 0);
      wctx.globalCompositeOperation = "destination-in";
      const dirx = Math.cos(angle), diry = Math.sin(angle);
      const c = n / 2, L = n * 0.9;
      const g = wctx.createLinearGradient(c - dirx * L, c - diry * L, c + dirx * L, c + diry * L);
      const p = lerp(-width * 2, 1 + width * 2, sweep);
      const stop = (o, a) => {
        const v = p + o;
        if (v > 0 && v < 1) g.addColorStop(v, `rgba(0,0,0,${a})`);
      };
      g.addColorStop(0, "rgba(0,0,0,0)");
      stop(-width * 2.2, 0);
      stop(-width, 0.22);
      stop(-width * 0.35, 0.75);
      stop(0, 1);
      stop(width * 0.35, 0.75);
      stop(width, 0.22);
      stop(width * 2.2, 0);
      g.addColorStop(1, "rgba(0,0,0,0)");
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, n, n);
      wctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = clamp01(gain);
      ctx.drawImage(w, x, y, d, d);
    }
    ctx.restore();
  }

  /* ---------- the marble room ---------- */

  /**
   * A black marble wall and a polished floor, seen from eye level.
   * dist: camera distance to the wall. light: x of the vertical slit of light.
   */
  room(t, { dist, light, ambient, beam }) {
    const s = this.s, pw = this.pw, ph = this.ph;
    const f = 1100, eye = 1, vpx = W / 2, vpy = H * 0.44;
    const texPerUnit = 172;
    const tex = this.marble;
    const baseY = vpy + (f * eye) / dist;

    // A: the room fully lit (albedo)
    const A = this.layerA.getContext("2d");
    A.setTransform(1, 0, 0, 1, 0, 0);
    A.globalCompositeOperation = "source-over";
    A.globalAlpha = 1;
    A.fillStyle = "#000";
    A.fillRect(0, 0, pw, ph);
    const dw = (f * (tex.width / texPerUnit)) / dist;
    const dh = (f * (tex.height / texPerUnit)) / dist;
    A.drawImage(tex, (vpx - dw / 2) * s, (baseY - dh) * s, dw * s, dh * s);
    // floor, row by row in perspective
    A.globalAlpha = 0.5;
    for (let py = Math.ceil(baseY * s); py < ph; py++) {
      const dy = py / s - vpy;
      const z = (f * eye) / dy;
      const sw = Math.min(tex.width, (W * z * texPerUnit) / f);
      const worldFromWall = dist - z;
      const sy = ((worldFromWall * texPerUnit * 1.4) % tex.height + tex.height) % tex.height;
      A.drawImage(tex, tex.width / 2 - sw / 2, sy, sw, 1, 0, py, pw, 1);
    }
    A.globalAlpha = 1;

    // B: only what the slit of light touches
    const B = this.layerB.getContext("2d");
    B.setTransform(1, 0, 0, 1, 0, 0);
    B.globalCompositeOperation = "copy";
    B.drawImage(this.layerA, 0, 0);
    B.globalCompositeOperation = "destination-in";
    const lx = light * s, bw = 330 * s;
    const g = B.createLinearGradient(lx - bw, 0, lx + bw, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.3, "rgba(0,0,0,0.1)");
    g.addColorStop(0.44, "rgba(0,0,0,0.55)");
    g.addColorStop(0.5, "rgba(0,0,0,1)");
    g.addColorStop(0.56, "rgba(0,0,0,0.55)");
    g.addColorStop(0.7, "rgba(0,0,0,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    B.fillStyle = g;
    B.fillRect(0, 0, pw, ph);
    const v = B.createLinearGradient(0, 0, 0, ph);
    v.addColorStop(0, "rgba(0,0,0,0.25)");
    v.addColorStop(0.42, "rgba(0,0,0,1)");
    v.addColorStop((baseY / H) * 0.999, "rgba(0,0,0,0.85)");
    v.addColorStop(1, "rgba(0,0,0,0.2)");
    B.fillStyle = v;
    B.fillRect(0, 0, pw, ph);
    B.globalCompositeOperation = "source-over";

    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = clamp01(ambient);
    ctx.drawImage(this.layerA, 0, 0);
    ctx.globalAlpha = clamp01(beam);
    ctx.drawImage(this.layerB, 0, 0);

    // polished floor: a faint, fading reflection of the lit wall
    const C = this.layerC.getContext("2d");
    C.setTransform(1, 0, 0, 1, 0, 0);
    C.globalCompositeOperation = "copy";
    C.globalAlpha = 1;
    C.save();
    C.translate(0, 2 * baseY * s);
    C.scale(1, -1);
    C.drawImage(this.layerB, 0, 0);
    C.restore();
    C.globalCompositeOperation = "destination-in";
    const r = C.createLinearGradient(0, baseY * s, 0, (baseY + 520) * s);
    r.addColorStop(0, "rgba(0,0,0,0.55)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    C.fillStyle = r;
    C.fillRect(0, 0, pw, ph);
    C.fillStyle = "#000";
    C.globalCompositeOperation = "destination-out";
    C.fillRect(0, 0, pw, baseY * s);
    C.globalCompositeOperation = "source-over";
    ctx.globalAlpha = clamp01(beam) * 0.6;
    ctx.filter = `blur(${2.5 * s}px)`;
    ctx.drawImage(this.layerC, 0, 0);
    ctx.filter = "none";

    // the seam where wall meets floor: a silver hairline that glints under the light
    const seam = ctx.createLinearGradient(lx - bw * 1.2, 0, lx + bw * 1.2, 0);
    seam.addColorStop(0, `rgba(${SILVER},0)`);
    seam.addColorStop(0.5, `rgba(${SILVER},0.55)`);
    seam.addColorStop(1, `rgba(${SILVER},0)`);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = clamp01(beam);
    ctx.fillStyle = seam;
    ctx.fillRect(0, baseY * s - s * 0.6, pw, Math.max(1, 1.2 * s));
    ctx.globalAlpha = clamp01(ambient) * 0.5 * (1 - seg(t, 4.3, 4.9, EASE.leave));
    ctx.fillStyle = `rgba(${SILVER},0.35)`;
    ctx.fillRect(0, baseY * s - s * 0.6, pw, Math.max(1, 1.2 * s));

    // the air inside the beam, barely there
    ctx.globalCompositeOperation = "lighter";
    const hz = ctx.createLinearGradient(lx - 150 * s, 0, lx + 150 * s, 0);
    hz.addColorStop(0, `rgba(${IVORY},0)`);
    hz.addColorStop(0.5, `rgba(${IVORY},0.045)`);
    hz.addColorStop(1, `rgba(${IVORY},0)`);
    ctx.globalAlpha = clamp01(beam);
    ctx.fillStyle = hz;
    ctx.fillRect(lx - 150 * s, 0, 300 * s, baseY * s);

    // dust, visible only inside the beam
    const r2 = rng(5);
    for (let i = 0; i < 8; i++) {
      const mx = r2() * W;
      const my = H * (0.12 + r2() * 0.5) - t * (6 + r2() * 10);
      const ms = 2 + r2() * 1.6;
      const inBeam = Math.exp(-Math.pow((mx - light) / 110, 2));
      const a = inBeam * beam * 0.22;
      if (a < 0.01) continue;
      const rg = ctx.createRadialGradient(mx * s, my * s, 0, mx * s, my * s, ms * 3 * s);
      rg.addColorStop(0, `rgba(${IVORY},${a})`);
      rg.addColorStop(1, `rgba(${IVORY},0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = rg;
      ctx.fillRect((mx - ms * 3) * s, (my - ms * 3) * s, ms * 6 * s, ms * 6 * s);
    }
    ctx.restore();
    return baseY;
  }

  /* ---------- hairline ---------- */

  hairline(cx, y, width, alpha, glint = null) {
    if (alpha <= 0.002 || width <= 0.5) return;
    const ctx = this.ctx, s = this.s;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = clamp01(alpha);
    ctx.fillStyle = `rgba(${IVORY},0.42)`;
    ctx.fillRect((cx - width / 2) * s, y * s, width * s, Math.max(1, 1.1 * s));
    if (glint !== null && glint > 0 && glint < 1) {
      const gx = cx - width / 2 + width * glint;
      const g = ctx.createLinearGradient((gx - 90) * s, 0, (gx + 90) * s, 0);
      g.addColorStop(0, `rgba(${IVORY},0)`);
      g.addColorStop(0.5, `rgba(${IVORY},1)`);
      g.addColorStop(1, `rgba(${IVORY},0)`);
      ctx.fillStyle = g;
      ctx.fillRect((cx - width / 2) * s, (y - 0.4) * s, width * s, Math.max(1, 1.9 * s));
    }
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /* The timeline                                                         */
  /* ------------------------------------------------------------------ */

  draw(tRaw) {
    const t = Math.max(0, Math.min(FILM.duration, tRaw));
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, this.pw, this.ph);
    ctx.restore();

    this.sceneOpening(t);
    this.sceneRoom(t);
    this.sceneFragments(t);
    this.sceneSelection(t);
    this.sceneQuiet(t);
    this.sceneMark(t);
    this.finish(t);
  }

  /* 0.0 – 2.0  darkness; light slides across the emblem once */
  sceneOpening(t) {
    if (t > 2.6) return;
    const out = 1 - seg(t, 1.75, 2.5, EASE.leave);
    const body = 0.1 * seg(t, 0.25, 1.4, EASE.reveal) * out;
    const sweep = seg(t, 0.45, 1.95, EASE.door);
    const gain = win(t, 0.45, 0.9, 1.6, 2.05) * 1.45 * out;
    // the camera already leans in, barely
    const size = lerp(420, 432, seg(t, 0, 2.5, EASE.travel));
    this.emblem({ cx: W / 2, cy: H * 0.47, size, body, sweep, width: 0.085, gain });
  }

  /* 2.0 – 4.5  the room; a slit of light crosses; 探す。 */
  sceneRoom(t) {
    if (t < 1.85 || t > 9.6) return;
    const dist = lerp(3.5, 2.55, seg(t, 1.85, 9.5, EASE.travel));
    const light = lerp(-260, 1360, seg(t, 1.95, 5.1, EASE.door));
    const fadeIn = seg(t, 1.9, 3.1, EASE.reveal);
    const dim = lerp(1, 0.42, seg(t, 4.3, 5.4, EASE.leave)) * (1 - seg(t, 6.9, 9.3, EASE.leave));
    const ambient = 0.13 * fadeIn * dim;
    const beam = 1.25 * fadeIn * (1 - seg(t, 4.7, 5.3, EASE.leave));
    this.room(t, { dist, light, ambient, beam });

    // 探す。 — revealed by the same light that crosses the wall
    const tx = W / 2, ty = H * 0.335;
    const img = this.textImage(WORD_SEARCH, TYPE.jp(46), 0.22, 46);
    const reach = clamp01((light - (tx - img.tw / (2 * this.s)) + 60) / (img.tw / this.s + 160));
    const appear = seg(t, 2.6, 3.5, EASE.reveal);
    const leave = 1 - seg(t, 4.15, 4.8, EASE.leave);
    this.text(WORD_SEARCH, {
      x: tx, y: ty, font: TYPE.jp(46), size: 46, tracking: 0.22,
      alpha: appear * leave, blur: (1 - appear) * 7 + (1 - leave) * 5,
      rise: (1 - appear) * 12 - (1 - leave) * 6, wipe: EASE.reveal(reach), soft: 0.5,
    });
  }

  /* 4.5 – 7.0  a world full of information, glimpsed; 比較する。 */
  sceneFragments(t) {
    if (t < 4.4 || t > 7.4) return;
    const zoom = lerp(1, 1.07, seg(t, 4.4, 7.4, EASE.travel));
    const cx = W / 2, cy = H / 2;
    for (const fr of this.fragments) {
      const a = win(t, fr.start, fr.start + 0.45, fr.end - 0.4, fr.end);
      if (a <= 0.003) continue;
      const k = zoom * (1 + (1 - fr.depth) * 0.08 * seg(t, fr.start, fr.end, EASE.travel));
      const x = cx + (fr.x - cx) * k / fr.depth ** 0.25;
      const y = cy + (fr.y - cy) * k / fr.depth ** 0.25;
      const focus = Math.abs(fr.depth - 1);
      const size = fr.kind === "d" ? 44 / fr.depth : 17 / fr.depth ** 0.5;
      const font = fr.kind === "d" ? TYPE.display(size) : TYPE.label(size);
      this.text(fr.text, {
        x, y, font, size, tracking: fr.kind === "d" ? 0.06 : 0.34,
        color: fr.kind === "d" ? IVORY : SILVER,
        alpha: a * (fr.kind === "d" ? 0.62 : 0.7) * (1 - focus * 0.45),
        blur: focus * 9 + (1 - a) * 4,
        rise: (1 - a) * 8,
      });
    }
    // the five that will survive
    if (t < 7.0) {
      KEY_WORDS.forEach((word, i) => {
        const [fx, fy] = KEY_START[i];
        const start = 4.55 + i * 0.22;
        const a = seg(t, start, start + 0.7, EASE.reveal);
        const x = cx + (fx * W - cx) * zoom, y = cy + (fy * H - cy) * zoom;
        this.text(word, {
          x, y, font: TYPE.display(50), size: 50, tracking: 0.06,
          alpha: a * 0.86, blur: (1 - a) * 8, rise: (1 - a) * 10,
        });
      });
    }
    // 比較する。
    const appear = seg(t, 5.25, 6.1, EASE.reveal);
    const leave = 1 - seg(t, 6.55, 7.1, EASE.leave);
    this.text(WORD_COMPARE, {
      x: W / 2, y: H * 0.5 + 16, font: TYPE.jp(46), size: 46, tracking: 0.22,
      alpha: appear * leave, blur: (1 - appear) * 8 + (1 - leave) * 6,
      rise: (1 - appear) * 12 - (1 - leave) * 6, wipe: appear, soft: 0.5,
    });
  }

  /* 7.0 – 9.5  many → a few → one; the one becomes a single line */
  sceneSelection(t) {
    if (t < 6.95 || t > 12.8) return;
    const zoom = lerp(1, 1.07, seg(t, 4.4, 7.4, EASE.travel));
    const cx = W / 2, cy = H / 2;
    const gather = seg(t, 7.0, 8.05, EASE.door);
    const slotGap = 104;
    const lineW = 210;
    KEY_WORDS.forEach((word, i) => {
      const [fx, fy] = KEY_START[i];
      const x0 = cx + (fx * W - cx) * zoom, y0 = cy + (fy * H - cy) * zoom;
      const x1 = cx, y1 = cy + (i - 2) * slotGap;
      const x = lerp(x0, x1, gather), y = lerp(y0, y1, gather);
      const size = lerp(50, 40, gather);
      let a = 0.86;
      let blur = 0;
      let rise = 0;
      const outer = i === 0 || i === 4;
      const inner = i === 1 || i === 3;
      if (outer) {
        const o = seg(t, 8.1, 8.7, EASE.leave);
        a *= 1 - o; blur = o * 6; rise = -o * 8;
      } else if (inner) {
        const o = seg(t, 8.6, 9.2, EASE.leave);
        a *= 1 - o; blur = o * 6; rise = -o * 8;
      } else {
        // the chosen one: brightens, then gives its place to the line
        const lift = seg(t, 8.8, 9.25, EASE.reveal);
        const go = seg(t, 9.25, 9.85, EASE.leave);
        a = lerp(0.86, 1, lift) * (1 - go);
        blur = go * 7;
        rise = -go * 10;
      }
      this.text(word, {
        x, y: y + 14, font: TYPE.display(size), size, tracking: lerp(0.06, 0.16, gather),
        alpha: a, blur, rise,
      });
      // hairlines under each option
      const draw = seg(t, 7.55, 8.25, EASE.door);
      let lw = lineW * draw;
      let la = 1;
      if (outer) la = 1 - seg(t, 8.1, 8.7, EASE.leave);
      else if (inner) la = 1 - seg(t, 8.6, 9.2, EASE.leave);
      if (!outer && !inner) {
        // the chosen line widens, a glint passes, then it settles as the divider
        lw = lerp(lw, 400, seg(t, 8.85, 9.45, EASE.door));
        lw = lerp(lw, 132, seg(t, 9.6, 10.5, EASE.door));
        la *= 1 - seg(t, 12.0, 12.5, EASE.leave);
        const ly = lerp(y1 + 44, cy, seg(t, 9.6, 10.5, EASE.door));
        const glint = seg(t, 8.95, 9.75, EASE.door);
        this.hairline(cx, ly, lw, la, glint > 0 && glint < 1 ? glint : null);
      } else {
        this.hairline(x, y + 44, lw, la);
      }
    });
  }

  /* 9.5 – 12.0  silence; あなたが選ぶ。 / その前を、RELYが。 */
  sceneQuiet(t) {
    if (t < 9.6 || t > 12.7) return;
    const leave = 1 - seg(t, 12.0, 12.6, EASE.leave);
    const a1 = seg(t, 9.75, 10.75, EASE.reveal);
    this.text(LINE_CHOOSE, {
      x: W / 2, y: H / 2 - 62, font: TYPE.jp(52), size: 52, tracking: 0.24,
      alpha: a1 * leave, blur: (1 - a1) * 10 + (1 - leave) * 6,
      rise: (1 - a1) * 14 - (1 - leave) * 6, wipe: a1, soft: 0.6,
    });
    const a2 = seg(t, 10.7, 11.7, EASE.reveal);
    this.text(LINE_BEFORE, {
      x: W / 2, y: H / 2 + 100, font: TYPE.jp(52), size: 52, tracking: 0.24,
      alpha: a2 * leave, blur: (1 - a2) * 10 + (1 - leave) * 6,
      rise: (1 - a2) * 14 - (1 - leave) * 6, wipe: a2, soft: 0.6,
    });
  }

  /* 12.0 – 15.0  the mark, the name, the promise; then black */
  sceneMark(t) {
    if (t < 12.1) return;
    const end = 1 - seg(t, 14.72, 14.93, EASE.leave);
    const endName = 1 - seg(t, 14.78, 14.96, EASE.leave);
    const cy = H * 0.395;
    const body = 0.3 * seg(t, 12.15, 13.3, EASE.reveal) * end;
    const sweep = seg(t, 12.35, 14.3, EASE.door);
    const gain = win(t, 12.4, 12.95, 13.8, 14.4) * 0.9 * end;
    const size = lerp(424, 432, seg(t, 12.1, 15, EASE.travel));
    this.emblem({ cx: W / 2, cy, size, body, sweep, width: 0.11, gain, angle: -0.5 });

    const aName = seg(t, 12.85, 13.75, EASE.reveal);
    this.text(WORDMARK, {
      x: W / 2, y: H * 0.6, font: TYPE.display(96), size: 96, tracking: 0.3,
      alpha: aName * endName, blur: (1 - aName) * 9, rise: (1 - aName) * 12,
    });
    const aCat = seg(t, 13.2, 13.95, EASE.reveal);
    this.text(CATEGORY, {
      x: W / 2, y: H * 0.6 + 64, font: TYPE.label(19), size: 19, tracking: 0.36,
      color: SILVER, alpha: aCat * 0.9 * end, blur: (1 - aCat) * 5, rise: (1 - aCat) * 8,
    });
    const aTag = seg(t, 13.95, 14.35, EASE.reveal);
    this.text(TAGLINE, {
      x: W / 2, y: H * 0.735, font: TYPE.jp(34, 400), size: 34, tracking: 0.2,
      alpha: aTag * 0.92 * end, blur: (1 - aTag) * 6, rise: (1 - aTag) * 8, wipe: aTag, soft: 0.6,
    });
  }

  /** Vignette and a trace of film grain, over everything. */
  finish(t) {
    const ctx = this.ctx, s = this.s;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const v = ctx.createRadialGradient(W / 2 * s, H * 0.47 * s, 200 * s, W / 2 * s, H * 0.47 * s, 1150 * s);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.62)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, this.pw, this.ph);
    const frame = Math.floor(t * FILM.fps);
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = 0.3;
    ctx.drawImage(this.grain[frame % 4], 0, 0, this.pw, this.ph);
    ctx.restore();
  }
}
