/* ═══════════════════════════════════════════════════════════════
   SAPUI5 (Horizon) 실제 컨트롤로 Fiori 화면 렌더링
   - UI5가 로드되면 각 Fiori 섹션에 표준 컨트롤 화면을 올리고, 실패하면 기존 HTML 화면을 그대로 사용
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.sap || !sap.ui || !sap.ui.require) { console.warn('SAPUI5 미로딩 — HTML 대체 화면 사용'); return; }

  const svg64 = s => 'data:image/svg+xml;base64,' + btoa(s);
  const LOGO = svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 45"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00B8F1"/><stop offset="1" stop-color="#1E5FBB"/></linearGradient></defs><path d="M0 0h92L46 45H0z" fill="url(#g)"/><text x="7" y="31" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="24" fill="#fff">SAP</text></svg>');
  const JOULE = svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53"><defs><radialGradient id=\"j\" cx=\"0.64\" cy=\"0.36\" r=\"0.78\"><stop offset=\"0\" stop-color=\"#B57BF1\"/><stop offset=\".45\" stop-color=\"#8446E6\"/><stop offset=\"1\" stop-color=\"#3A1BD6\"/></radialGradient></defs><path d=\"M12 1H41Q44 1 46 3.5L51 13Q53 17 50.5 20.5L29 50Q26.5 53 24 50L2.5 20.5Q0 17 2 13L7 3.5Q9 1 12 1Z\" fill=\"url(#j)\"/><path d=\"M36.5 9.5C37.3 15.5 39 17.2 45 18C39 18.8 37.3 20.5 36.5 26.5C35.7 20.5 34 18.8 28 18C34 17.2 35.7 15.5 36.5 9.5Z\" fill=\"#fff\"/></svg>');

  const JOULE_SHELL = svg64('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6.2 4.5H13.8L17.3 8.6L10 16.8L2.7 8.6Z" fill="none" stroke="#1D2D3E" stroke-width="1.6" stroke-linejoin="round"/><path d="M10.9 7.1V10.9M9 9H12.8" fill="none" stroke="#1D2D3E" stroke-width="1.7" stroke-linecap="round"/></svg>');
  const NS = 'xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:f="sap.f" xmlns:uxap="sap.uxap" xmlns:form="sap.ui.layout.form" xmlns:fb="sap.ui.comp.filterbar" xmlns:pf="sap.suite.ui.commons" xmlns:table="sap.ui.table"';
  const view = body => `<mvc:View ${NS} core:require="{H:'demo/fh'}" height="100%" displayBlock="true">
    <FlexBox direction="Column" height="100%" renderType="Bare" fitContainer="true">${body}</FlexBox></mvc:View>`;
  const shell = (title, back, joule) => `
    <f:ShellBar title="${title}" homeIcon="${LOGO}" showNavButton="true" navButtonPressed="H.go('${back}')" homeIconPressed="H.go('home')" showNotifications="false" showSearch="true">
      <f:menu><Menu><MenuItem text="${title}"/></Menu></f:menu>
      <f:additionalContent><Button icon="${JOULE_SHELL}" type="Transparent" tooltip="Joule" press="H.go('${joule}')" class="demoJouleBtn"><layoutData><OverflowToolbarLayoutData priority="NeverOverflow"/></layoutData></Button><Button icon="sap-icon://bell" type="Transparent" tooltip="알림"><layoutData><OverflowToolbarLayoutData priority="NeverOverflow"/></layoutData></Button></f:additionalContent>
      <f:profile><Avatar initials="JK" tooltip="김재형 (JKIM)"/></f:profile>
      <f:layoutData><FlexItemData shrinkFactor="0"/></f:layoutData>
    </f:ShellBar>`;
  const grow = '<layoutData><FlexItemData growFactor="1" baseSize="0" minHeight="0"/></layoutData>';
  const op = (title, sections, opts = {}) => `
    <uxap:ObjectPageLayout upperCaseAnchorBar="false" toggleHeaderOnTitleClick="true" headerContentPinnable="true" ${opts.id ? `id="${opts.id}"` : ''} ${opts.footer ? 'showFooter="true"' : ''}>
      ${grow.replace('<layoutData>', '<uxap:layoutData>').replace('</layoutData>', '</uxap:layoutData>')}
      <uxap:headerTitle>${title}</uxap:headerTitle>
      ${opts.header ? `<uxap:headerContent>${opts.header}</uxap:headerContent>` : ''}
      <uxap:sections>${sections}</uxap:sections>
      ${opts.footer ? `<uxap:footer>${opts.footer}</uxap:footer>` : ''}
    </uxap:ObjectPageLayout>`;
  const sec = (title, content, id = '') => `<uxap:ObjectPageSection title="${title}" titleUppercase="false" ${id ? `id="${id}"` : ''}><uxap:subSections><uxap:ObjectPageSubSection><uxap:blocks>${content}</uxap:blocks></uxap:ObjectPageSubSection></uxap:subSections></uxap:ObjectPageSection>`;
  const form = (groups, cols = 4) => `<form:Form editable="false"><form:layout><form:ColumnLayout columnsM="2" columnsL="${cols}" columnsXL="${cols}" labelCellsLarge="12"/></form:layout>
    <form:formContainers>${groups.map(([t, fields]) => `<form:FormContainer ${t ? `title="${t}"` : ''}><form:formElements>` + fields.map(([l, v, link]) =>
      `<form:FormElement><form:label><Label text="${l}" showColon="true"/></form:label><form:fields>${link ? `<Link text="${v}"/>` : `<Text text="${v}"/>`}</form:fields></form:FormElement>`).join('') + '</form:formElements></form:FormContainer>').join('')}</form:formContainers></form:Form>`;
  const facet = (label, inner) => `<VBox class="sapUiLargeMarginEnd sapUiSmallMarginBottom"><Title text="${label}" level="H5" class="sapUiTinyMarginBottom"/>${inner}</VBox>`;
  const kvs = pairs => `<VBox class="sapUiLargeMarginEnd sapUiSmallMarginBottom">${pairs.map(([k, v]) =>
    `<HBox class="sapUiTinyMarginBottom"><Label text="${k}" showColon="true" class="sapUiTinyMarginEnd"/><Text text="${v}"/></HBox>`).join('')}</VBox>`;
  const hc = items => `<FlexBox wrap="Wrap" alignItems="Start">${items}</FlexBox>`;
  const title = (heading, sub, actions, extra = '') => `<uxap:ObjectPageDynamicHeaderTitle>
      ${extra}
      <uxap:expandedHeading><Title text="${heading}" wrapping="true" class="sapUiTinyMarginEnd"/></uxap:expandedHeading>
      <uxap:snappedHeading><Title text="${heading}"/></uxap:snappedHeading>
      ${sub ? `<uxap:expandedContent><Label text="${sub}"/></uxap:expandedContent><uxap:snappedContent><Label text="${sub}"/></uxap:snappedContent>` : ''}
      <uxap:actions>${actions}</uxap:actions>
    </uxap:ObjectPageDynamicHeaderTitle>`;
  const tbar = (t, right = '', variant = true) => `<headerToolbar><OverflowToolbar style="Clear"><Title text="${t}" level="H3"/>${variant ? '<VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement>' : ''}<ToolbarSpacer/>${right}</OverflowToolbar></headerToolbar>`;
  const ico = (icon, tip) => `<Button icon="sap-icon://${icon}" type="Transparent" tooltip="${tip}"/>`;
  const emptyList = t => `<List noDataText="파일이 없습니다."><headerToolbar><OverflowToolbar style="Clear"><Title text="${t}" level="H3"/><ToolbarSpacer/><Button text="업로드" type="Transparent"/><Button text="링크 추가" type="Transparent"/></OverflowToolbar></headerToolbar></List>`;

  /* ───────── 구매오더 관리 — List Report (S/4HANA Cloud '구매오더 관리' 구성, 재고 이전 오더 UB) ───────── */
  const stoRows = [
    ['4500019553', '인천 물류창고 (1060)', demoDay(-3,'dot'), '9,200,000', '운송 중', 'Information', 'shipping-status'],
    ['4500019541', '수원 공장 (1070)', demoDay(-4,'dot'), '3,450,000', '후속 문서', 'Success', 'sys-enter-2'],
    ['4500019538', '인천 물류창고 (1060)', demoDay(-5,'dot'), '12,800,000', '후속 문서', 'Success', 'sys-enter-2'],
    ['4500019522', '부산 생산공장 (1050)', demoDay(-6,'dot'), '2,150,000', '후속 문서', 'Success', 'sys-enter-2'],
    ['4500019509', '수원 공장 (1070)', demoDay(-7,'dot'), '6,900,000', '후속 문서', 'Success', 'sys-enter-2']
  ];
  const poCell = (no, date, val, press) => `<VBox class="sapUiTinyMarginTopBottom">
      <Link text="재고 이전 오더" press="${press}" class="demoBold"/><Text text="${no}" class="sapUiTinyMarginBottom"/>
      <HBox><Label text="구매오더 일자" showColon="true" class="sapUiTinyMarginEnd"/><Text text="${date}"/></HBox>
      <HBox><Label text="순 오더 금액" showColon="true" class="sapUiTinyMarginEnd"/><Text text="${val}" class="sapUiSmallMarginEnd"/><Text text="KRW"/></HBox></VBox>`;
  const apprCells = `<ObjectStatus text="자동 승인됨" state="Success" icon="sap-icon://sys-enter-2"/><Text text="자동 승인" wrapping="false"/>`;
  const advBtn = `<Button icon="sap-icon://hint" type="Ghost" tooltip="고급 정보"/>`;
  const lrRow = r => { const press = `H.toast('데모에서는 구매오더 4500019567의 상세 화면을 제공합니다')`;
    return `<ColumnListItem type="Navigation" press="${press}"><cells>${poCell(r[0], r[2], r[3], press)}${advBtn}
      <Text text="${r[1]}"/><Text text="BestRun Korea (1000)"/><ObjectStatus text="${r[4]}" state="${r[5]}" icon="sap-icon://${r[6]}"/>${apprCells}</cells></ColumnListItem>`; };
  const fgi = (name, label, ctrl) => `<fb:FilterGroupItem name="${name}" label="${label}" groupName="g" visibleInFilterBar="true"><fb:control>${ctrl}</fb:control></fb:FilterGroupItem>`;
  const V_STO_LR = view(shell('구매오더 관리', 'agent7', 'agent7') + `
    <f:DynamicPage headerExpanded="true" toggleHeaderOnTitleClick="true">
      <f:layoutData><FlexItemData growFactor="1" baseSize="0" minHeight="0"/></f:layoutData>
      <f:title><f:DynamicPageTitle>
        <f:heading><VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/><VariantItem key="ub" title="재고 이전 오더 (UB)"/></items></VariantManagement></f:heading>
        <f:actions><SegmentedButton selectedKey="list"><items><SegmentedButtonItem key="list" icon="sap-icon://text-align-left" tooltip="필터 바"/><SegmentedButtonItem key="ai" icon="sap-icon://ai" tooltip="AI 필터"/></items></SegmentedButton></f:actions>
        <f:navigationActions>${ico('action', '공유')}</f:navigationActions>
      </f:DynamicPageTitle></f:title>
      <f:header><f:DynamicPageHeader pinnable="true">
        <fb:FilterBar useToolbar="false" showGoOnFB="true" showFilterConfiguration="true" search="H.toast('구매오더 6건을 조회했습니다')">
          <fb:filterGroupItems>
            ${fgi('q', '', '<SearchField placeholder="검색" width="100%"/>')}
            ${fgi('es', '편집 상태', '<Select selectedKey="all" width="100%"><core:Item key="all" text="전체"/><core:Item key="own" text="본인 초안"/><core:Item key="locked" text="다른 사용자가 잠금"/><core:Item key="none" text="변경 없음"/></Select>')}
            ${fgi('sup', '공급업체', '<MultiInput showValueHelp="true"/>')}
            ${fgi('po', '구매오더', '<MultiInput showValueHelp="true"/>')}
            ${fgi('pg', '구매그룹', '<MultiInput showValueHelp="true"/>')}
            ${fgi('cc', '회사코드', '<MultiInput showValueHelp="true"/>')}
            ${fgi('st', '상태', '<MultiComboBox><core:Item key="ns" text="미송부"/><core:Item key="s" text="송부됨"/><core:Item key="tr" text="운송 중"/><core:Item key="fd" text="후속 문서"/></MultiComboBox>')}
            ${fgi('mat', '자재', '<MultiInput showValueHelp="true"/>')}
            ${fgi('pl', '플랜트', '<MultiInput showValueHelp="true"/>')}
            ${fgi('dt', '구매오더 일자', '<DateRangeSelection displayFormat="yyyy.MM.dd"/>')}
          </fb:filterGroupItems>
        </fb:FilterBar>
      </f:DynamicPageHeader></f:header>
      <f:content>
        <Table mode="SingleSelectLeft" sticky="ColumnHeaders,HeaderToolbar">
          <headerToolbar><OverflowToolbar style="Clear"><Title text="구매오더 (6)" level="H3"/>
            <VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement><ToolbarSpacer/>
            <Button text="복사" type="Transparent" enabled="false"/><Button text="승인에서 철회" type="Transparent" enabled="false"/>
            <Button text="생성" type="Transparent" press="H.toast('구매오더 생성 - 고급 앱으로 이동합니다 (데모에서는 시연하지 않음)')"/><Button text="삭제" type="Transparent" enabled="false"/>
            ${ico('copy', '붙여넣기')}<SegmentedButton selectedKey="c"><items><SegmentedButtonItem key="e" icon="sap-icon://expand-all" tooltip="펼치기"/><SegmentedButtonItem key="c" icon="sap-icon://collapse-all" tooltip="접기"/></items></SegmentedButton>
            ${ico('action-settings', '보기 설정')}${ico('excel-attachment', '스프레드시트로 내보내기')}${ico('overflow', '추가')}
          </OverflowToolbar></headerToolbar>
          <columns>
            <Column width="16rem"><Text text="구매오더"/></Column><Column width="4.5rem" hAlign="Center"><Text text="고급" wrapping="false"/></Column>
            <Column><Text text="공급업체"/></Column><Column><Text text="회사코드"/></Column><Column><Text text="상태"/></Column>
            <Column minScreenWidth="Tablet" demandPopin="true"><Text text="승인 상태"/></Column><Column minScreenWidth="Tablet" demandPopin="true"><Text text="승인자"/></Column>
          </columns>
          <items>
            <ColumnListItem type="Navigation" press="H.go('fiori-sto-object')"><cells>
              ${poCell('4500019567', '{/times/stoDate}', '9,440,000', "H.go('fiori-sto-object')")}${advBtn}
              <Text text="인천 물류창고 (1060)"/><Text text="BestRun Korea (1000)"/><ObjectStatus text="{/sto/statusText}" state="{/sto/statusState}" icon="{/sto/statusIcon}"/>${apprCells}</cells></ColumnListItem>
            ${stoRows.map(lrRow).join('')}
          </items>
        </Table>
      </f:content>
    </f:DynamicPage>`);

  const poStat = (l, v) => `<form:FormElement><form:label><Label text="${l}" showColon="true"/></form:label><form:fields><ObjectStatus text="${v}" state="Success"/></form:fields></form:FormElement>`;
  const poNoteTab = (t, content = '') => `<IconTabFilter text="${t}">${content || '<TextArea editable="false" width="100%" rows="6" value=""/>'}</IconTabFilter>`;
  /* ───────── 자재 문서 ───────── */
  const V_MD = view(shell('자재 문서', 'fiori-sto-object', 'agent7') + op(
    title('{/md/no} ' + demoYear(), '', '<Button text="역분개" press="H.toast(\'데모에서는 역분개를 실행하지 않습니다\')"/><Button text="관련 앱"/>' + ico('action', '공유'),
      `<uxap:breadcrumbs><Breadcrumbs><Link text="구매오더 4500019567" press="H.go('fiori-sto-object')"/></Breadcrumbs></uxap:breadcrumbs>`),
    sec('일반 정보', form([
      ['일반 정보', [['문서일', '{/md/date}'], ['전기일', '{/md/date}'], ['생성자', 'JKIM'], ['문서유형', '{/md/type}']]],
      ['', [['재고 트랜잭션 유형', '{/md/trx}'], ['생성 일시', '{/md/at}']]],
      ['문서 메모', [['납품서', '80012345'], ['선하증권', '–'], ['메모', '–']]]
    ], 3)) +
    sec('항목', `<Table>${tbar('항목 (1)', ico('action-settings', '보기 설정') + ico('excel-attachment', '내보내기'))}
      <columns><Column><Text text="자재 문서 항목"/></Column><Column><Text text="자재"/></Column><Column><Text text="이동 유형"/></Column><Column hAlign="End"><Text text="수량"/></Column><Column><Text text="플랜트"/></Column><Column><Text text="저장위치"/></Column></columns>
      <items><ColumnListItem type="Navigation"><cells><Text text="1"/><Text text="유압실린더 (A-4315)"/><Text text="{/md/mvt}"/><ObjectNumber number="40" unit="EA"/><Text text="{/md/plant}"/><Text text="0001"/></cells></ColumnListItem></items></Table>`) +
    sec('첨부', emptyList('첨부 (0)')) +
    sec('프로세스 흐름', `<pf:ProcessFlow id="mdFlow" scrollable="false" foldedCorners="true" nodePress="H.flowPress" nodes="{/md/flow/nodes}" lanes="{/md/flow/lanes}">
        <pf:nodes><pf:ProcessFlowNode laneId="{lane}" nodeId="{id}" title="{title}" titleAbbreviation="{abbr}" children="{children}" state="{state}" stateText="{stateText}" texts="{texts}" focused="{focused}"/></pf:nodes>
        <pf:lanes><pf:ProcessFlowLaneHeader laneId="{id}" iconSrc="{icon}" text="{label}" position="{position}"/></pf:lanes>
      </pf:ProcessFlow>`),
    { header: hc(`<Avatar src="sap-icon://shipping-status" displayShape="Square" displaySize="L" backgroundColor="Accent6" class="sapUiMediumMarginEnd sapUiSmallMarginBottom"/>` +
      facet('역분개된 항목 수', '<Text text="0 / 1"/><ProgressIndicator percentValue="0" width="10rem" displayOnly="true" showValue="false"/>') +
      kvs([['참조', '구매오더 4500019567'], ['납품', '80012345']])) }));

  /* ───────── 구매오더 (PO 납기 변경) — S/4HANA Cloud '구매오더 관리' Object Page 구성 ───────── */
  const V_PO = view(shell('구매오더', 'agent3', 'agent3') + op(
    title('4500019234', '표준 구매오더',
      '<Button text="편집" type="Emphasized"/><Button text="복사" type="Ghost"/><Button text="약정 표시" type="Ghost"/><Button text="상태 세부사항" type="Ghost"/><Button text="변경 로그 표시" type="Ghost" press="H.toast(\'변경 로그: 항목 10 납품일 변경 요청 — JKIM (Joule MRP Exception Agent 대행)\')"/>' +
      '<Button text="Easy Fill" icon="sap-icon://ai" type="Ghost" press="H.toast(\'Joule Easy Fill — 데모에서는 시연하지 않습니다\')"/>' +
      '<Button text="요약" icon="sap-icon://ai" type="Ghost" press="H.toast(\'Joule: 항목 10 납기 3일 단축을 요청했고 공급업체 확약을 기다리고 있습니다\')"/>' + ico('action', '공유')),
    sec('일반 정보', form([
      ['기본 데이터', [['구매 문서 유형', '표준 구매오더 (NB)'], ['공급업체', 'ACME Components Korea (1001234)', true], ['통화', '대한민국 원 (KRW)'], ['언어 키', '한국어 (KO)']]],
      ['조직', [['구매그룹', '김재형 (MMK)'], ['구매조직', 'BestRun Korea 구매 (1000)'], ['회사코드', 'BestRun Korea (1000)']]],
      ['추가 정보', [['생성자', 'JKIM (김재형)'], ['구매오더 일자', demoDay(-9)], ['승인 상태', '–'], ['승인자 이름', '–']]]
    ], 3)) +
    sec('항목', `<Table sticky="ColumnHeaders,HeaderToolbar"><headerToolbar><OverflowToolbar style="Clear"><Title text="항목 (2)" level="H3"/>
        <VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement><ToolbarSpacer/>
        <SearchField width="17.5rem" placeholder="검색"/><Button text="복사" type="Transparent" enabled="false"/>${ico('copy', '붙여넣기')}${ico('action-settings', '보기 설정')}${ico('excel-attachment', '내보내기')}</OverflowToolbar></headerToolbar>
      <columns><Column width="4.5rem"><Text text="항목"/></Column><Column><Text text="항목 범주"/></Column><Column><Text text="자재"/></Column><Column><Text text="내역"/></Column>
        <Column><Text text="자재 그룹"/></Column><Column><Text text="플랜트"/></Column><Column hAlign="End"><Text text="오더 수량"/></Column>
        <Column><Text text="납품일"/></Column><Column><Text text="확인 상태"/></Column></columns>
      <items>
        <ColumnListItem type="Navigation" highlight="Information"><cells><Text text="10"/><Text text="표준"/><Link text="A-4315 (A-4315)"/><Text text="유압실린더"/><Text text="유압 부품 (HYD01)"/><Text text="부산 생산공장 (1050)"/><ObjectNumber number="45" unit="EA"/>
          <VBox><Text text="${demoMD(1,15)}"/><ObjectStatus text="변경 요청 ${demoMD(1,12)} (-3일)" state="Information" class="sapUiTinyMarginTop"/></VBox><ObjectStatus text="확약 대기" state="Warning" icon="sap-icon://pending"/></cells></ColumnListItem>
        <ColumnListItem type="Navigation"><cells><Text text="20"/><Text text="표준"/><Link text="B-2290 (B-2290)"/><Text text="베어링 어셈블리"/><Text text="구동 부품 (DRV02)"/><Text text="부산 생산공장 (1050)"/><ObjectNumber number="100" unit="EA"/>
          <Text text="${demoMD(1,10)}"/><ObjectStatus text="확약됨" state="Success" icon="sap-icon://sys-enter-2"/></cells></ColumnListItem>
      </items></Table>`) +
    sec('한도 항목', `<Table noDataText="아직 항목이 없습니다. 항목이 생기면 여기에 표시됩니다."><headerToolbar><OverflowToolbar style="Clear"><Title text="한도 항목" level="H3"/>
        <VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement><ToolbarSpacer/>
        <SearchField width="17.5rem" placeholder="검색"/>${ico('copy', '붙여넣기')}${ico('action-settings', '보기 설정')}${ico('excel-attachment', '내보내기')}</OverflowToolbar></headerToolbar>
      <columns><Column width="4.5rem"><Text text="항목"/></Column><Column><Text text="내역"/></Column><Column hAlign="End"><Text text="예상 금액"/></Column><Column hAlign="End"><Text text="전체 한도"/></Column>
        <Column><Text text="한도 계약"/></Column><Column><Text text="계약 항목"/></Column><Column><Text text="계정 지정 범주"/></Column><Column><Text text="제품 유형 그룹"/></Column><Column><Text text="플랜트"/></Column></columns>
      <items></items></Table>`) +
    sec('납품 및 송장', form([
      ['', [['인코텀즈 버전', '버전 없음'], ['인코텀즈', 'FCA (운송인 인도)']]],
      ['', [['인코텀즈 위치 1', '부산'], ['인코텀즈 위치 2', '–']]],
      ['', [['인트라스탯 관련성', '아니요'], ['인트라스탯 제외', '아니요']]]
    ], 3)) +
    sec('공급업체 연락처 데이터', form([
      ['공급업체 주소', [['전체 이름', 'ACME Components Korea'], ['도로', '테헤란로'], ['번지', '152']]],
      ['', [['우편번호', '06236'], ['도시', '서울'], ['국가 / 지역 키', 'KR'], ['지역', '서울특별시']]],
      ['', [['전화번호', '02-555-0142'], ['팩스 번호', '–'], ['이메일 주소', 'order@acme-components.kr']]],
      ['담당자', [['영업 담당자', '박민수'], ['공급업체 전화', '010-2345-6789'], ['귀사 참조', '–'], ['당사 참조', 'MMK-' + demoDay(-9, 'iso').slice(0, 4) + '-' + demoDay(-9, 'md').replace('-', '')]]]
    ], 4)) +
    sec('제품 규정 준수', `<form:Form editable="false"><form:layout><form:ColumnLayout columnsM="2" columnsL="3" columnsXL="4" labelCellsLarge="12"/></form:layout><form:formContainers>
      <form:FormContainer><form:formElements>${poStat('공급업체 점검 상태', 'OK – 관련 없음')}</form:formElements></form:FormContainer>
      <form:FormContainer><form:formElements>${poStat('제품 판매 가능 상태', 'OK – 관련 없음')}</form:formElements></form:FormContainer>
      <form:FormContainer><form:formElements>${poStat('위험물 상태', 'OK – 관련 없음')}</form:formElements></form:FormContainer>
      <form:FormContainer><form:formElements>${poStat('안전 데이터 시트 상태', 'OK – 관련 없음')}</form:formElements></form:FormContainer>
    </form:formContainers></form:Form>`) +
    sec('메모', `<IconTabBar expandable="false" headerMode="Inline" class="sapUiNoContentPadding"><items>` +
      poNoteTab('헤더 텍스트', `<TextArea editable="false" width="100%" rows="6" growing="true" value="[Joule MRP Exception Agent] MRP 예외 10 (일정 앞당김) — 제조오더 MO-26-0891 대응으로 항목 10(A-4315)의 납기를 ${demoMD(1,15)} → ${demoMD(1,12)}로 앞당기는 변경을 요청하고 ACME Components Korea에 확약을 요청했습니다. 확약 전까지 기존 납기 유지 · 48시간 내 미회신 시 1060 재고 이전으로 전환. 변경자: JKIM (Joule MRP Exception Agent 대행) · {/times/po}"/>`) +
      ['헤더 메모', '가격 유형', '기한', '납품 조건', '선적 지시', '지급 조건', '보증', '계약 위반 위약금', '보증서'].map(t => poNoteTab(t)).join('') +
      `</items></IconTabBar>`) +
    sec('출력 관리', `<Table>${tbar('출력 항목 (1)', ico('action-settings', '보기 설정'), false)}
      <columns><Column><Text text="출력 유형"/></Column><Column><Text text="채널"/></Column><Column><Text text="수신자"/></Column><Column><Text text="양식 템플릿"/></Column><Column><Text text="상태"/></Column><Column><Text text="변경일"/></Column></columns>
      <items><ColumnListItem><cells><Text text="구매오더"/><Text text="이메일"/><Text text="order@acme-components.kr"/><Text text="MM_PUR_PURCHASE_ORDER"/><ObjectStatus text="완료됨" state="Success"/><Text text="{/times/po}"/></cells></ColumnListItem></items></Table>`) +
    sec('첨부', emptyList('첨부 (0)')),
    { header: hc(
      facet('상태', '<Text text="확약 대기" class="demoHeaderValue"/>') +
      facet('구매오더 일자', `<Text text="${demoDay(-9)}" class="demoHeaderValue"/>`) +
      facet('순 금액', '<Text text="28,720,000   대한민국 원 (KRW)" class="demoHeaderValue"/>')) }));

  /* ───────── 구매요청 (Purchase Requisition) ───────── */
  const V_PR = view(shell('구매요청', 'agent6', 'agent6') + op(
    title('10008976', '', '<Button text="편집" type="Emphasized"/><Button text="복사"/><Button text="총 금액 통화"/>' + ico('action', '공유')),
    sec('일반 정보', form([['', [['구매요청 내역', `${demoMon(1,'kr')} 수요예측 부족 자재 보충 (Joule 자동 생성)`], ['생성일', '{/times/prDate}']]], ['', [['문서유형', '구매요청 (NB)'], ['요청자', 'JKIM 김재형 (Joule 대행) · 승인자: 이도윤 상무']]]], 2)) +
    sec('메모', `<IconTabBar expandable="false" headerMode="Inline" class="sapUiNoContentPadding"><items><IconTabFilter text="헤더 메모"><TextArea editable="false" width="100%" rows="4" growing="true" value="{/pr/note}"/></IconTabFilter></items></IconTabBar>`) +
    sec('항목', `<Table items="{/pr/items}" sticky="ColumnHeaders,HeaderToolbar">${tbar('항목 (8)', '<Button text="가격 업데이트" type="Transparent" enabled="false"/><Button text="삭제" type="Transparent" enabled="false"/><Button text="거부된 항목 편집" type="Transparent" enabled="false"/>' + ico('action-settings', '보기 설정') + ico('excel-attachment', '내보내기'))}
      <columns>
        <Column><Text text="품목"/></Column><Column><Text text="제품 유형 그룹"/></Column><Column><Text text="자재"/></Column><Column><Text text="자재 그룹"/></Column><Column><Text text="플랜트"/></Column><Column hAlign="End"><Text text="수량"/></Column>
        <Column minScreenWidth="9000px" demandPopin="true" popinDisplay="Inline"><Text text="평가 가격"/></Column>
        <Column minScreenWidth="9000px" demandPopin="true" popinDisplay="Inline"><Text text="총 금액"/></Column>
      </columns>
      <items><ColumnListItem type="Navigation" press="H.toast('데모에서는 항목 상세 화면을 제공하지 않습니다')"><cells>
        <ObjectIdentifier title="{name}" text="{no}"/><Text text=""/><Link text="{name} ({mat})"/><Text text="{grp}"/><Text text="1050 (부산 생산공장)"/><ObjectNumber number="{qty}" unit="EA"/>
        <Text text="{price} KRW"/><Text text="{total} KRW"/></cells></ColumnListItem></items></Table>`) +
    sec('첨부', emptyList('첨부 (0)')),
    { header: hc(`<Avatar src="sap-icon://cart" displayShape="Square" displaySize="L" backgroundColor="Accent6" class="sapUiMediumMarginEnd sapUiSmallMarginBottom"/>` +
      facet('상태', '<Text text="승인 대기 중" class="demoHeaderValue"/>') +
      facet('총 금액', '<ObjectNumber number="127,700,000" unit="KRW" class="sapMObjectNumberLarge"/>')) }));

  /* ───────── 회계전표 (분개 관리) ───────── */
  const jeLine = (n, g, d, c) => `<ColumnListItem type="Navigation"><cells><Text text="${n}"/><Link text="${g}"/><ObjectNumber number="${d}" unit="KRW"/><ObjectNumber number="${c}" unit="KRW"/></cells></ColumnListItem>`;
  const V_FI = view(shell('분개 관리', 'agent4', 'agent4') + op(
    `<uxap:ObjectPageDynamicHeaderTitle>
      <uxap:expandedHeading><Title text="5100003421"/></uxap:expandedHeading><uxap:snappedHeading><Title text="5100003421"/></uxap:snappedHeading>
      <uxap:actions><Button text="편집" type="Emphasized"/><Button text="서신 생성"/><Button text="문서 흐름" press="H.fiFlow"/><Button text="변경 로그 표시"/>${ico('action', '공유')}</uxap:actions>
      <uxap:navigationActions><Button icon="sap-icon://full-screen" type="Transparent" tooltip="전체 화면"/><Button icon="sap-icon://decline" type="Transparent" tooltip="닫기" press="H.go('agent4')"/></uxap:navigationActions>
    </uxap:ObjectPageDynamicHeaderTitle>`,
    sec('일반 정보', form([
      ['트랜잭션 데이터', [['문서 헤더 텍스트', 'INV-2946 Alpha Co.'], ['분개 유형', 'RE (송장 - 총액)'], ['회사코드', '1000 (BestRun Korea)'], ['문서 참조 ID', 'INV-2946'], ['참조 문서 유형', 'RMRP (송장 문서)'], ['원래 참조 문서', '5105623000' + demoYear(), true]]],
      ['일자 및 시간', [['분개 일자', '{/times/fiDate}'], ['전기일', '{/times/fiDate}'], ['회계연도 기간', demoPeriod()], ['분개 생성자', 'JKIM (김재형)', true], ['생성일', '{/times/fi}']]],
      ['금액', [['회사코드 통화 금액', '13,800,000 KRW'], ['거래 통화 금액', '13,800,000 KRW'], ['기능 통화 금액', '13,800,000 KRW']]],
      ['워크플로', [['워크플로 상태', '워크플로 관련 없음'], ['지급 보류', '해제됨 (이전: R — 가격 차이)']]]
    ])) +
    sec('라인 항목', `<VBox>
      <SegmentedButton selectedKey="ledger" class="sapUiSmallMarginBottom"><items><SegmentedButtonItem key="ledger" text="원장 보기"/><SegmentedButtonItem key="entry" text="전표 보기"/></items></SegmentedButton>
      <Table mode="MultiSelect"><headerToolbar><OverflowToolbar style="Clear">
        <Title text="라인 항목 (3)" level="H3"/><VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement>
        <Label text="원장" showColon="true"/><Select selectedKey="0L" width="11rem"><core:Item key="0L" text="0L (원장 0L)"/></Select>
        <Label text="표시 통화" showColon="true"/><Select selectedKey="t" width="14rem"><core:Item key="t" text="KRW (거래 통화)"/></Select>
        <Link text="T-계정 보기"/><ToolbarSpacer/>${ico('action-settings', '보기 설정')}${ico('excel-attachment', '내보내기')}${ico('full-screen', '전체 화면')}
      </OverflowToolbar></headerToolbar>
      <columns><Column width="9rem"><Text text="분개 항목"/></Column><Column><Text text="G/L 계정"/></Column><Column hAlign="End"><Text text="차변"/></Column><Column hAlign="End"><Text text="대변"/></Column></columns>
      <items>${jeLine('000001', '21100000 (외상매입금 - 국내)', '0', '13,800,000')}${jeLine('000002', '21120000 (GR/IR 정산)', '12,400,000', '0')}${jeLine('000003', '52540000 (구매 가격 차이)', '1,400,000', '0')}</items></Table>
      <HBox class="sapUiSmallMarginTop"><VBox class="sapUiLargeMarginEnd"><Label text="총 차변"/><Text text="13,800,000 KRW" class="demoBold"/></VBox><VBox><Label text="총 대변"/><Text text="13,800,000 KRW" class="demoBold"/></VBox></HBox>
      </VBox>`) +
    sec('관련 문서', `<table:TreeTable id="relTree" rows="{path:'/fi/rel', parameters:{arrayNames:['children']}}" selectionMode="None" visibleRowCount="5" expandFirstLevel="true" enableColumnReordering="false">
        <table:extension><OverflowToolbar style="Clear"><Title text="관련 문서" level="H3"/><VariantManagement selectedKey="std" defaultKey="std"><items><VariantItem key="std" title="표준"/></items></VariantManagement><ToolbarSpacer/>${ico('action-settings', '보기 설정')}</OverflowToolbar></table:extension>
        <table:columns>
          <table:Column width="16rem"><Label text="문서 유형"/><table:template><Text text="{type}" wrapping="false"/></table:template></table:Column>
          <table:Column><Label text="문서"/><table:template><Link text="{doc}"/></table:template></table:Column>
          <table:Column><Label text="참조 문서 논리 시스템"/><table:template><Text text=""/></table:template></table:Column>
          <table:Column width="8rem"><Label text="회사코드"/><table:template><Text text="{cc}"/></table:template></table:Column>
          <table:Column width="8rem"><Label text="분개 유형"/><table:template><Text text="{je}"/></table:template></table:Column>
          <table:Column width="8rem"><Label text="회계연도"/><table:template><Text text="${demoYear()}"/></table:template></table:Column>
        </table:columns></table:TreeTable>`, 'fiRel') +
    sec('메모', `<VBox><FeedInput placeholder="여기에 게시하세요" showIcon="false"/>
      <List showSeparators="Inner"><FeedListItem sender="Joule · 3-Way Matching Agent" icon="${JOULE}" iconDensityAware="false" timestamp="{/times/fi}" showIcon="true"
        text="가격차이(+14,000원/EA)로 지급보류된 송장 INV-2946을 구매계약 PA-2026-112(${demoMD(-1,1,'iso')} 갱신) 근거로 해제하고 전기했습니다. 같은 원인의 미입고 PO 3건(4500019201 · 4500019233 · 4500019260)도 단가 갱신 대상으로 식별했습니다."/></List></VBox>`) +
    sec('첨부', emptyList('첨부 (0)')),
    { id: 'fiOP' }));

  const VIEWS = {
    'fiori-sto-display': V_STO_LR, 'fiori-matdoc': V_MD,
    'fiori-po-delivery': V_PO, 'fiori-pr-display': V_PR, 'fiori-accounting-doc': V_FI
  };

  /* ───────── 모델 데이터 ───────── */
  const PR_ITEMS = [
    ['10', '유압실린더', 'A-4315', '유압 부품 (HYD01)', 100, '236,000', '23,600,000', demoMD(1, 5), 'Supplier Alpha'],
    ['20', '베어링 어셈블리', 'B-2290', '구동 부품 (DRV02)', 100, '181,000', '18,100,000', demoMD(1, 8), 'Supplier Alpha'],
    ['30', '클러치 디스크', 'D-5501', '구동 부품 (DRV02)', 100, '165,000', '16,500,000', demoMD(1, 15), 'Supplier Beta'],
    ['40', '오일씰 킷 A', 'F-1120', '씰·가스켓 (SEL03)', 60, '89,167', '5,350,000', demoMD(1, 10), 'Supplier Gamma'],
    ['50', '구동축 베어링', 'G-3380', '구동 부품 (DRV02)', 40, '155,000', '6,200,000', demoMD(1, 12), 'Supplier Gamma'],
    ['60', '브레이크 패드 세트', 'H-2210', '브레이크 부품 (BRK04)', 200, '98,750', '19,750,000', demoMD(1, 10), 'Supplier Epsilon'],
    ['70', '유압 호스 어셈블리', 'J-4410', '유압 부품 (HYD01)', 150, '128,000', '19,200,000', demoMD(1, 12), 'Supplier Epsilon'],
    ['80', '실린더 피스톤', 'K-5520', '유압 부품 (HYD01)', 100, '190,000', '19,000,000', demoMD(1, 15), 'Supplier Zeta']
  ].map(([no, name, mat, grp, qty, price, total, dd, sup]) => ({ no, name, mat, grp, qty, price, total, dd, sup }));

  const pad = n => String(n).padStart(2, '0');
  const fmt = (d, kind) => {
    const date = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    if (kind === 'date') return date;
    if (kind === 'minute') return `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const docT = k => { try { if (typeof docTimes !== 'undefined' && docTimes[k]) return docTimes[k]; } catch (e) {} return new Date(); };

  sap.ui.require(['sap/ui/core/Core'], Core => Core.ready().then(() => sap.ui.require([
    'sap/ui/core/mvc/XMLView', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', 'sap/m/MessageBox', 'sap/ui/core/Element', 'sap/m/MessagePopover', 'sap/m/MessageItem'
  ], (XMLView, JSONModel, MessageToast, MessageBox, Element, MessagePopover, MessageItem) => {
    const model = new JSONModel({ times: {}, sto: { s: 0, log: [], flow: { nodes: [], lanes: [] } }, md: { flow: { nodes: [], lanes: [] } },
      pr: { items: PR_ITEMS, note: '' }, fi: { rel: [] } });
    model.setSizeLimit(500);

    model.setProperty('/fi/rel', [{ type: '회계 문서', doc: '5100003421', cc: '1000', je: 'RE', children: [
      { type: '송장 문서 (INV-2946)', doc: '5105623000', cc: '1000', je: '' },
      { type: '구매오더', doc: '4500019156', cc: '1000', je: '' },
      { type: '자재 문서 (입고 101)', doc: '5000538488', cc: '1000', je: 'WE' },
      { type: `구매계약 (갱신 ${demoMD(-1, 1, 'iso')})`, doc: 'PA-2026-112', cc: '1000', je: '' }] }]);

    function syncTimes() {
      model.setProperty('/times', {
        po: fmt(docT('po')), fi: fmt(docT('fi')), fiDate: fmt(docT('fi'), 'date'),
        prDate: fmt(docT('pr'), 'date'), stoDate: fmt(docT('sto'), 'date')
      });
      model.setProperty('/pr/note', `[Joule 수요예측 Agent] SAP AI Core의 SAP-RPT 1.6 Large 예측 모델로 ${demoMon(1,'kr')} 수요를 예측해 부족 자재 8개를 선정했습니다. 평균 신뢰도 85% · 오차 ±8%.\nA-4315는 입고 예정 PO 95 EA, 재고 이전 4500019567(40 EA), 품질 검사 합격 18 EA를 차감한 순부족 67 EA에 안전재고 20 EA를 더해 최소발주량(50) 단위로 100 EA 요청합니다.\n요청: 김재형 (Joule 대행) · 승인 요청: 이도윤 상무 (구매본부장) · ${fmt(docT('pr'), 'minute')}`);
    }

    const ST = [['생성됨', 'None', ''], ['납품 생성됨', 'Information', 'sap-icon://information'], ['운송 중', 'Information', 'sap-icon://shipping-status'], ['입고 완료', 'Success', 'sap-icon://sys-enter-2']];
    const ITEM = ['미결', '납품 생성됨', '출고 완료', '입고 완료'];
    function syncSto() {
      const s = window.stoState; if (!s) return;
      const st = ST[s.s];
      const node = (id, lane, title, abbr, done, stateText, texts, children, extra = {}) =>
        Object.assign({ id, lane, title, abbr, state: done ? 'Positive' : 'Planned', stateText, texts, children, focused: false }, extra);
      model.setProperty('/sto', {
        s: s.s, statusText: st[0], statusState: st[1], statusIcon: st[2], itemStatus: ITEM[s.s],
        logTitle: `이벤트 (${s.log.length})`, log: s.log.slice().reverse().map(e => ({ at: fmt(e.at), who: e.who, what: e.what, res: e.res })),
        flow: {
          lanes: [
            { id: '0', icon: 'sap-icon://order-status', label: '구매오더 (UB)', position: 0 },
            { id: '1', icon: 'sap-icon://shipping-status', label: '아웃바운드 납품', position: 1 },
            { id: '2', icon: 'sap-icon://less', label: '출고', position: 2 },
            { id: '3', icon: 'sap-icon://cargo-train', label: '운송 중 재고', position: 3 },
            { id: '4', icon: 'sap-icon://add', label: '입고', position: 4 }],
          nodes: [
            node('n0', '0', '4500019567', 'STO', true, '생성됨', ['UB · 1060 → 1050'], ['n1'], { focused: true }),
            node('n1', '1', s.dlv || '아웃바운드 납품', 'DLV', !!s.dlv, s.dlv ? (s.s >= 2 ? '출고 완료' : '생성됨') : '대기', ['출하지점 1060'], ['n2']),
            node('n2', '2', s.gi || '출고 자재 문서', 'GI', !!s.gi, s.gi ? '전기됨' : '대기', ['이동 유형 641'], ['n3']),
            node('n3', '3', s.gi ? '1050 · 40 EA' : '운송 중 재고', 'TR', !!s.gi, s.gi ? (s.gr ? '해소됨' : '운송 중') : '대기', ['운송 중 재고'], ['n4'], s.gi && !s.gr ? { state: 'Neutral' } : {}),
            node('n4', '4', s.gr || '입고 자재 문서', 'GR', !!s.gr, s.gr ? '전기됨' : '대기', ['이동 유형 101'], [])]
        }
      });
      const L = s.log, act = L.filter(e => !/^Joule/.test(e.who));
      const refOf = e => ((e.res + ' ' + e.what).match(/\b\d{8,10}\b/) || [''])[0];
      model.setProperty('/sto/dlvs', s.dlv ? [{ no: s.dlv, pick: s.s >= 2 ? '완료' : '미결', pickState: s.s >= 2 ? 'Success' : 'None', gi: s.s >= 2 ? '완료 (641)' : '미결', giState: s.s >= 2 ? 'Success' : 'None' }] : []);
      model.setProperty('/sto/dlvTitle', `아웃바운드 납품 (${s.dlv ? 1 : 0})`);
      model.setProperty('/sto/hist', act.slice().reverse().map(e => ({ at: fmt(e.at), what: e.what, who: e.who, ref: refOf(e) })));
      model.setProperty('/sto/msgs', act.slice().reverse().map(e => ({ type: 'Success', title: e.what, subtitle: fmt(e.at) })));
      const pfc = Element.getElementById && Element.getElementById('ui5-fiori-sto-object--stoFlow');
      if (pfc && pfc.updateModel) try { pfc.updateModel(); } catch (e) {}
    }
    function setMd(kind) {
      const s = window.stoState; const gr = kind === 'gr';
      const at = (gr ? s.grAt : s.giAt) || new Date();
      const d = gr
        ? { type: '입고 (WE)', trx: 'GR, 재고 이전 오더 입고 (WE)', mvt: '101 — 입고', plant: '1050 (부산 생산공장)' }
        : { type: '출고 (WL)', trx: 'GI, 납품 기준 출고 (WL)', mvt: '641 — 운송 중 재고로 이전', plant: '1060 (인천 물류창고)' };
      const n = (id, lane, title, done, stateText, texts, children, extra = {}) =>
        Object.assign({ id, lane, title, abbr: '', state: done ? 'Positive' : 'Planned', stateText, texts, children, focused: false }, extra);
      const nodes = [
        n('m0', '0', s.gi, true, 'OK', [demoYear(), '641 · 1060 / 0001'], ['m1', 'm3'], { focused: !gr }),
        n('m1', '1', '1050 · 40 EA', true, s.gr ? '해소됨' : '운송 중', ['운송 중 재고'], ['m2'], s.gr ? {} : { state: 'Neutral' }),
        n('m2', '2', s.gr || '입고 대기', !!s.gr, s.gr ? 'OK' : '대기', [demoYear(), '101 · 1050 / 0001'], s.gr ? ['m4'] : [], { focused: gr }),
        n('m3', '3', '4900006711', true, 'OK', [demoYear()], [])
      ];
      if (s.gr) nodes.push(n('m4', '3', '4900006719', true, 'OK', [demoYear()], []));
      model.setProperty('/md', Object.assign({ no: gr ? s.gr : s.gi, date: fmt(at, 'date'), at: fmt(at) }, d, {
        flow: { lanes: [
          { id: '0', icon: 'sap-icon://less', label: '출고 재고', position: 0 },
          { id: '1', icon: 'sap-icon://cargo-train', label: '운송 중 재고', position: 1 },
          { id: '2', icon: 'sap-icon://add', label: '입고 재고', position: 2 },
          { id: '3', icon: 'sap-icon://money-bills', label: '회계 문서', position: 3 }], nodes }
      }));
      const pfc = Element.getElementById && Element.getElementById('ui5-fiori-matdoc--mdFlow');
      if (pfc && pfc.updateModel) try { pfc.updateModel(); } catch (e) {}
    }

    /* 이벤트 핸들러 모듈 (XML의 core:require로 참조) */
    sap.ui.define('demo/fh', [], () => ({
      go: page => router.go(page),
      toast: text => MessageToast.show(text),
      msgs: e => {
        const b = e.getSource();
        if (!window.__stoPop) { window.__stoPop = new MessagePopover({ items: { path: '/sto/msgs', template: new MessageItem({ type: '{type}', title: '{title}', subtitle: '{subtitle}' }) } }); window.__stoPop.setModel(model); }
        window.__stoPop.toggle(b);
      },
      stoDlv: () => window.stoCreateDelivery(),
      stoGI: () => window.stoPostGI(),
      stoGR: () => window.stoPostGR(),
      fiFlow: () => { const opl = Element.getElementById('ui5-fiori-accounting-doc--fiOP'); const s = Element.getElementById('ui5-fiori-accounting-doc--fiRel'); if (opl && s) opl.scrollToSection(s.getId()); },
      flowPress: e => {
        const nd = e && e.getParameters ? e.getParameters() : e;
        const id = nd && nd.getNodeId ? nd.getNodeId() : '';
        const st = window.stoState || {};
        if ((id === 'n2' || id === 'm0') && st.gi) window.fopOpenMatdoc('gi');
        else if ((id === 'n4' || id === 'm2') && st.gr) window.fopOpenMatdoc('gr');
      }
    }));

    /* 기존 HTML 흐름과 연결 */
    const origRender = window.stoRender;
    if (origRender) window.stoRender = function () { origRender(); syncSto(); };
    const origOpen = window.fopOpenMatdoc;
    if (origOpen) window.fopOpenMatdoc = function (kind) { setMd(kind); origOpen(kind); };
    window.fopToast = text => MessageToast.show(text);
    window.fopDialog = (html, actionLabel, action) => {
      const text = html.replace(/<[^>]+>/g, '');
      MessageBox.success(text, { title: '성공', actions: [actionLabel, MessageBox.Action.CLOSE], emphasizedAction: actionLabel,
        onClose: a => { if (a === actionLabel) action(); } });
    };

    /* 화면이 처음 열릴 때 실제 UI5 화면을 렌더링 */
    const rendered = {};
    function ensure(sec) {
      const id = sec.id;
      syncTimes();
      if (id === 'fiori-sto-object' || id === 'fiori-sto-display') syncSto();
      if (rendered[id] || !VIEWS[id]) return;
      rendered[id] = true;
      const host = document.createElement('div');
      host.className = 'ui5-host sapUiBody';
      sec.appendChild(host);
      XMLView.create({ id: 'ui5-' + id, definition: VIEWS[id] }).then(v => {
        v.setModel(model);
        v.placeAt(host);
        sec.classList.add('ui5-on');
        if (id === 'fiori-accounting-doc') setTimeout(() => { const tt = v.byId('relTree'); if (tt) tt.expandToLevel(1); }, 0);
        if (id === 'fiori-sto-display') {
          const drs = v.byId('drs');
          if (drs) { const t = new Date(); drs.setDateValue(new Date(t.getFullYear(), t.getMonth(), 1)); drs.setSecondDateValue(new Date(t.getFullYear(), t.getMonth() + 1, 0)); }
        }
      }).catch(err => { console.error('UI5 view error', id, err); rendered[id] = false; host.remove(); });
    }
    Object.keys(VIEWS).forEach(id => {
      const sec = document.getElementById(id); if (!sec) return;
      new MutationObserver(() => { if (sec.classList.contains('active')) ensure(sec); }).observe(sec, { attributes: true, attributeFilter: ['class'] });
      if (sec.classList.contains('active')) ensure(sec);
    });
    syncSto();
    window.ui5Ready = true;
  })));
})();
