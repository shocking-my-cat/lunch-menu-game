// 비속어 및 공격적 표현 감지 유틸리티
// 외부 API 의존 없이 클라이언트에서 위트 있게 정화하고 대화를 유도합니다.

const PROFANITY_PATTERNS: RegExp[] = [
  /시[0-9|*| ]*발/i,
  /씨[0-9|*| ]*발/i,
  /ㅅ[0-9|*| ]*ㅂ/i,
  /개[0-9|*| ]*새/i,
  /존[0-9|*| ]*나/i,
  /졸[0-9|*| ]*라/i,
  /병[0-9|*| ]*신/i,
  /ㅂ[0-9|*| ]*ㅅ/i,
  /지[0-9|*| ]*랄/i,
  /닥[0-9|*| ]*쳐/i,
  /꺼[0-9|*| ]*져/i,
  /미[0-9|*| ]*친/i,
]

const WITTY_DEFENSE_RESPONSES = [
  "아이쿠, 맛있는 점심을 찾기 위해 우리 예쁜 말을 써볼까요? 😊",
  "화가 많이 나셨군요! 맛있는 점심 먹고 기분 풀어봐요 🍽️",
  "스무고개 요정은 부드러운 말을 좋아해요! 다시 골라주실래요? ✨",
]

export function checkProfanity(text: string): boolean {
  const normalized = text.replace(/[\s\-_,.]/g, "")
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function getRandomProfanityResponse(): string {
  const idx = Math.floor(Math.random() * WITTY_DEFENSE_RESPONSES.length)
  return WITTY_DEFENSE_RESPONSES[idx]
}
