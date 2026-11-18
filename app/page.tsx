import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  Flame,
  Gauge,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DATA_PLATFORMS, METHODS, type MethodId } from "@/lib/methods"
import { cn } from "@/lib/utils"

const METHOD_ICONS: Record<MethodId, typeof Gauge> = {
  daniels: Gauge,
  hanson: Flame,
  "norwegian-singles": Waves,
}

const heroDays = [
  { label: "一", kind: "easy" },
  { label: "二", kind: "quality" },
  { label: "三", kind: "easy" },
  { label: "四", kind: "quality" },
  { label: "五", kind: "rest" },
  { label: "六", kind: "easy" },
  { label: "日", kind: "long" },
]

const DAY_CLASS: Record<string, string> = {
  easy: "bg-easy/15 text-easy border-easy/20",
  quality: "bg-quality/15 text-quality border-quality/25",
  long: "bg-long/15 text-long border-long/25",
  rest: "bg-muted text-muted-foreground border-dashed",
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
          <div className="from-background/10 via-background/60 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
          <div className="relative mx-auto max-w-[1180px] px-4 pt-12 pb-12 lg:px-8 lg:pt-16 lg:pb-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-card/70 gap-2 py-1 pr-3 pl-2 backdrop-blur"
                  >
                    <span className="bg-quality size-1.5 rounded-full" />
                    <span className="text-muted-foreground">
                      训练方法库 · 3 种体系
                    </span>
                  </Badge>
                  <Badge variant="muted" className="text-[10px]">
                    本地计算 · 无需注册
                  </Badge>
                </div>

                <h1 className="mt-5 max-w-2xl text-[29px] leading-[1.16] font-semibold tracking-tight sm:text-5xl">
                  把比赛成绩，
                  <br />
                  翻译成能执行的训练周。
                </h1>
                <p className="text-muted-foreground mt-5 max-w-xl text-[14px] leading-relaxed sm:text-[15px]">
                  丹尼尔斯、汉森、挪威单阈值，三种完全不同的训练哲学。选一个体系，输入最近成绩与每周时间，得到配速、周课表和进阶节奏。
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <Button size="lg" asChild>
                    <Link href="#methods">
                      选择训练体系
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">
                      <LogIn className="size-4" />
                      登录 / 数据接入
                    </Link>
                  </Button>
                </div>

                <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    数据不离开浏览器
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LockKeyhole className="size-3.5" />
                    登录仅为本地演示
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="size-3.5" />
                    配速由公开公式换算
                  </span>
                </div>
              </div>

              {/* Decorative plan preview */}
              <div className="relative hidden lg:block">
                <div className="bg-card/80 rounded-2xl border p-4 shadow-[0_24px_80px_-48px_rgba(16,24,40,0.6)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                        Weekly preview
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        示例训练周
                      </div>
                    </div>
                    <Badge variant="muted" className="text-[10px]">
                      不是医疗建议
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1.5">
                    {heroDays.map((day) => (
                      <div
                        key={day.label}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-md border py-2 text-[10px]",
                          DAY_CLASS[day.kind],
                        )}
                      >
                        <span className="opacity-70">{day.label}</span>
                        <span className="h-1 w-4 rounded-full bg-current opacity-60" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-lg border p-2.5">
                      <div className="text-muted-foreground text-[9px]">
                        VDOT
                      </div>
                      <div className="tabular mt-0.5 text-sm font-semibold">
                        49.8
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg border p-2.5">
                      <div className="text-muted-foreground text-[9px]">
                        T 配速
                      </div>
                      <div className="tabular mt-0.5 text-sm font-semibold">
                        4:16
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg border p-2.5">
                      <div className="text-muted-foreground text-[9px]">
                        周跑量
                      </div>
                      <div className="tabular mt-0.5 text-sm font-semibold">
                        50 km
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {METHODS.map((method) => (
                      <div
                        key={method.id}
                        data-method={method.id}
                        className="flex items-center gap-2"
                      >
                        <span className="w-16 shrink-0 text-[10px] text-muted-foreground">
                          {method.name}
                        </span>
                        <span className="bg-secondary relative h-1.5 flex-1 overflow-hidden rounded-full">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              width:
                                method.id === "daniels"
                                  ? "72%"
                                  : method.id === "hanson"
                                    ? "88%"
                                    : "64%",
                              backgroundColor: "var(--method-accent)",
                            }}
                          />
                        </span>
                        <span className="tabular w-8 text-right text-[10px] text-muted-foreground">
                          {method.id === "daniels"
                            ? "12w"
                            : method.id === "hanson"
                              ? "16w"
                              : "8w"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/10 absolute -right-3 -bottom-3 -z-10 size-28 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-b">
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-x divide-y px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
            {[
              { value: "3", label: "套训练体系" },
              { value: "5", label: "类丹尼尔斯配速" },
              { value: "8–16", label: "周可调计划长度" },
              { value: "0", label: "上传到服务器的数据" },
            ].map((stat) => (
              <div key={stat.label} className="px-3 py-5 first:pl-0 sm:px-5">
                <div className="tabular text-xl font-semibold tracking-tight sm:text-2xl">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-0.5 text-[11px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methods */}
        <section id="methods" className="scroll-mt-28 lg:scroll-mt-20">
          <div className="mx-auto max-w-[1180px] px-4 py-12 lg:px-8 lg:py-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-muted-foreground text-[11px] font-medium tracking-[0.16em] uppercase">
                  Training systems
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  三种体系，三种答案
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-[13px] leading-relaxed">
                  没有“最好”的方法，只有与你当前目标、时间和恢复能力匹配的方法。每个页面都可以直接计算。
                </p>
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                点击卡片进入计算器
              </Badge>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {METHODS.map((method) => {
                const Icon = METHOD_ICONS[method.id]
                return (
                  <Link
                    key={method.id}
                    href={method.href}
                    data-method={method.id}
                    className="group focus-visible:ring-ring/40 rounded-2xl outline-none focus-visible:ring-[3px]"
                  >
                    <Card className="relative h-full gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_48px_-32px_rgba(16,24,40,0.55)]">
                      <div
                        className="absolute inset-x-0 top-0 h-0.5"
                        style={{ backgroundColor: "var(--method-accent)" }}
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="grid size-11 place-items-center rounded-xl"
                            style={{
                              backgroundColor: "var(--method-soft)",
                              color: "var(--method-accent)",
                            }}
                          >
                            <Icon className="size-5" />
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="muted" className="text-[10px]">
                              {method.cadence}
                            </Badge>
                            <span className="text-muted-foreground/50 tabular text-[10px]">
                              {method.index}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-muted-foreground text-[10px] font-medium tracking-[0.14em] uppercase">
                            {method.en}
                          </div>
                          <h3 className="mt-1 text-xl font-semibold tracking-tight">
                            {method.name}
                          </h3>
                          <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">
                            {method.description}
                          </p>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-2 border-t pt-4 text-[11px]">
                          <div>
                            <dt className="text-muted-foreground text-[10px]">
                              核心
                            </dt>
                            <dd className="mt-0.5 font-medium">
                              {method.core}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground text-[10px]">
                              长距离
                            </dt>
                            <dd className="mt-0.5 font-medium">
                              {method.longRun}
                            </dd>
                          </div>
                        </dl>

                        <div
                          className="mt-5 flex items-center justify-between text-[12px] font-medium"
                          style={{ color: "var(--method-accent)" }}
                        >
                          <span>打开计算器</span>
                          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-y bg-card/30">
          <div className="mx-auto max-w-[1180px] px-4 py-12 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-muted-foreground text-[11px] font-medium tracking-[0.16em] uppercase">
                  Choose by constraint
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  怎么选：先看约束，再看信仰
                </h2>
              </div>
              <div>
                <p className="text-muted-foreground max-w-md text-[12px] leading-relaxed">
                  如果每周只能跑 4 天，不要选汉森；如果目标是 5 公里，不必照搬全马计划。
                </p>
                <p className="text-muted-foreground/70 mt-1 text-[10px] sm:hidden">
                  左右滑动查看完整对比
                </p>
              </div>
            </div>

            <div className="bg-card mt-6 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">体系</TableHead>
                    <TableHead>训练频率</TableHead>
                    <TableHead>核心强度</TableHead>
                    <TableHead>长距离</TableHead>
                    <TableHead className="pr-5">最适合</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {METHODS.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="pl-5">
                        <Link
                          href={method.href}
                          data-method={method.id}
                          className="group inline-flex items-center gap-2 font-medium"
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: "var(--method-accent)" }}
                          />
                          <span className="group-hover:underline group-hover:underline-offset-4">
                            {method.name}
                          </span>
                          <ArrowUpRight className="text-muted-foreground size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                        <div className="text-muted-foreground mt-0.5 text-[10px]">
                          {method.en}
                        </div>
                      </TableCell>
                      <TableCell className="text-[12px]">
                        {method.cadence}
                      </TableCell>
                      <TableCell className="text-[12px]">
                        {method.core}
                      </TableCell>
                      <TableCell className="text-[12px]">
                        {method.longRun}
                      </TableCell>
                      <TableCell className="text-muted-foreground pr-5 text-[11px] whitespace-normal">
                        {method.bestFor}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Data / account */}
        <section id="data" className="scroll-mt-28 lg:scroll-mt-20">
          <div className="mx-auto max-w-[1180px] px-4 py-12 lg:px-8 lg:py-16">
            <div className="grid overflow-hidden rounded-2xl border lg:grid-cols-[1.1fr_1fr]">
              <div className="bg-inverse text-inverse-foreground relative overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative">
                  <Badge className="border-white/15 bg-white/10 text-white">
                    <Sparkles className="size-3" />
                    数据接入 · 规划中
                  </Badge>
                  <h2 className="mt-5 max-w-lg text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                    登录后，把三种计划和真实训练放在一起看。
                  </h2>
                  <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-white/70">
                    现在先用本地演示账户把入口和账户状态搭好。之后接入 Strava、Garmin、COROS
                    等平台的数据，就能用同一条趋势线比较不同训练体系。
                  </p>

                  <ul className="mt-6 space-y-3 text-[12px]">
                    {[
                      "同步比赛成绩，自动更新 VDOT 与目标配速",
                      "保存每次生成的计划，回看执行偏差",
                      "把汉森、丹尼尔斯、挪威单阈值的周负荷放到同一张图里",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white/15">
                          <span className="size-1.5 rounded-full bg-white/80" />
                        </span>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <Button
                      asChild
                      className="bg-white text-inverse hover:bg-white/90"
                    >
                      <Link href="/login">
                        <LogIn className="size-4" />
                        创建本地演示账户
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href="/login">
                        查看登录页
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 sm:p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Database
                      className="size-4"
                      style={{ color: "var(--method-accent)" }}
                    />
                    数据源状态
                  </h3>
                  <Badge variant="muted" className="text-[10px]">
                    未连接
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  {DATA_PLATFORMS.map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                    >
                      <div>
                        <div className="text-[12px] font-medium">
                          {platform.name}
                        </div>
                        <div className="text-muted-foreground text-[10px]">
                          {platform.description}
                        </div>
                      </div>
                      <Badge variant="muted" className="text-[10px]">
                        即将接入
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="text-muted-foreground mt-5 flex gap-2 rounded-lg border border-dashed px-3 py-2.5 text-[11px] leading-relaxed">
                  <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    当前登录页不会发出任何网络请求。账户信息只写入本机
                    localStorage，用于后续接真实数据前的界面验证。
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
