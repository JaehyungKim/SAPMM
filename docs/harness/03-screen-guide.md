# 03. 표준 앱 화면 재현 가이드

## 원칙
1. **스크린샷이 기준이다.** 사용자가 준 실제 S/4HANA Cloud 화면 스크린샷의 구성(헤더 버튼 순서, 헤더 KPI, 섹션/탭 순서, 테이블 열 순서)을 그대로 따른다. 기억에 의존해 만들지 않는다.
2. **라벨만 한국어로 바꾼다.** 구성은 그대로, 문구는 아래 용어집을 따른다. 용어집에 없는 말은 SAP 한국어 UI 표현에 가깝게 정하고 용어집에 추가한다.
3. **데모 기능은 표준 구성을 해치지 않게 넣는다.** 데모 진행 버튼(예: 아웃바운드 납품 생성·출고·입고)은 헤더 액션이나 버튼 줄 끝에 두고, 표준에 없는 Joule 정보는 메모/헤더 텍스트 같은 표준 자리에 넣는다.
4. **스크린샷에 없는 섹션은 빼고, 빼는 것은 사용자에게 알린다.**
5. **값은 대화와 일치시킨다.** 증빙 화면의 문서번호·수량·금액·날짜는 대화 단계에서 말한 값과 같아야 한다.

## 화면 방식 고르기
| 원본 화면 | 방식 | 참고 구현 |
|---|---|---|
| Fiori Object Page (상세) | UI5 `op()` + `sec()` | `V_PO` 구매오더 (`js/ui5-views.js`) |
| Fiori List Report (목록) | UI5 `f:DynamicPage` + `fb:FilterBar` + `Table` | `V_STO_LR` 구매오더 관리 |
| SAP GUI for HTML (T-code) | HTML `.gui-*` | `fiori-sto-object` (ME23N 스타일) |

UI5 주의사항:
- `fb:FilterBar`의 `basicSearch`는 aggregation이 아니다. 검색 필드는 레이블 없는 `FilterGroupItem`으로 넣는다.
- 헤더 액션의 일반 버튼은 `type="Ghost"`로 해야 스크린샷처럼 테두리가 보인다. 첫 버튼(편집)만 `Emphasized`.
- 큰 헤더 값(상태·일자·금액)은 `<Text class="demoHeaderValue">`.
- `form()`의 `cols`는 3 또는 4. 4개 그룹을 한 줄에 놓으려면 4.

## 용어집 (영문 UI → 한국어 라벨)

**공통 버튼·컨트롤**
| 영문 | 한국어 | 영문 | 한국어 |
|---|---|---|---|
| Edit | 편집 | Copy | 복사 |
| Create | 생성 | Delete | 삭제 |
| Go | 실행 | Adapt Filters | 필터 적용 |
| Standard (variant) | 표준 | Search | 검색 |
| Display Change Log | 변경 로그 표시 | Status Details | 상태 세부사항 |
| Summarize | 요약 | Easy Fill | Easy Fill |
| Editing Status / All | 편집 상태 / 전체 | Withdraw from Approval | 승인에서 철회 |
| There are no entries yet | 아직 항목이 없습니다 | Upload / Add Link | 업로드 / 링크 추가 |

**Object Page 섹션**
| 영문 | 한국어 | 영문 | 한국어 |
|---|---|---|---|
| General Information | 일반 정보 | Items | 항목 |
| Notes | 메모 | Attachments | 첨부 |
| Output Management | 출력 관리 | Product Compliance | 제품 규정 준수 |
| Delivery and Invoice | 납품 및 송장 | Document Flow | 문서 흐름 |

**MM**
| 영문 | 한국어 | 영문 | 한국어 |
|---|---|---|---|
| Purchase Order | 구매오더 | Purchase Requisition | 구매요청 |
| Stock Transport Order | 재고 이전 오더 | Supplier | 공급업체 |
| Purchasing Group / Org. | 구매그룹 / 구매조직 | Company Code | 회사코드 |
| Net Order Value | 순 오더 금액 | Order Quantity | 오더 수량 |
| Supplying Plant | 공급 플랜트 | Storage Location | 저장위치 |
| Limit Items | 한도 항목 | Display Commitments | 약정 표시 |
| Goods Issue / Receipt | 출고 / 입고 | Material Document | 자재 문서 |
| Not Yet Sent / Sent | 미송부 / 송부됨 | Follow-On Documents | 후속 문서 |

**SD** (SD 착수 시 스크린샷 기준으로 보완)
| 영문 | 한국어 | 영문 | 한국어 |
|---|---|---|---|
| Sales Order | 판매오더 | Sold-to Party | 판매처 |
| Ship-to Party | 납품처 | Customer Reference | 고객 참조 |
| Requested Delivery Date | 요청 납품일 | Confirmed Quantity | 확약 수량 |
| Schedule Line | 일정 라인 | Outbound Delivery | 아웃바운드 납품 |
| Billing Document | 대금청구 문서 | Credit Block | 신용 보류 |
| Sales Organization | 영업 조직 | Distribution Channel / Division | 유통 경로 / 제품군 |

**PP** (PP 착수 시 스크린샷 기준으로 보완)
| 영문 | 한국어 | 영문 | 한국어 |
|---|---|---|---|
| Production Order | 생산오더 | Planned Order | 계획오더 |
| Work Center | 작업장 | Routing / Operation | 라우팅 / 작업 |
| Bill of Material | BOM | Component | 구성품 |
| Confirmation | 실적 확인 | Backflush | 백플러시 |
| MRP Controller | MRP 관리자 | Capacity Utilization | 용량 사용률 |
| Release | 릴리스 | Missing Parts | 결품 |
