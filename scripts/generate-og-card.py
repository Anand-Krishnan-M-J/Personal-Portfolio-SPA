#!/usr/bin/env python3
"""Generate the deterministic Open Graph card committed at public/og.png."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SCALE = 2
WIDTH = 1200
HEIGHT = 630

IVORY = "#f7f1e8"
PAPER = "#fffaf3"
INK = "#1b1917"
BROWN = "#a77a50"
DEEP_BROWN = "#77573b"
LIGHT_BROWN = "#d1a87e"
RULE = "#d8c4ae"

FONT_PATHS = [
    Path("/System/Library/Fonts/Avenir Next.ttc"),
    Path("/System/Library/Fonts/HelveticaNeue.ttc"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
]


def scaled(value: float) -> int:
    return round(value * SCALE)


def point(x: float, y: float) -> tuple[int, int]:
    return (scaled(x), scaled(y))


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    index_by_family = {
        "Avenir Next.ttc": {"regular": 7, "medium": 5, "bold": 0},
        "HelveticaNeue.ttc": {"regular": 0, "medium": 10, "bold": 1},
    }
    for path in FONT_PATHS:
        if not path.exists():
            continue
        index = index_by_family.get(path.name, {}).get(weight, 0)
        try:
            return ImageFont.truetype(str(path), scaled(size), index=index)
        except OSError:
            continue
    raise RuntimeError("No supported font was found for the Open Graph card")


def tracked_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    value: str,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    tracking: float,
) -> None:
    x, y = point(*xy)
    for character in value:
        draw.text((x, y), character, font=text_font, fill=fill, anchor="la")
        advance = draw.textlength(character, font=text_font)
        x += round(advance + scaled(tracking))


canvas = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), IVORY)
draw = ImageDraw.Draw(canvas)

draw.rectangle((0, 0, scaled(18), scaled(HEIGHT)), fill=BROWN)
for y in (151, 420):
    draw.line((point(74, y), point(1126, y)), fill=RULE, width=scaled(2))

# AK brand mark
draw.rounded_rectangle(
    (scaled(75), scaled(58), scaled(145), scaled(128)),
    radius=scaled(19),
    fill=PAPER,
    outline=BROWN,
    width=scaled(1.5),
)
draw.line(
    [point(89, 111), point(102, 78.7), point(115, 111)],
    fill=INK,
    width=scaled(4.2),
    joint="curve",
)
draw.line([point(94.3, 97.8), point(109.7, 97.8)], fill=INK, width=scaled(4.2))
draw.line([point(116.6, 79), point(116.6, 111)], fill=INK, width=scaled(4.2))
draw.line(
    [point(117.2, 95.4), point(131.6, 79.1)],
    fill=BROWN,
    width=scaled(4.2),
)
draw.line(
    [point(117.2, 95.1), point(132, 110.8)],
    fill=BROWN,
    width=scaled(4.2),
)

tracked_text(draw, (165, 67), "ANAND KRISHNAN M J", font(28, "bold"), INK, 1.2)
tracked_text(
    draw,
    (165, 101),
    "PORTFOLIO · ANANDKRIS.COM",
    font(18, "medium"),
    DEEP_BROWN,
    2.1,
)

draw.text(point(74, 174), "Senior Software", font=font(76, "bold"), fill=INK)
draw.text(point(74, 260), "Engineer", font=font(94, "bold"), fill=INK)

draw.line((point(832, 217), point(1126, 217)), fill=BROWN, width=scaled(7))
tracked_text(
    draw,
    (833, 231),
    "PRODUCT ENGINEERING",
    font(19, "bold"),
    DEEP_BROWN,
    1.3,
)
tracked_text(
    draw,
    (833, 261),
    "AT GLOBAL SCALE",
    font(19, "bold"),
    DEEP_BROWN,
    1.3,
)

draw.text(
    point(75, 440),
    "React · TypeScript · Node.js · GraphQL",
    font=font(25, "medium"),
    fill=DEEP_BROWN,
)
tracked_text(
    draw,
    (75, 516),
    "OPENTABLE · BOOKING HOLDINGS · UNIQLO",
    font(22, "bold"),
    INK,
    0.8,
)

draw.rounded_rectangle(
    (scaled(875), scaled(493), scaled(1126), scaled(565)),
    radius=scaled(18),
    fill=INK,
)
tracked_text(
    draw,
    (861, 502),
    "BACK-TO-BACK OPENTABLE",
    font(14, "bold"),
    LIGHT_BROWN,
    1.1,
)
tracked_text(
    draw,
    (899, 528),
    "HACKATHON PRIZES",
    font(17, "bold"),
    PAPER,
    1.1,
)

output = Path(__file__).resolve().parents[1] / "public" / "og.png"
canvas.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(
    output,
    format="PNG",
    optimize=True,
)
print(f"Generated {output} ({WIDTH}x{HEIGHT})")
