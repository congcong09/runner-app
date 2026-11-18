import { cn } from "@/lib/utils"

/**
 * Pacelith 品牌图形：Pace Path。
 * 图形与 logo-review/concept-1-icon.svg 保持一致；颜色由主题令牌控制，
 * 深色模式下自动切换为反白底，避免在深色页头上失去轮廓。
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect
        x="6"
        y="6"
        width="84"
        height="84"
        rx="24"
        fill="var(--brand-mark-bg)"
      />
      <path
        d="M24 70V56H40V40H56V24H74"
        fill="none"
        stroke="var(--brand-mark-fg)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="74" cy="24" r="6.5" fill="var(--brand-mark-dot)" />
    </svg>
  )
}
