/* 데모 날짜: 화면 시계와 같은 '오늘'을 기준으로 상대 날짜를 계산
   demoDay(n)        오늘 + n일
   demoMD(m, day)    m개월 뒤 그 달의 day일 (day 0 = 그 전달 말일 → demoMD(2, 0) = 다음 달 말일)
   demoMon(m, fmt)   m개월 뒤의 달 — 'kr' "12월" · 'ykr' "2026년 12월" · 'ym' "2026-12"
   fmt: 'iso' 2026-12-05 · 'md' 12-05 · 'kr' 12월 5일 · 기본 2026.12.05 */
window.demoFmt = function (d, fmt) {
  const p = x => String(x).padStart(2, '0');
  if (fmt === 'iso') return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  if (fmt === 'md') return `${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  if (fmt === 'kr') return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};
window.demoDay = function (n, fmt) {
  const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n);
  return demoFmt(d, fmt);
};
window.demoMD = function (m, day, fmt) {
  const t = new Date(); const d = new Date(t.getFullYear(), t.getMonth() + m, day, 12);
  return demoFmt(d, fmt);
};
window.demoMon = function (m, fmt) {
  const t = new Date(); const d = new Date(t.getFullYear(), t.getMonth() + m, 1, 12);
  if (fmt === 'ykr') return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  if (fmt === 'ym') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${d.getMonth() + 1}월`;
};
/* HTML: <span data-rel-day="-9"> · <span data-rel-mon="1" data-rel-dom="12"> (다음 달 12일) · <span data-rel-mon="1" data-rel-fmt="month"> */
window.applyRelDays = function () {
  document.querySelectorAll('[data-rel-day]').forEach(el => { el.textContent = demoDay(+el.dataset.relDay, el.dataset.relFmt || 'dot'); });
  document.querySelectorAll('[data-rel-mon]').forEach(el => {
    const f = el.dataset.relFmt || 'dot';
    el.textContent = f === 'month' || f === 'ymonth' ? demoMon(+el.dataset.relMon, f === 'month' ? 'kr' : 'ykr') : demoMD(+el.dataset.relMon, +el.dataset.relDom, f);
  });
};
document.addEventListener('DOMContentLoaded', applyRelDays);
setInterval(applyRelDays, 60000);

/* Fiori Object Page — Anchor Bar 이동 + 스크롤 위치에 따른 활성 탭 표시 */
function fopGo(btn, id) {
  const body = btn.closest('.fop-body');
  const bar = btn.closest('.fop-anchor');
  const target = document.getElementById(id);
  body.scrollTo({ top: target.offsetTop - bar.offsetHeight - 8, behavior: 'smooth' });
  bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
}
document.querySelectorAll('.fop-body').forEach(body => {
  body.addEventListener('scroll', () => {
    const bar = body.querySelector('.fop-anchor');
    const btns = [...bar.querySelectorAll('button')];
    const atEnd = body.scrollTop + body.clientHeight >= body.scrollHeight - 4;
    let active = btns[0];
    btns.forEach(b => {
      const id = b.getAttribute('onclick').match(/'([^']+)'\)/)[1];
      if (document.getElementById(id).offsetTop - bar.offsetHeight - 16 <= body.scrollTop) active = b;
    });
    if (atEnd) active = btns[btns.length - 1];
    btns.forEach(b => b.classList.toggle('on', b === active));
  }, { passive: true });
});

window.fopSeg = function (b) { b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
window.fopTree = function (tog) {
  const open = tog.textContent.trim() === '⌄';
  tog.textContent = open ? '›' : '⌄';
  let r = tog.closest('tr').nextElementSibling;
  while (r && r.classList.contains('fop-tree-c')) { r.hidden = open; r = r.nextElementSibling; }
};
