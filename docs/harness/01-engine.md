# 01. 엔진과 코드 구성

## 파일 구성 (현재)

| 파일 | 내용 |
|---|---|
| `index.html` | 화면 마크업만: 홈, 에이전트 화면 `agent1~7`, 증빙 화면 `fiori-*`, 스토리 오버레이 |
| `css/base.css` | 디자인 토큰, 레이아웃, 홈, 에이전트 데모 화면, 아키텍처 모달 |
| `css/joule.css` | Joule Spaces 테마, Joule 채팅 패턴(선제 경보·KG), 스토리 모드, 아키텍처 투어 |
| `css/fiori.css` | Fiori HTML 화면(`.fop-*`), SAPUI5 호스트(`.ui5-host`) |
| `css/gui.css` | SAP GUI for HTML 화면(`.gui-*`) |
| `js/gui.js` | GUI 탭 전환 `guiTab()`, GUI 상태 탭 렌더 |
| `js/fiori-common.js` | `demoDay()`/`applyRelDays()` 상대 날짜, Fiori 앵커 바 `fopGo()`, `fopSeg()`/`fopTree()` |
| `js/app.js` | **엔진 + MM 콘텐츠**: router, touchGuide, `DemoPlayer`, `docTimes`/`stampDoc`, `jConfirm`, 시나리오 7개, 에이전트별 아키텍처 `CONFIGS`, `openArchModal` |
| `js/nav-patch.js` | 페이지 목록 `ALL_PAGES`, 페이지 진입 시 Step 0 자동 실행 |
| `js/joule-theme.js` | Joule Spaces 레이아웃 재구성, 채팅 메시지 꾸밈, 색상 리맵 |
| `js/story-sto.js` | STO 흐름 상태(`stoState`, 납품·출고·입고), 자재 문서 화면, 기존 방식 비교, 스토리 모드 `STORY` |
| `js/ui5-views.js` | SAPUI5 XML 뷰 헬퍼 + Fiori 화면 정의(`VIEWS`), UI5 모델 동기화 |
| `js/arch-diagram.js` | SAP Architecture Center 스타일 아키텍처 다이어그램 (에이전트별 강조·메타) |
| `js/arch-tour.js` | 아키텍처 가이드 투어 (에이전트별 핵심 흐름 단계) |

스크립트는 `index.html` 안의 원래 위치에 `<script src>`로 들어가 있고 **그 순서가 실행 순서**다. SAPUI5는 `ui5.sap.com` CDN(1.148.13, `sap_horizon`)에서 로드하며, 실패하면 각 `fiori-*` 섹션 안의 HTML 대체 화면이 그대로 보인다.

## 화면과 라우팅
- 모든 화면은 `<section id="…" class="page">`. 이동은 `router.go('id')`.
- 새 페이지는 `js/nav-patch.js`의 `ALL_PAGES`에 **반드시** 추가한다 (없으면 화면 전환이 꼬인다).
- `agent`로 시작하는 페이지에 들어가면 해당 `DemoPlayer`의 Step 0이 자동 실행된다.

## DemoPlayer — 에이전트 대화 화면
`demoPlayers['agentN'] = new DemoPlayer({ id, flow, arch, tech, steps })`

| 설정 | 의미 |
|---|---|
| `flow` | 상단 진행 바 `[{icon, label}]` (보통 5개) |
| `arch` / `tech` | 하단 아키텍처 노드와 기술 배지 |
| `steps` | `(p) => { … }` 함수 배열. 한 단계 = 한 번의 사용자 행동 |

단계 함수 안에서 쓰는 메서드:
- `p.addMsg('sys'|'user'|'ai', html)` — 채팅 메시지 (`chat-table`, `badge` 클래스로 표 작성)
- `p.addThinking([…문장])` / `p.removeThinking()` — "생각 중" 연출
- `p.addResultCard(html)` — 오른쪽 결과 패널 카드 (`kpi-row`, `kpi-card danger|warning|…`)
- `p.addPresets([{label, highlight, action}])` — 다음 단계로 넘어가는 제안 버튼 (터치 가이드 펄스 자동)
- `p._setFlowActive(i)` — 진행 바 강조
- `jConfirm('agentN', '질문')` — 예/아니오 확인 버튼 (실행 직전 단계에 사용)
- `stampDoc('key')` — 문서가 생성된 순간 시각 기록 → 증빙 화면의 `data-doc-time="key"`·UI5 `{/times/key}`에 반영
- 마지막에 증빙 화면으로 가는 버튼: `<button class="action-btn action-btn-primary" onclick="router.go('fiori-…')">`

마크업 ID 규칙: 페이지 `agentN` ↔ 요소 `aN-chat`, `aN-result`, `aN-presets`, `aN-flow`, `aN-step-cur`, `aN-step-tot`, `aN-btn`. 기존 `agent1` 섹션을 복사해서 번호만 바꾼다.

## 증빙 화면 만드는 세 가지 방법

| 방식 | 언제 | 어디에 |
|---|---|---|
| **SAPUI5 XML 뷰** (권장) | Fiori Elements 앱 (Object Page, List Report) | `js/ui5-views.js`의 `VIEWS`에 `'fiori-…': V_XXX` 등록 + `index.html`에 같은 ID의 HTML 대체 섹션 |
| **SAP GUI HTML** | T-code 화면 (ME23N, VA03, CO03 등) | `index.html`에 `class="page fop gui"` 섹션 + `css/gui.css` 클래스. UI5 `VIEWS`에는 등록하지 않음 |
| HTML 대체 화면 | UI5 로드 실패 대비 | `fiori-*` 섹션 안의 `.fop-*` 마크업 |

UI5 뷰 헬퍼 (`js/ui5-views.js`):
- `view(body)`, `shell(title, backPage, joulePage)` — 앱 셸
- `op(title, sections, {id, header, footer})` — Object Page, `title(heading, sub, actions, breadcrumbs)`
- `sec(title, content)`, `form([[groupTitle, [[label, value, isLink], …]], …], cols)`
- `facet(label, inner)`, `kvs(pairs)`, `hc(items)` — 헤더 콘텐츠
- `tbar(title, rightButtons, variant)`, `ico(icon, tooltip)`, `emptyList(title)`
- 표준 구매오더 공통: `poStat`, `poNoteTab`
- 이벤트는 XML에서 `press="H.go('page')"`, `H.toast('…')` 등 (`demo/fh` 모듈)
- 동적 값은 JSON 모델 바인딩 `{/sto/statusText}`, `{/times/po}` — 상태 동기화는 `syncSto()` 참고

SAP GUI 화면 패턴 (`css/gui.css`, 예시: `fiori-sto-object`):
- `.gui-appbar` 버튼 줄 → `.gui-hdr` 헤더 필드 → `.gui-card` + `.gui-tabs` 탭 스트립 → `.gui-tbl` 항목 테이블 → 항목 상세 탭
- 입력 필드 모양 `.gui-v`, 탭 전환 `guiTab(btn, group, key)`, 탭 내용 `.gui-pane[data-g][data-k]`

## 문서 상태가 바뀌는 시나리오
STO처럼 데모 중 상태가 진행되면(생성 → 납품 → 출고 → 입고) 상태 객체를 하나 두고 `render()` 함수에서 모든 화면을 갱신한다. 예: `window.stoState` + `stoRender()` (`js/story-sto.js`), UI5 쪽은 `stoRender`를 감싸 `syncSto()` 호출, GUI 쪽은 `guiStatRender()`.

## 에이전트 추가 체크리스트
1. `index.html` — 홈 카드(`scenario-card`) + 에이전트 섹션(`agentN`, `aN-*` ID)
2. `js/app.js` — `demoPlayers['agentN']` (flow/arch/tech/steps), 아키텍처 `CONFIGS.agentN`, `openArchModal`의 `meta.agentN`
3. `js/nav-patch.js` — `ALL_PAGES`에 `agentN`과 증빙 화면 ID
4. `js/arch-diagram.js` — `HL.agentN`(강조 영역)과 에이전트 메타
5. `js/arch-tour.js` — `agentN: { core, steps }`
6. `js/story-sto.js` — 기존 방식 비교(`agentN: [기존 업무, 기존 시간, Agent 시간]`), 스토리에 넣을 경우 `STORY`
7. 증빙 화면 — UI5 뷰(`VIEWS`) 또는 GUI 섹션, `stampDoc` 키
