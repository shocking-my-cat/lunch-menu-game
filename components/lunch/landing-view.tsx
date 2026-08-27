"use client"

import {
  Utensils,
  MessageSquare,
  Target,
  CheckCheck,
  Smartphone,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Menu as MenuIcon,
} from "lucide-react"

export function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* TopNavBar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Utensils className="size-5" />
            </div>
            <span className="font-serif text-xl font-extrabold tracking-tight text-primary">
              점심메뉴추천AI
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a
              href="#how-it-works"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Key Benefits
            </a>
            <a
              href="#preview"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Chat Preview
            </a>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="bounce-hover hidden rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-[#E67E00] md:inline-block"
          >
            Start Recommending
          </button>

          <button
            type="button"
            onClick={onStart}
            className="text-primary md:hidden"
            aria-label="메뉴 보기"
          >
            <MenuIcon className="size-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pt-28 pb-16 md:mt-6 md:flex-row md:gap-16 md:pt-32 md:pb-24">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground shadow-xs">
            <span className="text-sm">🍽️</span>
            <span>매일 반복되는 점심 고민 끝!</span>
          </div>

          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            오늘 점심 뭐 먹지?
            <br />
            <span className="text-primary">내가 딱 정해드림!</span>
          </h1>

          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground md:mx-0 sm:text-lg">
            까칠하지만 센스 있는 AI와 스무고개를 시작해보세요. 당신의 입맛을 완벽하게 저격하는 점심 메뉴를 찾아드립니다.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
            <button
              type="button"
              onClick={onStart}
              className="active-shadow bounce-hover flex items-center justify-center gap-3 rounded-2xl bg-primary px-9 py-4.5 text-lg font-extrabold text-primary-foreground shadow-xl transition-all hover:bg-[#E67E00]"
            >
              <Sparkles className="size-5 animate-pulse text-amber-100" />
              <span>시작하기</span>
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-md flex-1">
          <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl animate-pulse" />
          <img
            src="/mascot.png"
            alt="Lunch Mate AI Logo"
            className="relative h-auto w-full rounded-3xl object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </main>

      {/* Conversation Preview Section */}
      <section className="bg-secondary/40 py-20 px-6" id="preview">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              진짜 친구랑 카톡하는 기분
            </h2>
            <p className="text-sm font-medium text-muted-foreground sm:text-base">
              답답한 챗봇은 가라! 재치 넘치는 티키타카를 경험해보세요.
            </p>
          </div>

          <div className="soft-shadow relative space-y-6 overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
            {/* Chat Bubble AI */}
            <div className="flex gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                <Bot className="size-5" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-xs bg-secondary/80 p-4 border border-border/60">
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  배고프지? 나랑 스무고개 한 판 하면 메뉴 딱 두 개 골라줄게. 준비됐어? 🍽️
                </p>
              </div>
            </div>

            {/* Chat Bubble User */}
            <div className="flex gap-3.5 justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-primary p-4 text-primary-foreground shadow-xs">
                <p className="text-sm leading-relaxed font-medium">
                  빨리 골라줘, 현기증 난단 말이야. 😵‍💫
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <User className="size-5" />
              </div>
            </div>

            {/* Chat Bubble AI with choices */}
            <div className="flex gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                <Bot className="size-5" />
              </div>
              <div className="max-w-[80%] space-y-3 rounded-2xl rounded-tl-xs bg-secondary/80 p-4 border border-border/60">
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  오케이 접수. 일단 뜨끈한 국물? 아니면 든든하게 씹기?
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onStart}
                    className="rounded-full border border-primary/30 bg-card px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    뜨끈한 국물 🍲
                  </button>
                  <button
                    type="button"
                    onClick={onStart}
                    className="rounded-full border border-primary/30 bg-card px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    든든하게 씹기 🥩
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-20" id="features">
        <div className="mb-14 space-y-4 text-center">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            완벽한 점심을 위한 스무고개 시스템
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="soft-shadow flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary hover:shadow-xl">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <MessageSquare className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold text-foreground">위트 있는 대화</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              당신의 어떤 까다로운 조건이나 반박도 유연하고 재치 있게 받아칩니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="soft-shadow flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary hover:shadow-xl">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Target className="size-8" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold text-foreground">정확한 취향 저격</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              단 5번의 질문만으로 오늘 당신이 진짜 먹고 싶은 메뉴의 속마음을 꿰뚫습니다.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="soft-shadow flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary hover:shadow-xl">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <CheckCheck className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-bold text-foreground">깔끔한 결과</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              결정 장애를 막기 위해 최종 2가지 메뉴만 제안하고, 마음에 드는지 확인까지!
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide Section */}
      <section className="bg-secondary/40 py-20 px-6" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-14 text-center font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            사용 방법은 너무나 간단해요
          </h2>

          <div className="flex flex-col gap-8 md:flex-row md:items-stretch">
            {/* Step 1 */}
            <div className="soft-shadow relative flex-1 rounded-3xl border border-border bg-card p-7">
              <div className="active-shadow absolute -top-4 -left-4 flex size-10 items-center justify-center rounded-2xl bg-primary font-serif font-bold text-primary-foreground text-lg">
                1
              </div>
              <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-secondary/60">
                <img
                  src="/mascot.png"
                  alt="Step 1"
                  className="h-32 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h4 className="mb-2 font-serif text-xl font-bold text-foreground">채팅 시작하기</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                버튼을 눌러 AI와의 맛있는 수다를 시작하세요.
              </p>
            </div>

            {/* Step 2 */}
            <div className="soft-shadow relative flex-1 rounded-3xl border border-border bg-card p-7">
              <div className="active-shadow absolute -top-4 -left-4 flex size-10 items-center justify-center rounded-2xl bg-primary font-serif font-bold text-primary-foreground text-lg">
                2
              </div>
              <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-secondary/60">
                <div className="flex items-center gap-2">
                  <Bot className="size-12 text-primary animate-pulse" />
                  <span className="font-serif text-sm font-bold text-primary">스무고개 진행 중</span>
                </div>
              </div>
              <h4 className="mb-2 font-serif text-xl font-bold text-foreground">AI의 질문에 대답하기</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                솔직하게, 혹은 까칠하게 대답해도 괜찮아요. AI가 다 알아듣습니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="soft-shadow relative flex-1 rounded-3xl border border-border bg-card p-7">
              <div className="active-shadow absolute -top-4 -left-4 flex size-10 items-center justify-center rounded-2xl bg-primary font-serif font-bold text-primary-foreground text-lg">
                3
              </div>
              <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-secondary/60">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl">🍲 🥩</span>
                  <span className="font-serif text-xs font-bold text-primary">1순위 & 2순위 메뉴 추천</span>
                </div>
              </div>
              <h4 className="mb-2 font-serif text-xl font-bold text-foreground">추천 메뉴 고르기</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                엄선된 2개의 메뉴 중 하나를 골라 맛있게 점심을 즐기세요!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary/10 py-24 px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            배고픈데 뭐할래?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            더 이상 고민하느라 점심시간을 낭비하지 마세요. 지금 바로 물어보고 맛있는 식사 하세요!
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={onStart}
              className="active-shadow bounce-hover inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-xl font-extrabold text-primary-foreground shadow-2xl transition-all hover:bg-[#E67E00]"
            >
              <Utensils className="size-6" />
              <span>더 고민하지 말고 지금 물어보세요!</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="font-serif text-xl font-extrabold text-primary">점심메뉴추천AI</div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Contact Us
            </a>
          </div>
          <div className="text-xs text-muted-foreground text-center md:text-right">
            © 2026 점심메뉴추천AI. All your lunch dilemmas solved with wit.
          </div>
        </div>
      </footer>
    </div>
  )
}
