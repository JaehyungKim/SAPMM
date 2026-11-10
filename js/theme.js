/* ═══════════════════════════════════════════════════════════════
   다크 모드 — <html class="dark"> 토글
   - CSS 파일의 색상: css/dark.css (tools/gen-dark-css.py 로 생성)
   - 인라인 style·SVG fill/stroke 색상: 여기서 런타임에 바꾼다 (mapColor 는 생성기와 같은 규칙)
   - UI5 화면: sap_horizon ↔ sap_horizon_dark
   - 선택은 localStorage 'sap-demo-theme' 에 저장 (index.html <head> 인라인 스크립트가 첫 렌더 전에 적용)
═══════════════════════════════════════════════════════════════ */
(function darkTheme(){
  'use strict';
  const root = document.documentElement;
  const KEY = 'sap-demo-theme';

  /* ── 색상 매핑 (tools/gen-dark-css.py map_color 와 동일) ── */
  function rgb2hls(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, l, 0];
    const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h / 6, l, s];
  }
  function hls2rgb(h, l, s) {
    if (!s) return [l * 255, l * 255, l * 255];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = (t + 1) % 1; return t < 1/6 ? p + (q - p) * 6 * t : t < 1/2 ? q : t < 2/3 ? p + (q - p) * (2/3 - t) * 6 : p; };
    return [f(h + 1/3) * 255, f(h) * 255, f(h - 1/3) * 255];
  }
  function parse(c) {
    c = c.trim().toLowerCase();
    if (c === 'white') return [255, 255, 255, 1];
    if (c === 'black') return [0, 0, 0, 1];
    if (c[0] === '#') {
      let h = c.slice(1);
      if (h.length <= 4) h = h.split('').map(x => x + x).join('');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
    const n = c.match(/[\d.]+%?/g) || [];
    const v = n.slice(0, 3).map(x => parseFloat(x) * (x.endsWith('%') ? 2.55 : 1));
    const a = n[3] ? parseFloat(n[3]) / (n[3].endsWith('%') ? 100 : 1) : 1;
    return [v[0], v[1], v[2], a];
  }
  function fmt(r, g, b, a) {
    [r, g, b] = [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))));
    return a >= 0.999 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
  }
  function mapColor(c, role) {
    const [r, g, b, a] = parse(c);
    if ([r, g, b].some(isNaN)) return c;
    const [h, l, s] = rgb2hls(r, g, b);
    if (role === 'auto') role = l >= 0.85 ? 'bg' : 'fg';
    let nl = l, ns = s;
    if (role === 'fg') {
      if (l > 0.8) return c;
      nl = s < 0.25 ? 0.92 - l * 0.55 : Math.max(l, 0.68);
    } else if (role === 'bg') {
      if (a < 0.35 && l < 0.35) nl = 1 - l;
      else if (l >= 0.85 || (l >= 0.6 && s < 0.35)) { nl = 0.11 + (1 - l) * 0.6; ns = s * 0.55; }
      else return c;
    } else {
      if (l >= 0.5) {
        if (l < 0.7 && s >= 0.35) return c;
        nl = 0.13 + (1 - l) * 0.9; ns = s * 0.6;
      } else nl = s < 0.25 ? 0.92 - l * 0.55 : Math.max(l, 0.55);
    }
    const [nr, ng, nb] = hls2rgb(h, Math.max(0, Math.min(1, nl)), Math.max(0, Math.min(1, ns)));
    return fmt(nr, ng, nb, a);
  }
  window.mapDarkColor = mapColor;

  const COLOR_RE = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/gi;
  const mapValue = (v, role) => v.replace(COLOR_RE, m => mapColor(m, role));

  /* ── 인라인 style / SVG 속성 ── */
  const STYLE_PROPS = [
    ['color', 'fg'], ['background-color', 'bg'], ['background-image', 'bg'],
    ['border-top-color', 'bd'], ['border-right-color', 'bd'], ['border-bottom-color', 'bd'], ['border-left-color', 'bd'],
    ['outline-color', 'bd'], ['fill', 'auto'], ['stroke', 'auto'], ['stop-color', 'auto']
  ];
  const ATTRS = ['fill', 'stroke', 'stop-color'];
  const memo = new WeakMap();   // el → { key: [light, dark] }

  const skip = el => el.closest && el.closest('[data-sap-ui]');

  function darken(el) {
    if (skip(el)) return;
    let m = memo.get(el);
    if (!m) { m = {}; memo.set(el, m); }
    const st = el.style;
    if (st && st.length) {
      for (const [p, role] of STYLE_PROPS) {
        const cur = st.getPropertyValue(p);
        if (!cur || !COLOR_RE.test(cur)) { COLOR_RE.lastIndex = 0; continue; }
        COLOR_RE.lastIndex = 0;
        if (m[p] && m[p][1] === cur) continue;                 // 이미 바꿈
        const prio = st.getPropertyPriority(p);
        st.setProperty(p, mapValue(cur, role), prio);
        m[p] = [cur, st.getPropertyValue(p)];
      }
    }
    for (const a of ATTRS) {
      const cur = el.getAttribute && el.getAttribute(a);
      if (!cur || !/^(#|rgb|white|black)/i.test(cur)) continue;
      const k = '@' + a;
      if (m[k] && m[k][1] === cur) continue;
      const nv = mapValue(cur, 'auto');
      m[k] = [cur, nv];
      el.setAttribute(a, nv);
    }
  }
  function lighten(el) {
    const m = memo.get(el);
    if (!m) return;
    for (const k in m) {
      const [light, dark] = m[k];
      if (k[0] === '@') { if (el.getAttribute(k.slice(1)) === dark) el.setAttribute(k.slice(1), light); }
      else if (el.style.getPropertyValue(k) === dark) el.style.setProperty(k, light, el.style.getPropertyPriority(k));
    }
    memo.delete(el);
  }
  const SEL = '[style], [fill], [stroke], [stop-color]';
  function walk(node, fn) {
    if (node.nodeType !== 1) return;
    if (node.matches(SEL)) fn(node);
    node.querySelectorAll(SEL).forEach(fn);
  }

  let busy = false;
  const mo = new MutationObserver(list => {
    if (busy || !root.classList.contains('dark')) return;
    busy = true;
    for (const r of list) {
      if (r.type === 'attributes') darken(r.target);
      else r.addedNodes.forEach(n => walk(n, darken));
    }
    mo.takeRecords();
    busy = false;
  });

  /* ── UI5 ── */
  function applyUI5(dark) {
    const t = dark ? 'sap_horizon_dark' : 'sap_horizon';
    if (!(window.sap && sap.ui && sap.ui.require)) return;
    sap.ui.require(['sap/ui/core/Theming'], T => { if (T.getTheme() !== t) T.setTheme(t); }, () => {});
  }

  /* ── 토글 ── */
  const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
  const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>`;
  function syncButtons(dark) {
    document.querySelectorAll('.j-theme-btn').forEach(b => {
      b.innerHTML = dark ? SUN : MOON;
      b.title = dark ? '라이트 모드' : '다크 모드';
    });
  }

  function setDarkMode(dark) {
    root.classList.toggle('dark', dark);
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
    busy = true;
    if (dark) { walk(document.body, darken); mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', ...ATTRS] }); }
    else { mo.disconnect(); walk(document.body, lighten); }
    busy = false;
    syncButtons(dark);
    applyUI5(dark);
  }
  window.setDarkMode = setDarkMode;
  window.toggleTheme = () => setDarkMode(!root.classList.contains('dark'));

  /* 레일(홈·에이전트 화면 왼쪽)에 버튼 추가 — 아바타 위 */
  document.querySelectorAll('.j-rail').forEach(rail => {
    const b = document.createElement('div');
    b.className = 'j-rail-btn j-theme-btn';
    b.onclick = window.toggleTheme;
    rail.insertBefore(b, rail.querySelector('.j-rail-avatar'));
  });

  setDarkMode(root.classList.contains('dark'));
  /* UI5 가 나중에 로드되면 그때 테마 적용 */
  window.addEventListener('load', () => {
    if (window.sap && sap.ui && sap.ui.require)
      sap.ui.require(['sap/ui/core/Core'], C => C.ready().then(() => applyUI5(root.classList.contains('dark'))));
  });
})();
