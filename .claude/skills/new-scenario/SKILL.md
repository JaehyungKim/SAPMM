---
name: new-scenario
description: SAP AI Agent 데모에 새 시나리오(에이전트 화면 + Joule 대화 + 표준 앱 증빙 화면)를 기획하고 구현한다. "SD 시나리오 만들어줘", "PP 에이전트 추가", "/new-scenario sd 신용 보류" 같은 요청에 사용.
argument-hint: <mm|sd|pp> <시나리오 주제>
---

# 새 시나리오 만들기

인자: `$ARGUMENTS` (모듈과 주제). 비어 있으면 모듈과 주제를 사용자에게 묻는다.

## 0. 문서 읽기
`CLAUDE.md`와 `docs/harness/` 전체, 그리고 `docs/modules/<모듈>.md`를 읽는다. 기준 예시로 MM 07(재고 이동 최적화)의 구현을 확인한다: `js/app.js`의 `demoPlayers['agent7']`, `js/ui5-views.js`의 `V_STO_LR`, `index.html`의 `fiori-sto-object`.

## 1. 선행 작업 확인
`docs/modules/<모듈>.md`의 "선행 작업" 체크박스를 본다.
- 모듈이 MM이 아니고 엔진/MM 분리가 안 됐으면, 시나리오보다 먼저 분리 작업을 제안하고 사용자 동의를 받는다. 분리는 동작을 바꾸지 않아야 하므로 분리 전후 화면을 `tools/render.sh`로 캡처해 비교한다.

## 2. 기획 (사용자 확인 필수)
`docs/harness/02-scenario-template.md` 양식을 채워 `docs/modules/<모듈>.md`에 추가하고, 사용자에게 보여준 뒤 **확인을 받는다.** 특히 다음을 확정한다.
- 실행으로 끝나는 문서 변경이 무엇인지
- 증빙 화면의 표준 앱과 화면 방식(UI5 Object Page / List Report / SAP GUI)
- 숫자(수량·금액·날짜)와 문서번호 — `world.md`와 대조

## 3. 스크린샷 받기
증빙 화면으로 쓸 표준 앱의 스크린샷을 사용자에게 요청한다 (목록, 상세, GUI라면 필요한 탭). 받기 전에는 화면을 추측해서 만들지 않는다. 다른 단계(대화 흐름)는 먼저 진행해도 된다.

## 4. 마스터 데이터
필요한 고객·자재·문서번호를 `docs/harness/world.md`에 추가한다.

## 5. 구현
`docs/harness/01-engine.md`의 "에이전트 추가 체크리스트" 7개 항목을 순서대로 처리한다. 증빙 화면은 `03-screen-guide.md`를 따른다.

## 6. 검증
`docs/harness/04-verification.md` 체크리스트를 모두 수행한다. 최소한:
- `node --check`로 JS 문법
- 에이전트 화면에서 전 단계를 진행한 렌더링
- 증빙 화면 렌더링(`UI5 view error` 없음)과 사용자 스크린샷 비교
- 대화와 증빙 화면의 숫자 일치

## 7. 마무리
- `docs/modules/<모듈>.md`의 진행 상태를 갱신한다.
- 사용자에게 확인한 것 / 확인하지 못한 것 / 임의로 만든 데이터를 나눠 보고한다.
- 커밋은 사용자가 요청할 때 한다.
