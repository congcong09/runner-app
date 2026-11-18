import { AlertTriangle, Flame, Mountain, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMinutes, formatPace } from "@/lib/format"
import {
  type HansonDay,
  type HansonPlan,
  type HansonWeekPlan,
  type HansonWorkout,
} from "../lib/hanson"
import { cn } from "@/lib/utils"

const kindStyle: Record<
  HansonDay["kind"],
  { wrap: string; dot: string; label: string }
> = {
  speed: {
    wrap: "border-quality/30 bg-quality/[0.045]",
    dot: "bg-quality",
    label: "速度",
  },
  strength: {
    wrap: "border-long/30 bg-long/[0.05]",
    dot: "bg-long",
    label: "力量",
  },
  tempo: {
    wrap: "border-quality/30 bg-quality/[0.045]",
    dot: "bg-quality",
    label: "节奏",
  },
  long: {
    wrap: "border-long/30 bg-long/[0.05]",
    dot: "bg-long",
    label: "长距离",
  },
  easy: {
    wrap: "border-easy/25 bg-easy/[0.05]",
    dot: "bg-easy",
    label: "轻松",
  },
  rest: {
    wrap: "border-dashed bg-muted/40",
    dot: "bg-muted-foreground/40",
    label: "休息",
  },
}

function DayTile({ day }: { day: HansonDay }) {
  const style = kindStyle[day.kind]
  return (
    <div
      data-kind={day.kind}
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border px-3 py-3",
        style.wrap,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[11px]">{day.day}</span>
        <span className={cn("size-1.5 rounded-full", style.dot)} />
      </div>
      <div className="tabular text-[17px] leading-none font-semibold tracking-tight">
        {day.kind === "rest" ? "休息" : `${day.minutes}′`}
      </div>
      <div className="text-muted-foreground line-clamp-2 text-[11px] leading-snug">
        {day.workout?.title ?? day.detail}
      </div>
      {day.kind !== "rest" && (
        <div className="text-muted-foreground/80 tabular text-[10px]">
          {day.km.toFixed(1)} km
        </div>
      )}
    </div>
  )
}

const TYPE_VARIANT: Record<
  HansonWorkout["type"],
  "quality" | "long" | "easy"
> = {
  speed: "quality",
  strength: "long",
  tempo: "quality",
  long: "long",
}

function WorkoutCard({ workout }: { workout: HansonWorkout }) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={TYPE_VARIANT[workout.type]} className="text-[10px]">
              {workout.label}
            </Badge>
            <span className="text-sm font-medium">{workout.title}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
            {workout.purpose}
          </p>
        </div>
        <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap tabular">
          {formatMinutes(workout.totalSeconds / 60)}
        </span>
      </div>

      <div className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
        {workout.detail}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[12px]">
        <div>
          <dt className="text-muted-foreground text-[10px]">配速</dt>
          <dd className="tabular font-medium">
            {workout.paceRange
              ? `${formatPace(workout.paceRange.slow)}–${formatPace(workout.paceRange.fast)}`
              : formatPace(workout.pace)}{" "}
            /km
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">质量工作</dt>
          <dd className="tabular font-medium">
            {workout.workKm.toFixed(1)} km
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">整节含热身</dt>
          <dd className="tabular font-medium">
            {workout.totalKm.toFixed(1)} km
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">
            {workout.recoverySeconds ? "组间恢复" : "结构"}
          </dt>
          <dd className="tabular font-medium">
            {workout.recoverySeconds
              ? `${workout.recoverySeconds} 秒`
              : workout.reps
                ? `${workout.reps} 组`
                : "连续"}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function VolumeBar({ week }: { week: HansonWeekPlan }) {
  const sos = week.tuesday.totalKm + week.tempo.totalKm + week.long.totalKm
  const total = sos + week.easyKm
  const segments = [
    { label: "SOS 课", value: sos, className: "bg-quality" },
    { label: "轻松跑", value: week.easyKm, className: "bg-easy/70" },
  ]
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium">本周跑量构成</span>
        <span className="text-muted-foreground tabular text-[11px]">
          目标 {week.km} km · 排入 {total.toFixed(0)} km
        </span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.className}
            style={{ width: `${(segment.value / Math.max(total, 1)) * 100}%` }}
            title={`${segment.label} ${segment.value.toFixed(1)} km`}
          />
        ))}
      </div>
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        {segments.map((segment) => (
          <span key={segment.label} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-sm ${segment.className}`} />
            {segment.label}
            <span className="text-foreground/70 tabular">
              {segment.value.toFixed(1)} km
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function HansonWeekPlan({
  plan,
  week,
  onSelectWeek,
}: {
  plan: HansonPlan
  week: HansonWeekPlan
  onSelectWeek: (week: number) => void
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          第 {week.week} 周 · {week.km} 公里
          <Badge variant="quality" className="text-[10px]">
            {week.phaseLabel}
          </Badge>
          {week.isCutback && (
            <Badge variant="muted" className="text-[10px]">
              减量周
            </Badge>
          )}
          {week.week === plan.weeks.length && (
            <Badge variant="long" className="text-[10px]">
              比赛周
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {week.focus} ·{" "}
          {week.week === plan.weeks.length
            ? `${week.longKm} km 激活（比赛日替换）`
            : `长距离 ${week.longKm} km（封顶 ${plan.longRunCap} km）`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap gap-1">
          {plan.weeks.map((item) => (
            <Button
              key={item.week}
              type="button"
              size="sm"
              variant={item.week === week.week ? "default" : "outline"}
              onClick={() => onSelectWeek(item.week)}
              className="h-7 px-2 text-[11px] tabular"
              aria-pressed={item.week === week.week}
            >
              {item.week}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {week.days.map((day) => (
            <DayTile key={day.day} day={day} />
          ))}
        </div>

        <VolumeBar week={week} />

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium">SOS 课细节</h3>
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Timer className="size-3" />
              周二 / 周四 / 周日
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <WorkoutCard workout={week.tuesday} />
            <WorkoutCard workout={week.tempo} />
            <WorkoutCard workout={week.long} />
          </div>
        </div>

        <div className="bg-muted/40 text-muted-foreground rounded-lg border px-3 py-3 text-[12px] leading-relaxed">
          {week.note}
        </div>

        <div className="text-muted-foreground flex gap-2 rounded-md border px-3 py-2 text-[11px] leading-relaxed">
          <Mountain className="mt-0.5 size-3.5 shrink-0" />
          <span>
            汉森的“累积疲劳”不是让你每次都跑崩，而是让轻松日真的轻松、SOS
            日保持目标强度。长距离封顶 {plan.longRunCap} 公里，三次 SOS 之间必须留出恢复跑。
          </span>
        </div>

        {week.km > plan.input.weeklyKm * 1.45 && (
          <div className="text-warn bg-warn/10 flex gap-2 rounded-md px-3 py-2 text-[11px] leading-relaxed">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              本周跑量已明显高于当前水平。若这是计划前几周，建议先把基础期拉长，或把峰值下调。
            </span>
          </div>
        )}

        <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
          <Flame className="size-3.5" />
          计划峰值 {plan.peakKm} km · 当前输入 {plan.input.weeklyKm} km
        </div>
      </CardContent>
    </Card>
  )
}
