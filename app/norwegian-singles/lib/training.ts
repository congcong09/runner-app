/**
 * 计算逻辑的核心：把「最近比赛成绩 + 每周可训练时间」映射成一份
 * 挪威式单次（Norwegian Singles）阈下训练计划。
 *
 * 所有规则都来自指南《Norwegian Singles — An Approach To Running》：
 *  - 4.1 配速设定：以最近比赛成绩为基准；3 分钟组 ≈ 12–15k 配速，
 *    6 分钟组 ≈ 20k/半马配速，10 分钟组 ≈ 25–30k 配速。
 *  - 2.2 质量课：组间站立/走路/极慢跑 60–120 秒；只把重复组算作质量分钟。
 *  - 2.1 每周结构：三次质量课 + 三次轻松跑 + 一次较长轻松跑（可减为 2 次质量）。
 *  - 1.3 轻松恢复：平均心率不超过实测最大心率的约 70%（上限，不是目标）。
 *  - 4.5 长距离跑：约为普通轻松跑时长的 1.7 倍。
 *  - 2.2 跑量：一旦适应，阈下工作约占每周训练时间的 20–25%。
 */

export type SessionId = "long" | "medium" | "short"
export type DayKind = "rest" | "easy" | "quality" | "long"

export interface RaceInput {
  /** 距离，单位米 */
  distance: number
  /** 成绩，单位秒 */
  seconds: number
}

export interface AthleteInput {
  race: RaceInput
  weeklyHours: number
  daysPerWeek: number
  sessions: 2 | 3
  maxHr: number
  /** 实测乳酸阈心率；留空则用 0.9 × 最大心率估算 */
  lthr?: number
}

export interface PaceRange {
  /** 快端，秒/公里（数值更小） */
  fast: number
  /** 慢端，秒/公里 */
  slow: number
}

export interface QualitySession {
  id: SessionId
  title: string
  purpose: string
  reps: number
  repSeconds: number
  recoverySeconds: number
  pace: PaceRange
  startPace: number
  workSeconds: number
  warmupSeconds: number
  cooldownSeconds: number
  totalSeconds: number
  intensityFactor: number
}

export interface DayPlan {
  day: string
  short: string
  kind: DayKind
  minutes: number
  detail: string
  session?: QualitySession
}

export interface Paces {
  short: PaceRange
  medium: PaceRange
  long: PaceRange
  easy: PaceRange
  threshold: number
  marathon: number
  racePace: number
}

export interface Totals {
  weeklyMinutes: number
  qualityWorkMinutes: number
  qualityShare: number
  easyMinutes: number
  longMinutes: number
  sessionMinutes: number
  /** 实际排进课表的分钟数（质量课 + 轻松跑 + 长距离） */
  plannedMinutes: number
  /** 单次上限之外、建议用轻松双跑补足的时间 */
  doubleMinutes: number
}

export interface LoadEstimate {
  weeklyTss: number
  ctl: number
  easyIf: number
}

export interface HrGuidance {
  maxHr: number
  easyCap: number
  lthr: number
  lthrEstimated: boolean
  qualityLow: number
  qualityHigh: number
}

export interface ProgressionWeek {
  label: string
  hours: number
  qualityMinutes: number
  note: string
  phase: "consolidate" | "build" | "hold"
}

export interface Plan {
  input: AthleteInput
  paces: Paces
  sessions: QualitySession[]
  days: DayPlan[]
  totals: Totals
  load: LoadEstimate
  hr: HrGuidance
  progression: ProgressionWeek[]
  warnings: string[]
}

/** Riegel 耐力换算指数，用于把一次比赛成绩外推到其他距离 */
export const RIEGEL_EXPONENT = 1.06

export const RACE_DISTANCES = [
  { value: 1500, label: "1500 米" },
  { value: 3000, label: "3000 米" },
  { value: 5000, label: "5 公里" },
  { value: 10000, label: "10 公里" },
  { value: 21097.5, label: "半程马拉松" },
  { value: 42195, label: "马拉松" },
] as const

export const EQUIVALENT_DISTANCES = [
  5000, 10000, 15000, 20000, 21097.5, 25000, 30000, 42195,
] as const

export const DISTANCE_LABELS: Record<number, string> = {
  1500: "1500 米",
  3000: "3000 米",
  5000: "5 公里",
  10000: "10 公里",
  15000: "15 公里",
  20000: "20 公里",
  21097.5: "半马",
  25000: "25 公里",
  30000: "30 公里",
  42195: "马拉松",
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** 用一次比赛成绩换算到另一个距离所需时间（秒） */
export function riegelTime(race: RaceInput, distance: number): number {
  if (!race.seconds || !race.distance) return 0
  return race.seconds * Math.pow(distance / race.distance, RIEGEL_EXPONENT)
}

export function equivalentPace(race: RaceInput, distance: number): number {
  const seconds = riegelTime(race, distance)
  return seconds / (distance / 1000)
}

/** 一次全力跑约 `seconds` 秒时的配速（秒/公里），用来近似 LT2（约 1 小时比赛配速） */
export function paceForEffort(race: RaceInput, seconds: number): number {
  if (!race.seconds || !race.distance) return 0
  const distance =
    race.distance * Math.pow(seconds / race.seconds, 1 / RIEGEL_EXPONENT)
  return seconds / (distance / 1000)
}

/** 每周课程模板：按训练天数与质量课次数决定课次分布 */
export function buildDayTemplate(daysPerWeek: number, sessions: number): DayKind[] {
  if (daysPerWeek >= 7) {
    return ["easy", "quality", "easy", "quality", "easy", "quality", "long"]
  }
  if (daysPerWeek === 6) {
    return ["rest", "quality", "easy", "quality", "easy", "quality", "long"]
  }
  if (daysPerWeek === 5) {
    return sessions === 3
      ? ["rest", "quality", "easy", "quality", "rest", "quality", "long"]
      : ["easy", "quality", "rest", "quality", "easy", "rest", "long"]
  }
  return ["rest", "quality", "easy", "quality", "rest", "rest", "long"]
}

const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
const DAY_SHORT = ["一", "二", "三", "四", "五", "六", "日"]

export const REP_PRESETS: Record<
  SessionId,
  { repSeconds: number; recoverySeconds: number }
> = {
  long: { repSeconds: 600, recoverySeconds: 105 },
  medium: { repSeconds: 360, recoverySeconds: 75 },
  short: { repSeconds: 180, recoverySeconds: 60 },
}

const SESSION_META: Record<
  SessionId,
  { title: string; purpose: string; repSeconds: number; recoverySeconds: number }
> = {
  long: {
    title: "长组阈下",
    purpose: "较长的不间断段落，练习维持受控强度",
    repSeconds: 600,
    recoverySeconds: 105,
  },
  medium: {
    title: "中组阈下",
    purpose: "一周的主要质量课，接近半马强度",
    repSeconds: 360,
    recoverySeconds: 75,
  },
  short: {
    title: "短组阈下",
    purpose: "较短的重复，控制疲劳、便于纠正配速",
    repSeconds: 180,
    recoverySeconds: 60,
  },
}

const WARMUP_SECONDS = 10 * 60
const COOLDOWN_SECONDS = 8.5 * 60
/** 原文：质量工作约占每周训练时间的 20–25%，取中值作为起始预算 */
const QUALITY_SHARE = 0.225
const LONG_RUN_RATIO = 1.7
const EASY_IF = 0.7
/** 单次跑步的合理上限：超出部分建议用轻松双跑分配（§6.2） */
const EASY_MAX_MINUTES = 90
const LONG_MAX_MINUTES = 120

function planRacePace(race: RaceInput): number {
  return race.seconds / (race.distance / 1000)
}

function buildSession(
  id: SessionId,
  targetWorkSeconds: number,
  pace: PaceRange,
  thresholdPace: number,
): QualitySession {
  const meta = SESSION_META[id]
  const minReps = id === "long" ? 1 : 2
  const maxReps = id === "long" ? 6 : id === "medium" ? 8 : 12
  const reps = clamp(
    Math.round(targetWorkSeconds / meta.repSeconds),
    minReps,
    maxReps,
  )
  const workSeconds = reps * meta.repSeconds
  const recoveryTotal = Math.max(reps - 1, 0) * meta.recoverySeconds
  const startPace = pace.slow
  const totalSeconds =
    WARMUP_SECONDS + workSeconds + recoveryTotal + COOLDOWN_SECONDS

  return {
    id,
    title: meta.title,
    purpose: meta.purpose,
    reps,
    repSeconds: meta.repSeconds,
    recoverySeconds: meta.recoverySeconds,
    pace,
    startPace,
    workSeconds,
    warmupSeconds: WARMUP_SECONDS,
    cooldownSeconds: COOLDOWN_SECONDS,
    totalSeconds,
    // 强度系数：以半马配速近似 LT2，按实际重复配速折算
    intensityFactor: thresholdPace / startPace,
  }
}

export function buildPlan(input: AthleteInput): Plan {
  const warnings: string[] = []
  const race = input.race
  // LT2 用「约 1 小时全力」的配速近似，阈下训练应低于它
  const threshold = paceForEffort(race, 3600)
  const marathon = equivalentPace(race, 42195)

  const paces: Paces = {
    short: {
      fast: equivalentPace(race, 12000),
      slow: equivalentPace(race, 15000),
    },
    medium: {
      fast: equivalentPace(race, 20000),
      slow: equivalentPace(race, 21097.5),
    },
    long: {
      fast: equivalentPace(race, 25000),
      slow: equivalentPace(race, 30000),
    },
    easy: { fast: marathon + 40, slow: marathon + 75 },
    threshold,
    marathon,
    racePace: race.seconds / (race.distance / 1000),
  }

  const weeklyMinutes = Math.round(input.weeklyHours * 60)
  // 预算以秒为单位：每周质量工作 ≈ 22.5% 的训练时间
  const budgetSeconds = weeklyMinutes * QUALITY_SHARE * 60

  // 三次课：长 40% / 中 33% / 短 27%；两次课则只保留中、短，并按比例重新分配预算
  const allocation: [SessionId, number][] =
    input.sessions === 3
      ? [
          ["long", 0.4],
          ["medium", 0.33],
          ["short", 0.27],
        ]
      : [
          ["medium", 0.55],
          ["short", 0.45],
        ]
  const sessions: QualitySession[] = allocation.map(([id, share]) =>
    buildSession(id, budgetSeconds * share, paces[id], threshold),
  )

  const sessionMinutes = sessions.reduce((sum, s) => sum + s.totalSeconds / 60, 0)
  const template = buildDayTemplate(input.daysPerWeek, input.sessions)
  const easyDays = template.filter((kind) => kind === "easy").length

  let remaining = weeklyMinutes - sessionMinutes
  if (easyDays > 0 && remaining < easyDays * 15) {
    warnings.push(
      "按当前每周时间，质量课已经占掉大部分时间。可以缩短组数，或把每周时间调高。",
    )
    remaining = Math.max(remaining, easyDays * 15)
  }
  const easyUnit = easyDays > 0 ? remaining / (easyDays + LONG_RUN_RATIO) : 0
  const easyMinutes = Math.round(clamp(easyUnit, 25, EASY_MAX_MINUTES))
  const longMinutes = Math.round(
    clamp(easyUnit * LONG_RUN_RATIO, 45, LONG_MAX_MINUTES),
  )
  // 被上限截掉的跑量：建议用轻松双跑（一天两练）分散，而不是把单次拉长
  const plannedMinutes =
    sessionMinutes + easyMinutes * easyDays + longMinutes
  const doubleMinutes = Math.max(0, Math.round(weeklyMinutes - plannedMinutes))

  if (doubleMinutes >= 15) {
    warnings.push(
      `按单次上限计算，还有约 ${doubleMinutes} 分钟没有安排：建议用 1–2 次轻松的「双跑」（每次 20–40 分钟）补足，而不是把某一次跑拉长。`,
    )
  }
  if (planRacePace(race) < 150 || planRacePace(race) > 480) {
    warnings.push(
      "输入的成绩与距离看起来不太匹配（配速超出 2:30–8:00/km）。请确认距离与时间是否对应同一场比赛。",
    )
  }
  if (input.weeklyHours > 8.5) {
    warnings.push(
      "每周超过约 8 小时之后，单次跑步的恢复会变难，原文建议可用「轻松双跑」分散跑量。",
    )
  }

  let qualityIndex = 0
  const days: DayPlan[] = template.map((kind, index) => {
    if (kind === "quality") {
      const session = sessions[qualityIndex++]
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        minutes: Math.round(session.totalSeconds / 60),
        detail: `${session.reps} × ${formatRepLength(session.repSeconds)}`,
        session,
      }
    }
    if (kind === "easy") {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        minutes: easyMinutes,
        detail: "低于第一阈值，能正常对话",
      }
    }
    if (kind === "long") {
      return {
        day: DAY_NAMES[index],
        short: DAY_SHORT[index],
        kind,
        minutes: longMinutes,
        detail: "轻松跑的延伸，不做成第二次质量课",
      }
    }
    return {
      day: DAY_NAMES[index],
      short: DAY_SHORT[index],
      kind: "rest",
      minutes: 0,
      detail: "完全休息，或散步、活动度练习",
    }
  })

  const qualityWorkMinutes = sessions.reduce((sum, s) => sum + s.workSeconds / 60, 0)
  const easyMinutesTotal = easyMinutes * easyDays

  const totals: Totals = {
    weeklyMinutes,
    qualityWorkMinutes,
    qualityShare: qualityWorkMinutes / Math.max(weeklyMinutes, 1),
    easyMinutes: easyMinutesTotal,
    longMinutes,
    sessionMinutes: Math.round(sessionMinutes),
    plannedMinutes: Math.round(plannedMinutes),
    doubleMinutes,
  }

  const weeklyTss = sessions.reduce((sum, session) => {
    const workHours = session.workSeconds / 3600
    const supportHours = (session.totalSeconds - session.workSeconds) / 3600
    return (
      sum +
      workHours * Math.pow(session.intensityFactor, 2) * 100 +
      supportHours * Math.pow(EASY_IF, 2) * 100
    )
  }, 0) +
    ((easyMinutesTotal + longMinutes) / 60) * Math.pow(EASY_IF, 2) * 100

  const lthrEstimated = !input.lthr
  const lthr = Math.round(input.lthr ?? input.maxHr * 0.9)
  const hr: HrGuidance = {
    maxHr: input.maxHr,
    easyCap: Math.round(input.maxHr * 0.7),
    lthr,
    lthrEstimated,
    qualityLow: lthr - 15,
    qualityHigh: lthr - 2,
  }

  const base = input.weeklyHours
  const ramp = (pct: number) => Math.round(base * (1 + pct) * 10) / 10
  const phases: {
    label: string
    hours: number
    phase: ProgressionWeek["phase"]
    note: string
  }[] = [
    {
      label: "第 1–4 周",
      hours: base,
      phase: "consolidate",
      note: "在可承受的跑量上巩固；先适应两次质量课，再加第三次",
    },
    {
      label: "第 5 周",
      hours: ramp(0.04),
      phase: "build",
      note: "小幅提升约 +4%，组结构与配速保持不变",
    },
    {
      label: "第 6 周",
      hours: ramp(0.08),
      phase: "build",
      note: "继续 +4%；恢复变差就停在这里",
    },
    {
      label: "第 7 周",
      hours: ramp(0.12),
      phase: "build",
      note: "本次进阶的上限，随后进入保持",
    },
    {
      label: "第 8 周",
      hours: ramp(0.12),
      phase: "hold",
      note: "保持 2–3 周再评估，用比赛或计时赛重设配速",
    },
  ]
  const progression: ProgressionWeek[] = phases.map((week) => ({
    ...week,
    qualityMinutes: Math.round(week.hours * 60 * QUALITY_SHARE),
  }))

  return {
    input,
    paces,
    sessions,
    days,
    totals,
    load: { weeklyTss: Math.round(weeklyTss), ctl: Math.round(weeklyTss), easyIf: EASY_IF },
    hr,
    progression,
    warnings,
  }
}

export function formatRepLength(seconds: number): string {
  if (seconds % 60 === 0) return `${seconds / 60} 分钟`
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

/** 把计划导出为可粘贴的纯文本 */
export function planToText(plan: Plan, formatPace: (s: number) => string): string {
  const lines: string[] = []
  lines.push("挪威式单次（Norwegian Singles）阈下训练周计划")
  lines.push(
    `基准比赛：${DISTANCE_LABELS[plan.input.race.distance] ?? plan.input.race.distance} ` +
      `${formatDuration(plan.input.race.seconds)}：每周 ${plan.input.weeklyHours} 小时 · ` +
      `${plan.input.daysPerWeek} 天 · ${plan.sessions.length} 次质量课`,
  )
  lines.push("")
  lines.push("配速区间")
  lines.push(`- 3 分钟组：${formatPace(plan.paces.short.slow)}–${formatPace(plan.paces.short.fast)} /km`)
  lines.push(`- 6 分钟组：${formatPace(plan.paces.medium.slow)}–${formatPace(plan.paces.medium.fast)} /km`)
  lines.push(`- 10 分钟组：${formatPace(plan.paces.long.slow)}–${formatPace(plan.paces.long.fast)} /km`)
  lines.push("")
  lines.push("每周安排")
  for (const day of plan.days) {
    const label =
      day.kind === "quality"
        ? `${day.session?.title}：${day.session?.reps} × ${formatRepLength(day.session?.repSeconds ?? 0)} @ ${formatPace(day.session?.startPace ?? 0)}/km，恢复 ${day.session?.recoverySeconds} 秒`
        : day.detail
    lines.push(
      `- ${day.day}（${day.kind === "rest" ? "休息" : `${day.minutes} 分钟`}）：${label}`,
    )
  }
  lines.push("")
  lines.push(
    `每周质量工作 ${Math.round(plan.totals.qualityWorkMinutes)} 分钟，占每周训练时间 ${(plan.totals.qualityShare * 100).toFixed(0)}%。`,
  )
  lines.push(
    `轻松跑心率上限 ${plan.hr.easyCap} 次/分；质量课心率可从 ${plan.hr.qualityLow} 逐步接近 ${plan.hr.qualityHigh}。`,
  )
  return lines.join("\n")
}

// —— 时间格式化 ——
export function formatPace(secondsPerKm: number): string {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "—"
  const total = Math.round(secondsPerKm)
  const min = Math.floor(total / 60)
  const sec = total % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

export function formatPacePer(secondsPerKm: number, meters: number): string {
  return formatPace((secondsPerKm * meters) / 1000)
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.round(totalSeconds)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }
  return `${m}:${String(s).padStart(2, "0")}`
}

export function formatMinutes(minutes: number): string {
  const total = Math.round(minutes)
  if (total < 60) return `${total} 分钟`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} 小时` : `${h} 小时 ${m} 分`
}

export function parseRaceTime(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parts = trimmed.split(":").map((part) => part.trim())
  if (parts.some((part) => part === "" || Number.isNaN(Number(part)))) return null
  const nums = parts.map(Number)
  if (nums.some((n) => n < 0)) return null
  if (nums.length === 1) return nums[0]
  // 分:秒 形式里秒必须小于 60；时:分:秒 形式里分、秒都必须小于 60
  if (nums.length === 2) {
    if (nums[1] >= 60) return null
    return nums[0] * 60 + nums[1]
  }
  if (nums.length === 3) {
    if (nums[1] >= 60 || nums[2] >= 60) return null
    return nums[0] * 3600 + nums[1] * 60 + nums[2]
  }
  return null
}
