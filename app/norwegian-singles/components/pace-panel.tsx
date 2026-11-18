import { Badge } from "@/components/ui/badge"
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
  DISTANCE_LABELS,
  EQUIVALENT_DISTANCES,
  REP_PRESETS,
  formatDuration,
  formatPace,
  formatPacePer,
  riegelTime,
  type Plan,
  type SessionId,
} from "../lib/training"

const REP_LABEL: Record<SessionId, { title: string; note: string }> = {
  short: { title: "3 分钟组", note: "12–15 公里配速" },
  medium: { title: "6 分钟组", note: "20 公里 / 半马配速" },
  long: { title: "10 分钟组", note: "25–30 公里配速" },
}

export function PacePanel({ plan }: { plan: Plan }) {
  const order: SessionId[] = ["short", "medium", "long"]
  const rows = order.map((id) => ({
    id,
    pace: plan.paces[id],
    preset: REP_PRESETS[id],
    scheduled: plan.sessions.some((session) => session.id === id),
  }))

  return (
    <div className="space-y-4">
      <Card id="paces" className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-[15px]">阈下配速区间</CardTitle>
          <CardDescription className="text-xs">
            由最近成绩换算；每组都从较慢的一端开始，前几组保守。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">重复组</TableHead>
                <TableHead>起始配速 /km</TableHead>
                <TableHead>参考区间 /km</TableHead>
                <TableHead>每 400 米</TableHead>
                <TableHead>恢复</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{REP_LABEL[row.id].title}</span>
                      {!row.scheduled && (
                        <Badge variant="muted" className="text-[10px]">
                          本周未安排
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                      {REP_LABEL[row.id].note}
                    </div>
                  </TableCell>
                  <TableCell className="tabular font-semibold">
                    {formatPace(row.pace.slow)}
                  </TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {formatPace(row.pace.fast)}–{formatPace(row.pace.slow)}
                  </TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {formatPacePer(row.pace.slow, 400)}
                  </TableCell>
                  <TableCell className="tabular">
                    {row.preset.recoverySeconds} 秒
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-[15px]">等效比赛成绩</CardTitle>
          <CardDescription className="text-xs">
            Riegel（1.06）换算，仅用于设定起始目标；以最近一场比赛替代预测更可靠。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">距离</TableHead>
                <TableHead>等效成绩</TableHead>
                <TableHead>配速 /km</TableHead>
                <TableHead className="pr-5 text-right">相对 LT2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EQUIVALENT_DISTANCES.map((distance) => {
                const time = riegelTime(plan.input.race, distance)
                const pace = time / (distance / 1000)
                const ratio = plan.paces.threshold / pace
                return (
                  <TableRow key={distance}>
                    <TableCell className="pl-5 font-medium">
                      {DISTANCE_LABELS[distance]}
                      {plan.input.race.distance === distance && (
                        <Badge variant="muted" className="ml-2 text-[10px]">
                          基准
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="tabular">{formatDuration(time)}</TableCell>
                    <TableCell className="tabular text-muted-foreground">
                      {formatPace(pace)}
                    </TableCell>
                    <TableCell className="tabular pr-5 text-right">
                      <span
                        className={
                          ratio >= 1 ? "text-quality" : "text-muted-foreground"
                        }
                      >
                        {ratio >= 1
                          ? `快 ${((ratio - 1) * 100).toFixed(0)}%`
                          : `慢 ${((1 - ratio) * 100).toFixed(0)}%`}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-[15px]">怎么用这些数字</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">起始配速</span>取区间较慢的一端：第一组稍保守，后面几组如果呼吸仍可控、心率没有超过 LTHR，再保持或微调。真正要守住的是“留有余力再跑一组”。
          </p>
          <p>
            <span className="font-medium">用距离替代时间</span>：3 分钟的重复可能是 600 米，也可能是接近 1 公里；短组误差控制在半分钟内，中长组约一分钟内。不要照搬更快跑者的公里课。
          </p>
          <p>
            <span className="font-medium">每 4–8 周</span>用比赛或计时赛重设一次配速；成绩没变就不要改数字。
          </p>
          <p className="text-muted-foreground">
            配速表补充：若条件湿热、有坡或有风，开跑前就把目标调慢；不要在困难路段硬追平均配速。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
