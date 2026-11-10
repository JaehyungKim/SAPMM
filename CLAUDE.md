# SAP S/4HANA AI Agent 데모 (Joule Work)

SAP S/4HANA 모듈별 AI Agent 시나리오를 시연하는 정적 웹 데모. 빌드 도구 없음 — `index.html`을 브라우저로 바로 열거나 GitHub Pages(`origin` = github.com/JaehyungKim/SAPMM)로 배포한다.

- 현재: **MM** 7개 시나리오 + 스토리 모드 (`index.html`), **PP** 1개 (`pp.html`), **QM** 2개 (`qm.html`) — PP·QM은 대화 화면까지, 증빙 화면은 스크린샷 대기
- 계획: **SD** 모듈 추가, PP·QM 증빙 화면 — 진행 상태는 `docs/modules/`

## 작업 전에 읽을 문서 (docs/harness/)
| 문서 | 언제 |
|---|---|
| `00-approach.md` | 항상 — 데모 설계 원칙과 모듈 확장 구조 |
| `01-engine.md` | 코드를 고칠 때 — 파일 구성, DemoPlayer, 라우터, Fiori/GUI 화면 만드는 법 |
| `02-scenario-template.md` | 새 시나리오를 기획할 때 |
| `03-screen-guide.md` | 표준 앱 화면(Fiori/GUI)을 재현할 때 — 구성 규칙과 한국어 용어집 |
| `04-verification.md` | 변경을 마무리할 때 — 헤드리스 렌더 확인 절차 |
| `world.md` | 데이터를 만들 때 — 회사·플랜트·자재·거래처·문서번호 마스터 |

새 시나리오는 `/new-scenario <모듈> <주제>` 스킬(`.claude/skills/new-scenario/`)로 진행한다.

## 반드시 지킬 규칙
- 화면 라벨·대화는 **한국어**. SAP 고유 용어(T-code, 문서 유형 코드)는 원문 유지.
- 데이터는 `world.md`의 마스터만 쓴다. 새 마스터가 필요하면 `world.md`에 먼저 추가한다.
- 실존 고객사·공급사 이름 금지 — 가상 이름만.
- 날짜는 하드코딩하지 말고 `demoDay(n)` / `data-rel-day` / `stampDoc()`로 '오늘' 기준 상대 날짜를 쓴다.
- 표준 앱 화면은 사용자가 준 **스크린샷을 기준**으로 재현한다. 스크린샷이 없으면 만들기 전에 요청한다.
- `<script type="module">`·`fetch`로 HTML 조각 불러오기 금지 — `file://`로 열 때 깨진다. 일반 `<script src>`만 쓴다.
- 스크립트 순서가 곧 실행 순서다. `index.html`의 `<script src>` 위치를 함부로 옮기지 않는다.
- 변경 후 `04-verification.md` 절차로 렌더링을 확인하고, 확인하지 못한 부분은 그렇다고 보고한다.
