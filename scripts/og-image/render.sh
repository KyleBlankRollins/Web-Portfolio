#!/usr/bin/env bash
# Renders og-default.html to public/images/og-default.png at 1200x630 using
# headless Chrome. Run from anywhere: scripts/og-image/render.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

"$chrome" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --allow-file-access-from-files \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --virtual-time-budget=2000 \
  --screenshot="$root/public/images/og-default.png" \
  "file://$here/og-default.html"
