"use client"

import { Check, X, RotateCcw, Trophy, Medal, Sparkles } from "lucide-react"
import type { Menu } from "@/lib/lunch-data"
import { Confetti } from "./confetti"
import { cn } from "@/lib/utils"

function MenuCard({ menu, rank }: { menu: Menu; rank: 1 | 2 }) {
  const isFirst = rank === 1
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3",
        isFirst
          ? "border-primary/50 bg-gradient-to-b from-primary/10 to-primary/5 shadow-md ring-1 ring-primary/30"
          : "border-border/80 bg-card hover:border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-xs",
              isFirst
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border/50",
            )}
          >
            {isFirst ? <Trophy className="size-3.5 text-amber-200" /> : <Medal className="size-3.5" />}
            {isFirst ? "1순위 추천" : "2순위 대안"}
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40">
            {menu.category}
          </span>
        </div>
        <span className="text-xs font-semibold text-primary">{menu.emojiHint}</span>
      </div>

      <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground">{menu.name}</h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{menu.blurb}</p>

      {menu.matchReason && (
        <div className="mt-1 rounded-xl bg-card/90 p-3 text-xs font-medium text-foreground/90 border border-border/60 shadow-xs">
          {menu.matchReason}
        </div>
      )}
    </div>
  )
}

export function ResultView({
  recommendations,
  round,
  onAccept,
  onReject,
}: {
  recommendations: Menu[]
  round: number
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" />
          {round > 1 ? "새로운 취향을 반영했어요!" : "고민 끝! 맞춤 추천 결과"}
        </p>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          오늘의 점심 메뉴 추천
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MenuCard menu={recommendations[0]} rank={1} />
        {recommendations[1] && <MenuCard menu={recommendations[1]} rank={2} />}
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-secondary/50 p-4 backdrop-blur-xs">
        <p className="text-center text-sm font-semibold text-foreground">
          추천받은 메뉴가 마음에 들었나요?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground shadow-md transition hover:scale-[1.02] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Check className="size-4" />
            좋아요, 이걸로 확정!
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-xs transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
            음... 다른 거 없어요?
          </button>
        </div>
      </div>
    </div>
  )
}

export function DoneView({ menu, onRestart }: { menu: Menu; onRestart: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center py-4 duration-300 animate-in fade-in zoom-in-95">
      {/* 폭죽 컨페티 애니메이션 (Sprint 4) */}
      <Confetti />

      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-accent/20 blur-xl animate-pulse" />
        <img
          src="/mascot.png"
          alt="축하하는 마스코트"
          className="relative h-36 w-36 object-contain drop-shadow-md"
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold text-accent-foreground">
          <Sparkles className="size-3.5 text-accent" />
          오늘 점심 결정 완료!
        </span>

        <h2 className="text-balance font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          축하합니다! 🎉
          <br />
          오늘 점심은 <span className="text-primary">{menu.name}</span>!
        </h2>

        {/* 확정 메뉴 카드 */}
        <div className="mt-2 max-w-sm rounded-2xl border border-border/80 bg-card p-4 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {menu.category}
            </span>
            <span className="text-xs font-semibold text-primary">{menu.emojiHint}</span>
          </div>
          <p className="text-sm text-muted-foreground">{menu.blurb}</p>
        </div>

        <p className="text-pretty text-sm text-muted-foreground pt-1">
          맛있고 든든한 점심시간 보내세요! 또 고민되면 언제든 찾아오세요 🍽️
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="size-4" />
        처음부터 다시 추천받기
      </button>
    </div>
  )
}
