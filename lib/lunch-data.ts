// 프론트엔드 전용 "점심 메뉴 스무고개" 로직 데이터
// 백엔드/DB/외부 API 없음. 모든 상태는 클라이언트에서만 관리됩니다.

export type Choice = {
  label: string
  // 이 선택지가 강화하는 메뉴 태그들
  tags: string[]
}

export type Question = {
  id: string
  // 마스코트가 던지는 질문 문구
  prompt: string
  // 빠른 선택 칩 (자유 입력도 가능, 최대 50자)
  choices: Choice[]
}

export type Menu = {
  name: string
  emojiHint: string // 카드에 쓰는 간단한 설명용 키워드
  blurb: string
  tags: string[]
}

// 기본 질문 7개 (스무고개 방식, 7턴 내외)
export const BASE_QUESTIONS: Question[] = [
  {
    id: "temp",
    prompt: "지금 뜨끈한 국물이 당겨요, 아니면 시원한 게 좋아요?",
    choices: [
      { label: "뜨끈한 국물", tags: ["soup", "warm", "korean"] },
      { label: "시원한 거", tags: ["cold", "light"] },
      { label: "상관없어요", tags: [] },
    ],
  },
  {
    id: "spicy",
    prompt: "매운 음식, 오늘 컨디션에 어때요?",
    choices: [
      { label: "매울수록 좋아", tags: ["spicy", "korean"] },
      { label: "적당히 매콤", tags: ["mild-spicy"] },
      { label: "안 매운 걸로", tags: ["nonspicy"] },
    ],
  },
  {
    id: "cuisine",
    prompt: "끌리는 나라 음식이 있어요?",
    choices: [
      { label: "한식", tags: ["korean"] },
      { label: "일식", tags: ["japanese"] },
      { label: "중식", tags: ["chinese"] },
      { label: "양식", tags: ["western"] },
    ],
  },
  {
    id: "carb",
    prompt: "밥, 면, 빵 중에 뭐가 끌려요?",
    choices: [
      { label: "밥", tags: ["rice"] },
      { label: "면", tags: ["noodle"] },
      { label: "빵", tags: ["bread", "western"] },
    ],
  },
  {
    id: "heavy",
    prompt: "든든하게 vs 가볍게, 오늘의 위장은?",
    choices: [
      { label: "든든하게", tags: ["heavy"] },
      { label: "가볍게", tags: ["light"] },
    ],
  },
  {
    id: "budget",
    prompt: "점심 예산은 넉넉한 편이에요?",
    choices: [
      { label: "가성비로", tags: ["cheap"] },
      { label: "좀 특별하게", tags: ["premium"] },
      { label: "상관없어요", tags: [] },
    ],
  },
  {
    id: "solo",
    prompt: "혼밥이에요, 아니면 같이 먹어요?",
    choices: [
      { label: "혼밥", tags: ["solo", "quick"] },
      { label: "같이", tags: ["share"] },
    ],
  },
]

// 재추천 시 추가로 던지는 질문 2개
export const FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: "avoid",
    prompt: "방금 추천은 별로였군요! 오늘 피하고 싶은 건 뭐예요?",
    choices: [
      { label: "기름진 거", tags: ["light"] },
      { label: "밀가루", tags: ["rice"] },
      { label: "국물 없는 거", tags: ["soup", "warm"] },
      { label: "다 괜찮아요", tags: [] },
    ],
  },
  {
    id: "mood",
    prompt: "그럼 지금 기분에 딱 맞는 한 마디는?",
    choices: [
      { label: "새로운 도전!", tags: ["premium", "western", "japanese"] },
      { label: "익숙한 게 최고", tags: ["korean", "rice"] },
      { label: "빨리 먹고 싶어", tags: ["quick", "noodle"] },
    ],
  },
]

// 메뉴 데이터베이스 (프론트 하드코딩)
export const MENUS: Menu[] = [
  { name: "김치찌개", emojiHint: "얼큰한 국물", blurb: "밥 한 공기 뚝딱, 실패 없는 국민 점심.", tags: ["soup", "warm", "korean", "spicy", "rice", "heavy", "cheap"] },
  { name: "순두부찌개", emojiHint: "보들보들 순두부", blurb: "부드럽고 얼큰한 국물로 속이 든든해요.", tags: ["soup", "warm", "korean", "mild-spicy", "rice", "heavy", "cheap"] },
  { name: "냉면", emojiHint: "시원한 육수", blurb: "더위엔 역시 시원하게 넘어가는 한 그릇.", tags: ["cold", "light", "korean", "noodle", "nonspicy"] },
  { name: "초밥", emojiHint: "신선한 회", blurb: "가볍지만 특별하게, 오늘의 나를 위한 선택.", tags: ["cold", "light", "japanese", "rice", "premium", "nonspicy"] },
  { name: "라멘", emojiHint: "진한 돈코츠", blurb: "뜨끈한 국물에 쫄깃한 면발까지.", tags: ["soup", "warm", "japanese", "noodle", "heavy", "mild-spicy"] },
  { name: "돈카츠", emojiHint: "바삭한 튀김", blurb: "든든하게 채우고 싶은 날의 정답.", tags: ["warm", "japanese", "rice", "heavy", "nonspicy"] },
  { name: "짜장면", emojiHint: "달콤짭짤", blurb: "고민될 땐 언제나 옳은 그 맛.", tags: ["warm", "chinese", "noodle", "heavy", "cheap", "nonspicy"] },
  { name: "짬뽕", emojiHint: "화끈한 해물", blurb: "얼큰한 국물이 당길 때 이만한 게 없죠.", tags: ["soup", "warm", "chinese", "noodle", "spicy", "heavy"] },
  { name: "마라탕", emojiHint: "얼얼한 마라", blurb: "골라 먹는 재미, 화끈한 매운맛.", tags: ["soup", "warm", "chinese", "spicy", "heavy", "share"] },
  { name: "파스타", emojiHint: "크리미 or 토마토", blurb: "분위기 내고 싶은 점심에 딱.", tags: ["warm", "western", "noodle", "premium", "nonspicy"] },
  { name: "샐러드", emojiHint: "신선한 채소", blurb: "가볍고 산뜻하게, 몸이 좋아하는 선택.", tags: ["cold", "light", "western", "nonspicy", "solo", "premium"] },
  { name: "햄버거", emojiHint: "두툼한 패티", blurb: "빠르고 든든하게 한 방에 해결.", tags: ["western", "bread", "heavy", "quick", "solo"] },
  { name: "비빔밥", emojiHint: "알록달록", blurb: "채소 가득 든든하고 건강하게.", tags: ["warm", "korean", "rice", "light", "nonspicy", "cheap"] },
  { name: "국밥", emojiHint: "뜨끈한 한 그릇", blurb: "혼밥에 최적화된 뜨끈한 위로.", tags: ["soup", "warm", "korean", "rice", "heavy", "solo", "cheap"] },
  { name: "쌀국수", emojiHint: "깔끔한 육수", blurb: "가볍고 개운한 국물 한 그릇.", tags: ["soup", "warm", "noodle", "light", "nonspicy"] },
]

export type Answer = { questionId: string; value: string; tags: string[] }

// 답변 태그를 모아 메뉴 점수를 매기고 상위 2개를 반환
export function recommend(answers: Answer[], exclude: string[] = []): Menu[] {
  const tagCount = new Map<string, number>()
  for (const a of answers) {
    for (const t of a.tags) {
      tagCount.set(t, (tagCount.get(t) ?? 0) + 1)
    }
  }

  const scored = MENUS.filter((m) => !exclude.includes(m.name)).map((menu) => {
    let score = 0
    for (const t of menu.tags) {
      score += tagCount.get(t) ?? 0
    }
    // 살짝의 무작위성으로 매번 똑같지 않게
    score += Math.random() * 0.5
    return { menu, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 2).map((s) => s.menu)
}
