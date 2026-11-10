/* ═══════════════════════════════════════════════════════════════
   아키텍처 다이어그램 v5 — SAP Architecture Center 표준 배치
   ("A2A and MCP for AI Agent Interoperability at SAP" / "Building AI Agents with SAP Joule Studio on SAP BTP")
   SAP Business AI Platform ⊃ BTM · Joule Work · Tools · Managed Runtimes · Agent Gateway · Global Account → Subaccount
   + Application Clients · Autonomous Suite · SAP Cloud Identity Services · SAP S/4HANA Cloud
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const F = 'font-family="72, Segoe UI, Apple SD Gothic Neo, Noto Sans KR, sans-serif"';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const C = { bap: '#7C3AED', bapBg: '#FFFFFF', jw: '#7C3AED', jwBg: '#F3EEFF', btp: '#0070F2', btpBg: '#EAF4FF', suite: '#0070F2',
    a2a: '#D61FD6', mcp: '#0E8C8C', od: '#556B82', trust: '#2E7D32', cc: '#E76500', text: '#0F1B2D', t2: '#475569', onp: '#475569' };
  const R = (x, y, w, h, st, fill, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx || 8}" fill="${fill}" stroke="${st}" stroke-width="${o.sw || 1.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${o.a ? `text-anchor="${o.a}"` : ''} font-size="${o.fs || 11}" ${o.b ? `font-weight="${o.b === true ? 800 : o.b}"` : ''} ${o.i ? 'font-style="italic"' : ''} fill="${o.c || C.text}" ${o.tr ? `transform="${o.tr}"` : ''} ${F}>${esc(s)}</text>`;
  const sap = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0H44L22 20H0Z" fill="#0070F2"/><text x="4" y="14.5" font-size="11" font-weight="800" fill="#fff" ${F}>SAP</text></g>`;
  const pill = (x, y, w, h, t1, t2, st, fill, o = {}) => R(x, y, w, h, st, fill, { rx: o.rx || 7, dash: o.dash, sw: 1.3 }) +
    T(x + w / 2, y + (t2 ? h / 2 - 2 : h / 2 + 4), t1, { a: 'middle', b: 700, fs: o.fs || 10.6 }) + (t2 ? T(x + w / 2, y + h / 2 + 11, t2, { a: 'middle', fs: 9, i: true, c: C.t2 }) : '');
  const tag = (x, y, t, col) => { const w = Math.max(34, t.length * 6.3 + 14); return `<g>${R(x - w / 2, y - 8.5, w, 17, col, '#FFFFFF', { rx: 8.5, sw: 1.2 })}<text x="${x}" y="${y + 3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="${col}" ${F}>${esc(t)}</text></g>`; };
  const L = (d, col, o = {}) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${o.w || 1.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.m === false ? '' : `marker-end="url(#a5-${o.m || 'od'})"`} ${o.ms ? `marker-start="url(#a5-${o.m}-s)"` : ''}/>`;
  const MK = (id, col) => `<marker id="a5-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker><marker id="a5-${id}-s" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 z" fill="${col}"/></marker>`;
  const SUITE = [['Autonomous', 'Finance'], ['Autonomous', 'Spend Management'], ['Autonomous', 'SCM'], ['Autonomous', 'HCM'], ['Autonomous', 'CX'], ['Industry AI', '']];

  function build(c, hl) {
    const tiles = SUITE.map((s, i) => {
      const x = [252, 456, 660][i % 3], y = [700, 752][Math.floor(i / 3)], on = hl.includes(i);
      return R(x, y, 192, 44, C.suite, on ? '#DCEBFF' : '#FFFFFF', { sw: on ? 2.4 : 1.4 }) +
        T(x + 96, y + (s[1] ? 19 : 27), s[0], { a: 'middle', b: 800, fs: 11, c: '#0A2A66' }) + (s[1] ? T(x + 96, y + 34, s[1], { a: 'middle', b: 800, fs: 11, c: '#0A2A66' }) : '');
    }).join('');
    return `<svg viewBox="0 0 1440 860" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#FFFFFF;border-radius:10px;display:block;border:1px solid #E2E8F0;">
      <defs>${MK('od', C.od)}${MK('a2a', C.a2a)}${MK('mcp', C.mcp)}${MK('tr', C.trust)}${MK('cc', C.cc)}${MK('bap', C.bap)}</defs>
      ${T(20, 34, c.title + ' — A2A · MCP on SAP Business AI Platform', { b: true, fs: 17 })}
      ${T(20, 52, 'SAP Architecture Center 표준 배치 기준 · 업무 실행은 SAP S/4HANA Cloud', { fs: 10, c: C.t2 })}

      <!-- User & Application Clients -->
      <g transform="translate(110, 92)"><circle r="20" fill="#fff" stroke="${C.text}" stroke-width="2.6"/><circle cy="-5" r="6.5" fill="none" stroke="${C.text}" stroke-width="2.2"/><path d="M-12,13 C-12,4 12,4 12,13" fill="none" stroke="${C.text}" stroke-width="2.2" stroke-linecap="round"/></g>
      ${T(110, 128, 'User', { a: 'middle', b: true, fs: 11.5 })}
      ${L('M110,134 L110,148', C.od)}
      ${R(20, 150, 180, 100, C.od, '#F5F6F7', { sw: 1.8 })}
      <g transform="translate(92,160)"><rect x="0" y="0" width="26" height="18" rx="2" fill="none" stroke="${C.text}" stroke-width="2"/><rect x="22" y="6" width="10" height="16" rx="2" fill="#F5F6F7" stroke="${C.text}" stroke-width="2"/></g>
      ${T(110, 200, 'Mobile/Desktop/Web', { a: 'middle', fs: 10 })}${T(110, 217, 'Application Clients', { a: 'middle', b: true, fs: 13 })}
      ${T(110, 237, 'Joule · SAP Fiori', { a: 'middle', fs: 9.5, c: C.t2 })}

      <!-- ═══ SAP Business AI Platform ═══ -->
      ${R(232, 66, 870, 532, C.bap, C.bapBg, { rx: 14, sw: 2 })}
      ${sap(248, 80)}${T(302, 96, 'SAP Business AI Platform', { b: true, fs: 15, c: '#0A2A66' })}
      ${T(1092, 84, 'SAP-managed', { a: 'end', fs: 9.5, i: true, c: C.t2 })}

      <!-- Business Transformation Management -->
      ${R(250, 112, 470, 92, C.btp, C.btpBg, { rx: 10, sw: 1.6 })}${sap(262, 120, 0.8)}${T(306, 134, 'Business Transformation Management', { b: true, fs: 12.5, c: '#0A2A66' })}
      ${pill(262, 148, 144, 46, 'SAP Signavio', 'Agent Mining', C.text, '#fff')}
      ${pill(414, 148, 144, 46, 'SAP LeanIX', 'AI Governance', C.text, '#fff')}
      ${pill(566, 148, 144, 46, 'SAP Cloud ALM', 'AI Observability, Eval', C.text, '#fff')}

      <!-- Joule Work -->
      ${R(250, 222, 400, 176, C.jw, C.jwBg, { rx: 10, sw: 1.6 })}${sap(262, 230, 0.8)}${T(306, 244, 'Joule Work', { b: true, fs: 12.5, c: '#0A2A66' })}
      ${R(264, 256, 186, 130, C.jw, '#fff', { rx: 8, sw: 1.3 })}${T(357, 274, 'Joule Studio', { a: 'middle', b: true, fs: 11 })}
      ${pill(274, 282, 166, 40, 'Custom AI Agents', c.agent, C.jw, '#F3EEFF', { fs: 10.4 })}
      ${pill(274, 328, 166, 26, 'MCP Builder · Agent Extensions', '', C.jw, '#F3EEFF', { fs: 9.6 })}
      ${T(357, 374, 'Intent-based Development', { a: 'middle', fs: 9, i: true, c: C.t2 })}
      ${R(462, 256, 176, 76, C.jw, '#fff', { rx: 8, sw: 1.3 })}${T(550, 280, 'Joule Orchestrator', { a: 'middle', b: true, fs: 11 })}
      ${T(550, 297, 'Agent Harness', { a: 'middle', fs: 9.5, i: true, c: C.t2 })}${T(550, 314, '의도 파악 · 라우팅', { a: 'middle', fs: 9, c: C.t2 })}
      ${pill(470, 348, 72, 26, 'Skills', '', C.jw, '#fff')}
      ${L('M506,332 L506,346', C.od)}

      <!-- Tools (vertical) -->
      ${R(664, 222, 56, 176, C.jw, '#F3EEFF', { rx: 10, sw: 1.4 })}
      ${T(0, 0, 'Tools', { b: true, fs: 11.5, tr: 'translate(684,310) rotate(-90)', a: 'middle' })}
      ${T(0, 0, 'e.g., Data Products, Grounding, KG', { fs: 8.6, i: true, tr: 'translate(699,310) rotate(-90)', a: 'middle', c: C.t2 })}
      ${T(0, 0, c.tools, { fs: 8.6, tr: 'translate(712,310) rotate(-90)', a: 'middle', c: '#5B21B6' })}

      <!-- Managed Runtimes · Agent Gateway -->
      ${R(250, 418, 200, 58, C.jw, C.jwBg, { rx: 8, sw: 1.4 })}${T(350, 440, 'Managed Runtimes', { a: 'middle', b: true, fs: 11 })}${T(350, 456, 'Joule Agents, Custom Agents', { a: 'middle', fs: 9, i: true, c: C.t2 })}${T(350, 468, '& MCP Servers', { a: 'middle', fs: 9, i: true, c: C.t2 })}
      ${R(500, 418, 220, 58, C.jw, C.jwBg, { rx: 8, sw: 1.4 })}${T(610, 440, 'Agent Gateway', { a: 'middle', b: true, fs: 11 })}${T(610, 456, 'Discovery & Invocation of', { a: 'middle', fs: 9, i: true, c: C.t2 })}${T(610, 468, 'Agentic Resources', { a: 'middle', fs: 9, i: true, c: C.t2 })}

      <!-- ═══ Global Account (Customer-managed) → Subaccount — Business AI Platform 내부 ═══ -->
      ${R(744, 112, 344, 472, C.btp, C.btpBg, { rx: 12, sw: 1.8 })}${sap(756, 120, 0.8)}${T(800, 134, 'Global Account', { b: true, fs: 12.5, c: '#0A2A66' })}
      ${T(1078, 134, 'Customer-managed', { a: 'end', fs: 9.5, i: true, c: C.t2 })}
      ${R(758, 150, 316, 420, C.od, '#FFFFFF', { rx: 10, sw: 1.4 })}${T(772, 170, 'Subaccount', { b: true, fs: 12 })}
      ${R(772, 180, 288, 96, C.btp, '#F5FAFF', { rx: 8, sw: 1.5 })}${T(916, 198, 'Custom AI Agent', { a: 'middle', b: true, fs: 12 })}
      ${pill(786, 206, 260, 26, 'SAP Cloud SDK for AI & Generative AI Hub', '', C.btp, '#fff', { dash: '2 2', fs: 9.6 })}
      ${T(916, 250, c.agent, { a: 'middle', b: true, fs: 10.6, c: '#003D99' })}${T(916, 266, 'Python/CAP · Cloud Foundry Runtime', { a: 'middle', fs: 9, i: true, c: C.t2 })}
      ${R(772, 288, 288, 56, '#7C3AED', '#FAF5FF', { rx: 8, sw: 1.4 })}${T(786, 306, 'SAP AI Core', { b: true, fs: 11.5 })}${T(786, 322, c.aicore[0], { fs: 9.6, b: 700 })}${T(786, 336, c.aicore[1], { fs: 9, c: C.t2 })}
      ${R(772, 354, 288, 50, '#0D9488', '#F0FDFA', { rx: 8, sw: 1.4 })}${T(786, 372, 'SAP HANA Cloud', { b: true, fs: 11.5 })}${T(786, 390, c.hana[0] + ' · ' + c.hana[1], { fs: 9, c: C.t2 })}
      ${R(772, 414, 288, 96, C.btp, '#F5FAFF', { rx: 8, sw: 1.5 })}${T(786, 432, 'SAP Integration Suite', { b: true, fs: 11.5 })}
      ${pill(786, 440, 260, 28, 'MCP Gateway', c.integ[1], C.btp, '#fff', { fs: 10.4 })}
      ${pill(786, 474, 260, 28, 'A2A Connectivity', '', C.btp, '#fff')}
      ${R(772, 518, 288, 42, C.btp, '#F5FAFF', { rx: 8, sw: 1.4 })}${T(786, 536, 'Destination & Connectivity', { b: true, fs: 11 })}${T(786, 551, 'S/4HANA Cloud 통신 약정 · OAuth', { fs: 9, c: C.t2 })}

      <!-- ═══ Autonomous Suite ═══ -->
      ${R(232, 640, 640, 196, C.suite, '#EAF4FF', { rx: 14, sw: 1.8 })}${sap(248, 652)}${T(302, 668, 'Autonomous Suite', { b: true, fs: 15, c: '#0A2A66' })}
      ${T(302, 686, 'Assistants, Agents, Data, Apps', { fs: 11, i: true, c: '#0A2A66' })}
      ${tiles}
      ${T(252, 820, '이 시나리오의 업무 실행: SAP S/4HANA — ' + c.scope, { fs: 9.6, b: 700, c: '#003D99' })}

      <!-- SAP Cloud Identity Services -->
      <circle cx="960" cy="702" r="24" fill="#fff" stroke="${C.btp}" stroke-width="1.6"/>
      <g transform="translate(948,690)"><circle cx="9" cy="7" r="6" fill="none" stroke="${C.btp}" stroke-width="2"/><path d="M0,22 C0,14 18,14 18,22" fill="none" stroke="${C.btp}" stroke-width="2"/></g>
      ${T(960, 744, 'SAP Cloud', { a: 'middle', b: true, fs: 11 })}${T(960, 758, 'Identity Services', { a: 'middle', b: true, fs: 11 })}

      <!-- ═══ SAP S/4HANA Cloud ═══ -->
      ${R(1150, 112, 272, 512, C.onp, '#FFFFFF', { rx: 14, sw: 1.8 })}${sap(1166, 124)}${T(1218, 139, 'SAP S/4HANA Cloud', { b: true, fs: 14, c: '#0A2A66' })}
      ${T(1172, 184, '업무 데이터 · 표준 CDS View', { fs: 9.6, b: 800, c: '#0057D2' })}
      ${c.data.map((d, k) => pill(1172, 190 + k * 34, 228, 30, d[0], d[1], C.onp, '#F8FAFC', { fs: 10 })).join('')}
      ${T(1172, 310, '업무 실행 · 표준 API', { fs: 9.6, b: 800, c: '#0057D2' })}
      ${pill(1172, 316, 228, 30, c.exec[0][0], c.exec[0][1], '#0057D2', '#EAF2FF', { fs: 10 })}${pill(1172, 350, 228, 30, c.exec[1][0], c.exec[1][1], C.onp, '#F8FAFC', { fs: 10 })}
      ${T(1172, 402, '업무 프로세스 · 승인', { fs: 9.6, b: 800, c: '#0057D2' })}
      ${c.proc.map((d, k) => pill(1172, 408 + k * 34, 228, 30, d[0], d[1] || '', k === 0 ? '#0057D2' : C.onp, k === 0 ? '#EAF2FF' : '#F8FAFC', { fs: 10 })).join('')}
      ${T(1172, 528, 'SAP Fiori 앱', { fs: 9.6, b: 800, c: '#0057D2' })}
      ${pill(1172, 534, 228, 30, c.fiori[0][0] + ' · ' + c.fiori[1][0], '', C.onp, '#F8FAFC', { fs: 10 })}
      ${pill(1172, 568, 228, 30, 'Embedded AI in SAP S/4HANA', '', C.onp, '#F8FAFC', { fs: 10 })}

      <!-- ═══ 연결선 ═══ -->
      ${L('M200,196 C224,196 224,300 248,300', C.od)}
      ${L('M60,250 L60,760 L230,760', C.od)}
      ${L('M150,250 L150,616 L960,616 L960,676', C.trust, { m: 'tr' })}${tag(420, 616, 'Authenticate', C.trust)}
      ${L('M485,204 L485,220', C.od)}
      ${L('M720,128 C732,128 732,128 742,128', C.od)}${tag(731, 104, 'Discover & Govern', C.od)}
      ${L('M357,386 L357,416', C.od, { dash: '3 3' })}${T(366, 406, 'deploy', { fs: 8.5, c: C.t2 })}
      ${L('M600,332 L600,416', C.a2a, { m: 'a2a', dash: '4 3' })}${tag(600, 360, 'A2A', C.a2a)}
      ${L('M452,436 L498,436', C.a2a, { m: 'a2a', ms: true })}${tag(475, 436, 'A2A', C.a2a)}
      ${L('M498,460 L452,460', C.mcp, { m: 'mcp' })}${tag(475, 460, 'MCP', C.mcp)}
      ${L('M692,418 L692,400', C.od)}
      ${L('M720,430 C738,430 738,228 770,228', C.a2a, { m: 'a2a', dash: '4 3' })}${tag(738, 300, 'A2A', C.a2a)}
      ${L('M720,464 C742,464 742,454 784,454', C.mcp, { m: 'mcp', dash: '4 3' })}${tag(742, 486, 'MCP', C.mcp)}
      ${L('M916,276 L916,286', '#7C3AED', { m: 'bap' })}${tag(1000, 281, 'REST/API', '#7C3AED')}
      ${L('M1060,236 L1067,236 L1067,379 L1062,379', '#0D9488', { m: 'mcp' })}${tag(1067, 316, 'SQL', '#0D9488')}
      ${L('M772,244 L765,244 L765,454 L784,454', C.mcp, { m: 'mcp' })}${tag(765, 400, 'MCP', C.mcp)}
      ${L('M916,510 L916,516', C.btp, { m: 'od' })}
      ${L('M1060,539 C1104,539 1104,330 1148,330', C.od, { w: 2 })}${tag(1106, 440, 'OData/REST', C.od)}
      ${L('M350,476 L350,638', C.od)}${T(258, 560, 'provision Assistants,', { fs: 8.5, c: C.t2 })}${T(258, 572, 'Agents & MCP Servers', { fs: 8.5, c: C.t2 })}
      ${L('M830,570 L830,638', C.od)}${tag(830, 590, 'ODATA / REST', C.od)}
      ${L('M560,598 L560,616', C.trust, { m: false })}${tag(560, 600, 'Trust', C.trust)}
      ${L('M1000,584 L1000,616 L976,676', C.trust, { m: 'tr' })}${tag(1010, 600, 'Trust', C.trust)}
      ${L('M872,702 L934,702', C.trust, { m: 'tr' })}${tag(903, 702, 'Trust', C.trust)}
      ${L('M872,790 L1100,790 C1150,790 1150,640 1200,626', C.onp, { m: 'od', dash: '5 4' })}${tag(1000, 790, 'realized by · SAP S/4HANA', C.onp)}

      ${T(20, 852, c.doc + ' · 범례: 분홍 = A2A · 청록 = MCP · 회색 = ODATA/REST · 초록 = Trust/Authenticate', { fs: 9, c: '#94A3B8' })}
    </svg>`;
  }

  const HL = { agent1: [1, 2], agent2: [1, 2], agent3: [2], agent4: [0, 1], agent5: [1], agent6: [1, 2], agent7: [2] };
  const MI = ['My Inbox', '승인 작업함'];
  const EA = ['Embedded AI in SAP S/4HANA', '애플리케이션 내장 AI'];
  const NC = {
    agent1: { title: '01. Inventory Aging Agent', role: '자재/재고 관리자', scope: 'Inventory Management · Sourcing and Procurement', agent: 'Inventory Aging Agent', tools: '재고 조회 · Aging · PO Block',
      data: [['I_StockQuantityCurrentValue_2', '재고 수량 · 금액'], ['I_MaterialDocumentItem_2', '마지막 이동일 · 출고 이력'], ['I_PurchaseOrderItemAPI01', '미입고 PO']],
      exec: [['Purchase Order API', 'PO 항목 Block'], ['Purchase Requisition API', 'PR 보류'], ['Business Events', '재고 이동 이벤트']],
      proc: [['PO Block 처리', ''], ['승인 필요 건 검토', ''], MI], fiori: [['구매오더 관리', 'SAP Fiori 앱'], ['재고 - 단일 자재', 'SAP Fiori 앱'], EA],
      cf: ['Inventory Aging Agent Logic', 'Aging 계산 · 위험도 · 대상 선정'], aicore: ['LLM 배포', '조치 설명 생성'], genai: ['Orchestration · Prompt', '알림 문구 생성'], genaiCore: true,
      hana: ['HANA PAL 예측 · 결과', '소요 감소 · 전환 시점'], integ: ['ERP API · 메일', '재고 조회 · Block 요청 · 알림'],
      kpi: [['전환 예상 금액 112.5M', '결과 지표'], ['Block 대상 미입고 PO 15건', '결과 지표'], ['월 1회 Aging 배치', '가정']], doc: 'MM-AI-ARCH-01' },
    agent2: { title: '02. BOM Discontinuation Agent', role: '구매/개발 담당자', scope: 'Product Structure · Sourcing and Procurement', agent: 'BOM Discontinuation Agent', tools: 'BOM 탐색 · PO 조회 · 메일',
      data: [['I_BillOfMaterialItemTP_2', 'BOM 구조'], ['I_MaterialStock_2', '전용 부품 재고'], ['I_PurOrdScheduleLineAPI01', '미입고 PO 일정']],
      exec: [['Purchase Order API', 'PO 취소 · 수량 조정'], ['Business Partner API', '공급업체 연락처'], ['Business Events', 'BOM 변경 이벤트']],
      proc: [['PO 취소 · 수량 조정', ''], ['구매 담당자 검토', ''], MI], fiori: [['자재 BOM 표시', 'SAP Fiori 앱'], ['구매오더 관리', 'SAP Fiori 앱'], EA],
      cf: ['BOM Discontinuation Agent Logic', 'SPARQL 생성 · 유니크 부품 판정'], aicore: ['LLM 배포', '공급업체 메일 초안'], genai: ['Orchestration · Prompt', '공급업체별 메일 작성'], genaiCore: true,
      hana: ['HANA Cloud Knowledge Graph', 'BOM 그래프 · SPARQL 탐색'], integ: ['ERP API · 메일', '재고 · PO 조회 · 통보'],
      kpi: [['BC3 전용 부품 28개', '결과 지표'], ['공급업체 9곳 통보', '결과 지표'], ['단산 시점 12월', '가정']], doc: 'MM-AI-ARCH-02' },
    agent3: { title: '03. MRP Exception Triage Agent', role: '생산계획 / MRP 컨트롤러', scope: 'Production Planning · Sourcing and Procurement', agent: 'MRP Exception Triage Agent', tools: '예외 조회 · 옵션 비교 · 납기 변경',
      data: [['I_MRPController', 'MRP 예외 메시지'], ['I_ManufacturingOrder', '제조오더'], ['I_PurOrdScheduleLineAPI01', 'PO 납기 일정']],
      exec: [['Purchase Order API', '납기 변경'], ['PO Confirmation', '확약(AB) 수신'], ['Business Events', 'MRP 실행 이벤트']],
      proc: [['PO 납기 변경', ''], ['공급업체 확약 관리', ''], MI], fiori: [['구매오더 관리', 'SAP Fiori 앱'], ['자재 MRP 모니터링', 'SAP Fiori 앱'], EA],
      cf: ['MRP Exception Triage Agent Logic', '예외 분류 · 대응 옵션 비교'], aicore: ['분류 모델 배포', '예외 우선순위 판정'], genai: ['Orchestration · Prompt', '조치 옵션 설명'],
      hana: ['리드타임 · OTD 이력', '분류 결과 저장 · 조회'], integ: ['ERP API', 'MRP 예외 · PO 일정 조회/변경'],
      kpi: [['주간 예외 234건 → 긴급 12건', '결과 지표'], ['ACME OTD 88%', '이력 기반'], ['납기 3일 단축 요청', '결과']], doc: 'MM-AI-ARCH-03' },
    agent4: { title: '04. 3-Way Matching Agent', role: '구매정산 / AP 회계 담당자', scope: 'Sourcing and Procurement · Finance (AP)', agent: '3-Way Matching Agent', tools: '대사 · 원인 분류 · 보류 해제',
      data: [['I_PurchaseOrderItemAPI01', 'PO 수량 · 단가'], ['I_MaterialDocumentItem_2', '입고 수량'], ['I_SupplierInvoiceAPI01', '송장 · 지급보류']],
      exec: [['Supplier Invoice API', '보류 해제 · 전기'], ['Purchase Order API', '미입고분 단가 갱신'], ['I_PurchaseContractAPI01', '계약 갱신가 조회']],
      proc: [['송장 지급보류 해제', ''], ['송장 전기 (분개 유형 RE)', ''], MI], fiori: [['분개 관리', 'SAP Fiori 앱'], ['공급업체 송장 관리', 'SAP Fiori 앱'], EA],
      cf: ['3-Way Matching Agent Logic', '대사 · 근본 원인 확장'], aicore: ['분류 모델 배포', '불일치 원인 분류'], genai: ['Orchestration · Prompt', '원인 설명 요약'],
      hana: ['대사 결과 · 예외 이력', '저장 · 조회'], integ: ['ERP API', 'PO · 입고 · 송장 · 계약 조회'],
      kpi: [['월 송장 847건 · 불일치 23건', '결과 지표'], ['INV-2946 차이 1.4M', '결과'], ['다음 달 보류 예방 4.2M', 'KPI']], doc: 'MM-AI-ARCH-04' },
    agent5: { title: '05. Supplier Delivery Risk Agent', role: '구매/조달 리스크 관리자', scope: 'Sourcing and Procurement · Supplier Management', agent: 'Supplier Delivery Risk Agent', tools: '리스크 점수 · 경보 · 독촉',
      data: [['I_PurOrdScheduleLineAPI01', '납기 예정일'], ['I_PurchaseOrderAPI01', '납기 확인(AB)'], ['I_Supplier', '공급업체 마스터']],
      exec: [['Purchase Order API', '대체 조달 연계'], ['Business Events', '납기 변경 · 입고'], ['Business Partner API', '담당자 연락처']],
      proc: [['납기 확인 관리', ''], ['대체 조달 검토', ''], MI], fiori: [['구매오더 관리', 'SAP Fiori 앱'], ['공급업체 평가', 'SAP Fiori 앱'], EA],
      cf: ['Supplier Delivery Risk Agent Logic', '4요소 점수 상시 계산'], aicore: ['추세 모델 배포', '지연 기울기 판정'], genai: ['Orchestration · Prompt', '독촉 메일 초안'], genaiCore: true,
      hana: ['OTD 이력 · 리스크 점수', '시계열 저장 · 조회'], integ: ['ERP API · 메일', '납기 조회 · 독촉 발송'],
      kpi: [['Delta Co. 위험 75.2점', 'High 기준 ≥ 70'], ['모니터링 공급업체 47곳', '범위'], ['OTD 6개월 기준', '가정']], doc: 'MM-AI-ARCH-05' },
    agent6: { title: '06. Demand Forecast & Auto-PR Agent', role: '수요계획 / 자재 발주 담당자', scope: 'Sourcing and Procurement / Inventory Management', agent: 'Demand Forecast & Auto-PR Agent', tools: '재고·소비 조회 · 예측 · PR',
      data: [['I_MaterialDocumentItem_2', '소비 이력'], ['I_MaterialStock_2', '현재고'], ['I_PurchaseOrderItemAPI01', '미결 PO / STO']],
      exec: [['Purchase Requisition API', '구매요청 생성'], ['I_ProductPlant', '안전재고 · 최소 발주량'], ['Business Events', '재고 변동 이벤트']],
      proc: [['Create Purchase Requisition', ''], ['Flexible Workflow 승인', ''], MI], fiori: [['구매요청 관리', 'SAP Fiori 앱'], ['My Inbox', 'SAP Fiori 앱'], EA],
      cf: ['Demand Forecast & Auto-PR Agent Logic', '집계 · 순부족 · 수량 최적화'], aicore: ['Predictive Model Deployment', 'SAP-RPT 1.6 Large (표 데이터 예측)'], genai: ['Orchestration · Prompt', '예측 근거 설명'],
      hana: ['예측 결과 · 부족 수량', '저장 · 조회'], integ: ['ERP API', '재고 · 소비 · 미결 PO/STO 조회'],
      kpi: [['평균 예측 신뢰도 85%', 'KPI'], ['자재 200개 · 24개월 이력', '가정'], ['구매요청 10008976 · 132.5M', '결과']], doc: 'MM-AI-ARCH-06' },
    agent7: { title: '07. Stock Transfer Optimization Agent', role: '물류 / 멀티플랜트 재고 관리자', scope: 'Inventory Management · Logistics', agent: 'Stock Transfer Optimizer', tools: '재고 조회 · 매칭 · STO 생성',
      data: [['I_MaterialStock_2', '플랜트별 재고'], ['I_Plant', '플랜트'], ['I_StorageLocation', '저장위치']],
      exec: [['Purchase Order API (UB)', '재고 이전 오더 생성'], ['Outbound Delivery API', '납품 · 출고 641'], ['Material Document API', '입고 101']],
      proc: [['재고 이전 오더 (UB)', ''], ['출고 641 → 입고 101', ''], MI], fiori: [['구매오더 관리', 'SAP Fiori 앱'], ['자재 문서', 'SAP Fiori 앱'], EA],
      cf: ['Stock Transfer Optimizer Logic', '과잉/부족 매칭 · 비용 비교'], aicore: ['최적화 모델 배포', '이전 경로 · 수량'], genai: ['Orchestration · Prompt', '추천 사유 설명'],
      hana: ['추천 결과 · 절감액', '저장 · 조회'], integ: ['ERP API', '재고 조회 · 구매오더(UB) 생성'],
      kpi: [['A-4315 이전 절감 4.2M', 'KPI'], ['추천 5건 합계 12.3M', '결과'], ['1050 부족 40 · 1060 여유 80', '결과']], doc: 'MM-AI-ARCH-07' }
  };
  window.AGENT_ARCH = window.AGENT_ARCH || {};
  Object.keys(NC).forEach(k => { window.AGENT_ARCH[k] = build(NC[k], HL[k] || []); });
  /* 다른 모듈(PP·QM …)은 이 스크립트보다 먼저 window.EXTRA_ARCH[agentId] = { cfg, hl } 를 등록한다. cfg 형식은 위 NC 와 같다. */
  Object.entries(window.EXTRA_ARCH || {}).forEach(([k, v]) => { window.AGENT_ARCH[k] = build(v.cfg, v.hl || []); });
  window.ARCH_V5 = true;
})();
