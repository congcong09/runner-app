import { Flame, Gauge, Mountain, Timer } from "lucide-react"

import { StatGrid } from "@/components/stat-grid"
import { formatDuration, formatPace } from "@/lib/format"
import type { HansonPlan, HansonWeekPlan } from "../lib/hanson"

export function HansonSummaryStats({
  plan,
  week,
}: {
  plan: HansonPlan
  week: HansonWeekPlan
}) {
  return (
    <StatGrid
      items={[
        {
          icon: <Timer className="size-3.5" />,
          label: "目标成绩",
          value: formatDuration(plan.input.goalSeconds),
          hint: `${plan.distanceLabel} · 目标配速 ${formatPace(plan.paces.marathon)}/km`,
        },
        {
          icon: <Gauge className="size-3.5" />,
          label: `第 ${week.week} 周跑量`,
          value: `${week.km}`,
          unit: "km",
          hint: `${week.phaseLabel} · 峰值 ${plan.peakKm} km`,
        },
        {
          icon: <Flame className="size-3.5" />,
          label: "SOS 课",
          value: "3",
          unit: "次/周",
          hint: "速度/力量 · 节奏 · 长距离",
        },
        {
          icon: <Mountain className="size-3.5" />,
          label: "本周最长",
          value: `${week.longKm}`,
          unit: "km",
          hint: `长距离封顶 ${plan.longRunCap} km · 累积疲劳`,
        },
      ]}
    />
  )
}
