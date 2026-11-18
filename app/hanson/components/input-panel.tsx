import { Calculator, Flame, RotateCcw } from "lucide-react"

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
import { formatPace } from "@/lib/format"
import {
  HANSON_GOAL_TIME_DEFAULT,
  hansonPlanWeeks,
  type HansonForm,
  type HansonPlan,
} from "../lib/hanson"

interface HansonInputPanelProps {
  form: HansonForm
  plan: HansonPlan
  timeValid: boolean
  timeError: string | null
  onPatch: (patch: Partial<HansonForm>) => void
  onExample: () => void
}

export function HansonInputPanel({
  form,
  plan,
  timeValid,
  timeError,
  onPatch,
  onExample,
}: HansonInputPanelProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Calculator
            className="size-4"
            style={{ color: "var(--method-accent)" }}
          />
          目标与跑量
        </CardTitle>
        <CardDescription className="text-xs">
          汉森配速由目标成绩决定，不按当前体能推算。
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
          <Label htmlFor="hanson-goal">目标比赛</Label>
          <Select
            value={form.goal}
            onValueChange={(value) => {
              const goal = value as HansonForm["goal"]
              onPatch({
                goal,
                goalTime: HANSON_GOAL_TIME_DEFAULT[goal],
              })
            }}
          >
            <SelectTrigger id="hanson-goal" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marathon">全程马拉松 · 16 周</SelectItem>
              <SelectItem value="half">半程马拉松 · 12 周</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="hanson-goal-time">目标成绩</Label>
            <Badge variant="quality" className="text-[10px]">
              目标 {formatPace(plan.paces.marathon)} /km
            </Badge>
          </div>
          <Input
            id="hanson-goal-time"
            inputMode="numeric"
            placeholder="3:30:00"
            value={form.goalTime}
            aria-invalid={!timeValid}
            onChange={(event) => onPatch({ goalTime: event.target.value })}
            className="tabular"
          />
          {!timeValid && (
            <p className="text-destructive text-[11px]">
              {timeError ?? "请输入有效的目标成绩。"}
            </p>
          )}
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            汉森用目标配速定义所有训练强度；请选一个现实、但你愿意为之训练的目标。
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="hanson-weekly-km">当前稳定周跑量</Label>
            <span className="tabular text-sm font-medium">
              {form.weeklyKm} 公里
            </span>
          </div>
          <Slider
            id="hanson-weekly-km"
            aria-label="当前稳定周跑量（公里）"
            min={25}
            max={110}
            step={5}
            value={[form.weeklyKm]}
            onValueChange={([value]) => onPatch({ weeklyKm: value })}
          />
          <div className="text-muted-foreground flex justify-between text-[11px]">
            <span>25 公里</span>
            <span className="text-foreground/70">不是峰值，是当前水平</span>
            <span>110 公里</span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/40 rounded-lg border p-3">
            <div className="text-muted-foreground text-[10px]">计划长度</div>
            <div className="mt-1 text-sm font-semibold">
              {hansonPlanWeeks(form.goal)} 周
            </div>
          </div>
          <div className="bg-muted/40 rounded-lg border p-3">
            <div className="text-muted-foreground text-[10px]">计划峰值</div>
            <div className="mt-1 text-sm font-semibold tabular">
              {plan.peakKm} km
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex gap-2 rounded-md border px-3 py-2 text-[11px] leading-relaxed">
          <Flame className="mt-0.5 size-3.5 shrink-0" />
          <span>
            汉森是高频计划：每周 6 天、3 次 SOS。如果目前每周只跑 3–4
            天，先花 4 周把频率建立起来，再进入正式计划。
          </span>
        </div>

        <p className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-[11px] leading-relaxed">
          输入只保存在本机浏览器。计划为通用模板，不替代教练或医疗建议。
        </p>
      </CardContent>
    </Card>
  )
}
