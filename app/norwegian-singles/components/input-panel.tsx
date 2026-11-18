import { Calculator, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  DISTANCE_LABELS,
  RACE_DISTANCES,
  formatDuration,
  riegelTime,
  type Plan,
} from "../lib/training"
import { cn } from "@/lib/utils"

export interface FormState {
  raceDistance: number
  raceTime: string
  weeklyHours: number
  daysPerWeek: number
  sessions: 2 | 3
  maxHr: number
  lthr: string
}

interface InputPanelProps {
  form: FormState
  plan: Plan
  timeValid: boolean
  timeError: string | null
  onPatch: (patch: Partial<FormState>) => void
  onExample: () => void
}

const EQUIV_PREVIEW = [5000, 10000, 21097.5]

export function InputPanel({
  form,
  plan,
  timeValid,
  timeError,
  onPatch,
  onExample,
}: InputPanelProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Calculator className="text-primary size-4" />
          训练输入
        </CardTitle>
        <CardDescription className="text-xs">
          依据最近状态与可用时间，无需乳酸仪。
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={onExample} className="text-xs">
            <RotateCcw className="size-3.5" />
            示例
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5 px-5 py-5">
        {/* 比赛成绩 */}
        <div className="space-y-2">
          <Label htmlFor="race-time">最近一场比赛</Label>
          <div className="grid grid-cols-[1fr_1.15fr] gap-2">
            <Select
              value={String(form.raceDistance)}
              onValueChange={(value) => onPatch({ raceDistance: Number(value) })}
            >
              <SelectTrigger id="race-distance" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RACE_DISTANCES.map((race) => (
                  <SelectItem key={race.value} value={String(race.value)}>
                    {race.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="race-time"
              inputMode="numeric"
              placeholder="1:27:30"
              value={form.raceTime}
              aria-invalid={!timeValid}
              onChange={(event) => onPatch({ raceTime: event.target.value })}
              className="tabular"
            />
          </div>
          {timeValid ? (
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-[11px]">
              <span>等效体能</span>
              {EQUIV_PREVIEW.map((distance) => (
                <span key={distance} className="text-foreground/80 tabular">
                  {DISTANCE_LABELS[distance]}{" "}
                  {formatDuration(riegelTime(plan.input.race, distance))}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-destructive text-[11px]">
              {timeError ?? "请输入有效的比赛成绩。"}
            </p>
          )}
        </div>

        <Separator />

        {/* 每周时间 */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="weekly-hours">每周训练时间</Label>
            <span className="text-sm font-medium tabular">
              {form.weeklyHours.toFixed(1)} 小时
            </span>
          </div>
          <Slider
            id="weekly-hours"
            aria-label="每周训练时间（小时）"
            min={4}
            max={12}
            step={0.5}
            value={[form.weeklyHours]}
            onValueChange={([value]) => onPatch({ weeklyHours: value })}
          />
          <div className="text-muted-foreground flex justify-between text-[11px]">
            <span>4 小时</span>
            <span className="text-foreground/70">原文主要场景：5–9 小时</span>
            <span>12 小时</span>
          </div>
        </div>

        <Separator />

        {/* 天数 & 质量课次数 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="days">每周训练天数</Label>
            <Select
              value={String(form.daysPerWeek)}
              onValueChange={(value) => {
                const days = Number(value)
                onPatch({
                  daysPerWeek: days,
                  sessions: days <= 4 ? 2 : form.sessions,
                })
              }}
            >
              <SelectTrigger id="days" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[7, 6, 5, 4].map((days) => (
                  <SelectItem key={days} value={String(days)}>
                    {days} 天
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>质量课次数</Label>
            <div className="bg-muted grid h-9 grid-cols-2 gap-1 rounded-md p-[3px]">
              {([2, 3] as const).map((count) => {
                const disabled = count === 3 && form.daysPerWeek <= 4
                return (
                  <button
                    key={count}
                    type="button"
                    disabled={disabled}
                    aria-pressed={form.sessions === count}
                    onClick={() => onPatch({ sessions: count })}
                    className={cn(
                      "rounded-[5px] text-[13px] font-medium transition-all",
                      form.sessions === count
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                      disabled && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {count} 次
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* 心率 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>心率参考</Label>
            <Badge variant="muted" className="text-[10px]">
              {plan.hr.lthrEstimated ? "LTHR 为估算值" : "使用实测 LTHR"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-[11px]">最大心率</span>
              <Input
                type="number"
                min={120}
                max={230}
                placeholder="190"
                value={form.maxHr || ""}
                onChange={(event) =>
                  onPatch({ maxHr: Number(event.target.value) || 0 })
                }
                className="tabular"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-[11px]">
                乳酸阈心率（可选）
              </span>
              <Input
                type="number"
                min={100}
                max={220}
                placeholder="留空则估算"
                value={form.lthr}
                onChange={(event) => onPatch({ lthr: event.target.value })}
                className="tabular"
              />
            </div>
          </div>
        </div>

        <p className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-[11px] leading-relaxed">
          数据仅保存在本机浏览器。所有配速都由 Riegel 换算外推，供训练参考；出现疼痛或异常疲劳时以身体反应为准。
        </p>
      </CardContent>
    </Card>
  )
}
