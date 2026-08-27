"use client"

import { Sparkles, ArrowRight, Bot, Utensils, Zap, CloudSun, ShieldCheck, Heart, Star } from "lucide-react"

export function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 배경 장식 히어로 글로우 */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-5xl -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/15 via-secondary/30 to-transparent blur-3xl" />

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
              <Utensils className="size-5" />
            </div>
            <span className="font-serif text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              내가 점심 메뉴 추천해줌
            </span>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="group flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none"
          >
            <span>서비스 시작</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 pt-12 pb-16 text-center sm:pt-20 sm:pb-24">
        {/* 상단 뱃지 */}
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-xs backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Bot className="size-4 text-primary animate-bounce" />
          <span>Lunch Mate AI · 1초 점심 고민 해결사</span>
        </span>

        {/* 메인 타이틀 */}
        <h1 className="mt-6 text-balance font-serif text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          오늘 점심 뭐 먹지?
          <br />
          <span className="bg-gradient-to-r from-primary via-[#FF8C00] to-[#D2691E] bg-clip-text text-transparent">
            AI 친구가 골라줄게!
          </span>
        </h1>

        {/* 메인 설명 문구 */}
        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg animate-in fade-in slide-in-from-bottom-5 duration-900">
          딱 5번의 친근한 대화로 내 입맛, 상황, 예산, 실시간 날씨까지 분석해
          <br className="hidden sm:inline" />
          가장 완벽한 **1순위 메뉴**와 **2순위 찰떡 대안**을 추천해드려요 🍽️
        </p>

        {/* 대형 CTA 버튼 */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <button
            type="button"
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 hover:bg-[#E67E00] hover:shadow-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sparkles className="size-5 animate-pulse text-amber-100" />
            <span>AI 추천 서비스 시작하기</span>
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* 마스코트 일러스트레이션 카드 */}
        <div className="relative mt-14 flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          <div className="relative flex items-center justify-center rounded-3xl border border-primary/20 bg-card/80 p-8 shadow-2xl backdrop-blur-md">
            <img
              src="/mascot.png"
              alt="Lunch Mate AI 마스코트"
              className="h-44 w-44 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute -right-4 -top-4 rounded-2xl border border-primary/20 bg-card p-3 shadow-lg backdrop-blur-sm animate-bounce">
              <span className="text-xs font-bold text-primary">✨ 결정장애 100% 해소!</span>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border bg-card p-3 shadow-lg backdrop-blur-sm">
              <span className="text-xs font-bold text-foreground">🌧️ 비 오는 날 가중치 반영</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (핵심 기능 3가지) */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            왜 <span className="text-primary">내가 점심 메뉴 추천해줌</span>인가요?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            딱딱한 챗봇이 아닌 위트 넘치는 AI 친구와의 스무고개 렌더링
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Feature 1 */}
          <div className="group flex flex-col items-start gap-4 rounded-3xl border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Bot className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">AI 지능형 대화 스무고개</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              고정된 질문은 그만! 이전 답변 문맥을 이해해 실시간으로 질문과 선택지 칩을 생성합니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group flex flex-col items-start gap-4 rounded-3xl border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Zap className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">1순위 & 2순위 맞춤 추천</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              최고의 1순위 메뉴뿐만 아니라 질리지 않도록 찰떡같은 2순위 대안과 공감 사유를 주입해드려요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group flex flex-col items-start gap-4 rounded-3xl border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <CloudSun className="size-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">실시간 날씨 자동 가중치</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              비 오는 날엔 따뜻한 국물 요리, 무더운 날엔 시원한 요리가 자동 보정되어 최상의 만족도를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-border/50">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            이용 방법은 매우 간단해요!
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-secondary/40 border border-border/40">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary font-serif font-bold text-primary-foreground">1</span>
            <h4 className="font-bold text-foreground text-lg">질문에 답하기</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">칩을 누르거나 자유롭게 "떡볶이 먹고 싶어"라고 직접 말해도 돼요!</p>
          </div>

          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-secondary/40 border border-border/40">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary font-serif font-bold text-primary-foreground">2</span>
            <h4 className="font-bold text-foreground text-lg">Gemini AI의 분석</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">5턴 내에 입맛, 맵기, 가격, 날씨 정보를 종합하여 24종 메뉴 중 선별</p>
          </div>

          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-secondary/40 border border-border/40">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary font-serif font-bold text-primary-foreground">3</span>
            <h4 className="font-bold text-foreground text-lg">메뉴 확정 & 축하</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">마음에 드는 메뉴를 선택하면 신나는 폭죽 연출과 함께 점심 해결!</p>
          </div>
        </div>
      </section>

      {/* Social Proof / User Review Section */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-border/50">
        <div className="text-center">
          <div className="flex justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-foreground sm:text-4xl">
            이미 많은 분들이 점심 고민을 해결하고 있어요!
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <p className="text-sm italic text-foreground leading-relaxed">
              "매일 12시만 되면 직장 동료들이랑 '뭐 먹지?' 하고 30분씩 고민했었는데, Lunch Mate AI 덕분에 10초 만에 부대찌개로 확정하고 맛점했습니다!"
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">김</span>
              <div>
                <p className="text-xs font-bold text-foreground">김민우 님</p>
                <p className="text-[11px] text-muted-foreground">강남역 스타트업 마케터</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <p className="text-sm italic text-foreground leading-relaxed">
              "비 오는 날 혼밥 메뉴 고민이었는데 '따뜻한 라멘'을 딱 맞춰주더라구요! 추천 사유도 위트 넘쳐서 재미있습니다."
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">이</span>
              <div>
                <p className="text-xs font-bold text-foreground">이수진 님</p>
                <p className="text-[11px] text-muted-foreground">판교 IT 개발자</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-primary via-[#FF8C00] to-[#D2691E] p-10 text-center text-primary-foreground shadow-2xl sm:p-14">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-serif text-3xl font-extrabold sm:text-4xl">
              오늘 점심 고민, 지금 바로 끝내볼까요? 🍽️
            </h2>
            <p className="max-w-xl text-sm font-medium opacity-90 sm:text-base">
              회원가입 필요 없이 100% 무료로 AI 점심 요정의 추천을 경험해보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-3 rounded-full bg-background px-9 py-4 text-base font-bold text-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:bg-card focus-visible:outline-none"
          >
            <Sparkles className="size-5 text-primary animate-pulse" />
            <span className="text-primary font-extrabold">지금 점심 메뉴 추천받기</span>
            <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-border/50 bg-card/60 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 내가 점심 메뉴 추천해줌 (Lunch Mate AI). All rights reserved.</p>
          <p>Powered by Google Gemini 2.5 Flash & Next.js</p>
        </div>
      </footer>
    </div>
  )
}
