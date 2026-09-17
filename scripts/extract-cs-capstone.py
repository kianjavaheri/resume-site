#!/usr/bin/env python3
"""Generate the CS capstone paper page from the poster PDF.

    pip install pymupdf
    python3 scripts/extract-cs-capstone.py

Writes src/content/cs-capstone.ts and public/pdfs/cs-capstone/figure{1..4}.png.
Don't hand-edit those — change this script and re-run it.

Unlike the thesis and basic-income PDFs, this source is a single 24x36in
conference poster: ~1,700 characters of bullets in two columns, and most of its
27 placed images are the pink heading banners and the bullet text re-exported as
pictures (the real text layer sits underneath them). So the four actual figures
are cropped by xref, and the text is picked up by position, not by reading order.
PyMuPDF rects are top-left origin, so they're used as the clip directly - no y
flip (see CLAUDE.md, "Cropping figures out of a PDF - the trap").
"""
import json
import pathlib
import re

import pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF = ROOT / "public/pdfs/cs-capstone/cs-capstone.pdf"
FIG_DIR = ROOT / "public/pdfs/cs-capstone"
OUT = ROOT / "src/content/cs-capstone.ts"
FIG_DPI = 150

# The four real figures, in the order they're referenced, by PDF image xref.
FIGURES = {1: 51, 2: 76, 3: 62, 4: 64}
# Figure 3's "Front-End Application" box is a separate white drawing that hangs
# below the image's own rectangle, so cropping at the image alone clips it off.
FIGURE_EXTRA = {3: (41, 2221, 156, 2294)}

# Text is selected by the rectangle it sits in: (x0, y0, x1, y1). The poster's
# two columns don't hold for the whole page - the last Results bullet sits at
# x>=800, beside the "Value for RP" heading - so each block names its own box.
REGIONS = {
    "overview":      (0, 440, 980, 660),
    "epic":          (980, 470, 1200, 600),
    "archetypes":    (1200, 470, 1800, 600),
    "design":        (0, 780, 980, 1000),
    "results":       (980, 1100, 1800, 1560),
    "results_extra": (800, 1550, 1800, 1730),
    "value":         (0, 1630, 800, 1700),
    "lessons":       (0, 1780, 800, 1970),
    "future":        (0, 2380, 980, 2520),
}

LIGATURES = {"ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl"}
BULLET, SUB_BULLET = "❖", "➢"  # the poster's two marker glyphs


def clean(text):
    for lig, plain in LIGATURES.items():
        text = text.replace(lig, plain)
    return re.sub(r"\s+", " ", text).strip()


def lines_in(page, box):
    """Every text line whose top-left corner falls in box, top-to-bottom."""
    x0, y0, x1, y1 = box
    out = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            lx, ly = line["bbox"][0], line["bbox"][1]
            if x0 <= lx < x1 and y0 <= ly < y1:
                out.append((ly, lx, clean("".join(s["text"] for s in line["spans"]))))
    # Bucket y so lines on the same visual row sort by x ("Financial" before
    # "Customer Satisfication", which sits 1pt higher).
    return [(y, x, t) for y, x, t in sorted(out, key=lambda l: (round(l[0] / 20), l[1])) if t]


def bullets(page, region):
    """Group lines into (level, text) items. A marker starts an item; other
    lines are that item's wrapped continuation."""
    items = []
    for _, _, text in lines_in(page, REGIONS[region]):
        level = 1 if text.startswith(SUB_BULLET) else 0 if text.startswith(BULLET) else None
        text = text.lstrip(BULLET + SUB_BULLET).strip()
        if level is None and items:
            items[-1][1] += " " + text
        elif level is not None:
            items.append([level, text])
    return [(lvl, clean(t)) for lvl, t in items]


def listing(page, region, level=0):
    return [t for lvl, t in bullets(page, region) if lvl == level]


def figure(page, n):
    """Crop one figure at the rectangle the image occupies on the poster."""
    rect = page.get_image_rects(FIGURES[n])[0]
    if n in FIGURE_EXTRA:
        rect = rect | pymupdf.Rect(FIGURE_EXTRA[n])
    pix = page.get_pixmap(clip=rect, dpi=FIG_DPI)
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    pix.save(FIG_DIR / f"figure{n}.png")
    # width/height are required on every figure block: without them lazy-loaded
    # images reserve no space and jumps to late sections land short.
    return {"type": "figure", "src": f"/pdfs/cs-capstone/figure{n}.png",
            "width": pix.width, "height": pix.height, "caption": ""}


def main():
    doc = pymupdf.open(PDF)
    page = doc[0]
    figures = {n: figure(page, n) for n in FIGURES}

    results = bullets(page, "results") + bullets(page, "results_extra")
    result_items = [t for lvl, t in results if lvl == 0]
    sub_items = [t for lvl, t in results if lvl == 1]

    paper = {
        "slug": "cs-capstone",
        "eyebrow": "CS Capstone",
        "title": clean(lines_in(page, (560, 40, 1500, 120))[0][2]),
        "meta": [
            {"label": "Team", "value": "Daniel Chang, Nolan Gabaldon, Kian Javaheri, Haamid Juvale, Hillary Li"},
            {"label": "Sponsor", "value": "Rida Bazzi"},
            {"label": "Poster", "value": "CS/E - 180"},
        ],
        "actions": [
            {"label": "View Poster", "pdfSrc": "/pdfs/cs-capstone/cs-capstone.pdf"},
            {"label": "Watch Video", "href": "https://www.youtube.com/watch?v=qzW7qxQkHSs"},
        ],
        "sections": [
            {"id": "overview", "title": "Project Overview",
             "blocks": [{"type": "list", "items": listing(page, "overview")}]},
            {"id": "epic", "title": "EPIC and Customer Archetypes",
             "blocks": [
                 {"type": "h3", "text": "EPIC"},
                 {"type": "list", "items": listing(page, "epic")},
                 {"type": "h3", "text": "Customer Archetypes"},
                 {"type": "list", "items": listing(page, "archetypes")},
             ]},
            {"id": "design", "title": "Design Description/Justification",
             "blocks": [
                 {"type": "h3", "text": listing(page, "design")[0].rstrip(": ")},
                 {"type": "list", "items": [t for lvl, t in bullets(page, "design") if lvl == 1]},
                 figures[1], figures[2], figures[3],
             ]},
            {"id": "results", "title": "Results",
             "blocks": [
                 {"type": "list", "items": result_items},
                 {"type": "list", "items": sub_items, "nested": True},
                 figures[4],
             ]},
            {"id": "value", "title": "Value for RP",
             "blocks": [{"type": "list", "items": listing(page, "value")}]},
            {"id": "lessons", "title": "Lessons Learned",
             "blocks": [{"type": "list", "items": listing(page, "lessons")}]},
            {"id": "future", "title": "Future Work",
             "blocks": [{"type": "list", "items": listing(page, "future")}]},
        ],
    }

    for section in paper["sections"]:
        section["blocks"] = [b for b in section["blocks"]
                             if b["type"] != "list" or b["items"]]

    body = json.dumps(paper, indent=2, ensure_ascii=False)
    OUT.write_text(
        "import type { Paper } from './papers'\n\n"
        "// Generated by scripts/extract-cs-capstone.py from the poster PDF.\n"
        "// Bullets are the poster's own text; the poster carries no figure captions.\n"
        f"export const csCapstone: Paper = {body}\n"
    )
    print(f"wrote {OUT.relative_to(ROOT)}")
    for n, f in figures.items():
        print(f"  figure{n}.png {f['width']}x{f['height']}")


if __name__ == "__main__":
    main()
