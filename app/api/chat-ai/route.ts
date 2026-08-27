import { NextResponse } from "next/server"
import { ai, GEMINI_MODEL } from "@/lib/gemini"
import { BASE_QUESTIONS, type Choice } from "@/lib/lunch-data"

export type ChatAIResponse = {
  question: string
  choices: Choice[]
  questionId: string
  isAmbiguous?: boolean
  mode?: string
}

export async function POST(req: Request) {
  try {
    const { history = [], step = 1, maxSteps = 5 } = (await req.json()) as {
      history: { role: "user" | "assistant"; text: string }[]
      step: number
      maxSteps: number
    }

    // API 키 미설정 시 Fallback
    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      const fallbackIndex = Math.min(step - 1, BASE_QUESTIONS.length - 1)
      const q = BASE_QUESTIONS[fallbackIndex]
      return NextResponse.json({
        question: q.prompt,
        choices: q.choices,
        questionId: q.id,
        isAmbiguous: false,
        mode: "fallback",
      })
    }

    const conversationPrompt = history
      .map((h) => `${h.role === "user" ? "사용자" : "점심요정"}: ${h.text}`)
      .join("\n")

    const systemPrompt = `당신은 센스 있고 유쾌한 '점심 메뉴 추천 스무고개 AI 요정' 마스코트입니다.
사용자와 점심 메뉴 추천 대화를 진행 중입니다. (현재 단계: ${step}/${maxSteps}턴)

[대화 히스토리]
${conversationPrompt || "(대화 시작)"}

[대화 턴별 추천 탐색 가이드]
- Step 1 (첫 대화): 반가운 인사 + 첫 질문 결합 (온도 및 국물 여부: 뜨끈한 국물 vs 시원함 vs 국물 없는 요리)
- Step 2: 맵기 취향 및 간 (얼큰 매콤 vs 순한 맛)
- Step 3: 나라/카테고리 (한식, 일식, 중식, 양식/아시안)
- Step 4: 주식 (밥, 면, 빵, 샐러드/포케)
- Step 5: 최종 컨디션/분위기 (든든함 vs 가벼움, 가성비 vs 기분내기)

[응답 작성 지침]
1. Step 1일 때는 상냥한 첫 인사와 함께 첫 질문을 던지세요. Step 2 이후부터는 사용자의 최근 답변("사용자: ...")에 자연스럽게 맞장구/리액션(1문장)을 한 뒤 다음 질문을 던지세요.
2. 엉뚱하거나 모호한 입력("우주선", "몰라", "12345" 등)인 경우:
   - "isAmbiguous": true로 설정하세요.
   - 엉뚱함에 귀엽게 딴지를 걸고 점심 메뉴 선택을 유도하는 재질문을 작성하세요.
3. 정상적인 답변인 경우:
   - "isAmbiguous": false로 설정하세요.
   - 이전 대화에서 수집된 정보와 중복되지 않는 새로운 질문을 던지고, 3~4개의 클릭 가능한 선택지 칩(choices)을 생성하세요.
   - 칩 태그 예시: "soup", "warm", "cold", "light", "heavy", "spicy", "nonspicy", "korean", "japanese", "chinese", "western", "asian", "rice", "noodle", "bread", "salad", "cheap", "premium", "solo", "quick"

4. 반드시 아래 JSON 형식으로만 응답하세요:
{
  "question": "맞장구 + 다음 질문 문구",
  "isAmbiguous": false,
  "choices": [
    { "label": "선택지 1", "tags": ["soup", "warm"] },
    { "label": "선택지 2", "tags": ["cold", "light"], "negativeTags": ["soup"] },
    { "label": "선택지 3", "tags": ["spicy"] }
  ]
}`

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    })

    const responseText = response.text || "{}"
    const parsed = JSON.parse(responseText)

    if (!parsed.question || !Array.isArray(parsed.choices)) {
      throw new Error("Invalid AI response structure")
    }

    return NextResponse.json({
      question: parsed.question,
      choices: parsed.choices,
      questionId: `ai_q_${step}`,
      isAmbiguous: !!parsed.isAmbiguous,
      mode: "gemini-ai",
    })
  } catch (error) {
    console.error("Gemini Chat AI Error:", error)
    const fallbackQ = BASE_QUESTIONS[Math.min(step - 1, BASE_QUESTIONS.length - 1)]
    return NextResponse.json({
      question: fallbackQ.prompt,
      choices: fallbackQ.choices,
      questionId: fallbackQ.id,
      isAmbiguous: false,
      mode: "fallback-on-error",
    })
  }
}
