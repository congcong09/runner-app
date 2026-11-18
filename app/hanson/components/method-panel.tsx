import { BookOpen, ExternalLink, Flame, ShieldAlert } from "lucide-react"

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
    title: "累积疲劳",
    body: "马拉松的后半程是在疲劳中跑。汉森用 6 天高频训练让周日长距离从“腿已经累了”开始，而不是靠一次 32 公里模拟。半马版同样用这个逻辑，只是长距离封顶 18 公里。",
  },
  {
    title: "长距离封顶 16 英里",
    body: "最长约 26 公里。汉森认为再长的单次跑会带来过高的恢复成本，而比赛末段的疲劳可以由周中跑量补足。",
  },
  {
    title: "每周 6 天",
    body: "周一休息，其余 6 天都跑。频率本身就是训练刺激；但轻松日必须真的轻松，否则累积疲劳会变成累积伤病。",
  },
  {
    title: "3 次 SOS",
    body: "周二速度/力量交替，周四节奏跑，周日长距离。三次课之间用轻松跑隔开，质量与恢复交替出现。",
  },
  {
    title: "目标配速驱动",
    body: "所有配速从目标比赛成绩派生。目标偏快会把轻松跑也带快，是整个计划最常见的失败原因。",
  },
  {
    title: "为全马/半马而设",
    body: "全马 16 周、半马 12 周。它适合已有稳定跑量、愿意每周 6 天训练的跑者；不适合从零开始或伤后复出。",
  },
]

const resources = [
  {
    label: "Hansons Running 官网",
    href: "https://www.hansons-running.com/",
  },
  {
    label: "Hansons Marathon Method 方法解析",
    href: "https://marathonhandbook.com/hansons-marathon-method/",
  },
  {
    label: "Luke Humphrey，《Hansons Marathon Method》",
    href: "https://www.humankinetics.com/",
  },
]

export function HansonMethodPanel() {
  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Flame
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            六条执行原则
          </CardTitle>
          <CardDescription className="text-xs">
            汉森不是“少跑长距离”的捷径，而是把训练量重新分配到一周里。
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
              {resources.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1.5 text-[12px] transition-colors"
                  >
                    <ExternalLink className="size-3 opacity-60" />
                    <span className="underline-offset-4 group-hover:underline">
                      {resource.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <BookOpen
              className="size-4"
              style={{ color: "var(--method-accent)" }}
            />
            适合与不适合
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 px-5 py-5 text-[12px] leading-relaxed sm:grid-cols-2">
          <div>
            <h3 className="text-[13px] font-medium">适合</h3>
            <ul className="text-muted-foreground mt-2 space-y-1.5">
              <li>· 已有稳定周跑量，想突破马拉松后半程</li>
              <li>· 能接受每周 6 天、3 次 SOS 的节奏</li>
              <li>· 目标明确，愿意围绕 MP 训练</li>
              <li>· 生活规律，能保证睡眠与恢复</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium">不适合</h3>
            <ul className="text-muted-foreground mt-2 space-y-1.5">
              <li>· 从零开始、周跑量低于 30–40 公里</li>
              <li>· 伤后复出或近期反复受伤</li>
              <li>· 每周只能跑 3–4 天</li>
              <li>· 目标成绩明显超前于当前能力</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardContent className="flex gap-3 px-5 py-4">
          <ShieldAlert className="text-warn mt-0.5 size-4 shrink-0" />
          <div className="space-y-2 text-[12px] leading-relaxed">
            <p>
              汉森是高频、高负荷计划。开始前至少连续 4 周保持接近当前输入的周跑量，并确认没有未处理的伤病。出现持续疼痛、睡眠恶化或轻松跑心率明显升高时，先减量而不是硬撑。
            </p>
            <p className="text-muted-foreground">
              本工具是通用模板，不是官方计划，也不构成医疗建议。目标成绩和配速请结合最近比赛与教练意见校准。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
