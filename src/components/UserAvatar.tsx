import { cn } from "@/lib/utils"
import { avatarGradient, initials } from "@/lib/ui"

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-b text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]",
        avatarGradient(name),
        className
      )}
    >
      {initials(name)}
    </span>
  )
}
