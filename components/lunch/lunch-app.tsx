"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw, Sparkles } from "lucide-react"
import {
  BASE_QUESTIONS,
  FOLLOWUP_QUESTIONS,
  recommend,
  type Answer,
  type Menu,
  type Question,
} from "@/lib/lunch-data"
import { ChatInput } from "./chat-input"
import { IdleScreen } from "./idle-screen"
import { MessageBubble, TypingBubble, type ChatMessage } from "./message-bubble"
import { ResultView, DoneView } from "./result-view"

type Phase = "idle" | "chat" | "result" | "done"

const TYPING_MS = 700

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

  const idRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const nextId = () => `m${idRef.current++}`

  // 새 메시지/상태 변화 시 항상 최신 대화가 보이도록 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing, phase, recommendations])

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), [])

  const postQuestion = (qs: Question[], index: number) => {
    setTyping(true)
    setInputEnabled(false)
    timerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: qs[index].prompt }])
      setInputEnabled(true)
    }, TYPING_MS)
  }

  const start = () => {
    setPhase("chat")
    setMessages([{ id: nextId(), role: "assistant", text: "좋아요! 몇 가지만 물어볼게요. 편하게 골라줘요." }])
    setQuestions(BASE_QUESTIONS)
    setCurrentIndex(0)
    setAnswers([])
    setExcluded([])
    setRound(1)
    setRecommendations([])
    setAcceptedMenu(null)
    postQuestion(BASE_QUESTIONS, 0)
  }

  const finish = (allAnswers: Answer[], excludeList: string[]) => {
    setTyping(true)
    setInputEnabled(false)
    timerRef.current = setTimeout(() => {
      setTyping(false)
      const recs = recommend(allAnswers, excludeList)
      setRecommendations(recs)
      setPhase("result")
    }, 1100)
  }

  const handleAnswer = (value: string, tags: string[]) => {
    if (!inputEnabled) return
    const q = questions[currentIndex]
    const answer: Answer = { questionId: q.id, value, tags }
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
      { id: nextId(), role: "user", text: "다른 거 없어요?" },
      { id: nextId(), role: "assistant", text: "알겠어요, 딱 두 개만 더 물어볼게요!" },
    ])
    postQuestion(FOLLOWUP_QUESTIONS, 0)
  }

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase("idle")
    setMessages([])
    setTyping(false)
    setRecommendations([])
    setAcceptedMenu(null)
  }

  const total = questions.length
  const step = Math.min(currentIndex + 1, total)

  return (
    <div className="flex h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-foreground/5">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="font-serif text-lg tracking-tight text-foreground">점심 메뉴 스무고개</span>
        </div>
        <div className="flex items-center gap-3">
          {phase === "chat" && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
              질문 {step}/{total}
            </span>
          )}
          {phase !== "idle" && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" />
              처음부터
            </button>
          )}
        </div>
      </header>

      {/* 본문 */}
      {phase === "idle" ? (
        <div className="flex-1 overflow-hidden">
          <IdleScreen onStart={start} />
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {typing && <TypingBubble />}

          {phase === "result" && recommendations.length > 0 && (
            <ResultView
              recommendations={recommendations}
              round={round}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}

          {phase === "done" && acceptedMenu && (
            <div className="pt-4">
              <DoneView menu={acceptedMenu} onRestart={reset} />
            </div>
          )}
        </div>
      )}

      {/* 입력 영역 (질문 단계에서만 노출) */}
      {phase === "chat" && (
        <footer className="border-t border-border bg-card px-5 py-4">
          <ChatInput
            choices={questions[currentIndex]?.choices ?? []}
            disabled={!inputEnabled}
            onAnswer={handleAnswer}
          />
        </footer>
      )}
    </div>
  )
}
