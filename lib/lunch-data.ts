// 프론트엔드 전용 "점심 메뉴 스무고개" 로직 데이터
// 백엔드/DB/외부 API 없음. 모든 상태는 클라이언트에서만 관리됩니다.

export type Choice = {
  label: string
  // 이 선택지가 강화하는 메뉴 태그들
  tags: string[]
  // 회피/제외할 태그 (옵션)
  negativeTags?: string[]
}

export type Question = {
  id: string
  // 마스코트가 던지는 질문 문구
  prompt: string
  // 빠른 선택 칩 (자유 입력도 가능, 최대 50자)
  choices: Choice[]
}

export type Menu = {
  id: string
  name: string
  category: "한식" | "일식" | "중식" | "양식" | "아시안/분식"
  emojiHint: string // 카드에 쓰는 간단한 설명용 키워드
  blurb: string
  tags: string[]
  matchReason?: string // 추천 엔진에서 동적으로 주입되는 맞춤형 이유
}

export type Answer = {
  questionId: string
  value: string
  tags: string[]
  negativeTags?: string[]
}

// 기본 질문 7개 (스무고개 방식)
export const BASE_QUESTIONS: Question[] = [
  {
    id: "temp",
    prompt: "지금 뜨끈한 국물이 당겨요, 아니면 시원하거나 깔끔한 게 좋아요?",
    choices: [
      { label: "뜨끈한 국물 🍲", tags: ["soup", "warm"] },
      { label: "시원한 거 🧊", tags: ["cold", "light"], negativeTags: ["soup"] },
      { label: "국물 없는 요리 🥩", tags: ["dry"], negativeTags: ["soup"] },
      { label: "상관없어요 ✨", tags: [] },
    ],
  },
  {
    id: "spicy",
    prompt: "매운 음식, 오늘 컨디션에 어때요?",
    choices: [
      { label: "매울수록 좋아 🔥", tags: ["spicy"] },
      { label: "적당히 매콤 🌶️", tags: ["mild-spicy"] },
      { label: "순하고 안 매운 걸로 👶", tags: ["nonspicy"], negativeTags: ["spicy"] },
    ],
  },
  {
    id: "cuisine",
    prompt: "끌리는 나라나 요리 스타일이 있나요?",
    choices: [
      { label: "한식 🍚", tags: ["korean"] },
      { label: "일식 🍣", tags: ["japanese"] },
      { label: "중식 🥟", tags: ["chinese"] },
      { label: "양식/아시안 🍕", tags: ["western", "asian"] },
    ],
  },
  {
    id: "carb",
    prompt: "주식은 밥, 면, 빵, 샐러드 중 뭐가 끌려요?",
    choices: [
      { label: "밥 🍚", tags: ["rice"] },
      { label: "면 🍜", tags: ["noodle"] },
      { label: "빵/버거 🍔", tags: ["bread"] },
      { label: "샐러드/포케 🥗", tags: ["salad", "light"] },
    ],
  },
  {
    id: "heavy",
    prompt: "든든하고 푸짐하게 vs 산뜻하고 가볍게, 오늘의 위장은?",
    choices: [
      { label: "든든하고 푸짐하게 💪", tags: ["heavy"] },
      { label: "산뜻하고 가볍게 🌿", tags: ["light"], negativeTags: ["heavy"] },
    ],
  },
  {
    id: "budget",
    prompt: "점심 예산과 분위기는 어떻게 생각하고 있나요?",
    choices: [
      { label: "가성비 편안하게 🪙", tags: ["cheap"] },
      { label: "기분 내는 특별한 식사 ✨", tags: ["premium"] },
      { label: "상관없어요 🍽️", tags: [] },
    ],
  },
  {
    id: "solo",
    prompt: "오늘 점심은 혼밥인가요, 아니면 동료와 함께인가요?",
    choices: [
      { label: "혼밥 (빠르고 편하게) ⚡", tags: ["solo", "quick"] },
      { label: "동료와 함께 👥", tags: ["share"] },
    ],
  },
]

// 재추천 시 추가 질문 2개
export const FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: "avoid",
    prompt: "방금 추천은 마음에 안 드셨군요! 오늘 확실히 피하고 싶은 요소가 있나요?",
    choices: [
      { label: "기름지거나 무거운 거 🌿", tags: ["light"], negativeTags: ["heavy"] },
      { label: "밀가루/면 🍚", tags: ["rice"], negativeTags: ["noodle", "bread"] },
      { label: "국물 있는 거 🥩", tags: ["dry"], negativeTags: ["soup"] },
      { label: "자극적인 매운맛 👶", tags: ["nonspicy"], negativeTags: ["spicy"] },
    ],
  },
  {
    id: "mood",
    prompt: "그럼 지금 기분에 딱 맞는 한 마디를 골라주세요!",
    choices: [
      { label: "색다르고 특별한 맛! ✨", tags: ["premium", "western", "japanese"] },
      { label: "속 편하고 익숙한 맛 🍚", tags: ["korean", "rice", "light"] },
      { label: "스피드가 생명, 퀵 런치 ⚡", tags: ["quick", "cheap"] },
    ],
  },
]

// 풍부한 36종 점심 메뉴 데이터베이스
export const MENUS: Menu[] = [
  // --- 한식 (10종) ---
  {
    id: "m_kimchi",
    name: "김치찌개",
    category: "한식",
    emojiHint: "얼큰한 국물",
    blurb: "밥 한 공기 뚝딱 비우는 실패 없는 국민 점심의 정석.",
    tags: ["soup", "warm", "korean", "spicy", "rice", "heavy", "cheap", "solo", "share", "hangover"],
  },
  {
    id: "m_sundubu",
    name: "순두부찌개",
    category: "한식",
    emojiHint: "보들보들 순두부",
    blurb: "부드럽고 얼큰한 국물로 지친 속을 따뜻하게 달래줘요.",
    tags: ["soup", "warm", "korean", "mild-spicy", "rice", "heavy", "cheap", "solo", "hangover"],
  },
  {
    id: "m_gukbap",
    name: "돼지/순대국밥",
    category: "한식",
    emojiHint: "뜨끈한 한 뚝배기",
    blurb: "혼밥 최적화, 든든함과 가성비를 모두 잡은 뜨끈한 위로.",
    tags: ["soup", "warm", "korean", "rice", "heavy", "cheap", "solo", "quick", "hangover"],
  },
  {
    id: "m_budae",
    name: "의정부 부대찌개",
    category: "한식",
    emojiHint: "햄 라면사리 보글보글",
    blurb: "푸짐한 햄과 라면사리, 동료들과 든든하게 나눠 먹는 불패 메뉴.",
    tags: ["soup", "warm", "korean", "mild-spicy", "rice", "noodle", "heavy", "share", "hangover"],
  },
  {
    id: "m_jeyuk",
    name: "제육볶음 백반",
    category: "한식",
    emojiHint: "매콤달콤 고기",
    blurb: "불향 가득한 매콤달콤 양념에 상추쌈까지 든든한 한 끼.",
    tags: ["dry", "warm", "korean", "mild-spicy", "rice", "heavy", "cheap", "solo", "share"],
  },
  {
    id: "m_bibimbap",
    name: "돌솥 비빔밥",
    category: "한식",
    emojiHint: "알록달록 나물",
    blurb: "신선한 채소와 고추장의 조화, 영양 균형 잡힌 깔끔한 식사.",
    tags: ["warm", "korean", "rice", "light", "nonspicy", "mild-spicy", "cheap", "solo"],
  },
  {
    id: "m_naengmyeon",
    name: "물냉면 / 비빔냉면",
    category: "한식",
    emojiHint: "살얼음 동동 육수",
    blurb: "가슴속까지 시원해지는 육수와 쫄깃한 면발의 청량함.",
    tags: ["cold", "light", "korean", "noodle", "nonspicy", "mild-spicy", "quick", "solo"],
  },
  {
    id: "m_samgyetang",
    name: "삼계탕 / 닭곰탕",
    category: "한식",
    emojiHint: "보양 든든 닭육수",
    blurb: "몸보신이 필요한 날, 진하고 단백질 가득한 깊은 국물 한 그릇.",
    tags: ["soup", "warm", "korean", "rice", "heavy", "premium", "nonspicy", "solo", "share"],
  },
  {
    id: "m_jimdak",
    name: "안동 찜닭",
    category: "한식",
    emojiHint: "단짠당면 찜닭",
    blurb: "단짠 짭조름한 양념에 쫄깃한 당면과 부드러운 닭고기의 궁합.",
    tags: ["dry", "warm", "korean", "mild-spicy", "rice", "heavy", "share"],
  },
  {
    id: "m_dakgalbi",
    name: "춘천 닭갈비 & 볶음밥",
    category: "한식",
    emojiHint: "매콤 불향 닭갈비",
    blurb: "매콤한 양념 닭갈비 먹고 마지막 볶음밥까지 코스로 완성!",
    tags: ["dry", "warm", "korean", "spicy", "heavy", "share"],
  },

  // --- 일식 (7종) ---
  {
    id: "m_donkatsu",
    name: "등심/안심 돈카츠",
    category: "일식",
    emojiHint: "바삭한 육즙 튀김",
    blurb: "바삭한 튀김옷 속 촉촉한 육즙, 든든하게 채우고 싶은 날의 정답.",
    tags: ["dry", "warm", "japanese", "rice", "heavy", "nonspicy", "solo", "share"],
  },
  {
    id: "m_ramen",
    name: "일본식 돈코츠 라멘",
    category: "일식",
    emojiHint: "진한 사골 국물",
    blurb: "진하고 구수한 육수에 쫄깃한 차슈와 면발의 깊은 풍미.",
    tags: ["soup", "warm", "japanese", "noodle", "heavy", "mild-spicy", "nonspicy", "solo", "quick", "hangover"],
  },
  {
    id: "m_sushi",
    name: "모둠 초밥 (스시)",
    category: "일식",
    emojiHint: "신선한 스시",
    blurb: "가볍지만 특별하게, 오늘 하루 나를 대접하고 싶을 때.",
    tags: ["cold", "light", "japanese", "rice", "premium", "nonspicy", "solo", "share"],
  },
  {
    id: "m_tendon",
    name: "바삭 텐동 (튀김덮밥)",
    category: "일식",
    emojiHint: "특제 타래소스 튀김",
    blurb: "갓 튀겨낸 새우와 채소 튀김에 달콤짭조름한 온센타마고의 조화.",
    tags: ["dry", "warm", "japanese", "rice", "heavy", "premium", "nonspicy", "solo"],
  },
  {
    id: "m_udon",
    name: "가츠오 우동 & 유부초밥",
    category: "일식",
    emojiHint: "탱글한 면발",
    blurb: "깔끔하고 맑은 가쓰오부시 국물에 부담 없는 산뜻한 포만감.",
    tags: ["soup", "warm", "japanese", "noodle", "light", "nonspicy", "cheap", "quick", "solo"],
  },
  {
    id: "m_shabu",
    name: "1인 샤브샤브",
    category: "일식",
    emojiHint: "소고기 채소 퐁당",
    blurb: "신선한 야채와 담백한 소고기를 따뜻한 국물에 적셔먹는 건강식.",
    tags: ["soup", "warm", "japanese", "light", "nonspicy", "premium", "solo", "share"],
  },
  {
    id: "m_sake_don",
    name: "생연어 덮밥 (사케동)",
    category: "일식",
    emojiHint: "입에서 녹는 연어",
    blurb: "도톰한 생연어에 와사비 한 조각, 입안 가득 고소함이 스르륵.",
    tags: ["cold", "light", "japanese", "rice", "premium", "nonspicy", "solo"],
  },

  // --- 중식 (6종) ---
  {
    id: "m_jjajang",
    name: "짜장면 & 군만두",
    category: "중식",
    emojiHint: "달콤짭조름 춘장",
    blurb: "입맛 없을 때도 후루룩 넘어가는 영원한 소울푸드.",
    tags: ["warm", "chinese", "noodle", "heavy", "cheap", "nonspicy", "quick", "solo", "share"],
  },
  {
    id: "m_jjambbong",
    name: "해물 짬뽕",
    category: "중식",
    emojiHint: "불향 해물 칼칼",
    blurb: "칼칼하고 시원한 불맛 국물로 스트레스를 한 방에 날려요.",
    tags: ["soup", "warm", "chinese", "noodle", "spicy", "heavy", "solo", "share", "hangover"],
  },
  {
    id: "m_maratang",
    name: "마라탕 / 마라샹궈",
    category: "중식",
    emojiHint: "얼얼한 중독성",
    blurb: "원하는 재료를 듬뿍 담아 즐기는 화끈하고 중독적인 얼얼함.",
    tags: ["soup", "warm", "chinese", "spicy", "heavy", "share", "solo", "mara"],
  },
  {
    id: "m_bokkeumbap",
    name: "중화 볶음밥",
    category: "중식",
    emojiHint: "고슬고슬 불맛 밥",
    blurb: "고슬고슬하게 볶아낸 밥에 짜장 소스와 짬뽕 국물의 완벽한 밸런스.",
    tags: ["dry", "warm", "chinese", "rice", "heavy", "cheap", "nonspicy", "quick", "solo"],
  },
  {
    id: "m_tangsuyuk",
    name: "찹쌀 탕수육 (꿔바로우)",
    category: "중식",
    emojiHint: "겉바속촉 찹쌀 튀김",
    blurb: "새콤달콤한 소스에 쫀득바삭한 튀김의 환상적인 식감.",
    tags: ["dry", "warm", "chinese", "heavy", "share", "premium"],
  },
  {
    id: "m_udong_china",
    name: "굴짬뽕 / 백짬뽕",
    category: "중식",
    emojiHint: "담백 시원 백국물",
    blurb: "맵지 않고 담백하면서도 해물의 깊은 맛이 우러난 진국.",
    tags: ["soup", "warm", "chinese", "noodle", "nonspicy", "light", "hangover"],
  },

  // --- 양식 (7종) ---
  {
    id: "m_pasta",
    name: "크림 / 토마토 파스타",
    category: "양식",
    emojiHint: "풍미 가득 소스",
    blurb: "부드러운 소스와 알덴테 면발로 즐기는 여유롭고 감성적인 점심.",
    tags: ["warm", "western", "noodle", "heavy", "premium", "nonspicy", "share"],
  },
  {
    id: "m_burger",
    name: "수제버거 세트",
    category: "양식",
    emojiHint: "두툼한 패티 육즙",
    blurb: "두툼한 소고기 패티와 멜팅 치즈로 빠르고 든든하게 해결!",
    tags: ["dry", "warm", "western", "bread", "heavy", "quick", "solo", "cheap", "premium"],
  },
  {
    id: "m_salad",
    name: "리코타/닭가슴살 샐러드",
    category: "양식",
    emojiHint: "신선하고 아삭한 채소",
    blurb: "몸이 가벼워지는 산뜻한 웰빙 런치, 오후에도 속이 편안해요.",
    tags: ["cold", "light", "western", "salad", "nonspicy", "solo", "quick", "diet"],
  },
  {
    id: "m_sandwich",
    name: "클럽 샌드위치 & 커피",
    category: "양식",
    emojiHint: "신선한 토스트",
    blurb: "신선한 야채와 햄치즈의 담백한 조화, 바쁜 날 간편한 한 끼.",
    tags: ["cold", "light", "western", "bread", "nonspicy", "quick", "solo", "cheap"],
  },
  {
    id: "m_pizza",
    name: "화덕 피자 (마르게리따)",
    category: "양식",
    emojiHint: "쫄깃 바질 치즈",
    blurb: "고소한 모짜렐라 치즈와 상큼한 토마토소스의 담백한 화덕 피자.",
    tags: ["warm", "western", "bread", "heavy", "share", "premium"],
  },
  {
    id: "m_risotto",
    name: "트러플 버섯 리조또",
    category: "양식",
    emojiHint: "진한 트러플 풍미",
    blurb: "은은한 트러플 향과 크리미한 밥알이 선사하는 고급스러운 풍미.",
    tags: ["warm", "western", "rice", "heavy", "premium", "nonspicy", "solo", "share"],
  },
  {
    id: "m_steak_덮밥",
    name: "큐브 스테이크 덮밥",
    category: "양식",
    emojiHint: "육즙 가득 소고기",
    blurb: "달콤 짭조름한 특제 소스에 노릇하게 구운 육즙 가득 소고기.",
    tags: ["warm", "western", "rice", "heavy", "premium", "nonspicy", "solo"],
  },

  // --- 아시안 / 분식 (6종) ---
  {
    id: "m_pho",
    name: "베트남 양지 쌀국수",
    category: "아시안/분식",
    emojiHint: "맑고 깊은 양지육수",
    blurb: "숙주 가득 개운한 육수로 해장과 힐링을 동시에.",
    tags: ["soup", "warm", "asian", "noodle", "light", "nonspicy", "solo", "share", "hangover"],
  },
  {
    id: "m_padthai",
    name: "팟타이 (태국식 볶음면)",
    category: "아시안/분식",
    emojiHint: "달콤새콤 땅콩 분태",
    blurb: "달콤 짭조름한 타마린드 소스에 아삭한 숙주와 통통한 새우.",
    tags: ["dry", "warm", "asian", "noodle", "mild-spicy", "share", "solo"],
  },
  {
    id: "m_poke",
    name: "연어 / 참치 포케 볼",
    category: "아시안/분식",
    emojiHint: "하와이안 헬시 볼",
    blurb: "현미밥 위에 신선한 해산물과 해초, 건강하고 트렌디한 포만감.",
    tags: ["cold", "light", "asian", "rice", "salad", "premium", "nonspicy", "solo", "quick", "diet"],
  },
  {
    id: "m_tteokbokki",
    name: "분식 세트 (떡볶이+튀김)",
    category: "아시안/분식",
    emojiHint: "매콤달콤 떡볶이",
    blurb: "동료와 도란도란 나눠 먹는 매콤달콤 가성비 끝판왕!",
    tags: ["warm", "korean", "spicy", "mild-spicy", "heavy", "cheap", "share", "quick"],
  },
  {
    id: "m_nasi_goreng",
    name: "나시고랭 (인도네시아 볶음밥)",
    category: "아시안/분식",
    emojiHint: "단짠 감칠맛 볶음밥",
    blurb: "삼발 소스의 중독적인 감칠맛과 반숙 계란후라이의 환상 조합.",
    tags: ["dry", "warm", "asian", "rice", "heavy", "mild-spicy", "solo"],
  },
  {
    id: "m_taco",
    name: "멕시칸 타코 & 퀘사디아",
    category: "아시안/분식",
    emojiHint: "이국적 과카몰리 타코",
    blurb: "이국적인 향신료와 프레시한 과카몰리의 상큼하고 스파이시한 만남.",
    tags: ["dry", "warm", "asian", "bread", "light", "mild-spicy", "share", "solo"],
  },
]
