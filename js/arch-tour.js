/* ═══════════════════════════════════════════════════════════════
   아키텍처 가이드 투어 — Use Case 핵심 흐름을 단계별로 따라가기
   (다이어그램 좌표계: viewBox 0 0 1440 860)
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const RG = {
    user:    { x: 18,   y: 70,  w: 186, h: 206, label: 'User · Application Clients' },
    btm:     { x: 250,  y: 112, w: 470, h: 92,  label: 'Business Transformation Management' },
    studio:  { x: 264,  y: 256, w: 186, h: 130, label: 'Joule Studio' },
    orch:    { x: 462,  y: 256, w: 176, h: 76,  label: 'Joule Orchestrator' },
    tools:   { x: 664,  y: 222, w: 56,  h: 176, label: 'Tools' },
    mrt:     { x: 250,  y: 418, w: 200, h: 58,  label: 'Managed Runtimes' },
    gateway: { x: 500,  y: 418, w: 220, h: 58,  label: 'Agent Gateway' },
    cagent:  { x: 772,  y: 180, w: 288, h: 96,  label: 'Custom AI Agent (Subaccount)' },
    aicore:  { x: 772,  y: 288, w: 288, h: 56,  label: 'SAP AI Core' },
    hana:    { x: 772,  y: 354, w: 288, h: 50,  label: 'SAP HANA Cloud' },
    integ:   { x: 772,  y: 414, w: 288, h: 96,  label: 'SAP Integration Suite' },
    dest:    { x: 772,  y: 518, w: 288, h: 42,  label: 'Destination & Connectivity' },
    suite:   { x: 232,  y: 640, w: 640, h: 196, label: 'Autonomous Suite' },
    idp:     { x: 930,  y: 672, w: 60,  h: 92,  label: 'SAP Cloud Identity Services' },
    s4:      { x: 1150, y: 112, w: 272, h: 512, label: 'SAP S/4HANA Cloud' },
    s4data:  { x: 1168, y: 174, w: 236, h: 120, label: 'S/4HANA 업무 데이터' },
    s4exec:  { x: 1168, y: 300, w: 236, h: 84,  label: 'S/4HANA 업무 실행 API' },
    s4proc:  { x: 1168, y: 388, w: 236, h: 124, label: 'S/4HANA 업무 프로세스' }
  };

  const T = {
    agent1: { core: '단산·소요 감소로 악성재고가 될 품목을 한 달 먼저 찾아, 발주를 미리 막습니다.', steps: [
      { t: '질문', r: ['user', 'orch'], d: '자재 관리자가 Joule에 "플랜트 1050의 장기재고 전환 예상 상위 10개"를 묻습니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 Inventory Aging Agent를 호출하고(A2A), Agent 로직은 Cloud Foundry Runtime에서 실행됩니다.' },
      { t: 'S/4HANA 조회', r: ['integ', 'dest', 's4', 's4data'], d: 'ERP MCP → Destination/Connectivity를 거쳐 S/4HANA Cloud의 재고·출고 이력·Aging CDS를 조회합니다.' },
      { t: 'AI 예측', r: ['hana'], d: 'SAP HANA Cloud의 PAL(In-Database ML)이 소요 감소 추세로 전환 시점을 예측하고 결과(총 112.5M)를 저장합니다.' },
      { t: '승인 후 실행', r: ['user', 's4exec', 's4proc'], d: '담당자 승인 → S/4HANA API로 미입고 PO 15건 Block, PR 2건 보류를 실행합니다.' },
      { t: '알림 생성', r: ['aicore', 'cagent', 'integ'], d: 'Generative AI Hub(SAP AI Core 위 LLM)가 조치 설명과 알림 문구를 만들고, 담당자에게 메일로 알립니다.' }] },
    agent2: { core: '단산 차종에만 쓰이는 부품을 Knowledge Graph로 골라내, 재고·발주·공급업체 통보까지 한 번에 처리합니다.', steps: [
      { t: '질문', r: ['user', 'orch'], d: '"BC3 차종이 다음 달 말에 단산된다. 영향받는 전용 부품을 알려줘"라고 묻습니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 BOM Discontinuation Agent를 호출하고(A2A), Cloud Foundry Agent가 SPARQL 질의를 만듭니다.' },
      { t: '그래프 탐색', r: ['hana'], d: 'SAP HANA Cloud Knowledge Graph를 탐색해, 다른 차종과 공유하지 않는 BC3 전용 부품 28개를 찾습니다.' },
      { t: 'S/4HANA 조회', r: ['integ', 's4', 's4data'], d: 'ERP MCP로 S/4HANA Cloud에서 전용 부품의 재고와 미입고 PO(431A 2건 등)를 조회합니다.' },
      { t: '메일 생성 · 발송', r: ['aicore', 'cagent', 'integ'], d: '승인 후 Generative AI Hub가 공급업체별 단산 안내 메일을 작성하고 9곳에 보냅니다.' },
      { t: 'Agent 연계', r: ['gateway', 'cagent'], d: 'A2A: 전용 부품 28개를 장기/악성 재고 Agent에 넘겨 악성재고 선제 차단으로 이어집니다.' }] },
    agent3: { core: 'MRP 예외 234건에서 진짜 급한 건을 골라, 대응 옵션을 비교하고 PO 일정 조정까지 실행합니다.', steps: [
      { t: '질문', r: ['user', 'orch'], d: 'MRP 컨트롤러가 "이번 주 플랜트 1050 MRP 예외 중 긴급한 것부터"를 묻습니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 MRP Exception Triage Agent를 호출합니다 (A2A → Cloud Foundry Agent).' },
      { t: 'S/4HANA 조회', r: ['integ', 's4', 's4data'], d: 'S/4HANA Cloud API로 MRP 예외 234건, 제조오더 MO-26-0891, PO 납기 일정을 조회합니다.' },
      { t: 'AI 판단', r: ['aicore', 'hana'], d: 'SAP AI Core의 분류 모델이 긴급 12건을 고르고, HANA Cloud의 리드타임·OTD 이력으로 대응 옵션 3개를 비교합니다.' },
      { t: '승인 후 실행', r: ['user', 's4exec', 's4proc'], d: '승인 → Purchase Order API로 PO 4500019234 납기 3일 단축을 요청하고, 확약(AB) 회신 시 확정합니다. 거절 대비 1060 여유 재고 20 EA를 예약합니다.' },
      { t: 'Agent 연계', r: ['integ', 'gateway', 'cagent'], d: '확약이 오지 않으면 A2A로 재고 이동 최적화 Agent에 넘겨 1060 재고 이전으로 전환합니다.' }] },
    agent4: { core: '송장 847건을 자동 대사하고, 막힌 송장의 원인을 찾아 해결한 뒤 같은 원인의 다음 문제까지 미리 막습니다.', steps: [
      { t: '질문', r: ['user', 'orch'], d: 'AP 담당자가 "이번 달 PO-입고-송장 불일치를 금액 순으로"를 묻습니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 3-Way Matching Agent를 호출합니다 (A2A → Cloud Foundry Agent).' },
      { t: '3-Way 대사', r: ['integ', 's4', 's4data'], d: 'S/4HANA Cloud API로 PO·입고·송장 데이터를 조회해 송장 847건을 대사하고 불일치 23건을 찾습니다.' },
      { t: '원인 분류', r: ['aicore', 'hana'], d: 'SAP AI Core의 분류 모델이 원인을 판정합니다. INV-2946은 계약 갱신이 PO에 반영되지 않은 정당한 청구입니다. 결과는 HANA Cloud에 남깁니다.' },
      { t: '승인 후 실행', r: ['user', 's4exec', 's4proc'], d: '승인 → Supplier Invoice API로 지급보류를 해제하고 송장을 전기합니다 (회계전표 5100003421).' },
      { t: '근본 원인 해결', r: ['cagent', 'suite'], d: 'Agent가 같은 계약이 미반영된 PO 3건을 찾아 다음 달 보류 4.2M을 예방합니다. 결과는 분개 관리 앱에서 확인합니다.' }] },
    agent5: { core: '묻기 전에 Joule이 먼저 — 납기 지연 위험을 점수로 감지해 경보를 보내고 독촉까지 실행합니다.', steps: [
      { t: '상시 감지', r: ['cagent', 'hana'], d: 'Cloud Foundry Agent가 HANA Cloud의 OTD 이력으로 리스크 점수를 계속 계산하다가 Delta Co. 75.2점(High)을 감지합니다.' },
      { t: '선제 경보', r: ['orch', 'user'], d: 'Joule이 사용자가 묻기 전에 "A-4315 결품 위험" 경보를 먼저 보냅니다.' },
      { t: 'S/4HANA 조회', r: ['integ', 's4', 's4data'], d: 'S/4HANA Cloud API로 납기 일정, 납기 확인(AB) 여부, 공급업체 정보를 조회합니다.' },
      { t: '점수 근거', r: ['aicore', 'hana'], d: 'AI Core의 추세 모델과 HANA Cloud의 이력으로 OTD 62% · 추세 악화 · D-1 · 미확인, 4요소 점수를 설명합니다.' },
      { t: '독촉 메일', r: ['cagent', 'integ'], d: '승인 후 Generative AI Hub가 독촉 메일 초안을 만들고, Delta Co.에 보내며 회신 기한을 겁니다.' },
      { t: 'Agent 연계', r: ['gateway', 'cagent', 's4exec'], d: '회신이 없으면 A2A로 MRP 예외 · 재고 이동 Agent에 넘겨 대체 조달을 진행합니다.' }] },
    agent6: { core: '24개월 소비 이력으로 다음 달 수요를 예측하고, 이미 들어올 물량을 빼서 꼭 필요한 만큼만 구매요청을 만듭니다.', steps: [
      { t: '요청', r: ['user', 'orch'], d: 'Joule(또는 Fiori)에서 "다음 달 수요 예측으로 발주가 필요한 자재를 추천해줘"라고 요청합니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule Agent가 고객 Subaccount의 Demand Forecast & Auto-PR Agent(Python/CAP)를 호출합니다.' },
      { t: 'S/4HANA 조회', r: ['integ', 'dest', 's4', 's4data'], d: 'Integration Suite·Destination/Connectivity를 거쳐 S/4HANA Cloud의 재고 · 24개월 소비 이력 · 미결 PO/STO를 조회해 집계합니다.' },
      { t: 'AI 예측', r: ['aicore'], d: '집계 데이터를 SAP AI Core의 SAP-RPT 1.6 Large 예측 배포에 넘겨 다음 달 수요를 예측합니다 (표 데이터 예측 모델).' },
      { t: '결과 저장 · 순부족', r: ['hana', 'cagent'], d: '예측 결과를 SAP HANA Cloud에 저장하고, Agent가 순부족 = 예측 − (현재고 + PO 95 + STO 40)으로 주문수량을 최적화합니다.' },
      { t: '구매요청 생성', r: ['user', 's4exec'], d: '사용자 검토 후 Purchase Requisition API로 구매요청 10008976(8개 품목 · 151.3M)을 만듭니다.' },
      { t: '최종 승인', r: ['s4proc', 'suite'], d: '최종 승인은 S/4HANA Flexible Workflow에서 처리합니다 (구매팀장 · My Inbox).' }] },
    agent7: { core: '외부에서 급히 사지 않고 다른 플랜트의 남는 재고를 찾아, 재고 이전 오더부터 출고·입고까지 실행합니다.', steps: [
      { t: '질문', r: ['user', 'orch'], d: '"플랜트 1050·1060·1070 중 이동 가능한 과잉 재고를 찾아줘"라고 묻습니다.' },
      { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 Stock Transfer Optimizer를 호출합니다 (A2A → Cloud Foundry Agent).' },
      { t: 'S/4HANA 조회', r: ['integ', 's4', 's4data'], d: 'S/4HANA Cloud API로 3개 플랜트 재고를 조회합니다. 1050은 40 EA 부족, 1060은 80 EA 여유입니다.' },
      { t: 'AI 매칭', r: ['aicore', 'hana'], d: 'SAP AI Core의 최적화 모델이 부족·여유를 짝짓고, HANA Cloud에 절감액(4.2M)과 추천 결과를 저장합니다.' },
      { t: '승인 후 실행', r: ['user', 's4exec'], d: '승인 → Purchase Order API로 구매오더(문서 유형 UB) 4500019567, 즉 재고 이전 오더를 만듭니다.' },
      { t: '물류 처리 · 확인', r: ['s4proc', 'suite'], d: 'S/4HANA에서 아웃바운드 납품 → 출고(641) → 입고(101)가 이어지고, 구매오더 관리·자재 문서 앱에서 확인합니다.' }] }
  };

  /* 다른 모듈은 이 스크립트보다 먼저 window.EXTRA_TOURS[agentId] = { core, steps } 를 등록한다 */
  Object.assign(T, window.EXTRA_TOURS || {});

  const st = { agent: null, i: 0, on: true, timer: null };
  const $ = id => document.getElementById(id);
  const ctr = r => [r.x + r.w / 2, r.y + r.h / 2];

  function svgEl() { return document.querySelector('#arch-modal-svg svg'); }

  function draw() {
    const svg = svgEl(); if (!svg) return;
    const old = svg.querySelector('#at-layer'); if (old) old.remove();
    const tour = T[st.agent]; if (!tour || !st.on) return;
    const step = tour.steps[st.i];
    const regs = step.r.map(k => RG[k]);
    const pad = r => (r.h <= 40 ? 2 : 4);
    const holes = regs.map(r => `<rect x="${r.x - pad(r)}" y="${r.y - pad(r)}" width="${r.w + 2 * pad(r)}" height="${r.h + 2 * pad(r)}" rx="10" fill="#000"/>`).join('');
    const outlines = regs.map(r => `<rect class="at-hl" x="${r.x - pad(r)}" y="${r.y - pad(r)}" width="${r.w + 2 * pad(r)}" height="${r.h + 2 * pad(r)}" rx="10"/>`).join('');
    const r0 = regs[0];
    const badge = `<g class="at-badge" transform="translate(${r0.x - 4}, ${r0.y - 4})"><circle r="15" fill="#5D36FF" stroke="#fff" stroke-width="3"/><text y="5" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="Segoe UI,sans-serif">${st.i + 1}</text></g>`;
    // 흐름: 이전 단계 → 현재 단계, 그리고 현재 단계 안의 영역끼리 연결
    const pts = [];
    if (st.i > 0) { const pv = tour.steps[st.i - 1].r; pts.push(ctr(RG[pv[pv.length - 1]])); }
    regs.forEach(r => pts.push(ctr(r)));
    let flow = '';
    if (pts.length > 1) {
      const d = pts.map((p, k) => {
        if (k === 0) return `M${p[0]},${p[1]}`;
        const q = pts[k - 1]; const mx = (q[0] + p[0]) / 2;
        return `C${mx},${q[1]} ${mx},${p[1]} ${p[0]},${p[1]}`;
      }).join(' ');
      flow = `<path id="at-path" class="at-flow" d="${d}"/>
        <circle r="7" fill="#5D36FF" stroke="#fff" stroke-width="2.5"><animateMotion dur="${1.2 + 0.5 * pts.length}s" repeatCount="indefinite" rotate="auto"><mpath href="#at-path"/></animateMotion></circle>
        <circle r="4" fill="#B57BF1"><animateMotion dur="${1.2 + 0.5 * pts.length}s" begin="0.35s" repeatCount="indefinite"><mpath href="#at-path"/></animateMotion></circle>`;
    }
    svg.insertAdjacentHTML('beforeend', `<g id="at-layer" pointer-events="none">
      <defs><mask id="at-mask"><rect x="0" y="0" width="1440" height="860" fill="#fff"/>${holes}</mask></defs>
      <rect x="0" y="0" width="1440" height="860" fill="rgba(15,23,42,.55)" mask="url(#at-mask)"/>
      ${outlines}${flow}${badge}</g>`);
  }

  function render() {
    const tour = T[st.agent]; const box = $('arch-tour'); if (!box) return;
    if (!tour) { box.innerHTML = ''; return; }
    const step = tour.steps[st.i];
    box.innerHTML = `
      <div class="at-head">
        <span class="at-core-lbl">핵심</span><span class="at-core">${tour.core}</span>
        <button class="at-mode" onclick="archTour.toggle()">${st.on ? '전체 다이어그램 보기' : '▶ 흐름 따라가기'}</button>
      </div>
      ${st.on ? `
      <div class="at-steps">${tour.steps.map((s, k) => `<button class="at-chip ${k === st.i ? 'on' : k < st.i ? 'done' : ''}" onclick="archTour.go(${k})"><b>${k + 1}</b>${s.t}</button>${k < tour.steps.length - 1 ? '<span class="at-arrow">›</span>' : ''}`).join('')}</div>
      <div class="at-card">
        <div class="at-card-txt"><div class="at-num">STEP ${st.i + 1} / ${tour.steps.length} · ${[...new Set(step.r.map(k => RG[k].label))].join(' · ')}</div>
          <div class="at-title">${step.t}</div><div class="at-desc">${step.d}</div></div>
        <div class="at-ctrls">
          <button class="at-btn" onclick="archTour.prev()" ${st.i === 0 ? 'disabled' : ''} title="이전 (←)">←</button>
          <button class="at-btn play" onclick="archTour.play()" title="자동 재생">${st.timer ? '❚❚ 일시정지' : '▶ 자동 재생'}</button>
          <button class="at-btn main" onclick="archTour.next()" ${st.i === tour.steps.length - 1 ? 'disabled' : ''} title="다음 (→)">다음 →</button>
        </div>
      </div>` : ''}`;
    draw();
  }

  function stop() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
  window.archTour = {
    start(agentId) { stop(); st.agent = agentId; st.i = 0; st.on = true; render(); },
    go(k) { stop(); st.i = k; render(); },
    next() { const n = T[st.agent].steps.length; if (st.i < n - 1) { st.i++; render(); } else stop(); },
    prev() { stop(); if (st.i > 0) { st.i--; render(); } },
    toggle() { stop(); st.on = !st.on; render(); },
    play() {
      if (st.timer) { stop(); render(); return; }
      if (st.i === T[st.agent].steps.length - 1) st.i = 0;
      st.on = true;
      st.timer = setInterval(() => { const n = T[st.agent].steps.length; if (st.i < n - 1) { st.i++; render(); } else { stop(); render(); } }, 4200);
      render();
    },
    stop
  };

  const origOpen = window.openArchModal;
  window.openArchModal = function (agentId) { origOpen(agentId); archTour.start(agentId); };
  const origClose = window.closeArchModal;
  window.closeArchModal = function () { stop(); if (origClose) origClose(); };
  document.addEventListener('keydown', e => {
    const m = document.getElementById('arch-modal');
    if (!m || !m.classList.contains('open') || !st.on) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); e.stopImmediatePropagation(); archTour.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopImmediatePropagation(); archTour.prev(); }
  }, true);
})();
