import { Waves } from "lucide-react"

import { MethodHero } from "@/components/method-hero"
import { formatPace, type Plan } from "../lib/training"

export function Hero({ plan }: { plan: Plan }) {
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
  const range = `${formatPace(fast)} – ${formatPace(slow)}`

  return (
    <MethodHero
      method="norwegian-singles"
      eyebrow="Norwegian Singles · 阈下训练"
      title={
        <>
          用最近一场比赛，
          <br className="hidden sm:block" />
          排出每周三次阈下质量课。
        </>
      }
      description="挪威式单次训练把阈值训练压缩成业余跑者能长期承受的一周：三次受控的阈下质量课，其余全部轻松。输入成绩与每周时间，即可得到配速区间、课表、心率护栏与负荷估算。"
      facts={[
        { label: "质量工作占比", value: "20–25%" },
        { label: "长距离跑", value: "轻松跑的 1.7×" },
        { label: "轻松跑心率", value: "≤ 70% 最大心率" },
        { label: "乳酸仪", value: "可选，不必需" },
        { label: "每周质量课", value: "2–3 次" },
        { label: "核心强度", value: "LT2 以下" },
      ]}
      highlight={{
        label: "当前阈下配速带",
        value: range,
        unit: "/km",
        note: "按 3–10 分钟重复组收紧或放宽。数据仅保存在本机浏览器。",
      }}
      icon={<Waves className="size-4" />}
    />
  )
}
