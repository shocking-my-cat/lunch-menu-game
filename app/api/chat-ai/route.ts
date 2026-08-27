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

    const systemPrompt = `당신은 재치 있고 유쾌하며 세심한 '점심 메뉴 추천 스무고개 AI 요정' 마스코트입니다.
사용자와 자유롭고 폭넓은 점심 대화를 진행 중입니다. (현재 대화 단계: ${step}/${maxSteps}턴)

[대화 히스토리]
${conversationPrompt || "(대화 시작)"}

[대화 폭 확장 지침 (Wide Spectrum Interaction)]
1. 정해진 질문 순서에 얽매이지 말고, 사용자의 최근 대화(감정, 숙취/과음, 다이어트, 스트레스, 특정 메뉴 언급, 혼밥/회식 등)를 민감하게 캐치하여 유쾌한 맞장구와 꼬리물기 질문을 던지세요.
   - 숙취/술 언급 ➔ 속풀이 해장국물 vs 아예 느끼한 햄버거 해장 여부
   - 다이어트/체중 ➔ 칼로리 가벼운 샐러드/포케/샤브샤브 여부
   - 스트레스/우울 ➔ 화끈한 불맛/마라탕 vs 달콤고소한 치즈/파스타 여부
   - 특정 메뉴 언급 ➔ 해당 메뉴 및 조화로운 조합 가이드

2. 사용자가 클릭할 3~4개의 칩(choices)도 상황 밀착형 이모지 칩으로 작성하세요.
   - 대표 태그: "soup", "warm", "cold", "light", "heavy", "spicy", "nonspicy", "korean", "japanese", "chinese", "western", "asian", "rice", "noodle", "bread", "salad", "cheap", "premium", "solo", "quick", "hangover", "diet", "mara"

3. 보이스 앤 톤: "~요", "~해줄게", "~하자" 구어체와 "어라? 🚀" 같은 위트 넘치는 리액션.

4. 엉뚱하거나 모호한 입력인 경우: "isAmbiguous": true로 설정하고 재치 있게 점심 선택으로 대화를 복구하세요.

5. 반드시 아래 JSON 형식으로만 응답하세요:
{
  "question": "맞장구/공감 반응 + 다음 꼬리물기 질문 문구",
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
        temperature: 0.8,
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
