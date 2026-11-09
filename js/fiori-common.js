/* 데모 날짜: 화면 시계와 같은 '오늘'을 기준으로 상대 날짜를 계산 (n = 오늘로부터 일수) */
window.demoDay = function (n, fmt) {
  const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n);
  const p = x => String(x).padStart(2, '0');
  if (fmt === 'iso') return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  if (fmt === 'md') return `${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  if (fmt === 'kr') return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};
window.applyRelDays = function () {
  document.querySelectorAll('[data-rel-day]').forEach(el => { el.textContent = demoDay(+el.dataset.relDay, el.dataset.relFmt || 'dot'); });
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
