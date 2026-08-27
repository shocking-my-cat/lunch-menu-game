"use client"

import { useState, useRef, useEffect } from "react"
import { AlertCircle, SendHorizontal } from "lucide-react"
import type { Choice } from "@/lib/lunch-data"
import { extractKeywordsAndTags } from "@/lib/keyword-mapper"
import { cn } from "@/lib/utils"

const MAX_LEN = 50

export function ChatInput({
  choices,
  disabled,
  onAnswer,
}: {
  choices: Choice[]
  disabled: boolean
  onAnswer: (value: string, tags: string[], negativeTags?: string[]) => void
}) {
  const [value, setValue] = useState("")
  const [composing, setComposing] = useState(false)
  const [emptyWarning, setEmptyWarning] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    }
  }, [])

  const triggerEmptyWarning = () => {
    setEmptyWarning(true)
    setIsShaking(true)

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    warningTimerRef.current = setTimeout(() => {
      setEmptyWarning(false)
      setIsShaking(false)
    }, 2200)
  }

  const submitText = () => {
    if (disabled) return
    const trimmed = value.trim()

    // EXC-02: 빈 입력 방어
    if (!trimmed) {
      triggerEmptyWarning()
      return
    }

    setEmptyWarning(false)
    setIsShaking(false)

    const { positiveTags, negativeTags } = extractKeywordsAndTags(trimmed)
    onAnswer(trimmed, positiveTags, negativeTags)
    setValue("")
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const combined = (value + pastedText).slice(0, MAX_LEN)
    setValue(combined)
  }

  const isMax = value.length >= MAX_LEN

  return (
    <div className="flex flex-col gap-3 relative">
      {/* 빈 입력 경고 툴팁 (EXC-02) */}
      {emptyWarning && (
        <div className="absolute -top-10 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/90 px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="size-3.5" />
          <span>한 글자 이상 입력해주세요!</span>
        </div>
      )}

      {/* 빠른 선택 칩 (design.md 둥근 모서리 & Vibrant Orange 오버레이) */}
      <div className="flex flex-wrap gap-2">
        {choices.map((c) => (
          <button
            key={c.label}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(c.label, c.tags, c.negativeTags)}
            className={cn(
              "rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200",
              "hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-[1.02]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 자유 입력 (최대 50자, design.md 입체감 있는 모서리) */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm transition duration-200",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
          isShaking && "animate-shake border-destructive ring-2 ring-destructive/30",
        )}
      >
        <input
          value={value}
          disabled={disabled}
          maxLength={MAX_LEN}
          placeholder="원하는 음식을 자유롭게 말씀해주세요 (최대 50자)"
          onChange={(e) => {
            if (emptyWarning) setEmptyWarning(false)
            setValue(e.target.value.slice(0, MAX_LEN))
          }}
          onPaste={handlePaste}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229 &&
              !composing
            ) {
              e.preventDefault()
              submitText()
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
        />

        {/* 50자 카운터 (EXC-01) */}
        <span
          className={cn(
            "shrink-0 text-xs tabular-nums font-medium transition-colors",
            isMax ? "font-bold text-destructive" : "text-muted-foreground",
          )}
        >
          {value.length}/{MAX_LEN}
        </span>

        {/* 전송 버튼 (Vibrant Orange & 호버 그림자) */}
        <button
          type="button"
          onClick={submitText}
          disabled={disabled}
          aria-label="답변 보내기"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200",
            "hover:scale-105 hover:bg-[#E67E00] hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
          )}
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </div>
  )
}
