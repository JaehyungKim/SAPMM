/* ═══════════════════════════════════════════════════════════════
   STO 표준 흐름 · 자재 문서 · 스토리 모드 · 결정적 순간 연출
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const ico = (id, cls = 'fop-i') => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const pad = n => String(n).padStart(2, '0');
  const fmtDT = d => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const fmtD = d => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;

  /* ── Fiori MessageToast / 성공 대화상자 ── */
  let toastTimer;
  window.fopToast = function (text) {
    const t = $('fop-toast'); if (!t) return;
    t.textContent = text; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  };
  window.fopDialog = function (html, actionLabel, action) {
    $('fd-body').innerHTML = html;
    const a = $('fd-action');
    a.textContent = actionLabel;
    a.onclick = () => { fopDialogClose(); action(); };
    $('fop-dialog').hidden = false;
  };
  window.fopDialogClose = function () { $('fop-dialog').hidden = true; };

  /* ── 재고 이전 오더 상태 (생성됨 → 납품 생성됨 → 운송 중 → 입고 완료) ── */
  const ST = [
    { t: '생성됨', c: '', i: '' },
    { t: '납품 생성됨', c: 'info', i: 'fi-info' },
    { t: '운송 중', c: 'info', i: 'fi-info' },
    { t: '입고 완료', c: 'pos', i: 'fi-pos' }
  ];
  const ITEM_ST = ['미결', '납품 생성됨', '출고 완료', '입고 완료'];
  const sto = { s: 0, dlv: null, gi: null, gr: null, giAt: null, grAt: null, log: [] };
  window.stoState = sto;

  const statusHtml = (s, lg) => {
    const x = ST[s];
    return `<span class="fop-status ${lg ? 'lg ' : ''}${x.c}">${x.i ? ico(x.i) : ''}${x.t}</span>`;
  };
  const log = (who, what, res) => sto.log.push({ at: new Date(), who, what, res });

  window.stoReset = function () {
    const now = Date.now();
    Object.assign(sto, { s: 0, dlv: null, gi: null, gr: null, giAt: null, grAt: null, log: [] });
    sto.log.push({ at: new Date(now - 180000), who: 'Joule · Stock Transfer Agent', what: '플랜트 간 재고 불균형 탐지 (1050 부족 40 EA · 1060 여유 80 EA)', res: '추천 생성' });
    sto.log.push({ at: new Date(now - 60000), who: '김재형 (JKIM)', what: 'Joule 추천 승인 — 구매오더(STO) 생성 요청', res: '승인' });
    sto.log.push({ at: new Date(now), who: 'ERP MCP Server', what: '구매오더 4500019567 생성 (문서 유형 UB · 재고 이전 오더)', res: '성공' });
    sto.log.push({ at: new Date(now), who: 'Joule', what: '물류 담당자(인천 물류창고) 알림 발송', res: '발송됨' });
    stoRender();
  };

  function flowNode(title, no, status, opts = {}) {
    const cls = ['fop-pf-node'];
    if (!no) cls.push('pending');
    if (opts.onclick && no) cls.push('link');
    if (opts.current) cls.push('current');
    return `<div class="${cls.join(' ')}" ${opts.onclick && no ? `onclick="${opts.onclick}"` : ''}>
      <div class="fop-pf-t">${title}</div>
      <div class="fop-pf-no">${no || '—'}</div>
      ${status}
      ${opts.sub ? `<div class="fop-pf-sub">${opts.sub}</div>` : ''}
    </div>`;
  }
  const conn = `<div class="fop-pf-conn"><svg viewBox="0 0 40 12" width="40" height="12"><path d="M0 6h34M30 2l5 4-5 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>`;
  const okS = t => `<span class="fop-status pos">${ico('fi-pos')}${t}</span>`;
  const waitS = t => `<span class="fop-status">${t}</span>`;

  window.stoRender = function () {
    const s = sto.s;
    if ($('sto-op-status')) $('sto-op-status').innerHTML = statusHtml(s, true);
    if ($('sto-lr-status')) $('sto-lr-status').innerHTML = statusHtml(s);
    if ($('sto-item-status')) $('sto-item-status').innerHTML = statusHtml(s).replace(ST[s].t, ITEM_ST[s]);
    [['sto-act-dlv', 0], ['sto-act-gi', 1], ['sto-act-gr', 2]].forEach(([id, at]) => {
      const b = $(id); if (!b) return;
      b.disabled = s !== at;
      b.classList.toggle('emph', s === at);
    });
    const df = $('sto-docflow');
    if (df) df.innerHTML =
      flowNode('구매오더 (UB)', '4500019567', okS('생성됨'), { sub: 'UB · 1060 → 1050', current: true }) + conn +
      flowNode('아웃바운드 납품', sto.dlv, sto.dlv ? okS(s >= 2 ? '출고 완료' : '생성됨') : waitS('대기'), { sub: '출하지점 1060' }) + conn +
      flowNode('출고 · 자재 문서', sto.gi, sto.gi ? okS('전기됨') : waitS('대기'), { sub: '이동 유형 641', onclick: "fopOpenMatdoc('gi')" }) + conn +
      flowNode('운송 중 재고', sto.gi ? '1050 · 40 EA' : null, sto.gi ? (sto.gr ? okS('해소됨') : `<span class="fop-status info">${ico('fi-info')}운송 중</span>`) : waitS('대기')) + conn +
      flowNode('입고 · 자재 문서', sto.gr, sto.gr ? okS('전기됨') : waitS('대기'), { sub: '이동 유형 101', onclick: "fopOpenMatdoc('gr')" });
    const lg = $('sto-log');
    if (lg) lg.innerHTML = sto.log.slice().reverse().map(e =>
      `<tr><td>${fmtDT(e.at)}</td><td>${e.who}</td><td>${e.what}</td><td>${okS(e.res)}</td></tr>`).join('');
    if ($('sto-log-title')) $('sto-log-title').textContent = `이벤트 (${sto.log.length})`;
    if ($('sto-dlv-title')) $('sto-dlv-title').textContent = `아웃바운드 납품 (${sto.dlv ? 1 : 0})`;
    if ($('sto-dlv-body')) $('sto-dlv-body').innerHTML = sto.dlv
      ? `<tr><td><a class="fop-link">${sto.dlv}</a></td><td>1060 (인천 물류창고)</td><td>${demoDay(1,'dot')}</td><td>${s >= 2 ? okS('완료') : waitS('미결')}</td><td>${s >= 2 ? okS('완료 (641)') : waitS('미결')}</td></tr>`
      : `<tr><td colspan="5" class="fop-muted" style="text-align:center">생성된 아웃바운드 납품이 없습니다. 헤더의 '아웃바운드 납품 생성'으로 생성하세요.</td></tr>`;
    if ($('sto-hist-body')) $('sto-hist-body').innerHTML = sto.log.filter(e => !/^Joule/.test(e.who)).slice().reverse().map(e =>
      `<tr><td>${fmtDT(e.at)}</td><td>${e.what}</td><td>${e.who}</td><td>${((e.res + ' ' + e.what).match(/\b\d{8,10}\b/) || [''])[0]}</td></tr>`).join('');
  };

  window.stoCreateDelivery = function () {
    if (sto.s !== 0) return;
    sto.s = 1; sto.dlv = '80012345';
    log('김재형 (JKIM)', '아웃바운드 납품 80012345 생성 (VL10B)', '성공');
    stoRender();
    fopToast('아웃바운드 납품 80012345이(가) 생성되었습니다');
  };
  window.stoPostGI = function () {
    if (sto.s !== 1) return;
    sto.s = 2; sto.gi = '4900817242'; sto.giAt = new Date();
    log('김재형 (JKIM)', '출고 전기 — 이동 유형 641, 40 EA (1060 → 운송 중)', '자재 문서 4900817242');
    stoRender();
    fopDialog('자재 문서 <b>4900817242/2026</b>이(가) 생성되었습니다.', '자재 문서 표시', () => fopOpenMatdoc('gi'));
  };
  window.stoPostGR = function () {
    if (sto.s !== 2) return;
    sto.s = 3; sto.gr = '4900817251'; sto.grAt = new Date();
    log('김재형 (JKIM)', '입고 전기 — 이동 유형 101, 40 EA (1050 / 0001)', '자재 문서 4900817251');
    stoRender();
    fopDialog('자재 문서 <b>4900817251/2026</b>이(가) 생성되었습니다.', '자재 문서 표시', () => fopOpenMatdoc('gr'));
  };

  /* ── 자재 문서 Object Page ── */
  window.fopOpenMatdoc = function (kind) {
    const isGR = kind === 'gr';
    const no = isGR ? sto.gr : sto.gi;
    if (!no) return;
    const at = (isGR ? sto.grAt : sto.giAt) || new Date();
    const d = isGR
      ? { type: '입고 (WE)', trx: 'GR, 재고 이전 오더 입고 (WE)', mvt: '101 — 입고', plant: '1050 (부산 생산공장)', stype: '가용 재고', acct: '4900006719' }
      : { type: '출고 (WL)', trx: 'GI, 납품 기준 출고 (WL)', mvt: '641 — 운송 중 재고로 이전', plant: '1060 (인천 물류창고)', stype: '가용 재고', acct: '4900006711' };
    const lane = (sym, label, done) => `<div class="fop-lane"><span class="fop-lane-c ${done ? 'done' : ''}">${sym}</span><span>${label}</span></div>`;
    const sp = '<div class="fop-pf-conn"></div>';
    $('md-root').innerHTML = `
    <div class="fop-header">
      <nav class="fop-crumbs"><a onclick="router.go('fiori-sto-object')">구매오더 4500019567</a><span>/</span><a>자재 문서</a></nav>
      <div class="fop-title-row">
        <div class="fop-title-wrap"><h1 class="fop-title">${no} 2026</h1><div class="fop-subtitle">${d.type} · A-4315 유압실린더 40 EA</div></div>
        <div class="fop-actions">
          <button class="fop-btn ghost" onclick="fopToast('데모에서는 역분개를 실행하지 않습니다')">역분개</button>
          <button class="fop-btn ghost">관련 앱</button>
          <button class="fop-btn ghost icon" title="공유">${ico('fi-share')}</button>
        </div>
      </div>
      <div class="fop-hc">
        <div class="fop-facet"><div class="fop-facet-title">역분개된 항목 수</div><div class="fop-v">0 / 1</div><div class="fop-progress"><span style="width:0%"></span></div></div>
        <div class="fop-facet">
          <div class="fop-kv"><span class="fop-k">참조:</span><span class="fop-v"><a class="fop-link" onclick="router.go('fiori-sto-object')">구매오더 4500019567</a></span></div>
          <div class="fop-kv"><span class="fop-k">납품:</span><span class="fop-v">80012345</span></div>
        </div>
      </div>
    </div>
    <nav class="fop-anchor">
      <button class="on" onclick="fopGo(this,'md-sec-gen')">일반 정보</button>
      <button onclick="fopGo(this,'md-sec-items')">항목</button>
      <button onclick="fopGo(this,'md-sec-att')">첨부</button>
      <button onclick="fopGo(this,'md-sec-pf')">프로세스 흐름</button>
    </nav>
    <div class="fop-sections">
      <section class="fop-section" id="md-sec-gen">
        <h2 class="fop-section-title">일반 정보</h2>
        <div class="fop-fgroups">
          <div class="fop-fgroup"><h3>일반 정보</h3>
            <div class="fop-fe"><span class="fop-k">문서일</span><span class="fop-v">${fmtD(at)}</span></div>
            <div class="fop-fe"><span class="fop-k">전기일</span><span class="fop-v">${fmtD(at)}</span></div>
            <div class="fop-fe"><span class="fop-k">생성자</span><span class="fop-v">JKIM</span></div>
            <div class="fop-fe"><span class="fop-k">문서유형</span><span class="fop-v">${d.type}</span></div>
          </div>
          <div class="fop-fgroup"><h3>&nbsp;</h3>
            <div class="fop-fe"><span class="fop-k">재고 트랜잭션 유형</span><span class="fop-v">${d.trx}</span></div>
            <div class="fop-fe"><span class="fop-k">생성 일시</span><span class="fop-v">${fmtDT(at)}</span></div>
          </div>
          <div class="fop-fgroup"><h3>문서 메모</h3>
            <div class="fop-fe"><span class="fop-k">납품서</span><span class="fop-v">80012345</span></div>
            <div class="fop-fe"><span class="fop-k">선하증권</span><span class="fop-v">—</span></div>
            <div class="fop-fe"><span class="fop-k">메모</span><span class="fop-v">—</span></div>
          </div>
        </div>
      </section>
      <section class="fop-section" id="md-sec-items">
        <h2 class="fop-section-title">항목</h2>
        <div class="fop-table-card">
          <div class="fop-tb"><span class="fop-tb-title">항목 (1)</span><span class="fop-sp"></span><span class="fop-search">${ico('fi-search')}검색</span><button class="fop-btn ghost icon">${ico('fi-settings')}</button></div>
          <div class="fop-table-scroll"><table class="fop-table">
            <thead><tr><th>자재 문서 항목</th><th>자재</th><th>이동 유형</th><th class="r">수량</th><th>플랜트</th><th>저장위치</th><th>재고 유형</th></tr></thead>
            <tbody><tr><td>1</td><td><a class="fop-link">A-4315</a><div class="fop-sub">유압실린더</div></td><td>${d.mvt}</td><td class="r">40 <span class="fop-unit">EA</span></td><td>${d.plant}</td><td>0001</td><td>${d.stype}</td></tr></tbody>
          </table></div>
        </div>
      </section>
      <section class="fop-section" id="md-sec-att">
        <h2 class="fop-section-title">첨부</h2>
        <div class="fop-table-card"><div class="fop-tb"><span class="fop-tb-title">첨부 (0)</span><span class="fop-sp"></span><button class="fop-btn ghost">업로드</button><button class="fop-btn ghost">링크 추가</button></div>
        <div class="fop-empty">파일이 없습니다.</div></div>
      </section>
      <section class="fop-section" id="md-sec-pf">
        <h2 class="fop-section-title">프로세스 흐름</h2>
        <div class="fop-card"><div class="fop-pfw">
          <div class="fop-pf">${lane('−', '출고 재고', true)}${sp}${lane('⇢', '운송 중 재고', true)}${sp}${lane('+', '입고 재고', !!sto.gr)}${sp}${lane('₩', '회계 문서', true)}</div>
          <div class="fop-pf">
            ${flowNode('자재 문서', sto.gi, okS('OK'), { sub: '2026 · 641', onclick: "fopOpenMatdoc('gi')", current: !isGR })}${conn}
            ${flowNode('운송 중', '1050 · 40 EA', sto.gr ? okS('해소됨') : `<span class="fop-status info">${ico('fi-info')}운송 중</span>`)}${conn}
            ${flowNode('자재 문서', sto.gr, sto.gr ? okS('OK') : waitS('입고 대기'), { sub: '2026 · 101', onclick: "fopOpenMatdoc('gr')", current: isGR })}${conn}
            ${flowNode('회계 문서', d.acct, okS('OK'), { sub: '2026' })}
          </div>
          <div class="fop-pf">
            ${flowNode('인천 물류창고 1060', '0001', `<span class="fop-pf-sub">재고 유형 01 · 가용</span>`)}${conn}
            ${flowNode('부산 생산공장 1050', '운송 중 재고', `<span class="fop-pf-sub">출고 플랜트 기준 이전</span>`)}${conn}
            ${flowNode('부산 생산공장 1050', sto.gr ? '0001' : null, `<span class="fop-pf-sub">재고 유형 01 · 가용</span>`)}
          </div>
        </div></div>
      </section>
    </div>`;
    const body = $('md-root'); body.scrollTop = 0;
    router.go('fiori-matdoc');
  };

  /* ── 결정적 순간 연출 (채팅 메시지 조각) ── */
  window.riskAlert = () => `<div class="j-alert">
    <div class="j-alert-head">🚨 선제 경보 · 방금 감지</div>
    <div class="j-alert-title">A-4315 유압실린더 — 플랜트 1050 결품 위험</div>
    <ul>
      <li>Delta Co. PO 4500019188 (50 EA) 납기 <b>내일 ${demoDay(1,'md')}</b> · 납기 확인 미회신</li>
      <li>최근 3개월 4건 중 3건 지연 · 리스크 점수 <b>75점 (High)</b></li>
      <li>1050 재고 45 EA vs 2주 필요량 85 EA → 지연 시 <b>40 EA 부족</b></li>
      <li>영향: 부산 조립라인 12 · 생산오더 MO-26-0889 <b>${demoDay(1,'md')} 08시 착수분</b> · 일 생산 손실 약 3.2억원</li>
    </ul>
    <div class="j-alert-foot">아무도 묻기 전에 Joule이 먼저 찾았습니다. 위험 PO 전체를 확인해 보세요.</div>
  </div>`;

  window.optCompare = () => `<div class="chat-table-wrap" style="margin-top:10px">
    <table class="chat-table">
      <thead><tr><th>대응 옵션</th><th>소요</th><th>추가 비용</th><th>성공 가능성</th><th>판단</th></tr></thead>
      <tbody>
        <tr><td>① 1060 여유재고 이동 (80 EA)</td><td>즉시</td><td>운송비 0.4M</td><td>98%</td><td><span class="badge badge-warning">백업</span></td></tr>
        <tr><td><strong>② 납기 단축 요청 (ACME)</strong></td><td>1~2일</td><td><strong>0원</strong></td><td>88% (OTD)</td><td><span class="badge badge-success">✅ 권장</span></td></tr>
        <tr><td>③ 긴급 외부 발주</td><td>3~5일</td><td>+4.6M</td><td>70%</td><td><span class="badge badge-danger">비권장</span></td></tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top:8px;font-size:13px">💡 1060 여유 재고는 이번 주 Delta Co. 지연 대응에 먼저 쓰고, 12월분은 비용이 들지 않는 ②로 해결합니다.</div>`;

  window.rootCause = () => `🔎 <strong>추가 발견 — 같은 원인이 더 있습니다</strong><br>
    계약 PA-2026-112 갱신(10-01)이 아래 미입고 PO 3건에도 반영되지 않았습니다. 그대로 두면 <strong>다음 달 송장 3건도 지급보류</strong>됩니다.
    <div class="chat-table-wrap" style="margin-top:10px"><table class="chat-table">
      <thead><tr><th>PO</th><th>자재</th><th>미입고 수량</th><th>예상 차이</th></tr></thead>
      <tbody>
        <tr><td>4500019201</td><td>M-3310 실린더 로드</td><td>80 EA</td><td>+1.12M</td></tr>
        <tr><td>4500019233</td><td>M-3312 피스톤 씰</td><td>150 EA</td><td>+2.10M</td></tr>
        <tr><td>4500019260</td><td>M-3315 실린더 헤드</td><td>70 EA</td><td>+0.98M</td></tr>
        <tr><td colspan="3" style="text-align:right"><strong>보류 예방 합계</strong></td><td><strong>+4.2M</strong></td></tr>
      </tbody></table></div>
    <div style="margin-top:10px"><button class="action-btn action-btn-primary" onclick="fixRoot(this)">PO 3건 단가 일괄 갱신</button></div>`;
  window.fixRoot = function (btn) {
    btn.parentNode.innerHTML = '<span class="text-success">✅ PO 3건 단가를 138,000원으로 갱신했습니다 — 다음 달 송장 보류 3건 예방</span>';
  };

  window.kgSvg = () => `<div class="kg-wrap"><svg viewBox="0 0 460 222" role="img" aria-label="BOM Knowledge Graph: BC3 전용 부품과 공용 부품">
    <text x="0" y="12" class="kg-cap">BOM Knowledge Graph — 차종 ↔ 부품 관계</text>
    ${[['BC3', 70, true], ['BC5', 130, false], ['BC7', 190, false]].map(([n, y, hot]) =>
      `<g><rect x="4" y="${y - 16}" width="92" height="32" rx="16" class="${hot ? 'kg-car hot' : 'kg-car'}"/><text x="50" y="${y + 5}" text-anchor="middle" class="kg-t ${hot ? 'hot' : ''}">${n}${hot ? ' · 단산' : ''}</text></g>`).join('')}
    ${[['431A 특수 가스켓', 40], ['431C 전용 브래킷', 72], ['432B BC3 전용 센서', 104], ['435D 전용 마운팅 킷', 136]].map(([n, y]) =>
      `<path d="M96 70 C 200 70, 210 ${y}, 300 ${y}" class="kg-e hot"/><g><rect x="300" y="${y - 12}" width="156" height="24" rx="6" class="kg-p hot"/><text x="310" y="${y + 4}" class="kg-t hot">${n}</text></g>`).join('')}
    ${[['공용 볼트 M8', 172], ['공용 와이어 하네스', 204]].map(([n, y]) =>
      [70, 130, 190].map(cy => `<path d="M96 ${cy} C 200 ${cy}, 210 ${y}, 300 ${y}" class="kg-e"/>`).join('') +
      `<g><rect x="300" y="${y - 12}" width="156" height="24" rx="6" class="kg-p"/><text x="310" y="${y + 4}" class="kg-t">${n}</text></g>`).join('')}
  </svg>
  <div class="kg-legend"><span class="hot"></span>BC3에만 연결된 전용 부품 (28개 중 4개 표시) <span></span>여러 차종이 함께 쓰는 공용 부품 — 단산 영향 없음</div></div>`;

  /* ── 기존 방식 vs Joule (완료 배너에 자동 추가) ── */
  const BA = {
    agent1: ['재고 리포트 추출 → 엑셀 분석 → ME22N로 PO 18건 개별 Block', '약 4시간', '3분'],
    agent2: ['CS15 BOM 역전개 · 28개 부품 차종 교차 확인 · 메일 9건 작성', '약 2일', '5분'],
    agent3: ['MD06 예외 234건 수동 검토 · 공급업체 통화', '약 4시간', '2분'],
    agent4: ['송장 847건 대사 · 불일치 23건 원인 조사(계약서 확인)', '약 3일', '10분'],
    agent5: ['공급업체 47곳 납기 확인 전화·메일', '매일 약 2시간', '1분'],
    agent6: ['200개 자재 엑셀 수요 예측 · PR 작성', '약 1.5일', '5분'],
    agent7: ['3개 플랜트 재고 비교 · STO 작성', '약 3시간', '2분']
  };
  new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
    if (!(n instanceof HTMLElement) || !n.classList.contains('completion-banner')) return;
    const sec = n.closest('section.page'); if (!sec) return;
    const ba = BA[sec.id]; if (!ba) return;
    const box = n.querySelector(':scope > div') || n;
    box.insertAdjacentHTML('beforeend',
      `<div class="ba-row"><span class="ba-old">기존 방식 <s>${ba[1]}</s> · ${ba[0]}</span><span class="ba-new">Joule <b>${ba[2]}</b></span></div>`);
    if (story.on && STORY[story.i] && STORY[story.i].page === sec.id && STORY[story.i + 1]) {
      box.insertAdjacentHTML('beforeend', `<button class="ba-next" onclick="storyNext()">다음 장면 → ${STORY[story.i + 1].t}</button>`);
    }
  }))).observe(document.body, { childList: true, subtree: true });

  /* ── 스토리 모드 ── */
  const STORY = [
    { page: 'agent5', t: '선제 경보', s: 'Joule이 먼저 위기를 알려줍니다' },
    { page: 'agent3', t: '생산 영향과 대응 옵션', s: '옵션 3개를 비용·시간·확률로 비교합니다' },
    { page: 'agent7', t: '외부 조달 대신 내부 재고', s: '인천 여유 재고 40 EA를 부산으로 — 자재 문서까지 확인' },
    { page: 'agent6', t: '남은 부족분만 발주', s: '입고 예정(PO+STO)을 차감해 이중 발주를 막습니다' },
    { page: 'agent4', t: '막힌 송장과 숨은 원인', s: '같은 원인의 다음 달 송장 3건까지 선제 해결' },
    { page: 'agent2', t: '반대편 리스크: BC3 단산', s: 'Knowledge Graph로 전용 부품만 골라냅니다' },
    { page: 'agent1', t: '악성재고 선제 차단', s: '단산 부품 PO를 Block해 악성재고 확대를 막습니다' },
    { page: 'story-closing', t: '오늘 아침의 결과', s: '누적 임팩트를 정리합니다' }
  ];
  const story = { on: false, i: 0 };
  window.storyState = story;

  function renderBar() {
    const sc = STORY[story.i];
    $('sb-step').textContent = `장면 ${story.i + 1} / ${STORY.length}`;
    $('sb-title').textContent = sc.t;
    $('sb-say').textContent = sc.s;
    $('sb-next').textContent = story.i < STORY.length - 1 ? `다음: ${STORY[story.i + 1].t} →` : '스토리 종료';
    $('sb-dots').innerHTML = STORY.map((s, i) => `<i class="${i < story.i ? 'done' : i === story.i ? 'on' : ''}" title="${s.t}"></i>`).join('');
    $('story-bar').hidden = false;
    document.body.classList.add('story-on');
  }
  function goScene() {
    const pg = STORY[story.i].page;
    router.go(pg); renderBar();
    const pl = (window.demoPlayers || {})[pg];
    if (pl && pl.curStep === 0 && !pl.playing) setTimeout(() => pl.start(), 350);
  }
  window.storyStart = function () {
    Object.values(window.demoPlayers || {}).forEach(p => { try { p.reset(); } catch (e) {} });
    $('si-scenes').innerHTML = STORY.map((s, i) => `<li><b>${i + 1}. ${s.t}</b> — ${s.s}</li>`).join('');
    story.on = false; $('story-bar').hidden = true;
    $('story-intro').hidden = false;
  };
  window.storyBegin = function () {
    $('story-intro').hidden = true;
    story.on = true; story.i = 0;
    goScene();
  };
  window.storyNext = function () {
    if (!story.on) return;
    if (story.i >= STORY.length - 1) { storyEnd(); router.go('home'); return; }
    story.i++; goScene();
  };
  window.storyPrev = function () {
    if (!story.on || story.i === 0) return;
    story.i--; goScene();
  };
  window.storyEnd = function () {
    story.on = false;
    $('story-bar').hidden = true; $('story-intro').hidden = true;
    document.body.classList.remove('story-on');
  };

  stoReset();
})();
