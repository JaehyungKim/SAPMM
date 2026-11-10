'use strict';
/* ═══════════════════════════════════════════════════════════════
   QM 모듈 콘텐츠 — 엔진은 js/core.js, 진입 파일은 qm.html
   Q1 고객 클레임 배치 추적·Block (원안: 202608_Joule Agent for QM Batch Traceability_v0.1.pdf)
   Q2 입고 검사 판정 지원
   기획: docs/modules/qm.md · 데이터: docs/harness/world.md
═══════════════════════════════════════════════════════════════ */

/* ═══ Q1 — 고객 클레임 배치 추적·Block ═══
   PDF 4단계: ① 클레임 접수(Q1 통보 생성) ② 관련 배치 식별 ③ 승인 후 Blocked 이동(344) ④ 원인 분석·종료(품질 담당자, S/4HANA) */
demoPlayers['qm1'] = new DemoPlayer({
  id: 'qm1',
  flow: [
    { icon: '📞', label: '클레임 접수' },
    { icon: '📝', label: 'Q1 통보 생성' },
    { icon: '🔍', label: '배치 추적' },
    { icon: '🛑', label: 'Block 대상 확인' },
    { icon: '✅', label: 'Blocked 이동' }
  ],
  tech: [
    { label: 'Joule Work' },
    { label: 'ERP MCP Server', cls: 'teal' },
    { label: 'Quality Notification API', cls: 'green' },
    { label: 'Batch Where-Used', cls: 'orange' },
    { label: 'Risk Scope AI', cls: 'purple' },
    { label: 'Material Document API (344)', cls: 'green' }
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;고객 클레임 배치 추적 Agent 준비 완료. 판매·납품·배치·품질 통보 데이터 연결됨.');
      p.addPresets([{ label: '📞 고객 클레임 접수', highlight: true }, { label: '📋 진행 중 클레임 보기' }]);
    },
    (p) => {
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'Kestrel Machinery에서 FG-2100 유압 파워 유닛 누유 클레임이 접수됐어. 판매오더 1000584 기준으로 출하 이력 확인해줘.');
      setTimeout(() => {
        p.addThinking(['판매오더 1000584와 연결된 아웃바운드 납품을 찾고 있어요', '납품 품목별 출하 수량과 배치를 확인하는 중', '고객·자재 정보가 클레임 내용과 맞는지 검증합니다']);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(1);
          p.addMsg('ai', `Kestrel Machinery(10100021)의 FG-2100 판매오더 <strong>1000584</strong> 출하 이력을 확인했습니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>납품</th><th>품목</th><th>출하 수량</th><th>배치</th></tr></thead>
            <tbody>
              <tr><td>80587401</td><td>000010</td><td>0 EA</td><td><span style="color:var(--j-text-3)">배치 미지정 (상위 품목)</span></td></tr>
              <tr><td>80587401</td><td>900001</td><td><strong>12 EA</strong></td><td><strong>0000004259</strong></td></tr>
            </tbody></table></div>
          품목 000010은 배치 분할 상위 품목이고, 실제 출하는 하위 품목 900001에서 배치 <strong>0000004259</strong> 12 EA로 이루어졌습니다.
          ${jConfirm('qm1', 'Q1 고객 클레임 품질 통보를 생성할까요?')}`);
          p.addResultCard(DB.card(
            DB.hdr('📞', '고객 클레임 접수', `Kestrel Machinery · ${demoDay(0, 'md')}`) +
            DB.kpis([['FG-2100', '자재', 'var(--j-link)', '유압 파워 유닛 HPU-200'], ['누유', '불량 내용', 'var(--j-neg)', '고객 현장 조립 후'], ['12 EA', '출하 수량', 'var(--j-text)', '납품 80587401'], ['0000004259', '출하 배치', 'var(--j-warn)', '1050 · MO-26-0874']])));
          touchGuide.showPulse(jYesBtn(p), '👆 품질 통보 생성');
        }, 2700);
      }, 400);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '생성해줘');
      setTimeout(() => {
        stampDoc('qm-q1');
        p._setFlowActive(2);
        p.addMsg('ai', `<span class="text-success">✅ Q1 고객 클레임 품질 통보 <strong>200000105</strong> 생성</span>
          <div class="chat-table-wrap"><table class="chat-table"><tbody>
            <tr><td>통보 유형</td><td>Q1 고객 클레임</td></tr>
            <tr><td>내역</td><td>Customer Complaint – 유압 파워 유닛 누유</td></tr>
            <tr><td>고객 · 자재 · 배치</td><td>Kestrel Machinery (10100021) · FG-2100 · 0000004259</td></tr>
            <tr><td>플랜트 · 참조</td><td>1050 · 판매오더 1000584 / 납품 80587401</td></tr>
            <tr><td>우선순위</td><td><span class="badge badge-danger">높음</span></td></tr>
          </tbody></table></div>
          다음으로 이 배치가 <strong>어디까지 퍼져 있는지</strong> 확인하겠습니다.`);
        p.addPresets([{ label: '🔍 같은 배치 영향 범위 확인', highlight: true }]);
      }, 700);
    },
    (p) => {
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '배치 0000004259 영향 범위 확인해줘. 다른 고객 출하분이랑 남은 재고까지.');
      setTimeout(() => {
        p.addThinking(['배치 0000004259의 출하·재고 사용처를 조회하고 있어요', '생산오더 MO-26-0874에 투입된 구성품 배치까지 역추적하는 중', '같은 구성품 로트를 쓴 다른 완제품 배치를 찾고 있어요', '누유와 관련 있는 구성품을 불량 이력으로 좁힙니다']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `배치 <strong>0000004259</strong> (60 EA 생산) 영향 범위입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>구분</th><th>대상</th><th>수량</th><th>상태</th></tr></thead>
            <tbody>
              <tr><td>출하</td><td>Kestrel Machinery · 80587401</td><td>12 EA</td><td><span class="badge badge-danger">클레임</span></td></tr>
              <tr><td>출하</td><td>Halcyon Equipment · 80587415</td><td>8 EA</td><td><span class="badge badge-warning">사전 안내 필요</span></td></tr>
              <tr><td>출하</td><td>Bluefin Construction · 80587433</td><td>6 EA</td><td><span class="badge badge-warning">사전 안내 필요</span></td></tr>
              <tr><td>미출하 재고</td><td>1050 / 0001 가용</td><td><strong>34 EA</strong></td><td><span class="badge badge-danger">출하 차단 필요</span></td></tr>
            </tbody></table></div>
          <strong>구성품 역추적:</strong> 누유는 실링부 불량과 관련이 큽니다. 이 배치에 들어간 <strong>A-4315 유압실린더 로트 D2610-07</strong>(Delta Co.)이
          다른 완제품 배치 <strong>0000004262</strong>(1050 가용 20 EA)에도 쓰였습니다. 같은 위험이 있어 함께 보류하는 것을 권장합니다.`);
          p.addResultCard(DB.card(
            DB.hdr('🔍', '배치 영향 범위', '원자재 로트 → 완제품 배치 → 출하 고객') +
            DB.kpis([['3곳', '출하 고객', 'var(--j-warn-icon)', '26 EA 출하'], ['54 EA', '미출하 재고', 'var(--j-neg)', '배치 2개 · 1050'], ['D2610-07', '공통 구성품 로트', 'var(--j-brand)', 'A-4315 · Delta Co.'], ['1.5일 → 5분', '추적 시간', 'var(--j-pos)', '배치 정보 수작업 대비']]) +
            DB.chart('📦 배치별 보류 대상 재고',
              DB.bar('0000004259 · 직접 연결 (클레임 배치)', 100, 'var(--j-neg-icon)', '34 EA') +
              DB.bar('0000004262 · 같은 A-4315 로트', 59, 'var(--j-warn-icon)', '20 EA')) +
            DB.insight('🧭 Batch Information Cockpit의 사용처 추적을 Agent가 대신 따라가, <strong>직접 연결 배치 외의 숨은 위험 배치</strong>까지 찾았습니다')));
          p.addPresets([{ label: '🛑 Block 대상·수량 확인', highlight: true }]);
        }, 3400);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'Block 대상이랑 수량 보여주고, 승인하면 처리해줘');
      setTimeout(() => {
        p.addMsg('ai', `보류(Blocked) 재고로 옮길 대상입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>배치</th><th>자재</th><th>플랜트 / 저장위치</th><th>수량</th><th>근거</th></tr></thead>
            <tbody>
              <tr><td><strong>0000004259</strong></td><td>FG-2100</td><td>1050 / 0001</td><td><strong>34 EA</strong></td><td>클레임 배치 (직접 연결)</td></tr>
              <tr><td><strong>0000004262</strong></td><td>FG-2100</td><td>1050 / 0001</td><td><strong>20 EA</strong></td><td>같은 A-4315 로트 (예방)</td></tr>
            </tbody></table></div>
          이동 유형 <strong>344</strong> (가용 → 보류)로 이전 전기하며, 배치마다 자재 문서가 만들어집니다. 보류된 재고는 출하·생산에 쓸 수 없습니다.
          ${jConfirm('qm1', '배치 2개 54 EA를 보류 재고로 이동하시겠습니까?')}`);
        touchGuide.showPulse(jYesBtn(p), '👆 Block 승인');
      }, 600);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '승인');
      setTimeout(() => {
        stampDoc('qm-block');
        p._setFlowActive(4);
        p.addMsg('ai', `<span class="text-success">✅ 보류 재고 이동 완료 (이동 유형 344)</span>
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>자재 문서</th><th>배치</th><th>수량</th></tr></thead>
            <tbody>
              <tr><td><strong>4900815384</strong></td><td>0000004259</td><td>34 EA</td></tr>
              <tr><td><strong>4900815385</strong></td><td>0000004262</td><td>20 EA</td></tr>
            </tbody></table></div>
          두 배치 모두 1050에서 출하할 수 없게 되었고, 품질 통보 200000105에 조치 내역으로 기록했습니다.`);
        p.addResultCard(DB.card(
          DB.hdr('🛑', '배치 Block 완료', '이동 유형 344 · 자재 문서 2건') +
          DB.kpis([['54 EA', '보류 이동', 'var(--j-pos)', '배치 2개'], ['0 EA', '추가 출하 위험', 'var(--j-pos)', '1050 출하 차단'], ['2곳', '사전 안내 대상', 'var(--j-warn-icon)', 'Halcyon · Bluefin'], ['200000105', '품질 통보', 'var(--j-link)', '원인 분석 대기']]) +
          DB.insight('📌 원인 분석과 통보 종료는 품질 담당자가 S/4HANA 품질 통보에서 직접 기록합니다')));
        p.addPresets([{ label: '📝 후속 조치 정리', highlight: true }]);
      }, 700);
    },
    (p) => {
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '후속 조치 정리해줘');
      setTimeout(() => {
        p.addMsg('ai', `<strong>후속 조치</strong>
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>#</th><th>조치</th><th>담당</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>품질 통보 200000105 원인 분석·조사 결과 기록 후 종료</td><td>품질 담당자 (S/4HANA)</td></tr>
              <tr><td>2</td><td>Halcyon Equipment · Bluefin Construction에 같은 배치 출하분 점검 안내</td><td>고객품질 — 메일 초안 준비됨</td></tr>
              <tr><td>3</td><td>Delta Co. A-4315 로트 D2610-07 계열 입고분 검사 강화</td><td><strong>입고 검사 판정 Agent</strong>로 이어짐</td></tr>
            </tbody></table></div>`);
        p._setFlowActive(5);
        p.addMsg('sys', '✅ &nbsp;<strong>고객 클레임 배치 추적·Block</strong> 시나리오 완료.');
        DB.done(p, '시나리오 완료', '클레임 접수 → Q1 품질 통보 생성 → 원자재 로트까지 배치 역추적 → 승인 후 보류 재고 이동(344)까지 완료');
        p.addPresets([{ label: '🔬 입고 검사 판정 Agent로', highlight: true, action: () => router.go('qm2') }]);
      }, 700);
    }
  ]
});

/* ═══ Q2 — 입고 검사 판정 지원 ═══ */
demoPlayers['qm2'] = new DemoPlayer({
  id: 'qm2',
  flow: [
    { icon: '📥', label: '검사 대기 조회' },
    { icon: '🚨', label: '우선순위' },
    { icon: '📐', label: '결과 분석' },
    { icon: '⚖️', label: '판정안' },
    { icon: '✅', label: '사용결정' }
  ],
  tech: [
    { label: 'Joule Work' },
    { label: 'ERP MCP Server', cls: 'teal' },
    { label: 'Inspection Lot API', cls: 'orange' },
    { label: 'Inspection Result AI', cls: 'purple' },
    { label: 'Usage Decision · 321/350', cls: 'green' },
    { label: 'Quality Notification (Q2)', cls: 'green' }
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;입고 검사 판정 Agent 준비 완료. 플랜트 1050 검사 로트·검사 결과·자재 소요 데이터 연결됨.');
      p.addPresets([{ label: '🚨 급한 검사 대기 재고', highlight: true }, { label: '📋 오늘 검사 로트' }]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '부산 공장 검사 대기 재고 중 급한 거 있어?');
      setTimeout(() => {
        p.addThinking(['플랜트 1050의 사용결정 전 검사 로트 17건을 불러오고 있어요', '자재별 생산오더 소요와 가용 재고를 대조하는 중', '결품 위험이 큰 순서로 정렬합니다']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `검사 대기 로트 17건 중 <strong>결품과 직결된 로트 1건</strong>이 있습니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>검사 로트</th><th>자재</th><th>수량</th><th>대기</th><th>우선순위</th></tr></thead>
            <tbody>
              <tr><td><strong>010000004718</strong></td><td>A-4315 유압실린더</td><td>20 EA</td><td>2일</td><td><span class="badge badge-danger">결품 자재</span></td></tr>
              <tr><td>010000004722</td><td>J-4410 유압 호스 어셈블리</td><td>12 EA</td><td>1일</td><td><span class="badge badge-warning">MO-26-0899 소요</span></td></tr>
              <tr><td>010000004725</td><td>F-1120 오일씰 킷 A</td><td>50 EA</td><td>1일</td><td><span class="badge badge-success">여유</span></td></tr>
            </tbody></table></div>
          A-4315는 생산오더 MO-26-0891이 기다리는 부품인데, Delta Co. 구매오더 4500019102 입고분 <strong>20 EA가 품질 검사 재고</strong>로 묶여 있습니다.`);
          p.addResultCard(DB.card(
            DB.hdr('📥', '검사 대기 현황', '플랜트 1050 · 사용결정 전 로트') +
            DB.kpis([['17로트', '검사 대기', 'var(--j-link)', '평균 대기 1.4일'], ['1로트', '결품 직결', 'var(--j-neg)', 'A-4315 20 EA'], ['20 EA', '묶인 결품 자재', 'var(--j-warn-icon)', '품질 검사 재고'], ['2일', '최장 대기', 'var(--j-neg)', '010000004718']])));
          p.addPresets([{ label: '📐 A-4315 검사 결과 분석', highlight: true }]);
        }, 2800);
      }, 400);
    },
    (p) => {
      p._setFlowActive(2);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'A-4315 검사 결과 보여줘');
      setTimeout(() => {
        p.addThinking(['검사 로트 010000004718의 특성별 측정값을 읽고 있어요', '규격 한계와 비교하는 중', 'Delta Co.의 최근 5개 로트 결과와 비교합니다', '같은 로트 계열 관련 품질 통보를 찾고 있어요']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `검사 로트 <strong>010000004718</strong> (샘플 8 EA) 결과입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>검사 특성</th><th>규격</th><th>결과</th></tr></thead>
            <tbody>
              <tr><td>로드 직경</td><td>Ø40 ±0.05 mm</td><td><span class="text-success">8 / 8 합격</span></td></tr>
              <tr><td>내압 시험 (21 MPa, 3분)</td><td>누유 없음</td><td><span class="text-danger">7 / 8 — 1 EA 누유</span></td></tr>
              <tr><td>외관</td><td>스크래치·녹 없음</td><td><span class="text-success">8 / 8 합격</span></td></tr>
            </tbody></table></div>
          Delta Co. 최근 5로트 불량률 평균 <strong>2%</strong> → 이번 <strong>12.5%</strong>.
          누유 위치가 씰 압입부로, 고객 클레임 <strong>200000105</strong>(FG-2100 누유, A-4315 로트 D2610-07)과 같은 패턴입니다.`);
          p.addPresets([{ label: '⚖️ 판정안 제시', highlight: true }]);
        }, 3200);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '어떻게 판정하면 돼?');
      setTimeout(() => {
        p.addThinking(['판정 대안별로 가용 수량과 품질 위험을 계산하고 있어요', 'MO-26-0891 부족분과 구매요청 수량에 미치는 영향을 확인하는 중']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `판정 대안입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>대안</th><th>가용 전환</th><th>품질 위험</th></tr></thead>
            <tbody>
              <tr><td>① 전량 불합격 · 반품</td><td>0 EA</td><td>없음 — 대신 결품 지속</td></tr>
              <tr><td><strong>② 전수 내압 재시험 후 합격분만 가용</strong></td><td><strong>예상 18 EA</strong></td><td><span class="text-success">낮음</span> — 누유품 전량 선별</td></tr>
              <tr><td>③ 특채 (전량 합격)</td><td>20 EA</td><td><span class="text-danger">높음</span> — 클레임 재발 가능</td></tr>
            </tbody></table></div>
          <strong>추천: ②.</strong> 재시험은 4시간이면 끝나고, 합격분 18 EA가 가용 재고가 되면 MO-26-0891 부족분을 일부 메우고
          추가 구매요청 수량을 <strong>18 EA 줄일</strong> 수 있습니다.`);
          p.addPresets([{ label: '✅ 재시험 결과 반영해 사용결정', highlight: true }]);
        }, 2400);
      }, 400);
    },
    (p) => {
      p._setFlowActive(4);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '전수 재시험 결과 반영해서 처리해줘');
      setTimeout(() => {
        p.addMsg('ai', `전수 재시험 결과: <strong>18 EA 합격, 2 EA 누유</strong>. 처리안입니다.
          <div class="chat-table-wrap"><table class="chat-table"><tbody>
            <tr><td>사용결정</td><td>검사 로트 010000004718 · 부분 합격</td></tr>
            <tr><td>재고 전기</td><td>18 EA 품질 검사 → <strong>가용</strong> (이동 유형 321) · 2 EA 품질 검사 → <strong>보류</strong> (350, 반품 예정)</td></tr>
            <tr><td>품질 통보</td><td>Q2 공급업체 클레임 → Delta Co. · 누유 2 EA, 로트 D2610 계열 시정 조치 요청</td></tr>
          </tbody></table></div>
          ${jConfirm('qm2', '이 내용으로 사용결정과 공급업체 품질 통보(Q2)를 처리하시겠습니까?')}`);
        touchGuide.showPulse(jYesBtn(p), '👆 사용결정 승인');
      }, 600);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '처리해줘');
      setTimeout(() => {
        stampDoc('qm-ud');
        p.addMsg('ai', `<span class="text-success">✅ 사용결정 · 재고 전기 · 품질 통보 완료</span>
          <div class="chat-table-wrap"><table class="chat-table"><tbody>
            <tr><td>검사 로트</td><td>010000004718 — 사용결정 완료</td></tr>
            <tr><td>자재 문서</td><td><strong>4900815402</strong> (321, 18 EA) · <strong>4900815403</strong> (350, 2 EA)</td></tr>
            <tr><td>품질 통보</td><td><strong>200000112</strong> (Q2, Delta Co.)</td></tr>
          </tbody></table></div>
          A-4315 가용 재고가 18 EA 늘었습니다. 생산계획 담당자와 구매 담당자에게 알렸습니다.`);
        p.addResultCard(DB.card(
          DB.hdr('✅', '사용결정 완료', '검사 로트 010000004718 · A-4315') +
          DB.kpis([['18 EA', '가용 전환', 'var(--j-pos)', '이동 유형 321'], ['2 EA', '반품 보류', 'var(--j-neg)', '이동 유형 350'], ['−18 EA', '추가 발주 감소', 'var(--j-pos)', 'A-4315 구매요청'], ['3시간 → 5분', '판정 시간', 'var(--j-brand)', '측정값·이력 대조 수작업 대비']]) +
          DB.chart('📐 A-4315 판정 결과',
            DB.bar('합격 → 가용', 90, 'var(--j-pos-icon)', '18 EA') +
            DB.bar('누유 → 반품 보류', 10, 'var(--j-neg-icon)', '2 EA')) +
          DB.insight('🔗 고객 클레임(200000105)과 입고 검사가 같은 A-4315 로트 계열을 가리킵니다 — 공급업체 시정 조치(200000112)로 연결했습니다')));
        p._setFlowActive(5);
        p.addMsg('sys', '✅ &nbsp;<strong>입고 검사 판정 지원</strong> 시나리오 완료.');
        DB.done(p, '시나리오 완료', '결품 자재 검사 로트 우선 처리 → 측정값·과거 로트 비교 → 판정 대안 → 승인 후 사용결정·재고 전기·공급업체 통보까지 완료');
      }, 700);
    }
  ]
});

/* ═══ 아키텍처 (js/arch-diagram.js · js/arch-tour.js 가 읽는다) ═══ */
Object.assign(window.ARCH_MODAL_META, {
  qm1: { title: 'Q1. 고객 클레임 배치 추적 Agent — 아키텍처', subtitle: 'SAP Business AI Platform · Joule Work · 배치 사용처 추적 · S/4HANA Cloud 품질 통보 · 보류 재고 이동',
    badges: ['SAP Business AI Platform', 'Joule Work', 'Risk Scope AI', 'ERP MCP Server', 'Quality Notification API', 'Material Document API'] },
  qm2: { title: 'Q2. 입고 검사 판정 Agent — 아키텍처', subtitle: 'SAP Business AI Platform · Joule Work · 검사 결과 분석 · S/4HANA Cloud 사용결정 · 품질 통보',
    badges: ['SAP Business AI Platform', 'Joule Work', 'Inspection Result AI', 'ERP MCP Server', 'Inspection Lot API', 'Quality Notification API'] }
});
window.EXTRA_ARCH = Object.assign(window.EXTRA_ARCH || {}, {
  qm1: { hl: [2, 4], cfg: {
    title: 'Q1. Batch Traceability Agent', scope: 'Quality Management · Sales', agent: 'Batch Traceability Agent', tools: '출하 이력 · 배치 추적 · Block',
    data: [['I_OutboundDeliveryItem', '출하 수량 · 배치'], ['I_MaterialStock_2', '배치별 재고'], ['I_Batch', '배치 · 사용처']],
    exec: [['Quality Notification API', 'Q1 고객 클레임 생성'], ['Material Document API', '보류 이동 344']],
    proc: [['Q1 품질 통보 생성', ''], ['배치 Block (344)', ''], ['원인 분석 · 통보 종료', '품질 담당자']], fiori: [['품질 통보 관리', 'SAP Fiori 앱'], ['배치 정보 Cockpit', 'SAP Fiori 앱']],
    aicore: ['위험 범위 분석 모델', '구성품 로트 역추적'], hana: ['클레임 · 배치 추적 이력', '저장 · 조회'], integ: ['ERP API', '납품 · 배치 · 재고 · 통보'],
    doc: 'QM-AI-ARCH-01' } },
  qm2: { hl: [1, 2], cfg: {
    title: 'Q2. Incoming Inspection Agent', scope: 'Quality Management · Sourcing and Procurement', agent: 'Incoming Inspection Agent', tools: '검사 로트 · 결과 분석 · 사용결정',
    data: [['I_InspectionLot', '검사 로트'], ['I_InspectionResult', '특성별 측정값'], ['I_MaterialStock_2', '품질 검사 재고']],
    exec: [['Inspection Lot API', '사용결정 · 재고 전기'], ['Quality Notification API', 'Q2 공급업체 클레임']],
    proc: [['사용결정 (321 / 350)', ''], ['Q2 공급업체 통보', ''], ['My Inbox', '승인 작업함']], fiori: [['검사 로트 관리', 'SAP Fiori 앱'], ['품질 통보 관리', 'SAP Fiori 앱']],
    aicore: ['검사 결과 이상 판단', '과거 로트 비교 · 판정 근거'], hana: ['검사 이력 · 공급업체 불량률', '저장 · 조회'], integ: ['ERP API', '검사 로트 · 결과 · 재고'],
    doc: 'QM-AI-ARCH-02' } }
});
window.EXTRA_TOURS = Object.assign(window.EXTRA_TOURS || {}, {
  qm1: { core: '클레임 하나에서 시작해 같은 배치·같은 원자재 로트까지 따라가, 위험 재고를 승인 한 번으로 묶습니다.', steps: [
    { t: '클레임 접수', r: ['user', 'orch'], d: '고객품질 담당자가 Joule에 고객·자재·판매오더와 불량 내용을 말합니다.' },
    { t: 'Q1 통보 생성', r: ['gateway', 'cagent', 's4exec'], d: 'Agent가 출하 이력으로 입력을 검증하고 Quality Notification API로 Q1 고객 클레임 통보를 만듭니다.' },
    { t: '배치 추적', r: ['integ', 's4data'], d: 'ERP MCP로 납품 품목의 배치, 배치별 재고, 생산오더에 투입된 구성품 로트를 조회합니다.' },
    { t: '위험 범위 판단', r: ['aicore', 'hana'], d: 'SAP AI Core 모델이 불량 유형과 구성품 이력을 연결해, 같은 로트를 쓴 다른 배치까지 위험 범위로 묶습니다.' },
    { t: '승인 후 Block', r: ['user', 's4exec'], d: '승인 → Material Document API로 이동 유형 344(가용 → 보류)를 배치마다 전기합니다.' },
    { t: '원인 분석 · 종료', r: ['s4proc', 'suite'], d: '품질 담당자가 S/4HANA 품질 통보에서 원인과 조사 결과를 기록하고 통보를 종료합니다.' }] },
  qm2: { core: '결품 자재가 검사 대기에 묶여 있으면 먼저 꺼내고, 측정값과 과거 로트로 판정 근거를 만듭니다.', steps: [
    { t: '질문', r: ['user', 'orch'], d: '품질 담당자가 Joule에 "급한 검사 대기 재고"를 묻습니다.' },
    { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 Incoming Inspection Agent를 호출하고(A2A), Agent 로직은 Cloud Foundry Runtime에서 실행됩니다.' },
    { t: 'S/4HANA 조회', r: ['integ', 's4data'], d: 'ERP MCP로 검사 로트 17건, 특성별 측정값, 품질 검사 재고와 생산오더 소요를 조회합니다.' },
    { t: 'AI 판정 근거', r: ['aicore', 'hana'], d: 'SAP AI Core가 측정값을 규격·과거 로트와 비교하고, 관련 고객 클레임과 같은 패턴인지 판단합니다.' },
    { t: '승인 후 실행', r: ['user', 's4exec'], d: '승인 → 사용결정과 재고 전기(321 / 350), Q2 공급업체 품질 통보를 처리합니다.' },
    { t: '후속 연계', r: ['s4proc', 'suite'], d: '가용 재고 증가를 생산계획·구매 담당자에게 알리고, 공급업체 시정 조치를 추적합니다.' }] }
});
