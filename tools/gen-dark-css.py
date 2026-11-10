#!/usr/bin/env python3
"""css/*.css 의 하드코딩 색상을 다크 모드용으로 바꾼 css/dark.css 를 만든다.

usage: python3 tools/gen-dark-css.py
- base/joule/fiori/gui.css 의 모든 규칙에서 색상 선언만 뽑아 `html.dark` 접두어를 붙여 같은 순서로 출력한다.
  (색상 선언을 바뀌지 않은 것까지 모두 출력해야 원래 캐스케이드 순서가 유지된다.)
- 끝에 css/dark-tokens.css(손으로 다듬은 토큰·예외 규칙)를 그대로 붙인다.
- 색상 매핑 규칙은 js/theme.js 의 mapColor 와 같아야 한다 (인라인 style 은 런타임에 JS가 바꾼다).
CSS를 고친 뒤에는 이 스크립트를 다시 실행한다.
"""
import colorsys, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCS = ['css/base.css', 'css/joule.css', 'css/fiori.css', 'css/gui.css']
OUT = 'css/dark.css'
TOKENS = 'css/dark-tokens.css'

NAMED = {'white': (255, 255, 255, 1.0), 'black': (0, 0, 0, 1.0)}
COLOR_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b')


def parse(c):
    c = c.strip()
    if c.lower() in NAMED:
        return NAMED[c.lower()]
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4):
            h = ''.join(ch * 2 for ch in h)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return r, g, b, a
    nums = re.findall(r'[\d.]+%?', c)
    vals = [float(n.rstrip('%')) * (2.55 if n.endswith('%') else 1) for n in nums[:3]]
    a = 1.0
    if len(nums) > 3:
        a = float(nums[3].rstrip('%')) / (100 if nums[3].endswith('%') else 1)
    return vals[0], vals[1], vals[2], a


def fmt(r, g, b, a):
    r, g, b = (max(0, min(255, round(v))) for v in (r, g, b))
    if a >= 0.999:
        return '#%02X%02X%02X' % (r, g, b)
    return 'rgba(%d,%d,%d,%s)' % (r, g, b, ('%.3f' % a).rstrip('0').rstrip('.'))


def map_color(c, role):
    """role: fg(글자) / bg(배경) / bd(테두리) / auto(SVG fill·stroke, 사용자 변수)"""
    r, g, b, a = parse(c)
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if role == 'auto':
        role = 'bg' if l >= 0.85 else 'fg'
    nl, ns = l, s
    if role == 'fg':
        if l > 0.8:
            return c                      # 색 배경 위 흰 글자
        if s < 0.25:
            nl = 0.92 - l * 0.55          # 무채색 글자 반전
        else:
            nl = max(l, 0.68)             # 링크·상태색은 밝게
    elif role == 'bg':
        if a < 0.35 and l < 0.35:
            nl = 1 - l                    # 어두운 반투명 hover 틴트 → 밝은 틴트
        elif l >= 0.85 or (l >= 0.6 and s < 0.35):
            nl = 0.11 + (1 - l) * 0.6     # 밝은 면 → 어두운 면
            ns = s * 0.55
        else:
            return c                      # 채도 있는 강조 배경(버튼 등)은 유지
    elif role == 'bd':
        if l >= 0.5:
            if l < 0.7 and s >= 0.35:
                return c                  # 강조 테두리 유지
            nl = 0.13 + (1 - l) * 0.9
            ns = s * 0.6
        elif s < 0.25:
            nl = 0.92 - l * 0.55
        else:
            nl = max(l, 0.55)
    nr, ng, nb = colorsys.hls_to_rgb(h, max(0, min(1, nl)), max(0, min(1, ns)))
    return fmt(nr * 255, ng * 255, nb * 255, a)


def role_of(prop):
    p = prop.lower()
    if p == 'color' or p in ('caret-color', 'text-decoration-color', '-webkit-text-fill-color'):
        return 'fg'
    if p.startswith('background'):
        return 'bg'
    if p.startswith('border') or p.startswith('outline') or p == 'column-rule':
        return 'bd'
    if p in ('fill', 'stroke', 'stop-color') or p.startswith('--'):
        return 'auto'
    return None


def strip_comments(s):
    return re.sub(r'/\*.*?\*/', '', s, flags=re.S)


def split_blocks(s):
    """top-level: [(prelude, body)]"""
    out, i, n = [], 0, len(s)
    while i < n:
        j = s.find('{', i)
        if j < 0:
            break
        prelude = s[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if s[k] == '{':
                depth += 1
            elif s[k] == '}':
                depth -= 1
            k += 1
        out.append((prelude, s[j + 1:k - 1]))
        i = k
    return out


def prefix_selector(sel):
    parts = []
    for p in re.split(r',(?![^(]*\))', sel):
        p = p.strip()
        if not p:
            continue
        if p in (':root', 'html'):
            parts.append('html.dark')
        elif p.startswith('html'):
            parts.append('html.dark' + p[4:])
        else:
            parts.append('html.dark ' + p)
    return ', '.join(parts)


def convert_decls(body):
    """색상 관련 속성은 값에 색이 없어도(var(), transparent, none) 전부 낸다.
    일부만 내면 원래 뒤에 오던 규칙을 앞 규칙의 다크 버전이 이겨 캐스케이드가 깨진다.
    background 축약형은 clip 등을 초기화하므로 같은 규칙의 background-* 롱핸드도 함께 낸다."""
    decls = []
    for d in re.split(r';(?![^(]*\))', body):
        if ':' not in d:
            continue
        prop, val = d.split(':', 1)
        prop, val = prop.strip(), val.strip()
        bare = re.sub(r'^-webkit-', '', prop.lower())
        if bare.startswith('background'):
            role = 'bg'
        else:
            role = role_of(prop)
        if not role or bare in ('border-radius', 'border-collapse', 'border-spacing') or bare.startswith('border-') and bare.endswith('radius'):
            continue
        if prop.startswith('--') and (not COLOR_RE.search(val) or 'gradient' in val):
            continue
        new = COLOR_RE.sub(lambda m: map_color(m.group(0), role), val)
        decls.append('%s:%s' % (prop, new))
    return decls


def convert(css):
    out = []
    for prelude, body in split_blocks(css):
        if prelude.startswith('@media') or prelude.startswith('@supports'):
            inner = convert(body)
            if inner:
                out.append('%s{\n%s\n}' % (prelude, '\n'.join(inner)))
        elif prelude.startswith('@'):
            continue                       # keyframes, font-face
        else:
            decls = convert_decls(body)
            if decls:
                out.append('%s{%s}' % (prefix_selector(prelude), ';'.join(decls)))
    return out


def main():
    lines = ['/* 자동 생성 — 직접 고치지 말 것. tools/gen-dark-css.py 로 다시 만든다. */',
             '/* 손으로 다듬는 규칙은 css/dark-tokens.css 에 쓴다. */']
    for src in SRCS:
        css = strip_comments(open(os.path.join(ROOT, src), encoding='utf-8').read())
        rules = convert(css)
        lines.append('\n/* ── from %s (%d rules) ── */' % (src, len(rules)))
        lines.extend(rules)
    tok = os.path.join(ROOT, TOKENS)
    if os.path.exists(tok):
        lines.append('\n/* ── css/dark-tokens.css ── */')
        lines.append(open(tok, encoding='utf-8').read())
    open(os.path.join(ROOT, OUT), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print('wrote', OUT)


if __name__ == '__main__':
    sys.exit(main())
