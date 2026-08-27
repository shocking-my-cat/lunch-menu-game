"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { RotateCcw, Sparkles, Utensils, Bot } from "lucide-react"
import {
  BASE_QUESTIONS,
  FOLLOWUP_QUESTIONS,
  type Answer,
  type Choice,
  type Menu,
  type Question,
} from "@/lib/lunch-data"
import { recommend } from "@/lib/recommend-engine"
import { checkProfanity, getRandomProfanityResponse } from "@/lib/profanity-guard"
import { ChatInput } from "./chat-input"
import { IdleScreen } from "./idle-screen"
import {
  MessageBubble,
  TypingBubble,
  RecommendingBubble,
  type ChatMessage,
} from "./message-bubble"
import { ResultView, DoneView } from "./result-view"
import { TimeoutFallback } from "./timeout-fallback"

import { fetchCurrentWeather, type WeatherInfo } from "@/lib/weather"

export type Phase = "idle" | "chat" | "recommending" | "result" | "done"

const TYPING_MS = 650
const TIMEOUT_THRESHOLD_MS = 10000 // 10초 이상 지연 시 타임아웃 처리 (EXC-03)
const MAX_AI_STEPS = 5 // AI 대화 스무고개 최대 턴 수

export function LunchApp() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [questions, setQuestions] = useState<Question[]>(BASE_QUESTIONS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [excluded, setExcluded] = useState<string[]>([])
  const [round, setRound] = useState(1)
  const [typing, setTyping] = useState(false)
  const [inputEnabled, setInputEnabled] = useState(false)
  const [recommendations, setRecommendations] = useState<Menu[]>([])
  const [acceptedMenu, setAcceptedMenu] = useState<Menu | null>(null)
  const [isTimeout, setIsTimeout] = useState(false)
  const [currentChoices, setCurrentChoices] = useState<Choice[]>([])
  const [isAiMode, setIsAiMode] = useState(true)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)

  const idRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const nextId = () => `m_${Date.now()}_${idRef.current++}`

  // 스크롤 최하단 자동 동기화
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, typing, phase, recommendations, isTimeout])

  // 언마운트 시 활성 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)
    }
  }, [])

  const startTimeoutGuard = useCallback(() => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)
    timeoutTimerRef.current = setTimeout(() => {
      setIsTimeout(true)
      setTyping(false)
    }, TIMEOUT_THRESHOLD_MS)
  }, [])

  const clearTimeoutGuard = useCallback(() => {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current)
      timeoutTimerRef.current = null
    }
    setIsTimeout(false)
  }, [])

  // 질문 및 칩 노출 (AI 또는 Fallback)
  const postAIQuestion = useCallback(async (
    stepIndex: number,
    chatHistory: ChatMessage[],
    qs: Question[]
  ) => {
    setTyping(true)
    setInputEnabled(false)
    setIsTimeout(false)
    startTimeoutGuard()

    try {
      // 1. AI API 호출 시도 (/api/chat-ai)
      const res = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: chatHistory.map((m) => ({ role: m.role, text: m.text })),
          step: stepIndex + 1,
          maxSteps: MAX_AI_STEPS,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.question && Array.isArray(data.choices)) {
          clearTimeoutGuard()
          setTyping(false)
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "assistant", text: data.question },
          ])
          setCurrentChoices(data.choices)
          setInputEnabled(true)
          setIsAiMode(data.mode === "gemini-ai")
          return { isAmbiguous: !!data.isAmbiguous }
        }
      }
      throw new Error("Failed to get AI question")
    } catch (err) {
      console.warn("AI Question fallback to static question:", err)
      clearTimeoutGuard()
      setTyping(false)
      const fallbackQ = qs[stepIndex] || BASE_QUESTIONS[0]
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", text: fallbackQ.prompt },
      ])
      setCurrentChoices(fallbackQ.choices)
      setInputEnabled(true)
      setIsAiMode(false)
      return { isAmbiguous: false }
    }
  }, [startTimeoutGuard, clearTimeoutGuard])

  const finish = useCallback(async (allAnswers: Answer[], excludeList: string[]) => {
    setPhase("recommending")
    setInputEnabled(false)
    setTyping(false)
    setIsTimeout(false)
    startTimeoutGuard()

    try {
      const res = await fetch("/api/recommend-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: allAnswers, excluded: excludeList, weather }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.recommendations && data.recommendations.length > 0) {
          clearTimeoutGuard()
          setRecommendations(data.recommendations)
          setPhase("result")
          return
        }
      }
      throw new Error("Failed to get AI recommendations")
    } catch (err) {
      console.warn("AI recommendation fallback to rule-based:", err)
      clearTimeoutGuard()
      const recs = recommend(allAnswers, excludeList)
      setRecommendations(recs)
      setPhase("result")
    }
  }, [startTimeoutGuard, clearTimeoutGuard, weather])

  const start = async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    clearTimeoutGuard()
    setPhase("chat")
    const initialMessage: ChatMessage = {
      id: nextId(),
      role: "assistant",
      text: "좋아요! 오늘 입맛과 상황에 딱 맞는 점심 메뉴를 AI가 맞춰볼게요. 편하게 답해주세요 🍽️",
    }
    setMessages([initialMessage])
    setQuestions(BASE_QUESTIONS)
    setCurrentIndex(0)
    setAnswers([])
    setExcluded([])
    setRound(1)
    setRecommendations([])
    setAcceptedMenu(null)
    setIsAiMode(true)

    // 날씨 정보 탐지
    fetchCurrentWeather().then((w) => setWeather(w))

    postAIQuestion(0, [initialMessage], BASE_QUESTIONS)
  }

  const handleAnswer = async (value: string, tags: string[], negativeTags?: string[]) => {
    if (!inputEnabled || phase !== "chat") return

    // 비속어 방어 (EXC-05): 비속어 감지 시 공격성 차단 및 위트 있는 멘트 응답
    if (checkProfanity(value)) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: value },
        { id: nextId(), role: "assistant", text: getRandomProfanityResponse() },
      ])
      return
    }

    const currentQId = `q_${currentIndex}`
    const answer: Answer = { questionId: currentQId, value, tags, negativeTags }
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)

    const userMsg: ChatMessage = { id: nextId(), role: "user", text: value }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)

    const nextIndex = currentIndex + 1
    const totalSteps = isAiMode ? MAX_AI_STEPS : questions.length

    if (nextIndex < totalSteps) {
      const result = await postAIQuestion(nextIndex, nextMessages, questions)
      if (!result?.isAmbiguous) {
        setCurrentIndex(nextIndex)
      }
    } else {
      finish(nextAnswers, excluded)
    }
  }

  const handleRetry = () => {
    clearTimeoutGuard()
    if (phase === "chat") {
      postAIQuestion(currentIndex, messages, questions)
    } else if (phase === "recommending") {
      finish(answers, excluded)
    }
  }

  const handleAccept = () => {
    setAcceptedMenu(recommendations[0])
    setPhase("done")
  }

  const handleReject = () => {
    const newExcluded = [...excluded, ...recommendations.map((m) => m.name)]
    setExcluded(newExcluded)
    setRound((r) => r + 1)
    setQuestions(FOLLOWUP_QUESTIONS)
    setCurrentIndex(0)
    setRecommendations([])
    setPhase("chat")
    
    const rejectUserMsg: ChatMessage = { id: nextId(), role: "user", text: "음... 다른 추천은 없을까요?" }
    const assistantAckMsg: ChatMessage = {
      id: nextId(),
      role: "assistant",
      text: "알겠어요! 방금 메뉴는 제외하고 딱 2가지만 더 여쭤볼게요 🤖",
    }
    const nextMsgs = [...messages, rejectUserMsg, assistantAckMsg]
    setMessages(nextMsgs)
    postAIQuestion(0, nextMsgs, FOLLOWUP_QUESTIONS)
  }

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    clearTimeoutGuard()
    setPhase("idle")
    setMessages([])
    setTyping(false)
    setInputEnabled(false)
    setRecommendations([])
    setAcceptedMenu(null)
    setRound(1)
  }

  const total = isAiMode ? MAX_AI_STEPS : questions.length
  const step = Math.min(currentIndex + 1, total)
  const isFollowup = round > 1

  return (
    <div className="flex h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/5 transition-all">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-border bg-card/80 px-5 py-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Utensils className="size-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              점심 메뉴 스무고개
            </span>
            {isAiMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                <Bot className="size-3" />
                Gemini 2.5 AI
              </span>
            )}
            {weather && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground border border-border/40">
                <span>{weather.emoji}</span>
                <span>{weather.label}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(phase === "chat" || phase === "recommending") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tabular-nums text-secondary-foreground border border-border/50">
              <Sparkles className="size-3 text-primary" />
              {isFollowup ? `재추천 질문 ${step}/${questions.length}` : `AI 질문 ${step}/${total}`}
            </span>
          )}
          {phase !== "idle" && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" />
              처음부터
            </button>
          )}
        </div>
      </header>

      {/* 본문 대화 영역 */}
      {phase === "idle" ? (
        <div className="flex-1 overflow-hidden">
          <IdleScreen onStart={start} />
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6 scroll-smooth">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {typing && <TypingBubble />}

          {/* 타임아웃 발생 시 재시도 fallback 노출 (EXC-03) */}
          {isTimeout && <TimeoutFallback onRetry={handleRetry} />}

          {phase === "recommending" && !isTimeout && <RecommendingBubble />}

          {phase === "result" && recommendations.length > 0 && (
            <ResultView
              recommendations={recommendations}
              round={round}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}

          {phase === "done" && acceptedMenu && (
            <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
              <DoneView menu={acceptedMenu} onRestart={reset} />
            </div>
          )}
        </div>
      )}

      {/* 입력 영역 (질문 진행 단계에서만 노출, 로딩/타임아웃 중 완전 비활성화 EXC-04) */}
      {phase === "chat" && (
        <footer className="border-t border-border bg-card/95 p-4 backdrop-blur-sm">
          <ChatInput
            choices={currentChoices.length > 0 ? currentChoices : (questions[currentIndex]?.choices ?? [])}
            disabled={!inputEnabled || isTimeout}
            onAnswer={handleAnswer}
          />
        </footer>
      )}
    </div>
  )
}
