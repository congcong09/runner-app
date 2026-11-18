import { ArrowRight, Timer, TrendingUp, Waves } from "lucide-react"

import { StatGrid } from "@/components/stat-grid"
import { formatPace, type Plan } from "../lib/training"

export function SummaryStats({ plan }: { plan: Plan }) {
  const share = Math.round(plan.totals.qualityShare * 100)
  const fast = Math.min(
    plan.paces.short.fast,
    plan.paces.medium.fast,
    plan.paces.long.fast,
  )
  const slow = Math.max(
    plan.paces.short.slow,
    plan.paces.medium.slow,
    plan.paces.long.slow,
  )
  const items = [
    {
      icon: Waves,
      label: "阈下配速带",
      value: `${formatPace(fast)}–${formatPace(slow)}`,
      unit: "/km",
      hint: "从慢端开始，按组时长收紧",
    },
    {
      icon: Timer,
      label: "每周质量工作",
      value: `${Math.round(plan.totals.qualityWorkMinutes)}`,
      unit: "分钟",
      hint: `占每周时间 ${share}%，目标 20–25%`,
    },
    {
      icon: ArrowRight,
      label: "最长一次轻松跑",
      value: `${plan.totals.longMinutes}`,
      unit: "分钟",
      hint: "普通轻松跑时长的 1.7 倍",
    },
    {
      icon: TrendingUp,
      label: "周训练负荷",
      value: `${plan.load.weeklyTss}`,
      unit: "TSS",
      hint: `稳态 CTL ≈ ${plan.load.ctl}`,
    },
  ]

  return (
    <StatGrid
      items={items.map((item) => ({
        icon: <item.icon className="size-3.5" />,
        label: item.label,
        value: item.value,
        unit: item.unit,
        hint: item.hint,
      }))}
    />
  )
}
