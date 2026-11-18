"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { BRAND } from "@/lib/brand"
import { useAuthSession } from "@/lib/auth"
import { METHODS } from "@/lib/methods"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "首页" },
  ...METHODS.map((method) => ({ href: method.href, label: method.name })),
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const session = useAuthSession()

  return (
    <header className="bg-background/85 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-4 lg:px-8">
        <Link
          href="/"
          aria-label={`${BRAND.name} 首页`}
          className="flex min-w-0 items-center gap-2.5"
        >
          <BrandMark className="size-9 drop-shadow-sm" />
          <span className="min-w-0 leading-tight">
            <span className="block text-[14px] font-semibold tracking-tight">
              {BRAND.name}
            </span>
            <span className="text-muted-foreground block text-[11px]">
              {BRAND.chinese}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-2">
          {session ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login" className="gap-2">
                <span
                  className="grid size-5 place-items-center rounded-full text-[10px] font-semibold text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {session.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:block">
                  {session.name}
                </span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <LogIn className="size-3.5" />
                登录
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="border-t md:hidden">
        <nav
          aria-label="训练体系导航"
          className="mx-auto flex max-w-[1180px] items-center gap-1 overflow-x-auto px-3 py-2"
        >
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
