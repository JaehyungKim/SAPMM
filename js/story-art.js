/* ═══════════════════════════════════════════════════════════════
   스토리 장면 브리핑 일러스트 (인라인 SVG, viewBox 560×150)
   색은 테마 토큰(var(--j-*))만 써서 라이트·다크 모드에서 함께 바뀐다.
   js/story-sto.js 의 showBrief 가 window.STORY_ART[pageId] 를 쓴다.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const C = {
    b: 'var(--j-brand)', l: 'var(--j-link)', r: 'var(--j-neg-icon)', o: 'var(--j-warn-icon)', g: 'var(--j-pos-icon)',
    i: 'var(--j-text)', m: 'var(--j-text-3)', s: 'var(--j-surface)', ln: 'var(--j-border-ctl)', bd: 'var(--j-border)',
    soft: 'var(--j-brand-soft)', rb: 'var(--j-neg-bg)', gb: 'var(--j-pos-bg)', ob: 'var(--j-warn-bg)', ib: 'var(--j-info-bg)'
  };
  const tx = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 600}" fill="${o.f || C.i}" text-anchor="${o.a || 'start'}"${o.tr ? ` transform="${o.tr}"` : ''}>${t}</text>`;
  const rect = (x, y, w, h, f, st = C.ln, rx = 8, sw = 1.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`;
  const arrow = (d, col = C.m, dash = '5 4') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="${dash}" marker-end="url(#sa-${col === C.m ? 'm' : col === C.l ? 'l' : col === C.r ? 'r' : 'g'})"/>`;
  const defs = `<defs>${[['m', C.m], ['l', C.l], ['r', C.r], ['g', C.g]].map(([k, c]) => `<marker id="sa-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('')}</defs>`;
  const factory = (x, y, col, sc = 1) => `<g transform="translate(${x},${y}) scale(${sc})"><rect x="32" y="-10" width="8" height="22" fill="${col}"/><path d="M0 46 V18 L15 9 V18 L30 9 V18 L46 9 V46 Z" fill="${C.s}" stroke="${col}" stroke-width="2.2" stroke-linejoin="round"/><rect x="8" y="28" width="9" height="9" rx="1.5" fill="${col}" opacity=".45"/><rect x="28" y="28" width="9" height="9" rx="1.5" fill="${col}" opacity=".45"/></g>`;
  const truck = (x, y, col) => `<g transform="translate(${x},${y})"><rect x="0" y="2" width="38" height="22" rx="3" fill="${col}"/><path d="M38 9 H48 L55 17 V24 H38 Z" fill="${col}" opacity=".75"/><circle cx="10" cy="26" r="5" fill="${C.i}"/><circle cx="45" cy="26" r="5" fill="${C.i}"/></g>`;
  const crate = (x, y, col, w = 24, h = 20) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="${col}" opacity=".85"/><path d="M${x} ${y + h / 2} H${x + w}" stroke="${C.s}" stroke-width="1.5" opacity=".7"/></g>`;
  const doc = (x, y, title, col, lines = 3) => `<g>${rect(x, y, 74, 92, C.s, col, 6, 2)}<rect x="${x}" y="${y}" width="74" height="20" rx="6" fill="${col}"/><rect x="${x}" y="${y + 12}" width="74" height="8" fill="${col}"/>${tx(x + 37, y + 14, title, { s: 10.5, w: 700, f: C.s, a: 'middle' })}${Array.from({ length: lines }, (_, k) => `<rect x="${x + 10}" y="${y + 32 + k * 14}" width="${54 - (k % 2) * 16}" height="5" rx="2.5" fill="${C.ln}"/>`).join('')}</g>`;
  const svg = inner => `<svg viewBox="0 0 560 150" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;display:block">${defs}${inner}</svg>`;

  window.STORY_ART = {
    /* 1 선제 경보 — Joule 경보 → Delta 트럭(?) → 내일 08시 라인 정지 */
    agent5: svg(`
      ${rect(40, 24, 140, 88, C.s, C.i, 8, 2)}
      <path d="M28 114 H192 L182 124 H38 Z" fill="${C.ln}"/>
      <path d="M110 44 a16 16 0 0 1 16 16 v14 l6 8 h-44 l6 -8 v-14 a16 16 0 0 1 16 -16 z" fill="${C.r}"/><circle cx="110" cy="88" r="4" fill="${C.r}"/>
      ${tx(110, 140, 'Joule 경보', { s: 12, w: 700, a: 'middle' })}
      ${arrow('M200 68 C226 68 234 68 252 68')}
      ${truck(262, 52, C.o)}
      <circle cx="314" cy="38" r="13" fill="${C.ob}" stroke="${C.o}" stroke-width="2"/>${tx(314, 44, '?', { s: 16, w: 800, f: C.o, a: 'middle' })}
      ${tx(290, 140, 'Delta 오늘 16:00', { s: 12, w: 700, a: 'middle' })}
      ${arrow('M330 68 C356 68 364 68 386 68', C.r)}
      ${factory(404, 38, C.r, 1.2)}
      <circle cx="492" cy="36" r="17" fill="${C.r}"/>${tx(492, 40, 'STOP', { s: 9.5, w: 800, f: C.s, a: 'middle' })}
      ${tx(438, 140, '내일 08:00 라인', { s: 12, w: 700, f: C.r, a: 'middle' })}`),

    /* 2 재고 이전 — 외부 발주는 늦고, 다른 공장에 재고가 있을까? */
    agent7: svg(`
      ${factory(250, 52, C.r, 1.2)}${tx(278, 140, '부산 공장', { s: 12, w: 700, f: C.r, a: 'middle' })}
      ${factory(70, 30, C.m, .9)}${tx(91, 100, '다른 공장', { s: 11, w: 600, f: C.m, a: 'middle' })}
      ${factory(440, 30, C.m, .9)}${tx(461, 100, '다른 공장', { s: 11, w: 600, f: C.m, a: 'middle' })}
      <path d="M238 70 C200 56 160 50 126 54" fill="none" stroke="${C.l}" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M318 70 C356 56 396 50 430 54" fill="none" stroke="${C.l}" stroke-width="2" stroke-dasharray="5 4"/>
      <circle cx="182" cy="50" r="12" fill="${C.ib}" stroke="${C.l}" stroke-width="2"/>${tx(182, 55, '?', { s: 14, w: 800, f: C.l, a: 'middle' })}
      <circle cx="374" cy="50" r="12" fill="${C.ib}" stroke="${C.l}" stroke-width="2"/>${tx(374, 55, '?', { s: 14, w: 800, f: C.l, a: 'middle' })}
      ${tx(278, 22, '외부 발주 18일 ✕', { s: 11.5, w: 700, f: C.r, a: 'middle' })}`),

    /* 3 PP — 착수 08:00, 입고 15:00 — 7시간 공백 */
    pp1: svg(`
      <rect x="60" y="40" width="440" height="14" rx="7" fill="${C.ln}"/>${[90, 160, 230, 300, 370, 440].map(x => `<circle cx="${x}" cy="47" r="3.5" fill="${C.s}"/>`).join('')}
      <line x1="60" y1="96" x2="500" y2="96" stroke="${C.ln}" stroke-width="2"/>
      <rect x="100" y="86" width="360" height="20" rx="5" fill="${C.rb}" stroke="${C.r}" stroke-width="1.6" stroke-dasharray="5 4"/>
      ${tx(280, 101, '7시간', { s: 13, w: 800, f: C.r, a: 'middle' })}
      <circle cx="100" cy="96" r="7" fill="${C.r}"/><circle cx="460" cy="96" r="7" fill="${C.g}"/>
      ${tx(100, 132, '착수 08:00', { s: 12, w: 700, a: 'middle' })}${tx(460, 132, '입고 15:00', { s: 12, w: 700, f: C.g, a: 'middle' })}`),

    /* 4 QM — 창고에 검사를 기다리며 묶인 재고가 있을까? */
    qm2: svg(`
      <rect x="60" y="10" width="250" height="108" rx="6" fill="none" stroke="${C.i}" stroke-width="2"/>
      <line x1="60" y1="46" x2="310" y2="46" stroke="${C.i}" stroke-width="2"/><line x1="60" y1="82" x2="310" y2="82" stroke="${C.i}" stroke-width="2"/>
      ${crate(76, 22, C.m)}${crate(106, 22, C.m)}${crate(240, 22, C.m)}${crate(76, 94, C.m)}${crate(210, 94, C.m)}${crate(240, 94, C.m)}${crate(268, 58, C.m)}
      <rect x="140" y="52" width="64" height="26" rx="4" fill="${C.ob}" stroke="${C.o}" stroke-width="2"/>
      <rect x="162" y="60" width="20" height="13" rx="2" fill="${C.o}"/><path d="M166 60 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="${C.o}" stroke-width="2.4"/>
      <circle cx="410" cy="62" r="34" fill="${C.s}" stroke="${C.b}" stroke-width="4"/><line x1="434" y1="86" x2="460" y2="112" stroke="${C.b}" stroke-width="7" stroke-linecap="round"/>
      ${tx(410, 70, '?', { s: 22, w: 800, f: C.b, a: 'middle' })}
      ${tx(185, 142, '검사 대기 재고', { s: 12, w: 700, f: C.o, a: 'middle' })}`),

    /* 5 MRP — 다음 달에도? 예외 메시지 234건 */
    agent3: svg(`
      ${rect(110, 18, 130, 112, C.s, C.i, 8, 2)}<rect x="110" y="18" width="130" height="26" rx="8" fill="${C.b}"/><rect x="110" y="34" width="130" height="10" fill="${C.b}"/>
      ${tx(175, 36, '다음 달', { s: 12, w: 800, f: C.s, a: 'middle' })}
      ${tx(175, 98, '?', { s: 34, w: 800, f: C.b, a: 'middle' })}
      ${Array.from({ length: 7 }, (_, k) => `<rect x="${330 + k * 3}" y="${104 - k * 12}" width="110" height="26" rx="3" fill="${C.s}" stroke="${C.ln}" stroke-width="1.5"/>`).join('')}
      ${tx(398, 140, 'MRP 예외 234건', { s: 12, w: 700, a: 'middle' })}`),

    /* 6 발주 — 다음 달 시작 재고가 거의 없음, 오후 발주 회의 */
    agent6: svg(`
      ${rect(110, 18, 74, 104, C.s, C.i, 8, 2)}<rect x="116" y="106" width="62" height="10" rx="3" fill="${C.r}"/>
      ${tx(147, 142, '재고 거의 없음', { s: 12, w: 700, f: C.r, a: 'middle' })}
      ${rect(330, 30, 140, 84, C.s, C.i, 8, 2)}<rect x="330" y="30" width="140" height="22" rx="8" fill="${C.l}"/><rect x="330" y="44" width="140" height="8" fill="${C.l}"/>
      ${tx(400, 46, '오후 발주 계획 회의', { s: 11, w: 700, f: C.s, a: 'middle' })}
      ${tx(400, 90, '다음 달 발주량?', { s: 13, w: 800, f: C.l, a: 'middle' })}`),

    /* 7 송장 — 지급보류 송장, 공급업체 결제 독촉 */
    agent4: svg(`
      ${doc(130, 22, '송장', C.r, 4)}
      <g transform="rotate(-14 167 92)"><rect x="128" y="78" width="78" height="28" rx="4" fill="${C.s}" stroke="${C.r}" stroke-width="2.5"/>${tx(167, 97, '지급보류', { s: 13, w: 800, f: C.r, a: 'middle' })}</g>
      ${tx(167, 140, '이번 달 송장 847건', { s: 12, w: 700, a: 'middle' })}
      <g transform="translate(340,36)"><rect x="0" y="0" width="40" height="70" rx="8" fill="${C.s}" stroke="${C.i}" stroke-width="2.2"/><rect x="6" y="9" width="28" height="42" rx="2" fill="${C.ib}"/><circle cx="20" cy="60" r="3" fill="${C.i}"/></g>
      <path d="M392 50 Q402 62 392 74 M400 42 Q416 62 400 82" fill="none" stroke="${C.o}" stroke-width="2.4" stroke-linecap="round"/>
      ${tx(390, 140, 'Alpha Co. 결제 독촉', { s: 12, w: 700, f: C.o, a: 'middle' })}`),

    /* 8 단산 — 단산 공문, BC3에만 쓰는 부품은 어떤 것? */
    agent2: svg(`
      ${doc(70, 20, '공문', C.r, 3)}${tx(107, 104, 'BC3 단산', { s: 12, w: 800, f: C.r, a: 'middle' })}
      ${tx(107, 140, '다음 달 말', { s: 11.5, w: 600, f: C.m, a: 'middle' })}
      ${rect(330, 18, 100, 30, C.soft, C.b, 8, 2)}${tx(380, 38, 'BC3 BOM', { s: 12, w: 800, f: C.b, a: 'middle' })}
      ${[270, 330, 390, 450].map(x => `<path d="M380 48 C380 74 ${x} 70 ${x} 96" fill="none" stroke="${C.ln}" stroke-width="1.8"/>${rect(x - 22, 96, 44, 28, C.s, C.ln, 6, 1.6)}${tx(x, 115, '?', { s: 14, w: 800, f: C.m, a: 'middle' })}`).join('')}`),

    /* 9 악성재고 — 쌓이는 재고, 재무팀의 장기재고 금액 보고 요청, 들어오는 PO */
    agent1: svg(`
      ${[[70, 96], [96, 96], [122, 96], [148, 96], [83, 74], [109, 74], [135, 74], [96, 52], [122, 52]].map(([x, y]) => crate(x, y, C.m)).join('')}
      ${tx(122, 140, '쌓이는 재고', { s: 12, w: 700, a: 'middle' })}
      ${doc(250, 22, '재무팀', C.o, 3)}${tx(287, 104, '금액?', { s: 13, w: 800, f: C.o, a: 'middle' })}
      ${tx(287, 140, '장기재고 보고 요청', { s: 12, w: 700, a: 'middle' })}
      ${truck(410, 60, C.l)}${arrow('M480 76 C492 76 498 76 506 76', C.l)}
      ${tx(440, 140, '들어오는 PO', { s: 12, w: 700, f: C.l, a: 'middle' })}`)
  };
})();
