"use client"

import { Sparkles, ArrowRight, UtensilsCrossed } from "lucide-react"

export function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      onClick={onStart}
      className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-2xl px-6 py-8 text-center select-none"
    >
      {/* 배경 장식 글로우 */}
      <div className="pointer-events-none absolute -top-12 size-72 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-12 size-72 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* 마스코트 이미지 */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/15 blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/25" />
        <img
          src="/mascot.png"
          alt="점심 메뉴를 추천해주는 마스코트"
          className="relative h-44 w-44 object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105"
        />
      </div>

      {/* 타이포그래피 영역 */}
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
          <UtensilsCrossed className="size-3.5" />
          오늘 점심 뭐 먹지? 스무고개 AI
        </span>

        <h1 className="text-balance font-serif text-5xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-6xl">
          내가 점심 메뉴
          <br />
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            추천해줌
          </span>
        </h1>

        <p className="max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
          딱 7가지 질문이면 끝! 내 입맛과 상황에 딱 맞는
          <br className="hidden sm:inline" />
          최고의 점심 메뉴 1순위와 2순위를 골라드릴게요.
        </p>
      </div>

      {/* 시작하기 CTA 버튼 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onStart()
          }}
          className="group/btn relative inline-flex items-center gap-2.5 rounded-full bg-primary px-9 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Sparkles className="size-4 animate-pulse text-amber-200" />
          <span>시작하기</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
