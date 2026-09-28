"""One grade for the whole collection: low saturation, deep shadows, quiet highlights."""
import sys, os
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

SRC, DST = sys.argv[1], sys.argv[2]
names = sys.argv[3:]
rng = np.random.default_rng(5)

# per-image exposure nudges so the set sits at one brightness
TARGET_MEAN = float(os.environ.get("TARGET", "0.115"))


def lum(a):
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


for n in names:
    im = Image.open(os.path.join(SRC, f"{n}-final.png")).convert("RGB")
    a = np.asarray(im, np.float32) / 255.0
    h, w, _ = a.shape

    # 1. saturation down to a whisper (keeps wine / candle warmth faintly)
    L = lum(a)[..., None]
    a = L + (a - L) * float(os.environ.get("SAT", "0.42"))

    # 2. exposure normalise (in linear-ish space)
    lin = a ** 2.2
    m = lum(lin).mean() ** (1 / 2.2)
    a = np.clip(a * (TARGET_MEAN / max(m, 1e-4)) ** 0.8, 0, 1)

    # 3. split tone: charcoal-cool shadows, ivory highlights
    L = lum(a)[..., None]
    shadow = np.array([0.985, 0.995, 1.02], np.float32)
    high = np.array([1.02, 1.0, 0.965], np.float32)
    a = a * (shadow * (1 - L) + high * L)

    # 4. soft highlight roll-off so nothing clips to paper white
    a = 1 - np.exp(-a * 1.35)
    a = a / (1 - np.exp(-1.35))

    # 4b. deeper blacks, gentle contrast
    a = np.clip((a - 0.018) / 0.982, 0, 1) ** 1.12

    # 5. vignette + slightly heavier bottom so white type on top stays legible
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx / w - 0.5) * 1.5) ** 2 + ((yy / h - 0.48) * 1.25) ** 2)
    vig = 1 - 0.55 * np.clip(d, 0, 1) ** 2.4
    bottom = 1 - 0.35 * np.clip((yy / h - 0.62) / 0.38, 0, 1) ** 1.6
    a *= (vig * bottom)[..., None]

    # 6. fine film grain
    g = gaussian_filter(rng.normal(0, 1, (h, w)).astype(np.float32), 0.6)
    g /= g.std()
    a = np.clip(a + g[..., None] * 0.012, 0, 1)

    out = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
    out.save(os.path.join(DST, f"{n}.webp"), "WEBP", quality=82, method=6)
    print(n, out.size, f"mean={lum(a).mean():.3f}", os.path.getsize(os.path.join(DST, f"{n}.webp")) // 1024, "KB")
