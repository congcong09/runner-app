import { Gauge } from "lucide-react"

import { MethodHero } from "@/components/method-hero"
import { formatPace } from "@/lib/format"
import type { DanielsPlan } from "../lib/daniels"

export function DanielsHero({ plan }: { plan: DanielsPlan }) {
  return (
    <MethodHero
      method="daniels"
      eyebrow="Jack Daniels · VDOT 训练体系"
      title={
        <>
          用 VDOT，
          <br />
          给每一公里明确强度。
        </>
      }
      description="输入最近一场比赛，得到 E / M / T / I / R 五类配速；再按 5 公里、10 公里、半马或全马目标，排出以 T、I、R 为核心的质量周。"
      facts={[
        { label: "体能评分", value: `VDOT ${plan.vdot.toFixed(1)}` },
        { label: "训练强度", value: "E / M / T / I / R" },
        { label: "质量课", value: "每周 1–2 次" },
        { label: "典型周期", value: `${plan.input.weeks} 周` },
        { label: "目标跑量", value: `${plan.peakKm} km 峰值` },
        { label: "长距离", value: "按周跑量比例" },
      ]}
      highlight={{
        label: "当前 T 配速",
        value: formatPace(plan.paces.threshold),
        unit: "/km",
        note: `由最近成绩推算的 VDOT ${plan.vdot.toFixed(1)}；E 配速区间 ${formatPace(plan.paces.easy.slow)}–${formatPace(plan.paces.easy.fast)}/km。`,
      }}
      icon={<Gauge className="size-4" />}
    />
  )
}
