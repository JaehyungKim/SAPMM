#!/bin/bash
# 데모 페이지 헤드리스 렌더링 + 콘솔 오류 확인 (macOS Google Chrome)
# usage: [HTML=pp.html] tools/render.sh <pageId> <out.png> [WxH] [js-after-navigation]
#   FAKE_DATE: 데모 날짜를 바꿔 렌더링 (예: FAKE_DATE=2026-12-15) — 상대 날짜 확인용
#   HTML: 진입 파일 (기본 index.html = MM, pp.html, qm.html) · BUDGET: 가상 시간 ms (기본 15000, 긴 흐름은 늘린다)
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
python3 - "$ROOT/${HTML:-index.html}" "$TMP" "$INJECT" "${FAKE_DATE:-}" <<'EOF'
import sys
src, dst, inject, fake = sys.argv[1:5]
s = open(src, encoding='utf-8').read()
s = s.replace('</body>', inject, 1)
if fake:
    clock = ("<script>(function(){var O=Date,off=new O('%sT09:00:00').getTime()-O.now();"
             "function D(){var a=[].slice.call(arguments);return a.length?new (O.bind.apply(O,[null].concat(a)))():new O(O.now()+off)}"
             "D.prototype=O.prototype;D.now=function(){return O.now()+off};D.UTC=O.UTC;D.parse=O.parse;window.Date=D;})();</script>") % fake
    s = s.replace('<head>', '<head>' + clock, 1)
open(dst, 'w', encoding='utf-8').write(s)
EOF
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --enable-logging=stderr --v=0 \
  --window-size="${SIZE/x/,}" --virtual-time-budget=${BUDGET:-15000} --screenshot="$OUT" "file://$TMP" 2>&1 \
  | grep -E "INFO:CONSOLE|ERROR:CONSOLE" \
  | grep -Eiv "Device API logging|is not valid for aggregation \"additionalContent\"|✅" \
  | sed -E 's/^.*CONSOLE[^]]*\] //' || true
echo "screenshot: $OUT"
