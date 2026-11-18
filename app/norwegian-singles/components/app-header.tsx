import { Button } from "./ui/button"

export type TabValue = "week" | "paces" | "hr" | "load" | "method"

function FlagMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0b2545" />
      <rect x="11" y="0" width="6" height="32" fill="#fff" />
      <rect x="0" y="13" width="32" height="6" fill="#fff" />
      <rect x="12.5" y="0" width="3" height="32" fill="#ba0c2f" />
      <rect x="0" y="14.5" width="32" height="3" fill="#ba0c2f" />
    </svg>
  )
}

const navLinks: { value: TabValue; label: string }[] = [
  { value: "week", label: "周计划" },
  { value: "paces", label: "配速" },
  { value: "load", label: "负荷" },
]

export function AppHeader({
  onNavigate,
}: {
  onNavigate: (tab: TabValue) => void
}) {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-4 lg:px-8">
        <FlagMark className="size-7 shrink-0" />
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">
            Norwegian Singles
          </div>
          <div className="text-muted-foreground text-[11px]">
            阈下训练计划计算器
          </div>
        </div>
        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Button
              key={link.value}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(link.value)}
            >
              {link.label}
            </Button>
          ))}
        </nav>
        <Button variant="outline" size="sm" className="ml-auto sm:ml-2" asChild>
          <a href="https://norwegiansingles.run" target="_blank" rel="noreferrer">
            原指南 <span aria-hidden="true">↗</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
