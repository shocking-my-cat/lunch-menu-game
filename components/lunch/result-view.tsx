"use client"

import { Check, X, RotateCcw, Trophy, Medal } from "lucide-react"
import type { Menu } from "@/lib/lunch-data"
import { cn } from "@/lib/utils"

function MenuCard({ menu, rank }: { menu: Menu; rank: 1 | 2 }) {
  const isFirst = rank === 1
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-5 transition duration-300 animate-in fade-in slide-in-from-bottom-3",
        isFirst
          ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
              isFirst
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {isFirst ? <Trophy className="size-3.5" /> : <Medal className="size-3.5" />}
            {isFirst ? "1순위 추천" : "2순위 대안"}
          </span>
          <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {menu.category}
          </span>
        </div>
        <span className="text-xs font-medium text-primary/80">{menu.emojiHint}</span>
      </div>

      <h3 className="font-serif text-3xl tracking-tight text-foreground">{menu.name}</h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{menu.blurb}</p>

      {menu.matchReason && (
        <div className="mt-1 rounded-xl bg-background/80 p-2.5 text-xs font-medium text-foreground/90 border border-border/60">
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">
          {round > 1 ? "다시 골라봤어요!" : "다 들어봤어요! 오늘은 이거 어때요?"}
        </p>
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          오늘의 점심 추천
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MenuCard menu={recommendations[0]} rank={1} />
        {recommendations[1] && <MenuCard menu={recommendations[1]} rank={2} />}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-secondary/60 p-4">
        <p className="text-center text-sm font-medium text-foreground">
          마음에 드는 메뉴가 있나요?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Check className="size-4" />
            좋아요, 이걸로!
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center duration-300 animate-in fade-in zoom-in-95">
      <img src="/mascot.png" alt="" aria-hidden="true" className="h-32 w-32 object-contain" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">결정 완료!</p>
        <h2 className="text-balance font-serif text-4xl tracking-tight text-foreground">
          오늘 점심은
          <br />
          <span className="text-primary">{menu.name}</span>!
        </h2>
        <p className="text-pretty text-[15px] text-muted-foreground">
          맛있게 드세요. 다음에 또 고민되면 찾아와요!
        </p>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <RotateCcw className="size-4" />
        다시 추천받기
      </button>
    </div>
  )
}
