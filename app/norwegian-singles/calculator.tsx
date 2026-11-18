"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { BarChart3, Heart, ListChecks } from "lucide-react"

import { AppHeader, type TabValue } from "./components/app-header"
import { HeartRatePanel } from "./components/heart-rate-panel"
import { Hero } from "./components/hero"
import { InputPanel, type FormState } from "./components/input-panel"
import { LoadPanel } from "./components/load-panel"
import { MethodPanel } from "./components/method-panel"
import { PacePanel } from "./components/pace-panel"
import { SummaryStats } from "./components/summary-stats"
import { WeekPlan } from "./components/week-plan"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import {
  buildPlan,
  formatPace,
  parseRaceTime,
  planToText,
  type AthleteInput,
} from "./lib/training"

const STORAGE_KEY = "ns-planner-form-v1"
const TAB_VALUES: TabValue[] = ["week", "paces", "hr", "load", "method"]

const DEFAULT_FORM: FormState = {
  raceDistance: 21097.5,
  raceTime: "1:27:30",
  weeklyHours: 7,
  daysPerWeek: 6,
  sessions: 3,
  maxHr: 190,
  lthr: "",
}

const EXAMPLE_FORM: FormState = {
  raceDistance: 5000,
  raceTime: "19:30",
  weeklyHours: 6,
  daysPerWeek: 6,
  sessions: 3,
  maxHr: 188,
  lthr: "",
}

/** 输入无效时的兜底比赛成绩（半马 1:27:30） */
const FALLBACK_RACE = { distance: 21097.5, seconds: 1 * 3600 + 27 * 60 + 30 }

/** 配速合理区间（秒/公里）：2:00–10:00 */
const PACE_MIN = 120
const PACE_MAX = 600

function parseStoredForm(raw: string | null): FormState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<FormState>
    return { ...DEFAULT_FORM, ...parsed }
  } catch {
    return null
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

const readStoredRaw = () => window.localStorage.getItem(STORAGE_KEY)
const readServerStored = () => null

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

const readTabParam = () => new URLSearchParams(window.location.search).get("tab") ?? "week"
const readServerTab = () => "week"

export function NorwegianSinglesCalculator() {
  // localStorage 通过 useSyncExternalStore 读取：服务端/首帧用默认值，水合后自动切换，不会 mismatch
  const storedRaw = useSyncExternalStore(
    subscribeToStorage,
    readStoredRaw,
    readServerStored,
  )
  const storedForm = useMemo(() => parseStoredForm(storedRaw), [storedRaw])
  const [editedForm, setEditedForm] = useState<FormState | null>(null)
  const form = editedForm ?? storedForm ?? DEFAULT_FORM

  // 标签页同样来自 URL（?tab=paces），用户点击后以本地状态为准
  const tabParam = useSyncExternalStore(
    subscribeToLocation,
    readTabParam,
    readServerTab,
  )
  const [tabOverride, setTabOverride] = useState<TabValue | null>(null)
  const tab: TabValue =
    tabOverride ??
    (TAB_VALUES.includes(tabParam as TabValue)
      ? (tabParam as TabValue)
      : "week")

  const [copied, setCopied] = useState(false)
  const [lastValidRace, setLastValidRace] = useState<{
    distance: number
    seconds: number
  } | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPop = () => setTabOverride(null)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const raceSeconds = parseRaceTime(form.raceTime)
  const racePace =
    raceSeconds !== null ? raceSeconds / (form.raceDistance / 1000) : null
  const pacePlausible =
    racePace !== null && racePace >= PACE_MIN && racePace <= PACE_MAX
  const timeValid = raceSeconds !== null && raceSeconds >= 45 && pacePlausible
  const timeError =
    raceSeconds === null
      ? "请按 分:秒 或 时:分:秒 填写，例如 19:30 或 1:27:30。"
      : !pacePlausible
        ? "成绩与距离不匹配：配速应在 2:00–10:00/km 之间。"
        : null

  // 输入无效时沿用最近一次有效输入，避免配速表出现离谱数字
  const effectiveRace = useMemo(
    () =>
      timeValid
        ? { distance: form.raceDistance, seconds: raceSeconds as number }
        : (lastValidRace ?? FALLBACK_RACE),
    [timeValid, form.raceDistance, raceSeconds, lastValidRace],
  )

  // 只持久化「用户改过且有效」的输入：既不会用默认值覆盖已保存的计划，
  // 也保证重新打开页面时拿到的是最近一次可用计划
  useEffect(() => {
    if (!editedForm || !timeValid) return
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(editedForm))
      } catch {
        /* 忽略隐私模式下的写入失败 */
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [editedForm, timeValid])

  const plan = useMemo(() => {
    const input: AthleteInput = {
      race: effectiveRace,
      weeklyHours: form.weeklyHours,
      daysPerWeek: form.daysPerWeek,
      sessions: form.sessions,
      maxHr: form.maxHr >= 120 && form.maxHr <= 230 ? form.maxHr : 190,
      lthr: Number(form.lthr) >= 100 ? Number(form.lthr) : undefined,
    }
    return buildPlan(input)
  }, [
    effectiveRace,
    form.weeklyHours,
    form.daysPerWeek,
    form.sessions,
    form.maxHr,
    form.lthr,
  ])

  const patch = (changes: Partial<FormState>) => {
    const next = { ...form, ...changes }
    setEditedForm(next)
    const secs = parseRaceTime(next.raceTime)
    if (secs !== null && secs >= 45) {
      const pace = secs / (next.raceDistance / 1000)
      if (pace >= PACE_MIN && pace <= PACE_MAX) {
        setLastValidRace({ distance: next.raceDistance, seconds: secs })
      }
    }
  }

  const changeTab = (next: TabValue, scroll = false) => {
    setTabOverride(next)
    const url = new URL(window.location.href)
    if (next === "week") url.searchParams.delete("tab")
    else url.searchParams.set("tab", next)
    window.history.replaceState(null, "", url)
    if (scroll) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleCopy = async () => {
    const text = planToText(plan, formatPace)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement("textarea")
      area.value = text
      document.body.appendChild(area)
      area.select()
      document.execCommand("copy")
      area.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleDownload = () => {
    const text = planToText(plan, formatPace)
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "norwegian-singles-周计划.md"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AppHeader onNavigate={(next) => changeTab(next, true)} />
      <Hero plan={plan} />

      <main className="mx-auto max-w-[1180px] px-4 py-8 lg:px-8 lg:py-10">
        <div
          ref={resultsRef}
          className="grid scroll-mt-20 items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]"
        >
          <InputPanel
            form={form}
            plan={plan}
            timeValid={timeValid}
            timeError={timeError}
            onPatch={patch}
            onExample={() => {
              setEditedForm(EXAMPLE_FORM)
              setLastValidRace({
                distance: EXAMPLE_FORM.raceDistance,
                seconds: 19 * 60 + 30,
              })
            }}
          />

          <div className="min-w-0 space-y-5">
            <SummaryStats plan={plan} />

            <Tabs
              value={tab}
              onValueChange={(value) => changeTab(value as TabValue)}
            >
              <TabsList className="w-full justify-between gap-0.5 overflow-x-auto sm:w-fit sm:justify-start sm:gap-1">
                <TabsTrigger value="week">
                  <ListChecks className="hidden sm:block" />
                  周计划
                </TabsTrigger>
                <TabsTrigger value="paces">
                  <BarChart3 className="hidden sm:block" />
                  配速
                </TabsTrigger>
                <TabsTrigger value="hr">
                  <Heart className="hidden sm:block" />
                  心率
                </TabsTrigger>
                <TabsTrigger value="load">
                  <BarChart3 className="hidden sm:block" />
                  负荷
                </TabsTrigger>
                <TabsTrigger value="method">方法</TabsTrigger>
              </TabsList>

              <TabsContent value="week">
                <WeekPlan
                  plan={plan}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  copied={copied}
                />
              </TabsContent>
              <TabsContent value="paces">
                <PacePanel plan={plan} />
              </TabsContent>
              <TabsContent value="hr">
                <HeartRatePanel plan={plan} />
              </TabsContent>
              <TabsContent value="load">
                <LoadPanel plan={plan} />
              </TabsContent>
              <TabsContent value="method">
                <MethodPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="bg-card/40 border-t">
        <div className="mx-auto max-w-[1180px] px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-xs">
              依据《Norwegian Singles — An Approach To Running》实现 · 配速由 Riegel
              换算外推 · 不构成医疗建议
            </p>
            <div className="text-muted-foreground flex gap-4 text-xs">
              <a
                className="hover:text-foreground transition-colors"
                href="https://norwegiansingles.run"
                target="_blank"
                rel="noreferrer"
              >
                原指南
              </a>
              <a
                className="hover:text-foreground transition-colors"
                href="https://lactrace.com/norwegian-singles"
                target="_blank"
                rel="noreferrer"
              >
                Lactrace 配速表
              </a>
              <a
                className="hover:text-foreground transition-colors"
                href="https://www.reddit.com/r/NorwegianSinglesRun/"
                target="_blank"
                rel="noreferrer"
              >
                Reddit
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
