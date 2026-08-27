# 🎨 design.md 기준 톤앤매너 & 디자인 시스템 리팩토링 계획서

> **문서 경로**: `docs/design-system-enhancement-plan.md`  
> **기준 가이드**: 루트 [`design.md`](file:///c:/lunch-menu-game/design.md)  
> **목표**: 브랜드 정체성(Lunch Mate AI), Vibrnat Orange 컬러 시스템, 구글 폰트(Plus Jakarta Sans), 위트 있는 보이스 앤 톤을 전면 반영  

---

## 1. 디자인 시스템 & CSS 변수 재정의

### 🎨 컬러 시스템 (`app/globals.css`)
- **Primary (Vibrant Orange)**: `#FF8C00` (메인 포인트, 강조 버튼, 사용자 말풍선)
- **Secondary (Deep Orange/Brown)**: `#D2691E` (호버 상태, 딥 뱃지)
- **Surface (Warm Off-white)**: `#FBF9F8` (배경 및 카드 영역)
- **Text (Dark Gray)**: `#1A1A1A` (가독성을 위한 다크 그레이)

### 🔤 타이포그래피 (`app/layout.tsx` & `app/globals.css`)
- Google Font `Plus Jakarta Sans` 적용
- 서비스 명 메타데이터 동기화: **"내가 점심 메뉴 추천해줌 (Lunch Mate AI)"**

---

## 2. 컴포넌트별 톤앤매너 리팩토링 계획

### 📍 Phase 1: 파운데이션 & 글로벌 스타일
- [ ] `app/layout.tsx`: `Plus Jakarta Sans` 폰트 로드 및 HTML Head 메타데이터 갱신
- [ ] `app/globals.css`: `#FF8C00`, `#FBF9F8`, `#D2691E`, `#1A1A1A` 디자인 토큰 및 HSL 변수 바인딩, 둥근 모서리(`rounded-2xl`, `rounded-3xl`) 통일

### 📍 Phase 2: 마스코트 & Idle 화면 (`idle-screen.tsx`, `mascot.tsx`)
- [ ] 웃고 있는 도시락 캐릭터 & 말풍선 모티프의 로고 마스코트 애니메이션 강화
- [ ] Vibrant Orange (`#FF8C00`) 메인 CTA 버튼 (입체감 있는 그림자 및 호버 반응)
- [ ] 친근하고 위트 있는 브랜드 설명 문구 재정비

### 📍 Phase 3: 대화 인터페이스 & 말풍선 (`message-bubble.tsx`, `chat-input.tsx`)
- [ ] **AI 말풍선**: Surface `#FBF9F8` 배경 + Vibrant Orange 아이콘/포인트 뱃지
- [ ] **사용자 말풍선**: Vibrant Orange (`#FF8C00`) 배경 + 흰색 글래스 텍스트
- [ ] **입력창**: 둥근 8~16px 모서리, 50자 제한 안내 및 오렌지 액션 전송 버튼

### 📍 Phase 4: 추천 결과 & 확정 화면 (`result-view.tsx`, `confetti.tsx`)
- [ ] 1순위 골드/오렌지 뱃지 & 2순위 딥 오렌지 뱃지 디자인 정돈
- [ ] 확정 화면 축하 연출 및 오렌지 테마 컨페티 색조 동기화

### 📍 Phase 5: AI 보이스 앤 톤 (Gemini Prompt - `chat-ai/route.ts`)
- [ ] "~요", "~해줄게" 구어체와 "어라?" 등 위트 넘치는 친근한 친구 톤 주입
- [ ] 엉뚱한 입력 시 "어라? 🚀 그건 아직 요리가 안 돼요!" 반응 튜닝

---

## 3. 실행 단계 및 검증
1. **파운데이션 셋팅**: `globals.css` 및 `layout.tsx` 서체/컬러 적용
2. **컴포넌트 톤앤매너 반영**: Idle ➔ Chat ➔ Result ➔ API Prompt 순차 업데이트
3. **프로덕션 빌드 & 라이브 배포**: `npm run build` 및 Vercel 배포 (`npx vercel --prod`)
