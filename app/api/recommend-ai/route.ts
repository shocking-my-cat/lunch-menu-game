import { NextResponse } from "next/server"
import { ai, GEMINI_MODEL } from "@/lib/gemini"
import { MENUS, type Answer, type Menu } from "@/lib/lunch-data"
import { recommend as fallbackRecommend } from "@/lib/recommend-engine"
import type { WeatherInfo } from "@/lib/weather"

export async function POST(req: Request) {
  try {
    const { answers, excluded = [], weather } = (await req.json()) as {
      answers: Answer[]
      excluded: string[]
      weather?: WeatherInfo
    }

    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      const fallbackRecs = fallbackRecommend(answers, excluded)
      return NextResponse.json({ recommendations: fallbackRecs, mode: "fallback" })
    }

    const availableMenus = MENUS.filter((m) => !excluded.includes(m.name))
    const userAnswersSummary = answers
      .map((a) => `- ${a.questionId}: "${a.value}" (태그: ${a.tags.join(", ") || "없음"})`)
      .join("\n")

    const menuListPrompt = availableMenus
      .map((m) => `[${m.id}] ${m.name} (${m.category}, ${m.emojiHint}, 태그: ${m.tags.join(",")})`)
      .join("\n")

    const weatherPrompt = weather
      .label ? `[현재 날씨 컨텍스트] ${weather.emoji} ${weather.label} (${weather.condition}) - 날씨에 어울리는 음식에 가중치를 주세요.`
      : "[현재 날씨 컨텍스트] 맑음"

    const systemPrompt = `당신은 센스 있고 유쾌한 '점심 메뉴 추천 스무고개 AI 요정'입니다.
사용자의 대화 답변 내용과 실시간 날씨를 종합 분석하여, 주어진 메뉴 후보 목록 중에서 가장 적합한 1순위(Primary) 메뉴 1개와 2순위(Alternative) 메뉴 1개를 선택하세요.

${weatherPrompt}

[사용자 답변 내용]
${userAnswersSummary}

[선택 가능한 메뉴 후보군]
${menuListPrompt}

[응답 규칙]
1. 반드시 주어진 후보군 내에 있는 메뉴의 id를 선택해야 합니다.
2. 1순위와 2순위는 서로 다른 카테고리의 메뉴로 골라 다양성을 주세요.
3. 각 메뉴별로 사용자의 답변 및 날씨 상황에 맞춘 위트 있고 공감 가는 1~2문장의 '추천 이유(matchReason)'를 한국어로 작성하세요.
4. 반드시 JSON 형식으로만 응답하세요:
{
  "primaryMenuId": "메뉴id",
  "primaryReason": "1순위 추천 이유",
  "alternativeMenuId": "메뉴id",
  "alternativeReason": "2순위 추천 이유"
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

    const top1 = availableMenus.find((m) => m.id === parsed.primaryMenuId) || availableMenus[0]
    const top2 = availableMenus.find((m) => m.id === parsed.alternativeMenuId) || availableMenus[1] || availableMenus[0]

    const recommendations: Menu[] = [
      {
        ...top1,
        matchReason: parsed.primaryReason || top1.matchReason,
      },
      {
        ...top2,
        matchReason: parsed.alternativeReason || top2.matchReason,
      },
    ]

    return NextResponse.json({ recommendations, mode: "gemini-ai" })
  } catch (error) {
    console.error("Gemini API Error:", error)
    const fallbackRecs = fallbackRecommend([], [])
    return NextResponse.json({ recommendations: fallbackRecs, mode: "fallback-on-error" })
  }
}
