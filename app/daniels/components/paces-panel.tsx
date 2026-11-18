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
import { formatDuration, formatPace, formatPacePer } from "@/lib/format"
import type { DanielsPlan } from "../lib/daniels"

const ROWS = [
  {
    code: "E",
    name: "轻松跑",
    intensity: "59–74% VDOT",
    key: "easy" as const,
    purpose: "建立有氧基础与恢复。能完整说话，最后不觉得被掏空。",
    limit: "占周跑量约 80%",
  },
  {
    code: "M",
    name: "马拉松配速",
    intensity: "约 81.5% VDOT",
    key: "marathon" as const,
    purpose: "目标马拉松节奏与补给练习；不是每周都必须出现的强度。",
    limit: "单次 8–16 km 起步",
  },
  {
    code: "T",
    name: "阈值",
    intensity: "约 88% VDOT",
    key: "threshold" as const,
    purpose: "“舒适而吃力”的巡航强度，提高乳酸清除能力。",
    limit: "单次质量工作 ≤ 周跑量 10%",
  },
  {
    code: "I",
    name: "间歇",
    intensity: "约 97.5% VDOT",
    key: "interval" as const,
    purpose: "3–5 分钟一组，提高最大摄氧量；组间充分恢复。",
    limit: "单次质量工作 ≤ 8 km",
  },
  {
    code: "R",
    name: "重复",
    intensity: "约 105.5% VDOT",
    key: "repetition" as const,
    purpose: "短距离快速重复，改善跑步经济性；保持放松。",
    limit: "单次质量工作 ≤ 周跑量 5%",
  },
]

export function DanielsPacesPanel({ plan }: { plan: DanielsPlan }) {
  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-[15px]">五类训练配速</CardTitle>
          <CardDescription className="text-xs">
            由 VDOT {plan.vdot.toFixed(1)} 与 Daniels 的 %VDOT
            强度区间反解；E 是一个区间，其余为单点配速。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">强度</TableHead>
                <TableHead>配速 /km</TableHead>
                <TableHead>每 400 米</TableHead>
                <TableHead>用途</TableHead>
                <TableHead className="pr-5">单次上限</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => {
                const paceValue =
                  row.key === "easy"
                    ? plan.paces.easy
                    : plan.paces[row.key]
                const display =
                  typeof paceValue === "number"
                    ? formatPace(paceValue)
                    : `${formatPace(paceValue.slow)}–${formatPace(paceValue.fast)}`
                const per400 =
                  typeof paceValue === "number"
                    ? formatPacePer(paceValue, 400)
                    : `${formatPacePer(paceValue.slow, 400)}–${formatPacePer(paceValue.fast, 400)}`
                return (
                  <TableRow key={row.code}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={row.key === "easy" ? "easy" : "quality"}
                          className="text-[10px]"
                        >
                          {row.code}
                        </Badge>
                        <span className="font-medium">{row.name}</span>
                      </div>
                      <div className="text-muted-foreground mt-0.5 text-[10px]">
                        {row.intensity}
                      </div>
                    </TableCell>
                    <TableCell className="tabular font-semibold">
                      {display}
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground">
                      {per400}
                    </TableCell>
                    <TableCell className="max-w-64 text-[11px] whitespace-normal text-muted-foreground">
                      {row.purpose}
                    </TableCell>
                    <TableCell className="pr-5 text-[11px] whitespace-normal">
                      {row.limit}
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
          <CardTitle className="text-[15px]">等效比赛成绩</CardTitle>
          <CardDescription className="text-xs">
            用 Riegel（1.06）从最近成绩外推，只用于设定目标；真正校准 VDOT
            仍然要用新的比赛或计时赛。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">距离</TableHead>
                <TableHead>等效成绩</TableHead>
                <TableHead>配速 /km</TableHead>
                <TableHead className="pr-5 text-right">相对 T 配速</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.equivalent.map((row) => {
                const ratio = plan.paces.threshold / row.pace
                return (
                  <TableRow key={row.distance}>
                    <TableCell className="pl-5 font-medium">
                      {row.label}
                      {plan.input.race.distance === row.distance && (
                        <Badge variant="muted" className="ml-2 text-[10px]">
                          基准
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="tabular">
                      {formatDuration(row.seconds)}
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground">
                      {formatPace(row.pace)}
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
          <CardTitle className="text-[15px]">怎么读这张表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
          <p>
            <span className="font-medium">E 是区间，不是及格线</span>
            ：慢端用于恢复日，快端用于状态好的轻松跑。大多数日子应该落在区间中后段。
          </p>
          <p>
            <span className="font-medium">T / I / R 是“质量工作”</span>
            ：只计算重复段本身，热身、组间慢跑和冷身不计入上限。页面里的课表已经按这个口径排好。
          </p>
          <p>
            <span className="font-medium">配速会随天气漂移</span>
            ：湿热、逆风、坡度或睡眠不足时，心率与主观用力感优先。跑不进目标配速不是失败，硬追才是。
          </p>
          <p className="text-muted-foreground">
            公式在 VDOT 28–78 之外误差会放大；青少年、产后或伤后恢复期请先咨询专业人士。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
