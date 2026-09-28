"""Flat textures used inside the Blender scenes: a laptop screen and a notebook page.

Nothing here names a real place: the screen is an abstract research board
(thumbnails from the site's own photographs, a map of points, rows of notes).
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "../../public/images")
OUT = os.path.join(HERE, "textures")


def screen(w=1600, h=1000):
    random.seed(4)
    im = Image.new("RGB", (w, h), (16, 16, 17))
    d = ImageDraw.Draw(im)
    # left: comparison rows with thumbnails
    thumbs = ["dining", "stay", "experience", "gift"]
    for i, name in enumerate(thumbs):
        y = 90 + i * 210
        t = Image.open(os.path.join(SITE, f"{name}.webp")).convert("RGB")
        t = t.resize((250, 170))
        im.paste(t, (70, y))
        d.rectangle((70, y, 320, y + 170), outline=(60, 60, 58), width=1)
        for k in range(3):
            lw = random.randint(260, 520)
            d.rectangle((360, y + 18 + k * 34, 360 + lw, y + 26 + k * 34), fill=(120 - k * 25, 118 - k * 25, 112 - k * 25))
        d.line((360, y + 150, 900, y + 150), fill=(46, 46, 45), width=1)
        # a small mark on the one that fits
        if i == 1:
            d.rectangle((60, y - 10, 910, y + 180), outline=(190, 186, 176), width=2)
    # right: a quiet map with a few points
    mx, my = 980, 90
    d.rectangle((mx, my, w - 70, 800), fill=(22, 22, 23), outline=(48, 48, 47))
    for _ in range(14):
        x0, y0 = random.randint(mx, w - 70), random.randint(my, 800)
        d.line((x0, y0, x0 + random.randint(-300, 300), y0 + random.randint(-200, 200)), fill=(38, 38, 38), width=3)
    for _ in range(9):
        x, y = random.randint(mx + 60, w - 130), random.randint(my + 60, 740)
        d.ellipse((x - 7, y - 7, x + 7, y + 7), fill=(170, 166, 158))
    x, y = 1290, 420
    d.ellipse((x - 13, y - 13, x + 13, y + 13), fill=(236, 232, 224))
    d.ellipse((x - 30, y - 30, x + 30, y + 30), outline=(236, 232, 224), width=2)
    for k in range(3):
        d.rectangle((mx, 840 + k * 34, mx + random.randint(250, 520), 848 + k * 34), fill=(100 - k * 20,) * 3)
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, "screen.png"))


def notebook(w=1400, h=1000):
    """An open notebook: two pages of handwriting-like strokes and a few ruled lines."""
    random.seed(9)
    im = Image.new("RGB", (w, h), (214, 208, 196))
    d = ImageDraw.Draw(im)
    d.line((w // 2, 0, w // 2, h), fill=(170, 164, 152), width=6)
    for page in (0, 1):
        x0 = 90 + page * (w // 2)
        y = 110
        while y < h - 100:
            x = x0
            end = x0 + random.randint(380, 560)
            while x < end:
                wl = random.randint(30, 90)
                pts = []
                for k in range(wl // 4):
                    pts.append((x + k * 4, y + math.sin(k * 1.7 + random.random()) * 5 - random.random() * 4))
                if len(pts) > 1:
                    d.line(pts, fill=(38, 36, 40), width=3)
                x += wl + random.randint(14, 26)
            y += random.choice((56, 56, 56, 112))
        d.line((x0, h - 150, x0 + 180, h - 150), fill=(38, 36, 40), width=3)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, "notebook.png"))


if __name__ == "__main__":
    screen()
    notebook()
    print("textures →", OUT)
