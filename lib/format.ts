/** 配速、时长与比赛成绩的统一格式化工具。 */

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

/** 解析 19:30、1:27:30 或纯秒数，非法输入返回 null。 */
export function parseRaceTime(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parts = trimmed.split(":").map((part) => part.trim())
  if (parts.some((part) => part === "" || Number.isNaN(Number(part)))) return null
  const nums = parts.map(Number)
  if (nums.some((n) => n < 0)) return null
  if (nums.length === 1) return nums[0]
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

/** 输入框展示用：秒数 → 1:27:30 / 19:30。 */
export function formatRaceTimeInput(totalSeconds: number): string {
  return formatDuration(totalSeconds)
}
