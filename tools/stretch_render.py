"""Draws a stretch strip (T024) from the cells tools/stretch-strip.mjs writes: each cell's drawings placed by their screen
matrices (feet at the cell's floor point, clipped to the cell), each foot's floor line in floor cells (near solid gold,
far dashed blue: the far boot stands a little higher in 3/4), labels, flags in red with a red ring where each one is.
Usage: python3 tools/stretch_render.py cells.json out.jpg"""
import json, sys
from PIL import Image, ImageDraw, ImageFont

src = json.load(open(sys.argv[1]))
cells = src["cells"]
Z, CW, CH, TOP, FEET, COLS = src.get("zoom", 2), 190, 252, 18, 210, min(8, len(cells))   # game px; FEET = floor point's height
rows = (len(cells) + COLS - 1) // COLS
sheet = Image.new("RGB", (int(COLS * CW * Z), int((rows * CH + 24) * Z)), (110, 110, 118))
try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(10 * Z))
    big = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(13 * Z))
except OSError:
    font = big = ImageFont.load_default()
ImageDraw.Draw(sheet).text((6 * Z, 5 * Z), src["title"], fill="white", font=big)
imgs = {}
w, h = int(CW * Z), int(CH * Z)
for i, c in enumerate(cells):
    cell = Image.new("RGBA", (w, h), (110, 110, 118, 255))
    d = ImageDraw.Draw(cell)
    fx, fy = (w - 28 * Z if c.get("lying") else w / 2), FEET * Z   # lying: head to the left, feet near the right edge
    if c["floor"]:
        for ln in c["lines"]:
            y, far = fy + ln["y"] * Z, ln["foot"] == "foot-far"
            col = (159, 216, 255) if far else (255, 224, 138)
            for x in range(int(10 * Z), int(w - 10 * Z), 8 if far else 2):
                d.line([(x, y), (x + (4 if far else 2), y)], fill=col, width=1)
    else:
        d.line([(10 * Z, fy), (w - 10 * Z, fy)], fill=(150, 150, 158), width=1)
    for p in c["parts"]:
        im = imgs.setdefault(p["img"], Image.open(p["img"]).convert("RGBA"))
        a, b, cc, dd, e, f = p["m"]
        A = [Z * a, Z * cc, Z * e + fx, Z * b, Z * dd, Z * f + fy]   # image px -> cell px
        det = A[0] * A[4] - A[1] * A[3]
        inv = [A[4] / det, -A[1] / det, (A[1] * A[5] - A[4] * A[2]) / det, -A[3] / det, A[0] / det, (A[3] * A[2] - A[0] * A[5]) / det]
        cell.alpha_composite(im.transform((w, h), Image.AFFINE, inv, resample=Image.BILINEAR))
    d = ImageDraw.Draw(cell)
    for x, y in c.get("marks") or []:
        X, Y = fx + x * Z, fy + y * Z
        d.ellipse([X - 6 * Z, Y - 6 * Z, X + 6 * Z, Y + 6 * Z], outline=(255, 60, 50), width=max(1, round(Z)))
    d.rectangle([0, 0, w, TOP * Z], fill=(90, 90, 98))
    d.text((5 * Z, 3 * Z), c["label"], fill="white", font=font)
    for k, fl in enumerate(c["flags"][:3]):
        d.text((5 * Z, h - (14 + 11 * k) * Z), fl, fill=(255, 120, 110), font=font)
    if c["flags"]:
        d.rectangle([0, 0, w - 1, h - 1], outline=(255, 90, 80), width=max(1, round(Z)))
    sheet.paste(cell.convert("RGB"), ((i % COLS) * w, int(((i // COLS) * CH + 24) * Z)))
sheet.save(sys.argv[2], quality=80)
