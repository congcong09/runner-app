/**
 * 汉森马拉松训练法（Hansons Marathon Method）的简化实现。
 *
 * 关键结构：
 *  - 每周 6 天，周一休息。
 *  - 三个 SOS：周二速度/力量（交替）、周四节奏跑、周日长距离。
 *  - 长距离封顶 26 公里（约 16 英里），靠周中频率制造「累积疲劳」。
 *  - 配速由目标成绩决定，而不是由当前体能决定：
 *      轻松跑 = MP + 1–2 分钟/英里
 *      长距离 = MP + 30–50 秒/英里
 *      力量跑 = MP − 10 秒/英里
 *      节奏跑 = MP
 *      速度课 = 5K–10K 配速
 *
 * 这是训练模板，不替代原书或教练的个体化调整。
 */

import { distanceLabel, riegelTime, type RaceInput } from "@/lib/race"

export type HansonGoal = "marathon" | "half"
export type HansonPhase = "base" | "build" | "peak" | "taper"
export type HansonDayKind =
  | "speed"
  | "strength"
  | "tempo"
  | "long"
  | "easy"
  | "rest"
export type HansonWorkoutType = "speed" | "strength" | "tempo" | "long"

export interface HansonForm {
  goal: HansonGoal
  goalTime: string
  weeklyKm: number
}

export interface HansonInput {
  goal: HansonGoal
  goalSeconds: number
  weeklyKm: number
}

export interface PaceRange {
  fast: number
  slow: number
}

export interface HansonPaces {
  marathon: number
  easy: PaceRange
  long: PaceRange
  strength: number
  tempo: number
  speed: PaceRange
}

export interface HansonWorkout {
  id: string
  type: HansonWorkoutType
  label: string
  title: string
  detail: string
  purpose: string
  reps?: number
  repMeters?: number
  pace: number
  paceRange?: PaceRange
  recoverySeconds?: number
  workKm: number
  totalKm: number
  totalSeconds: number
}

export interface HansonDay {
  day: string
  short: string
  kind: HansonDayKind
  km: number
  minutes: number
  detail: string
  workout?: HansonWorkout
}

export interface HansonWeekPlan {
  week: number
  phase: HansonPhase
  phaseLabel: string
  km: number
  longKm: number
  focus: string
  note: string
  tuesday: HansonWorkout
  tempo: HansonWorkout
  long: HansonWorkout
  days: HansonDay[]
  easyKm: number
  isCutback: boolean
}

export interface HansonPlan {
  input: HansonInput
  distance: number
  distanceLabel: string
  paces: HansonPaces
  weeks: HansonWeekPlan[]
  peakKm: number
  maxLongKm: number
  longRunCap: number
  warnings: string[]
}

export const HANSON_DEFAULT_FORM: HansonForm = {
  goal: "marathon",
  goalTime: "3:30:00",
  weeklyKm: 50,
}

export const HANSON_EXAMPLE_FORM: HansonForm = {
  goal: "marathon",
  goalTime: "3:15:00",
  weeklyKm: 60,
}

export const HANSON_GOAL_DISTANCE: Record<HansonGoal, number> = {
  marathon: 42195,
  half: 21097.5,
}

export const HANSON_GOAL_LABEL: Record<HansonGoal, string> = {
  marathon: "全程马拉松",
  half: "半程马拉松",
}

export const HANSON_GOAL_TIME_DEFAULT: Record<HansonGoal, string> = {
  marathon: "3:30:00",
  half: "1:35:00",
}

const PHASE_LABEL: Record<HansonPhase, string> = {
  base: "基础期",
  build: "累积期",
  peak: "巅峰期",
  taper: "减量期",
}

const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
const DAY_SHORT = ["一", "二", "三", "四", "五", "六", "日"]

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** MP + 秒数，得到慢于马拉松配速的配速。 */
const slower = (pace: number, secondsPerKm: number) => pace + secondsPerKm

export function hansonPlanWeeks(goal: HansonGoal): number {
  return goal === "marathon" ? 16 : 12
}

/** 由目标成绩推出汉森的五类配速。 */
export function buildHansonPaces(
  goal: HansonGoal,
  goalSeconds: number,
): HansonPaces {
  const distance = HANSON_GOAL_DISTANCE[goal]
  const mp = goalSeconds / (distance / 1000)

  // 用目标成绩外推 5K / 10K 配速；只作为速度课区间，不作为比赛预测。
  const race: RaceInput = { distance, seconds: goalSeconds }
  const fiveK = riegelTime(race, 5000) / 5
  const tenK = riegelTime(race, 10000) / 10

  return {
    marathon: mp,
    easy: {
      fast: slower(mp, 37), // 约 1:00/mile
      slow: slower(mp, 75), // 约 2:00/mile
    },
    long: {
      fast: slower(mp, 19), // 约 30 秒/mile
      slow: slower(mp, 31), // 约 50 秒/mile
    },
    strength: mp - 6, // MP − 10 秒/mile
    tempo: mp,
    speed: {
      fast: fiveK,
      slow: tenK,
    },
  }
}

function phaseSchedule(weeks: number) {
  const base = Math.max(2, Math.round(weeks * 0.25))
  const build = Math.max(3, Math.round(weeks * 0.45))
  const peak = Math.max(1, Math.round(weeks * 0.2))
  const taper = Math.max(1, weeks - base - build - peak)
  return { base, build, peak, taper }
}

function phaseForWeek(
  week: number,
  schedule: ReturnType<typeof phaseSchedule>,
): HansonPhase {
  if (week <= schedule.base) return "base"
  if (week <= schedule.base + schedule.build) return "build"
  if (week <= schedule.base + schedule.build + schedule.peak) return "peak"
  return "taper"
}

function weekVolume(
  week: number,
  weeks: number,
  startKm: number,
  peakKm: number,
  phase: HansonPhase,
): number {
  if (phase === "taper") {
    return Math.max(
      18,
      Math.round(week === weeks ? peakKm * 0.42 : peakKm * 0.7),
    )
  }
  const buildWeeks = Math.max(1, weeks - 3)
  const progress = Math.min(1, (week - 1) / buildWeeks)
  let km = startKm + (peakKm - startKm) * progress
  // 每 4 周做一次减量，但巅峰期只轻微回收，避免破坏累积疲劳。
  if (week % 4 === 0) km *= phase === "peak" ? 0.92 : 0.86
  return Math.max(16, Math.round(km))
}

function focusFor(phase: HansonPhase): string {
  if (phase === "base") return "建立 6 天节奏 + 基础速度"
  if (phase === "build") return "SOS 课 + 累积疲劳"
  if (phase === "peak") return "MP 专项 + 长距离封顶"
  return "减量 + 比赛配速"
}

function noteFor(phase: HansonPhase, week: number, weeks: number): string {
  if (phase === "base") {
    return "先把每周 6 天的节奏建立起来；周二在速度和力量之间交替，轻松日不要加码。"
  }
  if (phase === "build") {
    return "累积疲劳开始生效：周三、周五、周六是恢复跑，不是第二个质量课。"
  }
  if (phase === "peak") {
    return "长距离封顶 26 公里；周中累积的疲劳才是模拟比赛后半程的关键。"
  }
  if (week === weeks) {
    return "比赛周：下面的跑量不含比赛本身；周日把激活跑换成比赛，赛前只做短刺激，不要补跑量。"
  }
  if (week === weeks - 1) {
    return "赛前倒数第二周：跑量下降，但保留短速度刺激和目标配速触感，不要完全停跑。"
  }
  return "减量 20–30%，睡眠和补给优先；不要用额外跑量弥补减量。"
}

function workoutTypeForTuesday(week: number): "speed" | "strength" {
  return week % 2 === 1 ? "speed" : "strength"
}

function buildSpeedWorkout(
  budgetKm: number,
  paces: HansonPaces,
  phase: HansonPhase,
  id: string,
): HansonWorkout {
  const repMeters = phase === "peak" ? 800 : 400
  const warmupKm = 2.5
  const cooldownKm = 1.5
  const supportKm = warmupKm + cooldownKm
  const recoverySeconds = repMeters >= 800 ? 120 : 90
  const pace = repMeters >= 800 ? paces.speed.slow : paces.speed.fast
  const repKm = repMeters / 1000
  const minReps = repMeters >= 800 ? 4 : 6
  const maxReps = repMeters >= 800 ? 8 : 12
  const reps = clamp(
    Math.round(Math.max(0.5, budgetKm - supportKm) / repKm),
    minReps,
    maxReps,
  )
  const workKm = reps * repKm
  const recoveryKm =
    ((reps - 1) * recoverySeconds) / paces.easy.fast
  const totalKm = supportKm + workKm + recoveryKm
  const totalSeconds =
    (warmupKm + cooldownKm) * paces.easy.fast +
    workKm * pace +
    (reps - 1) * recoverySeconds

  return {
    id,
    type: "speed",
    label: "速度课",
    title: `${reps} × ${repMeters} m @ ${repMeters >= 800 ? "10K" : "5K"} 配速`,
    detail:
      repMeters >= 800
        ? `热身 ${warmupKm} km + ${reps} × 800 m（${recoverySeconds} 秒慢跑）+ 冷身 ${cooldownKm} km`
        : `热身 ${warmupKm} km + ${reps} × 400 m（${recoverySeconds} 秒慢跑）+ 冷身 ${cooldownKm} km`,
    purpose:
      "提高速度储备与跑步经济性；保持放松、快速，不在每组末尾冲刺。",
    reps,
    repMeters,
    pace,
    paceRange: paces.speed,
    recoverySeconds,
    workKm,
    totalKm,
    totalSeconds,
  }
}

function buildStrengthWorkout(
  budgetKm: number,
  paces: HansonPaces,
  id: string,
): HansonWorkout {
  const strengthKm = clamp(Math.round(budgetKm - 5), 4, 14)
  const totalKm = strengthKm + 5
  const totalSeconds =
    25 * 60 + strengthKm * paces.strength
  return {
    id,
    type: "strength",
    label: "力量跑",
    title: `${strengthKm} km @ MP−6 秒/km`,
    detail: `热身 3 km + ${strengthKm} km 略快于马拉松配速 + 冷身 2 km`,
    purpose:
      "在略快于 MP 的连续强度下建立力量耐力；如果跑成间歇，说明配速太快。",
    pace: paces.strength,
    workKm: strengthKm,
    totalKm,
    totalSeconds,
  }
}

function buildTempoWorkout(
  budgetKm: number,
  goal: HansonGoal,
  paces: HansonPaces,
  id: string,
): HansonWorkout {
  const tempoKm = clamp(
    Math.round(budgetKm - 5),
    5,
    goal === "marathon" ? 16 : 12,
  )
  const totalKm = tempoKm + 5
  const totalSeconds = 25 * 60 + tempoKm * paces.tempo
  return {
    id,
    type: "tempo",
    label: "节奏跑",
    title: `${tempoKm} km @ MP`,
    detail: `热身 3 km + ${tempoKm} km 马拉松配速 + 冷身 2 km`,
    purpose:
      "最具体的比赛模拟：练习目标配速、补给节奏和“在疲劳中保持姿势”。",
    pace: paces.tempo,
    workKm: tempoKm,
    totalKm,
    totalSeconds,
  }
}

function buildRaceTempoWorkout(
  paces: HansonPaces,
  id: string,
): HansonWorkout {
  const tempoKm = 3
  const totalKm = tempoKm + 5
  const totalSeconds = 25 * 60 + tempoKm * paces.tempo
  return {
    id,
    type: "tempo",
    label: "赛前激活",
    title: "3 km 目标配速（赛前激活）",
    detail: "热身 3 km + 3 km 目标配速 + 冷身 2 km",
    purpose: "比赛周只做短而可控的配速触感，不制造新的疲劳。",
    pace: paces.tempo,
    workKm: tempoKm,
    totalKm,
    totalSeconds,
  }
}

function buildLongWorkout(
  longKm: number,
  phase: HansonPhase,
  week: number,
  paces: HansonPaces,
  id: string,
): HansonWorkout {
  const mpFinishKm =
    (phase === "build" || phase === "peak") && week % 2 === 0
      ? clamp(Math.round(longKm * 0.25), 3, 8)
      : 0
  const easyKm = longKm - mpFinishKm
  const totalSeconds =
    easyKm * paces.long.slow + mpFinishKm * paces.marathon
  return {
    id,
    type: "long",
    label: "长距离",
    title:
      mpFinishKm > 0
        ? `${longKm} km 长距离（末 ${mpFinishKm} km @ MP）`
        : `${longKm} km 长距离`,
    detail:
      mpFinishKm > 0
        ? `前 ${easyKm} km 轻松长距离 + 最后 ${mpFinishKm} km 马拉松配速`
        : "全程轻松长距离，目的是累积疲劳，不是跑成第二次质量课",
    purpose:
      "在累积疲劳中练习长时间跑动；汉森把长距离封顶，把更多训练量交给周中频率。",
    pace: paces.long.slow,
    paceRange: paces.long,
    workKm: longKm,
    totalKm: longKm,
    totalSeconds,
  }
}

function buildWeek(
  input: HansonInput,
  week: number,
  weeks: number,
  startKm: number,
  peakKm: number,
  paces: HansonPaces,
  schedule: ReturnType<typeof phaseSchedule>,
): HansonWeekPlan {
  const phase = phaseForWeek(week, schedule)
  const km = weekVolume(week, weeks, startKm, peakKm, phase)
  const longKm = clamp(
    Math.round(km * (input.goal === "marathon" ? 0.28 : 0.25)),
    10,
    input.goal === "marathon" ? 26 : 18,
  )

  const tuesdayBudget = km * 0.16
  const tempoBudget = km * 0.22
  const isRaceWeek = week === weeks
  const tuesdayType = isRaceWeek ? "speed" : workoutTypeForTuesday(week)
  const tuesday = isRaceWeek
    ? {
        ...buildSpeedWorkout(
          Math.max(4.5, km * 0.18),
          paces,
          "taper",
          `w${week}-speed`,
        ),
        label: "赛前激活",
        purpose: "比赛周只做短加速跑，保持跑姿和神经激活，不制造新的疲劳。",
      }
    : tuesdayType === "speed"
      ? buildSpeedWorkout(tuesdayBudget, paces, phase, `w${week}-speed`)
      : buildStrengthWorkout(tuesdayBudget, paces, `w${week}-strength`)
  const tempo = isRaceWeek
    ? buildRaceTempoWorkout(paces, `w${week}-tempo`)
    : buildTempoWorkout(
        tempoBudget,
        input.goal,
        paces,
        `w${week}-tempo`,
      )
  let long = buildLongWorkout(
    isRaceWeek
      ? Math.min(10, Math.max(8, Math.round(km * 0.28)))
      : longKm,
    phase,
    week,
    paces,
    `w${week}-long`,
  )
  if (isRaceWeek) {
    long = {
      ...long,
      label: "赛前激活",
      title: `${long.workKm} km 激活跑（比赛日替换）`,
      detail: "赛前轻松跑；如果周日比赛，以比赛代替这次激活。",
      purpose: "比赛周保留一点跑动感觉即可，不要在这里追加训练量。",
    }
  }

  const easyTotal = Math.max(
    isRaceWeek ? 6 : 9,
    km - tuesday.totalKm - tempo.totalKm - long.totalKm,
  )
  const easyDayCount = isRaceWeek ? 2 : 3
  const easyEach = easyTotal / easyDayCount
  const easyPace = (paces.easy.fast + paces.easy.slow) / 2
  const template: { kind: HansonDayKind; workout?: HansonWorkout }[] =
    isRaceWeek
      ? [
          { kind: "rest" },
          { kind: "speed", workout: tuesday },
          { kind: "easy" },
          { kind: "tempo", workout: tempo },
          { kind: "rest" },
          { kind: "easy" },
          { kind: "long", workout: long },
        ]
      : [
          { kind: "rest" },
          { kind: tuesdayType, workout: tuesday },
          { kind: "easy" },
          { kind: "tempo", workout: tempo },
          { kind: "easy" },
          { kind: "easy" },
          { kind: "long", workout: long },
        ]

  const days: HansonDay[] = template.map((item, index) => {
    if (item.kind === "rest") {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind: "rest",
        km: 0,
        minutes: 0,
        detail: "完全休息，或散步、活动度练习。",
      }
    }
    if (item.workout) {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind: item.kind,
        km: Math.round(item.workout.totalKm * 10) / 10,
        minutes: Math.round(item.workout.totalSeconds / 60),
        detail: item.workout.title,
        workout: item.workout,
      }
    }
    return {
      day: DAY_NAMES[index],
      short: DAY_SHORT[index],
      kind: "easy",
      km: Math.round(easyEach * 10) / 10,
      minutes: Math.round((easyEach * easyPace) / 60),
      detail: "轻松跑；能对话，比 MP 慢 1–2 分钟/英里。",
    }
  })

  return {
    week,
    phase,
    phaseLabel: PHASE_LABEL[phase],
    km,
    longKm: long.workKm,
    focus: focusFor(phase),
    note: noteFor(phase, week, weeks),
    tuesday,
    tempo,
    long,
    days,
    easyKm: easyEach * easyDayCount,
    isCutback: week % 4 === 0 && phase !== "taper",
  }
}

export function buildHansonPlan(input: HansonInput): HansonPlan {
  const distance = HANSON_GOAL_DISTANCE[input.goal]
  const weeks = hansonPlanWeeks(input.goal)
  const weeklyKm = Math.round(clamp(input.weeklyKm, 25, 110))
  const startKm = Math.round(clamp(weeklyKm * 0.8, 24, 65))
  const peakCap = input.goal === "marathon" ? 100 : 72
  const peakKm = Math.round(clamp(startKm * 1.7, 55, peakCap))
  const paces = buildHansonPaces(input.goal, input.goalSeconds)
  const schedule = phaseSchedule(weeks)

  const weekPlans = Array.from({ length: weeks }, (_, index) =>
    buildWeek(
      input,
      index + 1,
      weeks,
      startKm,
      peakKm,
      paces,
      schedule,
    ),
  )

  const peakWeek = weekPlans.reduce((peak, week) =>
    week.km > peak.km ? week : peak,
  )
  const maxLongKm = Math.max(...weekPlans.map((week) => week.longKm))

  const warnings: string[] = []
  if (input.goal === "marathon" && weeklyKm < 40) {
    warnings.push(
      "汉森全马计划通常从每周 40–50 公里以上开始；当前跑量偏低，先把基础期拉长到 4–6 周。",
    )
  }
  if (weeklyKm > 100) {
    warnings.push(
      "当前周跑量已超过 100 公里：确认你已适应 6 天训练，再按计划加量；必要时把峰值下调 5–10%。",
    )
  }
  if (peakKm > weeklyKm * 1.9) {
    warnings.push(
      `计划峰值 ${peakKm} 公里约为当前跑量的 ${(peakKm / weeklyKm).toFixed(1)} 倍，提升较大；建议先做 4 周基础期再进入正式计划。`,
    )
  }
  if (input.goal === "half") {
    warnings.push(
      "半马版按 12 周排；长距离封顶 18 公里，速度课使用 5K–10K 配速区间。",
    )
  }

  return {
    input: { ...input, weeklyKm },
    distance,
    distanceLabel: distanceLabel(distance),
    paces,
    weeks: weekPlans,
    peakKm: peakWeek.km,
    maxLongKm,
    longRunCap: input.goal === "marathon" ? 26 : 18,
    warnings,
  }
}

export const HANSON_PHASE_LABEL = PHASE_LABEL

export function phaseBadgeVariant(
  phase: HansonPhase,
): "easy" | "quality" | "long" | "muted" {
  if (phase === "base") return "easy"
  if (phase === "build") return "quality"
  if (phase === "peak") return "long"
  return "muted"
}
