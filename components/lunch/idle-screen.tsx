"use client"

import { UtensilsCrossed } from "lucide-react"

export function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="group flex h-full w-full flex-col items-center justify-center gap-8 rounded-2xl px-6 text-center outline-none"
      aria-label="스무고개 시작하기"
    >
      <div className="relative">
        <div className="absolute -inset-6 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-80" />
        <img
          src="/mascot.png"
          alt="점심 메뉴를 추천해주는 마스코트"
          className="relative h-40 w-40 object-contain drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-1"
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <UtensilsCrossed className="size-3.5" />
          점심 뭐 먹지?
        </span>
        <h1 className="text-balance font-serif text-5xl leading-tight tracking-tight text-foreground">
          내가 점심 메뉴
          <br />
          추천해줌
        </h1>
        <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-muted-foreground">
          간단한 스무고개 몇 번이면 끝. 오늘의 점심, 고민하지 말고 나한테 맡겨봐요.
        </p>
      </div>

      <span className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-sm transition group-hover:opacity-90 group-hover:shadow-md">
        시작하기
      </span>
    </button>
  )
}
