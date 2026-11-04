/**
 * The film's sound, synthesised from code — no samples, no stock music.
 *
 *   node film/score.mjs            → film/out/score.wav (48 kHz, stereo)
 *
 * Every event is placed on the film's own timeline (T in film.js), so the
 * score stays in sync if the picture is re-timed.
 *
 * Palette: a slow pad (D major 9 → B minor 11 → G major 9 → D major 9),
 * a few soft piano-like notes, two glasses touching, a small chime for the
 * gift, and a low, warm swell under the emblem. Everything passes through
 * one room reverb. Nothing hits hard.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILM, T } from "./film.js";

const SR = 48000;
const N = Math.round(FILM.duration * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const note = (name) => {
  const m = name.match(/^([A-G])(#|b)?(-?\d)$/);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
  return midi(base + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (Number(m[3]) + 1) * 12);
};
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ---------- pad: detuned additive voices, slow in, slow out ---------- */
function pad(freqs, t0, t1, { gain = 0.05, attack = 1.6, release = 1.8, bright = 0.35, pan = 0 } = {}) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor((t1 + release) * SR));
  for (const f of freqs) {
    for (const detune of [-0.0035, 0, 0.0041]) {
      const fr = f * (1 + detune);
      const partials = [1, 2, 3, 4];
      const amps = [1, bright, bright * 0.45, bright * 0.18];
      const ph = partials.map(() => rand() * Math.PI * 2);
      const side = pan + detune * 60;
      for (let i = s0; i < s1; i++) {
        const t = i / SR;
        const env = smooth((t - t0) / attack) * (1 - smooth((t - t1) / release));
        if (env <= 0) continue;
        const wob = 1 + 0.12 * Math.sin(2 * Math.PI * 0.11 * t + ph[0]);
        let v = 0;
        for (let k = 0; k < partials.length; k++) v += amps[k] * Math.sin(2 * Math.PI * fr * partials[k] * t + ph[k]);
        v *= env * gain * wob / freqs.length;
        L[i] += v * (1 - side) * 0.5;
        R[i] += v * (1 + side) * 0.5;
      }
    }
  }
}

/* ---------- soft piano-like note: inharmonic partials, quick attack, long decay ---------- */
function piano(f, t0, { gain = 0.12, decay = 2.8, pan = 0 } = {}) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, s0 + Math.floor(decay * 2.2 * SR));
  const B = 0.0004;
  const parts = [1, 2, 3, 4, 5, 6].map((k) => ({ k, f: f * k * Math.sqrt(1 + B * k * k), a: 1 / (k * k * 0.9), d: decay / (1 + k * 0.55) }));
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const att = smooth(t / 0.012);
    let v = 0;
    for (const p of parts) v += p.a * Math.exp(-t / p.d) * Math.sin(2 * Math.PI * p.f * t);
    v *= att * gain;
    L[i] += v * (1 - pan) * 0.5;
    R[i] += v * (1 + pan) * 0.5;
  }
}

/* ---------- glass: two rims touching (bright inharmonic ring, fast decay) ---------- */
function glass(t0, { gain = 0.07, base = 2637, pan = 0 } = {}) {
  const ratios = [1, 2.32, 4.25];
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, s0 + Math.floor(2.4 * SR));
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    let v = 0;
    ratios.forEach((r, k) => {
      v += Math.exp(-t / (1.0 / (1 + k * 1.6))) * Math.sin(2 * Math.PI * base * r * t) / (1 + k * 1.8);
    });
    v *= gain * smooth(t / 0.002);
    L[i] += v * (1 - pan) * 0.5;
    R[i] += v * (1 + pan) * 0.5;
  }
}

/* ---------- low swell under the emblem: a warm sub, never a boom ---------- */
function swell(t0, t1, f, gain = 0.09) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor((t1 + 1.5) * SR));
  for (let i = s0; i < s1; i++) {
    const t = i / SR;
    const env = smooth((t - t0) / (t1 - t0)) * (1 - smooth((t - t1) / 1.5));
    const v = env * gain * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t));
    L[i] += v;
    R[i] += v;
  }
}

/* ---------- air: filtered noise that rises and falls with a change of scene ---------- */
function air(t0, t1, gain = 0.012) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor(t1 * SR));
  let lp1 = 0, lp2 = 0, lp3 = 0, hp = 0, prev = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / (s1 - s0);
    const env = Math.sin(Math.PI * t) ** 2;
    const n = rand() * 2 - 1;
    lp1 += 0.035 * (n - lp1);
    lp2 += 0.035 * (lp1 - lp2);
    lp3 += 0.035 * (lp2 - lp3);
    hp = 0.995 * (hp + lp3 - prev);
    prev = lp3;
    const v = hp * env * gain * 9;
    L[i] += v;
    R[i] += v * 0.9;
  }
}

/* ---------- the arrangement, on the film's timeline ---------- */
const D9 = ["D2", "A2", "F#3", "C#4", "E4"].map(note);
const Bm11 = ["B1", "F#2", "D3", "A3", "E4"].map(note);
const G9 = ["G1", "D2", "B2", "F#3", "A3"].map(note);
const Em9 = ["E2", "B2", "G3", "D4", "F#4"].map(note);
const D9hi = ["D2", "A2", "F#3", "A3", "C#4", "E4"].map(note);

pad(D9, 0.2, T.fragments, { gain: 0.05, attack: 2.2, release: 1.4, bright: 0.25 });
pad(Bm11, T.fragments - 0.3, T.select + 2.4, { gain: 0.05, attack: 1.4, release: 1.3, bright: 0.3 });
pad(G9, T.toast - 0.4, T.quiet - 0.2, { gain: 0.058, attack: 1.2, release: 1.4, bright: 0.38 });
pad(Em9, T.quiet - 0.3, T.mark, { gain: 0.045, attack: 1.2, release: 1.2, bright: 0.25 });
pad(D9hi, T.mark - 0.2, T.end - 0.6, { gain: 0.055, attack: 1.4, release: 0.7, bright: 0.32 });

// the first light on the emblem
piano(note("F#5"), 0.95, { gain: 0.07, decay: 3.2, pan: 0.1 });
// 探す。
piano(note("A4"), T.research + 0.85, { gain: 0.09, pan: -0.1 });
piano(note("E5"), T.research + 1.45, { gain: 0.06, pan: 0.15 });
// 比較する。 — a question
piano(note("B4"), T.fragments + 0.8, { gain: 0.085 });
piano(note("F#5"), T.fragments + 1.35, { gain: 0.055, pan: 0.2 });
// the choice: three notes coming down to one
piano(note("D5"), T.select + 1.1, { gain: 0.06, pan: -0.2 });
piano(note("B4"), T.select + 1.6, { gain: 0.06, pan: 0.2 });
piano(note("A4"), T.select + 2.1, { gain: 0.08 });
air(T.select + 2.3, T.toast + 1.2, 0.006);
// the toast
glass(T.toast + 1.05, { gain: 0.06, base: 2637, pan: -0.1 });
glass(T.toast + 1.068, { gain: 0.045, base: 2793, pan: 0.12 });
piano(note("D5"), T.toast + 1.15, { gain: 0.05, pan: 0.1, decay: 3.4 });
// the gift
air(T.gift - 0.4, T.gift + 0.9, 0.004);
piano(note("A5"), T.gift + 0.7, { gain: 0.045, pan: 0.25, decay: 3.6 });
piano(note("E6"), T.gift + 0.95, { gain: 0.03, pan: -0.2, decay: 3.6 });
// あなたが選ぶ。 / その前を、RELYが。
piano(note("F#4"), T.quiet + 0.2, { gain: 0.1, decay: 3.6 });
piano(note("A4"), T.quiet + 1.1, { gain: 0.1, decay: 3.6 });
// the emblem: a warm swell and a chord that stays
swell(T.mark - 0.3, T.mark + 1.2, note("D1"), 0.07);
[note("D3"), note("A3"), note("F#4"), note("C#5")].forEach((f, i) => piano(f, T.mark + 0.4 + i * 0.045, { gain: 0.07, decay: 4.2, pan: (i - 1.5) * 0.15 }));
// the promise
piano(note("E5"), T.tagline + 0.05, { gain: 0.05, decay: 3, pan: 0.15 });
piano(note("A5"), T.tagline + 0.4, { gain: 0.035, decay: 3, pan: -0.15 });

/* ---------- one room: Freeverb (Schroeder–Moorer), gentle ---------- */
function freeverb(inL, inR, { room = 0.86, damp = 0.35, wet = 0.32, dry = 0.85 } = {}) {
  const scale = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => Math.round(n * scale));
  const alls = [556, 441, 341, 225].map((n) => Math.round(n * scale));
  const spread = Math.round(23 * scale);
  const run = (input, extra) => {
    const out = new Float32Array(N);
    const cb = combs.map((n) => ({ buf: new Float32Array(n + extra), i: 0, store: 0 }));
    const ab = alls.map((n) => ({ buf: new Float32Array(n + extra), i: 0 }));
    for (let s = 0; s < N; s++) {
      const x = input[s] * 0.015;
      let y = 0;
      for (const c of cb) {
        const o = c.buf[c.i];
        c.store = o * (1 - damp) + c.store * damp;
        c.buf[c.i] = x + c.store * room;
        c.i = (c.i + 1) % c.buf.length;
        y += o;
      }
      for (const a of ab) {
        const o = a.buf[a.i];
        a.buf[a.i] = y + o * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        y = o - y;
      }
      out[s] = y;
    }
    return out;
  };
  const mono = inL.map((v, i) => (v + inR[i]) * 0.5);
  const wl = run(mono, 0), wr = run(mono, spread);
  for (let s = 0; s < N; s++) {
    inL[s] = inL[s] * dry + wl[s] * wet * 3.5;
    inR[s] = inR[s] * dry + wr[s] * wet * 3.5;
  }
}
freeverb(L, R);

/* ---------- master: fade to silence with the picture, normalise ---------- */
const fadeFrom = (T.end - 0.9) * SR;
for (let i = 0; i < N; i++) {
  const f = i > fadeFrom ? 1 - smooth((i - fadeFrom) / (N - fadeFrom)) : 1;
  const fin = smooth(i / (0.05 * SR));
  L[i] *= f * fin;
  R[i] *= f * fin;
}
let peak = 0, sum = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  sum += L[i] * L[i] + R[i] * R[i];
}
const rms = Math.sqrt(sum / (2 * N));
// aim for a quiet, even level (about -20 dBFS RMS), never above -1 dBFS peak
const g = Math.min(0.1 / rms, 0.89 / peak);

const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write("WAVEfmt ", 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * g * 32767))), 44 + i * 4);
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * g * 32767))), 46 + i * 4);
}
const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "out/score.wav");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log(`score: ${FILM.duration}s, peak ${(20 * Math.log10(peak * g)).toFixed(1)} dBFS, rms ${(20 * Math.log10(rms * g)).toFixed(1)} dBFS → ${dest}`);
