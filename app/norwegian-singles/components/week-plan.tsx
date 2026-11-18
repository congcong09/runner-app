import { AlertTriangle, Check, Copy, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatMinutes,
  formatPace,
  formatRepLength,
  type DayKind,
  type DayPlan,
  type Plan,
  type QualitySession,
} from "../lib/training"
import { cn } from "@/lib/utils"

const kindStyle: Record<
  DayKind,
  { wrap: string; dot: string; label: string; badge: "quality" | "easy" | "long" | "muted" }
> = {
  quality: {
    wrap: "border-quality/30 bg-quality/[0.045]",
    dot: "bg-quality",
    label: "质量",
    badge: "quality",
  },
  easy: {
    wrap: "border-easy/25 bg-easy/[0.05]",
    dot: "bg-easy",
    label: "轻松",
    badge: "easy",
  },
  long: {
    wrap: "border-long/30 bg-long/[0.05]",
    dot: "bg-long",
    label: "长距离",
    badge: "long",
  },
  rest: {
    wrap: "border-dashed bg-muted/40",
    dot: "bg-muted-foreground/40",
    label: "休息",
    badge: "muted",
  },
}

function DayTile({ day }: { day: DayPlan }) {
  const style = kindStyle[day.kind]
  return (
    <div
      data-kind={day.kind}
      className={cn("flex flex-col gap-2 rounded-lg border px-3 py-3", style.wrap)}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[11px]">{day.day}</span>
        <span className={cn("size-1.5 rounded-full", style.dot)} />
      </div>
      <div className="tabular text-[17px] leading-none font-semibold tracking-tight">
        {day.kind === "rest" ? "休息" : `${day.minutes}′`}
      </div>
      <div className="text-muted-foreground line-clamp-2 text-[11px] leading-snug">
        {day.kind === "quality" ? day.session?.title : day.detail}
      </div>
    </div>
  )
}

function SessionCard({ session }: { session: QualitySession }) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="quality">质量</Badge>
            <span className="text-sm font-medium">{session.title}</span>
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">{session.purpose}</p>
        </div>
        <span className="text-muted-foreground text-xs whitespace-nowrap tabular">
          {formatMinutes(session.totalSeconds / 60)}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[12px]">
        <div>
          <dt className="text-muted-foreground text-[10px]">结构</dt>
          <dd className="tabular font-medium">
            {session.reps} × {formatRepLength(session.repSeconds)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">恢复</dt>
          <dd className="tabular font-medium">
            {session.recoverySeconds} 秒 · 站立/走
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">起始配速</dt>
          <dd className="tabular font-medium">
            {formatPace(session.startPace)} /km
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10px]">参考区间</dt>
          <dd className="tabular font-medium">
            {formatPace(session.pace.fast)}–{formatPace(session.pace.slow)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function QualityShareBar({ plan }: { plan: Plan }) {
  const pct = plan.totals.qualityShare * 100
  const scaleMax = 40
  const inRange = pct >= 19 && pct <= 26
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-muted-foreground text-[11px]">质量工作占比</span>
        <span className="text-sm font-semibold tabular">{pct.toFixed(0)}%</span>
      </div>
      <div className="relative mt-4 h-2 w-full rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 rounded-sm bg-emerald-500/20"
          style={{ left: `${(20 / scaleMax) * 100}%`, width: `${(5 / scaleMax) * 100}%` }}
        />
        <div
          className="bg-quality absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${Math.min((pct / scaleMax) * 100, 100)}%` }}
        />
        <div
          className="bg-foreground absolute -top-1 size-2 -translate-x-1/2 rounded-full"
          style={{ left: `${Math.min((pct / scaleMax) * 100, 100)}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-2 flex justify-between text-[10px]">
        <span>0%</span>
        <span>目标带 20–25%</span>
        <span>40%</span>
      </div>
      <Badge
        variant={inRange ? "easy" : "muted"}
        className={cn("mt-3 text-[10px]", !inRange && "text-warn bg-warn/10")}
      >
        {inRange ? "在指南区间内" : "偏离 20–25%，建议微调组数"}
      </Badge>
    </div>
  )
}

export function WeekPlan({
  plan,
  onCopy,
  onDownload,
  copied,
}: {
  plan: Plan
  onCopy: () => void
  onDownload: () => void
  copied: boolean
}) {
  const easyTotal = plan.totals.easyMinutes
  const perDay =
    plan.days.filter((day) => day.kind === "easy").length > 0
      ? Math.round(easyTotal / plan.days.filter((day) => day.kind === "easy").length)
      : 0

  return (
    <Card id="week" className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-[15px]">示例一周</CardTitle>
        <CardDescription className="text-xs">
          每周 {plan.input.weeklyHours} 小时 · {plan.input.daysPerWeek} 天 ·{" "}
          {plan.sessions.length} 次质量课
        </CardDescription>
        <CardAction className="flex gap-1.5 max-sm:col-start-1 max-sm:row-span-1 max-sm:row-start-3 max-sm:mt-1 max-sm:justify-self-start">
          <Button variant="outline" size="sm" onClick={onCopy} className="text-xs">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "已复制" : "复制计划"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDownload} className="text-xs">
            <Download className="size-3.5" />
            Markdown
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6 px-5 py-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {plan.days.map((day) => (
            <DayTile key={day.day} day={day} />
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-muted/40 rounded-lg border p-3 sm:p-4">
              <div className="text-muted-foreground text-[10px] sm:text-[11px]">
                每周总时长
              </div>
              <div className="mt-1.5 text-[15px] font-semibold tabular sm:text-lg">
                {formatMinutes(plan.totals.plannedMinutes)}
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg border p-3 sm:p-4">
              <div className="text-muted-foreground text-[10px] sm:text-[11px]">
                质量工作
              </div>
              <div className="mt-1.5 text-[15px] font-semibold tabular sm:text-lg">
                {Math.round(plan.totals.qualityWorkMinutes)} 分钟
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg border p-3 sm:p-4">
              <div className="text-muted-foreground text-[10px] sm:text-[11px]">
                轻松跑
              </div>
              <div className="mt-1.5 text-[15px] font-semibold tabular sm:text-lg">
                {perDay} 分钟/次
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <QualityShareBar plan={plan} />
            {plan.totals.doubleMinutes > 0 && (
              <div className="bg-muted/40 text-muted-foreground rounded-lg border px-3 py-2 text-[11px] leading-relaxed">
                单次上限之外还有约{" "}
                <span className="text-foreground font-medium tabular">
                  {plan.totals.doubleMinutes} 分钟
                </span>
                ：建议用 1–2 次轻松双跑（每次 20–40 分钟）补足，而不是拉长某一次跑。
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium">质量课细节</h3>
            <span className="text-muted-foreground text-[11px]">
              热身 10 分钟 + 冷身 8–10 分钟
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {plan.sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>

        {plan.warnings.length > 0 && (
          <div className="space-y-2">
            {plan.warnings.map((warning) => (
              <div
                key={warning}
                className="text-warn bg-warn/10 flex gap-2 rounded-md px-3 py-2 text-[11px] leading-relaxed"
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-[11px] leading-relaxed">
          这些是课次位置，不是要求你马上跑满 {plan.input.daysPerWeek} 天。开始时保留原有休息日；若刚接触结构化强度，先把第三次质量课降为轻松跑或休息。漏掉一次训练就按原计划继续，不要塞进后面的轻松日。
        </p>
      </CardContent>
    </Card>
  )
}
