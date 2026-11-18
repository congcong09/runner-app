"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { BookOpen, CalendarRange, Flame, ListChecks } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseRaceTime } from "@/lib/format"
import { HansonHero } from "./components/hero"
import { HansonInputPanel } from "./components/input-panel"
import { HansonMethodPanel } from "./components/method-panel"
import { HansonPacesPanel } from "./components/paces-panel"
import { HansonSchedulePanel } from "./components/schedule-panel"
import { HansonSummaryStats } from "./components/summary-stats"
import { HansonWeekPlan } from "./components/week-plan"
import {
  HANSON_DEFAULT_FORM,
  HANSON_EXAMPLE_FORM,
  HANSON_GOAL_DISTANCE,
  HANSON_GOAL_TIME_DEFAULT,
  buildHansonPlan,
  type HansonForm,
  type HansonGoal,
} from "./lib/hanson"

type TabValue = "week" | "paces" | "schedule" | "method"

const STORAGE_KEY = "hanson-form-v1"
const GOAL_PACE_MIN = 150
const GOAL_PACE_MAX = 540

function parseStoredForm(raw: string | null): HansonForm | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<HansonForm>
    const goal: HansonGoal =
      parsed.goal === "half" || parsed.goal === "marathon"
        ? parsed.goal
        : HANSON_DEFAULT_FORM.goal
    return { ...HANSON_DEFAULT_FORM, ...parsed, goal }
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

function fallbackSeconds(goal: HansonGoal): number {
  return parseRaceTime(HANSON_GOAL_TIME_DEFAULT[goal]) ?? 3.5 * 3600
}

export function HansonCalculator() {
  const storedRaw = useSyncExternalStore(
    subscribeToStorage,
    readStoredRaw,
    readServerStored,
  )
  const storedForm = useMemo(() => parseStoredForm(storedRaw), [storedRaw])
  const [editedForm, setEditedForm] = useState<HansonForm | null>(null)
  const form = editedForm ?? storedForm ?? HANSON_DEFAULT_FORM

  const [selectedWeek, setSelectedWeek] = useState(1)
  const [tab, setTab] = useState<TabValue>("week")
  const [lastValidGoal, setLastValidGoal] = useState<number | null>(null)

  const distance = HANSON_GOAL_DISTANCE[form.goal]
  const goalSeconds = parseRaceTime(form.goalTime)
  const goalPace =
    goalSeconds !== null ? goalSeconds / (distance / 1000) : null
  const pacePlausible =
    goalPace !== null &&
    goalPace >= GOAL_PACE_MIN &&
    goalPace <= GOAL_PACE_MAX
  const timeValid = goalSeconds !== null && goalSeconds > 0 && pacePlausible
  const timeError =
    goalSeconds === null
      ? "请按 时:分:秒 填写，例如 3:30:00 或 1:35:00。"
      : !pacePlausible
        ? "目标成绩与比赛距离不匹配：目标配速应在 2:30–9:00/km 之间。"
        : null

  const effectiveGoalSeconds = timeValid
    ? (goalSeconds as number)
    : (lastValidGoal ?? fallbackSeconds(form.goal))

  useEffect(() => {
    if (!editedForm || !timeValid) return
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(editedForm))
      } catch {
        /* 忽略隐私模式下的写入失败 */
      }
    }, 500)
    return () => window.clearTimeout(timer)
  }, [editedForm, timeValid])

  const plan = useMemo(
    () =>
      buildHansonPlan({
        goal: form.goal,
        goalSeconds: effectiveGoalSeconds,
        weeklyKm: form.weeklyKm,
      }),
    [form.goal, effectiveGoalSeconds, form.weeklyKm],
  )

  const safeWeek = Math.min(selectedWeek, plan.weeks.length)
  const currentWeek = plan.weeks[safeWeek - 1]

  const patch = (changes: Partial<HansonForm>) => {
    const next = { ...form, ...changes }
    setEditedForm(next)
    const seconds = parseRaceTime(next.goalTime)
    if (seconds !== null && seconds > 0) {
      const pace =
        seconds / (HANSON_GOAL_DISTANCE[next.goal] / 1000)
      if (pace >= GOAL_PACE_MIN && pace <= GOAL_PACE_MAX) {
        setLastValidGoal(seconds)
      }
    }
  }

  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week)
    setTab("week")
  }

  return (
    <>
      <SiteHeader />
      <HansonHero plan={plan} />

      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <HansonInputPanel
            form={form}
            plan={plan}
            timeValid={timeValid}
            timeError={timeError}
            onPatch={patch}
            onExample={() => {
              setEditedForm(HANSON_EXAMPLE_FORM)
              setLastValidGoal(
                parseRaceTime(HANSON_EXAMPLE_FORM.goalTime) ?? 3.25 * 3600,
              )
            }}
          />

          <div className="min-w-0 space-y-5">
            <HansonSummaryStats plan={plan} week={currentWeek} />

            <Tabs
              value={tab}
              onValueChange={(value) => setTab(value as TabValue)}
            >
              <TabsList className="w-full justify-between gap-0.5 overflow-x-auto sm:w-fit sm:justify-start sm:gap-1">
                <TabsTrigger value="week">
                  <ListChecks className="hidden sm:block" />
                  周课表
                </TabsTrigger>
                <TabsTrigger value="paces">
                  <Flame className="hidden sm:block" />
                  配速
                </TabsTrigger>
                <TabsTrigger value="schedule">
                  <CalendarRange className="hidden sm:block" />
                  {plan.weeks.length} 周
                </TabsTrigger>
                <TabsTrigger value="method">
                  <BookOpen className="hidden sm:block" />
                  方法
                </TabsTrigger>
              </TabsList>

              <TabsContent value="week">
                <HansonWeekPlan
                  plan={plan}
                  week={currentWeek}
                  onSelectWeek={setSelectedWeek}
                />
              </TabsContent>
              <TabsContent value="paces">
                <HansonPacesPanel plan={plan} />
              </TabsContent>
              <TabsContent value="schedule">
                <HansonSchedulePanel
                  plan={plan}
                  onSelectWeek={handleSelectWeek}
                />
              </TabsContent>
              <TabsContent value="method">
                <HansonMethodPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
