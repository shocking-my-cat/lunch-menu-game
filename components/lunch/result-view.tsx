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
          ? "border-primary/60 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent shadow-lg shadow-primary/10 ring-2 ring-primary/40"
          : "border-border/80 bg-card hover:border-primary/40 shadow-xs",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-xs",
              isFirst
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border/50",
            )}
          >
            {isFirst ? <Trophy className="size-3.5 text-amber-100" /> : <Medal className="size-3.5" />}
            {isFirst ? "1순위 최고 추천" : "2순위 찰떡 대안"}
          </span>
          <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40">
            {menu.category}
          </span>
        </div>
        <span className="text-xs font-bold text-primary">{menu.emojiHint}</span>
      </div>

      <h3 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">{menu.name}</h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{menu.blurb}</p>

      {menu.matchReason && (
        <div className="mt-1 rounded-xl bg-card p-3.5 text-xs font-medium text-foreground border border-primary/20 shadow-xs">
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
          {round > 1 ? "새로운 취향을 반영해 다시 골랐어요!" : "고민 끝! 딱 맞는 추천 메뉴예요"}
        </p>
        <h2 className="font-serif text-2xl font-extrabold tracking-tight text-foreground">
          오늘의 점심 추천 메뉴 🍽️
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MenuCard menu={recommendations[0]} rank={1} />
        {recommendations[1] && <MenuCard menu={recommendations[1]} rank={2} />}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-secondary/60 p-4.5 backdrop-blur-xs shadow-xs">
        <p className="text-center text-sm font-bold text-foreground">
          이 메뉴로 점심 결정할까요?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:scale-[1.02] hover:bg-[#E67E00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Check className="size-4" />
            좋아요, 이걸로 할게요!
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-bold text-foreground shadow-xs transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
            음... 다른 건 없을까요?
          </button>
        </div>
      </div>
    </div>
  )
}

export function DoneView({ menu, onRestart }: { menu: Menu; onRestart: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center py-4 duration-300 animate-in fade-in zoom-in-95">
      {/* 폭죽 컨페티 애니메이션 */}
      <Confetti />

      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/25 blur-xl animate-pulse" />
        <img
          src="/mascot.png"
          alt="축하하는 Lunch Mate AI 마스코트"
          className="relative h-36 w-36 object-contain drop-shadow-lg"
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1 text-xs font-bold text-primary border border-primary/20">
          <Sparkles className="size-3.5 text-primary" />
          오늘의 점심 메뉴 확정!
        </span>

        <h2 className="text-balance font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          완벽해요! 🎉
          <br />
          오늘 점심은 <span className="text-primary">{menu.name}</span>!
        </h2>

        {/* 확정 메뉴 카드 */}
        <div className="mt-2 max-w-sm rounded-2xl border border-primary/25 bg-card p-4.5 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="rounded-md bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground">
              {menu.category}
            </span>
            <span className="text-xs font-bold text-primary">{menu.emojiHint}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{menu.blurb}</p>
        </div>

        <p className="text-pretty text-sm text-muted-foreground pt-1">
          맛있게 드시고 든든한 하루 보내세요! 또 고민되면 언제든 불러주세요 🍽️
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="size-4" />
        처음부터 다시 추천받기
      </button>
    </div>
  )
}
