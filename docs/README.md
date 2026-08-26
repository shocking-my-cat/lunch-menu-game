# 📚 점심 메뉴 스무고개 프로젝트 개발 문서 (docs)

본 디렉토리는 **점심 메뉴 스무고개 웹 애플리케이션**의 PRD 요구사항 충족 및 스프린트 단위 개발 관리를 위한 공식 문서 저장소입니다.

---

## 📑 문서 구조

```text
docs/
├── README.md                           # 문서 인덱스 및 개발 관리 가이드 (본 파일)
├── development-plan.md                 # 마스터 개발 계획서 (스프린트 로드맵 종합)
├── prd-traceability-matrix.md          # PRD 요구사항 추적 매트릭스 및 검증 기준
└── sprints/                            # 스프린트별 상세 실행 계획
    ├── sprint-1-core-interaction.md    # Sprint 1: 핵심 대화 인터랙션 & 상태 머신
    ├── sprint-2-recommendation-engine.md # Sprint 2: 텍스트 분석 & 추천 알고리즘 고도화
    ├── sprint-3-exception-handling.md  # Sprint 3: 5대 필수 예외 처리 & 안정성 확보
    └── sprint-4-ui-ux-polish-qa.md     # Sprint 4: 데스크톱 UI/UX 완성 & 종합 QA
```

---

## 🎯 스프린트 개요 및 진행 현황

| 스프린트 | 주요 목표 | 상태 | 핵심 산출물 |
|:---|:---|:---:|:---|
| **[Sprint 1](./sprints/sprint-1-core-interaction.md)** | 대화 흐름/상태 제어, 멀티턴 질문 엔진, 턴 전환 | 📋 Ready | 상태 머신 리팩토링, 질문-답변 동적 흐름 |
| **[Sprint 2](./sprints/sprint-2-recommendation-engine.md)** | 자유 텍스트 키워드 파싱, 다차원 가중치 추천, 1/2순위 추천 | 📋 Ready | 자연어 키워드 매퍼, 재추천 제외 로직 |
| **[Sprint 3](./sprints/sprint-3-exception-handling.md)** | PRD 5대 예외 처리, 비속어/이상 입력 대응, 타임아웃/재시도 | 📋 Ready | 예외 처리 모듈, Error Boundary, 50자 제한 UX |
| **[Sprint 4](./sprints/sprint-4-ui-ux-polish-qa.md)** | 데스크톱 1440x900 최적화, 애니메이션/효과, 종합 테스트 | 📋 Ready | Idle 화면, 완료 화면 축하 인터랙션, E2E 검증 |

---

## 📌 문서 활용 가이드

1. **개발 시작 전**: `development-plan.md`를 통해 전체 아키텍처와 일정 확인
2. **스프린트 진행 시**: `sprints/sprint-X-*.md`의 상세 태스크 체크리스트를 기반으로 커밋 및 기능 구현
3. **요구사항 검증 시**: `prd-traceability-matrix.md`를 확인하여 PRD 누락 여부 최종 확인
