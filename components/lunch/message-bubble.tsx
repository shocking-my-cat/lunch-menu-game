import { cn } from "@/lib/utils"
import { Mascot } from "./mascot"
import { Loader2 } from "lucide-react"

export type ChatMessage = {
  id: string
  role: "assistant" | "user"
  text: string
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 duration-300 animate-in fade-in slide-in-from-bottom-2",
        isAssistant ? "justify-start" : "justify-end",
      )}
    >
      {isAssistant && <Mascot className="h-9 w-9 shrink-0 shadow-xs" />}
      <div
        className={cn(
          "max-w-[78%] text-pretty rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm transition-all",
          isAssistant
            ? "rounded-bl-xs border border-border/60 bg-secondary/80 text-foreground"
            : "rounded-br-xs bg-primary text-primary-foreground font-medium shadow-primary/10",
        )}
      >
        {message.text}
      </div>
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className="flex items-end gap-2.5 duration-200 animate-in fade-in">
      <Mascot className="h-9 w-9 shrink-0 shadow-xs" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs border border-border/60 bg-secondary/80 px-4 py-3.5 shadow-sm">
        <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary/70" />
      </div>
    </div>
  )
}

export function RecommendingBubble() {
  return (
    <div className="flex items-end gap-2.5 duration-300 animate-in fade-in slide-in-from-bottom-2">
      <Mascot className="h-9 w-9 shrink-0 shadow-xs" />
      <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-xs bg-primary/10 border border-primary/20 px-4.5 py-3 text-[15px] font-bold text-primary shadow-xs">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>딱 맞는 점심 메뉴를 열심히 고르고 있어요! 🍽️</span>
      </div>
    </div>
  )
}
