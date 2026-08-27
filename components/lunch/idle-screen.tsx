"use client"

import { Sparkles, ArrowRight, UtensilsCrossed, Bot } from "lucide-react"

export function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      onClick={onStart}
      className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-3xl px-6 py-8 text-center select-none"
    >
      {/* 배경 장식 글로우 (Vibrant Orange & Warm Off-white 계열) */}
      <div className="pointer-events-none absolute -top-12 size-72 rounded-full bg-primary/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-12 size-72 rounded-full bg-secondary/30 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* 마스코트 캐릭터 (도시락 & 말풍선 모티프) */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30" />
        <img
          src="/mascot.png"
          alt="점심 메뉴를 추천해주는 Lunch Mate AI 마스코트"
          className="relative h-44 w-44 object-contain drop-shadow-lg transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105"
        />
      </div>

      {/* 타이포그래피 및 브랜드 헤드라인 */}
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
          <Bot className="size-3.5" />
          Lunch Mate AI · 대화형 점심 메뉴 요정
        </span>

        <h1 className="text-balance font-serif text-5xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-6xl">
          내가 점심 메뉴
          <br />
          <span className="bg-gradient-to-r from-primary to-[#D2691E] bg-clip-text text-transparent">
            추천해줌
          </span>
        </h1>

        <p className="max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
          딱 5가지 대화면 끝! 위트 있는 AI 친구가
          <br className="hidden sm:inline" />
          오늘 내 입맛과 상황에 딱 맞는 점심 메뉴를 찰떡같이 골라줄게요 🍽️
        </p>
      </div>

      {/* Vibrant Orange 메인 CTA 버튼 (둥근 모서리 & 입체 그림자) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onStart()
          }}
          className="group/btn relative inline-flex items-center gap-2.5 rounded-full bg-primary px-9 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-[#E67E00] hover:shadow-2xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Sparkles className="size-4 animate-pulse text-amber-100" />
          <span>점심 추천 시작하기</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
