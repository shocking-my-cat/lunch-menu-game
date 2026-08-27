"use client"

import { ClockAlert, RefreshCw } from "lucide-react"

export function TimeoutFallback({
  onRetry,
}: {
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center animate-in fade-in slide-in-from-bottom-2">
      <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
        <ClockAlert className="size-5" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">
          응답이 늦어지고 있어요!
        </p>
        <p className="text-xs text-muted-foreground">
          일시적으로 대화 진행이 지연되었습니다. 아래 버튼을 눌러 다시 시도해볼까요?
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RefreshCw className="size-3.5" />
        다시 시도하기
      </button>
    </div>
  )
}
