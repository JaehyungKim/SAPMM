/* SAP GUI 탭 스트립 전환 */
function guiTab(btn, group, key) {
  btn.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
  btn.closest('.gui-card').querySelectorAll('.gui-pane[data-g="' + group + '"]').forEach(p => { p.hidden = p.dataset.k !== key; });
}

/* GUI 헤더 '상태' 탭 — 재고 이전 오더 진행 단계(window.stoState.s)에 맞춰 수량·금액 표시 */
(function () {
  const ICO = {
    info: '<svg viewBox="0 0 18 18"><rect x="2.5" y="2.5" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 8v5" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="5.7" r=".9" fill="currentColor"/></svg>',
    print: '<svg viewBox="0 0 18 18"><path d="M5 7V2.5h8V7M5 13H2.5V7h13v6H13M5 10.5h8v5H5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    truck: '<svg viewBox="0 0 18 18"><path d="M1.5 4.5h9v8h-9zM10.5 7.5h3.5l2.5 2.8v2.2h-6z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="4.5" cy="13.5" r="1.5" fill="#fff" stroke="currentColor" stroke-width="1.3"/><circle cx="13" cy="13.5" r="1.5" fill="#fff" stroke="currentColor" stroke-width="1.3"/></svg>',
    sum: '<svg viewBox="0 0 18 18"><path d="M13 3.5H5l4.5 5.5L5 14.5h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  };
  const QTY = 40, VAL = 9440000; // A-4315 236,000원/EA (world.md)
  const n = (x, dec) => dec ? x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(x);
  window.guiStatRender = function () {
    const el = document.getElementById('gui-stat'); if (!el) return;
    const st = window.stoState || { s: 0 };
    const done = st.s >= 3;                       // 입고(101) 전기 후 납품 완료
    const dQ = done ? QTY : 0, dV = done ? VAL : 0;
    const cell = (icon, text) => icon ? `<span class="ic">${ICO[icon]}<span>${text}</span></span>` : '<span></span>';
    const row = (c1, label, q, val, cur = 'KRW') =>
      c1 + `<span>${label}</span>` + (q === null ? '<span></span><span></span>' : `<span class="n">${q}</span><span class="u">EA</span>`) +
      `<span></span><span class="n">${n(val, true)}</span><span class="u">${cur}</span>`;
    el.innerHTML =
      cell('info', '활성') + `<span style="text-align:right;padding-right:8px">오더 수량:</span><span class="n">${QTY}</span><span class="u">EA</span><span></span><span class="n">${n(VAL, true)}</span><span class="u">KRW</span>` +
      row(cell('print', '미송부'), '납품 완료', dQ, dV) +
      row(cell('truck', done ? '납품 완료' : st.s === 2 ? '부분 납품 (운송 중)' : '미납품'), '미납품 잔량', QTY - dQ, VAL - dV) +
      row(cell('sum', '송장 대상 아님'), '송장 처리', 0, 0) +
      row(cell('', ''), '선급금', null, 0);
  };
  document.addEventListener('DOMContentLoaded', () => {
    const orig = window.stoRender;
    if (orig) window.stoRender = function () { orig.apply(this, arguments); window.guiStatRender(); };
    window.guiStatRender();
  });
})();
