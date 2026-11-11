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
    /* 1 선제 경보 — 노트북의 Joule 경보 → Delta 트럭(?) → 멈출 조립라인 */
    agent5: svg(`
      ${rect(28, 18, 160, 98, C.s, C.i, 8, 2)}
      ${rect(40, 30, 136, 72, C.rb, C.r, 8, 1.5)}
      ${tx(52, 50, '🚨 선제 경보', { s: 12, w: 800, f: C.r })}
      ${tx(52, 70, 'A-4315 결품 위험', { s: 11.5 })}
      ${tx(52, 88, '내일 08:00 라인 정지', { s: 11, f: C.r })}
      <path d="M16 118 H200 L190 128 H26 Z" fill="${C.ln}"/>
      ${arrow('M206 70 C230 70 238 70 258 70')}
      ${truck(266, 54, C.o)}
      <circle cx="318" cy="38" r="12" fill="${C.ob}" stroke="${C.o}" stroke-width="2"/>${tx(318, 43, '?', { s: 15, w: 800, f: C.o, a: 'middle' })}
      ${tx(294, 104, 'Delta 50 EA', { s: 11, a: 'middle' })}${tx(294, 119, '오늘 16:00 · 회신 없음', { s: 10, w: 500, f: C.m, a: 'middle' })}
      ${arrow('M332 70 C356 70 366 70 390 70', C.r)}
      ${factory(404, 42, C.r, 1.15)}
      <circle cx="486" cy="40" r="16" fill="${C.r}"/>${tx(486, 44, 'STOP', { s: 9, w: 800, f: C.s, a: 'middle' })}
      ${tx(440, 120, '조립라인 12 · 내일 08:00', { s: 11, f: C.r, a: 'middle' })}`),

    /* 2 재고 이전 — 인천(여유) → 부산(부족) 트럭, 외부 발주 18일 */
    agent7: svg(`
      ${factory(46, 40, C.g)}${crate(102, 66, C.g)}${crate(102, 44, C.g)}${crate(128, 66, C.g)}
      ${tx(78, 112, '1060 인천', { s: 11.5, w: 700, a: 'middle' })}${tx(78, 127, '여유 60 EA', { s: 10.5, f: C.g, a: 'middle' })}
      ${factory(258, 78, C.m, .8)}${tx(276, 134, '1070 수원', { s: 10, w: 600, f: C.m, a: 'middle' })}
      ${factory(440, 40, C.r)}${tx(463, 112, '1050 부산', { s: 11.5, w: 700, a: 'middle' })}${tx(463, 127, '부족 40 EA', { s: 10.5, f: C.r, a: 'middle' })}
      ${arrow('M160 54 C240 6 340 6 428 52', C.l, '6 5')}
      ${truck(268, 12, C.l)}
      ${tx(296, 62, '40 EA · 내일 15:00 도착', { s: 11, f: C.l, a: 'middle' })}
      ${tx(540, 20, '외부 발주 18일 ✕', { s: 10, f: C.r, a: 'end' })}`),

    /* 3 PP — 08시~15시 7시간 공백, 컨베이어 위 생산오더 순서 교체 */
    pp1: svg(`
      ${rect(70, 18, 150, 40, C.ib, C.l, 8, 2)}${tx(145, 35, 'MO-26-0894', { s: 11.5, w: 800, f: C.l, a: 'middle' })}${tx(145, 50, 'FG-2200 · 자재 있음', { s: 10, w: 500, a: 'middle' })}
      ${rect(330, 18, 150, 40, C.s, C.m, 8, 2)}${tx(405, 35, 'MO-26-0889', { s: 11.5, w: 800, f: C.m, a: 'middle' })}${tx(405, 50, 'FG-2100 · A-4315 대기', { s: 10, w: 500, f: C.m, a: 'middle' })}
      <path d="M225 30 C265 14 290 14 326 30" fill="none" stroke="${C.b}" stroke-width="2" marker-end="url(#sa-l)"/>
      <path d="M326 48 C290 64 265 64 225 48" fill="none" stroke="${C.b}" stroke-width="2" marker-end="url(#sa-l)"/>
      ${tx(275, 12, '순서 교체', { s: 10.5, w: 700, f: C.b, a: 'middle' })}
      <rect x="40" y="72" width="480" height="12" rx="6" fill="${C.ln}"/>${[60, 120, 180, 240, 300, 360, 420, 480].map(x => `<circle cx="${x}" cy="78" r="3" fill="${C.s}"/>`).join('')}
      <line x1="60" y1="112" x2="510" y2="112" stroke="${C.ln}" stroke-width="2"/>
      <rect x="90" y="104" width="380" height="16" rx="4" fill="${C.rb}" stroke="${C.r}" stroke-width="1.5" stroke-dasharray="4 3"/>
      ${tx(280, 116, '7시간 공백', { s: 11, w: 800, f: C.r, a: 'middle' })}
      <circle cx="90" cy="112" r="6" fill="${C.r}"/><circle cx="470" cy="112" r="6" fill="${C.g}"/>
      ${tx(90, 140, '내일 08:00 착수', { s: 10.5, a: 'middle' })}${tx(470, 140, '15:00 A-4315 입고', { s: 10.5, f: C.g, a: 'middle' })}`),

    /* 4 QM — 창고 선반의 검사 대기 상자 + 돋보기 */
    qm2: svg(`
      <rect x="36" y="16" width="250" height="122" rx="6" fill="none" stroke="${C.i}" stroke-width="2"/>
      <line x1="36" y1="56" x2="286" y2="56" stroke="${C.i}" stroke-width="2"/><line x1="36" y1="98" x2="286" y2="98" stroke="${C.i}" stroke-width="2"/>
      ${crate(50, 30, C.m)}${crate(80, 30, C.m)}${crate(110, 30, C.m)}${crate(200, 30, C.m)}${crate(230, 30, C.m)}
      ${crate(50, 72, C.m)}${crate(80, 72, C.m)}${crate(250, 72, C.m)}
      ${crate(50, 112, C.m)}${crate(160, 112, C.m)}${crate(190, 112, C.m)}${crate(220, 112, C.m)}
      <rect x="128" y="64" width="86" height="30" rx="4" fill="${C.ob}" stroke="${C.o}" stroke-width="2"/>
      ${tx(171, 78, 'A-4315 20 EA', { s: 10.5, w: 800, f: C.o, a: 'middle' })}${tx(171, 90, '검사 대기 2일', { s: 9.5, w: 600, f: C.o, a: 'middle' })}
      <circle cx="350" cy="68" r="34" fill="${C.s}" stroke="${C.b}" stroke-width="4"/><line x1="374" y1="92" x2="400" y2="118" stroke="${C.b}" stroke-width="7" stroke-linecap="round"/>
      ${tx(350, 64, '내압 시험', { s: 10, w: 600, f: C.m, a: 'middle' })}${tx(350, 80, '7 / 8', { s: 14, w: 800, f: C.b, a: 'middle' })}
      ${arrow('M410 68 C428 68 434 68 448 68', C.g)}
      ${tx(500, 64, '가용으로', { s: 11, w: 600, f: C.g, a: 'middle' })}${tx(500, 84, '18 EA?', { s: 16, w: 800, f: C.g, a: 'middle' })}`),

    /* 5 MRP — 다음 달 달력 + 예외 234건 → 긴급 12건 */
    agent3: svg(`
      ${rect(34, 14, 150, 124, C.s, C.i, 8, 2)}<rect x="34" y="14" width="150" height="26" rx="8" fill="${C.b}"/><rect x="34" y="30" width="150" height="10" fill="${C.b}"/>
      ${tx(109, 32, '다음 달', { s: 12, w: 800, f: C.s, a: 'middle' })}
      ${Array.from({ length: 15 }, (_, k) => `<circle cx="${52 + (k % 5) * 28}" cy="${56 + Math.floor(k / 5) * 22}" r="3" fill="${C.ln}"/>`).join('')}
      <circle cx="108" cy="78" r="11" fill="none" stroke="${C.r}" stroke-width="2.5"/>${tx(108, 82, '12', { s: 10.5, w: 800, f: C.r, a: 'middle' })}
      ${tx(109, 132, 'MO-26-0891 투입', { s: 9.5, w: 600, f: C.r, a: 'middle' })}
      ${Array.from({ length: 6 }, (_, k) => `<rect x="226" y="${22 + k * 13}" width="${120 - (k % 3) * 18}" height="7" rx="3.5" fill="${C.ln}"/>`).join('')}
      ${tx(286, 118, 'MRP 예외 234건', { s: 11.5, w: 700, a: 'middle' })}
      <path d="M362 26 H432 L408 62 V96 L386 108 V62 Z" fill="${C.soft}" stroke="${C.b}" stroke-width="2" stroke-linejoin="round"/>
      ${arrow('M436 68 C450 68 456 68 468 68', C.r)}
      ${rect(474, 46, 66, 44, C.rb, C.r, 8, 2)}${tx(507, 66, '긴급', { s: 11, w: 700, f: C.r, a: 'middle' })}${tx(507, 82, '12건', { s: 13, w: 800, f: C.r, a: 'middle' })}`),

    /* 6 발주 — 거의 빈 재고 게이지, 상승하는 수요 예측, 발주서 */
    agent6: svg(`
      ${rect(40, 18, 70, 104, C.s, C.i, 8, 2)}<rect x="46" y="104" width="58" height="12" rx="3" fill="${C.r}"/>
      ${tx(75, 138, '다음 달 초 18 EA', { s: 10.5, f: C.r, a: 'middle' })}
      <line x1="150" y1="120" x2="390" y2="120" stroke="${C.ln}" stroke-width="2"/><line x1="150" y1="20" x2="150" y2="120" stroke="${C.ln}" stroke-width="2"/>
      ${[[170, 40], [205, 48], [240, 56], [275, 66]].map(([x, h]) => `<rect x="${x}" y="${120 - h}" width="22" height="${h}" rx="3" fill="${C.ln}"/>`).join('')}
      <path d="M181 78 L216 70 L251 62 L286 52" fill="none" stroke="${C.m}" stroke-width="2"/>
      <path d="M286 52 L321 38 L356 26" fill="none" stroke="${C.b}" stroke-width="2.5" stroke-dasharray="6 4"/>
      <circle cx="356" cy="26" r="5" fill="${C.b}"/>${tx(356, 14, '예측 265 EA', { s: 10.5, w: 700, f: C.b, a: 'middle' })}
      ${tx(270, 140, '최근 소요 → 다음 달 수요 예측', { s: 10, w: 500, f: C.m, a: 'middle' })}
      ${arrow('M404 70 C418 70 424 70 436 70', C.l)}
      ${doc(446, 24, '구매요청', C.l, 3)}${tx(483, 104, '200 EA', { s: 13, w: 800, f: C.l, a: 'middle' })}`),

    /* 7 송장 — PO·입고·송장 대조, 송장 '지급보류', 울리는 전화 */
    agent4: svg(`
      ${doc(30, 26, 'PO', C.l)}${doc(130, 26, '입고', C.g)}${doc(230, 26, '송장', C.r)}
      ${tx(117, 76, '=', { s: 20, w: 800, f: C.g, a: 'middle' })}${tx(217, 76, '≠', { s: 20, w: 800, f: C.r, a: 'middle' })}
      <g transform="rotate(-14 267 96)"><rect x="234" y="84" width="68" height="24" rx="4" fill="none" stroke="${C.r}" stroke-width="2.5"/>${tx(268, 101, '지급보류', { s: 12, w: 800, f: C.r, a: 'middle' })}</g>
      ${tx(167, 140, '124,000원 vs 138,000원', { s: 10.5, w: 600, f: C.m, a: 'middle' })}
      <g transform="translate(392,40)"><rect x="0" y="0" width="38" height="66" rx="8" fill="${C.s}" stroke="${C.i}" stroke-width="2.2"/><rect x="6" y="9" width="26" height="40" rx="2" fill="${C.ib}"/><circle cx="19" cy="57" r="3" fill="${C.i}"/></g>
      <path d="M440 46 Q450 56 440 66 M448 40 Q462 56 448 72" fill="none" stroke="${C.o}" stroke-width="2.2" stroke-linecap="round"/>
      ${rect(462, 26, 84, 40, C.ob, C.o, 10, 1.5)}${tx(504, 43, 'Alpha Co.', { s: 10.5, w: 700, f: C.o, a: 'middle' })}${tx(504, 58, '"결제는요?"', { s: 10.5, w: 600, a: 'middle' })}
      ${tx(470, 124, 'AP팀 · 이번 달 송장 847건', { s: 10.5, w: 500, f: C.m, a: 'middle' })}`),

    /* 8 단산 — BC3 차량, BOM 트리(전용 부품은 빨강) */
    agent2: svg(`
      <g transform="translate(30,48)"><path d="M6 40 V26 L24 10 H74 L96 26 H114 V40 Z" fill="${C.s}" stroke="${C.i}" stroke-width="2.4" stroke-linejoin="round"/><path d="M30 14 H70 L84 26 H24 Z" fill="${C.ib}"/><circle cx="30" cy="42" r="10" fill="${C.i}"/><circle cx="90" cy="42" r="10" fill="${C.i}"/></g>
      ${tx(90, 40, 'BC3', { s: 16, w: 800, f: C.i, a: 'middle' })}
      ${rect(20, 112, 150, 26, C.rb, C.r, 6, 1.5)}${tx(95, 129, 'BOM 유효 종료 · 다음 달 말', { s: 10, w: 700, f: C.r, a: 'middle' })}
      ${rect(270, 14, 92, 28, C.soft, C.b, 8, 2)}${tx(316, 32, 'BC3 BOM', { s: 11.5, w: 800, f: C.b, a: 'middle' })}
      ${[[200, '431A', C.r], [262, '431C', C.r], [324, '432B', C.r], [386, '435D', C.r], [462, '공용 M8', C.m]].map(([x, t, c]) =>
        `<path d="M316 42 C316 70 ${x} 64 ${x} 92" fill="none" stroke="${c}" stroke-width="1.8"/>${rect(x - 28, 92, 56, 26, c === C.r ? C.rb : C.s, c, 6, 1.6)}${tx(x, 109, t, { s: 10.5, w: 700, f: c, a: 'middle' })}`).join('')}
      ${tx(316, 140, 'BC3에만 쓰는 전용 부품 28개', { s: 10.5, w: 600, f: C.r, a: 'middle' })}`),

    /* 9 악성재고 — 쌓인 재고·감소 그래프, K-7720 → K-7721 */
    agent1: svg(`
      ${[[40, 96], [66, 96], [92, 96], [118, 96], [53, 74], [79, 74], [105, 74], [66, 52], [92, 52]].map(([x, y]) => crate(x, y, C.m)).join('')}
      <path d="M46 46 q4 -8 8 0 M100 38 q4 -8 8 0 M76 30 q4 -8 8 0" fill="none" stroke="${C.ln}" stroke-width="1.6"/>
      ${rect(150, 56, 70, 28, C.ob, C.o, 6, 1.6)}${tx(185, 75, '112.5M', { s: 13, w: 800, f: C.o, a: 'middle' })}
      ${tx(92, 136, '장기재고 전환 예정', { s: 10.5, w: 600, f: C.m, a: 'middle' })}
      <line x1="250" y1="110" x2="360" y2="110" stroke="${C.ln}" stroke-width="2"/>
      <path d="M256 36 L282 50 L308 72 L334 92 L356 104" fill="none" stroke="${C.r}" stroke-width="2.5"/><circle cx="356" cy="104" r="4.5" fill="${C.r}"/>
      ${tx(306, 28, '소요 −70%', { s: 11, w: 800, f: C.r, a: 'middle' })}${tx(306, 132, '최근 3개월', { s: 10, w: 500, f: C.m, a: 'middle' })}
      ${rect(392, 40, 64, 40, C.s, C.m, 8, 2)}${tx(424, 64, 'K-7720', { s: 11, w: 800, f: C.m, a: 'middle' })}
      ${arrow('M460 60 C470 60 476 60 484 60', C.l)}
      ${rect(488, 40, 62, 40, C.ib, C.l, 8, 2)}${tx(519, 64, 'K-7721', { s: 11, w: 800, f: C.l, a: 'middle' })}
      ${tx(470, 102, '후속 자재 지정', { s: 10.5, w: 700, f: C.l, a: 'middle' })}${tx(470, 118, '단종 유효일 다음 달', { s: 10, w: 500, f: C.m, a: 'middle' })}`)
  };
})();
