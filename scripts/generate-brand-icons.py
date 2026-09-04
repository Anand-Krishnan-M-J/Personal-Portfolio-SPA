#!/usr/bin/env python3
"""Generate raster favicon fallbacks from the AK monogram."""

from pathlib import Path

from PIL import Image, ImageDraw


SOURCE_SIZE = 1024
IVORY = "#f7f1e8"
INK = "#1b1917"
BROWN = "#a77a50"


def px(value: float) -> int:
    return round((value / 64) * SOURCE_SIZE)


canvas = Image.new("RGB", (SOURCE_SIZE, SOURCE_SIZE), IVORY)
draw = ImageDraw.Draw(canvas)

draw.rounded_rectangle(
    (px(2), px(2), px(62), px(62)),
    radius=px(17),
    fill=IVORY,
    outline=BROWN,
    width=px(1.5),
)
draw.line(
    [(px(13.75), px(45.5)), (px(24.9), px(17.8)), (px(36.05), px(45.5))],
    fill=INK,
    width=px(3.6),
    joint="curve",
)
draw.line(
    [(px(18.3), px(34.15)), (px(31.5), px(34.15))],
    fill=INK,
    width=px(3.6),
)
draw.line(
    [(px(37.45), px(18)), (px(37.45), px(45.5))],
    fill=INK,
    width=px(3.6),
)
draw.line(
    [(px(38), px(32.15)), (px(50.35), px(18.05))],
    fill=BROWN,
    width=px(3.6),
)
draw.line(
    [(px(38), px(31.9)), (px(50.7), px(45.45))],
    fill=BROWN,
    width=px(3.6),
)

public_dir = Path(__file__).resolve().parents[1] / "public"
png_targets = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
}

for filename, size in png_targets.items():
    output = public_dir / filename
    canvas.resize((size, size), Image.Resampling.LANCZOS).save(
        output,
        format="PNG",
        optimize=True,
    )

canvas.save(
    public_dir / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)

print(f"Generated {len(png_targets)} PNG icons and favicon.ico in {public_dir}")
