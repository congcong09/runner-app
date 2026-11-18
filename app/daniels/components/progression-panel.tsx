import { ArrowUpRight, CalendarRange, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DANIELS_PHASE_LABEL,
  phaseBadgeVariant,
  type DanielsPlan,
} from "../lib/daniels"

export function DanielsProgressionPanel({
  plan,
  onSelectWeek,
}: {
  plan: DanielsPlan
  onSelectWeek: (week: number) => void
}) {
  const phases = (["base", "build", "peak", "taper"] as const).map(
    (phase) => {
      const weeks = plan.weeks.filter((week) => week.phase === phase)
      return {
        phase,
        label: DANIELS_PHASE_LABEL[phase],
        range:
          weeks.length > 0
            ? `第 ${weeks[0].week}–${weeks[weeks.length - 1].week} 周`
            : "—",
        km:
          weeks.length > 0
            ? `${Math.min(...weeks.map((week) => week.km))}–${Math.max(...weeks.map((week) => week.km))} km`
            : "—",
        note:
          phase === "base"
            ? "建立 E 跑量，T 巡航只做小剂量"
            : phase === "build"
              ? "质量课转向目标专项，逐步加量"
              : phase === "peak"
                ? "最高跑量与比赛配速，随后开始减量"
                : "减量 20–35%，保留比赛配速触感",
      }
    },
  )

  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <TrendingUp
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            {plan.weeks.length} 周进阶节奏
          </CardTitle>
          <CardDescription className="text-xs">
            从当前周跑量起步，每 4 周减量一次，最后两周 taper。计划长度改变时曲线会重排。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">周</TableHead>
                <TableHead>阶段</TableHead>
                <TableHead>跑量</TableHead>
                <TableHead>长距离</TableHead>
                <TableHead>质量工作</TableHead>
                <TableHead>安排</TableHead>
                <TableHead className="pr-5 text-right">课表</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.weeks.map((week) => (
                <TableRow key={week.week}>
                  <TableCell className="pl-5 font-medium tabular">
                    {week.week}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={phaseBadgeVariant(week.phase)}
                      className="text-[10px]"
                    >
                      {week.phaseLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular w-12 text-sm font-medium">
                        {week.km} km
                      </span>
                      <span className="bg-secondary relative h-1.5 w-20 overflow-hidden rounded-full">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            width: `${Math.min(
                              (week.km / Math.max(plan.peakKm, 1)) * 100,
                              100,
                            )}%`,
                            backgroundColor: "var(--method-accent)",
                          }}
                        />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {week.longKm} km
                  </TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {week.qualityWorkKm.toFixed(1)} km
                  </TableCell>
                  <TableCell className="max-w-52 text-[11px] whitespace-normal">
                    {week.focus}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px]"
                      onClick={() => onSelectWeek(week.week)}
                    >
                      查看
                      <ArrowUpRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <CalendarRange
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            四个阶段
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 px-5 py-5 sm:grid-cols-2">
          {phases.map((phase) => (
            <div key={phase.phase} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{phase.label}</span>
                <Badge
                  variant={phaseBadgeVariant(phase.phase)}
                  className="text-[10px]"
                >
                  {phase.range}
                </Badge>
              </div>
              <div className="text-muted-foreground mt-1.5 text-[11px] tabular">
                {phase.km}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                {phase.note}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardContent className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">为什么有减量周</span>
            ：训练刺激在恢复时才变成适应。每 4
            周把跑量降下来，是为了让后面的质量课仍然跑得动。
          </p>
          <p>
            <span className="font-medium">漏掉一次训练怎么办</span>
            ：按原计划继续，不要把错过的跑量塞进后面的轻松日；连续两周状态差时，先回到上一周的跑量。
          </p>
          <p className="text-muted-foreground">
            这里的跑量曲线是通用的渐进模板，不是 individualized
            教练计划。比赛日、旅行和伤病需要单独调整。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
