"use client"

import { useState } from "react"
import { SendHorizontal } from "lucide-react"
import type { Choice } from "@/lib/lunch-data"
import { cn } from "@/lib/utils"

const MAX_LEN = 50

export function ChatInput({
  choices,
  disabled,
  onAnswer,
}: {
  choices: Choice[]
  disabled: boolean
  onAnswer: (value: string, tags: string[]) => void
}) {
  const [value, setValue] = useState("")
  const [composing, setComposing] = useState(false)

  const submitText = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onAnswer(trimmed, []) // 자유 입력은 태그 없이 답변 기록 (추천 로직에 중립)
    setValue("")
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 빠른 선택 칩 */}
      <div className="flex flex-wrap gap-2">
        {choices.map((c) => (
          <button
            key={c.label}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(c.label, c.tags)}
            className={cn(
              "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition",
              "hover:border-primary hover:bg-primary/5 hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 자유 입력 (최대 50자) */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40">
        <input
          value={value}
          disabled={disabled}
          maxLength={MAX_LEN}
          placeholder="직접 입력해도 돼요 (최대 50자)"
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LEN))}
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
          className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {value.length}/{MAX_LEN}
        </span>
        <button
          type="button"
          onClick={submitText}
          disabled={disabled || !value.trim()}
          aria-label="답변 보내기"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition",
            "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </div>
  )
}
