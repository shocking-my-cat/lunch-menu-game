import { cn } from "@/lib/utils"

export function Mascot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border",
        className,
      )}
    >
      {/* 데코성 마스코트 이미지 */}
      <img
        src="/mascot.png"
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
