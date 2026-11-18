import { Flame } from "lucide-react"

import { MethodHero } from "@/components/method-hero"
import { formatDuration, formatPace } from "@/lib/format"
import {
  HANSON_GOAL_LABEL,
  hansonPlanWeeks,
  type HansonPlan,
} from "../lib/hanson"

export function HansonHero({ plan }: { plan: HansonPlan }) {
  return (
    <MethodHero
      method="hanson"
      eyebrow="Hansons Marathon Method · 累积疲劳"
      title={
        plan.input.goal === "marathon" ? (
          <>
            不跑 30 公里，
            <br />
            也能练出马拉松后半程。
          </>
        ) : (
          <>
            不跑 30 公里，
            <br />
            也能把半马后半程练稳。
          </>
        )
      }
      description={`每周 6 天、三次 SOS：速度/力量、节奏跑与长距离。长距离封顶 ${plan.longRunCap} 公里，用周中高频训练制造累积疲劳，让比赛末段不再陌生。`}
      facts={[
        { label: "目标", value: HANSON_GOAL_LABEL[plan.input.goal] },
        { label: "计划长度", value: `${hansonPlanWeeks(plan.input.goal)} 周` },
        { label: "训练频率", value: "每周 6 天" },
        { label: "SOS", value: "速度/力量 + 节奏 + 长距离" },
        { label: "峰值跑量", value: `${plan.peakKm} km` },
        { label: "长距离上限", value: `${plan.longRunCap} km` },
      ]}
      highlight={{
        label: "目标比赛配速",
        value: formatPace(plan.paces.marathon),
        unit: "/km",
        note: `目标 ${formatDuration(plan.input.goalSeconds)} · 轻松跑 ${formatPace(plan.paces.easy.slow)}–${formatPace(plan.paces.easy.fast)}/km。`,
      }}
      icon={<Flame className="size-4" />}
    />
  )
}
