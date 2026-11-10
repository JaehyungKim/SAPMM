'use strict';
/* ═══════════════════════════════════════════════════════════════
   PP 모듈 콘텐츠 — 엔진은 js/core.js, 진입 파일은 pp.html
   P1 결품 생산오더 영향 분석·순서 조정 (기획: docs/modules/pp.md)
   데이터: docs/harness/world.md (FG-2100, MO-26-0889, ASSY-12, STO 4500019567 …)
   결품 시점: MO-26-0889 내일 08시 착수 vs STO 입고 내일 15시 — MM 07이 부품을, P1이 7시간 공백을 메운다
═══════════════════════════════════════════════════════════════ */

/* ═══ P1 — 결품 생산오더 영향 분석·순서 조정 ═══ */
demoPlayers['pp1'] = new DemoPlayer({
  id: 'pp1',
  flow: [
    { icon: '🏭', label: '생산오더 조회' },
    { icon: '⚠️', label: '결품 탐지' },
    { icon: '📉', label: '영향 분석' },
    { icon: '🔀', label: '순서 대안' },
    { icon: '✅', label: '일정 변경' }
  ],
  tech: [
    { label: 'Joule Work' },
    { label: 'ERP MCP Server', cls: 'teal' },
    { label: 'I_ManufacturingOrder', cls: 'orange' },
    { label: 'I_MaterialStock_2', cls: 'orange' },
    { label: 'Sequencing AI', cls: 'purple' },
    { label: 'Production Order API', cls: 'green' }
  ],
  steps: [
    (p) => {
      p._setFlowActive(0);
      p.addMsg('sys', '⚙️ &nbsp;결품 생산오더 대응 Agent 준비 완료. 플랜트 1050 생산오더·자재 가용성 데이터 연결됨.');
      p.addPresets([{ label: '🏭 이번 주 결품 위험 생산오더', highlight: true }, { label: '📅 작업장 부하 보기' }]);
    },
    (p) => {
      p._setFlowActive(1);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '부산 공장 이번 주 생산오더 중 자재 부족으로 멈출 오더 알려줘');
      setTimeout(() => {
        p.addThinking(['플랜트 1050의 이번 주 생산오더 38건을 불러오고 있어요', '오더별 구성품 소요와 착수 시점의 가용 재고를 비교하는 중', '입고 예정(구매오더·재고 이전 오더)까지 반영해 부족을 다시 계산합니다', '착수가 가까운 순서로 위험도를 매깁니다']);
        setTimeout(() => {
          p.removeThinking();
          p._setFlowActive(2);
          p.addMsg('ai', `플랜트 1050 생산오더 38건 중 <strong>결품 위험 4건</strong>입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>생산오더</th><th>완제품</th><th>착수</th><th>부족 구성품</th><th>위험</th></tr></thead>
            <tbody>
              <tr><td><strong>MO-26-0889</strong></td><td>FG-2100 40 EA</td><td>${demoDay(1, 'md')} (내일)</td><td>A-4315 40 EA</td><td><span class="badge badge-danger">긴급</span></td></tr>
              <tr><td>MO-26-0899</td><td>FG-2100 20 EA</td><td>${demoDay(4, 'md')}</td><td>J-4410 6 EA</td><td><span class="badge badge-warning">주의</span></td></tr>
              <tr><td>MO-26-0902</td><td>FG-2200 30 EA</td><td>${demoDay(5, 'md')}</td><td>F-1120 10 EA</td><td><span class="badge badge-warning">주의</span></td></tr>
              <tr><td>MO-26-0905</td><td>FG-2100 25 EA</td><td>${demoDay(6, 'md')}</td><td>B-2290 8 EA</td><td><span class="badge badge-success">입고 예정으로 해소</span></td></tr>
            </tbody></table></div>
          가장 급한 건 <strong>MO-26-0889</strong>입니다. 내일 08시 조립라인 12에서 착수해야 하는데 A-4315가 하나도 없습니다 (오늘 MO-26-0888이 45 EA를 모두 사용, Delta Co. 50 EA는 지연 위험).`);
          p.addResultCard(DB.card(
            DB.hdr('🏭', '생산오더 결품 현황', `플랜트 1050 · 이번 주 (${demoDay(0, 'md')} ~ ${demoDay(6, 'md')})`) +
            DB.kpis([['38건', '이번 주 생산오더', 'var(--j-link)', '조립라인 12 외 3개'], ['4건', '결품 위험', 'var(--j-warn-icon)', '구성품 부족'], ['1건', '내일 착수 긴급', 'var(--j-neg)', 'MO-26-0889'], ['16시간', '라인 유휴 위험', 'var(--j-neg)', 'ASSY-12 · 내일 2교대']]) +
            DB.chart('📊 결품 위험 오더 — 착수까지 남은 일수',
              DB.bar('MO-26-0889 · A-4315', 100, 'var(--j-neg-icon)', '1일') +
              DB.bar('MO-26-0899 · J-4410', 50, 'var(--j-warn-icon)', '4일') +
              DB.bar('MO-26-0902 · F-1120', 40, 'var(--j-warn-icon)', '5일') +
              DB.bar('MO-26-0905 · B-2290', 25, 'var(--j-pos-icon)', '6일 · 해소')) +
            DB.insight('⚠️ MO-26-0889이 내일 착수하지 못하면 <strong>조립라인 12가 16시간 멈춥니다</strong>')));
          p.addPresets([{ label: '📉 MO-26-0889 영향 분석', highlight: true }]);
        }, 3200);
      }, 400);
    },
    (p) => {
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', 'MO-26-0889이 밀리면 어떻게 돼?');
      setTimeout(() => {
        p.addThinking(['MO-26-0889에 연결된 판매오더와 고객 납기를 찾고 있어요', 'A-4315 입고 예정을 확인하는 중 — 재고 이전 오더 4500019567', '조립라인 12의 내일·모레 작업 계획과 대체 가능한 오더를 살펴봅니다']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `<strong>MO-26-0889 영향 분석</strong>
          <div class="chat-table-wrap"><table class="chat-table"><tbody>
            <tr><td>연결 판매오더</td><td>1000612 · Kestrel Machinery · FG-2100 40 EA · 납기 <strong>${demoDay(7, 'md')}</strong></td></tr>
            <tr><td>A-4315 입고 예정</td><td>재고 이전 오더 4500019567 (1060 → 1050) 40 EA · <strong>${demoDay(1, 'md')} 15시 입고</strong></td></tr>
            <tr><td>작업 소요</td><td>조립라인 12에서 2일 (16시간 × 2)</td></tr>
            <tr><td>그대로 두면</td><td><span class="text-danger">내일 라인 16시간 유휴</span> · 착수 1일 지연, 고객 납기는 지킬 수 있음</td></tr>
          </tbody></table></div>
          부품은 내일 오후에 들어오기 때문에, <strong>내일 하루 라인을 무엇으로 채우느냐</strong>가 관건입니다.`);
          p.addPresets([{ label: '🔀 라인 멈추지 않을 대안 비교', highlight: true }]);
        }, 2600);
      }, 400);
    },
    (p) => {
      p._setFlowActive(3);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '라인 안 멈추게 할 방법은?');
      setTimeout(() => {
        p.addThinking(['조립라인 12에서 만들 수 있는 다른 생산오더를 찾고 있어요', '각 오더의 자재 가용성과 고객 납기를 확인하는 중', '대안별 유휴 시간·비용·납기 영향을 비교합니다']);
        setTimeout(() => {
          p.removeThinking();
          p.addMsg('ai', `대안 3가지를 비교했습니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>대안</th><th>라인 유휴</th><th>추가 비용</th><th>고객 납기</th></tr></thead>
            <tbody>
              <tr><td><strong>① 순서 교체</strong> — MO-26-0894(FG-2200, A-4315 불필요)를 내일로 당기고 MO-26-0889은 모레 착수</td><td><span class="text-success">0시간</span></td><td>0원</td><td><span class="badge badge-success">영향 없음</span></td></tr>
              <tr><td>② 긴급 조달 — A-4315 40 EA 내일 오전 입고 (항공·특송)</td><td>0시간</td><td>4.2M원</td><td>영향 없음</td></tr>
              <tr><td>③ 대기 — 내일 라인 정지</td><td><span class="text-danger">16시간</span></td><td>유휴 인건비 2.4M원</td><td>하루 늦게 완료 (납기 내)</td></tr>
            </tbody></table></div>
          <strong>추천: ① 순서 교체.</strong> MO-26-0894는 모든 자재가 이미 있고, 납기(${demoDay(9, 'md')})가 여유 있어 하루 당겨도 문제없습니다.`);
          p.addPresets([{ label: '✅ 추천안으로 일정 변경', highlight: true }, { label: '② 긴급 조달 견적 보기' }]);
        }, 2900);
      }, 400);
    },
    (p) => {
      p._setFlowActive(4);
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p.addMsg('user', '추천안으로 일정 변경해줘');
      setTimeout(() => {
        p.addMsg('ai', `생산오더 일정 변경안입니다.
          <div class="chat-table-wrap"><table class="chat-table">
            <thead><tr><th>생산오더</th><th>완제품</th><th>착수 (전 → 후)</th><th>완료 (전 → 후)</th></tr></thead>
            <tbody>
              <tr><td><strong>MO-26-0894</strong></td><td>FG-2200 30 EA</td><td>${demoDay(2, 'md')} → <strong>${demoDay(1, 'md')}</strong></td><td>${demoDay(2, 'md')} → <strong>${demoDay(1, 'md')}</strong></td></tr>
              <tr><td><strong>MO-26-0889</strong></td><td>FG-2100 40 EA</td><td>${demoDay(1, 'md')} → <strong>${demoDay(2, 'md')}</strong></td><td>${demoDay(2, 'md')} → <strong>${demoDay(3, 'md')}</strong></td></tr>
            </tbody></table></div>
          작업장: 조립라인 12 (ASSY-12) 그대로 · 변경 후 라인 반장에게 작업 순서 변경을 알립니다.
          ${jConfirm('pp1', '이 내용으로 생산오더 2건의 일정을 변경하시겠습니까?')}`);
        touchGuide.showPulse(jYesBtn(p), '👆 일정 변경 승인');
      }, 600);
    },
    (p) => {
      touchGuide.hideAll(); p.presets().innerHTML = '';
      p.addMsg('user', '변경해줘');
      setTimeout(() => {
        stampDoc('pp-reschedule');
        p.addMsg('ai', `<span class="text-success">✅ 생산오더 2건 일정 변경 완료</span><br>
          MO-26-0894 착수 ${demoDay(1, 'md')} · MO-26-0889 착수 ${demoDay(2, 'md')}<br>
          조립라인 12 반장에게 작업 순서 변경 알림 발송 완료<br>
          A-4315 입고(${demoDay(1, 'md')} 15시) 후 MO-26-0889 자재 준비 상태를 다시 확인해 알려드릴게요.`);
        p.addResultCard(DB.card(
          DB.hdr('✅', '일정 변경 완료', '생산오더 2건 · 조립라인 12') +
          DB.kpis([['16 → 0시간', '라인 유휴', 'var(--j-pos)', '내일 2교대 가동'], ['0건', '고객 납기 지연', 'var(--j-pos)', `1000612 납기 ${demoDay(7, 'md')}`], ['0원', '추가 비용', 'var(--j-pos)', '긴급 조달 4.2M 회피'], ['3시간 → 3분', '검토 시간', 'var(--j-brand)', 'MD04·CO02 수작업 대비']]) +
          DB.chart('📅 조립라인 12 작업 순서 (변경 후)',
            DB.bar(`${demoDay(1, 'md')} · MO-26-0894 FG-2200`, 100, 'var(--j-link)', '16시간') +
            DB.bar(`${demoDay(2, 'md')} · MO-26-0889 FG-2100`, 100, 'var(--j-pos-icon)', '16시간') +
            DB.bar(`${demoDay(3, 'md')} · MO-26-0889 FG-2100`, 100, 'var(--j-pos-icon)', '16시간')) +
          DB.insight('🔗 A-4315 40 EA는 MM의 재고 이전 오더 4500019567로 들어옵니다 — 외부 발주 없이 라인 정지를 막았습니다')));
        p.addPresets([{ label: '🏁 마무리', highlight: true }]);
      }, 700);
    },
    (p) => {
      p.presets().innerHTML = ''; touchGuide.hideAll();
      p._setFlowActive(5);
      p.addMsg('sys', '✅ &nbsp;<strong>결품 생산오더 영향 분석·순서 조정</strong> 시나리오 완료.');
      DB.done(p, '시나리오 완료', '결품 생산오더 탐지 → 고객 납기·라인 영향 분석 → 순서 교체 대안 → 승인 후 생산오더 일정 변경까지 완료');
    }
  ]
});

/* ═══ 아키텍처 (js/arch-diagram.js · js/arch-tour.js 가 읽는다) ═══ */
Object.assign(window.ARCH_MODAL_META, {
  pp1: { title: 'P1. 결품 생산오더 대응 Agent — 아키텍처', subtitle: 'SAP Business AI Platform · Joule Work · 생산오더 순서 최적화 · S/4HANA Cloud 생산오더 API',
    badges: ['SAP Business AI Platform', 'Joule Work', 'Sequencing AI', 'ERP MCP Server', 'Manufacturing Order CDS', 'Production Order API'] }
});
window.EXTRA_ARCH = Object.assign(window.EXTRA_ARCH || {}, {
  pp1: { hl: [2], cfg: {
    title: 'P1. Production Shortage Agent', scope: 'Manufacturing · Production Planning', agent: 'Production Shortage Agent', tools: '오더 조회 · 영향 분석 · 일정 변경',
    data: [['I_ManufacturingOrder', '생산오더 · 일정'], ['I_MaterialStock_2', '구성품 가용 재고'], ['I_PurchaseOrderItemAPI01', '입고 예정 (STO 포함)']],
    exec: [['Production Order API', '생산오더 일정 변경'], ['Business Events', '자재 입고 이벤트']],
    proc: [['생산오더 일정 변경', ''], ['라인 반장 알림', ''], ['My Inbox', '승인 작업함']], fiori: [['생산오더 관리', 'SAP Fiori 앱'], ['자재 소요 모니터링', 'SAP Fiori 앱']],
    aicore: ['순서 최적화 모델 배포', '유휴·납기·비용 비교'], hana: ['작업장 부하 · 대안 이력', '저장 · 조회'], integ: ['ERP API', '생산오더 · 재고 조회/변경'],
    doc: 'PP-AI-ARCH-01' } }
});
window.EXTRA_TOURS = Object.assign(window.EXTRA_TOURS || {}, {
  pp1: { core: '내일 멈출 생산오더를 먼저 찾아, 부품이 들어올 때까지 라인을 다른 오더로 채웁니다.', steps: [
    { t: '질문', r: ['user', 'orch'], d: '생산계획 담당자가 Joule에 "이번 주 자재 부족으로 멈출 생산오더"를 묻습니다.' },
    { t: 'Agent 호출', r: ['gateway', 'cagent'], d: 'Joule이 Production Shortage Agent를 호출하고(A2A), Agent 로직은 Cloud Foundry Runtime에서 실행됩니다.' },
    { t: 'S/4HANA 조회', r: ['integ', 's4data'], d: 'ERP MCP로 S/4HANA Cloud의 생산오더 38건, 구성품 가용 재고, 재고 이전 오더 입고 예정을 조회합니다.' },
    { t: '영향·대안 분석', r: ['aicore', 'hana'], d: 'SAP AI Core 모델이 라인 유휴·추가 비용·고객 납기를 기준으로 순서 교체·긴급 조달·대기 대안을 비교합니다.' },
    { t: '승인 후 실행', r: ['user', 's4exec'], d: '승인 → Production Order API로 MO-26-0894와 MO-26-0889의 일정을 바꿉니다.' },
    { t: '현장 반영', r: ['s4proc', 'suite'], d: '라인 반장에게 작업 순서 변경을 알리고, 생산오더 관리 앱에서 바뀐 일정을 확인합니다.' }] }
});
