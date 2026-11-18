"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn, signOut, useAuthSession } from "@/lib/auth"
import { DATA_PLATFORMS } from "@/lib/methods"
import { cn } from "@/lib/utils"

type Mode = "signin" | "signup"

const BENEFITS = [
  {
    icon: Database,
    title: "同步比赛成绩",
    body: "把 Strava、Garmin、COROS 的比赛与训练记录接进来，自动更新 VDOT 和目标配速。",
  },
  {
    icon: BarChart3,
    title: "保存训练计划",
    body: "保留每次生成的计划与执行偏差，不用重新填一遍输入。",
  },
  {
    icon: ShieldCheck,
    title: "跨体系对比",
    body: "把三种方法的周负荷、质量课比例和长距离放到同一张图里。",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const session = useAuthSession()
  const [mode, setMode] = useState<Mode>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("请输入有效的邮箱地址。")
      return
    }
    if (password.length < 6) {
      setError("密码至少需要 6 位。")
      return
    }
    if (mode === "signup" && name.trim().length === 0) {
      setError("请输入一个显示名称。")
      return
    }

    signIn(email, mode === "signup" ? name : undefined)
    router.push("/")
  }

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-stretch">
          {/* Brand / context panel */}
          <aside className="bg-inverse text-inverse-foreground relative hidden overflow-hidden rounded-2xl p-8 lg:flex lg:flex-col lg:p-10">
            <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative flex flex-1 flex-col">
              <Badge className="w-fit border-white/15 bg-white/10 text-white">
                <Sparkles className="size-3" />
                Stride Lab · 数据接入前夜
              </Badge>

              <h1 className="mt-6 max-w-lg text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">
                把训练数据，
                <br />
                收进一个地方。
              </h1>
              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/70">
                现在这里是本地演示账户：不连接平台、不发请求，只验证登录态和后续数据看板的入口。接入真实数据时，页面不需要重写。
              </p>

              <div className="mt-8 space-y-5">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10">
                      <benefit.icon className="size-4" />
                    </span>
                    <div>
                      <div className="text-[13px] font-medium">
                        {benefit.title}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] leading-relaxed text-white/60">
                  <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    本地演示不会上传邮箱、密码或训练数据。接入平台后，认证与数据访问会改成服务端
                    OAuth。
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form / account panel */}
          <section className="bg-card rounded-2xl border p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7">
            {session ? (
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="easy" className="text-[10px]">
                    <Check className="size-3" />
                    已登录
                  </Badge>
                  <span className="text-muted-foreground text-[10px]">
                    localStorage
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-xl text-lg font-semibold">
                    {session.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold tracking-tight">
                      {session.name}
                    </h2>
                    <p className="text-muted-foreground truncate text-[11px]">
                      {session.email}
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-2">
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <dt className="text-muted-foreground text-[10px]">
                      账户类型
                    </dt>
                    <dd className="mt-0.5 text-[12px] font-medium">
                      本地演示
                    </dd>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <dt className="text-muted-foreground text-[10px]">
                      数据源
                    </dt>
                    <dd className="mt-0.5 text-[12px] font-medium">
                      0 个已连接
                    </dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <h3 className="text-[12px] font-medium">数据源状态</h3>
                  <div className="mt-2 space-y-2">
                    {DATA_PLATFORMS.map((platform) => (
                      <div
                        key={platform.name}
                        className="flex items-center justify-between rounded-lg border px-3 py-2"
                      >
                        <div>
                          <div className="text-[11px] font-medium">
                            {platform.name}
                          </div>
                          <div className="text-muted-foreground text-[10px]">
                            {platform.description}
                          </div>
                        </div>
                        <Badge variant="muted" className="text-[10px]">
                          待接入
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-muted-foreground mt-5 rounded-lg border border-dashed px-3 py-2.5 text-[11px] leading-relaxed">
                  当前账户只存在于本机。退出登录只会移除会话；各页面的计划输入仍保留在本机
                  localStorage 中，清除浏览器数据会一并删除。
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" asChild>
                    <Link href="/">
                      返回方法库
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => signOut()}
                  >
                    <LogOut className="size-4" />
                    退出登录
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground text-[10px] font-medium tracking-[0.16em] uppercase">
                      Local demo account
                    </div>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">
                      登录 / 创建账户
                    </h2>
                  </div>
                  <span
                    className="grid size-10 place-items-center rounded-xl"
                    style={{
                      backgroundColor: "var(--method-soft)",
                      color: "var(--method-accent)",
                    }}
                  >
                    <UserRound className="size-5" />
                  </span>
                </div>

                <p className="text-muted-foreground mt-2 text-[12px] leading-relaxed">
                  不接后端也能先走通流程：任意邮箱 + 至少 6 位密码即可创建本地会话。
                </p>

                <div className="bg-muted mt-5 grid grid-cols-2 gap-1 rounded-lg p-1">
                  {(
                    [
                      ["signin", "登录"],
                      ["signup", "注册"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={mode === value}
                      onClick={() => {
                        setMode(value)
                        setError(null)
                      }}
                      className={cn(
                        "h-8 rounded-md text-[12px] font-medium transition-all",
                        mode === value
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="login-name">显示名称</Label>
                      <div className="relative">
                        <UserRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="login-name"
                          autoComplete="name"
                          placeholder="你的名字"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">密码</Label>
                      <span className="text-muted-foreground text-[10px]">
                        至少 6 位
                      </span>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={
                          mode === "signup" ? "new-password" : "current-password"
                        }
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pr-10 pl-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "隐藏密码" : "显示密码"}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-destructive bg-destructive/5 rounded-md px-3 py-2 text-[11px]">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <LogIn className="size-4" />
                    {mode === "signup" ? "创建本地账户" : "进入 Stride Lab"}
                  </Button>

                  <p className="text-muted-foreground text-center text-[10px] leading-relaxed">
                    本地演示模式：不会发送邮件，也不会校验真实密码。接入平台后会替换为服务端认证。
                  </p>
                </form>

                <Separator className="my-5" />

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-medium">连接跑步平台</h3>
                    <Badge variant="muted" className="text-[10px]">
                      即将支持
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {DATA_PLATFORMS.map((platform) => (
                      <Button
                        key={platform.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="justify-start text-[11px]"
                      >
                        <span className="bg-muted text-muted-foreground grid size-5 place-items-center rounded text-[9px] font-semibold">
                          {platform.name.slice(0, 1)}
                        </span>
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                    这些按钮当前禁用；接入后会跳出对应平台的 OAuth 授权页。
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Mobile context card */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:hidden">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="bg-card rounded-xl border p-4">
              <benefit.icon
                className="size-4"
                style={{ color: "var(--method-accent)" }}
              />
              <div className="mt-2 text-[12px] font-medium">
                {benefit.title}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
