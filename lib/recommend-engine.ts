// 추천 알고리즘 및 맞춤형 사유 생성 엔진
// 외부 API 없이 순수 TypeScript 룰베이스 가중치 매칭으로 동작합니다.

import { MENUS, type Answer, type Menu } from "./lunch-data"

// 태그별 기본 중요도 가중치 (특정 질문에 더 높은 영향력 부여)
const TAG_WEIGHTS: Record<string, number> = {
  // 온도/국물
  soup: 2.2,
  dry: 1.8,
  cold: 2.0,
  warm: 1.2,

  // 맵기
  spicy: 2.5,
  "mild-spicy": 1.8,
  nonspicy: 2.2,

  // 국적
  korean: 2.0,
  japanese: 2.0,
  chinese: 2.0,
  western: 2.0,
  asian: 2.0,

  // 주식
  rice: 1.8,
  noodle: 1.8,
  bread: 1.8,
  salad: 2.2,

  // 식사량
  heavy: 1.5,
  light: 1.8,

  // 상황/가격
  cheap: 1.3,
  premium: 1.4,
  solo: 1.2,
  share: 1.2,
  quick: 1.4,
}

// 메뉴와 사용자 누적 선호도 간의 공감 추천 이유 동적 생성
export function generateMatchReason(menu: Menu, positiveTags: string[]): string {
  const matches = menu.tags.filter((t) => positiveTags.includes(t))

  if (matches.includes("spicy") && matches.includes("soup")) {
    return "🔥 얼큰하고 칼칼한 국물로 오늘 쌓인 스트레스를 확 풀어줄 최고의 선택!"
  }
  if (matches.includes("cold") || matches.includes("salad")) {
    return "🥗 산뜻하고 가볍게, 오후에도 졸리지 않고 속이 편안한 깔끔한 한 끼!"
  }
  if (matches.includes("korean") && matches.includes("rice")) {
    return "🍚 역시 든든한 밥심! 호불호 없이 밥 한 공기 뚝딱 비우는 정답 메뉴."
  }
  if (matches.includes("japanese") && matches.includes("premium")) {
    return "✨ 정갈하고 특별하게! 오늘 열심히 달린 나를 위한 소소한 보상."
  }
  if (matches.includes("chinese") && matches.includes("spicy")) {
    return "🌶️ 화끈한 불맛과 중독적인 매운맛으로 입맛을 확 돋워줘요."
  }
  if (matches.includes("quick") || matches.includes("solo")) {
    return "⚡ 빠르게 든든하게! 혼밥으로도 부담 없이 알차게 즐길 수 있어요."
  }
  if (matches.includes("noodle") && matches.includes("warm")) {
    return "🍜 뜨끈한 국물에 쫄깃한 면발의 조화, 고민될 땐 실패 없는 꿀조합."
  }
  if (matches.includes("bread") || matches.includes("western")) {
    return "🍔 감성 가득 풍미 넘치는 양식으로 점심시간 기분 전환 완료!"
  }

  return `✨ ${menu.emojiHint} 키워드가 오늘의 취향과 찰떡같이 어울려요!`
}

// 점수 가중치 기반 메뉴 추천
export function recommend(answers: Answer[], exclude: string[] = []): Menu[] {
  // 1. 사용자 답변으로부터 긍정 태그 빈도 및 부정 태그 집합 수집
  const positiveScores = new Map<string, number>()
  const negativeTagsSet = new Set<string>()

  for (const a of answers) {
    const isFollowup = a.questionId === "avoid" || a.questionId === "mood"
    const multiplier = isFollowup ? 2.5 : 1.0 // 후속 질문 가중치 대폭 강화

    for (const t of a.tags) {
      const weight = (TAG_WEIGHTS[t] ?? 1.0) * multiplier
      positiveScores.set(t, (positiveScores.get(t) ?? 0) + weight)
    }

    if (a.negativeTags) {
      for (const nt of a.negativeTags) {
        negativeTagsSet.add(nt)
      }
    }
  }

  const allPositiveTags = Array.from(positiveScores.keys())

  // 2. 제외 목록을 제외한 모든 메뉴에 대해 스코어링 진행
  const candidatePool = MENUS.filter((m) => !exclude.includes(m.name))

  // 만약 제외 목록 누적으로 후보가 2개 미만이면 전체 풀에서 Fallback 선별
  const targetPool = candidatePool.length >= 2 ? candidatePool : MENUS

  const scored = targetPool.map((menu) => {
    let score = 0

    // 긍정 태그 일치 가산
    for (const t of menu.tags) {
      if (positiveScores.has(t)) {
        score += positiveScores.get(t)!
      }
    }

    // 부정 태그 포함 시 강력한 페널티
    for (const nt of menu.tags) {
      if (negativeTagsSet.has(nt)) {
        score -= 5.0
      }
    }

    // 0~0.3의 미세한 지터(Jitter)로 완전 동점 시 매번 새로운 경험 제공
    score += Math.random() * 0.35

    return { menu, score }
  })

  // 3. 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score)

  // 4. 상위 2개 메뉴 선발 (1순위와 2순위는 가급적 카테고리나 주식이 다른 다양성 확보)
  const top1 = scored[0].menu
  let top2 = scored[1]?.menu

  // 1순위와 2순위가 지나치게 유사할 경우 3~4위 중 다른 카테고리 메뉴를 2순위(Alternative)로 우선 고려
  if (scored.length > 2) {
    for (let i = 1; i < Math.min(scored.length, 5); i++) {
      const candidate = scored[i].menu
      if (candidate.id !== top1.id && candidate.category !== top1.category) {
        top2 = candidate
        break
      }
    }
  }

  // 최종 메뉴 객체에 맞춤형 추천 사유 주입
  const result1: Menu = {
    ...top1,
    matchReason: generateMatchReason(top1, allPositiveTags),
  }

  const result2: Menu = {
    ...top2,
    matchReason: generateMatchReason(top2, allPositiveTags),
  }

  return [result1, result2]
}
