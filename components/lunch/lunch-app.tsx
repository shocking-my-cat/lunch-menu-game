"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { RotateCcw, Sparkles, Utensils } from "lucide-react"
import {
  BASE_QUESTIONS,
  FOLLOWUP_QUESTIONS,
  type Answer,
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

export type Phase = "idle" | "chat" | "recommending" | "result" | "done"

const TYPING_MS = 650
const RECOMMEND_DELAY_MS = 1200
const TIMEOUT_THRESHOLD_MS = 10000 // 10초 이상 지연 시 타임아웃 처리 (EXC-03)

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

  const postQuestion = useCallback((qs: Question[], index: number) => {
    setTyping(true)
    setInputEnabled(false)
    setIsTimeout(false)
    startTimeoutGuard()

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      clearTimeoutGuard()
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", text: qs[index].prompt },
      ])
      setInputEnabled(true)
    }, TYPING_MS)
  }, [startTimeoutGuard, clearTimeoutGuard])

  const finish = useCallback((allAnswers: Answer[], excludeList: string[]) => {
    setPhase("recommending")
    setInputEnabled(false)
    setTyping(false)
    setIsTimeout(false)
    startTimeoutGuard()

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      clearTimeoutGuard()
      try {
        const recs = recommend(allAnswers, excludeList)
        setRecommendations(recs)
        setPhase("result")
      } catch (err) {
        console.error("Recommendation error:", err)
        // Fallback 추천 처리
        setRecommendations(recommend(allAnswers, []))
        setPhase("result")
      }
    }, RECOMMEND_DELAY_MS)
  }, [startTimeoutGuard, clearTimeoutGuard])

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    clearTimeoutGuard()
    setPhase("chat")
    setMessages([
      {
        id: nextId(),
        role: "assistant",
        text: "좋아요! 오늘 입맛과 상황에 딱 맞는 점심 메뉴를 찾아드릴게요. 편하게 답해주세요 🍽️",
      },
    ])
    setQuestions(BASE_QUESTIONS)
    setCurrentIndex(0)
    setAnswers([])
    setExcluded([])
    setRound(1)
    setRecommendations([])
    setAcceptedMenu(null)
    postQuestion(BASE_QUESTIONS, 0)
  }

  const handleAnswer = (value: string, tags: string[], negativeTags?: string[]) => {
    if (!inputEnabled || phase !== "chat") return

    // 비속어 방어 (EXC-05 확장): 비속어 감지 시 공격성 차단 및 위트 있는 멘트 응답
    if (checkProfanity(value)) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: value },
        { id: nextId(), role: "assistant", text: getRandomProfanityResponse() },
      ])
      return
    }

    const q = questions[currentIndex]
    const answer: Answer = { questionId: q.id, value, tags, negativeTags }
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: value }])

    const nextIndex = currentIndex + 1
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex)
      postQuestion(questions, nextIndex)
    } else {
      finish(nextAnswers, excluded)
    }
  }

  const handleRetry = () => {
    clearTimeoutGuard()
    if (phase === "chat") {
      postQuestion(questions, currentIndex)
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
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: "음... 다른 추천은 없을까요?" },
      {
        id: nextId(),
        role: "assistant",
        text: "알겠어요! 방금 메뉴는 제외하고 딱 2가지만 더 여쭤볼게요.",
      },
    ])
    postQuestion(FOLLOWUP_QUESTIONS, 0)
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

  const total = questions.length
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
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              점심 메뉴 스무고개
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(phase === "chat" || phase === "recommending") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tabular-nums text-secondary-foreground border border-border/50">
              <Sparkles className="size-3 text-primary" />
              {isFollowup ? `재추천 질문 ${step}/${total}` : `질문 ${step}/${total}`}
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
            choices={questions[currentIndex]?.choices ?? []}
            disabled={!inputEnabled || isTimeout}
            onAnswer={handleAnswer}
          />
        </footer>
      )}
    </div>
  )
}
