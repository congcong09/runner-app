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
import { formatPace, formatPacePer } from "@/lib/format"
import type { HansonPlan } from "../lib/hanson"

export function HansonPacesPanel({ plan }: { plan: HansonPlan }) {
  const rows = [
    {
      key: "easy",
      label: "轻松跑",
      variant: "easy" as const,
      pace: plan.paces.easy,
      rule: "MP + 1–2 分钟/英里",
      session: "3–10 km，占周跑量大部分",
    },
    {
      key: "long",
      label: "长距离",
      variant: "long" as const,
      pace: plan.paces.long,
      rule: "MP + 30–50 秒/英里",
      session: `最长 ${plan.longRunCap} km，封顶`,
    },
    {
      key: "strength",
      label: "力量跑",
      variant: "quality" as const,
      pace: { fast: plan.paces.strength, slow: plan.paces.strength },
      rule: "MP − 10 秒/英里",
      session: "连续 4–14 km，略快于 MP",
    },
    {
      key: "tempo",
      label: "节奏跑",
      variant: "quality" as const,
      pace: { fast: plan.paces.tempo, slow: plan.paces.tempo },
      rule: "= MP",
      session: "连续 5–16 km 目标配速",
    },
    {
      key: "speed",
      label: "速度课",
      variant: "quality" as const,
      pace: plan.paces.speed,
      rule: "5K–10K 配速",
      session: "400 / 800 m 重复，充分恢复",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-[15px]">五类汉森配速</CardTitle>
          <CardDescription className="text-xs">
            全部由目标比赛配速（页面简写为 MP，{formatPace(plan.paces.marathon)}
            /km）派生；不是从当前体能推算。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">类型</TableHead>
                <TableHead>配速 /km</TableHead>
                <TableHead>每 400 米</TableHead>
                <TableHead>规则</TableHead>
                <TableHead className="pr-5">典型课</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const isRange = row.pace.fast !== row.pace.slow
                return (
                  <TableRow key={row.key}>
                    <TableCell className="pl-5">
                      <Badge variant={row.variant} className="text-[10px]">
                        {row.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular font-semibold">
                      {isRange
                        ? `${formatPace(row.pace.slow)}–${formatPace(row.pace.fast)}`
                        : formatPace(row.pace.fast)}
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground">
                      {isRange
                        ? `${formatPacePer(row.pace.slow, 400)}–${formatPacePer(row.pace.fast, 400)}`
                        : formatPacePer(row.pace.fast, 400)}
                    </TableCell>
                    <TableCell className="text-[11px] whitespace-normal">
                      {row.rule}
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-5 text-[11px] whitespace-normal">
                      {row.session}
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
          <CardTitle className="text-[15px]">目标配速的检查</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">MP</span>
            ：{plan.distanceLabel} {formatPace(plan.paces.marathon)}/km。所有训练强度都围绕它展开。
          </p>
          <p>
            <span className="font-medium">轻松跑</span>
            ：{formatPace(plan.paces.easy.slow)}–{formatPace(plan.paces.easy.fast)}
            /km。如果这个配速仍然让你喘，说明目标偏快，先把目标放慢 5–10 分钟。
          </p>
          <p>
            <span className="font-medium">速度课</span>
            ：{formatPace(plan.paces.speed.slow)}–{formatPace(plan.paces.speed.fast)}
            /km，对应 10K–5K 配速。速度课不是全速冲刺，最后一组应和第
            1 组差不多快。
          </p>
          <p className="text-muted-foreground">
            汉森的配速表把“目标”放在第一位；半马计划中，MP 指目标半马配速。若你还没有接近目标的比赛成绩，先做一轮基础期，或者把目标调整到更现实的位置。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
