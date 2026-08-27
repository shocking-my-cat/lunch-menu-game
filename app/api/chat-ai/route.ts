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

    const systemPrompt = `당신은 친절하고 유쾌하며 재치 있는 '점심 메뉴 추천 스무고개 AI 요정' 마스코트입니다.
사용자와 점심 메뉴 추천 대화를 진행하고 있습니다. (현재 대화 단계: ${step}/${maxSteps}턴)

[대화 내역]
${conversationPrompt || "(대화 시작)"}

[지침]
1. 사용자의 최근 입력이 점심 추천과 전혀 관련 없거나 엉뚱한 말("우주선 먹고 싶어", "아무거나", "몰라", "12345" 등)인 경우:
   - "isAmbiguous": true로 설정하세요.
   - 유쾌하고 귀엽게 딴지를 걸며 점심 선택을 돕는 재질문과 3~4개의 힌트 칩(choices)을 제공하세요. (예: "우주선은 아직 요리가 안 돼요! 🚀 대신 뜨끈한 국물이나 바삭한 튀김은 어떠세요?")

2. 정상적인 취향 답변인 경우:
   - "isAmbiguous": false로 설정하세요.
   - 대화 흐름상 다음에 물어볼 자연스러운 점심 취향/상황 질문 1개와 3~4개의 칩(choices)을 생성하세요.
   - 칩 태그 예시: "soup", "warm", "cold", "light", "heavy", "spicy", "nonspicy", "korean", "japanese", "chinese", "western", "asian", "rice", "noodle", "bread", "salad", "cheap", "premium", "solo", "quick"

3. 반드시 아래 JSON 형식으로 응답하세요:
{
  "question": "질문 문구 또는 엉뚱한 입력에 대한 공감 대답 및 재질문",
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
