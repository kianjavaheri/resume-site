#!/bin/bash
# Regenerates the Open Graph share images in public/og/.
#
# Run it by hand after changing a project thumbnail or the hero photo; it is NOT
# part of `npm run build`, because these are committed assets with content
# hashes in their names (see "Filenames carry a content hash" in CLAUDE.md) and
# a build that rewrote them every time would defeat that.
#
# Two things force the format and the size:
#   - JPEG, not WebP. The whole point of these is the LinkedIn unfurler, and
#     LinkedIn does not reliably render a WebP og:image. The source thumbnails
#     ARE WebP, so each is decoded with dwebp first.
#   - 1200x630 (1.905), the size every unfurler crops toward. The thumbnails are
#     16/9 (1.778), so they are FITTED by height and padded at the sides rather
#     than cropped — losing nothing, the same call the thumbnails themselves
#     make. The pad color is sampled from each image's own edge, because white
#     is only right if the image is actually white there.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/og
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

edge_color() {  # most common pixel down the left and right columns of a PPM
  python3 - "$1" <<'PY'
import sys, collections
d = open(sys.argv[1], 'rb').read()
parts, i = [], 2
while len(parts) < 3:                      # P6, then w h maxval, skipping comments
    while d[i:i+1].isspace(): i += 1
    if d[i:i+1] == b'#':
        while d[i:i+1] != b'\n': i += 1
        continue
    j = i
    while not d[j:j+1].isspace(): j += 1
    parts.append(int(d[i:j])); i = j
w, h, _ = parts
px = d[i+1:]
c = collections.Counter()
for y in range(h):
    for x in (0, w - 1):
        o = (y * w + x) * 3
        c[px[o:o+3]] += 1
print('%02X%02X%02X' % tuple(c.most_common(1)[0][0]))
PY
}

hash_and_place() {  # $1 = finished jpg, $2 = slug
  local h; h=$(md5 -q "$1" | cut -c1-8)
  rm -f "$OUT/$2".*.jpg
  cp "$1" "$OUT/$2.$h.jpg"
  echo "  $OUT/$2.$h.jpg  ($(du -h "$OUT/$2.$h.jpg" | cut -f1 | tr -d ' '))"
}

echo "Project cards — fitted to 630 tall, padded to 1200 wide:"
for src in public/images/projects/*.webp; do
  slug=$(basename "$src" | cut -d. -f1)
  dwebp -quiet "$src" -ppm -o "$TMP/$slug.ppm"
  dwebp -quiet "$src" -o "$TMP/$slug.png"
  pad=$(edge_color "$TMP/$slug.ppm")
  sips --resampleHeight 630 "$TMP/$slug.png" --out "$TMP/$slug.fit.png" >/dev/null
  sips -p 630 1200 --padColor "$pad" "$TMP/$slug.fit.png" --out "$TMP/$slug.pad.png" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 82 "$TMP/$slug.pad.png" --out "$TMP/$slug.jpg" >/dev/null
  printf "  pad #%s  " "$pad"; hash_and_place "$TMP/$slug.jpg" "$slug"
done

# The home page's card is the first gallery photo, CROPPED rather than padded —
# it is a photograph with a subject, so bars either side would read as a mistake
# where they read as deliberate on a UI screenshot. The crop is offset upward
# (60px of the 270 removed comes off the top) to keep headroom above the face;
# a centred crop leaves it 11px from the edge. Swap the source here to change it.
echo "Home card — cropped from the hero photo:"
sips -z 900 1200 public/images/img1.jpg --out "$TMP/home.fit.png" >/dev/null 2>&1
sips -c 630 1200 --cropOffset 60 0 "$TMP/home.fit.png" --out "$TMP/home.crop.png" >/dev/null 2>&1
sips -s format jpeg -s formatOptions 82 "$TMP/home.crop.png" --out "$TMP/home.jpg" >/dev/null
hash_and_place "$TMP/home.jpg" "home"
