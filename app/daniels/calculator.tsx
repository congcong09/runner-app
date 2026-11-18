"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { BarChart3, BookOpen, CalendarRange, ListChecks } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseRaceTime } from "@/lib/format"
import { PACE_MAX, PACE_MIN, type RaceInput } from "@/lib/race"
import { DanielsHero } from "./components/hero"
import { DanielsInputPanel } from "./components/input-panel"
import { DanielsMethodPanel } from "./components/method-panel"
import { DanielsPacesPanel } from "./components/paces-panel"
import { DanielsProgressionPanel } from "./components/progression-panel"
import { DanielsSummaryStats } from "./components/summary-stats"
import { DanielsWeekPlan } from "./components/week-plan"
import {
  DANIELS_DEFAULT_FORM,
  DANIELS_EXAMPLE_FORM,
  buildDanielsPlan,
  type DanielsForm,
} from "./lib/daniels"

type TabValue = "week" | "paces" | "progression" | "method"

const STORAGE_KEY = "daniels-form-v1"

/** 输入无效时沿用的兜底成绩：10 公里 42:00。 */
const FALLBACK_RACE: RaceInput = { distance: 10000, seconds: 42 * 60 }

function parseStoredForm(raw: string | null): DanielsForm | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DanielsForm>
    return { ...DANIELS_DEFAULT_FORM, ...parsed }
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

export function DanielsCalculator() {
  const storedRaw = useSyncExternalStore(
    subscribeToStorage,
    readStoredRaw,
    readServerStored,
  )
  const storedForm = useMemo(() => parseStoredForm(storedRaw), [storedRaw])
  const [editedForm, setEditedForm] = useState<DanielsForm | null>(null)
  const form = editedForm ?? storedForm ?? DANIELS_DEFAULT_FORM

  const [selectedWeek, setSelectedWeek] = useState(1)
  const [tab, setTab] = useState<TabValue>("week")
  const [lastValidRace, setLastValidRace] = useState<RaceInput | null>(null)

  const raceSeconds = parseRaceTime(form.raceTime)
  const racePace =
    raceSeconds !== null ? raceSeconds / (form.raceDistance / 1000) : null
  const pacePlausible =
    racePace !== null && racePace >= PACE_MIN && racePace <= PACE_MAX
  const timeValid = raceSeconds !== null && raceSeconds >= 45 && pacePlausible
  const timeError =
    raceSeconds === null
      ? "请按 分:秒 或 时:分:秒 填写，例如 42:00 或 1:35:00。"
      : !pacePlausible
        ? "成绩与距离不匹配：配速应在 2:00–10:00/km 之间。"
        : null

  const effectiveRace = useMemo<RaceInput>(
    () =>
      timeValid
        ? { distance: form.raceDistance, seconds: raceSeconds as number }
        : (lastValidRace ?? FALLBACK_RACE),
    [timeValid, form.raceDistance, raceSeconds, lastValidRace],
  )

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
      buildDanielsPlan({
        race: effectiveRace,
        weeklyKm: form.weeklyKm,
        daysPerWeek: form.daysPerWeek,
        goalDistance: form.goalDistance,
        weeks: form.weeks,
      }),
    [
      effectiveRace,
      form.weeklyKm,
      form.daysPerWeek,
      form.goalDistance,
      form.weeks,
    ],
  )

  const safeWeek = Math.min(selectedWeek, plan.weeks.length)
  const currentWeek = plan.weeks[safeWeek - 1]

  const patch = (changes: Partial<DanielsForm>) => {
    const next = { ...form, ...changes }
    setEditedForm(next)
    const seconds = parseRaceTime(next.raceTime)
    if (seconds !== null && seconds >= 45) {
      const pace = seconds / (next.raceDistance / 1000)
      if (pace >= PACE_MIN && pace <= PACE_MAX) {
        setLastValidRace({ distance: next.raceDistance, seconds })
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
      <DanielsHero plan={plan} />

      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <DanielsInputPanel
            form={form}
            plan={plan}
            timeValid={timeValid}
            timeError={timeError}
            onPatch={patch}
            onExample={() => {
              setEditedForm(DANIELS_EXAMPLE_FORM)
              setLastValidRace({
                distance: DANIELS_EXAMPLE_FORM.raceDistance,
                seconds: 20 * 60,
              })
            }}
          />

          <div className="min-w-0 space-y-5">
            <DanielsSummaryStats plan={plan} week={currentWeek} />

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
                  <BarChart3 className="hidden sm:block" />
                  配速
                </TabsTrigger>
                <TabsTrigger value="progression">
                  <CalendarRange className="hidden sm:block" />
                  进阶
                </TabsTrigger>
                <TabsTrigger value="method">
                  <BookOpen className="hidden sm:block" />
                  方法
                </TabsTrigger>
              </TabsList>

              <TabsContent value="week">
                <DanielsWeekPlan
                  plan={plan}
                  week={currentWeek}
                  onSelectWeek={setSelectedWeek}
                />
              </TabsContent>
              <TabsContent value="paces">
                <DanielsPacesPanel plan={plan} />
              </TabsContent>
              <TabsContent value="progression">
                <DanielsProgressionPanel
                  plan={plan}
                  onSelectWeek={handleSelectWeek}
                />
              </TabsContent>
              <TabsContent value="method">
                <DanielsMethodPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
