import { Badge } from "./ui/badge"
import { formatPace, type Plan } from "../lib/training"

const facts = [
  { label: "质量工作占比", value: "20–25%" },
  { label: "长距离跑", value: "轻松跑的 1.7×" },
  { label: "轻松跑心率", value: "≤ 70% 最大心率" },
  { label: "乳酸仪", value: "可选，不必需" },
]

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
    <section className="relative overflow-hidden border-b">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="from-background/20 via-background/60 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="relative mx-auto max-w-[1180px] px-4 pt-10 pb-9 lg:px-8 lg:pt-14 lg:pb-12">
        <Badge variant="outline" className="mb-5 gap-2 bg-card/70 py-1 pr-3 pl-2 backdrop-blur">
          <span className="bg-quality size-1.5 rounded-full" />
          <span className="text-muted-foreground">
            依据《Norwegian Singles》2025 版指南
          </span>
        </Badge>

        <h1 className="max-w-3xl text-[28px] leading-[1.2] font-semibold tracking-tight sm:text-4xl">
          用最近一场比赛，
          <br className="hidden sm:block" />
          排出每周三次阈下质量课。
        </h1>

        <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed">
          挪威式单次训练（Norwegian Singles）把阈值训练压缩成业余跑者能长期承受的一周：三次受控的阈下质量课，其余全部轻松。
          输入成绩与每周时间，即可得到配速区间、课表、心率护栏与负荷估算。
        </p>

        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="bg-card/70 flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 backdrop-blur sm:flex-row sm:items-baseline sm:justify-between sm:gap-2 sm:px-3.5"
            >
              <span className="text-muted-foreground text-[11px] whitespace-nowrap sm:text-xs">
                {fact.label}
              </span>
              <span className="text-[12px] font-medium tabular sm:text-[13px]">
                {fact.value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          当前阈下配速带{" "}
          <span className="text-foreground font-medium tabular">{range} /km</span>
          ，按 3–10 分钟重复组收紧或放宽。
        </p>
      </div>
    </section>
  )
}
