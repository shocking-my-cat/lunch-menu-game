import { cn } from "@/lib/utils"
import { Mascot } from "./mascot"

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
      {isAssistant && <Mascot className="h-9 w-9" />}
      <div
        className={cn(
          "max-w-[78%] text-pretty rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
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
    <div className="flex items-end gap-2.5">
      <Mascot className="h-9 w-9" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3.5">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  )
}
