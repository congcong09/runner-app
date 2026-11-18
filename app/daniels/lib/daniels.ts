/**
 * 丹尼尔斯跑步公式（Daniels / Gilbert）实现。
 *
 * 核心方程：
 *  - 跑步氧耗：VO2 = -4.60 + 0.182258·v + 0.000104·v²（v 为米/分钟）
 *  - 可持续 %VO2max：0.8 + 0.1894393·e^(-0.012778t) + 0.2989558·e^(-0.1932605t)
 *  - VDOT = 比赛 VO2 / 该成绩可持续的 %VO2max
 *
 * 训练强度采用 Daniels 公开的 %VDOT 区间：E 59–74%、M 81.5%、T 88%、
 * I 97.5%、R 105.5%。页面里的配速是公式结果，不照抄书中的整数秒表，
 * 因此可能与某些版本表格相差几秒。
 */

import { distanceLabel, riegelTime, type RaceInput } from "@/lib/race"

export interface PaceRange {
  fast: number
  slow: number
}

export type DanielsPhase = "base" | "build" | "peak" | "taper"
export type DanielsDayKind = "quality" | "easy" | "long" | "rest"
export type WorkoutCode = "T" | "I" | "R" | "M" | "strides"

export interface DanielsForm {
  raceDistance: number
  raceTime: string
  weeklyKm: number
  daysPerWeek: number
  goalDistance: number
  weeks: number
}

export interface DanielsInput {
  race: RaceInput
  weeklyKm: number
  daysPerWeek: number
  goalDistance: number
  weeks: number
}

export interface DanielsPaces {
  vdot: number
  easy: PaceRange
  easyTarget: number
  marathon: number
  threshold: number
  interval: number
  repetition: number
}

export interface DanielsWorkout {
  id: string
  code: WorkoutCode
  label: string
  title: string
  purpose: string
  reps: number
  repMeters: number
  pace: number
  recoverySeconds: number
  warmupSeconds: number
  cooldownSeconds: number
  workKm: number
  totalKm: number
  totalSeconds: number
}

export interface DanielsDay {
  day: string
  short: string
  kind: DanielsDayKind
  km: number
  minutes: number
  detail: string
  workout?: DanielsWorkout
}

export interface DanielsWeekPlan {
  week: number
  phase: DanielsPhase
  phaseLabel: string
  km: number
  longKm: number
  focus: string
  note: string
  days: DanielsDay[]
  workouts: DanielsWorkout[]
  qualityWorkKm: number
  qualitySessionKm: number
  easyKm: number
  qualityShare: number
}

export interface DanielsPlan {
  input: DanielsInput
  vdot: number
  paces: DanielsPaces
  equivalent: { distance: number; label: string; seconds: number; pace: number }[]
  weeks: DanielsWeekPlan[]
  peakKm: number
  warnings: string[]
}

export const DANIELS_DEFAULT_FORM: DanielsForm = {
  raceDistance: 10000,
  raceTime: "42:00",
  weeklyKm: 50,
  daysPerWeek: 5,
  goalDistance: 10000,
  weeks: 12,
}

export const DANIELS_EXAMPLE_FORM: DanielsForm = {
  raceDistance: 5000,
  raceTime: "20:00",
  weeklyKm: 45,
  daysPerWeek: 5,
  goalDistance: 5000,
  weeks: 12,
}

export const PLAN_LENGTHS = [8, 12, 16] as const

const VO2_INTERCEPT = -4.6
const VO2_LINEAR = 0.182258
const VO2_QUADRATIC = 0.000104

export const DANIELS_INTENSITY = {
  easyFast: 0.74,
  easySlow: 0.59,
  easyTarget: 0.665,
  marathon: 0.815,
  threshold: 0.88,
  interval: 0.975,
  repetition: 1.055,
} as const

const PHASE_LABEL: Record<DanielsPhase, string> = {
  base: "基础期",
  build: "构建期",
  peak: "巅峰期",
  taper: "减量期",
}

const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
const DAY_SHORT = ["一", "二", "三", "四", "五", "六", "日"]

const GOAL_META: Record<
  number,
  { longRatio: number; q1Share: number; q2Share: number }
> = {
  5000: { longRatio: 0.2, q1Share: 0.2, q2Share: 0.17 },
  10000: { longRatio: 0.24, q1Share: 0.2, q2Share: 0.17 },
  21097.5: { longRatio: 0.27, q1Share: 0.22, q2Share: 0.18 },
  42195: { longRatio: 0.3, q1Share: 0.22, q2Share: 0.18 },
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** 比赛成绩 → VO2（米/分钟）。 */
function raceVo2(distanceM: number, seconds: number): number {
  const velocity = distanceM / (seconds / 60)
  return (
    VO2_INTERCEPT +
    VO2_LINEAR * velocity +
    VO2_QUADRATIC * velocity * velocity
  )
}

/** 给定比赛时长，可持续的 %VO2max。 */
function sustainableFraction(seconds: number): number {
  const minutes = seconds / 60
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * minutes) +
    0.2989558 * Math.exp(-0.1932605 * minutes)
  )
}

export function vdotFromRace(race: RaceInput): number {
  if (!race.distance || !race.seconds) return 0
  return raceVo2(race.distance, race.seconds) / sustainableFraction(race.seconds)
}

/** 由 VDOT 与强度比例反解速度（米/分钟）。 */
export function velocityAtVdot(vdot: number, fraction: number): number {
  const target = vdot * fraction
  const c = VO2_INTERCEPT - target
  const discriminant = VO2_LINEAR * VO2_LINEAR - 4 * VO2_QUADRATIC * c
  if (discriminant <= 0) return 0
  return (-VO2_LINEAR + Math.sqrt(discriminant)) / (2 * VO2_QUADRATIC)
}

/** 由 VDOT 与强度比例得到配速（秒/公里）。 */
export function paceAtVdot(vdot: number, fraction: number): number {
  const velocity = velocityAtVdot(vdot, fraction)
  if (velocity <= 0) return 0
  return 60000 / velocity
}

export function buildDanielsPaces(vdot: number): DanielsPaces {
  return {
    vdot,
    easy: {
      fast: paceAtVdot(vdot, DANIELS_INTENSITY.easyFast),
      slow: paceAtVdot(vdot, DANIELS_INTENSITY.easySlow),
    },
    easyTarget: paceAtVdot(vdot, DANIELS_INTENSITY.easyTarget),
    marathon: paceAtVdot(vdot, DANIELS_INTENSITY.marathon),
    threshold: paceAtVdot(vdot, DANIELS_INTENSITY.threshold),
    interval: paceAtVdot(vdot, DANIELS_INTENSITY.interval),
    repetition: paceAtVdot(vdot, DANIELS_INTENSITY.repetition),
  }
}

/** 某周的目标比赛项目 + 阶段决定两节质量课的类型。 */
function qualityCodes(
  goalDistance: number,
  phase: DanielsPhase,
): [WorkoutCode, WorkoutCode] {
  if (phase === "base") return ["T", "strides"]
  if (phase === "taper") return ["T", "R"]
  if (phase === "peak") {
    if (goalDistance === 5000) return ["I", "R"]
    if (goalDistance === 10000) return ["T", "I"]
    if (goalDistance === 21097.5) return ["T", "M"]
    return ["M", "T"]
  }
  // build
  if (goalDistance === 5000) return ["I", "T"]
  if (goalDistance === 10000) return ["T", "I"]
  if (goalDistance === 21097.5) return ["T", "M"]
  return ["T", "M"]
}

const WORKOUT_META: Record<
  WorkoutCode,
  {
    label: string
    repMeters: number
    recoverySeconds: number
    minReps: number
    maxReps: number
    purpose: string
  }
> = {
  T: {
    label: "T 巡航",
    repMeters: 1000,
    recoverySeconds: 60,
    minReps: 3,
    maxReps: 10,
    purpose: "在“舒适而吃力”的阈值强度下累积刺激；单次质量工作不超过周跑量约 10%。",
  },
  I: {
    label: "I 间歇",
    repMeters: 800,
    recoverySeconds: 150,
    minReps: 4,
    maxReps: 10,
    purpose: "提高最大摄氧量；每组 3–5 分钟，组间充分恢复，保证速度而不堆积乳酸。",
  },
  R: {
    label: "R 重复",
    repMeters: 400,
    recoverySeconds: 120,
    minReps: 6,
    maxReps: 16,
    purpose: "改善跑步经济性与速度；保持放松、快速、动作不僵硬，组间完全恢复。",
  },
  M: {
    label: "M 马拉松配速",
    repMeters: 2000,
    recoverySeconds: 60,
    minReps: 2,
    maxReps: 6,
    purpose: "练习目标马拉松配速、补给与节奏；不要在疲劳时硬追配速。",
  },
  strides: {
    label: "加速跑",
    repMeters: 100,
    recoverySeconds: 60,
    minReps: 6,
    maxReps: 8,
    purpose: "短而快的加速跑，只刺激神经肌肉与跑姿，不产生明显疲劳。",
  },
}

function formatReps(code: WorkoutCode, reps: number, repMeters: number): string {
  if (code === "strides") return `${reps} × 20 秒`
  if (repMeters >= 1000) return `${reps} × ${repMeters / 1000} km`
  return `${reps} × ${repMeters} m`
}

/**
 * 在给定的「整节课总公里数」预算内生成一节质量课。
 * 总公里包含热身、冷身与组间慢跑恢复；workKm 才是真正的质量工作。
 */
export function buildDanielsWorkout(
  code: WorkoutCode,
  budgetKm: number,
  paces: DanielsPaces,
  id: string,
): DanielsWorkout {
  const meta = WORKOUT_META[code]
  const warmupSeconds = code === "strides" ? 10 * 60 : 15 * 60
  const cooldownSeconds = code === "strides" ? 5 * 60 : 10 * 60
  const supportKm = (warmupSeconds + cooldownSeconds) / paces.easyTarget
  const workoutPace: Record<Exclude<WorkoutCode, "strides">, number> = {
    T: paces.threshold,
    I: paces.interval,
    R: paces.repetition,
    M: paces.marathon,
  }
  const pace = code === "strides" ? paces.repetition : workoutPace[code]

  let reps = code === "strides" ? 8 : 1
  if (code !== "strides") {
    reps = clamp(
      Math.round(
        Math.max(0.5, budgetKm - supportKm) /
          (meta.repMeters / 1000),
      ),
      meta.minReps,
      meta.maxReps,
    )
  }

  const workoutFor = (count: number) => {
    const workKm = (count * meta.repMeters) / 1000
    const recoveryKm =
      ((count - 1) * meta.recoverySeconds) / paces.easyTarget
    const totalKm = supportKm + workKm + recoveryKm
    const totalSeconds =
      warmupSeconds +
      cooldownSeconds +
      (code === "strides" ? count * 20 : workKm * pace) +
      (count - 1) * meta.recoverySeconds
    return { workKm, totalKm, totalSeconds }
  }

  if (code === "strides") {
    reps = clamp(Math.round(budgetKm / 0.65), meta.minReps, meta.maxReps)
  } else {
    let candidate = workoutFor(reps)
    while (candidate.totalKm > budgetKm * 1.08 && reps > meta.minReps) {
      reps -= 1
      candidate = workoutFor(reps)
    }
    while (candidate.totalKm < budgetKm * 0.82 && reps < meta.maxReps) {
      reps += 1
      candidate = workoutFor(reps)
    }
  }

  const { workKm, totalKm, totalSeconds } = workoutFor(reps)

  return {
    id,
    code,
    label: meta.label,
    title: `${formatReps(code, reps, meta.repMeters)} @ ${code === "strides" ? "R" : code}`,
    purpose: meta.purpose,
    reps,
    repMeters: meta.repMeters,
    pace,
    recoverySeconds: meta.recoverySeconds,
    warmupSeconds,
    cooldownSeconds,
    workKm,
    totalKm,
    totalSeconds,
  }
}

function dayTemplate(
  daysPerWeek: number,
  qualityCount: number,
): DanielsDayKind[] {
  if (daysPerWeek >= 7) {
    return ["quality", "easy", "quality", "easy", "easy", "easy", "long"]
  }
  if (daysPerWeek === 6) {
    return ["rest", "quality", "easy", "quality", "easy", "easy", "long"]
  }
  if (daysPerWeek === 5) {
    return qualityCount === 2
      ? ["rest", "quality", "easy", "quality", "rest", "easy", "long"]
      : ["rest", "quality", "easy", "easy", "rest", "easy", "long"]
  }
  if (daysPerWeek === 4) {
    return ["rest", "quality", "easy", "rest", "easy", "rest", "long"]
  }
  return ["rest", "quality", "rest", "easy", "rest", "rest", "long"]
}

interface PhaseSchedule {
  base: number
  build: number
  peak: number
  taper: number
}

function phaseSchedule(weeks: number): PhaseSchedule {
  const base = Math.max(2, Math.round(weeks * 0.35))
  const build = Math.max(2, Math.round(weeks * 0.3))
  const peak = Math.max(1, Math.round(weeks * 0.2))
  const taper = Math.max(1, weeks - base - build - peak)
  return { base, build, peak, taper }
}

function phaseForWeek(week: number, schedule: PhaseSchedule): DanielsPhase {
  if (week <= schedule.base) return "base"
  if (week <= schedule.base + schedule.build) return "build"
  if (week <= schedule.base + schedule.build + schedule.peak) return "peak"
  return "taper"
}

function phaseLocalIndex(
  week: number,
  phase: DanielsPhase,
  schedule: PhaseSchedule,
): number {
  if (phase === "base") return week
  if (phase === "build") return week - schedule.base
  if (phase === "peak") return week - schedule.base - schedule.build
  return week - schedule.base - schedule.build - schedule.peak
}

function weekKm(
  baseKm: number,
  week: number,
  weeks: number,
  phase: DanielsPhase,
  schedule: PhaseSchedule,
): number {
  let factor = 1
  if (phase === "base") {
    factor =
      0.94 +
      0.06 *
        ((phaseLocalIndex(week, phase, schedule) - 1) /
          Math.max(1, schedule.base - 1))
  } else if (phase === "build") {
    factor =
      1 +
      0.06 *
        (phaseLocalIndex(week, phase, schedule) /
          Math.max(1, schedule.build))
  } else if (phase === "peak") {
    factor = 1.06
  } else {
    factor = week === weeks ? 0.65 : 0.8
  }
  // 每 4 周一次减量，避免连续加量；减量期不再额外打折。
  if (week % 4 === 0 && phase !== "taper") factor *= 0.86
  return Math.max(12, Math.round(baseKm * factor))
}

function focusFor(
  goalDistance: number,
  phase: DanielsPhase,
): string {
  if (phase === "base") return "有氧基础 + T 巡航"
  if (phase === "build") {
    if (goalDistance === 5000) return "I 间歇 + T 巡航"
    if (goalDistance === 10000) return "T 巡航 + I 间歇"
    if (goalDistance === 21097.5) return "T 巡航 + M 配速"
    return "T 巡航 + M 配速"
  }
  if (phase === "peak") {
    if (goalDistance === 5000) return "I 间歇 + R 重复"
    if (goalDistance === 10000) return "T 巡航 + I 间歇"
    if (goalDistance === 21097.5) return "T 巡航 + M 配速"
    return "M 配速 + T 巡航"
  }
  return "减量 + 比赛配速触感"
}

function noteFor(
  goalDistance: number,
  phase: DanielsPhase,
  week: number,
): string {
  if (phase === "base") {
    return "先把 E 跑量稳住；T 巡航只占周跑量的一小部分，加速跑保持放松。"
  }
  if (phase === "build") {
    return "质量课逐步转向目标专项；每 4 周检查一次恢复与睡眠。"
  }
  if (phase === "peak") {
    if (goalDistance === 5000) {
      return "I / R 是本周核心；组间恢复要足，宁可少一组也不要跑成全力冲刺。"
    }
    if (goalDistance === 10000) {
      return "T 与 I 交替刺激；比赛前 10 天开始减少总跑量。"
    }
    if (goalDistance === 21097.5) {
      return "M 配速块练习半马节奏；长距离最后可加入短段 M。"
    }
    return "M 配速块和长距离里的目标配速是本周重点；补给也一起演练。"
  }
  if (week >= 15) {
    return "赛前最后一周：只保留少量比赛配速触感，睡眠优先。"
  }
  return "减量 20–35%，保留短而快的刺激；不要用额外跑量弥补减量。"
}

function longRunDetail(goalDistance: number, phase: DanielsPhase): string {
  if (phase === "base") return "E 配速，保持能对话；最后可加 4×20 秒加速。"
  if (phase === "build") return "E 配速，稳步延长；不做成第二次质量课。"
  if (goalDistance === 5000) return "E 配速，轻松完成；短距离目标不需要超长跑。"
  if (goalDistance === 10000) return "E 配速；最后 3–5 公里可略接近 M。"
  if (goalDistance === 21097.5) return "E 配速；巅峰期最后 4–6 公里 @ M。"
  return "E 配速；巅峰期最后 6–10 公里 @ M，并演练补给。"
}

function buildWeek(
  input: DanielsInput,
  week: number,
  paces: DanielsPaces,
  baseKm: number,
  schedule: PhaseSchedule,
): DanielsWeekPlan {
  const phase = phaseForWeek(week, schedule)
  const km = weekKm(baseKm, week, input.weeks, phase, schedule)
  const meta = GOAL_META[input.goalDistance] ?? GOAL_META[10000]
  const qualityCount = input.daysPerWeek >= 5 ? 2 : 1
  const codes = qualityCodes(input.goalDistance, phase)

  const longKm = clamp(
    Math.round(km * meta.longRatio),
    input.goalDistance >= 21097.5 ? 10 : 8,
    input.goalDistance === 5000
      ? 18
      : input.goalDistance === 10000
        ? 22
        : input.goalDistance === 21097.5
          ? 30
          : 32,
  )

  const q1Budget = km * (qualityCount === 2 ? meta.q1Share : 0.24)
  const q2Budget = km * meta.q2Share
  const workouts: DanielsWorkout[] = [
    buildDanielsWorkout(codes[0], q1Budget, paces, `w${week}-q1`),
  ]
  if (qualityCount === 2) {
    workouts.push(
      buildDanielsWorkout(codes[1], q2Budget, paces, `w${week}-q2`),
    )
  }

  const qualitySessionKm = workouts.reduce(
    (sum, workout) => sum + workout.totalKm,
    0,
  )
  const qualityWorkKm = workouts.reduce(
    (sum, workout) => sum + workout.workKm,
    0,
  )
  const template = dayTemplate(input.daysPerWeek, qualityCount)
  const easyDays = template.filter((kind) => kind === "easy").length
  const remaining = km - qualitySessionKm - longKm
  const easyEach = Math.max(3, remaining / Math.max(1, easyDays))
  const easyKm = easyEach * easyDays

  let workoutIndex = 0
  const days: DanielsDay[] = template.map((kind, index) => {
    if (kind === "quality") {
      const workout = workouts[workoutIndex++]
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        km: Math.round(workout.totalKm * 10) / 10,
        minutes: Math.round(workout.totalSeconds / 60),
        detail: workout.title,
        workout,
      }
    }
    if (kind === "long") {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        km: longKm,
        minutes: Math.round((longKm * paces.easyTarget) / 60),
        detail: longRunDetail(input.goalDistance, phase),
      }
    }
    if (kind === "easy") {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        km: Math.round(easyEach * 10) / 10,
        minutes: Math.round((easyEach * paces.easyTarget) / 60),
        detail: "E 配速，能正常对话；最后可加 4×20 秒加速。",
      }
    }
    return {
      day: DAY_NAMES[index],
      short: DAY_SHORT[index],
      kind: "rest",
      km: 0,
      minutes: 0,
      detail: "完全休息，或散步、活动度练习。",
    }
  })

  return {
    week,
    phase,
    phaseLabel: PHASE_LABEL[phase],
    km,
    longKm,
    focus: focusFor(input.goalDistance, phase),
    note: noteFor(input.goalDistance, phase, week),
    days,
    workouts,
    qualityWorkKm,
    qualitySessionKm,
    easyKm,
    qualityShare: qualityWorkKm / Math.max(km, 1),
  }
}

export function buildDanielsPlan(input: DanielsInput): DanielsPlan {
  const weeks = Math.round(clamp(input.weeks, 8, 16))
  const weeklyKm = Math.round(clamp(input.weeklyKm, 15, 160))
  const daysPerWeek = Math.round(clamp(input.daysPerWeek, 3, 7))
  const goalDistance = GOAL_META[input.goalDistance]
    ? input.goalDistance
    : 10000

  const vdot = vdotFromRace(input.race)
  const paces = buildDanielsPaces(vdot)
  const schedule = phaseSchedule(weeks)
  const planInput: DanielsInput = {
    race: input.race,
    weeklyKm,
    daysPerWeek,
    goalDistance,
    weeks,
  }

  const weekPlans = Array.from({ length: weeks }, (_, index) =>
    buildWeek(planInput, index + 1, paces, weeklyKm, schedule),
  )

  const warnings: string[] = []
  if (vdot < 28) {
    warnings.push(
      "VDOT 低于 28：先把重点放在轻松跑与规律性上，质量课只保留 T 巡航和加速跑。",
    )
  }
  if (vdot > 78) {
    warnings.push(
      "VDOT 高于 78：公式外推在精英区间误差会放大，建议用实测配速和教练反馈校准。",
    )
  }
  if (daysPerWeek < 5) {
    warnings.push(
      "每周少于 5 天时只安排 1 节质量课。丹尼尔斯的典型周计划是 5–6 天，含 2 节 Q 课。",
    )
  }
  if (goalDistance === 42195 && weeklyKm < 45) {
    warnings.push(
      "马拉松目标建议先把稳定周跑量提高到 45–50 公里，再增加 M 配速与长距离。",
    )
  }
  if (goalDistance === 5000 && weeklyKm > 85) {
    warnings.push(
      "5 公里目标不需要无限堆跑量；超出的时间优先用于轻松跑和恢复。",
    )
  }
  if (weeks === 8) {
    warnings.push(
      "8 周计划假设你已有稳定有氧基础，只做赛前专项；不适合从零开始。",
    )
  }
  const peakWeek = weekPlans.reduce((peak, week) =>
    week.km > peak.km ? week : peak,
  )
  if (peakWeek.qualityWorkKm / Math.max(peakWeek.km, 1) > 0.16) {
    warnings.push(
      "质量工作接近或超过周跑量 16%：如果恢复变差，先减少组数，而不是降轻松跑配速。",
    )
  }

  const equivalentDistances = [5000, 10000, 21097.5, 42195]
  const equivalent = equivalentDistances.map((distance) => {
    const seconds = riegelTime(input.race, distance)
    return {
      distance,
      label: distanceLabel(distance),
      seconds,
      pace: seconds / (distance / 1000),
    }
  })

  return {
    input: planInput,
    vdot,
    paces,
    equivalent,
    weeks: weekPlans,
    peakKm: peakWeek.km,
    warnings,
  }
}

export function phaseBadgeVariant(
  phase: DanielsPhase,
): "easy" | "quality" | "long" | "muted" {
  if (phase === "base") return "easy"
  if (phase === "build") return "quality"
  if (phase === "peak") return "long"
  return "muted"
}

export const DANIELS_PHASE_LABEL = PHASE_LABEL
