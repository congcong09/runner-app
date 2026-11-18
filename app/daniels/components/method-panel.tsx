import {
  BookOpen,
  ExternalLink,
  ShieldAlert,
  Sigma,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const principles = [
  {
    title: "压力 + 恢复 = 进步",
    body: "质量课制造刺激，轻松跑与睡眠把刺激变成适应。把轻松日跑成中等强度，是最常见的失败方式。",
  },
  {
    title: "轻松日要真的轻松",
    body: "E 配速是 59–74% VDOT，不是“比比赛慢一点”。能完整说话、结束后还能正常生活，才算轻松跑。",
  },
  {
    title: "质量课有硬上限",
    body: "T 单次不超过周跑量 10%，I 单次不超过 8 公里，R 单次不超过周跑量 5%。超过上限不会更快，只会更难恢复。",
  },
  {
    title: "用最近比赛校准 VDOT",
    body: "4–8 周内的全力比赛或计时赛最可靠。训练中的“感觉很快”会高估体能，把配速带偏。",
  },
  {
    title: "目标决定质量课",
    body: "5K 需要 I / R，10K 以 T / I 为主，半马与全马加入 M。不要用同一套质量课跑所有距离。",
  },
  {
    title: "一致性优先于完美",
    body: "能连续执行 8–16 周的保守计划，胜过三周就崩掉的激进计划。状态差时先减组数，不要硬追配速。",
  },
]

export function DanielsMethodPanel() {
  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Sigma
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            公式与口径
          </CardTitle>
          <CardDescription className="text-xs">
            公开的 Daniels / Gilbert 方程；页面不照抄书中的整数秒表。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-5 text-[12px] leading-relaxed">
          <div className="bg-muted/40 space-y-2 rounded-lg border p-4 font-mono text-[11px]">
            <p>VO2 = −4.60 + 0.182258·v + 0.000104·v²</p>
            <p>%VO2max = 0.8 + 0.1894393·e^(−0.012778t) + 0.2989558·e^(−0.1932605t)</p>
            <p>VDOT = 比赛 VO2 ÷ 该成绩可持续的 %VO2max</p>
          </div>
          <p>
            v 的单位是米/分钟，t 是比赛分钟数。训练配速则反过来：用 VDOT ×
            目标强度比例，解出速度并换算成每公里配速。
          </p>
          <p className="text-muted-foreground">
            公式在 VDOT 28–78 之间最稳定。超出这个范围、青少年、伤后恢复期或高温环境下，数字只能作为起点，不能替代教练与身体反馈。
          </p>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <BookOpen
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            六条执行原则
          </CardTitle>
          <CardDescription className="text-xs">
            比记住配速表更重要的，是知道什么时候该停下来。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {principles.map((item, index) => (
              <div key={item.title} className="border-l pl-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-medium">{item.title}</h3>
                  <span className="text-muted-foreground text-[10px] tabular">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-[12px] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div>
            <h3 className="text-[13px] font-medium">继续阅读</h3>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              <li>
                <a
                  href="https://runsmartproject.com/calculator/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 text-[12px] transition-colors"
                >
                  <ExternalLink className="size-3 opacity-60" />
                  <span className="underline-offset-4 group-hover:underline">
                    VDOT 官方计算器（Runsmart）
                  </span>
                </a>
              </li>
              <li className="text-muted-foreground text-[12px]">
                Jack Daniels，《Daniels&apos; Running Formula》（第 4 版）
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardContent className="flex gap-3 px-5 py-4">
          <ShieldAlert className="text-warn mt-0.5 size-4 shrink-0" />
          <div className="space-y-2 text-[12px] leading-relaxed">
            <p>
              本工具依据公开公式实现，不是官方产品，也不构成医疗建议。配速由比赛成绩换算外推，个体差异很大；出现疼痛、持续疲劳或睡眠恶化时请降低负荷。
            </p>
            <p className="text-muted-foreground">
              VDOT 是一个训练工具，不是体能审判。比赛日的天气、赛道和状态都会让成绩偏离公式。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
