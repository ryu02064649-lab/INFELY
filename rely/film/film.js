/**
 * RELY — 20-second brand film.
 *
 * Every frame is drawn by code on a 2D canvas. The three scene plates
 * (research, a toast at dinner, a gift) are rendered from code in Blender
 * (film/scenes); the people in them are fictional. The emblem and the
 * typefaces are the website's own.
 *
 * The film is a pure function of time: `film.draw(t)` always produces the
 * same frame for the same t, so the preview and the exported video match.
 *
 * Logical frame: 1080 × 1920 (9:16). All layout below is in those units.
 */

export const FILM = { width: 1080, height: 1920, fps: 30, duration: 20 };

/** Scene starts, in seconds. The score (film/score.mjs) is cut to these. */
export const T = {
  open: 0.0,
  research: 1.9,
  fragments: 4.8,
  select: 7.3,
  toast: 10.0,
  gift: 12.2,
  quiet: 14.5,
  mark: 17.0,
  tagline: 18.95,
  end: 20.0,
};

export const CUES = [
  { t: T.open, id: "open", label: "暗闇 — ロゴに一筋の光" },
  { t: T.research, id: "research", label: "RESEARCH — 深夜のデスク。探す。" },
  { t: T.fragments, id: "fragments", label: "情報の断片 — 比較する。" },
  { t: T.select, id: "select", label: "整理 — 多数から、ひとつへ" },
  { t: T.toast, id: "toast", label: "DINING — 一本の線が開き、乾杯" },
  { t: T.gift, id: "gift", label: "GIFT — 贈り物を渡す" },
  { t: T.quiet, id: "quiet", label: "あなたが選ぶ。その前を、RELYが。" },
  { t: T.mark, id: "mark", label: "ロゴ — RELY" },
  { t: T.tagline, id: "tagline", label: "あなたの時間を、もっと自由に。" },
  { t: T.end, id: "end", label: "黒" },
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
const LABEL_RESEARCH = "RESEARCH";
const LABEL_DINING = "DINING";
const LABEL_GIFT = "GIFT";
const PLATES = ["research", "toast", "gift"];

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

  async load() {
    const image = async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    };
    this.buildEmblem(await image(new URL("../public/images/emblem.webp", import.meta.url)));
    this.plates = {};
    for (const name of PLATES) this.plates[name] = await image(new URL(`./assets/${name}.webp`, import.meta.url));
    this.buildGrain();
    this.buildLayout();
    const loads = [];
    const jpText = WORD_SEARCH + WORD_COMPARE + LINE_CHOOSE + LINE_BEFORE + TAGLINE;
    loads.push(document.fonts.load(TYPE.jp(40), jpText));
    loads.push(document.fonts.load(TYPE.jp(40, 400), jpText));
    loads.push(document.fonts.load(TYPE.display(40), WORDMARK + KEY_WORDS.join("") + FRAGMENTS.map((f) => f[0]).join("")));
    loads.push(document.fonts.load(TYPE.label(20), CATEGORY + LABEL_RESEARCH + LABEL_DINING + LABEL_GIFT + FRAGMENTS.map((f) => f[0]).join("")));
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
      const start = T.fragments + r() * 1.5;
      const life = 0.9 + r() * 0.9;
      this.fragments.push({ text, kind, x, y, depth, start, end: Math.min(T.select + 0.25, start + life) });
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

  /* ---------- scene plates ---------- */

  /**
   * A rendered scene, drawn to cover the frame. zoom ≥ 1 pushes in toward
   * the focal point (fx, fy) without ever enlarging past the plate's pixels.
   */
  plate(name, { alpha = 1, zoom = 1, fx = 0.5, fy = 0.5, blur = 0, bright = 1, clip = null }) {
    if (alpha <= 0.002) return;
    const ctx = this.ctx, pw = this.pw, ph = this.ph, s = this.s;
    const img = this.plates[name];
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (clip) {
      ctx.beginPath();
      ctx.rect(0, clip[0] * s, pw, (clip[1] - clip[0]) * s);
      ctx.clip();
    }
    const filters = [];
    if (blur > 0.05) filters.push(`blur(${blur * s}px)`);
    if (Math.abs(bright - 1) > 0.005) filters.push(`brightness(${bright})`);
    ctx.filter = filters.length ? filters.join(" ") : "none";
    ctx.globalAlpha = clamp01(alpha);
    const w = pw * zoom, h = ph * zoom;
    ctx.drawImage(img, fx * pw * (1 - zoom), fy * ph * (1 - zoom), w, h);
    ctx.restore();
  }

  /** Darken the top and bottom of a plate so type sits on quiet ground (a graduated filter). */
  shade(alpha, top = 0.62, bottom = 0.55) {
    if (alpha <= 0.002) return;
    const ctx = this.ctx, pw = this.pw, ph = this.ph;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = clamp01(alpha);
    const g = ctx.createLinearGradient(0, 0, 0, ph);
    g.addColorStop(0, `rgba(0,0,0,${top})`);
    g.addColorStop(0.28, "rgba(0,0,0,0)");
    g.addColorStop(0.74, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(0,0,0,${bottom})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, pw, ph);
    ctx.restore();
  }

  /** A small service label, as on the website: a hairline and spaced capitals. */
  label(text, t, a, b) {
    const k = win(t, a, a + 0.7, b - 0.5, b);
    if (k <= 0.002) return;
    const y = H * 0.885;
    this.hairline(W / 2, y - 58, 44 * k, k * 0.9);
    this.text(text, {
      x: W / 2, y, font: TYPE.label(18), size: 18, tracking: 0.42, color: SILVER,
      alpha: k * 0.95, blur: (1 - k) * 4, rise: (1 - k) * 6,
    });
  }

  /** A soft point of light — the moment two rims touch. No flare, no star. */
  glint(x, y, radius, alpha) {
    if (alpha <= 0.002) return;
    const ctx = this.ctx, s = this.s;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x * s, y * s, 0, x * s, y * s, radius * s);
    g.addColorStop(0, `rgba(${IVORY},${0.85 * alpha})`);
    g.addColorStop(0.18, `rgba(${IVORY},${0.25 * alpha})`);
    g.addColorStop(1, `rgba(${IVORY},0)`);
    ctx.fillStyle = g;
    ctx.fillRect((x - radius) * s, (y - radius) * s, radius * 2 * s, radius * 2 * s);
    ctx.restore();
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

    this.sceneResearch(t);
    this.sceneOpening(t);
    this.sceneFragments(t);
    this.sceneSelection(t);
    this.sceneMoments(t);
    this.sceneQuiet(t);
    this.sceneMark(t);
    this.finish(t);
  }

  /* 0.0 – 1.9  darkness; light slides across the emblem once */
  sceneOpening(t) {
    if (t > 2.6) return;
    const out = 1 - seg(t, 1.75, 2.5, EASE.leave);
    const body = 0.1 * seg(t, 0.25, 1.4, EASE.reveal) * out;
    const sweep = seg(t, 0.45, 1.95, EASE.door);
    const gain = win(t, 0.45, 0.9, 1.6, 2.05) * 1.45 * out;
    const size = lerp(420, 432, seg(t, 0, 2.5, EASE.travel));
    this.emblem({ cx: W / 2, cy: H * 0.47, size, body, sweep, width: 0.085, gain });
  }

  /* 1.9 – 4.8  late at night, someone is already looking; 探す。 */
  sceneResearch(t) {
    const R = T.research;
    if (t < R || t > T.select + 0.8) return;
    const appear = seg(t, R, R + 1.1, EASE.reveal);
    const recede = seg(t, T.fragments - 0.2, T.fragments + 0.8, EASE.door);
    const gone = seg(t, T.select - 0.3, T.select + 0.7, EASE.leave);
    this.plate("research", {
      alpha: appear * (1 - gone),
      zoom: lerp(1, 1.075, seg(t, R, T.select, EASE.travel)),
      fx: 0.7, fy: 0.46,
      blur: recede * 11,
      bright: lerp(1, 0.32, recede),
    });
    this.shade(appear * (1 - recede) * (1 - gone), 0.78, 0.6);
    const a = seg(t, R + 0.8, R + 1.65, EASE.reveal);
    const leave = 1 - seg(t, T.fragments - 0.45, T.fragments + 0.1, EASE.leave);
    this.text(WORD_SEARCH, {
      x: W / 2, y: H * 0.165, font: TYPE.jp(46), size: 46, tracking: 0.22,
      alpha: a * leave, blur: (1 - a) * 8 + (1 - leave) * 5,
      rise: (1 - a) * 12 - (1 - leave) * 6, wipe: a, soft: 0.5,
    });
    this.label(LABEL_RESEARCH, t, R + 1.1, T.fragments - 0.1);
  }

  /* 4.8 – 7.3  a world full of information, glimpsed; 比較する。 */
  sceneFragments(t) {
    const F = T.fragments, S = T.select;
    if (t < F - 0.1 || t > S + 0.4) return;
    const zoom = lerp(1, 1.07, seg(t, F - 0.1, S + 0.1, EASE.travel));
    const cx = W / 2, cy = H / 2;
    for (const fr of this.fragments) {
      const a = win(t, fr.start, fr.start + 0.45, fr.end - 0.4, fr.end);
      if (a <= 0.003) continue;
      const k = zoom * (1 + (1 - fr.depth) * 0.08 * seg(t, fr.start, fr.end, EASE.travel));
      const x = cx + ((fr.x - cx) * k) / fr.depth ** 0.25;
      const y = cy + ((fr.y - cy) * k) / fr.depth ** 0.25;
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
    if (t < S) {
      KEY_WORDS.forEach((word, i) => {
        const [fx, fy] = KEY_START[i];
        const start = F + 0.05 + i * 0.22;
        const a = seg(t, start, start + 0.7, EASE.reveal);
        const x = cx + (fx * W - cx) * zoom, y = cy + (fy * H - cy) * zoom;
        this.text(word, {
          x, y, font: TYPE.display(50), size: 50, tracking: 0.06,
          alpha: a * 0.86, blur: (1 - a) * 8, rise: (1 - a) * 10,
        });
      });
    }
    const appear = seg(t, F + 0.75, F + 1.6, EASE.reveal);
    const leave = 1 - seg(t, S - 0.45, S + 0.1, EASE.leave);
    this.text(WORD_COMPARE, {
      x: W / 2, y: H * 0.5 + 16, font: TYPE.jp(46), size: 46, tracking: 0.22,
      alpha: appear * leave, blur: (1 - appear) * 8 + (1 - leave) * 6,
      rise: (1 - appear) * 12 - (1 - leave) * 6, wipe: appear, soft: 0.5,
    });
  }

  /* 7.3 – 10.0  many → a few → one; the one becomes a line, and the line opens */
  sceneSelection(t) {
    const F = T.fragments, S = T.select;
    if (t < S - 0.05 || t > T.toast + 1.0) return;
    const zoom = lerp(1, 1.07, seg(t, F - 0.1, S + 0.1, EASE.travel));
    const cx = W / 2, cy = H / 2;
    const gather = seg(t, S, S + 1.05, EASE.door);
    const slotGap = 104;
    const lineW = 210;
    KEY_WORDS.forEach((word, i) => {
      const [fx, fy] = KEY_START[i];
      const x0 = cx + (fx * W - cx) * zoom, y0 = cy + (fy * H - cy) * zoom;
      const x1 = cx, y1 = cy + (i - 2) * slotGap;
      const x = lerp(x0, x1, gather), y = lerp(y0, y1, gather);
      const size = lerp(50, 40, gather);
      const outer = i === 0 || i === 4;
      const inner = i === 1 || i === 3;
      let a = 0.86, blur = 0, rise = 0;
      if (outer || inner) {
        const o = outer ? seg(t, S + 1.1, S + 1.7, EASE.leave) : seg(t, S + 1.6, S + 2.2, EASE.leave);
        a *= 1 - o; blur = o * 6; rise = -o * 8;
      } else {
        const lift = seg(t, S + 1.8, S + 2.25, EASE.reveal);
        const go = seg(t, S + 2.25, S + 2.85, EASE.leave);
        a = lerp(0.86, 1, lift) * (1 - go);
        blur = go * 7;
        rise = -go * 10;
      }
      this.text(word, {
        x, y: y + 14, font: TYPE.display(size), size, tracking: lerp(0.06, 0.16, gather),
        alpha: a, blur, rise,
      });
      const draw = seg(t, S + 0.55, S + 1.25, EASE.door);
      if (outer || inner) {
        const la = outer ? 1 - seg(t, S + 1.1, S + 1.7, EASE.leave) : 1 - seg(t, S + 1.6, S + 2.2, EASE.leave);
        this.hairline(x, y + 44, lineW * draw, la);
      }
    });
    // the chosen line: widens, a glint passes, it spans the frame, then opens like a door
    const ly = lerp(cy + 44, cy, seg(t, S + 2.2, S + 2.8, EASE.door));
    let lw = lerp(lineW * seg(t, S + 0.55, S + 1.25, EASE.door), 400, seg(t, S + 1.85, S + 2.45, EASE.door));
    lw = lerp(lw, W + 40, seg(t, S + 2.5, S + 3.1, EASE.door));
    const open = seg(t, S + 2.75, S + 3.65, EASE.door);
    const half = (H / 2 + 20) * open;
    const glint = seg(t, S + 1.95, S + 2.75, EASE.door);
    const la = 1 - seg(t, S + 3.2, S + 3.7, EASE.leave);
    if (open > 0.001) {
      this.plate("toast", {
        alpha: 1, zoom: lerp(1.0, 1.06, seg(t, S + 2.75, T.gift + 0.6, EASE.travel)),
        fx: 0.5, fy: 0.4, clip: [ly - half, ly + half],
        bright: lerp(0.55, 1, open),
      });
      this.hairline(cx, ly - half, lw, la);
      this.hairline(cx, ly + half, lw, la);
    } else {
      this.hairline(cx, ly, lw, 1, glint > 0 && glint < 1 ? glint : null);
    }
  }

  /* 10.0 – 14.5  what the time is for: a toast at dinner, a gift across the table */
  sceneMoments(t) {
    const G = T.gift;
    if (t < T.toast + 0.9 || t > T.quiet + 0.3) return;
    const toastOut = seg(t, G - 0.2, G + 0.5, EASE.leave);
    this.plate("toast", {
      alpha: 1 - toastOut,
      zoom: lerp(1.0, 1.06, seg(t, T.select + 2.75, G + 0.6, EASE.travel)),
      fx: 0.5, fy: 0.4,
    });
    this.shade(seg(t, T.toast + 0.9, T.toast + 1.8, EASE.reveal) * (1 - toastOut), 0.45, 0.6);
    // the rims touch
    const clink = T.toast + 1.05;
    const k = win(t, clink - 0.12, clink + 0.08, clink + 0.25, clink + 0.9, EASE.reveal, EASE.leave);
    this.glint(W * 0.502, H * 0.355, 70, k * (1 - toastOut));
    this.label(LABEL_DINING, t, T.toast + 1.0, G - 0.05);

    const giftIn = seg(t, G, G + 0.75, EASE.reveal);
    const giftOut = seg(t, T.quiet - 0.55, T.quiet + 0.1, EASE.leave);
    this.plate("gift", {
      alpha: giftIn * (1 - giftOut),
      zoom: lerp(1.0, 1.065, seg(t, G, T.quiet, EASE.travel)),
      fx: 0.48, fy: 0.5,
    });
    this.shade(giftIn * (1 - giftOut), 0.45, 0.6);
    this.label(LABEL_GIFT, t, G + 0.7, T.quiet - 0.4);
  }

  /* 14.5 – 17.0  silence; あなたが選ぶ。 / その前を、RELYが。 */
  sceneQuiet(t) {
    const Q = T.quiet;
    if (t < Q - 0.1 || t > T.mark + 0.7) return;
    const leave = 1 - seg(t, T.mark - 0.1, T.mark + 0.5, EASE.leave);
    this.hairline(W / 2, H / 2, 132 * seg(t, Q, Q + 0.8, EASE.door), leave);
    const a1 = seg(t, Q + 0.15, Q + 1.15, EASE.reveal);
    this.text(LINE_CHOOSE, {
      x: W / 2, y: H / 2 - 62, font: TYPE.jp(52), size: 52, tracking: 0.24,
      alpha: a1 * leave, blur: (1 - a1) * 10 + (1 - leave) * 6,
      rise: (1 - a1) * 14 - (1 - leave) * 6, wipe: a1, soft: 0.6,
    });
    const a2 = seg(t, Q + 1.05, Q + 2.05, EASE.reveal);
    this.text(LINE_BEFORE, {
      x: W / 2, y: H / 2 + 100, font: TYPE.jp(52), size: 52, tracking: 0.24,
      alpha: a2 * leave, blur: (1 - a2) * 10 + (1 - leave) * 6,
      rise: (1 - a2) * 14 - (1 - leave) * 6, wipe: a2, soft: 0.6,
    });
  }

  /* 17.0 – 20.0  the mark, the name, the promise; then black */
  sceneMark(t) {
    const M = T.mark, E = T.end;
    if (t < M + 0.1) return;
    const end = 1 - seg(t, E - 0.28, E - 0.07, EASE.leave);
    const endName = 1 - seg(t, E - 0.22, E - 0.04, EASE.leave);
    const cy = H * 0.395;
    const body = 0.3 * seg(t, M + 0.15, M + 1.3, EASE.reveal) * end;
    const sweep = seg(t, M + 0.35, M + 2.3, EASE.door);
    const gain = win(t, M + 0.4, M + 0.95, M + 1.8, M + 2.4) * 0.9 * end;
    const size = lerp(424, 432, seg(t, M + 0.1, E, EASE.travel));
    this.emblem({ cx: W / 2, cy, size, body, sweep, width: 0.11, gain, angle: -0.5 });

    const aName = seg(t, M + 0.85, M + 1.75, EASE.reveal);
    this.text(WORDMARK, {
      x: W / 2, y: H * 0.6, font: TYPE.display(96), size: 96, tracking: 0.3,
      alpha: aName * endName, blur: (1 - aName) * 9, rise: (1 - aName) * 12,
    });
    const aCat = seg(t, M + 1.2, M + 1.95, EASE.reveal);
    this.text(CATEGORY, {
      x: W / 2, y: H * 0.6 + 64, font: TYPE.label(19), size: 19, tracking: 0.36,
      color: SILVER, alpha: aCat * 0.9 * end, blur: (1 - aCat) * 5, rise: (1 - aCat) * 8,
    });
    const aTag = seg(t, T.tagline, T.tagline + 0.4, EASE.reveal);
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
