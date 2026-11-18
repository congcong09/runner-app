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
import { GOAL_DISTANCES, RACE_DISTANCES } from "@/lib/race"
import {
  PLAN_LENGTHS,
  type DanielsForm,
  type DanielsPlan,
} from "../lib/daniels"

interface DanielsInputPanelProps {
  form: DanielsForm
  plan: DanielsPlan
  timeValid: boolean
  timeError: string | null
  onPatch: (patch: Partial<DanielsForm>) => void
  onExample: () => void
}

export function DanielsInputPanel({
  form,
  plan,
  timeValid,
  timeError,
  onPatch,
  onExample,
}: DanielsInputPanelProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Calculator
            className="size-4"
            style={{ color: "var(--method-accent)" }}
          />
          训练输入
        </CardTitle>
        <CardDescription className="text-xs">
          最近比赛决定 VDOT；目标距离决定质量课类型。
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExample}
            className="text-xs"
          >
            <RotateCcw className="size-3.5" />
            示例
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5 px-5 py-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="daniels-race-time">最近一场比赛</Label>
            <Badge variant="easy" className="text-[10px]">
              VDOT {plan.vdot.toFixed(1)}
            </Badge>
          </div>
          <div className="grid grid-cols-[1fr_1.15fr] gap-2">
            <Select
              value={String(form.raceDistance)}
              onValueChange={(value) =>
                onPatch({ raceDistance: Number(value) })
              }
            >
              <SelectTrigger id="daniels-race-distance" className="w-full">
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
              id="daniels-race-time"
              inputMode="numeric"
              placeholder="42:00"
              value={form.raceTime}
              aria-invalid={!timeValid}
              onChange={(event) => onPatch({ raceTime: event.target.value })}
              className="tabular"
            />
          </div>
          {!timeValid && (
            <p className="text-destructive text-[11px]">
              {timeError ?? "请输入有效的比赛成绩。"}
            </p>
          )}
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            用 4–8 周内的全力比赛或计时赛；训练中的“感觉很快”不能替代比赛成绩。
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="daniels-goal">目标比赛</Label>
            <Select
              value={String(form.goalDistance)}
              onValueChange={(value) =>
                onPatch({ goalDistance: Number(value) })
              }
            >
              <SelectTrigger id="daniels-goal" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_DISTANCES.map((goal) => (
                  <SelectItem key={goal.value} value={String(goal.value)}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="daniels-weeks">计划长度</Label>
            <Select
              value={String(form.weeks)}
              onValueChange={(value) => onPatch({ weeks: Number(value) })}
            >
              <SelectTrigger id="daniels-weeks" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_LENGTHS.map((weeks) => (
                  <SelectItem key={weeks} value={String(weeks)}>
                    {weeks} 周
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="daniels-weekly-km">每周跑量</Label>
            <span className="tabular text-sm font-medium">
              {form.weeklyKm} 公里
            </span>
          </div>
          <Slider
            id="daniels-weekly-km"
            aria-label="每周跑量（公里）"
            min={20}
            max={120}
            step={5}
            value={[form.weeklyKm]}
            onValueChange={([value]) => onPatch({ weeklyKm: value })}
          />
          <div className="text-muted-foreground flex justify-between text-[11px]">
            <span>20 公里</span>
            <span className="text-foreground/70">当前稳定周跑量</span>
            <span>120 公里</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="daniels-days">每周训练天数</Label>
          <Select
            value={String(form.daysPerWeek)}
            onValueChange={(value) =>
              onPatch({ daysPerWeek: Number(value) })
            }
          >
            <SelectTrigger id="daniels-days" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[7, 6, 5, 4, 3].map((days) => (
                <SelectItem key={days} value={String(days)}>
                  {days} 天
                  {days >= 5 ? " · 2 节 Q 课" : " · 1 节 Q 课"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            丹尼尔斯的 Q 课指质量课（T / I / R / M）。天数不足时只保留 1 节。
          </p>
        </div>

        <p className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-[11px] leading-relaxed">
          输入只保存在本机浏览器。配速由公开公式换算，遇到高温、坡度、疲劳时以主观用力感为准。
        </p>
      </CardContent>
    </Card>
  )
}
