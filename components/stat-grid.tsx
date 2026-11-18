import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: ReactNode
  unit?: string
  hint?: ReactNode
  icon?: ReactNode
}

export function StatGrid({
  items,
  className,
}: {
  items: StatItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          data-testid="stat"
          className="bg-card rounded-xl border p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            {item.icon && (
              <span
                className="inline-flex"
                style={{ color: "var(--method-accent)" }}
              >
                {item.icon}
              </span>
            )}
            {item.label}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="tabular text-2xl leading-none font-semibold tracking-tight">
              {item.value}
            </span>
            {item.unit && (
              <span className="text-muted-foreground text-xs">{item.unit}</span>
            )}
          </div>
          {item.hint && (
            <div className="text-muted-foreground mt-1.5 text-[11px] leading-relaxed">
              {item.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
