import { Gauge, TrendingUp } from "lucide-react"

import { Badge } from "./ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { formatPace, type Plan } from "../lib/training"

const PHASE_LABEL = {
  consolidate: { text: "巩固", variant: "easy" as const },
  build: { text: "提升", variant: "quality" as const },
  hold: { text: "保持/评估", variant: "muted" as const },
}

export function LoadPanel({ plan }: { plan: Plan }) {
  const qualityWork = plan.totals.qualityWorkMinutes
  const support = plan.totals.sessionMinutes - qualityWork
  const easy = plan.totals.easyMinutes + plan.totals.longMinutes
  const total = qualityWork + support + easy
  const segments = [
    { label: "质量工作", value: qualityWork, className: "bg-quality" },
    { label: "热身/恢复/冷身", value: support, className: "bg-quality/30" },
    { label: "轻松跑与长距离", value: easy, className: "bg-easy/70" },
  ]
  const avgIf =
    plan.sessions.reduce((sum, session) => sum + session.intensityFactor, 0) /
    plan.sessions.length

  return (
    <div className="space-y-4">
      <Card id="load" className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Gauge className="text-primary size-4" />
            训练负荷
          </CardTitle>
          <CardDescription className="text-xs">
            TSS ≈ 时长 × 强度系数² × 100；CTL 用 42 天加权平均，稳定周里近似等于每周 TSS。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-muted/40 rounded-lg border p-4">
              <div className="text-muted-foreground text-[11px]">周 TSS</div>
              <div className="mt-1 text-xl font-semibold tabular">
                {plan.load.weeklyTss}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                与你的跑量时间、坡度和天气相关
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg border p-4">
              <div className="text-muted-foreground text-[11px]">稳态 CTL（“体能”）</div>
              <div className="mt-1 text-xl font-semibold tabular">
                {plan.load.ctl}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                保持这一周负荷约 6 周后的水平
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg border p-4">
              <div className="text-muted-foreground text-[11px]">质量课强度系数</div>
              <div className="mt-1 text-xl font-semibold tabular">
                {avgIf.toFixed(2)}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                LT2 以 1 小时比赛配速近似（{formatPace(plan.paces.threshold)}/km）
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium">时间分布</span>
              <span className="text-muted-foreground text-[11px] tabular">
                每周 {plan.totals.plannedMinutes} 分钟
              </span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {segments.map((segment) => (
                <div
                  key={segment.label}
                  className={segment.className}
                  style={{ width: `${(segment.value / total) * 100}%` }}
                  title={`${segment.label} ${Math.round(segment.value)} 分钟`}
                />
              ))}
            </div>
            <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {segments.map((segment) => (
                <span key={segment.label} className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-sm ${segment.className}`} />
                  {segment.label}
                  <span className="text-foreground/70 tabular">
                    {Math.round(segment.value)}′
                  </span>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <TrendingUp className="text-primary size-4" />
            八周进阶节奏
          </CardTitle>
          <CardDescription className="text-xs">
            先巩固一个月，再小幅提升；每 4–8 周用比赛或计时赛重设配速。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">周次</TableHead>
                <TableHead>每周时间</TableHead>
                <TableHead>质量工作</TableHead>
                <TableHead>阶段</TableHead>
                <TableHead className="pr-5">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.progression.map((week) => (
                <TableRow key={week.label}>
                  <TableCell className="pl-5 font-medium whitespace-nowrap">
                    {week.label}
                  </TableCell>
                  <TableCell className="tabular">{week.hours} 小时</TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {week.qualityMinutes} 分钟
                  </TableCell>
                  <TableCell>
                    <Badge variant={PHASE_LABEL[week.phase].variant} className="text-[10px]">
                      {PHASE_LABEL[week.phase].text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground pr-5 text-[11px] whitespace-normal">
                    {week.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardContent className="space-y-2.5 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">负荷只是参照</span>：CTL 无法测量恢复，也不能推翻持续酸痛、睡眠差或异常吃力的轻松跑。负荷稳定时同样可能出现进步。
          </p>
          <p>
            <span className="font-medium">不同课型不等价</span>：相近的 TSS 可能有完全不同的恢复代价；更快的跑法、更长的不间断段落、陌生地形，第二天的感觉都不一样。
          </p>
          <p className="text-muted-foreground">
            跨跑者、跨算法之间的数值不可直接比较；只和你自己的趋势比。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
