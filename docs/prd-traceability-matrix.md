# 📋 PRD 요구사항 추적 매트릭스 (PRD Traceability Matrix)

본 문서는 `PRD.md`에 명시된 모든 요구사항이 어느 스프린트와 컴포넌트에서 구현 및 검증되는지 추적 관리하는 문서입니다.

---

## 1. 요구사항 매핑 및 진행 상태

| ID | PRD 요구사항 항목 | 상세 내용 | 담당 스프린트 | 관련 파일/컴포넌트 | 검증 상태 |
|:---:|:---|:---|:---:|:---|:---:|
| **REQ-01** | **목표 및 성공 조건** | AI 스무고개 대화 후 2가지 메뉴 추천 → [Yes] 클릭 시 성공(“축하합니다!”) | Sprint 1, 4 | `lunch-app.tsx`, `result-view.tsx` | ⏳ Ready |
| **REQ-02** | **AI 주도 대화 (7턴)** | AI가 먼저 질문하고 사용자가 답변하는 스무고개식 대화 흐름 | Sprint 1 | `lunch-app.tsx`, `lunch-data.ts` | ⏳ Ready |
| **REQ-03** | **공감 및 위트 있는 대응** | 인원, 분위기, 식성 등 다양한 사용자 입력에 대한 유연한 반응 | Sprint 2 | `keyword-mapper.ts`, `recommend-engine.ts` | ⏳ Ready |
| **REQ-04** | **단일 화면 구조 (SPA)** | 제미나이/ChatGPT 형태의 심플한 질문-입력 단일 화면 | Sprint 1, 4 | `lunch-app.tsx`, `app/page.tsx` | ⏳ Ready |
| **REQ-05** | **초기 Idle 화면** | “내가 점심 메뉴 추천해줌” 문구 + “시작하기” CTA + 마스코트 | Sprint 4 | `idle-screen.tsx`, `mascot.tsx` | ⏳ Ready |
| **REQ-06** | **동적/상황별 질문 변화** | 인원, 누구랑, 상황 등에 따른 유기적인 질문 전개 | Sprint 1, 2 | `lunch-data.ts`, `recommend-engine.ts` | ⏳ Ready |
| **REQ-07** | **추천 로딩 상태** | 메뉴 도출 전 “메뉴 추천 중...” 로딩 화면 노출 | Sprint 3 | `lunch-app.tsx`, `message-bubble.tsx` | ⏳ Ready |
| **REQ-08** | **2가지 메뉴 추천 (1/2순위)** | 결과 화면에 1순위, 2순위 메뉴 카드 및 추천 사유 표시 | Sprint 2, 4 | `result-view.tsx`, `recommend-engine.ts` | ⏳ Ready |
| **REQ-09** | **결과 피드백 (Yes/No)** | “추천받은 메뉴가 마음에 들었나요” + [Yes], [No] 버튼 | Sprint 1, 4 | `result-view.tsx` | ⏳ Ready |
| **REQ-10** | **재추천 루프 (No 선택 시)** | 이전 추천 메뉴 제외 + 2개 내외 추가 질문 후 재추천 | Sprint 1, 2 | `lunch-app.tsx`, `lunch-data.ts` | ⏳ Ready |
| **EXC-01** | **예외 처리 1: 50자 제한** | 입력 최대 50자 제한, 실시간 글자수 및 초과 방지 | Sprint 3 | `chat-input.tsx` | ⏳ Ready |
| **EXC-02** | **예외 처리 2: 빈 입력 방어** | 빈 값 또는 공백 전송 시 안내 문구 표시 및 전송 차단 | Sprint 3 | `chat-input.tsx` | ⏳ Ready |
| **EXC-03** | **예외 처리 3: 지연/타임아웃** | AI 답변 지연 시 "다시 시도하기" 버튼 노출 | Sprint 3 | `lunch-app.tsx`, `timeout-fallback.tsx` | ⏳ Ready |
| **EXC-04** | **예외 처리 4: 로딩 표시** | 질문 생성 및 메뉴 추천 처리 중 명확한 로딩 인디케이터 | Sprint 3 | `message-bubble.tsx` | ⏳ Ready |
| **EXC-05** | **예외 처리 5: 화면 무중단** | 예외/오류 발생 시 화면 크래시 방지 (Error Boundary) | Sprint 3 | `error-boundary.tsx` | ⏳ Ready |
| **CST-01** | **제약조건 준수** | 로그인/결제/DB/외부 API 없음, 새로고침 시 초기화 | 전체 | 프로젝트 전반 | ⏳ Ready |
| **CST-02** | **데스크톱 최적화** | 1440×900 해상도 중심 단일 뷰 최적화 (프론트 전용) | Sprint 4 | `globals.css`, `lunch-app.tsx` | ⏳ Ready |

---

## 2. 검증 체크리스트

### 기능적 완료 기준 (Definition of Done)
- [ ] 1. 초기 화면에서 "시작하기"를 누르면 대화가 시작된다.
- [ ] 2. 7턴 내외의 AI 주도형 질문-답변이 부드럽게 이어진다.
- [ ] 3. 사용자는 빠른 칩 선택 또는 50자 이내의 직접 텍스트 입력을 할 수 있다.
- [ ] 4. 대화 종료 시 "메뉴 추천 중..." 로딩 후 1순위, 2순위 메뉴 카드가 뜬다.
- [ ] 5. [Yes] 클릭 시 "축하합니다!" 문구와 함께 최종 확정 화면이 나온다.
- [ ] 6. [No] 클릭 시 이전 2가지 메뉴가 제외된 상태로 2개의 추가 질문이 진행되고 새 메뉴가 추천된다.
- [ ] 7. 5가지 필수 예외 처리(50자 초과 방지, 빈 입력 방지, 타임아웃 재시도, 로딩 표시, 에러 복구)가 모두 동작한다.
- [ ] 8. 로그인, DB, 외부 네트워크 통신 없이 브라우저 단독으로 100% 동작한다.
