# 04. 검증 절차

변경을 끝내기 전에 **실제로 렌더링해서** 확인한다. 코드만 보고 "될 것"이라고 보고하지 않는다.

## 도구: `tools/render.sh`
macOS의 Google Chrome 헤드리스로 특정 페이지를 열어 스크린샷을 찍고 콘솔 오류를 출력한다.

```bash
tools/render.sh <페이지ID> <출력.png> [너비x높이] [페이지 진입 후 실행할 JS]

# 예: STO 상세 화면
tools/render.sh fiori-sto-object /tmp/sto.png
# 예: 데모 진행 후 상태 탭 확인
tools/render.sh fiori-sto-object /tmp/sto.png 1600x1000 \
  "stoCreateDelivery();stoPostGI();document.querySelectorAll('.gui-tabs button')[8].click()"
# 예: 긴 화면 전체
tools/render.sh fiori-po-delivery /tmp/po.png 1640x3400
```

- 결과 PNG를 열어 직접 본다 (Claude는 Read 도구로 이미지를 확인).
- 출력에 `UI5 view error`가 있으면 UI5 뷰 XML 오류다 — 이때 화면은 HTML 대체 화면으로 보이므로 스크린샷만 보면 놓치기 쉽다.

- PP·QM은 진입 파일을 지정한다: `HTML=qm.html tools/render.sh qm1 out.png`. 전체 단계를 돌리는 긴 흐름은 `BUDGET=45000`(가상 시간 ms)을 함께 준다.
- 헤드리스는 CSS transition이 진행되지 않아 다크 모드 전환 직후 일부 색이 이전 값으로 보일 수 있다 — 의심되면 `el.style.transition='none'` 후 computed style로 확인한다.

## 체크리스트
1. **JS 문법**: `for f in js/*.js; do node --check "$f"; done`
2. **UI5 뷰**: 바꾼 화면을 렌더링하고 `UI5 view error`가 없는지 확인
3. **화면 비교**: 사용자 스크린샷과 나란히 보고 헤더 버튼·섹션/탭·열 순서가 같은지 확인
4. **데모 흐름**: 에이전트 화면에서 `demoPlayers.agentN.start()` 후 단계를 진행해 증빙 화면 버튼까지 가는지, 상태가 바뀌는 화면은 단계별로 렌더링
5. **숫자 일치**: 대화에서 말한 문서번호·수량·금액·날짜가 증빙 화면과 같은지
6. **기존 화면 회귀**: 공통 CSS/JS를 바꿨다면 홈, `agent1`, 대표 증빙 화면 2~3개를 함께 렌더링
8. **날짜 이동**: 날짜를 넣거나 고쳤다면 `FAKE_DATE=2026-12-15`(다음 달)·`FAKE_DATE=2027-01-20`(연도 넘김)으로 렌더링해, 화면 날짜·연도·회계기간이 함께 넘어가는지 확인. 하드코딩 점검: `grep -nE "20[0-9]{2}[-.][01][0-9]|[0-9]+월 [0-9]+일|'20[0-9]{2}'" js/*.js index.html`
7. **다크 모드**: CSS를 바꿨다면 `python3 tools/gen-dark-css.py` 실행 후, 바꾼 화면을 4번째 인자 `"setDarkMode(true)"`로 렌더링해 확인

## 보고
- 확인한 것과 확인하지 못한 것(예: 오프라인 대체 화면, 클릭 상호작용)을 나눠 보고한다.
- 임의로 만든 데이터(주소·금액 등)는 그렇다고 밝힌다.
