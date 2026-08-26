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
      {isAssistant && <Mascot className="h-9 w-9 shrink-0" />}
      <div
        className={cn(
          "max-w-[78%] text-pretty rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
          isAssistant
            ? "rounded-bl-sm bg-secondary text-secondary-foreground"
            : "rounded-br-sm bg-primary text-primary-foreground",
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
      <Mascot className="h-9 w-9 shrink-0" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3.5 shadow-sm">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/70" />
      </div>
    </div>
  )
}

export function RecommendingBubble() {
  return (
    <div className="flex items-end gap-2.5 duration-300 animate-in fade-in slide-in-from-bottom-2">
      <Mascot className="h-9 w-9 shrink-0" />
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-primary/10 border border-primary/20 px-4 py-3 text-[15px] font-medium text-primary shadow-sm">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>메뉴 추천 중... 취향에 딱 맞는 메뉴를 고르고 있어요!</span>
      </div>
    </div>
  )
}
