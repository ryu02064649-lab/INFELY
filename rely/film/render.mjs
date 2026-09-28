/**
 * Renders the RELY brand film to an MP4 for Instagram Reels / Stories.
 *
 *   npm run rely:film                  → film/out/rely-film.mp4 (1080×1920, 30fps, 15s)
 *   npm run rely:film -- --stills 1,3.2,10.5   → PNG stills only (for checking frames)
 *
 * How it works: film/index.html draws each frame with code (film/film.js).
 * A headless Chromium steps through time frame by frame — not in real time,
 * so no frame is ever dropped — and every frame is piped into ffmpeg.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "film/out");
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp" };

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = path.normalize(path.join(root, url));
    const allowed = [path.join(root, "film"), path.join(root, "public")].some((d) => file.startsWith(d + path.sep));
    if (!allowed || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function frame(page, t) {
  const dataUrl = await page.evaluate((time) => {
    window.__film.draw(time);
    return document.getElementById("film").toDataURL("image/png");
  }, t);
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

const server = await serve();
const { port } = server.address();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`http://127.0.0.1:${port}/film/index.html?render`);
await page.evaluate(() => window.__film.ready);
const { FILM, CUES } = await page.evaluate(() => ({ FILM: window.__film.FILM, CUES: window.__film.CUES }));
fs.mkdirSync(outDir, { recursive: true });

const stills = opt("stills");
if (stills) {
  for (const t of stills.split(",").map(Number)) {
    const file = path.join(outDir, `still-${t.toFixed(2)}.png`);
    fs.writeFileSync(file, await frame(page, t));
    console.log(file);
  }
} else {
  const out = path.resolve(opt("out") ?? path.join(outDir, "rely-film.mp4"));
  const total = Math.round(FILM.duration * FILM.fps);
  const enc = spawn(ffmpeg.path, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FILM.fps), "-c:v", "png", "-i", "-",
    // a silent stereo track: some apps expect audio; music is added later in Instagram
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
    "-map", "0:v", "-map", "1:a", "-t", String(FILM.duration),
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "film",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-vf", "scale=out_color_matrix=bt709:out_range=tv",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-r", String(FILM.fps), "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart", out,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((resolve, reject) => enc.on("close", (c) => (c === 0 ? resolve() : reject(new Error(`ffmpeg exited ${c}`)))));
  const started = Date.now();
  for (let i = 0; i < total; i++) {
    const png = await frame(page, i / FILM.fps);
    if (!enc.stdin.write(png)) await new Promise((r) => enc.stdin.once("drain", r));
    if (i % 30 === 29 || i === total - 1) {
      process.stdout.write(`\rframes ${i + 1}/${total}  (${((Date.now() - started) / 1000).toFixed(0)}s)`);
    }
  }
  enc.stdin.end();
  await done;
  fs.writeFileSync(path.join(outDir, "poster.png"), await frame(page, 13.9));
  fs.writeFileSync(path.join(outDir, "timeline.json"), JSON.stringify({ ...FILM, cues: CUES }, null, 2) + "\n");
  console.log(`\n${out}`);
}

await browser.close();
server.close();
