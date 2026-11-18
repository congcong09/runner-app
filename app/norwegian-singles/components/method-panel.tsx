import { BookOpen, ExternalLink, ShieldAlert } from "lucide-react"

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
    title: "阈下，而不是阈值上",
    body: "质量课瞄准第二乳酸阈（LT2）以下，组间短恢复。每周大部分训练仍低于第一阈值（LT1）。",
    ref: "§1.1",
  },
  {
    title: "强度用三种方式校验",
    body: "配速、心率与主观用力感一起看：呼吸可控、留有余力再跑一组；用力感异常高时即使配速好看也要降速。",
    ref: "§1.2",
  },
  {
    title: "轻松日要真的轻松",
    body: "平均心率不超过实测最大心率的约 70%，这是上限不是目标；长距离跑同样保持轻松。",
    ref: "§1.3",
  },
  {
    title: "一致性优先",
    body: "进步来自能吸收的、持续数月的训练。持续疲劳是调整负荷的理由，而不是硬凑一个看起来成功的训练周。",
    ref: "§1.4",
  },
  {
    title: "先巩固，再小幅提升",
    body: "先在可承受的水平保持一个月，再做小步提升并保持 2–3 周；漏掉的训练不要补。",
    ref: "§2.3",
  },
  {
    title: "只为明确目的加课",
    body: "X 课、加速跑与力量训练都可以加，但要算清恢复代价，并说明它取代了哪次质量课。",
    ref: "§4.6",
  },
]

const resources = [
  { label: "原指南 norwegiansingles.run", href: "https://norwegiansingles.run" },
  {
    label: "Lactrace 配速指南",
    href: "https://lactrace.com/norwegian-singles",
  },
  {
    label: "原始 Letsrun 讨论帖",
    href: "https://www.letsrun.com/forum/flat_read.php?thread=12130781",
  },
  { label: "Reddit r/NorwegianSinglesRun", href: "https://www.reddit.com/r/NorwegianSinglesRun/" },
]

export function MethodPanel() {
  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <BookOpen className="text-primary size-4" />
            方法要点
          </CardTitle>
          <CardDescription className="text-xs">
            六条原则对应原指南章节，其余细节见文末资源。
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="border-l pl-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-medium">{item.title}</h3>
                  <span className="text-muted-foreground text-[10px] tabular">
                    {item.ref}
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
        <CardContent className="flex gap-3 px-5 py-4">
          <ShieldAlert className="text-warn mt-0.5 size-4 shrink-0" />
          <div className="space-y-2 text-[12px] leading-relaxed">
            <p>
              本工具依据社区指南的公开原则实现，不是官方产品，也不构成医疗建议。配速由比赛成绩换算外推，个体差异很大；出现疼痛、持续疲劳或睡眠恶化时请降低负荷。
            </p>
            <p className="text-muted-foreground">
              指南本身也强调：目前尚不能确认这套日程能预防受伤，或在所有方面优于其他训练体系。它的价值取决于你能否长期执行并确实进步。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
