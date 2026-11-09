#!/bin/bash
# 데모 페이지 헤드리스 렌더링 + 콘솔 오류 확인 (macOS Google Chrome)
# usage: tools/render.sh <pageId> <out.png> [WxH] [js-after-navigation]
set -e
PAGE="$1"; OUT="$2"; SIZE="${3:-1600x1000}"; JS="${4:-}"
if [ -z "$PAGE" ] || [ -z "$OUT" ]; then
  echo "usage: tools/render.sh <pageId> <out.png> [WxH] [js-after-navigation]"; exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$ROOT/.render-tmp.html"
trap 'rm -f "$TMP"' EXIT
# 페이지 진입 3.5초 후 JS 실행 (UI5 로드 대기)
INJECT="<script>setTimeout(function(){router.go('$PAGE');setTimeout(function(){try{$JS}catch(e){console.error('render.sh JS error',e)}},1500)},3500)</script></body>"
python3 - "$ROOT/index.html" "$TMP" "$INJECT" <<'EOF'
import sys
src, dst, inject = sys.argv[1:4]
s = open(src, encoding='utf-8').read()
open(dst, 'w', encoding='utf-8').write(s.replace('</body>', inject, 1))
EOF
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --enable-logging=stderr --v=0 \
  --window-size="${SIZE/x/,}" --virtual-time-budget=15000 --screenshot="$OUT" "file://$TMP" 2>&1 \
  | grep -E "INFO:CONSOLE|ERROR:CONSOLE" \
  | grep -Eiv "Device API logging|is not valid for aggregation \"additionalContent\"|✅" \
  | sed -E 's/^.*CONSOLE[^]]*\] //' || true
echo "screenshot: $OUT"
