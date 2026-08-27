"use client"

import { useState } from "react"
import { LunchApp } from "@/components/lunch/lunch-app"
import { LandingView } from "@/components/lunch/landing-view"
import { ErrorBoundary } from "@/components/lunch/error-boundary"
import { ArrowLeft } from "lucide-react"

export default function Page() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing")

  const handleStartApp = () => {
    setViewMode("app")
  }

  const handleBackToLanding = () => {
    setViewMode("landing")
  }

  return (
    <ErrorBoundary>
      {viewMode === "landing" ? (
        <LandingView onStart={handleStartApp} />
      ) : (
        <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-10 animate-in fade-in duration-500">
          {/* 랜딩페이지 돌아가기 버튼 */}
          <div className="mb-4 flex w-full max-w-3xl justify-between items-center">
            <button
              type="button"
              onClick={handleBackToLanding}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-muted-foreground transition hover:border-primary hover:text-primary shadow-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>랜딩페이지로 돌아가기</span>
            </button>
          </div>

          <LunchApp initialStart={true} />
        </main>
      )}
    </ErrorBoundary>
  )
}
