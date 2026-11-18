import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { BRAND } from "@/lib/brand"
import { METHODS } from "@/lib/methods"

export function SiteFooter() {
  return (
    <footer className="bg-card/40 mt-auto border-t">
      <div className="mx-auto max-w-[1180px] px-4 py-10 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <BrandMark className="size-8" />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  {BRAND.name}
                </div>
                <div className="text-muted-foreground text-[11px]">
                  {BRAND.chinese}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-3 max-w-sm text-[11px] leading-relaxed">
              把比赛成绩、训练时间与恢复约束放在同一套模型里，生成能执行的跑步计划。当前所有计算都在浏览器本地完成。
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-medium">训练体系</h2>
            <ul className="mt-3 space-y-2">
              {METHODS.map((method) => (
                <li key={method.id}>
                  <Link
                    href={method.href}
                    className="text-muted-foreground hover:text-foreground text-[12px] transition-colors"
                  >
                    {method.name}
                    <span className="text-muted-foreground/70 ml-1.5 text-[10px]">
                      {method.en.split(" · ")[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[12px] font-medium">账户与数据</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground text-[12px] transition-colors"
                >
                  登录 / 本地演示账户
                </Link>
              </li>
              <li>
                <Link
                  href="/#data"
                  className="text-muted-foreground hover:text-foreground text-[12px] transition-colors"
                >
                  数据接入计划
                </Link>
              </li>
              <li className="text-muted-foreground/80 text-[11px] leading-relaxed">
                Strava / Garmin / COROS 接入仍在规划中，当前不上传任何数据。
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 flex flex-col gap-2 border-t pt-5 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {BRAND.name} · 训练配速由公开公式估算</p>
          <p>不构成医疗建议；出现疼痛或持续疲劳时请降低负荷。</p>
        </div>
      </div>
    </footer>
  )
}
