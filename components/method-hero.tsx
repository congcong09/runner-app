import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { METHOD_BY_ID, type MethodId } from "@/lib/methods"

interface MethodHeroProps {
  method: MethodId
  eyebrow: string
  title: ReactNode
  description: ReactNode
  facts: { label: string; value: string }[]
  highlight?: {
    label: string
    value: string
    unit?: string
    note: string
  }
  icon: ReactNode
}

export function MethodHero({
  method,
  eyebrow,
  title,
  description,
  facts,
  highlight,
  icon,
}: MethodHeroProps) {
  const meta = METHOD_BY_ID[method]

  return (
    <section
      data-method={method}
      className="relative overflow-hidden border-b"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 85% 0%, var(--method-soft), transparent 58%)",
        }}
      />
      <div className="from-background/10 via-background/55 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />

      <div className="relative mx-auto max-w-[1180px] px-4 pt-7 pb-9 lg:px-8 lg:pt-9 lg:pb-12">
        <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
          <Link
            href="/"
            className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3" />
            方法库
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span>{meta.name}</span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-card/70 gap-2 py-1 pr-3 pl-2 backdrop-blur"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--method-accent)" }}
                />
                <span className="text-muted-foreground">{eyebrow}</span>
              </Badge>
              <Badge variant="muted" className="text-[10px]">
                {meta.index} / 03
              </Badge>
            </div>

            <h1 className="mt-4 max-w-3xl text-[29px] leading-[1.16] font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-[14px] leading-relaxed sm:text-[15px]">
              {description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="bg-card/70 flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 backdrop-blur"
                >
                  <span className="text-muted-foreground text-[10px]">
                    {fact.label}
                  </span>
                  <span className="tabular text-[12px] font-medium sm:text-[13px]">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {highlight && (
            <aside className="bg-card/80 relative overflow-hidden rounded-xl border p-4 shadow-[0_8px_30px_-24px_rgba(16,24,40,0.5)] backdrop-blur">
              <div
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ backgroundColor: "var(--method-accent)" }}
              />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-muted-foreground text-[10px]">
                    {highlight.label}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="tabular text-[26px] leading-none font-semibold tracking-tight">
                      {highlight.value}
                    </span>
                    {highlight.unit && (
                      <span className="text-muted-foreground text-[11px]">
                        {highlight.unit}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg"
                  style={{
                    backgroundColor: "var(--method-soft)",
                    color: "var(--method-accent)",
                  }}
                >
                  {icon}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-[11px] leading-relaxed">
                {highlight.note}
              </p>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
