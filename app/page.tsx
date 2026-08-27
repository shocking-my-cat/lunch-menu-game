import { LunchApp } from "@/components/lunch/lunch-app"
import { ErrorBoundary } from "@/components/lunch/error-boundary"

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <ErrorBoundary>
        <LunchApp />
      </ErrorBoundary>
    </main>
  )
}
