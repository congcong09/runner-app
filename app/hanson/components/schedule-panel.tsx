import { ArrowUpRight, Flame, TrendingUp } from "lucide-react"

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
  HANSON_PHASE_LABEL,
  phaseBadgeVariant,
  type HansonPlan,
} from "../lib/hanson"

export function HansonSchedulePanel({
  plan,
  onSelectWeek,
}: {
  plan: HansonPlan
  onSelectWeek: (week: number) => void
}) {
  const phases = (["base", "build", "peak", "taper"] as const).map(
    (phase) => {
      const weeks = plan.weeks.filter((week) => week.phase === phase)
      return {
        phase,
        label: HANSON_PHASE_LABEL[phase],
        range:
          weeks.length > 0
            ? `第 ${weeks[0].week}–${weeks[weeks.length - 1].week} 周`
            : "—",
        km:
          weeks.length > 0
            ? `${Math.min(...weeks.map((week) => week.km))}–${Math.max(...weeks.map((week) => week.km))} km`
            : "—",
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
            {plan.weeks.length} 周汉森计划
          </CardTitle>
          <CardDescription className="text-xs">
            6 天/周、3 次 SOS。周二在速度与力量之间交替，周四节奏，周日长距离。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">周</TableHead>
                <TableHead>阶段</TableHead>
                <TableHead>跑量</TableHead>
                <TableHead>周二</TableHead>
                <TableHead>周四</TableHead>
                <TableHead>周日</TableHead>
                <TableHead className="pr-5 text-right">课表</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.weeks.map((week) => (
                <TableRow key={week.week}>
                  <TableCell className="pl-5 font-medium tabular">
                    {week.week}
                    {week.isCutback && (
                      <span className="text-muted-foreground ml-1 text-[10px]">
                        减
                      </span>
                    )}
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
                  <TableCell className="max-w-44 text-[11px] whitespace-normal">
                    {week.tuesday.title}
                  </TableCell>
                  <TableCell className="max-w-40 text-[11px] whitespace-normal">
                    {week.tempo.title}
                  </TableCell>
                  <TableCell className="max-w-48 text-[11px] whitespace-normal">
                    {week.long.title}
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase) => (
          <div key={phase.phase} className="bg-card rounded-xl border p-4">
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
          </div>
        ))}
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Flame
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            执行要点
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">轻松日不是“休息日”</span>
            ：汉森的累积疲劳靠 6 天频率建立，但周三、周五、周六必须真的轻松；否则三次 SOS 会一起崩。
          </p>
          <p>
            <span className="font-medium">长距离封顶</span>
            ：最长 26 公里（全马）是有意为之。多出来的训练量放在周中的节奏与力量跑，而不是把周日拉成 32 公里。
          </p>
          <p>
            <span className="font-medium">目标配速是双刃剑</span>
            ：如果目标成绩明显超出当前能力，所有训练都会偏快。宁可选一个保守 5 分钟的目标。
          </p>
          <p className="text-muted-foreground">
            半马版按 12 周、长距离封顶 18 公里排；它不是全马计划的简单缩短版，速度课比例会更高。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
