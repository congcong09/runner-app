/** 比赛距离、等效成绩与配速换算。 */

export interface RaceInput {
  /** 距离，单位米 */
  distance: number
  /** 成绩，单位秒 */
  seconds: number
}

export const RIEGEL_EXPONENT = 1.06

export const RACE_DISTANCES = [
  { value: 1500, label: "1500 米" },
  { value: 3000, label: "3000 米" },
  { value: 5000, label: "5 公里" },
  { value: 10000, label: "10 公里" },
  { value: 21097.5, label: "半程马拉松" },
  { value: 42195, label: "马拉松" },
] as const

export const GOAL_DISTANCES = [
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

/** 配速合理区间（秒/公里）：2:00–10:00。 */
export const PACE_MIN = 120
export const PACE_MAX = 600

export function racePace(race: RaceInput): number {
  return race.seconds / (race.distance / 1000)
}

export function riegelTime(race: RaceInput, distance: number): number {
  if (!race.seconds || !race.distance) return 0
  return race.seconds * Math.pow(distance / race.distance, RIEGEL_EXPONENT)
}

export function equivalentPace(race: RaceInput, distance: number): number {
  const seconds = riegelTime(race, distance)
  return seconds / (distance / 1000)
}

/**
 * 一次全力跑约 `seconds` 秒时的配速（秒/公里）。
 * 用于近似 LT2 / 一小时比赛配速。
 */
export function paceForEffort(race: RaceInput, seconds: number): number {
  if (!race.seconds || !race.distance) return 0
  const distance =
    race.distance * Math.pow(seconds / race.seconds, 1 / RIEGEL_EXPONENT)
  return seconds / (distance / 1000)
}

export function isPlausibleRace(race: RaceInput): boolean {
  if (!race.distance || !race.seconds) return false
  const pace = racePace(race)
  return pace >= PACE_MIN && pace <= PACE_MAX
}

export function distanceLabel(distance: number): string {
  return DISTANCE_LABELS[distance] ?? `${(distance / 1000).toFixed(1)} 公里`
}
