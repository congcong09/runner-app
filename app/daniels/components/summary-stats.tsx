import { Activity, Gauge, Route, Timer } from "lucide-react"

import { StatGrid } from "@/components/stat-grid"
import { formatPace } from "@/lib/format"
import type { DanielsPlan, DanielsWeekPlan } from "../lib/daniels"

export function DanielsSummaryStats({
  plan,
  week,
}: {
  plan: DanielsPlan
  week: DanielsWeekPlan
}) {
  return (
    <StatGrid
      items={[
        {
          icon: <Gauge className="size-3.5" />,
          label: "VDOT",
          value: plan.vdot.toFixed(1),
          hint: `由最近比赛推算 · 峰值周 ${plan.peakKm} km`,
        },
        {
          icon: <Timer className="size-3.5" />,
          label: "T 配速",
          value: formatPace(plan.paces.threshold),
          unit: "/km",
          hint: `M ${formatPace(plan.paces.marathon)} · I ${formatPace(plan.paces.interval)}`,
        },
        {
          icon: <Route className="size-3.5" />,
          label: `第 ${week.week} 周跑量`,
          value: `${week.km}`,
          unit: "km",
          hint: `${week.phaseLabel} · 长距离 ${week.longKm} km`,
        },
        {
          icon: <Activity className="size-3.5" />,
          label: "质量工作占比",
          value: `${Math.round(week.qualityShare * 100)}%`,
          hint: `质量工作 ${week.qualityWorkKm.toFixed(1)} km · 目标 ≤ 10–16%`,
        },
      ]}
    />
  )
}
