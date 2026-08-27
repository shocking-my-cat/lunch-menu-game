// 사용자 자유 입력 텍스트에서 긍정/부정 태그를 추출하는 한국어 키워드 매퍼
// 외부 의존성 없이 클라이언트에서 정규식 및 키워드 사전 기반으로 동작합니다.

export type ParsedTags = {
  positiveTags: string[]
  negativeTags: string[]
}

type TagRule = {
  tag: string
  keywords: string[]
}

const POSITIVE_RULES: TagRule[] = [
  // 국물 / 온도
  { tag: "soup", keywords: ["국물", "탕", "찌개", "국", "전골", "뜨끈", "따뜻", "얼큰한국물", "국물요리"] },
  { tag: "cold", keywords: ["시원", "차가", "냉", "얼음", "냉면", "모밀", "소바", "시원한"] },
  { tag: "warm", keywords: ["따뜻", "뜨겁", "따스", "온", "데운"] },
  { tag: "dry", keywords: ["국물없이", "국물없는", "볶음", "구이", "덮밥", "비빔"] },

  // 맵기
  { tag: "spicy", keywords: ["매운", "맵게", "얼큰", "화끈", "칼칼", "알싸", "마라", "불", "매콤한"] },
  { tag: "mild-spicy", keywords: ["약간매콤", "적당히매운", "살짝매운", "적당히매콤", "매콤달콤"] },
  { tag: "nonspicy", keywords: ["안매운", "순한", "달달", "담백", "고소", "자극없는"] },

  // 국적
  { tag: "korean", keywords: ["한식", "한국", "밥집", "백반", "토속", "한식당"] },
  { tag: "japanese", keywords: ["일식", "일본", "초밥", "돈카츠", "라멘", "우동", "덮밥", "스시"] },
  { tag: "chinese", keywords: ["중식", "중국", "짜장", "짬뽕", "탕수육", "마라", "중화"] },
  { tag: "western", keywords: ["양식", "서양", "파스타", "피자", "버거", "스테이크", "샐러드", "브런치"] },
  { tag: "asian", keywords: ["아시안", "동남아", "쌀국수", "팟타이", "나시고랭", "베트남", "태국"] },

  // 주식 형태
  { tag: "rice", keywords: ["밥", "덮밥", "볶음밥", "국밥", "비빔밥", "쌀", "라이스", "초밥"] },
  { tag: "noodle", keywords: ["면", "국수", "라멘", "파스타", "짬뽕", "우동", "스파게티", "모밀"] },
  { tag: "bread", keywords: ["빵", "버거", "샌드위치", "토스트", "베이글"] },
  { tag: "salad", keywords: ["샐러드", "풀", "채소", "야채", "포케", "다이어트식"] },

  // 식사량 / 포만감
  { tag: "heavy", keywords: ["든든", "푸짐", "배부른", "폭식", "헤비", "고기", "기름진", "가득"] },
  { tag: "light", keywords: ["가볍", "가벼운", "소식", "라이트", "다이어트", "산뜻", "깔끔", "속편한", "부담없는"] },

  // 상황 / 가격
  { tag: "cheap", keywords: ["가성비", "저렴", "싸게", "알뜰", "부담없는가격", "학생"] },
  { tag: "premium", keywords: ["특별", "고급", "비싼", "맛있는거", "기분내", "플렉스", "오마카세"] },
  { tag: "solo", keywords: ["혼자", "혼밥", "나홀로", "혼자서", "1인"] },
  { tag: "share", keywords: ["같이", "여럿", "팀원", "동료", "다같이", "회식", "함께"] },
  { tag: "quick", keywords: ["빨리", "간단", "빠르게", "급해", "시간없", "후딱"] },
]

// 부정 표현 패턴 (예: "매운 거 싫어", "국물 빼고", "밀가루 말고", "기름진 거 안 됨")
const NEGATIVE_PATTERNS: Array<{ regex: RegExp; tag: string }> = [
  { regex: /(매운|맵|칼칼|얼큰).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "spicy" },
  { regex: /(국물|탕|찌개).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "soup" },
  { regex: /(기름|헤비|느끼|무거운).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "heavy" },
  { regex: /(밀가루|면|빵).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "noodle" },
  { regex: /(밥|쌀).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "rice" },
  { regex: /(차가|시원|냉).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "cold" },
  { regex: /(뜨겁|따뜻|온).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "warm" },
  { regex: /(한식).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "korean" },
  { regex: /(중식|중화|짜장|짬뽕).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "chinese" },
  { regex: /(일식).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "japanese" },
  { regex: /(양식).*?(싫|빼|말|안|못|별로|패스|금지)/i, tag: "western" },
]

export function extractKeywordsAndTags(text: string): ParsedTags {
  const normalized = text.toLowerCase().trim()
  const positiveTags = new Set<string>()
  const negativeTags = new Set<string>()

  // 1. 부정 패턴 매칭
  for (const item of NEGATIVE_PATTERNS) {
    if (item.regex.test(normalized)) {
      negativeTags.add(item.tag)
    }
  }

  // 2. 긍정 키워드 매칭 (단, 부정된 태그는 긍정에서 제외)
  for (const rule of POSITIVE_RULES) {
    if (negativeTags.has(rule.tag)) continue

    const matched = rule.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
    if (matched) {
      positiveTags.add(rule.tag)
    }
  }

  return {
    positiveTags: Array.from(positiveTags),
    negativeTags: Array.from(negativeTags),
  }
}
