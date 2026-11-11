'use strict';
/* MM 모듈 콘텐츠 — 시나리오 7개, 아키텍처 메타, 결과 대시보드. 엔진은 js/core.js */

/* ═══════════════════════════════════════════
   AGENT 1 — 장기/악성 재고 관리
═══════════════════════════════════════════ */
demoPlayers['agent1'] = new DemoPlayer({
  id: 'agent1',
  flow: [
    {icon:'📧', label:'월간 배치 실행'},
    {icon:'🔍', label:'Aging 전환 감지'},
    {icon:'💬', label:'Joule 대화 조회'},
    {icon:'📋', label:'조치방안 수립'},
    {icon:'✅', label:'PO Block 실행'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work Desktop', type:'user'},
    {arrow:true, label:'NL Query'},
    {icon:'🔌', name:'ERP MCP Client', sub:'Joule Work 내장', type:'mcp'},
    {arrow:true, label:'MCP Protocol'},
    {icon:'⚙️', name:'ERP MCP Server', sub:'BTP Cloud Foundry', type:'mcp'},
    {arrow:true, label:'OData API'},
    {icon:'🏢', name:'S/4HANA', sub:'Cloud ERP', type:'erp'},
    {arrow:true, label:'CDS View'},
    {icon:'🗄️', name:'표준 재고 CDS + PAL', sub:'Aging Data + ML', type:'db'},
    {arrow:true, label:'예측결과'},
    {icon:'☁️', name:'HANA Cloud', sub:'예측결과 저장', type:'db'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'OData API', cls:'orange'},
    {label:'HANA PAL', cls:'green'},
    {label:'CDS View (I_MaterialStock_2)', cls:'orange'},
    {label:'SAP AI Core', cls:'purple'}
  ],
  steps: [
    // Step 0 — SYSTEM welcome
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;장기/악성 재고 관리 Agent가 S/4HANA에 연결되었습니다.<br>플랜트 1050, 1060, 1070 · 표준 재고 CDS(I_StockQuantityCurrentValue_2) Aging 데이터 · HANA PAL 예측 모델 준비 완료');
      p.addPresets([
        {label:'📦 장기재고 전환 예상 품목 보기', highlight:true},
        {label:'📊 플랜트별 재고 현황'},
        {label:'📈 특정 품번 소요량 추이'}
      ]);
    },
    // Step 1 — user query
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', '플랜트 1050의 장기/악성 재고 전환 예상 품목을 위험도 순으로 상위 10개 보여줘');
      setTimeout(() => {
        const t = p.addThinking(["플랜트 1050 보유 재고의 최종 입출고일 기준 체류 기간을 계산하고 있어요", "다음 달 장기재고 전환 기준일에 도달하는 품목을 추려내는 중", "향후 소요 계획이 없는 품목에 위험 가중치를 부여하고 있어요", "자재 마스터의 단종 지시자·후속 자재와 BOM 유효 종료일을 확인하는 중", "전환 위험과 재고금액으로 정렬해 상위 10개를 선정합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `플랜트 1050의 Aging 데이터를 분석했습니다. 다음 달(${demoMon(1,'kr')}) 장기재고 전환 예상 <strong>상위 10개 품목</strong> (전환 위험 순)입니다:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>순위</th><th>품번</th><th>품명</th><th>재고량</th><th>전환예상일</th><th>재고금액</th><th>원인 (AI)</th></tr></thead>
              <tbody>
                <tr><td>1</td><td><strong>K-7720</strong></td><td>구형 와이어링 하네스</td><td>200 EA</td><td>${demoMD(1,5,'iso')}</td><td><strong>8.4M</strong></td><td><span class="badge badge-danger">후속 자재 지정</span></td></tr>
                <tr><td>2</td><td>432B</td><td>BC3 전용 센서</td><td>240 EA</td><td>${demoMD(1,8,'iso')}</td><td><strong>26.4M</strong></td><td><span class="badge badge-danger">BOM 종료 예정</span></td></tr>
                <tr><td>3</td><td>431A</td><td>특수 가스켓</td><td>150 EA</td><td>${demoMD(1,12,'iso')}</td><td><strong>18.0M</strong></td><td><span class="badge badge-danger">BOM 종료 예정</span></td></tr>
                <tr><td>4</td><td>431C</td><td>전용 브래킷</td><td>80 EA</td><td>${demoMD(1,15,'iso')}</td><td><strong>12.8M</strong></td><td><span class="badge badge-danger">BOM 종료 예정</span></td></tr>
                <tr><td>5</td><td>435D</td><td>전용 마운팅 킷</td><td>60 EA</td><td>${demoMD(1,20,'iso')}</td><td><strong>9.6M</strong></td><td><span class="badge badge-warning">BOM 종료 예정</span></td></tr>
                <tr><td colspan="7" style="text-align:center;color:var(--sap-text-muted);font-size:12px">... 외 5개 품목 (총 재고금액 112.5M원)</td></tr>
              </tbody>
            </table>
          </div>
          1위 K-7720은 자재 마스터에 후속 자재 K-7721과 단종 유효일(${demoMD(1,5,'kr')})이 지정되어 있고, 최근 3개월 소요가 70% 줄었습니다.<br>
          2~5위는 BC3 완제품 BOM에서만 쓰이는 부품인데 BOM 유효 종료일이 ${demoMD(2,0,'kr')}이라, BC3 단산 예정으로 보입니다.`);
          p.addResultCard(`
            <h4>📊 요약 현황</h4>
            <div class="kpi-row">
              <div class="kpi-card danger"><div class="kpi-value">10</div><div class="kpi-label">전환 예상 품목</div></div>
              <div class="kpi-card warning"><div class="kpi-value">112.5M</div><div class="kpi-label">총 재고금액(원)</div></div>
              <div class="kpi-card"><div class="kpi-value">D-27</div><div class="kpi-label">평균 전환까지</div></div>
            </div>`);
          p.addPresets([
            {label:'📊 432B 소요량 추이 보기'},
            {label:'🔗 대체 생산오더 확인'},
            {label:'🚫 PO Block 실행', highlight:true}
          ]);
        }, 3100);
      }, 400);
    },
    // Step 2 — consumption trend
    (p) => {
      p._setFlowActive(2);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', '432B 품번의 최근 6개월 소요량 추이를 보여줘');
      setTimeout(() => {
        p.addThinking(["432B의 최근 6개월 출고 이력을 월별로 집계하고 있어요", "생산 투입 출고와 기타 출고를 구분하는 중", "월별 증감 추세와 감소 원인을 해석합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `432B (BC3 전용 센서) 월별 소요량 추이:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>월</th><th>소요량(EA)</th><th>전월대비</th><th>재고잔량</th></tr></thead>
              <tbody>
                <tr><td>${demoMon(-5,'ym')}</td><td>38</td><td>—</td><td>320 EA</td></tr>
                <tr><td>${demoMon(-4,'ym')}</td><td>30</td><td><span class="text-danger">▼ -21%</span></td><td>290 EA</td></tr>
                <tr><td>${demoMon(-3,'ym')}</td><td>22</td><td><span class="text-danger">▼ -27%</span></td><td>268 EA</td></tr>
                <tr><td>${demoMon(-2,'ym')}</td><td>14</td><td><span class="text-danger">▼ -36%</span></td><td>254 EA</td></tr>
                <tr><td>${demoMon(-1,'ym')}</td><td>9</td><td><span class="text-danger">▼ -36%</span></td><td>245 EA</td></tr>
                <tr><td>${demoMon(0,'ym')}</td><td>5</td><td><span class="text-danger">▼ -44%</span></td><td>240 EA</td></tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top:10px;padding:10px 12px;background:var(--sap-danger-bg);border-radius:8px;font-size:13px;border:1px solid var(--sap-danger)">
          ⚠️ <strong>AI 분석:</strong> BC3 단산 일정에 따라 소요량이 6개월간 지속 감소 (-87%). 단산 후 소요 0 — ${demoMD(1,8,'kr')} 장기재고 전환 확정 예상.</div>`);
          p.addPresets([
            {label:'🚫 PO Block 실행', highlight:true},
            {label:'🔗 대체 생산오더 확인'}
          ]);
        }, 2550);
      }, 400);
    },
    // Step 3 — PO block
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', '플랜트 1050 장기/악성 재고 전환 예상 품목 전체에 대해 진행 중인 PO를 모두 Block 해줘');
      setTimeout(() => {
        p.addThinking(["장기/악성 전환 예상 품목과 연결된 미입고 PO를 찾고 있어요", "입고가 이미 시작된 PO는 Block 대상에서 제외하는 중", "남은 PO에 Block을 설정하고 처리 결과를 확인합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(4);
          p.addMsg('ai', `처리가 완료되었습니다:
          <div class="chat-table-wrap" style="margin-top:10px">
            <table class="chat-table">
              <thead><tr><th>처리결과</th><th>건수</th><th>금액</th></tr></thead>
              <tbody>
                <tr><td><span class="badge badge-success">✅ Block 완료</span></td><td><strong>15건</strong></td><td>42.3M원</td></tr>
                <tr><td><span class="badge badge-warning">📝 PR 보류</span></td><td>2건</td><td>— (PO 미전환 PR)</td></tr>
                <tr><td><span class="badge badge-warning">⏳ 승인 필요</span></td><td>1건</td><td>8.1M원</td></tr>
              </tbody>
            </table>
          </div>
          · BC3 부품 PO는 단산 안내 메일(단산 관리 Agent)을 받은 공급업체 9개사 건입니다.<br>
          · 이미 생산에 들어간 2건은 공급업체 취소 수수료 <strong>약 1.2M원</strong>이 예상됩니다 → <strong>순 회피 41.1M원</strong>
          ${jConfirm('agent1', 'PR 보류 2건 및 승인 필요 1건에 대해 담당자(김재형 팀장)에게 알림을 발송하시겠습니까?')}`);
          p.addResultCard(`
            <h4>🚫 PO Block 처리 결과</h4>
            <div class="kpi-row">
              <div class="kpi-card success"><div class="kpi-value">15</div><div class="kpi-label">Block 완료</div></div>
              <div class="kpi-card danger"><div class="kpi-value">2</div><div class="kpi-label">PR 보류</div></div>
              <div class="kpi-card warning"><div class="kpi-value">1</div><div class="kpi-label">승인 필요</div></div>
            </div>
            <div class="action-btn-group" style="margin-top:14px">
              <button class="action-btn action-btn-primary" onclick="demoPlayers['agent1'].next()">✉ 담당자 알림 발송</button>
              <button class="action-btn action-btn-ghost">나중에</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 알림 발송');
        }, 2550);
      }, 400);
    },
    // Step 4 — send notification
    (p) => {
      touchGuide.hideAll();
      p.presets().innerHTML = '';
      p.addMsg('user', '담당자에게 알림 발송해줘');
      setTimeout(() => {
        p.addMsg('ai', `<span class="text-success">✅ 알림 발송 완료</span><br>
        수신자: 김재형 팀장 (jaehyung.kim@bestrun.com)<br>
        내용: 플랜트 1050 장기재고 PR 보류 2건 / 승인 필요 1건 안내<br>
        발송일시: ${new Date().toLocaleString('ko-KR')}`);
      }, 600);
    },
    // Step 5 — complete
    (p) => {
      p._setFlowActive(5);
      const result = p.result();
      const banner = document.createElement('div');
      banner.className = 'completion-banner';
      banner.innerHTML = `
        <span class="banner-icon">🎉</span>
        <div>
          <h3>시나리오 완료</h3>
          <p>장기/악성 재고 전환 예측 → Joule 대화 조회 → PO Block 조치 → 담당자 알림까지 전 과정 완료</p>
        </div>`;
      result.appendChild(banner);
      p.addMsg('sys', '✅ &nbsp;<strong>장기/악성 재고 관리</strong> 시나리오가 완료되었습니다. 불용재고 리스크 최소화 및 재고 운영 최적화 달성.');
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 2 — 단산 관리
═══════════════════════════════════════════ */
demoPlayers['agent2'] = new DemoPlayer({
  id: 'agent2',
  flow: [
    {icon:'📧', label:'단산 통보 수신'},
    {icon:'🔍', label:'유니크 부품 식별'},
    {icon:'📦', label:'재고 영향 분석'},
    {icon:'📋', label:'PO 취소 추천'},
    {icon:'✉️', label:'공급업체 통보'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work Desktop', type:'user'},
    {arrow:true, label:'자연어 질의'},
    {icon:'🔌', name:'BOM KG MCP', sub:'Knowledge Graph 클라이언트', type:'mcp'},
    {arrow:true, label:'SPARQL'},
    {icon:'🕸️', name:'BOM KG Server', sub:'HANA Cloud KG', type:'ai'},
    {arrow:true, label:'그래프 탐색'},
    {icon:'📊', name:'BOM Knowledge Graph', sub:'차종-부품 관계 데이터', type:'db'},
    {arrow:true},
    {icon:'🏢', name:'S/4HANA', sub:'APBOM + ERP 마스터', type:'erp'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'BOM KG MCP Server', cls:'teal'},
    {label:'Knowledge Graph', cls:'purple'},
    {label:'SPARQL Query', cls:'purple'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'Email Gateway', cls:'green'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;단산 관리 Agent가 HANA Cloud BOM Knowledge Graph에 연결되었습니다.<br>AP-BOM 차종-부품 매핑 데이터 · S/4HANA OData API · 이메일 게이트웨이 준비 완료');
      p.addPresets([
        {label:'🔩 단산 차종 유니크 부품 조회', highlight:true},
        {label:'📦 특정 부품 재고 영향 분석'},
        {label:'✉ 공급업체 알림 발송'}
      ]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', `BC3 차종이 ${demoMon(1,'ykr')} 말에 단산 예정이야. 영향받는 유니크 부품 리스트 알려줘.`);
      setTimeout(() => {
        p.addThinking(["BC3 차종의 완제품부터 하위 부품까지 BOM을 역전개하고 있어요", "각 부품이 다른 차종에도 쓰이는지 교차 확인하는 중", "BC3에만 쓰이는 유니크 부품만 남기고 있어요", "현재고와 영향 금액을 붙여 리스트로 정리합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `BC3 차종 BOM을 역전개하여 유니크 부품을 식별했습니다.<br><strong>총 28개 유니크 부품</strong> 확인 (다른 차종에서 사용하지 않는 전용 부품):
          ${kgSvg()}
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>품번</th><th>품명</th><th>공급업체</th><th>현재 재고</th><th>발주잔량</th><th>위험등급</th></tr></thead>
              <tbody>
                <tr><td><strong>431A</strong></td><td>특수 가스켓</td><td>Supplier A</td><td>150 EA</td><td>200 EA</td><td><span class="badge badge-danger">🔴 High</span></td></tr>
                <tr><td><strong>431C</strong></td><td>전용 브래킷</td><td>Supplier B</td><td>80 EA</td><td>100 EA</td><td><span class="badge badge-danger">🔴 High</span></td></tr>
                <tr><td><strong>432B</strong></td><td>BC3 전용 센서</td><td>Supplier C</td><td>240 EA</td><td>0 EA</td><td><span class="badge badge-warning">🟠 Mid</span></td></tr>
                <tr><td><strong>435D</strong></td><td>전용 마운팅 킷</td><td>Supplier A</td><td>60 EA</td><td>50 EA</td><td><span class="badge badge-warning">🟠 Mid</span></td></tr>
                <tr><td colspan="6" style="text-align:center;color:var(--sap-text-muted);font-size:12px">... 외 24개 품목 (전체 Fiori Report에서 확인 →)</td></tr>
              </tbody>
            </table>
          </div>`);
          p.addResultCard(`<h4>🔩 유니크 부품 현황</h4>
            <div class="kpi-row">
              <div class="kpi-card danger"><div class="kpi-value">28</div><div class="kpi-label">유니크 부품 수</div></div>
              <div class="kpi-card warning"><div class="kpi-value">9개사</div><div class="kpi-label">관련 공급업체</div></div>
              <div class="kpi-card danger"><div class="kpi-value">4건</div><div class="kpi-label">취소 가능 PO</div></div>
            </div>`);
          p.addPresets([
            {label:'📦 431A 입고 예정 물량 확인', highlight:true},
            {label:'🔢 BC3 장기재고 전환 예상'},
            {label:'✉ 공급업체 메일 발송'}
          ]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(2);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', '431A 품번의 향후 3개월 입고 예정 물량은?');
      setTimeout(() => {
        p.addThinking(["431A 품번의 미입고 PO 잔량을 확인하고 있어요", "향후 3개월 납기 일정별로 입고 예정 물량을 나누는 중", "단산 시점 이후 입고분이 있는지 판단합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `431A (특수 가스켓) 향후 입고 예정:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>입고예정일</th><th>수량</th><th>PO번호</th><th>공급업체</th><th>취소 가능 여부</th></tr></thead>
              <tbody>
                <tr><td>${demoMD(1,15,'iso')}</td><td>100 EA</td><td>4500018721</td><td>Supplier A</td><td><span class="badge badge-success">✅ 가능</span></td></tr>
                <tr><td>${demoMD(2,20,'iso')}</td><td>100 EA</td><td>4500019105</td><td>Supplier A</td><td><span class="badge badge-warning">⚠️ 부분 가능</span></td></tr>
              </tbody>
            </table>
          </div>
          BC3 단산(${demoMon(1,'ykr')} 말)을 고려하면 두 PO 모두 불필요합니다. 단, 최종 발주(LTB) 수량을 먼저 확정해야 합니다. <strong>취소를 추천합니다.</strong>`);
          p.addPresets([
            {label:'✉ 공급업체에 단산 안내 메일 발송', highlight:true},
            {label:'🚫 PO 4500018721 취소 요청'}
          ]);
        }, 2550);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = '';
      touchGuide.hideAll();
      p.addMsg('user', 'BC3 차종 단산 영향받는 유니크 부품 공급업체에 단산 안내 메일 발송해줘');
      setTimeout(() => {
        p.addThinking(["단산 영향 유니크 부품을 공급하는 업체를 추리고 있어요", "업체별 담당자와 남은 PO 정보를 정리하는 중", "단산 일정과 요청 사항을 담아 메일 초안을 작성합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(4);
          p.addMsg('ai', `공급업체 9개사에 발송할 단산 안내 메일 초안입니다:
          <div style="margin-top:10px;padding:14px;background:var(--sap-darker);border:1px solid var(--sap-border);border-radius:8px;font-size:13px;font-family:monospace;line-height:1.7">
          <span style="color:var(--sap-text-muted)">수신:</span> Supplier A, B, C 외 6개사 (총 9개사)<br>
          <span style="color:var(--sap-text-muted)">제목:</span> <strong>[긴급] BC3 차종 단산에 따른 발주 조정 안내</strong><br>
          <div class="divider"></div>
          안녕하세요. BestRun 구매팀입니다.<br><br>
          당사 BC3 차종이 <strong>${demoMon(1,'ykr')} 말부로 단산</strong> 예정으로, 귀사에 발주된 하기 부품에 대한 발주 조정이 필요합니다.<br><br>
          1. <strong>최종 발주(LTB) 수량</strong>: 단산 전 잔여 소요 기준으로 첨부 품목별 수량을 ${demoDay(7,'kr')}까지 확정 요청드립니다.<br>
          2. <strong>미입고 PO</strong>: LTB 초과분은 취소·수량 조정을 협의하고자 합니다 (생산 착수분은 비용 정산).<br>
          3. <strong>잔여 재고·전용 금형</strong>: 계약 제12조에 따른 보상 조건을 회신 부탁드립니다.<br><br>
          <span style="color:var(--sap-warning)">※ 해당 부품은 BC3 전용 유니크 부품으로, 이후 추가 발주가 없을 예정입니다.</span>
          </div>
          ${jConfirm('agent2', '공급업체 9개사에 이 단산 안내 메일을 발송하시겠습니까?')}`);
          p.addResultCard(`<h4>✉ 메일 발송 준비 완료</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-success" onclick="demoPlayers['agent2'].next()">✅ 승인 후 발송</button>
              <button class="action-btn action-btn-ghost">✏️ 수정하기</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 승인 후 발송');
        }, 2550);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll();
      p.presets().innerHTML = '';
      p.addMsg('user', '승인. 발송해줘.');
      setTimeout(() => {
        p.addMsg('ai', `<span class="text-success">✅ 메일 발송 완료</span><br>
        발송 대상: 9개 공급업체<br>
        발송 완료: 9 / 9건 (100%)<br>
        발송일시: ${new Date().toLocaleString('ko-KR')}<br><br>
        <span class="text-muted">공급업체 회신 시 Joule Work 알림으로 수신됩니다.</span>`);
        const sec = document.getElementById('agent2');
        sec.querySelectorAll('.a2-sent').forEach(e => { e.textContent = '9'; });
        sec.querySelectorAll('.a2-sent-sub').forEach(e => { e.textContent = '9 / 9 · 100%'; });
        sec.querySelectorAll('.a2-mail-ins').forEach(e => { e.innerHTML = '✅ 9개사 <strong>발송 완료</strong> · LTB 수량 회신 기한 ' + demoDay(7, 'kr') + ' · 회신은 Joule 알림으로 수신'; });
      }, 600);
    },
    (p) => {
      p._setFlowActive(5);
      const result = p.result();
      const banner = document.createElement('div');
      banner.className = 'completion-banner';
      banner.innerHTML = `
        <span class="banner-icon">🎉</span>
        <div>
          <h3>시나리오 완료</h3>
          <p>단산 통보 → BOM KG 유니크 부품 자동 식별 → 재고/PO 영향 분석 → 공급업체 메일 자동 발송 전 과정 완료</p>
        </div>`;
      result.appendChild(banner);
      p.addMsg('sys', '✅ &nbsp;<strong>단산 관리</strong> 시나리오가 완료되었습니다. 수작업 BOM 역전개 대비 약 90% 시간 절감 달성.');
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 3 — MRP 예외 관리
═══════════════════════════════════════════ */
demoPlayers['agent3'] = new DemoPlayer({
  id: 'agent3',
  flow: [
    {icon:'⚙️', label:'MRP Run 실행'},
    {icon:'🤖', label:'예외 자동 분류'},
    {icon:'📊', label:'우선순위 정렬'},
    {icon:'💡', label:'조치 방안 추천'},
    {icon:'✅', label:'일정 재조정'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work', type:'user'},
    {arrow:true},
    {icon:'🔌', name:'ERP MCP Client', sub:'Joule Work 내장', type:'mcp'},
    {arrow:true, label:'OData'},
    {icon:'🏢', name:'S/4HANA', sub:'MRP Controller', type:'erp'},
    {arrow:true},
    {icon:'📋', name:'MRP 예외 메시지', sub:'I_MRPController\nI_ManufacturingOrder', type:'data'},
    {arrow:true, label:'AI 분류'},
    {icon:'🤖', name:'AI Triage Engine', sub:'SAP AI Core', type:'ai'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'I_MRPController', cls:'orange'},
    {label:'I_ManufacturingOrder', cls:'orange'},
    {label:'AI Triage', cls:'purple'},
    {label:'SAP AI Core', cls:'purple'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;MRP 예외 관리 Agent 준비 완료. S/4HANA MRP 컨트롤러 데이터 연결됨.');
      p.addPresets([{label:'⚡ 이번 주 MRP 예외 메시지 조회', highlight:true},{label:'📋 특정 자재 MRP 상태 확인'}]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '이번 주 플랜트 1050 MRP 예외 메시지 중 긴급도 높은 것부터 보여줘');
      setTimeout(() => {
        p.addThinking(["이번 주 MRP 예외 메시지 234건을 유형별로 분류하고 있어요", "생산 일정과 결품 영향도를 기준으로 긴급도를 매기는 중", "단순 정보성 메시지는 걸러내고 있어요", "긴급도가 높은 순서로 정리합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `이번 주 A-4315 결품(MO-26-0889)은 재고 이전·라인 순서 교체로 처리 중입니다. MRP를 다시 돌린 결과 남은 예외 234건 중 <strong>긴급 처리 필요 12건</strong>을 선별했습니다:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>순위</th><th>예외유형</th><th>자재</th><th>지연위험</th><th>생산 차질 금액</th><th>AI 추천</th></tr></thead>
              <tbody>
                <tr><td>1</td><td><span class="badge badge-danger">일정 앞당김 (10)</span></td><td>A-4315</td><td>D-3일</td><td>45.6M원</td><td>납기 단축 요청</td></tr>
                <tr><td>2</td><td><span class="badge badge-warning">취소 제안 (20)</span></td><td>435D</td><td>—</td><td>8.0M원</td><td>PO 취소 (BC3 단산)</td></tr>
                <tr><td>3</td><td><span class="badge badge-warning">개시일 경과 (06)</span></td><td>D-5501</td><td>D-5일</td><td>16.5M원</td><td>계획오더 즉시 확정</td></tr>
                <tr><td colspan="6" style="text-align:center;color:var(--sap-text-muted);font-size:12px">... 외 9건 (AI 우선순위 정렬 완료)</td></tr>
              </tbody>
            </table>
          </div>`);
          p.addResultCard(`<h4>⚡ 예외 현황</h4><div class="kpi-row">
            <div class="kpi-card danger"><div class="kpi-value">12</div><div class="kpi-label">긴급 처리 필요</div></div>
            <div class="kpi-card warning"><div class="kpi-value">234</div><div class="kpi-label">전체 예외 건수</div></div>
            <div class="kpi-card"><div class="kpi-value">84M</div><div class="kpi-label">금액 영향(원)</div></div>
          </div>`);
          p.addPresets([{label:'📅 A-4315 일정 재조정 방안 보기', highlight:true},{label:'📦 435D PO 취소'}]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(2);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'A-4315 일정 재조정 방안 상세히 알려줘');
      setTimeout(() => {
        p.addThinking(["A-4315 제조오더의 필요 일정과 현재 입고 예정일을 비교하고 있어요", "공급업체의 과거 납기 단축 대응 이력을 검토하는 중", "납기 조정과 대체 조달 시나리오의 리스크를 비교합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(3);
          p.addMsg('ai', `A-4315 (유압실린더) 일정 재조정 분석:
          <div style="padding:12px;background:var(--sap-darker);border-radius:8px;font-size:13px;margin-top:8px;border:1px solid var(--sap-border)">
          • 현재 납기예정: <strong>${demoMD(1,15,'iso')}</strong> → 필요일자: <strong>${demoMD(1,12,'iso')}</strong> (3일 차이)<br>
          • 영향 제조오더: <strong>MO-26-0891</strong> (${demoMD(1,12,'md')} 투입 예정 · 다음 달분)<br>
          • 공급업체 ACME Components Korea 최근 6개월 평균 리드타임: <strong>18일</strong> (OTD 88%)<br>
          • <strong>AI 판단:</strong> ACME는 최근 납기 단축 요청 9건 중 8건을 수락(89%) — 3일 단축은 수락 가능성이 높습니다<br>
          • 거절 대비: 1060 여유 재고 80 EA 중 이번 주 결품에 쓰고 <strong>남은 40 EA를 백업으로 예약</strong>합니다
          </div>
          ${optCompare()}
          ${jConfirm('agent3', `ACME에 납기 단축을 요청할까요? PO 4500019234 항목 10은 확약(AB) 회신 시 ${demoMD(1,12,'iso')}로 확정됩니다.`)}`);
          p.addResultCard(`<h4>💡 권장 조치</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-primary" onclick="demoPlayers['agent3'].next()">📅 납기 앞당기기</button>
              <button class="action-btn action-btn-warning">🏭 대체재고 이동</button>
              <button class="action-btn action-btn-ghost">👁 상세 분석</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 납기 앞당기기');
        }, 2550);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '납기 단축 요청 보내줘');
      setTimeout(() => {
        p.addThinking(["변경할 PO의 납기 일정을 확인하고 있어요", "3일 앞당기면 생산 일정 충돌이 해소되는지 검증하는 중", "납기 변경 요청을 등록하고 공급업체 확약 요청을 준비합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(4);
          stampDoc('po');
          p.addMsg('ai', `<span class="text-success">✅ 납기 단축 요청 발송</span><br>
          PO 4500019234 항목 10: 납기 변경 요청 등록 (${demoMD(1,15,'iso')} → <strong>${demoMD(1,12,'iso')}</strong>, <strong>확약 대기</strong>)<br>
          확약 전까지 MRP는 기존 납기 기준으로 계획 · 확약(AB) 회신 시 자동 확정<br>
          48시간 내 거절·미회신 시 1060 남은 재고 40 EA 재고 이전으로 자동 전환 (예약 완료)<br>
          <span style="color:var(--j-text-2)">변경 이력: JKIM (Joule MRP Exception Agent 대행)</span>
          <div style="margin-top:10px"><button class="action-btn action-btn-primary" onclick="router.go('fiori-po-delivery')">📄 구매오더 조회하기</button></div>`);
        }, 2550);
      }, 400);
    },
    (p) => { p._setFlowActive(5); p.addMsg('sys','✅ &nbsp;<strong>MRP 예외 관리</strong> 시나리오 완료. 234건 중 12건 긴급 처리, 1건 즉시 해결.');
      const b=document.createElement('div'); b.className='completion-banner';
      b.innerHTML='<span class="banner-icon">🎉</span><div><h3>시나리오 완료</h3><p>MRP Run → AI 예외 트리아지 → 우선순위화 → 자동 일정 재조정까지 전 과정 완료</p></div>';
      p.result().appendChild(b);
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 4 — 3-Way Matching
═══════════════════════════════════════════ */
demoPlayers['agent4'] = new DemoPlayer({
  id: 'agent4',
  flow: [
    {icon:'📄', label:'송장 수신'},
    {icon:'🔄', label:'PO-GR-Invoice 대사'},
    {icon:'⚠️', label:'불일치 탐지'},
    {icon:'🔍', label:'원인 분류'},
    {icon:'✅', label:'보류 해제/전기'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work', type:'user'},
    {arrow:true},
    {icon:'🔌', name:'ERP MCP', sub:'MCP Client', type:'mcp'},
    {arrow:true, label:'OData'},
    {icon:'📄', name:'PO', sub:'I_PurchaseOrderItemAPI01', type:'data'},
    {arrow:true},
    {icon:'📦', name:'GR', sub:'I_MaterialDocumentItem_2', type:'data'},
    {arrow:true},
    {icon:'🧾', name:'Invoice', sub:'I_SupplierInvoiceAPI01', type:'data'},
    {arrow:true, label:'대사'},
    {icon:'🤖', name:'AI Matching', sub:'3-Way Engine', type:'ai'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'I_PurchaseOrderItemAPI01', cls:'orange'},
    {label:'I_SupplierInvoiceAPI01', cls:'orange'},
    {label:'I_SuplrInvcItemPurOrdRefAPI01', cls:'orange'},
    {label:'I_PurchaseContractAPI01', cls:'orange'},
    {label:'Supplier Invoice API (보류 해제)', cls:'green'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;3-Way Matching Agent 준비 완료. PO / GR / Invoice 데이터 소스 연결됨.');
      p.addPresets([{label:'🔍 이번 달 불일치 건 조회', highlight:true},{label:'📄 특정 송장 상세 확인'}]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '이번 달 PO-GR-Invoice 불일치 건 목록 보여줘. 금액 차이 큰 순서로');
      setTimeout(() => {
        p.addThinking(["이번 달 송장 847건을 PO, 입고 내역과 짝지어 보고 있어요", "수량 차이와 단가 차이를 각각 계산하는 중", "허용 오차를 벗어난 건만 불일치로 분류하고 있어요", "금액 차이가 큰 순서로 정렬합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `회사코드 1000 이번 달 송장 847건 중 <strong>불일치 23건</strong> 탐지. 금액 차이 상위 3건:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>#</th><th>송장번호</th><th>공급업체</th><th>PO금액</th><th>송장금액</th><th>차이</th><th>원인 분류</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>INV-2946</td><td>Alpha Co.</td><td>12.4M</td><td>13.8M</td><td><span class="text-danger">+1.4M</span></td><td><span class="badge badge-danger">단가 불일치</span></td></tr>
                <tr><td>2</td><td>INV-3012</td><td>Beta Inc.</td><td>8.7M</td><td>8.2M</td><td><span class="text-warning">-0.5M</span></td><td><span class="badge badge-warning">수량 부족</span></td></tr>
                <tr><td>3</td><td>INV-2891</td><td>Gamma Ltd</td><td>5.2M</td><td>5.8M</td><td><span class="text-danger">+0.6M</span></td><td><span class="badge badge-warning">추가 요금</span></td></tr>
                <tr><td colspan="7" style="text-align:center;font-size:12px;color:var(--sap-text-muted)">... 외 20건</td></tr>
              </tbody>
            </table>
          </div>`);
          p.addResultCard(`<h4>🔍 대사 결과</h4><div class="kpi-row">
            <div class="kpi-card"><div class="kpi-value">847</div><div class="kpi-label">전체 송장</div></div>
            <div class="kpi-card danger"><div class="kpi-value">23</div><div class="kpi-label">불일치 건</div></div>
            <div class="kpi-card warning"><div class="kpi-value">5.8M</div><div class="kpi-label">총 차이금액(원)</div></div>
          </div>`);
          p.addPresets([{label:'🔍 INV-2946 원인 분석', highlight:true},{label:'✅ 전체 일괄 처리'}]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'INV-2946 단가 불일치 원인 분석해줘');
      setTimeout(() => {
        p.addThinking(["INV-2946의 PO 단가와 청구 단가를 비교하고 있어요", "EA당 14,000원 차이 — 계약 단가가 바뀌었는지 확인해 볼게요", "구매계약 PA-2026-112가 지난달 1일부로 갱신된 것을 확인했어요", "계약서의 가격 기준일 조항과 입고일을 대조하는 중", "PO에 갱신 단가가 반영되지 않았으므로 정당한 청구로 판단합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `INV-2946 분석 결과:
          <div style="padding:12px;background:var(--sap-darker);border-radius:8px;font-size:13px;margin-top:8px;border:1px solid var(--sap-border);line-height:1.8">
          • PO 계약 단가: <strong>124,000원/EA × 100EA = 12,400,000원</strong><br>
          • 청구 단가: <strong>138,000원/EA × 100EA = 13,800,000원</strong><br>
          • 차이 원인: 구매계약 PA-2026-112가 <span class="text-warning">${demoMD(-1,1,'iso')}부로 갱신</span> (단가 +14,000원) — PO에 미반영<br>
          • 계약 근거: PA-2026-112 제5조 "단가는 <strong>납품일</strong>에 유효한 계약 단가를 적용한다" — 입고일 ${demoDay(-5,'iso')}은 갱신일 이후<br>
          • AI 판단: <span class="text-success">계약 조항상 정당한 청구</span> (확신도 96%). 지급보류를 계약 근거로 해제하고, 미입고분 PO 단가 갱신 권장
          </div>
          ${jConfirm('agent4', '계약 갱신가(138,000원) 기준으로 INV-2946 지급보류를 해제하고, 미입고분 PO 단가도 갱신하시겠습니까?')}`);
          p.addResultCard(`<h4>💡 처리 권장</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-success" onclick="demoPlayers['agent4'].next()">✅ PO 수정 후 승인</button>
              <button class="action-btn action-btn-warning">❌ 반려 처리</button>
              <button class="action-btn action-btn-ghost">📋 계약서 원본 보기</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 승인 처리');
        }, 3100);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '지급보류 해제하고 PO 단가도 갱신해줘');
      setTimeout(() => {
        stampDoc('fi');
        p.addMsg('ai', `<span class="text-success">✅ 처리 완료</span><br>
        INV-2946 가격차이 지급보류(R) 해제 — 계약 PA-2026-112 근거<br>
        PO 4500019156 미입고분 단가: 124,000원 → <strong>138,000원</strong> 갱신<br>
        회계전표(<strong>5100003421</strong>) 생성 완료
        <div style="margin-top:10px">
          <button class="action-btn action-btn-primary" onclick="router.go('fiori-accounting-doc')">📄 전표 조회하기</button>
        </div>`);
      }, 600);
      setTimeout(() => p.addMsg('ai', rootCause()), 1800);
      setTimeout(() => p.addMsg('ai', `⚠️ <strong>자동 처리하지 않은 건</strong> — INV-3012 (Beta Inc., 수량 부족 −0.5M)는 입고 수량과 송장 수량 차이의 원인을 확정하지 못했습니다 (확신도 54%).
        부분 입고인지 공급업체 오청구인지 판단 근거가 부족해 <strong>AP 담당자 검토 대기</strong>로 넘겼습니다.`), 3400);
    },
    (p) => { p._setFlowActive(5); p.addMsg('sys','✅ &nbsp;<strong>3-Way Matching</strong> 시나리오 완료.');
      const b=document.createElement('div'); b.className='completion-banner';
      b.innerHTML='<span class="banner-icon">🎉</span><div><h3>시나리오 완료</h3><p>송장 수신 → 3-way 자동 대사 → 불일치 탐지 및 원인 분류 → 승인 처리까지 완료</p></div>';
      p.result().appendChild(b);
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 5 — 공급업체 납기 리스크
═══════════════════════════════════════════ */
demoPlayers['agent5'] = new DemoPlayer({
  id: 'agent5',
  flow: [
    {icon:'📅', label:'납기 모니터링'},
    {icon:'🤖', label:'OTD 이력 분석'},
    {icon:'🎯', label:'리스크 스코어링'},
    {icon:'🚨', label:'선제 알림'},
    {icon:'✉️', label:'공급업체 독촉'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work', type:'user'},
    {arrow:true},
    {icon:'🔌', name:'ERP MCP', sub:'Client', type:'mcp'},
    {arrow:true, label:'OData'},
    {icon:'📅', name:'납기 스케줄', sub:'I_PurOrdScheduleLineAPI01', type:'data'},
    {arrow:true},
    {icon:'🏢', name:'공급업체 마스터', sub:'I_Supplier', type:'data'},
    {arrow:true, label:'OTD 분석'},
    {icon:'🎯', name:'Risk Scoring', sub:'HANA Cloud', type:'ai'},
    {arrow:true, label:'메일'},
    {icon:'✉️', name:'Email Gateway', sub:'알림 발송', type:'db'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'I_PurOrdScheduleLineAPI01', cls:'orange'},
    {label:'I_Supplier', cls:'orange'},
    {label:'OTD Risk Scoring', cls:'purple'},
    {label:'Email Gateway', cls:'green'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;공급업체 납기 리스크 Agent 준비 완료. OTD 이력 DB 및 납기 스케줄 연결됨.');
      p.addMsg('ai', riskAlert());
      p.addPresets([{label:'🚨 납기 위험 PO 목록 조회', highlight:true},{label:'📊 공급업체별 OTD 현황'}]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '이번 달 납기 지연 위험이 높은 PO 목록 보여줘');
      setTimeout(() => {
        p.addThinking(["이번 달 납기가 도래하는 PO와 진행 상태를 확인하고 있어요", "공급업체별 최근 6개월 납기 준수율을 반영하는 중", "납기 확인 회신 여부와 잔여 일수로 리스크 점수를 계산하고 있어요", "위험도가 높은 순서로 정리합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `납기 위험 분석 결과 (AI 리스크 스코어 순):
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>공급업체</th><th>PO번호</th><th>납기예정일</th><th>남은일수</th><th>OTD율(6M)</th><th>위험점수</th><th>현황</th></tr></thead>
              <tbody>
                <tr><td><strong>Delta Co.</strong></td><td>4500019188</td><td>${demoDay(1,'iso')}</td><td style="color:var(--sap-danger)">D-1</td><td>62%</td><td><span class="badge badge-danger">🔴 75점</span></td><td>미확인</td></tr>
                <tr><td>Echo Ltd</td><td>4500019102</td><td>${demoDay(5,'iso')}</td><td style="color:var(--sap-warning)">D-5</td><td>71%</td><td><span class="badge badge-warning">🟠 51점</span></td><td>생산 중</td></tr>
                <tr><td>Foxtrot</td><td>4500019076</td><td>${demoDay(9,'iso')}</td><td>D-9</td><td>85%</td><td><span class="badge badge-success" style="color:#fff">🟡 27점</span></td><td>출하 준비</td></tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top:8px;padding:8px 12px;background:var(--sap-danger-bg);border-radius:8px;font-size:13px;border:1px solid var(--sap-danger)">⚠️ Delta Co.는 최근 3개월간 4건 중 3건 지연. 즉각 조치 필요.</div>`);
          p.addResultCard(`<h4>🎯 리스크 현황</h4><div class="kpi-row">
            <div class="kpi-card danger"><div class="kpi-value">1</div><div class="kpi-label">즉각 조치 필요</div></div>
            <div class="kpi-card warning"><div class="kpi-value">1</div><div class="kpi-label">모니터링 필요</div></div>
            <div class="kpi-card success"><div class="kpi-value">D-1</div><div class="kpi-label">최고 긴급 납기</div></div>
          </div>`);
          p.addPresets([{label:'✉ Delta Co. 독촉 메일 작성', highlight:true},{label:'📞 담당자 전화 연결'}]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'Delta Co.에 납기 독촉 메일 초안 만들어줘');
      setTimeout(() => {
        p.addThinking(["Delta Co.의 지연 위험 PO와 납기 일정을 확인하고 있어요", "최근 납기 준수 이력을 참고해 독촉 수위를 정하는 중", "회신 기한을 포함해 메일 초안을 작성합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `독촉 메일 초안:
          <div style="margin-top:8px;padding:14px;background:var(--sap-darker);border:1px solid var(--sap-border);border-radius:8px;font-size:13px;font-family:monospace;line-height:1.8">
          <span style="color:var(--sap-text-muted)">수신:</span> procurement@delta-co.com<br>
          <span style="color:var(--sap-text-muted)">제목:</span> <strong>[긴급] PO 4500019188 납기 확인 요청</strong><br>
          <div class="divider"></div>
          BestRun 구매팀입니다.<br>
          귀사에 발주된 PO 4500019188 (A-4315 유압실린더 50EA, 납기 ${demoDay(1,'iso')})의<br>
          현재 진행 상황을 <strong>금일 오후 3시까지</strong> 회신 부탁드립니다.<br>
          미회신 시 긴급 대체 조달을 진행할 예정입니다.
          </div>
          ${jConfirm('agent5', '이 독촉 메일을 Delta Co.에 즉시 발송하시겠습니까?')}`);
          p.addResultCard(`<h4>✉ 메일 발송</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-primary" onclick="demoPlayers['agent5'].next()">✅ 즉시 발송</button>
              <button class="action-btn action-btn-ghost">✏️ 수정</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 즉시 발송');
        }, 2550);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '발송해줘');
      setTimeout(() => {
        p.addMsg('ai', `<span class="text-success">✅ 메일 발송 완료</span><br>
        수신: procurement@delta-co.com<br>
        발송일시: ${new Date().toLocaleString('ko-KR')}<br>
        회신 기한: 오늘 오후 3시 · 미회신 시 자동 알림 예약됨`);
      }, 600);
    },
    (p) => { p._setFlowActive(5); p.addMsg('sys','✅ &nbsp;<strong>공급업체 납기 리스크</strong> 시나리오 완료.');
      const b=document.createElement('div'); b.className='completion-banner';
      b.innerHTML='<span class="banner-icon">🎉</span><div><h3>시나리오 완료</h3><p>납기 모니터링 → OTD 이력 AI 분석 → 리스크 스코어링 → 자동 독촉 메일 발송까지 완료</p></div>';
      p.result().appendChild(b);
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 6 — 수요 예측 기반 발주 추천
═══════════════════════════════════════════ */
demoPlayers['agent6'] = new DemoPlayer({
  id: 'agent6',
  flow: [
    {icon:'📈', label:'수요 예측 실행'},
    {icon:'📦', label:'현재고 비교'},
    {icon:'🎯', label:'발주 필요량 계산'},
    {icon:'📝', label:'PR 초안 생성'},
    {icon:'✅', label:'담당자 승인'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work', type:'user'},
    {arrow:true},
    {icon:'🔌', name:'RDB MCP Client', sub:'Joule Work 내장', type:'mcp'},
    {arrow:true, label:'SQL'},
    {icon:'☁️', name:'HANA Cloud', sub:'예측결과 RDB', type:'db'},
    {arrow:true, label:'예측모델'},
    {icon:'🤖', name:'SAP AI Core', sub:'SAP-RPT 1.6 Large', type:'ai'},
    {arrow:true, label:'OData'},
    {icon:'🏢', name:'S/4HANA', sub:'I_MaterialStock_2\nI_PurchaseReqn', type:'erp'},
    {arrow:true, label:'PR 생성'},
    {icon:'📝', name:'Purchase Req.', sub:'자동 생성', type:'data'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'RDB MCP Server', cls:'teal'},
    {label:'SAP-RPT 1.6 Large', cls:'purple'},
    {label:'HANA Cloud', cls:'teal'},
    {label:'I_MaterialStock_2', cls:'orange'},
    {label:'Auto PR Creation', cls:'green'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;수요 예측 기반 발주 추천 Agent 준비 완료. SAP-RPT 1.6 예측 모델(SAP AI Core) 및 재고 데이터 연결됨.');
      p.addPresets([{label:'📊 다음 달 발주 필요 자재 추천', highlight:true},{label:'📈 특정 자재 수요 예측 보기'}]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '다음 달 수요 예측 결과를 바탕으로 발주가 필요한 자재 추천해줘');
      setTimeout(() => {
        p.addThinking(["상위 200개 자재의 과거 24개월 소비 패턴을 살펴보고 있어요", "계절성과 최근 추세를 반영해 다음 달 수요를 예측하는 중", "현재고·미입고 PO에 재고 이전과 품질 검사 합격분까지 빼서 부족 수량을 계산하고 있어요", "안전재고와 최소 발주량을 고려해 발주 대상을 선정합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `수요 예측 완료. <strong>발주 필요 자재 Top 8</strong> (재고 부족 순):
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>자재</th><th>예측수요</th><th>현재고</th><th>입고예정<br>(PO·STO)</th><th>순부족량</th><th>권장발주량</th><th>AI 신뢰도</th></tr></thead>
              <tbody>
                <tr><td><strong>A-4315</strong></td><td>265 EA</td><td>45 EA<br><small>+ 검사 합격 18</small></td><td>135 EA<br><small>PO 95 · 이전 40</small></td><td style="color:var(--sap-danger)"><strong>67 EA</strong></td><td>100 EA</td><td><span class="badge badge-success">87%</span></td></tr>
                <tr><td><strong>B-2290</strong></td><td>250 EA</td><td>80 EA</td><td>100 EA</td><td style="color:var(--sap-danger)"><strong>70 EA</strong></td><td>100 EA</td><td><span class="badge badge-success">91%</span></td></tr>
                <tr><td><strong>D-5501</strong></td><td>90 EA</td><td>10 EA</td><td>0 EA</td><td style="color:var(--sap-danger)"><strong>80 EA</strong></td><td>100 EA</td><td><span class="badge badge-warning">79%</span></td></tr>
                <tr><td>F-1120</td><td>90 EA</td><td>15 EA</td><td>30 EA</td><td style="color:var(--sap-warning)"><strong>45 EA</strong></td><td>60 EA</td><td><span class="badge badge-warning">82%</span></td></tr>
                <tr><td colspan="7" style="text-align:center;font-size:12px;color:var(--sap-text-muted)">... 외 4개 품목</td></tr>
              </tbody>
            </table>
          </div>
          <span style="font-size:12.5px;color:var(--j-text-2)">권장발주량 = 순부족량 + 안전재고, 최소발주량(MOQ) 단위로 올림 — A-4315: 67 + 20 → MOQ 50 단위 100 EA</span><br>
          💡 일반 MRP는 PO 입고분 95 EA만 차감합니다. Agent는 <strong>재고 이전 40 EA와 품질 검사 합격 18 EA</strong>까지 반영해 <strong>58 EA(13.7M원) 이중 발주</strong>를 막았습니다.`);
          p.addResultCard(`<h4>📊 예측 요약</h4><div class="kpi-row">
            <div class="kpi-card danger"><div class="kpi-value">8</div><div class="kpi-label">발주 필요 자재</div></div>
            <div class="kpi-card warning"><div class="kpi-value">127.7M</div><div class="kpi-label">예상 발주금액(원)</div></div>
            <div class="kpi-card success"><div class="kpi-value">85%</div><div class="kpi-label">평균 예측 신뢰도</div></div>
          </div>`);
          p.addPresets([{label:'📝 구매 요청서 초안 생성', highlight:true},{label:'📈 A-4315 예측 상세 보기'}]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '이 목록으로 구매 요청서 초안 만들어줘');
      setTimeout(() => {
        p.addThinking(["추천 자재 8개 품목의 발주 수량을 확정하고 있어요", "생산계획 기준으로 납기요청일을 정하는 중", "품목별 금액을 합산해 구매요청서 초안을 작성합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `구매 요청서(PR) 초안 생성 완료:
          <div style="padding:12px;background:var(--sap-darker);border-radius:8px;font-size:13px;margin-top:8px;border:1px solid var(--sap-border);line-height:1.9">
          PR번호: <strong>10008976</strong><br>
          요청일: ${new Date().toLocaleDateString('ko-KR')} &nbsp;|&nbsp; 요청자: 김재형 (JKIM) — Joule 수요예측 Agent 대행<br>
          총 <strong>8개 품목</strong> &nbsp;|&nbsp; 총금액: <strong>약 127.7백만원</strong><br>
          납기요청일: ${demoMD(1,5,'iso')} ~ ${demoMD(1,15,'md')} (품목별, 생산계획 기준)<br>
          ※ A-4315는 입고예정 PO 95 EA + 재고 이전 40 EA + 검사 합격 18 EA를 차감한 순부족 기준 (236,000원/EA)
          </div>
          ${jConfirm('agent6', '승인자(이도윤 상무, 구매본부장)에게 승인 요청을 발송하시겠습니까?')}`);
          p.addResultCard(`<h4>📝 PR 생성 완료</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-primary" onclick="demoPlayers['agent6'].next()">✅ 승인 요청 발송</button>
              <button class="action-btn action-btn-ghost">✏️ 수량 수정</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 승인 요청');
        }, 2550);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '승인 요청 발송해줘');
      setTimeout(() => {
        stampDoc('pr');
        p.addMsg('ai', `<span class="text-success">✅ PR 생성 및 승인 요청 발송 완료</span><br>
        PR 10008976 생성됨<br>
        승인 요청: 이도윤 상무 (구매본부장) — Flexible Workflow · 요청자와 승인자 분리<br>
        예상 승인 처리: 1 영업일 이내
        <div style="margin-top:10px">
          <button class="action-btn action-btn-primary" onclick="router.go('fiori-pr-display')">📄 구매요청 조회하기</button>
        </div>`);
      }, 600);
    },
    (p) => { p._setFlowActive(5); p.addMsg('sys','✅ &nbsp;<strong>수요 예측 기반 발주 추천</strong> 시나리오 완료.');
      const b=document.createElement('div'); b.className='completion-banner';
      b.innerHTML='<span class="banner-icon">🎉</span><div><h3>시나리오 완료</h3><p>SAP-RPT 수요 예측 → 재고 GAP 분석 → 발주 필요 자재 선정 → PR 자동 생성 및 승인 요청까지 완료</p></div>';
      p.result().appendChild(b);
    }
  ]
});

/* ═══════════════════════════════════════════
   AGENT 7 — 창고 재고 이동 최적화
═══════════════════════════════════════════ */
demoPlayers['agent7'] = new DemoPlayer({
  id: 'agent7',
  flow: [
    {icon:'📊', label:'재고 현황 분석'},
    {icon:'🔄', label:'플랜트 간 비교'},
    {icon:'📍', label:'과잉/부족 매칭'},
    {icon:'🚚', label:'STO 추천'},
    {icon:'✅', label:'재고 이전 오더 생성'}
  ],
  arch: [
    {icon:'👤', name:'사용자', sub:'Joule Work', type:'user'},
    {arrow:true},
    {icon:'🔌', name:'ERP MCP', sub:'Client', type:'mcp'},
    {arrow:true, label:'OData'},
    {icon:'📊', name:'재고 현황', sub:'I_MaterialStock_2\nI_Plant', type:'data'},
    {arrow:true, label:'최적화'},
    {icon:'🤖', name:'Stock Optimizer', sub:'SAP AI Core', type:'ai'},
    {arrow:true, label:'STO 생성'},
    {icon:'🚚', name:'Purchase Order API', sub:'구매오더(UB) 생성', type:'erp'},
    {arrow:true},
    {icon:'🏢', name:'S/4HANA 납품·출고/입고', sub:'자재 문서 641 / 101', type:'erp'}
  ],
  tech: [
    {label:'Joule Work'},
    {label:'ERP MCP Server', cls:'teal'},
    {label:'I_MaterialStock_2', cls:'orange'},
    {label:'I_Plant / I_StorageLocation', cls:'orange'},
    {label:'Stock Optimization AI', cls:'purple'},
    {label:'PO (UB) & Delivery', cls:'green'}
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;창고 재고 이동 최적화 Agent 준비 완료. 3개 플랜트 재고 데이터 연결됨.');
      p.addPresets([{label:'🏭 플랜트 간 과잉 재고 찾기', highlight:true},{label:'📦 특정 자재 플랜트별 현황'}]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '플랜트 1050, 1060, 1070 중 이동 가능한 과잉 재고 찾아줘');
      setTimeout(() => {
        p.addThinking(["플랜트 1050, 1060, 1070의 현재고를 자재별로 비교하고 있어요", "각 플랜트의 향후 수요 대비 과잉/부족 수량을 계산하는 중", "플랜트 간 이동 비용과 외부 조달 비용을 비교하고 있어요", "이동 효과가 큰 조합을 추천합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `14일 수요 예측 기준 플랜트 간 재고 불균형 분석 결과:
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead><tr><th>자재</th><th>부족 플랜트</th><th>부족 시점 · 원인</th><th>여유 플랜트</th><th>이동 추천</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>A-4315</strong></td>
                  <td><span class="badge badge-danger">1050 −40 EA</span></td>
                  <td><strong>${demoDay(1,'md')} 08시</strong> · MO-26-0889 착수 (Delta Co. 50 EA 지연 위험)</td>
                  <td><span class="badge badge-success">1060 +80 EA</span></td>
                  <td>1060→1050 <strong>40 EA</strong></td>
                </tr>
                <tr>
                  <td><strong>C-1107</strong></td>
                  <td><span class="badge badge-danger">1060 −35 EA</span></td>
                  <td>${demoDay(5,'md')} · 출하 피크 (주간 출하 2배)</td>
                  <td><span class="badge badge-success">1050 +45 EA</span></td>
                  <td>1050→1060 <strong>35 EA</strong></td>
                </tr>
                <tr>
                  <td><strong>E-0923</strong></td>
                  <td><span class="badge badge-danger">1070 −80 EA</span></td>
                  <td>${demoDay(8,'md')} · 1070 생산오더 착수</td>
                  <td><span class="badge badge-success">1060 +180 EA</span></td>
                  <td>1060→1070 <strong>80 EA</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          가장 급한 건 <strong>A-4315</strong>입니다. 결품까지 <strong>1일</strong> — 외부 발주(리드타임 18일)로는 늦고, 1060 재고를 옮기면 <strong>${demoDay(1,'md')} 15시</strong>에 들어옵니다.<br>
          <span style="color:var(--j-warn)">⚠️ 착수(08시)보다 7시간 늦어, 그 사이 조립라인 12 작업 순서 조정이 필요합니다 → PP 결품 생산오더 대응 Agent에 알림</span><br>
          보내는 쪽 1060은 이전 후 100 EA로, 14일 수요 60 EA와 안전재고 20 EA를 채우고도 여유가 있습니다.
          이동 가능 재고 <strong>총 5건</strong> 확인 (상위 3건 표시). 외부 조달 대비 예상 절감: <strong>12.3M원</strong>`);
          p.addResultCard(`<h4>🚚 이동 최적화 결과</h4><div class="kpi-row">
            <div class="kpi-card warning"><div class="kpi-value">5건</div><div class="kpi-label">이동 추천 건수</div></div>
            <div class="kpi-card success"><div class="kpi-value">12.3M</div><div class="kpi-label">절감 예상(원)</div></div>
            <div class="kpi-card"><div class="kpi-value">3개</div><div class="kpi-label">대상 플랜트</div></div>
          </div>`);
          p.addPresets([{label:'🚚 A-4315 이동 오더 생성', highlight:true},{label:'📋 전체 이동 계획 보기'}]);
        }, 3100);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'A-4315 이동 오더 생성해줘');
      setTimeout(() => {
        p.addThinking(["A-4315를 보낼 플랜트 1060의 가용 재고를 확인하고 있어요", "받는 플랜트 1050의 필요 시점에 맞춰 이동 수량을 정하는 중", "이동 유형과 저장위치를 정해 이동오더 초안을 작성합니다"]);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `STO(재고이동오더) 초안:
          <div style="padding:12px;background:var(--sap-darker);border-radius:8px;font-size:13px;margin-top:8px;border:1px solid var(--sap-border);line-height:1.9">
          STO번호: <strong>4500019567</strong><br>
          문서유형: <strong>UB</strong> (회사 내 재고이동오더) · 출고 641 → 입고 101<br>
          발신: 플랜트 1060 · 저장위치 0001<br>
          수신: 플랜트 1050 · 저장위치 0001<br>
          자재: A-4315 &nbsp;|&nbsp; 수량: <strong>40 EA</strong><br>
          출고: 오늘 (641) · 1050 입고: <strong>${demoDay(1,'iso')} 15시</strong> (101)<br>결품 시점: ${demoDay(1,'iso')} 08시 MO-26-0889 착수 — 7시간 공백은 생산 순서 조정으로 메움<br>
          <span style="color:var(--sap-text-muted)">승인 후 출하문서(VL10B) → 출고(641) → 1050 입고(MIGO 101) 순으로 처리됩니다.</span>
          </div>
          ${jConfirm('agent7', '이 내용으로 재고 이전 오더(구매오더 4500019567, 문서 유형 UB)를 생성하시겠습니까?')}`);
          p.addResultCard(`<h4>🚚 STO 생성 확인</h4>
            <div class="action-btn-group">
              <button class="action-btn action-btn-success" onclick="demoPlayers['agent7'].next()">✅ 이동오더 생성 확정</button>
              <button class="action-btn action-btn-ghost">📋 전체 계획 보기</button>
            </div>`);
          touchGuide.showPulse(jYesBtn(p), '👆 이동오더 확정');
        }, 2550);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '이동오더 생성해줘');
      setTimeout(() => {
        stampDoc('sto');
        try { stoReset(); } catch(e) {}
        p.addMsg('ai', `<span class="text-success">✅ STO 4500019567 생성 완료</span><br>
        플랜트 1060 → 1050 이동 오더 확정<br>
        물류 담당자에게 알림 발송 완료<br>
        출하문서 생성 · 출고(641) 오늘 처리, 1050 입고(101) ${demoDay(1,'iso')} 15시 예정<br>
        생산계획 담당자에게 MO-26-0889 착수 순서 조정 요청 전달 (PP Agent)
        <div style="margin-top:10px">
          <button class="action-btn action-btn-primary" onclick="router.go('fiori-sto-display')">📄 구매오더(STO) 조회하기</button>
        </div>`);
      }, 600);
    },
    (p) => { p._setFlowActive(5); p.addMsg('sys','✅ &nbsp;<strong>창고 재고 이동 최적화</strong> 시나리오 완료.');
      const b=document.createElement('div'); b.className='completion-banner';
      b.innerHTML='<span class="banner-icon">🎉</span><div><h3>시나리오 완료</h3><p>재고 불균형 탐지 → 플랜트 간 최적 이동 매칭 → STO 자동 생성 및 물류 담당자 알림까지 완료</p></div>';
      p.result().appendChild(b);
    }
  ]
});

/* ═════════════════════════════════════════════════
   ARCH MODAL — Generic SVG Architecture Diagrams
═════════════════════════════════════════════════ */

/* SVG helper functions */
function _n(x,y,w,h,type,icon,l1,l2){
  const f={user:'#10253d',mcp:'#082828',erp:'#291200',db:'#061e0f',ai:'#160d35'};
  const s={user:'#0070F2',mcp:'#0EC4D1',erp:'#E9730C',db:'#30914C',ai:'#7C4DFF'};
  const t={user:'#7ac0ff',mcp:'#4dd9e3',erp:'#ffb86c',db:'#5de080',ai:'#b39dff'};
  const ico=icon?`<text x="${x+10}" y="${y+27}" font-size="15" font-family="Segoe UI Emoji">${icon}</text>`:'';
  const ox=icon?30:10;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${f[type]}" stroke="${s[type]}" stroke-width="1.5"/>${ico}<text x="${x+ox}" y="${y+22}" font-size="12" font-weight="700" fill="${t[type]}" font-family="Segoe UI,sans-serif">${l1}</text>${l2?`<text x="${x+ox}" y="${y+38}" font-size="10" fill="${t[type]}" opacity="0.75" font-family="Segoe UI,sans-serif">${l2}</text>`:''}`;
}
function _a(x1,y1,x2,y2,lbl,c){
  c=c||'#2E4A6A';
  const mx=(x1+x2)/2,my=(y1+y2)/2;
  const d=`M${x1},${y1} L${x2-9},${y2}`;
  const lbEl=lbl?`<rect x="${mx-22}" y="${my-12}" width="44" height="15" rx="3" fill="#0a1929" stroke="${c}" stroke-width="0.5" opacity="0.85"/><text x="${mx}" y="${my+1}" font-size="9" fill="${c}" text-anchor="middle" font-family="Segoe UI,sans-serif">${lbl}</text>`:'';
  return `<path d="${d}" stroke="${c}" stroke-width="1.8" fill="none"/><polygon points="${x2},${y2} ${x2-10},${y2-5} ${x2-10},${y2+5}" fill="${c}"/>${lbEl}`;
}
function _va(x,y1,y2,lbl,c){
  c=c||'#2E4A6A';
  const my=(y1+y2)/2;
  const lbEl=lbl?`<rect x="${x-22}" y="${my-10}" width="44" height="14" rx="3" fill="#0a1929" stroke="${c}" stroke-width="0.5" opacity="0.85"/><text x="${x}" y="${my+1}" font-size="9" fill="${c}" text-anchor="middle" font-family="Segoe UI,sans-serif">${lbl}</text>`:'';
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2-9}" stroke="${c}" stroke-width="1.8" stroke-dasharray="4,3"/><polygon points="${x},${y2} ${x-5},${y2-10} ${x+5},${y2-10}" fill="${c}"/>${lbEl}`;
}

/* ─── SVG TEMPLATES ─────────────────────────── */
const ARCH_SVG = {};

/* COMMON 2-tier SVG: Joule → MCP → S/4HANA */
function _commonTier1(extraNodes=''){
  return `
  ${_n(20,40,100,52,'user','👤','BestRun User','')}
  ${_a(120,66,170,66,'','')}
  ${_n(170,40,170,52,'user','💻','Joule Work Desktop','SAP Business AI Platform')}
  ${_a(340,66,390,66,'','')}
  ${_n(390,40,165,52,'user','🔄','Joule Orchestrator','BTP · AI Foundation')}
  ${_a(555,66,605,66,'MCP','')}
  ${_n(605,40,145,52,'mcp','🔌','ERP MCP Client','Agent Tool Interface')}
  ${_a(750,66,800,66,'HTTP','')}
  ${_n(800,40,150,52,'mcp','⚡','ERP MCP Server','BTP Cloud Foundry')}
  ${_a(950,66,1000,66,'OData','')}
  ${_n(1000,40,155,52,'erp','🏭','S/4HANA Cloud','ERP Backend System')}
  ${_a(1155,66,1200,66,'CDS','')}
  ${_n(1200,40,200,52,'erp','📊','CDS Views / OData API','Standard + Custom')}
  ${extraNodes}`;
}

/* Agent 1 — Inventory Aging: adds HANA PAL + Predictions row */
ARCH_SVG['agent1'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2E4A6A"/></marker></defs>
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA Backend  🟢 Data / AI Layer</text>
  ${_commonTier1()}
  ${_va(1300,92,170,'','')}
  ${_n(390,170,200,52,'ai','🤖','SAP AI Core','SAP-RPT 1.6 / LLM')}
  ${_n(640,170,195,52,'ai','📈','HANA PAL ML Model','In-Database Prediction')}
  ${_a(590,196,640,196,'Train+Infer','')}
  ${_n(890,170,210,52,'db','🗄️','HANA Cloud','Aging Prediction Results')}
  ${_a(835,196,890,196,'Store','')}
  ${_n(1155,170,215,52,'db','📧','Email Notification','SMTP Gateway')}
  ${_a(1100,196,1155,196,'Alert','')}
  ${_va(490,92,170,'','#7C4DFF')}
</svg>`;

/* Agent 2 — Discontinuation: BOM KG path */
ARCH_SVG['agent2'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA Backend  🟢 HANA Cloud Knowledge Graph</text>
  ${_commonTier1()}
  ${_va(490,92,170,'','#0EC4D1')}
  ${_n(390,170,165,52,'mcp','🔌','KG MCP Client','Knowledge Graph Agent')}
  ${_a(555,196,605,196,'SPARQL','')}
  ${_n(605,170,160,52,'mcp','⚡','KG MCP Server','BTP Cloud Foundry')}
  ${_a(765,196,815,196,'SPARQL Query','')}
  ${_n(815,170,220,52,'db','🕸️','HANA Cloud','BOM Knowledge Graph')}
  ${_a(1035,196,1085,196,'','')}
  ${_n(1085,170,230,52,'db','📋','BOM Structure','Vehicle → Part Mapping')}
  ${_va(1300,92,170,'Upload','#30914C')}
  ${_n(1155,40,200,52,'erp','🔩','AP-BOM Data','External BOM System')}
</svg>`;

/* Agent 3 — MRP Exception: ERP only */
ARCH_SVG['agent3'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="200" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA Backend (MRP 예외 데이터)</text>
  ${_n(20,50,100,52,'user','👤','BestRun User','')}
  ${_a(120,76,170,76,'','')}
  ${_n(170,50,170,52,'user','💻','Joule Work Desktop','SAP Business AI Platform')}
  ${_a(340,76,390,76,'','')}
  ${_n(390,50,165,52,'user','🔄','Joule Orchestrator','BTP · AI Foundation')}
  ${_a(555,76,605,76,'MCP','')}
  ${_n(605,50,145,52,'mcp','🔌','ERP MCP Client','AI Triage Agent')}
  ${_a(750,76,800,76,'HTTP','')}
  ${_n(800,50,150,52,'mcp','⚡','ERP MCP Server','BTP Cloud Foundry')}
  ${_a(950,76,1000,76,'OData','')}
  ${_n(1000,50,155,52,'erp','🏭','S/4HANA Cloud','ERP Backend')}
  ${_a(1155,76,1210,76,'Read/Write','')}
  ${_n(1210,50,200,52,'erp','⚙️','MRP CDS Views','I_ManufacturingOrder I_ManufacturingOrder I_MRPController')}
</svg>`;

/* Agent 4 — 3-Way Matching */
ARCH_SVG['agent4'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA PO · GR · Invoice 3-Way Match</text>
  ${_n(20,40,100,52,'user','👤','BestRun User','')}
  ${_a(120,66,170,66,'','')}
  ${_n(170,40,170,52,'user','💻','Joule Work Desktop','SAP Business AI Platform')}
  ${_a(340,66,390,66,'','')}
  ${_n(390,40,165,52,'user','🔄','Joule Orchestrator','Matching Engine')}
  ${_a(555,66,605,66,'MCP','')}
  ${_n(605,40,145,52,'mcp','🔌','ERP MCP Client','Match Agent')}
  ${_a(750,66,800,66,'HTTP','')}
  ${_n(800,40,150,52,'mcp','⚡','ERP MCP Server','BTP Cloud Foundry')}
  ${_a(950,66,1000,66,'OData','')}
  ${_n(1000,40,155,52,'erp','🏭','S/4HANA Cloud','ERP Backend')}
  ${_va(1060,92,170,'','')}
  ${_n(870,170,160,52,'erp','📄','Purchase Order','I_PurchaseOrderItemAPI01')}
  ${_n(1060,170,160,52,'erp','📦','Goods Receipt','I_MaterialDocumentItem')}
  ${_n(1250,170,160,52,'erp','🧾','Supplier Invoice','I_SupplierInvoiceAPI01')}
  ${_va(950,196,240,'','#0070F2')}
  ${_va(1140,196,240,'','#0070F2')}
  ${_va(1330,196,240,'','#0070F2')}
  ${_n(1020,240,270,52,'ai','🤖','3-Way Match AI Engine','Discrepancy Detection')}
</svg>`;

/* Agent 5 — Supplier Delivery Risk */
ARCH_SVG['agent5'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA  🟢 OTD History · Risk Scoring</text>
  ${_commonTier1()}
  ${_va(1300,92,170,'','#0EC4D1')}
  ${_n(390,170,200,52,'db','📉','OTD History DB','HANA Cloud Analytics')}
  ${_a(590,196,640,196,'Score','')}
  ${_n(640,170,200,52,'ai','🎯','Risk Scoring Engine','SAP AI Core / BTP')}
  ${_a(840,196,890,196,'','')}
  ${_n(890,170,180,52,'mcp','📧','Email Gateway','SMTP Notification')}
  ${_a(1070,196,1120,196,'Send','')}
  ${_n(1120,170,185,52,'user','🏢','Supplier','External Party')}
</svg>`;

/* Agent 6 — Demand Forecast + PR */
ARCH_SVG['agent6'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA  🟢 HANA Cloud (예측)  🟣 SAP AI Core SAP-RPT 1.6</text>
  ${_commonTier1()}
  ${_va(490,92,170,'','#7C4DFF')}
  ${_n(390,170,165,52,'mcp','🔌','RDB MCP Client','Forecast Query Agent')}
  ${_a(555,196,605,196,'SQL','')}
  ${_n(605,170,150,52,'mcp','⚡','RDB MCP Server','BTP Cloud Foundry')}
  ${_a(755,196,805,196,'Read','')}
  ${_n(805,170,220,52,'db','🗄️','HANA Cloud DB','Monthly Forecast Results')}
  ${_a(1025,196,1075,196,'','')}
  ${_n(1075,170,180,52,'ai','🤖','SAP AI Core','SAP-RPT 1.6 Tabular Model')}
  ${_a(1255,196,1305,196,'Tabular','')}
  ${_n(1305,170,110,52,'ai','📈','SAP-RPT 1.6','Demand Predict')}
</svg>`;

/* Agent 7 — Stock Transfer Optimization */
ARCH_SVG['agent7'] = `<svg xmlns="http://www.w3.org/2000/svg" width="1430" height="310" style="background:#080f18;border-radius:12px">
  <text x="20" y="22" font-size="11" fill="#3d6090" font-family="Segoe UI,sans-serif">🔵 사용자 채널  🟦 MCP Layer  🟠 S/4HANA Multi-Plant Stock  🟢 STO Auto-Generation</text>
  ${_commonTier1()}
  ${_va(1300,92,170,'','#30914C')}
  ${_n(1000,170,155,52,'erp','🏭','Plant A (Surplus)','I_MaterialStock_2')}
  ${_n(1200,170,155,52,'erp','🏭','Plant B (Shortage)','I_MaterialStock_2')}
  ${_a(1155,196,1200,196,'STO','')}
  ${_n(390,170,200,52,'ai','🔀','Stock Optimizer','Cross-Plant Balance AI')}
  ${_a(590,196,640,196,'Recommend','')}
  ${_n(640,170,195,52,'mcp','📋','STO Generator','PO (UB) & Delivery API')}
  ${_a(835,196,885,196,'POST','')}
  ${_n(885,170,165,52,'erp','✅','STO Confirmed','Transfer Order Created')}
</svg>`;

/* arch modal metadata */
const ARCH_META = {
  agent1:{title:'장기/악성 재고 관리 Agent — 아키텍처',sub:'HANA PAL 수요예측 · ERP MCP · Email Notification',badges:['Joule Work','ERP MCP Server','HANA PAL','SAP AI Core','OData API','SMTP Gateway']},
  agent2:{title:'단산 관리 Agent — 아키텍처',sub:'BOM Knowledge Graph · SPARQL · ERP MCP · External BOM',badges:['Joule Work','KG MCP Server','ERP MCP Server','HANA Cloud','Knowledge Graph','SPARQL']},
  agent3:{title:'MRP 예외 관리 Agent — 아키텍처',sub:'ERP MCP · S/4HANA MRP Exception CDS · AI Triage',badges:['Joule Work','ERP MCP Server','I_ManufacturingOrder','I_MRPController','OData API']},
  agent4:{title:'3-Way Matching Agent — 아키텍처',sub:'PO · GR · Invoice 3방향 대사 · Discrepancy AI',badges:['Joule Work','ERP MCP Server','PO CDS','GR CDS','Invoice CDS','Match Engine']},
  agent5:{title:'공급업체 납기 리스크 Agent — 아키텍처',sub:'OTD History · Risk Scoring · Supplier Notification',badges:['Joule Work','ERP MCP Server','OTD Analytics','Risk Scoring','HANA Cloud','Email Gateway']},
  agent6:{title:'수요 예측 기반 발주 추천 Agent — 아키텍처',sub:'SAP-RPT 1.6 Tabular Learning · RDB MCP · HANA Cloud',badges:['Joule Work','RDB MCP Server','SAP AI Core','SAP-RPT 1.6','HANA Cloud','Auto PR']},
  agent7:{title:'창고 재고 이동 최적화 Agent — 아키텍처',sub:'Multi-Plant Stock Balance · 구매오더(UB) · 납품 · 출고/입고',badges:['Joule Work','ERP MCP Server','I_MaterialStock_2','Stock Optimizer','Purchase Order API','Outbound Delivery']}
};

/* ─── Update all Joule avatars to ✦ ─────────── */
document.querySelectorAll('.joule-avatar').forEach(el=>{
  if(el.textContent.trim()==='J') el.textContent='✦';
});

/* ═══════════════════════════════════════════
   JOULE SPARKLE ICON — inject into all .joule-avatar
═══════════════════════════════════════════ */
(function injectJouleIcon(){
  const JOULE_SVG = `<svg viewBox="0 0 53 53" style="width:100%;height:100%;display:block" aria-label="Joule"><use href="#fi-joule"/></svg>`;
  document.querySelectorAll('.joule-avatar').forEach(el => { el.innerHTML = JOULE_SVG; });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   SAP ARCHITECTURE CENTER OFFICIAL STYLE — 7 AGENT ARCHITECTURE DIAGRAMS
═══════════════════════════════════════════════════════════════════════════ */
(function buildSAPArchCenterDiagrams(){
  const F = "font-family=\"'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif\"";

  function sapLogo(x, y, scale=1) {
    return `<g transform="translate(${x},${y}) scale(${scale})">
      <polygon points="0,0 46,0 32,22 0,22" fill="#0070F2"/>
      <text x="5" y="16" font-size="13" font-weight="900" fill="#FFFFFF" ${F} letter-spacing="0.5">SAP</text>
    </g>`;
  }

  function defs() {
    return `<defs>
      <marker id="arr-gray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#5B738B"/>
      </marker>
      <marker id="arr-gray-start" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6 Z" fill="#5B738B"/>
      </marker>
      <marker id="arr-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#0D9488"/>
      </marker>
      <marker id="arr-teal-start" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6 Z" fill="#0D9488"/>
      </marker>
      <marker id="arr-pink" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#D946EF"/>
      </marker>
      <marker id="arr-pink-start" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6 Z" fill="#D946EF"/>
      </marker>
      <marker id="arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#2E7D32"/>
      </marker>
      <marker id="arr-green-start" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6 Z" fill="#2E7D32"/>
      </marker>
      <marker id="arr-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#0070F2"/>
      </marker>
      <filter id="card-shadow" x="-3%" y="-3%" width="106%" height="108%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.06"/>
      </filter>
    </defs>`;
  }

  function pillBadge(cx, cy, text, styleType='mcp', vertical=false) {
    const styles = {
      mcp:   { fill: '#E6F4F1', stroke: '#0D9488', text: '#0F766E' },
      a2a:   { fill: '#FAE8FF', stroke: '#D946EF', text: '#A21CAF' },
      trust: { fill: '#EAF5EA', stroke: '#2E7D32', text: '#1B5E20' },
      odata: { fill: '#F1F5F9', stroke: '#64748B', text: '#334155' },
      blue:  { fill: '#EFF6FF', stroke: '#0070F2', text: '#1D4ED8' }
    };
    const st = styles[styleType] || styles.odata;
    const w = Math.max(44, text.length * 6.5 + 18);
    const h = 19;
    if (vertical) {
      return `<g transform="translate(${cx},${cy}) rotate(-90)">
        <rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="9.5" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.3"/>
        <text x="0" y="3.5" text-anchor="middle" font-size="9" font-weight="700" fill="${st.text}" ${F}>${text}</text>
      </g>`;
    }
    return `<g>
      <rect x="${cx-w/2}" y="${cy-h/2}" width="${w}" height="${h}" rx="9.5" fill="${st.fill}" stroke="${st.stroke}" stroke-width="1.3"/>
      <text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="9" font-weight="700" fill="${st.text}" ${F}>${text}</text>
    </g>`;
  }

  function pillNode(x, y, w, h, title, sub='', border='#7C3AED', fill='#FFFFFF', titleColor='#1E293B') {
    const rx = Math.min(12, h/2);
    if (!sub) {
      return `<g filter="url(#card-shadow)">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${border}" stroke-width="1.4"/>
        <text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${titleColor}" ${F}>${title}</text>
      </g>`;
    }
    return `<g filter="url(#card-shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${border}" stroke-width="1.4"/>
      <text x="${x+w/2}" y="${y+h/2-3}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${titleColor}" ${F}>${title}</text>
      <text x="${x+w/2}" y="${y+h/2+11}" text-anchor="middle" font-size="8.8" font-style="italic" fill="#475569" ${F}>${sub}</text>
    </g>`;
  }

  function buildDiagram(cfg) {
    // cfg contains agent-specific customizations on the SAP Business AI Platform canvas
    return `<svg viewBox="0 0 1440 650" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#FFFFFF;border-radius:10px;display:block;border:1px solid #E2E8F0;">
      ${defs()}

      <!-- ═══ TOP TITLE BAR ═══ -->
      <text x="28" y="34" font-size="18" font-weight="800" fill="#0F172A" ${F}>${cfg.headerTitle}</text>
      <text x="1058" y="52" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569" ${F}>Network</text>

      <!-- ═══ VERTICAL NETWORK DIVIDER LINE ═══ -->
      <line x1="1058" y1="62" x2="1058" y2="590" stroke="#334155" stroke-width="3.2" stroke-linecap="round"/>

      <!-- ═══ LEFT: USER & APPLICATION CLIENTS ═══ -->
      <!-- User Icon -->
      <g transform="translate(88, 130)">
        <circle cx="0" cy="0" r="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8"/>
        <circle cx="0" cy="-6" r="8" fill="none" stroke="#0F172A" stroke-width="2.4"/>
        <path d="M-14,15 C-14,5 14,5 14,15" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round"/>
        <text x="0" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="#0F172A" ${F}>User</text>
        <text x="0" y="51" text-anchor="middle" font-size="9" fill="#64748B" ${F}>${cfg.userRole}</text>
      </g>
      <line x1="88" y1="186" x2="88" y2="215" stroke="#5B738B" stroke-width="1.5" marker-end="url(#arr-gray)"/>

      <!-- Application Clients Box -->
      <g filter="url(#card-shadow)">
        <rect x="22" y="218" width="132" height="82" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-width="1.5"/>
        <!-- Monitor + Mobile Icon -->
        <rect x="68" y="228" width="30" height="20" rx="2" fill="none" stroke="#0F172A" stroke-width="2"/>
        <line x1="78" y1="248" x2="88" y2="248" stroke="#0F172A" stroke-width="2"/>
        <line x1="83" y1="248" x2="83" y2="253" stroke="#0F172A" stroke-width="2"/>
        <rect x="95" y="234" width="11" height="18" rx="2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8"/>
        <text x="88" y="269" text-anchor="middle" font-size="9.5" fill="#334155" ${F}>Mobile/Desktop/Web</text>
        <text x="88" y="285" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0F172A" ${F}>Application Clients</text>
      </g>

      <!-- Arrow: Application Clients -> Joule Work -->
      <line x1="154" y1="252" x2="205" y2="252" stroke="#5B738B" stroke-width="1.6" marker-end="url(#arr-gray)"/>
      <!-- Arrow: Application Clients -> Autonomous Suite -->
      <path d="M62,300 L62,515 L205,515" fill="none" stroke="#5B738B" stroke-width="1.5" marker-end="url(#arr-gray)"/>

      <!-- ═══ MAIN CONTAINER: SAP BUSINESS AI PLATFORM ═══ -->
      <rect x="190" y="66" width="836" height="352" rx="14" fill="#FAF8FF" stroke="#7C3AED" stroke-width="2"/>
      ${sapLogo(206, 78, 0.88)}
      <text x="254" y="94" font-size="14.5" font-weight="800" fill="#1E3A8A" ${F}>Business AI Platform</text>

      <!-- ── 1. SAP Business Transformation Management (Top Bar) ── -->
      <rect x="206" y="106" width="440" height="74" rx="10" fill="#F0F7FF" stroke="#0070F2" stroke-width="1.5"/>
      ${sapLogo(218, 114, 0.78)}
      <text x="260" y="128" font-size="12.5" font-weight="800" fill="#003B8E" ${F}>Business Transformation Management</text>
      ${pillNode(218, 136, 130, 34, 'SAP Signavio', cfg.btm1 || 'Process & Agent Mining', '#0070F2')}
      ${pillNode(358, 136, 130, 34, 'SAP LeanIX', cfg.btm2 || 'AI Architecture Governance', '#0070F2')}
      ${pillNode(498, 136, 136, 34, 'SAP Cloud ALM', cfg.btm3 || 'AI Observability & Eval', '#0070F2')}

      <!-- Arrow: BTM -> Joule Work -->
      <line x1="390" y1="180" x2="390" y2="196" stroke="#5B738B" stroke-width="1.4" marker-end="url(#arr-gray)"/>
      <!-- Arrow: BTM -> Discover & Govern -> Global Account & S/4HANA -->
      <path d="M646,120 L1250,120 L1250,145" fill="none" stroke="#5B738B" stroke-width="1.4" marker-end="url(#arr-gray)"/>
      <line x1="805" y1="120" x2="805" y2="136" stroke="#5B738B" stroke-width="1.4" marker-end="url(#arr-gray)"/>
      ${pillBadge(735, 120, 'Discover & Govern', 'odata')}

      <!-- ── 2. SAP Joule Work (Middle Left) ── -->
      <rect x="206" y="198" width="368" height="142" rx="12" fill="#F3EEFF" stroke="#7C3AED" stroke-width="1.6"/>
      ${sapLogo(218, 207, 0.78)}
      <text x="260" y="221" font-size="13" font-weight="800" fill="#1E3A8A" ${F}>Joule Work</text>

      <!-- Joule Studio sub-card -->
      <rect x="218" y="230" width="182" height="98" rx="9" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.3"/>
      <text x="309" y="245" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1E293B" ${F}>Joule Studio</text>
      ${pillNode(228, 251, 162, 23, cfg.agentName, '', '#7C3AED', '#F5F3FF', '#4C1D95')}
      ${pillNode(228, 279, 162, 23, cfg.extName, '', '#7C3AED', '#FFFFFF', '#1E293B')}
      <text x="309" y="318" text-anchor="middle" font-size="8.5" font-style="italic" fill="#475569" ${F}>Intent-based Development</text>

      <!-- Joule Orchestrator sub-card -->
      <rect x="410" y="230" width="152" height="62" rx="9" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.3"/>
      <text x="486" y="253" text-anchor="middle" font-size="11" font-weight="800" fill="#1E293B" ${F}>Joule Orchestrator</text>
      <text x="486" y="269" text-anchor="middle" font-size="9" font-style="italic" fill="#475569" ${F}>${cfg.orchSub || 'Agent Harness & Planner'}</text>

      <!-- Skills pill under Orchestrator -->
      ${pillNode(412, 304, 68, 24, cfg.skillBadge || 'MM Skills', '', '#7C3AED', '#FFFFFF', '#1E293B')}
      <line x1="446" y1="292" x2="446" y2="304" stroke="#5B738B" stroke-width="1.4" marker-end="url(#arr-gray)"/>

      <!-- Vertical Tools Bar (Right of Joule Work) -->
      <rect x="584" y="198" width="56" height="142" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.5"/>
      <g transform="translate(612, 269) rotate(-90)">
        <text x="0" y="-6" text-anchor="middle" font-size="10.5" font-weight="800" fill="#1E293B" ${F}>Tools</text>
        <text x="0" y="8" text-anchor="middle" font-size="8.2" font-style="italic" fill="#4C1D95" ${F}>${cfg.toolsVertical}</text>
      </g>

      <!-- ── 3. Managed Runtimes & Agent Gateway (Bottom of BAIP Left) ── -->
      <line x1="309" y1="328" x2="309" y2="354" stroke="#64748B" stroke-width="1.3" stroke-dasharray="3,3" marker-end="url(#arr-gray)"/>
      <text x="309" y="346" text-anchor="middle" font-size="8" fill="#475569" ${F}>deploy</text>

      ${pillNode(206, 356, 178, 48, 'Managed runtimes', cfg.runtimeSub || 'Joule Agents & MCP Servers', '#7C3AED', '#F3EEFF')}
      ${pillNode(442, 356, 178, 48, 'Agent Gateway', 'Discovery & Invocation of Agents', '#7C3AED', '#F3EEFF')}

      <!-- A2A & MCP between Managed runtimes and Agent Gateway -->
      <line x1="384" y1="370" x2="442" y2="370" stroke="#D946EF" stroke-width="1.5" marker-start="url(#arr-pink-start)" marker-end="url(#arr-pink)"/>
      ${pillBadge(413, 370, 'A2A', 'a2a')}
      <line x1="442" y1="392" x2="384" y2="392" stroke="#0D9488" stroke-width="1.5" marker-end="url(#arr-teal)"/>
      ${pillBadge(413, 392, 'MCP', 'mcp')}

      <!-- A2A from Orchestrator to Agent Gateway -->
      <line x1="518" y1="292" x2="518" y2="356" stroke="#D946EF" stroke-width="1.5" marker-end="url(#arr-pink)"/>
      ${pillBadge(518, 316, 'A2A', 'a2a')}

      <!-- Arrow Agent Gateway -> Tools -->
      <line x1="612" y1="356" x2="612" y2="340" stroke="#5B738B" stroke-width="1.4" marker-end="url(#arr-gray)"/>

      <!-- ── 4. BTP Global Account & Subaccount (Right side of BAIP) ── -->
      <rect x="658" y="138" width="352" height="266" rx="12" fill="#EFF8FF" stroke="#0070F2" stroke-width="1.6"/>
      <text x="672" y="156" font-size="12" font-weight="800" fill="#0F172A" ${F}>Global Account</text>
      <text x="672" y="168" font-size="8.8" font-style="italic" fill="#475569" ${F}>Customer-managed (SAP BTP)</text>

      <!-- Subaccount box -->
      <rect x="672" y="176" width="324" height="216" rx="10" fill="#FFFFFF" stroke="#475569" stroke-width="1.5"/>
      <text x="686" y="194" font-size="11.5" font-weight="800" fill="#0F172A" ${F}>Subaccount (${cfg.subaccountTitle || 'Python CF Runtime'})</text>

      <!-- Custom Agents / AI Core Box inside Subaccount -->
      <rect x="688" y="202" width="292" height="68" rx="9" fill="#F8FAFC" stroke="#0070F2" stroke-width="1.5"/>
      <text x="834" y="218" text-anchor="middle" font-size="11" font-weight="800" fill="#0F172A" ${F}>${cfg.btpAgentBoxTitle}</text>
      <rect x="702" y="224" width="264" height="38" rx="7" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.3" stroke-dasharray="3,3"/>
      <text x="834" y="240" text-anchor="middle" font-size="9.5" font-weight="700" fill="#0369A1" ${F}>${cfg.btpInner1}</text>
      <text x="834" y="253" text-anchor="middle" font-size="8.8" font-style="italic" fill="#475569" ${F}>${cfg.btpInner2}</text>

      <!-- MCP connection inside Subaccount -->
      <line x1="834" y1="270" x2="834" y2="302" stroke="#0D9488" stroke-width="1.5" marker-end="url(#arr-teal)"/>
      ${pillBadge(834, 286, 'MCP', 'mcp')}

      <!-- SAP Integration Suite / MCP Server Box inside Subaccount -->
      <rect x="688" y="302" width="292" height="78" rx="9" fill="#F0F7FF" stroke="#0070F2" stroke-width="1.5"/>
      <text x="834" y="318" text-anchor="middle" font-size="11" font-weight="800" fill="#0F172A" ${F}>${cfg.intSuiteTitle || 'SAP Integration Suite & MCP Server'}</text>
      ${pillNode(704, 324, 260, 22, cfg.mcpGateway1, '', '#0070F2', '#FFFFFF', '#0F172A')}
      ${pillNode(704, 351, 260, 22, cfg.mcpGateway2, '', '#0070F2', '#FFFFFF', '#0F172A')}

      <!-- ── 5. RIGHT SIDE: S/4HANA Cloud & HANA Cloud (Across Network Line) ── -->
      <rect x="1084" y="146" width="334" height="444" rx="14" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8"/>
      <text x="1251" y="170" text-anchor="middle" font-size="14" font-weight="800" fill="#0F172A" ${F}>${cfg.rightTitle || 'S/4HANA & HANA Cloud'}</text>

      <!-- S/4HANA Cloud OData / CDS Box -->
      <rect x="1100" y="182" width="302" height="168" rx="10" fill="#FFFFFF" stroke="#475569" stroke-width="1.5"/>
      <text x="1251" y="201" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0F172A" ${F}>${cfg.s4BoxTitle || 'S/4HANA Cloud (OData / CDS)'}</text>
      ${pillNode(1114, 210, 274, 28, cfg.cds1[0], cfg.cds1[1], '#475569', '#F8FAFC')}
      ${pillNode(1114, 244, 274, 28, cfg.cds2[0], cfg.cds2[1], '#475569', '#F8FAFC')}
      ${pillNode(1114, 278, 274, 28, cfg.cds3[0], cfg.cds3[1], '#475569', '#F8FAFC')}
      ${pillNode(1114, 312, 274, 28, cfg.cds4[0], cfg.cds4[1], '#0070F2', '#EFF6FF', '#1D4ED8')}

      <!-- HANA Cloud / AI Core / External Services Box -->
      <rect x="1100" y="364" width="302" height="168" rx="10" fill="#FFFFFF" stroke="#475569" stroke-width="1.5"/>
      <text x="1251" y="383" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0F172A" ${F}>${cfg.cloudBoxTitle}</text>
      ${pillNode(1114, 392, 274, 28, cfg.cloud1[0], cfg.cloud1[1], '#0D9488', '#F0FDFA', '#0F766E')}
      ${pillNode(1114, 426, 274, 28, cfg.cloud2[0], cfg.cloud2[1], '#7C3AED', '#FAF5FF', '#4C1D95')}
      ${pillNode(1114, 460, 274, 28, cfg.cloud3[0], cfg.cloud3[1], '#0070F2', '#EFF6FF', '#1E3A8A')}
      ${pillNode(1114, 494, 274, 28, cfg.cloud4[0], cfg.cloud4[1], '#64748B', '#F8FAFC', '#334155')}

      <!-- Partner / Identity Icon at Bottom Right -->
      <g transform="translate(1251, 556)">
        <circle cx="-8" cy="-4" r="7" fill="none" stroke="#334155" stroke-width="2"/>
        <path d="M-20,12 C-20,4 4,4 4,12" fill="none" stroke="#334155" stroke-width="2"/>
        <circle cx="8" cy="-2" r="6" fill="none" stroke="#334155" stroke-width="1.8"/>
        <path d="M-2,12 C-2,5 18,5 18,12" fill="none" stroke="#334155" stroke-width="1.8"/>
        <text x="0" y="25" text-anchor="middle" font-size="8.8" font-weight="700" fill="#475569" ${F}>${cfg.partnerLabel || 'Supplier / External Identity & SMTP'}</text>
      </g>

      <!-- ── 6. BOTTOM: SAP AUTONOMOUS SUITE & CLOUD IDENTITY ── -->
      <rect x="206" y="468" width="600" height="122" rx="12" fill="#F0F7FF" stroke="#0070F2" stroke-width="1.6"/>
      ${sapLogo(220, 478, 0.82)}
      <text x="266" y="491" font-size="13.5" font-weight="800" fill="#003B8E" ${F}>Autonomous Suite</text>
      <text x="266" y="504" font-size="9.5" font-style="italic" fill="#0057BB" ${F}>Assistants, Agents, Data, Apps (${cfg.fioriApp})</text>

      ${pillNode(222, 514, 178, 30, 'Autonomous Spend Mgmt', '', '#0070F2', cfg.highlightSpend ? '#DBEAFE' : '#FFFFFF', '#003B8E')}
      ${pillNode(416, 514, 178, 30, 'Autonomous SCM & MM', '', '#0070F2', '#DBEAFE', '#003B8E')}
      ${pillNode(610, 514, 178, 30, 'Autonomous Finance', '', '#0070F2', cfg.highlightFinance ? '#DBEAFE' : '#FFFFFF', '#003B8E')}

      ${pillNode(222, 550, 178, 30, cfg.suiteBtn1, '', '#0070F2', '#FFFFFF', '#1E293B')}
      ${pillNode(416, 550, 178, 30, cfg.suiteBtn2, '', '#0070F2', '#FFFFFF', '#1E293B')}
      ${pillNode(610, 550, 178, 30, cfg.suiteBtn3, '', '#0070F2', '#FFFFFF', '#1E293B')}

      <!-- Provision & Deploy arrows between Managed runtimes and Autonomous Suite -->
      <line x1="255" y1="468" x2="255" y2="404" stroke="#64748B" stroke-width="1.3" stroke-dasharray="3,3" marker-end="url(#arr-gray)"/>
      <text x="248" y="434" text-anchor="end" font-size="8" fill="#475569" ${F}>Provision Assistants,</text>
      <text x="248" y="444" text-anchor="end" font-size="8" fill="#475569" ${F}>Agents &amp; MCP Servers</text>
      <line x1="325" y1="404" x2="325" y2="468" stroke="#5B738B" stroke-width="1.5" marker-end="url(#arr-gray)"/>

      <!-- SAP Cloud Identity Services Circle -->
      <g transform="translate(925, 520)">
        <circle cx="0" cy="0" r="26" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
        <circle cx="-4" cy="-5" r="6" fill="none" stroke="#0070F2" stroke-width="2"/>
        <path d="M-14,10 C-14,2 6,2 6,10" fill="none" stroke="#0070F2" stroke-width="2"/>
        <path d="M6,-4 A10,10 0 0,1 14,6 M3,0 A6,6 0 0,1 9,6" fill="none" stroke="#0070F2" stroke-width="1.8" stroke-linecap="round"/>
        <text x="0" y="38" text-anchor="middle" font-size="10" font-weight="800" fill="#0F172A" ${F}>SAP Cloud</text>
        <text x="0" y="50" text-anchor="middle" font-size="10" font-weight="800" fill="#0F172A" ${F}>Identity Services</text>
      </g>

      <!-- ── 7. CROSS-SYSTEM PROTOCOL LINES (MCP, A2A, ODATA/REST, TRUST) ── -->
      <!-- Magenta A2A line: Agent Gateway -> Custom Agents & Integration Suite & External -->
      <path d="M560,404 L560,432 L664,432 L664,236 L688,236" fill="none" stroke="#D946EF" stroke-width="1.5" marker-end="url(#arr-pink)"/>
      <path d="M664,335 L688,335" fill="none" stroke="#D946EF" stroke-width="1.5" marker-end="url(#arr-pink)"/>
      <path d="M560,432 L1100,432" fill="none" stroke="#D946EF" stroke-width="1.5" marker-start="url(#arr-pink-start)" marker-end="url(#arr-pink)"/>
      ${pillBadge(612, 432, 'A2A', 'a2a')}

      <!-- Teal MCP line: Agent Gateway -> External MCP / S4 -->
      <path d="M620,380 L650,380 L650,286 L1032,286 L1032,224 L1100,224" fill="none" stroke="#0D9488" stroke-width="1.5" marker-end="url(#arr-teal)"/>
      <path d="M980,350 L1100,350" fill="none" stroke="#0D9488" stroke-width="1.5" marker-start="url(#arr-teal-start)"/>
      ${pillBadge(1042, 350, 'MCP', 'mcp')}

      <!-- Gray ODATA / REST line: Subaccount -> Autonomous Suite & S/4HANA Cloud -->
      <line x1="760" y1="380" x2="760" y2="468" stroke="#5B738B" stroke-width="1.5" marker-end="url(#arr-gray)"/>
      ${pillBadge(760, 412, 'ODATA / REST', 'odata')}

      <path d="M980,335 L1042,335 L1042,260 L1100,260" fill="none" stroke="#5B738B" stroke-width="1.5" marker-end="url(#arr-gray)"/>
      ${pillBadge(1042, 298, 'ODATA / REST', 'odata', true)}

      <!-- Green Authenticate & Trust lines -->
      <path d="M112,300 L112,450 L925,450 L925,494" fill="none" stroke="#2E7D32" stroke-width="1.6" marker-end="url(#arr-green)"/>
      <line x1="485" y1="404" x2="485" y2="450" stroke="#2E7D32" stroke-width="1.6"/>
      <line x1="885" y1="392" x2="885" y2="450" stroke="#2E7D32" stroke-width="1.6"/>
      <line x1="560" y1="450" x2="560" y2="468" stroke="#2E7D32" stroke-width="1.6"/>
      ${pillBadge(385, 450, 'Authenticate', 'trust')}
      ${pillBadge(485, 422, 'Trust', 'trust')}
      ${pillBadge(885, 412, 'Trust', 'trust')}
      ${pillBadge(560, 468, 'Trust', 'trust')}

      <!-- Trust line between Cloud Identity and Partner/Supplier -->
      <line x1="951" y1="520" x2="1215" y2="520" stroke="#2E7D32" stroke-width="1.6" marker-start="url(#arr-green-start)" marker-end="url(#arr-green)"/>
      ${pillBadge(1058, 520, 'Trust', 'trust')}

      <!-- ═══ BOTTOM FOOTER (SAP ARCHITECTURE CENTER BRANDING) ═══ -->
      <line x1="22" y1="604" x2="1418" y2="604" stroke="#E2E8F0" stroke-width="1"/>
      ${sapLogo(28, 614, 1.05)}
      <text x="86" y="625" font-size="12.5" font-weight="800" fill="#0F172A" ${F}>Architecture Center</text>
      <text x="86" y="639" font-size="9.5" font-style="italic" fill="#64748B" ${F}>SAP S/4HANA MM Agentic AI Reference Architecture</text>
      <text x="720" y="633" text-anchor="middle" font-size="10.5" font-weight="600" fill="#475569" ${F}>${cfg.docCode}</text>
      <text x="1412" y="633" text-anchor="end" font-size="10" font-weight="700" fill="#0070F2" ${F}>BestRun Korea · MM AI Demo</text>
    </svg>`;
  }

  const CONFIGS = {
    agent1: {
      headerTitle: '01. Inventory Aging Agent on SAP Business AI Platform',
      userRole: '자재/재고 관리자',
      agentName: 'Inventory Aging Agent',
      extName: 'PO Block & Alert Extension',
      orchSub: 'Aging Detection & Action Planner',
      skillBadge: 'Aging Skill',
      toolsVertical: 'Stock CDS (I_StockQuantityCurrentValue_2), HANA PAL',
      runtimeSub: 'Aging Batch & MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (Inventory Aging)',
      btpInner1: 'SAP Cloud SDK for AI & Generative AI Hub',
      btpInner2: 'Monthly Aging Batch + HANA PAL Demand Forecast',
      mcpGateway1: 'ERP MCP Server (Stock & PO Control)',
      mcpGateway2: 'A2A & SMTP Alert Connectivity',
      rightTitle: 'S/4HANA Cloud & HANA Cloud',
      s4BoxTitle: 'S/4HANA Cloud (OData / CDS Views)',
      cds1: ['I_MaterialStock_2', '플랜트 1050/1060/1070 실시간 재고 현황'],
      cds2: ['I_MaterialDocumentItem_2', '최근 6개월 자재 입출고 및 소요량 추이'],
      cds3: ['I_StockQuantityCurrentValue_2 (Aging)', '장기/악성 재고 전환 예정일 및 금액 산정'],
      cds4: ['I_PurchaseOrder / I_PurchaseRequisition', '미입고 PO 15건 Block · PO 미전환 PR 2건 보류'],
      cloudBoxTitle: 'HANA Cloud & SAP AI Core Services',
      cloud1: ['HANA PAL In-Database ML', '향후 1개월 소요 감소 및 장기재고 전환 예측 (총 112.5M)'],
      cloud2: ['Aging Prediction Store (HANA Cloud)', '품목별 전환 위험도(High/Mid) 및 금액 캐싱'],
      cloud3: ['A2A: 단산 관리 Agent 연계', 'BC3 단산 전용 부품(432B·431A 등)을 악성재고 위험에 반영'],
      cloud4: ['SMTP Email Notification Gateway', 'PR 보류/승인 대기 건 담당자 알림 발송'],
      fioriApp: '구매오더 관리 · 재고 - 단일 자재',
      highlightSpend: true,
      highlightFinance: false,
      suiteBtn1: 'Inventory Aging Analysis',
      suiteBtn2: 'Automated PO Block Control',
      suiteBtn3: 'Consumption Trend Monitor',
      docCode: 'MM-AI-ARCH-01 (Inventory Aging)'
    },
    agent2: {
      headerTitle: '02. BOM Discontinuation Agent on SAP Business AI Platform',
      userRole: '구매/개발 담당자',
      agentName: 'BOM Discontinuation Agent',
      extName: 'SPARQL KG & Supplier Mail Ext.',
      orchSub: 'Graph Traversal & PO Impact Harness',
      skillBadge: 'BOM KG Skill',
      toolsVertical: 'BOM Knowledge Graph, SPARQL, Product API',
      runtimeSub: 'ERP MCP & KG MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (BOM & Discontinuation)',
      btpInner1: 'SAP Cloud SDK for AI & KG Query Tool',
      btpInner2: 'SPARQL Generator + AP-BOM Explosion Analyzer',
      mcpGateway1: 'KG MCP Server (HANA Cloud Graph)',
      mcpGateway2: 'ERP MCP Server (Stock & PO Cancel)',
      rightTitle: 'S/4HANA & HANA Cloud Knowledge Graph',
      s4BoxTitle: 'S/4HANA Cloud (BOM & PO OData)',
      cds1: ['I_BillOfMaterialStatus / CS15', '차종-완제품-하위부품 BOM 역전개 API'],
      cds2: ['I_MaterialStock_2', '단산 대상 유니크 부품 현재고 조회'],
      cds3: ['I_PurOrdScheduleLineAPI01', '431A 미입고 PO 4500018721·4500019105 취소 가능성'],
      cds4: ['AP-BOM Vehicle Mapping Table', 'BC3 단산 차종 전용 부품 매핑 마스터'],
      cloudBoxTitle: 'HANA Cloud Knowledge Graph & AI',
      cloud1: ['HANA Cloud Triple Store (BOM KG)', '차종-완제품-부품 온톨로지 그래프 저장소'],
      cloud2: ['SPARQL Graph Query Engine', '타 차종 미사용 유니크 부품(28개) 고속 식별'],
      cloud3: ['A2A: 장기/악성 재고 Agent 연계', '식별된 BC3 전용 부품 28개를 악성재고 예측 대상에 전달'],
      cloud4: ['Supplier Email Draft & Gateway', '9개 협력사 맞춤형 단산 안내 및 PO 조정 발송'],
      fioriApp: '자재 BOM 표시 · 구매오더 관리',
      highlightSpend: true,
      highlightFinance: false,
      suiteBtn1: 'BOM Reverse Explosion (KG)',
      suiteBtn2: 'Unique Part Risk Scoring',
      suiteBtn3: 'Supplier Discontinuation Notice',
      docCode: 'MM-AI-ARCH-02 (BOM Knowledge Graph)'
    },
    agent3: {
      headerTitle: '03. MRP Exception Triage Agent on SAP Business AI Platform',
      userRole: '생산계획 / MRP 컨트롤러',
      agentName: 'MRP Exception Triage Agent',
      extName: 'Reschedule Request & Confirmation Ext.',
      orchSub: 'Exception Prioritization & Action Planner',
      skillBadge: 'MRP Skill',
      toolsVertical: 'MRP Controller CDS, Mfg Order, Reschedule API',
      runtimeSub: 'MRP Triage & ERP MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (MRP AI Triage Engine)',
      btpInner1: 'SAP Cloud SDK for AI & Generative AI Hub',
      btpInner2: '234 MRP Exceptions Triage (SAP 예외 06/10/15/20/96)',
      mcpGateway1: 'ERP MCP Server (MRP & PO Schedule)',
      mcpGateway2: 'A2A Corrective Action Recommender',
      rightTitle: 'S/4HANA Cloud & AI Triage Services',
      s4BoxTitle: 'S/4HANA Cloud (MRP & Mfg CDS)',
      cds1: ['I_MRPController', '플랜트 1050 MRP 예외 메시지 실시간 수집'],
      cds2: ['I_ManufacturingOrder', '제조오더(MO-26-0891) 일정 충돌 및 부족 분석'],
      cds3: ['I_PurOrdScheduleLineAPI01', '구매오더 납기 스케줄 라인 조회 및 변경'],
      cds4: ['Purchase Order API (A_PurchaseOrder)', 'PO 4500019234 납기 3일 단축 요청 · 확약(AB) 후 확정'],
      cloudBoxTitle: 'SAP AI Core & Multi-Option Analyzer',
      cloud1: ['AI Exception Triage & Option Analyzer', 'Top 12 선별 · 대응 옵션 3개 비용·시간·성공확률 비교'],
      cloud2: ['Supplier Lead-Time & OTD Analyzer', 'ACME 리드타임 18일 · OTD 88% 기반 단축 가능성 검증'],
      cloud3: ['Cross-Plant Stock Alternative Check', '1060 여유재고 80 EA를 백업 옵션으로 확보'],
      cloud4: ['A2A: 재고 이동 최적화 Agent 연계', '확약 회신 시 자동 확정 · 미회신 시 STO 전환'],
      fioriApp: '구매오더 관리 · 자재 MRP 모니터링',
      highlightSpend: false,
      highlightFinance: false,
      suiteBtn1: 'AI MRP Exception Triage',
      suiteBtn2: 'PO Reschedule & Supplier Confirmation',
      suiteBtn3: 'Manufacturing Order Protection',
      docCode: 'MM-AI-ARCH-03 (MRP Exception Mgmt)'
    },
    agent4: {
      headerTitle: '04. 3-Way Matching Exception Agent on SAP Business AI Platform',
      userRole: '구매정산 / AP 회계 담당자',
      agentName: '3-Way Matching Agent',
      extName: 'Contract Verification & FI Post Ext.',
      orchSub: 'PO-GR-Invoice Reconciliation Harness',
      skillBadge: 'Match Skill',
      toolsVertical: 'PO Item, Goods Receipt, Supplier Invoice, Contract',
      runtimeSub: '3-Way Match & FI Posting Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (Document Matching Engine)',
      btpInner1: 'SAP Cloud SDK for AI & Generative AI Hub',
      btpInner2: '847 Invoices Automated 3-Way Verification',
      mcpGateway1: 'ERP MCP Server (MM-IV & FI Integration)',
      mcpGateway2: 'A2A Discrepancy Cause Classifier',
      rightTitle: 'S/4HANA (MM-PUR · MM-IV · FI)',
      s4BoxTitle: 'S/4HANA 3-Way Matching Document CDS',
      cds1: ['I_PurchaseOrderItemAPI01 (PO)', '구매오더 발주 수량 및 단가 조회'],
      cds2: ['I_MaterialDocumentItem_2 (GR)', '실제 입고 수량 및 입고전표 대사'],
      cds3: ['I_SupplierInvoiceAPI01 (Invoice)', '공급업체 청구 송장 금액 및 세액 대사'],
      cds4: ['I_PurchaseContractAPI01 (Contract)', '단가 불일치 시 구매계약(PA-2026-112) 갱신 대조'],
      cloudBoxTitle: 'AI Discrepancy Engine & Invoice Release',
      cloud1: ['Root-Cause Classification AI', '단가불일치·수량부족·추가요금·중복청구 자동 분류'],
      cloud2: ['Payment Block Release & PO Price Update', '계약 갱신가 근거 지급보류(R) 해제 · 미입고분 PO 단가 갱신'],
      cloud3: ['Invoice Posting (분개 유형 RE)', '회계전표 5100003421 · 13.8M (GR/IR + 가격차이)'],
      cloud4: ['Root-Cause Expansion', '같은 계약 미반영 PO 3건 선제 탐지 · 다음 달 보류 4.2M 예방'],
      fioriApp: '분개 관리 · 공급업체 송장 관리',
      highlightSpend: true,
      highlightFinance: true,
      suiteBtn1: 'PO-GR-Invoice 3-Way Match',
      suiteBtn2: 'Contract Price Audit AI',
      suiteBtn3: 'Invoice Release & Root-Cause Fix',
      docCode: 'MM-AI-ARCH-04 (3-Way Matching)'
    },
    agent5: {
      headerTitle: '05. Supplier Delivery Risk Agent on SAP Business AI Platform',
      userRole: '구매/조달 리스크 관리자',
      agentName: 'Supplier Delivery Risk Agent',
      extName: 'OTD Scoring & Expediting Mail Ext.',
      orchSub: '4-Factor Risk Scoring & Alert Harness',
      skillBadge: 'Risk Skill',
      toolsVertical: 'OTD History DB, Schedule Line, Supplier Master',
      runtimeSub: 'Risk Scoring & Email MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (Supplier Risk Engine)',
      btpInner1: 'SAP Cloud SDK for AI & Risk Scoring Algorithm',
      btpInner2: 'F1(OTD 40%) + F2(Trend 25%) + F3(Urgency 20%) + F4(Confirm 15%)',
      mcpGateway1: 'ERP MCP Server (Schedule Line & Supplier)',
      mcpGateway2: 'Automated Expediting Email Gateway',
      rightTitle: 'S/4HANA Cloud & HANA Cloud OTD DB',
      s4BoxTitle: 'S/4HANA Cloud (Purchasing OData)',
      cds1: ['I_PurOrdScheduleLineAPI01', '납기 예정일(D-Day) 및 미입고 수량 실시간 추적'],
      cds2: ['I_PurchaseOrder (Confirmation AB)', '공급업체 납기 확인(Order Ack) 여부 점검'],
      cds3: ['I_Supplier / I_SupplierPurchasingOrg', '47개 활성 공급업체 마스터 및 담당자 연락처'],
      cds4: ['A2A: MRP 예외 · 재고 이동 Agent 연계', '미회신 시 1060 재고 이전(STO) 등 대체 조달 검토'],
      cloudBoxTitle: 'HANA Cloud OTD Analytics & Notification',
      cloud1: ['HANA Cloud OTD History Store', '공급업체별 최근 6개월 납기 준수율 시계열 DB'],
      cloud2: ['Linear Regression Delay Trend Engine', '최근 3건 납기 지연 기울기 분석(악화/보통/개선)'],
      cloud3: ['Real-time Risk Score (0~100점)', 'Delta Co. 75.2점 High → Joule 선제 경보 푸시'],
      cloud4: ['Generative AI Expediting Mailer', '납기 독촉 메일 초안 자동 생성 및 회신 타이머'],
      fioriApp: '공급업체 평가 · 구매오더 관리',
      highlightSpend: true,
      highlightFinance: false,
      suiteBtn1: '4-Factor OTD Risk Scoring',
      suiteBtn2: 'Predictive Delay Early Warning',
      suiteBtn3: 'Automated Supplier Expediting',
      docCode: 'MM-AI-ARCH-05 (Supplier Delivery Risk)'
    },
    agent6: {
      headerTitle: '06. Demand-Driven Ordering Agent on SAP Business AI Platform',
      userRole: '수요계획 / 자재 발주 담당자',
      agentName: 'Demand Forecast Agent',
      extName: 'SAP-RPT 1.6 Forecast & Auto-PR Ext.',
      orchSub: 'Tabular Tabular Forecast & PR Planner',
      skillBadge: 'SAP-RPT 1.6 Skill',
      toolsVertical: 'SAP SAP-RPT 1.6, HANA Cloud RDB, Purchase Req API',
      runtimeSub: 'ERP MCP & RDB MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (Demand Forecast & Auto-PR)',
      btpInner1: 'SAP AI Core — SAP SAP-RPT 1.6 Large Foundation Model',
      btpInner2: '24 months of consumption history → aggregated input',
      mcpGateway1: 'RDB MCP Server (HANA Cloud Forecast DB)',
      mcpGateway2: 'ERP MCP Server (Stock GAP & Purchase Requisition API)',
      rightTitle: 'S/4HANA Cloud & HANA Cloud / AI Core',
      s4BoxTitle: 'S/4HANA Cloud (Inventory & PR OData)',
      cds1: ['I_MaterialDocumentItem_2 (24개월 이력)', '상위 200개 자재 과거 24개월 소비 패턴 추출'],
      cds2: ['I_MaterialStock_2 & Open PO / STO', '현재고 + 미입고 PO 95 EA + STO 입고 예정 40 EA 대조'],
      cds3: ['I_ProductPlant (Safety Stock & Lot)', '자재별 안전재고 기준 및 최소 발주량(MOQ) 반영'],
      cds4: ['Purchase Requisition API', '구매요청 10008976 · 8개 품목 · 127.7M 자동 생성'],
      cloudBoxTitle: 'SAP AI Core (SAP-RPT 1.6) & HANA Cloud DB',
      cloud1: ['SAP SAP-RPT 1.6 Large Tabular AI', '별도 모델 재학습 없이 Tabular 수요 예측 수행'],
      cloud2: ['HANA Cloud Prediction Results DB', '자재별 익월 예측 소요량 및 평균 신뢰도(85%) 저장'],
      cloud3: ['Net Shortage & Order Qty Optimizer', '예측수요 − (현재고 + 미입고 PO + STO) 순부족량 · 이중 발주 방지'],
      cloud4: ['Flexible Workflow & Supplier Recommender', '희망 공급업체 제안 및 구매팀장 승인 라우팅'],
      fioriApp: '구매요청 관리',
      highlightSpend: true,
      highlightFinance: false,
      suiteBtn1: 'SAP SAP-RPT 1.6 Demand Forecast',
      suiteBtn2: 'Automated Stock Gap Analysis',
      suiteBtn3: 'One-Click PR Generation',
      docCode: 'MM-AI-ARCH-06 (Demand-Driven Ordering)'
    },
    agent7: {
      headerTitle: '07. Stock Transfer Optimization Agent on SAP Business AI Platform',
      userRole: '물류 / 멀티플랜트 재고 관리자',
      agentName: 'Stock Transfer Optimizer',
      extName: 'Cross-Plant Balance & STO Ext.',
      orchSub: 'Multi-Plant Surplus/Shortage Matcher',
      skillBadge: 'STO Skill',
      toolsVertical: 'Stock CDS, PO (UB), Delivery',
      runtimeSub: 'Stock Optimizer & STO MCP Runtimes',
      subaccountTitle: 'Python CF Runtime',
      btpAgentBoxTitle: 'Custom Agents (Cross-Plant Stock Optimizer)',
      btpInner1: 'SAP Cloud SDK for AI & Transfer Matching Engine',
      btpInner2: 'Plant 1050 / 1060 / 1070 Imbalance Optimization',
      mcpGateway1: 'ERP MCP Server (Multi-Plant Stock Query)',
      mcpGateway2: 'PO (UB) · Outbound Delivery · GI 641 / GR 101',
      rightTitle: 'S/4HANA Multi-Plant Logistics & Execution',
      s4BoxTitle: 'S/4HANA Cloud (Multi-Plant Stock CDS)',
      cds1: ['I_MaterialStock_2 (Plant 1050 부산)', '부족 재고 탐지 (A-4315 현재 45EA / 필요 85EA)'],
      cds2: ['I_MaterialStock_2 (Plant 1060 인천)', '과잉 잉여재고 탐지 (현재 140EA / 잉여 +80EA)'],
      cds3: ['I_MaterialStock_2 (Plant 1070 수원)', '권역별 적정 재고 균형 및 안전재고 모니터링'],
      cds4: ['I_Plant & I_StorageLocation', '출하지점 1060 · 저장위치 0001 이동 경로 검증'],
      cloudBoxTitle: 'AI Transfer Matcher & STO Execution',
      cloud1: ['Cross-Plant Imbalance Optimization AI', '외부 긴급조달 대신 내부 잉여재고 최적 매칭'],
      cloud2: ['Cost & Lead-Time Benefit Calculator', 'A-4315 이전 4.2M 절감 (추천 5건 합계 12.3M) 산출'],
      cloud3: ['Purchase Order API (문서 유형 UB)', '재고 이전 오더 = 구매오더 4500019567 생성'],
      cloud4: ['Outbound Delivery & Goods Movement', '납품 80012345 → 출고 641 → 입고 101'],
      fioriApp: '구매오더 관리 · 자재 문서',
      highlightSpend: false,
      highlightFinance: false,
      suiteBtn1: 'Multi-Plant Imbalance Detection',
      suiteBtn2: 'Optimal STO Route Matching',
      suiteBtn3: 'STO Delivery & Goods Movement',
      docCode: 'MM-AI-ARCH-07 (Stock Transfer Optimization)'
    }
  };

  window.AGENT_ARCH = window.AGENT_ARCH || {};
  Object.keys(CONFIGS).forEach(k => {
    window.AGENT_ARCH[k] = buildDiagram(CONFIGS[k]);
  });

  Object.assign(window.ARCH_MODAL_META, {
      agent1:{title:'01. 장기/악성 재고 관리 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · ERP MCP · HANA PAL · S/4HANA OData',badges:['SAP Business AI Platform','Joule Work','ERP MCP Server','HANA PAL','S/4HANA OData','SMTP Alert']},
      agent2:{title:'02. 단산 관리 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · KG MCP · HANA Cloud Knowledge Graph · SPARQL',badges:['SAP Business AI Platform','Joule Work','KG MCP Server','BOM Knowledge Graph','SPARQL','ERP MCP']},
      agent3:{title:'03. MRP 예외 관리 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · AI Triage Engine · S/4HANA MRP & 구매오더 API',badges:['SAP Business AI Platform','Joule Work','AI Triage','ERP MCP Server','MRP CDS','Purchase Order API']},
      agent4:{title:'04. 3-Way Matching 예외 처리 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · PO-GR-Invoice Matching · 지급보류 해제 & 송장 전기',badges:['SAP Business AI Platform','Joule Work','3-Way Match AI','ERP MCP Server','PO/GR/Invoice CDS','Supplier Invoice API']},
      agent5:{title:'05. 공급업체 납기 리스크 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · 4-Factor OTD Risk Scoring · HANA Cloud',badges:['SAP Business AI Platform','Joule Work','Risk Scoring Engine','HANA Cloud OTD DB','ERP MCP','Email Gateway']},
      agent6:{title:'06. 수요 예측 기반 발주 추천 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule · SAP AI Core (SAP-RPT 1.6 Large) · SAP HANA Cloud · 구매요청 · Flexible Workflow',badges:['SAP Business AI Platform','Joule Work','SAP AI Core · SAP-RPT 1.6','SAP HANA Cloud','Flexible Workflow','Purchase Requisition API']},
      agent7:{title:'07. 창고 재고 이동 최적화 Agent — 아키텍처',subtitle:'SAP Business AI Platform · Joule Work · Multi-Plant Stock Optimizer · 구매오더(UB) · 납품 · 출고/입고',badges:['SAP Business AI Platform','Joule Work','Stock Optimizer AI','ERP MCP Server','Multi-Plant CDS','PO (UB) & Delivery API']}
    });

  console.log('✅ SAP Architecture Center style diagrams built for all 7 agents.');
})();

/* ═══════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════ */
function toggleTheme() {
  const body = document.body;
  const btn  = document.getElementById('btn-theme');
  const isLight = body.classList.toggle('light');
  if (btn) btn.textContent = isLight ? '🌙 다크' : '☀️ 라이트';
  try { localStorage.setItem('sap-demo-theme', isLight ? 'light' : 'dark'); } catch(e){}
}
// Restore saved theme on load
(function() {
  try {
    /* Joule Spaces 테마는 단일 라이트 테마로 고정 */
    {
      document.body.classList.add('light');
      const btn = document.getElementById('btn-theme');
      if (btn) btn.textContent = '🌙 다크';
    }
  } catch(e){}
})();

/* ═══════════════ RICH DASHBOARD PATCHES ═══════════════ */
/* Injects per-agent, per-step rich dashboard HTML        */
(function patchDashboards(){

/* helper: monkey-patch addResultCard + reset per agent */
function patch(agentId, cards){
  const p = demoPlayers[agentId]; if(!p) return;
  let n=0;
  const orig=p.addResultCard.bind(p), origReset=p.reset.bind(p);
  p.addResultCard = h => { orig(n<cards.length?cards[n++]:h); };
  p.reset = ()=>{ n=0; origReset(); };
}

/* ── shared helpers ─────────────────────────────── */
const kv=(val,lbl,col,sub='')=>`<div class="db-kpi" style="--db-acc:${col}"><div class="db-kpi-lbl">${lbl}</div><div class="db-kpi-val" style="color:${col}">${val}</div>${sub?`<div class="db-kpi-sub">${sub}</div>`:''}</div>`;
const bar=(lbl,w,col,amt)=>`<div class="db-bar-row"><div class="db-bar-lbl"><span>${lbl}</span><span style="color:${col};font-weight:700">${amt}</span></div><div class="db-bar-trk"><div class="db-bar-fill" style="width:${w}%;background:${col}"></div></div></div>`;
const donut=(pct,col,label)=>`<svg viewBox="0 0 80 80" width="72" height="72" style="flex-shrink:0"><circle cx="40" cy="40" r="28" fill="none" stroke="var(--sap-border)" stroke-width="14"/><circle cx="40" cy="40" r="28" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${(pct*175.9/100).toFixed(1)} ${(175.9-pct*175.9/100).toFixed(1)}" transform="rotate(-90 40 40)"/><text x="40" y="43" text-anchor="middle" font-size="14" font-weight="800" fill="${col}">${pct}%</text><text x="40" y="57" text-anchor="middle" font-size="8.5" fill="var(--sap-text-muted)">${label}</text></svg>`;
const spark=(pts,col)=>`<svg viewBox="0 0 180 50" style="width:100%;height:50px"><defs><linearGradient id="sfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity=".3"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><polygon points="${pts},50 0,50" fill="url(#sfg)"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
const hdr=(icon,title,sub)=>`<div class="db-hdr"><span class="db-hdr-icon">${icon}</span><div><div class="db-hdr-title">${title}</div><div class="db-hdr-sub">${sub}</div></div></div>`;
const seg=(items)=>`<div class="db-seg-wrap">${items.map(([w,c,t])=>`<div class="db-seg" style="flex:${w};background:${c}" title="${t}"></div>`).join('')}</div><div class="db-seg-legend">${items.map(([,c,t])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}</div>`;

/* ═══ AGENT 1 — Inventory Aging ═══ */
patch('agent1',[
/* card 0: Aging Analysis */
`<div class="db-card">
${hdr('📦','Inventory Aging 대시보드','플랜트 1050 · '+demoMon(1,'ykr')+' 전환 예상 품목')}
<div class="db-kpi-row">
${kv('4건','🔴 High Risk','#ff4444','후속 자재 1건 · BOM 종료 3건')}
${kv('112.5M','총 장기재고 금액','#ff9a3c','↑ 12.4M원')}
${kv('10건','전환 예상 (1M 내)','#5aafff','이달 확정')}
${kv('16건','Block 대상 PO','#4cde72','미입고 PO')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
  <div class="db-chart-ttl">💰 금액 기준 Top 5 품목 (백만원)</div>
${bar('432B BC3 전용 센서',100,'#BB0000','26.4M')}
${bar('431A 특수 가스켓',68,'#BB0000','18.0M')}
${bar('431C 전용 브래킷',48,'#BB0000','12.8M')}
${bar('435D 전용 마운팅 킷',36,'#E9730C','9.6M')}
${bar('K-7720 구형 와이어링 하네스',32,'#E9730C','8.4M')}
</div>
<div class="db-row" style="margin-top:12px;align-items:center;gap:16px">
${donut(40,'#BB0000','High Risk')}
<div style="flex:1">
${seg([[4,'#BB0000','High (4건)'],[4,'#E9730C','Med (4건)'],[2,'#30914C','Low (2건)']])}
<div class="db-insight">⚠️ AI 분석: 전체의 <strong style="color:#ff4444">40%</strong>가 High Risk — BC3 BOM 종료 예정 3건 + <strong>후속 자재가 지정돼 소요가 급감한 K-7720</strong>. 즉각 PO Block 조치 권고</div>
</div>
</div></div>`,

/* card 1: PO Block Result */
`<div class="db-card">
${hdr('🚫','PO Block 처리 결과','플랜트 1050 · 18건 처리')}
<div class="db-kpi-row">
${kv('15건','✅ Block 완료','#4cde72','42.3M · 수수료 1.2M')}
${kv('2건','📝 PR 보류','#ff9a3c','PO 미전환 PR')}
${kv('1건','⏳ 승인 필요','#ff9a3c','8.1M원 대기')}
</div>
<div class="db-row" style="margin-top:12px;align-items:center;gap:16px">
${donut(83,'#30914C','완료율')}
<div style="flex:1">
<div class="db-chart-ttl" style="margin-bottom:8px">금액 보호 현황</div>
${bar('Block 완료 (42.3M)',84,'#30914C','84%')}
${bar('승인 대기 (8.1M)',16,'#E9730C','16%')}
<div class="db-insight" style="margin-top:8px">✅ 총 <strong>50.4M원</strong> 중 <strong style="color:#4cde72">42.3M원(84%)</strong> 즉시 보호 · 취소 수수료 1.2M 차감 시 <strong>순 41.1M원</strong></div>
</div>
</div></div>`
]);

/* ═══ AGENT 2 — BOM Discontinuation ═══ */
patch('agent2',[
/* card 0: Unique Parts Overview */
`<div class="db-card">
${hdr('🔩','단산 관리 대시보드','BC3 차종 · BOM 역전개 완료')}
<div class="db-kpi-row">
${kv('28건','유니크 부품 총수','#5aafff','BC3 전용')}
${kv('12건','🔴 High Risk','#ff4444','즉시 대응 필요')}
${kv('9개사','관련 공급업체','#A78BFA','BestRun 협력사')}
${kv('19개','총 영향 재고 개수','#ff9a3c','28개 부품 중 재고 보유')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
  <div class="db-chart-ttl">🔩 위험도별 유니크 부품 분포</div>
  <div class="db-row" style="align-items:center;gap:16px;margin-top:6px">
  ${donut(43,'#BB0000','High Risk')}
  <div style="flex:1">
  ${bar('🔴 High Risk (입고 200EA↑)',100,'#BB0000','12건')}
  ${bar('🟠 Medium (입고 100~200EA)',72,'#E9730C','8건')}
  ${bar('🟡 Low (입고 100EA 미만)',28,'#30914C','8건')}
  </div>
  </div>
</div>
<div class="db-insight" style="margin-top:10px">📌 단산일(${demoMD(2,0,'iso')}) 기준 <strong>입고 예정 물량 전체</strong>에 대한 PO 검토 필요</div></div>`,

/* card 1: Mail status */
`<div class="db-card">
${hdr('✉️','공급업체 메일 발송 현황','BC3 단산 안내 · 9개사')}
<div class="db-kpi-row">
${kv('9개사','발송 대상','#5aafff','')}
${kv('9건','메일 초안 생성','#A78BFA','AI 작성')}
${kv('<span class="a2-sent">0</span>건','발송 완료','#30914C','<span class="a2-sent-sub">승인 대기</span>')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📋 공급업체별 영향 부품 수</div>
${bar('Supplier A (431A, 431B)',100,'#7C3AED','5건')}
${bar('Supplier B (431C)',72,'#7C3AED','3건')}
${bar('Supplier C (431D)',56,'#7C3AED','2건')}
${bar('Supplier D~I',30,'#A78BFA','각 1건')}
</div>
<div class="db-insight a2-mail-ins" style="margin-top:10px">⚖️ 메일 초안 검토 후 <strong>일괄 승인 발송</strong> 가능 · 예상 소요시간 3분</div></div>`
]);

/* ═══ AGENT 3 — MRP Exception ═══ */
patch('agent3',[
/* card 0: Exception Overview */
`<div class="db-card">
${hdr('⚡','MRP 예외 관리 대시보드','플랜트 1050 · AI 자동 트리아지')}
<div class="db-kpi-row">
${kv('234건','총 예외 메시지','#5aafff','금주 MRP Run')}
${kv('12건','🔴 긴급 처리','#ff4444','D-3일 이내')}
${kv('84M','생산 차질 금액','#ff9a3c','12건 합계')}
${kv('8건','자동 해결 가능','#4cde72','AI 추천')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📊 예외 유형별 분포 (긴급도 순)</div>
${bar('일정 앞당김 (10)',100,'#BB0000','89건')}
${bar('취소 제안 (20)',65,'#E9730C','52건')}
${bar('개시일 경과 (06)',50,'#F59E0B','41건')}
${bar('일정 늦춤 (15)',32,'#0070F2','26건')}
${bar('안전재고 미달 (96)',26,'#30914C','21건')}
</div>
<div class="db-row" style="margin-top:12px;gap:16px;align-items:center">
${donut(75,'#30914C','자동해결')}
<div style="flex:1">
<div class="db-insight"><strong style="color:#4cde72">75%</strong>는 AI가 자동으로 해결 방안 제시<br>나머지 <strong style="color:#ff9a3c">25%</strong>는 담당자 수동 검토 필요</div>
</div>
</div></div>`,

/* card 1: Corrective Action */
`<div class="db-card">
${hdr('💡','조치 방안 & 영향 분석','A-4315 일정 재조정')}
<div class="db-kpi-row">
${kv('D-3일','납기 단축 요청','#ff9a3c',demoMD(1,15,'md')+' → '+demoMD(1,12,'md'))}
${kv('40EA','1060 백업 예약','#4cde72','80 EA 중 남은 분')}
${kv('45.6M','생산 차질 방지','#5aafff','MO-26-0891')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">⏱ 조치 방법별 리드타임 비교</div>
${bar('① 1060 여유재고 이동 (백업)',30,'#30914C','즉시')}
${bar('② 공급업체 납기 조정 요청',65,'#0070F2','1~2일')}
${bar('③ 긴급 발주 생성',100,'#E9730C','3~5일')}
</div>
<div class="db-insight" style="margin-top:10px">🎯 권장: <strong style="color:#4cde72">②번 납기 단축 요청</strong> — 3일 차이, ACME OTD 88%로 대응 가능 · 확약 실패 시 ①번 1060 남은 재고(40EA, 예약됨) 이동으로 자동 전환</div></div>`
]);

/* ═══ AGENT 4 — 3-Way Matching ═══ */
patch('agent4',[
/* card 0: Matching Overview */
`<div class="db-card">
${hdr('🔍','3-Way Matching 대시보드','이번 달 송장 847건 분석')}
<div class="db-kpi-row">
${kv('847건','총 송장','#5aafff','이번 달')}
${kv('824건','완전 매칭','#4cde72','97.3%')}
${kv('23건','예외 탐지','#ff4444','즉시 검토')}
${kv('5.8M','불일치 금액','#ff9a3c','원')}
</div>
<div class="db-row" style="margin-top:12px;align-items:center;gap:16px">
${donut(97,'#30914C','매칭률')}
<div style="flex:1">
<div class="db-chart-ttl">예외 유형 분포</div>
${bar('🔴 단가 불일치',100,'#BB0000','11건')}
${bar('🟠 수량 부족',65,'#E9730C','7건')}
${bar('🟡 추가 요금',39,'#F59E0B','4건')}
${bar('🔵 중복 청구',6,'#0070F2','1건')}
</div>
</div>
<div class="db-insight" style="margin-top:10px">💡 단가 불일치 11건 중 <strong>8건</strong>은 계약 갱신 반영 누락 — 일괄 PO 수정 후 승인 가능</div></div>`,

/* card 1: Resolution */
`<div class="db-card">
${hdr('✅','예외 처리 결과','INV-2946 단가 불일치 해결')}
<div class="db-kpi-row">
${kv('1.4M','단가 차이 확인','#ff9a3c','원')}
${kv('PA-2026-112','계약 갱신 참조','#A78BFA','')}
${kv('138,000원','갱신 단가','#4cde72','+14,000원/EA')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📊 금월 예외 처리 현황</div>
${bar('✅ 처리 완료',78,'#30914C','18건')}
${bar('🔄 PO 수정 대기',13,'#0070F2','3건')}
${bar('⏳ 담당자 검토',9,'#E9730C','2건')}
</div>
<div class="db-insight" style="margin-top:10px">📈 예외 처리율 <strong style="color:#4cde72">78%</strong> · 확신도 낮은 2건(INV-3012 등)은 자동 처리하지 않고 담당자 검토로</div></div>`
]);

/* ═══ AGENT 5 — Supplier Risk ═══ */
patch('agent5',[
/* card 0: Risk Overview */
`<div class="db-card">
${hdr('🚨','공급업체 납기 리스크 대시보드','BestRun · 전체 모니터링 현황')}
<div class="db-kpi-row">
${kv('47개사','모니터링 공급업체','#5aafff','활성 PO 보유')}
${kv('3개사','🔴 High Risk','#ff4444','즉각 조치')}
${kv('76%','평균 OTD율','#ff9a3c','↓ 2%p')}
${kv('5건','납기 지연 예상','#ff9a3c','D-7 이내')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📉 최근 6개월 OTD 추이 — Delta Co. <span style="font-size:9px;color:#ff4444">(기준선 80%)</span></div>
<svg viewBox="0 0 320 88" style="width:100%;height:auto;max-height:260px;display:block">
  <line x1="38" y1="8" x2="312" y2="8" stroke="#2E4A6A" stroke-width="0.5" opacity="0.5"/>
  <line x1="38" y1="26" x2="312" y2="26" stroke="#2E4A6A" stroke-width="0.5" opacity="0.5" stroke-dasharray="3,3"/>
  <line x1="38" y1="44" x2="312" y2="44" stroke="#2E4A6A" stroke-width="0.5" opacity="0.5"/>
  <line x1="38" y1="62" x2="312" y2="62" stroke="#2E4A6A" stroke-width="0.5" opacity="0.5"/>
  <text x="34" y="11" text-anchor="end" font-size="7.5" fill="#5a7a9a">100%</text>
  <text x="34" y="29" text-anchor="end" font-size="7.5" fill="#E9730C" font-weight="700">80%</text>
  <text x="34" y="47" text-anchor="end" font-size="7.5" fill="#5a7a9a">60%</text>
  <text x="34" y="65" text-anchor="end" font-size="7.5" fill="#5a7a9a">40%</text>
  <rect x="43" y="12" width="28" height="50" rx="3" fill="#30914C" opacity="0.85"/>
  <text x="57" y="9" text-anchor="middle" font-size="8.5" fill="#5de080" font-weight="700">89%</text>
  <rect x="81" y="17" width="28" height="45" rx="3" fill="#30914C" opacity="0.75"/>
  <text x="95" y="14" text-anchor="middle" font-size="8.5" fill="#5de080" font-weight="700">84%</text>
  <rect x="119" y="22" width="28" height="40" rx="3" fill="#E9730C" opacity="0.85"/>
  <text x="133" y="19" text-anchor="middle" font-size="8.5" fill="#ffb86c" font-weight="700">78%</text>
  <rect x="157" y="28" width="28" height="34" rx="3" fill="#E9730C" opacity="0.85"/>
  <text x="171" y="25" text-anchor="middle" font-size="8.5" fill="#ffb86c" font-weight="700">72%</text>
  <rect x="195" y="33" width="28" height="29" rx="3" fill="#BB0000" opacity="0.9"/>
  <text x="209" y="30" text-anchor="middle" font-size="8.5" fill="#ff6666" font-weight="700">67%</text>
  <rect x="233" y="37" width="28" height="25" rx="3" fill="#BB0000"/>
  <text x="247" y="34" text-anchor="middle" font-size="8.5" fill="#ff4444" font-weight="700">63%</text>
  <line x1="38" y1="26" x2="312" y2="26" stroke="#E9730C" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.8"/>
  <polyline points="57,37 95,40 133,44 171,45 209,48 247,49" fill="none" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="57" cy="37" r="3" fill="#30914C"/>
  <circle cx="95" cy="40" r="3" fill="#30914C"/>
  <circle cx="133" cy="44" r="3" fill="#E9730C"/>
  <circle cx="171" cy="45" r="3" fill="#E9730C"/>
  <circle cx="209" cy="48" r="3" fill="#BB0000"/>
  <circle cx="247" cy="49" r="4" fill="#BB0000" stroke="#ff6666" stroke-width="1.5"/>
  <text x="57" y="80" text-anchor="middle" font-size="8" fill="#8090A0">${demoMon(-5,'kr')}</text>
  <text x="95" y="80" text-anchor="middle" font-size="8" fill="#8090A0">${demoMon(-4,'kr')}</text>
  <text x="133" y="80" text-anchor="middle" font-size="8" fill="#8090A0">${demoMon(-3,'kr')}</text>
  <text x="171" y="80" text-anchor="middle" font-size="8" fill="#8090A0">${demoMon(-2,'kr')}</text>
  <text x="209" y="80" text-anchor="middle" font-size="8" fill="#8090A0">${demoMon(-1,'kr')}</text>
  <text x="247" y="80" text-anchor="middle" font-size="8" fill="#ff4444" font-weight="600">${demoMon(0,'kr')}</text>
  <text x="280" y="80" text-anchor="start" font-size="7.5" fill="#ff4444">↓추세</text>
</svg>
</div>
<div class="db-chart-wrap" style="margin-top:10px">
<div class="db-chart-ttl">🎯 리스크 분포 (47개사)</div>
${bar('🔴 High (점수 70↑)',6,'#BB0000','3개사')}
${bar('🟠 Medium (40~69)',26,'#E9730C','12개사')}
${bar('🟢 Low (0~39)',68,'#30914C','32개사')}
</div></div>`,

/* card 1: Alert */
`<div class="db-card">
${hdr('📧','알림 발송 현황','Delta Co. · 납기 독촉')}
<div class="db-kpi-row">
${kv('75점','리스크 점수','#ff4444','🔴 High')}
${kv('D-1일','납기까지','#ff4444','PO 4500019188')}
${kv('1건','메일 초안 생성','#A78BFA','AI 작성')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">⚖️ 리스크 점수 산출 근거</div>
${bar('OTD 이행률 (가중치 40%)',62,'#BB0000','15.2점')}
${bar('지연 추이 (가중치 25%)',100,'#BB0000','25.0점')}
${bar('납기 긴박도 (가중치 20%)',100,'#BB0000','20.0점')}
${bar('PO 미확인 (가중치 15%)',100,'#BB0000','15.0점')}
</div>
<div class="db-row" style="margin-top:10px;align-items:center;gap:14px">
${donut(75,'#BB0000','Risk')}
<div class="db-insight"><strong style="color:#ff4444">총점: 75.2점 (High)</strong><br>4개 요인 모두 고위험<br>즉각 독촉 메일 발송 권고</div>
</div></div>`
]);

/* ═══ AGENT 6 — Demand Forecast ═══ */
patch('agent6',[
/* card 0: Forecast Overview */
`<div class="db-card">
${hdr('📊','수요 예측 발주 대시보드','SAP-RPT 1.6 Large · 200개 자재 분석')}
<div class="db-kpi-row">
${kv('200개','분석 자재','#5aafff','상위 소비액')}
${kv('8개','발주 필요','#ff4444','재고 부족')}
${kv('127.7M','총 발주 예상','#ff9a3c','원')}
${kv('85%','AI 신뢰도 (평균)','#A78BFA','SAP-RPT 1.6')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📈 수요 예측 vs 현재 재고 Gap 분석</div>
${bar('A-4315 (부족 67EA)',84,'#BB0000','100EA 발주')}
${bar('B-2290 (부족 70EA)',82,'#E9730C','100EA 발주')}
${bar('D-5501 (부족 80EA)',100,'#BB0000','100EA 발주')}
${bar('F-1120 (부족 45EA)',53,'#F59E0B','60EA 발주')}
${bar('G-3380 (부족 30EA)',35,'#30914C','40EA 발주')}
</div>
<div class="db-row" style="margin-top:12px;align-items:center;gap:16px">
${donut(85,'#A78BFA','신뢰도')}
<div class="db-insight">🤖 SAP AI Core · SAP-RPT 1.6 Large 표 데이터 예측<br>200개 자재 · 24개월 소비 이력 집계 → 예측<br><strong style="color:#A78BFA">평균 신뢰도 85%</strong> · 오차범위 ±8%</div>
</div></div>`,

/* card 1: PR Created */
`<div class="db-card">
${hdr('📝','구매 요청서 자동 생성','PR 10008976')}
<div class="db-kpi-row">
${kv('8개','발주 품목','#5aafff','')}
${kv('127.7M','총 금액','#ff9a3c','원')}
${kv('PR 생성','시스템 상태','#4cde72','승인 대기')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">🏭 공급업체별 발주 금액 분포</div>
${bar('기타 공급업체 (3건)',100,'#7C3AED','58.0M')}
${bar('Supplier Alpha (A-4315, B-2290)',72,'#7C3AED','41.7M')}
${bar('Supplier Beta (D-5501)',28,'#A78BFA','16.5M')}
${bar('Supplier Gamma (F-1120, G-3380)',20,'#C4B5FD','11.6M')}
</div>
<div class="db-insight" style="margin-top:10px">✅ 승인자(이도윤 상무) 승인 시 <strong>자동 발주 확정</strong> · 요청자(김재형)와 분리 · 공급업체 자동 통보</div></div>`
]);

/* ═══ AGENT 7 — Stock Transfer ═══ */
patch('agent7',[
/* card 0: Stock Analysis — 14일 수요 예측 기준, 결품 시점과 입고 시점 비교 */
`<div class="db-card">
${hdr('🏭','창고 재고 이동 최적화 대시보드','플랜트 1050 · 1060 · 1070 · 14일 수요 예측 기준')}
<div class="db-kpi-row">
${kv('5건','이동 기회','var(--j-pos)','상위 3건 표시')}
${kv('1일','A-4315 결품까지','var(--j-neg)',demoDay(1,'md')+' 08시 · MO-26-0889')}
${kv('1일 vs 18일','이전 vs 외부 발주','var(--j-link)','결품 전 도착은 이전뿐')}
${kv('12.3M','예상 절감','var(--j-pos)','외부 조달 대비')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">⏱ A-4315 플랜트 1050 — 시점별 예상 재고</div>
<div class="tl">
<div class="tl-row"><span class="tl-t">오늘</span><span class="tl-dot"></span><span class="tl-e">현재고</span><span class="tl-q">45 EA</span></div>
<div class="tl-row"><span class="tl-t">오늘</span><span class="tl-dot"></span><span class="tl-e">MO-26-0888 투입 (FG-2100 45 EA)</span><span class="tl-q">0 EA</span></div>
<div class="tl-row warn"><span class="tl-t">${demoDay(1,'md')}</span><span class="tl-dot"></span><span class="tl-e">Delta Co. PO 4500019188 50 EA 입고 예정 — 지연 위험 75점</span><span class="tl-q">미확정</span></div>
<div class="tl-row neg"><span class="tl-t">${demoDay(1,'md')} 08시</span><span class="tl-dot"></span><span class="tl-e"><b>MO-26-0889 착수 · 40 EA 필요 → 결품</b></span><span class="tl-q">−40 EA</span></div>
<div class="tl-row pos"><span class="tl-t">${demoDay(1,'md')} 15시</span><span class="tl-dot"></span><span class="tl-e">재고 이전 1060→1050 입고 (+40 EA) — 7시간 공백은 PP 순서 조정</span><span class="tl-q">0 EA</span></div>
<div class="tl-row"><span class="tl-t">${demoDay(18,'md')}</span><span class="tl-dot"></span><span class="tl-e">외부 발주 시 입고 (리드타임 18일) — 결품 후 17일</span><span class="tl-q">✗</span></div>
</div>
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">🏭 보내는 플랜트 점검 — 1060 (이전 후 재고 vs 14일 수요)</div>
${bar('이전 후 재고',100,'var(--j-pos-icon)','100 EA')}
${bar('14일 수요 + 안전재고',80,'var(--j-link)','60 + 20 EA')}
</div>
<div class="db-insight" style="margin-top:10px">🚚 1060→1050 이전 40 EA로 <strong>외부 발주 없이</strong> 결품 해소 · 보내는 1060도 수요를 채우고 20 EA 여유</div></div>`,

/* card 1: STO Created */
`<div class="db-card">
${hdr('✅','STO 생성 완료','4500019567 · 확정')}
<div class="db-kpi-row">
${kv('40 EA','이동 수량','#4cde72','A-4315')}
${kv('1060→1050','이동 경로','#5aafff','플랜트 간')}
${kv('1일','예상 소요','#A78BFA','당일 처리')}
</div>
<div class="db-chart-wrap" style="margin-top:12px">
<div class="db-chart-ttl">📋 이번 주 STO 처리 현황</div>
${bar('✅ 이동 완료',60,'#30914C','3건')}
${bar('🔄 이동 진행중',20,'#0070F2','1건')}
${bar('📝 생성 완료 (오늘)',20,'#A78BFA','1건')}
</div>
<div class="db-insight" style="margin-top:10px">💰 총 <strong style="color:#4cde72">12.3M원</strong> 외부 조달 비용 절감 · 리드타임 단축 3~5일</div></div>`
]);

/* ═══ ACTIVATE ═══ */
console.log('✅ All 7 Demo Players + Light Theme + BAIP Architecture SVG ready.');

})();
