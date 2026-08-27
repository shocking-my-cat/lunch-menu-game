"use client"

import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[760px] w-full max-w-3xl flex-col items-center justify-center gap-6 rounded-3xl border border-destructive/30 bg-card p-8 text-center shadow-2xl">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              앗! 문제가 발생했지만 걱정 마세요
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              화면 표시 중 일시적인 오류가 발생했습니다.
              <br />
              처음부터 다시 안전하게 시작할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="size-4" />
            처음부터 다시 시작하기
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
